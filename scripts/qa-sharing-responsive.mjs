import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();const report=[];
try{
 for(const viewport of [{width:390,height:844},{width:834,height:1112},{width:1440,height:1000}]){
  await page.setViewportSize(viewport);await page.goto((process.env.BASE_URL||'http://localhost:5178')+'/property-sharing',{waitUntil:'networkidle'});
  const measure=()=>page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  const initial=await measure();assert(initial.scroll<=initial.width+1,JSON.stringify({viewport,initial}));
  const editor=page.getByRole('textbox',{name:'Nome e cognome',exact:true});assert(await editor.isVisible());await editor.fill('Destinatario tablet àèìòù');
  await page.getByRole('button',{name:'Espandi: Nome e cognome',exact:true}).click();await page.getByRole('dialog').waitFor({state:'visible'});
  await page.getByRole('button',{name:'Chiudi editor',exact:true}).click();
  if(viewport.width<=1100){
   assert(await page.getByRole('button',{name:'Apri menu',exact:true}).isVisible());
   await page.getByRole('button',{name:'Anteprima',exact:true}).click();
  }
  await page.getByRole('button',{name:'Salva PDF',exact:true}).waitFor({state:'visible'});
  await page.waitForFunction(()=>{const preview=document.querySelector('.sharing-preview'),paper=document.querySelector('.sharing-page');return preview&&paper&&paper.getBoundingClientRect().width<=preview.getBoundingClientRect().width+1;});
  const preview=await measure();assert(preview.scroll<=preview.width+1,JSON.stringify({viewport,preview}));
  const controls=await page.getByRole('button',{name:'Salva PDF',exact:true}).boundingBox();assert(controls&&controls.x>=0&&controls.x+controls.width<=viewport.width+1);
  await page.screenshot({path:`work/qa-continuations/sharing-responsive-${viewport.width}.png`});
  report.push({viewport,initial,preview,pdfControlVisible:true,expandedEditor:true,scaledPaper:true});
 }
 await fs.writeFile('work/qa-continuations/sharing-responsive.json',JSON.stringify({pass:true,cases:report},null,2));console.log(JSON.stringify({pass:true,cases:report}));
}finally{await browser.close();}
