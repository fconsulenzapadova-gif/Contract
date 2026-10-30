# Closing Modules Implementation Plan

> **For agentic workers:** esecuzione nella copia operativa richiesta dall'utente; applicare superpowers:executing-plans.

**Goal:** Integrare riconsegna chiavi e liberatoria con compilazione, PDF e stile comuni.
**Architecture:** riuso dei moduli precedenti; integrazione protetta dopo sharing/purchase. Impaginatore e layout esistenti.
**Tech Stack:** JavaScript/React, Python build, Node test, Vite.
**Spec:** docs/superpowers/specs/2026-10-30-closing-modules-design.md

## Global Constraints
- Conservare i testi approvati e gli obblighi di firma.
- Snapshot vendor e bozze esistenti invariati.
- Nessuna nuova dipendenza; campi inline, strumenti nella colonna comune.

## Review Focus
- Proposta già accettata: niente generazione impropria.
- Cambio pratica: azzerare ricezione precedente e stato confermato.
- Più clienti/proprietari: conservarli e predisporre tutte le firme.
- Note lunghe e mobile: paginazione A4 senza tagli.
- Archivio/import: conservare dati e richiedere conferma prima della sostituzione.

### Task 1: Integrazione dei moduli esistenti
**Files:** production/src/ClosingData.js, ClosingDocuments.js, closing-documents.css; scripts/integrate-closing.py; package.json; tests/closing-documents.test.mjs; production/src/DocumentInterop.js.
- [x] Copiare i test dati della versione precedente e aggiungere regressioni su normalizzazione, ruoli plurali e validazione comune; eseguire e osservare fallimento prima dell'integrazione.
- [x] Copiare/adattare moduli e integrazione; mantenere dati e testi, rimuovere editor duplicato, usare campi inline ed etichette archivio.
- [x] Suite mirata, suite completa, typecheck, lint, build e diff check.

### Task 2: Verifica del risultato
**Files:** work/qa-closing/report.json (prove via browser in-app); docs/integrazione-moduli-chiusura-2026-10-30.md.
- [x] Prove browser su entrambe le rotte, quattro tipi liberatoria, firme, recupero bozze, archivio, import/export, stampa e PDF con note lunghe e viewport 390/834/1440.
- [x] Ispezione visiva pagine/PDF e confronto con documento esistente; correggere difetti osservati.
- [x] Revisione finale del diff e registrazione dei risultati e limiti; aprire anteprima utile.

## Esito e decisioni di integrazione
Implementazione completata nella copia operativa indicata, senza altro worktree. La richiesta attuale e le precedenti istruzioni di integrazione nella web app pubblicata autorizzano il completamento sul progetto Vercel esistente. Revisione indipendente conclusa; entrambi i rilievi corretti con regressioni RED→GREEN. Nessun rilievo minore rinviato. Dettaglio delle verifiche nel rapporto di integrazione.
