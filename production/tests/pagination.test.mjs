import assert from 'node:assert/strict';
import {paginateBlocks} from '../src/AdaptiveDocument.js';
assert.deepEqual(paginateBlocks([{key:'a',height:80},{key:'b',height:40},{key:'c',height:20}],100),[['a'],['b','c']]);
assert.deepEqual(paginateBlocks([{key:'heading+paragraph',height:60},{key:'tail',height:20}],70),[['heading+paragraph'],['tail']]);
assert.deepEqual(paginateBlocks([{key:'long',height:110}],100),[['long']]);
console.log('PASS pagination: no duplicate/empty pages, heading grouped with paragraph');

const React={Fragment:Symbol('Fragment'),Children:{toArray:value=>(Array.isArray(value)?value:[value]).filter(x=>x!=null&&x!==false)},createElement:(type,props,...children)=>({type,props:{...props,children}}),cloneElement:(node,props,...children)=>({...node,props:{...node.props,...props,...(children.length?{children}:{})}})};
const {splitDocumentBlocks}=await import('../src/AdaptiveDocument.js');
const paired=splitDocumentBlocks(React,[{key:'date',node:React.createElement('label',null,'Luogo e data',React.createElement('textarea',{name:'date',value:''}))},{key:'signature',node:React.createElement('div',{className:'med-signatures'},'Il cliente')}]);
assert.equal(paired.length,1,'A signature must stay with its preceding date/context, instead of becoming an isolated last page');
