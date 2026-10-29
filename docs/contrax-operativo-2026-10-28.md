# Contrax · operativo, 28 ottobre 2026

## Baseline e vincoli
- Origine: `Contract-condivisione-2026-10-19`, remote `fconsulenzapadova-gif/Contract`, `main` pulito. Fetch eseguito: HEAD e origin/main `dfe6b0be9fcc961e5fb22b25f9d8a766430e93c7`.
- Lavoro isolato: branch `codex/contrax-2026-10-28`. Nessuna pubblicazione autorizzata.
- Build effettiva: `production/vendor` immutabile (SHA verificato) → `production/build.py` + `contract_integrations.py` → `production/dist` → Vite (condivisione) → integrazioni sharing/purchase → `dist`. Le pagine legacy `src/pages` non sono il prodotto servito.
- React/TypeScript/Vite esistenti; dati locali nel browser. Nessun servizio/account nuovo. Nomi pubblici, rotte e prefisso bozze invariati.
- Allegati ricevuti: solo il prompt testuale. Modelli FIMAA assenti. Nessuna certificazione giuridica/hardware fisico.

## Decisioni e piano breve
1. **Compatibilità e archivio** — `ContractDraft.js`, `ContractEditorTools.js`, nuovi `ContractArchive*`/`DocumentInterop`: documenti identificati, snapshot, anagrafiche/immobili, importazione con ruoli e differenze confermati. Preservare slot ignoti e bozze precedenti; errori storage espliciti. Verifica: unità migrazioni e trasferimenti più prove browser.
2. **Testi/PDF** — `DocumentTypography.js`, `AdaptiveDocument.js`, `NativePrint.js`, nuovi strumenti condivisi: editor limitato in altezza con lettura estesa; output statico paginato anche all'interno del campo. Preparazione con timeout/ripristino. Verifica 500/5.000/10.000/30.000 caratteri, PDF effettivamente acquisiti e stampa nativa.
3. **Formulari fissi** — `src/purchase`, `src/sharing`: conservare template e presa visione; continuazioni collegate e firmabili, nessun taglio per spazio; materiali senza limite di prodotto. Verifica persistenza, PDF e mobile.
4. **Uniformità/CF/AML** — CSS/token condivisi, pannello CF iniziale esplicativo, controlli accessibili, AML con sezioni condizionali e copia cliente separata dai dati riservati. Nessuna modifica giuridica sostanziale applicata senza validazione. Verifica CF esistente, tutti i percorsi, tastiera e tre viewport.
5. **Revisione documentale** — documento separato con fonti ufficiali effettivamente lette, matrice per tipologia e classificazione AML; confronto FIMAA segnato non eseguibile finché non arrivano i modelli.

## Criteri e stato
- Baseline: `npm ci`, `npm test`: **89/89 superati**.
- Altri controlli e risultati saranno aggiornati dopo l'integrazione; nessun PDF o flusso ancora dichiarato conforme.
- Controlli finali previsti: suite completa, typecheck, lint (ambito limitato), build con guardie; browser delle 14 rotte; campioni PDF con tutte le pagine e ultime righe verificate; screenshot desktop/tablet/telefono.

## Aggiornamento verificato · 29 ottobre 2026
- **Archivio e compatibilità:** documenti nominati, ricerca per nome/CF/immobile/testo/data, filtri modello/stato/intervallo date, duplicazione/apertura confermate, recuperi, esportazioni e importazioni versionate. ID persistenti per persone/immobili anche nei formulari scalari; la bozza per percorso resta compatibile. Le versioni finalizzate congelano dati/template e deduplicano risorse, senza riscrivere documenti storici. Quota e scritture fallite sono esplicite. Nessun account o backend introdotto.
- **Testi e stampa:** editor limitato in altezza con dialogo esteso; paginazione misurata anche dentro un singolo campo, preservando Unicode, righe e stili. Firme e relativo luogo/data o contesto sono raggruppati per evitare una firma isolata in ultima pagina. Descrizioni immobiliari multilinea. Proposta originale di due pagine e presa visione conservate, con allegati collegati e firmabili per overflow; PDF storico ancora disponibile. Condivisione senza i precedenti limiti di testo/materiali, con stati di trasmissione conservati. Preparazione stampa con timeout, risorse verificate, pulizia e possibilità di riprovare.
- **Strumenti e UI:** token verificati sul sito GEMÜT, logo originale su fondo appropriato, font locali/fallback senza redistribuire font proprietari; strumenti comuni e navigazione per sezioni. Campi e checkbox Allegato B nominati e persistenti. CF riusato, stato iniziale esplicativo e coordinamento con ID persona. Provenienza dichiarata del dataset e limiti in `docs/data-sources/belfiore.md`.
- **AML:** percorso condizionale persona fisica/ente/rappresentante, dati strutturati e testi precedenti conservati. Stampa cliente predefinita; valutazioni interne solo nel fascicolo scelto esplicitamente. Esportazione ordinaria cliente per allowlist, dati interni/ignoti solo in export interno o recupero esplicito; nessun trasferimento automatico alla clipboard. Vedere `docs/contrax-local-data.md`.
- **Revisione separata:** matrice per le 14 tipologie e fonti ufficiali realmente acquisite in `docs/contrax-legal-review-2026-10-28.md` e `docs/legal-sources/`. Nessuna proposta giuridica sostanziale applicata automaticamente. Telefono pubblico centralizzato; sedi e polizza restano da confermare.

### Verifiche effettive
| Controllo | Esito e perimetro |
| --- | --- |
| `npm test` | 114/114 superati; include migrazioni/ignoti, snapshot, quota/concorrenza, privacy AML, ID persistenti, mapping e percorsi importati sicuri. |
| `npm run typecheck`, `npm run lint` | Superati; lint resta limitato a sharing e configurazione Vite. |
| Sintassi JS e Python, `git diff --check`, `npm run build` | Superati, con digest vendor e guardie d’integrazione conservati. Il manifest controlla la provenienza dell’output generato. |
| `qa-core-contrax.mjs` | 14 rotte; 16 casi 500/5.000/10.000/30.000 caratteri su AML, incarico, contratto studenti e visita: persistenza, export/import, PDF e stampa nativa; firme/ultima riga e assenza di sovrapposizione ai piè di pagina. |
| `qa-flow-exact.mjs` | 16 verifiche del testo visibile esatto, inclusi Unicode e paragrafi; corretto il mantenimento dei contenitori nei tagli interni DOM. |
| `qa-continuations.mjs` | 8 casi PDF sugli stessi quattro volumi per proposta/condivisione, con import confermato, rilettura e stampa nativa; materiali senza limite di prodotto. |
| `qa-responsive-contrax.mjs` | 45 combinazioni: dashboard + 14 moduli, viewport 1440×1000, 834×1112, 390×844. Archivio raggiungibile, nessuno sconfinamento orizzontale; condivisione usa Compila/Anteprima a dimensioni compatte. |
| `qa-fiscal-contrax.mjs` | Due direzioni nel 4+4, checksum e stato iniziale; assistenza raggiungibile su 13 moduli pertinenti; nessuna richiesta esterna osservata. Casi omocodia/storico/estero/numerico/conflitti/risposte obsolete coperti dalla suite mirata esistente. |
| `qa-archive-interop.mjs` | Proposta locazione→5 contratti e documento→AML/compenso/visita/condivisione, ruoli/differenze confermati; ricerca nome/CF, clipboard esplicita, duplicazione, snapshot immutabile e Allegato B completo di 5 pagine. |
| Mapping complementari | Test mirati per incarico vendita/locazione→proposta, acquisto→altri moduli e concordato→Allegato B. Il canone mensile richiesto non viene scambiato per prezzo o annualizzato implicitamente. |
| PDF acquisiti | 21 PDF del renderer comune (270 pagine) più 8 PDF di proposta/condivisione (68 pagine), con testo/ultima riga e geometria verificati; controllo visivo delle pagine e tavole d’insieme. Dati soltanto sintetici. |

“Salva PDF” usa il dialogo di stampa: nei test è stata acquisita la sua vera pagina iframe e prodotta una stampa PDF Chromium con gli stessi stili; provata separatamente la copia di stampa nativa con ripristino dell’editor. Non sono certificati dialogo del sistema operativo, stampante fisica, dispositivi reali, altri browser o conservazione a norma. Gli avvisi PDFminer sul FontBBox di risorse preesistenti non hanno prodotto un difetto visivo nelle pagine controllate.

### Dipendenze e lavoro restante
1. **Contract 1 (richiesta del 29/10):** cartella iCloud selezionata, con sorgenti TS originali e Git tuttora `dataless`; letture scadute anche dopo richiesta di download. Creato `CONTRAX_WORKFLOW_2026-10-29.md` nella cartella. Integrazione con quella copia sospesa finché non è leggibile; non è stata sovrascritta. Una volta disponibile va stabilita la baseline e verificata la sua build prima di scegliere come riusare questi incrementi.
2. **FIMAA e deposito:** nessun modello FIMAA ricevuto, nessuna prova del formulario GEMÜT depositato. Confronto diretto e validazione professionale delle modifiche sostanziali/accordi territoriali restano aperti. Nessuna conformità certificata.
3. **Sorgenti/data source:** nel checkout della release la base rimane compilata. Il digest rende la versione Belfiore riproducibile, ma la data d’estrazione del dataset non è ricostruita. Sedi/polizza richiedono evidenza attuale.
4. **Limiti locali:** spazio finito del browser, nessuna sincronizzazione o isolamento fra operatori nello stesso profilo. Le firme si acquisiscono separatamente. Esportare e custodire le copie secondo le procedure aziendali.
5. **Produzione:** nessun push, merge o deploy eseguito. La pubblicazione resta subordinata a richiesta esplicita.
