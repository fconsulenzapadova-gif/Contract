import React, { useState } from 'react';
import { FileSignature } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const LeaseAssignment: React.FC = () => {
  const [data, setData] = useState({
    // LOCATORE / MANDANTE
    v1Nome: '', v1NatoA: '', v1CF: '', v1ResidenteA: '', v1Via: '', v1Email: '',
    
    // SOGGETTO INCARICATO (Gemüt)
    agNome: 'Gemüt Capital',
    
    // IMMOBILE
    immComune: '', immVia: '', immCivico: '', immUso: '',
    
    // CATASO
    c1F: '', c1M: '', c1S: '',
    
    // CANONE E CORRISPETTIVO
    prezzo: '', speseExtraMese: '', cauzioneMesi: '', corrispettivo: '', corrispettivoPerc: '', durataFinoAl: '',
    
    // ESCLUSIVA
    esclusiva: 'B', speseMaxRecesso: '',
    
    note: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
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

  const renderPreview = () => (
    <>
      <div className="a4-page" style={{fontSize: '9.5pt', lineHeight: '1.5'}}>
        <div className="contract-header"><img src="/logo.png" alt="Gemüt" className="contract-logo" /></div>

        <div style={{
          background: '#4a4a4a',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '11pt',
          padding: '6px 8px',
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          Incarico Professionale di Valorizzazione per la Locazione
        </div>

        <div style={{ marginBottom: '1rem' }}>
          {row(<><span>Il sottoscritto</span><strong>{inp('v1Nome', '220px')}</strong><span>nato a</span>{inp('v1NatoA', '130px')}<span>C.F.</span><strong>{inp('v1CF', '170px')}</strong></>)}
          {row(<><span>residente a</span>{inp('v1ResidenteA', '180px')}<span>via</span>{inp('v1Via', '180px')}<span>e-mail</span>{inp('v1Email', '240px')}</>)}
        </div>

        <p style={{ textAlign: 'center', margin: '1rem 0', fontWeight: 'bold' }}>CONFERISCE INCARICO A</p>
        
        <div style={{ border: '2px solid #000', padding: '10px', marginBottom: '1.5rem' }}>
          <strong>{data.agNome}</strong>, che accetta, per l'espletamento delle attività di valorizzazione e scouting finalizzate all'individuazione di potenziali conduttori per l'immobile sito in:
          <br/><br/>
          {row(<><span>Comune di</span>{inp('immComune', '180px')}<span>via</span>{inp('immVia', '200px')}<span>n.</span>{inp('immCivico', '40px')}</>)}
          {row(<><span>Dati Catastali: Foglio</span>{inp('c1F', '40px')}<span>Mappale</span>{inp('c1M', '50px')}<span>Sub</span>{inp('c1S', '40px')}</>)}
          <br/>
          <span>Destinazione d'uso: </span>{inp('immUso', '200px')}
        </div>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #333', marginBottom: '0.4rem'}}>OGGETTO DELL'ATTIVITÀ</h3>
        <p style={{fontSize: '9pt', textAlign: 'justify', marginBottom: '1rem'}}>
          L'attività di marketing e supporto operativo sarà finalizzata alla locazione dell'immobile al canone indicativo di <strong>€ {inp('prezzo', '90px')}</strong> / anno.
        </p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #333', marginBottom: '0.4rem'}}>DURATA E CORRISPETTIVO</h3>
        {row(<><span>Il presente incarico ha validità fino al</span><strong>{inp('durataFinoAl', '110px', 'date')}</strong></>)}
        <p style={{marginTop: '0.5rem', textAlign: 'justify'}}>
          A fronte dell'attività svolta, il Mandante riconoscerà a {data.agNome} un corrispettivo professionale pari a:
          <br/>
          <strong>€ {inp('corrispettivo', '80px')}</strong> oltre IVA.
        </p>

        <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #333', marginTop: '1rem', marginBottom: '0.4rem'}}>ESCLUSIVITÀ</h3>
        <p style={{fontSize: '9pt'}}>
          {chk('esclusiva', 'B', 'L\'incarico è conferito in esclusiva.')}
          <br/>
          {chk('esclusiva', 'A', 'L\'incarico NON è conferito in esclusiva.')}
        </p>

        <p style={{marginTop: '1.5rem'}}>Note:</p>
        <div style={{marginBottom: '1rem'}}>{inpFull('note')}</div>

        <div className="signature-grid" style={{marginTop: '3rem'}}>
          <div className="signature-box" style={{textAlign: 'left'}}>
            Luogo e data: <br/><br/>
            Firma Mandante: <br/><br/>
            Firma per Accettazione: <br/>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Incarico Valorizzazione Loc." icon={<FileSignature size={20} />} preview={renderPreview()} clientName={data.v1Nome}>
    </ContractLayout>
  );
};
