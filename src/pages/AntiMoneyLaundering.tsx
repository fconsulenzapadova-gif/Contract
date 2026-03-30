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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };



  

  const renderPreview = () => (
    <>
    <div className="a4-page" style={{fontSize: '8.5pt', lineHeight: '1.2', textAlign: 'justify'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <h2 style={{textAlign: 'center', marginBottom: '1rem', fontSize: '11pt'}}>
        MODULO PER L’IDENTIFICAZIONE E L’ADEGUATA VERIFICA DELLA CLIENTELA
      </h2>

      <p style={{marginBottom: '1rem'}}>
        Gentile cliente, i dati personali da riportare nel modulo antiriciclaggio sono raccolti per adempiere agli obblighi
        di cui al D.Lgs. 231/2007 in materia di prevenzione dell'utilizzo del sistema finanziario a scopo di riciclaggio dei
        proventi di attività criminose e di finanziamento del terrorismo. Il conferimento dei dati è pertanto obbligatorio.
        Il rifiuto di fornire le informazioni richieste può comportare l'impossibilità di eseguire l'operazione richiesta. Il
        trattamento dei dati sarà svolto per le predette finalità anche con strumenti elettronici e solo da personale
        incaricato in modo da garantire gli obblighi di sicurezza e la loro riservatezza. I dati non saranno diffusi, ma
        potranno essere comunicati ad Autorità e Organi di Vigilanza e Controllo.<br/>
        I diritti di accesso sono esercitabili ai sensi degli artt. 7 e 8 del D.Lgs. 196/2003.<br/>
        Ai fini della completezza delle informazioni di seguito riportate, anche relativamente alle sanzioni penali previste
        dal citato D.Lgs. 231/2007, La invitiamo a prendere visione della informativa qui di seguito.
      </p>

      <div style={{border: '1px solid #000', padding: '10px', marginBottom: '1rem'}}>
        <p style={{marginBottom: '0.2rem'}}>
          Il/La sottoscritto/a <strong><input type="text" name="nomeCliente" value={data.nomeCliente} onChange={handleChange} className="inline-input" style={{ width: '240px' }} /></strong><br/>
          Codice Fiscale / P.IVA <strong><input type="text" name="cfCliente" value={data.cfCliente} onChange={handleChange} className="inline-input" style={{ width: '180px' }} /></strong><br/>
          Residente / Sede legale in <strong><input type="text" name="residenzaCliente" value={data.residenzaCliente} onChange={handleChange} className="inline-input" style={{ width: '300px' }} /></strong><br/>
          Identificato a mezzo: <strong><input type="text" name="documentoTipo" value={data.documentoTipo} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></strong> n° <strong><input type="text" name="documentoNum" value={data.documentoNum} onChange={handleChange} className="inline-input" style={{ width: '90px' }} /></strong>
          rilasciato da <strong><input type="text" name="rilasciatoDa" value={data.rilasciatoDa} onChange={handleChange} className="inline-input" style={{ width: '120px' }} /></strong> il <strong><input type="date" name="dataRilascio" value={data.dataRilascio} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></strong> con scadenza il <strong><input type="date" name="scadenza" value={data.scadenza} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /></strong>
        </p>
      </div>

      <h3 style={{fontSize: '9.5pt', marginBottom: '0.5rem', marginTop: '1rem'}}>INFORMATIVA SUGLI OBBLIGHI DI CUI AL D.LGS. 231/2007</h3>
      
      <p style={{marginBottom: '0.5rem'}}>
        <strong>OBBLIGHI DEL CLIENTE</strong><br/>
        Art. 21 D.Lgs. 231/2007: I clienti forniscono, sotto la propria responsabilità, tutte le informazioni necessarie e aggiornate per consentire ai soggetti destinatari del presente decreto di adempiere agli obblighi di adeguata verifica della clientela. Ai fini dell'identificazione del titolare effettivo, i clienti forniscono per iscritto, sotto la propria responsabilità, tutte le informazioni necessarie e aggiornate delle quali siano a conoscenza.
      </p>

      <p style={{marginBottom: '0.5rem'}}>
        <strong>SANZIONI PENALI</strong><br/>
        Art. 55 D.Lgs. 231/2007:<br/>
        1. Salvo che il fatto costituisca più grave reato, chiunque contravviene alle disposizioni contenute nel Titolo II, Capo I, concernenti l'obbligo di identificazione, è punito con la multa da 2.600 a 13.000 euro.<br/>
        2. Salvo che il fatto costituisca più grave reato, l'esecutore dell'operazione che omette di indicare le generalità del soggetto per conto del quale eventualmente esegue l'operazione o le indica false è punito con la reclusione da sei mesi a un anno e con la multa da 500 a 5.000 euro.<br/>
        3. Salvo che il fatto costituisca più grave reato, l'esecutore dell'operazione che non fornisce informazioni sullo scopo e sulla natura prevista dal rapporto continuativo o dalla prestazione professionale o le fornisce false è punito con l'arresto da sei mesi a tre anni e con l'ammenda da 5.000 a 50.000 euro.
      </p>
      </div>

      <div className="a4-page" style={{fontSize: '8.5pt', lineHeight: '1.2', textAlign: 'justify'}}>
      <div className="contract-header"><img src="/logo.png" alt="Gemüt Real Estate" className="contract-logo" /></div>
      <p style={{marginBottom: '0.5rem'}}>
        <strong>PERSONE POLITICAMENTE ESPOSTE</strong><br/>
        Art. 1, comma 2, lett. o), D.Lgs. 231/2007: «persone politicamente esposte»: le persone fisiche residenti in altri Stati comunitari o in Stati estracomunitari, che occupano o hanno occupato importanti cariche pubbliche, nonché i loro familiari diretti o coloro con i quali tali persone intrattengono notoriamente stretti legami, individuate sulla base dei criteri di cui all'allegato tecnico al presente decreto.<br/>
        Art. 1 Allegato Tecnico al D.Lgs. 231/20071: 1. Per persone fisiche che occupano o hanno occupato importanti cariche pubbliche s'intendono: a) i capi di Stato, i capi di Governo, i Ministri e i Vice Ministri o Sottosegretari; b) i parlamentari; c) i membri delle corti supreme, delle corti costituzionali e di altri organi giudiziari di alto livello le cui decisioni non sono generalmente soggette a ulteriore appello, salvo in circostanze eccezionali; d) i membri delle Corti dei conti e dei consigli di amministrazione delle banche centrali; e) gli ambasciatori, gli incaricati d'affari e gli ufficiali di alto livello delle forze armate; f) i membri degli organi di amministrazione, direzione o vigilanza delle imprese possedute dallo Stato. In nessuna delle categorie sopra specificate rientrano i funzionari di livello medio o inferiore. Le categorie di cui alle lettere da a) a e) comprendono, laddove applicabili, le posizioni a livello europeo e internazionale.<br/>
        2. Per familiari diretti s'intendono: a) il coniuge; b) i figli e i loro coniugi; c) coloro che nell'ultimo quinquennio hanno convissuto con i soggetti di cui alle precedenti lettere; d) i genitori.<br/>
        3. Ai fini dell'individuazione dei soggetti con i quali le persone di cui al numero 1 intrattengono notoriamente stretti legami si fa riferimento a: a) qualsiasi persona fisica che ha notoriamente la titolarità effettiva congiunta di entità giuridiche o qualsiasi altra stretta relazione d'affari con una persona di cui al comma 1; b) qualsiasi persona fisica che sia unica titolare effettiva di entità giuridiche o soggetti giuridici notoriamente creati di fatto a beneficio della persona di cui al comma 1.<br/>
        4. Senza pregiudizio dell'applicazione, in funzione del rischio, di obblighi rafforzati di adeguata verifica della clientela, quando una persona ha cessato di occupare importanti cariche pubbliche da un periodo di almeno un anno i soggetti destinatari del presente decreto non sono tenuti a considerare tale persona come politicamente esposta.
      </p>

      <p style={{marginBottom: '0.5rem'}}>
        <strong>TITOLARE EFFETTIVO</strong><br/>
        Art. 1, comma 2, lett. u), D.Lgs. 231/2007: «titolare effettivo»: la persona fisica per conto della quale è realizzata un'operazione o un'attività, ovvero, nel caso di entità giuridica, la persona o le persone fisiche che, in ultima istanza, possiedono o controllano tale entità, ovvero ne risultano beneficiari secondo i criteri di cui all'allegato tecnico al presente decreto.<br/>
        Art. 2 Allegato Tecnico al D.Lgs. 231/20071: Per titolare effettivo s'intende: a) in caso di società: 1) la persona fisica o le persone fisiche che, in ultima istanza, possiedano o controllino un'entità giuridica, attraverso il possesso o il controllo diretto o indiretto di una percentuale sufficiente delle partecipazioni al capitale sociale o dei diritti di voto in seno a tale entità giuridica, anche tramite azioni al portatore, purchè non si tratti di una società ammessa alla quotazione su un mercato regolamentato e sottoposta a obblighi di comunicazione conformi alla normativa comunitaria o a standard internazionali equivalenti; tale criterio si ritiene soddisfatto ove la percentuale corrisponda al 25 per cento più uno di partecipazione al capitale sociale; 2) la persona fisica o le persone fisiche che esercitano in altro modo il controllo sulla direzione di un'entità giuridica; b) in caso di entità giuridiche quali le fondazioni e di istituti giuridici quali i trust, che amministrano e distribuiscono fondi: 1) se i futuri beneficiari sono già stati determinati, la persona fisica o le persone fisiche beneficiarie del 25 per cento o più del patrimonio di un'entità giuridica; 2) se le persone che beneficiano dell'entità giuridica non sono ancora state determinate, la categoria di persone nel cui interesse principale è istituita o agisce l'entità giuridica; 3) la persona fisica o le persone fisiche che esercitano un controllo sul 25 per cento o più del patrimonio di un'entità giuridica.
      </p>

      <div className="signature-grid" style={{marginTop: '2rem'}}>
        <div className="signature-box" style={{textAlign: 'left'}}>
          Luogo e data<br/>
          <input type="text" name="luogo" value={data.luogo} onChange={handleChange} className="inline-input" style={{ width: '90px' }} />, <input type="date" name="data" value={data.data} onChange={handleChange} className="inline-input" style={{ width: '130px' }} /><br/><br/><br/>
          Firma per presa visione del Cliente<br/>
          ...............................................................................<br/>
        </div>
      </div>
    </div>
    </>
  );

  return (
    <ContractLayout title="Informativa Antiriciclaggio" icon={<Shield size={20} />} preview={renderPreview()}>
          </ContractLayout>
  );
};
