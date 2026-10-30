import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareDocument} from '../production/src/DocumentTypography.js';

test('print preparation rejects an invalid closing document from its preview before any PDF or archive capture',async()=>{
 const root={closest:()=>({dataset:{documentIssues:'La proposta è già accettata: occorre un diverso accordo.'}})};
 await assert.rejects(prepareDocument(root),/già accettata/);
});
test('archive capture rejects invalid closing data when preparation starts from the document body',async()=>{
 const root={closest:()=>null,querySelector:()=>({dataset:{documentIssues:'Indicare il riferimento univoco.'}})};
 await assert.rejects(prepareDocument(root),/riferimento univoco/);
});
