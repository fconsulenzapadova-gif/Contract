import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeClosingData, sourceDocuments, fromSource, applySource, validateRelease, validateKeyReturn, signatureNames } from '../production/src/ClosingData.js';

const store = entries => ({getItem:key => entries[key] ?? null});
const draft = (model,slots) => JSON.stringify({schema:1,model,slots});
const key = model => 'gemut.contract.draft.v1:'+model;
test('source list reports corrupt drafts and preserves other models',()=>{
 const sources=sourceDocuments(store({[key('/sales-assign')]:'{bad',[key('/purchase-proposal')]:draft('/purchase-proposal',{document:{p1Nome:'Mario'}})}));
 assert.equal(sources.documents.length,1);
 assert.equal(sources.errors.length,1);
 assert.equal(sources.documents[0].model,'/purchase-proposal');
});
test('purchase source recovers multiple people, references and full property address',()=>{
 const data=fromSource('/purchase-proposal',{document:{immComune:'Padova',immVia:'Via Roma',immCivico:'12',placeDate:'Padova, 20/10/2026'},buyers:[{nome:'Mario Rossi',cognome:'Rossi',cf:'RSS'}],owners:[{nome:'Lucia Bianchi',cf:'BNC'},{nome:'Paolo Verdi',cf:'VRD'}]});
 assert.equal(data.clients,'Mario Rossi · C.F. RSS');
 assert.equal(data.owners,'Lucia Bianchi · C.F. BNC\nPaolo Verdi · C.F. VRD');
 assert.match(data.address,/Via Roma 12.*Padova/);
 assert.equal(data.originalDate,'Padova, 20/10/2026');
 assert.equal(data.proposalStatus,'unknown');
});
test('assignment source preserves contributors and property units without importing financial terms',()=>{
 const data=fromSource('/sales-assign',{document:{nome:'Conferente principale',cf:'AAA',indirizzo:'Via Vecchia 1',dataFirma:'20/10/2026',prezzo:'300000'},contributors:[{nome:'Secondo conferente',cf:'BBB'}],units:[{comune:'Padova',via:'Via Nuova',numero:'2',tipo:'principale'},{comune:'Padova',via:'Via Nuova',numero:'4',tipo:'garage'}]});
 assert.match(data.clients,/Conferente principale.*AAA\nSecondo conferente.*BBB/);
 assert.match(data.address,/Via Nuova 2/);
 assert.match(data.address,/Via Nuova 4/);
 assert.equal(data.kind,'sales-assignment');
 assert.equal(data.prezzo,undefined);
});
test('release requires an identified document and rejects accepted or unknown proposals',()=>{
 const data={kind:'purchase-proposal',clients:'Mario',owners:'Lucia',address:'Via Roma 1',originalDate:'20/10/2026',reference:'P-01',placeDate:'Padova, 30/10/2026',agent:'Agente autorizzato',proposalStatus:'unknown'};
 assert.match(validateRelease(data).join(' '),/non accettata/);
 assert.match(validateRelease({...data,proposalStatus:'accepted'}).join(' '),/già accettata/);
 assert.deepEqual(validateRelease({...data,proposalStatus:'not-accepted'}),[]);
 assert.match(validateRelease({...data,kind:'sales-assignment',reference:''}).join(' '),/riferimento/);
 assert.deepEqual(validateRelease({...data,kind:'sales-assignment',owners:''}),[]);
 assert.match(validateRelease({...data,kind:'invented'}).join(' '),/tipo/);
});
test('key return requires actual receipt authority and never invents key quantities',()=>{
 const data={clients:'Mario',owners:'Lucia',address:'Via Roma',reference:'Contratto 1',originalDate:'20/10/2026',agent:'Anna',authorization:'',placeDate:'Padova',returnDate:'30/10/2026',returnTime:'10:00',returnPlace:'Padova',keys:[{label:'Porta',quantity:'2',notes:''}]};
 assert.match(validateKeyReturn(data).join(' '),/autorizzazione/);
 assert.deepEqual(validateKeyReturn({...data,authorization:'Delega del 29/10/2026'}),[]);
 assert.match(validateKeyReturn({...data,authorization:'Delega',keys:[{label:'Porta',quantity:'-1'}]}).join(' '),/quantità/);
 assert.match(validateKeyReturn({...data,authorization:'Delega',keys:[]}).join(' '),/chiave/);
});
test('signature names retain each distinct person and preserve long or accented names',()=>{
 assert.deepEqual(signatureNames('Anna D’Angelo · C.F. AAA\n\nMario Rossi · C.F. BBB'),['Anna D’Angelo · C.F. AAA','Mario Rossi · C.F. BBB']);
 assert.deepEqual(signatureNames(''),[]);
});
test('current purchase template wins over old proposal data and old single-party records',()=>{
 const data=fromSource('/purchase-proposal',{document:{p1Nome:'Nome precedente',immVia:'Via precedente'},buyers:[{nome:'Persona precedente'}],owners:[{nome:'Vecchia proprietà'}],purchaseTemplate:{p1Nome:'Proponente attuale',p1CF:'NUOVO',vNome:'Proprietà attuale',vCF:'NUOVO2',immVia:'Via Attuale',immCivico:'20',immComune:'Padova',placeDate:'25/10/2026'}});
 assert.equal(data.clients,'Proponente attuale · C.F. NUOVO');
 assert.equal(data.owners,'Proprietà attuale · C.F. NUOVO2');
 assert.match(data.address,/Via Attuale 20/);
 assert.equal(data.originalDate,'25/10/2026');
});
test('changing source clears the old receipt facts, authority and confirmed proposal status',()=>{
 const previous={agent:'Operatore GEMÜT',authorization:'Delega proprietà A',returnDate:'01/10/2026',returnTime:'10:00',returnPlace:'Luogo precedente',observations:'Danni proprietà A',attachments:'Allegati A',keys:[{label:'Porta A',quantity:'4'}],reference:'Contratto A',placeDate:'Data precedente',proposalStatus:'not-accepted'};
 const next=applySource(previous,'/lease-contract-4-4',{document:{dataFirma:'20/10/2026'},tenants:[{nome:'Inquilino B'}],landlords:[{nome:'Proprietà B'}]});
 for(const key of ['authorization','returnDate','returnTime','returnPlace','observations','attachments','reference','placeDate'])assert.equal(next[key],'',key);
 assert(next.keys.every(key=>key.quantity===''));
 assert.equal(next.clients,'Inquilino B');
 assert.equal(next.owners,'Proprietà B');
 assert.equal(next.agent,'Operatore GEMÜT');
 assert.equal(next.proposalStatus,'unknown');
 assert.equal(previous.keys[0].quantity,'4');
});


test('live normalization preserves spaces and newlines while typing people and observations',()=>{
 const value=normalizeClosingData({clients:'Anna Rossi \n',observations:'  Riga uno\n\n',keys:[{id:'porta',label:'Porta ',quantity:'2',notes:'Nota in corso '} ]});
 assert.equal(value.clients,'Anna Rossi \n');
 assert.equal(value.observations,'  Riga uno\n\n');
 assert.equal(value.keys[0].notes,'Nota in corso ');
});
test('lease proposal source recovers its native single-line property field',()=>{
 assert.equal(fromSource('/lease-proposal',{document:{immUbicazione:'Via Prove 5, Padova'}}).address,'Via Prove 5, Padova');
});

test('key receipt time requires a valid hour and minute',()=>{
 const data={clients:'Cliente',owners:'Locatore',address:'Via Prove',reference:'L-1',originalDate:'01/10/2026',agent:'Consulente',authorization:'Delega',placeDate:'Padova',returnDate:'30/10/2026',returnTime:'25:80',returnPlace:'Padova',keys:[{label:'Porta',quantity:'1'}]};
 assert.match(validateKeyReturn(data).join(' '),/ora.*hh:mm/);
 assert.deepEqual(validateKeyReturn({...data,returnTime:'10:30'}),[]);
});
