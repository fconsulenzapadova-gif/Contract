# GEMÜT · Contratti

Copia operativa in `/Users/Gemut/Desktop/GEMUT-Contratti-Lavoro/webapp`, integrata il 30 ottobre 2026 dal lavoro Contrax salvato nel commit `32cef0d`.

```sh
npm ci
npm run dev
```

Anteprima locale: **http://localhost:5178/**. Per servire una build già generata: `npm run preview`.

Navigazione, strumenti, compilazione e anteprima occupano colonne verticali separate, senza barre sopra il foglio. Nella proposta puoi scrivere direttamente sul documento; l'editor esteso si apre solo con “Espandi campo”. Sui dispositivi stretti usa il selettore verticale laterale. Dettagli e prove: `docs/anteprima-colonne-2026-10-30.md`.

Sono conservati i comandi precedenti: `python3 build.py` esegue la build npm completa; `python3 serve.py` avvia il server locale dalla directory corretta. Richiedono le dipendenze installate con `npm ci`.

## Build e sorgenti effettivi

`production/vendor` è lo snapshot immutabile verificato per digest. Le integrazioni modificabili sono in `production/src`; `production/build.py` e `production/contract_integrations.py` applicano i controlli. Vite costruisce la condivisione e gli script in `scripts/` integrano condivisione e proposta nella cartella `dist`. Le pagine legacy in `src/pages` non costituiscono da sole l'app distribuita.

Il workflow non dipende dall'accesso ai segnaposto iCloud di Contract 1. Questa copia del Desktop è locale e autonoma per build e sviluppo. L'architettura non è stata riscritta.

## Dati e verifiche

Bozze e archivio restano nel browser, con esportazione, recupero e versioni finalizzate. Non viene introdotto un backend né una conservazione a norma. Le informazioni riservate AML richiedono l'esportazione interna esplicita.

- `npm test`: verifiche di dati, migrazioni, interoperabilità, CF e paginazione.
- `npm run typecheck`, `npm run lint` (ambito sharing/Vite), `npm run build`.
- `scripts/qa-*.mjs`: verifiche browser su contesti isolati e dati sintetici.

Architettura e stato: `docs/contrax-operativo-2026-10-28.md`. Trasferimento nella cartella principale: `docs/integrazione-cartella-principale-2026-10-30.md`. Revisione documentale e fonti: `docs/contrax-legal-review-2026-10-28.md` e `docs/legal-sources`.

La versione precedente di `webapp` è integralmente conservata e verificata in `../work/backups/2026-10-30/webapp-precedente`. La cartella `../webapp-visita-2026-10-08` resta uno storico.

Nessun push o deploy viene eseguito da questo trasferimento. Le proposte giuridiche restano separate da validare; modelli FIMAA e formulari depositati non risultano disponibili nel materiale esaminato.
