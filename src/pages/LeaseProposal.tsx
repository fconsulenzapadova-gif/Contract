import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const LeaseProposal: React.FC = () => {
  const [data, setData] = useState({
    // LOCATORE (Destinatario)
    locNome: '', loc2Nome: '',
    locCF: '', loc2CF: '',
    locIndirizzo: '', locCivico: '', locCitta: '',

    // SOTTOSCRITTI / PROPONENTE
    s1Nome: '', s1CF: '',
    s1NatoA: '', s1Prov: '', s1NatoIl: '', s1DocIdentita: '',
    s2Nome: '', s2CF: '',
    s2NatoA: '', s2Prov: '', s2NatoIl: '', s2DocIdentita: '',
    domiciliatoA: '', domProv: '', domVia: '', domCivico: '',

    // IN QUALITA' DI
    qualita: '', dellaSocieta: '',
    sedeLegaleVia: '', sedeLegaleCivico: '', sedePartIva: '',
    tel: '', cell: '', fax: '', email: '',

    // AGENZIA CONSULENTE
    agNome: '',

    // IMMOBILE - UBICAZIONE
    immUbicazione: '',
    immComposizione: '',

    // DATI CATASTALI
    foglio: '', part: '', sub: '', zc: '', cat: '', classe: '', consVani: '', rendita: '',

    // IDENTIFICATIVI CATASTALI
    idCatastali: '',
    proprieta: '',

    // PROVENIENZA
    attoProvenienza: '',

    // DESTINAZIONE USO
    destinazioneUso: 'Residenziale/abitativo',
    catCatastale: '',

    // SITUAZIONE CATASTALE
    situazioneCatastale: 'in_ordine',
    intestazioneAllineata: 'allineato',
    planimetria: 'conforme',
    certificatoAgibilita: 'dotato',

    // REGIME EDILIZIO
    regimeEdilizio: 'privata_libera',
    situazioneEdilizia: 'prima_1967',
    titoloEdilizioComune: '', titoloEdilizioData: '', titoloEdilizioN: '',
    titoliSuccessivi: '',

    // GRAVAMI
    gravami: 'NULLA',

    // PROPONENTE (locatario - pagina 2)
    p1Nome: '', p1NatoA: '', p1NatoIl: '', p1ResidenteA: '', p1Via: '', p1Civico: '', p1Tel: '', p1CF: '', p1Email: '',
    p1Qualita: '', p1Societa: '', p1PIVA: '', p1Sede: '',
    p2Nome: '', p2NatoA: '', p2NatoIl: '', p2ResidenteA: '', p2Via: '', p2Civico: '', p2Tel: '', p2CF: '', p2Email: '',

    // AGENZIA
    agSede: '', agVia: '', agCivico: '', agCF: '', agPIVA: '', agCciaa: '', agRea: '', agPec: '',

    // DICHIARAZIONI LOCATORE
    confUrbanistica: '',
    statoImpianti: 'a_norma', impiantiAdeguareDa: '',
    confApe: '',
    speseCondominiali: '', speseRiscaldamento: '', riscRate: '', riscImpianto: '',

    // CANONE
    canoneAnnuo: '', canoneNumRate: '', canoneRata: '',
    soggettoIva: 'no', ivaAliquota: '22',
    aggiornamentoIstat: '100',

    // CAUZIONE
    cauzioneImporto: '', cauzioneMesi: '', cauzioneMezzo: '',

    // ONERI
    oneriTipo: 'richiesta', oneriForfaitAnnui: '', oneriForfaitRate: '', oneriForfaitImportoRata: '',
    oneriConguaglio: 'acconto',

    // PATTI
    attivitaX: '', contattoPubblico: 'no', pattiExtra: '',

    // DURATA
    tipoContratto: '3.1', sottoTipo31: '6+6', mesiTransitorio31: '',
    sottoTipo32: '4+4', usoTransitorio32: '', altro32: '',
    durataAnniMesi: '', decorrenzaDal: '', decorrenzaAl: '',

    // DEPOSITO FIDUCIARIO
    depositoImporto: '',
    depositoMezzo: 'assegno', depositoAssegno: '', depositoBanca: '', depositoAgenzia: '', depositoAltro: '',

    // CONSEGNA E FINALI
    dataConsegna: '', dataDecorrenzaEffettiva: '', dataSottoscrizione: '',
    giorniIrrevocabile: '', dataIrrevocabile: '',
    provvigione: '',
    note: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setData(prev => ({ ...prev, [name]: checked }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const inp = (name: keyof typeof data, width: string = '120px', type: string = 'text') => (
    <input type={type} name={name} value={data[name] as string} onChange={handleChange} className="inline-input" style={{ width, maxWidth: '100%' }} />
  );

  const inpFull = (name: keyof typeof data, type: string = 'text') => (
    <input type={type} name={name} value={data[name] as string} onChange={handleChange} className="inline-input" style={{ width: '100%', display: 'block', marginTop: '2px' }} />
  );

  const row = (children: React.ReactNode) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 4px', marginBottom: '0.15rem' }}>
      {children}
    </div>
  );

  const chk = (field: keyof typeof data, val: string, label: string) => (
    <span>
      <span className="inline-checkbox" onClick={() => setData(prev => ({ ...prev, [field]: val }))}>
        {data[field] === val ? '☑' : '☐'}
      </span>
      {' '}{label}
    </span>
  );

  const renderPreview = () => (
    <>
      {/* ===== PAGINA 1 ===== */}
      <div className="a4-page" style={{ fontSize: '9.2pt', lineHeight: '1.5' }}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>

        {/* BARRA TITOLO */}
        <div style={{
          background: '#4a4a4a',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '10pt',
          padding: '4px 8px',
          marginBottom: '6px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          Proposta di Locazione Immobiliare
        </div>

        {/* BOX LOCATORE */}
        <div style={{ border: '1px solid #000', marginBottom: '8px', padding: '3px 6px' }}>
          {row(<>
            <span>Destinatari (<strong>LOCATORE</strong>):</span>
            <strong>{inp('locNome', '160px')}</strong>
            <span>e</span>
            <strong>{inp('loc2Nome', '155px')}</strong>
          </>)}
          {row(<>
            <span>C.F.</span><strong>{inp('locCF', '160px')}</strong>
            <span style={{ marginLeft: '1.5rem' }}>C.F.</span><strong>{inp('loc2CF', '160px')}</strong>
          </>)}
          {row(<>
            <span>Indirizzo</span><strong>{inp('locIndirizzo', '185px')}</strong>
            <span>n.</span><strong>{inp('locCivico', '30px')}</strong>
            <span style={{ marginLeft: '0.5rem' }}>Città</span><strong>{inp('locCitta', '130px')}</strong>
          </>)}
        </div>

        {/* SEZIONE SOTTOSCRITTI (PROPONENTE) */}
        {row(<>
          <span>Il.... sottoscritto..</span>
          <strong>{inp('s1Nome', '185px')}</strong>
          <span>e</span>
          {inp('s2Nome', '155px')}
        </>)}
        {row(<>
          <span>Cod. Fisc.</span><strong>{inp('s1CF', '155px')}</strong>
          <span style={{ marginLeft: '1.5rem' }}>Cod. Fisc.</span>{inp('s2CF', '155px')}
        </>)}
        {row(<>
          <span>nato/a a</span>
          <strong>{inp('s1NatoA', '130px')}</strong>
          <span>(</span>{inp('s1Prov', '26px')}<span>) il</span>
          <strong>{inp('s1NatoIl', '108px', 'date')}</strong>
          <span>doc. identità</span><strong>{inp('s1DocIdentita', '100px')}</strong>
        </>)}
        {row(<>
          <span>nato/a a</span>
          {inp('s2NatoA', '130px')}
          <span>(</span>{inp('s2Prov', '26px')}<span>) il</span>
          {inp('s2NatoIl', '108px', 'date')}
          <span>doc. identità</span>{inp('s2DocIdentita', '100px')}
        </>)}
        {row(<>
          <span>domiciliato.......</span>
          <span>in</span><strong>{inp('domiciliatoA', '120px')}</strong>
          <span>(</span>{inp('domProv', '26px')}<span>)</span>
          <span>via</span><strong>{inp('domVia', '140px')}</strong>
          <span>n.</span><strong>{inp('domCivico', '30px')}</strong>
        </>)}
        {row(<>
          <span>in qualità di</span>{inp('qualita', '135px')}
          <span>della</span>{inp('dellaSocieta', '200px')}
        </>)}
        {row(<>
          <span>con sede in</span>{inp('sedeLegaleVia', '135px')}
          <span>via</span>{inp('sedeLegaleCivico', '135px')}
          <span>n.</span>{inp('sedeLegaleCivico', '30px')}
          <span>Part. Iva</span>{inp('sedePartIva', '105px')}
        </>)}
        <div style={{ marginBottom: '0.4rem' }}>
          {row(<>
            <span>tel.</span>{inp('tel', '78px')}
            <span>cell.</span>{inp('cell', '88px')}
            <span>fax</span>{inp('fax', '78px')}
            <span>e-mail</span>{inp('email', '155px')}
          </>)}
        </div>

        <p style={{ textAlign: 'center', marginBottom: '0.4rem' }}>
          in seguito denominato.......... <strong>"PROPONENTE"</strong>,
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          in piena proprietà {inp('proprieta', '160px')} &nbsp; in proprietà superficiaria {inp('attoProvenienza', '120px')}
        </p>
        <p style={{ marginBottom: '0.6rem' }}>
          tramite la ditta/società: {inp('agNome', '220px')} regolarmente iscritta presso: in seguito denominata "Consulente IMMOBILIARE"
        </p>

        <p style={{ marginBottom: '0.15rem' }}>E</p>

        <p style={{ marginBottom: '0.6rem', marginTop: '0.3rem' }}>
          <strong>PROPON............. IRREVOCABILMENTE DI CONDURRE IN LOCAZIONE</strong>
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          l'immobile sottodescritto, alle condizioni di seguito indicate:
        </p>

        {/* 1) DESCRIZIONE E STATO DELL'IMMOBILE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>
          1) DESCRIZIONE E STATO DELL'IMMOBILE
        </h3>
        <p style={{ marginBottom: '0.15rem' }}>
          IL LOCATORE dichiara e garantisce che l'Immobile sotto descritto si trova nel seguente stato:
        </p>

        <div style={{ marginBottom: '0.15rem' }}><span>a) Ubicazione: </span>{inpFull('immUbicazione')}</div>
        <div style={{ marginBottom: '0.15rem' }}><span>b) Composizione: </span>{inpFull('immComposizione')}</div>
        <div style={{ marginBottom: '0.15rem', fontWeight: 'bold' }}>
          {row(<><span>Foglio</span>{inp('foglio', '38px')}<span>, Part.</span>{inp('part', '38px')}<span>, Sub</span>{inp('sub', '38px')}<span>Z.C.</span>{inp('zc', '28px')}<span>Cat.</span>{inp('cat', '38px')}<span>Classe</span>{inp('classe', '38px')}<span>cons. vani</span>{inp('consVani', '38px')}<span>rendita</span>{inp('rendita', '55px')}<span>per l'appartamento.</span></>)}
        </div>
        <div style={{ marginBottom: '0.15rem' }}><span>c) Identificativi catastali: </span>{inpFull('idCatastali')}</div>
        <div style={{ marginBottom: '0.15rem' }}><span>d) Proprietà: </span>{inpFull('proprieta')}</div>

        <p style={{ marginBottom: '0.15rem', fontWeight: 'bold' }}>Compravendita</p>
        <div style={{ marginBottom: '0.15rem' }}><span>e) Atto di provenienza: </span>{inpFull('attoProvenienza')}</div>

        <p style={{ marginBottom: '0.15rem', fontWeight: 'bold' }}>Residenziale/abitativo</p>
        <p style={{ marginBottom: '0.15rem' }}>f) Destinazione d'uso: {inp('destinazioneUso', '220px')}</p>

        <p style={{ marginBottom: '0.15rem', fontWeight: 'bold' }}>A3</p>
        <div style={{ marginBottom: '0.4rem' }}><span>Categoria catastale: </span>{inpFull('catCatastale')}</div>

        <p style={{ marginBottom: '0.15rem' }}>•</p>
        <p style={{ marginBottom: '0.15rem' }}>
          g) Situazione Catastale: in ordine alla intestazione &nbsp;
          {chk('intestazioneAllineata', 'allineato', 'allineato')} &nbsp;&nbsp;
          {chk('intestazioneAllineata', 'non_allineato', 'non allineato')}
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          In ordine alla planimetria e ai dati catastali &nbsp;
          {chk('planimetria', 'conforme', 'conforme')} &nbsp;&nbsp;
          {chk('planimetria', 'non_conforme', 'non conforme')} &nbsp;&nbsp;
          {chk('planimetria', 'assente', 'assente')} &nbsp;&nbsp;
          {chk('planimetria', 'da_verificare', 'da verificare')}
        </p>
        <p style={{ marginBottom: '0.15rem' }}>•</p>
        <p style={{ marginBottom: '0.4rem' }}>
          h) Certificato di agibilità: &nbsp;
          {chk('certificatoAgibilita', 'dotato', 'dotato')} &nbsp;&nbsp;
          {chk('certificatoAgibilita', 'non_dotato', 'non dotato')} &nbsp;&nbsp;
          {chk('certificatoAgibilita', 'assente', 'assente')} &nbsp;&nbsp;
          {chk('certificatoAgibilita', 'rintracciabile', 'non rintracciabile')}.
        </p>

        <p style={{ marginBottom: '0.15rem' }}>i) Regime edilizio:</p>
        <p style={{ marginBottom: '0.15rem' }}>
          &nbsp;&nbsp;{chk('regimeEdilizio', 'privata_libera', 'edificato in edilizia privata/libera')}
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          &nbsp;&nbsp;{chk('regimeEdilizio', 'convenzionata', 'edificato in edilizia convenzionata')} su terreno in: l) Situazione Edilizio Urbanistica: l'immobile risulta essere stato edificato:
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          &nbsp;&nbsp;{chk('situazioneEdilizia', 'prima_1967', 'prima del 01.09.1967')}
        </p>
        <div style={{ marginBottom: '0.15rem' }}>
          {row(<><span>in virtù del titolo edilizio abilitativo presentato/rilasciato dal Comune di</span>{inp('titoloEdilizioComune', '130px')}<span>(</span>{inp('domCivico', '28px')}<span>), n.</span>{inp('titoloEdilizioN', '55px')}<span>in data</span>{inp('titoloEdilizioData', '120px', 'date')}<span>;</span></>)}
        </div>
        <p style={{ marginBottom: '0.15rem' }}>Successivamente alla costruzione risultano presentate/rilasciate:</p>
        <div style={{ marginBottom: '0.8rem' }}>
          <textarea name="titoliSuccessivi" value={data.titoliSuccessivi} onChange={handleChange}
            className="inline-input" style={{ width: '100%', height: '50px', resize: 'none', verticalAlign: 'top', display: 'block' }} />
        </div>

        <p style={{ marginBottom: '0.15rem' }}>
          Libero da ipoteche, pignoramenti e/o altri pregiudizi ad eccezione di
        </p>
        <p style={{ marginBottom: '0.15rem' }}>m) •</p>
        <div style={{ marginBottom: '0.15rem', fontWeight: 'bold' }}>{inpFull('gravami')}</div>
      </div>

      {/* ===== PAGINA 2 ===== */}
      <div className="a4-page" style={{ fontSize: '9.2pt', lineHeight: '1.5' }}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>

        {/* PROPONENTE (CONDUTTORE) - pagina 2 ripete i dati del proponente per le firme */}
        {row(<><span>Spett.le / Egr. Sig.</span>{inp('p1Nome', '220px')}<span>il</span>{inp('p1NatoIl', '130px', 'date')}</>)}
        {row(<><span>residente a</span>{inp('p1ResidenteA', '170px')}<span>via</span>{inp('p1Via', '150px')}<span>n°</span>{inp('p1Civico', '30px')}</>)}
        {row(<><span>tel.</span>{inp('p1Tel', '90px')}<span>C.F.</span>{inp('p1CF', '170px')}</>)}
        {row(<><span>e-mail / PEC</span>{inp('p1Email', '280px')}</>)}
        {row(<><span>in qualità di</span>{inp('p1Qualita', '120px')}<span>della</span>{inp('p1Societa', '220px')}</>)}
        {row(<><span>P.IVA</span>{inp('p1PIVA', '120px')}<span>Sede legale</span>{inp('p1Sede', '220px')}</>)}

        {data.p2Nome && (
          <div style={{ marginTop: '0.5rem' }}>
            {row(<>{inp('p2Nome', '220px')}<span>il</span>{inp('p2NatoIl', '130px', 'date')}</>)}
            {row(<><span>residente a</span>{inp('p2ResidenteA', '170px')}<span>via</span>{inp('p2Via', '150px')}<span>n°</span>{inp('p2Civico', '30px')}</>)}
            {row(<><span>tel.</span>{inp('p2Tel', '90px')}<span>C.F.</span>{inp('p2CF', '170px')}</>)}
            {row(<><span>e-mail / PEC</span>{inp('p2Email', '280px')}</>)}
          </div>
        )}

        <div style={{ marginTop: '0.5rem' }}>
          {row(<><span>in seguito "Proponente" tramite l'Agenzia di mediazione Immobiliare</span>{inp('agNome', '200px')}</>)}
          {row(<><span>con sede in</span>{inp('agSede', '150px')}<span>via</span>{inp('agVia', '150px')}<span>n°</span>{inp('agCivico', '30px')}</>)}
          {row(<><span>C.F.</span>{inp('agCF', '90px')}<span>P.IVA</span>{inp('agPIVA', '90px')}</>)}
          {row(<><span>iscritta alla CCIAA di</span>{inp('agCciaa', '110px')}<span>REA n°</span>{inp('agRea', '80px')}<span>PEC</span>{inp('agPec', '170px')}</>)}
        </div>
        <p style={{ marginBottom: '1rem' }}>in seguito denominata "Agenzia Immobiliare";</p>

        <p style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>
          PROMETTE IRREVOCABILMENTE DI CONDURRE IN LOCAZIONE<br />
          a corpo e non a misura, l'immobile sotto descritto, alle condizioni di seguito indicate.
        </p>

        {/* 1.a) DICHIARAZIONI LOCATORE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>1.a) DICHIARAZIONI DEL LOCATORE</h3>
        <p style={{ marginBottom: '0.15rem' }}>
          Il Locatore ha dichiarato all'Agenzia Immobiliare che: con riguardo alla conformità dell'immobile alle norme edilizie e urbanistiche per la destinazione d'uso sopra indicata: {inp('confUrbanistica', '180px')}
        </p>
        <p style={{ marginBottom: '0.15rem' }}>con riguardo alla conformità degli impianti alle normative vigenti:</p>
        <p style={{ marginBottom: '0.15rem' }}>
          {chk('statoImpianti', 'a_norma', 'a norma e dotati dei relativi certificati di conformità')}
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          {chk('statoImpianti', 'da_adeguare', 'non a norma e da adeguare a regola d\'arte a cura e spese del')}
          {' '}{inp('impiantiAdeguareDa', '90px')} con produzione dei relativi certificati di conformità
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          con riguardo all'APE (Attestato di Prestazione Energetica): {inp('confApe', '240px')}
        </p>
        <p style={{ marginBottom: '0.15rem' }}>con riguardo alle spese condominiali:</p>
        <p style={{ marginBottom: '0.15rem' }}>
          • spese gestione ordinaria circa € {inp('speseCondominiali', '60px')} annui come da ultimo consuntivo;
        </p>
        <p style={{ marginBottom: '0.8rem' }}>
          • spese di riscaldamento: circa € {inp('speseRiscaldamento', '60px')} annui come da ultimo consuntivo, da pagarsi in/ogni {inp('riscRate', '60px')} l'impianto di riscaldamento è {inp('riscImpianto', '120px')} e con l'accettazione della presente proposta conferma integralmente dette dichiarazioni.
        </p>
      </div>

      {/* ===== PAGINA 3 ===== */}
      <div className="a4-page" style={{ fontSize: '9.2pt', lineHeight: '1.5' }}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>

        {/* 2) CANONE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>2) CANONE DI LOCAZIONE OFFERTO</h3>
        <p style={{ marginBottom: '0.15rem' }}>
          € {inp('canoneAnnuo', '60px')} annui oltre oneri accessori, da pagarsi in {inp('canoneNumRate', '18px')} uguali rate anticipate di € {inp('canoneRata', '60px')} ciascuna.
        </p>
        <p style={{ marginBottom: '0.8rem' }}>
          Il canone&nbsp;
          <span className="inline-checkbox" onClick={() => setData({ ...data, soggettoIva: 'si' })}>
            {data.soggettoIva === 'si' ? '☑' : '☐'}
          </span> sarà &nbsp;
          <span className="inline-checkbox" onClick={() => setData({ ...data, soggettoIva: 'no' })}>
            {data.soggettoIva === 'no' ? '☑' : '☐'}
          </span> non sarà assoggettato ad Iva. In caso positivo, l'Iva sarà applicata all'aliquota di legge, attualmente del {inp('ivaAliquota', '18px')}%
        </p>

        <p style={{ marginBottom: '0.15rem' }}><strong>a) AGGIORNAMENTO DEL CANONE</strong></p>
        <p style={{ marginBottom: '0.8rem' }}>
          Il canone sarà aggiornato annualmente nella misura del {inp('aggiornamentoIstat', '18px')}% della variazione dell'indice ISTAT FOI.
        </p>

        <p style={{ marginBottom: '0.15rem' }}><strong>b) DEPOSITO CAUZIONALE</strong></p>
        <p style={{ marginBottom: '0.8rem' }}>
          Al momento della sottoscrizione il Proponente verserà l'importo di € {inp('cauzioneImporto', '60px')} pari a {inp('cauzioneMesi', '18px')} mensilità a mezzo {inp('cauzioneMezzo', '180px')}.
        </p>

        <p style={{ marginBottom: '0.15rem' }}><strong>c) ONERI CONDOMINIALI</strong></p>
        <p style={{ marginBottom: '0.15rem' }}>
          {chk('oneriTipo', 'richiesta', 'su semplice richiesta di questi, le quote a lui imputabili. Al termine dell\'esercizio verranno eseguiti gli eventuali conguagli;')}
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          {chk('oneriTipo', 'forfait', 'la somma di €')} {inp('oneriForfaitAnnui', '60px')} da liquidarsi contestualmente alle scadenze del canone in {inp('oneriForfaitRate', '18px')} rate anticipate di € {inp('oneriForfaitImportoRata', '60px')} ciascuna.
        </p>
        <p style={{ marginBottom: '0.15rem' }}>Tale somma:</p>
        <p style={{ marginBottom: '0.8rem' }}>
          {chk('oneriConguaglio', 'a_forfait', 'è da intendere determinata a forfait, senza obbligo di rendiconto')}<br />
          {chk('oneriConguaglio', 'acconto', 'sarà dovuta a titolo di acconto sulle spese accessorie, salvo conguaglio positivo o negativo.')}
        </p>

        <p style={{ marginBottom: '0.15rem' }}><strong>d) PATTI PARTICOLARI</strong></p>
        <p style={{ marginBottom: '0.15rem' }}>
          Il Proponente dichiara che utilizzerà i locali per l'apertura di un'attività di {inp('attivitaX', '180px')}, che ai fini della L. 392/78&nbsp;
          {chk('contattoPubblico', 'no', 'non prevede')} &nbsp; {chk('contattoPubblico', 'si', 'prevede')} contatto diretto con il pubblico.
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          Il Proponente è tenuto sotto sua responsabilità a denunciare l'attività agli enti locali; si impegna alla voltura intestazioni contratti erogazione servizi.
        </p>
        <div style={{ marginBottom: '0.8rem' }}>{inpFull('pattiExtra')}</div>
      </div>

      {/* ===== PAGINA 4 ===== */}
      <div className="a4-page" style={{ fontSize: '9.2pt', lineHeight: '1.5' }}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>

        {/* 3) TIPOLOGIA CONTRATTO */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>3) TIPOLOGIA E DURATA DEL CONTRATTO</h3>
        <p style={{ marginBottom: '0.15rem' }}>Il contratto sarà del seguente tipo:</p>
        <p style={{ marginBottom: '0.15rem', paddingLeft: '1rem' }}>
          <strong>3.1) uso diverso (commerciale L. 392/78)</strong> <span className="inline-checkbox" onClick={() => setData({ ...data, tipoContratto: '3.1' })}>{data.tipoContratto === '3.1' ? '☑' : '☐'}</span><br />
          {data.tipoContratto === '3.1' && data.sottoTipo31 === '6+6' ? '☑' : '☐'} a) durata: min. 6+6 <br />
          {data.tipoContratto === '3.1' && data.sottoTipo31 === '9+9' ? '☑' : '☐'} b) durata: min. 9+9 <br />
          {data.tipoContratto === '3.1' && data.sottoTipo31 === 'transitorio' ? '☑' : '☐'} c) uso transitorio mesi {inp('mesiTransitorio31', '30px')}
        </p>
        <p style={{ marginBottom: '0.15rem', paddingLeft: '1rem' }}>
          <strong>3.2) uso abitativo</strong> <span className="inline-checkbox" onClick={() => setData({ ...data, tipoContratto: '3.2' })}>{data.tipoContratto === '3.2' ? '☑' : '☐'}</span><br />
          {data.tipoContratto === '3.2' && data.sottoTipo32 === '4+4' ? '☑' : '☐'} a) L.431 4+4 <br />
          {data.tipoContratto === '3.2' && data.sottoTipo32 === '3+2' ? '☑' : '☐'} b) L.431 3+2 <br />
          {data.tipoContratto === '3.2' && data.sottoTipo32 === 'transitorio' ? '☑' : '☐'} c) transitorio esigenze: {inp('usoTransitorio32', '120px')} <br />
          {data.tipoContratto === '3.2' && data.sottoTipo32 === 'studenti' ? '☑' : '☐'} d) transitorio studenti <br />
          {data.tipoContratto === '3.2' && data.sottoTipo32 === 'altro' ? '☑' : '☐'} e) altro {inp('altro32', '120px')}
        </p>
        <p style={{ marginBottom: '0.8rem' }}>
          Il contratto avrà durata di anni/mesi {inp('durataAnniMesi', '30px')} a decorrere dal {inp('decorrenzaDal', '130px', 'date')} sino al {inp('decorrenzaAl', '130px', 'date')}
        </p>

        {/* 4) DEPOSITO */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>4) DEPOSITO FIDUCIARIO</h3>
        <p style={{ marginBottom: '0.8rem' }}>
          € {inp('depositoImporto', '60px')} vengono versati alla firma, mediante&nbsp;
          <span className="inline-checkbox" onClick={() => setData({ ...data, depositoMezzo: 'assegno' })}>{data.depositoMezzo === 'assegno' ? '☑' : '☐'}</span> assegno n° {inp('depositoAssegno', '90px')} banca {inp('depositoBanca', '120px')} agenzia {inp('depositoAgenzia', '90px')}&nbsp;
          <span className="inline-checkbox" onClick={() => setData({ ...data, depositoMezzo: 'altro' })}>{data.depositoMezzo === 'altro' ? '☑' : '☐'}</span> altro: {inp('depositoAltro', '120px')}
        </p>

        {/* 5) CONSEGNA */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>5) CONSEGNA IMMOBILE</h3>
        <p style={{ marginBottom: '0.8rem' }}>
          L'immobile verrà consegnato alla data del {inp('dataConsegna', '130px', 'date')}, libero da cose e persone, con decorrenza contrattuale dal {inp('dataDecorrenzaEffettiva', '130px', 'date')}. La sottoscrizione del contratto di locazione avverrà entro {inp('dataSottoscrizione', '130px', 'date')}.
        </p>

        {/* 6) IRREVOCABILITA' */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>6) TERMINE D'IRREVOCABILITÀ DELLA PROPOSTA</h3>
        <p style={{ marginBottom: '0.8rem' }}>
          La presente proposta è irrevocabile per {inp('giorniIrrevocabile', '18px')} giorni da oggi, ossia sino al {inp('dataIrrevocabile', '130px', 'date')} compreso.
        </p>

        {/* 7, 8) COMUNICAZIONE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>7, 8) COMUNICAZIONE E CONCLUSIONE</h3>
        <p style={{ marginBottom: '0.8rem', textAlign: 'justify' }}>
          L'Agenzia Immobiliare si obbliga a dare immediato avviso della proposta al Locatore. La proposta si perfezionerà in vincolo (CONTRATTO PRELIMINARE) non appena il Proponente avrà conoscenza dell'accettazione.
        </p>

        {/* 9) COMPENSO */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>9) COMPENSO MEDIAZIONE</h3>
        <p style={{ marginBottom: '0.8rem' }}>
          Il Proponente si obbliga a corrispondere la provvigione, convenuta nel {inp('provvigione', '18px')}% + IVA del canone di locazione annuo a regime.
        </p>

        {/* 10) NOTE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>10) NOTE</h3>
        <div style={{ marginBottom: '1rem' }}>{inpFull('note')}</div>

        <div className="signature-grid" style={{ marginBottom: '2rem' }}>
          <div className="signature-box" style={{ textAlign: 'left' }}>
            Luogo e data: <br /><br />
            Firma Agenzia: <br /><br />
            Firma Proponente: <br />
          </div>
        </div>

        <div style={{ border: '1px solid black', padding: '10px', marginBottom: '1rem' }}>
          <p style={{ textAlign: 'center' }}>Il Locatore con l'accettazione della presente conferma le dichiarazioni di cui all'art.1a).</p>
          <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma per accettazione Locatore: _________________</p>
        </div>

        <div style={{ border: '1px solid black', padding: '10px' }}>
          <p style={{ textAlign: 'center' }}>Per avvenuta conoscenza dell'accettazione</p>
          <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma Proponente: _________________</p>
        </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Proposta di Locazione" icon={<FileText size={20} />} preview={renderPreview()} clientName={data.s1Nome}>
    </ContractLayout>
  );
};
