import {readArchive,readEnvelope,draftKey,saveDocument,openDocument,startDocument,replaceDraft,exportArchive,exportDocument,importArchive,recoverLegacyDrafts,saveSharedRecord,rawRecovery,resolveTemplate} from './ContractArchive.js';
import {MODELS,modelAdapter,documentFacts,encodeParty,decodeParty,planDocumentImport,planPartyCallbacks,personLabel,propertyLabel,portableParty,portableProperty} from './DocumentInterop.js';
import {applyImport} from './IdentityTargets.js';
import {prepareDocument} from './DocumentTypography.js';

export function downloadText(content,name,type='application/json'){
 const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
/** Freeze the visible legal template together with live values and its local static assets. */
export async function captureTemplate(){
 await prepareDocument(document.body);
 const layoutError=document.querySelector('[data-layout-error]')?.dataset.layoutError;
 if(layoutError)throw Error('Impaginazione non pronta: '+layoutError);
 const pages=[...document.querySelectorAll('.a4-page')].filter(page=>!page.closest('.a4-measure-shell,.contract-native-print-copy'));
 if(!pages.length)throw Error('Anteprima non pronta. Attendere il documento prima di finalizzare.');
 const usedFonts=new Set();
 for(const page of pages)for(const node of [page,...page.querySelectorAll('*')])for(const family of getComputedStyle(node).fontFamily.split(','))usedFonts.add(family.trim().replace(/^['"]|['"]$/g,'').toLocaleLowerCase('en'));
 const container=document.createElement('div');
 const pageShell=pages[0].closest('.adaptive-document,.purchase-template-pages,.sharing-pages');
 container.className='contrax-frozen-document '+(pageShell?.className||'');
 for(const page of pages){
  const copy=page.cloneNode(true),live=page.querySelectorAll('input,textarea,select');
  copy.querySelectorAll('input,textarea,select').forEach((field,index)=>{
   const original=live[index],value=original.type==='checkbox'?(original.checked?'☒':'☐'):original.value;
   const span=document.createElement('span');
   span.className=field.className+' contrax-frozen-value';span.style.cssText=field.style.cssText;span.textContent=value||'\u00a0';span.setAttribute('aria-label',field.getAttribute('aria-label')||field.name);field.replaceWith(span);
  });
  copy.querySelectorAll('.pdf-hide,.pdf-export-hide,.contract-party-controls,.a4-measure-shell,script,iframe,object,embed').forEach(node=>node.remove());
  copy.querySelectorAll('button').forEach(button=>{const span=document.createElement('span');span.className=button.className;span.style.cssText=button.style.cssText;span.innerHTML=button.innerHTML;button.replaceWith(span);});
  copy.querySelectorAll('*').forEach(node=>{for(const attribute of [...node.attributes])if(attribute.name.startsWith('on'))node.removeAttribute(attribute.name);});
  container.appendChild(copy);
 }
 const resources=new Map();
 async function freezeResource(value){
  if(!value||value.startsWith('data:')||value.startsWith('#'))return value;
  const url=new URL(value,location.href);
  if(url.origin!==location.origin)throw Error('Il modello contiene una risorsa esterna che non può essere congelata localmente.');
  if(!resources.has(url.href))resources.set(url.href,(async()=>{
   const response=await fetch(url.href);if(!response.ok)throw Error('Risorsa del modello non disponibile: '+url.pathname);
   const blob=await response.blob();
   return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
  })());
  return await resources.get(url.href);
 }
 for(const image of container.querySelectorAll('img')){image.src=await freezeResource(image.getAttribute('src'));image.removeAttribute('srcset');}
 async function freezeUrls(value){
  const matches=[...value.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)];
  for(const match of matches)value=value.replace(match[0],`url("${await freezeResource(match[2])}")`);
  return value;
 }
 for(const node of container.querySelectorAll('[style]'))node.setAttribute('style',await freezeUrls(node.getAttribute('style')));
 let css='';
 for(const sheet of [...document.styleSheets]){
  try{css+=[...sheet.cssRules].map(rule=>rule.cssText).join('\n')+'\n';}catch{throw Error('Lo stile del modello non è disponibile per il salvataggio definitivo.');}
 }
 // Import rules are resolved explicitly so future app releases cannot alter the frozen fonts.
 async function frozenCss(source,base){
  for(const match of [...source.matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;/g)]){
   const url=new URL(match[1],base),response=await fetch(url.href);if(!response.ok)throw Error('Stile del modello non disponibile.');
   source=source.replace(match[0],await frozenCss(await response.text(),url.href));
  }
  source=source.replace(/@font-face\s*\{[^}]*\}/gi,rule=>{
   const family=/font-family\s*:\s*([^;]+);/i.exec(rule)?.[1]?.trim().replace(/^['"]|['"]$/g,'').toLocaleLowerCase('en');
   return !family||usedFonts.has(family)?rule:'';
  });
  // Resolve CSS relative URLs against their sheet, before freezing them.
  source=source.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/g,(all,quote,value)=>value.startsWith('data:')?all:`url("${new URL(value,base).href}")`);
  return freezeUrls(source);
 }
 css=await frozenCss(css,location.origin+'/assets/app.css');
 css+='\nbody{margin:0;background:#fff;color:#111}.contrax-frozen-document{width:210mm;margin:auto}.contrax-frozen-document .a4-page{margin:0!important;box-shadow:none!important;break-after:page}.contrax-frozen-value{display:inline-block;white-space:pre-wrap;overflow-wrap:anywhere;min-height:1em}';
 return {schema:1,capturedAt:new Date().toISOString(),model:location.pathname,html:container.outerHTML,css};
}
export function snapshotHtml(template){
 if(!template?.html)return '';
 // Imported snapshots are treated as untrusted documents, with no scripts or external requests.
 return '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; font-src data:; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><style>'+String(template.css||'').replace(/<\/style/gi,'<\\/style')+'</style></head><body>'+template.html+'</body></html>';
}
export function createArchiveTools(React){
 const h=React.createElement;
 const button=(label,onClick,props={})=>h('button',{type:'button',className:'contract-control-btn',onClick,...props},label);
 const emptyArchive={documents:[],people:[],properties:[],active:{},recovery:[]};
 return function ArchiveTools({targets=[]}){
  const path=location.pathname;
  const [open,setOpen]=React.useState(false),[archive,setArchive]=React.useState(emptyArchive),[name,setName]=React.useState(''),[notice,setNotice]=React.useState(''),[error,setError]=React.useState('');
  const [fromDate,setFromDate]=React.useState(''),[toDate,setToDate]=React.useState('');
  const [search,setSearch]=React.useState(''),[filter,setFilter]=React.useState(''),[stateFilter,setStateFilter]=React.useState(''),[view,setView]=React.useState(null),[busy,setBusy]=React.useState(false);
  const [facts,setFacts]=React.useState(null),[sourceId,setSourceId]=React.useState(''),[source,setSource]=React.useState(null),[mappings,setMappings]=React.useState({}),[selectedProperties,setSelectedProperties]=React.useState([]),[includeFacts,setIncludeFacts]=React.useState(false),[plan,setPlan]=React.useState(null),[confirmed,setConfirmed]=React.useState(false);
  const [clipboard,setClipboard]=React.useState(''),[clipboardPerson,setClipboardPerson]=React.useState(null),[targetId,setTargetId]=React.useState(''),[callbackPlan,setCallbackPlan]=React.useState(null),[filePending,setFilePending]=React.useState(null),[action,setAction]=React.useState(null);
  const dialog=React.useRef(null);
  const refresh=()=>{
   const current=readArchive(localStorage);setArchive(current);
   const active=current.documents.find(row=>row.id===current.active[path]);if(active)setName(active.title);
   try{setFacts(documentFacts(readEnvelope(localStorage,path)));}catch{setFacts(null);}
   return current;
  };
  function run(task){try{setError('');return task();}catch(exception){setError(exception.message||String(exception));return null;}}
  React.useEffect(()=>{
   const element=dialog.current;if(open&&!element.open)element.showModal();else if(!open&&element.open)element.close();
  },[open]);
  const launch=()=>{setOpen(true);setPlan(null);setAction(null);setView(null);setNotice('');run(refresh);};
  const close=()=>{setOpen(false);setClipboard('');setClipboardPerson(null);setCallbackPlan(null);setPlan(null);setFilePending(null);};
  const adapter=(()=>{try{return modelAdapter(path);}catch{return null;}})();
  const docs=archive.documents.filter(row=>(!fromDate||(row.updatedAt||'').slice(0,10)>=fromDate)&&(!toDate||(row.updatedAt||'').slice(0,10)<=toDate)&&(!filter||row.model===filter)&&(!stateFilter||row.state===stateFilter)&&(!search||`${row.title} ${row.updatedAt||''} ${MODELS[row.model]||row.model} ${JSON.stringify(row.envelope.slots)}`.toLocaleLowerCase('it').includes(search.toLocaleLowerCase('it'))));
  const resetImport=next=>{setSource(next);setMappings({});setSelectedProperties([]);setIncludeFacts(false);setPlan(null);setConfirmed(false);};
  const selectSource=id=>run(()=>{
   setSourceId(id);
   if(id.startsWith('person:')){const row=archive.people.find(row=>'person:'+row.id===id);resetImport({format:'contrax.document-facts',schema:1,model:'libreria persone',parties:[{id:row.id,role:'person',label:row.label,data:portableParty({...row.data,id:row.id})}],properties:[],facts:{}});}
   else if(id.startsWith('property:')){const row=archive.properties.find(row=>'property:'+row.id===id);resetImport({format:'contrax.document-facts',schema:1,model:'libreria immobili',parties:[],properties:[{id:row.id,data:portableProperty({...row.data,id:row.id})}],facts:{}});}
   else{const row=archive.documents.find(row=>row.id===id);resetImport(row?documentFacts(row.envelope,{documentId:row.id}):null);}
  });
  const previewImport=()=>run(()=>{
   const raw=localStorage.getItem(draftKey(path)),current=readEnvelope(localStorage,path);
   const selected=Object.entries(mappings).filter(([,value])=>value.role).map(([sourceId,value])=>({sourceId,...value}));
   if(!selected.length&&!selectedProperties.length&&!includeFacts)throw Error('Scegliere almeno una persona, un immobile o i dati economici.');
   const result=planDocumentImport(current,source,{parties:selected,properties:selectedProperties,includeFacts});
   setPlan({...result,raw});setConfirmed(false);
  });
  const confirmImport=()=>run(()=>{if(!confirmed)throw Error('Confermare il confronto dei campi.');replaceDraft(localStorage,path,plan.envelope,'Prima dell’importazione da '+(source?.model||'archivio'),plan.raw);location.reload();});
  const save=async(finalize=false)=>{
   setBusy(true);setError('');
   try{
    const before=finalize?localStorage.getItem(draftKey(path)):null;
    const template=finalize?await captureTemplate():undefined;
    if(finalize&&localStorage.getItem(draftKey(path))!==before)throw Error('La bozza è cambiata durante la preparazione. Controllare l’anteprima e finalizzare di nuovo.');
    const sensitivity=finalize&&path==='/aml'?(document.querySelector('[aria-label="Copia antiriciclaggio"]')?.value==='internal'?'internal':'customer'):undefined;
    saveDocument(localStorage,path,name,{finalize,template,sensitivity});refresh();setNotice(finalize?'Versione finalizzata salvata. Dati e modello sono congelati; le successive modifiche restano nella bozza.':'Documento nominato salvato. Le prossime modifiche aggiornano questa bozza.');setAction(null);
   }catch(exception){setError(exception.message||String(exception));}finally{setBusy(false);}
  };
  const diffTable=operations=>h('div',{className:'contrax-diff-wrap'},h('table',{className:'contrax-diff'},h('thead',null,h('tr',null,h('th',null,'Campo'),h('th',null,'Prima'),h('th',null,'Dopo'))),h('tbody',null,...operations.map((op,index)=>h('tr',{key:index,className:op.replacement?'contrax-replacement':''},h('th',{scope:'row'},op.label),h('td',null,typeof op.previous==='object'?JSON.stringify(op.previous):String(op.previous||'—')),h('td',null,typeof op.value==='object'?JSON.stringify(op.value):String(op.value)))))));
  return h('div',{className:'contrax-archive-launch pdf-hide'},button('Archivio e riuso dati',launch),
   h('dialog',{ref:dialog,className:'contrax-archive-dialog','aria-labelledby':'contrax-archive-title',onCancel:event=>{event.preventDefault();close();}},
    h('header',{className:'contrax-archive-head'},h('div',null,h('h2',{id:'contrax-archive-title'},'Archivio locale e riuso dei dati'),h('p',null,'Documenti conservati in questo browser. Esporta l’archivio per avere una copia su file.')),button('Chiudi archivio',close)),
    h('div',{className:'contrax-archive-body'},error&&h('p',{className:'contrax-error',role:'alert'},error),notice&&h('p',{role:'status'},notice),
     h('section',{'aria-label':'Documento corrente'},h('h3',null,MODELS[path]||'Gestione archivio'),
      MODELS[path]&&h('label',null,'Nome del documento',h('input',{'aria-label':'Nome del documento',value:name,onChange:event=>setName(event.target.value),placeholder:'Es. Via Roma · Rossi · ottobre 2026'})),
      h('div',{className:'contrax-actions'},MODELS[path]&&button('Salva documento',()=>save(false),{disabled:busy}),MODELS[path]&&button('Nuovo documento',()=>setAction({kind:'new'}),{disabled:busy}),MODELS[path]&&button('Finalizza una versione',()=>setAction({kind:'finalize'}),{disabled:busy}),button('Esporta archivio',()=>run(()=>downloadText(exportArchive(localStorage),'contrax-archivio.json'))),
       h('label',{className:'contract-control-btn'},'Importa archivio',h('input',{type:'file',accept:'.json,application/json',hidden:true,'aria-label':'Importa archivio locale',onChange:async event=>{const file=event.target.files[0];if(!file)return;try{const text=await file.text(),data=JSON.parse(text);if(data?.schema!==1||!Array.isArray(data.documents))throw Error('File archivio non valido. Usare “Importa bozza” per una singola bozza.');setFilePending({text,name:file.name,count:data.documents.length});}catch(exception){setError(exception.message);}event.target.value='';}})),
       button('Recupera bozze precedenti',()=>run(()=>{const result=recoverLegacyDrafts(localStorage);refresh();setNotice(`${result.count} bozze copiate nell’archivio. I dati originali restano nei loro moduli.`);if(result.errors.length)setError(result.errors.join('\n'));})),button('Esporta recupero completo riservato',()=>setAction({kind:'raw-recovery'}))),
      action&&['new','finalize'].includes(action.kind)&&h('div',{className:'contrax-confirm'},h('p',null,action.kind==='new'?'La bozza corrente resterà nel recupero locale. Il modulo si aprirà vuoto.':'Salva una nuova versione immutabile dei dati e del modello visualizzato. Le firme restano da acquisire; questa operazione non certifica la firma.'),button(action.kind==='new'?'Conferma nuovo documento':'Conferma finalizzazione',()=>action.kind==='new'?run(()=>{startDocument(localStorage,path);location.reload();}):save(true),{disabled:busy}),button('Annulla',()=>setAction(null))),
      action?.kind==='raw-recovery'&&h('div',{className:'contrax-confirm'},h('p',null,'Il recupero completo include anche i fascicoli e le valutazioni antiriciclaggio riservate. Conserva il file in un luogo protetto.'),button('Conferma esportazione recupero riservato',()=>run(()=>{downloadText(rawRecovery(localStorage),'contrax-recupero-riservato.json');setAction(null);})),button('Annulla recupero',()=>setAction(null))),
      filePending&&h('div',{className:'contrax-confirm'},h('p',null,`Importare ${filePending.count} documenti da “${filePending.name}”? I documenti esistenti restano conservati; gli ID già presenti generano copie.`),button('Conferma importazione archivio',()=>run(()=>{const count=importArchive(localStorage,filePending.text);setFilePending(null);refresh();setNotice(`${count} documenti importati.`);})),button('Annulla importazione',()=>setFilePending(null)))),
     h('section',{'aria-label':'Documenti archiviati'},h('h3',null,'Documenti archiviati'),
      h('div',{className:'contrax-filters'},h('label',null,'Cerca',h('input',{'aria-label':'Cerca documenti',type:'search',value:search,onChange:event=>setSearch(event.target.value)})),h('label',null,'Modello',h('select',{'aria-label':'Filtra modello',value:filter,onChange:event=>setFilter(event.target.value)},h('option',{value:''},'Tutti i modelli'),...Object.entries(MODELS).map(([value,label])=>h('option',{value,key:value},label)))),h('label',null,'Stato',h('select',{'aria-label':'Filtra stato',value:stateFilter,onChange:event=>setStateFilter(event.target.value)},h('option',{value:''},'Tutti'),h('option',{value:'draft'},'Bozze'),h('option',{value:'final'},'Finalizzati')))),
      h('div',{className:'contrax-filters'},h('label',null,'Dal',h('input',{type:'date','aria-label':'Documenti aggiornati dal',value:fromDate,onChange:e=>setFromDate(e.target.value)})),h('label',null,'Al',h('input',{type:'date','aria-label':'Documenti aggiornati fino al',value:toDate,onChange:e=>setToDate(e.target.value)}))),
      h('ul',{className:'contrax-document-list'},...docs.map(row=>h('li',{key:row.id},h('div',null,h('strong',null,row.title),h('small',null,`${MODELS[row.model]||row.model} · ${row.sensitivity==='internal'?'Finalizzato · riservato':row.state==='final'?'Finalizzato':'Bozza'} · ${row.updatedAt?.slice(0,10)||''}`)),h('div',{className:'contrax-actions'},row.state==='draft'?button('Apri',()=>setAction({kind:'open',id:row.id,model:row.model,title:row.title})):button('Visualizza versione',()=>run(()=>setView({...row,...(row.template?{template:resolveTemplate(row.template,archive)}:{})}))),button('Duplica',()=>setAction({kind:'duplicate',id:row.id,model:row.model,title:row.title})),button(row.sensitivity==='internal'?'Esporta fascicolo interno':'Esporta documento',()=>downloadText(exportDocument(row,archive,{includeInternal:row.sensitivity==='internal'}),row.sensitivity==='internal'?'contrax-fascicolo-interno.json':'contrax-documento.json')))))),!docs.length&&h('p',null,'Nessun documento corrispondente. Salva il documento corrente o recupera le bozze precedenti.'),
      action?.kind==='duplicate'&&h('div',{className:'contrax-confirm'},h('p',null,`Creare e aprire una copia di “${action.title}”? La bozza già presente in ${MODELS[action.model]||action.model} resterà nel recupero locale.`),button('Conferma duplicazione',()=>run(()=>{const row=openDocument(localStorage,action.id,{duplicate:true});location.assign(row.model);})),button('Annulla duplicazione',()=>setAction(null))),
      action?.kind==='open'&&h('div',{className:'contrax-confirm'},h('p',null,`Aprire “${action.title}”? La bozza già presente in ${MODELS[action.model]||action.model} resterà nel recupero locale.`),button('Conferma apertura',()=>run(()=>{const row=openDocument(localStorage,action.id);location.assign(row.model);})),button('Annulla apertura',()=>setAction(null))),
      view&&h('div',{className:'contrax-snapshot'},h('h4',null,view.title+' · versione finalizzata'),h('p',null,'Questa anteprima usa il modello e i dati salvati. Per modificare, duplica il documento.'),button('Chiudi versione',()=>setView(null)),view.template?.html?h('iframe',{title:'Versione finalizzata '+view.title,sandbox:'',srcDoc:snapshotHtml(view.template)}):h('p',null,'Il file importato contiene i dati finalizzati ma non un’anteprima del modello.'))),
     h('section',{'aria-label':'Librerie condivise'},h('h3',null,'Salva nelle librerie condivise'),h('p',null,'Salva solo i dati riutilizzabili selezionati. Le valutazioni e la sezione riservata antiriciclaggio sono escluse.'),
      facts?.parties.map(person=>h('div',{key:person.id,className:'contrax-library-row'},h('span',null,person.label+' · '+personLabel(person.data)),button('Salva anagrafica',()=>run(()=>{saveSharedRecord(localStorage,'people',portableParty(person.data),personLabel(person.data));refresh();setNotice('Anagrafica aggiunta alla libreria. Nessun documento esistente è stato modificato.');})),button('Copia anagrafica',async()=>{try{await navigator.clipboard.writeText(encodeParty(person.data));setNotice('Anagrafica copiata su tua richiesta: contiene dati personali. Incollala solo dove necessario.');}catch{setClipboard(encodeParty(person.data));setNotice('Copia automatica non disponibile. Seleziona il testo e copialo manualmente.');}}))),
      facts?.properties.map(unit=>h('div',{key:unit.id,className:'contrax-library-row'},h('span',null,propertyLabel(unit.data)),button('Salva immobile',()=>run(()=>{saveSharedRecord(localStorage,'properties',portableProperty(unit.data),propertyLabel(unit.data));refresh();setNotice('Immobile aggiunto alla libreria.');}))))),
     adapter&&h('section',{'aria-label':'Importa dati da archivio'},h('h3',null,'Importa dati da un documento o dalla libreria'),h('p',null,'Scegli origine, singole persone, ruoli e immobili. Controlla il confronto prima di confermare. Nessuna clausola o firma viene trasferita.'),
      h('label',null,'Origine dei dati',h('select',{'aria-label':'Origine dei dati',value:sourceId,onChange:event=>selectSource(event.target.value)},h('option',{value:''},'Seleziona…'),h('optgroup',{label:'Documenti'},...archive.documents.filter(row=>row.sensitivity!=='internal').map(row=>h('option',{key:row.id,value:row.id},`${row.title} · ${MODELS[row.model]||row.model}`))),h('optgroup',{label:'Anagrafiche condivise'},...archive.people.map(row=>h('option',{key:row.id,value:'person:'+row.id},row.label))),h('optgroup',{label:'Immobili condivisi'},...archive.properties.map(row=>h('option',{key:row.id,value:'property:'+row.id},row.label))))),
      source&&h('div',{className:'contrax-import-mapping'},...source.parties.map(person=>{
       const mapping=mappings[person.id]||{},role=adapter.roles.find(([key])=>key===mapping.role),arrayRole=adapter.kind==='records'||mapping.role==='contributors';
       let recipients=[];try{recipients=readEnvelope(localStorage,path).slots[mapping.role]||[];}catch{}
       return h('div',{key:person.id,className:'contrax-mapping-row'},
        h('strong',null,person.label+' · '+personLabel(person.data)),
        h('label',null,'Ruolo destinatario',h('select',{'aria-label':'Ruolo per '+personLabel(person.data),value:mapping.role||'',onChange:event=>{setMappings(previous=>({...previous,[person.id]:{role:event.target.value,targetId:'new'}}));setPlan(null);}},h('option',{value:''},'Non importare'),...adapter.roles.map(([value,label])=>h('option',{key:value,value},label)))),
        role&&arrayRole&&h('label',null,'Destinatario',h('select',{'aria-label':'Destinatario per '+personLabel(person.data),value:mapping.targetId||'new',onChange:event=>{setMappings(previous=>({...previous,[person.id]:{...mapping,targetId:event.target.value}}));setPlan(null);}},h('option',{value:'new'},'Aggiungi nuova anagrafica'),...(Array.isArray(recipients)?recipients.map((person,index)=>h('option',{key:person.id,value:person.id},`${role[1]} ${index+1}: ${personLabel(person)}`)):[]))));
      }),...source.properties.map(unit=>h('label',{key:unit.id,className:'contrax-check'},h('input',{type:'checkbox',checked:selectedProperties.includes(unit.id),onChange:event=>{setSelectedProperties(previous=>event.target.checked?[...previous,unit.id]:previous.filter(id=>id!==unit.id));setPlan(null);}}),'Importa immobile · '+propertyLabel(unit.data))),Object.values(source.facts||{}).some(Boolean)&&h('label',{className:'contrax-check'},h('input',{type:'checkbox',checked:includeFacts,onChange:event=>{setIncludeFacts(event.target.checked);setPlan(null);}}),'Includi importi e date compatibili (non il testo delle clausole)'),button('Anteprima confronto',previewImport)),
      plan&&h('div',{className:'contrax-import-preview'},h('h4',null,`${plan.operations.length} campi da inserire o sostituire`),diffTable(plan.operations),plan.operations.length>0&&h(React.Fragment,null,h('label',{className:'contrax-check'},h('input',{type:'checkbox',checked:confirmed,onChange:event=>setConfirmed(event.target.checked)}),'Ho verificato ruoli, dati e sostituzioni evidenziate'),button('Conferma importazione dati',confirmImport,{disabled:!confirmed})))),
     h('section',{'aria-label':'Incolla anagrafica strutturata'},h('h3',null,'Incolla una singola anagrafica'),h('p',null,'Il testo contiene dati personali. La lettura dagli appunti avviene solo premendo il pulsante.'),button('Leggi anagrafica dagli appunti',async()=>{try{setClipboard(await navigator.clipboard.readText());setClipboardPerson(null);setCallbackPlan(null);}catch{setError('Lettura degli appunti non consentita. Incolla il testo nel riquadro.');}}),
      h('textarea',{'aria-label':'Anagrafica strutturata da incollare',rows:4,value:clipboard,onChange:event=>{setClipboard(event.target.value);setClipboardPerson(null);setCallbackPlan(null);}}),button('Controlla anagrafica incollata',()=>run(()=>{const person=decodeParty(clipboard);setClipboardPerson(person);setCallbackPlan(null);})),
      clipboardPerson&&h('div',null,h('p',null,personLabel(clipboardPerson)),targets.length>0?h(React.Fragment,null,h('label',null,'Persona destinataria nel modulo',h('select',{'aria-label':'Destinatario anagrafica incollata',value:targetId,onChange:event=>{setTargetId(event.target.value);setCallbackPlan(null);}},h('option',{value:''},'Scegli…'),...targets.map(target=>h('option',{key:target.id,value:target.id},target.label)))),button('Confronta anagrafica',()=>run(()=>{const target=targets.find(target=>target.id===targetId);if(!target)throw Error('Scegliere la persona destinataria.');setCallbackPlan({targetId:target.id,operations:planPartyCallbacks(target,clipboardPerson)});setConfirmed(false);}))) :h('p',null,'Salva l’anagrafica nella libreria, poi scegli origine e ruolo nel pannello di importazione.'),button('Salva anagrafica incollata in libreria',()=>run(()=>{saveSharedRecord(localStorage,'people',clipboardPerson,personLabel(clipboardPerson));refresh();setNotice('Anagrafica salvata in libreria. Sceglila come origine per importarla nel ruolo desiderato.');}))),
      callbackPlan&&h('div',null,diffTable(callbackPlan.operations),h('label',{className:'contrax-check'},h('input',{type:'checkbox',checked:confirmed,onChange:event=>setConfirmed(event.target.checked)}),'Confermo i dati e le sostituzioni'),button('Inserisci anagrafica confermata',()=>run(()=>{
       const target=targets.find(target=>target.id===callbackPlan.targetId),current=planPartyCallbacks(target,clipboardPerson);
       if(JSON.stringify(current.map(({props,...op})=>op))!==JSON.stringify(callbackPlan.operations.map(({props,...op})=>op)))throw Error('La persona destinataria è cambiata: ripetere il confronto.');
       if(!confirmed)throw Error('Confermare il confronto.');applyImport(current,true);setCallbackPlan(null);setNotice('Anagrafica inserita nel ruolo selezionato.');
      }),{disabled:!confirmed}))),
     h('details',null,h('summary',null,`Recupero locale · ${archive.recovery.length} copie`),h('p',null,'Le copie precedenti conservano anche i valori non riconosciuti dal modello corrente.'),...archive.recovery.map(row=>h('div',{key:row.id,className:'contrax-recovery-row'},h('span',null,`${row.createdAt?.slice(0,19)||''} · ${row.reason||row.model}`),row.model==='/aml'?button('Esporta copia riservata',()=>run(()=>{downloadText(row.raw,'contrax-recupero-aml-riservato.json');setNotice('Copia interna AML esportata su richiesta.');})):button('Esporta copia recuperata',()=>downloadText(row.raw,'contrax-bozza-recuperata.json'))))))));
 };
}
