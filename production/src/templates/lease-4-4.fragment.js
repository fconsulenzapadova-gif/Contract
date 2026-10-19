// Faithful editable extraction from the selected deployed-bundle revision.
oc = () => {
  let [e, t] = useContractDraft(_, "document", {
      immVia: ``,
      immNumero: ``,
      immPiano: ``,
      immMq: ``,
      catFoglio: ``,
      catParticella: ``,
      catSubalterno: ``,
      catCategoria: ``,
      catClasse: ``,
      catRendita: ``,
      durataDal: ``,
      durataAl: ``,
      preavvisoMesi: ``,
      canoneAnnuo: ``,
      canoneAnnuoLettere: ``,
      canoneRate: ``,
      canoneRata: ``,
      canoneRataLettere: ``,
      speseOrdinarieMensili: ``,
      speseOrdinarieMensiliLettere: ``,
      depositoCauzionale: ``,
      depositoCauzionaleLettere: ``,
      dataFirma: ``,
      apeClasse: ``,
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
      lineHeight: `1.4`,
      padding: `10.5mm 14mm 10mm 14mm`,
    },
    p = {
      background: `#4a4a4a`,
      color: `white`,
      textAlign: `center`,
      fontWeight: `bold`,
      fontSize: `11pt`,
      padding: `4px 8px`,
      marginBottom: `0.7rem`,
      textTransform: `uppercase`,
    },
    m = { marginBottom: `0.58rem`, textAlign: `justify` },
    h = { fontSize: `10pt`, fontWeight: `bold`, margin: `0.5rem 0 0.18rem 0` },
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
            children: `Contratto di Locazione ad Uso Abitativo`,
          }),
          lawText: `(Legge 9 dicembre 1998, n. 431, articolo 2, comma 1)`,
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
              "Arredi e stato di consegna risultano dall’inventario e dal verbale allegati, da compilare e sottoscrivere dalle parti.",
            ),
          ],
        }),
        v(
          `art-1`,
          `1. CONDIZIONI DELL’IMMOBILE E DIVIETO DI MODIFICHE`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Le parti descrivono lo stato dell’immobile, degli impianti e degli arredi nel verbale di consegna allegato, indicando difetti e interventi concordati. Il conduttore restituisce l’immobile nello stato ricevuto, salvo il normale deterioramento d’uso; non sussiste un obbligo automatico di tinteggiatura per la normale usura. Restano le garanzie per vizi e le responsabilità previste dagli articoli 1575, 1578 e 1579 c.c. Modifiche, migliorie e addizioni richiedono il consenso scritto del locatore e sono disciplinate dagli articoli 1592 e 1593 c.c. e dagli accordi scritti leciti delle parti.",
            }),
          ),
        ),
        v(
          `art-2`,
          `2. DESTINAZIONE DELL’IMMOBILE`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `La Parte Conduttrice dichiara che l’unità immobiliare oggetto della locazione sarà adibita esclusivamente ad abitazione propria e dei componenti del nucleo familiare convivente.`,
            }),
          ),
        ),
        v(
          `art-3`,
          `3. DURATA DELLA LOCAZIONE`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `La durata della locazione viene fissata e stabilita ai sensi del COMMA 1, dell’art. 2 della legge n. 431/1998, in anni 4, con decorrenza dal `,
                d(`durataDal`, `88px`),
                ` `,
                `e scadenza il `,
                d(`durataAl`, `88px`),
                ". Tale durata si protrarrà automaticamente per un eguale periodo di anni 4, salvo che la Parte Locatrice, con raccomandata da recapitarsi 6 mesi prima della prima scadenza contrattuale, manifesti alla parte conduttrice la propria intenzione di adibire l’immobile agli usi od effettuare nello stesso le opere di cui all’art. 3 della legge n. 431/1998, ovvero vendere l’immobile alle condizioni e modalità previste nel medesimo articolo. Alla seconda scadenza ciascuna parte può proporre nuove condizioni o rinunciare al rinnovo con comunicazione almeno sei mesi prima; l’altra risponde entro sessanta giorni. In difetto di comunicazione il contratto si rinnova alle stesse condizioni, ai sensi dell’art. 2, comma 1, legge 431/1998.",
              ],
            }),
          ),
        ),
        v(
          `art-4`,
          `4. RECESSO ANTICIPATO`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `La Parte Conduttrice ha facoltà di recedere anticipatamente dal contratto con un preavviso di almeno `,
                d(`preavvisoMesi`, `48px`),
                " mesi, da recapitarsi a mezzo di raccomandata A/R. È comunque sempre salvo il recesso per gravi motivi con preavviso di sei mesi ai sensi dell’art. 3, comma 6, legge 431/1998, o il minore termine qui pattuito.",
              ],
            }),
          ),
        ),
        v(
          `art-5`,
          `5. CORRISPETTIVO`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Il canone di locazione è fissato di comune accordo tra le Parti in Euro `,
                d(`canoneAnnuo`, `90px`),
                ` (`,
                d(`canoneAnnuoLettere`, `150px`),
                `/00) annui da corrispondersi in`,
                ` `,
                d(`canoneRate`, `42px`),
                ` rate mensili anticipate di Euro `,
                d(`canoneRata`, `90px`),
                ` (`,
                d(`canoneRataLettere`, `120px`),
                `/00) entro il giorno 5 di ogni mese con versamento presso il conto corrente bancario intestato al Locatore.`,
              ],
            }),
          ),
        ),
        v(
          `art-6`,
          `6. AGGIORNAMENTO ISTAT`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Il canone è aggiornabile annualmente, su richiesta scritta, nella misura del 100% della variazione dell’indice ISTAT FOI al netto dei tabacchi, esclusivamente nei periodi in cui non opera la cedolare secca. Per i periodi di efficacia dell’opzione ai sensi dell’art. 3 del d.lgs. 23/2011 il locatore rinuncia a qualsiasi aggiornamento; non sono recuperabili gli aumenti rinunciati.",
            }),
          ),
        ),
        v(
          `art-7`,
          `7. ONERI ACCESSORI`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                `Oltre al canone sono interamente a carico della Parte Conduttrice le spese relative al riscaldamento e dell'energia elettrica, nonché alle forniture degli altri servizi comuni, quelle elencate dall’art. 9 della legge n. 392/1978 applicandosi, per le modalità di verifica, pagamento e diritto del conduttore a partecipare all’assemblea, quanto previsto dagli articoli 9 e 10 della legge 392/1978. A tal proposito si precisa che le spese condominiali ordinarie sono a carico della Parte Conduttrice, mentre le spese condominiali straordinarie sono a carico della Parte Locatrice. La Parte Conduttrice si impegna a pagare direttamente alla Parte Locatrice una quota mensile pari ad € `,
                d(`speseOrdinarieMensili`, `90px`),
                ` `,
                `(`,
                d(`speseOrdinarieMensiliLettere`, `120px`),
                `/00) per le spese condominiali ordinarie, salvo conguaglio.`,
              ],
            }),
          ),
        ),
        v(
          `art-8`,
          `8. MOROSITÀ`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "La morosità è disciplinata dagli articoli 5 e 55 della legge 392/1978: rileva il canone non pagato decorsi venti giorni dalla scadenza, oppure il mancato pagamento degli oneri accessori quando l’importo non pagato supera due mensilità del canone. Restano le tutele, le eccezioni consentite dalla legge e la sanatoria giudiziale nei casi previsti; non è consentito il rilascio forzoso fuori dalle procedure di legge.",
            }),
          ),
        ),
        v(
          `art-9`,
          `9. GARANZIA`,
          g(
            (0, P.jsxs)(P.Fragment, {
              children: [
                "Il deposito cauzionale concordato, da documentare con separata ricevuta o prova di pagamento, è pari a Euro",
                ` `,
                d(`depositoCauzionale`, `90px`),
                ` (`,
                d(`depositoCauzionaleLettere`, `130px`),
                "/00), comunque non superiore a tre mensilità del canone e non imputabile ai canoni. Il deposito produce interessi legali da corrispondere al conduttore annualmente. Alla riconsegna le parti redigono il verbale e il deposito è restituito previa verifica delle obbligazioni; eventuali trattenute devono essere motivate e concordate o accertate nelle sedi competenti, con restituzione della quota non contestata. La sottoscrizione non attesta un pagamento non eseguito.",
              ],
            }),
          ),
        ),
        v(
          `art-10`,
          `10. MANUTENZIONE E RIPARAZIONI ORDINARIE DELLA COSA LOCATA`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `La Parte Conduttrice è costituita custode della cosa locata e dovrà mantenerla con la diligenza del buon padre di famiglia. Essa è tenuta ad eseguire tutte le riparazioni conseguenti a danni provocati dalla sua negligenza nell’uso della cosa locata e delle apparecchiature ivi esistenti, nonché le piccole riparazioni di cui all’art. 1609 c.c.. Quando la cosa locata ha bisogno di riparazioni che non sono a carico della parte conduttrice, quest’ultima è tenuta a darne tempestiva comunicazione scritta alla parte locatrice medesima. La Parte Conduttrice dovrà consentire, previo avviso, l’accesso all’unità immobiliare locata alla parte locatrice, all’amministratore o a loro incaricati.`,
            }),
          ),
        ),
        v(
          `art-11`,
          `11. DIVIETO DI SUBLOCAZIONE O CAMBIO D’USO`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "È vietato sublocare, cedere il contratto o mutare la destinazione d’uso senza consenso scritto del locatore, salvi i casi previsti dalla legge. L’ordinaria ospitalità non costituisce di per sé sublocazione; restano i limiti di legge sull’occupazione e le comunicazioni obbligatorie.",
            }),
          ),
        ),
        v(
          `art-12`,
          `12. REGOLAMENTO CONDOMINIALE`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `La Parte Conduttrice è obbligata a rispettare e a far rispettare ai propri familiari e/o dipendenti, le norme del regolamento condominiale e quelle che venissero deliberate dall’assemblea del condominio.`,
            }),
          ),
        ),
        v(
          `art-13`,
          `13. REGISTRAZIONE DEL CONTRATTO`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Il locatore provvede alla registrazione entro trenta giorni e ne dà documentata comunicazione, nei successivi sessanta giorni, al conduttore e all’amministratore condominiale, ai sensi dell’art. 13 della legge 431/1998. L’imposta di registro, quando dovuta, è ripartita per metà; il bollo è a carico del conduttore. Restano gli adempimenti fiscali per proroghe, risoluzioni e annualità e le esenzioni applicabili in caso di valida opzione per la cedolare secca.",
            }),
          ),
        ),
        v(
          `art-14`,
          `14. VISITA DEI LOCALI`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Gli accessi del locatore e dei suoi incaricati richiedono un motivo giustificato, congruo preavviso e un appuntamento concordato, nel rispetto del godimento e della riservatezza del conduttore. Per visite a potenziali acquirenti o nuovi conduttori le parti concordano giorni, orari e durata ragionevoli. Restano gli interventi urgenti consentiti dalla legge.",
            }),
          ),
        ),
        v(
          `art-15`,
          `15. ELEZIONE DI DOMICILIO`,
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "Per le comunicazioni contrattuali le parti utilizzano i recapiti indicati nel contratto, comunicandone tempestivamente le variazioni. Restano ferme le norme sulle notificazioni e sulla competenza inderogabile; non è eletto domicilio presso uffici comunali. Le modifiche contrattuali devono risultare per iscritto.",
            }),
          ),
        ),
        v(
          `art-16`,
          "16. PROTEZIONE DEI DATI PERSONALI",
          g(
            (0, P.jsx)(P.Fragment, {
              children:
                "I dati personali sono trattati per la stipula e l’esecuzione del rapporto e per gli obblighi di legge, secondo il Regolamento (UE) 2016/679 e il d.lgs. 196/2003 come modificato. Ciascun titolare fornisce l’informativa degli articoli 13 e 14 GDPR, ove applicabile, e comunica solo i dati necessari ai soggetti legittimati. La firma del contratto non costituisce consenso al marketing.",
            }),
          ),
        ),
        v(
          `art-17`,
          `17. RINVIO A DISPOSIZIONI DI LEGGE`,
          g(
            (0, P.jsx)(P.Fragment, {
              children: `Per quanto non espressamente previsto dal presente contratto, le parti rinviano a quanto in materia previsto dal Codice Civile e dalle altre leggi vigenti in materia che s’intendono riportate e trascritte nel presente contratto.`,
            }),
          ),
        ),
        {
          key: `art-18-sign`,
          node: (0, P.jsxs)(P.Fragment, {
            children: [
              (0, P.jsx)(`div`, { style: h, children: `18. PRELAZIONI` }),
              g(
                (0, P.jsx)(P.Fragment, {
                  children:
                    "Restano salvi i diritti di prelazione e di riscatto riconosciuti dalla legge nei casi applicabili, inclusa l’ipotesi dell’articolo 3, comma 1, lettera g), della legge 431/1998. Non sono pattuite rinunce preventive ai diritti inderogabili.",
                }),
              ),
              g(`LETTO, APPROVATO E SOTTOSCRITTO`, {
                marginTop: `1.2rem`,
                fontWeight: `bold`,
              }),
              g(
                (0, P.jsxs)(P.Fragment, {
                  children: [`Padova, `, d(`dataFirma`, `88px`), `.`],
                }),
              ),
              recordsUI(_).signatures({
                conduttori: n,
                locatori: i,
                specificApproval: false,
              }),
            ],
          }),
        },
      ],
    });
  return (0, P.jsx)(wr, {
    title: `Contratto 4+4`,
    icon: (0, P.jsx)(lr, { size: 20 }),
    preview: y,
    clientName: n[0]?.nome,
  });
};
