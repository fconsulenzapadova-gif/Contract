import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const AntiMoneyLaundering: React.FC = () => {
  const [data, setData] = useState({
    // Cliente
    nome: '', natoA: '', natoIl: '', CF: '', residA: '', via: '', prov: '',
    docTipo: 'carta_identita', docNum: '', docRilascio: '', docScadenza: '', docDa: '',
    
    // Professionista (Recipient Box)
    profNome: 'Gemüt Capital',
    
    // Dichiarazione
    attività: '', scopo: '',
    data: '', luogo: ''
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
        Identificazione Cliente ai fini Professionali
      </div>

      <div style={{ border: '1px solid #000', marginBottom: '2rem', padding: '10px' }}>
        {row(<>
          <span>A spettanza di:</span>
          <strong>{inp('profNome', '300px')}</strong>
        </>)}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        {row(<>
          <span>Il sottoscritto</span>
          <strong>{inp('nome', '300px')}</strong>
        </>)}
        {row(<>
          <span>nato a</span>
          {inp('natoA', '200px')}
          <span>il</span>
          {inp('natoIl', '110px', 'date')}
        </>)}
        {row(<>
          <span>Codice Fiscale:</span>
          <strong>{inp('CF', '180px')}</strong>
        </>)}
        {row(<>
          <span>residente a</span>
          {inp('residA', '220px')}
          <span>via</span>
          {inp('via', '250px')}
        </>)}
      </div>

      <h3 style={{fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #333', marginBottom: '0.4rem'}}>ESTREMI DOCUMENTO D'IDENTITÀ</h3>
      <div style={{ marginBottom: '1.5rem' }}>
        {row(<>
          <span>Tipo</span>
          {inp('docTipo', '150px')}
          <span>n°</span>
          {inp('docNum', '150px')}
        </>)}
        {row(<>
          <span>Rilasciato il</span>
          {inp('docRilascio', '110px', 'date')}
          <span>da</span>
          {inp('docDa', '200px')}
        </>)}
        {row(<>
          <span>Scade il</span>
          {inp('docScadenza', '110px', 'date')}
        </>)}
      </div>

      <p style={{ marginBottom: '1.5rem', textAlign: 'justify', fontSize: '9pt' }}>
        Il sottoscritto identifica se stesso ai fini del conferimento di incarico professionale, dichiarando sotto la propria responsabilità la veridicità dei dati forniti sopra indicati.
      </p>

      <div className="signature-grid" style={{marginTop: '3rem'}}>
        <div className="signature-box" style={{textAlign: 'left'}}>
          {row(<>{inp('luogo', '120px')}<span>, lì</span>{inp('data', '110px', 'date')}</>)}
          <br/><br/>
          ...............................................................................<br/>
          (Firma del Dichiarante)
        </div>
      </div>
    </div>
  );

  return (
    <ContractLayout title="Modulo Identificazione" icon={<ShieldCheck size={20} />} preview={renderPreview()} clientName={data.nome}>
    </ContractLayout>
  );
};
