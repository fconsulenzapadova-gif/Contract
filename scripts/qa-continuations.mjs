import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE_PATH||'/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const origin=process.env.BASE_URL||'http://localhost:5178',out=path.resolve('work/qa-continuations');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100}});
await context.addInitScript(()=>{window.__pdfSnapshots=[];window.print=()=>{window.parent.__pdfSnapshots.push({html:'<!doctype html>'+document.documentElement.outerHTML,pages:document.querySelectorAll('.a4-page').length});window.dispatchEvent(new Event('afterprint'));};});
const page=await context.newPage(),errors=[],report={pdfs:[],cases:[],syntheticData:true};
page.on('pageerror',error=>errors.push(error.message));
const textOfLength=size=>('Paragrafo con accenti àèìòù, città e informazioni complete.\n\n'+ 'RIGASENZASPAZI'.repeat(35)+'\n').repeat(150).slice(0,size);
async function assertPlan(selector,key,source){
 await page.waitForFunction(({selector,key,source})=>Array.from(document.querySelectorAll(selector+' .contract-continuation-text')).filter(node=>node.dataset.continuationKey===key).map(node=>node.textContent).join('')===source,{selector,key,source});
 const metrics=await page.locator(selector+' .contract-continuation-page').evaluateAll(pages=>pages.map(paper=>{
  const body=paper.querySelector('.contract-continuation-body'),footer=paper.querySelector('footer'),last=body.lastElementChild;
  return {bodyOverflow:body.scrollHeight-body.clientHeight,footerOverlap:last?last.getBoundingClientRect().bottom-footer.getBoundingClientRect().top:0,font:getComputedStyle(body.querySelector('.contract-continuation-text')).fontSize};
 }));
 assert(metrics.every(m=>m.bodyOverflow<=1&&m.footerOverlap<=0&&parseFloat(m.font)>=14),JSON.stringify(metrics));
 return metrics;
}
async function pdf(name,expectedKey,expectedSource){
 const count=await page.evaluate(()=>window.__pdfSnapshots.length);
 await page.getByRole('button',{name:'Salva PDF',exact:true}).click();
 await page.waitForFunction(count=>window.__pdfSnapshots.length>count,count,{timeout:20000});
 const snap=await page.evaluate(()=>window.__pdfSnapshots.at(-1));
 assert(snap.pages>2);
 const printed=await context.newPage();await printed.setContent(snap.html,{waitUntil:'networkidle'});await printed.evaluate(()=>document.fonts.ready);await printed.emulateMedia({media:'print'});
 const text=await printed.locator('.contract-continuation-text').evaluateAll((nodes,key)=>nodes.filter(node=>node.dataset.continuationKey===key).map(node=>node.textContent).join(''),expectedKey);
 assert.equal(text,expectedSource);
 await printed.pdf({path:path.join(out,name+'.pdf'),format:'A4',preferCSSPageSize:true,printBackground:true,margin:{top:'0',bottom:'0',left:'0',right:'0'}});
 const metrics=await printed.locator('.a4-page').evaluateAll(pages=>pages.map(paper=>({height:paper.getBoundingClientRect().height,width:paper.getBoundingClientRect().width})));
 assert(metrics.every(m=>Math.abs(m.height-1122.52)<2&&Math.abs(m.width-793.7)<2));
 await printed.locator('.a4-page').last().screenshot({path:path.join(out,name+'-last.png')});
 await printed.close();report.pdfs.push({name,pages:snap.pages,characters:expectedSource.length});
}
try {
 for(const kind of ['purchase','sharing']){
  const route=kind==='purchase'?'purchase-proposal':'property-sharing';
  await page.goto(origin+'/'+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  if(kind==='purchase')assert.equal(await page.locator('.purchase-template-page').count(),2);
  for(const size of [500,5000,10000,30000]){
   const source=textOfLength(size),selector=kind==='purchase'?'.purchase-template-pages':'.sharing-pages';
   const locator=kind==='purchase'?page.locator('[name="note"]'):page.getByLabel('File, link o descrizione 1',{exact:true});
   await locator.fill(source);
   const key=kind==='purchase'?'note':await page.evaluate(()=>JSON.parse(localStorage.getItem('gemut.contract.draft.v1:/property-sharing')).slots.document.materials[0].id).then(id=>'material:'+id);
   const metrics=await assertPlan(selector,key,source);
   await page.reload({waitUntil:'networkidle'});
   assert.equal(await (kind==='purchase'?page.locator('[name="note"]'):page.getByLabel('File, link o descrizione 1',{exact:true})).inputValue(),source);
   await assertPlan(selector,key,source);
   await pdf(kind+'-'+size,key,source);
   await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
   const native=await page.locator('.contract-native-print-copy .contract-continuation-text').evaluateAll((nodes,key)=>nodes.filter(node=>node.dataset.continuationKey===key).map(node=>node.textContent).join(''),key);
   assert.equal(native,source);
   await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
   report.cases.push({kind,size,metrics,reload:true,nativePrint:true});
  }
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Esporta bozza',exact:true}).click()]);
  const file=path.join(out,kind+'-draft.json');await download.saveAs(file);
  const saved=JSON.parse(await fs.readFile(file,'utf8'));
  const actual=kind==='purchase'?saved.slots.purchaseTemplate.note:saved.slots.document.materials[0].description;
  assert.equal(actual,textOfLength(30000));
  await (kind==='purchase'?page.locator('[name="note"]'):page.getByLabel('File, link o descrizione 1',{exact:true})).fill('Dato temporaneo da sostituire');
  await page.locator('.contract-draft-tools input[type=file]').setInputFiles(file);
  const confirm=page.getByRole('button',{name:'Conferma sostituzione bozza',exact:true});
  await confirm.waitFor({state:'visible'});
  await Promise.all([page.waitForEvent('load'),confirm.click()]);await page.waitForLoadState('networkidle');
  assert.equal(await (kind==='purchase'?page.locator('[name="note"]'):page.getByLabel('File, link o descrizione 1',{exact:true})).inputValue(),actual);
  await page.getByRole('button',{name:kind==='purchase'?'Espandi: Note':'Espandi: materiale 1',exact:true}).click();
  assert(await page.getByRole('dialog').isVisible());assert.equal(await page.getByLabel('Testo integrale del campo',{exact:true}).inputValue(),actual);
  await page.getByRole('button',{name:'Chiudi editor',exact:true}).click();
 }
 // More than five materials remain individually identified with their exact delivery status.
 for(let i=1;i<8;i++)await page.getByRole('button',{name:'Aggiungi materiale',exact:true}).click();
 for(let i=1;i<=8;i++){
  if(i>1)await page.getByLabel('File, link o descrizione '+i,{exact:true}).fill('Materiale aggiuntivo '+i+' àèìòù');
  await page.getByLabel('Stato materiale '+i,{exact:true}).selectOption(i%2?'sent':'pending');
 }
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.getByLabel('File, link o descrizione 8',{exact:true}).inputValue(),'Materiale aggiuntivo 8 àèìòù');
 assert.equal(await page.getByLabel('Stato materiale 8',{exact:true}).inputValue(),'pending');
 const content=await page.locator('.sharing-pages').innerText();assert(content.includes('Materiale aggiuntivo 8 àèìòù'));assert(content.includes('Da trasmettere dopo la firma'));assert(content.includes('Già trasmesso / presentato'));
 assert(content.includes('La firma attesta esclusivamente la presa visione e non equivale al consenso per attività promozionali.'));
 report.unlimitedMaterials=true;
 const mobile=await context.newPage();await mobile.setViewportSize({width:390,height:844});
 for(const route of ['purchase-proposal','property-sharing']){
  await mobile.goto(origin+'/'+route,{waitUntil:'networkidle'});
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' horizontal overflow');
  const button=mobile.getByRole('button',{name:route==='purchase-proposal'?'Espandi: Note':'Espandi: materiale 1',exact:true});await button.click();
  assert(await mobile.getByLabel('Testo integrale del campo',{exact:true}).isVisible());await mobile.getByRole('button',{name:'Chiudi editor',exact:true}).click();
  await mobile.getByRole('button',{name:'Anteprima',exact:true}).click();
  await mobile.getByRole('button',{name:'Salva PDF',exact:true}).waitFor({state:'visible'});
  assert(await mobile.getByRole('button',{name:'Salva PDF',exact:true}).isVisible());
 }
 await mobile.close();assert.deepEqual(errors,[]);report.mobile=true;report.errors=errors;report.pass=true;
 await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} finally {await browser.close();}
