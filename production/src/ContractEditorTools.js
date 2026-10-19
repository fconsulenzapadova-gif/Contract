import {collectTargets} from './IdentityTargets.js';
import {createDraftTools,useContractDraft} from './ContractDraft.js';
import {normalizeBirthDate} from './FiscalCode.js';
import {createFiscalCodeUI} from './FiscalCodeUI.js';
const cache=new WeakMap();
function walk(node,callback){
 if(Array.isArray(node)){node.forEach(n=>walk(n,callback));return;}
 if(!node?.props)return;
 if(callback(node)===false)return;
 walk(node.props.children,callback);
}
export function editableControls(preview){
 const controls=[];
 for(const block of preview?.props?.blocks||[])walk(block.node,node=>{
  if(/(?:^| )contract-party-controls(?: |$)/.test(node.props.className||'')){controls.push(node);return false;}
 });
 return controls;
}
export function removeEditorControls(React,node){
 if(Array.isArray(node))return node.map(n=>removeEditorControls(React,n)).filter(n=>n!=null);
 if(!node?.props)return node;
 if(/(?:^| )(?:pdf-hide|pdf-export-hide|contract-party-controls)(?: |$)/.test(node.props.className||''))return null;
 if(!node.props.children)return node;
 return React.cloneElement(node,null,removeEditorControls(React,node.props.children));
}
export function toolsHeader(React,preview,existing,adapter){
 if(location.pathname==='/lease-allegato-b')return existing;
 let Tools=cache.get(React);
 if(!Tools){
  const h=React.createElement,{FiscalCodeAssistant}=createFiscalCodeUI(React,adapter),DraftTools=createDraftTools(React);
  Tools=function ContractTools({preview,existing}){
   const [extra,setExtra]=useContractDraft(React,'fiscalMetadata',{});
   const targets=collectTargets(preview,location.pathname);
   const activeIds=JSON.stringify(targets.map(target=>target.recordId||target.id));
   React.useEffect(()=>{
    const active=new Set(JSON.parse(activeIds));
    setExtra(previous=>Object.keys(previous).some(id=>!active.has(id))?Object.fromEntries(Object.entries(previous).filter(([id])=>active.has(id))):previous);
   },[activeIds]);
   const controls=editableControls(preview);
   return h('div',{className:'contract-editor-tools'},existing,h(DraftTools),
    controls.length>0&&h('details',{className:'contract-editor-records'},h('summary',null,'Parti, trattamento e unità immobiliari'),...controls.map((node,i)=>h('div',{key:'editor-'+i},node))),
    targets.length>0&&h('details',{className:'contract-fiscal-tools'},h('summary',null,'Anagrafiche e codice fiscale'),...targets.map(target=>{
     const fields=target.fields,stable=target.recordId||target.id;
     const person={...(extra[stable]||{}),id:stable};
     const aliases={fullName:'nome',givenNames:'nome',surname:'cognome',birthPlace:'natoA',birthProvince:'prov',birthDate:'natoIl',taxCode:'cf',sex:'sesso'};
     for(const [key,prop] of Object.entries(aliases))if(fields[key])person[prop]=fields[key].value;
     if(fields.fullName&&person.cognome&&!(person._fiscalCode?.names?.source==='manual'&&person._fiscalCode.names.displayValue===person.nome&&person._fiscalCode.names.cognome===person.cognome)){const display=String(person.nome||'').trim(),surname=String(person.cognome).trim(),suffix=' '+surname;const given=display.toLocaleLowerCase('it').endsWith(suffix.toLocaleLowerCase('it'))?display.slice(0,-suffix.length).trim():display;person._fiscalCode={...person._fiscalCode,names:{nome:given,cognome:surname,displayValue:person.nome,confirmed:true,source:'explicit surname'}};}
     return h(FiscalCodeAssistant,{key:stable,person,label:target.label,legacyFullName:!!fields.fullName,availableFields:Object.entries(aliases).filter(([key])=>fields[key]).map(([,prop])=>prop),onChange:next=>{
      setExtra(previous=>({...previous,[stable]:next}));
      for(const [key,prop] of Object.entries(aliases)){
       const field=fields[key];if(!field||next[prop]===undefined||next[prop]===field.value)continue;
       let value=next[prop];
       if(prop==='natoIl'&&field.props.type==='date'&&/^\d{2}\/\d{2}\/\d{4}$/.test(value))value=value.slice(6)+'-'+value.slice(3,5)+'-'+value.slice(0,2);
       if(prop==='natoIl'&&field.props.type!=='date'&&normalizeBirthDate(value))value=normalizeBirthDate(value).split('-').reverse().join('/');
       field.props.onChange({target:{name:field.props.name,value,type:field.props.type||'text'},identityImport:true});
      }
     }});
    })));
  };
  cache.set(React,Tools);
 }
 return React.createElement(Tools,{preview,existing});
}
