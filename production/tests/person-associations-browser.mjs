import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true}),context=await browser.newContext({viewport:{width:1600,height:1200}}),page=await context.newPage();
try{
 await page.goto('http://127.0.0.1:5174/lease-proposal',{waitUntil:'networkidle'});const fields=page.locator('.a4-page .contract-entry-group [data-identity-field="nome"]');await fields.nth(0).fill('Prima persona');await fields.nth(1).fill('Seconda persona');
 await fields.nth(0).evaluate(e=>{const props=e[Object.keys(e).find(key=>key.startsWith('__reactProps$'))];window.__queuedIdentityChange=props.onChange;});
 await page.locator('.contract-editor-records summary').click();
 await page.getByRole('button',{name:'Sposta Proponente 1 in basso',exact:true}).click();
 await page.evaluate(()=>window.__queuedIdentityChange({target:{value:'Prima persona aggiornata'},identityImport:true}));
 assert.equal(await fields.first().inputValue(),'Seconda persona','A queued callback must keep its person after reordering');
 assert.equal(await fields.nth(1).inputValue(),'Prima persona aggiornata');
 await page.getByRole('button',{name:'Rimuovi Proponente 2',exact:true}).click();assert.equal(await fields.first().inputValue(),'Seconda persona');await page.evaluate(()=>window.__queuedIdentityChange({target:{value:'Importazione della persona rimossa'},identityImport:true}));assert.equal(await fields.first().inputValue(),'Seconda persona','A queued identity operation must not transfer to a different person after removal');
 await fs.writeFile(new URL('../qa-contract-2026-10-12/final/person-associations-browser.json',import.meta.url),JSON.stringify({callbackFollowsPersonAfterReordering:true,removedPersonCallbackCannotModifyRemainingPerson:true},null,2));console.log('PASS identity callback retains person id across reordering and removal');
}finally{await browser.close();}
