import {COMPANY} from './CompanyData.js';
import {useContractDraft} from './ContractDraft.js';
/** Editable transcription of the supplied two-page visit and privacy form. */
export function createVisitSheet(React, Layout, Icon, Pages) {
 const h = React.createElement;
 const VisitPages = ({blocks}) => {
  if(!Pages)return h(React.Fragment,null,...blocks.map(block=>block.node));
  const parts=[],first=React.Children.toArray(blocks[0].node.props.children),running=first[0];
  const header=h('header',{...running.props},first[0].props.children[0],h('div',null,'SCHEDA VISITA'));
  blocks.forEach((block,pageIndex)=>{
   const children=React.Children.toArray(block.node.props.children).slice(1,-1);
   children.forEach((node,index)=>parts.push({key:block.key+'-'+index,node,forcePage:pageIndex>0&&index===0}));
  });
  return h(Pages,{blocks:parts,pageClass:'visit-sheet',pageHeader:header,pageFooter:first.at(-1),pageStyle:{fontSize:'9.6pt',lineHeight:'1.38',padding:'16mm 21mm 18mm'}});
 };
 return function VisitSheet() {
  const [data, setData] = useContractDraft(React,"document",{});
  const field = (name, label, options = {}) => h('label', {className:'visit-field', key:name},
   h('span', {className:'visit-field-label'}, label),
   h(options.type ? 'input' : 'textarea', {
    className:'inline-input', name, 'aria-label':options.ariaLabel || label,
    value:data[name] || '', autoComplete:'off',
    ...(options.type ? {type:options.type} : {rows:Math.max(1, (data[name] || '').split('\n').length, Math.ceil((data[name] || '').length / 72))}),
     placeholder:options.placeholder || '',
    onChange:event=>setData(previous=>({...previous, [name]:event.target.value}))
   }));
  const p = text => h('p', null, text);
  const section = (title, ...children) => h('section', {className:'visit-section'}, h('h2', null, title), ...children);
  const signature = () => h('div', {className:'visit-signature'}, h('span', {className:'visit-field-label'}, 'Firma della persona che visita'), h('div', {className:'visit-signature-line'}));
  const choice = (name, label) => h('button', {
   type:'button', className:'med-choice visit-choice', role:'checkbox',
   'aria-label':label, 'aria-checked':!!data[name],
   onClick:()=>setData(previous=>({...previous, [name]:!previous[name]}))
  }, h('span', {className:'visit-check', 'aria-hidden':true}, data[name] ? '☒' : '☐'), label);
  const heading = (eyebrow, title) => h('div', {className:'visit-heading'}, h('div', {className:'visit-eyebrow'}, eyebrow), h('h1', null, title));
  const page = (number, className, ...children) => h('article', {className:'a4-page visit-sheet ' + className, key:number},
   h('header', {className:'visit-header'}, h('img', {src:'/logo.png', alt:'GEMÜT', className:'contract-logo'}), h('div', null, 'SCHEDA VISITA', h('br'), `0${number} / 02`)),
   ...children,
   h('footer', {className:'visit-footer'}, COMPANY.name+' · '+COMPANY.legalAddress+' · P. IVA '+COMPANY.vat+' · REA '+COMPANY.rea+' · '+COMPANY.email));
  return h(Layout, {
   title:'Scheda visita', icon:h(Icon, {size:20}), clientName:data.name,
   preview:h(VisitPages, {blocks:[
    {key:'visit-details', node:page(1, 'visit-details',
     heading('VISITA IMMOBILIARE', 'Scheda di visita immobiliare'),
     h('p', {className:'visit-intro'}, 'Questa scheda registra l’immobile visitato e i recapiti necessari per dare seguito alla tua richiesta. La visita non comporta, da sola, alcun impegno di acquisto o locazione.'),
     section('La persona che visita',
      field('name', 'Nome e cognome'), field('phone', 'Telefono', {type:'tel', }), field('email', 'Email', {type:'email'}),
      h('p', {className:'visit-note'}, 'Se partecipano più persone, ciascuna compila e firma una scheda.')),
     section('L’immobile e l’appuntamento',
      field('address', 'Indirizzo dell’immobile', {}), field('reference', 'Riferimento immobile', {}),
      h('div', {className:'visit-field-row'}, field('visitDate', 'Data della visita', {placeholder:'gg/mm/aaaa', }), field('visitTime', 'Ora', {type:'time'})),
      field('consultant', 'Consulente Gemüt', {}),
      h('div', {className:'visit-purpose', role:'group', 'aria-label':'Finalità della visita'}, h('span', null, 'Finalità della visita'), choice('purchase', 'Acquisto'), choice('lease', 'Locazione'))),
     section('Conferma della visita',
      p('Con la firma confermo di aver visitato, nella data indicata, l’immobile sopra identificato insieme al consulente Gemüt. Questa conferma riguarda esclusivamente l’avvenuta visita.'),
      field('visitPlaceDate', 'Luogo e data', {ariaLabel:'Luogo e data della conferma visita', }), signature()))},
    {key:'visit-privacy', node:page(2, 'visit-privacy',
     heading('DATI PERSONALI', 'Informativa sulla privacy'),
     h('p', {className:'visit-intro'}, 'I tuoi dati servono a organizzare la visita e a rispondere alla tua richiesta.'),
     section('Chi tratta i dati e come contattarlo',
      p('Il titolare del trattamento è GEMÜT CAPITAL SRL, Piazzale Mazzini 26, 35137 Padova, P. IVA 05791060287. Puoi scrivere a info@gemutcapital.com per informazioni o per esercitare i tuoi diritti.')),
     section('Quali dati raccogliamo e perché',
      p('Trattiamo i dati che inserisci nella scheda (nome, recapiti, immobile visitato, data e firma) per fissare e documentare la visita, rispondere alle tue richieste sull’immobile e gestire i contatti successivi che ci chiedi. La base giuridica è l’esecuzione di misure precontrattuali richieste da te (art. 6, par. 1, lett. b, GDPR). Possiamo inoltre conservare i dati necessari per rispettare obblighi di legge (lett. c) e per accertare, esercitare o difendere un diritto (lett. f). Non usiamo questa scheda per iscriverti a comunicazioni promozionali.')),
     section('Conferimento, destinatari e conservazione',
      p('Il nome e almeno un recapito sono necessari per organizzare la visita e ricontattarti sulla richiesta; senza questi dati potremmo non poter gestire l’appuntamento. I dati possono essere conosciuti da personale autorizzato, fornitori che operano per nostro conto, professionisti e, se necessario per la visita, dal proprietario o suo rappresentante. Non sono diffusi pubblicamente.'),
      p('Conserviamo i dati per il tempo necessario a gestire la visita e i contatti richiesti. Successivamente conserviamo solo quelli necessari fino alla scadenza dei termini di legge o di prescrizione dei diritti connessi; in caso di contestazione, fino alla sua definizione. Eventuali trasferimenti fuori dallo Spazio economico europeo avvengono soltanto con le garanzie previste dal GDPR.')),
     section('I tuoi diritti',
      p('Puoi chiedere accesso, rettifica, cancellazione, limitazione del trattamento e, nei casi previsti, portabilità dei dati. Puoi opporti al trattamento fondato sul legittimo interesse. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it). Non adottiamo decisioni basate unicamente su trattamenti automatizzati tramite questa scheda.')),
     section('Presa visione',
      p('Con la firma confermo di aver ricevuto e letto questa informativa prima di consegnare i miei dati. La firma attesta la presa visione; non è un consenso a ricevere comunicazioni promozionali.'),
      field('privacyPlaceDate', 'Luogo e data', {ariaLabel:'Luogo e data della presa visione privacy', }), signature()))}
   ]})
  });
 };
}
