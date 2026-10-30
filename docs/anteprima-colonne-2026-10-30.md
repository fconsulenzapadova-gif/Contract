# Compilazione in anteprima e colonne verticali · 30 ottobre 2026

La proposta d'acquisto si compila direttamente nei campi del foglio. Il clic, il passaggio fra campi e la digitazione non aprono più l'editor esteso. “Espandi campo” conserva l'apertura esplicita, con gli stessi dati della bozza e della colonna di compilazione. Per i testi lunghi il modulo mantiene il riferimento all'allegato; anche la stampa con un campo ancora attivo usa il riferimento corretto.

Il layout condiviso dei 14 moduli separa navigazione, strumenti, compilazione (dove presente) e documento in colonne verticali. Il menu di navigazione è nella sua colonna; titolo, PDF, zoom, bozze, archivio, identità, codice fiscale e navigazione per sezioni stanno nella colonna strumenti. Non ci sono barre o menu sopra l'anteprima. Anche i comandi dei testi generici che proseguono su altre pagine sono nella colonna strumenti, tramite un contesto React condiviso con il renderer.

Fino a 1100px il selettore laterale verticale sceglie Strumenti, Compila o Anteprima. La preview inattiva rimane misurabile fuori schermo per la paginazione. Il salto a una sezione mostra il foglio e poi porta scroll e focus al titolo. I due wrapper degli incarichi mantengono l'altezza del viewport: strumenti e documento scorrono separatamente.

## Implementazione

- `production/src/ColumnLayout.js` e `ColumnLayout.css`: trasformazione dei componenti esistenti, senza sostituire azioni, ref o stato del menu; registrazione degli editor dei testi estesi.
- `production/contract_integrations.py`, `production/build.py`, `scripts/integrate-sharing.py`: punti di integrazione controllati e caricamento dello stile. Vendor immutabile con digest conservato.
- `src/purchase/PurchaseTemplate.js`: campi inline, espansione esplicita, riferimento statico per il PDF; colonna di compilazione passata al layout comune.
- `src/sharing/PropertySharing.tsx`: colonna di compilazione nel layout comune, selettore verticale condiviso.
- `AdaptiveDocument.js` e `EditorNavigation.js`: editor lunghi laterali e salto a sezioni visibili.

## Verifiche effettive

- Prima della correzione: test browser falliti per il dialogo automatico al clic, per l'intestazione sopra il foglio e per il comando di testo lungo dentro l'A4. Log locali `work/ui-columns/*-before.log`.
- `npm test`: **114/114**; `npm run lint` superato (sharing/Vite); `npm run build` superato, inclusa verifica TypeScript e guardie di integrazione. Sintassi JS/Python e `git diff --check` superati.
- `scripts/qa-inline-columns.mjs`: campi inline, digitazione continua, sincronizzazione laterale, ricarica bozza, espansione esplicita, testo completo esatto nelle continuazioni, stampa con campo attivo, editor generico lungo laterale e ritorno del focus.
- **42 combinazioni browser:** 14 percorsi × larghezze 1600, 834 e 390px, altezza 1000px. Anteprima dall'inizio del viewport e alta quanto il viewport, nessuno sconfinamento orizzontale della pagina, archivio e strumenti raggiungibili, CF contenuto nella sua colonna. Salti alle sezioni e stampa della condivisione da Strumenti su schermi compatti verificati.
- **Due PDF reali acquisiti:** proposta con continuazioni, **7 pagine**; AML con testo lungo modificato dall'editor laterale, **4 pagine**. Tutte le pagine con testo, marcatori finali presenti, caratteri entro i bordi; controllo visivo delle tavole complete. I PDF derivano dall'iframe di “Salva PDF”, stampato da Chromium; verificato separatamente il clone di stampa nativa.
- Revisione indipendente: due testi AML distinti mantengono dati e associazione al proprio editor a 1600, 834 e 390px; ritorno del focus, pulizia al cambio percorso e assenza di cicli/errori runtime. Ricontrollati i wrapper degli incarichi e i salti alle sezioni.
- Scheda dell'utente ricaricata nella webapp locale e lasciata su Anteprima; dati del contratto non modificati. Test con dati sintetici in contesti separati.

Report strutturato in `anteprima-colonne-2026-10-30.json`; log, PDF e screenshot in `work/ui-columns/` e `work/qa-inline-columns/` (ignorati da Git). Riferimento Superdesign esistente aggiornato alla versione 3 tramite HTML diretto, senza generazioni: https://superdesign.dev/teams/652f71b7-e657-4e22-893a-251d1903cbe0/projects/eac23abe-ed38-4029-b104-a9b359511a44.

Lavoro nella copia principale `/Users/Gemut/Desktop/GEMUT-Contratti-Lavoro/webapp`. Nessun push o deploy. Non verificati stampante fisica o dialogo PDF del sistema operativo; il contenuto giuridico non è oggetto di questa modifica.
