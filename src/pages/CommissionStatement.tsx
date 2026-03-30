import React, { useState } from 'react';
import { Banknote } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const CommissionStatement: React.FC = () => {
  const [data, setData] = useState({
    // Cliente
    nomeCliente: '',
    
    // Agenzia
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };



  

  const renderPreview = () => (
    <div className="a4-page" style={{fontSize: '11pt', lineHeight: '1.8', margin: '0'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '13pt'}}>
        DICHIARAZIONE DI RICONOSCIMENTO PROVVIGIONE
      </h2>

      <p style={{marginBottom: '0.2rem'}}>
        Spett.le / Egr. Sig. <input type="text" name="agNominativo" value={data.agNominativo} onChange={handleChange} className="inline-input" style={{ width: '360px' }} />
      </p>
      <p style={{marginBottom: '0.2rem'}}>
        Via <input type="text" name="agVia" value={data.agVia} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> n. <input type="text" name="agCivico" value={data.agCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />
      </p>
      <p style={{marginBottom: '3rem'}}>
        CAP <input type="text" name="agCap" value={data.agCap} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> Città <input type="text" name="agCitta" value={data.agCitta} onChange={handleChange} className="inline-input" style={{ width: '240px' }} />
      </p>

      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>
        In riferimento alla proposta di {data.tipoProposta} irrevocabile inoltrata Vostro tramite in data <input type="date" name="dataProposta" value={data.dataProposta} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />,
        relativa all’immobile di proprietà <input type="text" name="proprietario" value={data.proprietario} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> sito in <input type="text" name="immComune" value={data.immComune} onChange={handleChange} className="inline-input" style={{ width: '240px' }} />
        Via <input type="text" name="immVia" value={data.immVia} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> n. <input type="text" name="immCivico" value={data.immCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />, piano <input type="text" name="immPiano" value={data.immPiano} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />, int. <input type="text" name="immInt" value={data.immInt} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />
      </p>

      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>
        Io sottoscritto <input type="text" name="nomeCliente" value={data.nomeCliente} onChange={handleChange} className="inline-input" style={{ width: '300px' }} />, dichiaro di riconoscere
        ed accettare l’attività di mediazione da Voi esperita e mi obbligo conseguentemente a corrispondervi la
        somma di Euro <input type="text" name="importoProvvigione" value={data.importoProvvigione} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> (Euro <input type="text" name="importoLettere" value={data.importoLettere} onChange={handleChange} className="inline-input" style={{ width: '240px' }} />)
        oltre IVA a titolo di provvigione. Il compenso maturerà all’avvenuta conoscenza da parte mia dell’accettazione
        della proposta di {data.tipoProposta} e sarà versato alla data prevista per il primo versamento di cui al punto 4b)
        della proposta o, in mancanza di questo, entro 30 gg. dalla data di comunicazione dell’accettazione della
        proposta di {data.tipoProposta}.
      </p>

      <p style={{marginBottom: '4rem'}}>
        Con i migliori saluti.
      </p>

      <div className="signature-grid">
        <div className="signature-box" style={{textAlign: 'left'}}>
          <input type="text" name="luogo" value={data.luogo} onChange={handleChange} className="inline-input" style={{ width: '120px' }} />, lì <input type="date" name="data" value={data.data} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /><br/><br/><br/>
          ...............................................................................<br/>
          (Il Dichiarante)
        </div>
      </div>
    </div>
  );

  return (
    <ContractLayout title="Dichiarazione Provvigionale" icon={<Banknote size={20} />} preview={renderPreview()}>
          </ContractLayout>
  );
};
