import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {writeFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),base=process.env.BASE_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),results=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
await context.route('**/*',route=>{const url=route.request().url();return url.startsWith(base)||url.startsWith('data:')||url.startsWith('blob:')?route.continue():route.abort();});
const cases=[
 ['/purchase-proposal','Proponente 1','input[name="p1Nome"]'],
 ['/lease-proposal','Proponente 1','[data-identity-field="nome"]'],
 ['/sales-assign','Conferente / cliente','input[name="nome"]'],
 ['/lease-assign','Conferente / cliente','input[name="nome"]'],
 ['/aml','Cliente','[aria-label="Cliente: nome e cognome / denominazione"]'],
 ['/commission','Cliente','[aria-label="Cliente: nome e cognome / denominazione"]'],
 ...['4-4','4-4-cedolare','concordato','students','transitorio'].map(type=>['/lease-contract-'+type,'Conduttore 1','[data-identity-field="nome"]']),
];
async function scan(){
 await page.getByRole('button',{name:'Leggi documento',exact:true}).click();
 await page.getByLabel('PDF o immagini del documento',{exact:true}).setInputFiles(root+'qa-identity/carta-prova.png');
 await page.getByRole('button',{name:'Leggi dati',exact:true}).click();
 await page.locator('#identity-surname').waitFor({timeout:90000});
}
async function confirm(...labels){for(const label of labels)await page.getByLabel('Conferma '+label,{exact:true}).check();}
try{
 for(const [route,label,selector] of cases){
  await page.goto(base+route,{waitUntil:'networkidle'});await scan();
  const options=await page.getByLabel('Persona destinataria',{exact:true}).locator('option').allTextContents();assert(options.includes(label),route+' target');
  await confirm('Cognome','Nome');
  if(route==='/aml')await confirm('Luogo di nascita','Data di nascita','Codice fiscale','Numero documento','Autorità di rilascio','Data di rilascio','Scadenza');
  await page.getByLabel('Persona destinataria',{exact:true}).selectOption({label});
  if(route==='/sales-assign'){
   await page.getByRole('dialog').evaluate(el=>el.scrollTop=el.querySelector('.identity-review').offsetTop-24);
   await page.screenshot({path:root+'qa-identity/lettura-confronto-desktop.png'});
  }
  await page.getByRole('button',{name:'Inserisci i dati confermati',exact:true}).click();
  assert.equal(await page.locator('.a4-page '+selector).first().inputValue(),route==='/lease-proposal'?'MARIO':'MARIO ROSSI',route+' actual field');
  if(route==='/aml'){
   const summary=await page.locator('.a4-page [aria-label="Nascita, codice fiscale / P. IVA, residenza / sede"]').inputValue();
   assert.match(summary,/01\/01\/1980/);assert.match(summary,/RSSMRA80A01H501U/);assert.doesNotMatch(summary,/Residenza/);
   const document=await page.locator('.a4-page [aria-label^="Documento: tipo, numero, autorità"]').inputValue();assert.match(document,/CA12345AB/);assert.match(document,/01\/01\/2030/);
  }
  results.push({route,target:label,passed:true});console.log('PASS:',route,label);
 }
 // Proponenti creati dopo il montaggio devono avere callback e destinatario propri.
 await page.goto(base+'/lease-proposal',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'+ Proponente',exact:true}).click();await scan();
 await confirm('Cognome','Nome');await page.getByLabel('Persona destinataria',{exact:true}).selectOption({label:'Proponente 3'});
 await page.getByRole('button',{name:'Inserisci i dati confermati',exact:true}).click();
 const names=await page.locator('.a4-page [data-identity-field="nome"]').evaluateAll(nodes=>nodes.map(node=>node.value));assert.deepEqual(names,['','','MARIO']);
 await page.getByRole('button',{name:'- Proponente',exact:true}).click();await scan();
 assert(!(await page.getByLabel('Persona destinataria',{exact:true}).locator('option').allTextContents()).includes('Proponente 3'));
 await page.getByRole('button',{name:'Chiudi e cancella i dati del documento',exact:true}).click();
 results.push({route:'/lease-proposal',target:'Proponente 3 aggiunto/rimosso',passed:true});console.log('PASS: Proponente aggiunto e rimosso, altre persone invariate');
 await page.goto(base+'/sales-assign',{waitUntil:'networkidle'});await scan();
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('dialog').evaluate(el=>el.scrollTop=el.querySelector('.identity-fields').offsetTop-20);
 assert.equal(await page.getByRole('dialog').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
 await page.screenshot({path:root+'qa-identity/lettura-campi-mobile.png'});
 assert.deepEqual(errors,[]);writeFileSync(root+'qa-identity/routes-results.json',JSON.stringify({results,errors},null,2)+'\n');
}finally{await browser.close();}
