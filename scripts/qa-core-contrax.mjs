import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const base=process.env.BASE_URL||'http://localhost:5178',out='work/qa-core';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),context=await browser.newContext({viewport:{width:1440,height:1000}});
await context.addInitScript(()=>{window.print=()=>{(window.parent.__prints||=[]).push(document.documentElement.outerHTML);window.dispatchEvent(new Event('afterprint'));}});
const page=await context.newPage(),errors=[],report={routes:[],longText:[],viewports:[],errors};page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE_ERROR',e.message);});
async function printed(name){const count=await page.evaluate(()=>window.__prints?.length||0);await page.getByRole('button',{name:'Salva PDF',exact:true}).click();await page.waitForFunction(count=>(window.__prints?.length||0)>count,count,{timeout:20000});const html=await page.evaluate(()=>window.__prints.at(-1));const p=await context.newPage();await p.setContent(html,{waitUntil:'networkidle'});await p.emulateMedia({media:'print'});await p.pdf({path:`${out}/${name}.pdf`,format:'A4',preferCSSPageSize:true,printBackground:true,margin:{top:'0',right:'0',bottom:'0',left:'0'}});await p.close();return html;}
try{
 const routes=['/purchase-proposal','/lease-proposal','/sales-assign','/lease-assign','/lease-contract-4-4','/lease-contract-4-4-cedolare','/lease-contract-concordato','/lease-contract-students','/lease-contract-transitorio','/lease-allegato-b','/property-sharing','/visit-sheet','/aml','/commission'];
 for(const route of routes){console.log('SMOKE',route);await page.goto(base+route,{waitUntil:'networkidle'});if(route==='/property-sharing'&&await page.getByRole('button',{name:'Anteprima',exact:true}).isVisible())await page.getByRole('button',{name:'Anteprima',exact:true}).click();await page.getByRole('button',{name:'Salva PDF',exact:true}).waitFor();assert(await page.locator('.a4-page').count()>0,route);assert.equal(await page.getByRole('button',{name:'Archivio e riuso dati',exact:true}).count(),1,route);report.routes.push({route,pages:await page.locator('.a4-page').count()});}
 await page.goto(base+'/lease-allegato-b',{waitUntil:'networkidle'});assert.equal(await page.locator('.allegato-b-slot:is(input,button):not([aria-label])').count(),0,'All Allegato B fields need names');
 for(const route of (process.env.QA_ONLY?process.env.QA_ONLY.split(','):['/aml','/sales-assign','/lease-contract-students','/visit-sheet'])){
  await page.goto(base+route,{waitUntil:'networkidle'});
  let selector=route==='/aml'?'[name="purpose"]':route==='/sales-assign'?'[name="note"]':route==='/visit-sheet'?'[name="address"]':route==='/lease-contract-students'?'[name="attachments"]':null;
  if(!selector){const names=await page.locator('.a4-page textarea').evaluateAll(es=>es.map(e=>e.name));selector=names.includes('note')?'[name="note"]':'textarea';}
  for(const n of [500,5000,10000,30000]){
   const text=('Paragrafo con accenti: è à ù.\nRiga lunga '+ 'x'.repeat(110)+'\n').repeat(Math.ceil(n/150)).slice(0,n)+'\nULTIMA_RIGA_'+n;
   let field=page.locator('.a4-page '+selector).first();
   // Once paginated, use the complete editor to access the original controlled field.
   if(!await field.count()){await page.getByRole('button',{name:'Modifica il testo completo',exact:true}).first().click();field=page.locator('dialog[open] '+selector).first();}
   await field.fill(text);if(await page.locator('.contract-long-editor[open]').count())await page.locator('.contract-long-editor').getByRole('button',{name:'Chiudi',exact:true}).click();
   await page.waitForTimeout(300);
   const raw=await page.evaluate(route=>JSON.parse(localStorage.getItem('gemut.contract.draft.v1:'+route)),route);const hasText=value=>value===text||value&&typeof value==='object'&&Object.values(value).some(hasText);assert(hasText(raw.slots),route+' persisted '+n);
   await page.evaluate(async route=>{const {exportDraft,importDraft}=await import('/assets/ContractDraft.js');const saved=exportDraft(localStorage,route);importDraft(localStorage,route,saved);},route);
   await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-layout-error]').count(),0);
   const geometry=await page.locator('.adaptive-document>.a4-page').evaluateAll(ps=>ps.map(p=>({bottom:p.getBoundingClientRect().bottom,footer:p.querySelector('.document-page-number')?.getBoundingClientRect().top,blocks:[...p.querySelectorAll(':scope>.a4-flow-block')].map(b=>b.getBoundingClientRect().bottom)})));
   for(const p of geometry)assert(p.blocks.every(b=>b<=p.footer+1),route+' content overlaps footer '+n+' '+JSON.stringify(p));
   const html=await printed(route.slice(1)+'-'+n);assert(html.includes('ULTIMA_RIGA_'+n),route+' printed last line '+n);
   report.longText.push({route,n,pages:geometry.length,sourceExact:true,pdf:true});await fs.writeFile(`${out}/partial-report.json`,JSON.stringify(report,null,2));
  }
  await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));assert.equal(await page.locator('body>.contract-native-print-copy').count(),1);await page.pdf({path:`${out}/${route.slice(1)}-native.pdf`,format:'A4',preferCSSPageSize:true,printBackground:true,margin:{top:'0',right:'0',bottom:'0',left:'0'}});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));assert.equal(await page.locator('body>.contract-native-print-copy').count(),0);
 }
 // Customer AML never includes internal rows, even when present in local draft.
 await page.goto(base+'/aml',{waitUntil:'networkidle'});await page.evaluate(()=>{const k='gemut.contract.draft.v1:/aml',e=JSON.parse(localStorage.getItem(k));Object.assign(e.slots.document,{subjectType:'physical',risk:'RISERVATO_NON_CLIENTE',verification:'CONTROLLO_INTERNO',outcome:'ESITO_INTERNO'});localStorage.setItem(k,JSON.stringify(e));});await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.a4-page [name="risk"]').count(),0);const html=await printed('aml-customer');assert(!html.includes('RISERVATO_NON_CLIENTE'));await page.getByLabel('Copia antiriciclaggio').selectOption('internal');assert.equal(await page.locator('.a4-page [name="risk"]').count(),1);
 for(const viewport of [{width:1440,height:1000},{width:834,height:1112},{width:390,height:844}]){await page.setViewportSize(viewport);await page.goto(base+'/purchase-proposal',{waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);await page.screenshot({path:`${out}/purchase-${viewport.width}.png`});report.viewports.push(viewport);}
 await page.goto(base+'/',{waitUntil:'networkidle'});await page.screenshot({path:`${out}/dashboard.png`});assert.equal(errors.length,0);await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({pass:true,routes:report.routes.length,longCases:report.longText.length,viewports:report.viewports,errors}));
}finally{await browser.close();}
