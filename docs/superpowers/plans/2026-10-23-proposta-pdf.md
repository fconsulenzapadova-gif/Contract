# Proposta acquisto dal PDF fornito

Goal: sostituire /purchase-proposal con le due pagine esatte del PDF indicato dall'utente e campi compilabili nelle posizioni originali.

Architecture: pagine vettoriali ricavate dal PDF, campi HTML sovrapposti, integrazione con React e bozze esistenti. Route, navigazione e gli altri modelli rimangono sul rilascio attuale verificato tramite hash.

- Verificare il contratto di compilazione con test browser: due pagine, spazi originali, caselle, ultimo dato digitato, salvataggio e stampa.
- Aggiungere PurchaseTemplate.js e asset vettoriali al build finale, sostituendo solo il componente della proposta d'acquisto.
- Controllare fedeltà visiva, stampa A4, testi lunghi, bozze precedenti, smartphone e modelli esistenti.
- Verificare build e test, pubblicare sul progetto Vercel esistente e ripetere la verifica sull'URL pubblico.

Scelte tecniche: il PDF non contiene AcroForm; gli input saranno negli spazi visibili. Per mantenere due pagine identiche, la stampa sarà bloccata se un valore supera lo spazio disponibile. I dati delle bozze preesistenti saranno conservati; eventuali parti/unità ulteriori, non rappresentabili nel modulo esatto, richiederanno revisione esplicita prima della stampa.
