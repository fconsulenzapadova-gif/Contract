import test from 'node:test';
import assert from 'node:assert/strict';
const flow=await import('../src/FlowPagination.js').catch(()=>({}));
test('text segmentation preserves every character and never splits surrogate pairs',()=>{
 assert.equal(typeof flow.textSegments,'function');
 for(const n of [500,5000,10000,30000]){
  const text=('À Padova: prova 👤\nParagrafo con accenti è. ').repeat(n).slice(0,n)+'ULTIMA RIGA';
  const parts=flow.textSegments(text,value=>value.length<=271);
  assert.equal(parts.join(''),text);assert(parts.length>1);
  assert(parts.every(p=>p.length<=271&&!/[\uD800-\uDBFF]$/.test(p)));
 }
});
test('segmentation rejects a renderer that cannot fit even a character',()=>{
 assert.throws(()=>flow.textSegments('x',()=>false),/spazio/);
});
