import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const PurchaseProposal: React.FC = () => {
  const [data, setData] = useState({
    // VENDITORE (Destinatario)
    vNome: '', v2Nome: '',
    vCF: '', v2CF: '',
    vIndirizzo: '', vCivico: '', vCitta: '',

    // PROPONENTE 1
    p1Nome: '', p1NatoA: '', p1NatoIl: '', p1ResidenteA: '', p1Via: '', p1Civico: '', p1Tel: '', p1CF: '', p1Email: '',
    p1Qualita: '', p1Societa: '', p1SocCF: '', p1SocPI: '', p1Sede: '',
    
    // PROPONENTE 2
    p2Nome: '', p2NatoA: '', p2NatoIl: '', p2ResidenteA: '', p2Via: '', p2Civico: '', p2Tel: '', p2CF: '', p2Email: '',
    
    // AGENZIA
    agNome: '', agSede: '', agVia: '', agCivico: '', agCciaa: '', agRea: '', agPec: '',
    
    // IMMOBILE
    immComune: '', immVia: '', immCivico: '', immInt: '', immIntestataA: '', immUso: '', immComposizione: '', immProvenienza: '',
    
    // CATASTO (2 righe)
    c1F: '', c1M: '', c1S: '', c1Cat: '', c1Cl: '', c1Vani: '', c1Mq: '', c1Rend: '',
    c2F: '', c2M: '', c2S: '', c2Cat: '', c2Cl: '', c2Vani: '', c2Mq: '', c2Rend: '',
    
    // STATO IMMOBILE
    statoImm: 'libero', canoneAnnuo: '', scadenzaContratto: '', altroStato: '',
    
    // DICHIARAZIONI VENDITORE
    confUrbanistica: '', confImpianti: '', confPregiudizievoli: '', confApe: 'APE', apeData: '', confCatastale: '', spesOrdinarie: '', spesStraordinarie: '',
    
    // PREZZO E PAGAMENTI
    prezzoOfferto: '',
    
    // a) alla proposta
    pag1Importo: '', pag1AssegnoNum: '', pag1Banca: '', pag1Agenzia: '',
    
    // b) successivi 1
    pag2Importo: '', pag2Data: '', pag2Assegno: 'circolare', pag2Titolo: 'caparra',
    
    // b) successivi 2
    pag3Importo: '', pag3Data: '', pag3Assegno: 'circolare', pag3Titolo: 'caparra',
    
    // c) saldo
    saldoModo: 'assegno', attoEntroIl: '', attoNotaio: '', attoSede: '', attoVia: '', attoCivico: '',
    
    // d) deposito
    depositoPrezzo: 'B',
    
    // CONDIZIONI FINALI
    dataConsegna: '',
    irrevocabileFino: '',
    giorniVerifica: '',
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

  const f = (val: string | undefined, length: number = 20) => val || '_'.repeat(length);

  const renderPreview = () => (
    <>
      {/* ===== PAGINA 1 ===== */}
      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
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
          Proposta di Acquisto Immobiliare
        </div>

        {/* BOX VENDITORE (Destinatario) */}
        <div style={{ border: '1px solid #000', marginBottom: '8px', padding: '3px 6px' }}>
          {row(<>
            <span>Destinatari (<strong>VENDITORE</strong>):</span>
            <strong>{inp('vNome', '200px')}</strong>
            <span>e</span>
            <strong>{inp('v2Nome', '160px')}</strong>
          </>)}
          {row(<>
            <span>C.F.</span><strong>{inp('vCF', '160px')}</strong>
            <span style={{ marginLeft: '1.5rem' }}>C.F.</span><strong>{inp('v2CF', '160px')}</strong>
          </>)}
          {row(<>
            <span>Indirizzo</span><strong>{inp('vIndirizzo', '185px')}</strong>
            <span>n.</span><strong>{inp('vCivico', '30px')}</strong>
            <span style={{ marginLeft: '0.5rem' }}>Città</span><strong>{inp('vCitta', '130px')}</strong>
          </>)}
        </div>

        {/* SOTTOSCRITTI / PROPONENTE */}
        <div style={{ marginBottom: '0.5rem' }}>
          {row(<>
            <span>Spett.le / Egr. Sig.</span>
            <strong>{inp('p1Nome', '220px')}</strong>
            <span>nato/a il</span>
            <strong>{inp('p1NatoIl', '100px', 'date')}</strong>
          </>)}
          {row(<>
            <span>residente a</span>{inp('p1ResidenteA', '180px')}
            <span>via</span>{inp('p1Via', '160px')}
            <span>n°</span>{inp('p1Civico', '30px')}
          </>)}
          {row(<>
            <span>tel.</span>{inp('p1Tel', '90px')}
            <span>C.F.</span><strong>{inp('p1CF', '170px')}</strong>
          </>)}
          {row(<>
            <span>e-mail / PEC</span>{inp('p1Email', '280px')}
          </>)}
          {row(<>
            <span>in qualità di</span>{inp('p1Qualita', '120px')}
            <span>della</span>{inp('p1Societa', '220px')}
          </>)}
          {row(<>
            <span>C.F.</span>{inp('p1SocCF', '125px')}
            <span>P.I.</span>{inp('p1SocPI', '125px')}
          </>)}
          {row(<>
            <span>Sede legale:</span>{inp('p1Sede', '360px')}
          </>)}

          {data.p2Nome && (
            <div style={{ marginTop: '0.4rem', borderTop: '1px dotted #ccc', paddingTop: '0.4rem' }}>
              {row(<><strong>{inp('p2Nome', '220px')}</strong><span>nato/a il</span>{inp('p2NatoIl', '100px', 'date')}</>)}
              {row(<><span>residente a</span>{inp('p2ResidenteA', '180px')}<span>via</span>{inp('p2Via', '160px')}<span>n°</span>{inp('p2Civico', '30px')}</>)}
              {row(<><span>tel.</span>{inp('p2Tel', '90px')}<span>C.F.</span><strong>{inp('p2CF', '170px')}</strong></>)}
              {row(<><span>e-mail / PEC</span>{inp('p2Email', '280px')}</>)}
            </div>
          )}
        </div>

        <p style={{ marginBottom: '0.4rem' }}>
          in seguito "PROPONENTE" tramite l'agenzia di mediazione immobiliare <strong>{inp('agNome', '240px')}</strong>
        </p>
        {row(<>
          <span>con sede in</span>{inp('agSede', '180px')}
          <span>via</span>{inp('agVia', '180px')}
          <span>n°</span>{inp('agCivico', '30px')}
        </>)}
        {row(<>
          <span>iscritta alla C.C.I.A.A. di</span>{inp('agCciaa', '120px')}
          <span>REA n°</span>{inp('agRea', '120px')}
        </>)}
        {row(<>
          <span>PEC</span>{inp('agPec', '240px')}
          <span>in seguito denominata "AGENZIA IMMOBILIARE"</span>
        </>)}

        <div style={{ textAlign: 'center', margin: '0.8rem 0', fontWeight: 'bold' }}>
          , con la presente proposta<br/>
          PROMETTE IRREVOCABILMENTE Dl ACQUISTARE<br/>
          <span style={{ fontWeight: 'normal', fontSize: '9pt' }}>a corpo e non a misura, l'immobile sotto descritto, comprensivo della proporzionale quota delle parti comuni, alle condizioni di seguito indicate.</span>
        </div>

        {/* 1) DESCRIZIONE IMMOBILE */}
        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.6rem 0 0.3rem 0'}}>1) DESCRIZIONE IMMOBILE</h3>
        {row(<>
          <span>Comune</span>{inp('immComune', '130px')}
          <span>via</span>{inp('immVia', '180px')}
          <span>n°</span>{inp('immCivico', '30px')}
          <span>Int.</span>{inp('immInt', '30px')}
        </>)}
        {row(<>
          <span>Proprietà intestata a</span>{inp('immIntestataA', '220px')}
          <span>Destinazione d'uso</span>{inp('immUso', '120px')}
        </>)}
        <div style={{ marginBottom: '0.2rem' }}><span>Composizione: </span>{inpFull('immComposizione')}</div>
        <div style={{ marginBottom: '0.2rem' }}><span>Atto di Provenienza: </span>{inpFull('immProvenienza')}</div>
        
        {[1,2].map(i => {
          const di = data as any;
          const foglio = di[`c${i}F`];
          if(i > 1 && !foglio) return <span key={i}></span>;
          return (
            <div key={i} style={{ marginBottom: '0.15rem' }}>
              {row(<>
                {i > 1 ? <span>e</span> : null}
                <span>Dati Catastali: Foglio</span><strong>{inp(`c${i}F` as any, '35px')}</strong>
                <span>Mappale</span><strong>{inp(`c${i}M` as any, '45px')}</strong>
                <span>Sub</span><strong>{inp(`c${i}S` as any, '35px')}</strong>
                <span>cat.</span>{inp(`c${i}Cat` as any, '35px')}
                <span>cl.</span>{inp(`c${i}Cl` as any, '30px')}
                <span>vani</span>{inp(`c${i}Vani` as any, '30px')}
                <span>mq</span>{inp(`c${i}Mq` as any, '35px')}
                <span>rendita €</span>{inp(`c${i}Rend` as any, '65px')}
              </>)}
            </div>
          );
        })}

        <div style={{ marginTop: '0.4rem' }}>
          {chk('statoImm', 'libero', 'libero o occupato dal proprietario e libero al rogito')}
        </div>
        {row(<>
          {chk('statoImm', 'locato', 'locato al canone annuo di €')}
          {inp('canoneAnnuo', '65px')}
          <span>con contratto scadente il</span>
          {inp('scadenzaContratto', '100px', 'date')}
        </>)}
        {row(<>
          {chk('statoImm', 'altro', 'altro')}
          {inp('altroStato', '360px')}
        </>)}

        {/* 2) DICHIARAZIONI DEL VENDITORE */}
        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>2) DICHIARAZIONI DEL VENDITORE</h3>
        <p style={{ marginBottom: '0.2rem', fontSize: '8.5pt', fontStyle: 'italic' }}>Il Venditore ha dichiarato all'Agenzia Immobiliare che l'immobile è:</p>
        <div style={{ marginBottom: '0.2rem' }}><span>con riguardo alla conformità edilizia/urbanistica: </span>{inpFull('confUrbanistica')}</div>
        <div style={{ marginBottom: '0.2rem' }}><span>con riguardo alla conformità degli impianti: </span>{inpFull('confImpianti')}</div>
        <div style={{ marginBottom: '0.2rem' }}><span>con riguardo a gravami/pregiudizievoli: </span>{inpFull('confPregiudizievoli')}</div>
        {row(<>
          <span>con riguardo alla cert. energetica:</span>
          {chk('confApe', 'APE', 'APE')}
          {chk('confApe', 'ACE', 'ACE')}
          <span>rilasciato il</span>
          {inp('apeData', '100px', 'date')}
        </>)}
        <div style={{ marginBottom: '0.2rem' }}><span>con riguardo alla ditta catastale/planimetria: </span>{inpFull('confCatastale')}</div>
        {row(<>
          <span>spese condominiali ordinarie circa €</span>{inp('spesOrdinarie', '60px')}
          <span>annui; straordinarie circa €</span>{inp('spesStraordinarie', '60px')}
        </>)}
        <p style={{marginTop: '0.4rem', fontSize: '8pt', fontStyle: 'italic', textAlign: 'justify'}}>
          Il Venditore, mediante l'accettazione della presente proposta, garantisce la veridicità delle suddette descrizioni e dichiarazioni dello stato dell'immobile.
        </p>

        {/* 3) PREZZO OFFETTO */}
        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.6rem 0 0.3rem 0'}}>3) PREZZO DI ACQUISTO OFFERTO</h3>
        <p style={{marginBottom: '0.5rem'}}>
          <strong>€ {inp('prezzoOfferto', '120px')}</strong>
        </p>
      </div>

      {/* ===== PAGINA 2 ===== */}
      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
        
        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.6rem 0 0.3rem 0'}}>4) CONDIZIONI DI PAGAMENTO</h3>
        <p style={{marginBottom: '0.2rem'}}><strong>a) alla presente proposta:</strong></p>
        <p style={{textAlign: 'justify', marginBottom: '0.4rem'}}>
          € {inp('pag1Importo', '75px')} sono versati alla firma, a mani dell'AGENZIA IMMOBILIARE, che rilascia ricevuta a titolo di deposito, con assegno n° {inp('pag1AssegnoNum', '90px')} non trasferibile, intestato al venditore, tratto sulla banca {inp('pag1Banca', '140px')} agenzia di {inp('pag1Agenzia', '120px')}.
          In caso di accettazione tale somma diverrà <strong>CAPARRA CONFIRMATORIA</strong>.
        </p>

        <p style={{marginBottom: '0.2rem'}}><strong>b) pagamenti successivi:</strong></p>
        <p style={{textAlign: 'justify', marginBottom: '0.4rem'}}>
          € {inp('pag2Importo', '75px')} entro il {inp('pag2Data', '100px', 'date')} con assegno {chk('pag2Assegno', 'circolare', 'circolare')} {chk('pag2Assegno', 'bancario', 'bancario')} a titolo di: {chk('pag2Titolo', 'caparra', 'ulteriore caparra confirmatoria')} {chk('pag2Titolo', 'acconto', 'acconto prezzo')}.
        </p>
        
        {data.pag3Importo && (
          <p style={{textAlign: 'justify', marginBottom: '0.4rem'}}>
            € {inp('pag3Importo', '75px')} entro il {inp('pag3Data', '100px', 'date')} con assegno {chk('pag3Assegno', 'circolare', 'circolare')} {chk('pag3Assegno', 'bancario', 'bancario')} a titolo di: {chk('pag3Titolo', 'caparra', 'ulteriore caparra confirmatoria')} {chk('pag3Titolo', 'acconto', 'acconto prezzo')}.
          </p>
        )}

        <p style={{marginBottom: '0.2rem'}}><strong>c) saldo all'atto notarile:</strong></p>
        <div style={{ marginBottom: '0.4rem' }}>
          {chk('saldoModo', 'assegno', 'con assegno circolare non trasferibile')} &nbsp;&nbsp;&nbsp;
          {chk('saldoModo', 'finanziatore', 'con intervento di un ente finanziatore')}
        </div>
        <p style={{textAlign: 'justify', marginBottom: '0.4rem'}}>
          L'atto notarile sarà stipulato entro il {inp('attoEntroIl', '100px', 'date')} presso lo studio del Notaio {inp('attoNotaio', '200px')} con sede in {inp('attoSede', '140px')} via {inp('attoVia', '160px')} n° {inp('attoCivico', '30px')}.
        </p>

        <p style={{marginBottom: '0.2rem'}}><strong>d) deposito del saldo del prezzo</strong></p>
        <p style={{fontSize: '8.5pt', textAlign: 'justify', marginBottom: '0.4rem'}}>
          Il Venditore dichiara di essere stato edotto della facoltà di deposito del prezzo presso il notaio (L. 147/2013). Il Proponente dichiara di:
          <br/>{chk('depositoPrezzo', 'A', 'A) volersi avvalere della predetta disposizione')}
          <br/>{chk('depositoPrezzo', 'B', 'B) NON volersi avvalere della predetta disposizione, rinunciando espressamente.')}
        </p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>5) CONSEGNA IMMOBILE</h3>
        <p style={{marginBottom: '0.6rem'}}>L'immobile sarà consegnato il {inp('dataConsegna', '100px', 'date')}, libero da cose e persone, con obbligo del VENDITORE di conservarlo con diligenza.</p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>6) TERMINE D'IRREVOCABILITÀ</h3>
        <p style={{marginBottom: '0.6rem'}}>La presente proposta è irrevocabile sino alle ore 24.00 del giorno {inp('irrevocabileFino', '100px', 'date')} compreso.</p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>7, 8) COMUNICAZIONE E CONCLUSIONE</h3>
        <p style={{fontSize: '8.5pt', textAlign: 'justify', marginBottom: '0.6rem'}}>L'AGENZIA si obbliga a dare immediato avviso al venditore. La proposta si perfezionerà in vincolo contrattuale non appena il PROPONENTE avrà conoscenza dell'accettazione.</p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>9) CLAUSOLA RISOLUTIVA ESPRESSA</h3>
        <p style={{fontSize: '8.5pt', textAlign: 'justify', marginBottom: '0.6rem'}}>Le Parti convengono di sottoporre il contratto alla verifica delle visure entro {inp('giorniVerifica', '30px')} giorni dal perfezionamento. L'assegno di caparra sarà consegnato solo se la verifica confermerà quanto dichiarato.</p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>10) REGISTRAZIONE E NOTE</h3>
        <p style={{fontSize: '8.5pt', marginBottom: '0.4rem'}}>Costi di registrazione a carico del Proponente. Note:</p>
        <div style={{ marginBottom: '1rem' }}>{inpFull('note')}</div>

        <div className="signature-grid" style={{marginBottom: '1rem'}}>
          <div className="signature-box" style={{textAlign: 'left'}}>
            Luogo e data: <br/><br/>
            Firma Proponente: <br/><br/>
            Firma Agenzia: <br/>
          </div>
        </div>

        <div style={{border: '1px solid black', padding: '8px', marginBottom: '0.5rem', fontSize: '8.5pt'}}>
          <h4 style={{textAlign: 'center', margin: '0 0 4px 0'}}>ACCETTAZIONE DEL VENDITORE</h4>
          <p>Il sottoscritto accetta integralmente la presente proposta d'acquisto.</p>
          <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma venditore: _________________</p>
        </div>
        <div style={{border: '1px solid black', padding: '8px', fontSize: '8.5pt'}}>
          <h4 style={{textAlign: 'center', margin: '0 0 4px 0'}}>RITIRO ACCETTAZIONE</h4>
          <p>Il sottoscritto riceve copia della proposta accettata.</p>
          <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma proponente: _________________</p>
        </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Proposta d'Acquisto" icon={<FileText size={20} />} preview={renderPreview()} clientName={data.p1Nome}>
    </ContractLayout>
  );
};
