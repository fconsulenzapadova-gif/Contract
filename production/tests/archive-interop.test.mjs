import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEnvelope,ARCHIVE_KEY,draftKey,readArchive,readEnvelope,saveDocument,openDocument,startDocument,replaceDraft,recoverLegacyDrafts,exportArchive,importArchive,preserveUnknown,saveSharedRecord,rawRecovery,resolveTemplate,exportDocument} from '../src/ContractArchive.js';
import {writeDraft,readDraft,exportDraft,importDraft} from '../src/ContractDraft.js';
import {MODELS,modelAdapter,documentFacts,encodeParty,decodeParty,planDocumentImport,planPartyCallbacks} from '../src/DocumentInterop.js';
const store=()=>{const values=new Map();return {values,get length(){return values.size;},key:index=>[...values.keys()][index],getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};};
const envelope=(model,slots)=>({schema:1,model,slots,futureEnvelope:{version:7}});
const source=envelope('/lease-proposal',{document:{canoneAnnuo:'9.600',cauzioneImporto:'1.600',depositoImporto:'500',decorrenzaDal:'01/11/2026',decorrenzaAl:'31/10/2027',pattiExtra:'DO NOT TRANSFER LEGAL TEXT'},owners:[{id:'owner-a',nome:'Mario Rossi',cf:'OWNER',sesso:'M',futurePerson:{keep:true}}],proposers:[{id:'tenant-a',nome:'Maria Luisa De Rossi',natoIl:'01/02/1990',cf:'TENANT',telefono:'123'}],units:[{id:'flat-a',tipo:'principale',comune:'Padova',via:'Via Roma',numero:'8',foglio:'2',particella:'4',subalterno:'6'}],unknownSlot:{contents:['keep']}});

test('named documents auto-save independently and duplication preserves record IDs and future fields',()=>{
 const s=store();s.setItem(draftKey(source.model),JSON.stringify(source));
 const first=saveDocument(s,source.model,'Prima proposta');
 writeDraft(s,source.model,'document',{...source.slots.document,canoneAnnuo:'10.000'});
 assert.equal(readArchive(s).documents[0].envelope.slots.document.canoneAnnuo,'10.000');
 const second=openDocument(s,first.id,{duplicate:true});assert.notEqual(first.id,second.id);assert.equal(second.envelope.slots.owners[0].id,'owner-a');
 writeDraft(s,source.model,'document',{canoneAnnuo:'12.000'});
 const rows=readArchive(s).documents;assert.equal(rows[0].envelope.slots.document.canoneAnnuo,'10.000');assert.equal(rows[1].envelope.slots.document.canoneAnnuo,'12.000');
 assert.deepEqual(rows[1].envelope.slots.unknownSlot,{contents:['keep']});assert.deepEqual(rows[1].envelope.futureEnvelope,{version:7});
 assert.equal(readArchive(s).recovery.some(row=>row.raw.includes('10.000')),true);
});

test('a finalized snapshot cannot be opened or overwritten; creating a mutable copy leaves data/template unchanged',()=>{
 const s=store();s.setItem(draftKey(source.model),JSON.stringify(source));
 const final=saveDocument(s,source.model,'Firmabile',{finalize:true,template:{schema:1,html:'<p>FROZEN MODEL</p>',css:'p{color:black}'}});
 assert.throws(()=>saveDocument(s,source.model,'Override',{id:final.id}),/immutabile/);
 assert.throws(()=>openDocument(s,final.id),/finalizzata/);
 const copy=openDocument(s,final.id,{duplicate:true});writeDraft(s,source.model,'document',{canoneAnnuo:'1'});
 assert.equal(copy.state,'draft');assert.equal(readArchive(s).documents[0].envelope.slots.document.canoneAnnuo,'9.600');assert.equal(readArchive(s).documents[0].template.html,'<p>FROZEN MODEL</p>');
});

test('legacy path drafts and before-import bytes remain recoverable without changing original keys',()=>{
 const s=store(),raw=JSON.stringify(source);s.setItem(draftKey(source.model),raw);
 const migration=recoverLegacyDrafts(s);assert.equal(migration.count,1);assert.equal(s.getItem(draftKey(source.model)),raw);assert.equal(recoverLegacyDrafts(s).count,0);
 importDraft(s,source.model,JSON.stringify(envelope(source.model,{future:[1,2,3]})));
 assert.equal(s.getItem(draftKey(source.model)+':before-import'),raw);assert.equal(readArchive(s).recovery[0].raw,raw);
 assert.deepEqual(readEnvelope(s,source.model).slots.future,[1,2,3]);assert.match(rawRecovery(s),/before-import/);
});

test('archive export/import creates copies on collision and retains arbitrary slots and future metadata',()=>{
 const s=store();s.setItem(draftKey(source.model),JSON.stringify(source));const row=saveDocument(s,source.model,'Proposta');
 const archive=readArchive(s);archive.futureArchive={something:'retained'};s.setItem(ARCHIVE_KEY,JSON.stringify(archive));
 const raw=exportArchive(s);assert.equal(importArchive(s,raw),1);const result=readArchive(s);
 assert.equal(result.documents.length,2);assert.equal(result.documents[0].id,row.id);assert.notEqual(result.documents[1].id,row.id);
 assert.deepEqual(result.documents[1].envelope.slots.unknownSlot,source.slots.unknownSlot);assert.equal(result.futureArchive.something,'retained');
});

test('quota failures and corrupted data never silently replace the working draft or archive',()=>{
 const s=store();s.setItem(draftKey(source.model),JSON.stringify(source));saveDocument(s,source.model,'Current');
 const beforeDraft=s.getItem(draftKey(source.model)),beforeArchive=s.getItem(ARCHIVE_KEY),original=s.setItem;
 s.setItem=(key,value)=>{if(key===ARCHIVE_KEY)throw Error('QuotaExceededError');return original(key,value);};
 assert.throws(()=>writeDraft(s,source.model,'document',{canoneAnnuo:'LOST'}),/Quota/);assert.equal(s.getItem(draftKey(source.model)),beforeDraft);assert.equal(s.getItem(ARCHIVE_KEY),beforeArchive);
 s.setItem=original;s.setItem(draftKey(source.model),'{broken');assert.throws(()=>writeDraft(s,source.model,'document',{}));assert.equal(s.getItem(draftKey(source.model)),'{broken');
 s.setItem(draftKey(source.model),beforeDraft);s.setItem(ARCHIVE_KEY,'{broken');assert.throws(()=>writeDraft(s,source.model,'document',{}));assert.equal(s.getItem(draftKey(source.model)),beforeDraft);assert.equal(s.getItem(ARCHIVE_KEY),'{broken');
});

test('failed document switching restores archive and leaves current draft unchanged',()=>{
 const s=store();s.setItem(draftKey(source.model),JSON.stringify(source));const row=saveDocument(s,source.model,'Current');const before=s.getItem(ARCHIVE_KEY),raw=s.getItem(draftKey(source.model)),original=s.setItem;
 s.setItem=(key,value)=>{if(key===draftKey(source.model))throw Error('Quota');return original(key,value);};
 assert.throws(()=>openDocument(s,row.id,{duplicate:true}),/non riuscito/);assert.equal(s.getItem(ARCHIVE_KEY),before);assert.equal(s.getItem(draftKey(source.model)),raw);
});

test('a stale import preview is rejected, with no modifications',()=>{
 const s=store();s.setItem(draftKey(source.model),JSON.stringify(source));const before=s.getItem(draftKey(source.model));writeDraft(s,source.model,'document',{changed:true});
 const changed=s.getItem(draftKey(source.model));assert.throws(()=>replaceDraft(s,source.model,source,'Import',before),/cambiato/);assert.equal(s.getItem(draftKey(source.model)),changed);
});

test('proposal-to-contract mapping previews replacements and keeps names, economics and IDs attached to the selected role',()=>{
 const facts=documentFacts(source),target=envelope('/lease-contract-students',{document:{canoneAnnuo:'old',depositoCauzionale:'old'},landlords:[{id:'existing',nome:'Previous',future:'keep'}],tenants:[],units:[],unknown:{retain:true}});
 const result=planDocumentImport(target,facts,{parties:[{sourceId:'owner-a',role:'landlords',targetId:'existing'},{sourceId:'tenant-a',role:'tenants',targetId:'new'}],properties:['flat-a'],includeFacts:true});
 assert.equal(result.envelope.slots.landlords[0].id,'existing');assert.equal(result.envelope.slots.landlords[0].nome,'Mario Rossi');assert.equal(result.envelope.slots.landlords[0].future,'keep');assert.equal(result.envelope.slots.tenants[0].nome,'Maria Luisa De Rossi');
 assert.equal(result.envelope.slots.document.depositoCauzionale,'1.600');assert.equal(result.envelope.slots.document.durataDal,'01/11/2026');assert.equal(result.envelope.slots.document.canoneAnnuo,'9.600');assert.equal(result.envelope.slots.document.pattiExtra,undefined);
 assert.equal(result.envelope.slots.units[0].id,'flat-a');assert(result.operations.some(op=>op.previous==='old'&&op.replacement));assert.deepEqual(target.slots.landlords[0].nome,'Previous');
});

test('all sixteen modules have shared adapters and receive only pertinent identity/property facts',()=>{
 assert.equal(Object.keys(MODELS).length,16);
 for(const model of Object.keys(MODELS)){
  const adapter=modelAdapter(model),result=planDocumentImport(envelope(model,{}),documentFacts(source),{parties:[{sourceId:'tenant-a',role:adapter.roles[0][0],targetId:'new'}],properties:['flat-a'],includeFacts:true});
  assert(result.operations.length>0,model);assert(!JSON.stringify(result.envelope).includes('DO NOT TRANSFER LEGAL TEXT'));
 }
});

test('AML confidential values stay local and out of default exports, library facts, and downstream module imports',()=>{
 const s=store(),data=envelope('/aml',{document:{subjectType:'physical',nome:'Marco',cognome:'Rossi',name:'Marco Rossi',cf:'TESTCF',residenza:'Padova',telefono:'333',verification:'PRIVATE_VERIFICATION',risk:'PRIVATE_RISK',outcome:'PRIVATE_OUTCOME',funds:'PRIVATE_FUNDS',pep:'PRIVATE_PEP',sospetti:'UNKNOWN_RESERVED',nested:{SOS:'UNKNOWN_NESTED_RESERVED'}},future:{keep:true,notesRisk:'UNKNOWN_SLOT_RESERVED'},representatives:[{id:'rep',nome:'Rappresentante',notesRisk:'UNKNOWN_PERSON_RESERVED'}]});
 s.setItem(draftKey('/aml'),JSON.stringify(data));saveDocument(s,'/aml','AML');
 const safe=exportDraft(s,'/aml');assert(!safe.includes('PRIVATE_RISK'));assert(!safe.includes('PRIVATE_OUTCOME'));assert(!safe.includes('UNKNOWN_'));assert(exportDraft(s,'/aml',{includeInternal:true}).includes('PRIVATE_RISK'));
 const snapshot=saveDocument(s,'/aml','Internal',{finalize:true,sensitivity:'internal',template:{html:'PRIVATE_RISK',css:'p{}'}});
 assert(!exportArchive(s).includes('PRIVATE_RISK'));assert(!exportArchive(s).includes('UNKNOWN_'));assert(exportArchive(s,{includeInternal:true}).includes('PRIVATE_RISK'));assert(!JSON.parse(exportArchive(s)).documents.some(row=>row.id===snapshot.id));
 const facts=documentFacts(data),raw=JSON.stringify(facts);assert(!raw.includes('PRIVATE_'));assert.equal(facts.parties[0].data.nome,'Marco');assert.equal(facts.parties[0].data.domicilioComune,'Padova');
 saveSharedRecord(s,'people',facts.parties[0].data,'Marco');assert(!JSON.stringify(readArchive(s).people).includes('PRIVATE_'));
 const imported=planDocumentImport(envelope('/commission',{}),facts,{parties:[{sourceId:'/aml-client',role:'client'}]});assert(!JSON.stringify(imported.envelope).includes('PRIVATE_'));assert.equal(imported.envelope.slots.document.name,'Marco Rossi');
});

test('structured clipboard is versioned, keeps aggregated raw names intact, and cannot inject AML internals',()=>{
 const rawName='ROSSI MARIO e BIANCHI ANNA — testo aggregato originale',person=decodeParty(encodeParty({id:'stable',nome:rawName,risk:'DO NOT COPY',cognome:''}));
 assert.equal(person.nome,rawName);assert.equal(person.rawName,rawName);assert.equal(person.cognome,'');assert.equal(person.risk,undefined);assert.throws(()=>decodeParty('{"format":"contrax.party","schema":2}'),/non riconosciuti/);
 assert.deepEqual(preserveUnknown({known:'old',unknown:{a:1},rows:[{id:'a',future:{yes:true}}]},{known:'new',rows:[{id:'a',nome:'X'}]}),{known:'new',unknown:{a:1},rows:[{id:'a',nome:'X',future:{yes:true}}]});
});

test('callback imports target only chosen controls and respect explicit dates without inferring names',()=>{
 const calls=[],target={fields:{fullName:{value:'Old',label:'Name',props:{name:'nome',onChange:event=>calls.push(event.target.value)}},birthDate:{value:'',label:'Date',props:{name:'natoIl',type:'date',onChange:event=>calls.push(event.target.value)}}}};
 const operations=planPartyCallbacks(target,{nome:'Maria Luisa De Rossi',natoIl:'02/01/1990'});assert.equal(operations[0].replacement,true);assert.equal(operations[1].value,'1990-01-02');assert.equal(calls.length,0);
});

test('portable people retain independent residence/domicile and full document metadata without replacing legacy AML text',()=>{
 const values={id:'details',nome:'Nome completo originale',residenza:'Padova, via Roma 1',domicilio:'Venezia, via Verdi 2',ci:'Legacy card description',documentType:'Carta di identità',documentNumber:'CA1234567',documentIssuer:'Comune di Padova',documentIssuedOn:'2020-01-02',documentExpiresOn:'2030-01-02'};
 const copied=decodeParty(encodeParty(values));for(const [key,value]of Object.entries(values))assert.equal(copied[key],value,key);
 const facts={format:'contrax.document-facts',schema:1,model:'library',parties:[{id:'details',role:'client',data:copied}],properties:[],facts:{}};
 const result=planDocumentImport(envelope('/aml',{document:{name:'Legacy aggregated name',identity:'Legacy identity never parsed',id:'Legacy identity document'}}),facts,{parties:[{sourceId:'details',role:'client'}]});
 assert.equal(result.envelope.slots.document.residenza,values.residenza);assert.equal(result.envelope.slots.document.domicilio,values.domicilio);assert.equal(result.envelope.slots.document.documentNumber,values.documentNumber);assert.equal(result.envelope.slots.document.identity,'Legacy identity never parsed');assert.equal(result.envelope.slots.document.name,'Legacy aggregated name');assert.equal(result.envelope.slots.document.id,'Legacy identity document');
 const outgoing=documentFacts(result.envelope).parties[0].data;assert.equal(outgoing.residenza,values.residenza);assert.equal(outgoing.domicilio,values.domicilio);assert.equal(outgoing.documentExpiresOn,values.documentExpiresOn);
});


test('finalized snapshots deduplicate immutable assets and a standalone export reimports with every resource',()=>{
 const s=store();s.setItem(draftKey(source.model),JSON.stringify(source));
 const image='data:image/png;base64,QUJDREVGRw==',font='data:font/ttf;base64,SElKS0w=',css=`@font-face{font-family:Paper;src:url("${font}")} p{color:black}`;
 const one=saveDocument(s,source.model,'One',{finalize:true,template:{html:`<p>One<img src="${image}"></p>`,css}});
 const count=Object.keys(readArchive(s).assets).length;
 const two=saveDocument(s,source.model,'Two',{finalize:true,template:{html:`<p>Two<img src="${image}"></p>`,css}});
 const archive=readArchive(s);assert.equal(Object.keys(archive.assets).length,count);assert.equal(one.template.cssRef,two.template.cssRef);assert.equal(resolveTemplate(two.template,archive).html,`<p>Two<img src="${image}"></p>`);
 const file=exportDocument(two,archive),target=store();importArchive(target,file);const imported=readArchive(target),resolved=resolveTemplate(imported.documents[0].template,imported);assert.equal(resolved.css,css);assert(resolved.html.includes(image));assert.equal(imported.documents.length,1);
});

test('sales assignment transfers the selected conferent to seller, its property and previewed asking price to a purchase proposal',()=>{
 const source=envelope('/sales-assign',{document:{nome:'Ada Venditrice',cf:'ADACF',residenza:'Padova',prezzo:'250000',note:'ASSIGNMENT_ONLY_TERMS'},contributors:[{id:'contributor-2',nome:'Altro conferente'}],units:[{id:'sales-property',comune:'Padova',via:'Via delle Rose',numero:'7',foglio:'11',particella:'22',subalterno:'33'}]});
 const facts=documentFacts(source),target=envelope('/purchase-proposal',{purchaseTemplate:{vNome:'Venditore precedente',p1Nome:'Proponente già compilato',conditions:'CONDIZIONI PROPRIE'}});
 const result=planDocumentImport(target,facts,{parties:[{sourceId:'/sales-assign-client',role:'owners'}],properties:['sales-property'],includeFacts:true});
 assert.equal(result.envelope.slots.purchaseTemplate.vNome,'Ada Venditrice');assert.equal(result.envelope.slots.purchaseTemplate.vCF,'ADACF');assert.equal(result.envelope.slots.purchaseTemplate.p1Nome,'Proponente già compilato');assert.equal(result.envelope.slots.purchaseTemplate.prezzoOfferto,'250000');assert.equal(result.envelope.slots.purchaseTemplate.c1M,'22');assert.equal(result.envelope.slots.purchaseTemplate.conditions,'CONDIZIONI PROPRIE');assert(!JSON.stringify(result.envelope).includes('ASSIGNMENT_ONLY_TERMS'));assert(result.operations.some(op=>op.previous==='Venditore precedente'&&op.replacement));
});

test('lease assignment transfers a selected owner and property to lease proposal without treating requested monthly rent as purchase price or annual rent',()=>{
 const facts=documentFacts(envelope('/lease-assign',{document:{nome:'Luca Locatore',cf:'LUCACF',prezzo:'800'},units:[{id:'lease-assignment-property',comune:'Venezia',via:'Via Verdi',numero:'9',foglio:'41',particella:'42',subalterno:'43'}]}));
 assert.equal(facts.facts.monthlyRent,'800');assert.equal(facts.facts.price,undefined);assert.equal(facts.facts.annualRent,undefined);
 const result=planDocumentImport(envelope('/lease-proposal',{owners:[{id:'existing-owner',nome:'Prima'}],document:{canoneAnnuo:'9600',cauzioneImporto:'2400'}}),facts,{parties:[{sourceId:'/lease-assign-client',role:'owners',targetId:'existing-owner'}],properties:['lease-assignment-property'],includeFacts:true});
 assert.equal(result.envelope.slots.owners[0].nome,'Luca Locatore');assert.equal(result.envelope.slots.owners[0].id,'existing-owner');assert.equal(result.envelope.slots.document.canoneAnnuo,'9600');assert.equal(result.envelope.slots.document.cauzioneImporto,'2400');assert.equal(result.envelope.slots.units[0].comune,'Venezia');
});

test('the exact purchase proposal transfers only the explicitly selected proposer to fee/AML/contact modules',()=>{
 const facts=documentFacts(envelope('/purchase-proposal',{purchaseTemplate:{vNome:'Ada Venditrice',vCF:'OWNER_CF',p1Nome:'Leo Acquirente',p1CF:'BUYER_CF',p1ResidenteA:'Roma',p1Via:'Via Blu 4',p1Email:'leo@example.test',immComune:'Padova',immVia:'Via Rosa',immCivico:'8',prezzoOfferto:'225000',conditions:'LEGAL_CONDITION_NOT_TRANSFERRED'},owners:[{id:'stale-owner',nome:'Legacy seller should not replace current PDF data'}]}));
 assert.equal(facts.parties.length,2);assert.equal(facts.parties.find(row=>row.role==='owners').data.nome,'Ada Venditrice');
 for(const model of ['/commission','/aml','/visit-sheet','/property-sharing']){
  const result=planDocumentImport(envelope(model,{}),facts,{parties:[{sourceId:'/purchase-proposal-buyers',role:'client'}],properties:['/purchase-proposal-property'],includeFacts:true}),data=result.envelope.slots.document;
  assert.equal(data.name,'Leo Acquirente',model);assert.equal(data.email,'leo@example.test',model);assert(!JSON.stringify(data).includes('OWNER_CF'),model);assert(!JSON.stringify(data).includes('LEGAL_CONDITION_NOT_TRANSFERRED'),model);assert((data.operation||data.address).includes('Via Rosa'),model);
 }
});

test('concordato transfers the chosen tenant and selected cadastral units to Allegato B without changing zone/quality calculations',()=>{
 const facts=documentFacts(envelope('/lease-contract-concordato',{tenants:[{id:'concordato-tenant',nome:'Elena Conduttrice'}],landlords:[{id:'concordato-owner',nome:'Carlo Locatore'}],units:[{id:'concordato-main',comune:'Padova',via:'Via Gialla',numero:'12',foglio:'101',particella:'202',subalterno:'303'},{id:'concordato-garage',tipo:'garage',mainUnitId:'concordato-main',comune:'Padova',foglio:'101',particella:'202',subalterno:'304'}],document:{canoneAnnuo:'12000'}}));
 const original=envelope('/lease-allegato-b',{allegatoFields:{richiedente:'Richiedente precedente',cat1Foglio:'999',supCalp01:'120'},allegatoChecks:{zonaC:true,tipologia1b:true},futureSlot:{keep:'YES'}});
 const result=planDocumentImport(original,facts,{parties:[{sourceId:'concordato-tenant',role:'client'}],properties:['concordato-main','concordato-garage'],includeFacts:true});
 assert.equal(result.envelope.slots.allegatoFields.richiedente,'Elena Conduttrice');assert.equal(result.envelope.slots.allegatoFields.indirizzoAlloggio,'Via Gialla 12');assert.equal(result.envelope.slots.allegatoFields.cat1Foglio,'101');assert.equal(result.envelope.slots.allegatoFields.cat2Subalterno,'304');assert.equal(result.envelope.slots.allegatoFields.supCalp01,'120');assert.deepEqual(result.envelope.slots.allegatoChecks,original.slots.allegatoChecks);assert.deepEqual(result.envelope.slots.futureSlot,original.slots.futureSlot);assert(result.operations.some(op=>op.previous==='999'&&op.replacement));
});

test('imported models cannot navigate outside the local application',()=>{
 for(const model of ['//example.invalid','/\\example.invalid','/path?redirect=https://example.invalid','https://example.invalid'])assert.throws(()=>validateEnvelope(envelope(model,{})),/modello|formato/);
 assert.equal(validateEnvelope(envelope('/lease-contract-4-4',{})).model,'/lease-contract-4-4');
});


test('closing adapters preserve literal party text and transfer only selected facts, never closure or receipt attestations',()=>{
 const input=envelope('/key-return',{document:{clients:'Anna Rossi · C.F. AAA\nMario Bianchi · C.F. BBB',owners:'Proprietà',address:'Via Prove 4',authorization:'PRIVATE_AUTHORITY',keys:[{quantity:'2'}],observations:'PRIVATE_RECEIPT'}});
 const facts=documentFacts(input);
 assert.equal(facts.parties[0].data.nome,input.slots.document.clients);
 assert.equal(facts.properties[0].data.via,'Via Prove 4');
 assert(!JSON.stringify(facts).includes('PRIVATE_'));
 const result=planDocumentImport(envelope('/practice-release',{document:{proposalStatus:'not-accepted'}}),documentFacts(source),{parties:[{sourceId:'tenant-a',role:'clients'}],properties:['flat-a'],includeFacts:true});
 assert.equal(result.envelope.slots.document.clients,'Maria Luisa De Rossi · C.F. TENANT');
 assert.equal(result.envelope.slots.document.address,'Padova · Via Roma · 8');
 assert.equal(result.envelope.slots.document.proposalStatus,'unknown');
 assert.equal(result.envelope.slots.document.authorization,undefined);
 assert.equal(result.envelope.slots.document.reference,undefined);
});

test('closing archive import combines every selected person per role and previews the full replacement',()=>{
 const multiple=structuredClone(source);
 multiple.slots.proposers.push({id:'tenant-b',nome:'Anna Bianchi',cf:'SECOND'});
 const target=envelope('/practice-release',{document:{clients:'Vecchio cliente',owners:'Vecchia proprietà',proposalStatus:'not-accepted'}});
 const result=planDocumentImport(target,documentFacts(multiple),{parties:[{sourceId:'tenant-a',role:'clients'},{sourceId:'tenant-b',role:'clients'},{sourceId:'owner-a',role:'owners'}]});
 assert.equal(result.envelope.slots.document.clients,'Maria Luisa De Rossi · C.F. TENANT\nAnna Bianchi · C.F. SECOND');
 assert.equal(result.envelope.slots.document.owners,'Mario Rossi · C.F. OWNER');
 assert.equal(result.envelope.slots.document.proposalStatus,'unknown');
 assert(result.operations.some(op=>op.previous==='Vecchio cliente'&&op.value.includes('Anna Bianchi')&&op.replacement));
 assert.equal(target.slots.document.clients,'Vecchio cliente');
});
