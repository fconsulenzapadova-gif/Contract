import test from 'node:test';
import assert from 'node:assert/strict';
import {extractIdentity, validateField, mrzCheckDigit, isExpired} from '../src/IdentityData.js';
import {validateFiles} from '../src/IdentityFiles.js';
import {collectTargets, planImport, applyImport} from '../src/IdentityTargets.js';

const now = new Date('2026-10-02T12:00:00Z');
const card = `CARTA DI IDENTITA
COGNOME / SURNAME
ROSSI
NOME / NAME
MARIO
LUOGO DI NASCITA
ROMA
DATA DI NASCITA
01.01.1980
NUMERO DOCUMENTO: CA12345AB
RILASCIO: 02.03.2020
SCADENZA: 01.01.2030
RILASCIATO DA: COMUNE DI ROMA
CODICE FISCALE: RSSMRA80A01H501U`;

test('card extracts labelled fields without inventing missing residence', () => {
 const r=extractIdentity([{text:card,confidence:96}], 'card', now);
 assert.equal(r.fields.surname.value,'ROSSI'); assert.equal(r.fields.givenNames.value,'MARIO');
 assert.equal(r.fields.birthDate.value,'1980-01-01');assert.equal(r.fields.birthPlace.value,'ROMA');
 assert.equal(r.fields.documentNumber.value,'CA12345AB');assert.equal(r.fields.issuer.value,'COMUNE DI ROMA');
 assert.equal(r.fields.taxCode.value,'RSSMRA80A01H501U'); assert.equal(r.fields.residence.status,'absent');
 assert.equal(r.fields.birthDate.confirmed,false); assert.equal(r.expired,false);
});
test('licence uses numbered labels and never treats expiry as birth date',()=>{
 const r=extractIdentity([{text:'1. ROSSI\n2. MARIO\n3. 01.01.1980 ROMA\n4a. 02.03.2020\n4b. 01.01.2030\n4c. MIT-UCO\n5. RM1234567A',confidence:94}],'licence',now);
 assert.equal(r.fields.surname.value,'ROSSI');assert.equal(r.fields.birthDate.value,'1980-01-01');
 assert.equal(r.fields.expiryDate.value,'2030-01-01');assert.equal(r.fields.documentNumber.value,'RM1234567A');
});
test('ICAO passport MRZ validates and extracts specimen fields',()=>{
 const r=extractIdentity([{text:'P<UTOERIKSSON<<ANNA<MARIA'.padEnd(44,'<')+'\nL898902C36UTO7408122F1204159ZE184226B<<<<<10',confidence:97}],'passport',now);
 assert.equal(r.fields.surname.value,'ERIKSSON');assert.equal(r.fields.givenNames.value,'ANNA MARIA');
 assert.equal(r.fields.documentNumber.value,'L898902C3');assert.equal(r.fields.birthDate.value,'1974-08-12');
 assert.equal(r.expired,true);assert.equal(mrzCheckDigit('740812'),'2');
});
test('a wrong MRZ check digit is an inconsistency, not a verified number',()=>{
 const r=extractIdentity([{text:'P<UTOERIKSSON<<ANNA<MARIA'.padEnd(44,'<')+'\nL898902C35UTO7408122F1204159ZE184226B<<<<<10',confidence:97}],'passport',now);
 assert.equal(r.fields.documentNumber.status,'inconsistent');
});
test('a second valid MRZ from another person raises a conflict',()=>{
 const end='L898902C36UTO7408122F1204159ZE184226B<<<<<10';
 const r=extractIdentity([{text:'P<UTOERIKSSON<<ANNA<MARIA'.padEnd(44,'<')+'\n'+end,confidence:97},{text:'P<UTOROSSI<<MARIO'.padEnd(44,'<')+'\n'+end,confidence:97}],'passport',now);
 assert.equal(r.fields.surname.status,'inconsistent');assert.equal(r.fields.givenNames.status,'inconsistent');
});
test('MRZ fragments from different pages cannot combine into a verified document',()=>{
 const r=extractIdentity([{text:'P<UTOERIKSSON<<ANNA<MARIA'.padEnd(44,'<'),confidence:97},{text:'L898902C36UTO7408122F1204159ZE184226B<<<<<10',confidence:97}],'passport',now);
 assert.equal(r.fields.documentNumber.status,'missing');
});
test('low confidence and conflicting documents are visible per field',()=>{
 const low=extractIdentity([{text:card,confidence:32}],'card',now);
 assert.equal(low.fields.surname.status,'uncertain');
 const conflict=extractIdentity([{text:card,confidence:97},{text:'COGNOME: BIANCHI',confidence:98}],'card',now);
 assert.equal(conflict.fields.surname.status,'inconsistent');assert.match(conflict.fields.surname.message,/discordanti/);
});
test('empty recognition preserves empty fields and flags unreadable required data',()=>{
 const r=extractIdentity([{text:'',confidence:0}],'card',now);
 assert.equal(r.fields.surname.value,'');assert.equal(r.fields.surname.status,'missing');
 assert(r.warnings.length>0);
});
test('invalid dates and fiscal checksum are rejected but real dates are valid',()=>{
 assert(validateField('birthDate','1980-02-31',now));assert(validateField('birthDate','2030-01-01',now));
 assert.equal(validateField('birthDate','1980-01-01',now),'');
 assert(validateField('taxCode','RSSMRA80A01H501A',now));assert.equal(validateField('taxCode','RSSMRA80A01H501U',now),'');
});
test('PDF and image files are accepted; limits and unsafe formats are rejected',()=>{
 assert.equal(validateFiles([{name:'carta.pdf',type:'application/pdf',size:4000},{name:'retro.png',type:'image/png',size:8000}]),'');
 assert.match(validateFiles([{name:'huge.pdf',type:'application/pdf',size:11*1024*1024}]),/10/);
 assert.match(validateFiles(Array.from({length:5},()=>({name:'id.jpg',type:'image/jpeg',size:10}))),/4/);
 assert(validateFiles([{name:'id.svg',type:'image/svg+xml',size:10}]));
});

function field(name,value,onChange){return {type:'input',props:{name,value,onChange,type:'text'}};}
test('choosing one party and reviewing replacements does not write to the other party',()=>{
 const state={p1Nome:'PRECEDENTE',p1NatoIl:'',p2Nome:'ALTRO CLIENTE'};
 const onChange=e=>state[e.target.name]=e.target.value;
 const preview={props:{blocks:[{key:'intro',node:{props:{children:[field('p1Nome',state.p1Nome,onChange),field('p1NatoIl','',onChange),field('p2Nome',state.p2Nome,onChange)]}}}]}};
 const targets=collectTargets(preview,'/purchase-proposal');assert.equal(targets.length,2);
 const fields={givenNames:{value:'MARIO',confirmed:true},surname:{value:'ROSSI',confirmed:true},birthDate:{value:'1980-01-01',confirmed:true}};
 const ops=planImport(targets[0],fields);
 assert.equal(state.p1Nome,'PRECEDENTE');assert.equal(ops.find(x=>x.key==='fullName').replacement,true);
 assert.throws(()=>applyImport(ops,false),/sostituz/);
 applyImport(ops,true);assert.equal(state.p1Nome,'MARIO ROSSI');assert.equal(state.p1NatoIl,'01/01/1980');assert.equal(state.p2Nome,'ALTRO CLIENTE');
});
test('unconfirmed fields cannot enter an import plan',()=>{
 const target={fields:{fullName:{value:'',props:{onChange(){},name:'nome'}}}};
 assert.equal(planImport(target,{givenNames:{value:'MARIO',confirmed:false},surname:{value:'ROSSI',confirmed:true}}).length,0);
});
test('lease proposers preserve separate first and last names and selected party',()=>{
 const values={first:'',last:'',other:''};
 const preview={props:{blocks:[{key:'proposer-0',node:{props:{children:[{type:'input',props:{'data-identity-field':'nome',value:'',onChange:e=>values.first=e.target.value}},{type:'input',props:{'data-identity-field':'cognome',value:'',onChange:e=>values.last=e.target.value}}]}}},{key:'proposer-1',node:{props:{children:[{type:'input',props:{'data-identity-field':'nome',value:'',onChange:e=>values.other=e.target.value}},{type:'input',props:{'data-identity-field':'cognome',value:'',onChange(){}}}]}}}]}};
 const targets=collectTargets(preview,'/lease-proposal');assert.equal(targets.length,2);assert.equal(targets[0].label,'Proponente 1');
 const ops=planImport(targets[0],{givenNames:{value:'MARIO',confirmed:true},surname:{value:'ROSSI',confirmed:true}});applyImport(ops);
 assert.deepEqual(values,{first:'MARIO',last:'ROSSI',other:''});
});
test('expiry warning reflects a corrected date',()=>{
 const fields={expiryDate:{value:'2030-01-01',status:'manual'}};assert.equal(isExpired(fields,now),false);
 fields.expiryDate.value='2020-01-01';assert.equal(isExpired(fields,now),true);
 fields.expiryDate.value='2030-01-01';assert.equal(isExpired(fields,now),false);
});
test('Allegato B never exposes identity import targets',()=>assert.deepEqual(collectTargets({props:{blocks:[]}},'/lease-allegato-b'),[]));

test('AML structured names take precedence over a separate legacy full-name field',async()=>{
 const {collectTargets}=await import('../src/IdentityTargets.js');
 const field=(name,value)=>({type:'textarea',props:{name,value,onChange(){},'aria-label':name==='name'?'Cliente: nome e cognome / denominazione':name}});
 const preview={props:{blocks:[{key:'parties',node:{type:'section',props:{children:[field('nome','Mario'),field('cognome','Rossi'),field('name','')]}}}]}};
 const [target]=collectTargets(preview,'/aml');
 assert.equal(target.fields.givenNames?.value,'Mario');assert.equal(target.fields.surname?.value,'Rossi');assert.equal(target.fields.fullName,undefined);
});

test('scalar fiscal targets follow persisted person identities while repeated records keep their own IDs',async()=>{
 const {bindIdentityRecordIds}=await import('../src/IdentityTargets.js');
 assert.equal(typeof bindIdentityRecordIds,'function');
 const targets=[{id:'client',fields:{}},{id:'purchase-seller',recordId:'purchase-seller',fields:{}},{id:'person-row',recordId:'stable-row',fields:{}}];
 const first=bindIdentityRecordIds(targets,{client:'person-a',owners:'person-owner'}),second=bindIdentityRecordIds(targets,{client:'person-b',owners:'person-owner'});
 assert.equal(first[0].recordId,'person-a');assert.equal(second[0].recordId,'person-b');assert.equal(first[1].recordId,'person-owner');assert.equal(first[2].recordId,'stable-row');
});
