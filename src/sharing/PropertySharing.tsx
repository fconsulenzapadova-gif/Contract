import type {ComponentType, ReactNode} from 'react';
import {CHANNELS, MATERIAL_KINDS, TEXT_FIELDS, normalizeSharingData, createMaterial, updateMaterial} from './model';
import type {SharingData, SharingTextField} from './model';
import {createTextMeasurer, paginateContinuationEntries, continuationPages} from '../purchase/Continuation.js';
import type {ContinuationEntry, ContinuationFragment} from '../purchase/Continuation.js';
import './sharing.css';

type Runtime = typeof import('react');
type DraftHook = <T>(runtime: Runtime, slot: string, initial: T, normalize: (value: unknown) => T) => [T, (value: T | ((previous: T) => T)) => void];
interface LayoutProps {title: string; icon: ReactNode; preview: ReactNode; clientName?: string; editorColumn?: ReactNode}

const fieldLabels: Record<SharingTextField,string> = {name:'Nome e cognome',phone:'Telefono',email:'Email',address:'Indirizzo immobile',reference:'Riferimento immobile',consultant:'Consulente Gemüt',otherChannel:'Altro canale',sharingDate:'Data condivisione o richiesta',placeDate:'Luogo e data della conferma',privacyPlaceDate:'Luogo e data della presa visione privacy'};
const deliveryLabel=(status: string)=>status==='sent'?'Già trasmesso / presentato':status==='pending'?'Da trasmettere dopo la firma':'Da indicare';

/** Uses the existing application's React instance, draft store and PDF layout. */
export function createPropertySharing(React: Runtime, Layout: ComponentType<LayoutProps>, Icon: ComponentType<{size: number}>, useContractDraft: DraftHook, installNativePrint: (root: HTMLElement) => () => void) {
  const SharingPages=({rootRef,children}: {rootRef:import('react').Ref<HTMLDivElement>;children:ReactNode;identityTargets?:unknown[]}) => <div ref={rootRef} className="sharing-pages">{children}</div>;
  return function PropertySharing({closeSidebar}: {closeSidebar: (open: boolean) => void}) {
    const [data, setData] = useContractDraft(React, 'document', normalizeSharingData({}), normalizeSharingData);
    const [expanded, setExpanded] = React.useState<SharingTextField | string | null>(null);
    const [plan,setPlan] = React.useState<{references:Record<string,string>;pages:ContinuationFragment[][]}>({references:{},pages:[]});
    const previewRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (window.innerWidth <= 1100) closeSidebar(false);
    }, [closeSidebar]);
    React.useEffect(() => previewRef.current ? installNativePrint(previewRef.current) : undefined, []);
    React.useLayoutEffect(() => {
      let cancelled=false;
      const calculate=()=>{
        if(cancelled)return;
        const measure=createTextMeasurer(),entries:ContinuationEntry[]=[],references:Record<string,string>={};
        try {
          for(const [index,key] of TEXT_FIELDS.entries()){
            const width=['phone','email','reference','consultant','placeDate','privacyPlaceDate'].includes(key)?240:493;
            if(!data[key]||measure.height(data[key],width,9.2,11.78)<=(key==='address'?24:12))continue;
            const id='A'+(index+1);references[key]=id;
            entries.push({key,id,label:fieldLabels[key],text:data[key],context:'Scheda di condivisione immobiliare · '+(key==='privacyPlaceDate'?'Informativa privacy, pagina 2':'Pagina 1')});
          }
          data.materials.forEach((row,index)=>{
            if(index<3&&measure.height(row.description,248,8.5,10.88)<=22)return;
            const key='material:'+row.id,id='M'+(index+1);references[key]=id;
            entries.push({key,id,label:'Materiale '+(index+1),text:row.description||'Descrizione non indicata.',context:`${row.kind||'Tipo da indicare'} · ${deliveryLabel(row.status)}`});
          });
          setPlan({references,pages:paginateContinuationEntries(entries,measure)});
        } finally {measure.dispose();}
      };
      calculate();document.fonts?.ready.then(calculate);
      return()=>{cancelled=true;};
    },[data]);
    React.useEffect(()=>{
      if(!expanded)return;
      const dialog=document.querySelector<HTMLDialogElement>('.sharing-expanded-editor');dialog?.showModal();dialog?.querySelector('textarea')?.focus();
      return()=>dialog?.close();
    },[expanded]);
    const change = (key: SharingTextField, value: string) => setData(previous => ({...previous, [key]: value}));
    const field = (key: SharingTextField, label: string, type = 'text') => <div className="sharing-editor-field" key={key}>
      <label className="sharing-input-label"><span>{label}</span><textarea name={key} aria-label={label} value={data[key]} rows={2} inputMode={type==='tel'?'tel':type==='email'?'email':'text'}
        onChange={event => change(key, event.target.value)} autoComplete="off" /></label>
      <div className="sharing-field-tools"><small>{data[key].length.toLocaleString('it')} caratteri</small><button type="button" aria-label={`Espandi: ${label}`} onClick={()=>setExpanded(key)}>Espandi campo</button></div>
    </div>;
    const value = (label: string, content: string, key?: SharingTextField) => <div className="sharing-value"><span>{label}</span><div>{key&&plan.references[key]?'['+plan.references[key]+'] · Testo integrale in allegato':content || '\u00a0'}</div></div>;
    const signatures = (privacy = false) => <div className="sharing-signatures">
      {value('Luogo e data', privacy ? data.privacyPlaceDate : data.placeDate, privacy?'privacyPlaceDate':'placeDate')}
      <div className="sharing-value"><span>Firma del destinatario</span><div className="sharing-signature-line">&nbsp;</div></div>
    </div>;
    const page = (number: number, children: ReactNode) => <article className="a4-page sharing-page" aria-label={`Pagina ${number} di ${2+plan.pages.length}`}>
      <header className="sharing-header"><img src="/logo-gemut-2026.png" alt="GEMÜT" /><div>SCHEDA CONDIVISIONE<br />{number} / {String(2+plan.pages.length).padStart(2,'0')}</div></header>
      <div className="sharing-page-body">{children}</div>
      <footer>GEMÜT CAPITAL SRL · Piazzale Mazzini 26, 35137 Padova · P. IVA 05791060287 · REA PD-492863 · info@gemutcapital.com</footer>
    </article>;
    const identityTargets=[{id:'sharing-recipient',label:'Destinatario',fields:{fullName:{value:data.name,label:'Nome e cognome',props:{name:'name',type:'text',onChange:(event:{target:{value:string}})=>change('name',event.target.value)}}}}];
    const preview = <SharingPages rootRef={previewRef} identityTargets={identityTargets}>
      {page(1, <>
        <div className="sharing-eyebrow">INFORMAZIONI E DOCUMENTI IMMOBILIARI</div>
        <h1>Scheda di condivisione immobiliare</h1>
        <p>Questa scheda identifica l’immobile e i materiali condivisi da Gemüt, anche a distanza. Non certifica una visita fisica e non comporta, di per sé, obblighi di acquisto o locazione.</p>
        <section><h2>Il destinatario</h2>{value('Nome e cognome', data.name, 'name')}<div className="sharing-pair">{value('Telefono', data.phone, 'phone')}{value('Email', data.email, 'email')}</div></section>
        <section><h2>L’immobile e il referente</h2>{value('Indirizzo dell’immobile (se comunicato)', data.address, 'address')}<div className="sharing-pair">{value('Riferimento immobile', data.reference, 'reference')}{value('Consulente Gemüt', data.consultant, 'consultant')}</div></section>
        <section><h2>Modalità di condivisione</h2>
          <div className="sharing-channel-list">{CHANNELS.map(channel => <span key={channel}><b aria-hidden="true">{data.channels.includes(channel) ? '☒' : '☐'}</b> {channel}</span>)}</div>
          {data.channels.includes('Altro') && value('Altro canale', data.otherChannel, 'otherChannel')}
          {value('Data della condivisione o della richiesta (se nota)', data.sharingDate, 'sharingDate')}
        </section>
        <section><h2>Materiali oggetto della condivisione</h2>
          <table className="sharing-material-table"><thead><tr><th>Materiale</th><th>File, link, oggetto o descrizione identificativa</th><th>Stato</th></tr></thead>
            <tbody>{data.materials.slice(0,3).map(row => <tr key={row.id}><td>{row.kind || '________________'}</td><td>{plan.references['material:'+row.id]?'['+plan.references['material:'+row.id]+'] · Testo integrale in allegato':row.description || '____________________________'}</td><td>{deliveryLabel(row.status)}</td></tr>)}{data.materials.length>3&&<tr><td colSpan={3}>Altri {data.materials.length-3} materiali: allegati da [M4] a [M{data.materials.length}], con il rispettivo stato.</td></tr>}</tbody>
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
      {continuationPages(React,plan.pages,{kind:'sharing',title:'Scheda di condivisione immobiliare',signatures:['Destinatario']})}
    </SharingPages>;
    const expandedMaterial=expanded?.startsWith('material:')?data.materials.find(row=>'material:'+row.id===expanded):undefined;
    const expandedValue=expandedMaterial?expandedMaterial.description:expanded?data[expanded as SharingTextField]:'';
    const editorColumn=<aside className="sharing-editor" aria-label="Compilazione scheda di condivisione">
        <h1>Scheda di condivisione immobiliare</h1><p>Registra le informazioni condivise, anche a distanza. Compila i campi e controlla l’anteprima prima di salvare il PDF.</p>
        <p className="sharing-hint" aria-live="polite">{2+plan.pages.length} pagine in anteprima. I testi lunghi e gli ulteriori materiali proseguono su allegati numerati, con riferimento al campo e firma.</p>
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
            <label className="sharing-input-label"><span>File, link o descrizione {index + 1}</span><textarea aria-label={`File, link o descrizione ${index + 1}`} value={row.description} rows={4} onChange={event => setData(previous => updateMaterial(previous, row.id, {description: event.target.value}))} /><small>{row.description.length.toLocaleString('it')} caratteri</small></label><button type="button" className="sharing-expand-material" aria-label={`Espandi: materiale ${index+1}`} onClick={()=>setExpanded('material:'+row.id)}>Espandi campo</button>
            <label className="sharing-input-label"><span>Stato materiale {index + 1}</span><select aria-label={`Stato materiale ${index + 1}`} value={row.status} onChange={event => setData(previous => updateMaterial(previous, row.id, {status: event.target.value as SharingData['materials'][number]['status']}))}><option value="">Da indicare</option><option value="sent">Già trasmesso / presentato</option><option value="pending">Da trasmettere dopo la firma</option></select></label>
          </div>)}
          <button type="button" className="btn btn-secondary" onClick={() => setData(previous => ({...previous, materials: [...previous.materials, createMaterial()]}))}>Aggiungi materiale</button>

        </fieldset>
        <fieldset><legend>5. Data e firme</legend>{field('placeDate', 'Luogo e data della conferma')}{field('privacyPlaceDate', 'Luogo e data della presa visione privacy')}<p>Gli spazi per la firma del destinatario sono presenti sulle pagine del modulo e sugli allegati.</p></fieldset>
      </aside>;
    return <div className="sharing-workspace">
      {expanded&&<dialog className="sharing-expanded-editor" aria-labelledby="sharing-expanded-title" onCancel={()=>setExpanded(null)}><h2 id="sharing-expanded-title">{expandedMaterial?'Descrizione materiale':fieldLabels[expanded as SharingTextField]}</h2><textarea aria-label="Testo integrale del campo" rows={16} value={expandedValue} onChange={event=>expandedMaterial?setData(previous=>updateMaterial(previous,expandedMaterial.id,{description:event.target.value})):change(expanded as SharingTextField,event.target.value)} /><p>{expandedValue.length.toLocaleString('it')} caratteri. Testo integrale conservato nella bozza e nel PDF.</p><button type="button" onClick={()=>setExpanded(null)}>Chiudi editor</button></dialog>}
      <div className="sharing-preview"><Layout title="Scheda di condivisione immobiliare" icon={<Icon size={20} />} clientName={data.name} preview={preview} editorColumn={editorColumn} /></div>
    </div>;
  };
}
