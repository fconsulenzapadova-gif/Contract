import {IDENTITY_FIELDS, STATUS_LABELS, extractIdentity, reviewFields, validateField, isExpired} from './IdentityData.js';
import {readIdentityFiles, validateFiles} from './IdentityFiles.js';
import {collectTargets, planImport, applyImport} from './IdentityTargets.js';

const components=new WeakMap();
export function identityHeader(React,preview,headerAside){
 if(globalThis.location?.pathname==='/lease-allegato-b')return headerAside;
 if(!components.has(React))components.set(React,createIdentityReader(React));
 return React.createElement(components.get(React),{preview,headerAside});
}

export function createIdentityReader(React){
 const h=React.createElement;
 return function IdentityReader({preview,headerAside}){
  const dialog=React.useRef(null),controller=React.useRef(null),generation=React.useRef(0);
  const [open,setOpen]=React.useState(false),[files,setFiles]=React.useState([]),[kind,setKind]=React.useState('card');
  const [pages,setPages]=React.useState([]),[fields,setFields]=React.useState(null),[warnings,setWarnings]=React.useState([]);
  const [pageIndex,setPageIndex]=React.useState(0),[reading,setReading]=React.useState(false),[progress,setProgress]=React.useState('');
  const [sourceKey,setSourceKey]=React.useState('');
  const [error,setError]=React.useState(''),[targetId,setTargetId]=React.useState(''),[replace,setReplace]=React.useState(false),[success,setSuccess]=React.useState('');
  const targets=collectTargets(preview,globalThis.location?.pathname||'');
  const target=targets.find(t=>t.id===targetId),operations=fields?planImport(target,fields,kind):[];
  const replacements=operations.some(op=>op.replacement);
  const liveWarnings=[...warnings,...(isExpired(fields)?['Documento scaduto: verificare la disponibilità di un documento in corso di validità.']:[])];
  const signature=JSON.stringify(operations.map(op=>[op.key,op.value,op.previous]));
  React.useEffect(()=>setReplace(false),[signature,targetId]);
  const discard=()=>{generation.current++;controller.current?.abort();controller.current=null;const input=dialog.current?.querySelector('input[type="file"]');if(input)input.value='';setReading(false);setFiles([]);setPages([]);setFields(null);setSourceKey('');setWarnings([]);setProgress('');setError('');setTargetId('');setReplace(false);};
  const close=()=>{discard();setOpen(false);};
  React.useEffect(()=>{const el=dialog.current;if(open&&!el.open)el.showModal();else if(!open&&el.open)el.close();},[open]);
  React.useEffect(()=>()=>{generation.current++;controller.current?.abort();},[]);
  React.useEffect(()=>{if(sourceKey)dialog.current?.querySelector('.identity-preview')?.scrollIntoView({block:'nearest'});},[sourceKey,pageIndex]);
  const resetResult=()=>{setFields(null);setPages([]);setSourceKey('');setWarnings([]);setProgress('');setReplace(false);};
  async function read(){
   const invalid=validateFiles(files);if(invalid){setError(invalid);return;}
   const token=++generation.current;controller.current?.abort();const abort=new AbortController();controller.current=abort;
   resetResult();setError('');setReading(true);setProgress('Preparazione del lettore locale…');
   try{
    const result=await readIdentityFiles(files,{signal:abort.signal,onProgress:text=>{if(generation.current===token)setProgress(text);}});
    if(generation.current!==token)return;
    const extracted=extractIdentity(result,kind);setPages(result);setPageIndex(0);setFields(extracted.fields);setWarnings(extracted.warnings);setProgress('Lettura completata. Verificare e confermare i campi.');
   }catch(e){if(generation.current===token&&e.name!=='AbortError')setError(e.message||'Lettura non riuscita. Provare un altro file.');}
   finally{if(generation.current===token){setReading(false);controller.current=null;}}
  }
  function edit(key,value){
   setFields(previous=>{const message=validateField(key,value);return reviewFields({...previous,[key]:{...previous[key],value,bbox:null,source:null,confirmed:false,status:message?'inconsistent':value?'manual':'missing',message:message||'Valore modificato: confrontare con il documento e confermare.'}});});
  }
  function showSource(key,field=fields[key]){setSourceKey(key);if(field.page)setPageIndex(field.page-1);}
  function choose(key,candidate){setFields(previous=>reviewFields({...previous,[key]:{...previous[key],...candidate,status:candidate.error?'inconsistent':'manual',message:candidate.error||'Valore selezionato: confrontare con il documento e confermare.',confirmed:false}}));showSource(key,candidate);}
  function verifyChosen(key){setFields(previous=>reviewFields({...previous,[key]:{...previous[key],status:'manual',message:'Valore verificato sul documento. Confermare per inserirlo.',confirmed:false}}));}
  function importValues(){
   try{const current=planImport(target,fields,kind);if(!current.length)return;const count=applyImport(current,replace);setSuccess(`Inseriti ${count} campi in ${target.label}.`);close();}catch(e){setError(e.message);}
  }
  async function copy(){
   const text=IDENTITY_FIELDS.filter(([key])=>fields[key].confirmed).map(([key,label])=>`${label}: ${fields[key].value}`).join('\n');
   try{await navigator.clipboard.writeText(text);setProgress('Dati confermati copiati.');}catch{setError('Copia non disponibile: selezionare e copiare manualmente i valori.');}
  }
  const fieldViews=fields&&IDENTITY_FIELDS.map(([key,label])=>{
   const field=fields[key],date=['birthDate','issueDate','expiryDate'].includes(key);
   const blocked=!field.value||field.status==='inconsistent';
   return h('div',{className:`identity-field identity-${field.status}`,key},
    h('div',{className:'identity-field-top'},h('label',{htmlFor:`identity-${key}`},label),h('span',{className:'identity-badge'},STATUS_LABELS[field.status])),
    h('input',{id:`identity-${key}`,type:date?'date':'text',value:field.value,onChange:e=>edit(key,e.target.value),maxLength:180,autoComplete:'off','aria-describedby':`identity-help-${key}`}),
    h('p',{id:`identity-help-${key}`,className:'identity-field-help'},field.message,field.page?` · Pagina ${field.page}`:''),
    field.bbox&&h('button',{type:'button',className:'identity-link',onClick:()=>showSource(key),'aria-label':`Mostra ${label} nel documento`},'Mostra il dato nel documento'),
    field.alternatives?.length>1&&h('div',{className:'identity-alternatives'},h('p',null,'Scegli il valore corretto dopo il confronto:'),...field.alternatives.map((candidate,i)=>h('button',{type:'button',className:'identity-secondary',key:i,onClick:()=>choose(key,candidate)},candidate.value,` · Pagina ${candidate.page}`))),
    field.status==='inconsistent'&&!validateField(key,field.value)&&h('button',{type:'button',className:'identity-link',onClick:()=>verifyChosen(key)},'Ho verificato questo valore'),
    h('label',{className:'identity-confirm'},h('input',{type:'checkbox',checked:field.confirmed,disabled:blocked,'aria-label':`Conferma ${label}`,onChange:e=>{const checked=e.target.checked;setFields(previous=>({...previous,[key]:{...previous[key],confirmed:checked}}));}}),'Confermo il valore confrontato con il documento'));
  });
  return h('div',{className:'identity-header pdf-hide'},headerAside,
   h('div',{className:'identity-header-actions'},h('button',{type:'button',className:'identity-launch',onClick:()=>{discard();setSuccess('');setOpen(true);}},'Leggi documento'),success&&h('span',{className:'identity-feedback',role:'status'},success)),
   h('dialog',{ref:dialog,className:'identity-dialog',onCancel:e=>{e.preventDefault();close();},onClose:()=>{if(open)close();},'aria-labelledby':'identity-title'},
    h('div',{className:'identity-dialog-head'},h('div',null,h('p',{className:'identity-eyebrow'},'COMPILAZIONE ASSISTITA'),h('h2',{id:'identity-title'},'Leggi documento di identità'),h('p',null,'PDF e immagini elaborati sul dispositivo. Nessun invio a servizi esterni.')),h('button',{type:'button',className:'identity-close',onClick:close,'aria-label':'Chiudi e cancella i dati del documento'},'Chiudi e cancella')),
    h('div',{className:'identity-dialog-body'},
     h('section',{className:'identity-upload','aria-label':'Caricamento documento'},
      h('label',null,'Tipo di documento',h('select',{value:kind,disabled:reading,'aria-label':'Tipo di documento',onChange:e=>{setKind(e.target.value);resetResult();setError('');}},h('option',{value:'card'},'Carta d’identità'),h('option',{value:'licence'},'Patente'),h('option',{value:'passport'},'Passaporto'))),
      h('label',{className:'identity-file-label'},'PDF o immagini del documento',h('input',{type:'file',multiple:true,disabled:reading,accept:'.pdf,.jpg,.jpeg,.png,.webp,.bmp,.gif,.avif,application/pdf,image/jpeg,image/png,image/webp,image/bmp,image/gif,image/avif','aria-label':'PDF o immagini del documento',onChange:e=>{const next=Array.from(e.target.files||[]);setFiles(next);resetResult();setError(validateFiles(next));}})),
      h('p',{className:'identity-hint'},'Carica fronte e retro, oppure le pagine del PDF. JPG, PNG, WebP o PDF · massimo 4 file, 10 MiB per file e 6 pagine totali.'),
      files.length>0&&h('ul',{className:'identity-file-list'},...files.map((file,i)=>h('li',{key:i},file.name,` · ${(file.size/1024).toFixed(0)} KB`))),
      h('button',{type:'button',className:'identity-primary',disabled:reading||!files.length||Boolean(validateFiles(files)),onClick:read},reading?'Lettura in corso…':'Leggi dati'),
      h('p',{className:'identity-progress',role:'status','aria-live':'polite'},progress)),
     error&&h('div',{className:'identity-error',role:'alert'},error),
     fields&&h(React.Fragment,null,
      h('div',{className:'identity-notice'},'La lettura automatica può sbagliare anche senza avvisi. Confronta i dati con il documento e conferma solo i campi che vuoi inserire.'),
      liveWarnings.length>0&&h('div',{className:'identity-warnings',role:'alert'},...liveWarnings.map((warning,i)=>h('p',{key:i},warning))),
      h('div',{className:'identity-review'},
       h('section',{className:'identity-images','aria-label':'Anteprima del documento'},h('div',{className:'identity-preview'},h('h3',null,'Documento originale'),
        h('label',null,'Pagina da confrontare',h('select',{value:pageIndex,'aria-label':'Pagina da confrontare',onChange:e=>{setPageIndex(Number(e.target.value));setSourceKey('');}},...pages.map((page,i)=>h('option',{value:i,key:i},`${i+1} · ${page.fileName} · ${page.label}`)))),
        pages[pageIndex]&&h('div',{className:'identity-image-frame',style:{maxWidth:pages[pageIndex].width/pages[pageIndex].height*620}},h('img',{src:pages[pageIndex].image,alt:`Documento caricato · pagina ${pageIndex+1}`}),
         fields[sourceKey]?.bbox&&fields[sourceKey].page===pageIndex+1&&h('svg',{className:'identity-highlight',viewBox:`0 0 ${pages[pageIndex].width} ${pages[pageIndex].height}`,role:'img','aria-label':`Area letta per ${fields[sourceKey].label}`},h('rect',{x:fields[sourceKey].bbox.x0,y:fields[sourceKey].bbox.y0,width:fields[sourceKey].bbox.x1-fields[sourceKey].bbox.x0,height:fields[sourceKey].bbox.y1-fields[sourceKey].bbox.y0}))),
        sourceKey&&fields[sourceKey]?.bbox&&h('p',{className:'identity-source-caption'},`Dato evidenziato: ${fields[sourceKey].label}`),
        h('p',{className:'identity-hint'},'Usa “Mostra il dato nel documento” per controllare l’area letta. Alla chiusura vengono cancellati immagini e risultati.'))),
       h('section',{className:'identity-fields','aria-label':'Dati letti e conferme'},h('h3',null,'Dati estratti'),...fieldViews)),
      h('section',{className:'identity-import','aria-label':'Inserimento nel modulo'},h('h3',null,'Inserisci nel modulo'),
       targets.length?h('label',null,'Persona destinataria',h('select',{value:targetId,'aria-label':'Persona destinataria',onChange:e=>setTargetId(e.target.value)},h('option',{value:''},'Scegli la persona…'),...targets.map(t=>h('option',{value:t.id,key:t.id},t.label)))):h('p',null,'Nessun campo anagrafico compatibile in questo modulo. Puoi copiare i dati confermati.'),
       target&&h('p',{className:'identity-hint'},'Saranno inseriti soltanto i campi confermati e disponibili nel modello.',target.fields.fullName?' Nome e cognome devono essere confermati entrambi.':''),
       operations.length>0&&h('div',{className:'identity-changes'},...operations.map(op=>h('div',{className:op.replacement?'identity-change identity-replacement':'identity-change',key:op.key},h('strong',null,op.label),h('div',null,h('span',null,'Attuale: '),op.previous||'—'),h('div',null,h('span',null,'Nuovo: '),op.value)))),
       replacements&&h('label',{className:'identity-confirm identity-replace-confirm'},h('input',{type:'checkbox',checked:replace,'aria-label':'Conferma sostituzione dei dati già compilati',onChange:e=>setReplace(e.target.checked)}),'Confermo la sostituzione dei dati già compilati mostrati sopra'),
       h('div',{className:'identity-import-actions'},h('button',{type:'button',className:'identity-primary',disabled:reading||!operations.length||(replacements&&!replace),onClick:importValues},'Inserisci i dati confermati'),h('button',{type:'button',className:'identity-secondary',disabled:!Object.values(fields).some(field=>field.confirmed),onClick:copy},'Copia dati confermati')),
       target&&!operations.length&&h('p',{className:'identity-hint'},'Conferma i campi da inserire; i valori già uguali nel modulo non vengono modificati.'))))));
 };
}
