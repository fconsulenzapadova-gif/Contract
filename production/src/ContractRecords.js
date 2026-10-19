/** Editable data only. Legal clauses and Allegato B remain in their source. */
const partyDefaults = {
 nome:'', cognome:'', sesso:'', trattamento:'', natoA:'', prov:'', natoIl:'', cf:'',
 domicilioComune:'', domicilioProv:'', domicilioArea:'', via:'', numero:'', ci:'',
 corsoStudi:'', universita:'', sede:'', codicePa:'', matricola:'', documentazione:''
};
const unitDefaults = {
 tipo:'principale', mainUnitId:'', descrizione:'', comune:'', via:'', numero:'', piano:'', mq:'',
 foglio:'', particella:'', subalterno:'', zc:'', categoria:'', classe:'', vani:'', rendita:''
};
const unitAliases = {
 comune:'immComune', via:'immVia', numero:'immNumero', piano:'immPiano', mq:'immMq',
 foglio:'catFoglio', particella:'catParticella', subalterno:'catSubalterno',
 zc:'catZc', categoria:'catCategoria', classe:'catClasse', vani:'catVani', rendita:'catRendita'
};
const universityFields = ['corsoStudi','universita','sede','codicePa','matricola','documentazione'];
let sequence = 0;
function newId(prefix) {
 return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${(++sequence).toString(36)}`}`;
}
function idFor(record, prefix, options) {
 return typeof record.id === 'string' && record.id.trim() ? record.id : (options.idFactory || newId)(prefix);
}
export function createParty(values = {}, options = {}) {
 return {...partyDefaults, ...values, id:idFor(values, options.prefix || 'person', options)};
}
export function createUnit(values = {}, options = {}) {
 return {...unitDefaults, ...values, id:idFor(values, options.prefix || 'unit', options)};
}
function migrateList(input, create, prefix, options) {
 const values = Array.isArray(input) && input.length ? input : [{}];
 const seen = new Set();
 return values.map((value, index) => {
  const record = value && typeof value === 'object' ? value : {};
  const normalized = create(record, {...options, prefix});
  if (seen.has(normalized.id)) {
   let candidate = (options.idFactory || newId)(prefix);
   if (seen.has(candidate)) candidate = `${candidate}-${index}`;
   while (seen.has(candidate)) candidate += '-new';
   normalized.id = candidate;
  }
  seen.add(normalized.id);
  return normalized;
 });
}
/** The full legacy `nome` is kept verbatim: no split or gender inference. */
export function migrateParties(input, options = {}) {
 return migrateList(input, createParty, options.prefix || 'person', options);
}
/** Scalar student data belongs only to the original first tenant, once. */
export function migrateStudentParties(input, legacy = {}, options = {}) {
 const alreadyMigrated = Array.isArray(input) && input.some(person => person?._studentLegacyMigrated);
 return migrateParties(input, options).map((person, index) => {
  const next = {...person, _studentLegacyMigrated:true};
  if (!alreadyMigrated && index === 0) {
   for (const field of universityFields) {
    if ((next[field] === '' || next[field] == null) && legacy[field] != null) next[field] = legacy[field];
   }
  }
  return next;
 });
}
/** Accepts an existing unit array, {units}, or the old scalar property data. */
export function migrateUnits(input = {}, options = {}) {
 if (!input || typeof input !== 'object') input = {};
 if (Array.isArray(input)) return migrateList(input, createUnit, options.prefix || 'unit', options);
 if (Array.isArray(input.units) && input.units.length) return migrateUnits(input.units, options);
 const source = input.property && typeof input.property === 'object' ? input.property : input;
 const unit = {...source};
 for (const [field, alias] of Object.entries(unitAliases)) {
  if (unit[field] == null && source[alias] != null) unit[field] = source[alias];
 }
 return migrateList([unit], createUnit, options.prefix || 'unit', options);
}
function recordIndex(records, id) {
 return typeof id === 'number' ? id : records.findIndex(record => record.id === id);
}
/** Accepts both (id, patch) and (id, field, value), including legacy indexes. */
export function updateRecord(records, id, fieldOrPatch, value) {
 const index = recordIndex(records, id);
 let patch = typeof fieldOrPatch === 'string' ? {[fieldOrPatch]:value} : fieldOrPatch;
 if (patch && Object.hasOwn(patch,'cf')) patch={...patch,cf:String(patch.cf??'').replace(/\s/gu,'').toUpperCase()};
 if (index < 0 || index >= records.length || !patch || typeof patch !== 'object') return records;
 return records.map((record, position) => position === index ? {...record, ...patch, id:record.id} : record);
}
export function removeRecord(records, id, minimum = 1) {
 if (records.length <= minimum) return records;
 const index = recordIndex(records, id);
 return index < 0 || index >= records.length ? records : records.filter((_, position) => position !== index);
}
export function moveRecord(records, id, offset) {
 const index = recordIndex(records, id);
 const destination = index + offset;
 if (!Number.isInteger(offset) || index < 0 || destination < 0 || destination >= records.length) return records;
 const result = [...records];
 const [record] = result.splice(index, 1);
 result.splice(destination, 0, record);
 return result;
}
function normalized(value) { return String(value || '').trim().replace(/\s+/g,' ').toLocaleLowerCase('it'); }
/** A separate manually entered surname complements, never duplicates, nome. */
export function displayName(person = {}) {
 const name = String(person.nome || '').trim();
 const surname = String(person.cognome || '').trim();
 if (!surname) return name;
 if (!name) return surname;
 const simpleName = normalized(name), simpleSurname = normalized(surname);
 return simpleName === simpleSurname || simpleName.endsWith(` ${simpleSurname}`) ? name : `${name} ${surname}`;
}
export function partyGrammar(person = {}) {
 const treatment = normalized(person.trattamento);
 const sex = normalized(person.sesso);
 const female = ['f','femmina','femminile','donna'].includes(sex);
 const male = ['m','maschio','maschile','uomo'].includes(sex);
 if (['signorina','sig.na'].includes(treatment)) return {prefix:'La signorina', born:'nata', domiciled:'domiciliata', gender:'F'};
 if (['signora','sig.ra'].includes(treatment) || (!treatment && female)) return {prefix:'La signora', born:'nata', domiciled:'domiciliata', gender:'F'};
 if (['signor','signore','sig.'].includes(treatment) || (!treatment && male)) return {prefix:'Il signor', born:'nato', domiciled:'domiciliato', gender:'M'};
 return {prefix:'La persona', born:'con luogo di nascita', domiciled:'con domicilio', gender:''};
}
export function groupDefinition(role = 'conduttore', count = 1) {
 return `${count > 1 ? 'Le persone sopra indicate, di seguito congiuntamente denominate' : 'La persona sopra indicata, di seguito denominata'} per brevità “Parte ${role === 'locatore' ? 'Locatrice' : 'Conduttrice'}”`;
}
export function propertyAcceptance(people = []) {
 const genders = people.map(person => partyGrammar(person).gender);
 if (genders.length === 1 && genders[0] === 'F') return 'La conduttrice accetta di condurre in locazione';
 if (genders.length === 1 && genders[0] === 'M') return 'Il conduttore accetta di condurre in locazione';
 if (genders.length > 1 && genders.every(gender => gender === 'F')) return 'Le conduttrici accettano di condurre in locazione';
 if (genders.length > 1 && genders.every(gender => gender)) return 'I conduttori accettano di condurre in locazione';
 return genders.length > 1 ? 'Le persone sopra indicate accettano di condurre in locazione' : 'La Parte Conduttrice accetta di condurre in locazione';
}
export function signatureRows({conduttori = [], locatori = [], specificApproval = false} = {}) {
 return [
  ...locatori.map((person,index) => ({person,index,role:'locatore'})),
  ...conduttori.map((person,index) => ({person,index,role:'conduttore'}))
 ].map(row => ({...row, key:`${specificApproval ? 'approval' : 'signature'}-${row.role}-${row.person.id || row.index}`, specificApproval}));
}
