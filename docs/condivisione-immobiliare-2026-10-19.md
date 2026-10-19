# Scheda di condivisione immobiliare — 19 ottobre 2026

## Requisiti e contenuti

Riferimento disponibile: `Scheda_condivisione_immobiliare_Gemut_compilabile.pdf`, due pagine; nessun Word allegato era presente tra i file forniti. Il modulo conserva i contenuti del riferimento e distingue lo stato per singolo materiale, consentendo contemporaneamente documenti già trasmessi e documenti da inviare. La conferma di ricezione/presa visione riguarda esclusivamente i primi. Non sono richieste finalità di acquisto o locazione; sono esclusi attestazione di visita, proposta, incarico di mediazione e obblighi provvigionali derivanti dalla sola firma.

La privacy riprende il riferimento: titolare e recapiti, categorie di dati, finalità e basi giuridiche, conferimento, destinatari, conservazione, garanzie per trasferimenti, diritti e reclamo, assenza di decisioni esclusivamente automatizzate. La firma attesta la presa visione, senza consenso promozionale. Riferimento normativo verificato: [Regolamento UE 2016/679, artt. 6 e 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it).

## Integrazione e preservazione

- Nuova route `/property-sharing`, dashboard e menu laterale.
- Editor responsivo, anteprima e due pagine A4 con spazi data/firma.
- Bozza isolata per modello, esportazione/importazione con strumenti esistenti.
- Fino a cinque materiali, canali multipli, nessuna conferma preselezionata.
- Blocco di esportazione per testi importati eccessivi e overflow geometrico; nessun troncamento silenzioso.
- Chiudi menu utilizzabile su smartphone; chiusura automatica entrando nel nuovo modulo.
- Stampa tramite pulsante dell'app e stampa nativa del browser, con mantenimento della compilazione.

La base GitHub `251caaa0d88662e03f820e2bdc7bbe00d20650ee` era precedente alla produzione. I sorgenti iCloud risultavano ancora dataless. È stata importata la revisione leggibile del rilascio del 13 ottobre, confrontata con il bundle pubblico: SHA-256 `ee2610097436a626f0a3a3c6b541a5d6070f609ae14f3575b7dba69d8e8c1048`. Il modulo Vite usa la stessa istanza React del bundle; il rilascio non sostituisce i modelli online con i sei modelli della vecchia versione GitHub. La rimozione di due variabili destrutturate inutilizzate nei vecchi file TypeScript è il solo intervento tecnico su quei file, necessario per superare TypeScript e senza effetto sul runtime di produzione.

## Verifiche

I comandi e le prove ripetibili sono descritti nel README. Le evidenze locali sono in `qa-sharing/local/`; le verifiche successive alla pubblicazione in `qa-sharing/production/`. Il manifest SHA-256 del rilascio viene generato dalla build. Il confronto conserva identici 266 file della base e limita le integrazioni a `app.js`, `index.html` e ai due nuovi asset del modulo. Allegato B resta escluso da modifiche.

Esito locale conclusivo: TypeScript e build superati; lint dei nuovi sorgenti TypeScript/Vite superato; 82 test Node superati. Tre PDF (vuoto, compilato e cinque materiali con testi lunghi), tutti di due pagine A4, sono stati renderizzati e controllati. Le misure di overflow verticale/orizzontale e sovrapposizione al footer risultano zero. Passano ultimo dato digitato, import/export bozza, riapertura, rimozione stabile dei materiali, stampa nativa e blocco dei dati importati eccessivi. Browser desktop e smartphone 390×844 verificati senza errori JavaScript. Tutti i 13 modelli preesistenti sono stati aperti ed esportati, incluso Allegato B di cinque pagine.
