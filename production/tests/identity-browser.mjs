import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {readFileSync,writeFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const base=process.env.BASE_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();const external=[],uploads=[],errors=[];const results=[];
context.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))external.push(r.url());if(r.method()!=='GET')uploads.push(r.method()+' '+r.url());});
page.on('pageerror',e=>errors.push(e.message));
await context.route('**/*',route=>{const url=route.request().url();return url.startsWith(base)||url.startsWith('data:')||url.startsWith('blob:')?route.continue():route.abort();});
const fixture=name=>root+'qa-identity/'+name;
async function open(route='/sales-assign'){
 await page.goto(base+route,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Leggi documento',exact:true}).click();
 await page.getByRole('dialog').waitFor({state:'visible'});
}
async function scan(name,kind='card'){
 await page.getByLabel('Tipo di documento',{exact:true}).selectOption(kind);
 await page.getByLabel('PDF o immagini del documento',{exact:true}).setInputFiles(fixture(name));
 await page.getByRole('button',{name:'Leggi dati',exact:true}).click();
 await page.locator('#identity-surname').waitFor({timeout:90000});
}
async function confirm(...labels){for(const label of labels)await page.getByLabel('Conferma '+label,{exact:true}).check();}
function pass(text){results.push(text);console.log('PASS:',text);}
try{
 await page.goto(base+'/sales-assign',{waitUntil:'networkidle'});
 await page.getByRole('textbox',{name:'Nome e cognome / denominazione',exact:true}).fill('DATI ESISTENTI');
 await page.getByRole('button',{name:'Leggi documento',exact:true}).click();
 await scan('carta-prova.png');
 assert.equal(await page.locator('#identity-surname').inputValue(),'ROSSI');
 assert.equal(await page.locator('#identity-givenNames').inputValue(),'MARIO');
 assert.equal(await page.locator('#identity-birthDate').inputValue(),'1980-01-01');
 assert.equal(await page.locator('#identity-taxCode').inputValue(),'RSSMRA80A01H501U');
 assert.equal(await page.getByLabel('Conferma Cognome',{exact:true}).isChecked(),false);
 await confirm('Cognome','Nome','Data di nascita','Luogo di nascita','Codice fiscale');
 await page.locator('#identity-surname').fill('ROSSI CORRETTO');
 assert.equal(await page.getByLabel('Conferma Cognome',{exact:true}).isChecked(),false);
 await page.locator('#identity-surname').fill('ROSSI');await confirm('Cognome');
 await page.getByLabel('Persona destinataria',{exact:true}).selectOption('client');
 assert.equal(await page.getByRole('button',{name:'Inserisci i dati confermati',exact:true}).isEnabled(),false);
 assert.match(await page.locator('.identity-changes').innerText(),/DATI ESISTENTI/);
 await page.getByLabel('Conferma sostituzione dei dati già compilati',{exact:true}).check();
 await page.screenshot({path:fixture('lettura-desktop.png')});
 await page.getByRole('button',{name:'Inserisci i dati confermati',exact:true}).click();
 await page.getByRole('dialog').waitFor({state:'hidden'});
 assert.equal(await page.getByLabel('PDF o immagini del documento',{exact:true}).inputValue(),'','Closing must release the native file selection');
 assert.equal(await page.locator('.a4-page input[name="nome"]').inputValue(),'MARIO ROSSI');
 assert.equal(await page.locator('.a4-page input[name="dataNascita"]').inputValue(),'1980-01-01');
 assert.equal(await page.locator('.a4-page input[name="cf"]').inputValue(),'RSSMRA80A01H501U');
 pass('PNG, correzione con revoca conferma, sostituzione esplicita e aggiornamento reale del modulo');
 await page.getByRole('button',{name:'Salva PDF',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('iframe[aria-hidden="true"]')?.contentDocument?.querySelectorAll('.pdf-static-field').length>0);
 const print=await page.evaluate(()=>{const d=document.querySelector('iframe[aria-hidden="true"]').contentDocument;return {html:d.documentElement.outerHTML,text:d.body.innerText,widgets:d.querySelectorAll('.identity-header,.identity-dialog').length};});
 assert.match(print.text,/MARIO ROSSI/);assert.equal(print.widgets,0);
 const printed=await context.newPage();await printed.setContent(print.html.replace('<head>',`<head><base href="${base}/">`),{waitUntil:'networkidle'});
 await printed.pdf({path:fixture('incarico-compilato.pdf'),format:'A4',printBackground:true});await printed.close();
 pass('PDF esportato contiene i dati confermati e non contiene il lettore');
 for(const [name,kind] of [['carta-prova.jpg','card'],['carta-scansione.pdf','card'],['carta-due-pagine.pdf','card'],['patente-prova.png','licence'],['passaporto-prova.png','passport']]){
  await open();await scan(name,kind);
  assert.equal(await page.locator('#identity-surname').inputValue(),kind==='passport'?'ERIKSSON':'ROSSI');
  if(name==='carta-due-pagine.pdf')assert.equal(await page.getByLabel('Pagina da confrontare',{exact:true}).locator('option').count(),2);
  if(kind==='passport'){assert.match(await page.locator('.identity-warnings').innerText(),/scaduto/);await page.locator('#identity-expiryDate').fill('2030-01-01');assert.doesNotMatch(await page.locator('.identity-dialog').innerText(),/Documento scaduto/);await page.locator('#identity-expiryDate').fill('2020-01-01');assert.match(await page.locator('.identity-warnings').innerText(),/scaduto/);}
  await page.getByRole('button',{name:'Chiudi e cancella i dati del documento',exact:true}).click();pass('Lettura reale: '+name);
 }
 await open();await scan('pagina-vuota.png');
 assert.equal(await page.locator('#identity-surname').inputValue(),'');assert.match(await page.locator('.identity-field').first().innerText(),/Non leggibile/);
 assert.equal(await page.getByLabel('Conferma Cognome',{exact:true}).isEnabled(),false);pass('Pagina illeggibile: avvisi e nessun valore inventato');
 await page.getByRole('button',{name:'Chiudi e cancella i dati del documento',exact:true}).click();
 await open();await page.getByLabel('PDF o immagini del documento',{exact:true}).setInputFiles(fixture('troppe-pagine.pdf'));await page.getByRole('button',{name:'Leggi dati',exact:true}).click();
 await page.getByRole('alert').filter({hasText:'6 pagine'}).waitFor({timeout:90000});pass('PDF oltre il limite: errore recuperabile');
 await page.getByRole('button',{name:'Chiudi e cancella i dati del documento',exact:true}).click();
 await open();await page.getByLabel('PDF o immagini del documento',{exact:true}).setInputFiles(fixture('carta-prova.png'));await page.getByRole('button',{name:'Leggi dati',exact:true}).click();
 await page.getByRole('button',{name:'Chiudi e cancella i dati del documento',exact:true}).click();
 await page.getByRole('button',{name:'Leggi documento',exact:true}).click();
 assert.equal(await page.locator('#identity-surname').count(),0);assert.equal(await page.locator('.identity-images img').count(),0);pass('Chiusura e riapertura cancellano immagini e dati');
 await page.getByRole('button',{name:'Chiudi e cancella i dati del documento',exact:true}).click();
 await open('/lease-contract-4-4');await scan('carta-prova.png');
 const options=await page.getByLabel('Persona destinataria',{exact:true}).locator('option').allTextContents();
 assert(options.includes('Conduttore 1'));assert(options.includes('Locatore 1'));
 await confirm('Cognome','Nome','Data di nascita','Luogo di nascita','Codice fiscale');
 await page.getByLabel('Persona destinataria',{exact:true}).selectOption({label:'Conduttore 1'});
 await page.getByRole('button',{name:'Inserisci i dati confermati',exact:true}).click();
 assert.equal(await page.locator('.a4-page [data-identity-field="nome"]').first().inputValue(),'MARIO ROSSI');
 assert.equal(await page.locator('.a4-page [data-identity-field="nome"]').nth(1).inputValue(),'');
 pass('Contratto: persona destinataria esplicita, altro contraente invariato');
 await page.goto(base+'/lease-proposal',{waitUntil:'networkidle'});
 await page.locator('.a4-page select[aria-label="Sesso 1"]').selectOption('M');
 await page.getByRole('button',{name:'Leggi documento',exact:true}).click();await scan('carta-prova.png');
 await confirm('Cognome','Nome','Data di nascita','Luogo di nascita');
 await page.getByLabel('Persona destinataria',{exact:true}).selectOption({label:'Proponente 1'});
 await page.getByRole('button',{name:'Inserisci i dati confermati',exact:true}).click();
 assert.equal(await page.locator('.a4-page [data-identity-field="nome"]').first().inputValue(),'MARIO');
 assert.equal(await page.locator('.a4-page [data-identity-field="cognome"]').first().inputValue(),'ROSSI');
 await page.waitForTimeout(1500);
 assert.equal(await page.locator('.a4-page [data-identity-field="cf"]').first().inputValue(),'','Import must not derive an unconfirmed CF');
 pass('Proposta locazione: nomi separati, destinatario corretto, nessun CF non confermato');
 await page.locator('.a4-page [data-identity-field="natoIl"]').first().fill('1980-01-02');
 await page.waitForFunction(()=>document.querySelector('.a4-page [data-identity-field="cf"]')?.value.length===16);
 pass('Calcolo manuale del codice fiscale ancora disponibile dopo l’importazione');
 await page.goto(base+'/lease-allegato-b',{waitUntil:'networkidle'});
 assert.equal(await page.getByRole('button',{name:'Leggi documento',exact:true}).count(),0);pass('Allegato B escluso');
 await context.setOffline(false);await page.setViewportSize({width:390,height:844});await open();await scan('carta-prova.png');
 const overflow=await page.getByRole('dialog').evaluate(el=>el.scrollWidth>el.clientWidth+1);assert.equal(overflow,false);
 await page.screenshot({path:fixture('lettura-mobile.png')});pass('Pannello mobile senza overflow orizzontale');
 assert.deepEqual(external,[]);assert.deepEqual(uploads,[]);assert.deepEqual(errors,[]);pass('Nessun upload, richiesta esterna o errore JavaScript');
 writeFileSync(fixture('browser-results.json'),JSON.stringify({passed:results,externalRequests:external,uploads,errors},null,2)+'\n');
}catch(e){await page.screenshot({path:fixture('browser-failure.png')});console.error('BROWSER FAILURE:',e.message,'Errors:',errors);throw e;}
finally{await browser.close();}
