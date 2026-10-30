import {createTextMeasurer,paginateContinuationEntries,continuationPages} from './Continuation.js';
/** Coordinates are PDF points, measured from the supplied two-page original. */
export const PAGE = {width:594.95996,height:841.91998};
export const FIELDS = [
 ['vNome','Venditore: nome e cognome',1,238.5,135.5,150,12],
 ['vCF','Venditore: codice fiscale',1,67.5,153.5,120,12],
 ['vCitta','Venditore: città',1,231,153.5,97.5,12],
 ['p1Nome','Proponente: nome e cognome',1,99,180.5,165,12],
 ['p1NatoIl','Proponente: data di nascita',1,303.75,180.5,75,12],
 ['p1ResidenteA','Proponente: Comune di residenza',1,89.25,198.5,135,12],
 ['p1Via','Proponente: via e numero civico',1,241.5,198.5,120,12],
 ['p1CF','Proponente: codice fiscale',1,384,198.5,127.5,12],
 ['p1Email','Proponente: email o PEC',1,96.75,216.5,210,12],
 ['immComune','Immobile: Comune',1,80.25,314.75,97.5,12],
 ['immVia','Immobile: via',1,195.75,314.75,135,12],
 ['immCivico','Immobile: numero civico',1,345.75,314.75,22.5,12],
 ['immComposizione','Composizione immobile',1,42.75,342,510,16],
 ['c1F','Catasto: foglio',1,129.75,365,26.25,12],
 ['c1M','Catasto: mappale',1,197.25,365,33.75,12],
 ['c1S','Catasto: subalterno',1,252,365,26.25,12],
 ['canoneAnnuo','Canone di locazione in euro',1,288,386,56.25,12],
 ['prezzoOfferto','Prezzo di acquisto offerto in euro',1,49.5,438.5,90,12],
 ['pag1Importo','Deposito fiduciario in euro',1,60,491,56.25,12],
 ['pag1AssegnoNum','Numero assegno non trasferibile',1,54,507.5,67.5,12],
 ['attoEntroIl','Termine atto notarile',1,317.25,544.25,75,12],
 ['attoNotaio','Notaio',1,42.75,560.75,135,12],
 ['irrevocabileFino','Termine irrevocabilità',1,302.25,613.25,75,12],
 ['note','Note',1,42.75,765,510,15.5],
 ['documents','Documenti esaminati, APE consegnato e verifiche da completare',2,42.75,201,510,23.5],
 ['defects','Gravami, difformità, occupazione, spese e modalità/termine di regolarizzazione',2,42.75,237.75,510,23.5],
 ['payments','Importi e scadenze dei pagamenti successivi; saldo al rogito, modalità e consegna',2,42.75,296.25,510,23.5],
 ['conditions','Eventuali condizioni sospensive: evento, termine, importo del mutuo e modalità di comunicazione dell’esito',2,42.75,332.25,510,23.5],
 ['acceptanceReceipt','Data, ora e modalità di ricezione dell’accettazione; firma del Proponente per ricevuta',2,42.75,430.5,510,23.5],
 ['placeDate','Proponente: luogo e data',2,99,520.5,250,13],
 ['sellerPlaceDate','Venditore: luogo e data',2,108,630.5,84,12],
 ['receiptPlaceDate','Presa visione accettazione: luogo e data',2,108,719.75,84,12],
];
const fieldNames=new Set(FIELDS.map(f=>f[0]));
const draftKey='gemut.contract.draft.v1:/purchase-proposal';
const recordList=value=>Array.isArray(value)?value:[];
function personName(person) {
 const name=String(person.nome||'').trim(),surname=String(person.cognome||'').trim();
 const normalized=value=>value.replace(/\s+/g,' ').toLocaleLowerCase('it');
 return !surname||normalized(name)===normalized(surname)||normalized(name).endsWith(' '+normalized(surname))?name:[name,surname].filter(Boolean).join(' ');
}
export function normalizeTemplate(value={}) {
 const result=Object.fromEntries(FIELDS.map(([key])=>[key,typeof value?.[key]==='string'?value[key]:'']));
 return {...result,statoImm:value?.statoImm==='locato'?'locato':'libero'};
}
/** Read legacy slots without deleting or rewriting the original records. */
export function legacyTemplate(slots={}) {
 const data={...slots.document,...slots.supplement};
 const owner=slots.owners?.[0],buyer=slots.buyers?.[0],unit=slots.units?.[0];
 const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')?value.split('-').reverse().join('/'):value;
 if(owner)Object.assign(data,{vNome:personName(owner),vCF:owner.cf,vCitta:owner.domicilioComune});
 if(buyer)Object.assign(data,{p1Nome:personName(buyer),p1CF:buyer.cf,p1NatoIl:date(buyer.natoIl),p1ResidenteA:buyer.domicilioComune,p1Via:[buyer.via,buyer.numero].filter(Boolean).join(' '),p1Email:buyer.email});
 if(unit)Object.assign(data,{immComune:unit.comune,immVia:unit.via,immCivico:unit.numero,immComposizione:unit.descrizione,c1F:unit.foglio,c1M:unit.particella,c1S:unit.subalterno});
 for(const key of ['p1NatoIl','attoEntroIl','irrevocabileFino'])data[key]=date(data[key]);
 return normalizeTemplate(data);
}
export function legacyNeedsReview(slots={}) {
 // Extra records have no corresponding spaces in the exact supplied layout.
 return ['owners','buyers','units'].some(key=>(slots[key]?.length||0)>1)||legacyOmittedValues(slots).length>0;
}
const legacyDefaults={confApe:'APE',pag2Assegno:'circolare',pag2Titolo:'caparra',pag3Assegno:'circolare',pag3Titolo:'caparra',saldoModo:'assegno',depositoPrezzo:'B'};
export function legacyOmittedValues(slots={}) {
 const values=[];
 const append=(record,allowed,prefix,defaults={})=>{
  for(const [key,value] of Object.entries(record||{})){
   if(typeof value==='string'&&value.trim()&&!allowed.has(key)&&value!==defaults[key])values.push(prefix+value);
  }
 };
 append(slots.document,new Set([...fieldNames,'statoImm']),'Dato della proposta precedente: ',legacyDefaults);
 for(const [key,label] of [['owners','Venditore'],['buyers','Proponente']]){
  const personKeys=new Set(['id','nome','cognome','cf','domicilioComune','sesso','trattamento',...(key==='buyers'?['natoIl','via','numero','email']:[])]);
  recordList(slots[key]).forEach((record,index)=>{
   if(index>0)values.push(`${label} ${index+1}: ${Object.entries(record||{}).filter(([key,value])=>key!=='id'&&typeof value==='string'&&value.trim()).map(([,value])=>value).join(' · ')}`);
   else append(record,personKeys,label+': ');
  });
 }
 const unitKeys=new Set(['id','tipo','mainUnitId','comune','via','numero','descrizione','foglio','particella','subalterno']);
 recordList(slots.units).forEach((record,index)=>{
  if(index>0)values.push(`Immobile ${index+1}: ${Object.entries(record||{}).filter(([key,value])=>!['id','mainUnitId'].includes(key)&&typeof value==='string'&&value.trim()).map(([,value])=>value).join(' · ')}`);
  else append(record,unitKeys,'Immobile: ');
 });
 return [...new Set(values)];
}
function readSlots(){try{return JSON.parse(localStorage.getItem(draftKey)||'{}').slots||{};}catch{return {};}}
const position=([,,,x,y,w,h])=>({left:x/PAGE.width*100+'%',top:y/PAGE.height*100+'%',width:w/PAGE.width*100+'%',height:h/PAGE.height*100+'%'});
/** Unlike the generic form converter, keep every exact field's fixed rectangle. */
export function convertPurchaseFields(root) {
 for(const input of root.querySelectorAll('.purchase-template-field')){
  const span=root.ownerDocument.createElement('span');
  span.className='purchase-template-value';span.style.cssText=input.style.cssText;
  const reference=input.getAttribute('data-continuation-reference');
  span.textContent=reference?'['+reference+']':input.matches('input,textarea')?input.value:input.textContent;span.setAttribute('aria-label',input.getAttribute('aria-label'));
  input.replaceWith(span);
 }
 for(const button of root.querySelectorAll('.purchase-template-check')){
  const span=root.ownerDocument.createElement('span');span.className='purchase-template-check purchase-template-check-static';
  span.style.cssText=button.style.cssText;span.innerHTML=button.innerHTML;button.replaceWith(span);
 }
}
export function createPurchaseTemplate(React,Layout,Icon,useDraft) {
 const h=React.createElement;
 const PurchasePages=({rootRef,children})=>h('div',{ref:rootRef,className:'purchase-template-pages'},children);
 return function PurchaseTemplate() {
  const [data,setData]=useDraft(React,'purchaseTemplate',()=>legacyTemplate(readSlots()),normalizeTemplate);
  const [reviewed,setReviewed]=useDraft(React,'purchaseTemplateReviewed',false);
  const [notice,setNotice]=React.useState(''),[expanded,setExpanded]=React.useState(null);
  const [plan,setPlan]=React.useState({references:{},pages:[]});
  const [inline,setInline]=React.useState(null);
  const root=React.useRef(null);
  const needsReview=legacyNeedsReview(readSlots())&&!reviewed;
  const change=(key,value)=>{if(fieldNames.has(key)||key==='statoImm'){setData(previous=>({...previous,[key]:value}));setNotice('');}};
  React.useLayoutEffect(()=>{
   let cancelled=false;
   const calculate=()=>{
    if(cancelled)return;
    const measure=createTextMeasurer(),entries=[],references={};
    try {
     FIELDS.forEach(([key,label,page,,,width,height],index)=>{
      const text=data[key];
      if(!text||(!/\n|\r/.test(text)&&measure.height(text,width-2,10,12)<=height+.1))return;
      const id='A'+(index+1);references[key]=id;
      entries.push({key,id,label,text,context:`Modulo di proposta d’acquisto, pagina ${page}, campo «${label}».`});
     });
     setPlan({references,pages:paginateContinuationEntries(entries,measure)});
    } finally {measure.dispose();}
   };
   calculate();document.fonts?.ready.then(calculate);
   return()=>{cancelled=true;};
  },[data]);
  React.useEffect(()=>{
   if(!expanded)return;
   const dialog=document.querySelector('.purchase-expanded-editor');
   dialog?.showModal();dialog?.querySelector('textarea')?.focus();
   return()=>dialog?.close();
  },[expanded]);
  const issues=()=>needsReview?['La bozza precedente contiene dati senza uno spazio corrispondente: controllali prima di confermare la revisione.']:[];
  React.useEffect(()=>{
   let copy;
   const restore=()=>{copy?.remove();copy=null;document.body.classList.remove('contract-native-print');};
   const prepare=()=>{
    if(copy||!root.current)return;
    const errors=issues();copy=root.current.cloneNode(true);
    const live=root.current.querySelectorAll('.purchase-template-field');
    copy.querySelectorAll('.purchase-template-field').forEach((field,index)=>{field.value=live[index].value;});
    convertPurchaseFields(copy);copy.classList.add('contract-native-print-copy');
    if(errors.length){copy.replaceChildren();const error=document.createElement('p');error.textContent='PDF non generato. '+errors.join(' ');copy.appendChild(error);setNotice(errors.join(' '));}
    document.body.appendChild(copy);document.body.classList.add('contract-native-print');
   };
   window.addEventListener('beforeprint',prepare);window.addEventListener('afterprint',restore);
   return()=>{restore();window.removeEventListener('beforeprint',prepare);window.removeEventListener('afterprint',restore);};
  },[data,needsReview]);
  const input=(definition,editor=false)=>{
   const [key,label]=definition;
   if(!editor)return h('textarea',{key,rows:1,className:'purchase-template-field','aria-label':'Modifica: '+label,style:position(definition),title:plan.references[key]?`${label}: testo integrale nell’allegato ${plan.references[key]}`:label,'data-continuation-reference':plan.references[key],value:inline===key||!plan.references[key]?data[key]:'['+plan.references[key]+']',autoComplete:'off',spellCheck:false,onFocus:()=>setInline(key),onBlur:()=>setInline(null),onChange:event=>change(key,event.target.value)});
   return h('textarea',{key,name:key,rows:3,'aria-label':label,value:data[key],autoComplete:'off',spellCheck:false,onChange:event=>change(key,event.target.value)});
  };
  const check=(status,x)=>h('button',{key:status,type:'button',role:'radio','aria-label':'Immobile '+status,'aria-checked':data.statoImm===status,
   className:'purchase-template-check',style:position(['','',1,x,384.9,8.7,8.1]),onClick:()=>change('statoImm',status)},
   // White rectangle covers the original mark. The SVG keeps its exact point size.
   h('svg',{viewBox:'0 0 10 10','aria-hidden':true},h('rect',{x:1,y:1,width:8,height:8,fill:'white',stroke:'#7d9cab',strokeWidth:.6}),
    data.statoImm===status&&h('path',{d:'M2.5 5L4.2 7.3L7.6 2.5',fill:'none',stroke:'#688897',strokeWidth:.7})));
  const identityField=key=>({value:data[key],label:FIELDS.find(field=>field[0]===key)?.[1],props:{name:key,type:'text',onChange:event=>change(key,event.target.value)}});
  const identityTargets=[{id:'purchase-seller',label:'Venditore',fields:{fullName:identityField('vNome'),taxCode:identityField('vCF'),residence:identityField('vCitta')}},{id:'purchase-proposer',label:'Proponente',fields:{fullName:identityField('p1Nome'),taxCode:identityField('p1CF'),birthDate:identityField('p1NatoIl'),residence:identityField('p1ResidenteA')}}];
  const preview=h(PurchasePages,{rootRef:root,identityTargets},[1,2].map(number=>h('article',{key:number,className:'a4-page purchase-template-page','aria-label':`Modulo di proposta d’acquisto, pagina ${number} di ${2+plan.pages.length}`},
   h('img',{className:'purchase-template-background',src:`/purchase-template/page-${number}.svg`,alt:'',draggable:false}),
   number===2&&h('svg',{className:'purchase-acceptance-receipt',viewBox:'0 0 510 75',style:position(['','',2,42.75,675,510,75]),role:'group','aria-label':'Presa visione dell’avvenuta accettazione'},
    h('rect',{x:.75,y:.75,width:508.5,height:73.5,fill:'white',stroke:'black',strokeWidth:1.5}),
    h('text',{x:255,y:16.5,textAnchor:'middle',className:'purchase-receipt-title'},'PRESA VISIONE DELL’AVVENUTA ACCETTAZIONE'),
    h('text',{x:8.88,y:33},'Il sottoscritto Proponente prende visione dell’avvenuta accettazione del Venditore.'),
    h('text',{x:8.88,y:54},'Luogo e data:'),
    h('line',{x1:65.25,y1:55,x2:150.25,y2:55,stroke:'black',strokeWidth:.5}),
    h('text',{x:165.75,y:54},'Firma proponente:'),
    h('line',{x1:253.5,y1:55,x2:338.5,y2:55,stroke:'black',strokeWidth:.5})),
   ...FIELDS.filter(f=>f[2]===number).map(f=>input(f)),
   number===1&&h('div',{role:'radiogroup','aria-label':'Stato immobile'},check('libero',157.95),check('locato',200.32)))),...continuationPages(React,plan.pages,{kind:'purchase',title:'Proposta d’acquisto',signatures:['Proponente','Venditore']}));
  const editorColumn=h('section',{className:'purchase-mobile-editor purchase-editor','aria-label':'Compilazione proposta d’acquisto'},
   needsReview&&h('div',{className:'purchase-template-notice',role:'alert'},'La bozza precedente contiene dati senza uno spazio corrispondente nel nuovo modulo. I dati originali sono conservati nella bozza esportabile. Riporta le informazioni necessarie nei campi prima di stampare. ',
    h('details',null,h('summary',null,'Dati precedenti da verificare'),h('ul',null,...legacyOmittedValues(readSlots()).map((value,index)=>h('li',{key:index},value)))),
    h('button',{type:'button',onClick:()=>{setReviewed(true);setNotice('');}},'Confermo di avere verificato tutti i dati')),
   notice&&h('p',{className:'purchase-template-notice',role:'alert'},notice),
    h('h1',null,'Proposta d’acquisto'),h('p',null,'Compila i campi. Il testo che supera gli spazi originali prosegue su allegati numerati, con il riferimento al campo e gli spazi per le firme.'),
    h('a',{href:'/purchase-template/original.pdf',download:'Proposta_acquisto_modulo_originale.pdf'},'Scarica il modulo originale'),
    h('p',{className:'purchase-page-count','aria-live':'polite'},`${2+plan.pages.length} pagine in anteprima`),
    ...FIELDS.map(definition=>h('div',{className:'purchase-editor-field',key:definition[0]},h('label',null,h('span',null,definition[1]),input(definition,true)),h('div',{className:'purchase-field-tools'},h('small',null,`${data[definition[0]].length.toLocaleString('it')} caratteri`),h('button',{type:'button',onClick:()=>setExpanded(definition[0]),'aria-label':'Espandi: '+definition[1]},'Espandi campo')))),
    h('label',null,'Stato immobile',h('select',{value:data.statoImm,onChange:e=>change('statoImm',e.target.value)},h('option',{value:'libero'},'Libero'),h('option',{value:'locato'},'Locato'))));
  return h('div',{className:'purchase-template-workspace',onClickCapture:event=>{
   if(!event.target.closest('button')?.textContent?.includes('Salva PDF'))return;
   const errors=issues();if(errors.length){event.preventDefault();event.stopPropagation();setNotice(errors.join(' '));}
  }},
   h('div',{className:'purchase-preview'},h(Layout,{title:'Modulo Proposta Acquisto',icon:h(Icon,{size:20}),clientName:data.p1Nome,preview,editorColumn})),
   expanded&&h('dialog',{className:'purchase-expanded-editor',onCancel:()=>setExpanded(null),'aria-labelledby':'purchase-expanded-title'},h('h2',{id:'purchase-expanded-title'},FIELDS.find(field=>field[0]===expanded)?.[1]),h('textarea',{'aria-label':'Testo integrale del campo',value:data[expanded],onChange:event=>change(expanded,event.target.value),rows:16}),h('p',null,`${data[expanded].length.toLocaleString('it')} caratteri. Il testo viene salvato nella bozza e impaginato integralmente.`),h('button',{type:'button',onClick:()=>setExpanded(null)},'Chiudi editor')));
 };
}
