import {flattenOcr} from "./IdentityLayout.js";
const BASE='/identity-runtime';
export const FILE_LIMITS={files:4,bytes:10*1024*1024,pages:6};
const types=new Set(['application/pdf','image/jpeg','image/png','image/webp','image/bmp','image/gif','image/avif']);
export function validateFiles(files){
 if(!files?.length)return 'Selezionare almeno un PDF o un’immagine.';
 if(files.length>FILE_LIMITS.files)return 'Caricare al massimo 4 file per documento.';
 for(const file of files){
  if(file.size>FILE_LIMITS.bytes)return `Il file ${file.name} supera il limite di 10 MiB.`;
  if(!file.size)return `Il file ${file.name} è vuoto.`;
  const extension=file.name.toLowerCase().split('.').pop();
  if(!types.has(file.type)&&!(file.type===''&&['pdf','jpg','jpeg','png','webp','bmp','gif','avif'].includes(extension)))return 'Formato non supportato. Usare PDF, JPG, PNG o WebP; convertire HEIC/TIFF prima del caricamento.';
 }
 return '';
}
function cancelled(signal){if(signal?.aborted)throw new DOMException('Lettura annullata','AbortError');}
function abortable(promise,signal){
 if(!signal)return promise;cancelled(signal);
 return new Promise((resolve,reject)=>{
  const abort=()=>{cleanup();reject(new DOMException('Lettura annullata','AbortError'));};
  const cleanup=()=>signal.removeEventListener('abort',abort);
  signal.addEventListener('abort',abort,{once:true});
  Promise.resolve(promise).then(value=>{cleanup();resolve(value);},error=>{cleanup();reject(error);});
 });
}
let tessPromise,pdfPromise;
async function tesseract(){
 if(!tessPromise)tessPromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=BASE+'/tesseract/tesseract.min.js';
  script.onload=()=>resolve(globalThis.Tesseract);script.onerror=()=>{script.remove();tessPromise=null;reject(new Error('Impossibile caricare il lettore locale. Riprovare.'));};document.head.appendChild(script);
 });
 return tessPromise;
}
async function pdfjs(){
 if(!pdfPromise)pdfPromise=import(BASE+'/pdf/pdf.min.mjs').then(pdf=>{pdf.GlobalWorkerOptions.workerSrc=BASE+'/pdf/pdf.worker.min.mjs';return pdf;}).catch(error=>{pdfPromise=null;throw error;});
 return pdfPromise;
}
function canvasFor(width,height){
 const scale=Math.min(2400/Math.max(width,height),Math.max(1,1600/Math.max(width,height)));
 const canvas=document.createElement('canvas');canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);return canvas;
}
export async function readIdentityFiles(files,{signal,onProgress=()=>{}}={}){
 const error=validateFiles(files);if(error)throw new Error(error);cancelled(signal);
 let worker;const pages=[];const pdfDocuments=[],pdfTasks=[];let job=0;
 const abort=()=>{if(worker)void worker.terminate().catch(()=>{});for(const task of pdfTasks)void task.destroy().catch(()=>{});};
 signal?.addEventListener('abort',abort,{once:true});
 try{
  const T=await abortable(tesseract(),signal);cancelled(signal);
  const creation=T.createWorker('ita+eng',1,{workerPath:BASE+'/tesseract/worker.min.js',corePath:BASE+'/core',langPath:BASE+'/languages',workerBlobURL:false,cacheMethod:'none',logger:m=>{if(!signal?.aborted&&m.status==='recognizing text')onProgress(`Lettura pagina ${job} · ${Math.round((m.progress||0)*100)}%`);}});
  creation.then(w=>{if(signal?.aborted)void w.terminate().catch(()=>{});},()=>{});
  worker=await abortable(creation,signal);
  cancelled(signal);await abortable(worker.setParameters({tessedit_pageseg_mode:T.PSM.AUTO,preserve_interword_spaces:'1'}),signal);
  const recognize=async(canvas,fileName,label)=>{
   cancelled(signal);if(pages.length>=FILE_LIMITS.pages)throw new Error('Il documento supera il limite di 6 pagine totali.');
   job++;onProgress(`Lettura pagina ${job}`);
   try{cancelled(signal);const {data}=await abortable(worker.recognize(canvas,{}, {text:true,blocks:true}),signal);cancelled(signal);
    pages.push({text:data.text,confidence:data.confidence,lines:flattenOcr(data),width:canvas.width,height:canvas.height,image:canvas.toDataURL('image/png'),fileName,label});
   }finally{canvas.width=canvas.height=1;}
  };
  for(const file of files){
   cancelled(signal);
   if(file.type==='application/pdf'||file.name.toLowerCase().endsWith('.pdf')){
    onProgress('Apertura PDF sul dispositivo…');const pdf=await abortable(pdfjs(),signal);cancelled(signal);
    const task=pdf.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,useSystemFonts:true,standardFontDataUrl:BASE+'/pdf/standard_fonts/',cMapUrl:BASE+'/pdf/cmaps/',cMapPacked:true,wasmUrl:BASE+'/pdf/wasm/'});
    pdfTasks.push(task);
    // Without an onPassword callback PDF.js rejects encrypted inputs explicitly.
    let doc;try{doc=await abortable(task.promise,signal);}catch(e){if(signal?.aborted)throw e;throw new Error(e.name==='PasswordException'?'PDF protetto: caricare una copia senza password.':'PDF non leggibile o protetto: caricare una copia valida senza password.');}
    pdfDocuments.push(doc);cancelled(signal);
    if(pages.length+doc.numPages>FILE_LIMITS.pages)throw new Error('Il documento supera il limite di 6 pagine totali.');
    for(let n=1;n<=doc.numPages;n++){
     cancelled(signal);const page=await abortable(doc.getPage(n),signal);const unscaled=page.getViewport({scale:1});
     const viewport=page.getViewport({scale:Math.min(2.5,2400/Math.max(unscaled.width,unscaled.height))});
     const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
     try{await abortable(page.render({canvasContext:canvas.getContext('2d'),viewport}).promise,signal);await recognize(canvas,file.name,`Pagina ${n}`);}finally{canvas.width=canvas.height=1;page.cleanup();}
    }
   }else{
    let bitmap;try{bitmap=await abortable(createImageBitmap(file).then(image=>{if(signal?.aborted)image.close();return image;}),signal);}catch(e){if(signal?.aborted)throw e;throw new Error(`Immagine non leggibile: ${file.name}. Provare JPG, PNG o WebP.`);}
    const canvas=canvasFor(bitmap.width,bitmap.height);
    try{canvas.getContext('2d').fillStyle='#fff';canvas.getContext('2d').fillRect(0,0,canvas.width,canvas.height);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();await recognize(canvas,file.name,'Immagine');}finally{canvas.width=canvas.height=1;bitmap.close();}
   }
  }
  return pages;
 }catch(error){if(signal?.aborted)throw new DOMException('Lettura annullata','AbortError');throw error;}
 finally{signal?.removeEventListener('abort',abort);if(worker)await worker.terminate().catch(()=>{});for(const task of pdfTasks)await task.destroy().catch(()=>{});}
}
