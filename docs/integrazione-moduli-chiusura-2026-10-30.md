# Riconsegna chiavi e liberatoria · 30 ottobre 2026

Integrazione nella copia operativa Desktop, base `fea3217`, coincidente con origin/main al controllo prima del rilascio. Recuperati dalla chat «Aggiungi moduli di chiusura Gemüt» i moduli già approvati e presenti nella precedente copia locale di Contract.

## Risultato

- `/key-return`: verbale con conduttori e locatori, autorizzazione alla ricezione, data/ora/luogo, cinque righe personalizzabili per chiavi/dispositivi, osservazioni, allegati e firme nominative.
- `/practice-release`: unica voce con varianti incarico vendita/locazione e proposta acquisto/locazione. Testi concordati, rinuncia economica GEMÜT e firme di tutti i soggetti pertinenti. Proposte già accettate o non verificate bloccate sia in PDF sia nella finalizzazione in archivio.
- Stessa compilazione inline, logo, font, numerazione, strumenti e navigazione a colonne degli altri contratti online. Nuove voci in menu/dashboard e filtri archivio. Nessuna dipendenza aggiunta; vendor immutato.
- Bozze, import/export, archivio nominato e riuso di persone/immobili comuni; importazione di più persone per ruolo con confronto preventivo. Cambiare sorgente azzera dati della riconsegna precedente e conferme sullo stato della proposta. Il riuso dall'archivio non importa dichiarazioni di chiusura o di ricezione.
- Nessun limite arbitrario alle osservazioni: il testo lungo usa la paginazione adattiva e l'editor esteso comuni.

## Verifiche

- **129/129 test**, typecheck, lint nell'ambito configurato, build e `git diff --check` superati.
- Browser in-app: campi inline e persistenza dopo ricarica; più clienti e proprietari con tutte le firme; salvataggio nominato; esportazione e ripristino effettivo di una bozza con conferma; blocco della finalizzazione di proposta già accettata.
- Viewport 1440, 834 e 390 pixel: strumenti/anteprima raggiungibili, nessuno sconfinamento orizzontale osservato. Campioni del verbale senza blocchi oltre i margini della pagina.
- Sei PDF A4 controllati: liberatorie per incarico vendita e locazione (2 pagine ciascuna), proposte acquisto e locazione (2 pagine ciascuna), riconsegna con due conduttori (3 pagine), riconsegna con circa 10.000 caratteri di osservazioni (6 pagine). Nessuna pagina vuota, ultima riga del testo lungo presente, testo entro i margini; tavola di tutte le **17 pagine** ispezionata visivamente.
- PDF acquisiti dalla stampa nativa Chromium tramite il browser in-app, con formato A4 esplicito; il dialogo di salvataggio del sistema operativo e la stampa fisica non sono stati certificati. Le verifiche del nuovo comando PDF condividono il renderer esistente e i controlli di preparazione.
- Revisione indipendente: corretti i due rilievi su finalizzazione e importazione di più firmatari, con test di regressione osservati prima in fallimento e poi superati.

Evidenze sintetiche locali in `work/qa-closing/report.json`, PDF, tavole e screenshot nella medesima cartella ignorata da Git. I dati di prova sono soltanto sintetici, sull'origine separata `localhost:5191`; le bozze dell'utente sull'indirizzo abituale 5178 e in produzione non sono state modificate. Nessun testo è stato presentato come nuova validazione giuridica.
