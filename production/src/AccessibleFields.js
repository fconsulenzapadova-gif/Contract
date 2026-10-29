/** Labels describe fixed-form positions without exposing implementation identifiers. */
const LABELS={richiedente:'Richiedente',indirizzoAlloggio:'Indirizzo dell’alloggio',tipoContratto:'Tipo di contratto',canoneAnnuo:'Canone annuo',decorrenzaDal:'Data di decorrenza',superficieConvenzionale:'Superficie convenzionale',zona:'Zona territoriale',data:'Data',firma:'Firma',note:'Note',sesso:'Sesso codificato',cf:'Codice fiscale',supLocativaTot:'Superficie locativa totale in metri quadrati',canoneConcordatoParti:'Canone concordato dalle parti',canoneConcordatoFinale:'Canone concordato finale'};
export function fieldLabel(name){
 const value=String(name||'');if(LABELS[value])return LABELS[value];
 const cat=/^cat(\d+)(.+)$/.exec(value);if(cat)return 'Unità catastale '+cat[1]+' · '+cat[2].replace(/([a-z])([A-Z])/g,'$1 $2').toLocaleLowerCase('it');
 let match;
 if((match=/^zona([A-E])$/.exec(value)))return 'Zona territoriale '+match[1];
 if((match=/^sup(Calp|Locativa)(\d+)$/.exec(value)))return 'Superficie '+(match[1]==='Calp'?'calpestabile':'locativa')+' in metri quadrati · voce '+Number(match[2]);
 if((match=/^(tipologia1|vetusta2|posizione3|accessorio4|dotazione5|ipe6|rendita7)([a-z])$/.exec(value))){const group={tipologia1:'Tipologia edilizia',vetusta2:'Epoca di costruzione o ristrutturazione',posizione3:'Posizione e contesto urbano',accessorio4:'Accessori in dotazione',dotazione5:'Dotazione tecnologica',ipe6:'Prestazione energetica',rendita7:'Rendita catastale'};return group[match[1]]+' · opzione '+match[2].toUpperCase();}
 if((match=/^arredo(\d+)(Min|Max)$/.exec(value)))return 'Arredo · voce '+match[1]+' · valore '+(match[2]==='Min'?'minimo':'massimo');
 if((match=/^qualitaPrevalente(\d)$/.exec(value)))return 'Qualità prevalente · opzione '+match[1];
 if((match=/^canone(Val|Mensile)(Min|Max)$/.exec(value)))return 'Canone '+(match[1]==='Mensile'?'mensile':'per metro quadrato')+' '+(match[2]==='Min'?'minimo':'massimo');
 if((match=/^incremento(U65|O65)_(42|52|62)$/.exec(value)))return 'Maggiorazione per superficie '+(match[1]==='U65'?'fino a 65':'oltre 65')+' metri quadrati · durata '+match[2][0]+' + '+match[2][1];
 return value.replace(/([a-zà-ú])([A-Z])/g,'$1 $2').replace(/([A-Za-z])(\d+)/g,'$1 $2').replace(/[_-]+/g,' ').replace(/^./,c=>c.toLocaleUpperCase('it'))||'Campo del documento';
}
