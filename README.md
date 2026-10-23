# GEMÜT · Contract

Webapp Contract di Gemüt Capital Srl, pubblicata su https://real-estate-contracts.vercel.app e collegata al progetto Vercel esistente `real-estate-contracts`, branch di produzione `main`.

## Sviluppo e verifica

Richiede Node.js 24 e Python 3. Nessun pacchetto Python aggiuntivo è necessario per la build.

```sh
npm ci
npm run typecheck
npm test
npm run lint
npm run build
npm run preview
```

L'anteprima del rilascio completo è disponibile su http://localhost:5178. `PORT` consente di cambiare porta. `npm run dev` ricostruisce e serve la stessa applicazione di produzione.

## Scheda di condivisione immobiliare

Il nuovo documento è disponibile nella dashboard, nel menu laterale e alla pagina `/property-sharing`. Il modulo TypeScript in `src/sharing/` usa l'istanza React, le bozze locali e il sistema di anteprima/stampa PDF dell'applicazione esistente. Su smartphone i pulsanti Compila e Anteprima separano i campi dal foglio A4.

Ogni materiale ha tipo, descrizione identificativa e stato indipendente: già trasmesso/presentato oppure da trasmettere dopo la firma. Nessuno stato o canale è preselezionato. Sono previsti destinatario, immobile, consulente, canali, date, condizioni di utilizzo, informativa privacy e firme su entrambe le pagine. La scheda non attesta una visita, non richiede una finalità di acquisto/locazione e non genera automaticamente provvigioni.

Il PDF contiene due pagine A4. Sono ammessi fino a cinque materiali per scheda, con 160 caratteri e tre righe per descrizione; con quattro o cinque materiali viene applicata una spaziatura più compatta. La verifica dei contenuti e della geometria impedisce di esportare pagine tagliate. I testi eccessivi importati rimangono modificabili, senza troncamento silenzioso. Per ulteriori materiali si usa una seconda scheda. Salva PDF apre il flusso di stampa del browser: scegliere Salva come PDF.

## Base di produzione preservata

Il 19 ottobre 2026 il branch GitHub conteneva una versione anteriore ai 13 modelli già online. La cartella `production/` conserva i sorgenti leggibili e le risorse del rilascio verificato del 13 ottobre. `production/build.py` ricostruisce quel rilascio in modo deterministico, a partire da un vendor immutabile e da integrazioni già in produzione. I precedenti sorgenti TypeScript restano conservati in `src/pages/`.

La build Vite compila il nuovo modulo TypeScript senza includere una seconda istanza React. `scripts/integrate-sharing.py` controlla l'hash SHA-256 della base e aggiunge solo il nuovo modulo, la route, le voci di navigazione e gli adattamenti circoscritti alla nuova pagina. Gli altri 266 file della base pubblicata restano identici; i contenuti degli altri modelli, incluso Allegato B, sono preservati. `release-manifest.json`, generato localmente e ignorato da Git, contiene gli hash di tutti i file pubblicabili.

## Prove browser

Con Playwright disponibile:

```sh
node scripts/qa-sharing.mjs
BASE_URL=https://real-estate-contracts.vercel.app QA_NAME=production VERIFY_ASSETS=1 node scripts/qa-sharing.mjs
```

Se Playwright è fornito dal runtime dell'ambiente, impostare `PLAYWRIGHT_MODULE_PATH` al modulo installato. Le prove usano dati sintetici in un browser isolato: PDF vuoto, compilato e con cinque materiali; bozze; ultimo valore digitato; stampa nativa; blocco dei contenuti eccessivi; smartphone; apertura ed esportazione dei 13 modelli preesistenti. I risultati e i PDF sono salvati in `qa-sharing/` (ignorata da Git).

## Rilascio

Il progetto Vercel esistente è collegato a `fconsulenzapadova-gif/Contract`, produzione `main`. Prima del push eseguire i controlli sopra; verificare lo stato READY del rilascio e ripetere le prove sull'URL pubblico. Non creare un altro progetto Vercel.

## Proposta d’acquisto dal PDF originale

Dal 23 ottobre 2026 `/purchase-proposal` riproduce le due pagine del PDF fornito, con 32 campi nei rispettivi spazi e caselle libero/locato. Bozze, stampa A4 e compilazione su smartphone sono supportate. La stampa segnala i testi che superano gli spazi disponibili. Sorgenti in `src/purchase/`, integrazione deterministica in `scripts/integrate-purchase.py`, riferimento e asset in `public/purchase-template/`.

Verifica specifica: `node scripts/qa-purchase-template.mjs` (con `PLAYWRIGHT_MODULE_PATH` se Playwright è fornito dal runtime). Report e PDF sintetici in `qa-purchase/`, ignorata da Git. Dettagli in `docs/proposta-acquisto-2026-10-23.md`.
