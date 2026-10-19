import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true}),context=await browser.newContext({viewport:{width:1600,height:1200}}),page=await context.newPage(),out=new URL('../qa-contract-2026-10-12/final/',import.meta.url);
try{
 await page.goto('http://127.0.0.1:5174/lease-contract-students',{waitUntil:'networkidle'});const field=page.locator('.a4-page [data-identity-field="nome"]').first();await field.fill('Maria Chiara Bianchi — ultimo valore');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
 await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));assert.equal(await page.locator('body>.contract-native-print-copy').count(),1,'Native print uses shared static document conversion');assert.equal(await page.locator('body>.contract-native-print-copy input').count(),0);assert((await page.locator('body>.contract-native-print-copy').innerText()).includes('Maria Chiara Bianchi — ultimo valore'));
 await page.pdf({path:new URL('stampa-browser-studenti.pdf',out).pathname,format:'A4',printBackground:true,preferCSSPageSize:true,margin:{top:'0',bottom:'0',left:'0',right:'0'}});
 await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));assert.equal(await page.locator('body>.contract-native-print-copy').count(),0);assert.equal(await field.inputValue(),'Maria Chiara Bianchi — ultimo valore');await field.fill('Valore modificato dopo stampa');assert.equal(await field.inputValue(),'Valore modificato dopo stampa');
 await fs.writeFile(new URL('native-print-results.json',out),JSON.stringify({browser:'Google Chrome',latestValue:true,sharedStaticConversion:true,editableAfterPrint:true},null,2));console.log('PASS actual browser print: latest value, shared conversion, editable after print');
}finally{await browser.close();}
