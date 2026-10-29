import {COMPANY} from './CompanyData.js';
import {useOptionalPhysicalRecords} from './OptionalPhysicalRecords.js';
import {usePropertyUnits} from './PropertyUnits.js';
import {recordsUI} from './ContractGlue.js';
import {useContractDraft} from './ContractDraft.js';
/**
 * Editable React component. Dependencies are injected to reuse the exact React,
 * pagination and PDF exporter of the deployed application (no second React).
 * In the original project: createMediationAssignment(React, ContractLayout,
 * PaginatedA4Document, FileSignature) exports a normal React component.
 */
export function createMediationAssignment(React, ContractLayout, PaginatedA4Document, FileSignature) {
  const h = React.createElement;
  const initial = {
    nome: '', nascita: '', dataNascita: '', cf: '', residenza: '', email: '', telefono: '',
    qualita: '', altriConferenti: '',
    agenzia: COMPANY.name, sede: 'Piazzale Mazzini 26, Padova (PD) 35137',
    sedeOperativa: 'Via Savonarola 13, Padova (PD)', piva: '05791060287', camera: 'Padova', rea: 'PD - 492863',
    mediatore: '', polizzaCompagnia: 'Generali Assicurazioni S.P.A. Sede Padova Pedrocchi',
    polizzaNumero: '460051359', polizzaScadenza: '22/06/2027',
    agEmail: COMPANY.email, agPec: COMPANY.pec, agTelefono: COMPANY.phone,
    comune: '', indirizzo: '', uso: '', pertinenze: '', catasto: '', titolo: '',
    occupazione: '', prezzo: '', disponibilita: '', condizioni: '',
    documenti: '', criticita: '', canali: '', limiti: '', report: '',
    dal: '', al: '', esclusiva: '', consumatore: '', stipula: '',
    allegati: '', note: '', luogo: '', dataFirma: '',
  };

  return function MediationAssignment() {
    const [data, setData] = useContractDraft(React,"document",initial);
    const contributors=useOptionalPhysicalRecords(React,"contributors","Conferente aggiuntivo");
    const propertyUnits=usePropertyUnits(React,data,"/sales-assign");
    const change = (name, value) => setData(previous => ({ ...previous, [name]: value }));
    const field = (name, label, width = '100%', type = 'text') => h('label', {
      className: 'med-field', key: name, style: { flexBasis: width },
    }, h('span', { className: 'med-field-label' }, label), h('input', {
      name, type, value: data[name], onChange: event => change(name, event.target.value),
      className: 'inline-input', 'aria-label': label, autoComplete: 'off', }));
    const longField = (name, label) => h('label', { className: 'med-field med-long', key: name },
      h('span', { className: 'med-field-label' }, label), h('textarea', {
        name, value: data[name], onChange: event => change(name, event.target.value),
        className: 'inline-input', 'aria-label': label, rows: Math.max(2, data[name].split('\n').reduce((total, line) => total + Math.max(1, Math.ceil(line.length / 85)), 0)),
      }));
    const row = (...children) => h('div', { className: 'med-fields' }, ...children);
    const p = text => h('p', null, text);
    const block = (key, ...children) => ({ key, keepTogether:key === 'modulo-recesso', node: h('div', { className: 'med-block' }, ...children) });
    const section = (number, title) => h('h2', { className: 'med-section' },
      h('span', null, number), title);
    const choice = (name, value, label) => h('button', {
      type: 'button', role: 'radio', 'aria-checked': data[name] === value,
      onClick: () => change(name, value), className: 'med-choice', key: value,
    }, h('span', { 'aria-hidden': true, className: 'med-check' }, data[name] === value ? '☑' : '☐'), label);
    const choices = (name, label, options) => h('div', {
      className: 'med-choices', role: 'radiogroup', 'aria-label': label,
    }, ...options.map(([value, text]) => choice(name, value, text)));
    const signatures = (labels) => h(React.Fragment,null,...labels.flatMap(label => /Conferent/.test(label) ? [label+' — '+(data.nome||'Nome e cognome: __________________'),...contributors.people.map((person,index)=>'Conferente aggiuntivo '+(index+1)+' — '+(person.nome||'Nome e cognome: __________________'))] : [label]).map((label,index)=>h('div',{className:'contract-individual-signature',key:label+index,style:{minHeight:'16mm',marginTop:'3mm',breakInside:'avoid'}},h('div',{className:'med-signature-line'}),label)));

    const header = h('header', { className: 'med-header' },
      h('img', { src: '/logo.png', alt: 'GEMÜT', className: 'contract-logo', width: 160, height: 58 }),
      h('div', { className: 'med-header-meta' }, 'MEDIAZIONE IMMOBILIARE', h('br'),
        h('span', null, 'Incarico professionale · Modello 09/2026')));

    const blocks = [
      block('title', h('div', { className: 'med-title' },
        h('div', { className: 'med-eyebrow' }, 'CONFERIMENTO DI INCARICO'),
        h('h1', null, 'Incarico di mediazione'),
        p('Ricerca e messa in relazione di potenziali acquirenti'))),

      block('conferente', section('01', 'Il conferente'),
        row(field('nome', 'Nome e cognome / denominazione', '60%'), field('cf', 'Codice fiscale', '35%')),
        row(field('nascita', 'Luogo di nascita', '60%'), field('dataNascita', 'Data di nascita', '35%', 'date')),
        row(field('residenza', 'Residenza / sede e indirizzo')),
        row(field('email', 'E-mail / PEC', '60%', 'email'), field('telefono', 'Telefono', '35%', 'tel')),
        row(field('qualita', 'Qualità e poteri: proprietario, comproprietario o rappresentante')),
        p('Di seguito «Conferente». Chi sottoscrive per altri indica e documenta i propri poteri. Gli ulteriori titolari che conferiscono l’incarico sono identificati e firmano nell’allegato.'),
        longField('altriConferenti', 'Ulteriori conferenti e poteri di rappresentanza / riferimento all’allegato')),

      block('mediatore', section('02', 'Il mediatore'),
        row(field('agenzia', 'Denominazione legale dell’impresa', '60%'), field('piva', 'Codice fiscale / partita IVA', '35%')),
        row(field('sede', 'Sede legale')),
        row(field('sedeOperativa', 'Sede operativa')),
        row(field('camera', 'Registro imprese – Camera di commercio', '60%'), field('rea', 'Numero REA', '35%')),
        row(field('mediatore', 'Agente abilitato che opera per l’impresa')),
        h('div', { className: 'med-insurance' },
          h('div', { className: 'med-insurance-title' }, 'Assicurazione RC professionale'),
          row(field('polizzaCompagnia', 'Compagnia e sede', '48%'),
            field('polizzaNumero', 'N. polizza', '22%'),
            field('polizzaScadenza', 'Scadenza', '22%'))),
        row(field('agEmail', 'E-mail per comunicazioni e recesso', '60%', 'email'), field('agTelefono', 'Telefono dell’impresa', '35%', 'tel')),
        row(field('agPec', 'PEC dell’impresa', '100%', 'email')),
        p('Di seguito «Mediatore», che accetta l’incarico per l’attività di mediazione immobiliare, nel rispetto dei requisiti professionali previsti dalla legge n. 39/1989 e dalla disciplina vigente.')),

      block('oggetto', section('03', 'Oggetto e natura dell’incarico'),
        p('Il Conferente incarica il Mediatore di ricercare e mettere in relazione potenziali acquirenti con il Conferente per favorire la conclusione di un affare relativo all’immobile descritto di seguito, ai sensi degli articoli 1754 e seguenti del codice civile.'),
        p('Il Mediatore svolge la propria attività senza poteri di rappresentanza: non può sottoscrivere proposte, accettazioni o contratti in nome del Conferente, né obbligarlo a trasferire l’immobile. Le decisioni sulle proposte ricevute rimangono al Conferente. Il presente incarico non è una proposta di vendita, un preliminare o un’accettazione preventiva di offerte.')),

      block('immobile', section('04', 'Dati immobile'),
        ...recordsUI(React).propertyBlocks({...propertyUnits,keyPrefix:'property',introText:'L’incarico riguarda',pStyle:{},includeControls:true}).map(block=>block.node),
        row(field('uso', 'Destinazione d’uso')),
        row(field('titolo', 'Titolo di provenienza, titolarità e quota')),
        row(field('occupazione', 'Stato di occupazione e relativo titolo')),
        row(field('prezzo', 'Prezzo concordato di promozione (€)', '45%'), field('disponibilita', 'Disponibilità prevista dell’immobile', '50%')),
        p('Le indicazioni economiche qui riportate riguardano esclusivamente l’immobile. Il prezzo di promozione e le relative modifiche sono concordati per iscritto; non comportano obbligo di accettare offerte o concludere l’affare.'),
        longField('condizioni', 'Condizioni e indicazioni ulteriori sull’immobile')),

      block('attivita', section('05', 'Attività e obblighi del Mediatore'),
        p('Il Mediatore cura la presentazione dell’immobile, la promozione concordata, i contatti con gli interessati, le visite e la tempestiva trasmissione delle proposte. Agisce con correttezza e diligenza professionale, mantenendo informato il Conferente sull’attività svolta.'),
        row(field('report', 'Periodicità degli aggiornamenti concordata')),
        p('Ai sensi dell’articolo 1759 c.c., comunica alle parti le circostanze rilevanti per la valutazione e la sicurezza dell’affare che conosce o deve conoscere usando la diligenza professionale richiesta. Distingue i dati verificati dalle dichiarazioni ricevute e segnala documenti mancanti, criticità e verifiche ancora necessarie.'),
        p('L’attività non sostituisce le prestazioni riservate a tecnici, notai o altri professionisti. Restano integri gli obblighi informativi e le responsabilità del Mediatore; non è garantita la conclusione dell’affare.')),

      block('documentazione', section('06', 'Documentazione e collaborazione'),
        p('Il Conferente fornisce informazioni veritiere e aggiornate e consegna la documentazione disponibile su provenienza, titolarità, catasto, situazione urbanistica ed edilizia, agibilità, prestazione energetica, occupazione e condominio. Comunica vincoli, gravami, controversie, difformità e altre circostanze rilevanti di cui è a conoscenza, nonché le successive variazioni.'),
        longField('documenti', 'Documenti consegnati / da acquisire'),
        longField('criticita', 'Vincoli, gravami, difformità e criticità dichiarate'),
        p('L’assenza di documenti o verifiche non vale come attestazione di conformità. Le visite sono concordate nel rispetto dei diritti degli occupanti. La consegna delle chiavi e le modalità di custodia risultano da un verbale separato.')),

      block('promozione', section('07', 'Promozione dell’immobile'),
        p('Il Conferente autorizza la promozione sui canali concordati e l’impiego di immagini e planimetrie pertinenti delle quali sia legittimo l’utilizzo. Il Mediatore evita la diffusione di dati personali non necessari e inserisce negli annunci le informazioni obbligatorie, comprese quelle energetiche ove dovute.'),
        row(field('canali', 'Canali concordati: sito, portali, vetrina, altri')),
        longField('limiti', 'Limitazioni alla pubblicazione e modalità delle visite'),
        p('Alla cessazione dell’incarico il Mediatore interrompe nuove pubblicazioni e provvede alla rimozione degli annunci sotto il proprio controllo, richiedendola ai portali terzi; restano salvi gli obblighi legali di conservazione.')),

      block('durata', section('08', 'Durata ed esclusiva'),
        row(field('dal', 'Decorrenza', '45%', 'date'), field('al', 'Scadenza', '50%', 'date')),
        p('Alla scadenza l’incarico termina senza rinnovo tacito. Una proroga richiede un accordo scritto. Restano salvi i diritti inderogabili di recesso del consumatore e i rimedi di legge per l’inadempimento.'),
        choices('esclusiva', 'Scelta dell’esclusiva', [['no', 'Senza esclusiva'], ['si', 'Con esclusiva']]),
        p(data.esclusiva === 'si'
          ? 'Per la durata concordata il Conferente non affida ad altri mediatori la medesima attività. Rimane consentita la ricerca diretta di interessati, comunicata tempestivamente al Mediatore per coordinare le attività. L’esclusiva non impone di accettare proposte o concludere l’affare e richiede la specifica approvazione riportata in calce.'
          : 'Il Conferente può incaricare altri mediatori e ricercare direttamente potenziali acquirenti. In assenza di una scelta espressa e della relativa approvazione specifica, l’incarico è senza esclusiva.')),

      block('consumatore', section('09', 'Modalità di conclusione e tutela del consumatore'),
        choices('consumatore', 'Qualità del conferente', [['si', 'Consumatore'], ['no', 'Finalità professionali o imprenditoriali']]),
        choices('stipula', 'Modalità di conclusione', [['sede', 'Nei locali del Mediatore'], ['distanza', 'A distanza'], ['fuori', 'Fuori dei locali'], ['visita', 'Visita non richiesta a domicilio / escursione organizzata']]),
        p('La qualificazione del rapporto dipende dalle circostanze effettive, non dalla sola casella selezionata. Prima della conclusione sono fornite le informazioni precontrattuali dovute; al consumatore è consegnata copia dell’accordo su supporto durevole.'),
        p('Se l’incarico è concluso a distanza o fuori dei locali commerciali e si applica il diritto di recesso, il consumatore può recedere senza motivazione entro 14 giorni dalla conclusione; il termine è di 30 giorni per visite non richieste presso l’abitazione o escursioni organizzate dal professionista nei casi dell’art. 52 del Codice del consumo. Per omessa informazione valgono le estensioni dell’art. 53.'),
        p('È sufficiente inviare entro il termine una dichiarazione esplicita ai recapiti del Mediatore, anche usando il modulo allegato. Qualora la conclusione avvenga mediante un’interfaccia online, il Mediatore rende disponibile anche la funzione di recesso prevista dall’art. 54-bis, con conferma di ricevimento su supporto durevole.')),

      block('avvio', h('h3', { className: 'med-subheading' }, 'Avvio dell’attività durante il periodo di recesso'),
        p('Quando sussiste il diritto di recesso, l’attività inizia dopo la sua scadenza. L’eventuale avvio anticipato richiede una richiesta espressa separata del consumatore su supporto durevole, preceduta dalle informazioni richieste dagli artt. 49–59 del Codice del consumo e sulle conseguenze dell’esecuzione anticipata. La firma di questo incarico non vale come richiesta di avvio anticipato né come rinuncia al recesso.')),

      block('privacy', section('10', 'Dati personali e adempimenti di legge'),
        p('Prima della raccolta dei dati il Mediatore consegna l’informativa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679, secondo il caso. Il trattamento necessario all’incarico e agli obblighi di legge è distinto da eventuali finalità promozionali ulteriori, per le quali il consenso, ove necessario, è separato, facoltativo e revocabile. Questa clausola non sostituisce l’informativa.'),
        p('Le parti collaborano agli adempimenti di identificazione e adeguata verifica previsti dal D.Lgs. 231/2007 quando applicabili, ferme le responsabilità del Mediatore e le regole di riservatezza previste dalla legge.')),

      block('controversie', section('11', 'Comunicazioni e controversie'),
        p('Le comunicazioni sono effettuate ai recapiti indicati dalle parti con modalità idonee a documentarne l’invio e, ove necessario, la ricezione. Le modifiche concordate risultano per iscritto.'),
        p('Si applica la legge italiana. Per il consumatore è competente il giudice individuato dalle norme inderogabili sul foro del consumatore. Negli altri casi valgono gli ordinari criteri di competenza. Restano salve le procedure preliminari eventualmente obbligatorie per la specifica controversia e gli strumenti di risoluzione alternativa concordati dalle parti.')),

      block('note', section('12', 'Condizioni particolari e allegati'),
        longField('note', 'Condizioni particolari concordate'),
        longField('allegati', 'Allegati effettivamente consegnati (identificazione, documenti, privacy, recesso, altri)')),
      block('firme', row(field('luogo', 'Luogo di sottoscrizione', '60%'), field('dataFirma', 'Data di sottoscrizione', '35%', 'date')),
        signatures(['Il Conferente / i Conferenti', 'Il Mediatore per accettazione'])),
    ];

    if (data.esclusiva === 'si') blocks.push(block('firma-esclusiva',
      h('h3', { className: 'med-subheading' }, 'Approvazione specifica dell’esclusiva'),
      p('Ai sensi degli artt. 1341 e 1342 c.c., il Conferente approva specificamente l’art. 8, opzione «Con esclusiva», limitatamente al divieto temporaneo di affidare ad altri mediatori la medesima attività. Restano ferme le tutele inderogabili del consumatore.'),
      signatures(['Il Conferente / i Conferenti'])));

    // Always supply the model: no hidden default can suppress consumer information.
    blocks.push(block('modulo-recesso', section('A', 'Modulo facoltativo di recesso'),
      p('Da utilizzare se si intende recedere nei casi previsti dal Codice del consumo. È ammessa anche qualsiasi altra dichiarazione esplicita.'),
      p(`Destinatario: ${data.agenzia || '____________________'} — ${data.sede || '____________________'}`),
      p(`E-mail: ${data.agEmail || '____________________'} · PEC: ${data.agPec || '____________________'}`),
      p('Con la presente comunico/comunichiamo il recesso dal contratto di mediazione immobiliare concluso il ____________________, relativo all’immobile ________________________________________.'),
      p('Nome del consumatore / dei consumatori: ___________________________________________________'),
      p('Indirizzo del consumatore / dei consumatori: _________________________________________________'),
      p('Data: ____________________'),
      signatures(['Firma del consumatore / dei consumatori (solo per invio cartaceo)'])));

    blocks.push(...contributors.blocks);
    return h('div', { className: 'mediation-document' }, h(ContractLayout, {
      title: 'Incarico di mediazione', icon: h(FileSignature, { size: 20 }), clientName: data.nome,
      headerAside: h('div', { className: 'med-editor-note pdf-hide' },
        'Compenso disciplinato a parte. Completare i dati professionali e consegnare le informative prima della firma.'),
      preview: h(PaginatedA4Document, {
        blocks, pageHeader: header, bottomReservePx: 38,
        pageStyle: { fontSize: '9pt', lineHeight: '1.36', padding: '12mm 15mm 14mm' },
      }),
    }));
  };
}

/** Brand the existing heading without altering the document's field structure. */
export function brandDocumentHeader(React, header) {
  function containsLogo(node) {
    if (!node || typeof node !== 'object') return false;
    if (Array.isArray(node)) return node.some(containsLogo);
    return node.props?.src === '/logo.png' || containsLogo(node.props?.children);
  }
  if (header?.props?.className === 'med-header') return header;
  return React.createElement('header', {className:'gemut-document-heading'},
    !containsLogo(header) && React.createElement('div', {className:'contract-header'},
      React.createElement('img', {src:'/logo.png',alt:'GEMÜT',className:'contract-logo',width:160,height:58})), header);
}
