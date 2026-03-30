import React, { useState } from 'react';
import { FileSignature } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const LeaseAssignment: React.FC = () => {
  const [data, setData] = useState({
    // LOCATORE 1
    v1Nome: '', v1NatoA: '', v1NatoIl: '', v1ResidenteA: '', v1Via: '', v1Civico: '', v1Tel: '', v1CF: '', v1Email: '',
    v1Qualita: '', v1Societa: '', v1SocCF: '', v1SocPI: '', v1Sede: '',
    
    // LOCATORE 2
    v2Nome: '', v2NatoA: '', v2NatoIl: '', v2ResidenteA: '', v2Via: '', v2Civico: '', v2Tel: '', v2CF: '', v2Email: '',
    
    // AGENZIA
    agNome: '', agSede: '', agVia: '', agCivico: '', agCciaa: '', agRea: '', agPec: '',
    
    // IMMOBILE
    immComune: '', immVia: '', immCivico: '', immInt: '', immIntestataA: '', immUso: '', immComposizione: '', immProvenienza: '',
    
    // CATASTO (3 righe)
    c1F: '', c1M: '', c1S: '', c1Cat: '', c1Cl: '', c1Vani: '', c1Mq: '', c1Rend: '',
    c2F: '', c2M: '', c2S: '', c2Cat: '', c2Cl: '', c2Vani: '', c2Mq: '', c2Rend: '',
    c3F: '', c3M: '', c3S: '', c3Cat: '', c3Cl: '', c3Vani: '', c3Mq: '', c3Rend: '',
    
    // STATO IMMOBILE
    statoImm: 'libero', canoneAnnuo: '', scadenzaContratto: '', altroStato: '',
    
    // DOCUMENTI
    docProvenienza: false, docPlanimetrie: false, docRegolamento: false, docApe: false, docAltroTesto: '',
    
    // CONFORMITA E SPESE
    confUrbanistica: '', confImpianti: '', confPregiudizievoli: '', confApeEntro: '', confCatastale: '',
    speseCondominiali: '', speseRiscaldamento: '', speseStraordinarie: '',
    
    // CANONE E PROVVIGIONE E DURATA
    prezzo: '', speseExtraMese: '', cauzioneMesi: '', provvigionePerc: '', durataFinoAl: '', disdettaGiorni: '',
    
    // CONDIZIONI E PAGAMENTI
    giorniContratto: '', dataConsegna: '',
    
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

  const f = (val: string | undefined, length: number = 20) => val || '_'.repeat(length);

  

  const renderPreview = () => (
    <>
      <div className="a4-page" style={{fontSize: '9.5pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <p style={{marginBottom: '0.2rem'}}>il sottoscritto <input type="text" name="v1Nome" value={data.v1Nome} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /> il <input type="date" name="v1NatoIl" value={data.v1NatoIl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>residente a <input type="text" name="v1ResidenteA" value={data.v1ResidenteA} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> via <input type="text" name="v1Via" value={data.v1Via} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="v1Civico" value={data.v1Civico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>tel. <input type="text" name="v1Tel" value={data.v1Tel} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> C.F. <input type="text" name="v1CF" value={data.v1CF} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>e-mail / PEC <input type="text" name="v1Email" value={data.v1Email} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>in qualità di <input type="text" name="v1Qualita" value={data.v1Qualita} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> della <input type="text" name="v1Societa" value={data.v1Societa} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>C.F. <input type="text" name="v1SocCF" value={data.v1SocCF} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> P.I. <input type="text" name="v1SocPI" value={data.v1SocPI} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '1rem'}}>Sede legale: <input type="text" name="v1Sede" value={data.v1Sede} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>

      {data.v2Nome && (
        <>
          <p style={{marginBottom: '0.2rem'}}><input type="text" name="v2Nome" value={data.v2Nome} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /> il <input type="date" name="v2NatoIl" value={data.v2NatoIl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
          <p style={{marginBottom: '0.2rem'}}>residente a <input type="text" name="v2ResidenteA" value={data.v2ResidenteA} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> via <input type="text" name="v2Via" value={data.v2Via} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="v2Civico" value={data.v2Civico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
          <p style={{marginBottom: '0.2rem'}}>tel. <input type="text" name="v2Tel" value={data.v2Tel} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> C.F. <input type="text" name="v2CF" value={data.v2CF} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /></p>
          <p style={{marginBottom: '0.2rem'}}>e-mail / PEC <input type="text" name="v2Email" value={data.v2Email} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
        </>
      )}
      <p style={{marginBottom: '1rem', marginTop:'0.5rem'}}>in seguito “LOCATORE” e/o “MANDANTE”, dichiarando di avere e/o rappresentare la piena proprietà o la disponibilità dell’immobile,</p>

      <h2 style={{textAlign: 'center', margin: '1rem 0', fontSize: '11pt'}}>CONFERISCE</h2>
      <p style={{marginBottom: '0.2rem'}}>all’agenzia di mediazione immobiliare <input type="text" name="agNome" value={data.agNome} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con sede in <input type="text" name="agSede" value={data.agSede} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> via <input type="text" name="agVia" value={data.agVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="agCivico" value={data.agCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>iscritta alla C.C.I.A.A. di <input type="text" name="agCciaa" value={data.agCciaa} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> REA n° <input type="text" name="agRea" value={data.agRea} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '1rem'}}>PEC <input type="text" name="agPec" value={data.agPec} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> in seguito denominata “AGENZIA IMMOBILIARE”;</p>

      <h2 style={{textAlign: 'center', margin: '1rem 0', fontSize: '12pt'}}>INCARICO DI MEDIAZIONE</h2>
      <p style={{marginBottom: '1rem'}}>affinché procuri un conduttore per l’immobile sotto descritto, alle condizioni di seguito indicate.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>1) DESCRIZIONE IMMOBILE</h3>
      <p style={{marginBottom: '0.2rem'}}>Comune <input type="text" name="immComune" value={data.immComune} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> via <input type="text" name="immVia" value={data.immVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="immCivico" value={data.immCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> Int. <input type="text" name="immInt" value={data.immInt} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Proprietà intestata a <input type="text" name="immIntestataA" value={data.immIntestataA} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> Destinazione d’uso <input type="text" name="immUso" value={data.immUso} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Composizione <input type="text" name="immComposizione" value={data.immComposizione} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Titolo di Provenienza <input type="text" name="immProvenienza" value={data.immProvenienza} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      
      {[1,2,3].map(i => {
        const di = data as any;
        const foglio = di[`c${i}F`];
        if(i > 1 && !foglio) return <span key={i}></span>;
        return (
          <p key={i} style={{marginBottom: '0.2rem'}}>
            {i > 1 ? 'e ' : ''}Dati Catastali: Foglio <span className="field">{f(foglio, 4)}</span> Mappale <span className="field">{f(di[`c${i}M`], 4)}</span> Sub <span className="field">{f(di[`c${i}S`], 4)}</span> categ. cat. <span className="field">{f(di[`c${i}Cat`], 4)}</span> classe <span className="field">{f(di[`c${i}Cl`], 4)}</span> vani <span className="field">{f(di[`c${i}Vani`], 4)}</span> mq <span className="field">{f(di[`c${i}Mq`], 4)}</span> rendita € <span className="field">{f(di[`c${i}Rend`], 10)}</span>
          </p>
        );
      })}

      <p style={{marginBottom: '0.2rem'}}>
        <span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'libero'})}>{data.statoImm === 'libero' ? '☑' : '☐'}</span> libero o occupato dal proprietario e libero alla firma
        &nbsp;&nbsp;&nbsp;<span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'locato'})}>{data.statoImm === 'locato' ? '☑' : '☐'}</span> locato al canone annuo attuale di € <input type="text" name="canoneAnnuo" value={data.canoneAnnuo} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> con contratto scadente il <input type="date" name="scadenzaContratto" value={data.scadenzaContratto} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />
      </p>
      <p style={{marginBottom: '1rem'}}><span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'altro'})}>{data.statoImm === 'altro' ? '☑' : '☐'}</span> altro <input type="text" name="altroStato" value={data.altroStato} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>

      <p style={{marginBottom: '0.2rem'}}>Il Locatore consegna all’Agenzia Immobiliare i seguenti documenti:</p>
      <p style={{marginBottom: '0.2rem'}}>
        {data.docProvenienza ? '☑' : '☐'} copia atto di titolo/provenienza &nbsp;&nbsp; {data.docPlanimetrie ? '☑' : '☐'} copia planimetrie catastali &nbsp;&nbsp; {data.docRegolamento ? '☑' : '☐'} regol. condominiale &nbsp;&nbsp; {data.docApe ? '☑' : '☐'} ACE/APE
      </p>
      <p style={{marginBottom: '1rem'}}>
        {data.docAltroTesto ? '☑' : '☐'} altro <input type="text" name="docAltroTesto" value={data.docAltroTesto} onChange={handleChange} className="inline-input" style={{ width: '360px' }} />
      </p>
      <p style={{marginBottom: '1rem'}}>Il Locatore si obbliga a fornire all’Agenzia Immobiliare tutta la documentazione necessaria per l’espletamento del presente incarico.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>2) DICHIARAZIONI DEL LOCATORE</h3>
      <p style={{marginBottom: '0.2rem'}}>Il Locatore dichiara che l’immobile è:</p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla conformità edilizia e urbanistica per la destinazione d'uso: <input type="text" name="confUrbanistica" value={data.confUrbanistica} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla conformità e allo stato degli impianti alle normative vigenti: <input type="text" name="confImpianti" value={data.confImpianti} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo all’APE (Attestato Prestazione Energetica) da predisporre a cura del Locatore entro il <input type="date" name="confApeEntro" value={data.confApeEntro} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo all’intestazione della ditta catastale e conformità della planimetria: <input type="text" name="confCatastale" value={data.confCatastale} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alle spese condominiali: - spese gestione ordinaria e/o riscaldamento circa € <input type="text" name="speseCondominiali" value={data.speseCondominiali} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> + € <input type="text" name="speseRiscaldamento" value={data.speseRiscaldamento} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> annui;</p>
      <p style={{marginBottom: '1rem'}}>- eventuali spese straordinarie previste circa € <input type="text" name="speseStraordinarie" value={data.speseStraordinarie} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /></p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>3) CANONE DI LOCAZIONE RICHIESTO</h3>
      <p style={{marginBottom: '1rem'}}>€ <input type="text" name="prezzo" value={data.prezzo} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> annui, oltre spese accessorie stimate in circa € <input type="text" name="speseExtraMese" value={data.speseExtraMese} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> / mese. E' richiesta una cauzione pari a <input type="text" name="cauzioneMesi" value={data.cauzioneMesi} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> mensilità del canone.</p>
      </div>
      
      <div className="a4-page" style={{fontSize: '9.5pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>4) COMPENSO DI MEDIAZIONE</h3>
      <p style={{marginBottom: '0.2rem'}}>PROVVIGIONE del <input type="text" name="provvigionePerc" value={data.provvigionePerc} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />% + IVA, CALCOLATA SUL CANONE DI LOCAZIONE ANNUO A REGIME.</p>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>Il compenso maturerà all’avvenuta conoscenza da parte del conduttore dell’accettazione della proposta di locazione e sarà corrisposto dal Locatore all’Agenzia Immobiliare. La provvigione pattuita sarà comunque dovuta nel caso di locazione con soggetti che l’agente immobiliare abbia segnalato in esecuzione dell’incarico, anche qualora la stipulazione avvenga dopo la scadenza di quest’ultimo.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>5) DURATA DELL’INCARICO</h3>
      <p style={{marginBottom: '0.2rem'}}>La durata dell’incarico è da oggi fino al giorno <input type="date" name="durataFinoAl" value={data.durataFinoAl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />, dopodiché:</p>
      <p style={{marginBottom: '0.2rem'}}>☐ si intenderà cessato a tutti gli effetti senza oneri e vincoli per il Locatore;</p>
      <p style={{marginBottom: '1rem'}}>☑ si intenderà tacitamente rinnovato per ugual periodo e per una sola volta alle stesse condizioni dell’incarico originario, salvo disdetta pervenuta all’Agenzia Immobiliare a mezzo raccomandata A/R, fax o PEC, almeno <input type="text" name="disdettaGiorni" value={data.disdettaGiorni} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> giorni prima della scadenza.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>6) PROPOSTA DI LOCAZIONE</h3>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>L’Agenzia Immobiliare è autorizzata a far sottoscrivere agli aspiranti conduttori una proposta di locazione, e a comunicare agli stessi l’avvenuta accettazione; a ricevere e trattenere fiduciariamente gli eventuali assegni o importi non trasferibili intestati al Locatore a titolo di deposito, i quali dovranno essere consegnati dopo che l’aspirante conduttore avrà avuto conoscenza dell’accettazione del Locatore (diventando caparra confirmatoria), ovvero dovranno essere restituiti agli aspiranti conduttori in caso di mancata accettazione.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>7, 8) SOTTOSCRIZIONE CONTRATTO</h3>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>Il contratto di locazione dovrà essere stipulato e sottoscritto entro <input type="text" name="giorniContratto" value={data.giorniContratto} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> giorni dal perfezionamento in vincolo contrattuale della proposta di locazione. I costi di registrazione, di bollo ed eventuali altri oneri di legge saranno ripartiti tra le parti come per norma. L'immobile dovrà essere consegnato nello stato di fatto promesso, libero da oneri e in regola per l'uso prestabilito.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>9) CONSEGNA DELL’IMMOBILE</h3>
      <p style={{marginBottom: '1rem'}}>L’immobile sarà consegnato alla data del <input type="date" name="dataConsegna" value={data.dataConsegna} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />, libero da cose e persone (salvo diversamente concordato).</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>10) ESCLUSIVA</h3>
      <p style={{marginBottom: '0.2rem'}}>Il presente incarico viene conferito:</p>
      <p style={{marginBottom: '0.2rem'}}><strong>A) non in esclusiva</strong><br/>In tal caso il Locatore potrà locare l’immobile direttamente o tramite altre agenzie senza nulla dovere all’Agenzia Immobiliare, rimborsando alla stessa le spese documentate sostenute fino all’ammontare massimo di € <input type="text" name="speseMaxRecesso" value={data.speseMaxRecesso} onChange={handleChange} className="inline-input" style={{ width: '60px' }} />. Il Locatore si obbliga a comunicare immediatamente l’avvenuta locazione.</p>
      <p style={{marginBottom: '0.2rem'}}><strong>B) in esclusiva</strong><br/>In tal caso il Locatore si impegna a non conferire incarico ad altre agenzie, né a terzi, né a locare l’immobile direttamente. La violazione comporterà il pagamento della penale al punto 11a). In tal ipotesi l'Agenzia rinuncia al rimborso spese in caso di mancata conclusione.</p>
      <p style={{marginBottom: '1rem'}}>In relazione a quanto sopra il Locatore dichiara di optare per l’alternativa: <br/><span className="inline-checkbox" onClick={() => setData({...data, esclusiva: 'A'})}>{data.esclusiva === 'A' ? '☑' : '☐'}</span> A) non in esclusiva &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="inline-checkbox" onClick={() => setData({...data, esclusiva: 'B'})}>{data.esclusiva === 'B' ? '☑' : '☐'}</span> B) in esclusiva</p>
      </div>

      <div className="a4-page" style={{fontSize: '9.5pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>11) CLAUSOLA PENALE</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>Una penale sarà dovuta dal Locatore all’Agenzia Immobiliare nella misura e per i casi indicati:<br/>a) penale pari al <input type="text" name="penaleRecessoPerc" value={data.penaleRecessoPerc} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />% della provvigione nei seguenti casi: recesso dall’incarico prima della sua naturale scadenza; violazione dell’eventuale obbligo di esclusiva;<br/>b) penale pari al <input type="text" name="penaleRifiutoPerc" value={data.penaleRifiutoPerc} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />% della provvigione pattuita in caso di rifiuto del Locatore di accettare una proposta di locazione conforme al presente incarico e con buone garanzie del conduttore.<br/>Sarà invece dovuta dall’Agenzia al Locatore una penale pari alla provvigione in caso di: recesso ingiustificato dall'incarico o mancata comunicazione di proposte conformi.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>12, 13) CORRISPONDENTI E OBBLIGHI AGENZIA</h3>
      <p style={{marginBottom: '0.2rem'}}>L’Agenzia Immobiliare: <span style={{fontWeight:'bold'}}>{data.cartello}</span> autorizzata ad esporre il cartello di locazione in loco.</p>
      <p style={{marginBottom: '1rem'}}><span style={{fontWeight:'bold'}}>{data.media}</span> autorizzata a diffondere foto e planimetrie sia in forma cartacea che telematica.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>14) COMUNICAZIONI ED ACCETTAZIONE DELL’INCARICO</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>Il Locatore autorizza l’Agenzia ad effettuare comunicazioni al n. tel. <input type="text" name="comTel" value={data.comTel} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> e/o a mezzo PEC all'indirizzo <input type="text" name="comPec" value={data.comPec} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> o fax al numero <input type="text" name="comFax" value={data.comFax} onChange={handleChange} className="inline-input" style={{ width: '120px' }} />.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>15) DIRITTO DI RECESSO</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>Ai sensi del d.Lgs. 206/2005 (Codice del consumo) se stipulato fuori dai locali commerciali, è concessa al locatore consumatore la facoltà di recesso entro 14 giorni. Il presente incarico viene conferito presso:</p>
      <p style={{marginBottom: '1rem'}}><span className="inline-checkbox" onClick={() => setData({...data, recessoLuogo: 'locale'})}>{data.recessoLuogo === 'locale' ? '☑' : '☐'}</span> Il locale commerciale dell’agenzia &nbsp;&nbsp;&nbsp;&nbsp; <span className="inline-checkbox" onClick={() => setData({...data, recessoLuogo: 'domicilio'})}>{data.recessoLuogo === 'domicilio' ? '☑' : '☐'}</span> Il domicilio del locatore o altro luogo</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>16) OSSERVAZIONI e NOTE</h3>
      <p style={{marginBottom: '2rem'}}><input type="text" name="note" value={data.note} onChange={handleChange} className="inline-input" style={{ width: '600px' }} /></p>

      <div className="signature-grid">
        <div className="signature-box" style={{textAlign: 'left'}}>
          Luogo e data<br/>
          ...............................................................................<br/><br/>
          Firma Locatore<br/>
          ...............................................................................<br/><br/>
          Agenzia Immobiliare per accettazione incarico<br/>
          ...............................................................................<br/>
        </div>
      </div>
      
      <p style={{marginTop: '2rem', fontSize: '9pt', textAlign: 'justify'}}>
        Ai sensi e per gli effetti degli articoli 1341 e 1342 Cod. Civ. il Locatore dichiara di approvare espressamente le seguenti clausole: 5) durata e proroga dell’incarico; 10) esclusiva se concessa; 11) penale.
      </p>
      <div className="signature-box" style={{textAlign: 'left', marginTop: '1rem'}}>
          Firma Locatore<br/>
          ...............................................................................<br/>
      </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Incarico di Locazione" icon={<FileSignature size={20} />} preview={renderPreview()} clientName={data.v1Nome}>
          </ContractLayout>
  );
};
