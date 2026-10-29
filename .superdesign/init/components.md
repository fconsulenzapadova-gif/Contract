# Shared Layout and editor controls
```js
wr=({title:e,icon:t,preview:n,clientName:r,headerAside:i})=>{let a=(0,_.useRef)(null),o=(0,_.useRef)(null),[s,c]=(0,_.useState)(!1),[l,u]=(0,_.useState)(1),[d,f]=(0,_.useState)(1),p=e=>{e.querySelectorAll(`.pdf-hide`).forEach(e=>e.remove()),e.querySelectorAll(`.inline-input, .inline-select`).forEach(e=>{let t=e,n=t.ownerDocument,r=n.defaultView?.getComputedStyle(t),i=n.createElement(`span`),a=r?.display===`block`,o=t instanceof HTMLSelectElement?t.options[t.selectedIndex]?.text??t.value:t.value;i.className=`pdf-static-field`,i.textContent=o||`\xA0`,i.style.display=a?`block`:`inline-block`,i.style.width=r?.width??t.style.width??`auto`,i.style.maxWidth=r?.maxWidth??`100%`,i.style.minHeight=r?.height??`1em`,i.style.margin=r?.margin??`0`,i.style.padding=`0`,i.style.border=`none`,i.style.background=`transparent`,i.style.color=`#000`,i.style.font=r?.font??`inherit`,i.style.lineHeight=r?.lineHeight??`inherit`,i.style.fontWeight=r?.fontWeight??`bold`,i.style.letterSpacing=r?.letterSpacing??`normal`,i.style.verticalAlign=r?.verticalAlign??`baseline`,i.style.whiteSpace=a?`pre-wrap`:`normal`,i.style.wordBreak=`break-word`,i.style.overflowWrap=`anywhere`,t.replaceWith(i)})},m=()=>`${e.replace(/[^a-zA-Z0-9]/g,`_`).toLowerCase()}${r?`_${r.replace(/[^a-zA-Z0-9]/g,`_`).toLowerCase()}`:``}.pdf`,h=async e=>{let t=e.fonts?.ready??Promise.resolve(),n=Array.from(e.querySelectorAll(`link[rel="stylesheet"]`)).map(e=>e.sheet?Promise.resolve():new Promise(t=>{e.addEventListener(`load`,()=>t(),{once:!0}),e.addEventListener(`error`,()=>t(),{once:!0})})),r=Array.from(e.images).map(e=>e.complete?Promise.resolve():new Promise(t=>{e.addEventListener(`load`,()=>t(),{once:!0}),e.addEventListener(`error`,()=>t(),{once:!0})}));await Promise.all([t,...n,...r]),await new Promise(e=>window.setTimeout(e,120))},g=async()=>{if(a.current){c(!0),await new Promise(e=>setTimeout(e,300));try{let e=document.createElement(`iframe`);e.setAttribute(`aria-hidden`,`true`),e.style.position=`fixed`,e.style.right=`0`,e.style.bottom=`0`,e.style.width=`0`,e.style.height=`0`,e.style.border=`0`,e.style.opacity=`0`,document.body.appendChild(e);let t=e.contentWindow,n=e.contentDocument;if(!t||!n)throw Error(`Print frame unavailable`);let r=m();n.open(),n.write(`<!doctype html><html><head><meta charset="utf-8"><title>${r}</title></head><body></body></html>`),n.close();let i=n.createElement(`base`);i.href=`${window.location.origin}/`,n.head.prepend(i),document.querySelectorAll(`style, link[rel="stylesheet"]`).forEach(e=>{n.head.appendChild(e.cloneNode(!0))});let o=n.createElement(`style`);o.textContent=`
        @page { size: A4; margin: 0; }
        html, body {
          margin: 0;
          padding: 0;
          background: #ffffff;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .print-root {
          margin: 0;
          padding: 0;
        }
        .a4-document-container {
          gap: 0 !important;
          align-items: stretch !important;
        }
        .a4-page {
          margin: 0 auto !important;
          box-shadow: none !important;
          border: none !important;
          border-left: none !important;
          page-break-after: always;
          break-after: page;
        }
        .a4-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
      `,n.head.appendChild(o);let s=n.importNode(a.current,!0);p(s);let c=n.createElement(`div`);c.className=`print-root`,c.appendChild(s),n.body.appendChild(c),await h(n),await new Promise(n=>{let r=!1,i=()=>{r||(r=!0,e.remove(),n())};t.addEventListener(`afterprint`,i,{once:!0}),window.setTimeout(i,6e4),t.focus(),t.print()})}catch(e){console.error(`Error generating PDF:`,e),alert(`Errore durante la generazione del PDF. Riprova tra un istante.`)}finally{c(!1)}}};(0,_.useEffect)(()=>{let e=new ResizeObserver(e=>{for(let t of e){let e=t.contentRect.width;u(e<yr&&e>0?e/yr:1)}});return o.current&&e.observe(o.current),()=>e.disconnect()},[]);let v=s?1:l*d,y=Math.round(v*100);return(0,P.jsxs)(`div`,{className:`flex flex-col h-full w-full bg-background ${s?`pdf-exporting`:``}`,children:[(0,P.jsxs)(`div`,{className:`p-4 md:p-6 border-b border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-surface/90 backdrop-blur-sm z-10 w-full`,children:[(0,P.jsxs)(`div`,{className:`flex flex-1 min-w-0 flex-col gap-3 md:flex-row md:items-center`,children:[(0,P.jsxs)(`div`,{className:`flex items-center gap-3 shrink-0 min-w-0`,children:[(0,P.jsx)(`div`,{className:`p-2 bg-primary-light text-primary rounded-lg`,children:t}),(0,P.jsxs)(`div`,{className:`min-w-0`,children:[(0,P.jsx)(`h1`,{className:`text-xl font-bold truncate`,children:e}),(0,P.jsx)(`p`,{className:`text-sm text-primary`,children:`Compila direttamente sul documento`})]})]}),i?(0,P.jsx)(`div`,{className:`min-w-0`,children:i}):null]}),(0,P.jsxs)(`div`,{className:`preview-toolbar shrink-0`,children:[(0,P.jsxs)(`div`,{className:`preview-zoom-controls`,children:[(0,P.jsx)(`button`,{type:`button`,className:`preview-zoom-btn`,onClick:()=>f(e=>Cr(e-Sr)),disabled:!(d>br)||s,"aria-label":`Riduci zoom`,title:`Riduci zoom`,children:(0,P.jsx)(mr,{size:16})}),(0,P.jsxs)(`div`,{className:`preview-zoom-label`,"aria-live":`polite`,children:[`Zoom `,y,`%`]}),(0,P.jsx)(`button`,{type:`button`,className:`preview-zoom-btn`,onClick:()=>f(e=>Cr(e+Sr)),disabled:!(d<xr)||s,"aria-label":`Aumenta zoom`,title:`Aumenta zoom`,children:(0,P.jsx)(hr,{size:16})}),(0,P.jsx)(`button`,{type:`button`,className:`preview-zoom-btn preview-zoom-reset`,onClick:()=>f(1),disabled:d===1||s,"aria-label":`Reimposta zoom`,title:`Reimposta zoom`,children:(0,P.jsx)(gr,{size:15})})]}),(0,P.jsxs)(`button`,{className:`btn btn-primary shadow-md hover:shadow-lg transition-all`,onClick:g,disabled:s,children:[(0,P.jsx)(sr,{size:18}),` `,s?`Preparazione PDF...`:`Salva PDF`]})]})]}),(0,P.jsx)(`div`,{ref:o,className:`flex-1 overflow-y-auto overflow-x-hidden document-preview-container flex justify-center items-start min-w-0`,children:(0,P.jsx)(`div`,{className:`w-full flex justify-center py-8 relative`,style:{transform:`scale(${v})`,transformOrigin:`top center`,transition:`transform 0.15s ease-out`},children:(0,P.jsx)(`div`,{className:`a4-document-container flex flex-col gap-8`,ref:a,children:n})})})]})},
```
```js
import {collectTargets} from './IdentityTargets.js';
import {createDraftTools,useContractDraft} from './ContractDraft.js';
import {normalizeBirthDate} from './FiscalCode.js';
import {createFiscalCodeUI} from './FiscalCodeUI.js';
const cache=new WeakMap();
function walk(node,callback){
 if(Array.isArray(node)){node.forEach(n=>walk(n,callback));return;}
 if(!node?.props)return;
 if(callback(node)===false)return;
 walk(node.props.children,callback);
}
export function editableControls(preview){
 const controls=[];
 for(const block of preview?.props?.blocks||[])walk(block.node,node=>{
  if(/(?:^| )contract-party-controls(?: |$)/.test(node.props.className||'')){controls.push(node);return false;}
 });
 return controls;
}
export function removeEditorControls(React,node){
 if(Array.isArray(node))return node.map(n=>removeEditorControls(React,n)).filter(n=>n!=null);
 if(!node?.props)return node;
 if(/(?:^| )(?:pdf-hide|pdf-export-hide|contract-party-controls)(?: |$)/.test(node.props.className||''))return null;
 if(!node.props.children)return node;
 return React.cloneElement(node,null,removeEditorControls(React,node.props.children));
}
export function toolsHeader(React,preview,existing,adapter){
 if(location.pathname==='/lease-allegato-b')return existing;
 let Tools=cache.get(React);
 if(!Tools){
  const h=React.createElement,{FiscalCodeAssistant}=createFiscalCodeUI(React,adapter),DraftTools=createDraftTools(React);
  Tools=function ContractTools({preview,existing}){
   const [extra,setExtra]=useContractDraft(React,'fiscalMetadata',{});
   const targets=collectTargets(preview,location.pathname);
   const activeIds=JSON.stringify(targets.map(target=>target.recordId||target.id));
   React.useEffect(()=>{
    const active=new Set(JSON.parse(activeIds));
    setExtra(previous=>Object.keys(previous).some(id=>!active.has(id))?Object.fromEntries(Object.entries(previous).filter(([id])=>active.has(id))):previous);
   },[activeIds]);
   const controls=editableControls(preview);
   return h('div',{className:'contract-editor-tools'},existing,h(DraftTools),
    controls.length>0&&h('details',{className:'contract-editor-records'},h('summary',null,'Parti, trattamento e unità immobiliari'),...controls.map((node,i)=>h('div',{key:'editor-'+i},node))),
    targets.length>0&&h('details',{className:'contract-fiscal-tools'},h('summary',null,'Anagrafiche e codice fiscale'),...targets.map(target=>{
     const fields=target.fields,stable=target.recordId||target.id;
     const person={...(extra[stable]||{}),id:stable};
     const aliases={fullName:'nome',givenNames:'nome',surname:'cognome',birthPlace:'natoA',birthProvince:'prov',birthDate:'natoIl',taxCode:'cf',sex:'sesso'};
     for(const [key,prop] of Object.entries(aliases))if(fields[key])person[prop]=fields[key].value;
     if(fields.fullName&&person.cognome&&!(person._fiscalCode?.names?.source==='manual'&&person._fiscalCode.names.displayValue===person.nome&&person._fiscalCode.names.cognome===person.cognome)){const display=String(person.nome||'').trim(),surname=String(person.cognome).trim(),suffix=' '+surname;const given=display.toLocaleLowerCase('it').endsWith(suffix.toLocaleLowerCase('it'))?display.slice(0,-suffix.length).trim():display;person._fiscalCode={...person._fiscalCode,names:{nome:given,cognome:surname,displayValue:person.nome,confirmed:true,source:'explicit surname'}};}
     return h(FiscalCodeAssistant,{key:stable,person,label:target.label,legacyFullName:!!fields.fullName,availableFields:Object.entries(aliases).filter(([key])=>fields[key]).map(([,prop])=>prop),onChange:next=>{
      setExtra(previous=>({...previous,[stable]:next}));
      for(const [key,prop] of Object.entries(aliases)){
       const field=fields[key];if(!field||next[prop]===undefined||next[prop]===field.value)continue;
       let value=next[prop];
       if(prop==='natoIl'&&field.props.type==='date'&&/^\d{2}\/\d{2}\/\d{4}$/.test(value))value=value.slice(6)+'-'+value.slice(3,5)+'-'+value.slice(0,2);
       if(prop==='natoIl'&&field.props.type!=='date'&&normalizeBirthDate(value))value=normalizeBirthDate(value).split('-').reverse().join('/');
       field.props.onChange({target:{name:field.props.name,value,type:field.props.type||'text'},identityImport:true});
      }
     }});
    })));
  };
  cache.set(React,Tools);
 }
 return React.createElement(Tools,{preview,existing});
}

```