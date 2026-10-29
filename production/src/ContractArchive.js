/** Local, versioned document storage. No network or clipboard access belongs here. */
export const DRAFT_PREFIX='gemut.contract.draft.v1:';
export const ARCHIVE_KEY='gemut.contract.archive.v1';
export const draftKey=model=>DRAFT_PREFIX+model;
const object=value=>Boolean(value&&typeof value==='object'&&!Array.isArray(value));
export const clone=value=>JSON.parse(JSON.stringify(value));
let sequence=0;
export const recordId=(prefix='document')=>`${prefix}-${globalThis.crypto?.randomUUID?.()||`${Date.now().toString(36)}-${++sequence}`}`;
const timestamp=()=>new Date().toISOString();
function assetId(value,prefix='asset'){
 let hash=2166136261;for(let index=0;index<value.length;index++)hash=Math.imul(hash^value.charCodeAt(index),16777619);
 return `${prefix}-${(hash>>>0).toString(36)}-${value.length.toString(36)}`;
}
function putAsset(archive,value,prefix){
 const assets=archive.assets||(archive.assets={});let id=assetId(value,prefix),suffix=0;
 while(assets[id]!==undefined&&assets[id]!==value)id=assetId(value,prefix)+'-'+(++suffix);
 assets[id]=value;return id;
}
function packTemplate(archive,template){
 const encode=value=>String(value).replace(/data:[^\s"'()<>]+/g,resource=>'contrax-asset:'+putAsset(archive,resource,'asset'));
 const css=encode(template.css),result={...clone(template),html:encode(template.html),cssRef:putAsset(archive,css,'style')};
 delete result.css;return result;
}
export function resolveTemplate(template,archive){
 if(!template)return template;
 const decode=value=>String(value||'').replace(/contrax-asset:([a-z0-9-]+)/g,(reference,id)=>{
  const asset=archive.assets?.[id];if(typeof asset!=='string')throw Error('Risorsa della versione finalizzata mancante: conservare il file originale.');return asset;
 });
 const css=template.cssRef?archive.assets?.[template.cssRef]:template.css;
 if(typeof css!=='string')throw Error('Stile della versione finalizzata mancante: conservare il file originale.');
 return {...template,html:decode(template.html),css:decode(css)};
}
function retainTemplateAssets(archive){
 if(!archive.assets)return;
 const referenced=new Set();
 const collect=value=>{for(const match of String(value||'').matchAll(/contrax-asset:([a-z0-9-]+)/g))referenced.add(match[1]);};
 for(const row of archive.documents){
  const template=row.template;if(!template)continue;
  collect(template.html);collect(template.css);
  if(template.cssRef){referenced.add(template.cssRef);collect(archive.assets[template.cssRef]);}
 }
 archive.assets=Object.fromEntries([...referenced].filter(id=>typeof archive.assets[id]==='string').map(id=>[id,archive.assets[id]]));
}
export function validateEnvelope(data,model){
 if(!object(data)||data.schema!==1||typeof data.model!=='string'||!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/i.test(data.model)||!object(data.slots)||(model&&data.model!==model))throw Error('La bozza appartiene a un modello diverso o ha un formato non valido. Conservare il file originale.');
 return data;
}
/** Scalar forms need persisted identities too: a route or a field position is not an entity ID. */
export function ensureEnvelopeRecordIds(envelope){
 const data=clone(validateEnvelope(envelope)),model=data.model;
 if(data.slots.recordIds!==undefined&&!object(data.slots.recordIds))throw Error('Identificativi della bozza non validi. Conservare il recupero originale.');
 const ids=data.slots.recordIds||(data.slots.recordIds={});
 const roles=model==='/purchase-proposal'?['owners','buyers']:model==='/lease-proposal'?['owners','proposers']:model.endsWith('-assign')||['/aml','/commission','/visit-sheet','/property-sharing','/lease-allegato-b'].includes(model)?['client']:[];
 const properties=model==='/lease-allegato-b'?['property1','property2','property3']:!['/aml','/commission'].includes(model)?['property']:[];
 for(const role of [...roles,...properties])if(typeof ids[role]!=='string'||!ids[role].trim())ids[role]=recordId(role.startsWith('property')?'property':'person');
 return data;
}
export function readEnvelope(storage,model){
 if(!storage)throw Error('Archivio locale non disponibile in questo browser.');
 const raw=storage.getItem(draftKey(model));
 return raw?validateEnvelope(JSON.parse(raw),model):{schema:1,model,slots:{}};
}
export function readArchive(storage){
 if(!storage)throw Error('Archivio locale non disponibile in questo browser.');
 const raw=storage.getItem(ARCHIVE_KEY);
 if(!raw)return {schema:1,documents:[],people:[],properties:[],active:{},recovery:[]};
 const data=JSON.parse(raw);
 if(!object(data)||data.schema!==1||!Array.isArray(data.documents)||!Array.isArray(data.people)||!Array.isArray(data.properties)||!object(data.active)||!Array.isArray(data.recovery))throw Error('Archivio locale non riconosciuto: nessun dato è stato sovrascritto. Esportare il recupero e verificare il file.');
 if(data.assets!==undefined&&(!object(data.assets)||Object.values(data.assets).some(value=>typeof value!=='string')))throw Error('Risorse dell’archivio non valide: nessun dato è stato sovrascritto.');
 const ids=new Set();
 for(const row of data.documents){
  if(!object(row)||typeof row.id!=='string'||ids.has(row.id)||!['draft','final'].includes(row.state)||typeof row.title!=='string')throw Error('Archivio documenti non valido: nessun dato è stato sovrascritto.');
  validateEnvelope(row.envelope,row.model);ids.add(row.id);
  if(row.template){
   const css=row.template.cssRef?data.assets?.[row.template.cssRef]:row.template.css;
   if(typeof row.template.html!=='string'||typeof css!=='string')throw Error('Versione finalizzata incompleta: esportare il recupero; nessun dato è stato sovrascritto.');
   for(const value of [row.template.html,css])for(const match of value.matchAll(/contrax-asset:([a-z0-9-]+)/g))if(typeof data.assets?.[match[1]]!=='string')throw Error('Risorsa del documento mancante: esportare il recupero; nessun dato è stato sovrascritto.');
  }
 }
 return data;
}
function writeArchive(storage,data,expected){
 if(expected!==undefined&&storage.getItem(ARCHIVE_KEY)!==expected)throw Error('L’archivio è cambiato in un’altra scheda. Riaprirlo prima di salvare.');
 storage.setItem(ARCHIVE_KEY,JSON.stringify(data));
}
/** Retain arbitrary future object keys while applying a normalizer's known values. */
export function preserveUnknown(original,normalized){
 if(object(original)&&object(normalized))return Object.fromEntries(Object.keys({...original,...normalized}).map(key=>[key,Object.hasOwn(normalized,key)?preserveUnknown(original[key],normalized[key]):original[key]]));
 if(Array.isArray(original)&&Array.isArray(normalized))return normalized.map((item,index)=>preserveUnknown(object(item)&&item.id?original.find(row=>row?.id===item.id):original[index],item));
 return normalized;
}
function recovery(data,model,raw,reason){
 if(raw===null)return;
 // Recovery is deliberately unbounded: deleting a recoverable copy is a user action.
 data.recovery.push({id:recordId('recovery'),model,reason,createdAt:timestamp(),raw});
}
/** A failed second write restores the first; the raw previous draft is also retained. */
function switchDraft(storage,model,envelope,archive,beforeArchive){
 const beforeDraft=storage.getItem(draftKey(model));
 writeArchive(storage,archive,beforeArchive);
 try{storage.setItem(draftKey(model),JSON.stringify(validateEnvelope(envelope,model)));}
 catch(error){
  try{if(beforeArchive===null)storage.removeItem(ARCHIVE_KEY);else storage.setItem(ARCHIVE_KEY,beforeArchive);}catch{}
  throw Error('Salvataggio locale non riuscito. Il documento corrente non è stato sostituito. '+error.message);
 }
 return beforeDraft;
}
export function saveDocument(storage,model,title,options={}){
 const before=storage.getItem(ARCHIVE_KEY),archive=readArchive(storage),original=options.envelope||readEnvelope(storage,model),envelope=ensureEnvelopeRecordIds(original);
 validateEnvelope(envelope,model);
 if(!String(title||'').trim())throw Error('Assegnare un nome al documento.');
 const active=archive.documents.find(row=>row.id===archive.active[model]);
 if(options.id){
  const row=archive.documents.find(row=>row.id===options.id);
  if(!row||row.state==='final')throw Error('La versione finalizzata è immutabile. Creare una copia modificabile.');
 }
 const existing=options.newCopy||options.finalize?null:archive.documents.find(row=>row.id===(options.id||active?.id)&&row.state==='draft'&&row.model===model);
 const row={...existing,id:existing?.id||recordId(),model,title:String(title).trim(),state:options.finalize?'final':'draft',createdAt:existing?.createdAt||timestamp(),updatedAt:timestamp(),envelope};
 if(options.sensitivity)row.sensitivity=options.sensitivity;
 if(options.template)row.template=packTemplate(archive,options.template);
 if(options.finalize){
  if(!options.template?.html||!options.template?.css)throw Error('Attendere l’anteprima prima di finalizzare il documento.');
  row.finalizedAt=timestamp();
 }
 if(existing)archive.documents=archive.documents.map(item=>item.id===row.id?row:item);else archive.documents.push(row);
 if(row.state==='draft')archive.active[model]=row.id;
 if(!options.envelope&&JSON.stringify(envelope)!==JSON.stringify(original)){
  recovery(archive,model,storage.getItem(draftKey(model)),'Prima dell’assegnazione degli identificativi');
  switchDraft(storage,model,envelope,archive,before);
 }else writeArchive(storage,archive,before);
 return clone(row);
}
/** Called by draft setters after their write succeeds; finalized rows never change. */
export function syncActiveDocument(storage,model,envelope){
 const before=storage.getItem(ARCHIVE_KEY);
 if(!before)return;
 const archive=readArchive(storage),id=archive.active[model],row=archive.documents.find(item=>item.id===id);
 if(!row)return;
 if(row.state!=='draft')throw Error('Versione finalizzata: creare una copia prima di modificare.');
 archive.documents=archive.documents.map(item=>item.id===id?{...item,envelope:clone(envelope),updatedAt:timestamp()}:item);
 writeArchive(storage,archive,before);
}
export function openDocument(storage,id,{duplicate=false,title}={}){
 const before=storage.getItem(ARCHIVE_KEY),archive=readArchive(storage),source=archive.documents.find(row=>row.id===id);
 if(!source)throw Error('Documento non trovato. Riaprire l’archivio.');
 if(source.state==='final'&&!duplicate)throw Error('La versione finalizzata si consulta nella sua anteprima. Creare una copia per modificarla.');
 const row=duplicate?{...clone(source),envelope:ensureEnvelopeRecordIds(source.envelope),id:recordId(),title:title||source.title+' — copia',state:'draft',createdAt:timestamp(),updatedAt:timestamp(),copiedFrom:source.id}:source;
 if(!duplicate)row.envelope=ensureEnvelopeRecordIds(row.envelope);
 if(duplicate){delete row.finalizedAt;delete row.template;delete row.sensitivity;archive.documents.push(row);}
 const raw=storage.getItem(draftKey(row.model));
 recovery(archive,row.model,raw,'Prima dell’apertura di '+row.title);
 archive.active[row.model]=row.id;
 switchDraft(storage,row.model,clone(row.envelope),archive,before);
 return clone(row);
}
export function startDocument(storage,model){
 const before=storage.getItem(ARCHIVE_KEY),archive=readArchive(storage);
 recovery(archive,model,storage.getItem(draftKey(model)),'Prima di un nuovo documento');
 delete archive.active[model];
 switchDraft(storage,model,{schema:1,model,slots:{}},archive,before);
}
export function replaceDraft(storage,model,envelope,reason='Prima dell’importazione',expected){
 validateEnvelope(envelope,model);envelope=ensureEnvelopeRecordIds(envelope);
 const current=storage.getItem(draftKey(model));
 if(expected!==undefined&&current!==expected)throw Error('Il documento è cambiato dopo l’anteprima. Ripetere il confronto prima di importare.');
 const before=storage.getItem(ARCHIVE_KEY),archive=readArchive(storage);
 recovery(archive,model,current,reason);
 const id=archive.active[model],row=archive.documents.find(item=>item.id===id);
 if(row?.state==='final')throw Error('La versione finalizzata è immutabile. Creare una copia modificabile.');
 if(row)archive.documents=archive.documents.map(item=>item.id===id?{...item,envelope:clone(envelope),updatedAt:timestamp()}:item);
 switchDraft(storage,model,envelope,archive,before);
}
/** Legacy path drafts are copied on explicit request; their keys and raw bytes survive. */
export function recoverLegacyDrafts(storage){
 const before=storage.getItem(ARCHIVE_KEY),archive=readArchive(storage),found=[],errors=[];
 for(let index=0;index<storage.length;index++){
  const key=storage.key(index);
  if(!key?.startsWith(DRAFT_PREFIX)||!/^\/[a-z0-9-]+$/i.test(key.slice(DRAFT_PREFIX.length)))continue;
  const model=key.slice(DRAFT_PREFIX.length),raw=storage.getItem(key);
  if(archive.documents.some(row=>row.legacyRaw===raw&&row.model===model))continue;
  try{
   const envelope=ensureEnvelopeRecordIds(validateEnvelope(JSON.parse(raw),model)),row={id:recordId(),title:'Bozza recuperata · '+model.slice(1),model,state:'draft',createdAt:timestamp(),updatedAt:envelope.updatedAt||timestamp(),envelope,legacyRaw:raw};
   archive.documents.push(row);found.push(row.id);
  }catch(error){errors.push(model+': '+error.message);}
 }
 if(found.length)writeArchive(storage,archive,before);
 return {count:found.length,errors};
}
export const AML_RESERVED_FIELDS=['verification','risk','outcome'];
const AML_CUSTOMER_FIELDS=new Set(['subjectType','hasRepresentative','actsForOthers','nome','cognome','name','identity','natoA','natoIl','cf','residenza','domicilio','documentType','documentNumber','documentIssuer','documentIssuedOn','documentExpiresOn','email','telefono','denominazione','entityCf','piva','sede','powers','representative','agency','office','agent','contact','operation','id','account','beneficial','purpose','funds','pep','privacy','date']);
const AML_PERSON_FIELDS=new Set(['id','nome','cognome','sesso','trattamento','natoA','prov','natoIl','cf','domicilioComune','domicilioProv','domicilioArea','residenza','domicilio','via','numero','ci','documentType','documentNumber','documentIssuer','documentIssuedOn','documentExpiresOn','telefono','email']);
const allowed=(value,keys)=>Object.fromEntries(Object.entries(value||{}).filter(([key,item])=>keys.has(key)&&['string','number','boolean'].includes(typeof item)));
export function customerEnvelope(envelope){
 if(envelope.model!=='/aml')return clone(envelope);
 // Unknown AML payloads could be legacy reserved notes. They remain in full internal
 // exports and recovery, but require an explicit opt-in before leaving the browser.
 const slots={document:allowed(envelope.slots.document,AML_CUSTOMER_FIELDS)};
 if(object(envelope.slots.recordIds))slots.recordIds=allowed(envelope.slots.recordIds,new Set(['client']));
 for(const slot of ['representatives','beneficialOwners'])if(Array.isArray(envelope.slots[slot]))slots[slot]=envelope.slots[slot].map(person=>allowed(person,AML_PERSON_FIELDS));
 return {schema:1,model:'/aml',...(envelope.updatedAt?{updatedAt:envelope.updatedAt}:{}),slots};
}
export function customerArchive(data){
 const result=clone(data);
 result.documents=result.documents.filter(row=>row.sensitivity!=='internal'&&!(row.model==='/aml'&&row.template&&row.sensitivity!=='customer')).map(row=>{
  const safe=row.model==='/aml'?Object.fromEntries(Object.entries(row).filter(([key])=>['id','title','model','state','createdAt','updatedAt','finalizedAt','template','sensitivity','copiedFrom','importedFrom'].includes(key))):{...row};
  safe.envelope=customerEnvelope(row.envelope);
  return safe;
 });
 result.recovery=result.recovery.filter(row=>row.model!=='/aml');
 for(const [model,id] of Object.entries(result.active))if(!result.documents.some(row=>row.id===id))delete result.active[model];
 retainTemplateAssets(result);
 return result;
}
export function exportArchive(storage,{includeInternal=false}={}){
 const data=readArchive(storage);return JSON.stringify(includeInternal?data:customerArchive(data),null,2);
}
export function exportDocument(row,archive,{includeInternal=false}={}){
 const result={schema:1,documents:[clone(row)],people:[],properties:[],active:{},recovery:[],...(archive.assets?{assets:clone(archive.assets)}:{})};
 retainTemplateAssets(result);return JSON.stringify(includeInternal?result:customerArchive(result),null,2);
}
/** Collisions create new records; import can never mutate an existing final snapshot. */
export function importArchive(storage,text){
 const imported=JSON.parse(text),temporary={getItem:()=>JSON.stringify(imported)};
 readArchive(temporary);
 const before=storage.getItem(ARCHIVE_KEY),archive=readArchive(storage);
 for(const row of imported.documents){
  const collision=archive.documents.some(item=>item.id===row.id);
  archive.documents.push({...clone(row),envelope:ensureEnvelopeRecordIds(row.envelope),...(row.template?{template:packTemplate(archive,resolveTemplate(row.template,imported))}:{}),...(row.model==='/aml'&&row.state==='final'&&!row.sensitivity?{sensitivity:'internal'}:{}),...(collision?{id:recordId(),importedFrom:row.id,title:row.title+' — importato'}:{})});
 }
 for(const kind of ['people','properties','recovery'])for(const row of imported[kind]){
  if(!object(row)||typeof row.id!=='string')throw Error('Record importato non valido. Nessun dato è stato sovrascritto.');
  archive[kind].push({...clone(row),...(archive[kind].some(item=>item.id===row.id)?{id:recordId(kind),importedFrom:row.id}:{})});
 }
 // Future top-level payloads survive an export/import round trip without affecting active drafts.
 for(const [key,value] of Object.entries(imported))if(key!=='assets'&&!Object.hasOwn(archive,key))archive[key]=clone(value);
 writeArchive(storage,archive,before);
 return imported.documents.length;
}
export function saveSharedRecord(storage,kind,record,label){
 if(!['people','properties'].includes(kind))throw Error('Tipo di archivio non riconosciuto.');
 const before=storage.getItem(ARCHIVE_KEY),archive=readArchive(storage);
 // Always save a new version: existing documents and library records are never silently rewritten.
 const row={id:recordId(kind==='people'?'person':'property'),label:String(label||'').trim()||'Senza nome',data:clone(record),createdAt:timestamp()};
 archive[kind].push(row);writeArchive(storage,archive,before);return row;
}
export function rawRecovery(storage){
 const items={};
 for(let index=0;index<storage.length;index++){const key=storage.key(index);if(key===ARCHIVE_KEY||key?.startsWith(DRAFT_PREFIX))items[key]=storage.getItem(key);}
 return JSON.stringify({format:'contrax.raw-recovery',schema:1,createdAt:timestamp(),items},null,2);
}
