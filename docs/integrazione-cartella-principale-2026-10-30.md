# Cartella principale GEMÜT Contratti · 30 ottobre 2026

La copia operativa è **`/Users/Gemut/Desktop/GEMUT-Contratti-Lavoro/webapp`**, disponibile localmente. Il workflow Contrax prosegue in questa cartella, come richiesto dall'utente. L'attesa dei sorgenti iCloud di Contract 1 non è più un blocco operativo.

## Integrazione e copie conservate

- La precedente `webapp/` e lo storico `webapp-visita-2026-10-08/` sono stati confrontati con il lavoro Contrax. Il vendor di base ha lo stesso digest; non sono stati individuati sorgenti esclusivi da perdere nel trasferimento. Le differenze dei moduli avanzati corrispondono agli incrementi Contrax già realizzati.
- La precedente `webapp/` è conservata integralmente in `../work/backups/2026-10-30/webapp-precedente/`. Tutti i **57 file** sono stati verificati byte per byte rispetto al manifesto SHA-256 `../work/backups/2026-10-30/manifest-webapp-precedente.json`.
- Il precedente README principale è conservato nella stessa cartella di backup. Lo storico `../webapp-visita-2026-10-08/` e `../riferimenti/` restano disponibili.
- La nuova `webapp/` è un checkout Git autonomo, senza dipendenza da worktree o file Git iCloud. Branch `codex/contrax-2026-10-28`, base di integrazione **`32cef0da41279d2e2f2dd262789b446b9fee540f`**. Remote: `https://github.com/fconsulenzapadova-gif/Contract.git`.
- I launcher `python3 build.py` e `python3 serve.py` risolvono il proprio percorso e richiamano rispettivamente la build npm completa e il server esistente.

## Verifiche eseguite dalla nuova cartella

| Controllo | Risultato |
| --- | --- |
| Installazione | `npm ci --no-audit --no-fund` completato. |
| Suite | `npm test`: **114/114**, zero fallimenti. |
| TypeScript e lint | `npm run typecheck` e `npm run lint` superati. Il lint copre sharing e configurazione Vite. |
| Build compatibile | `python3 build.py` completato, comprese guardie vendor e integrazioni. **286 file generati identici per SHA-256** alla build Contrax già collaudata. |
| Sintassi | Launcher Python, script browser e `git diff --check` superati. |
| Server definitivo | `http://localhost:5178/` servito dalla nuova cartella. L'asset `assets/app.js` ricevuto corrisponde byte per byte a `dist/assets/app.js`. Il precedente server è stato sostituito; quello temporaneo su 5179 è stato chiuso. |
| Browser | `scripts/qa-working-folder.mjs` eseguito su **localhost:5178**: 14 moduli e apertura archivio, bozza della proposta dopo ricarica, salvataggio nominato, separazione AML cliente/interno, dashboard e AML a 390×844. Nessun errore JavaScript o richiesta esterna osservati. |
| PDF | Proposta con testo lungo: **6 pagine**, ultima riga presente, tutte le pagine con testo e caratteri nei margini. Controllo visivo della tavola delle sei pagine e dei dettagli della prima/ultima: nessun taglio o sovrapposizione osservato. |

Il PDF deriva dalla pagina iframe effettiva di “Salva PDF”, acquisita dal test e stampata da Chromium. Il dialogo di sistema e una stampante fisica non sono stati verificati. Dati di prova sintetici in un contesto browser isolato; il profilo e le bozze dell'utente non sono stati letti o azzerati. L'indirizzo 5178 e i prefissi delle bozze sono conservati.

I 29 PDF e le verifiche estese del 29 ottobre restano evidenze della build precedente, documentate in `contrax-operativo-2026-10-28.md` e `contrax-verifiche-2026-10-29.json`. Non sono stati rigenerati integralmente: il confronto dei 286 file dimostra che il prodotto servito è identico; le prove nuove coprono il trasferimento e l'avvio dal percorso richiesto.

Risultati strutturati: `integrazione-cartella-principale-2026-10-30.json`. Log, PDF e screenshot locali: `work/integrazione-*.log`, `work/qa-working-folder/`, `work/confronto-build.json`, `work/server-principale.json` (ignorati da Git).

## Avvio e limiti ancora aperti

```sh
cd /Users/Gemut/Desktop/GEMUT-Contratti-Lavoro/webapp
npm run dev
```

Dopo la build, `npm run preview` oppure `python3 serve.py`. L'anteprima è già attiva su **http://localhost:5178/**. `PORT` permette una porta diversa; per ritrovare le bozze locali occorre mantenere lo stesso indirizzo e profilo browser.

**Nessun push, merge o deploy eseguito.** La verifica read-only del 30 ottobre rileva ancora in produzione il commit `dfe6b0be9fcc961e5fb22b25f9d8a766430e93c7`, distinto dal lavoro locale.

Restano quelli già dichiarati: confronto FIMAA e prova dei formulari depositati non disponibili, validazione professionale delle proposte giuridiche, verifica delle sedi/polizza e provenienza temporale completa del dataset Belfiore, browser/dispositivi fisici e procedure aziendali di custodia. La base compilata conserva i propri vincoli architetturali; il trasferimento non costituisce certificazione normativa.
