// Faithful editable extraction from the selected deployed-bundle revision.
cc = () => {
  let [e, t] = useContractDraft(_, "document", {
      immVia: ``,
      immNumero: ``,
      immPiano: ``,
      catFoglio: ``,
      catParticella: ``,
      catSubalterno: ``,
      catCategoria: ``,
      catClasse: ``,
      catRendita: ``,
      immMq: ``,
      apeClasse: ``,
      zonaAppartenenza: ``,
      tipologiaSuperfici: ``,
      tipologiaEdilizia: ``,
      vetusta: ``,
      posizioneContesto: ``,
      accessoriDotazione: ``,
      dotazioneTecnologica: ``,
      indicePrestazione: ``,
      valoreRendita: ``,
      livelloQualita: ``,
      arredoPercentuale: ``,
      durataAnni: ``,
      durataDal: ``,
      durataAl: ``,
      prorogaAnni: ``,
      canoneAnnuo: ``,
      canoneAnnuoLettere: ``,
      canoneRata: ``,
      canoneRataLettere: ``,
      giornoPagamento: ``,
      depositoCauzionale: ``,
      depositoCauzionaleLettere: ``,
      depositoMensilita: ``,
      oneriAnnui: ``,
      oneriAnnuiLettere: ``,
      dataFirma: ``,
    }),
    [n, r] = useContractDraft(_, "tenants", [ic()], migrateParties),
    [i, a] = useContractDraft(_, "landlords", [ic()], migrateParties),
    [units, changeUnits] = useContractDraft(
      _,
      "units",
      () => migrateUnits({...e, immComune:e.immComune || 'Padova'}),
      normalizeUnitLinks,
    ),
    o = (e) => {
      let { name: n, value: r } = e.target;
      t((e) => ({ ...e, [n]: r }));
    },
    s = (setter) => (id, fieldOrPatch, value) =>
      setter((previous) => updateRecord(previous, id, fieldOrPatch, value)),
    c = (e) => {
      e((e) => [...e, ic()]);
    },
    l = (setter, id) =>
      setter((previous) => removeRecord(previous, id ?? previous.at(-1).id)),
    u = (e, n) => {
      let r = {
        via: `immVia`,
        numero: `immNumero`,
        piano: `immPiano`,
        foglio: `catFoglio`,
        particella: `catParticella`,
        subalterno: `catSubalterno`,
        categoria: `catCategoria`,
        classe: `catClasse`,
        rendita: `catRendita`,
        mq: `immMq`,
      };
      t((t) => ({ ...t, [r[e]]: n }));
    },
    d = (t, n = `120px`) =>
      (0, P.jsx)(`input`, {
        type: `text`,
        name: t,
        value: e[t],
        onChange: o,
        className: `inline-input`,
        style: { width: n, maxWidth: `100%` },
      }),
    f = {
      fontSize: `10pt`,
      lineHeight: `1.39`,
      padding: `10.5mm 14mm 10mm 14mm`,
    },
    p = {
      background: `#4a4a4a`,
      color: `white`,
      textAlign: `center`,
      fontWeight: `bold`,
      fontSize: `11pt`,
      padding: `4px 8px`,
      marginBottom: `0.68rem`,
      textTransform: `uppercase`,
    },
    m = { marginBottom: `0.56rem`, textAlign: `justify` },
    h = {
      fontSize: `10pt`,
      fontWeight: `bold`,
      margin: `0.48rem 0 0.18rem 0`,
    },
    g = (e, t) => (0, P.jsx)(`p`, { style: { ...m, ...t }, children: e }),
    v = (e, t, ...n) => ({
      key: e,
      node: (0, P.jsxs)(P.Fragment, {
        children: [(0, P.jsx)(`div`, { style: h, children: t }), n],
      }),
    }),
    y = (0, P.jsx)(Dr, {
      pageStyle: f,
      blocks: [
        ...rc({
          includeControls: true,
          students: false,
          units,
          onUnitChange: (id, field, value) =>
            changeUnits((previous) => updateRecord(previous, id, field, value)),
          onAddUnit: () =>
            changeUnits((previous) => [
              ...previous,
              createUnit({ tipo: "garage" }),
            ]),
          onRemoveUnit: (id) =>
            changeUnits((previous) => removeRecord(previous, id)),
          onMoveUnit: (id, offset) =>
            changeUnits((previous) => moveRecord(previous, id, offset)),
          onMoveConduttore: (id, offset) =>
            r((previous) => moveRecord(previous, id, offset)),
          onMoveLocatore: (id, offset) =>
            a((previous) => moveRecord(previous, id, offset)),
          onConduttorePatch: (id, patch) =>
            r((previous) => updateRecord(previous, id, patch)),
          onLocatorePatch: (id, patch) =>
            a((previous) => updateRecord(previous, id, patch)),
          keyPrefix: `intro`,
          titleNode: (0, P.jsx)(`div`, {
            style: p,
            children: `Contratto di Locazione Concordato ad Uso Abitativo`,
          }),
          lawText: `(Legge 9 dicembre 1998, n. 431, articolo 2, comma 3)`,
          pStyle: m,
          conduttori: n,
          locatori: i,
          onConduttoreChange: s(r),
          onLocatoreChange: s(a),
          onAddConduttore: () => c(r),
          onRemoveConduttore: (id) => l(r, id),
          onAddLocatore: () => c(a),
          onRemoveLocatore: (id) => l(a, id),
          property: {
            via: e.immVia,
            numero: e.immNumero,
            piano: e.immPiano,
            foglio: e.catFoglio,
            particella: e.catParticella,
            subalterno: e.catSubalterno,
            categoria: e.catCategoria,
            classe: e.catClasse,
            rendita: e.catRendita,
            mq: e.immMq,
          },
          onPropertyChange: u,
          apeClasse: e.apeClasse,
          onApeClasseChange: (e) => t((t) => ({ ...t, apeClasse: e })),
          afterIntroBlocks: [
            g(
              (0, P.jsxs)(P.Fragment, {
                children: [
                  (0, P.jsx)(`strong`, {
                    children: `ELEMENTI CARATTERIZZANTI`,
                  }),
                  ` l’alloggio: Zona appartenenza `,
                  d(`zonaAppartenenza`, `85px`),
                  `, Tipologia superfici `,
                  d(`tipologiaSuperfici`, `70px`),
                  ` mq,`,
                  ` `,
                  `Tipologia edilizia `,
                  d(`tipologiaEdilizia`, `90px`),
                  `, Vetustà `,
                  d(`vetusta`, `80px`),
                  `, Posizione contesto urbano `,
                  d(`posizioneContesto`, `100px`),
                  `,`,
                  ` `,
                  `Accessori in dotazione `,
                  d(`accessoriDotazione`, `100px`),
                  `, Dotazione tecnologica `,
                  d(`dotazioneTecnologica`, `100px`),
                  `, Indice prestazione energetica `,
                  d(`indicePrestazione`, `95px`),
                  `,`,
                  ` `,
                  `Valore rendita catastale `,
                  d(`valoreRendita`, `95px`),
                  ` Livello di qualità prevalente `,
                  d(`livelloQualita`, `90px`),
                  `. L’alloggio è ammobiliato con valore del `,
                  d(`arredoPercentuale`, `50px`),
                  `%.`,
                ],
              }),
            ),
          ],
        }),
        v(
          `art-1`,
          `Articolo 1 (Durata)`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Il contratto è stipulato per la durata di anni `,
                d(`durataAnni`, `55px`),
                `, dal `,
                d(`durataDal`, `88px`),
                ` al `,
                d(`durataAl`, `88px`),
                ` e alla prima scadenza ove le parti non concordino sul rinnovo del medesimo, il contratto è prorogato di diritto di `,
                d(`prorogaAnni`, `55px`),
                ` anni, fatta salva la facoltà di disdetta da parte del locatore che intenda adibire l'immobile agli usi o effettuare sullo stesso le opere di cui all'art. 3 della legge n 431/98, ovvero vendere l'immobile alle condizioni e con le modalità di cui al citato articolo 3. Alla scadenza del periodo di proroga biennale, ciascuna delle parti ha diritto di attivare la procedura per il rinnovo a nuove condizioni ovvero per la rinuncia al rinnovo del contratto, comunicando, la propria intenzione con lettera raccomandata da inviare all'altra parte almeno sei mesi prima della scadenza.`,
              ],
            }),
          ),
          g(
            (0, P.jsx)(P.Fragment, {
              children: `In mancanza della comunicazione il contratto è rinnovato tacitamente alle stesse condizioni. Nel caso in cui il locatore abbia riacquistato la disponibilità dell'alloggio alla prima scadenza e non lo adibisca nel termine di dodici mesi dalla data in cui ha riacquistato la disponibilità, agli usi per i quali ha esercitato la facoltà di disdetta, il conduttore ha diritto al ripristino del rapporto di locazione alle stesse condizioni di cui al contratto disdettato o, in alternativa, ad un risarcimento pari a trentasei mensilità dell'ultimo canone di locazione corrisposto.`,
            }),
          ),
        ),
        v(
          `art-2`,
          `Articolo 2 (Canone)`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Il canone annuo di locazione, secondo quanto stabilito dall'Accordo territoriale definito tra le organizzazioni sindacali dei locatori e depositato il 17/02/2023 protocollo n. 2023 - 0086231/E presso il Comune di Padova, è convenuto in € `,
                d(`canoneAnnuo`, `90px`),
                ` (`,
                d(`canoneAnnuoLettere`, `150px`),
                `/00) che il conduttore si obbliga a corrispondere nel domicilio del locatore ovvero a mezzo di bonifico bancario, in numero di 12 rate eguali anticipate di € `,
                d(`canoneRata`, `90px`),
                ` (`,
                d(`canoneRataLettere`, `140px`),
                `/00) ciascuna, alle seguenti date entro il giorno `,
                d(`giornoPagamento`, `45px`),
                ` di ogni mese.`,
              ],
            }),
          ),
        ),
        v(
          `art-3`,
          `Articolo 3 (Deposito cauzionale e altre forme di garanzia)`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `A garanzia delle obbligazioni assunte col presente contratto, il conduttore versa al locatore (che con la firma del contratto ne rilascia, in caso, quietanza) una somma di €`,
                ` `,
                d(`depositoCauzionale`, `90px`),
                ` (`,
                d(`depositoCauzionaleLettere`, `120px`),
                `/00) pari a numero `,
                d(`depositoMensilita`, `45px`),
                " mensilità del canone, comunque non oltre tre, non imputabile in conto canoni e produttiva di interessi legali, corrisposti al conduttore annualmente. Il deposito cauzionale così costituito viene reso al termine della locazione previa verifica dello stato dell'unità immobiliare e dell'osservanza di ogni obbligazione contrattuale.",
              ],
            }),
          ),
        ),
        v(
          `art-4`,
          `Articolo 4 (Oneri accessori)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Per gli oneri accessori le parti fanno applicazione alla “Ripartizione delle spese condominiali”, allegato F all’Accordo territoriale per la locazione a Padova. In sede di consuntivo, il pagamento degli oneri anzidetti, per la quota parte di quelli condominiali/comuni a carico del conduttore, deve avvenire entro sessanta giorni dalla richiesta. Prima di effettuare il pagamento, il conduttore ha diritto di ottenere l'indicazione specifica delle spese anzidette e dei criteri di ripartizione. Ha inoltre diritto di prendere visione - anche tramite organizzazioni sindacali - presso il locatore (o il suo amministratore o l'amministratore condominiale, ove esistente) dei documenti giustificativi delle spese effettuate.`,
            }),
          ),
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Insieme con il pagamento della prima rata del canone annuale, il conduttore versa una quota di acconto non superiore a quella di sua spettanza risultante dal rendiconto dell'anno precedente. Per le spese di cui al presente articolo quali sono: il conduttore versa una quota di € `,
                d(`oneriAnnui`, `90px`),
                ` (`,
                d(`oneriAnnuiLettere`, `120px`),
                `/00) annui, salvo conguaglio.`,
              ],
            }),
          ),
        ),
        v(
          `art-5`,
          `Articolo 5 (Spese di bollo e di registrazione)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Le spese di bollo per il presente contratto e per le ricevute conseguenti sono a carico del conduttore. Il locatore provvede alla registrazione del contratto, dandone documentata comunicazione al conduttore - che corrisponde la quota di sua spettanza, pari alla metà - e all’amministratore del condominio ai sensi dell’art. 13 della legge 431 del 1998. Le parti possono delegare alla registrazione del contratto una delle organizzazioni sindacali che abbia prestato assistenza ai fini della stipula del contratto medesimo. La registrazione è effettuata nei termini di legge: ove dovuta, entro trenta giorni; la documentata comunicazione segue nei successivi sessanta giorni. Restano le esenzioni per la cedolare secca validamente esercitata.",
            }),
          ),
        ),
        v(
          `art-6`,
          `Articolo 6 (Pagamento)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Il canone e gli oneri accessori restano dovuti alle scadenze pattuite. Sono salve le eccezioni consentite dalla legge. Per la risoluzione dovuta a morosità e l’eventuale sanatoria giudiziale si applicano gli articoli 5 e 55 della legge 392/1978: canone non pagato decorsi venti giorni dalla scadenza oppure oneri accessori non pagati per importo superiore a due mensilità. Non è consentito il rilascio forzoso fuori dalle procedure di legge.",
            }),
          ),
        ),
        v(
          `art-7`,
          `Articolo 7 (Uso)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `L'immobile deve essere destinato esclusivamente ad uso di civile abitazione del conduttore. Salvo patto scritto contrario, è fatto divieto di sublocare o dare in comodato, in tutto o in parte, l’unità immobiliare, pena la risoluzione di diritto del contratto.`,
            }),
          ),
        ),
        v(
          `art-8`,
          `Articolo 8 (Recesso del conduttore)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore ha facoltà di recedere dal contratto previo avviso da recapitarsi mediante lettera raccomandata almeno tre mesi prima. Tale facoltà è consentita anche ad uno o più dei conduttori firmatari ed in tal caso, dal mese dell'intervenuto recesso, la locazione prosegue nei confronti degli altri, ferma restando la solidarietà del conduttore recedente per i pregressi periodi di conduzione.`,
            }),
          ),
        ),
        v(
          `art-9`,
          `Articolo 9 (Consegna)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore dichiara di aver visitato l'unità immobiliare locatagli, di averla trovata adatta all'uso convenuto e - così - di prenderla in consegna ad ogni effetto col ritiro delle chiavi, costituendosi da quel momento custode della stessa. Il conduttore si impegna a riconsegnare l'unità immobiliare nello stato in cui l'ha ricevuta, salvo il deperimento d'uso, pena il risarcimento del danno. Si impegna altresì a rispettare le norme del regolamento dello stabile ove esistente, accusando in tal caso ricevuta dello stesso con la firma del presente contratto, così come si impegna ad osservare le deliberazioni dell'assemblea dei condomini. È in ogni caso vietato al conduttore compiere atti e tenere comportamenti che possano recare molestia agli altri abitanti dello stabile.`,
            }),
          ),
        ),
        v(
          `art-10`,
          `Articolo 10 (Modifiche e danni)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Il conduttore non può apportare alcuna modifica, innovazione, miglioria o addizione ai locali locati ed alla loro destinazione, o agli impianti esistenti, senza il preventivo consenso scritto del locatore. Le responsabilità del locatore e dei suoi ausiliari restano disciplinate dalla legge; non sono escluse le responsabilità per dolo, colpa grave o violazione di obblighi inderogabili, ai sensi dell’art. 1229 c.c.",
            }),
          ),
        ),
        v(
          `art-11`,
          `Articolo 11 (Assemblee)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore ha diritto di voto, in luogo del proprietario dell'unità immobiliare locatagli, nelle deliberazioni dell'assemblea condominiale relative alle spese ed alle modalità di gestione dei servizi di riscaldamento e di condizionamento d'aria. Ha inoltre diritto di intervenire, senza voto, sulle deliberazioni relative alla modificazione degli altri servizi comuni. Quanto stabilito in materia di riscaldamento e di condizionamento d'aria si applica anche ove si tratti di edificio non in condominio. In tale caso (e con l'osservanza, in quanto applicabili, delle disposizioni del codice civile sull'assemblea dei condomini) i conduttori si riuniscono in apposita assemblea, convocata dalla proprietà o da almeno tre conduttori.`,
            }),
          ),
        ),
        v(
          `art-12`,
          `Articolo 12 (Impianti)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore - in caso di installazione sullo stabile di antenna televisiva centralizzata - si obbliga a servirsi unicamente dell'impianto relativo, restando sin d'ora il locatore in caso di inosservanza autorizzato a far rimuovere e demolire ogni antenna individuale a spese del conduttore, il quale nulla può pretendere a qualsiasi titolo, fatte salve le eccezioni di legge. Per quanto attiene all'impianto termico autonomo, ove presente, ai sensi della normativa del D.lgs. 192/05, con particolare riferimento all’art. 7 comma 1, il conduttore subentra per la durata della detenzione alla figura del proprietario nell’onere di adempiere alle operazioni di controllo e di manutenzione.`,
            }),
          ),
        ),
        v(
          `art-13`,
          `Articolo 13 (Accessi)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore deve consentire l'accesso all'unità immobiliare al locatore, al suo amministratore nonché ai loro incaricati ove gli stessi ne abbiano - motivandola - ragione. Nel caso in cui il locatore intenda vendere o, in caso di recesso anticipato del conduttore, locare l'unità immobiliare, questi deve consentirne la visita una volta la settimana, per almeno due ore, con esclusione dei giorni festivi oppure con le seguenti modalità: previo appuntamento telefonico da concordare tra le parti.`,
            }),
          ),
        ),
        v(
          `art-14`,
          `Articolo 14 (Commissione di negoziazione paritetica e conciliazione stragiudiziale)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "La Commissione di cui all’articolo 6 del decreto del Ministro delle infrastrutture e dei trasporti di concerto con il Ministro dell’economia e delle finanze, emanato ai sensi dell’articolo 4, comma 2, della legge 431/98, è composta da due membri scelti fra appartenenti alle rispettive organizzazioni firmatarie dell'Accordo territoriale sulla base delle designazioni, rispettivamente, del locatore e del conduttore. L’operato della Commissione è disciplinato dal documento “Procedure di negoziazione e conciliazione stragiudiziale nonché modalità di funzionamento della Commissione”, Allegato E al D.M. 16 gennaio 2017 e Allegato G all’accordo territoriale di Padova. La richiesta di intervento della Commissione non determina la sospensione delle obbligazioni contrattuali. La richiesta di attivazione della Commissione non comporta oneri.",
            }),
          ),
        ),
        v(
          `art-15`,
          `Articolo 15 (Cedolare secca)`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Il locatore dichiara di optare per la cedolare secca ai sensi dell’art. 3 del d.lgs. 23/2011, verificandone i presupposti ed esercitando l’opzione nelle forme fiscali previste. Per il periodo di efficacia rinuncia a ogni aggiornamento del canone, incluso ISTAT. Le esenzioni dall’imposta di registro e di bollo operano nei limiti di legge, anche in presenza di più locatori. L’eventuale revoca è comunicata al conduttore; cessata l’opzione si applicano il regime ordinario e gli aggiornamenti contrattualmente ammessi, senza recupero degli aumenti rinunciati. Il presente testo non attesta l’esistenza dei requisiti fiscali. Fuori dal regime opzionale, l’aggiornamento pattuito non eccede il 75% dell’incremento ISTAT FOI, su richiesta e nei limiti dell’accordo territoriale.",
            }),
          ),
        ),
        {
          key: `art-16-sign`,
          node: (0, P.jsxs)(P.Fragment, {
            children: [
              (0, P.jsx)(`div`, { style: h, children: `Articolo 16 (Varie)` }),
              g(
                (0, P.jsx)(P.Fragment, {
                  children:
                    "Per le comunicazioni contrattuali le parti utilizzano i recapiti indicati nel contratto, comunicandone tempestivamente le variazioni. Restano ferme le norme sulle notificazioni e sulla competenza inderogabile; non è eletto domicilio presso uffici comunali. Le modifiche contrattuali devono risultare per iscritto. I dati personali sono trattati per la stipula e l’esecuzione del rapporto e per gli obblighi di legge, secondo il Regolamento (UE) 2016/679 e il d.lgs. 196/2003 come modificato. Ciascun titolare fornisce l’informativa degli articoli 13 e 14 GDPR, ove applicabile, e comunica solo i dati necessari ai soggetti legittimati. La firma del contratto non costituisce consenso al marketing. Per quanto non previsto si applicano il codice civile, le leggi 392/1978 e 431/1998 e, per i contratti regolati, il D.M. 16 gennaio 2017 e l’accordo territoriale applicabile.",
                }),
              ),
              g(
                (0, P.jsxs)(P.Fragment, {
                  children: [
                    `Letto, approvato e sottoscritto Padova `,
                    d(`dataFirma`, `100px`),
                  ],
                }),
                { marginTop: `1.15rem` },
              ),
              recordsUI(_).signatures({
                conduttori: n,
                locatori: i,
                specificApproval: false,
              }),
              g(
                (0, P.jsx)(P.Fragment, {
                  children: `A mente degli articoli 1341 e 1342 del codice civile, le parti specificamente approvano i patti di cui agli Articoli 3 (Deposito cauzionale e altre forme di garanzia), 4 (Oneri accessori), 6 (Pagamento, risoluzione), 8 (Recesso del conduttore), 9 (Consegna), 10 (Modifiche e danni), 12 (Impianti), 13 (Accessi), 14 (Commissione di negoziazione paritetica), 15 (Cedolare secca), 16 (Varie) del presente contratto.`,
                }),
              ),
              recordsUI(_).signatures({
                conduttori: n,
                locatori: i,
                specificApproval: true,
              }),
            ],
          }),
        },
      ],
    });
  return (0, P.jsx)(wr, {
    title: `Contratto Concordato`,
    icon: (0, P.jsx)(lr, { size: 20 }),
    preview: y,
    clientName: n[0]?.nome,
  });
};
