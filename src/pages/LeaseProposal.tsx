import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const LeaseProposal: React.FC = () => {
  const [data, setData] = useState({
    // PROPONENTE 1
    p1Nome: '', p1NatoA: '', p1NatoIl: '', p1ResidenteA: '', p1Via: '', p1Civico: '', p1Tel: '', p1CF: '', p1Email: '',
    p1Qualita: '', p1Societa: '', p1PIVA: '', p1Sede: '',
    
    // PROPONENTE 2
    p2Nome: '', p2NatoA: '', p2NatoIl: '', p2ResidenteA: '', p2Via: '', p2Civico: '', p2Tel: '', p2CF: '', p2Email: '',
    
    // AGENZIA
    agNome: '', agSede: '', agVia: '', agCivico: '', agCF: '', agPIVA: '', agCciaa: '', agRea: '', agPec: '',
    
    // IMMOBILE E CATASTO
    immComune: '', immVia: '', immCivico: '', immInt: '', immIntestataA: '', immUso: '', immComposizione: '',
    finalitaUso: '',
    c1F: '', c1M: '', c1S: '', c1Cat: '', c1Cl: '', c1Vani: '', c1Mq: '', c1Rend: '',
    c2F: '', c2M: '', c2S: '', c2Cat: '', c2Cl: '', c2Vani: '', c2Mq: '', c2Rend: '',
    c3F: '', c3M: '', c3S: '', c3Cat: '', c3Cl: '', c3Vani: '', c3Mq: '', c3Rend: '',
    
    // DICHIARAZIONI LOCATORE
    confUrbanistica: '', 
    statoImpianti: 'a_norma', impiantiAdeguareDa: '', 
    confApe: '', 
    speseCondominiali: '', speseRiscaldamento: '', riscRate: '', riscImpianto: '',
    
    // CANONE
    canoneAnnuo: '', canoneNumRate: '', canoneRata: '',
    soggettoIva: 'no', ivaAliquota: '22',
    aggiornamentoIstat: '100',
    
    // CAUZIONE
    cauzioneImporto: '', cauzioneMesi: '', cauzioneMezzo: '',
    
    // ONERI
    oneriTipo: 'richiesta', oneriForfaitAnnui: '', oneriForfaitRate: '', oneriForfaitImportoRata: '',
    oneriConguaglio: 'acconto',
    
    // PATTI
    attivitaX: '', contattoPubblico: 'no', pattiExtra: '',
    
    // DURATA
    tipoContratto: '3.1', sottoTipo31: '6+6', mesiTransitorio31: '',
    sottoTipo32: '4+4', usoTransitorio32: '', altro32: '',
    durataAnniMesi: '', decorrenzaDal: '', decorrenzaAl: '',
    
    // DEPOSITO FIDUCIARIO
    depositoImporto: '',
    depositoMezzo: 'assegno', depositoAssegno: '', depositoBanca: '', depositoAgenzia: '', depositoAltro: '',
    
    // CONSEGNA E FINALI
    dataConsegna: '', dataDecorrenzaEffettiva: '', dataSottoscrizione: '',
    giorniIrrevocabile: '', dataIrrevocabile: '',
    provvigione: '',
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

  const f = (val: string | undefined, length: number = 20) => val || '_'.repeat(length);


  

  const renderPreview = () => (
    <>
      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <p style={{marginBottom: '0.2rem'}}>Spett.le / Egr. Sig.</p>
      <p style={{marginBottom: '0.2rem'}}><input type="text" name="p1Nome" value={data.p1Nome} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /> il <input type="date" name="p1NatoIl" value={data.p1NatoIl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>residente a <input type="text" name="p1ResidenteA" value={data.p1ResidenteA} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> via <input type="text" name="p1Via" value={data.p1Via} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="p1Civico" value={data.p1Civico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>tel. <input type="text" name="p1Tel" value={data.p1Tel} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> C.F. <input type="text" name="p1CF" value={data.p1CF} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>e-mail / PEC <input type="text" name="p1Email" value={data.p1Email} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>in qualità di <input type="text" name="p1Qualita" value={data.p1Qualita} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> della <input type="text" name="p1Societa" value={data.p1Societa} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>P.IVA <input type="text" name="p1PIVA" value={data.p1PIVA} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> Sede legale <input type="text" name="p1Sede" value={data.p1Sede} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /></p>

      {data.p2Nome && (
        <div style={{marginTop: '0.5rem'}}>
          <p style={{marginBottom: '0.2rem'}}><input type="text" name="p2Nome" value={data.p2Nome} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /> il <input type="date" name="p2NatoIl" value={data.p2NatoIl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
          <p style={{marginBottom: '0.2rem'}}>residente a <input type="text" name="p2ResidenteA" value={data.p2ResidenteA} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> via <input type="text" name="p2Via" value={data.p2Via} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="p2Civico" value={data.p2Civico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
          <p style={{marginBottom: '0.2rem'}}>tel. <input type="text" name="p2Tel" value={data.p2Tel} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> C.F. <input type="text" name="p2CF" value={data.p2CF} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /></p>
          <p style={{marginBottom: '0.2rem'}}>e-mail / PEC <input type="text" name="p2Email" value={data.p2Email} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
        </div>
      )}

      <p style={{marginBottom: '0.2rem', marginTop: '0.5rem'}}>in seguito “Proponente” tramite l’Agenzia di mediazione Immobiliare <input type="text" name="agNome" value={data.agNome} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con sede in <input type="text" name="agSede" value={data.agSede} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> via <input type="text" name="agVia" value={data.agVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="agCivico" value={data.agCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>C.F. <input type="text" name="agCF" value={data.agCF} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> P.IVA <input type="text" name="agPIVA" value={data.agPIVA} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>iscritta alla CCIAA di <input type="text" name="agCciaa" value={data.agCciaa} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> REA n° <input type="text" name="agRea" value={data.agRea} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> PEC <input type="text" name="agPec" value={data.agPec} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /></p>
      <p style={{marginBottom: '1rem'}}>in seguito denominata “Agenzia Immobiliare”;</p>

      <p style={{textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold'}}>
        PROMETTE IRREVOCABILMENTE DI CONDURRE IN LOCAZIONE<br/>
        a corpo e non a misura, l’immobile sotto descritto, alle condizioni di seguito indicate.
      </p>

      {/* 1) DESCRIZIONE IMMOBILE */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>1) DESCRIZIONE IMMOBILE</h3>
      <p style={{marginBottom: '0.2rem'}}>Comune <input type="text" name="immComune" value={data.immComune} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> via <input type="text" name="immVia" value={data.immVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="immCivico" value={data.immCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> int. <input type="text" name="immInt" value={data.immInt} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Proprietà intestata a <input type="text" name="immIntestataA" value={data.immIntestataA} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> Destinazione d’uso <input type="text" name="immUso" value={data.immUso} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Composizione <input type="text" name="immComposizione" value={data.immComposizione} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>
      
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

      <p style={{marginBottom: '0.2rem'}}>Il Proponente non potrà destinare l’immobile ad un uso diverso da quello sopra indicato né sublocarlo in tutto o in parte né cedere il contratto di locazione, fatte salve le diverse disposizioni di legge.</p>
      <p style={{marginBottom: '0.8rem'}}>Il Proponente dichiara che utilizzerà l’immobile per <input type="text" name="finalitaUso" value={data.finalitaUso} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>

      {/* a) DICHIARAZIONI LOCATORE */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>1.a) DICHIARAZIONI DEL LOCATORE</h3>
      <p style={{marginBottom: '0.2rem'}}>Il Locatore ha dichiarato all’Agenzia Immobiliare che: con riguardo alla conformità dell’immobile alle norme edilizie e urbanistiche per la destinazione d’uso sopra indicata: <input type="text" name="confUrbanistica" value={data.confUrbanistica} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla conformità degli impianti alle normative vigenti:</p>
      <p style={{marginBottom: '0.2rem'}}><span className="inline-checkbox" onClick={() => setData({...data, statoImpianti: 'a_norma'})}>{data.statoImpianti === 'a_norma' ? '☑' : '☐'}</span> a norma e dotati dei relativi certificati di conformità</p>
      <p style={{marginBottom: '0.2rem'}}><span className="inline-checkbox" onClick={() => setData({...data, statoImpianti: 'da_adeguare'})}>{data.statoImpianti === 'da_adeguare' ? '☑' : '☐'}</span> non a norma e da adeguare a regola d’arte a cura e spese del <input type="text" name="impiantiAdeguareDa" value={data.impiantiAdeguareDa} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> con produzione dei relativi certificati di conformità</p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo all’APE (Attestato di Prestazione Energetica): <input type="text" name="confApe" value={data.confApe} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alle spese condominiali:</p>
      <p style={{marginBottom: '0.2rem'}}>• spese gestione ordinaria circa € <input type="text" name="speseCondominiali" value={data.speseCondominiali} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> annui come da ultimo consuntivo;</p>
      <p style={{marginBottom: '0.8rem'}}>• spese di riscaldamento: circa € <input type="text" name="speseRiscaldamento" value={data.speseRiscaldamento} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> annui come da ultimo consuntivo, da pagarsi in/ogni <input type="text" name="riscRate" value={data.riscRate} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> l’impianto di riscaldamento è <input type="text" name="riscImpianto" value={data.riscImpianto} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> e con l’accettazione della presente proposta conferma integralmente dette dichiarazioni.</p>
      </div>

      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      {/* 2) CANONE */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>2) CANONE DI LOCAZIONE OFFERTO</h3>
      <p style={{marginBottom: '0.2rem'}}>€ <input type="text" name="canoneAnnuo" value={data.canoneAnnuo} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> annui oltre oneri accessori, da pagarsi in <input type="text" name="canoneNumRate" value={data.canoneNumRate} onChange={handleChange} className="inline-input" style={{ width: '18px' }} /> uguali rate anticipate di € <input type="text" name="canoneRata" value={data.canoneRata} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> ciascuna.</p>
      <p style={{marginBottom: '0.8rem'}}>Il canone {data.soggettoIva === 'si' ? '☑ sarà' : '☐ sarà'} {data.soggettoIva === 'no' ? '☑ non sarà' : '☐ non sarà'} assoggettato ad Iva. In caso positivo, l’Iva sarà applicata all’aliquota di legge, attualmente del <input type="text" name="ivaAliquota" value={data.ivaAliquota} onChange={handleChange} className="inline-input" style={{ width: '18px' }} />%</p>

      {/* a) AGGIORNAMENTO */}
      <p style={{marginBottom: '0.2rem'}}><strong>a) AGGIORNAMENTO DEL CANONE</strong></p>
      <p style={{marginBottom: '0.8rem'}}>Il canone sarà aggiornato annualmente nella misura del <input type="text" name="aggiornamentoIstat" value={data.aggiornamentoIstat} onChange={handleChange} className="inline-input" style={{ width: '18px' }} />% della variazione dell’indice ISTAT FOI.</p>

      <p style={{marginBottom: '0.2rem'}}><strong>b) DEPOSITO CAUZIONALE</strong></p>
      <p style={{marginBottom: '0.8rem'}}>Al momento della sottoscrione... il Proponente verserà l’importo di € <input type="text" name="cauzioneImporto" value={data.cauzioneImporto} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> pari a <input type="text" name="cauzioneMesi" value={data.cauzioneMesi} onChange={handleChange} className="inline-input" style={{ width: '18px' }} /> mensilità a mezzo <input type="text" name="cauzioneMezzo" value={data.cauzioneMezzo} onChange={handleChange} className="inline-input" style={{ width: '180px' }} />. (La fideiussione dovrà avere validità... ecc).</p>

      <p style={{marginBottom: '0.2rem'}}><strong>c) ONERI CONDOMINIALI</strong></p>
      <p style={{marginBottom: '0.2rem'}}><span className="inline-checkbox" onClick={() => setData({...data, oneriTipo: 'richiesta'})}>{data.oneriTipo === 'richiesta' ? '☑' : '☐'}</span> su semplice richiesta di questi, le quote a lui imputabili. Al termine dell’esercizio verranno eseguiti gli eventuali conguagli;</p>
      <p style={{marginBottom: '0.2rem'}}><span className="inline-checkbox" onClick={() => setData({...data, oneriTipo: 'forfait'})}>{data.oneriTipo === 'forfait' ? '☑' : '☐'}</span> la somma di € <input type="text" name="oneriForfaitAnnui" value={data.oneriForfaitAnnui} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> da liquidarsi contestualmente alle scadenze del canone in <input type="text" name="oneriForfaitRate" value={data.oneriForfaitRate} onChange={handleChange} className="inline-input" style={{ width: '18px' }} /> rate anticipate di € <input type="text" name="oneriForfaitImportoRata" value={data.oneriForfaitImportoRata} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> ciascuna.</p>
      <p style={{marginBottom: '0.2rem'}}>Tale somma:</p>
      <p style={{marginBottom: '0.8rem'}}><span className="inline-checkbox" onClick={() => setData({...data, oneriConguaglio: 'a_forfait'})}>{data.oneriConguaglio === 'a_forfait' ? '☑' : '☐'}</span> è da intendere determinata a forfait, senza obbligo di rendiconto<br/>
      <span className="inline-checkbox" onClick={() => setData({...data, oneriConguaglio: 'acconto'})}>{data.oneriConguaglio === 'acconto' ? '☑' : '☐'}</span> sarà dovuta a titolo di acconto sulle spese accessorie, salvo conguaglio positivo o negativo.</p>

      <p style={{marginBottom: '0.2rem'}}><strong>d) PATTI PARTICOLARI</strong></p>
      <p style={{marginBottom: '0.2rem'}}>Il Proponente dichiara che utilizzerà i locali per l’apertura di un’attività di <input type="text" name="attivitaX" value={data.attivitaX} onChange={handleChange} className="inline-input" style={{ width: '180px' }} />, che ai fini della L. 392/78 {data.contattoPubblico === 'no' ? '☑ non prevede' : '☐ non prevede'} {data.contattoPubblico === 'si' ? '☑ prevede' : '☐ prevede'} contatto diretto con il pubblico.</p>
      <p style={{marginBottom: '0.2rem'}}>Il Proponente è tenuto sotto sua responsabilità a denunciare l’attività agli enti locali... si impegna alla voltura intestazioni contratti erogazione servizi...</p>
      <p style={{marginBottom: '0.8rem'}}><input type="text" name="pattiExtra" value={data.pattiExtra} onChange={handleChange} className="inline-input" style={{ width: '600px' }} /></p>
      </div>

      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      {/* 3) TIPO CONTRATTO */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>3) TIPOLOGIA E DURATA DEL CONTRATTO</h3>
      <p style={{marginBottom: '0.2rem'}}>Il contratto sarà del seguente tipo:</p>
      <p style={{marginBottom: '0.2rem', paddingLeft: '1rem'}}>
        <strong>3.1) uso diverso (commerciale L. 392/78)</strong> <span className="inline-checkbox" onClick={() => setData({...data, tipoContratto: '3.1'})}>{data.tipoContratto === '3.1' ? '☑' : '☐'}</span><br/>
        {data.tipoContratto === '3.1' && data.sottoTipo31 === '6+6' ? '☑' : '☐'} a) durata: min. 6+6 <br/>
        {data.tipoContratto === '3.1' && data.sottoTipo31 === '9+9' ? '☑' : '☐'} b) durata: min. 9+9 <br/>
        {data.tipoContratto === '3.1' && data.sottoTipo31 === 'transitorio' ? '☑' : '☐'} c) uso transitorio mesi <input type="text" name="mesiTransitorio31" value={data.mesiTransitorio31} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />
      </p>
      <p style={{marginBottom: '0.2rem', paddingLeft: '1rem'}}>
        <strong>3.2) uso abitativo</strong> <span className="inline-checkbox" onClick={() => setData({...data, tipoContratto: '3.2'})}>{data.tipoContratto === '3.2' ? '☑' : '☐'}</span><br/>
        {data.tipoContratto === '3.2' && data.sottoTipo32 === '4+4' ? '☑' : '☐'} a) L.431 4+4 <br/>
        {data.tipoContratto === '3.2' && data.sottoTipo32 === '3+2' ? '☑' : '☐'} b) L.431 3+2 <br/>
        {data.tipoContratto === '3.2' && data.sottoTipo32 === 'transitorio' ? '☑' : '☐'} c) transitorio esigenze: <input type="text" name="usoTransitorio32" value={data.usoTransitorio32} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> <br/>
        {data.tipoContratto === '3.2' && data.sottoTipo32 === 'studenti' ? '☑' : '☐'} d) transitorio studenti <br/>
        {data.tipoContratto === '3.2' && data.sottoTipo32 === 'altro' ? '☑' : '☐'} e) altro <input type="text" name="altro32" value={data.altro32} onChange={handleChange} className="inline-input" style={{ width: '120px' }} />
      </p>
      <p style={{marginBottom: '0.8rem'}}>Il contratto avrà durata di anni/mesi <input type="text" name="durataAnniMesi" value={data.durataAnniMesi} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> a decorrere dal <input type="date" name="decorrenzaDal" value={data.decorrenzaDal} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /> sino al <input type="date" name="decorrenzaAl" value={data.decorrenzaAl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>

      {/* 4) DEPOSITO */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>4) DEPOSITO FIDUCIARIO</h3>
      <p style={{marginBottom: '0.2rem'}}>€ <input type="text" name="depositoImporto" value={data.depositoImporto} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> vengono versati alla firma, mediante {data.depositoMezzo === 'assegno' ? '☑ assegno n° ' : '☐ assegno n° '}<input type="text" name="depositoAssegno" value={data.depositoAssegno} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> banca <input type="text" name="depositoBanca" value={data.depositoBanca} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> agenzia <input type="text" name="depositoAgenzia" value={data.depositoAgenzia} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> {data.depositoMezzo === 'altro' ? '☑ altro: ' : '☐ altro: '}<input type="text" name="depositoAltro" value={data.depositoAltro} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      </div>

      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      {/* 5, 6, 7, 8, 9, 10 */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>5) CONSEGNA IMMOBILE</h3>
      <p style={{marginBottom: '0.8rem'}}>L’immobile verrà consegnato alla data del <input type="date" name="dataConsegna" value={data.dataConsegna} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />, libero da cose e persone, con decorrenza contrattuale dal <input type="date" name="dataDecorrenzaEffettiva" value={data.dataDecorrenzaEffettiva} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />. La sottoscrizione del contratto di locazione avverrà entro <input type="date" name="dataSottoscrizione" value={data.dataSottoscrizione} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>6) TERMINE D’IRREVOCABILITA’ DELLA PROPOSTA</h3>
      <p style={{marginBottom: '0.8rem'}}>La presente proposta è irrevocabile per <input type="text" name="giorniIrrevocabile" value={data.giorniIrrevocabile} onChange={handleChange} className="inline-input" style={{ width: '18px' }} /> giorni da oggi, ossia sino al <input type="date" name="dataIrrevocabile" value={data.dataIrrevocabile} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /> compreso.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>7, 8) COMUNICAZIONE E CONCLUSIONE</h3>
      <p style={{marginBottom: '0.8rem', textAlign: 'justify'}}>L’Agenzia Immobiliare si obbliga a dare immediato avviso della proposta al Locatore. La proposta si perfezionerà in vincolo (CONTRATTO PRELIMINARE) non appena il Proponente avrà conoscenza dell’accettazione.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>9) COMPENSO MEDIAZIONE</h3>
      <p style={{marginBottom: '0.8rem'}}>Il Proponente si obbliga a corrispondere la provvigione, convenuta nel <input type="text" name="provvigione" value={data.provvigione} onChange={handleChange} className="inline-input" style={{ width: '18px' }} />% + IVA del canone di locazione annuo a regime.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>10) NOTE</h3>
      <p style={{marginBottom: '1rem'}}><input type="text" name="note" value={data.note} onChange={handleChange} className="inline-input" style={{ width: '600px' }} /></p>

      <div className="signature-grid" style={{marginBottom: '2rem'}}>
        <div className="signature-box" style={{textAlign: 'left'}}>
          Luogo e data: <br/><br/>
          Firma Agenzia: <br/><br/>
          Firma Proponente: <br/>
        </div>
      </div>
      
      <div style={{border: '1px solid black', padding: '10px', marginBottom: '1rem'}}>
        <p style={{textAlign: 'center'}}>Il Locatore con l’accettazione della presente conferma le dichiarazioni di cui all’art.1a).</p>
        <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma per accettazione Locatore: _________________</p>
      </div>

      <div style={{border: '1px solid black', padding: '10px'}}>
        <p style={{textAlign: 'center'}}>Per avvenuta conoscenza dell’accettazione</p>
        <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma Proponente: _________________</p>
      </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Proposta di Locazione" icon={<FileText size={20} />} preview={renderPreview()} clientName={data.p1Nome}>
          </ContractLayout>
  );
};
