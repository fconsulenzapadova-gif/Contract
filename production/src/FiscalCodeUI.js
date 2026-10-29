const pendingFiscalUpdates=new Set();
export async function waitForFiscalUpdates(){for(let attempt=0;attempt<12&&pendingFiscalUpdates.size;attempt++){await Promise.all([...pendingFiscalUpdates]);await new Promise(resolve=>setTimeout(resolve,0));}}
import {normalizeFiscalCode,normalizeBirthDate,validateFiscalCode,synchronizeFiscalCode} from './FiscalCode.js';

/** One coordinator per mounted person; obsolete lookups never commit changes. */
export function createFiscalCodeCoordinator() {
  let generation=0;
  return {
    cancel(){generation++;},
    async run(person,options,deliver){
      const current=++generation,result=await synchronizeFiscalCode(person,options);
      if(current===generation)deliver(result);
      return result;
    },
  };
}

const LABELS={nome:'Nome',cognome:'Cognome',sesso:'Sesso anagrafico',natoIl:'Data di nascita',natoA:'Luogo di nascita',prov:'Provincia di nascita',cf:'Codice fiscale'};
const OFFICIAL='https://telematici.agenziaentrate.gov.it/VerificaCF/IVerificaCfPf.jsp';
const showDate=value=>normalizeBirthDate(value)?normalizeBirthDate(value).split('-').reverse().join('/'):String(value||'');
const conflictKey=item=>JSON.stringify([item.current,item.proposed,item.code]);
const panelStyle={fontSize:'12px',lineHeight:1.45,border:'1px solid #d9dfdb',borderRadius:'5px',padding:'10px 12px',margin:'8px 0 14px',background:'#fafcfb',color:'#33463d'};
const rowStyle={display:'flex',flexWrap:'wrap',alignItems:'center',gap:'6px',marginTop:'6px'};
const buttonStyle={font:'inherit',padding:'3px 8px',border:'1px solid #8eaa9b',borderRadius:'3px',background:'#fff',color:'#264a38',cursor:'pointer'};

/** React is supplied by the existing compiled application; no second React copy. */
export function createFiscalCodeUI(React,parser) {
  const h=React.createElement;
  function FiscalCodeAssistant({person,onChange,onPatch,legacyFullName=false,label='Codice fiscale',now,minYear=1861,debounceMs=180,availableFields=[]}) {
    const [view,setView]=React.useState(null),[selection,setSelection]=React.useState({code:'',date:''});
    const [names,setNames]=React.useState({nome:'',cognome:''}),[editingNames,setEditingNames]=React.useState(false);
    const coordinator=React.useRef(null),latest=React.useRef(null),callbacks=React.useRef(null);
    if(!coordinator.current)coordinator.current=createFiscalCodeCoordinator();
    callbacks.current={onChange,onPatch};
    const signature=JSON.stringify(person),code=normalizeFiscalCode(person.cf),selectedDate=selection.code===code?selection.date:'';
    latest.current={person,signature};
    function commit(next) {
      const current=latest.current.person;if(next.id!==current.id)return;
      if(typeof callbacks.current.onChange==='function')callbacks.current.onChange(next);
      else if(typeof callbacks.current.onPatch==='function'){
        const patch=Object.fromEntries(Object.entries(next).filter(([key,value])=>key!=='id'&&JSON.stringify(value)!==JSON.stringify(current[key])));
        if(Object.keys(patch).length)callbacks.current.onPatch(current.id,patch);
      }
    }
    React.useEffect(()=>{
      let alive=true;const snapshot=person,expected=signature;let settle;const pending=new Promise(resolve=>settle=resolve);pendingFiscalUpdates.add(pending);const finish=()=>{pendingFiscalUpdates.delete(pending);settle();};
      const timer=setTimeout(()=>{
        coordinator.current.run(snapshot,{adapter:parser,now:now||new Date(),minYear,selectedDate,legacyFullName},result=>{
          if(!alive||latest.current.signature!==expected)return;
          setView({signature:expected,result});if(result.changed)commit(result.person);
        }).catch(()=>{if(alive&&latest.current.signature===expected)setView({signature:expected,result:{person:snapshot,conflicts:[],errors:[{code:'lookup',message:'Archivio dei luoghi non leggibile. Verificare i dati manualmente.'}]}});}).finally(finish);
      },debounceMs);
      return ()=>{alive=false;clearTimeout(timer);coordinator.current.cancel();finish();};
    },[signature,selectedDate,legacyFullName,minYear,now?.getTime(),debounceMs]);
    const result=view?.signature===signature?view.result:null,checked=validateFiscalCode(person.cf),decoded=result?.decoded,computed=result?.computed;
    const completeCode=code.length>=16||/^\d{11}$/.test(code);
    const errors=completeCode||computed?.complete?[...result?.errors||[],...decoded?.warnings||[]]:[];
    const distinctErrors=[...new Map(errors.map(error=>[error.code+'|'+error.message,error])).values()];
    const keep=person._fiscalCode?.keep||{};
    function chooseConflict(item,accept) {
      if(view?.signature!==latest.current.signature)return;
      const current=latest.current.person,metadata={...current._fiscalCode},fields={...metadata.fields},kept={...metadata.keep};
      if(accept&&item.proposed!==null&&item.proposed!==undefined){
        delete kept[item.field];fields[item.field]={source:item.source,code:item.code,value:item.proposed,officiallyVerified:false};
        commit({...current,[item.field]:item.proposed,_fiscalCode:{...metadata,fields,keep:kept}});
      }else{delete fields[item.field];kept[item.field]=conflictKey(item);commit({...current,_fiscalCode:{...metadata,fields,keep:kept}});}
    }
    const conflicts=(result?.conflicts||[]).map(item=>({item,kept:keep[item.field]===conflictKey(item)}));
    const hasCode=Boolean(code),hasNames=Boolean(person.nome||person.cognome),generated=person._fiscalCode?.fields?.cf?.source==='theoretical'&&normalizeFiscalCode(person._fiscalCode.fields.cf.value)===code;
    // The empty state remains visible so the assistant explains how to start.

    const children=[];
    let summary='Compilare nome e cognome separati, sesso anagrafico, data completa e luogo di nascita: il codice teorico viene calcolato automaticamente.';
    if(code&&code.length<16&&!/^\d{11}$/.test(code))summary='Completare il codice fiscale per leggere i dati di nascita.';
    else if(checked.kind==='numeric')summary='Identificativo numerico: nessun dato anagrafico ricavabile. Non è possibile distinguere qui un codice provvisorio da quello di un soggetto diverso da persona fisica.';
    else if(generated)summary='Codice teorico calcolato dai dati inseriti. L’attribuzione e le eventuali omocodie vanno confrontate con il codice dell’Agenzia delle Entrate.';
    else if(checked.valid&&checked.kind==='individual')summary=checked.omocodia?'Struttura e controllo locale corretti; omocodia conservata.':'Struttura e controllo locale corretti.';
    if(!hasCode&&!hasNames)children.push(h('div',{key:'start',role:'status'},'Inizia compilando la persona nel documento oppure inserisci il codice fiscale qui sotto.'));
    else if(!result)children.push(h('div',{key:'processing',role:'status'},'Verifica locale in corso…'));
    children.push(h('div',{key:'summary'},h('strong',null,label+' · '),summary));
    const nameConfirmed=legacyFullName ? person._fiscalCode?.names?.confirmed&&person._fiscalCode.names.displayValue===person.nome : Boolean(person.nome&&person.cognome);
    const missing=[!nameConfirmed?'nome e cognome distinti':'',!person.sesso?'sesso anagrafico':'',!normalizeBirthDate(person.natoIl)?'data completa di nascita':'',!person.natoA?'Comune o Stato estero di nascita':''].filter(Boolean);
    if(!hasCode&&missing.length)children.push(h('div',{key:'missing',role:'status'},'Per il calcolo mancano: '+missing.join(', ')+'.'));
    const additional=['sesso','natoIl','natoA','prov','cf'].filter(field=>!availableFields.includes(field));
    if(additional.length)children.push(h('div',{key:'additional',style:rowStyle},...additional.map(field=>h('label',{key:field,style:{display:'grid',gap:'3px'}},LABELS[field],field==='sesso'?h('select',{value:person[field]||'',onChange:event=>commit({...latest.current.person,[field]:event.target.value})},h('option',{value:''},'Da indicare'),h('option',{value:'M'},'Maschile'),h('option',{value:'F'},'Femminile')):h('input',{'aria-label':label+': '+LABELS[field],type:field==='natoIl'?'date':'text',value:field==='natoIl'?normalizeBirthDate(person[field]):person[field]||'',onChange:event=>commit({...latest.current.person,[field]:field==='cf'?normalizeFiscalCode(event.target.value):event.target.value}),style:{font:'inherit',padding:'4px',maxWidth:'220px'}})))));

    if(decoded?.date&&!decoded.date.selected){
      children.push(h('div',{key:'century',style:rowStyle},
        h('span',null,`Data indicata dal codice: ${decoded.date.partial}. Confermare l’anno completo:`),
        ...decoded.date.candidates.map(date=>h('button',{key:date,type:'button',style:buttonStyle,onClick:()=>setSelection({code,date}),title:'Conferma '+showDate(date)},showDate(date))),
        decoded.date.candidates.length===0?h('span',null,'Inserire manualmente una data completa e verificare il documento.'):null));
    }
    if(decoded?.place&&!decoded.place.selected&&decoded.place.candidates.length>1)children.push(h('div',{key:'place-choice',style:rowStyle},h('span',null,'Più denominazioni storiche: confrontare con il documento e scegliere il luogo.'),...decoded.place.candidates.map(place=>h('button',{type:'button',key:place.name+place.creationDate,style:buttonStyle,onClick:()=>commit({...latest.current.person,natoA:place.name,prov:place.province})},place.name+' ('+place.province+')'))));
    if(decoded?.place?.selected)children.push(h('div',{key:'place',style:{marginTop:'4px'}},`Luogo codificato: ${decoded.place.selected.name} (${decoded.place.selected.province}) · ${decoded.place.code}${decoded.date?.selected?' · periodo verificato nell’archivio locale':' · periodo da verificare dopo la conferma dell’anno'}`));
    for(const error of distinctErrors)children.push(h('div',{key:'error-'+error.code+'-'+error.message,role:'status',style:{marginTop:'5px',color:'#8a3c2b'}},error.message));
    for(const {item,kept} of conflicts){
      const current=item.field==='natoIl'?showDate(item.current):String(item.current??''),proposed=item.field==='natoIl'?showDate(item.proposed):String(item.proposed??'');
      children.push(h('div',{key:'conflict-'+item.field+'-'+item.proposed,style:{...rowStyle,color:kept?'#5b655e':'#8a3c2b'}},
        h('span',null,item.message||`${LABELS[item.field]||item.field}: inserito «${current}»; ${item.source==='theoretical'?'teorico':'ricavato dal codice'} «${proposed}».`),
        kept?h('span',null,'Dato inserito mantenuto; incoerenza da verificare sul documento.'):null,
        item.proposed!==null&&item.proposed!==undefined?h('button',{type:'button',style:buttonStyle,onClick:()=>chooseConflict(item,true)},item.source==='theoretical'?'Usa il codice teorico':'Usa il dato ricavato'):null,
        !kept?h('button',{type:'button',style:buttonStyle,onClick:()=>chooseConflict(item,false)},'Mantieni il dato inserito'):null));
    }
    if(legacyFullName){
      const confirmed=person._fiscalCode?.names?.confirmed&&person._fiscalCode.names.displayValue===person.nome;
      children.push(h('div',{key:'legacy',style:rowStyle},h('span',null,confirmed?'Nome e cognome per il calcolo confermati separatamente.':'Il nome completo presente nel modulo va distinto manualmente in nome e cognome per calcolare il codice.'),
        h('button',{type:'button',style:buttonStyle,onClick:()=>{setNames(confirmed?{nome:person._fiscalCode.names.nome,cognome:person._fiscalCode.names.cognome}:{nome:'',cognome:person.cognome||''});setEditingNames(value=>!value);}},editingNames?'Chiudi':'Indica nome e cognome')));
      if(editingNames)children.push(h('div',{key:'name-inputs',style:rowStyle},
        ...['nome','cognome'].map(field=>h('label',{key:field,style:{display:'grid',gap:'3px'}},LABELS[field]+' per il calcolo',h('input',{value:names[field],onChange:event=>setNames(values=>({...values,[field]:event.target.value})),style:{font:'inherit',padding:'4px',maxWidth:'220px'},autoComplete:field==='nome'?'given-name':'family-name'}))),
        h('button',{type:'button',style:buttonStyle,disabled:!names.nome.trim()||!names.cognome.trim(),onClick:()=>{const current=latest.current.person;commit({...current,_fiscalCode:{...current._fiscalCode,names:{...names,displayValue:current.nome,confirmed:true,source:'manual'}}});setEditingNames(false);}},'Conferma per il calcolo')));
    }
    const provenance=Object.entries(person._fiscalCode?.fields||{}).filter(([field,entry])=>field==='natoIl'?normalizeBirthDate(person[field])===normalizeBirthDate(entry.value):String(person[field]??'')===String(entry.value??''));
    if(provenance.length)children.push(h('div',{key:'provenance',style:{marginTop:'5px',color:'#66766d'}},'Provenienza: '+provenance.map(([field,entry])=>`${LABELS[field]||field} ${entry.source==='theoretical'?'calcolato':'ricavato dal codice'}`).join('; ')+'.'));
    children.push(h('div',{key:'official',style:{marginTop:'7px',color:'#66766d'}},'Controllo locale, senza invio di dati personali. ',h('a',{href:OFFICIAL,target:'_blank',rel:'noopener noreferrer',style:{color:'#264a38'}},'Verifica ufficiale presso l’Agenzia delle Entrate'),' · servizio esterno con codice di sicurezza da compilare manualmente.'));
    return h('aside',{className:'cf-assistant pdf-hide no-print',style:panelStyle,'aria-label':'Assistenza codice fiscale'},...children);
  }
  return {FiscalCodeAssistant};
}
