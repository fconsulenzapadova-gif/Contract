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

    // IN QUALITA' DI (Società)
    qualita: '', dellaSocieta: '',
    sedeLegaleVia: '', sedeLegaleCivico: '', sedePartIva: '',
    tel: '', cell: '', fax: '', email: '',

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

    // DICHIARAZIONI STATO IMMOBILE
    confUrbanistica: '',
    statoImpianti: 'a_norma', impiantiAdeguareDa: '',
    confApe: '',
    speseCondominiali: '', speseRiscaldamento: '', riscRate: '', riscImpianto: '',

    // CANONE
    canoneAnnuo: '', canoneNumRate: '', canoneRata: '',
    soggettoIva: 'no', ivaAliquota: '22',
    aggiornamentoIstat: '100',

    // CAUZIONE E ONERI
    cauzioneImporto: '', cauzioneMesi: '', cauzioneMezzo: '',
    oneriTipo: 'richiesta', oneriForfaitAnnui: '', oneriForfaitRate: '', oneriForfaitImportoRata: '',
    oneriConguaglio: 'acconto',

    // PATTI
    attivitaX: '', contattoPubblico: 'no', pattiExtra: '',

    // DURATA
    tipoContratto: '3.1', sottoTipo31: '6+6', mesiTransitorio31: '',
    sottoTipo32: '4+4', usoTransitorio32: '', altro32: '',
    durataAnniMesi: '', decorrenzaDal: '', decorrenzaAl: '',

    // DEPOSITO E GARANZIA
    depositoImporto: '',
    depositoMezzo: 'assegno', depositoAssegno: '', depositoBanca: '', depositoAltro: '',

    // CONSEGNA E FINALI
    dataConsegna: '', dataDecorrenzaEffettiva: '', dataSottoscrizione: '',
    giorniIrrevocabile: '', dataIrrevocabile: '',
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
          Modulo di Proposta per la Locazione
        </div>

        {/* BOX DESTINATARIO (LOCATORE) */}
        <div style={{ border: '1px solid #000', marginBottom: '8px', padding: '3px 6px' }}>
          {row(<>
            <span>Destinatario (<strong>PROPRIETARIO/LOCATORE</strong>):</span>
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
        <div style={{ marginBottom: '0.6rem' }}>
          {row(<>
            <span>Il sottoscritto</span>
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
            <span style={{marginLeft: '0.4rem'}}>doc. identità</span><strong>{inp('s1DocIdentita', '95px')}</strong>
          </>)}
          {row(<>
            <span>residente/domiciliato in</span><strong>{inp('domiciliatoA', '120px')}</strong>
            <span>(</span>{inp('domProv', '26px')}<span>) via</span>
            <strong>{inp('domVia', '140px')}</strong>
            <span>n.</span><strong>{inp('domCivico', '30px')}</strong>
          </>)}
          {row(<>
            <span>in nome e per conto della</span>{inp('dellaSocieta', '200px')}
            <span>P.IVA</span>{inp('sedePartIva', '105px')}
          </>)}
          {row(<>
            <span>tel.</span>{inp('tel', '78px')}
            <span>cell.</span>{inp('cell', '88px')}
            <span>e-mail</span>{inp('email', '220px')}
          </>)}
        </div>

        <p style={{ textAlign: 'center', margin: '0.6rem 0', fontWeight: 'bold' }}>
          formula la presente Proposta di Locazione per l'immobile sottodescritto:
        </p>

        {/* 1) DESCRIZIONE E STATO DELL'IMMOBILE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>
          1) DESCRIZIONE E STATO DELL'IMMOBILE
        </h3>
        <div style={{ marginBottom: '0.15rem' }}><span>a) Ubicazione: </span>{inpFull('immUbicazione')}</div>
        <div style={{ marginBottom: '0.15rem' }}><span>b) Composizione: </span>{inpFull('immComposizione')}</div>
        <div style={{ marginBottom: '0.15rem', fontWeight: 'bold' }}>
          {row(<><span>Foglio</span>{inp('foglio', '38px')}<span>, Part.</span>{inp('part', '38px')}<span>, Sub</span>{inp('sub', '38px')}<span>Z.C.</span>{inp('zc', '28px')}<span>Cat.</span>{inp('cat', '38px')}<span>Classe</span>{inp('classe', '38px')}<span>cons. vani</span>{inp('consVani', '38px')}<span>rendita</span>{inp('rendita', '55px')}</>)}
        </div>
        <div style={{ marginBottom: '0.15rem' }}><span>c) Identificativi catastali: </span>{inpFull('idCatastali')}</div>
        <div style={{ marginBottom: '0.15rem' }}><span>d) Titolarità/Proprietà: </span>{inpFull('proprieta')}</div>
        <div style={{ marginBottom: '0.15rem' }}><span>e) Atto di provenienza: </span>{inpFull('attoProvenienza')}</div>
        <div style={{ marginBottom: '0.15rem' }}><span>f) Destinazione d'uso: </span>{inp('destinazioneUso', '220px')}<span> Categoria Catastale: </span>{inp('catCatastale', '100px')}</div>

        <div style={{ marginTop: '0.4rem', border: '1px dotted #ccc', padding: '4px' }}>
          <p style={{ marginBottom: '0.15rem', fontStyle: 'italic' }}>Dichiarazioni sullo stato dell'immobile:</p>
          <p style={{ marginBottom: '0.15rem' }}>
            Situazione Catastale: {chk('intestazioneAllineata', 'allineato', 'allineato')} {chk('intestazioneAllineata', 'non_allineato', 'non allineato')}; &nbsp;
            Planimetria: {chk('planimetria', 'conforme', 'conforme')} {chk('planimetria', 'non_conforme', 'non conforme')}
          </p>
          <p style={{ marginBottom: '0.15rem' }}>
            Certificato agibilità: {chk('certificatoAgibilita', 'dotato', 'presente')} {chk('certificatoAgibilita', 'assente', 'da verificare')}; &nbsp;
            APE: {inp('confApe', '160px')}
          </p>
          <p style={{ marginBottom: '0.15rem' }}>
            Regime edilizio: {chk('regimeEdilizio', 'privata_libera', 'edilizia libera')} {chk('regimeEdilizio', 'convenzionata', 'edilizia convenzionata')}
          </p>
          <div style={{ marginBottom: '0.15rem' }}>
            {row(<><span>Gravami: </span>{inpFull('gravami')}</>)}
          </div>
        </div>

        {/* 2) CONDIZIONI ECONOMICHE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.8rem 0 0.3rem 0', textDecoration: 'underline' }}>
          2) CONDIZIONI ECONOMICHE
        </h3>
        <p style={{ marginBottom: '0.15rem' }}>
          Il canone di locazione offerto è di <strong>€ {inp('canoneAnnuo', '75px')}</strong> annui, da pagarsi in {inp('canoneNumRate', '18px')} rate di € {inp('canoneRata', '70px')}.
        </p>
        <p style={{ marginBottom: '0.15rem' }}>
          {chk('soggettoIva', 'si', 'Soggetto ad IVA')} {chk('soggettoIva', 'no', 'Non soggetto ad IVA')}.
          Aggiornamento ISTAT annuale al {inp('aggiornamentoIstat', '25px')}%.
        </p>

        <p style={{ marginBottom: '0.15rem' }}>
          Deposito cauzionale richiesto: € {inp('cauzioneImporto', '70px')} (pari a {inp('cauzioneMesi', '20px')} mensilità) a mezzo {inp('cauzioneMezzo', '120px')}.
        </p>
        
        <p style={{ marginBottom: '0.4rem' }}>
          Oneri accessori stimati/concordati: {chk('oneriTipo', 'richiesta', 'su base consuntiva')} {chk('oneriTipo', 'forfait', 'a forfait €')} {inp('oneriForfaitImportoRata', '60px')} / rata.
        </p>
      </div>

      {/* ===== PAGINA 2 ===== */}
      <div className="a4-page" style={{ fontSize: '9.2pt', lineHeight: '1.5' }}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>

        {/* 3) DURATA */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>3) DURATA DEL CONTRATTO</h3>
        <p style={{ marginBottom: '0.2rem' }}>Tipologia di contratto {inp('tipoContratto', '120px')} con durata di anni/mesi {inp('durataAnniMesi', '30px')}.</p>
        <p style={{ marginBottom: '0.6rem' }}>Con decorrenza dal {inp('decorrenzaDal', '110px', 'date')} sino al {inp('decorrenzaAl', '110px', 'date')}.</p>

        {/* 4) DEPOSITO DI GARANZIA */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>4) DEPOSITO CAUZIONALE E GARANZIA</h3>
        <p style={{ marginBottom: '0.8rem', textAlign: 'justify' }}>
          La somma di € {inp('depositoImporto', '75px')} viene versata contestualmente alla presente a titolo di deposito, mediante {inp('depositoMezzo', '120px')} {inp('depositoAssegno', '110px')}. Tale somma, in caso di accettazione della proposta, sarà imputata a deposito cauzionale o prima rata di canone, come concordato tra le parti. 
        </p>

        {/* 5) CONSEGNA */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>5) CONSEGNA IMMOBILE</h3>
        <p style={{ marginBottom: '0.8rem' }}>
          L'immobile sarà consegnato il {inp('dataConsegna', '110px', 'date')}, libero da cose e persone, in buono stato locativo. La sottoscrizione del contratto definitivo avverrà entro il {inp('dataSottoscrizione', '110px', 'date')}.
        </p>

        {/* 6) IRREVOCABILITA' */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>6) TERMINE D'IRREVOCABILITÀ</h3>
        <p style={{ marginBottom: '0.8rem' }}>
          La presente proposta è irrevocabile fino al giorno {inp('dataIrrevocabile', '110px', 'date')} compreso.
        </p>

        {/* 7, 8) COMUNICAZIONE E CONCLUSIONE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>7) PERFEZIONAMENTO DEL CONTRATTO</h3>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          Il proponente si impegna a comunicare la presente proposta al Locatore. Il vincolo contrattuale si intende perfezionato nel momento in cui il proponente riceve notizia dell'accettazione sottoscritta da parte del Locatore. L'accettazione potrà essere comunicata tramite raccomandata, PEC o consegna a mani.
        </p>

        {/* NOTE */}
        <h3 style={{ fontSize: '9.5pt', fontWeight: 'bold', margin: '0.6rem 0 0.3rem 0', textDecoration: 'underline' }}>8) NOTE E PATTI AGGIUNTIVI</h3>
        <div style={{ marginBottom: '2rem' }}>{inpFull('note')}</div>

        <div className="signature-grid" style={{ marginBottom: '3rem' }}>
          <div className="signature-box" style={{ textAlign: 'left' }}>
            Luogo e data: <br /><br />
            <strong>Firma del Proponente:</strong> <br /><br />
            ................................................<br />
          </div>
        </div>

        {/* ACCETTAZIONE LOCATORE */}
        <div style={{ border: '2px solid #4a4a4a', padding: '12px', marginBottom: '1rem', borderRadius: '4px' }}>
          <h4 style={{ textAlign: 'center', marginTop: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>Accettazione del Locatore</h4>
          <p style={{marginBottom: '1rem'}}>
            Il sottoscritto Locatore accetta integralmente la proposta alle condizioni sopra descritte.
          </p>
          <p>
            Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Firma Locatore:</strong> _________________
          </p>
        </div>

        {/* PRESA VISIONE ACCETTAZIONE */}
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <p style={{ fontSize: '8pt', color: '#666' }}>
            Il Proponente riceve in data _______________ comunicazione dell'accettazione della presente proposta.
            <br/><br/>
            Firma Proponente: _________________
          </p>
        </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Modulo Proposta Locazione" icon={<FileText size={20} />} preview={renderPreview()} clientName={data.s1Nome}>
    </ContractLayout>
  );
};
