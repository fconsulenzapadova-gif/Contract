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
    
    // AGENZIA
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

      <p style={{marginBottom: '0.2rem'}}><input type="text" name="v2Nome" value={data.v2Nome} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /> il <input type="date" name="v2NatoIl" value={data.v2NatoIl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>residente a <input type="text" name="v2ResidenteA" value={data.v2ResidenteA} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> via <input type="text" name="v2Via" value={data.v2Via} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="v2Civico" value={data.v2Civico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>tel. <input type="text" name="v2Tel" value={data.v2Tel} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> C.F. <input type="text" name="v2CF" value={data.v2CF} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>e-mail / PEC <input type="text" name="v2Email" value={data.v2Email} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '1rem'}}>in seguito “VENDITORE”, dichiarando di avere e/o rappresentare la piena proprietà dell’immobile,</p>

      <h2 style={{textAlign: 'center', margin: '1rem 0', fontSize: '11pt'}}>CONFERISCE</h2>
      <p style={{marginBottom: '0.2rem'}}>all’agenzia di mediazione immobiliare <input type="text" name="agNome" value={data.agNome} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con sede in <input type="text" name="agSede" value={data.agSede} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> via <input type="text" name="agVia" value={data.agVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="agCivico" value={data.agCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>iscritta alla C.C.I.A.A. di <input type="text" name="agCciaa" value={data.agCciaa} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> REA n° <input type="text" name="agRea" value={data.agRea} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '1rem'}}>PEC <input type="text" name="agPec" value={data.agPec} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /> in seguito denominata “AGENZIA IMMOBILIARE”;</p>

      <h2 style={{textAlign: 'center', margin: '1rem 0', fontSize: '12pt'}}>INCARICO DI MEDIAZIONE</h2>
      <p style={{marginBottom: '1rem'}}>affinché procuri un acquirente per l’immobile sotto descritto, alle condizioni di seguito indicate.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>1) DESCRIZIONE IMMOBILE</h3>
      <p style={{marginBottom: '0.2rem'}}>Comune <input type="text" name="immComune" value={data.immComune} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> via <input type="text" name="immVia" value={data.immVia} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> n° <input type="text" name="immCivico" value={data.immCivico} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> Int. <input type="text" name="immInt" value={data.immInt} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Proprietà intestata a <input type="text" name="immIntestataA" value={data.immIntestataA} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> Destinazione d’uso <input type="text" name="immUso" value={data.immUso} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Composizione <input type="text" name="immComposizione" value={data.immComposizione} onChange={handleChange} className="inline-input" style={{ width: '360px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>Atto di Provenienza <input type="text" name="immProvenienza" value={data.immProvenienza} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      
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
        <span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'libero'})}>{data.statoImm === 'libero' ? '☑' : '☐'}</span> libero o occupato dal proprietario e libero al rogito
        &nbsp;&nbsp;&nbsp;<span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'locato'})}>{data.statoImm === 'locato' ? '☑' : '☐'}</span> locato al canone annuo attuale di € <input type="text" name="canoneAnnuo" value={data.canoneAnnuo} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> con contratto scadente il <input type="date" name="scadenzaContratto" value={data.scadenzaContratto} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />
      </p>
      <p style={{marginBottom: '1rem'}}><span className="inline-checkbox" onClick={() => setData({...data, statoImm: 'altro'})}>{data.statoImm === 'altro' ? '☑' : '☐'}</span> altro <input type="text" name="altroStato" value={data.altroStato} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>

      <p style={{marginBottom: '0.2rem'}}>Il Venditore consegna all’Agenzia Immobiliare i seguenti documenti:</p>
      <p style={{marginBottom: '0.2rem'}}>
        {data.docProvenienza ? '☑' : '☐'} copia atto di provenienza &nbsp;&nbsp; {data.docPlanimetrie ? '☑' : '☐'} copia planimetrie catastali &nbsp;&nbsp; {data.docRegolamento ? '☑' : '☐'} regolamento condominiale &nbsp;&nbsp; {data.docApe ? '☑' : '☐'} ACE/APE
      </p>
      <p style={{marginBottom: '1rem'}}>
        {data.docAltroTesto ? '☑' : '☐'} altro <input type="text" name="docAltroTesto" value={data.docAltroTesto} onChange={handleChange} className="inline-input" style={{ width: '360px' }} />
      </p>
      <p style={{marginBottom: '1rem'}}>Il Venditore si obbliga a fornire all’Agenzia Immobiliare tutta la documentazione necessaria per l’espletamento del presente incarico.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>2) DICHIARAZIONI DEL VENDITORE</h3>
      <p style={{marginBottom: '0.2rem'}}>Il Venditore dichiara che l’immobile è:</p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla conformità alle norme edilizie e urbanistiche: <input type="text" name="confUrbanistica" value={data.confUrbanistica} onChange={handleChange} className="inline-input" style={{ width: '480px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla conformità degli impianti alle normative vigenti: <input type="text" name="confImpianti" value={data.confImpianti} onChange={handleChange} className="inline-input" style={{ width: '480px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alla esistenza di iscrizioni e/o trascrizioni pregiudizievoli: <input type="text" name="confPregiudizievoli" value={data.confPregiudizievoli} onChange={handleChange} className="inline-input" style={{ width: '480px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo all’APE (Attestato Prestazione Energetica) da predisporre a cura del Venditore entro il <input type="date" name="confApeEntro" value={data.confApeEntro} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo all’intestazione della ditta catastale e conformità della planimetria: <input type="text" name="confCatastale" value={data.confCatastale} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></p>
      <p style={{marginBottom: '0.2rem'}}>con riguardo alle spese condominiali: - spese gestione ordinaria circa € <input type="text" name="spesOrdinarie" value={data.spesOrdinarie} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /> annui;</p>
      <p style={{marginBottom: '1rem'}}>- spese straordinarie deliberate nell’ultimo esercizio circa € <input type="text" name="spesStraordinarie" value={data.spesStraordinarie} onChange={handleChange} className="inline-input" style={{ width: '60px' }} /></p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>3) PREZZO DI VENDITA RICHIESTO</h3>
      <p style={{marginBottom: '1rem'}}>€ <input type="text" name="prezzo" value={data.prezzo} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> comprendente il residuo capitale mutuo di € <input type="text" name="residuoMutuo" value={data.residuoMutuo} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /> circa alla data del <input type="date" name="dataMutuo" value={data.dataMutuo} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>4) COMPENSO DI MEDIAZIONE</h3>
      <p style={{marginBottom: '0.2rem'}}>PROVVIGIONE del <input type="text" name="provvigionePerc" value={data.provvigionePerc} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />% + IVA, SUL PREZZO DI VENDITA.</p>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>Il compenso maturerà all’avvenuta conoscenza da parte dell’acquirente dell’accettazione della proposta di acquisto e sarà corrisposto dal Venditore all’Agenzia Immobiliare alla data convenuta per il pagamento previsto al successivo punto 7a) o, in mancanza di questo, entro 30 giorni dalla data di accettazione della proposta di acquisto. La provvigione pattuita sarà comunque dovuta, nel caso di vendita o promessa di vendita con soggetti che l’agente immobiliare abbia segnalato in esecuzione dell’incarico, anche qualora la stipulazione avvenga dopo la scadenza di quest’ultimo o la vendita si realizzi per interposta persona fisica o giuridica.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>5) DURATA DELL’INCARICO</h3>
      <p style={{marginBottom: '0.2rem'}}>La durata dell’incarico è da oggi fino al giorno <input type="date" name="durataFinoAl" value={data.durataFinoAl} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />, dopodiché:</p>
      <p style={{marginBottom: '0.2rem'}}>☐ si intenderà cessato a tutti gli effetti senza oneri e vincoli per il Venditore;</p>
      <p style={{marginBottom: '1rem'}}>☑ si intenderà tacitamente rinnovato per ugual periodo e per una sola volta alle stesse condizioni dell’incarico originario, ivi compreso quanto previsto agli artt. 10 e 11 del presente, salvo disdetta pervenuta all’Agenzia Immobiliare a mezzo raccomandata A/R o fax o telegramma o PEC, almeno <input type="text" name="disdettaGiorni" value={data.disdettaGiorni} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> giorni prima della scadenza.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>6) PROPOSTA DI ACQUISTO</h3>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>L’Agenzia Immobiliare è autorizzata a far sottoscrivere agli aspiranti acquirenti una proposta di acquisto, e a comunicare agli stessi l’avvenuta accettazione; a ricevere e trattenere fiduciariamente gli eventuali assegni non trasferibili intestati al Venditore, al quale dovranno essere consegnati dopo che l’aspirante acquirente avrà avuto conoscenza dell’accettazione del Venditore, ovvero dovranno essere restituiti agli aspiranti acquirenti in caso di mancata accettazione.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>7) CONDIZIONI DI PAGAMENTO</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>a) La proposta di acquisto dovrà contenere l’impegno del Proponente a versare, entro 30 giorni dalla conoscenza dell’accettazione della proposta stessa, una somma non inferiore al <input type="text" name="caparraPerc" value={data.caparraPerc} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />% del prezzo di vendita, comprensiva di quanto versato alla proposta di acquisto. In tale occasione, sarà facoltà delle parti contraenti riprodurre il contenuto della proposta d’acquisto al fine di aggiungervi gli aspetti non disciplinati nella stessa.</p>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>b) Il saldo del prezzo dovrà essere liquidato a mezzo di assegni circolari al momento dell’atto notarile. Il Venditore si obbliga, entro l’atto notarile, ad estinguere l’eventuale mutuo e ad espletare ogni formalità necessaria alla cancellazione della relativa ipoteca. L’acquirente potrà avvalersi, a propria cura e spese, di mutui o finanziamenti, il cui importo verrà messo a disposizione del Venditore al momento del rogito notarile, esperite le formalità necessarie.</p>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>c) Il Venditore dichiara di essere stato debitamente edotto dall’Agenzia Immobiliare che, a norma dall’art. 1, comma 63, lett. c), della legge 27 dicembre 2013, n. 147, ciascuna delle Parti e quindi anche solo il Promissario Acquirente, qualora ne faccia apposita richiesta, potrà avvalersi della facoltà di depositare, presso il notaio rogante, fino ad avvenuta trascrizione del contratto di compravendita, la somma relativa al saldo del prezzo, se determinato in denaro, oltre alle somme destinate ad estinzione di gravami o spese non pagate dal Venditore o di altri oneri dovuti in occasione del ricevimento o dell’autenticazione dell’atto di trasferimento della proprietà.</p>
      </div>

      <div className="a4-page" style={{fontSize: '9.5pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>8) ATTO NOTARILE</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>L’atto notarile dovrà essere stipulato entro <input type="text" name="giorniAtto" value={data.giorniAtto} onChange={handleChange} className="inline-input" style={{ width: '30px' }} /> giorni dal perfezionamento in vincolo contrattuale della proposta di acquisto.</p>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>Ogni spesa, imposta o tassa inerente la vendita sarà a carico dell’acquirente, escluse solamente quelle per legge a carico del Venditore. L’immobile in oggetto, al momento dell’atto notarile, dovrà essere libero da oneri e pesi, trascrizioni pregiudizievoli, pignoramenti, iscrizioni ipotecarie, salvo se espressamente indicate e accettate dall’acquirente ed essere in regola con la normativa edilizia ed urbanistica, e liberamente compravendibile. Dovrà essere trasferito nello stato di fatto in cui si trova, con tutte le servitù attive e passive, comprensivo della proporzionale quota delle parti comuni ed in regola con il pagamento delle spese condominiali, come risultante da dichiarazione dell’Amministratore di condominio.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>9) CONSEGNA DELL’IMMOBILE</h3>
      <p style={{marginBottom: '1rem'}}>L’immobile sarà consegnato alla data del <input type="date" name="dataConsegna" value={data.dataConsegna} onChange={handleChange} className="inline-input" style={{ width: '130px' }} />, libero da cose e persone (salvo il caso in cui sia occupato da inquilino).</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>10) ESCLUSIVA</h3>
      <p style={{marginBottom: '0.2rem'}}>Il presente incarico viene conferito:</p>
      <p style={{marginBottom: '0.2rem'}}><strong>A) non in esclusiva</strong><br/>In tal caso il Venditore potrà vendere l’immobile direttamente o tramite altre agenzie immobiliari senza nulla dovere all’Agenzia Immobiliare a titolo di provvigione o penale, impegnandosi però a rimborsare alla stessa le spese documentate sostenute nell’esecuzione del presente incarico, anche in caso di mancata vendita. Il Venditore autorizza fin d’ora l’Agenzia Immobiliare ad effettuare tali spese fino all’ammontare massimo di € <input type="text" name="speseMaxRecesso" value={data.speseMaxRecesso} onChange={handleChange} className="inline-input" style={{ width: '60px' }} />. Il Venditore si obbliga a comunicare immediatamente all’Agenzia Immobiliare l’eventuale accettazione di una proposta di acquisto.</p>
      <p style={{marginBottom: '0.2rem'}}><strong>B) in esclusiva</strong><br/>In tal caso il Venditore si impegna a non conferire incarico ad altre agenzie immobiliari, né a terzi, né a vendere l’immobile o stipulare un contratto preliminare per tutto il periodo di validità dell’incarico. La violazione dell’obbligo di esclusiva, sia nel caso di conferimento di incarico ad altre agenzie e/o terzi, che per il caso di vendita effettuata direttamente dal Venditore, comporterà il pagamento della penale prevista al successivo punto 11a). Nell’ipotesi di conferimento in esclusiva l’Agenzia Immobiliare si impegna a rinunciare al rimborso di tutte le spese che sosterrà per l’esecuzione dell’incarico, anche in caso di mancata conclusione dell’affare.</p>
      <p style={{marginBottom: '1rem'}}>In relazione a quanto sopra il Venditore dichiara di optare per l’alternativa: <br/><span className="inline-checkbox" onClick={() => setData({...data, esclusiva: 'A'})}>{data.esclusiva === 'A' ? '☑' : '☐'}</span> A) non in esclusiva &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="inline-checkbox" onClick={() => setData({...data, esclusiva: 'B'})}>{data.esclusiva === 'B' ? '☑' : '☐'}</span> B) in esclusiva</p>
      </div>

      <div className="a4-page" style={{fontSize: '9.5pt', lineHeight: '1.4'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>11) CLAUSOLA PENALE</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>Una penale sarà dovuta dal Venditore all’Agenzia Immobiliare nella misura e per i casi di seguito indicati:<br/>a) penale pari al <input type="text" name="penaleRecessoPerc" value={data.penaleRecessoPerc} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />% della provvigione sopra pattuita nei seguenti casi: recesso dall’incarico prima della sua naturale scadenza, salvo giustificato motivo; rifiuto del Venditore di consentire l’esecuzione del presente incarico; violazione dell’eventuale obbligo di esclusiva sia per il caso di vendita effettuata direttamente dal Venditore che per il caso di incarico conferito ad altre agenzie immobiliari o a terzi;<br/>b) penale pari al <input type="text" name="penaleRifiutoPerc" value={data.penaleRifiutoPerc} onChange={handleChange} className="inline-input" style={{ width: '30px' }} />% della provvigione pattuita in caso di rifiuto del Venditore di accettare una proposta di acquisto conforme al presente incarico, salvo giustificato motivo inerente la solvibilità del Proponente l’acquisto.<br/>Sarà invece dovuta dall’Agenzia Immobiliare al Venditore una penale pari alla somma pattuita a titolo di provvigione, fatto salvo il maggior danno, nei casi di: recesso dall’incarico prima della scadenza prevista; mancata comunicazione di proposte di acquisto conformi al presente incarico raccolte dall’Agenzia Immobiliare.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>12) CORRISPONDENTI</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>L’Agenzia Immobiliare è autorizzata ad avvalersi a proprie spese di banche dati e di agenti esterni alla propria organizzazione, purché abilitati ai sensi della legge 39/89 e successive modifiche ed integrazioni.</p>
      <p style={{marginBottom: '0.2rem'}}>L’Agenzia Immobiliare: <span style={{fontWeight:'bold'}}>{data.cartello}</span> autorizzata ad esporre il cartello di vendita in loco.</p>
      <p style={{marginBottom: '1rem'}}><span style={{fontWeight:'bold'}}>{data.media}</span> autorizzata a diffondere foto e planimetrie sia in forma cartacea che telematica.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>13) OBBLIGHI DELL’AGENZIA IMMOBILIARE</h3>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>Con l’accettazione del presente incarico l’Agenzia Immobiliare si obbliga a: a) visionare e valutare l’immobile; b) impegnare la propria organizzazione per promuovere la vendita, utilizzando gli strumenti ritenuti adeguati dalla stessa; c) accompagnare i potenziali acquirenti a visitare l’immobile; d) fornire su semplice richiesta del Venditore informazioni sull’attività mediatoria effettuata; e) predisporre a richiesta delle parti ogni atto negoziale ritenuto necessario per il perfezionamento dell’affare; f) effettuare le visure relative all’esistenza di iscrizioni e/o trascrizioni successive alla data di stipula dell’atto di provenienza; g) fornire ad entrambe le parti la propria assistenza fino all’atto notarile; h) non richiedere un prezzo di vendita diverso da quello stabilito al punto 3); i) registrare, entro 20 (venti) giorni, la proposta d’acquisto accettata, previa consegna in proprie mani di almeno due copie della stessa con firme autografe originali e della relativa provvista economica necessaria per procedere al versamento di quanto dovuto per la registrazione.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>14) COMUNICAZIONI ED ACCETTAZIONE DELL’INCARICO</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>Il Venditore autorizza l’Agenzia Immobiliare ad effettuare tutte le comunicazioni inerenti e conseguenti al presente incarico, alternativamente, al seguente n. tel. <input type="text" name="comTel" value={data.comTel} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /> e/o per iscritto a mezzo telegramma, raccomandata A/R al domicilio sopra indicato o PEC al seguente indirizzo <input type="text" name="comPec" value={data.comPec} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /> o fax al seguente numero <input type="text" name="comFax" value={data.comFax} onChange={handleChange} className="inline-input" style={{ width: '120px' }} />.</p>
      <p style={{marginBottom: '1rem', textAlign: 'justify'}}>L’Agenzia Immobiliare comunicherà la propria accettazione, qualora quest’ultima non sia contestuale al conferimento dell’incarico, entro 10 giorni dalla sottoscrizione dello stesso.</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>15) DIRITTO DI RECESSO</h3>
      <p style={{marginBottom: '0.2rem', textAlign: 'justify'}}>Ai sensi del d.Lgs. 206/2005 (Codice del consumo) nel caso di contratti conclusi fuori dai locali commerciali, è concessa al venditore, qualora abbia i requisiti per essere qualificato consumatore, la facoltà di esercitare il diritto di recesso entro 14 (quattordici) giorni dalla sottoscrizione del presente contratto a mezzo raccomandata A/R da inviarsi presso la sede dell’agenzia immobiliare.</p>
      <p style={{marginBottom: '0.2rem'}}>A tale proposito si precisa che il presente incarico viene conferito presso:</p>
      <p style={{marginBottom: '1rem'}}><span className="inline-checkbox" onClick={() => setData({...data, recessoLuogo: 'locale'})}>{data.recessoLuogo === 'locale' ? '☑' : '☐'}</span> Il locale commerciale dell’agenzia immobiliare &nbsp;&nbsp;&nbsp;&nbsp; <span className="inline-checkbox" onClick={() => setData({...data, recessoLuogo: 'domicilio'})}>{data.recessoLuogo === 'domicilio' ? '☑' : '☐'}</span> Il domicilio del venditore o altro luogo</p>

      <h3 style={{fontSize: '10pt', margin: '0.8rem 0 0.4rem 0'}}>16) OSSERVAZIONI e NOTE</h3>
      <p style={{marginBottom: '2rem'}}><input type="text" name="note" value={data.note} onChange={handleChange} className="inline-input" style={{ width: '600px' }} /></p>

      <div className="signature-grid">
        <div className="signature-box" style={{textAlign: 'left'}}>
          Luogo e data<br/>
          ...............................................................................<br/><br/>
          Firma Venditore<br/>
          ...............................................................................<br/><br/>
          Agenzia Immobiliare per accettazione incarico<br/>
          ...............................................................................<br/>
        </div>
      </div>
      
      <p style={{marginTop: '2rem', fontSize: '9pt', textAlign: 'justify'}}>
        Ai sensi e per gli effetti degli articoli 1341 e 1342 Cod. Civ. il Venditore dichiara di approvare espressamente le seguenti clausole: 5) durata e proroga dell’incarico; 10) esclusiva se concessa; 11) penale.
      </p>
      <div className="signature-box" style={{textAlign: 'left', marginTop: '1rem'}}>
          Firma Venditore<br/>
          ...............................................................................<br/>
      </div>
      </div>
    </>
  );

  return (
    <ContractLayout title="Incarico di Vendita" icon={<FileSignature size={20} />} preview={renderPreview()} clientName={data.v1Nome}>
          </ContractLayout>
  );
};
