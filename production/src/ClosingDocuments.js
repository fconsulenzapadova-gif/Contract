import {useContractDraft} from './ContractDraft.js';
import {DOCUMENT_TYPES,initialClosingData,normalizeClosingData,sourceDocuments,applySource,isProposal,signatureNames,validateRelease,validateKeyReturn} from './ClosingData.js';

/** Use the existing React instance, A4 pagination, draft tools and PDF layout. */
export function createClosingDocument(React,Layout,Pages,Icon,mode){
 const h=React.createElement;
 const release=mode==='release';
 const title=release?'Liberatoria e chiusura della pratica':'Verbale di riconsegna delle chiavi';
 return function ClosingDocument({closeSidebar}){
  const [data,setData]=useContractDraft(React,'document',initialClosingData,normalizeClosingData);
  const [showErrors,setShowErrors]=React.useState(false);
  const [sources,setSources]=React.useState(()=>sourceDocuments(globalThis.localStorage));
  const root=React.useRef(null);
  const issues=release?validateRelease(data):validateKeyReturn(data);
  const proposal=release&&isProposal(data.kind);
  const change=(name,value)=>setData(previous=>({...previous,[name]:value}));
  React.useEffect(()=>{if(window.innerWidth<=760)closeSidebar?.(false);},[closeSidebar]);
  React.useEffect(()=>{
   const guard=()=>{
    const copy=document.querySelector('.contract-native-print-copy');
    if(!copy||!root.current?.querySelector('.closing-document'))return;
    const errors=issues;
    if(!errors.length)return;
    const message=document.createElement('p');message.className='closing-print-error';
    message.textContent='Documento non generato. '+errors.join(' ');
    copy.replaceChildren(message);
   };
   window.addEventListener('beforeprint',guard);
   return()=>window.removeEventListener('beforeprint',guard);
  },[data]);
  const field=(name,label,{type}={})=>h('label',{className:'closing-field',key:name},
   h('span',{className:'med-field-label'},label),h(type?'input':'textarea',{
    className:'inline-input',name,'aria-label':label,value:data[name],autoComplete:'off',
    ...(type?{type,...(name==='returnTime'?{placeholder:'hh:mm',inputMode:'text'}:{})}:{rows:1}),onChange:event=>change(name,event.target.value)
   }));
  const select=(name,label,options,onChange)=>h('label',{className:'closing-field',key:name},h('span',null,label),
   h('select',{name,'aria-label':label,value:data[name],onChange:event=>onChange?onChange(event.target.value):change(name,event.target.value)},...options.map(([value,label])=>h('option',{key:value,value},label))));
  function selectSource(model){
   const source=sources.documents.find(item=>item.model===model);
   if(!source){change('sourceModel','');return;}
   setData(previous=>applySource(previous,model,source.slots));
   setShowErrors(false);
  }
  const sourceOptions=sources.documents.filter(item=>release?!item.model.startsWith('/lease-contract-'):item.model.startsWith('/lease-contract-'));
  const sourceEditor=h('div',{className:'closing-source'},
   select('sourceModel','Recupera da una bozza locale',[['','Inserisci i riferimenti manualmente'],...sourceOptions.map(item=>[item.model,item.label+' · bozza locale'])],selectSource),
   h('button',{type:'button',className:'contract-control-btn',onClick:()=>setSources(sourceDocuments(globalThis.localStorage))},'Aggiorna elenco'),
   h('p',null,'I dati recuperati provengono da bozze di questo browser. Verifica che corrispondano al documento effettivamente sottoscritto e completa il suo riferimento univoco.'),
   ...sources.errors.map(message=>h('p',{key:message,role:'status'},message)));
  const editor=h('div',{className:'closing-controls pdf-hide'},
   sourceEditor,
   release&&select('kind','Documento da chiudere',Object.entries(DOCUMENT_TYPES),kind=>setData(previous=>({...previous,kind,proposalStatus:'unknown',sourceModel:''}))),
   proposal&&select('proposalStatus','Stato della proposta',[['unknown','Da verificare'],['not-accepted','Verificato: proposta non accettata'],['accepted','Proposta già accettata']]),
   h('p',{className:'closing-info'},'Compila i campi direttamente nel documento. Per più persone inserisci un nominativo per riga, con codice fiscale ed eventuali poteri di rappresentanza.'),
   proposal&&h('p',{className:'closing-info'},'Questo modello richiede la firma di tutti i destinatari della proposta. La selezione dello stato non sostituisce le firme e non attesta una liberazione già avvenuta.'),
   release&&h('p',{className:'closing-info'},'Il testo prevede la chiusura senza ulteriori provvigioni, penali o rimborsi richiesti da GEMÜT. Le somme ancora da restituire non sono dichiarate ricevute.'),
   showErrors&&issues.length>0&&h('div',{role:'alert',className:'closing-errors'},h('strong',null,'Prima di generare il documento'),
    h('ul',null,...issues.map(message=>h('li',{key:message},message)))))
  ;
  const blocks=[];
  const block=(key,node)=>blocks.push({key,node});
  const heading=(key,label)=>block(key,h('h2',{className:'med-section'},label));
  const paragraph=(key,text)=>block(key,h('p',null,text));
  const value=(key,label,content)=>block(key,h('div',{className:'closing-value'},h('span',null,label),h('div',null,content||'____________________________')));
  const editable=(key,name,label,options)=>block(key,field(name,label,options));
  const persons=(key,label)=>editable(key,key,label);
  const signatures=(key,label,content)=>{
   const names=signatureNames(content);
   (names.length?names:['Nome e cognome: ____________________']).forEach((name,index)=>block(key+'-'+index,h('div',{className:'closing-signature contract-individual-signature'},h('div',{className:'med-signature-line'}),h('strong',null,label),h('div',null,name))));
  };
  block('title',h('div',{className:'med-title'},h('div',{className:'med-eyebrow'},'GEMÜT CAPITAL · MEDIAZIONE IMMOBILIARE'),h('h1',null,title)));
  paragraph('agency','GEMÜT CAPITAL SRL · C.F. e P. IVA 05791060287 · REA PD-492863');
  paragraph('agency-address','Sede legale: Piazzale Mazzini 26, 35137 Padova. Sede operativa: Via Savonarola 13, Padova. info@gemutcapital.com · gemutcapital@pec.it');
  heading('reference-heading',release?'01 La pratica':'01 Il rapporto di locazione');
  value('original-type','Documento interessato',release?DOCUMENT_TYPES[data.kind]:'Contratto di locazione');
  editable('reference','reference','Riferimento univoco al documento originario');editable('original-date','originalDate','Data del documento originario');
  editable('address','address','Immobile');
  persons('clients',release?'Cliente o clienti':'Conduttore o conduttori');
  if(!release||proposal)persons('owners',release?'Tutti i destinatari della proposta':'Locatore o locatori');
  if(release){
   paragraph('scope','La presente liberatoria riguarda esclusivamente il documento sopra identificato e gli accordi sul compenso di mediazione direttamente collegati alla medesima pratica.');
   if(proposal){
    heading('closure','02 Chiusura della proposta');
    paragraph('closure-1','Tutti i destinatari della proposta, sottoscrivendo la presente, dichiarano di non averla accettata e di rifiutarla definitivamente.');
    paragraph('closure-2','I destinatari rinunciano ad avvalersi del termine residuo per l’accettazione e concordano con il Proponente la cessazione di ogni vincolo derivante dalla proposta, compreso l’impegno a mantenerla irrevocabile.');
    paragraph('closure-3','Dalla sottoscrizione di tutti i soggetti interessati, la proposta non è più suscettibile di accettazione e il Proponente è libero di assumere altri impegni senza attendere la scadenza originaria.');
    paragraph('closure-4','I destinatari non avanzeranno nei suoi confronti richieste di adempimento, penali o risarcimenti fondati sulla mancata prosecuzione della proposta così chiusa.');
   }else{
    heading('closure','02 Chiusura dell’incarico');
    paragraph('closure-1','GEMÜT e il Cliente concordano lo scioglimento definitivo dell’incarico di mediazione sopra identificato dalla sottoscrizione della presente da parte di entrambi.');
    paragraph('closure-2','Da tale momento cessano gli obblighi di prosecuzione dell’incarico, l’eventuale esclusiva e ogni rinnovo o proroga precedentemente previsto. Il Cliente è libero di disporre dell’immobile e di affidarsi ad altri professionisti.');
    paragraph('closure-3','GEMÜT interrompe l’attività di promozione, rimuove gli annunci sotto il proprio controllo e richiede la rimozione ai portali terzi.');
   }
   heading('waiver','03 Liberatoria di GEMÜT');
   paragraph('waiver-1','GEMÜT dichiara di non avere ulteriori richieste economiche nei confronti del Cliente relative alla pratica identificata.');
   paragraph('waiver-2','Rinuncia espressamente a provvigioni, compensi, penali, rimborsi spese, indennizzi e altre pretese economiche derivanti dal documento interessato, dagli accordi sul compenso collegati e dall’attività svolta nell’ambito della medesima pratica.');
   paragraph('waiver-3','La rinuncia comprende le eventuali clausole destinate a operare dopo la cessazione del rapporto e le pretese fondate sulla successiva conclusione dell’affare riconducibile all’attività già svolta. La chiusura non comporta costi a carico del Cliente.');
   heading('funds','04 Somme e titoli');
   if(proposal)paragraph('funds-1','Eventuali somme, assegni o altri titoli consegnati in relazione alla proposta non accettata devono essere restituiti integralmente al Proponente da chi li detiene, senza trattenute per le voci alle quali GEMÜT ha rinunciato.');
   paragraph('funds-2','La restituzione è documentata con separata ricevuta. La firma della presente non costituisce quietanza di somme o titoli non effettivamente ricevuti e non limita il diritto di ottenerne la restituzione.');
   heading('effects','05 Effetti e consegna della copia');
   paragraph('effects-1','Con le sottoscrizioni necessarie per il caso interessato, la pratica è definitivamente chiusa nei termini sopra indicati. Eventuali nuovi incarichi o proposte richiederanno un nuovo accordo.');
   paragraph('effects-2','La presente non comporta rinunce del Cliente a crediti, restituzioni o altri diritti nei confronti di GEMÜT. Una copia del documento sottoscritto è consegnata al Cliente.');
  }else{
   heading('return','02 La riconsegna');
   block('return-date-time',h('div',{className:'closing-field-row'},field('returnDate','Data della riconsegna'),field('returnTime','Ora della riconsegna',{type:'text'})));
   editable('return-place','returnPlace','Luogo della riconsegna');
   editable('authorization','authorization','Autorizzazione del locatore a ricevere le chiavi');
   paragraph('return-1','In data '+(data.returnDate||'____________')+', alle ore '+(data.returnTime||'____________')+', presso '+(data.returnPlace||'____________')+', il Conduttore riconsegna a GEMÜT CAPITAL SRL, nella persona di '+(data.agent||'____________')+', le chiavi e i dispositivi di accesso elencati di seguito.');
   paragraph('return-2','GEMÜT riceve quanto indicato per conto del Locatore, in forza dell’autorizzazione '+(data.authorization||'____________')+', conservata nella pratica.');
   block('keys-heading',h('h3',{className:'closing-key-heading'},h('strong',null,'Chiave o dispositivo'),h('strong',null,'Quantità'),h('strong',null,'Annotazioni')));
   data.keys.forEach((row,index)=>{
    block('key-'+index,h('div',{className:'closing-key-record'},
     ...[['label','Chiave o dispositivo'],['quantity','Quantità'],['notes','Annotazioni']].map(([key,label])=>h('label',{key,className:'closing-field'},
      h('span',{className:'med-field-label'},label),h(key==='quantity'?'input':'textarea',{
       className:'inline-input',name:row.id+'-'+key,'aria-label':label+' '+(index+1),value:row[key],
       ...(key==='quantity'?{type:'number',min:0,step:1}:{rows:1}),
       onChange:event=>setData(previous=>({...previous,keys:previous.keys.map((item,i)=>i===index?{...item,[key]:event.target.value}:item)}))
      })))));
   });
   paragraph('return-3','Il Conduttore dichiara di aver consegnato tutte le copie e i dispositivi nella propria disponibilità, salvo quanto espressamente indicato nelle annotazioni. Si impegna a restituire tempestivamente eventuali ulteriori copie successivamente rinvenute.');
   heading('observations','03 Disponibilità dell’immobile e osservazioni');
   editable('observations-value','observations','Disponibilità dell’immobile e osservazioni');
   editable('attachments','attachments','Sopralluogo e allegati');
   heading('scope','04 Portata del verbale');
   paragraph('scope-1','GEMÜT conferma di aver ricevuto le chiavi e i dispositivi nelle quantità sopra indicate.');
   paragraph('scope-2','Il presente verbale documenta la riconsegna materiale. Non costituisce, da solo, accordo sulla data di cessazione della locazione, attestazione dell’assenza di danni o definizione dei rapporti economici tra Locatore e Conduttore.');
   paragraph('scope-3','Canoni, oneri, utenze, conguagli ed eventuali danni saranno regolati secondo il contratto e gli accordi tra le parti. Restano salvi il normale deterioramento d’uso e i diritti del Conduttore alla restituzione del deposito cauzionale.');
   paragraph('scope-4','La firma non attesta pagamenti o restituzioni di somme non effettivamente eseguiti.');
  }
  editable('signing-agent','agent','Firmatario per GEMÜT e qualifica');
  editable('signing-date','placeDate','Luogo e data della sottoscrizione');
  signatures('agency-signature',release?'Per GEMÜT CAPITAL SRL':'Per GEMÜT CAPITAL SRL per ricevuta',data.agent);
  signatures('client-signatures',release?'Il Cliente per accordo e ricevuta della copia':'Il Conduttore',data.clients);
  if(proposal)signatures('owner-signatures','Il destinatario della proposta',data.owners);
  return h('div',{ref:root,className:'closing-root mediation-document','data-document-issues':issues.join(' '),onClickCapture:event=>{
   if(!/Salva PDF|Scarica PDF/.test(event.target.closest('button')?.textContent||''))return;
   if(!issues.length){setShowErrors(false);return;}
   event.preventDefault();event.stopPropagation();setShowErrors(true);
  }},h(Layout,{title,icon:h(Icon,{size:20}),clientName:signatureNames(data.clients)[0],headerAside:editor,
   preview:h(Pages,{blocks,bottomReservePx:38,pageHeader:h('header',{className:'med-header'},h('img',{src:'/logo.png',alt:'GEMÜT',className:'contract-logo',width:160,height:58}),h('div',{className:'med-header-meta'},release?'LIBERATORIA E CHIUSURA':'RICONSEGNA CHIAVI',h('br'),data.reference)),pageClass:'closing-document',pageStyle:{fontSize:'10pt',lineHeight:'1.38',padding:'12mm 15mm 15mm'}})}));
 };
}
