import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createMediationAssignment} from '../src/MediationAssignment.js';
import {createLeaseMediationAssignment} from '../src/LeaseMediationAssignment.js';
import {createProfessionalDocument} from '../src/ProfessionalDocuments.js';
import {useReviewedBlocks} from '../src/DocumentReview.js';
let cells=[],cursor=0;
const React={useRef:v=>({current:v}),useCallback:f=>f,useEffect:()=>{},createElement:(type,props,...children)=>({type,props:{...props,children}}),useState(init){let i=cursor++;if(!(i in cells))cells[i]=typeof init==='function'?init():init;return[cells[i],v=>cells[i]=typeof v==='function'?v(cells[i]):v]}};
function render(fn,reset=false){cursor=0;if(reset)cells=[];return fn()}
const stub=()=>null;
for(const [name,factory] of [['sale',createMediationAssignment],['lease',createLeaseMediationAssignment]]){
 const Component=factory(React,stub,stub,stub);const tree=render(Component,true);const serialized=JSON.stringify(tree);
 assert(!serialized.toLowerCase().includes('provvigione'));
 assert(serialized.includes(name==='sale'?'potenziali acquirenti':'potenziali conduttori'));
 assert(serialized.includes('05791060287'));assert(serialized.includes('54-bis'));
 console.log('PASS:',name,'assignment, no commission, contacts and consumer terms');
}
for(const kind of ['fee','aml']){
 const Component=createProfessionalDocument(React,stub,stub,stub,kind);const tree=render(Component,true);
 const blocks=tree.props.preview.props.blocks;assert(blocks.length>=6);
 const text=JSON.stringify(blocks);assert(text.includes(kind==='fee'?'1757':'titolare effettivo'));
 console.log('PASS:',kind,'module');
}
globalThis.location={pathname:'/purchase-proposal'};
const original=[{key:'intro',node:'original'},{key:'signature',node:'signature'}];
let blocks=render(()=>useReviewedBlocks(React,original),true);
assert.equal(blocks.at(-1).key,'signature');assert.equal(blocks.length,4);assert.equal(original.length,2);
function find(node,p){if(!node||typeof node!=='object')return; if(p(node))return node;for(const v of Object.values(node)){if(Array.isArray(v)){for(const n of v){const r=find(n,p);if(r)return r}}else if(v&&typeof v==='object'){const r=find(v,p);if(r)return r}}}
const field=find(blocks.find(b=>b.key==='review-property'),n=>n.type==='textarea');field.props.onChange({target:{value:'DOCUMENTO DI PROVA'}});
blocks=render(()=>useReviewedBlocks(React,original));assert(JSON.stringify(blocks).includes('DOCUMENTO DI PROVA'));
console.log('PASS: supplemental fields preserve input through repagination and precede signatures');
const builtApp=readFileSync(new URL('../dist/assets/app.js',import.meta.url),'utf8');
assert(builtApp.includes('la somma assume la natura di '));
assert(builtApp.includes('CAPARRA CONFIRMATORIA'));
assert(!builtApp.includes('la somma assume la natura espressamente scelta di'));
console.log('PASS: purchase deposit conversion matches the sole stated caparra type');
const repeatedPrivacyInCommunications=(builtApp.match(/Per le comunicazioni contrattuali[^"`]*I dati personali/g)||[]).length;
assert.equal(repeatedPrivacyInCommunications,3);
console.log('PASS: standalone 4+4 privacy articles are not repeated in domicile clauses');
globalThis.location={pathname:'/lease-contract-4-4'};
blocks=render(()=>useReviewedBlocks(React,original),true);
assert.equal(blocks.length,original.length);
assert.equal(blocks.at(-1).key,'signature');
console.log('PASS: 4+4 retains its existing APE text without a redundant supplemental block');
