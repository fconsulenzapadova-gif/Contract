import {draftKey,readEnvelope,validateEnvelope,preserveUnknown,syncActiveDocument,replaceDraft,customerEnvelope,ensureEnvelopeRecordIds} from './ContractArchive.js';
/** Versioned local working drafts. Stable record IDs live in values, never in row positions. */
let lastError='';
const recordSlots=new Set(['tenants','landlords','units','owners','buyers','proposers','contributors','representatives','beneficialOwners']);
export const draftError=()=>lastError;
export function reportDraftError(error){
 lastError=error?.message||String(error);
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('contract-draft-error',{detail:lastError}));
}
function changed(){
 lastError='';
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('contract-draft-saved'));
}
export function readDraft(storage,path,slot,initial){
 const base=typeof initial==='function'?initial():initial;
 if(!storage)return base;
 const value=readEnvelope(storage,path).slots[slot];
 if(value===undefined)return base;
 return base&&typeof base==='object'&&!Array.isArray(base)&&value&&typeof value==='object'&&!Array.isArray(value)?{...base,...value}:value;
}
export function writeDraft(storage,path,slot,value){
 const before=storage.getItem(draftKey(path)),data=ensureEnvelopeRecordIds(readEnvelope(storage,path));
 data.slots[slot]=value;data.updatedAt=new Date().toISOString();
 storage.setItem(draftKey(path),JSON.stringify(data));
 try{syncActiveDocument(storage,path,data);}
 catch(error){
  try{if(before===null)storage.removeItem(draftKey(path));else storage.setItem(draftKey(path),before);}catch(rollback){throw Error('Salvataggio interrotto; esportare il recupero locale. '+error.message+' '+rollback.message);}
  throw error;
 }
 return data;
}
export function exportDraft(storage,path,{includeInternal=false}={}){const data=readEnvelope(storage,path);return JSON.stringify(includeInternal?data:customerEnvelope(data),null,2);}
export function importDraft(storage,path,text){
 const data=validateEnvelope(JSON.parse(text),path);
 const previous=storage.getItem(draftKey(path));
 // Preserve the established recovery key as well as archive recovery history.
 if(previous)storage.setItem(draftKey(path)+':before-import',previous);
 replaceDraft(storage,path,data);
}
export function useContractDraft(React,slot,initial,normalize=value=>value){
 const path=typeof location==='undefined'?'':location.pathname;
 let storage;try{storage=typeof localStorage==='undefined'?null:localStorage;}catch(error){reportDraftError(error);storage=null;}
 const persisted=React.useRef(undefined),failed=React.useRef(false);
 const [state,setState]=React.useState(()=>{
  try{
   const raw=storage?readEnvelope(storage,path).slots[slot]:undefined;
   persisted.current=JSON.stringify(raw);
   const value=readDraft(storage,path,slot,initial);
   return preserveUnknown(value,normalize(value));
  }catch(error){failed.current=true;reportDraftError(error);return normalize(typeof initial==='function'?initial():initial);}
 });
 const latest=React.useRef(state);
 const setValue=React.useCallback(value=>{
  if(failed.current){reportDraftError(Error('Bozza non leggibile: esportare il recupero prima di ripristinare una copia. Nessun dato è stato sovrascritto.'));return false;}
  const input=typeof value==='function'?value(latest.current):value,next=preserveUnknown(input,normalize(input));
  if(JSON.stringify(next)===JSON.stringify(latest.current))return true;
  try{
   if(!storage)throw Error('Memoria locale non disponibile. Modifica non salvata.');
   const current=JSON.stringify(readEnvelope(storage,path).slots[slot]);
   if(current!==persisted.current)throw Error('Il documento è cambiato in un’altra scheda. Ricaricare prima di modificare; nessun dato è stato sovrascritto.');
   writeDraft(storage,path,slot,next);
   persisted.current=JSON.stringify(next);latest.current=next;setState(next);changed();return true;
  }catch(error){reportDraftError(error);return false;}
 },[path,slot,storage]);
 React.useEffect(()=>{latest.current=state;},[state]);
 React.useEffect(()=>{
  if(failed.current||!storage)return;
  try{
   const current=readEnvelope(storage,path).slots[slot];
   if(current===undefined){writeDraft(storage,path,slot,latest.current);persisted.current=JSON.stringify(latest.current);changed();}
   else if(recordSlots.has(slot)&&Array.isArray(current)&&Array.isArray(latest.current)){
    const seen=new Set();
    const needsIds=current.some(row=>{const invalid=!row?.id||seen.has(row.id);seen.add(row?.id);return invalid;});
    if(needsIds){
     const backup=draftKey(path)+':before-record-ids';
     if(!storage.getItem(backup))storage.setItem(backup,storage.getItem(draftKey(path)));
     const migrated=current.map((row,index)=>({...row,id:latest.current[index]?.id||row?.id}));
     writeDraft(storage,path,slot,migrated);persisted.current=JSON.stringify(migrated);changed();
    }else if(JSON.stringify(current)===JSON.stringify(latest.current))persisted.current=JSON.stringify(current);
   }else if(JSON.stringify(current)===JSON.stringify(latest.current))persisted.current=JSON.stringify(current);
   // Existing data is never rewritten on mount: a future normalizer may know fewer fields.
  }catch(error){failed.current=true;reportDraftError(error);}
 },[path,slot,storage]);
 return [state,setValue];
}
export function createDraftTools(React){
 const h=React.createElement;
 return function DraftTools(){
  const [notice,setNotice]=React.useState(()=>draftError()?'Salvataggio non riuscito: '+draftError():'Bozza salvata su questo browser a ogni modifica.');
  const [pending,setPending]=React.useState(null);
  React.useEffect(()=>{
   const error=event=>setNotice('Salvataggio non riuscito: '+event.detail),saved=()=>setNotice('Bozza salvata su questo browser a ogni modifica.');
   window.addEventListener('contract-draft-error',error);window.addEventListener('contract-draft-saved',saved);
   return()=>{window.removeEventListener('contract-draft-error',error);window.removeEventListener('contract-draft-saved',saved);};
  },[]);
  return h('div',{className:'contract-draft-tools'},
   h('span',{'aria-live':'polite'},notice),
   h('button',{type:'button',className:'contract-control-btn',onClick:()=>{
    try{const blob=new Blob([exportDraft(localStorage,location.pathname)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='bozza-'+location.pathname.slice(1)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){setNotice(error.message);}
   }},'Esporta bozza'),
   h('label',{className:'contract-control-btn'},'Importa bozza',h('input',{type:'file',accept:'.json,application/json',style:{display:'none'},onChange:async event=>{
    const file=event.target.files[0];if(!file)return;
    try{const text=await file.text();validateEnvelope(JSON.parse(text),location.pathname);setPending({text,name:file.name,previous:localStorage.getItem(draftKey(location.pathname))});}catch(error){setNotice(error.message);}event.target.value='';
   }})),
   location.pathname==='/aml'&&h('span',null,'Esportazione normale: soli dati della copia cliente. I dati riservati e precedenti non riconosciuti restano nel fascicolo interno.'),
   location.pathname==='/aml'&&h('button',{type:'button',className:'contract-control-btn',onClick:()=>{
    try{const blob=new Blob([exportDraft(localStorage,location.pathname,{includeInternal:true})],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='contrax-fascicolo-interno-aml.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Fascicolo interno esportato su richiesta: include la sezione riservata.');}catch(error){setNotice(error.message);}
   }},'Esporta fascicolo interno'),
   pending&&h('div',{className:'contract-draft-confirm',role:'group','aria-label':'Conferma importazione bozza'},h('p',null,`“${pending.name}” sostituirà tutti i dati della bozza corrente. Il contenuto precedente resterà nel recupero locale.`),
    h('button',{type:'button',onClick:()=>{
     try{if(localStorage.getItem(draftKey(location.pathname))!==pending.previous)throw Error('La bozza è cambiata: selezionare di nuovo il file.');importDraft(localStorage,location.pathname,pending.text);location.reload();}catch(error){setNotice(error.message);}
    }},'Conferma sostituzione bozza'),h('button',{type:'button',onClick:()=>setPending(null)},'Annulla')));
 };
}
