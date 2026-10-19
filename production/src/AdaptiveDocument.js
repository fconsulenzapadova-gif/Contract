import {composeInlineData} from './InlineComposition.js';
import {adaptDocument,convertPrintableFields} from './DocumentTypography.js';
import {removeEditorControls} from './ContractEditorTools.js';
import {installNativePrint} from './NativePrint.js';
function nodes(React,node){return React.Children.toArray(node?.props?.children||[]).flatMap(c=>c?.type===React.Fragment?nodes(React,c):Array.isArray(c)?c:[c]);}
function isHeading(node){
 const text=typeof node?.props?.children==='string'?node.props.children:'';
 return /^h[1-6]$/.test(node?.type||'')||/^(?:\d{1,2}(?:Bis)?[).]|Articolo\s+\d{1,2}\b)/i.test(text)||['TRA','E'].includes(text);
}
export function splitDocumentBlocks(React,blocks){
 const out=[];
 for(const block of blocks){
  const node=composeInlineData(React,removeEditorControls(React,block.node));
  const split=!block.keepTogether&&(node?.type===React.Fragment||['section','div'].includes(node?.type)&&/med-block|review-supplement|visit-section/.test(node.props.className||''));
  const children=split?nodes(React,node):[node];
  for(let i=0;i<children.length;i++){
   const startIndex=i;
   const child=children[i];
   const heading=isHeading(child);
   const group=heading&&i+1<children.length?[child,children[++i]]:[child];
   out.push({forcePage:block.forcePage&&startIndex===0,key:block.key+':'+startIndex,node:React.createElement(React.Fragment,null,...group),originalKey:block.key});
  }
 }
 // A property title or group label may be its own source block. Keep it with
 // the next printable block as well, skipping controls removed from the paper.
 const grouped=[];
 for(let i=0;i<out.length;i++){
  const entry=out[i],children=nodes(React,entry.node).filter(Boolean);
  if(!children.length)continue;
  if(children.length===1&&isHeading(children[0])){
   let next=i+1;while(next<out.length&&!nodes(React,out[next].node).filter(Boolean).length)next++;
   if(next<out.length&&!out[next].forcePage){grouped.push({...entry,key:entry.key+'+'+out[next].key,node:React.createElement(React.Fragment,null,...children,...nodes(React,out[next].node))});i=next;continue;}
  }
  grouped.push(entry);
 }
 return grouped;
}
export function paginateBlocks(entries,capacity){
 const pages=[];let current=[],height=0;
 for(const entry of entries){
  if(current.length&&(entry.forcePage||height+entry.height>capacity+.5)){pages.push(current);current=[];height=0;}
  current.push(entry.key);height+=entry.height;
 }
 if(current.length)pages.push(current);
 return pages.length?pages:[[]];
}
export function createAdaptiveDocument(React,brandHeader,useReviewedBlocks){
 const h=React.createElement;
 return function AdaptiveDocument({blocks,pageStyle,pageHeader,bottomReservePx=0,pageClass='',pageFooter}){
  const reviewed=useReviewedBlocks(React,blocks);
  const parts=splitDocumentBlocks(React,reviewed),header=pageClass==='visit-sheet'?pageHeader:brandHeader(React,pageHeader);
  const shell=React.useRef(null),measure=React.useRef(null),headerRef=React.useRef(null),refs=React.useRef({}),restoreFocus=React.useRef(null);
  const [pages,setPages]=React.useState([parts.map(b=>b.key)]);
  const byKey=new Map(parts.map(b=>[b.key,b.node]));
  React.useEffect(()=>installNativePrint(shell.current),[]);
  React.useLayoutEffect(()=>{
   let cancelled=false,raf;
   const recalc=()=>{
    if(cancelled||!measure.current)return;
    adaptDocument(shell.current);
    const el=measure.current,s=getComputedStyle(el);
    const capacity=el.clientHeight-parseFloat(s.paddingTop)-parseFloat(s.paddingBottom)-(headerRef.current?.offsetHeight||0)-Math.max(0,bottomReservePx);
    const clone=el.cloneNode(true),liveFields=el.querySelectorAll('input,textarea,select');
    clone.querySelectorAll('input,textarea,select').forEach((field,index)=>{field.value=liveFields[index].value;field.checked=liveFields[index].checked;});
    clone.style.position='absolute';clone.style.left='-10000px';clone.setAttribute('aria-hidden','true');shell.current.appendChild(clone);
    convertPrintableFields(clone);
    const staticBlocks=[...clone.querySelectorAll(':scope > .a4-flow-block')];
    const entries=parts.map((b,index)=>({key:b.key,forcePage:b.forcePage,height:staticBlocks[index]?.offsetHeight||0}));
    clone.remove();
    const next=paginateBlocks(entries,capacity);
    setPages(prev=>{
     if(JSON.stringify(prev)===JSON.stringify(next))return prev;
     const active=document.activeElement;
     if(active?.closest('.a4-page')&&['INPUT','TEXTAREA','SELECT'].includes(active.tagName))restoreFocus.current={name:active.name,label:active.getAttribute('aria-label'),recordId:active.dataset.recordId,unitId:active.dataset.unitId,start:active.selectionStart,end:active.selectionEnd};
     return next;
    });
    shell.current.dataset.layoutReady='true';
   };
   const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(recalc);};
   recalc();document.fonts?.ready.then(schedule);
   const observer=new ResizeObserver(schedule);
   Object.values(refs.current).filter(Boolean).forEach(e=>observer.observe(e));
   window.addEventListener('contract-before-print',recalc);
   window.addEventListener('beforeprint',recalc);
   return()=>{cancelled=true;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('contract-before-print',recalc);window.removeEventListener('beforeprint',recalc);};
  },[reviewed,pageStyle,bottomReservePx]);
  React.useLayoutEffect(()=>{
   const saved=restoreFocus.current;if(!saved||!shell.current)return;restoreFocus.current=null;
   const field=[...shell.current.querySelectorAll('.a4-page input,.a4-page textarea,.a4-page select')].find(e=>e.name===saved.name&&e.getAttribute('aria-label')===saved.label&&e.dataset.recordId===saved.recordId&&e.dataset.unitId===saved.unitId);
   if(field){field.focus({preventScroll:true});if(saved.start!=null)try{field.setSelectionRange(saved.start,saved.end);}catch{}}
  },[pages]);
  return h('div',{className:'adaptive-document',ref:shell},
   h('div',{className:'a4-measure-shell','aria-hidden':'true',inert:true},h('div',{className:'a4-page-measure '+pageClass,style:pageStyle,ref:measure},
    header&&h('div',{ref:headerRef,className:'a4-running-header',style:{display:'flow-root'}},header),...parts.map(b=>h('div',{className:'a4-flow-block',key:'measure-'+b.key,ref:e=>refs.current[b.key]=e},b.node)))),
   ...pages.map((keys,index)=>h('div',{className:'a4-page '+pageClass,style:pageStyle,key:'page-'+index},header&&h('div',{className:'a4-running-header',style:{display:'flow-root'}},header),
    ...keys.map(key=>h('div',{className:'a4-flow-block',key,'data-block-key':key},byKey.get(key))),
    pageFooter,h('footer',{className:'document-page-number'},`pagina ${index+1} di ${pages.length}`))));
 };
}
