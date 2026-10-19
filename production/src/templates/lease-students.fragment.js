// Faithful editable extraction from the selected deployed-bundle revision.
ac = () => {
  let [e, t] = useContractDraft(_, "document", {
      immComune: ``,
      immVia: ``,
      immNumero: ``,
      immPiano: ``,
      immMq: ``,
      catFoglio: ``,
      catParticella: ``,
      catSubalterno: ``,
      catZc: ``,
      catCategoria: ``,
      catClasse: ``,
      catVani: ``,
      catRendita: ``,
      accordoDepositatoIl: ``,
      accordoProtocollo: ``,
      zonaAppartenenza: ``,
      tipologiaSuperfici: ``,
      tipologiaEdilizia: ``,
      vetusta: ``,
      posizioneContesto: ``,
      accessoriDotazione: ``,
      dotazioneTecnologica: ``,
      indicePrestazioneEnergetica: ``,
      valoreRenditaCatastale: ``,
      livelloQualita: ``,
      arredoPercentuale: ``,
      apeData: ``,
      apeCodice: ``,
      apeCodiceSezione: ``,
      apeClasse: ``,
      durataMesi: ``,
      durataDal: ``,
      durataAl: ``,
      corsoStudi: ``,
      codicePa: ``,
      matricola: ``,
      accordoCanoneDepositatoIl: ``,
      canoneAnnuo: ``,
      canoneAnnualeInLettere: ``,
      canoneRata: ``,
      giornoPagamento: ``,
      depositoCauzionale: ``,
      depositoCauzionaleLettere: ``,
      oneriMensili: ``,
      oneriMensiliLettere: ``,
      pagamentoCanoneAnnuo: ``,
      pagamentoOneriAnnui: ``,
      pagamentoTotale: ``,
      dataSottoscrizione: ``,
    }),
    [n, r] = useContractDraft(_, "tenants", [ic()], (records) =>
      migrateStudentParties(records, {universita: 'Università degli Studi di Padova', ...e}),
    ),
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
      lineHeight: `1.37`,
      padding: `10mm 13.5mm 10mm 13.5mm`,
    },
    p = {
      background: `#4a4a4a`,
      color: `white`,
      textAlign: `center`,
      fontWeight: `bold`,
      fontSize: `11pt`,
      padding: `4px 8px`,
      marginBottom: `0.64rem`,
      textTransform: `uppercase`,
    },
    m = { marginBottom: `0.52rem`, textAlign: `justify` },
    h = {
      fontSize: `10pt`,
      fontWeight: `bold`,
      margin: `0.46rem 0 0.18rem 0`,
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
          students: true,
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
            children: `Contratto di Locazione Abitativa per Studenti Universitari`,
          }),
          lawText: `(Legge 9 dicembre 1998, n. 431, articolo 5, comma 3)`,
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
                  `L'alloggio è dotato dei seguenti elementi caratterizzanti come riportati nella scheda di calcolo allegato B degli accordi territoriali per le locazioni del Comune di Padova`,
                  ` `,
                  `depositato in data `,
                  d(`accordoDepositatoIl`, `88px`),
                  ` protocollo n. `,
                  d(`accordoProtocollo`, `110px`),
                  `: Zona appartenenza `,
                  d(`zonaAppartenenza`, `90px`),
                  `,`,
                  ` `,
                  `Tipologia superfici `,
                  d(`tipologiaSuperfici`, `100px`),
                  ` mq, Tipologia edilizia `,
                  d(`tipologiaEdilizia`, `110px`),
                  `, Vetustà `,
                  d(`vetusta`, `90px`),
                  `,`,
                  ` `,
                  `Posizione contesto urbano `,
                  d(`posizioneContesto`, `120px`),
                  `, Accessori in dotazione `,
                  d(`accessoriDotazione`, `120px`),
                  `,`,
                  ` `,
                  `Dotazione tecnologica `,
                  d(`dotazioneTecnologica`, `120px`),
                  `, Indice prestazione energetica `,
                  d(`indicePrestazioneEnergetica`, `120px`),
                  `,`,
                  ` `,
                  `Valore rendita catastale `,
                  d(`valoreRenditaCatastale`, `120px`),
                  `, Livello di qualità prevalente `,
                  d(`livelloQualita`, `110px`),
                  `.`,
                  ` `,
                  `L'alloggio è ammobiliato con valore di `,
                  d(`arredoPercentuale`, `55px`),
                  `%.`,
                ],
              }),
            ),
            g(
              (0, P.jsxs)(P.Fragment, {
                children: [
                  `Si da atto che l'immobile è dotato di attestato di prestazione energetica rilasciato in data `,
                  d(`apeData`, `88px`),
                  `, codice identificativo `,
                  d(`apeCodice`, `110px`),
                  `/`,
                  d(`apeCodiceSezione`, `45px`),
                  ` `,
                  `e dichiarato in classe “`,
                  d(`apeClasse`, `38px`),
                  `”. Il conduttore dichiara di averne ricevuto copia.`,
                ],
              }),
            ),
            g(`La locazione è regolata dalle seguenti pattuizioni:`),
          ],
        }),
        v(
          `art-1`,
          `1) DURATA`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                "Il contratto è stipulato, nel limite di sei–trentasei mesi, per la durata di mesi ",
                d(`durataMesi`, `60px`),
                ` dal `,
                d(`durataDal`, `88px`),
                ` al `,
                d(`durataAl`, `88px`),
                ` `,
                `e alla prima scadenza il contratto si rinnova automaticamente per uguale periodo se il conduttore non invia comunicazione al locatore almeno un mese e non oltre tre mesi prima della data di scadenza del contratto.`,
              ],
            }),
          ),
        ),
        ...recordsUI(_)
          .studentBlocks({
            parties: n,
            onChange: s(r),
            pStyle: m,
            keyPrefix: "art-1bis",
            leadText:
              "Ai sensi dell’art. 5, comma 3, legge 431/1998, del D.M. 16 gennaio 2017 e dell’accordo territoriale di Padova sottoscritto il 14 febbraio 2023, depositato il 17 febbraio 2023:",
            trailingText:
              "La Parte Conduttrice risiede in un Comune diverso da quello sede del corso, come risulta dai dati anagrafici. L’iscrizione e i requisiti per il contratto studenti sono verificati prima della firma.",
          })
          .map((block, index) =>
            index === 0
              ? {
                  ...block,
                  node: (0, P.jsxs)(P.Fragment, {
                    children: [
                      (0, P.jsx)("div", {
                        style: h,
                        children: "1Bis) NATURA TRANSITORIA",
                      }),
                      block.node,
                    ],
                  }),
                }
              : block,
          ),
        v(
          `art-2`,
          `2) CANONE`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Il canone annuo di locazione secondo quanto stabilito dall'Accordo territoriale tra le associazioni di categoria e depositato il `,
                d(`accordoCanoneDepositatoIl`, `88px`),
                ` `,
                `presso il Comune di Padova, è convenuto in € `,
                d(`canoneAnnuo`, `90px`),
                ` annui. Euro `,
                d(`canoneAnnualeInLettere`, `140px`),
                ` (…/00), che il conduttore si obbliga a corrispondere al locatore a mezzo bonifico bancario in n. 12 rate mensili anticipate di € `,
                d(`canoneRata`, `90px`),
                ` ciascuna entro il giorno `,
                d(`giornoPagamento`, `50px`),
                ` di ogni mese.`,
              ],
            }),
          ),
          g(
            `Il canone è aggiornato annualmente nella misura del 75% della variazione ISTAT esclusivamente nel caso in cui il locatore non abbia optato per la cedolare secca.`,
          ),
        ),
        v(
          `art-3`,
          `3) DEPOSITO CAUZIONALE`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `A garanzia delle obbligazioni assunte col presente contratto il conduttore versa al locatore che con la firma del presente contratto ne rilascia in caso quietanza la somma di €`,
                ` `,
                d(`depositoCauzionale`, `90px`),
                ` (`,
                d(`depositoCauzionaleLettere`, `150px`),
                "/00), non superiore a tre mensilità del canone e non imputabile ai canoni, produttivo di interessi legali corrisposti annualmente al conduttore. È restituito a fine locazione previa verifica dello stato dell’immobile e delle obbligazioni, salvi gli importi concordati o accertati nelle sedi competenti. La firma non quietanza somme non effettivamente ricevute.",
              ],
            }),
          ),
        ),
        v(
          `art-4`,
          `4) ONERI ACCESSORI`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Per gli oneri accessori le parti fanno applicazione della tabella oneri accessori, allegato D al decreto emanato dal Ministro delle infrastrutture e dei trasporti di concerto con il Ministro dell'economia e delle finanze ai sensi dell'art 4, comma 2, della legge n. 431/98 di cui il modello per studenti costituisce l’allegato C; per Padova si applica la tabella F dell’accordo territoriale.",
            }),
          ),
          g(
            (0, P.jsx)(P.Fragment, {
              children: `In sede di consuntivo, il pagamento degli oneri anzidetti, per la quota parte di quelli condominiali/comuni a carico del conduttore deve avvenire entro sessanta giorni dalla richiesta. Prima di effettuare il pagamento, il conduttore ha diritto di ottenere l'indicazione specifica delle spese anzidette e dei criteri di ripartizione. Ha inoltre diritto di prendere visione, anche tramite organizzazioni sindacali, presso il locatore o il suo amministratore o l'amministratore condominiale ove esistente, dei documenti giustificativi delle spese effettuate.`,
            }),
          ),
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Insieme con il pagamento della prima rata del canone, il conduttore versa una quota di acconto non superiore a quella di sua spettanza risultante dal rendiconto dell'anno precedente. Per le spese di cui al presente articolo il conduttore versa una quota di € `,
                d(`oneriMensili`, `90px`),
                ` (`,
                d(`oneriMensiliLettere`, `120px`),
                `/00) mensili, salvo conguaglio.`,
              ],
            }),
          ),
        ),
        v(
          `art-5`,
          `5) SPESE DI BOLLO E DI REGISTRAZIONE`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Le spese di bollo per il presente contratto e per le ricevute conseguenti sono a carico del conduttore, il locatore provvede alla registrazione del contratto, dandone documentata comunicazione al conduttore, che corrisponde la quota di Sua spettanza pari alla metà e all'amministratore del condominio ai sensi dell'art 13 legge 431/98. Le parti possono delegare alla registrazione del contratto una delle organizzazioni sindacali che abbia prestato assistenza ai fini della stipula del contratto medesimo. La registrazione è effettuata nei termini di legge: ove dovuta, entro trenta giorni; la documentata comunicazione segue nei successivi sessanta giorni. Restano le esenzioni per la cedolare secca validamente esercitata.",
            }),
          ),
        ),
        v(
          `art-6`,
          `6) PAGAMENTO`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Il pagamento del canone annuo (€ `,
                d(`pagamentoCanoneAnnuo`, `90px`),
                `) e di quant'altro dovuto anche per gli oneri accessori annui (€ `,
                d(`pagamentoOneriAnnui`, `90px`),
                `)`,
                ` `,
                `e così in totale (€ `,
                d(`pagamentoTotale`, `90px`),
                ") restano dovuti alle scadenze pattuite. Sono salve le eccezioni consentite dalla legge. Per la risoluzione dovuta a morosità e l’eventuale sanatoria giudiziale si applicano gli articoli 5 e 55 della legge 392/1978: canone non pagato decorsi venti giorni dalla scadenza oppure oneri accessori non pagati per importo superiore a due mensilità. Non è consentito il rilascio forzoso fuori dalle procedure di legge.",
              ],
            }),
          ),
        ),
        v(
          `art-7`,
          `7) USO`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `L'immobile deve essere destinato esclusivamente a civile abitazione del conduttore. Salvo espresso patto scritto contrario è fatto divieto di sublocazione e di comodato sia totale sia parziale. Per la successione nel contratto si applica l'art 6 della legge n. 392/78, nel testo vigente a seguito della sentenza della Corte Costituzionale n. 404/1988.`,
            }),
          ),
        ),
        v(
          `art-8`,
          `8) RECESSO DEL CONDUTTORE`,
          g(
            `È facoltà del conduttore recedere dal contratto per gravi motivi, previo avviso da recapitarsi tramite lettera raccomandata almeno tre mesi prima.`,
          ),
        ),
        v(
          `art-9`,
          `9) CONSEGNA`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore dichiara di aver visitato l'unità immobiliare locatagli, di averla trovata adatta all'uso convenuto e pertanto di prenderla in consegna ad ogni effetto col ritiro delle chiavi costituendosi, da quel momento, custode della stessa. Il conduttore si impegna a riconsegnare l'unità immobiliare nello stato in cui l'ha ricevuta, salvo il deperimento d'uso, pena il risarcimento del danno, si impegna altresì a rispettare le norme del regolamento dello stabile ove esistente, accusando in tal caso ricevuta dello stesso con la firma del presente contratto, così come si impegna ad osservare le deliberazioni dell'assemblea dei condomini. È in ogni caso vietato al conduttore compiere atti e tenere comportamenti che possono recare molestia agli altri abitanti dello stabile.`,
            }),
          ),
        ),
        v(
          `art-10`,
          `10) MODIFICHE E DANNI`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Il conduttore non può apportare alcuna modifica, innovazione, miglioria o addizione ai locali locati ed alla loro destinazione, o agli impianti esistenti, senza il preventivo consenso scritto del locatore. Le responsabilità del locatore e dei suoi ausiliari restano disciplinate dalla legge; non sono escluse le responsabilità per dolo, colpa grave o violazione di obblighi inderogabili, ai sensi dell’art. 1229 c.c.",
            }),
          ),
        ),
        v(
          `art-11`,
          `11) ASSEMBLEE`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore ha diritto di voto, in luogo del proprietario dell'unità immobiliare locatagli, nelle deliberazioni dell'assemblea condominiale relative alle spese ed alle modalità di gestione dei servizi di riscaldamento e di condizionamento d'aria. Ha inoltre diritto di intervenire, senza voto, sulle deliberazioni relative alla modificazione degli altri servizi comuni. Quanto stabilito in materia di riscaldamento e di condizionamento d'aria si applica anche ove si tratti di edificio non in condominio. In tal caso i conduttori si uniscono in apposita assemblea, convocata dalla proprietà o da almeno tre conduttori.`,
            }),
          ),
        ),
        v(
          `art-12`,
          `12) IMPIANTI`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore in caso di installazione sullo stabile di antenna televisiva centralizzata, si obbliga a servirsi unicamente dell'impianto relativo, restando sin d'ora il locatore, in caso di inosservanza, autorizzato a far rimuovere e demolire ogni antenna individuale a spese del conduttore il quale nulla può pretendere qualsiasi titolo, fatte salve le eccezioni di legge. Per quanto attiene all'impianto termico autonomo, ove presente, ai sensi della normativa del d.lgs. n. 192/05, con particolare riferimento all’art. 7 comma 1, il conduttore subentra per la durata della detenzione alla figura del proprietario nell'onere di adempiere alle operazioni di controllo e di manutenzione.`,
            }),
          ),
        ),
        v(
          `art-13`,
          `13) ACCESSO`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore deve consentire l'accesso all'unità immobiliare al locatore, al suo amministratore nonché ai loro incaricati ove gli stessi ne abbiano, motivandola, ragione. Nel caso in cui il locatore intenda vendere, o in caso di recesso anticipato del conduttore, locare l'unità immobiliare, questi deve consentire la visita una volta la settimana, per almeno due ore, con esclusione dei giorni festivi.`,
            }),
          ),
        ),
        v(
          `art-14`,
          "14) NEGOZIAZIONE PARITETICA E CONCILIAZIONE",
          g(
            (0, P.jsx)(P.Fragment, {
              children: `La commissione di cui all'art 6 del decreto del Ministro delle Infrastrutture e dei trasporti di concerto con il Ministro dell'economia e delle finanze, emanato ai sensi dell'art 4, comma 2, della legge 431/1998, è composta da due membri scelti fra appartenenti alle rispettive organizzazioni firmatarie dell'accordo territoriale sulla base delle designazioni, rispettivamente del locatore e del conduttore.`,
            }),
          ),
          g(
            (0, P.jsx)(P.Fragment, {
              children: `L'operato della Commissione è disciplinato dal documento “Procedure di negoziazione e conciliazione stragiudiziale” nonché modalità di funzionamento della Commissione, allegato E al citato decreto. La richiesta di intervento della Commissione non determina la sospensione delle obbligazioni contrattuali. La richiesta di attivazione della Commissione non comporta oneri.`,
            }),
          ),
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "È salva la tutela davanti all’autorità giudiziaria competente. La mediazione civile, quando condizione di procedibilità ai sensi del d.lgs. 28/2010, segue la disciplina vigente. Non è convenuto un arbitrato obbligatorio.",
            }),
          ),
        ),
        v(
          `art-15`,
          `15) CEDOLARE SECCA`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Il locatore dichiara di optare per la cedolare secca ai sensi dell’art. 3 del d.lgs. 23/2011, verificandone i presupposti ed esercitando l’opzione nelle forme fiscali previste. Per il periodo di efficacia rinuncia a ogni aggiornamento del canone, incluso ISTAT. Le esenzioni dall’imposta di registro e di bollo operano nei limiti di legge, anche in presenza di più locatori. L’eventuale revoca è comunicata al conduttore; cessata l’opzione si applicano il regime ordinario e gli aggiornamenti contrattualmente ammessi, senza recupero degli aumenti rinunciati. Il presente testo non attesta l’esistenza dei requisiti fiscali. Fuori dal regime opzionale, l’aggiornamento pattuito non eccede il 75% dell’incremento ISTAT FOI, su richiesta e nei limiti dell’accordo territoriale.",
            }),
          ),
        ),
        {
          key: "art-16",
          node: (0, P.jsxs)(P.Fragment, {
            children: [
              (0, P.jsx)(`div`, { style: h, children: `16) VARIE` }),
              g(
                (0, P.jsx)(P.Fragment, {
                  children:
                    "Per le comunicazioni contrattuali le parti utilizzano i recapiti indicati nel contratto, comunicandone tempestivamente le variazioni. Restano ferme le norme sulle notificazioni e sulla competenza inderogabile; non è eletto domicilio presso uffici comunali. Le modifiche contrattuali devono risultare per iscritto. I dati personali sono trattati per la stipula e l’esecuzione del rapporto e per gli obblighi di legge, secondo il Regolamento (UE) 2016/679 e il d.lgs. 196/2003 come modificato. Ciascun titolare fornisce l’informativa degli articoli 13 e 14 GDPR, ove applicabile, e comunica solo i dati necessari ai soggetti legittimati. La firma del contratto non costituisce consenso al marketing. Per quanto non previsto si applicano il codice civile, le leggi 392/1978 e 431/1998 e, per i contratti regolati, il D.M. 16 gennaio 2017 e l’accordo territoriale applicabile.",
                }),
              ),
            ],
          }),
        },
        {
          key: "signature",
          node: (0, P.jsxs)(P.Fragment, {
            children: [
              g(
                (0, P.jsxs)(P.Fragment, {
                  children: [
                    `Letto approvato e sottoscritto in data `,
                    d(`dataSottoscrizione`, `100px`),
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
                  children:
                    "Ai sensi degli articoli 1341 e 1342 c.c., ove applicabili, le parti approvano specificamente le pattuizioni degli articoli 7 (limiti alla sublocazione e al comodato), 10 (consenso alle modifiche), 12 (impianti) e 13 (accessi). La firma non sana clausole nulle o contrarie a norme inderogabili.",
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
    title: `Contratto Transitorio per Studenti`,
    icon: (0, P.jsx)(lr, { size: 20 }),
    preview: y,
    clientName: n[0]?.nome,
  });
};
