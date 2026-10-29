import {useContractDraft} from './ContractDraft.js';
/** Supplemental fields share the paginator's state, including its measuring copy. */
export function useReviewedBlocks(React, blocks) {
  const [values, setValues] = useContractDraft(React,"supplement",{});
  const path = typeof location === 'undefined' ? '' : location.pathname;
  const h = React.createElement;
  const p = text => h('p', null, text);
  const field = (name, label) => h('label', {className:'med-field', key:name},
    h('span',{className:'med-field-label'},label),
    h('textarea',{name,className:'inline-input', value:values[name]||'', 'aria-label':label,
      rows:Math.max(2,Math.ceil((values[name]||'').length/85)),
      onChange:e=>setValues(v=>({...v,[name]:e.target.value}))}));
  const block = (key, title, ...children) => ({key, node:h('section',{className:'med-block review-supplement'},h('h3',null,title),...children)});
  let additions=[];
  if(path==='/purchase-proposal') additions=[
    block('review-property','6) Documentazione e condizioni dell’immobile',
      p('Prima della firma il Venditore completa e sottoscrive le dichiarazioni su titolarità, provenienza, gravami, locazioni, diritti di terzi, situazione edilizia e catastale, impianti e spese condominiali. I documenti esaminati e le verifiche ancora necessarie sono indicati qui sotto; il silenzio non equivale a una dichiarazione di regolarità.'),
      field('documents','Documenti esaminati, APE consegnato e verifiche da completare'),
      field('defects','Gravami, difformità, occupazione, spese e modalità/termine di regolarizzazione')),
    block('review-terms','7) Saldo, consegna e condizioni sospensive',
      field('payments','Importi e scadenze dei pagamenti successivi; saldo al rogito, modalità e consegna'),
      field('conditions','Eventuali condizioni sospensive: evento, termine, importo del mutuo e modalità di comunicazione dell’esito'),
      p('Le condizioni operano solo se espressamente concordate prima della firma. Per immobili da costruire soggetti al d.lgs. 122/2005 occorrono il contenuto e la forma previsti da tale disciplina, con intervento notarile e garanzie obbligatorie: questo modulo generico non li sostituisce. Le spese del definitivo competono all’acquirente, salvo accordo diverso; restano al venditore gli oneri di cancellazione dei propri gravami e gli obblighi pattuiti.'),
      field('acceptanceReceipt','Data, ora e modalità di ricezione dell’accettazione; firma del Proponente per ricevuta')),
  ];
  if(path==='/lease-proposal') additions=[
    block('review-lease','9) Presupposti del contratto e documenti',
      p('La durata, il canone e gli aggiornamenti devono rispettare il tipo contrattuale prescelto. Per il concordato, il transitorio e gli studenti occorrono i requisiti, i modelli e i parametri dell’accordo territoriale applicabile; la mera selezione del tipo non ne prova la sussistenza. La proposta non sostituisce gli adempimenti e le garanzie richiesti per le locazioni a uso diverso dall’abitativo.'),
      field('leaseRequirements','Accordo territoriale, eventuale esigenza transitoria/iscrizione, allegati e condizioni sospensive'),
      field('depositPurpose','Imputazione espressa del deposito, custode e condizioni di restituzione'),
      p('Il locatore mette a disposizione l’APE e le informazioni sugli impianti. Con il contratto scritto saranno consegnati informativa privacy, verbale e inventario quando pertinenti; si procederà alla registrazione nei termini di legge.')),
  ];
  if(path.startsWith('/lease-contract-') && !path.includes('4-4')) {
    additions=[block('review-attachments','Documenti e precisazioni integranti il contratto',
      field('attachments','Elenco degli allegati: APE, inventario/verbale, regolamento, informative e ulteriori documenti'),
      p('Il conduttore dichiara di aver ricevuto le informazioni e la documentazione, comprensiva dell’APE, sulla prestazione energetica dell’immobile, ai sensi dell’art. 6 del d.lgs. 192/2005. Questa dichiarazione va sottoscritta soltanto dopo l’effettiva consegna; l’obbligo di allegazione segue i casi previsti dalla legge.'),
      field('attestation','Accordo territoriale applicato, scheda di calcolo, assistenza / attestazione di rispondenza e relativi estremi'),
      p('Per Padova si applica l’accordo territoriale del 14 febbraio 2023, depositato il 17 febbraio 2023, sino alla sua sostituzione. Il canone e il contenuto normativo devono risultare conformi al modello territoriale; per i contratti non assistiti va acquisita l’attestazione di rispondenza prevista dal D.M. 16 gennaio 2017, anche ai fini delle agevolazioni. La compilazione della scheda non costituisce attestazione.'),
      ...(path.includes('concordato')?[p('La durata iniziale non può essere inferiore a tre anni; la proroga legale alla prima scadenza è di due anni. Il diniego alla prima scadenza è ammesso solo nei casi di legge, con motivazione e almeno sei mesi di preavviso. Alla scadenza successiva si applica la procedura dell’art. 2, comma 5, legge 431/1998.')]:[]),
      ...(path.includes('transitorio')?[p('L’esigenza transitoria deve essere concreta, indicata e, per durate superiori a trenta giorni, documentata in allegato secondo l’accordo. Nei casi che richiedono assistenza bilaterale questa va acquisita prima della stipula. Un campo generico o non compilato non prova la transitorietà. È salvo il recesso per gravi motivi con preavviso legale di sei mesi, o il minore termine pattuito.')]:[]),
      ...(path.includes('students')?[field('studentEvidence','Istituto/corso, Comune della sede, residenza fuori sede e documentazione di iscrizione')]:[]),
      p('Le precisazioni qui riportate integrano le clausole numerate. Nessuna pattuizione o approvazione specifica comporta rinuncia a diritti inderogabili.'),
    )];
  }
  if(!additions.length)return blocks;
  const idx=blocks.findIndex(b=>/signature|acceptance|sign$/.test(b.key));
  const at=idx<0?blocks.length:idx;
  return [...blocks.slice(0,at),...additions,...blocks.slice(at)];
}
