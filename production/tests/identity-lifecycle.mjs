import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5173/sales-assign');
 await page.getByRole('button',{name:'Leggi documento',exact:true}).click();
 await page.getByLabel('PDF o immagini del documento',{exact:true}).setInputFiles(root+'qa-identity/carta-prova.png');
 const cancelled=await page.evaluate(async()=>{
  const {readIdentityFiles}=await import('/assets/IdentityFiles.js');const file=document.querySelector('input[type=file]').files[0];const controller=new AbortController();
  const reading=readIdentityFiles([file],{signal:controller.signal,onProgress:message=>{if(message==='Lettura pagina 1')setTimeout(()=>controller.abort(),1);}}).then(()=> 'resolved',e=>e.name);
  return Promise.race([reading,new Promise(r=>setTimeout(()=>r('timeout'),10000))]);
 });
 assert.equal(cancelled,'AbortError','Annullare deve rilasciare il lavoro in corso, senza Promise sospesa');console.log('PASS: abort during OCR resolves promptly');
 for(const name of ['carta-protetta.pdf','pdf-corrotto.pdf']){
  await page.getByLabel('PDF o immagini del documento',{exact:true}).setInputFiles(root+'qa-identity/'+name);
  await page.getByRole('button',{name:'Leggi dati',exact:true}).click();
  await page.getByRole('alert').filter({hasText:/PDF/}).waitFor({timeout:30000});
  assert.equal(await page.getByRole('button',{name:'Leggi dati',exact:true}).isEnabled(),true);console.log('PASS: recoverable PDF error',name);
 }
}finally{await browser.close();}
