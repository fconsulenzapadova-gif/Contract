import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeProposalBlocks} from '../src/ProposalRecords.js';
import {composeInlineData} from '../src/InlineComposition.js';
const React={Fragment:Symbol('Fragment'),Children:{toArray:value=>[value].flat(Infinity).filter(v=>v!=null&&v!==false)},createElement:(type,props,...children)=>({type,props:{...props,children:children.length===1?children[0]:children}}),cloneElement:(node,props,...children)=>({...node,props:{...node.props,...props,children:children.length===1?children[0]:children}})};
test('lease proposal replaces its actual property header and retains only actual units',()=>{
 const units=[{id:'u1',tipo:'principale',comune:'Padova',via:'Via Verifica',foglio:'72',particella:'412',subalterno:'8'}];
 const blocks=mergeProposalBlocks(React,[{key:'section-1-header',node:React.createElement('div',null,'old address')},{key:'section-1-identificativi-main',node:React.createElement('p',null,'old cadastral')}],{lease:true,property:{units},owners:[]});
 assert(blocks.some(b=>b.key==='property-records-property-unit-u1'));
 assert(!blocks.some(b=>b.key==='section-1-header'||b.key==='section-1-identificativi-main'));
});
test('inline field composition retains a real breakable space between comma and next label',()=>{
 const input=React.createElement('input',{value:'Mario'});
 const result=composeInlineData(React,React.createElement('p',null,'Il signor ',input,', nato a ',React.createElement('input',{value:'Padova'}),'.'));
 assert(result.props.children.some(child=>typeof child==='string'&&/\s$/.test(child)));
});

test('all lease heading conventions stay with the first paragraph',async()=>{
 const {splitDocumentBlocks}=await import('../src/AdaptiveDocument.js');
 for(const title of ['4. RECESSO ANTICIPATO','1Bis) NATURA TRANSITORIA','Articolo 9 (Consegna)']){
  const blocks=splitDocumentBlocks(React,[{key:'clause',node:React.createElement(React.Fragment,null,React.createElement('div',null,title),React.createElement('p',null,'Testo della clausola.'),React.createElement('p',null,'Secondo paragrafo.'))}]);
  assert.equal(blocks.length,2);assert.equal(blocks[0].node.props.children.length,2);
 }
});
test('standalone title blocks and TRA/E stay with the following person or paragraph',async()=>{
 const {splitDocumentBlocks}=await import('../src/AdaptiveDocument.js');
 for(const title of [React.createElement('h3',null,'DESCRIZIONE IMMOBILE'),React.createElement('div',null,'TRA')]){
  const blocks=splitDocumentBlocks(React,[{key:'heading',node:title},{key:'person',node:React.createElement('p',null,'Dati completi della persona.')}]);assert.equal(blocks.length,1);assert.equal(blocks[0].node.props.children.length,2);
 }
});
test('codice PA label with a colon remains atomic with its own value',()=>{
 const composed=composeInlineData(React,React.createElement('p',null,'sede Padova, codice PA: ',React.createElement('input',{value:'PA-TEST'}),', matricola: ',React.createElement('input',{value:'TEST-001'}),'.'));
 const values=composed.props.children.filter(child=>child?.props?.className==='contract-inline-value');assert(values[0].props.children[0].includes('codice PA:'));assert(values[1].props.children[0].includes('matricola:'));
});
