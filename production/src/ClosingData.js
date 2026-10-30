import {displayName} from './ContractRecords.js';

export const DOCUMENT_TYPES = {
 'sales-assignment':'Incarico di mediazione per la vendita',
 'lease-assignment':'Incarico di mediazione per la locazione',
 'purchase-proposal':'Proposta di acquisto',
 'lease-proposal':'Proposta di locazione'
};
const sourceModels = {
 '/sales-assign':'Incarico di vendita', '/lease-assign':'Incarico di locazione',
 '/purchase-proposal':'Proposta di acquisto', '/lease-proposal':'Proposta di locazione',
 '/lease-contract-4-4':'Locazione 4+4', '/lease-contract-4-4-cedolare':'Locazione 4+4 con cedolare',
 '/lease-contract-concordato':'Locazione concordata', '/lease-contract-students':'Locazione studenti',
 '/lease-contract-transitorio':'Locazione transitoria'
};
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const list = value => Array.isArray(value) ? value.filter(row=>row&&typeof row==='object'&&!Array.isArray(row)) : [];
const rawText = value => typeof value === 'string' || typeof value === 'number' ? String(value) : '';
const text = value => typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
const join = (...values) => values.map(text).filter(Boolean).join(' ');
const person = value => join(displayName(value),value.cf ? '· C.F. '+value.cf : '');
const people = values => list(values).map(person).filter(Boolean).join('\n');
export const signatureNames = value => text(value).split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
export const isProposal = kind => kind === 'purchase-proposal' || kind === 'lease-proposal';

export function sourceDocuments(storage){
 const documents=[],errors=[];
 for(const [model,label] of Object.entries(sourceModels)){
  try{
   const raw=storage?.getItem('gemut.contract.draft.v1:'+model);
   if(!raw)continue;
   const value=JSON.parse(raw);
   if(value?.schema!==1||value.model!==model||!value.slots||Array.isArray(value.slots)||typeof value.slots!=='object')throw Error('Formato non riconosciuto');
   if(value.slots.document && (Array.isArray(value.slots.document)||typeof value.slots.document!=='object'))throw Error('Dati documento non riconosciuti');
   documents.push({model,label,slots:value.slots});
  }catch{errors.push(label+': bozza non leggibile; il documento originale non è stato modificato.');}
 }
 return {documents,errors};
}
export function fromSource(model,slots={}){
 const template=model==='/purchase-proposal'&&slots.purchaseTemplate&&typeof slots.purchaseTemplate==='object'&&!Array.isArray(slots.purchaseTemplate);
 const data=template?object(slots.purchaseTemplate):{...object(slots.document),...object(slots.supplement)};
 const assignment=model==='/sales-assign'||model==='/lease-assign';
 const lease=model==='/lease-proposal';
 const contract=model.startsWith('/lease-contract-');
 const kind=assignment?(model==='/sales-assign'?'sales-assignment':'lease-assignment'):(lease?'lease-proposal':'purchase-proposal');
 let clients,owners;
 if(assignment){clients=[join(data.nome,data.cf?'· C.F. '+data.cf:''),people(slots.contributors),text(data.altriConferenti)].filter(Boolean).join('\n');owners='';}
 else if(contract){clients=people(slots.tenants);owners=people(slots.landlords);}
 else if(template){
  clients=join(data.p1Nome,data.p1CF?'· C.F. '+data.p1CF:'');
  owners=join(data.vNome,data.vCF?'· C.F. '+data.vCF:'');
 }else {
  clients=people(lease?slots.proposers:slots.buyers)||people(slots.buyers)||[join(data.p1Nome,data.p1CF?'· C.F. '+data.p1CF:''),join(data.p2Nome,data.p2CF?'· C.F. '+data.p2CF:'')].filter(Boolean).join('\n');
  owners=people(slots.owners)||[join(data[lease?'locNome':'vNome'],data[lease?'locCF':'vCF']?'· C.F. '+data[lease?'locCF':'vCF']:''),text(data[lease?'loc2Nome':'v2Nome'])].filter(Boolean).join('\n');
 }
 const units=template?[]:list(slots.units);
 const address=units.length?units.map(unit=>join(unit.descrizione,unit.via,unit.numero,unit.comune,unit.piano?'piano '+unit.piano:'')).filter(Boolean).join('\n'):
  assignment?join(data.indirizzo,data.comune):lease&&text(data.immUbicazione)?text(data.immUbicazione):join(data.immVia,data.immCivico||data.immNumero,data.immComune);
 return {kind,clients,owners,address,reference:'',originalDate:text(data.dataFirma||data.placeDate||data.luogoData||data.dataContratto||data.dataStipula),proposalStatus:'unknown',sourceModel:model};
}
export function initialClosingData(){
 return {kind:'sales-assignment',clients:'',owners:'',address:'',reference:'',originalDate:'',sourceModel:'',proposalStatus:'unknown',agent:'',placeDate:'',authorization:'',returnDate:'',returnTime:'',returnPlace:'',observations:'',attachments:'',keys:[
  {id:'building',label:'Portone condominiale',quantity:'',notes:''},
  {id:'apartment',label:'Porta dell’appartamento',quantity:'',notes:''},
  {id:'garage',label:'Garage o posto auto',quantity:'',notes:''},
  {id:'cellar',label:'Cantina o altri locali',quantity:'',notes:''},
  {id:'devices',label:'Telecomandi, tessere o altri dispositivi',quantity:'',notes:''}
 ]};
}
/** A different source starts a new transaction; only the GEMÜT signatory is reusable. */
export function applySource(previous,model,slots){
 return {...initialClosingData(),...fromSource(model,slots),agent:text(previous.agent)};
}
export function normalizeClosingData(input){
 const initial=initialClosingData(),value=object(input),result={...initial};
 for(const field of Object.keys(initial))if(field!=='keys')result[field]=rawText(value[field]??initial[field]);
 result.keys=Array.isArray(value.keys)?list(value.keys).map((row,index)=>({id:text(row.id)||'key-'+index,label:rawText(row.label),quantity:rawText(row.quantity),notes:rawText(row.notes)})):initial.keys;
 return result;
}
function commonIssues(data){
 const issues=[];
 for(const [field,label] of [['clients','i nominativi del cliente'],['address','l’immobile'],['reference','il riferimento univoco al documento originario'],['originalDate','la data del documento originario'],['agent','il nome del firmatario per GEMÜT'],['placeDate','luogo e data della sottoscrizione']])if(!text(data[field]))issues.push('Indicare '+label+'.');
 return issues;
}
export function validateRelease(data){
 const issues=commonIssues(data);
 if(!DOCUMENT_TYPES[data.kind])issues.push('Selezionare un tipo di documento valido.');
 if(isProposal(data.kind)){
  if(!text(data.owners))issues.push('Indicare tutti i destinatari della proposta che devono firmare.');
  if(data.proposalStatus==='accepted')issues.push('La proposta è già accettata: occorre un diverso accordo di scioglimento.');
  else if(data.proposalStatus!=='not-accepted')issues.push('Verificare e confermare che la proposta è non accettata.');
 }
 return issues;
}
export function validateKeyReturn(data){
 const issues=commonIssues(data);
 for(const [field,label] of [['owners','il locatore'],['authorization','il riferimento all’autorizzazione del locatore'],['returnDate','la data della riconsegna'],['returnTime','l’ora della riconsegna'],['returnPlace','il luogo della riconsegna']])if(!text(data[field]))issues.push('Indicare '+label+'.');
 if(text(data.returnTime)&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(text(data.returnTime)))issues.push('Indicare un’ora valida nel formato hh:mm.');
 const keys=list(data.keys);
 if(!keys.some(row=>/^\d+$/.test(text(row.quantity))&&Number(row.quantity)>0))issues.push('Indicare almeno una chiave o un dispositivo effettivamente ricevuto.');
 for(const row of keys){
  if(text(row.quantity)&&(!/^\d+$/.test(text(row.quantity))||!Number.isSafeInteger(Number(row.quantity))))issues.push('Indicare una quantità intera e non negativa per ogni chiave.');
  if(text(row.quantity)&&!text(row.label))issues.push('Descrivere ogni chiave o dispositivo.');
 }
 return issues;
}
