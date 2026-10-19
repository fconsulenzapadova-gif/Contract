import test from 'node:test';
import assert from 'node:assert/strict';
import {collectTargets, planImport, applyImport} from '../src/IdentityTargets.js';

// The first run intentionally proves the new APIs are absent, rather than
// stopping at a module-loader error before the assertions can run.
const records = await import('../src/ContractRecords.js').catch(error => {
 if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
 throw error;
});
const uiModule = await import('../src/ContractRecordsUI.js').catch(error => {
 if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
 throw error;
});
function api(name) { assert.equal(typeof records[name], 'function', `${name} API is missing`); return records[name]; }
let next = 0;
const idFactory = prefix => `${prefix}-${++next}`;
const React = {Fragment:Symbol('Fragment'), createElement(type, props, ...children) {
 return {type, key:props?.key, props:{...props, children:children.length === 1 ? children[0] : children}};
}};
function ui() { assert.equal(typeof uiModule.createContractRecordsUI, 'function', 'UI factory is missing'); return uiModule.createContractRecordsUI(React); }
function visit(node, callback) {
 if (Array.isArray(node)) { node.forEach(child => visit(child, callback)); return; }
 if (!node || typeof node !== 'object' || !node.props) return;
 callback(node); visit(node.props.children, callback);
}
function textOf(node) {
 if (Array.isArray(node)) return node.map(textOf).join('');
 if (node == null || typeof node === 'boolean') return '';
 if (typeof node !== 'object') return String(node);
 return textOf(node.props?.children);
}
function nodesOf(blocks, predicate) {
 const matches = [];
 visit(blocks.map(block => block.node), node => { if (predicate(node)) matches.push(node); });
 return matches;
}

test('legacy people retain the full name and every populated identity field without guessing surname or sex', () => {
 const legacy = {nome:'ANNA MARIA DE LUCA',natoA:'Roma',prov:'RM',natoIl:'01/02/1990',cf:'CODICE',domicilioComune:'Padova',domicilioProv:'PD',domicilioArea:'Arcella',via:'Plebiscito',numero:'7',ci:'CA123',note:'Dato originale'};
 const [person] = api('migrateParties')([legacy], {idFactory});
 for (const [key, value] of Object.entries(legacy)) assert.equal(person[key], value);
 assert.equal(person.cognome, ''); assert.equal(person.sesso, ''); assert.equal(person.trattamento, '');
 assert.ok(person.id); assert.equal(legacy.id, undefined);
});

test('duplicate or absent ids are repaired once while already unique ids remain stable', () => {
 const migrate = api('migrateParties');
 const people = migrate([{id:'fixed',nome:'A'},{id:'fixed',nome:'B'},{nome:'C'}], {idFactory});
 assert.equal(people[0].id, 'fixed'); assert.equal(new Set(people.map(person => person.id)).size, 3);
 const again = migrate(people, {idFactory});
 assert.deepEqual(again.map(person => person.id), people.map(person => person.id));
});

test('reordering and removing a person keep university and identity data attached to the original id', () => {
 const people = api('migrateParties')([{id:'a',nome:'A',universita:'Uni A'},{id:'b',nome:'B',universita:'Uni B'},{id:'c',nome:'C',universita:'Uni C'}]);
 const moved = api('moveRecord')(people, 'b', -1);
 assert.deepEqual(moved.map(person => [person.id,person.universita]), [['b','Uni B'],['a','Uni A'],['c','Uni C']]);
 const updated = api('updateRecord')(moved, 'b', {matricola:'123'});
 const removed = api('removeRecord')(updated, 'a');
 assert.deepEqual(removed.map(person => [person.id,person.nome,person.matricola]), [['b','B','123'],['c','C','']]);
 assert.equal(people[1].matricola, '');
 assert.equal(api('removeRecord')([people[0]], 'a').length, 1);
 assert.deepEqual(api('moveRecord')(people, 'missing', -1), people);
});

test('legacy university scalars migrate only to the first tenant and never overwrite personal data', () => {
 const legacy = {corsoStudi:'Medicina',universita:'Università X',sede:'Venezia',codicePa:'PA originale',matricola:'123',documentazione:'Certificato'};
 const migrate = api('migrateStudentParties');
 const students = migrate([{id:'a',nome:'A',matricola:'GIÀ PRESENTE'},{id:'b',nome:'B'}], legacy);
 assert.equal(students[0].corsoStudi,'Medicina'); assert.equal(students[0].matricola,'GIÀ PRESENTE');
 assert.equal(students[0].codicePa,'PA originale'); assert.equal(students[1].corsoStudi,''); assert.equal(students[1].codicePa,'');
 const reordered = api('moveRecord')(students,'b',-1);
 const again = migrate(reordered,legacy);
 assert.equal(again[0].corsoStudi,''); assert.equal(again[1].corsoStudi,'Medicina');
 const added = api('createParty')(); assert.equal(added.matricola,''); assert.equal(added.documentazione,'');
});

test('legacy property migration preserves all cadastral fields and does not hardcode a municipality', () => {
 const legacy = {immComune:'Venezia',immVia:'San Marco',immNumero:'12',immPiano:'2',immMq:'80',catFoglio:'1',catParticella:'2',catSubalterno:'3',catZc:'4',catCategoria:'A/3',catClasse:'5',catVani:'6',catRendita:'700'};
 const [unit] = api('migrateUnits')(legacy, {idFactory});
 assert.deepEqual(Object.fromEntries(['comune','via','numero','piano','mq','foglio','particella','subalterno','zc','categoria','classe','vani','rendita'].map(key => [key,unit[key]])), {comune:'Venezia',via:'San Marco',numero:'12',piano:'2',mq:'80',foglio:'1',particella:'2',subalterno:'3',zc:'4',categoria:'A/3',classe:'5',vani:'6',rendita:'700'});
 assert.equal(api('createUnit')().comune, '');
});

test('a new garage has its own empty address and cadastre and retains them when reordered', () => {
 const [home] = api('migrateUnits')({immComune:'Padova',immVia:'Casa',catVani:'5'});
 const garage = api('createUnit')({tipo:'garage'}, {idFactory});
 assert.equal(garage.comune,''); assert.equal(garage.via,''); assert.equal(garage.vani,'');
 const units = api('updateRecord')([home,garage],garage.id,{comune:'Abano Terme',via:'Garage',categoria:'C/6',subalterno:'9'});
 const moved = api('moveRecord')(units,garage.id,-1);
 assert.equal(moved[0].comune,'Abano Terme'); assert.equal(moved[0].categoria,'C/6'); assert.equal(moved[1].vani,'5');
});

test('manual treatment wins over sex and unknown people use neutral wording without name inference', () => {
 const grammar = api('partyGrammar');
 assert.deepEqual(grammar({nome:'Mario',sesso:'F',trattamento:'signorina'}), {prefix:'La signorina',born:'nata',domiciled:'domiciliata',gender:'F'});
 assert.equal(grammar({nome:'Anna',sesso:'M'}).born,'nato');
 assert.equal(grammar({nome:'Anna',cf:'RSSNNA90A41H501X'}).gender,'');
 assert.equal(grammar({sesso:'M',trattamento:'neutro'}).gender,'');
 const acceptance = api('propertyAcceptance');
 assert.equal(acceptance([{sesso:'F'}]),'La conduttrice accetta di condurre in locazione');
 assert.equal(acceptance([{sesso:'F'},{sesso:'F'}]),'Le conduttrici accettano di condurre in locazione');
 assert.match(acceptance([{},{}]),/accettano/);
});

test('group introduction has one collective definition and removes only the empty anonymous student domicile slot', () => {
 const people = api('migrateParties')([{id:'a',nome:'Anna',sesso:'F',domicilioArea:''},{id:'b',nome:'Bruna',trattamento:'signorina',domicilioArea:'Quartiere reale'}]);
 const blocks = ui().introBlocks({keyPrefix:'intro',conduttori:people,locatori:api('migrateParties')([{id:'l',nome:'Locatore'}]),students:true,property:{comune:'Venezia'}});
 const text = blocks.map(block => textOf(block.node)).join(' ');
 assert.equal((text.match(/per brevità “Parte Conduttrice”/g)||[]).length,1);
 assert.equal((text.match(/per brevità “Parte Locatrice”/g)||[]).length,1);
 assert.match(text,/nata/); assert.match(text,/La signorina/);
 const areaInputs = nodesOf(blocks,node => node.type === 'input' && node.props['data-identity-field'] === 'domicilioArea');
 assert.equal(areaInputs.length,1); assert.equal(areaInputs[0].props.value,'Quartiere reale');
 const nonStudent = ui().introBlocks({conduttori:[people[0]],locatori:[],students:false,property:{}});
 assert.equal(nodesOf(nonStudent,node => node.type === 'input' && node.props['data-identity-field'] === 'domicilioArea').length,1);
});

test('a manually added fiscal surname never duplicates the preserved full name in the printable person line', () => {
 const blocks=ui().introBlocks({conduttori:[api('createParty')({nome:'Mario Rossi',cognome:'Rossi'})],locatori:[],property:{}});
 const visibleSurname=nodesOf(blocks,node=>node.type==='p'&&node.props['data-party-id']);
 const surnameInputs=nodesOf(visibleSurname.map(node=>({node})),node=>node.type==='input'&&node.props['data-identity-field']==='cognome');
 assert.equal(surnameInputs.length,0);
 const editor=ui().editorControls({conduttori:[api('createParty')({nome:'Mario Rossi',cognome:'Rossi'})],locatori:[],property:{}});
 const surnameControls=nodesOf([{node:editor}],node=>node.type==='input'&&node.props['data-identity-field']==='cognome');
 assert.equal(surnameControls.length,1);
});

test('plural people are defined together with a plural concordance, while one person remains singular', () => {
 const definition=api('groupDefinition');
 assert.match(definition('conduttore',2),/persone sopra indicate.*denominate/);
 assert.match(definition('locatore',1),/persona sopra indicata.*denominata/);
});

test('an absent property can be migrated to an empty editable record', () => {
 const [unit]=api('migrateUnits')(null);
 assert.equal(unit.comune,''); assert.equal(unit.subalterno,''); assert.ok(unit.id);
});

test('person controls and field edits target stable ids after reorder and preserve the full name', () => {
 const people = api('migrateParties')([{id:'a',nome:'NOME COMPLETO A'},{id:'b',nome:'NOME COMPLETO B'}]);
 const changes=[]; const removals=[]; const moves=[];
 const editor=ui().editorControls({conduttori:api('moveRecord')(people,'b',-1),locatori:[],onConduttoreChange:(...args)=>changes.push(args),onRemoveConduttore:id=>removals.push(id),onMoveConduttore:(...args)=>moves.push(args),property:{}});
 const blocks=[{node:editor}];
 const surname = nodesOf(blocks,node => node.type === 'input' && node.props['data-identity-field'] === 'cognome')[0];
 surname.props.onChange({target:{value:'ROSSI'}});
 assert.deepEqual(changes,[['b','cognome','ROSSI']]); assert.equal(people[1].nome,'NOME COMPLETO B');
 nodesOf(blocks,node => node.type === 'button' && node.props['aria-label'] === 'Rimuovi conduttore 1')[0].props.onClick();
 assert.deepEqual(removals,['b']);
 nodesOf(blocks,node => node.type === 'button' && node.props['aria-label'] === 'Sposta conduttore 1 in basso')[0].props.onClick();
 assert.deepEqual(moves,[['b',1]]);
});

test('the identity-reader imports to one selected person through the new fields without overwriting the other person', () => {
 let people = api('migrateParties')([{id:'a',nome:'A'},{id:'b',nome:'B'}]);
 const onChange=(id,field,value)=>{people=api('updateRecord')(people,id,{[field]:value});};
 const blocks=ui().introBlocks({keyPrefix:'intro',conduttori:people,locatori:[],onConduttoreChange:onChange,property:{}});
 const targets=collectTargets({props:{blocks}},'/lease-contract-students');
 assert.equal(targets.length,2);
 const operations=planImport(targets[1],{givenNames:{confirmed:true,value:'LUCA'},surname:{confirmed:true,value:'VERDI'},birthPlace:{confirmed:true,value:'Roma'}});
 applyImport(operations,true);
 assert.equal(people[0].nome,'A'); assert.equal(people[1].nome,'LUCA VERDI'); assert.equal(people[1].natoA,'Roma');
});

test('fiscal helper patches a selected person by id without overwriting unrelated fields', () => {
 const calls=[];
 const editor=ui().editorControls({conduttori:api('migrateParties')([{id:'a',nome:'Mario Rossi',ci:'DOC'}]),locatori:[],onConduttorePatch:(...args)=>calls.push(args),renderFiscalAssistant:(person,index,onUpdated)=>{onUpdated({...person,cf:'CALCOLATO'});return null;},property:{}});
 assert.ok(editor); assert.equal(calls[0][0],'a'); assert.equal(calls[0][1].cf,'CALCOLATO'); assert.equal(calls[0][1].ci,'DOC');
});

test('editing commands live outside the printable intro and only real principal units can be linked to a garage', () => {
 const units=api('migrateUnits')([{id:'p',tipo:'principale',comune:'Padova'},{id:'q',tipo:'principale',comune:'Venezia'},{id:'g',tipo:'garage',mainUnitId:'p'}]);
 const changes=[];
 const props={units,conduttori:[api('createParty')()],locatori:[],onUnitChange:(...args)=>changes.push(args),onAddUnit:()=>{},onAddConduttore:()=>{}};
 const printable=ui().introBlocks(props);
 assert.equal(nodesOf(printable,node=>node.type==='button'||node.type==='select').length,0);
 const editor=ui().editorControls(props);
 const link=nodesOf([{node:editor}],node=>node.type==='select'&&node.props['data-unit-field']==='mainUnitId')[0];
 assert.deepEqual(link.props.children.map(option=>option.props.value),['','p','q']);
 link.props.onChange({target:{value:'q'}});assert.deepEqual(changes,[['g','mainUnitId','q']]);
 assert.equal(units[2].comune,'');
});

test('displayed names append an explicit surname once in student headings and signature rows', () => {
 assert.equal(api('displayName')({nome:'Mario Rossi',cognome:'Rossi'}),'Mario Rossi');
 assert.equal(api('displayName')({nome:'Mario',cognome:'Rossi'}),'Mario Rossi');
 assert.equal(api('displayName')({nome:'Anna Maria DE LUCA',cognome:'de luca'}),'Anna Maria DE LUCA');
 const people=[api('createParty')({nome:'Mario',cognome:'Rossi'})];
 assert.match(textOf(ui().studentBlocks({parties:people}).map(block=>block.node)),/Mario Rossi/);
 assert.match(textOf(ui().signatureBlocks({conduttori:people}).map(block=>block.node)),/Mario Rossi/);
});

test('student university fields have one independently editable block per tenant including the exact PA label', () => {
 const people=api('migrateParties')([{id:'a',nome:'Anna',universita:'A',sede:'Padova'},{id:'b',nome:'Luca',universita:'B',sede:'Venezia'}]);
 const changes=[];
 const blocks=ui().studentBlocks({parties:people,onChange:(...args)=>changes.push(args),leadText:'Articolo invariato',trailingText:'Requisiti invariati'});
 assert.equal(blocks.filter(block=>block.key.includes('-person-')).length,2);
 const inputs=nodesOf(blocks,node=>node.type==='input');
 for (const field of ['corsoStudi','universita','sede','codicePa','matricola','documentazione']) assert.equal(inputs.filter(node=>node.props['data-student-field']===field).length,2);
 const pa=inputs.filter(node=>node.props['data-student-field']==='codicePa');
 assert.equal(pa[0].props['aria-label'],'Conduttore 1: codice PA');
 pa[1].props.onChange({target:{value:'PA di B'}}); assert.deepEqual(changes,[['b','codicePa','PA di B']]);
 assert.match(textOf(blocks.map(block=>block.node)),/Articolo invariato/); assert.match(textOf(blocks.map(block=>block.node)),/Requisiti invariati/);
});

test('each property unit displays its own complete address and cadastre with editing controls', () => {
 const units=api('migrateUnits')([{id:'home',tipo:'principale',comune:'Padova',via:'Casa',vani:'5'},{id:'garage',tipo:'garage',comune:'Venezia',via:'Garage',categoria:'C/6',zc:'3'}]);
 const changes=[];
 const blocks=ui().introBlocks({conduttori:[api('createParty')()],locatori:[],units,onUnitChange:(...args)=>changes.push(args)});
 assert.equal(blocks.filter(block=>block.key.includes('-property-unit-')).length,2);
 const municipalities=nodesOf(blocks,node=>node.type==='input'&&node.props['data-unit-field']==='comune');
 assert.deepEqual(municipalities.map(node=>node.props.value),['Padova','Venezia']);
 municipalities[1].props.onChange({target:{value:'Abano Terme'}});assert.deepEqual(changes,[['garage','comune','Abano Terme']]);
 for(const field of ['foglio','particella','subalterno','zc','categoria','classe','vani','rendita']) assert.equal(nodesOf(blocks,node=>node.type==='input'&&node.props['data-unit-field']===field).length,2);
});

test('ordinary and specific-approval signatures each reserve one named line per person and never become shared', () => {
 const props={conduttori:api('migrateParties')([{id:'a',nome:'Anna'},{id:'b',nome:'Luca'}]),locatori:api('migrateParties')([{id:'l',nome:'Locatore'}])};
 const ordinary=ui().signatureBlocks(props);
 const specific=ui().signatureBlocks({...props,specificApproval:true});
 assert.equal(ordinary.length,3); assert.equal(specific.length,3);
 assert.ok(ordinary.every(block=>nodesOf([block],node=>node.props['data-signature-person']).length===1));
 assert.ok(specific.every(block=>textOf(block.node).includes('Approvazione specifica')));
 assert.deepEqual(ordinary.map(block=>nodesOf([block],node=>node.props['data-signature-person'])[0].props['data-signature-person']),['l','a','b']);
 assert.match(textOf(ordinary.map(block=>block.node)),/Anna/); assert.match(textOf(specific.map(block=>block.node)),/Luca/);
});
