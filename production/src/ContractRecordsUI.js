import {migrateUnits, partyGrammar, groupDefinition, propertyAcceptance, signatureRows, displayName} from './ContractRecords.js';

/** React is injected to reuse the bundle's React instance. No clauses are stored here. */
export function createContractRecordsUI(React) {
 const h = React.createElement;
 const fragment = (...children) => h(React.Fragment, null, ...children);
 const inputStyle = width => ({width, maxWidth:'100%'});
 const button = (label, onClick, disabled = false) => h('button', {
  type:'button', className:'contract-control-btn contract-control-btn-secondary',
  'aria-label':label, disabled, onClick
 }, label);
 function personField(person, index, field, label, width, onChange, options = {}) {
  const id = person.id ?? index;
  const props = {name:field, 'aria-label':label, 'data-identity-field':field,
   'data-record-id':String(id), value:person[field] ?? '', className:'inline-input',
   autoComplete:'off', style:inputStyle(width), onChange:event => onChange?.(id, field, event.target.value)};
  return options.choices ? h('select', props, ...options.choices.map(([value,text]) => h('option',{value,key:value},text))) : h('input',{...props,type:'text'});
 }
 function partyNode({person,index,role,students,onChange,pStyle}) {
  const label = `${role === 'locatore' ? 'Locatore' : 'Conduttore'} ${index+1}`;
  const f = (field,text,width) => personField(person,index,field,`${label}: ${text}`,width,onChange);
  const grammar = partyGrammar(person);
  const children = [grammar.prefix,' ',f('nome','nome e cognome','190px')];
  if (person.cognome && displayName(person) !== String(person.nome || '').trim()) children.push(' ',f('cognome','cognome separato','120px'));
  children.push(grammar.gender ? `, ${grammar.born} a ` : ', luogo di nascita ',f('natoA','luogo di nascita','120px'),' (',f('prov','provincia di nascita','30px'),')',grammar.gender ? ' il ' : ', data di nascita ',f('natoIl','data di nascita','98px'),', C.F. ',f('cf','codice fiscale','150px'),`, ${grammar.domiciled} in `,f('domicilioComune','Comune di domicilio','95px'),' (',f('domicilioProv','provincia di domicilio','30px'),')');
  if (!students || String(person.domicilioArea || '').trim()) children.push(', zona ',f('domicilioArea','zona di domicilio','95px'));
  children.push(', via ',f('via','via di domicilio','130px'),' n. ',f('numero','numero civico di domicilio','42px'),', CI n. ',f('ci','numero documento','110px'),'.');
  return h('p',{style:pStyle,'data-party-id':person.id ?? index},...children);
 }
 function partyControls({person,index,role,parties,onChange,onPatch,onRemove,onMove,renderFiscalAssistant}) {
  const singular = role === 'locatore' ? 'locatore' : 'conduttore';
  const id = person.id ?? index;
  const label = `${role === 'locatore' ? 'Locatore' : 'Conduttore'} ${index+1}`;
  return h('div',{className:'contract-party-controls pdf-hide','data-record-controls':id,'data-record-role':role,key:`controls-${role}-${id}`},
   h('strong',null,label,': ',displayName(person) || 'Dati della persona'),
   h('label',null,'Cognome separato (facoltativo) ',personField(person,index,'cognome',`${label}: cognome separato`,'120px',onChange)),
   h('label',null,'Sesso ',personField(person,index,'sesso',`${label}: sesso`,'90px',onChange,{choices:[['','Non indicato'],['M','Maschile'],['F','Femminile']]})),
   h('label',null,'Trattamento ',personField(person,index,'trattamento',`${label}: trattamento`,'105px',onChange,{choices:[['','Da sesso indicato'],['signor','Signor'],['signora','Signora'],['signorina','Signorina'],['neutro','Neutro']]})),
   onRemove && button(`Rimuovi ${singular} ${index+1}`,()=>onRemove(id),parties.length<=1),
   onMove && button(`Sposta ${singular} ${index+1} in alto`,()=>onMove(id,-1),index===0),
   onMove && button(`Sposta ${singular} ${index+1} in basso`,()=>onMove(id,1),index===parties.length-1),
   renderFiscalAssistant && renderFiscalAssistant(person,index,updated => {
    if (onPatch) onPatch(id,updated);
    else for (const [field,value] of Object.entries(updated || {})) if (field !== 'id' && value !== person[field]) onChange?.(id,field,value);
   }));
 }
 function partyBlocks({keyPrefix,title,parties = [],role,onChange,onPatch,onAdd,onRemove,onMove,pStyle,students,renderFiscalAssistant,includeControls=false}) {
  const singular = role === 'locatore' ? 'locatore' : 'conduttore';
  const blocks = [{key:`${keyPrefix}-header`,node:fragment(
   h('div',{style:{...pStyle,textAlign:'center',fontWeight:'bold',marginBottom:'0.3rem'}},title),
   includeControls && h('div',{className:'contract-party-controls pdf-hide'},onAdd && button(`Aggiungi ${singular}`,onAdd)))}];
  parties.forEach((person,index) => {
   const id = person.id ?? index;
   // Keep the numbered block key recognized by the existing identity reader;
   // every edit/remove/move callback and the rendered record itself use the id.
   blocks.push({key:`${keyPrefix}-party-${index}`,node:fragment(
    partyNode({person,index,role,students,onChange,pStyle}),
    includeControls && partyControls({person,index,role,parties,onChange,onPatch,onRemove,onMove,renderFiscalAssistant}))});
  });
  if (parties.length) blocks.push({key:`${keyPrefix}-definition`,node:h('p',{style:pStyle},groupDefinition(role,parties.length),'.')});
  return blocks;
 }
 function unitField(unit,index,field,label,width,onChange,legacyChange) {
  const id = unit.id ?? index;
  return h('input',{type:'text', name:`unit-${id}-${field}`, 'aria-label':`Unità ${index+1}: ${label}`,
   'data-unit-field':field, 'data-unit-id':String(id), value:unit[field] ?? '',
   className:'inline-input',autoComplete:'off',style:inputStyle(width),onChange:event => {
    if (onChange) onChange(id,field,event.target.value);
    else if (index === 0) legacyChange?.(field,event.target.value);
   }});
 }
 const unitKinds = {principale:'Unità principale',garage:'Garage',cantina:'Cantina',posto_auto:'Posto auto',altro:'Altra unità'};
 function unitControls({unit,index,records,onUnitChange,onRemoveUnit,onMoveUnit}) {
  const id = unit.id ?? index, kind = unit.tipo || 'principale';
  const principalUnits = records.filter(candidate => candidate.id !== id && (!candidate.tipo || candidate.tipo === 'principale'));
  return h('div',{className:'contract-party-controls pdf-hide','data-unit-controls':id,key:`unit-controls-${id}`},
   h('label',null,`Unità ${index+1}: tipo `,h('select',{className:'inline-input','aria-label':`Unità ${index+1}: tipo`,'data-unit-field':'tipo','data-unit-id':String(id),value:kind,onChange:event=>onUnitChange?.(id,'tipo',event.target.value)},...Object.entries(unitKinds).map(([value,text])=>h('option',{value,key:value},text)))),
   kind !== 'principale' && h('label',null,'Pertinenza dell’unità principale ',h('select',{className:'inline-input','aria-label':`Unità ${index+1}: unità principale`,'data-unit-field':'mainUnitId','data-unit-id':String(id),value:unit.mainUnitId || '',onChange:event=>onUnitChange?.(id,'mainUnitId',event.target.value)},h('option',{value:''},'Da indicare'),...principalUnits.map(candidate=>h('option',{value:candidate.id,key:candidate.id},`Unità ${records.indexOf(candidate)+1}${candidate.comune ? ` — ${candidate.comune}` : ''}${candidate.via ? `, ${candidate.via}` : ''}`)))),
   onRemoveUnit && button(`Rimuovi unità ${index+1}`,()=>onRemoveUnit(id),records.length<=1),
   onMoveUnit && button(`Sposta unità ${index+1} in alto`,()=>onMoveUnit(id,-1),index===0),
   onMoveUnit && button(`Sposta unità ${index+1} in basso`,()=>onMoveUnit(id,1),index===records.length-1));
 }
 function propertyBlocks({keyPrefix='intro',units,property = {},conduttori = [],onUnitChange,onPropertyChange,onAddUnit,onRemoveUnit,onMoveUnit,pStyle,includeControls=false,introText}) {
  const records = units?.length ? units : migrateUnits(property,{idFactory:()=>`${keyPrefix}-legacy-unit`});
  const blocks = [{key:`${keyPrefix}-property-lead`,node:h('p',{style:pStyle},introText || propertyAcceptance(conduttori),records.length > 1 ? ' le seguenti unità immobiliari:' : ' la seguente unità immobiliare:')}];
  if (includeControls && onAddUnit) blocks.push({key:`${keyPrefix}-property-controls`,node:h('div',{className:'contract-party-controls pdf-hide'},button('Aggiungi unità immobiliare o pertinenza',onAddUnit))});
  records.forEach((unit,index) => {
   const id = unit.id ?? index;
   const f = (field,label,width) => unitField(unit,index,field,label,width,onUnitChange,onPropertyChange);
   const kind = unit.tipo || 'principale';
   const kindLabel = unitKinds[kind] || kind;
   const principal = records.find(candidate=>candidate.id===unit.mainUnitId && (!candidate.tipo || candidate.tipo==='principale'));
   blocks.push({key:`${keyPrefix}-property-unit-${id}`,node:fragment(
    includeControls && unitControls({unit,index,records,onUnitChange,onRemoveUnit,onMoveUnit}),
    h('p',{style:pStyle,'data-property-unit':id},h('strong',null,`${index+1}) ${kindLabel}`),principal ? `, pertinenza dell’unità principale ${records.indexOf(principal)+1}` : '',', descrizione ',f('descrizione','descrizione','110px'),', Comune di ',f('comune','Comune','120px'),', via ',f('via','via','150px'),' n. ',f('numero','numero civico','44px'),', piano ',f('piano','piano','44px'),', superficie calpestabile mq ',f('mq','superficie mq','70px'),'; censita al Catasto: foglio ',f('foglio','foglio','46px'),', particella ',f('particella','particella','46px'),', subalterno ',f('subalterno','subalterno','46px'),', Z.C. ',f('zc','zona censuaria','42px'),', sezione ',f('sezione','sezione catastale','50px'),', categoria ',f('categoria','categoria catastale','50px'),', classe ',f('classe','classe catastale','50px'),', consistenza vani ',f('vani','consistenza vani','42px'),', rendita catastale € ',f('rendita','rendita catastale','96px'),'.',unit.catastoLegacy ? fragment(' Ulteriori dati catastali già compilati: ',f('catastoLegacy','ulteriori identificativi catastali','240px'),'.') : null))});
  });
  return blocks;
 }
 function introBlocks(props) {
  const {keyPrefix='intro',titleNode,lawText,pStyle,conduttori=[],locatori=[],students=false,apeClasse='',onApeClasseChange,afterIntro,afterIntroBlocks,renderFiscalAssistant} = props;
  const blocks = [{key:`${keyPrefix}-lead`,node:fragment(titleNode,lawText && h('p',{style:{...pStyle,textAlign:'center'}},lawText))},
   ...partyBlocks({keyPrefix:`${keyPrefix}-conduttori`,title:'TRA',parties:conduttori,role:'conduttore',onChange:props.onConduttoreChange,onPatch:props.onConduttorePatch,onAdd:props.onAddConduttore,onRemove:props.onRemoveConduttore,onMove:props.onMoveConduttore,pStyle,students,renderFiscalAssistant,includeControls:props.includeControls}),
   ...partyBlocks({keyPrefix:`${keyPrefix}-locatori`,title:'E',parties:locatori,role:'locatore',onChange:props.onLocatoreChange,onPatch:props.onLocatorePatch,onAdd:props.onAddLocatore,onRemove:props.onRemoveLocatore,onMove:props.onMoveLocatore,pStyle,students,renderFiscalAssistant,includeControls:props.includeControls}),
   ...propertyBlocks({...props,keyPrefix}),
   {key:`${keyPrefix}-ape`,node:h('p',{style:pStyle},"Visto l’articolo 1, comma 7, del Decreto-legge 23 dicembre 2013, n. 145, la Parte Conduttrice dà atto e dichiara di aver ricevuto le informazioni e la documentazione, comprensiva dell'attestato, in ordine alla prestazione energetica degli edifici. Classe energetica: ",h('input',{type:'text',value:apeClasse,'aria-label':'Classe energetica',className:'inline-input',style:inputStyle('62px'),onChange:event=>onApeClasseChange?.(event.target.value)}),'.')}];
  return [...blocks,...(afterIntroBlocks ?? (afterIntro ? [afterIntro] : [])).map((node,index)=>({key:`${keyPrefix}-extra-${index}`,node}))];
 }
 function studentBlocks({parties=[],onChange,pStyle,keyPrefix='student',leadText,trailingText} = {}) {
  const blocks = [];
  if (leadText) blocks.push({key:`${keyPrefix}-lead`,node:h('p',{style:pStyle},leadText)});
  parties.forEach((person,index)=>{
   const id = person.id ?? index;
   const label = `Conduttore ${index+1}`;
   const f = (field,text,width) => h('input',{type:'text',name:field,'aria-label':`${label}: ${text}`,'data-student-field':field,'data-record-id':String(id),title:field==='codicePa'?'Riferimento al documento PA che certifica l’iscrizione all’Università di Padova':undefined,value:person[field]??'',autoComplete:'off',className:'inline-input',style:inputStyle(width),onChange:event=>onChange?.(id,field,event.target.value)});
   const gender = partyGrammar(person).gender;
   const subject = gender==='F' ? 'La conduttrice' : gender==='M' ? 'Il conduttore' : 'La persona';
   blocks.push({key:`${keyPrefix}-person-${id}`,node:h('p',{style:pStyle,'data-student-person':id},h('strong',null,`${label}: ${displayName(person) || '________________'}`),'. ',subject,' dichiara la propria iscrizione al corso di studi in ',f('corsoStudi','corso di studi','150px'),' presso ',f('universita','università','180px'),', sede del corso ',f('sede','sede del corso','120px'),', codice PA: ',f('codicePa','codice PA','90px'),', matricola: ',f('matricola','matricola','100px'),'; documentazione allegata: ',f('documentazione','documentazione allegata','180px'),'.')});
  });
  if (trailingText) blocks.push({key:`${keyPrefix}-requirements`,node:h('p',{style:pStyle},trailingText)});
  return blocks;
 }
 function signatureBlocks(props = {}) {
  return signatureRows(props).map(row=>({key:row.key,node:h('div',{
   className:'signature-box contract-individual-signature','data-signature-person':row.person.id ?? row.index,
   'data-signature-kind':row.specificApproval?'specific':'ordinary',style:{...props.pStyle,breakInside:'avoid',marginTop:'0.55rem',marginBottom:'0.45rem',minHeight:'16mm'}
  },h('strong',null,row.specificApproval ? 'Approvazione specifica — ' : 'Firma — ',row.role==='locatore'?'Locatore':'Conduttore',` ${row.index+1}`),h('div',null,displayName(row.person) || 'Nome e cognome: ______________________________'),h('div',{style:{paddingTop:'5mm'}},'Firma: ________________________________________'))}));
 }
 const signatures = props => fragment(...signatureBlocks(props).map(block=>h(React.Fragment,{key:block.key},block.node)));
 function editorControls(props = {}) {
  const children=[];
  for (const [role,parties,change,patch,add,remove,move] of [
   ['conduttore',props.conduttori||[],props.onConduttoreChange,props.onConduttorePatch,props.onAddConduttore,props.onRemoveConduttore,props.onMoveConduttore],
   ['locatore',props.locatori||[],props.onLocatoreChange,props.onLocatorePatch,props.onAddLocatore,props.onRemoveLocatore,props.onMoveLocatore]
  ]) {
   if (add) children.push(h('div',{className:'contract-party-controls pdf-hide',key:`add-${role}`},button(`Aggiungi ${role}`,add)));
   parties.forEach((person,index)=>children.push(partyControls({person,index,role,parties,onChange:change,onPatch:patch,onRemove:remove,onMove:move,renderFiscalAssistant:props.renderFiscalAssistant})));
  }
  const records=props.units?.length?props.units:migrateUnits(props.property||{},{idFactory:()=>`${props.keyPrefix||'intro'}-legacy-unit`});
  if (props.onAddUnit) children.push(h('div',{className:'contract-party-controls pdf-hide',key:'add-unit'},button('Aggiungi unità immobiliare o pertinenza',props.onAddUnit)));
  records.forEach((unit,index)=>children.push(unitControls({unit,index,records,onUnitChange:props.onUnitChange,onRemoveUnit:props.onRemoveUnit,onMoveUnit:props.onMoveUnit})));
  return h('div',{className:'contract-record-editor pdf-hide'},...children);
 }
 return {introBlocks,partyBlocks,propertyBlocks,studentBlocks,signatureBlocks,signatures,editorControls};
}
