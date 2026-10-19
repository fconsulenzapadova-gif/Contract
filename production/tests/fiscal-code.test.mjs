import test from 'node:test';
import assert from 'node:assert/strict';

// A missing subsystem is an assertion failure during the first TDD run.
const F = await import('../src/FiscalCode.js').catch(error => {
  if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
  throw error;
});
const api = name => { assert.equal(typeof F[name], 'function', `${name} must be implemented`); return F[name]; };
const now = new Date('2026-10-12T12:00:00Z');
const places = [
  {belfioreCode:'H501',name:'Roma',province:'RM',creationDate:'1871-01-01',expirationDate:'9999-12-31'},
  {belfioreCode:'G224',name:'Padova',province:'PD',creationDate:'1861-01-01',expirationDate:'9999-12-31'},
  {belfioreCode:'Z105',name:'Cecoslovacchia',iso3166:'CS',creationDate:'1918-10-28',expirationDate:'1992-12-31'},
  {belfioreCode:'Z156',name:'Repubblica Ceca',iso3166:'CZ',creationDate:'1993-01-01',expirationDate:'9999-12-31'},
];
const adapter = {places};
const mario = {id:'stable-person',nome:'Mario',cognome:'Rossi',sesso:'M',natoIl:'1980-01-01',natoA:'Roma',prov:'RM',cf:''};
const UI = await import('../src/FiscalCodeUI.js').catch(error => {
  if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
  throw error;
});

test('name normalization handles compounds, accents and apostrophes without mutating display data', () => {
  assert.equal(api('normalizeName')('D’Àngelo'), 'DANGELO');
  assert.equal(api('encodeSurname')('D’Àngelo'), 'DNG');
  assert.equal(api('encodeGivenName')('Gian-Paolo'), 'GPL');
  assert.equal(api('encodeGivenName')('Maria Chiara'), 'MCH');
  assert.equal(api('encodeGivenName')('Al'), 'LAX');
  assert.equal(api('encodeSurname')('Ai'), 'AIX');
  assert.equal(api('normalizeFiscalCode')(' rssmra 80a01h501u\n'), 'RSSMRA80A01H501U');
  assert.equal(mario.nome, 'Mario');
});

test('validates the entered checksum before any omocodia substitution', () => {
  assert.equal(api('validateFiscalCode')('RSSMRA80A01H501U').valid, true);
  assert.equal(api('validateFiscalCode')('RSSMRA80A01H501A').valid, false);
  const omocode = api('validateFiscalCode')('RSSMRAULALMH50MX');
  assert.equal(omocode.valid, true);
  assert.equal(omocode.omocodia, true);
  assert.equal(omocode.baseBody, 'RSSMRA80A01H501');
  assert.equal(omocode.normalized, 'RSSMRAULALMH50MX');
  assert.equal(api('validateFiscalCode')('RSSMRA80A01H50MU').valid, false);
});

test('rejects impossible day/month encodings even with a correct checksum', () => {
  const result = api('validateFiscalCode')('RSSMRA80B31H501W');
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.code === 'date'));
  assert.equal(api('validateFiscalCode')('RSSMRA00B29H501Y').valid, true);
});

test('numeric fiscal identifiers remain a separate non reversible category', async () => {
  const result = await api('decodeFiscalCode')('06363391001', {adapter,now});
  assert.equal(result.kind, 'numeric');
  assert.equal(result.valid, true);
  assert.deepEqual(result.derived, {});
  assert.equal(api('validateFiscalCode')('06363391002').valid, false);
});

test('reverse decoding exposes all supported century candidates and no invented names', async () => {
  const result = await api('decodeFiscalCode')('RSSMRA04B29H501C', {adapter,now});
  assert.deepEqual(result.date.candidates, ['1904-02-29','2004-02-29']);
  assert.equal(result.date.selected, '');
  assert.equal(result.date.ambiguous, true);
  assert.equal(result.derived.natoIl, undefined);
  assert.equal(result.derived.sesso, 'M');
  for(const field of ['nome','cognome','residenza','docIdentita','trattamento']) assert.equal(result.derived[field], undefined);
});

test('a matching complete date resolves century without relying on parser guesses', async () => {
  const result = await api('decodeFiscalCode')('RSSMRA04B29H501C', {adapter,now,existingDate:'29/02/1904'});
  assert.equal(result.date.selected, '1904-02-29');
  assert.equal(result.date.source, 'existing');
  assert.equal(result.derived.natoIl, '1904-02-29');
  const mismatch = await api('decodeFiscalCode')('RSSMRA04B29H501C', {adapter,now,existingDate:'2004-03-29'});
  assert.equal(mismatch.date.selected, '');
  assert.ok(mismatch.errors.some(error => error.code === 'date-conflict'));
});

test('Gregorian leap rules and future dates limit candidates without assigning a century', async () => {
  const result = await api('decodeFiscalCode')('RSSMRA00B29H501Y', {adapter,now});
  assert.deepEqual(result.date.candidates, ['2000-02-29']);
  assert.equal(result.date.selected, '');
  const future = await api('computeFiscalCode')({...mario,natoIl:'2027-01-01'}, {adapter,now});
  assert.equal(future.code, '');
  assert.ok(future.errors.some(error => error.code === 'date'));
});

test('theoretical encoding requires separately supplied name and surname and preserves display', async () => {
  const result = await api('computeFiscalCode')(mario, {adapter,now});
  assert.equal(result.code, 'RSSMRA80A01H501U');
  assert.equal(result.theoretical, true);
  assert.equal(result.officiallyVerified, false);
  const female = await api('computeFiscalCode')({...mario,sesso:'F'}, {adapter,now});
  assert.equal(female.code, 'RSSMRA80A41H501Y');
  assert.equal((await api('computeFiscalCode')({...mario,cognome:'',nome:'Mario Rossi'}, {adapter,now})).code, '');
  assert.equal(mario.nome, 'Mario');
});

test('date aware lookup retains ceased foreign states and rejects anachronistic birthplaces', async () => {
  const ceased = await api('decodeFiscalCode')('RSSMRA80A01Z105M', {adapter,now,existingDate:'1980-01-01'});
  assert.equal(ceased.place.selected.name, 'Cecoslovacchia');
  assert.equal(ceased.derived.prov, 'EE');
  const wrong = await api('decodeFiscalCode')('RSSMRA00A01Z105U', {adapter,now,existingDate:'2000-01-01'});
  assert.equal(wrong.place.selected, null);
  assert.equal(wrong.derived.natoA, undefined);
  assert.ok(wrong.errors.some(error => error.code === 'place-date'));
  assert.equal((await api('computeFiscalCode')({...mario,natoA:'Cecoslovacchia',prov:'EE',natoIl:'2000-01-01'},{adapter,now})).code, '');
});

test('unknown Belfiore codes do not create invented birthplace data', async () => {
  const result = await api('decodeFiscalCode')('RSSMRA80A01Z999Y', {adapter,now,existingDate:'1980-01-01'});
  assert.equal(result.derived.natoA, undefined);
  assert.ok(result.errors.some(error => error.code === 'place-unknown'));
});

test('name homonyms with distinct codes remain ambiguous until province or code is supplied', async () => {
  const homonyms = {places:[...places,{belfioreCode:'A001',name:'Roma',province:'AA',creationDate:'1861-01-01',expirationDate:'9999-12-31'}]};
  const ambiguous = await api('computeFiscalCode')({...mario,prov:''}, {adapter:homonyms,now});
  assert.equal(ambiguous.code, '');
  assert.ok(ambiguous.errors.some(error => error.code === 'place-ambiguous'));
  assert.equal((await api('computeFiscalCode')(mario,{adapter:homonyms,now})).code, 'RSSMRA80A01H501U');
});

test('derived fill targets the same stable person and never overwrites a manual conflict', () => {
  const person = {id:'tenant-2',nome:'Anna',cf:'RSSMRA80A01H501U',natoA:'Padova',prov:'PD',natoIl:'1980-01-01',sesso:''};
  const plan = api('planDerivedChanges')(person,{natoA:'Roma',prov:'RM',sesso:'M'},'cf',person.cf);
  assert.deepEqual(plan.patch.sesso, 'M');
  assert.equal(plan.patch.natoA, undefined);
  assert.deepEqual(plan.conflicts.map(conflict=>conflict.field), ['natoA','prov']);
  const applied = api('applyDerivedChanges')(person,plan);
  assert.equal(applied.id, 'tenant-2');
  assert.equal(applied.nome, 'Anna');
  assert.equal(applied.natoA, 'Padova');
  assert.equal(applied._fiscalCode.fields.sesso.source, 'cf');
});

test('previously derived values can refresh while subsequent manual edits regain priority', () => {
  let person = api('applyDerivedChanges')({id:'one',sesso:''},api('planDerivedChanges')({id:'one',sesso:''},{sesso:'M'},'cf','OLD'));
  let plan = api('planDerivedChanges')(person,{sesso:'F'},'cf','NEW');
  assert.equal(plan.patch.sesso, 'F');
  person = {...person,sesso:'F'};
  plan = api('planDerivedChanges')(person,{sesso:'M'},'cf','NEW');
  assert.equal(plan.patch.sesso, undefined);
  assert.equal(plan.conflicts.length, 1);
});

test('automatic forward fills an empty CF, refreshes its derived value and preserves an entered omocode', async () => {
  const first = await api('synchronizeFiscalCode')(mario,{adapter,now});
  assert.equal(first.person.cf, 'RSSMRA80A01H501U');
  assert.equal(first.person._fiscalCode.fields.cf.source, 'theoretical');
  const second = await api('synchronizeFiscalCode')({...first.person,sesso:'F'},{adapter,now});
  assert.equal(second.person.cf, 'RSSMRA80A41H501Y');
  const entered = await api('synchronizeFiscalCode')({...mario,cf:'RSSMRAULALMH50MX'},{adapter,now});
  assert.equal(entered.person.cf, 'RSSMRAULALMH50MX');
  assert.equal(entered.conflicts.length, 0);
});

test('automatic reverse fills birth facts, leaves ambiguous full date empty and clears stale derived facts', async () => {
  const original = {id:'two',cf:'RSSMRA04B29H501C',nome:'',cognome:'',natoIl:'',natoA:'',prov:'',sesso:'',residenza:'Via X'};
  const result = await api('synchronizeFiscalCode')(original,{adapter,now});
  assert.equal(result.person.natoIl, '');
  assert.equal(result.person.sesso, 'M');
  assert.equal(result.person.nome, '');
  assert.equal(result.person.residenza, 'Via X');
  const selected = await api('synchronizeFiscalCode')(original,{adapter,now,selectedDate:'2004-02-29'});
  assert.equal(selected.person.natoIl, '2004-02-29');
  const changed = await api('synchronizeFiscalCode')({...selected.person,cf:'RSSMRA80A41H501Y'},{adapter,now});
  assert.equal(changed.person.natoIl, '');
  assert.equal(changed.person.sesso, 'F');
});

test('automatic forward never splits legacy full names or overwrites manually supplied CF', async () => {
  const legacy = await api('synchronizeFiscalCode')({...mario,nome:'Mario Rossi',cognome:'',cf:''},{adapter,now,legacyFullName:true});
  assert.equal(legacy.person.cf, '');
  const conflict = await api('synchronizeFiscalCode')({...mario,cf:'RSSMRA80A41H501Y'},{adapter,now});
  assert.equal(conflict.person.cf, 'RSSMRA80A41H501Y');
  assert.ok(conflict.conflicts.some(item=>item.field==='sesso'));
  assert.equal(conflict.person.sesso, 'M');
});

test('legacy full names can use an explicitly confirmed calculation identity without changing display', async () => {
  const person={...mario,nome:'Mario Rossi',cognome:'',_fiscalCode:{names:{nome:'Mario',cognome:'Rossi',displayValue:'Mario Rossi',confirmed:true}}};
  const result=await api('synchronizeFiscalCode')(person,{adapter,now,legacyFullName:true});
  assert.equal(result.person.cf,'RSSMRA80A01H501U');
  assert.equal(result.person.nome,'Mario Rossi');
  assert.equal(result.person.cognome,'');
  const edited=await api('synchronizeFiscalCode')({...result.person,nome:'Anna Bianchi'},{adapter,now,legacyFullName:true});
  assert.equal(edited.person.cf,'');
});

test('a separately supplied Belfiore code cannot silently override a conflicting birthplace name', async () => {
  const result=await api('computeFiscalCode')({...mario,belfioreCode:'G224'},{adapter,now});
  assert.equal(result.code,'');
  assert.ok(result.errors.some(error=>error.code==='place-conflict'));
});

test('async coordinator delivers only the latest person after a slow lookup', async () => {
  assert.equal(typeof UI.createFiscalCodeCoordinator,'function');
  let release;const barrier=new Promise(resolve=>{release=resolve;});
  const slowAdapter={async toArray(){await barrier;return places;}};
  const coordinator=UI.createFiscalCodeCoordinator(),delivered=[];
  const first=coordinator.run({...mario,id:'old'}, {adapter:slowAdapter,now},result=>delivered.push(result.person.id));
  const second=coordinator.run({...mario,id:'current'}, {adapter:slowAdapter,now},result=>delivered.push(result.person.id));
  release();await Promise.all([first,second]);
  assert.deepEqual(delivered,['current']);
});

test('async coordinator cancellation suppresses an unmounted person update', async () => {
  assert.equal(typeof UI.createFiscalCodeCoordinator,'function');
  let release;const barrier=new Promise(resolve=>{release=resolve;});
  const coordinator=UI.createFiscalCodeCoordinator(),delivered=[];
  const pending=coordinator.run(mario,{adapter:{async toArray(){await barrier;return places;}},now},result=>delivered.push(result));
  coordinator.cancel();release();await pending;
  assert.equal(delivered.length,0);
});

test('editing an incomplete or invalid CF never clears previously derived birth facts',async()=>{
 const first=await api('synchronizeFiscalCode')({id:'hold',cf:'RSSMRA80A01H501U'},{adapter,now,selectedDate:'1980-01-01'});
 const partial=await api('synchronizeFiscalCode')({...first.person,cf:'RSSMRA80A01H501'},{adapter,now});
 assert.equal(partial.person.natoIl,'1980-01-01');assert.equal(partial.person.natoA,first.person.natoA);
 const invalid=await api('synchronizeFiscalCode')({...first.person,cf:'RSSMRA80A01H501A'},{adapter,now});
 assert.equal(invalid.person.natoIl,'1980-01-01');assert.equal(invalid.person.sesso,'M');
});
