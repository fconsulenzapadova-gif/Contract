import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/Gemut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const base=process.env.BASE_URL||'http://127.0.0.1:5174';
try {
 await page.goto(base+'/lease-contract-students',{waitUntil:'networkidle'});
 const field=page.locator('.a4-page [data-identity-field="cf"]').first();
 await field.fill('RSSMRA80A01G224P');
 const width=await field.evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth,value:e.value}));
 assert(width.client>=width.scroll-1,'CF completo visibile nel campo inline');
 const right=await page.locator('.a4-page p').evaluateAll(es=>es.map(e=>({text:e.innerText,align:getComputedStyle(e).textAlign})).filter(e=>e.text.includes('canone')));
 assert(right.length>0 && right.every(p=>p.align==='justify'),'Corpo contrattuale giustificato');
 await page.evaluate(()=>{window.__printed=[];const create=document.createElement.bind(document);document.createElement=function(t,o){const e=create(t,o);if(t==='iframe')e.addEventListener('load',()=>{e.contentWindow.print=()=>{window.__printed.push(e.contentDocument.documentElement.outerHTML);e.contentWindow.dispatchEvent(new Event('afterprint'));};});return e;};});
 await page.getByRole('button',{name:'Salva PDF',exact:true}).click();
 await page.waitForFunction(()=>window.__printed.length>0);
 const print=await page.evaluate(()=>window.__printed[0]);
 assert(print.includes('RSSMRA80A01G224P'));
 assert(!print.includes('a4-measure-shell'));
 assert(!/word-break:\s*break-word/.test(print),'Export preserves indivisible inline values');
 console.log('PASS shared typography + final-value export');
}finally{await browser.close();}
