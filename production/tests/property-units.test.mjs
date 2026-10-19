import assert from 'node:assert/strict';
import {migrateModelUnits,normalizeUnitLinks} from '../src/PropertyUnits.js';
const proposal=migrateModelUnits({immUbicazione:'Via Lunga 8',foglio:'12',cat:'A/2',foglio2:'13',cat2:'C/6'},'/lease-proposal');
assert.equal(proposal.length,2);assert.equal(proposal[1].categoria,'C/6');assert.equal(proposal[1].via,'');
const linked=normalizeUnitLinks([{id:'home',tipo:'principale'},{id:'garage',tipo:'garage',mainUnitId:'home'}]);
assert.equal(linked[1].mainUnitId,'home');assert.equal(normalizeUnitLinks(linked.slice(1))[0].mainUnitId,'');
console.log('PASS legacy units across models; removed principal leaves no dangling link');
