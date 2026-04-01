import React, { useState } from 'react';
import { Banknote } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const CommissionStatement: React.FC = () => {
  const [data, setData] = useState({
    // Cliente
    nomeCliente: '',
    
    // Agenzia (Recipient Box)
    agNominativo: '',
    agVia: '',
    agCivico: '',
    agCap: '',
    agCitta: '',
    
    // Proposta e Immobile
    tipoProposta: 'acquisto',
    dataProposta: '',
    proprietario: '',
    immComune: '',
    immVia: '',
    immCivico: '',
    immPiano: '',
    immInt: '',
    
    // Provvigione
    importoProvvigione: '',
    importoLettere: '',
    
    // Fine
    luogo: '',
    data: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
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

  const renderPreview = () => (
    <div className="a4-page" style={{fontSize: '11pt', lineHeight: '1.6'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>

      {/* BARRA TITOLO */}
      <div style={{
        background: '#4a4a4a',
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '11pt',
        padding: '6px 8px',
        marginBottom: '1rem',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
      }}>
        Dichiarazione Riconoscimento Provvigione
      </div>

      {/* BOX AGENZIA (Destinatario) */}
      <div style={{ border: '1px solid #000', marginBottom: '2rem', padding: '10px' }}>
        {row(<>
          <span>Spett.le / Egr. Sig.</span>
          <strong>{inp('agNominativo', '300px')}</strong>
        </>)}
        {row(<>
          <span>Via</span>{inp('agVia', '220px')}
          <span>n.</span>{inp('agCivico', '40px')}
        </>)}
        {row(<>
          <span>CAP</span>{inp('agCap', '70px')}
          <span>Città</span>{inp('agCitta', '240px')}
        </>)}
      </div>

      <div style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
        {row(<>
          <span>In riferimento alla proposta di</span>
          <strong>{data.tipoProposta}</strong>
          <span>inoltrata tramite Voi in data</span>
          {inp('dataProposta', '110px', 'date')}
        </>)}
        {row(<>
          <span>relativa all'immobile di proprietà di</span>
          <strong>{inp('proprietario', '240px')}</strong>
        </>)}
        {row(<>
          <span>sito in</span>{inp('immComune', '200px')}
          <span>Via</span>{inp('immVia', '200px')}
          <span>n.</span>{inp('immCivico', '35px')}
        </>)}
        {row(<>
          <span>piano</span>{inp('immPiano', '35px')}
          <span>int.</span>{inp('immInt', '35px')}
        </>)}
      </div>

      <p style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
        {row(<>
          <span>Io sottoscritto</span>
          <strong>{inp('nomeCliente', '300px')}</strong>
          <span>, dichiaro di riconoscere ed accettare l'attività di mediazione da Voi esperita.</span>
        </>)}
      </p>

      <p style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
        {row(<>
          <span>Mi obbligo a corrispondere la somma di Euro</span>
          <strong>{inp('importoProvvigione', '90px')}</strong>
          <span>(Euro</span>{inp('importoLettere', '250px')}<span>) oltre IVA.</span>
        </>)}
      </p>

      <p style={{ marginBottom: '3rem', textAlign: 'justify', fontSize: '10pt' }}>
        Il compenso maturerà all'avvenuta conoscenza dell'accettazione della proposta e sarà versato alla data prevista per il primo versamento o entro 30 giorni dalla comunicazione dell'accettazione.
      </p>

      <p style={{ marginBottom: '4rem' }}>
        Con i migliori saluti.
      </p>

      <div className="signature-grid">
        <div className="signature-box" style={{textAlign: 'left'}}>
          {row(<>{inp('luogo', '120px')}<span>, lì</span>{inp('data', '110px', 'date')}</>)}
          <br/><br/>
          ...............................................................................<br/>
          (Il Dichiarante)
        </div>
      </div>
    </div>
  );

  return (
    <ContractLayout title="Dichiarazione Provvigionale" icon={<Banknote size={20} />} preview={renderPreview()} clientName={data.nomeCliente}>
    </ContractLayout>
  );
};
