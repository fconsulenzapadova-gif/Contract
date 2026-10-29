import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'qa-sharing',process.env.QA_NAME || 'local');
await fs.mkdir(out,{recursive:true});
const origin=process.env.BASE_URL || 'http://localhost:5178';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100}});
const report={origin,syntheticData:true,errors:[],pdfs:[],models:[],assets:[]};
await context.addInitScript(()=>{
 window.__sharingSnapshots=[];
 window.print=()=>{
  window.parent.__sharingSnapshots.push({html:'<!doctype html>'+document.documentElement.outerHTML,text:document.body.innerText,pages:document.querySelectorAll('.a4-page').length});
  window.dispatchEvent(new Event('afterprint'));
 };
});
const page=await context.newPage();
page.on('pageerror',error=>report.errors.push(error.message));
async function ready(){await page.locator('.a4-page').first().waitFor();await page.evaluate(()=>document.fonts.ready);}
async function snapshot(){
 const count=await page.evaluate(()=>window.__sharingSnapshots.length);
 await page.getByRole('button',{name:'Salva PDF',exact:true}).click();
 await page.waitForFunction(n=>window.__sharingSnapshots.length>n,count,{timeout:15000});
 return page.evaluate(()=>window.__sharingSnapshots.at(-1));
}
async function pdf(name, expectedText=[]){
 const planned=await page.locator('.sharing-pages > .a4-page').count();
 const snap=await snapshot();assert.equal(snap.pages,planned);
 for(const text of expectedText)assert(snap.text.includes(text),`Missing printed value: ${text}`);
 assert(!snap.text.includes('Aggiungi materiale'),'Editor must not be printed');
 const print=await context.newPage();await print.setContent(snap.html,{waitUntil:'networkidle'});await print.evaluate(()=>document.fonts.ready);await print.emulateMedia({media:'print'});
 const metrics=await print.locator('.sharing-page').evaluateAll(pages=>pages.map(page=>{
  const body=page.querySelector('.sharing-page-body'),footer=page.querySelector('footer'),bounds=page.getBoundingClientRect(),bodyBounds=body.getBoundingClientRect();
  const visible=[...body.querySelectorAll('h1,h2,p,.sharing-value,th,td')].map(node=>node.getBoundingClientRect());
  return {width:bounds.width,height:bounds.height,overflow:body.scrollHeight-body.clientHeight,
   footerOverlap:Math.max(0,...visible.map(rect=>rect.bottom-footer.getBoundingClientRect().top)),
   horizontalOverflow:Math.max(0,...visible.map(rect=>Math.max(bodyBounds.left-rect.left,rect.right-bodyBounds.right)))};
 }));
 assert(metrics.every(m=>m.overflow<=1&&m.footerOverlap===0&&m.horizontalOverflow<=1),JSON.stringify(metrics));
 await print.pdf({path:path.join(out,name+'.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true,margin:{top:'0',bottom:'0',left:'0',right:'0'}});
 await print.close();report.pdfs.push({file:name+'.pdf',pages:snap.pages,metrics});return snap;
}
const key='gemut.contract.draft.v1:/property-sharing';
try{
 await page.goto(origin+'/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('a[href="/property-sharing"]').count(),2,'Dashboard and sidebar links');
 await page.locator('a[href="/property-sharing"]').last().click();await ready();
 assert.equal(await page.locator('.sharing-page').count(),2);
 await pdf('scheda-vuota');
 await page.getByLabel('Nome e cognome',{exact:true}).fill('Mario Rossi');
 await page.getByLabel('Telefono',{exact:true}).fill('+39 333 0000000');
 await page.getByRole('textbox',{name:'Email',exact:true}).fill('mario.rossi@example.com');
 await page.getByLabel('Indirizzo immobile (se comunicato)',{exact:true}).fill('Via dei Test 24, Padova');
 await page.getByLabel('Riferimento immobile',{exact:true}).fill('GEM-QA-2026');
 await page.getByLabel('Consulente Gemüt',{exact:true}).fill('Consulente di prova');
 await page.getByRole('checkbox',{name:'Email',exact:true}).check();
 await page.getByRole('checkbox',{name:'Videochiamata',exact:true}).check();
 await page.getByLabel('Tipo di materiale 1',{exact:true}).selectOption('Planimetrie');
 await page.getByLabel('File, link o descrizione 1',{exact:true}).fill('planimetria_piano_primo.pdf - inviata via email');
 await page.getByLabel('Stato materiale 1',{exact:true}).selectOption('sent');
 await page.getByRole('button',{name:'Aggiungi materiale',exact:true}).click();
 await page.getByLabel('Tipo di materiale 2',{exact:true}).selectOption('Documenti tecnici');
 await page.getByLabel('File, link o descrizione 2',{exact:true}).fill('APE e documentazione tecnica da inviare');
 await page.getByLabel('Stato materiale 2',{exact:true}).selectOption('pending');
 await page.getByLabel('Data condivisione o richiesta (se nota)',{exact:true}).fill('19/10/2026');
 await page.getByLabel('Luogo e data della conferma',{exact:true}).fill('Padova, 19/10/2026');
 await page.getByLabel('Luogo e data della presa visione privacy',{exact:true}).fill('Padova, 19/10/2026');
 // The last keystroke must be present even without blur or a delay.
 await page.getByLabel('Consulente Gemüt',{exact:true}).fill('Consulente ultimo dato');
 await pdf('scheda-compilata',['Consulente ultimo dato','Già trasmesso / presentato','Da trasmettere dopo la firma','planimetria_piano_primo.pdf']);
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Esporta bozza',exact:true}).click()]);
 await download.saveAs(path.join(out,'bozza-test.json'));
 const saved=JSON.parse(await fs.readFile(path.join(out,'bozza-test.json'),'utf8'));
 assert.equal(saved.slots.document.materials[1].status,'pending');
 await page.reload({waitUntil:'networkidle'});await ready();
 assert.equal(await page.getByLabel('Nome e cognome',{exact:true}).inputValue(),'Mario Rossi');
 assert.equal(await page.getByLabel('Stato materiale 2',{exact:true}).inputValue(),'pending');
 await page.getByRole('button',{name:'Rimuovi materiale 1',exact:true}).click();
 assert.equal(await page.getByLabel('File, link o descrizione 1',{exact:true}).inputValue(),'APE e documentazione tecnica da inviare');
 await page.locator('.contract-draft-tools input[type=file]').setInputFiles(path.join(out,'bozza-test.json'));
 await Promise.all([page.waitForEvent('load'),page.getByRole('button',{name:'Conferma sostituzione bozza',exact:true}).click()]);await page.waitForLoadState('networkidle');await ready();
 assert.equal(await page.getByLabel('Stato materiale 1',{exact:true}).inputValue(),'sent');
 assert.equal(await page.getByLabel('Stato materiale 2',{exact:true}).inputValue(),'pending');
 report.drafts={immediateLastValue:true,reload:true,exportImport:true,stableMaterialRemoval:true};
 const stress={name:'Destinatario con nome e cognome composto per controllo della corretta impaginazione dei campi lunghi',phone:'+39 049 1234567890',email:'destinatario.con.indirizzo.email.lungo.per.verifica@example.com',address:'Via della Documentazione Immobiliare e della Condivisione a Distanza, 123, interno 4, piano terzo, Padova (PD)',reference:'GEMUT-RIFERIMENTO-IMMOBILIARE-CONDIVISIONE-2026',consultant:'Consulente incaricato della trasmissione di documentazione immobiliare e della videochiamata',channels:['Email','WhatsApp / messaggistica','Link','Videochiamata','Altro'],otherChannel:'Presentazione riservata e area documentale condivisa con il destinatario',sharingDate:'19 ottobre 2026, ore 16:30',placeDate:'Padova, 19 ottobre 2026',privacyPlaceDate:'Padova, 19 ottobre 2026',materials:Array.from({length:5},(_,i)=>({id:'stress-'+i,kind:['Scheda / brochure','Planimetrie','Foto / video','Documenti tecnici','Altro'][i],description:('Documento '+(i+1)+' - https://example.com/documenti/immobile/materiale-identificativo-con-nome-lungo-e-informazioni-complete/').padEnd(160,'x'),status:i%2?'pending':'sent'}))};
 await page.evaluate(({key,stress})=>localStorage.setItem(key,JSON.stringify({schema:1,model:'/property-sharing',slots:{document:stress}})),{key,stress});
 await page.reload({waitUntil:'networkidle'});await ready();
 await pdf('scheda-cinque-materiali');await page.screenshot({path:path.join(out,'desktop.png')});
 // Imported long content is preserved and routed into measured continuation pages.
 const longName='x'.repeat(501);
 await page.evaluate(({key,stress,longName})=>localStorage.setItem(key,JSON.stringify({schema:1,model:'/property-sharing',slots:{document:{...stress,name:longName}}})),{key,stress,longName});
 await page.reload({waitUntil:'networkidle'});await ready();
 await page.waitForFunction(()=>document.querySelector('[data-continuation-key="name"]'));
 assert.equal(await page.getByLabel('Nome e cognome',{exact:true}).inputValue(),longName);
 await pdf('scheda-continuazione-nome',[longName]);
 await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
 assert.equal(await page.locator('.contract-native-print-copy .sharing-page').count(),2);
 assert((await page.locator('.contract-native-print-copy').innerText()).includes(longName));
 await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
 report.overflowContinuation=true;
 await page.evaluate(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key,saved});await page.reload({waitUntil:'networkidle'});await ready();
 await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
 assert.equal(await page.locator('.contract-native-print-copy .sharing-page').count(),2);
 assert((await page.locator('.contract-native-print-copy').innerText()).includes('Mario Rossi'));
 await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
 assert.equal(await page.locator('.contract-native-print-copy').count(),0);
 assert.equal(await page.getByLabel('Nome e cognome',{exact:true}).inputValue(),'Mario Rossi');
 report.nativePrint={twoPages:true,cleanup:true,editableValuesPreserved:true};
 const mobile=await context.newPage();await mobile.setViewportSize({width:390,height:844});
 mobile.on('pageerror',error=>report.errors.push(error.message));
 await mobile.goto(origin+'/property-sharing',{waitUntil:'networkidle'});
 assert(await mobile.locator('.sidebar').evaluate(node=>node.classList.contains('closed')));
 assert(await mobile.getByLabel('Nome e cognome',{exact:true}).isVisible());
 await mobile.getByLabel('Nome e cognome',{exact:true}).fill('Maria prova smartphone');
 await mobile.screenshot({path:path.join(out,'smartphone-compila.png')});
 await mobile.getByRole('button',{name:'Anteprima',exact:true}).click();
 await mobile.waitForFunction(()=>document.querySelector('.sharing-page')?.getBoundingClientRect().width<=window.innerWidth);
 assert(await mobile.getByRole('button',{name:'Salva PDF',exact:true}).isVisible());
 assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,'No mobile horizontal overflow');
 await mobile.getByRole('button',{name:'Salva PDF',exact:true}).click();
 await mobile.waitForFunction(()=>window.__sharingSnapshots.length>0);
 assert((await mobile.evaluate(()=>window.__sharingSnapshots.at(-1).text)).includes('Maria prova smartphone'));
 await mobile.waitForFunction(()=>document.querySelector('.sharing-page')?.getBoundingClientRect().width<=window.innerWidth);
 await mobile.screenshot({path:path.join(out,'smartphone-anteprima.png'),animations:'disabled'});
 await mobile.getByRole('button',{name:'Apri menu',exact:true}).click();
 assert(await mobile.locator('.sidebar a[href="/property-sharing"]').isVisible());
 await mobile.getByRole('button',{name:'Chiudi menu laterale',exact:true}).click();
 assert(await mobile.locator('.sidebar').evaluate(node=>node.classList.contains('closed')));
 await mobile.goto(origin+'/',{waitUntil:'networkidle'});
 await mobile.locator('a[href="/property-sharing"]').last().click();
 await mobile.getByLabel('Nome e cognome',{exact:true}).waitFor();
 assert(await mobile.locator('.sidebar').evaluate(node=>node.classList.contains('closed')));
 await mobile.close();
 report.mobile={viewport:'390x844',compilation:true,preview:true,pdf:true,sidebar:true,noHorizontalOverflow:true};
 for(const route of ['purchase-proposal','lease-proposal','sales-assign','lease-assign','lease-contract-4-4','lease-contract-4-4-cedolare','lease-contract-concordato','lease-contract-students','lease-contract-transitorio','visit-sheet','aml','commission','lease-allegato-b']){
  await page.goto(origin+'/'+route,{waitUntil:'networkidle'});await ready();
  const snap=await snapshot();assert(snap.pages>0);if(route==='lease-allegato-b')assert.equal(snap.pages,5);
  report.models.push({route,loaded:true,exported:true,pages:snap.pages});
 }
 if(process.env.VERIFY_ASSETS==='1'){
  const manifest=JSON.parse(await fs.readFile(path.join(root,'release-manifest.json'),'utf8'));
  let cursor=0;const entries=Object.entries(manifest.files);
  await Promise.all(Array.from({length:6},async()=>{while(cursor<entries.length){
   const [file,expected]=entries[cursor++];const response=await context.request.get(origin+'/'+file);assert.equal(response.status(),200,file);
   const actual=crypto.createHash('sha256').update(await response.body()).digest('hex');assert.equal(actual,expected,file);report.assets.push({file,identical:true});
  }}));
 }
 assert.deepEqual(report.errors,[]);
 report.completedAt=new Date().toISOString();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({pass:true,origin,pdfs:report.pdfs.length,existingModels:report.models.length,assets:report.assets.length,mobile:report.mobile,errors:report.errors}));
}catch(error){report.failure=String(error);await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');throw error;}
finally{await browser.close();}
