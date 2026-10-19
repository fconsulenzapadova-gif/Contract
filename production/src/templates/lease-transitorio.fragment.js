// Faithful editable extraction from the selected deployed-bundle revision.
uc = () => {
  let [e, t] = useContractDraft(_, "document", {
      immVia: ``,
      immNumero: ``,
      immPiano: ``,
      catFoglio: ``,
      catParticella: ``,
      catSubalterno: ``,
      catCategoria: ``,
      catClasse: ``,
      immMq: ``,
      catRendita: ``,
      apeClasse: ``,
      durataMesi: ``,
      durataDal: ``,
      durataAl: ``,
      esigenzaTransitoria: ``,
      esigenzaDocumento: ``,
      canoneRate: ``,
      canoneRata: ``,
      giornoPagamento: ``,
      depositoCauzionale: ``,
      depositoMensilita: ``,
      utenzeSpecifica: ``,
      oneriMensili: ``,
      recessoGiorni: ``,
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
    f = lc(e.canoneRate),
    p = lc(e.canoneRata),
    m =
      f === null || p === null
        ? ``
        : (f * p).toLocaleString(`it-IT`, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
    h = {
      fontSize: `10pt`,
      lineHeight: `1.39`,
      padding: `10.5mm 14mm 10mm 14mm`,
    },
    g = {
      background: `#4a4a4a`,
      color: `white`,
      textAlign: `center`,
      fontWeight: `bold`,
      fontSize: `11pt`,
      padding: `4px 8px`,
      marginBottom: `0.68rem`,
      textTransform: `uppercase`,
    },
    v = { marginBottom: `0.56rem`, textAlign: `justify` },
    y = {
      fontSize: `10pt`,
      fontWeight: `bold`,
      margin: `0.48rem 0 0.18rem 0`,
    },
    b = (e, t) => (0, P.jsx)(`p`, { style: { ...v, ...t }, children: e }),
    x = (e, t, ...n) => ({
      key: e,
      node: (0, P.jsxs)(P.Fragment, {
        children: [(0, P.jsx)(`div`, { style: y, children: t }), n],
      }),
    }),
    S = (0, P.jsx)(Dr, {
      pageStyle: h,
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
            style: g,
            children: `Locazione Abitativa di Natura Transitoria`,
          }),
          lawText: `(Legge 9 dicembre 1998, n. 431, articolo 5, comma 1)`,
          pStyle: v,
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
        }),
        x(
          `art-1`,
          `Articolo 1 (Durata)`,
          b(
            (0, P.jsxs)(P.Fragment, {
              children: [
                "Il contratto è stipulato, per un periodo non superiore a diciotto mesi, per la durata di ",
                d(`durataMesi`, `60px`),
                ` mesi, dal `,
                d(`durataDal`, `88px`),
                ` al `,
                d(`durataAl`, `88px`),
                `, allorché, fatto salvo quanto previsto dall’articolo 2 cessa senza bisogno di alcuna disdetta.`,
              ],
            }),
          ),
        ),
        x(
          `art-2`,
          `Articolo 2 (Esigenza del locatore/conduttore)`,
          b(
            (0, P.jsxs)(P.Fragment, {
              children: [
                "Il conduttore, nel rispetto di quanto previsto dal decreto del Ministro delle infrastrutture e dei trasporti di concerto con il Ministro dell’economia e delle finanze, emanato ai sensi dell'articolo 4, comma 2, della legge n. 431/98 - il cui modello transitorio è l’Allegato B, corrispondente all’Allegato D dell’accordo territoriale di Padova - e dall'Accordo territoriale depositato presso il Comune di Padova, ovvero dall’Accordo integrativo sottoscritto che dichiara la seguente esigenza che giustifica la transitorietà del contratto ",
                d(`esigenzaTransitoria`, `260px`),
                `, e che documenta, in caso di durata superiore a 30 giorni, allegando `,
                d(`esigenzaDocumento`, `260px`),
                `.`,
              ],
            }),
          ),
        ),
        x(
          `art-3`,
          `Articolo 3 (Inadempimento delle modalità di stipula)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children: `Il presente contratto è ricondotto alla durata prevista dall’art. 2 comma 1 della legge 9 dicembre 1998, n. 431, in caso di inadempimento delle modalità di stipula previste dall’art. 2, commi 1, 2, 3, 4, 5 e 6 del decreto dei Ministri delle infrastrutture e dell’economia e delle finanze ex art. 4 comma 2 della legge 431/98. In ogni caso, ove il locatore abbia riacquistato la disponibilità dell'alloggio alla scadenza dichiarando di volerlo adibire ad un uso determinato e non lo adibisca, senza giustificato motivo, nel termine di sei mesi dalla data in cui ha riacquistato la detta disponibilità, a tale uso, il conduttore ha diritto al ripristino del rapporto di locazione alle condizioni di cui all'articolo 2, comma 1, della legge n. 431/98 o, in alternativa, ad un risarcimento in misura pari a trentasei mensilità dell'ultimo canone di locazione corrisposto.`,
            }),
          ),
        ),
        x(
          `art-4`,
          `Articolo 4 (Canone)`,
          b(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Il canone di locazione, secondo quanto stabilito dal decreto di cui all'articolo 4, comma 3, della legge n. 431/1998 è convenuto in €`,
                ` `,
                (0, P.jsx)(`output`, {
                  "aria-label": `Canone totale`,
                  "aria-live": `polite`,
                  className: `inline-input`,
                  style: {
                    width: `90px`,
                    display: `inline-block`,
                    textAlign: `right`,
                  },
                  children: m,
                }),
                `, importo che il conduttore si obbliga a corrispondere nel domicilio del locatore ovvero a mezzo di bonifico bancario, in numero di `,
                d(`canoneRate`, `45px`),
                ` rate eguali anticipate di € `,
                d(`canoneRata`, `90px`),
                `, entro il giorno `,
                d(`giornoPagamento`, `45px`),
                ` del mese.`,
              ],
            }),
          ),
        ),
        x(
          `art-5`,
          `Articolo 5 (Deposito cauzionale e altre forme di garanzia)`,
          b(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `A garanzia delle obbligazioni assunte col presente contratto, il conduttore versa al locatore (che con la firma del contratto ne rilascia, in caso, quietanza) una somma di euro`,
                ` `,
                d(`depositoCauzionale`, `90px`),
                ` pari a numero `,
                d(`depositoMensilita`, `45px`),
                " mensilità del canone, comunque non oltre tre, non imputabile in conto canoni e produttiva di interessi legali, corrisposti al conduttore annualmente. Il deposito cauzionale così costituito viene reso al termine della locazione previa verifica dello stato dell'unità immobiliare e dell'osservanza di ogni obbligazione contrattuale.",
              ],
            }),
          ),
        ),
        x(
          `art-6`,
          `Articolo 6 (Oneri accessori)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children: `Per gli oneri accessori le parti fanno applicazione alla “Ripartizione delle spese condominiali” allegato F, per la locazione a Padova. In sede di consuntivo, il pagamento degli oneri anzidetti, per la quota parte di quelli condominiali a carico del conduttore, deve avvenire entro sessanta giorni dalla richiesta. Prima di effettuare il pagamento, il conduttore ha diritto di ottenere l’indicazione specifica delle spese anzidette e dei criteri di ripartizione. Ha inoltre diritto di prendere visione - anche tramite organizzazioni sindacali - presso il locatore (o il suo amministratore o l'amministratore condominiale, ove esistente) dei documenti giustificativi delle spese effettuate.`,
            }),
          ),
          b(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Insieme con il pagamento della prima rata del canone annuale, il conduttore versa una quota di acconto non superiore a quella di sua spettanza risultante dal rendiconto dell'anno precedente. Sono interamente a carico del conduttore le spese relative ad ogni utenza (`,
                d(`utenzeSpecifica`, `180px`),
                `) Per le spese di cui al presente articolo, il conduttore versa una quota di €`,
                ` `,
                d(`oneriMensili`, `90px`),
                ` mensili, salvo conguaglio.`,
              ],
            }),
          ),
        ),
        x(
          `art-7`,
          `Articolo 7 (Spese di bollo e registrazione)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children:
                "Le spese di bollo per il presente contratto e per le ricevute conseguenti sono a carico del conduttore. Il locatore provvede alla registrazione del contratto, ove dovuta, dandone comunicazione al conduttore - che corrisponde la quota di sua spettanza, pari alla metà - e all’Amministratore del Condominio ai sensi dell’art. 13 della legge 431/98. Le parti possono delegare alla registrazione del contratto una delle organizzazioni sindacali che abbia prestato assistenza ai fini della stipula del contratto medesimo. La registrazione è effettuata nei termini di legge: ove dovuta, entro trenta giorni; la documentata comunicazione segue nei successivi sessanta giorni. Restano le esenzioni per la cedolare secca validamente esercitata.",
            }),
          ),
        ),
        x(
          `art-8`,
          `Articolo 8 (Pagamento)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children:
                "Il canone e gli oneri accessori restano dovuti alle scadenze pattuite. Sono salve le eccezioni consentite dalla legge. Per la risoluzione dovuta a morosità e l’eventuale sanatoria giudiziale si applicano gli articoli 5 e 55 della legge 392/1978: canone non pagato decorsi venti giorni dalla scadenza oppure oneri accessori non pagati per importo superiore a due mensilità. Non è consentito il rilascio forzoso fuori dalle procedure di legge.",
            }),
          ),
        ),
        x(
          `art-9`,
          `Articolo 9 (Uso)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children: `L'immobile deve essere destinato esclusivamente a civile abitazione della parte conduttrice e delle persone attualmente conviventi. Salvo patto scritto contrario, è fatto divieto di sublocare o dare in comodato, né in tutto né in parte, l’unità immobiliare, pena la risoluzione di diritto del contratto. Per la successione nel contratto, si applica l'articolo 6 della legge n. 392/78, nel testo vigente a seguito della sentenza della Corte costituzionale n. 404 del 1988.`,
            }),
          ),
        ),
        x(
          `art-10`,
          `Articolo 10 (Recesso del conduttore)`,
          b(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Il conduttore ha facoltà di recedere per gravi motivi dal contratto previo avviso da recapitarsi mediante lettera raccomandata almeno `,
                d(`recessoGiorni`, `50px`),
                ` giorni prima.`,
              ],
            }),
          ),
        ),
        x(
          `art-11`,
          `Articolo 11 (Consegna)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore dichiara di aver visitato l'unità immobiliare locatagli, di averla trovata adatta all'uso convenuto e, pertanto, di prenderla in consegna ad ogni effetto col ritiro delle chiavi, costituendosi da quel momento custode della stessa. Il conduttore si impegna a riconsegnare l'unità immobiliare nello stato in cui l'ha ricevuta, salvo il deperimento d'uso, pena il risarcimento del danno; si impegna, altresì, a rispettare le norme del regolamento dello stabile ove esistente, accusando in tal caso ricevuta dello stesso con la firma del presente contratto, così come si impegna ad osservare le deliberazioni dell'assemblea dei condomini. È in ogni caso vietato al conduttore compiere atti e tenere comportamenti che possano recare molestia agli altri abitanti dello stabile. Le parti danno atto, in relazione allo stato dell’unità immobiliare, ai sensi dell'articolo 1590 del Codice civile, di quanto segue: di quanto risulta dall'allegato verbale di consegna.`,
            }),
          ),
        ),
        x(
          `art-12`,
          `Articolo 12 (Modifiche e danni)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore non può apportare alcuna modifica, innovazione, miglioria o addizione ai locali locati ed alla loro destinazione, o agli impianti esistenti, senza il preventivo consenso scritto del locatore.`,
            }),
          ),
        ),
        x(
          `art-13`,
          `Articolo 13 (Assemblee)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children:
                "Le responsabilità del locatore e dei suoi ausiliari restano disciplinate dalla legge; non sono escluse le responsabilità per dolo, colpa grave o violazione di obblighi inderogabili, ai sensi dell’art. 1229 c.c. Il conduttore ha diritto di voto, in luogo del proprietario dell'unità immobiliare locatagli, nelle deliberazioni dell'assemblea condominiale relative alle spese ed alle modalità di gestione dei servizi di riscaldamento e di condizionamento d'aria. Ha inoltre diritto di intervenire, senza voto, sulle deliberazioni relative alla modificazione degli altri servizi comuni. Quanto stabilito in materia di riscaldamento e di condizionamento d'aria si applica anche ove si tratti di edificio non in condominio. In tale caso (e con l'osservanza, in quanto applicabili, delle disposizioni del codice civile sull'assemblea dei condomini) i conduttori si riuniscono in apposita assemblea, convocata dalla proprietà o da almeno tre conduttori.",
            }),
          ),
        ),
        x(
          `art-14`,
          `Articolo 14 (Impianti)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore - in caso d'installazione sullo stabile di antenna televisiva centralizzata - si obbliga a servirsi unicamente dell'impianto relativo, restando sin d'ora il locatore, in caso di inosservanza, autorizzato a far rimuovere e demolire ogni antenna individuale a spese del conduttore, il quale nulla può pretendere a qualsiasi titolo, fatte salve le eccezioni di legge. Per quanto attiene all'impianto termico autonomo, ove presente, ai sensi della normativa del d.lgs. n.192/05, con particolare riferimento all’art. 7 comma 1, il conduttore subentra per la durata della detenzione alla figura del proprietario nell’onere di adempiere alle operazioni di controllo e di manutenzione.`,
            }),
          ),
        ),
        x(
          `art-15`,
          `Articolo 15 (Accesso)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children: `Il conduttore deve consentire l'accesso all'unità immobiliare al locatore, al suo amministratore nonché ai loro incaricati ove gli stessi ne abbiano - motivandola - ragione. Nel caso in cui il locatore intenda vendere o locare l'unità immobiliare, in caso di recesso anticipato del conduttore, questi deve consentirne la visita una volta la settimana, per almeno due ore, con esclusione dei giorni festivi.`,
            }),
          ),
        ),
        x(
          `art-16`,
          `Articolo 16 (Commissione di negoziazione paritetica e conciliazione stragiudiziale)`,
          b(
            (0, P.jsx)(P.Fragment, {
              children:
                "La Commissione di cui all’articolo 6 del decreto del Ministro delle infrastrutture e dei trasporti di concerto con il Ministro dell’economia e delle finanze, emanato ai sensi dell’articolo 4, comma 2, della legge 431/98, è composta da due membri scelti fra appartenenti alle rispettive organizzazioni firmatarie dell'Accordo territoriale sulla base delle designazioni, rispettivamente, del locatore e del conduttore. L’operato della Commissione è disciplinato dal documento “Procedure di negoziazione e conciliazione stragiudiziale nonché modalità di funzionamento della Commissione” Allegato E al D.M. 16 gennaio 2017 e Allegato G all’accordo territoriale di Padova. La richiesta di intervento della Commissione non determina la sospensione delle obbligazioni contrattuali. La richiesta di attivazione della Commissione non comporta oneri.",
            }),
          ),
        ),
        {
          key: `art-17-sign`,
          node: (0, P.jsxs)(P.Fragment, {
            children: [
              (0, P.jsx)(`div`, { style: y, children: `Articolo 17 (Varie)` }),
              b(
                (0, P.jsx)(P.Fragment, {
                  children:
                    "Per le comunicazioni contrattuali le parti utilizzano i recapiti indicati nel contratto, comunicandone tempestivamente le variazioni. Restano ferme le norme sulle notificazioni e sulla competenza inderogabile; non è eletto domicilio presso uffici comunali. Le modifiche contrattuali devono risultare per iscritto. I dati personali sono trattati per la stipula e l’esecuzione del rapporto e per gli obblighi di legge, secondo il Regolamento (UE) 2016/679 e il d.lgs. 196/2003 come modificato. Ciascun titolare fornisce l’informativa degli articoli 13 e 14 GDPR, ove applicabile, e comunica solo i dati necessari ai soggetti legittimati. La firma del contratto non costituisce consenso al marketing. Per quanto non previsto si applicano il codice civile, le leggi 392/1978 e 431/1998 e, per i contratti regolati, il D.M. 16 gennaio 2017 e l’accordo territoriale applicabile.",
                }),
              ),
              b(`Letto, approvato e sottoscritto`, {
                marginTop: `1.15rem`,
                fontWeight: `bold`,
              }),
              b(
                (0, P.jsxs)(P.Fragment, {
                  children: [`Padova, `, d(`dataFirma`, `120px`)],
                }),
              ),
              recordsUI(_).signatures({
                conduttori: n,
                locatori: i,
                specificApproval: false,
              }),
              b(
                (0, P.jsx)(P.Fragment, {
                  children: `A mente degli articoli 1341 e 1342, del Codice civile, le parti specificamente approvano i patti di cui agli articoli 2 (Esigenza del locatore/conduttore), 3 (Cessazione delle condizioni di transitorietà), 4 (Canone), 5 (Deposito cauzionale e altre forme di garanzia), 6 (Oneri accessori), 8 (Pagamento, risoluzione), 9 (Uso), 10 (Recesso del conduttore), 11 (Consegna), 12 (Modifiche e danni), 14 (Impianti), 15 (Accesso), 16 (Commissione di negoziazione paritetica e conciliazione stragiudiziale) e 17 (Varie) del presente contratto.`,
                }),
                { marginTop: `1.4rem` },
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
    title: `Contratto Transitorio`,
    icon: (0, P.jsx)(lr, { size: 20 }),
    preview: S,
    clientName: n[0]?.nome,
  });
};
