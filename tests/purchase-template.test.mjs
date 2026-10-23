import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTemplate,legacyTemplate,legacyNeedsReview,legacyOmittedValues} from '../src/purchase/PurchaseTemplate.js';

test('previous proposal records migrate without removing the saved source slots',()=>{
 const slots={document:{prezzoOfferto:'250.000',attoEntroIl:'2026-12-31'},supplement:{conditions:'Mutuo entro novembre'},owners:[{nome:'Lucia',cognome:'Bianchi',cf:'BNCLCU80A41G224X',domicilioComune:'Padova'}],buyers:[{nome:'Mario',cognome:'Rossi',natoIl:'1980-01-01',via:'Via Roma',numero:'12'}],units:[{comune:'Padova',foglio:'12',particella:'345',subalterno:'6'}]};
 const before=structuredClone(slots),data=legacyTemplate(slots);
 assert.equal(data.p1Nome,'Mario Rossi');assert.equal(data.vNome,'Lucia Bianchi');assert.equal(data.p1Via,'Via Roma 12');
 assert.equal(data.p1NatoIl,'01/01/1980');assert.equal(data.attoEntroIl,'31/12/2026');assert.equal(data.conditions,'Mutuo entro novembre');
 assert.equal(data.c1F,'12');assert.equal(data.prezzoOfferto,'250.000');assert.deepEqual(slots,before);
});

test('multiple parties or units require review before a fixed single-party form can print',()=>{
 assert(legacyNeedsReview({buyers:[{nome:'Mario'},{nome:'Maria'}]}));
 assert(legacyNeedsReview({units:[{comune:'Padova'},{comune:'Venezia'}]}));
 assert(!legacyNeedsReview({buyers:[{nome:'Mario'}],units:[{}]}));
});

test('imported text remains intact so overflow can be resolved without losing data',()=>{
 const long='Dati lunghi '.repeat(1000);const data=normalizeTemplate({note:long,statoImm:'locato'});
 assert.equal(data.note,long);assert.equal(data.statoImm,'locato');assert.equal(normalizeTemplate(null).vNome,'');
});

test('previous financial terms without a matching space must be reviewed before printing',()=>{
 assert(legacyNeedsReview({document:{pag2Importo:'25.000',pag2Data:'2026-11-01'}}));
 assert(legacyNeedsReview({buyers:[{nome:'Mario',telefono:'3330000000'}]}));
 assert(!legacyNeedsReview({document:{confApe:'APE',pag2Assegno:'circolare',pag2Titolo:'caparra',pag3Assegno:'circolare',pag3Titolo:'caparra',saldoModo:'assegno',depositoPrezzo:'B'}}));
});

test('a malformed imported legacy slot cannot crash the proposal editor',()=>{
 assert.doesNotThrow(()=>legacyOmittedValues({buyers:{nome:'Mario'},units:'invalid'}));
 assert.doesNotThrow(()=>legacyTemplate({owners:{},buyers:[null],units:[null]}));
 assert.doesNotThrow(()=>legacyOmittedValues({owners:[{},null],buyers:[null]}));
});

test('a full name plus an explicit surname does not duplicate the surname during migration',()=>{
 const slots={owners:[{nome:'Lucia Bianchi',cognome:'Bianchi'}],buyers:[{nome:'Mario Rossi',cognome:'Rossi'}]};
 const data=legacyTemplate(slots);assert.equal(data.p1Nome,'Mario Rossi');assert.equal(data.vNome,'Lucia Bianchi');
});

test('seller information with no corresponding PDF field is shown for review',()=>{
 const slots={owners:[{nome:'Lucia',via:'Via Roma',numero:'12',email:'lucia@example.com',natoIl:'01/01/1980'}]};
 assert(legacyNeedsReview(slots));assert(legacyOmittedValues(slots).some(v=>v.includes('lucia@example.com')));
});
