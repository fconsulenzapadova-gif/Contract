import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const AntiMoneyLaundering: React.FC = () => {
  const [data, setData] = useState({
    nomeCliente: '',
    cfCliente: '',
    residenzaCliente: '',
    documentoTipo: 'Carta d\'Identità',
    documentoNum: '',
    rilasciatoDa: '',
    dataRilascio: '',
    scadenza: '',
    luogo: '',
    data: '',
    agenziaNome: '',
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
    <>
      <div className="a4-page" style={{fontSize: '8.5pt', lineHeight: '1.25', textAlign: 'justify'}}>
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
          Modulo Antiriciclaggio
        </div>

        {/* BOX AGENZIA (Destinatario) */}
        <div style={{ border: '1px solid #000', marginBottom: '8px', padding: '3px 6px' }}>
          {row(<>
            <span>Spett.le / Egr. Sig. (<strong>AGENZIA</strong>):</span>
            <strong>{inp('agenziaNome', '200px')}</strong>
          </>)}
        </div>

        <h2 style={{textAlign: 'center', marginBottom: '0.5rem', fontSize: '10pt', fontWeight: 'bold'}}>
          IDENTIFICAZIONE E ADEGUATA VERIFICA DELLA CLIENTELA
        </h2>

        <p style={{marginBottom: '0.5rem', fontSize: '7.5pt', lineHeight: '1.2'}}>
          Gentile cliente, i dati personali da riportare nel modulo antiriciclaggio sono raccolti per adempiere agli obblighi
          di cui al D.Lgs. 231/2007. Il conferimento dei dati è pertanto obbligatorio.
          Il rifiuto di fornire le informazioni richieste può comportare l'impossibilità di eseguire l'operazione richiesta. Il
          trattamento dei dati sarà svolto per le predette finalità anche con strumenti elettronici in modo da garantire la riservatezza.
        </p>

        <div style={{border: '1px solid #000', padding: '6px 8px', marginBottom: '0.8rem'}}>
          {row(<>
            <span>Il/La sottoscritto/a</span>
            <strong>{inp('nomeCliente', '240px')}</strong>
          </>)}
          {row(<>
            <span>Codice Fiscale / P.IVA</span>
            <strong>{inp('cfCliente', '180px')}</strong>
          </>)}
          {row(<>
            <span>Residente / Sede legale in</span>
            <strong>{inp('residenzaCliente', '300px')}</strong>
          </>)}
          {row(<>
            <span>Identificato a mezzo:</span>
            {inp('documentoTipo', '120px')}
            <span>n°</span>
            {inp('documentoNum', '90px')}
          </>)}
          {row(<>
            <span>rilasciato da</span>{inp('rilasciatoDa', '120px')}
            <span>il</span>{inp('dataRilascio', '100px', 'date')}
            <span>scadenza il</span>{inp('scadenza', '100px', 'date')}
          </>)}
        </div>

        <h3 style={{fontSize: '9pt', fontWeight: 'bold', marginBottom: '0.2rem'}}>INFORMATIVA OBBLIGHI D.LGS. 231/2007</h3>
        <p style={{marginBottom: '0.4rem', fontSize: '7.5pt'}}>
          <strong>OBBLIGHI DEL CLIENTE: </strong> I clienti forniscono, sotto la propria responsabilità, tutte le informazioni necessarie per l'adeguata verifica.
        </p>
        <p style={{marginBottom: '0.4rem', fontSize: '7.5pt'}}>
          <strong>SANZIONI PENALI: </strong> Chi omette di indicare le generalità o le indica false è punito con multe e reclusione secondo l'Art. 55.
        </p>
        <p style={{marginBottom: '0.4rem', fontSize: '7.5pt'}}>
          <strong>PERSONE POLITICAMENTE ESPOSTE: </strong> Si intendono persone che occupano/hanno occupato cariche pubbliche, familiari o stretti collaboratori.
        </p>
        <p style={{marginBottom: '0.4rem', fontSize: '7.5pt'}}>
          <strong>TITOLARE EFFETTIVO: </strong> La persona fisica per conto della quale è realizzata un'operazione o che possiede/controlla un'entità giuridica.
        </p>

        <div className="signature-grid" style={{marginTop: '1.5rem'}}>
          <div className="signature-box" style={{textAlign: 'left'}}>
            {row(<>{inp('luogo', '90px')}<span>, lì</span>{inp('data', '110px', 'date')}</>)}
            <br/>
            Firma per presa visione del Cliente:<br/>
            ...............................................................................<br/>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Informativa Antiriciclaggio" icon={<Shield size={20} />} preview={renderPreview()} clientName={data.nomeCliente}>
    </ContractLayout>
  );
};
