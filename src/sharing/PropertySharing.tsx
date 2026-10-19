import type {ComponentType, ReactNode} from 'react';
import {CHANNELS, MATERIAL_KINDS, MAX_MATERIALS, FIELD_LIMITS, normalizeSharingData, createMaterial, updateMaterial, contentIssues} from './model';
import type {SharingData} from './model';
import './sharing.css';

type Runtime = typeof import('react');
type DraftHook = <T>(runtime: Runtime, slot: string, initial: T, normalize: (value: unknown) => T) => [T, (value: T | ((previous: T) => T)) => void];
interface LayoutProps {title: string; icon: ReactNode; preview: ReactNode; clientName?: string}

/** Uses the existing application's React instance, draft store and PDF layout. */
export function createPropertySharing(React: Runtime, Layout: ComponentType<LayoutProps>, Icon: ComponentType<{size: number}>, useContractDraft: DraftHook, installNativePrint: (root: HTMLElement) => () => void) {
  return function PropertySharing({closeSidebar}: {closeSidebar: (open: boolean) => void}) {
    const [data, setData] = useContractDraft(React, 'document', normalizeSharingData({}), normalizeSharingData);
    const [tab, setTab] = React.useState<'edit' | 'preview'>('edit');
    const [notice, setNotice] = React.useState('');
    const previewRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (window.innerWidth <= 760) closeSidebar(false);
    }, [closeSidebar]);
    React.useEffect(() => {
      if (!previewRef.current) return;
      const dispose = installNativePrint(previewRef.current);
      const guardNativePrint = () => {
        const copy = document.querySelector<HTMLElement>('.contract-native-print-copy');
        if (!copy) return;
        const overflow = Array.from(copy.querySelectorAll('.sharing-page-body')).some(body => body.scrollHeight > body.clientHeight + 1);
        if (!contentIssues(data).length && !overflow) return;
        const message = document.createElement('p');
        message.className = 'sharing-print-error';
        message.textContent = 'PDF non generato: il contenuto supera i limiti delle due pagine A4. Torna alla scheda, abbrevia i campi o suddividi i materiali prima di stampare.';
        copy.replaceChildren(message);
      };
      window.addEventListener('beforeprint', guardNativePrint);
      return () => { dispose(); window.removeEventListener('beforeprint', guardNativePrint); };
    }, [data]);
    const change = (key: keyof typeof FIELD_LIMITS, value: string) => setData(previous => ({...previous, [key]: value}));
    const issues = contentIssues(data);
    const field = (key: keyof typeof FIELD_LIMITS, label: string, type = 'text') => <label className="sharing-input-label" key={key}>
      <span>{label}</span><input name={key} type={type} value={data[key]} maxLength={FIELD_LIMITS[key]}
        onChange={event => change(key, event.target.value)} autoComplete="off" />
    </label>;
    const value = (label: string, content: string) => <div className="sharing-value"><span>{label}</span><div>{content || '\u00a0'}</div></div>;
    const signatures = (privacy = false) => <div className="sharing-signatures">
      {value('Luogo e data', privacy ? data.privacyPlaceDate : data.placeDate)}
      <div className="sharing-value"><span>Firma del destinatario</span><div className="sharing-signature-line">&nbsp;</div></div>
    </div>;
    const page = (number: number, children: ReactNode) => <article className={`a4-page sharing-page${number === 1 && data.materials.length >= 4 ? ' sharing-compact' : ''}`} aria-label={`Pagina ${number} di 2`}>
      <header className="sharing-header"><img src="/logo-gemut-2026.png" alt="GEMÜT" /><div>SCHEDA CONDIVISIONE<br />{number} / 02</div></header>
      <div className="sharing-page-body">{children}</div>
      <footer>GEMÜT CAPITAL SRL · Piazzale Mazzini 26, 35137 Padova · P. IVA 05791060287 · REA PD-492863 · info@gemutcapital.com</footer>
    </article>;
    const preview = <div ref={previewRef} className="sharing-pages">
      {page(1, <>
        <div className="sharing-eyebrow">INFORMAZIONI E DOCUMENTI IMMOBILIARI</div>
        <h1>Scheda di condivisione immobiliare</h1>
        <p>Questa scheda identifica l’immobile e i materiali condivisi da Gemüt, anche a distanza. Non certifica una visita fisica e non comporta, di per sé, obblighi di acquisto o locazione.</p>
        <section><h2>Il destinatario</h2>{value('Nome e cognome', data.name)}<div className="sharing-pair">{value('Telefono', data.phone)}{value('Email', data.email)}</div></section>
        <section><h2>L’immobile e il referente</h2>{value('Indirizzo dell’immobile (se comunicato)', data.address)}<div className="sharing-pair">{value('Riferimento immobile', data.reference)}{value('Consulente Gemüt', data.consultant)}</div></section>
        <section><h2>Modalità di condivisione</h2>
          <div className="sharing-channel-list">{CHANNELS.map(channel => <span key={channel}><b aria-hidden="true">{data.channels.includes(channel) ? '☒' : '☐'}</b> {channel}</span>)}</div>
          {data.channels.includes('Altro') && value('Altro canale', data.otherChannel)}
          {value('Data della condivisione o della richiesta (se nota)', data.sharingDate)}
        </section>
        <section><h2>Materiali oggetto della condivisione</h2>
          <table className="sharing-material-table"><thead><tr><th>Materiale</th><th>File, link, oggetto o descrizione identificativa</th><th>Stato</th></tr></thead>
            <tbody>{data.materials.map(row => <tr key={row.id}><td>{row.kind || '________________'}</td><td>{row.description || '____________________________'}</td><td>{row.status === 'sent' ? 'Già trasmesso / presentato' : row.status === 'pending' ? 'Da trasmettere dopo la firma' : 'Da indicare'}</td></tr>)}</tbody>
          </table>
          <p className="sharing-note">Lo stato è indicato per ciascun materiale. I documenti da inviare successivamente non sono dichiarati ricevuti o visionati.</p>
        </section>
        <section><h2>Conferma e condizioni di utilizzo</h2>
          <p>Con la firma prendo atto che i materiali sopra identificati sono stati o saranno resi disponibili da Gemüt Capital Srl, secondo lo stato indicato per ciascuno. Solo per quelli indicati come già trasmessi o presentati confermo la relativa ricezione o presa visione. I materiali sono destinati alla valutazione riservata dell’immobile; mi impegno a non diffonderli pubblicamente, ferma la possibilità di consultarli con i miei professionisti di fiducia.</p>
          <p>La sottoscrizione non costituisce proposta, incarico di mediazione o conferma di visita, né genera di per sé provvigioni; restano fermi gli eventuali diritti derivanti dalla legge o da distinti accordi.</p>
          {signatures()}
        </section>
      </>)}
      {page(2, <>
        <div className="sharing-eyebrow">TRATTAMENTO DEI DATI PERSONALI</div><h1>Informativa sulla privacy</h1>
        <p>I tuoi dati sono utilizzati per identificare il contatto, condividere informazioni e documenti immobiliari e dare seguito alla richiesta.</p>
        <section><h2>Titolare del trattamento</h2><p>Il titolare è GEMÜT CAPITAL SRL, Piazzale Mazzini 26, 35137 Padova, P. IVA 05791060287. Per informazioni e per esercitare i diritti puoi scrivere a info@gemutcapital.com.</p></section>
        <section><h2>Dati, finalità e basi giuridiche</h2><p>Trattiamo nome, recapiti, immobile di interesse, informazioni richieste, materiali condivisi, modalità e data dei contatti, firma ed eventuali evidenze dell’invio o della sottoscrizione elettronica. I dati servono a gestire le richieste e a trasmettere o presentare la documentazione (art. 6, par. 1, lett. b, GDPR, quando il trattamento è necessario per misure precontrattuali richieste dall’interessato); a documentare i contatti, la provenienza delle informazioni e tutelare eventuali diritti (lett. f, legittimo interesse del titolare); ove applicabile, ad adempiere obblighi di legge (lett. c). Questa scheda non autorizza l’invio di comunicazioni commerciali non richieste.</p></section>
        <section><h2>Conferimento, destinatari e conservazione</h2>
          <p>Il nome e almeno un recapito sono necessari per gestire la richiesta e inviare i materiali: senza tali informazioni potremmo non poter procedere. I dati possono essere trattati da personale autorizzato, fornitori informatici e gestori degli strumenti di firma o comunicazione, professionisti e, ove pertinente alla richiesta, proprietari o loro rappresentanti. Non sono diffusi pubblicamente.</p>
          <p>I dati sono conservati per il tempo necessario a gestire la richiesta e documentare i contatti; successivamente, solo ove necessario per obblighi di legge o per la tutela di diritti, entro i termini di prescrizione applicabili e fino all’eventuale definizione delle controversie. Gli eventuali trasferimenti fuori dallo Spazio economico europeo sono effettuati nel rispetto delle garanzie previste dal GDPR, mediante decisioni di adeguatezza o garanzie appropriate, quali clausole contrattuali standard; copia delle garanzie applicabili può essere richiesta al titolare.</p>
        </section>
        <section><h2>I tuoi diritti</h2><p>Puoi chiedere accesso, rettifica, cancellazione, limitazione e, nei casi previsti, portabilità; puoi opporti al trattamento basato sul legittimo interesse. Hai il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it). Questa scheda non comporta decisioni basate esclusivamente su trattamenti automatizzati.</p></section>
        <section><h2>Presa visione dell’informativa</h2><p>Con la firma dichiaro di avere ricevuto e potuto consultare questa informativa. La firma attesta esclusivamente la presa visione e non equivale al consenso per attività promozionali.</p>{signatures(true)}</section>
      </>)}
    </div>;
    return <div className={`sharing-workspace sharing-tab-${tab}`} onClickCapture={event => {
      const target = event.target as HTMLElement;
      if (!target.closest('button')?.textContent?.includes('Salva PDF')) return;
      const overflow = Array.from(previewRef.current?.querySelectorAll('.sharing-page-body') || []).some(body => body.scrollHeight > body.clientHeight + 1);
      if (issues.length || overflow) {
        event.preventDefault(); event.stopPropagation(); setTab('edit');
        setNotice(issues.join(' ') || 'Il contenuto supera le due pagine A4: abbrevia i campi o suddividi i materiali in più schede prima di salvare il PDF.');
      }
    }}>
      <button type="button" className="sharing-menu-close" aria-label="Chiudi menu laterale" onClick={() => closeSidebar(false)}>×</button>
      <div className="sharing-mobile-tabs" role="group" aria-label="Visualizzazione scheda">
        <button type="button" aria-pressed={tab === 'edit'} onClick={() => setTab('edit')}>Compila</button>
        <button type="button" aria-pressed={tab === 'preview'} onClick={() => setTab('preview')}>Anteprima</button>
      </div>
      <aside className="sharing-editor" aria-label="Compilazione scheda di condivisione">
        <h1>Scheda di condivisione immobiliare</h1><p>Registra le informazioni condivise, anche a distanza. Compila i campi e controlla l’anteprima prima di salvare il PDF.</p>
        {notice && <p role="alert" className="sharing-alert">{notice}</p>}
        {issues.length > 0 && <p role="alert" className="sharing-alert">{issues.join(' ')}</p>}
        <fieldset><legend>1. Destinatario</legend>{field('name', 'Nome e cognome')}{field('phone', 'Telefono', 'tel')}{field('email', 'Email', 'email')}</fieldset>
        <fieldset><legend>2. Immobile e referente</legend>{field('address', 'Indirizzo immobile (se comunicato)')}{field('reference', 'Riferimento immobile')}{field('consultant', 'Consulente Gemüt')}</fieldset>
        <fieldset><legend>3. Modalità di condivisione</legend><p>Seleziona uno o più canali.</p>
          {CHANNELS.map(channel => <label className="sharing-check-label" key={channel}><input type="checkbox" checked={data.channels.includes(channel)} onChange={() => setData(previous => ({...previous, channels: previous.channels.includes(channel) ? previous.channels.filter(value => value !== channel) : [...previous.channels, channel]}))} />{channel}</label>)}
          {data.channels.includes('Altro') && field('otherChannel', 'Specifica altro canale')}{field('sharingDate', 'Data condivisione o richiesta (se nota)')}
        </fieldset>
        <fieldset><legend>4. Materiali condivisi</legend><p>Identifica ciascun file o link e indica se è già trasmesso oppure da inviare dopo la firma.</p>
          {data.materials.map((row, index) => <div className="sharing-material-editor" key={row.id}>
            <div className="sharing-row-heading"><strong>Materiale {index + 1}</strong><button type="button" aria-label={`Rimuovi materiale ${index + 1}`} disabled={data.materials.length === 1} onClick={() => setData(previous => ({...previous, materials: previous.materials.filter(value => value.id !== row.id)}))}>Rimuovi</button></div>
            <label className="sharing-input-label"><span>Tipo di materiale {index + 1}</span><select aria-label={`Tipo di materiale ${index + 1}`} value={row.kind} onChange={event => setData(previous => updateMaterial(previous, row.id, {kind: event.target.value}))}><option value="">Seleziona</option>{MATERIAL_KINDS.map(kind => <option key={kind}>{kind}</option>)}</select></label>
            <label className="sharing-input-label"><span>File, link o descrizione {index + 1}</span><textarea aria-label={`File, link o descrizione ${index + 1}`} value={row.description} rows={3} maxLength={160} onChange={event => setData(previous => updateMaterial(previous, row.id, {description: event.target.value}))} /><small>{row.description.length}/160 caratteri</small></label>
            <label className="sharing-input-label"><span>Stato materiale {index + 1}</span><select aria-label={`Stato materiale ${index + 1}`} value={row.status} onChange={event => setData(previous => updateMaterial(previous, row.id, {status: event.target.value as SharingData['materials'][number]['status']}))}><option value="">Da indicare</option><option value="sent">Già trasmesso / presentato</option><option value="pending">Da trasmettere dopo la firma</option></select></label>
          </div>)}
          <button type="button" className="btn btn-secondary" disabled={data.materials.length >= MAX_MATERIALS} onClick={() => setData(previous => ({...previous, materials: [...previous.materials, createMaterial()]}))}>Aggiungi materiale</button>
          <p className="sharing-hint">Massimo {MAX_MATERIALS} materiali per mantenere la scheda in due pagine A4. Per ulteriori documenti, compila una seconda scheda.</p>
        </fieldset>
        <fieldset><legend>5. Data e firme</legend>{field('placeDate', 'Luogo e data della conferma')}{field('privacyPlaceDate', 'Luogo e data della presa visione privacy')}<p>Gli spazi per la firma del destinatario sono presenti su entrambe le pagine del PDF.</p></fieldset>
        <button type="button" className="btn btn-primary sharing-show-preview" onClick={() => setTab('preview')}>Controlla anteprima</button>
      </aside>
      <div className="sharing-preview"><Layout title="Scheda di condivisione immobiliare" icon={<Icon size={20} />} clientName={data.name} preview={preview} /></div>
    </div>;
  };
}
