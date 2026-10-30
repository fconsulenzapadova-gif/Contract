# Anteprima compilabile e colonne verticali

Obiettivo richiesto: compilare direttamente il foglio senza apertura automatica dell'editor esteso; tutte le informazioni e azioni esterne al contratto devono stare in colonne verticali, senza barre sopra l'anteprima.

## Scelte e perimetro

Si mantiene l'app React esistente, il vendor immutabile e le guardie della build. La navigazione globale conserva una colonna propria con il pulsante di apertura al suo interno. Il layout condiviso colloca titolo, strumenti, archivio, CF, zoom e PDF in una colonna laterale; proposta e condivisione forniscono una distinta colonna di compilazione. Il foglio occupa la propria colonna a tutta altezza. Su schermi stretti i pannelli si selezionano da un selettore verticale laterale, senza barre sopra il documento.

Nella proposta i pulsanti sovrapposti al modulo diventano campi compilabili. Il testo lungo continua sugli allegati; il riferimento resta corretto anche stampando con un campo attivo. “Espandi campo” è l'unico comando che apre l'editor esteso. Bozze, contenuto dei contratti e flusso PDF restano compatibili.

## Passi

- [x] Riprodurre con un test browser il clic che apre il dialogo e il layout con strumenti sopra il foglio.
- [x] Correggere i campi della proposta e verificare digitazione, persistenza, sincronizzazione laterale ed espansione esplicita.
- [x] Aggiungere un modulo condiviso per la disposizione a colonne e integrare la trasformazione con punti di patch controllati. Spostare la colonna di compilazione di proposta/condivisione nel layout comune.
- [x] Verificare i 14 percorsi a desktop/tablet/telefono, menu, strumenti, archivio, CF, editor esplicito e PDF reale con testo lungo.
- [x] Eseguire suite, typecheck, lint, build, controlli di sintassi/diff e registrare risultati e commit locale. Nessun deploy.

Ruling: esecuzione nella cartella principale già autorizzata, senza nuovo worktree né fase di conferma. Le due richieste definiscono direttamente la disposizione e il comportamento desiderati; la modifica riusa il design esistente.

Esito: 114 test, build/lint/sintassi, 42 combinazioni browser e 11 pagine PDF controllate. Revisione indipendente conclusa senza problemi azionabili. Dettagli in `docs/anteprima-colonne-2026-10-30.md`.
