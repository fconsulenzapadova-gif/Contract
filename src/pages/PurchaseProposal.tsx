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
    pag1Importo: '', pag1AssegnoNum: '', pag1Banca: '', 
    
    // b) successivi
    pag2Importo: '', pag2Data: '', pag2Assegno: 'circolare', pag2Titolo: 'caparra',
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

  const renderPreview = () => (
    <>
      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>

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
          Modulo di Proposta d'Acquisto
        </div>

        {/* BOX VENDITORE */}
        <div style={{ border: '1px solid #000', marginBottom: '8px', padding: '3px 6px' }}>
          {row(<>
            <span>Destinatari (<strong>PROPRIETARIO/VENDITORE</strong>):</span>
            <strong>{inp('vNome', '200px')}</strong>
          </>)}
          {row(<>
            <span>C.F.</span><strong>{inp('vCF', '160px')}</strong>
            <span style={{ marginLeft: '1.5rem' }}>Città</span><strong>{inp('vCitta', '130px')}</strong>
          </>)}
        </div>

        {/* SOTTOSCRITTI / PROPONENTE */}
        <div style={{ marginBottom: '0.5rem' }}>
          {row(<>
            <span>Il sottoscritto</span>
            <strong>{inp('p1Nome', '220px')}</strong>
            <span>nato/a il</span>
            <strong>{inp('p1NatoIl', '100px', 'date')}</strong>
          </>)}
          {row(<>
            <span>residente a</span>{inp('p1ResidenteA', '180px')}
            <span>via</span>{inp('p1Via', '160px')}
            <span>C.F.</span><strong>{inp('p1CF', '170px')}</strong>
          </>)}
          {row(<>
            <span>e-mail / PEC</span>{inp('p1Email', '280px')}
          </>)}

          {data.p2Nome && (
            <div style={{ marginTop: '0.4rem', borderTop: '1px dotted #ccc', paddingTop: '0.4rem' }}>
              {row(<><strong>{inp('p2Nome', '220px')}</strong><span>il</span>{inp('p2NatoIl', '100px', 'date')}<span>C.F.</span><strong>{inp('p2CF', '170px')}</strong></>)}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', margin: '0.8rem 0', fontWeight: 'bold' }}>
          formula la presente proposta irrevocabile di acquisto<br/>
          <span style={{ fontWeight: 'normal', fontSize: '9pt' }}>relativa all'immobile sotto descritto, alle condizioni di seguito indicate.</span>
        </div>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.6rem 0 0.3rem 0'}}>1) DESCRIZIONE IMMOBILE</h3>
        {row(<>
          <span>Comune</span>{inp('immComune', '130px')}
          <span>via</span>{inp('immVia', '180px')}
          <span>n°</span>{inp('immCivico', '30px')}
        </>)}
        <div style={{ marginBottom: '0.2rem' }}><span>Composizione: </span>{inpFull('immComposizione')}</div>
        {row(<>
          <span>Dati Catastali: Foglio</span><strong>{inp('c1F', '35px')}</strong>
          <span>Mappale</span><strong>{inp('c1M', '45px')}</strong>
          <span>Sub</span><strong>{inp('c1S', '35px')}</strong>
        </>)}
        
        <p style={{ marginTop: '0.4rem' }}>
          L'immobile viene proposto: {chk('statoImm', 'libero', 'libero')} {chk('statoImm', 'locato', 'locato al canone €')} {inp('canoneAnnuo', '75px')}
        </p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>2) PREZZO DI ACQUISTO OFFERTO</h3>
        <p style={{marginBottom: '0.5rem'}}>
          <strong>€ {inp('prezzoOfferto', '120px')}</strong>
        </p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.6rem 0 0.3rem 0'}}>3) CONDIZIONI DI PAGAMENTO</h3>
        <p style={{textAlign: 'justify', marginBottom: '0.4rem'}}>
          a) € {inp('pag1Importo', '75px')} vengono versati alla firma a titolo di deposito, con assegno n° {inp('pag1AssegnoNum', '90px')} intestato al Venditore. In caso di accettazione tale somma diverrà <strong>CAPARRA CONFIRMATORIA</strong>.
        </p>

        <p style={{textAlign: 'justify', marginBottom: '0.4rem', fontSize: '8.5pt'}}>
          b) Pagamenti successivi e saldo: L'atto notarile sarà stipulato entro il {inp('attoEntroIl', '100px', 'date')} presso lo studio del Notaio {inp('attoNotaio', '180px')}.
        </p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>4) TERMINE D'IRREVOCABILITÀ</h3>
        <p style={{marginBottom: '0.6rem'}}>La presente proposta è irrevocabile sino alle ore 24.00 del giorno {inp('irrevocabileFino', '100px', 'date')} compreso.</p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>5) PERFEZIONAMENTO</h3>
        <p style={{fontSize: '8.5pt', textAlign: 'justify', marginBottom: '0.6rem'}}>
          Il contratto si riterrà perfezionato non appena il Proponente avrà conoscenza dell'accettazione sottoscritta dal Venditore.
        </p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>NOTE</h3>
        <div style={{ marginBottom: '1rem' }}>{inpFull('note')}</div>

        <div className="signature-grid" style={{marginBottom: '2rem'}}>
          <div className="signature-box" style={{textAlign: 'left'}}>
            Luogo e data: <br/><br/>
            Firma Proponente: <br/>
          </div>
        </div>

        <div style={{border: '2px solid black', padding: '10px', marginBottom: '0.5rem', fontSize: '9pt'}}>
          <h4 style={{textAlign: 'center', margin: '0 0 6px 0'}}>ACCETTAZIONE DEL VENDITORE</h4>
          <p>Il sottoscritto Venditore accetta integralmente la presente proposta.</p>
          <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma venditore: _________________</p>
        </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Modulo Proposta Acquisto" icon={<FileText size={20} />} preview={renderPreview()} clientName={data.p1Nome}>
    </ContractLayout>
  );
};
