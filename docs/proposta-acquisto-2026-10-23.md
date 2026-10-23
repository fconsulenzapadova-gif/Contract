# Modulo di proposta d’acquisto del 23 ottobre 2026

La route `/purchase-proposal` usa le due pagine del PDF fornito dall’utente, convertite in SVG con i caratteri trasformati in tracciati. Testo, logo, riquadri, spazi e numerazione sono quelli del documento originale. Il PDF originale e il suo hash sono conservati in `public/purchase-template/`.

I 31 campi HTML sono posizionati sulle righe del documento. I campi data sono liberi per mantenere il formato italiano e le caselle libero/locato sono esclusive. Firme manuali negli spazi del modello. La stampa mantiene due pagine A4, converte i valori in testo e impedisce l’esportazione di valori che eccedono i rettangoli disponibili. I dati non vengono troncati.

Il salvataggio usa la chiave bozza esistente della proposta e uno slot indipendente `purchaseTemplate`. I dati compatibili delle vecchie bozze vengono ripresi; gli slot precedenti rimangono conservati nell’esportazione JSON. In presenza di dati senza uno spazio corrispondente, più parti o unità è necessaria una verifica esplicita della bozza prima della stampa, perché il modello fornito ha spazi per un solo proponente e una sola riga catastale.

Su smartphone sono disponibili Compila e Anteprima, con gli stessi dati. Il componente usa l’istanza React e il layout di stampa già presenti. `scripts/integrate-purchase.py` modifica la sola route di acquisto dopo l’integrazione della scheda di condivisione; la base vendor e gli altri modelli restano invariati.

Verifiche: suite Node, typecheck, lint, build; test browser con 31 valori sintetici, ultimo dato digitato, bozze persistenti, cambio casella, stampa nativa, blocco overflow e smartphone 390×844. Verificate visivamente le quattro pagine dei PDF vuoto e compilato; riaperti con pypdf per controllare le due pagine A4. La QA della scheda di condivisione verifica anche caricamento e stampa dei 13 modelli precedenti.
