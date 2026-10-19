/** Versioned local drafts. Stable record ids live in values, never in row positions. */
const prefix='gemut.contract.draft.v1:';
const key=path=>prefix+path;
function envelope(storage,path){
 const raw=storage?.getItem(key(path));
 if(!raw)return {schema:1,model:path,slots:{}};
 const data=JSON.parse(raw);
 if(data.schema!==1||data.model!==path||!data.slots||typeof data.slots!=='object')throw Error('Formato bozza non riconosciuto: conservare il file e verificare il modello.');
 return data;
}
export function readDraft(storage,path,slot,initial){
 const value=envelope(storage,path).slots[slot];
 const base=typeof initial==='function'?initial():initial;
 if(value===undefined)return base;
 return base&&typeof base==='object'&&!Array.isArray(base)&&value&&typeof value==='object'&&!Array.isArray(value)?{...base,...value}:value;
}
export function writeDraft(storage,path,slot,value){
 const data=envelope(storage,path);data.slots[slot]=value;data.updatedAt=new Date().toISOString();
 storage.setItem(key(path),JSON.stringify(data));
}
export function exportDraft(storage,path){return JSON.stringify(envelope(storage,path),null,2);}
export function importDraft(storage,path,text){
 const data=JSON.parse(text);
 if(data.schema!==1||data.model!==path||!data.slots||Array.isArray(data.slots)||typeof data.slots!=='object')throw Error('La bozza appartiene a un modello diverso o ha un formato non valido.');
 // Keep the previous version recoverable; unknown values are preserved in slots.
 const previous=storage.getItem(key(path));if(previous)storage.setItem(key(path)+':before-import',previous);
 storage.setItem(key(path),JSON.stringify(data));
}
export function useContractDraft(React,slot,initial,normalize=v=>v){
 const path=typeof location==='undefined'?'':location.pathname;
 const storage=typeof localStorage==='undefined'?null:localStorage;
 const [state,setState]=React.useState(()=>{
  try{return normalize(readDraft(storage,path,slot,initial));}
  catch(error){if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('contract-draft-error',{detail:error.message}));return normalize(typeof initial==='function'?initial():initial);}
 });
 const latest=React.useRef(state);
 const setValue=React.useCallback(value=>{
  const next=normalize(typeof value==='function'?value(latest.current):value);
  latest.current=next;
  if(storage)try{writeDraft(storage,path,slot,next);}catch(error){window.dispatchEvent(new CustomEvent('contract-draft-error',{detail:error.message}));}
  setState(next);
 },[path,slot]);
 React.useEffect(()=>{latest.current=state;},[state]);
 React.useEffect(()=>{if(storage)try{writeDraft(storage,path,slot,state);}catch(error){window.dispatchEvent(new CustomEvent('contract-draft-error',{detail:error.message}));}},[]);
 return [state,setValue];
}
export function createDraftTools(React){
 const h=React.createElement;
 return function DraftTools(){
  const [notice,setNotice]=React.useState('Bozza salvata su questo browser a ogni modifica.');
  React.useEffect(()=>{const error=e=>setNotice('Salvataggio non riuscito: '+e.detail);window.addEventListener('contract-draft-error',error);return()=>window.removeEventListener('contract-draft-error',error);},[]);
  return h('div',{className:'contract-draft-tools'},
   h('span',{'aria-live':'polite'},notice),
   h('button',{type:'button',className:'contract-control-btn',onClick:()=>{
    const blob=new Blob([exportDraft(localStorage,location.pathname)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='bozza-'+location.pathname.slice(1)+'.json';a.click();URL.revokeObjectURL(url);
   }},'Esporta bozza'),
   h('label',{className:'contract-control-btn'},'Importa bozza',h('input',{type:'file',accept:'.json,application/json',style:{display:'none'},onChange:async e=>{
    const file=e.target.files[0];if(!file)return;
    try{importDraft(localStorage,location.pathname,await file.text());location.reload();}catch(error){setNotice(error.message);}
   }})));
 };
}
