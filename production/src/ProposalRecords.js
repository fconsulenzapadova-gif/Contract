import {createParty,migrateParties,updateRecord,removeRecord,moveRecord,partyGrammar,displayName} from './ContractRecords.js';
import {useContractDraft} from './ContractDraft.js';
import {usePropertyUnits} from './PropertyUnits.js';
import {recordsUI} from './ContractGlue.js';
function scalarParty(data,prefix){return createParty({nome:data[prefix+'Nome']||'',cf:data[prefix+'CF']||'',natoA:data[prefix+'NatoA']||'',natoIl:data[prefix+'NatoIl']||'',domicilioComune:data[prefix+'ResidenteA']||data[prefix+'Citta']||'',via:data[prefix+'Via']||data[prefix+'Indirizzo']||'',numero:data[prefix+'Civico']||'',telefono:data[prefix+'Tel']||'',email:data[prefix+'Email']||'',qualita:data[prefix+'Qualita']||'',societa:data[prefix+'Societa']||'',socCF:data[prefix+'SocCF']||'',socPI:data[prefix+'SocPI']||'',sede:data[prefix+'Sede']||''});}
export function useProposalRecords(React,data){
 const lease=location.pathname==='/lease-proposal',prefix=lease?'loc':'v';
 const [owners,setOwners]=useContractDraft(React,'owners',()=>[scalarParty(data,prefix),...data[prefix+'2Nome']||data[prefix+'2CF']?[scalarParty(data,prefix+'2')]:[]],migrateParties);
 const [buyers,setBuyers]=useContractDraft(React,'buyers',()=>[scalarParty(data,'p1'),...data.p2Nome||data.p2CF?[scalarParty(data,'p2')]:[]],migrateParties);
 const property=usePropertyUnits(React,data);
 return {owners,setOwners,buyers,setBuyers,property,lease};
}
function controls(React,people,setPeople,label,minimum=1){
 const h=React.createElement;
 return h('div',{className:'contract-party-controls pdf-hide'},h('button',{type:'button',className:'contract-control-btn',onClick:()=>setPeople(previous=>[...previous,createParty()])},'Aggiungi '+label),...people.map((person,index)=>h('div',{key:person.id},
  h('strong',null,label+' '+(index+1)),
  h('label',null,' Sesso ',h('select',{'aria-label':label+' '+(index+1)+': sesso','data-identity-field':'sesso','data-record-id':person.id,'data-person-label':label+' '+(index+1),value:person.sesso||'',onChange:e=>setPeople(previous=>updateRecord(previous,person.id,'sesso',e.target.value))},h('option',{value:''},'Da indicare'),h('option',{value:'M'},'Maschile'),h('option',{value:'F'},'Femminile'))),
  h('label',null,' Trattamento ',h('select',{'aria-label':label+' '+(index+1)+': trattamento',value:person.trattamento||'',onChange:e=>setPeople(previous=>updateRecord(previous,person.id,'trattamento',e.target.value))},...Object.entries({'':'Da sesso',signor:'Signor',signora:'Signora',signorina:'Signorina',neutro:'Neutro'}).map(([value,text])=>h('option',{value,key:value},text)))),
  h('button',{type:'button',disabled:people.length<=minimum,onClick:()=>setPeople(previous=>removeRecord(previous,person.id,minimum))},'Rimuovi '+label+' '+(index+1)),
  h('button',{type:'button',disabled:index===0,onClick:()=>setPeople(previous=>moveRecord(previous,person.id,-1))},'Sposta '+label+' '+(index+1)+' in alto'),
  h('button',{type:'button',disabled:index===people.length-1,onClick:()=>setPeople(previous=>moveRecord(previous,person.id,1))},'Sposta '+label+' '+(index+1)+' in basso'))));
}
export function physicalIdentityBlocks(React,people,setPeople,label,keyPrefix,minimum=1){
 const h=React.createElement;
 return [{key:keyPrefix+'-controls',node:controls(React,people,setPeople,label,minimum)},...people.map((person,index)=>{
 const title=label+' '+(index+1),grammar=partyGrammar(person);
 const f=(field,text,width='110px')=>h('input',{type:'text',name:field,'aria-label':title+': '+text,'data-identity-field':field,'data-record-id':person.id,'data-person-label':title,value:person[field]||'',className:'inline-input',style:{width},onChange:e=>setPeople(previous=>updateRecord(previous,person.id,field,e.target.value))});
 return {key:keyPrefix+'-person-'+person.id,node:h('p',{'data-party-id':person.id},h('strong',null,title),': ',grammar.prefix,' ',f('nome','nome e cognome','190px'),person.cognome&&displayName(person)!==person.nome?React.createElement(React.Fragment,null,' ',f('cognome','cognome')):null,', C.F. ',f('cf','codice fiscale','150px'),', luogo di nascita ',f('natoA','luogo di nascita','120px'),' (',f('prov','provincia di nascita','30px'),'), data di nascita ',f('natoIl','data di nascita'),', residenza ',f('domicilioComune','Comune di residenza','120px'),', via ',f('via','via','140px'),' n. ',f('numero','numero civico','40px'),', documento ',f('ci','numero documento'),', telefono ',f('telefono','telefono'),', email ',f('email','email','160px'),'.',person.qualita?' Qualità e poteri: '+person.qualita+'.':'',person.societa?' Per '+person.societa+', codice fiscale '+person.socCF+', P. IVA '+person.socPI+', sede '+person.sede+'.':'')};
 })];
}
export function personSignatureBlocks(React,people,label,keyPrefix){
 const h=React.createElement;
 return people.map((person,index)=>({key:keyPrefix+'-'+person.id,node:h('div',{className:'contract-individual-signature','data-signature-person':person.id,style:{minHeight:'16mm',marginTop:'3mm',breakInside:'avoid'}},h('strong',null,`${label} ${index+1}: ${displayName(person)||'Nome e cognome: __________________'}`),h('div',{style:{marginTop:'5mm'}},'Firma: ____________________________________'))}));
}
export function mergeProposalBlocks(React,blocks,records,proposers,setProposers){
 const h=React.createElement,output=[],ownerLabel=records.lease?'Locatore':'Venditore';
 const propertyBlocks=recordsUI(React).propertyBlocks({...records.property,includeControls:true,keyPrefix:'property-records',introText:'La proposta riguarda',pStyle:{}});
 const removed=new Set(['section-1-composizione','section-1-identificativi-intro','section-1-identificativi-main','section-1-identificativi-secondary','section-1-identificativi-garage','section-1-id-catastali-freeform']);
 for(const block of blocks){
  if(block.key==='locators'||block.key==='seller'){output.push(...physicalIdentityBlocks(React,records.owners,records.setOwners,ownerLabel,'owners'));continue;}
  if(block.key==='proponents'){output.push(...physicalIdentityBlocks(React,records.buyers,records.setBuyers,'Proponente','buyers'));continue;}
  if(block.key==='property'){const child=React.Children.toArray(block.node.props.children).at(-1);const tail=React.Children.toArray(child?.props?.children||[]).at(-1);output.push({key:'property-title',node:h('h3',null,'1) DESCRIZIONE IMMOBILE')},...propertyBlocks,{key:'property-occupation',node:tail});continue;}
  if(block.key==='section-1-header'){output.push({key:'property-title',node:h('h3',null,"1) DESCRIZIONE E STATO DELL’IMMOBILE")},...propertyBlocks);continue;}
  if(removed.has(block.key))continue;
  if(block.key==='signature'||block.key==='section-8-signature'){output.push({key:'signature-date',node:h('p',null,'Luogo e data: __________________')},...personSignatureBlocks(React,records.lease?proposers:records.buyers,'Proponente','proposal-signatures'));continue;}
  if(block.key==='acceptance'||block.key==='acceptance-main'){
   output.push({key:'acceptance',node:h(React.Fragment,null,h('h4',null,'ACCETTAZIONE DELLA PARTE '+(records.lease?'LOCATRICE':'VENDITRICE')),h('p',null,'La parte '+(records.lease?'locatrice':'venditrice')+' accetta integralmente la presente proposta alle condizioni sopra descritte.'),h('p',null,'Luogo e data: __________________'))},...personSignatureBlocks(React,records.owners,ownerLabel,'acceptance-signatures'));continue;
  }
  if(block.key==='acceptance-notice'){
   output.push({key:'acceptance-notice',node:h('p',null,'La parte proponente riceve in data _______________ comunicazione dell’accettazione della presente proposta.')},...personSignatureBlocks(React,proposers,'Proponente per ricevuta','receipt-signatures'));continue;
  }
  output.push(block);
 }
 if(records.lease&&setProposers)output.unshift({key:'proposer-edit-controls',node:controls(React,proposers,setProposers,'Proponente')});
 return output;
}
