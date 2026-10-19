import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {writeFileSync} from 'node:fs';
import {flattenOcr} from '../src/IdentityLayout.js';
import {extractIdentity} from '../src/IdentityData.js';
const require=createRequire(import.meta.url),T=require('/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/tesseract.js');
const root=fileURLToPath(new URL('../',import.meta.url));
const expected={surname:'ROSSI',givenNames:'MARIO',birthPlace:'ROMA',birthDate:'1980-01-01',taxCode:'RSSMRA80A01H501U',residence:'VIA DI PROVA 10 - ROMA',documentNumber:'CA12345AB',issuer:'COMUNE DI ROMA',issueDate:'2020-03-02',expiryDate:'2030-01-01'};
const worker=await T.createWorker('ita+eng',1,{langPath:root+'public/identity-runtime/languages',cacheMethod:'none'});
const report={synthetic:true,expected,modes:[],regressions:[]};
try{
 for(const [name,psm] of [['AUTO',T.PSM.AUTO],['SPARSE_TEXT',T.PSM.SPARSE_TEXT]]){
  await worker.setParameters({tessedit_pageseg_mode:psm,preserve_interword_spaces:'1'});
  const pages=[];
  for(const side of ['retro','fronte']){const {data}=await worker.recognize(root+'qa-identity/cie-layout-'+side+'.png',{}, {text:true,blocks:true});pages.push({text:data.text,confidence:data.confidence,lines:flattenOcr(data),width:2000,height:1300});}
  const {fields}=extractIdentity(pages,'card',new Date('2026-10-03T12:00:00Z'));
  const failures=Object.entries(expected).filter(([key,value])=>fields[key].value!==value||fields[key].status==='inconsistent').map(([key,value])=>({key,expected:value,actual:fields[key].value,status:fields[key].status,alternatives:fields[key].alternatives}));
  report.modes.push({name,passed:10-failures.length,failures,fields,pages});console.log(name+': '+(10-failures.length)+'/10');
 }
 await worker.setParameters({tessedit_pageseg_mode:T.PSM.AUTO});
 for(const [file,kind,values] of [
  ['carta-prova.png','card',{surname:'ROSSI',givenNames:'MARIO',birthPlace:'ROMA',birthDate:'1980-01-01',documentNumber:'CA12345AB',taxCode:'RSSMRA80A01H501U'}],
  ['carta-prova.jpg','card',{surname:'ROSSI',givenNames:'MARIO',birthPlace:'ROMA',birthDate:'1980-01-01',documentNumber:'CA12345AB',taxCode:'RSSMRA80A01H501U'}],
  ['patente-prova.png','licence',{surname:'ROSSI',givenNames:'MARIO',birthPlace:'ROMA',birthDate:'1980-01-01',documentNumber:'RM1234567A'}],
  ['passaporto-prova.png','passport',{surname:'ERIKSSON',givenNames:'ANNA MARIA',birthDate:'1974-08-12',documentNumber:'L898902C3'}],
 ]){
  const {data}=await worker.recognize(root+'qa-identity/'+file,{}, {text:true,blocks:true});
  const {fields}=extractIdentity([{text:data.text,confidence:data.confidence,lines:flattenOcr(data)}],kind,new Date('2026-10-03T12:00:00Z'));
  for(const [key,value] of Object.entries(values))assert.equal(fields[key].value,value,file+' '+key);
  report.regressions.push({file,expected:values,passed:true});console.log(file+': passed');
 }
 writeFileSync(root+'qa-identity/ocr-layout-results.json',JSON.stringify(report,null,2)+'\n');
 assert.equal(report.modes[0].passed,10,'The production AUTO mode must recover every expected field without conflicts.');
}finally{await worker.terminate();}
