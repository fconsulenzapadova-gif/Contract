import {prepareDocument,bounded} from './DocumentTypography.js';
const ready=(element)=>element.tagName==='IMG'&&element.complete&&!element.naturalWidth?Promise.reject(new Error('Immagine del documento non disponibile. Ricaricare e riprovare.')):element.complete||element.sheet?Promise.resolve():new Promise((resolve,reject)=>{element.addEventListener('load',resolve,{once:true});element.addEventListener('error',()=>reject(new Error('Una risorsa del documento non è disponibile. Ricaricare e riprovare.')),{once:true});});
/** Browser print/save as PDF. Every path restores the live editor and removes the frame. */
export async function printDocument(root,{filename='documento.pdf',convert}={}){
 let frame;
 try{
  await bounded(prepareDocument(root),15000,'Preparazione non completata. Controllare i dati e riprovare.');
  const problem=root.querySelector('[data-layout-error]');if(problem)throw Error(problem.dataset.layoutError);
  const doc=root.ownerDocument;
  frame=doc.createElement('iframe');frame.title='Preparazione documento per stampa';frame.setAttribute('aria-hidden','true');
  Object.assign(frame.style,{position:'fixed',left:'-12000px',top:'0',width:'794px',height:'1123px',border:'0'});doc.body.appendChild(frame);
  const win=frame.contentWindow,print=frame.contentDocument;if(!win||!print)throw Error('Impossibile aprire il documento di stampa.');
  print.open();print.write('<!doctype html><html lang="it"><head><meta charset="utf-8"></head><body></body></html>');print.close();print.title=filename;
  const base=print.createElement('base');base.href=doc.baseURI;print.head.appendChild(base);
  const styles=[...doc.querySelectorAll('style,link[rel="stylesheet"]')].map(node=>{const copy=node.cloneNode(true);const promise=copy.tagName==='LINK'?ready(copy):Promise.resolve();print.head.appendChild(copy);return promise;});
  const css=print.createElement('style');css.textContent='@page{size:A4;margin:0}html,body{margin:0;padding:0;background:#fff;print-color-adjust:exact;-webkit-print-color-adjust:exact}.print-root{margin:0;padding:0}.a4-document-container{display:block!important;gap:0!important}.a4-page{margin:0!important;border:0!important;box-shadow:none!important;break-after:page!important}.a4-page:last-child{break-after:auto!important}.a4-measure-shell,.pdf-hide,.pdf-export-hide{display:none!important}';print.head.appendChild(css);
  const copy=print.importNode(root,true),live=root.querySelectorAll('input,textarea,select');
  copy.querySelectorAll('input,textarea,select').forEach((field,index)=>{field.value=live[index].value;field.checked=live[index].checked;});
  copy.querySelectorAll('.a4-measure-shell,dialog').forEach(node=>node.remove());
  const holder=print.createElement('div');holder.className='print-root';holder.appendChild(copy);print.body.appendChild(holder);
  await bounded(Promise.all([...styles,...[...print.images].map(ready),print.fonts?.ready||Promise.resolve()]),10000,'Caricamento di immagini o caratteri non completato. Ricaricare e riprovare.');
  await bounded(print.fonts?.ready||Promise.resolve(),8000,'Caratteri della stampa non ancora disponibili. Riprovare.');
  convert?.(copy);
  // A final render in the attached frame gives converted fields their true print geometry.
  await new Promise(resolve=>win.setTimeout(resolve,100));
  await new Promise((resolve,reject)=>{let timer;const finish=()=>{clearTimeout(timer);resolve();};win.addEventListener('afterprint',finish,{once:true});try{timer=setTimeout(finish,1500);win.focus();win.print();}catch(error){clearTimeout(timer);reject(error);}});
 }finally{frame?.remove();}
}
