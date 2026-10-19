import {useOptionalPhysicalRecords} from './OptionalPhysicalRecords.js';
import {useContractDraft} from './ContractDraft.js';
/** Separate compensation agreement and customer declaration; neither certifies compliance. */
export function createProfessionalDocument(React, Layout, Pages, Icon, kind) {
 const h=React.createElement;
 return function ProfessionalDocument(){
  const [data,setData]=useContractDraft(React,"document",{
   agency:'Gemüt Capital Srl · P. IVA 05791060287 · REA PD - 492863',
   office:'Sede legale: Piazzale Mazzini 26, Padova (PD) 35137 · Sede operativa: Via Savonarola 13, Padova (PD)',
   contact:'info@gemutcapital.com · gemutcapital@pec.it · 049 0981631'
  });
  const representatives=useOptionalPhysicalRecords(React,'representatives','Rappresentante');
  const beneficial=useOptionalPhysicalRecords(React,'beneficialOwners','Titolare effettivo');
  const field=(name,label)=>h('label',{className:'med-field',key:name},h('span',{className:'med-field-label'},label),h('textarea',{className:'inline-input',name,value:data[name]||'',rows:Math.max(1,Math.ceil((data[name]||'').length/85)),'aria-label':label,onChange:e=>setData(d=>({...d,[name]:e.target.value}))}));
  const p=t=>h('p',null,t);
  const block=(key,title,...children)=>({key,node:h('section',{className:'med-block'},h('h2',{className:'med-section'},title),...children)});
  const signatures=(...labels)=>h('div',{className:'med-signatures'},...labels.map(t=>h('div',{key:t},h('div',{className:'med-signature-line'}),t)));
  const fee=kind==='fee';
  const title=fee?'Accordo sul compenso di mediazione':'Dichiarazione del cliente · Antiriciclaggio';
  const blocks=[{key:'title',node:h('div',{className:'med-title'},h('div',{className:'med-eyebrow'},'GEMÜT CAPITAL · MEDIAZIONE IMMOBILIARE'),h('h1',null,title))},
   block('parties','01 · Identificazione',field('name','Cliente: nome e cognome / denominazione'),field('identity','Nascita, codice fiscale / P. IVA, residenza / sede'),field('natoA','Persona fisica: Comune o Stato estero di nascita'),field('natoIl','Persona fisica: data completa di nascita'),field('cf','Codice fiscale / identificativo numerico'),field('representative','Esecutore o rappresentante: generalità, codice fiscale e poteri documentati'),field('agency','Impresa di mediazione'),field('office','Sedi dell’impresa'),field('agent','Agente abilitato operante'),field('contact','Contatti dell’impresa'),field('operation','Immobile, tipo di operazione, parti e riferimento all’incarico / proposta'))];
  blocks.push(...representatives.blocks,...(!fee?beneficial.blocks:[]));
  if(fee)blocks.push(
   block('amount','02 · Compenso concordato separatamente',
    p('Il presente accordo disciplina il compenso per l’attività di mediazione, separatamente dall’incarico. Il cliente e il Mediatore concordano una sola modalità di determinazione, completando gli importi e cancellando le alternative non pattuite.'),
    field('calculation','Modalità scelta: importo fisso oppure percentuale; base esatta di calcolo e aliquota'),
    field('net','Compenso imponibile (€), oppure criterio oggettivo per determinarlo'),field('tax','Regime IVA applicabile, aliquota e imposta (€)'),field('total','Totale IVA inclusa (€), oppure criterio completo di determinazione'),
    p('Non sono dovuti rimborsi spese o servizi ulteriori se non concordati espressamente per iscritto, indicandone contenuto e costo. Prima della firma il cliente riceve un esemplare con il costo totale o un criterio di calcolo chiaro e verificabile.')),
   block('right','03 · Maturazione e pagamento',
    p('Il diritto al compenso sorge se l’affare è concluso per effetto dell’intervento del Mediatore, ai sensi dell’art. 1755 c.c. e nel rispetto dei requisiti professionali di legge. La mera visita o firma di una proposta non accettata non determina il diritto al compenso. Un preliminare vincolante può integrare la conclusione dell’affare anche prima del rogito.'),
    p('Se l’affare è soggetto a condizione sospensiva, il diritto sorge al suo avveramento; per condizioni risolutive o invalidità si applica l’art. 1757 c.c. La data pattuita per il pagamento non anticipa la maturazione legale del diritto.'),
    field('due','Scadenza concordata dopo la maturazione del diritto e modalità di pagamento tracciabile'),
    field('otherFees','Eventuali servizi o spese separati, importi massimi e autorizzazione espressa; indicare “nessuno” se assenti')),
   block('consumer','04 · Cliente consumatore',
    field('signing','Qualità del cliente e modalità di conclusione: sede, distanza o fuori sede; circostanze effettive'),
    p('Per il consumatore restano le informazioni e le tutele del d.lgs. 206/2005. Nei contratti a distanza o fuori sede si applica il recesso di quattordici giorni, elevato a trenta nei casi previsti di visite non richieste al domicilio o escursioni promozionali. L’omessa informazione comporta la proroga prevista dall’art. 53. Informazioni, istruzioni e modulo di recesso sono consegnati su supporto durevole prima della firma, anche come allegato all’incarico.'),
    p('L’avvio dell’attività durante il termine di recesso richiede una richiesta espressa separata nei casi di legge. L’eventuale importo proporzionale e la perdita del diritto dopo completa esecuzione operano solo con i presupposti degli articoli 57 e 59. La firma di questo accordo non costituisce tale richiesta o rinuncia. Per la conclusione mediante interfaccia online si applica anche l’art. 54-bis.'),
    field('consumerAttachments','Estremi delle informazioni precontrattuali e del modulo di recesso consegnati')),
   block('final','05 · Disposizioni finali',
    p('Il compenso qui concordato riguarda il solo cliente sottoscrittore. Restano gli obblighi di correttezza e informazione del Mediatore. Per il consumatore è competente il giudice del luogo di residenza o domicilio, ove previsto; negli altri casi valgono i criteri legali. I dati sono trattati per esecuzione e obblighi di legge secondo l’informativa GDPR consegnata, senza consenso implicito al marketing.'),field('date','Luogo e data'),signatures('Il cliente','Il Mediatore'))
  );else blocks.push(
   block('document','02 · Documento e soggetto per conto del quale si opera',
    field('id','Documento: tipo, numero, autorità e data di rilascio, scadenza; estremi della copia acquisita'),field('account','Si opera per conto proprio o altrui? Identificare il soggetto e il titolo'),field('beneficial','Titolare/i effettivo/i: generalità, nascita, residenza, codice fiscale e criterio di individuazione'),
    p('Per soggetti diversi dalle persone fisiche indicare assetto proprietario e di controllo e fornire i documenti necessari a individuare il titolare effettivo secondo l’art. 20 del d.lgs. 231/2007. Non è sufficiente indicare automaticamente il rappresentante legale.')),
   block('purpose','03 · Scopo, provenienza e persone politicamente esposte',
    field('purpose','Scopo e natura dell’operazione, attività del cliente, valore e modalità previste di pagamento'),field('funds','Provenienza dei fondi e documenti, nella misura richiesta dalla valutazione del rischio'),field('pep','Condizione di persona politicamente esposta, familiare o soggetto con notori stretti legami: dichiarazione e dettagli pertinenti'),
    p('Il cliente fornisce informazioni complete e aggiornate e comunica le variazioni rilevanti ai sensi dell’art. 22 del d.lgs. 231/2007. La dichiarazione PEP è verificata dal soggetto obbligato e non sostituisce la valutazione prevista dalla legge.')),
   block('statement','04 · Dichiarazioni e protezione dei dati',
    p('Il sottoscrittore dichiara la veridicità delle informazioni e consegna i documenti richiesti. Il presente modulo raccoglie dichiarazioni del cliente: non certifica l’avvenuta adeguata verifica e non esonera il Mediatore dai propri obblighi.'),
    p('I dati necessari agli obblighi antiriciclaggio sono trattati in adempimento di legge, secondo l’informativa GDPR; non occorre consenso per tale finalità. La documentazione soggetta all’art. 31 del d.lgs. 231/2007 è conservata per dieci anni dalla cessazione del rapporto o dall’operazione, con accessi limitati e misure di sicurezza adeguate.'),field('privacy','Informativa consegnata: versione e data'),field('date','Luogo e data'),signatures('Il cliente / esecutore')),
   block('professional','05 · Sezione riservata al Mediatore',
    p('Verificare l’applicabilità e svolgere gli adempimenti prima delle attività per cui sono richiesti. Per l’intermediazione nella locazione, l’art. 3, comma 5, lettera e), d.lgs. 231/2007 contempla operazioni con canone mensile pari o superiore a € 10.000. Restano gli altri presupposti e obblighi applicabili. La presente soglia non sostituisce l’analisi del caso.'),
    field('verification','Addetto, data, modalità di identificazione, fonti e verifiche su cliente, esecutore e titolare effettivo'),field('risk','Riferimento al fascicolo riservato: valutazione del rischio, controlli PEP e approfondimenti'),field('outcome','Esito e adempimenti di controllo costante; eventuali elementi mancanti e azioni conseguenti'),
    p('In caso di impossibilità di completare l’adeguata verifica si applica l’art. 42; gli obblighi di segnalazione e il divieto di comunicazione al cliente seguono gli articoli 35 e 39. Le valutazioni riservate e le eventuali segnalazioni sono gestite nel fascicolo protetto, separatamente dalla copia destinata al cliente.'),signatures('Addetto alla verifica'))
  );
  return h(Layout,{title,icon:h(Icon,{size:20}),clientName:data.name,preview:h(Pages,{blocks,pageStyle:{fontSize:'10pt',lineHeight:'1.38',padding:'12mm 15mm 14mm'}})});
 };
}
