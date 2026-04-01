import React, { useState } from 'react';
import { Banknote } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const CommissionStatement: React.FC = () => {
  const [data, setData] = useState({
    // Cliente
    nomeCliente: '',
    
    // Professionista (Recipient Box)
    profNome: 'Gemüt Capital',
    profIndirizzo: '',
    
    // Riferimento
    tipoAttivita: 'acquisto',
    dataProposta: '',
    proprietario: '',
    immUbicazione: '',
    
    // Corrispettivo
    importo: '',
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

  const row = (children: React.ReactNode) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 4px', marginBottom: '0.15rem' }}>
      {children}
    </div>
  );

  const renderPreview = () => (
    <div className="a4-page" style={{fontSize: '11pt', lineHeight: '1.6'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt" className="contract-logo" /></div>

      <div style={{
        background: '#4a4a4a',
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '11pt',
        padding: '6px 8px',
        marginBottom: '1.5rem',
        textTransform: 'uppercase'
      }}>
        Riconoscimento di Corrispettivo Professionale
      </div>

      <div style={{ border: '1px solid #000', marginBottom: '2rem', padding: '10px' }}>
        {row(<>
          <span>A spettanza di:</span>
          <strong>{inp('profNome', '300px')}</strong>
        </>)}
      </div>

      <div style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
        {row(<>
          <span>In riferimento all'attività professionale di supporto e consulenza relativa alla proposta di</span>
          <strong>{data.tipoAttivita}</strong>
          <span>del</span>
          {inp('dataProposta', '110px', 'date')}
        </>)}
        {row(<>
          <span>inerente l'immobile sito in</span>
          <strong>{inp('immUbicazione', '350px')}</strong>
        </>)}
      </div>

      <p style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
        {row(<>
          <span>Io sottoscritto</span>
          <strong>{inp('nomeCliente', '300px')}</strong>
          <span>, riconosco l'attività professionale svolta da {data.profNome}.</span>
        </>)}
      </p>

      <p style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
        {row(<>
          <span>Mi obbligo a corrispondere un corrispettivo professionale di Euro</span>
          <strong>{inp('importo', '90px')}</strong>
          <span>(Euro</span>{inp('importoLettere', '250px')}<span>) oltre IVA.</span>
        </>)}
      </p>

      <p style={{ marginBottom: '4rem', textAlign: 'justify', fontSize: '10pt', fontStyle: 'italic' }}>
        Il pagamento verrà effettuato contestualmente al perfezionamento dell'operazione o secondo gli accordi intercorsi tra le parti.
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
    <ContractLayout title="Corrispettivo Professionale" icon={<Banknote size={20} />} preview={renderPreview()} clientName={data.nomeCliente}>
    </ContractLayout>
  );
};
