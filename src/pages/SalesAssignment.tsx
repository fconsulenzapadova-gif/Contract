import React, { useState } from 'react';
import { FileSignature } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const SalesAssignment: React.FC = () => {
  const [data, setData] = useState({
    // VENDITORE 1
    v1Nome: '', v1NatoA: '', v1NatoIl: '', v1ResidenteA: '', v1Via: '', v1Civico: '', v1Tel: '', v1CF: '', v1Email: '',
    v1Qualita: '', v1Societa: '', v1SocCF: '', v1SocPI: '', v1Sede: '',
    
    // VENDITORE 2
    v2Nome: '', v2NatoA: '', v2NatoIl: '', v2ResidenteA: '', v2Via: '', v2Civico: '', v2Tel: '', v2CF: '', v2Email: '',
    
    // AGENZIA (Recipient Box)
    agNome: '', agSede: '', agVia: '', agCivico: '', agCciaa: '', agRea: '', agPec: '',
    
    // IMMOBILE
    immComune: '', immVia: '', immCivico: '', immInt: '', immIntestataA: '', immUso: '', immComposizione: '', immProvenienza: '',
    
    // CATASO (3 righe)
    c1F: '', c1M: '', c1S: '', c1Cat: '', c1Cl: '', c1Vani: '', c1Mq: '', c1Rend: '',
    c2F: '', c2M: '', c2S: '', c2Cat: '', c2Cl: '', c2Vani: '', c2Mq: '', c2Rend: '',
    c3F: '', c3M: '', c3S: '', c3Cat: '', c3Cl: '', c3Vani: '', c3Mq: '', c3Rend: '',
    
    // STATO IMMOBILE
    statoImm: 'libero', canoneAnnuo: '', scadenzaContratto: '', altroStato: '',
    
    // DOCUMENTI
    docProvenienza: false, docPlanimetrie: false, docRegolamento: false, docApe: false, docAltroTesto: '',
    
    // CONFORMITA
    confUrbanistica: '', confImpianti: '', confPregiudizievoli: '', confApeEntro: '', confCatastale: '', spesOrdinarie: '', spesStraordinarie: '',
    
    // PREZZO E PROVVIGIONE E DURATA
    prezzo: '', residuoMutuo: '', dataMutuo: '', provvigionePerc: '', durataFinoAl: '', disdettaGiorni: '',
    
    // CONDIZIONI E PAGAMENTI
    caparraPerc: '', giorniAtto: '', dataConsegna: '',
    
    // ESCLUSIVA E PENALI
    esclusiva: 'B', speseMaxRecesso: '', penaleRecessoPerc: '', penaleRifiutoPerc: '',
    
    // AUTORIZZAZIONI E COMUNICAZIONI
    cartello: 'è', media: 'è', comTel: '', comPec: '', comFax: '', recessoLuogo: 'locale', note: ''
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
    <input type={type} name={name} value={data[name] as any} onChange={handleChange} className="inline-input" style={{ width, maxWidth: '100%' }} />
  );

  const inpFull = (name: keyof typeof data, type: string = 'text') => (
    <input type={type} name={name} value={data[name] as any} onChange={handleChange} className="inline-input" style={{ width: '100%', display: 'block', marginTop: '2px' }} />
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
          Incarico di Vendita Immobiliare
        </div>

        {/* BOX AGENZIA (Destinatario) */}
        <div style={{ border: '1px solid #000', marginBottom: '8px', padding: '3px 6px' }}>
          {row(<>
            <span>Destinatario (<strong>AGENZIA</strong>):</span>
            <strong>{inp('agNome', '200px')}</strong>
          </>)}
          {row(<>
            <span>Sede</span>{inp('agSede', '180px')}
            <span>via</span>{inp('agVia', '160px')}
            <span>n°</span>{inp('agCivico', '30px')}
          </>)}
          {row(<>
            <span>Iscritta CCIAA di</span>{inp('agCciaa', '120px')}
            <span>REA</span>{inp('agRea', '120px')}
            <span style={{ marginLeft: '1rem' }}>PEC</span>{inp('agPec', '220px')}
          </>)}
        </div>

        {/* VENDITORE / MANDANTE */}
        <div style={{ marginBottom: '0.5rem' }}>
          {row(<>
            <span>Il sottoscritto</span>
            <strong>{inp('v1Nome', '220px')}</strong>
            <span>nato/a il</span>
            <strong>{inp('v1NatoIl', '100px', 'date')}</strong>
          </>)}
          {row(<>
            <span>residente a</span>{inp('v1ResidenteA', '180px')}
            <span>via</span>{inp('v1Via', '160px')}
            <span>n°</span>{inp('v1Civico', '30px')}
          </>)}
          {row(<>
            <span>tel.</span>{inp('v1Tel', '90px')}
            <span>C.F.</span><strong>{inp('v1CF', '170px')}</strong>
          </>)}
          {row(<>
            <span>e-mail / PEC</span>{inp('v1Email', '280px')}
          </>)}
          {row(<>
            <span>in qualità di</span>{inp('v1Qualita', '120px')}
            <span>della</span>{inp('v1Societa', '220px')}
          </>)}
          {row(<>
            <span>Sede legale:</span>{inp('v1Sede', '360px')}
          </>)}

          {data.v2Nome && (
            <div style={{ marginTop: '0.4rem', borderTop: '1px dotted #ccc', paddingTop: '0.4rem' }}>
              {row(<><strong>{inp('v2Nome', '220px')}</strong><span>nato/a il</span>{inp('v2NatoIl', '100px', 'date')}</>)}
              {row(<><span>residente a</span>{inp('v2ResidenteA', '180px')}<span>via</span>{inp('v2Via', '160px')}<span>n°</span>{inp('v2Civico', '30px')}</>)}
              {row(<><span>tel.</span>{inp('v2Tel', '90px')}<span>C.F.</span><strong>{inp('v2CF', '170px')}</strong></>)}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', margin: '0.6rem 0', fontWeight: 'bold', fontSize: '11pt' }}>
          CONFERISCE INCARICO DI MEDIAZIONE
        </p>
        <p style={{ textAlign: 'center', marginBottom: '0.6rem', fontSize: '9pt', fontStyle: 'italic' }}>
          affinché l'Agenzia Immobiliare procuri un acquirente per l'immobile sotto descritto.
        </p>

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
        
        {[1,2,3].map(i => {
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
          {chk('statoImm', 'libero', 'libero o occupato dal proprietario and libero al rogito')}
          <span style={{marginLeft: '1rem'}}>
            {chk('statoImm', 'locato', 'locato con canone €')} {inp('canoneAnnuo', '65px')}
          </span>
        </div>

        <p style={{ marginTop: '0.6rem', marginBottom: '0.2rem', fontWeight: 'bold' }}>DOCUMENTI CONSEGNATI:</p>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '8.5pt' }}>
          <span>{data.docProvenienza ? '☑' : '☐'} atto provenienza</span>
          <span>{data.docPlanimetrie ? '☑' : '☐'} planimetrie</span>
          <span>{data.docRegolamento ? '☑' : '☐'} regolamento cond.</span>
          <span>{data.docApe ? '☑' : '☐'} APE</span>
        </div>
        {row(<><span>Altro:</span>{inp('docAltroTesto', '300px')}</>)}

        {/* 2) DICHIARAZIONI DEL VENDITORE */}
        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>2) DICHIARAZIONI DEL VENDITORE</h3>
        <div style={{ marginBottom: '0.2rem' }}><span>con riguardo alla conformità edilizia/urbanistica: </span>{inpFull('confUrbanistica')}</div>
        <div style={{ marginBottom: '0.2rem' }}><span>con riguardo alla conformità degli impianti: </span>{inpFull('confImpianti')}</div>
        <row>
          <span>con riguardo a esistenza di gravami:</span>{inp('confPregiudizievoli', '300px')}
        </row>
        {row(<>
          <span>APE da predisporre entro il:</span>{inp('confApeEntro', '110px', 'date')}
          <span>spese cond. €</span>{inp('spesOrdinarie', '60px')} / annui
        </row>

        {/* 3) PREZZO */}
        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>3) PREZZO DI VENDITA RICHIESTO</h3>
        {row(<>
          <span>€</span><strong>{inp('prezzo', '90px')}</strong>
          <span>comprensivo del residuo mutuo di €</span>{inp('residuoMutuo', '90px')}
        </>)}

        {/* 4, 5) COMPENSO E DURATA */}
        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.8rem 0 0.3rem 0'}}>4.5) COMPENSO E DURATA</h3>
        {row(<>
          <span>Provvigione:</span><strong>{inp('provvigionePerc', '30px')} % + IVA</strong>
          <span>Durata fino al:</span><strong>{inp('durataFinoAl', '100px', 'date')}</strong>
        </>)}
        <p style={{fontSize: '8pt', textAlign: 'justify', marginTop: '0.2rem'}}>
          Tacito rinnovo salvo disdetta inviata {inp('disdettaGiorni', '25px')} giorni prima.
        </p>
      </div>

      {/* PAGINA 2 */}
      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.4rem 0'}}>7, 8) CONDIZIONI DI PAGAMENTO E ATTO</h3>
        <p style={{fontSize: '8.5pt', textAlign: 'justify'}}>
          a) Caparra non inferiore al {inp('caparraPerc', '25px')}% del prezzo.
        </p>
        <p style={{fontSize: '8.5pt', textAlign: 'justify'}}>
          b) Atto notarile entro {inp('giorniAtto', '30px')} giorni dal preliminare. Consegna il {inp('dataConsegna', '100px', 'date')}.
        </p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.6rem 0 0.3rem 0'}}>10) ESCLUSIVA</h3>
        {chk('esclusiva', 'A', 'A) Non in esclusiva (rimborso spese max €')} {inp('speseMaxRecesso', '55px')} {')'}
        <br/>
        {chk('esclusiva', 'B', 'B) In esclusiva (penale se violata)')}

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.6rem 0 0.3rem 0'}}>11) PENALI</h3>
        {row(<>
          <span>Recesso/Violazione:</span>{inp('penaleRecessoPerc', '30px')} %
          <span>Rifiuto proposta conforme:</span>{inp('penaleRifiutoPerc', '30px')} %
        </>)}

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #eee', margin: '0.6rem 0 0.3rem 0'}}>12, 14, 15, 16) AUTORIZZAZIONI E NOTE</h3>
        <div style={{ fontSize: '8.5pt' }}>
          {row(<><span>Esposizione cartello:</span><strong>{data.cartello}</strong><span>; Diffusione media:</span><strong>{data.media}</strong></>)}
          {row(<><span>Comunicazioni tel:</span>{inp('comTel', '110px')}<span>PEC:</span>{inp('comPec', '180px')}</>)}
          {row(<><span>Incarico conferito presso:</span>{chk('recessoLuogo', 'locale', 'locale comm.')} {chk('recessoLuogo', 'domicilio', 'domicilio')}</>)}
          <br/>
          <span>Osservazioni:</span>
          {inpFull('note')}
        </div>

        <div className="signature-grid" style={{marginTop: '2rem'}}>
          <div className="signature-box" style={{textAlign: 'left'}}>
            Luogo e data: <br/><br/>
            Firma Venditore: <br/><br/>
            Firma Agenzia: <br/>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Incarico di Vendita" icon={<FileSignature size={20} />} preview={renderPreview()} clientName={data.v1Nome}>
    </ContractLayout>
  );
};
