import {clone,recordId,validateEnvelope} from './ContractArchive.js';
import {displayName} from './ContractRecords.js';

export const MODELS={
 '/purchase-proposal':'Proposta d’acquisto','/lease-proposal':'Proposta di locazione','/sales-assign':'Incarico di mediazione','/lease-assign':'Incarico di locazione',
 '/lease-contract-4-4':'Locazione 4+4','/lease-contract-4-4-cedolare':'Locazione 4+4 cedolare','/lease-contract-concordato':'Locazione concordata','/lease-contract-students':'Locazione studenti','/lease-contract-transitorio':'Locazione transitoria',
 '/lease-allegato-b':'Allegato B','/aml':'Antiriciclaggio','/commission':'Accordo sul compenso','/visit-sheet':'Scheda visita','/property-sharing':'Condivisione immobiliare'
};
export const PERSON_KEYS=['id','nome','cognome','sesso','trattamento','natoA','prov','natoIl','cf','domicilioComune','domicilioProv','domicilioArea','residenza','domicilio','via','numero','ci','documentType','documentNumber','documentIssuer','documentIssuedOn','documentExpiresOn','telefono','email','rawName','subjectType','denominazione','entityCf','piva','sede','powers'];
export const PROPERTY_KEYS=['id','tipo','mainUnitId','descrizione','comune','via','numero','piano','mq','foglio','particella','subalterno','zc','sezione','categoria','classe','vani','rendita','catastoLegacy','reference'];
// Common facts are scalar strings. Nested imported payloads remain in the source
// archive but cannot masquerade as a name, fiscal code or other reusable fact.
const pick=(data,keys)=>Object.fromEntries(keys.filter(key=>typeof data?.[key]==='string'||typeof data?.[key]==='number'&&Number.isFinite(data[key])).map(key=>[key,String(data[key])]));
const text=value=>typeof value==='string'?value:'';
const useful=record=>Object.entries(record).some(([key,value])=>!['id','tipo','mainUnitId','rawName'].includes(key)&&text(value).trim());
const first=(...values)=>values.find(value=>typeof value==='string'&&value.trim())||'';
export function portableParty(data={},id='person'){
 const person=pick(data,PERSON_KEYS);
 // A free-form aggregated name is a single literal value; never infer or split it.
 return {...person,id:text(person.id)||id,nome:text(person.nome),rawName:text(person.rawName)||text(person.nome)};
}
export function portableProperty(data={},id='property'){return {...pick(data,PROPERTY_KEYS),id:text(data.id)||id};}
function scalarParty(data,fields,id){return portableParty(Object.fromEntries(Object.entries(fields).map(([key,field])=>[key,text(data[field])])),id);}
const assignmentFields={nome:'nome',natoA:'nascita',natoIl:'dataNascita',cf:'cf',domicilioComune:'residenza',telefono:'telefono',email:'email'};
const clientFields={nome:'name',natoA:'natoA',natoIl:'natoIl',cf:'cf',telefono:'phone',email:'email'};
const amlPhysicalFields={nome:'nome',cognome:'cognome',natoA:'natoA',natoIl:'natoIl',cf:'cf',domicilioComune:'residenza',residenza:'residenza',domicilio:'domicilio',documentType:'documentType',documentNumber:'documentNumber',documentIssuer:'documentIssuer',documentIssuedOn:'documentIssuedOn',documentExpiresOn:'documentExpiresOn',telefono:'telefono',email:'email'};
const amlEntityFields={nome:'denominazione',denominazione:'denominazione',entityCf:'entityCf',piva:'piva',sede:'sede',powers:'powers',telefono:'telefono',email:'email'};
const purchaseOwners={nome:'vNome',cf:'vCF',domicilioComune:'vCitta'};
const purchaseBuyers={nome:'p1Nome',natoIl:'p1NatoIl',cf:'p1CF',domicilioComune:'p1ResidenteA',via:'p1Via',email:'p1Email'};
const purchaseProperty={comune:'immComune',via:'immVia',numero:'immCivico',descrizione:'immComposizione',foglio:'c1F',particella:'c1M',subalterno:'c1S'};
const contractProperty={comune:'immComune',via:'immVia',numero:'immNumero',piano:'immPiano',mq:'immMq',foglio:'catFoglio',particella:'catParticella',subalterno:'catSubalterno',zc:'catZc',categoria:'catCategoria',classe:'catClasse',vani:'catVani',rendita:'catRendita'};
const legacyProposalPerson=(data,prefix)=>scalarParty(data,{nome:prefix+'Nome',cf:prefix+'CF',natoA:prefix+'NatoA',natoIl:prefix+'NatoIl',domicilioComune:prefix+'ResidenteA',via:prefix+'Via',numero:prefix+'Civico',telefono:prefix+'Tel',email:prefix+'Email'},'legacy-'+prefix);
function factFields(model){
 if(model==='/purchase-proposal')return {price:'prezzoOfferto',offerDeposit:'pag1Importo',annualRent:'canoneAnnuo',deedDeadline:'attoEntroIl',irrevocabilityDeadline:'irrevocabileFino'};
 if(model==='/lease-proposal')return {annualRent:'canoneAnnuo',securityDeposit:'cauzioneImporto',offerDeposit:'depositoImporto',startDate:'decorrenzaDal',endDate:'decorrenzaAl'};
 if(model.startsWith('/lease-contract-'))return {annualRent:'canoneAnnuo',securityDeposit:'depositoCauzionale',startDate:'durataDal',endDate:'durataAl'};
 if(model.endsWith('-assign'))return {...(model==='/lease-assign'?{monthlyRent:'prezzo'}:{price:'prezzo'}),startDate:'dal',endDate:'al'};
 return {};
}
export function modelAdapter(model){
 if(model.startsWith('/lease-contract-'))return {kind:'records',roles:[['landlords','Locatore'],['tenants','Conduttore']],property:'units',slot:'document'};
 if(model==='/lease-proposal')return {kind:'records',roles:[['owners','Locatore'],['proposers','Proponente / futuro conduttore']],property:'units',slot:'document'};
 if(model==='/purchase-proposal')return {kind:'purchase',roles:[['owners','Venditore'],['buyers','Proponente']],property:'fixed',slot:'purchaseTemplate'};
 if(model.endsWith('-assign'))return {kind:'assignment',roles:[['client','Conferente principale'],['contributors','Conferente aggiuntivo']],property:'units',slot:'document'};
 if(model==='/lease-allegato-b')return {kind:'allegato',roles:[['client','Richiedente']],property:'allegato',slot:'allegatoFields'};
 if(['/aml','/commission','/visit-sheet','/property-sharing'].includes(model))return {kind:model==='/aml'||model==='/commission'?'professional':'contact',roles:[['client',model==='/property-sharing'?'Destinatario':'Cliente / persona']],property:'summary',slot:'document'};
 throw Error('Modello senza adattatore: nessun campo sarà modificato.');
}
/** Only reusable facts leave a source. AML verification/risk/funds/PEP never enter this schema. */
export function documentFacts(envelope,{documentId}={}){
 validateEnvelope(envelope);
 const {model,slots}=envelope,adapter=modelAdapter(model),data=slots[adapter.slot]||slots.document||{},parties=[],properties=[],namespace=documentId||model;
 const scalarId=role=>text(slots.recordIds?.[role])||namespace+'-'+role;
 const add=(role,label,person)=>{if(useful(person))parties.push({id:person.id,role,label,data:person});};
 for(const [role,label] of adapter.roles){
  if(Array.isArray(slots[role])&&(adapter.kind!=='purchase'||!slots.purchaseTemplate))slots[role].forEach((person,index)=>add(role,`${label} ${index+1}`,portableParty(person,`${model}-${role}-${index}`)));
  else if(role==='client'){
   const fields=adapter.kind==='assignment'?assignmentFields:adapter.kind==='allegato'?{nome:'richiedente'}:model==='/aml'&&data.subjectType==='entity'?amlEntityFields:model==='/aml'&&(data.subjectType==='physical'||data.nome||data.cognome)?amlPhysicalFields:clientFields;
   const person=scalarParty(data,fields,scalarId('client'));
   if(model==='/aml')person.subjectType=data.subjectType||'';
   if(!person.nome)person.nome=text(data.name);
   add(role,label,person);
  }else if(adapter.kind==='purchase')add(role,label,scalarParty(data,role==='owners'?purchaseOwners:purchaseBuyers,scalarId(role)));
  else if(model==='/lease-proposal')add(role,label,{...legacyProposalPerson(data,role==='owners'?'loc':'p1'),id:scalarId(role)});
 }
 // Old aggregated additional conferents survive as one raw record, without guessing people.
 if(adapter.kind==='assignment'&&text(data.altriConferenti).trim())add('contributors','Altri conferenti · testo originale',portableParty({nome:data.altriConferenti},model+'-aggregated'));
 if(Array.isArray(slots.units)&&(adapter.kind!=='purchase'||!slots.purchaseTemplate))slots.units.forEach((unit,index)=>{const value=portableProperty(unit,model+'-unit-'+index);if(useful(value))properties.push({id:value.id,data:value});});
 else if(adapter.kind==='allegato'){
  for(let index=1;index<=3;index++){
   const unit=portableProperty({comune:data[`cat${index}Comune`],foglio:data[`cat${index}Foglio`],particella:data[`cat${index}Particella`],subalterno:data[`cat${index}Subalterno`],via:index===1?data.indirizzoAlloggio:''},text(slots.recordIds?.['property'+index])||namespace+'-unit-'+index);
   if(useful(unit))properties.push({id:unit.id,data:unit});
  }
 }else{
  const map=adapter.kind==='purchase'?purchaseProperty:model==='/lease-proposal'?{via:'immUbicazione',descrizione:'immComposizione',foglio:'foglio',particella:'part',subalterno:'sub',zc:'zc',categoria:'cat',classe:'classe',vani:'consVani',rendita:'rendita',catastoLegacy:'idCatastali'}:adapter.kind==='assignment'?{comune:'comune',via:'indirizzo',descrizione:'pertinenze',catastoLegacy:'catasto'}:adapter.kind==='contact'?{via:'address',reference:'reference'}:contractProperty;
  const unit=portableProperty(Object.fromEntries(Object.entries(map).map(([key,field])=>[key,text(data[field])])),scalarId('property'));
  if(useful(unit))properties.push({id:unit.id,data:unit});
 }
 const facts=Object.fromEntries(Object.entries(factFields(model)).map(([key,field])=>[key,text(data[field])]));
 return {format:'contrax.document-facts',schema:1,model,parties,properties,facts};
}
export function encodeParty(person){return JSON.stringify({format:'contrax.party',schema:1,party:portableParty(person,recordId('person'))},null,2);}
export function decodeParty(raw){
 const data=JSON.parse(raw);
 if(data?.format!=='contrax.party'||data.schema!==1||!data.party||typeof data.party!=='object'||Array.isArray(data.party)||!text(data.party.nome).trim())throw Error('Dati non riconosciuti. Incollare una singola anagrafica Contrax (versione 1).');
 for(const key of PERSON_KEYS)if(data.party[key]!==undefined&&typeof data.party[key]!=='string')throw Error('Anagrafica non valida: nessun dato è stato modificato.');
 return portableParty(data.party,recordId('person'));
}
export const propertyLabel=unit=>[unit.comune,unit.via,unit.numero].filter(Boolean).join(' · ')||[unit.foglio&&'Fg. '+unit.foglio,unit.particella&&'part. '+unit.particella,unit.subalterno&&'sub. '+unit.subalterno].filter(Boolean).join(' ')||unit.descrizione||'Immobile';
export const personLabel=person=>displayName(person)||'Persona senza nome';
const fieldLabels={nome:'Nome / testo originale',cognome:'Cognome',sesso:'Sesso',natoA:'Luogo di nascita',prov:'Provincia di nascita',natoIl:'Data di nascita',cf:'Codice fiscale',domicilioComune:'Residenza',via:'Via / indirizzo',numero:'Numero',telefono:'Telefono',email:'Email',ci:'Documento',comune:'Comune',foglio:'Foglio',particella:'Particella',subalterno:'Subalterno',annualRent:'Canone annuo',price:'Prezzo',securityDeposit:'Deposito cauzionale',offerDeposit:'Deposito della proposta',startDate:'Inizio',endDate:'Termine'};
function identitySummary(person){return [person.natoA&&'Nascita: '+person.natoA,person.natoIl,person.cf&&'C.F.: '+person.cf,[person.domicilioComune,person.via,person.numero].filter(Boolean).join(', ')].filter(Boolean).join(' · ');}
function changed(before,after,label,path,operations){
 if(JSON.stringify(before)===JSON.stringify(after))return;
 operations.push({label,path,previous:before??'',value:after,replacement:before!==undefined&&before!==''&&before!==null});
}
function patchObject(target,patch,path,label,operations){
 for(const [key,value] of Object.entries(patch)){
  if(['id','rawName'].includes(key)||value===''||value===undefined)continue;
  changed(target[key],value,`${label} · ${fieldLabels[key]||key}`,[...path,key],operations);target[key]=value;
 }
}
/** Build only a preview. Caller must confirm and check that the original draft is still current. */
export function planDocumentImport(envelope,source,{parties=[],properties=[],includeFacts=false}={}){
 validateEnvelope(envelope);
 if(source?.schema!==1||source.format!=='contrax.document-facts')throw Error('Sorgente di interoperabilità non valida.');
 const adapter=modelAdapter(envelope.model),next=clone(envelope),operations=[],slots=next.slots;
 const data=slots[adapter.slot]||(slots[adapter.slot]={}),scalarRoles=new Set();
 for(const mapping of parties){
  const sourcePerson=source.parties.find(person=>person.id===mapping.sourceId);
  const role=adapter.roles.find(([key])=>key===mapping.role);
  if(!sourcePerson||!role)throw Error('Selezionare una persona e un ruolo compatibili.');
  const person=portableParty(sourcePerson.data,sourcePerson.id),label=role[1];
  const arrayRole=adapter.kind==='records'||mapping.role==='contributors';
  if(arrayRole){
   const list=slots[mapping.role]||(slots[mapping.role]=[]);
   if(!Array.isArray(list))throw Error('Elenco destinatario non valido: importazione interrotta.');
   const index=mapping.targetId&&mapping.targetId!=='new'?list.findIndex(row=>row.id===mapping.targetId):-1;
   if(mapping.targetId&&mapping.targetId!=='new'&&index<0)throw Error('Persona destinataria non più presente. Ripetere il confronto.');
   if(index<0){
    const id=list.some(row=>row.id===person.id)?recordId('person'):person.id;
    list.push({...person,id});changed('',personLabel(person),label+' · nuova anagrafica',[mapping.role,list.length-1],operations);
   }else patchObject(list[index],person,[mapping.role,index],label,operations);
  }else{
   if(scalarRoles.has(mapping.role))throw Error('Questo ruolo ha uno spazio per una sola persona. Scegliere una persona per ruolo.');
   scalarRoles.add(mapping.role);
   if(slots.recordIds!==undefined&&(!slots.recordIds||typeof slots.recordIds!=='object'||Array.isArray(slots.recordIds)))throw Error('Identificativi destinatari non validi: nessun dato è stato modificato.');
   (slots.recordIds||(slots.recordIds={}))[mapping.role]=person.id;
   const fields=adapter.kind==='assignment'?assignmentFields:adapter.kind==='purchase'?(mapping.role==='owners'?purchaseOwners:purchaseBuyers):adapter.kind==='allegato'?{nome:'richiedente'}:envelope.model==='/aml'?(person.subjectType==='entity'?amlEntityFields:amlPhysicalFields):clientFields;
   const values={...person,nome:envelope.model==='/aml'?person.nome:personLabel(person)};
   if(envelope.model==='/aml'&&!values.residenza)values.residenza=person.domicilioComune||'';
   if(adapter.kind==='purchase'&&mapping.role==='buyers')values.via=[person.via,person.numero].filter(Boolean).join(' ');
   patchObject(data,Object.fromEntries(Object.entries(fields).map(([key,field])=>[field,values[key]||''])),[adapter.slot],label,operations);
   if(adapter.kind==='professional'){
    const aml=envelope.model==='/aml';
    patchObject(data,{...(!aml||!data.identity?{identity:identitySummary(person)}:{}),...(person.ci&&(!aml||!data.id)?{id:person.ci}:{})},[adapter.slot],label,operations);
    if(aml)patchObject(data,{...(!data.name?{name:personLabel(person)}:{}),subjectType:person.subjectType==='entity'?'entity':'physical'},[adapter.slot],label,operations);
   }
  }
 }
 const selected=properties.map(id=>source.properties.find(unit=>unit.id===id));
 if(selected.some(unit=>!unit))throw Error('Immobile sorgente non trovato.');
 if(adapter.property==='units')for(const item of selected){
  const unit=portableProperty(item.data,item.id),list=slots.units||(slots.units=[]);
  if(!Array.isArray(list))throw Error('Elenco immobili destinatario non valido.');
  // Match the stable source ID, otherwise append; never match by position or address.
  const index=list.findIndex(row=>row.id===unit.id);
  if(index>=0)patchObject(list[index],unit,['units',index],'Immobile',operations);
  else{list.push({...unit,tipo:unit.tipo||'principale'});changed('',propertyLabel(unit),'Nuova unità immobiliare',['units',list.length-1],operations);}
 }
 else if(selected.length){
  if(adapter.property==='fixed'&&selected.length>1)throw Error('La proposta esatta contiene un solo immobile. Sceglierne uno.');
  if(adapter.property==='fixed'){
   (slots.recordIds||(slots.recordIds={})).property=selected[0].id;
   patchObject(data,Object.fromEntries(Object.entries(purchaseProperty).map(([key,field])=>[field,selected[0].data[key]||''])),[adapter.slot],'Immobile',operations);
  }
  else if(adapter.property==='allegato'){
   if(selected.length>3)throw Error('Allegato B contiene tre righe catastali. Scegliere al massimo tre immobili.');
   selected.forEach(({id,data:unit},index)=>{(slots.recordIds||(slots.recordIds={}))['property'+(index+1)]=id;patchObject(data,{[`cat${index+1}Comune`]:unit.comune||'',[`cat${index+1}Foglio`]:unit.foglio||'',[`cat${index+1}Particella`]:unit.particella||'',[`cat${index+1}Subalterno`]:unit.subalterno||'',...(index===0?{indirizzoAlloggio:[unit.via,unit.numero].filter(Boolean).join(' ')}:{})},[adapter.slot],'Immobile '+(index+1),operations);});
  }else{
   const address=selected.map(item=>propertyLabel(item.data)).join('\n');
   const patch=adapter.kind==='professional'?{operation:address}:{address,reference:selected.map(item=>item.data.reference||'').filter(Boolean).join(' · ')};
   if(selected.length===1)(slots.recordIds||(slots.recordIds={})).property=selected[0].id;
   patchObject(data,patch,[adapter.slot],'Immobile',operations);
  }
 }
 if(includeFacts){
  const fields=factFields(envelope.model);
  patchObject(data,Object.fromEntries(Object.entries(fields).map(([key,field])=>[field,text(source.facts[key])])),[adapter.slot],'Dati economici e date',operations);
 }
 return {envelope:next,operations,sourceModel:source.model,targetModel:envelope.model};
}
/** Callback adapter for a visible party; no automatic inference or clipboard writes. */
export function planPartyCallbacks(target,person){
 const aliases={fullName:personLabel(person),givenNames:person.nome,surname:person.cognome,birthPlace:person.natoA,birthProvince:person.prov,birthDate:person.natoIl,taxCode:person.cf,residence:person.domicilioComune,documentNumber:person.ci,sex:person.sesso,identitySummary:identitySummary(person)};
 return Object.entries(target?.fields||{}).flatMap(([key,field])=>{
  let value=aliases[key];if(typeof value!=='string'||!value||value===field.value)return [];
  if(key==='birthDate'&&field.props.type==='date'&&/^\d{2}\/\d{2}\/\d{4}$/.test(value))value=value.split('/').reverse().join('-');
  if(key==='birthDate'&&field.props.type!=='date'&&/^\d{4}-\d{2}-\d{2}$/.test(value))value=value.split('-').reverse().join('/');
  return [{key,label:field.label,value,previous:field.value,replacement:Boolean(field.value.trim()),props:field.props}];
 });
}
