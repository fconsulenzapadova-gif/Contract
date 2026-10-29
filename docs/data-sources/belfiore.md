# Archivio Belfiore integrato

Il motore riusato è `production/src/FiscalCode.js`, con coordinamento asincrono in `FiscalCodeUI.js`. L'adattatore `Is` proviene dallo snapshot compilato immutabile `production/vendor/deployed-app.js`, SHA-256 `0c058e87134321a34edda49b190d84b3855d37369dc5bc66a6b4fd52cf84ffce` (baseline Git `dfe6b0b`). La presente integrazione non scarica né invia anagrafiche per effettuare il calcolo.

Il dataset incorporato dichiara nel proprio oggetto `licenses`:
- Ministero dell'Interno / ANPR: CC BY 4.0, legenda e autori del repository pubblico `italia/anpr`.
- ISTAT: CC BY 3.0, note legali ISTAT.
- Agenzia delle Entrate: CC BY 4.0.

Nel medesimo oggetto `sources` sono conservati questi riferimenti:
- https://www.istat.it/wp-content/uploads/2024/03/Elenco-codici-e-denominazioni-unita-territoriali-estere.zip
- https://www.istat.it/it/files/2011/01/Elenco-Paesi-esteri-cessati.zip
- https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv
- https://www.anagrafenazionale.interno.it/wp-content/uploads/ANPR_archivio_comuni.csv

Si tratta della provenienza **dichiarata nello snapshot**, non della prova che quei file siano stati acquisiti in una specifica data o che il dataset includa ogni variazione successiva. Non sono presenti un numero di versione o una data di estrazione verificabili. La versione riproducibile qui identificata è il digest dello snapshot; la completezza/attualità puntuale delle località storiche e degli Stati esteri resta da validare rispetto alle fonti. Nessuna data di aggiornamento è inventata.

Il codice locale gestisce checksum, omocodia, date ambigue, intervalli storici, estero e identificativi numerici. Luogo non disponibile, periodo ignoto o caratteri non supportati restituiscono errori invece di costruire fatti. CF teorico e CF attribuito restano distinti; nome, residenza e cittadinanza non si deducono dal codice. Il link al servizio dell'Agenzia delle Entrate resta un controllo esterno manuale con codice di sicurezza; nessuna API ufficiale è promessa.
