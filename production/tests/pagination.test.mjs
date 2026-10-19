import assert from 'node:assert/strict';
import {paginateBlocks} from '../src/AdaptiveDocument.js';
assert.deepEqual(paginateBlocks([{key:'a',height:80},{key:'b',height:40},{key:'c',height:20}],100),[['a'],['b','c']]);
assert.deepEqual(paginateBlocks([{key:'heading+paragraph',height:60},{key:'tail',height:20}],70),[['heading+paragraph'],['tail']]);
assert.deepEqual(paginateBlocks([{key:'long',height:110}],100),[['long']]);
console.log('PASS pagination: no duplicate/empty pages, heading grouped with paragraph');
