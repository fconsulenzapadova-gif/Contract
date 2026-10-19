/** Read-only browser evidence against the frozen baseline served on port 5173. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {chromium} from '/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'qa-contract-2026-10-12/baseline');
const origin = process.env.BASELINE_URL || 'http://127.0.0.1:5173';
const models = [
 ['/purchase-proposal','Or','bundle'], ['/lease-proposal','Gs','bundle'],
 ['/sales-assign','Ks','MediationAssignment.js'], ['/lease-assign','qs','LeaseMediationAssignment.js'],
 ['/lease-contract-4-4','oc','bundle'], ['/lease-contract-4-4-cedolare','sc','bundle'],
 ['/lease-contract-concordato','cc','bundle'], ['/lease-contract-students','ac','bundle'],
 ['/lease-contract-transitorio','uc','bundle'], ['/lease-allegato-b','Fc','bundle raster/overlay'],
 ['/visit-sheet','VisitSheet','VisitSheet.js'], ['/aml','Js','ProfessionalDocuments.js aml'],
 ['/commission','Ys','ProfessionalDocuments.js fee'],
];
const browser = await chromium.launch({channel:'chrome', headless:true});
const context = await browser.newContext({viewport:{width:1600,height:1200}, deviceScaleFactor:1});
await context.addInitScript(() => {
 window.print = function() {
  document.querySelectorAll('input,textarea,select').forEach(field => {
   if (field.tagName === 'TEXTAREA') field.textContent = field.value;
   else if (field.tagName === 'SELECT') [...field.options].forEach(option => option.toggleAttribute('selected',option.selected));
   else { field.setAttribute('value',field.value); field.toggleAttribute('checked',field.checked); }
  });
  const host = window.parent;
  host.__qaPrintSnapshots ||= [];
  host.__qaPrintSnapshots.push({html:'<!doctype html>\n'+document.documentElement.outerHTML,
   text:document.body.innerText, pages:document.querySelectorAll('.a4-page').length,
   measureShells:document.querySelectorAll('.a4-measure-shell').length,
   fields:[...document.querySelectorAll('input,textarea,select')].map(f=>({name:f.name,value:f.value,checked:f.checked}))});
  window.dispatchEvent(new Event('afterprint'));
 };
});
const page = await context.newPage();
const errors = [];
page.on('pageerror',e => errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const report = {origin, capturedAt:new Date().toISOString(),models:[], errors};
await fs.mkdir(path.join(output,'exports'),{recursive:true});
await fs.mkdir(path.join(output,'screenshots'),{recursive:true});
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
async function settle() {
 await page.locator('.a4-page').first().waitFor();
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(650);
}
async function captureExport(slug) {
 await page.evaluate(()=>window.__qaPrintSnapshots=[]);
 await page.getByRole('button',{name:'Salva PDF',exact:true}).click();
 await page.waitForFunction(()=>window.__qaPrintSnapshots?.length===1,{timeout:15000});
 const snapshot = await page.evaluate(()=>window.__qaPrintSnapshots[0]);
 assert.equal(snapshot.measureShells,0,'Export must omit duplicate measurement content');
 await fs.writeFile(path.join(output,'exports',slug+'.html'),snapshot.html);
 const printPage = await context.newPage();
 await printPage.setContent(snapshot.html,{waitUntil:'networkidle'});
 await printPage.evaluate(()=>document.fonts.ready);
 await printPage.emulateMedia({media:'print'});
 await printPage.waitForTimeout(150);
 const pdf = await printPage.pdf({path:path.join(output,'exports',slug+'.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true,margin:{top:'0',bottom:'0',left:'0',right:'0'}});
 const printMetrics=await printPage.evaluate(()=>[...document.querySelectorAll('.a4-page')].map((p,index)=>{
  const rect=p.getBoundingClientRect(),s=getComputedStyle(p),padBottom=parseFloat(s.paddingBottom)||0;
  const descendants=[...p.querySelectorAll('*')].filter(n=>!n.closest('.document-page-number,.visit-footer')&&getComputedStyle(n).display!=='none');
  const bottom=Math.max(rect.top,...descendants.map(n=>n.getBoundingClientRect().bottom));
  return {page:index+1,width:rect.width,height:rect.height,scrollHeight:p.scrollHeight,clientHeight:p.clientHeight,
   contentBottom:bottom-rect.top,contentLimit:rect.height-padBottom,overflowPx:Math.max(0,bottom-rect.bottom+padBottom)};
 }));
 await printPage.close();
 return {pages:snapshot.pages,htmlSha256:sha256(snapshot.html),pdfSha256:sha256(pdf),measureShells:snapshot.measureShells,fields:snapshot.fields,printMetrics,text:snapshot.text};
}

try {
 for (const [route,component,source] of models) {
  const slug=route.slice(1);
  await page.goto(origin+route,{waitUntil:'networkidle'});
  await settle();
  const inventory=await page.evaluate(()=>{
   const pages=[...document.querySelectorAll('.a4-page')];
   const fields=[...document.querySelectorAll('.a4-page input,.a4-page textarea,.a4-page select')];
   const metadata=fields.map((f,index)=>({index,name:f.name,identityField:f.dataset.identityField||'',tag:f.tagName.toLowerCase(),type:f.type,
    ariaLabel:f.getAttribute('aria-label')||'',value:f.value,maxLength:f.maxLength,
    label:f.closest('label')?.innerText||f.parentElement?.innerText?.slice(0,140)||'',
    options:f.tagName==='SELECT'?[...f.options].map(o=>({value:o.value,label:o.text})):undefined}));
   return {title:document.querySelector('h1')?.innerText,pages:pages.length,fieldCount:fields.length,fields:metadata,
    choices:[...document.querySelectorAll('.a4-page button')].map(b=>({label:b.getAttribute('aria-label')||b.innerText,
     role:b.getAttribute('role'),checked:b.getAttribute('aria-checked'),pressed:b.getAttribute('aria-pressed'),title:b.title})),
    buttons:[...document.querySelectorAll('button')].filter(b=>!b.closest('.a4-measure-shell')).map(b=>b.getAttribute('aria-label')||b.innerText),
    layouts:pages.map((p,index)=>({page:index+1,background:getComputedStyle(p).backgroundImage,slots:p.querySelectorAll('.allegato-b-slot').length,
      width:p.offsetWidth,height:p.offsetHeight,scrollHeight:p.scrollHeight})),
    storage:{local:[...Array(localStorage.length)].map((_,i)=>localStorage.key(i)),session:[...Array(sessionStorage.length)].map((_,i)=>sessionStorage.key(i))}};
  });
  if(route==='/lease-allegato-b') {
   assert.equal(inventory.pages,5); assert.equal(inventory.layouts.filter(p=>p.background!=='none').length,5);
   assert.equal(inventory.layouts.reduce((sum,p)=>sum+p.slots,0),298);
   for(let n=0;n<5;n++) await page.locator('.allegato-b-page').nth(n).screenshot({path:path.join(output,'screenshots',`allegato-b-empty-${n+1}.png`)});
   inventory.blankExport=await captureExport('lease-allegato-b-empty');
  }
  const first=page.locator('.a4-page input[type="text"],.a4-page textarea').first();
  const token=`QA ${slug} valore recente`;
  let live=null;
  if(await first.count()) {
   await first.fill(token);
   await settle();
   live=await first.inputValue();
  }
  const exported=await captureExport(slug+'-latest');
  if(live) assert(exported.text.includes(live)||exported.fields.some(f=>f.value===live),'Salva PDF must capture the latest value');
  await page.reload({waitUntil:'networkidle'}); await settle();
  const afterReload=await page.locator('.a4-page input[type="text"],.a4-page textarea').first().inputValue().catch(()=>null);
  const persistence={probeValue:live,reloadValue:afterReload,retained:!!live&&afterReload===live};
  report.models.push({route,component,source,...inventory,export:{...exported,text:undefined},persistence});
  console.log(JSON.stringify({route,pages:inventory.pages,fields:inventory.fieldCount,choices:inventory.choices.length,
   exportPages:exported.pages,persistence:persistence.retained,overflow:exported.printMetrics.filter(p=>p.overflowPx>1)}));
  await fs.writeFile(path.join(output,'inventory.json'),JSON.stringify(report,null,2));
 }
 const files=await fs.readdir(path.join(output,'screenshots'));
 const screenshotHashes=Object.fromEntries(await Promise.all(files.map(async filename=>[filename,sha256(await fs.readFile(path.join(output,'screenshots',filename)))])));
 report.screenshotHashes=screenshotHashes;
 await fs.writeFile(path.join(output,'inventory.json'),JSON.stringify(report,null,2));
 console.log('Baseline captured:',report.models.length,'models; errors:',errors.length);
} finally { await browser.close(); }
