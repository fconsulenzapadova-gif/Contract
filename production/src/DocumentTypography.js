import {waitForFiscalUpdates} from './FiscalCodeUI.js';
/** Content measurement uses the actual loaded font. A4 geometry never uses viewport width. */
export const MINIMUM_POINT_SIZE=9;
const nextFrame=win=>new Promise(resolve=>{const timer=win.setTimeout(resolve,80);win.requestAnimationFrame(()=>{win.clearTimeout(timer);resolve();});});
export async function bounded(task,milliseconds,message){let timer;try{return await Promise.race([task,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(message)),milliseconds);})]);}finally{clearTimeout(timer);}}
const excluded=el=>!!el.closest('.allegato-b-page');
function paperWidth(field,win){const page=field.closest('.a4-page,.a4-page-measure');if(!page)return 680;const style=win.getComputedStyle(page);return page.clientWidth-(parseFloat(style.paddingLeft)||0)-(parseFloat(style.paddingRight)||0);}
export function adaptDocument(root){
 if(!root)return;
 const doc=root.ownerDocument,win=doc.defaultView;
 const canvas=doc.createElement('canvas'),ctx=canvas.getContext('2d');
 for(const field of root.querySelectorAll('input.inline-input,select.inline-select,textarea.inline-input')){
  if(excluded(field)||field.closest('.pdf-hide,.pdf-export-hide'))continue;
  if(!field.dataset.originalWidth)field.dataset.originalWidth=field.style.width||'';
  const style=win.getComputedStyle(field);
  if(field.tagName==='TEXTAREA'){
   field.style.height='auto';field.style.minHeight=field.dataset.blankHeight||'2em';
   if(!field.dataset.blankHeight)field.dataset.blankHeight=style.minHeight;
   field.style.height=Math.min(220,Math.max(field.scrollHeight,parseFloat(style.minHeight)||0))+'px';field.style.overflowY='auto';
   continue;
  }
  const block=field.closest('.med-fields')||field.closest('p,.contract-entry-group,.med-field,.a4-flow-block')||field.parentElement;
  let available=paperWidth(field,win);
  if(field.closest('.med-field,.visit-field'))available=field.parentElement.clientWidth||available;
  let value=field.tagName==='SELECT'?field.options[field.selectedIndex]?.text||'':field.value;
  if(field.type==='date'&&value)value=value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4);
  if(!value){field.style.width=field.dataset.originalWidth||'100px';field.style.fontSize='inherit';field.style.maxWidth='100%';continue;}
  let fontSize=parseFloat(style.fontSize)||13.333;
  // Clear old character-count shrinkage. Reduce a whole paragraph only when one value needs it.
  field.style.fontSize='inherit';
  ctx.font=win.getComputedStyle(field).font;
  const padding=(parseFloat(style.paddingLeft)||0)+(parseFloat(style.paddingRight)||0)+4;
  const affordance=field.type==='date'?30:field.tagName==='SELECT'?22:0;
  let required=Math.ceil(ctx.measureText(value).width+padding+affordance);
  if(required>available&&field.closest('.med-field')){field.closest('.med-field').style.flexBasis='100%';available=paperWidth(field,win);}
  if(required>available){
   block.style.setProperty('font-size',MINIMUM_POINT_SIZE+'pt','important');
   ctx.font=win.getComputedStyle(field).font;required=Math.ceil(ctx.measureText(value).width+padding+affordance);
  }
  field.style.width=required+'px';field.style.maxWidth='none';field.style.minWidth='0';
  field.dataset.measuredWidth=String(required);
  if(required>available){field.dataset.layoutIssue='Valore più largo della riga A4 a 9pt';field.title='Valore completo: usare una formulazione su riga dedicata o verificare la lunghezza del dato.';}else delete field.dataset.layoutIssue;
 }
 for(const name of root.querySelectorAll('p strong,.contract-individual-signature strong')){
  if(name.querySelector('input,select,textarea'))continue;
  ctx.font=win.getComputedStyle(name).font;
  if(ctx.measureText(name.textContent).width>paperWidth(name,win)){
   const paragraph=name.closest('p,.contract-individual-signature');
   paragraph?.style.setProperty('font-size',MINIMUM_POINT_SIZE+'pt','important');
  }
 }
 for(const group of root.querySelectorAll('.contract-inline-value')){
  group.style.display='inline-block';group.style.whiteSpace='nowrap';group.style.width='';group.style.textAlign='';delete group.dataset.dedicatedRow;
  if(group.scrollWidth>group.clientWidth+1){
   // The label may occupy its own line; the data remains one indivisible value.
   group.style.display='block';group.style.width='100%';group.style.whiteSpace='normal';group.style.textAlign='left';group.dataset.dedicatedRow='true';
  }
 }
}
export async function prepareDocument(root){
 if(!root)return;
 const doc=root.ownerDocument,win=doc.defaultView;
 await bounded(doc.fonts?.ready||Promise.resolve(),8000,'Caricamento dei caratteri non completato. Riprovare la stampa.');
 await nextFrame(win);
 await bounded(waitForFiscalUpdates(),8000,'Assistenza fiscale ancora in elaborazione. Verificare i dati e riprovare.');
 await nextFrame(win);
 adaptDocument(root);
 win.dispatchEvent(new CustomEvent('contract-before-print'));
 let previous='',stable=0;
 for(let i=0;i<30&&stable<3;i++){
  await nextFrame(win);
  const shape=[...root.querySelectorAll('.a4-page,.a4-flow-block')].map(e=>e.offsetHeight+':'+e.children.length).join('|');
  stable=shape===previous?stable+1:0;previous=shape;
 }
}
export function convertPrintableFields(root){
 const doc=root.ownerDocument,win=doc.defaultView;
 root.querySelectorAll('.pdf-hide,.pdf-export-hide,.pdf-export-hide,.contract-party-controls,.pdf-exporting-hide').forEach(e=>e.remove());
 for(const field of root.querySelectorAll('.inline-input,.inline-select')){
  if(excluded(field))continue;
  const style=win.getComputedStyle(field),span=doc.createElement('span');
  const block=field.tagName==='TEXTAREA'||style.display==='block'||Boolean(field.dataset.layoutIssue);
  let value=field.tagName==='SELECT'?field.options[field.selectedIndex]?.text||field.value:field.value;
  if(field.type==='date'&&value)value=value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4);
  const empty=!value;
  span.dataset.printField=field.name||field.getAttribute('aria-label')||'';
  span.className='pdf-static-field '+(empty?'pdf-empty-field':'pdf-filled-field');
  span.textContent=value||'\u00a0';
  span.style.cssText=field.style.cssText;
  Object.assign(span.style,{display:block?'block':'inline-block',width:empty?style.width:(block?style.width:'auto'),maxWidth:'100%',height:'auto',minHeight:empty?style.height:'0',margin:style.margin,padding:'0',background:'transparent',color:'#000',font:style.font,lineHeight:style.lineHeight,fontWeight:style.fontWeight,verticalAlign:'baseline',whiteSpace:block?'pre-wrap':'nowrap',wordBreak:'normal',overflowWrap:block?'anywhere':'normal',border:'none'});
  if(empty)span.style.setProperty('border-bottom','1px solid #bcb8af','important');
  field.replaceWith(span);
 }
}
