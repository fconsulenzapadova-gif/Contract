import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1200}}),page=await context.newPage();
const out=new URL('../qa-contract-2026-10-12/final/',import.meta.url),errors=[];
page.on('pageerror',error=>errors.push(error.message));
await context.addInitScript(()=>window.print=()=>{window.parent.__studentSnapshot={html:'<!doctype html>'+document.documentElement.outerHTML,text:document.body.innerText,pages:document.querySelectorAll('.a4-page').length};window.dispatchEvent(new Event('afterprint'));});
try{
 await page.goto('http://127.0.0.1:5174/');
 await page.evaluate(()=>localStorage.setItem('gemut.contract.draft.v1:/lease-contract-students',JSON.stringify({schema:1,model:'/lease-contract-students',slots:{
  document:{immComune:'Padova',immVia:'Via della Ricerca Universitaria',immNumero:'28',durataMesi:'12',durataDal:'01/11/2026',durataAl:'31/10/2027'},
  tenants:[{id:'marco-prova',nome:'Marco Rossi',sesso:'M',natoA:'Santa Giustina in Colle',prov:'PD',natoIl:'2004-05-20',cf:'RSSMRC04E20I207D',matricola:'TEST-MARCO',codicePa:'PA-MARCO',corsoStudi:'Ingegneria',universita:'Università degli Studi di Padova'},
   {id:'maria-prova',nome:'Maria Chiara Bianchi',sesso:'F',natoA:'Santa Giustina in Colle',prov:'PD',natoIl:'2004-05-20',cf:'BNCMCH04E60I207P',matricola:'TEST-MARIA',codicePa:'PA-MARIA',corsoStudi:'Scienze dell’educazione',universita:'Università degli Studi di Padova'}],
  landlords:[{id:'matteo-prova',nome:'Matteo Ferrari',sesso:'M',natoA:'Padova',prov:'PD',natoIl:'1970-03-15',cf:'FRRMTT70C15G224L'}],
  preservedUnknownValue:{reference:'dato precedente conservato'}
 }})));
 await page.goto('http://127.0.0.1:5174/lease-contract-students',{waitUntil:'networkidle'});
 await page.locator('.contract-editor-records summary').click();
 await page.getByLabel('Conduttore 2: trattamento',{exact:true}).selectOption('signorina');
 await page.getByRole('button',{name:'Sposta conduttore 2 in alto',exact:true}).click();
 assert.equal(await page.locator('.a4-page [data-student-field="matricola"]').first().inputValue(),'TEST-MARIA');
 await page.getByRole('button',{name:'Rimuovi conduttore 2',exact:true}).click();
 await page.reload({waitUntil:'networkidle'});
 await page.locator('.contract-editor-records summary').click();
 assert.equal(await page.getByLabel('Conduttore 1: trattamento',{exact:true}).inputValue(),'signorina');
 assert.equal(await page.locator('.a4-page [data-student-field="codicePa"]').inputValue(),'PA-MARIA');
 const matricola=page.locator('.a4-page [data-student-field="matricola"]');
 await matricola.fill('TEST-MARIA-ULTIMO-VALORE');
 await page.getByRole('button',{name:'Salva PDF',exact:true}).click();await page.waitForFunction(()=>window.__studentSnapshot);
 const snap=await page.evaluate(()=>window.__studentSnapshot);
 assert(snap.text.includes('La signorina Maria Chiara Bianchi'));
 assert(snap.text.includes('TEST-MARIA-ULTIMO-VALORE'));
 assert(!snap.text.includes('Marco Rossi'));assert(!snap.text.includes('PA-MARCO'));
 assert.equal(await page.locator('.a4-page [data-signature-kind="ordinary"]').count(),2);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('gemut.contract.draft.v1:/lease-contract-students')).slots.preservedUnknownValue.reference),'dato precedente conservato');
 const printable=await context.newPage();await printable.setContent(snap.html,{waitUntil:'networkidle'});await printable.evaluate(()=>document.fonts.ready);
 await printable.pdf({path:new URL('studenti-signorina-riordino-e-riapertura.pdf',out).pathname,format:'A4',printBackground:true,preferCSSPageSize:true,margin:{top:'0',bottom:'0',left:'0',right:'0'}});await printable.close();
 await fs.writeFile(new URL('student-associations-browser.json',out),JSON.stringify({manualSignorina:true,reorderKeepsEnrollment:true,removedPersonAbsent:true,reopenedEditable:true,latestValueExported:true,unknownLegacyValuePreserved:true,pages:snap.pages,errors},null,2));
 assert.deepEqual(errors,[]);console.log('PASS signorina, student associations, removal, reopening and immediate PDF');
}finally{await browser.close();}
