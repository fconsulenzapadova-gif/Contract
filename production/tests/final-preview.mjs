import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1100}});
const out=new URL('../qa-contract-2026-10-12/final/',import.meta.url),errors=[],models=[];
page.on('pageerror',error=>errors.push(error.message));
try{
 const response=await page.request.get('http://127.0.0.1:5173/assets/app.js');assert.equal(response.status(),200);
 assert.equal(await response.text(),await fs.readFile(new URL('../dist/assets/app.js',import.meta.url),'utf8'),'Default preview serves the edited app, not the frozen baseline');
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.screenshot({path:new URL('anteprima-dashboard.png',out).pathname,fullPage:true});
 for(const route of ['purchase-proposal','lease-proposal','sales-assign','lease-assign','lease-contract-4-4','lease-contract-4-4-cedolare','lease-contract-concordato','lease-contract-students','lease-contract-transitorio','visit-sheet','aml','commission','lease-allegato-b']){
  await page.goto('http://127.0.0.1:5173/'+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.locator('.a4-page').first().waitFor();
  const pages=await page.locator('.a4-page').count();assert(pages>0);
  assert.equal(await page.getByRole('button',{name:'Salva PDF',exact:true}).count(),1);
  if(route==='lease-allegato-b')assert.equal(await page.locator('.allegato-b-page').count(),5);
  else assert.equal(await page.getByRole('button',{name:'Esporta bozza',exact:true}).count(),1);
  models.push({route,pages,loaded:true});
 }
 assert.deepEqual(errors,[]);await fs.writeFile(new URL('final-preview.json',out),JSON.stringify({origin:'http://localhost:5173',matchesFinalApp:true,models,errors},null,2));console.log('PASS final default preview: current app, 13 models, no browser errors');
}finally{await browser.close();}
