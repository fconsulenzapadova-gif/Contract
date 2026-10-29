import test from 'node:test';
import assert from 'node:assert/strict';
import {migrateModelUnits,normalizeUnitLinks} from '../src/PropertyUnits.js';
const proposal=migrateModelUnits({immUbicazione:'Via Lunga 8',foglio:'12',cat:'A/2',foglio2:'13',cat2:'C/6'},'/lease-proposal');
assert.equal(proposal.length,2);assert.equal(proposal[1].categoria,'C/6');assert.equal(proposal[1].via,'');
const linked=normalizeUnitLinks([{id:'home',tipo:'principale'},{id:'garage',tipo:'garage',mainUnitId:'home'}]);
assert.equal(linked[1].mainUnitId,'home');assert.equal(normalizeUnitLinks(linked.slice(1))[0].mainUnitId,'');
console.log('PASS legacy units across models; removed principal leaves no dangling link');

test('property descriptions support multiline editing without normalizing paragraphs',async()=>{
 const {createContractRecordsUI}=await import('../src/ContractRecordsUI.js');
 const React={Fragment:Symbol('Fragment'),Children:{toArray:value=>Array.isArray(value)?value:[value]},createElement:(type,props,...children)=>({type,props:{...props,children}})};
 const changes=[],ui=createContractRecordsUI(React),blocks=ui.propertyBlocks({units:[{id:'unit-long',tipo:'principale',descrizione:''}],onUnitChange:(...args)=>changes.push(args)});
 const all=[];function walk(node){if(Array.isArray(node))node.forEach(walk);else if(node?.props){all.push(node);walk(node.props.children);}}walk(blocks.map(b=>b.node));
 const field=all.find(node=>node.props['data-unit-field']==='descrizione');assert.equal(field.type,'textarea');
 const value='Descrizione è completa.\n\nSecondo paragrafo.';field.props.onChange({target:{value}});assert.equal(changes[0][2],value);
});
