import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { ContractLayout } from '../components/ContractLayout';

export const PurchaseProposal: React.FC = () => {
  const [data, setData] = useState({
    // PROPONENTE 1
    p1Nome: '', p1NatoA: '', p1NatoIl: '', p1ResidenteA: '', p1Via: '', p1Civico: '', p1Tel: '', p1CF: '', p1Email: '',
    p1Qualita: '', p1Societa: '', p1SocCF: '', p1SocPI: '', p1Sede: '',
    
    // PROPONENTE 2
    p2Nome: '', p2NatoA: '', p2NatoIl: '', p2ResidenteA: '', p2Via: '', p2Civico: '', p2Tel: '', p2CF: '', p2Email: '',
    
    // AGENZIA
    agNome: '', agSede: '', agVia: '', agCivico: '', agCciaa: '', agRea: '', agPec: '',
    
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
    pag1Importo: '', pag1AssegnoNum: '', pag1Banca: '', pag1Agenzia: '',
    
    // b) successivi 1
    pag2Importo: '', pag2Data: '', pag2Assegno: 'circolare', pag2Titolo: 'caparra',
    
    // b) successivi 2
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
      <p style={{marginBottom: '0.2rem'}}>C.F. <input type="text" name="p1SocCF" value={data.p1SocCF} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> P.I. <input type="text" name="p1SocPI" value={data.p1SocPI} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '1rem'}}>Sede legale: <input type="text" name="p1Sede" value={data.p1Sede} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>

      {data.p2Nome && (
        <>
        <p style={{marginBottom: '0.2rem'}}><input type="text" name="p2Nome" value={data.p2Nome} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /> il <input type="date" name="p2NatoIl" value={data.p2NatoIl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
        <p style={{marginBottom: '0.2rem'}}>residente a <input type="text" name="p2ResidenteA" value={data.p2ResidenteA} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> via <input type="text" name="p2Via" value={data.p2Via} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="p2Civico" value={data.p2Civico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
        <p style={{marginBottom: '0.2rem'}}>tel. <input type="text" name="p2Tel" value={data.p2Tel} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> C.F. <input type="text" name="p2CF" value={data.p2CF} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /></p>
        <p style={{marginBottom: '1rem'}}>e-mail / PEC <input type="text" name="p2Email" value={data.p2Email} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
        </>
      )}

      <p style={{marginBottom: '0.2rem'}}>in seguito “PROPONENTE” tramite l’agenzia di mediazione immobiliare <input type="text" name="agNome" value={data.agNome} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con sede in <input type="text" name="agSede" value={data.agSede} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> via <input type="text" name="agVia" value={data.agVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="agCivico" value={data.agCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>iscritta alla C.C.I.A.A. di <input type="text" name="agCciaa" value={data.agCciaa} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> REA n° <input type="text" name="agRea" value={data.agRea} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '1rem'}}>PEC <input type="text" name="agPec" value={data.agPec} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> in seguito denominata “AGENZIA IMMOBILIARE”</p>

      <p style={{textAlign: 'center', marginBottom: '1rem'}}>
        , con la presente proposta<br/>
        <strong>PROMETTE IRREVOCABILMENTE Dl ACQUISTARE</strong><br/>
        a corpo e non a misura, l’immobile sotto descritto, comprensivo della proporzionale quota delle parti comuni, alle condizioni di seguito indicate.
      </p>

      {/* 1) DESCRIZIONE IMMOBILE */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>1) DESCRIZIONE IMMOBILE</h3>
      <p style={{marginBottom: '0.2rem'}}>Comune <input type="text" name="immComune" value={data.immComune} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> via <input type="text" name="immVia" value={data.immVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="immCivico" value={data.immCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> Int. <input type="text" name="immInt" value={data.immInt} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Proprietà intestata a <input type="text" name="immIntestataA" value={data.immIntestataA} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> Destinazione d’uso <input type="text" name="immUso" value={data.immUso} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Composizione <input type="text" name="immComposizione" value={data.immComposizione} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Atto di Provenienza <input type="text" name="immProvenienza" value={data.immProvenienza} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      
      {[1,2].map(i => {
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
        <span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'libero'})}>{data.statoImm === 'libero' ? '☑' : '☐'}</span> libero o occupato dal proprietario e libero al rogito
        &nbsp;&nbsp;&nbsp;<span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'locato'})}>{data.statoImm === 'locato' ? '☑' : '☐'}</span> locato al canone annuo attuale di € <input type="text" name="canoneAnnuo" value={data.canoneAnnuo} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> con contratto scadente il <input type="date" name="scadenzaContratto" value={data.scadenzaContratto} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />
      </p>
      <p style={{marginBottom: '1rem'}}><span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'altro'})}>{data.statoImm === 'altro' ? '☑' : '☐'}</span> altro <input type="text" name="altroStato" value={data.altroStato} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>

      {/* 2) DICHIARAZIONI DEL VENDITORE */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>2) DICHIARAZIONI DEL VENDITORE</h3>
      <p style={{marginBottom: '0.2rem'}}>Il Venditore ha dichiarato all’Agenzia Immobiliare che l’immobile è:</p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla conformità alle norme edilizie e urbanistiche: <input type="text" name="confUrbanistica" value={data.confUrbanistica} onChange={handleChange} className="inline-input" style={{ width: '480px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla conformità degli impianti alle normative vigenti: <input type="text" name="confImpianti" value={data.confImpianti} onChange={handleChange} className="inline-input" style={{ width: '480px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla esistenza di iscrizioni e/o trascrizioni pregiudizievoli: <input type="text" name="confPregiudizievoli" value={data.confPregiudizievoli} onChange={handleChange} className="inline-input" style={{ width: '480px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla certificazione energetica: <span className="inline-checkbox" onClick={() => setData({...data, confApe: 'APE'})}>{data.confApe === 'APE' ? '☑' : '☐'}</span> APE &nbsp;&nbsp; <span className="inline-checkbox" onClick={() => setData({...data, confApe: 'ACE'})}>{data.confApe === 'ACE' ? '☑' : '☐'}</span> ACE rilasciato il <input type="date" name="apeData" value={data.apeData} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo all’intestazione della ditta catastale e conformità della planimetria allo stato dei luoghi: <input type="text" name="confCatastale" value={data.confCatastale} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alle spese condominiali: - spese gestione ordinaria circa € <input type="text" name="spesOrdinarie" value={data.spesOrdinarie} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> annui;</p>
      <p style={{marginBottom: '0.2rem'}}>- spese straordinarie deliberate nell’ultimo esercizio circa € <input type="text" name="spesStraordinarie" value={data.spesStraordinarie} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /></p>
      <p style={{marginBottom: '1rem', fontStyle: 'italic'}}>Il Venditore, mediante l’accettazione della presente proposta, garantisce la veridicità delle suddette descrizioni e dichiarazioni dello stato dell’immobile.</p>

      {/* 3) PREZZO OFFETTO */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>3) PREZZO DI ACQUISTO OFFERTO</h3>
      <p style={{marginBottom: '1rem'}}>€ <input type="text" name="prezzoOfferto" value={data.prezzoOfferto} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /></p>
      </div>

      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      {/* 4) CONDIZIONI PAGAMENTO */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>4) CONDIZIONI DI PAGAMENTO</h3>
      <p style={{marginBottom: '0.2rem'}}><strong>a) alla presente proposta:</strong></p>
      <p style={{marginBottom: '0.2rem'}}>€ <input type="text" name="pag1Importo" value={data.pag1Importo} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> sono versati alla firma della presente proposta, a mani dell’AGENZIA IMMOBILIARE, che rilascia ricevuta a titolo di deposito, con assegno <input type="text" name="pag1AssegnoNum" value={data.pag1AssegnoNum} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> non trasferibile, intestato al venditore, tratto sulla banca <input type="text" name="pag1Banca" value={data.pag1Banca} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> agenzia di <input type="text" name="pag1Agenzia" value={data.pag1Agenzia} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>In caso di accettazione della presente proposta tale somma da deposito fiduciario diverrà CAPARRA CONFIRMATORIA fermo quanto previsto al successivo Art 9.</p>
      <p style={{marginBottom: '1rem'}}>In caso di mancata accettazione della presente proposta da parte del Venditore il PROPONENTE avrà diritto alla immediata restituzione da parte dell’AGENZIA IMMOBILIARE dell’assegno consegnategli a titolo di deposito.</p>

      <p style={{marginBottom: '0.2rem'}}><strong>b) pagamenti successivi:</strong></p>
      <p style={{marginBottom: '0.2rem'}}>€ <input type="text" name="pag2Importo" value={data.pag2Importo} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> entro e non oltre il <input type="date" name="pag2Data" value={data.pag2Data} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /> con assegno {data.pag2Assegno === 'circolare' ? '☑ circolare ' : (data.pag2Assegno === 'bancario' ? '☑ bancario ': '☐ circolare ☐ bancario ')} non trasferibile a titolo di: {data.pag2Titolo === 'caparra' ? '☑ ulteriore caparra confirmatoria' : '☐ ulteriore caparra confirmatoria'} &nbsp; {data.pag2Titolo === 'acconto' ? '☑ acconto sul prezzo' : '☐ acconto sul prezzo'}</p>
      <p style={{marginBottom: '0.2rem'}}>È facoltà delle parti riprodurre in tale occasione il contenuto del presente contratto al fine di aggiungervi gli aspetti non disciplinati nello stesso.</p>
      
      {data.pag3Importo && (
        <p style={{marginBottom: '1rem'}}>€ <input type="text" name="pag3Importo" value={data.pag3Importo} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> entro e non oltre il <input type="date" name="pag3Data" value={data.pag3Data} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /> con assegno {data.pag3Assegno === 'circolare' ? '☑ circolare ' : (data.pag3Assegno === 'bancario' ? '☑ bancario ': '☐ circolare ☐ bancario ')} non trasferibile a titolo di: {data.pag3Titolo === 'caparra' ? '☑ ulteriore caparra confirmatoria' : '☐ ulteriore caparra confirmatoria'} &nbsp; {data.pag3Titolo === 'acconto' ? '☑ acconto sul prezzo' : '☐ acconto sul prezzo'}</p>
      )}

      <p style={{marginBottom: '0.2rem'}}><strong>c) saldo all’atto notarile:</strong></p>
      <p style={{marginBottom: '0.2rem'}}><span className="inline-checkbox" onClick={() => setData({...data, saldoModo: 'assegno'})}>{data.saldoModo === 'assegno' ? '☑' : '☐'}</span> con assegno circolare non trasferibile &nbsp;&nbsp;&nbsp;&nbsp; <span className="inline-checkbox" onClick={() => setData({...data, saldoModo: 'finanziatore'})}>{data.saldoModo === 'finanziatore' ? '☑' : '☐'}</span> con intervento di un ente finanziatore scelto dal PROPONENTE.</p>
      <p style={{marginBottom: '0.2rem'}}>In questa seconda ipotesi l’importo del finanziamento sarà messo a disposizione del venditore al momento del rogito notarile, esperite le formalità necessarie.</p>
      <p style={{marginBottom: '0.2rem'}}>L’atto notarile sarà stipulato entro il <input type="date" name="attoEntroIl" value={data.attoEntroIl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /> dal PROPONENTE o da persona fisica e/o giuridica da nominarsi al momento del rogito, presso lo studio notarile <input type="text" name="attoNotaio" value={data.attoNotaio} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> con sede in <input type="text" name="attoSede" value={data.attoSede} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> via <input type="text" name="attoVia" value={data.attoVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="attoCivico" value={data.attoCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />.</p>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>Ogni spesa, imposta o tassa inerente l’acquisto sarà a carico del PROPONENTE, escluse solamente quelle, per legge, a carico del venditore. L’immobile in oggetto, al momento dell’atto notarile, dovrà essere libero da oneri e pesi, trascrizioni pregiudizievoli, pignoramenti, iscrizioni ipotecarie, ed essere in regola con la normativa edilizia ed urbanistica. Dovrà essere trasferito nello stato di fatto in cui si trova, come visto e gradito, con tutte le servitù attive e passive, nonché in regola con il pagamento delle spese condominiali.</p>

      <p style={{marginBottom: '0.2rem'}}><strong>d) deposito del saldo del prezzo</strong></p>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>Il Venditore dichiara di essere stato debitamente edotto dall’Agenzia Immobiliare che, a norma dall’art. 1, comma 63, lett. c), della legge 27 dicembre 2013, n. 147, ciascuna delle Parti... potrà avvalersi della facoltà di depositare, presso il notaio rogante, fino ad avvenuta trascrizione del contratto di compravendita, la somma relativa al saldo del prezzo...</p>
      <p style={{marginBottom: '1rem'}}>Per quanto sopra, il Proponente espressamente dichiara di:<br/><span className="inline-checkbox" onClick={() => setData({...data, depositoPrezzo: 'A'})}>{data.depositoPrezzo === 'A' ? '☑' : '☐'}</span> A) volersi avvalere della predetta disposizione di legge;<br/><span className="inline-checkbox" onClick={() => setData({...data, depositoPrezzo: 'B'})}>{data.depositoPrezzo === 'B' ? '☑' : '☐'}</span> B) non volersi avvalere, ora per allora, della predetta disposizione di legge, rinunciando, pertanto, espressamente ad esercitare la facoltà concessagli al riguardo.</p>
      </div>

      <div className="a4-page" style={{fontSize: '9.2pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      {/* 5,6,7,8,9,10,11 */}
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>5) CONSEGNA IMMOBILE</h3>
      <p style={{marginBottom: '1rem'}}>L’immobile sarà consegnato alla data del <input type="date" name="dataConsegna" value={data.dataConsegna} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />, libero da cose e persone (salvo il caso in cui sia occupato da inquilino come indicato al punto 1), con obbligo del VENDITORE di conservarlo fino ad allora con la diligenza del buon padre di famiglia.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>6) TERMINE D’IRREVOCABILITA’ DELLA PROPOSTA</h3>
      <p style={{marginBottom: '1rem'}}>La presente proposta é irrevocabile sino alle ore 24.00 del giorno <input type="date" name="irrevocabileFino" value={data.irrevocabileFino} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /> compreso.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>7, 8) COMUNICAZIONE E CONCLUSIONE CONTRATTO</h3>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>L’AGENZIA IMMOBILIARE si obbliga a dare immediato avviso della presente proposta al venditore. La presente proposta si perfezionerà in vincolo contrattuale (CONTRATTO PRELIMINARE) non appena il PROPONENTE avrà conoscenza dell’accettazione della proposta stessa da parte del VENDITORE...</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>9) CLAUSOLA RISOLUTIVA ESPRESSA</h3>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>Qualora si perfezionasse l’accordo contrattuale, le Parti convengono di sottoporre il contratto preliminare così concluso alla verifica, da effettuarsi attraverso apposite visure... L’Agenzia Immobiliare assume fin da ora l’impegno... di eseguire detta verifica nel termine di <input type="text" name="giorniVerifica" value={data.giorniVerifica} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> giorni dal perfezionamento del vincolo contrattuale. L’assegno di caparra di cui al punto 4a) sarà... consegnato dall’Agenzia Immobiliare al Venditore solo se la verifica confermerà quanto dichiarato dal Venditore.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>10) REGISTRAZIONE E SPESE</h3>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>Ai sensi dell’Art. 5 DPR 131/1986 la presente proposta, se perfezionata, dovrà essere registrata entro 20 (venti) giorni. I costi di registrazione saranno a carico del Proponente...</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>11) NOTE</h3>
      <p style={{marginBottom: '2rem'}}><input type="text" name="note" value={data.note} onChange={handleChange} className="inline-input" style={{ width: '600px' }} /></p>

      <div className="signature-grid" style={{marginBottom: '1rem'}}>
        <div className="signature-box" style={{textAlign: 'left'}}>
          Luogo e data: <br/><br/>
          Firma Proponente: <br/><br/>
          Firma Agenzia: <br/>
        </div>
      </div>
      <p style={{marginBottom: '2rem', fontSize: '8pt'}}>Ai sensi e per gli effetti degli articoli 1341 e 1342 Cod. Civ. il sottoscritto dichiara di approvare espressamente le clausole 6 e 9. Firma Proponente: _________________</p>
      
      <div style={{border: '1px solid black', padding: '10px', marginBottom: '1rem'}}>
        <h4 style={{textAlign: 'center'}}>ACCETTAZIONE DEL VENDITORE</h4>
        <p>Il sottoscritto preso atto del contenuto della presente proposta d’acquisto dichiara di accettarla integralmente, confermando quanto previsto ai punti 1, 2, 4 e 5 nonché la clausola 9.</p>
        <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma venditore: _________________</p>
      </div>
      <div style={{border: '1px solid black', padding: '10px'}}>
        <h4 style={{textAlign: 'center'}}>RITIRO DELLA PROPOSTA D’ACQUISTO ACCETTATA</h4>
        <p>Il sottoscritto dichiara di ricevere copia della proposta d’acquisto regolarmente accettata dal VENDITORE.</p>
        <p>Luogo e data: _________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma proponente: _________________</p>
      </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Proposta d'Acquisto" icon={<FileText size={20} />} preview={renderPreview()} clientName={data.p1Nome}>
          </ContractLayout>
  );
};
