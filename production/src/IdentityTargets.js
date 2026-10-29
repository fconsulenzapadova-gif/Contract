/** Adapters use the real React field callbacks, keeping state and printed values in sync. */
const aliases={nome:'fullName',name:'fullName',nascita:'birthPlace',natoA:'birthPlace',dataNascita:'birthDate',natoIl:'birthDate',cf:'taxCode',CF:'taxCode',cognome:'surname',sesso:'sex',prov:'birthProvince',residenza:'residence',domicilio:'domicile',domicilioComune:'residence',residA:'residence',ci:'documentNumber',docNum:'documentNumber'};
const partyAliases={Nome:'fullName',NatoA:'birthPlace',NatoIl:'birthDate',CF:'taxCode',ResidenteA:'residence',Citta:'residence'};
const partyLabels={p1:'Proponente 1',p2:'Proponente 2',v:'Venditore 1',v2:'Venditore 2',loc:'Locatore 1',loc2:'Locatore 2'};
const proposerAliases={...aliases,nome:'givenNames',cognome:'surname',docIdentita:'documentNumber',residenzaComune:'residence'};
function visit(node,callback){
 if(Array.isArray(node)){node.forEach(n=>visit(n,callback));return;}
 if(!node||typeof node!=='object'||!node.props)return;
 if(['input','textarea','select'].includes(node.type)){callback(node);return;}
 visit(node.props.children,callback);
}
export function collectTargets(preview,path=''){
 if(Array.isArray(preview?.props?.identityTargets))return preview.props.identityTargets;
 if(path==='/lease-allegato-b')return [];
 const groups=new Map();
 const add=(id,label,key,node)=>{if(!groups.has(id))groups.set(id,{id,label,fields:{}});groups.get(id).recordId ||= node.props['data-record-id'];groups.get(id).fields[key]={props:node.props,value:String(node.props.value||''),label:node.props['aria-label']||key};};
 for(const block of preview?.props?.blocks||[]){
  const party=/((?:condutt|locat)[a-z]*)-party-(\d+)/i.exec(block.key||'');
  const proposer=/^proposer-(\d+)$/.exec(block.key||'');
  visit(block.node,node=>{
   const props=node.props;if(typeof props.onChange!=='function')return;
   const name=props.name||props['data-identity-field'];
   if(proposer&&/^Sesso \d+$/.test(props['aria-label']||'')){add(block.key,'Proponente '+(Number(proposer[1])+1),'sex',node);return;}
   if(props['data-person-label'] && props['data-record-id'] && aliases[name]){add('person-'+props['data-record-id'],props['data-person-label'],aliases[name],node);return;}
   if(proposer&&proposerAliases[name]){add(block.key,'Proponente '+(Number(proposer[1])+1),proposerAliases[name],node);return;}
   if(party&&aliases[name]){add(block.key,(party[1].startsWith('condutt')?'Conduttore ':'Locatore ')+(Number(party[2])+1),aliases[name],node);return;}
   const prefix=typeof name==='string'&&name.match(/^(p[12]|v2?|loc2?)(Nome|NatoA|NatoIl|CF|ResidenteA|Citta)$/);
   if(prefix){add(prefix[1],partyLabels[prefix[1]],partyAliases[prefix[2]],node);return;}
   if(path==='/aml'&&name==='nome'){add('client','Cliente','givenNames',node);return;}
   const aria=props['aria-label']||'';
   if(aria==='Cliente: nome e cognome / denominazione')add('client','Cliente','fullName',node);
   else if(aria==='Nascita, codice fiscale / P. IVA, residenza / sede')add('client','Cliente','identitySummary',node);
   else if(aria.startsWith('Documento: tipo, numero, autorità'))add('client','Cliente','documentSummary',node);
   else if(!party&&aliases[name])add('client',path==='/visit-sheet'?'La persona che visita':'Conferente / cliente',aliases[name],node);
  });
 }
 for(const group of groups.values())if(group.fields.givenNames&&group.fields.surname)delete group.fields.fullName;
 return [...groups.values()].filter(g=>g.fields.fullName||(g.fields.givenNames&&g.fields.surname));
}
const accepted=(fields,key)=>fields[key]?.confirmed&&fields[key]?.value&&fields[key]?.status!=='inconsistent'?String(fields[key].value).trim():'';
const displayDate=iso=>/^\d{4}-\d{2}-\d{2}$/.test(iso)?`${iso.slice(8,10)}/${iso.slice(5,7)}/${iso.slice(0,4)}`:iso;
export function planImport(target,fields,kind='card'){
 if(!target)return [];
 const name=accepted(fields,'givenNames'),surname=accepted(fields,'surname');
 const values={fullName:name&&surname?`${name} ${surname}`:'',givenNames:name,surname,birthPlace:accepted(fields,'birthPlace'),birthDate:accepted(fields,'birthDate'),taxCode:accepted(fields,'taxCode'),residence:accepted(fields,'residence'),documentNumber:accepted(fields,'documentNumber')};
 values.identitySummary=[values.birthPlace&&`Luogo di nascita: ${values.birthPlace}`,values.birthDate&&`Data di nascita: ${displayDate(values.birthDate)}`,values.taxCode&&`Codice fiscale: ${values.taxCode}`,values.residence&&`Residenza: ${values.residence}`].filter(Boolean).join('\n');
 const doc=values.documentNumber;
 values.documentSummary=doc?[`${{card:'Carta d’identità',licence:'Patente',passport:'Passaporto'}[kind]} n. ${doc}`,accepted(fields,'issuer')&&`Rilasciato da: ${accepted(fields,'issuer')}`,accepted(fields,'issueDate')&&`Rilascio: ${displayDate(accepted(fields,'issueDate'))}`,accepted(fields,'expiryDate')&&`Scadenza: ${displayDate(accepted(fields,'expiryDate'))}`].filter(Boolean).join('\n'):'';
 return Object.entries(target.fields).flatMap(([key,field])=>{
  let value=values[key]||'';if(key==='birthDate'&&field.props.type!=='date')value=displayDate(value);
  if(!value||value===field.value)return [];
  return [{key,label:field.label,value,previous:field.value,replacement:Boolean(field.value.trim()),props:field.props}];
 });
}
export function applyImport(operations,allowReplacement=false){
 if(operations.some(op=>op.replacement)&&!allowReplacement)throw new Error('Confermare la sostituzione dei dati già compilati.');
 if(operations.some(op=>typeof op.props.onChange!=='function'))throw new Error('Il modulo è cambiato: ripetere la selezione.');
 for(const op of operations){const target={name:op.props.name,value:op.value,type:op.props.type||'text',checked:false};op.props.onChange({target,currentTarget:target,identityImport:true});}
 return operations.length;
}

/** Scalar roles point to the persisted person, so fiscal provenance cannot follow an old role occupant. */
export function bindIdentityRecordIds(targets,ids={}){
 const roles={client:'client','sharing-recipient':'client','purchase-seller':'owners','purchase-proposer':'buyers',v:'owners',p1:'buyers'};
 return targets.map(target=>{const id=ids[roles[target.id]];return typeof id==='string'&&id?{...target,recordId:id}:target;});
}
