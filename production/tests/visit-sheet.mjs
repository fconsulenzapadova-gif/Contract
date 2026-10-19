import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {collectTargets, planImport, applyImport} from '../src/IdentityTargets.js';

const moduleUrl = new URL('../src/VisitSheet.js', import.meta.url);
assert(existsSync(moduleUrl), 'La scheda visita deve essere disponibile come modulo compilabile');
const {createVisitSheet} = await import(moduleUrl);
let cells = [], cursor = 0;
const React = {useRef:v=>({current:v}),useCallback:f=>f,useEffect:()=>{},
 createElement:(type,props,...children)=>({type,props:{...props,children}}),
 useState(init){const i=cursor++;if(!(i in cells))cells[i]=typeof init==='function'?init():init;return[cells[i],value=>cells[i]=typeof value==='function'?value(cells[i]):value];}
};
const Layout=()=>null, Icon=()=>null;
const Component=createVisitSheet(React,Layout,Icon);
function render(){cursor=0;return Component();}
function nodes(tree, predicate){const result=[];function walk(node){if(!node||typeof node!=='object')return;if(predicate(node))result.push(node);for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')walk(value);}}walk(tree);return result;}
let tree=render();
assert.equal(nodes(tree,n=>n.props?.className?.includes('a4-page visit-sheet')).length,2);
const name=nodes(tree,n=>n.props?.['aria-label']==='Nome e cognome')[0];
assert.equal(name.props.value,'');
name.props.onChange({target:{value:'Mario Rossi'}});
const email=nodes(tree,n=>n.props?.['aria-label']==='Email')[0];
email.props.onChange({target:{value:'mario@example.com'}});
tree=render();
assert.equal(tree.props.clientName,'Mario Rossi');
assert.equal(nodes(tree,n=>n.props?.['aria-label']==='Nome e cognome')[0].props.value,'Mario Rossi');
assert.equal(nodes(tree,n=>n.props?.['aria-label']==='Email')[0].props.value,'mario@example.com');
const purchase=nodes(tree,n=>n.props?.role==='checkbox'&&n.props?.['aria-label']==='Acquisto')[0];
assert.equal(purchase.props['aria-checked'],false);
purchase.props.onClick();tree=render();
assert.equal(nodes(tree,n=>n.props?.['aria-label']==='Acquisto')[0].props['aria-checked'],true);
assert.equal(nodes(tree,n=>n.props?.['aria-label']==='Locazione')[0].props['aria-checked'],false);
nodes(tree,n=>n.props?.['aria-label']==='Acquisto')[0].props.onClick();tree=render();
assert.equal(nodes(tree,n=>n.props?.['aria-label']==='Acquisto')[0].props['aria-checked'],false);
assert.equal(nodes(tree,n=>n.props?.className==='visit-signature').length,2);
console.log('PASS: due pagine, valori conservati durante la compilazione, scelte indipendenti e firme su carta');
const targets=collectTargets(tree.props.preview,'/visit-sheet');
assert.equal(targets.length,1,'Il lettore deve individuare la persona che visita');
assert.equal(targets[0].label,'La persona che visita');
const operations=planImport(targets[0],{givenNames:{value:'LUCA',confirmed:true},surname:{value:'VERDI',confirmed:true}});
applyImport(operations,true);tree=render();
assert.equal(nodes(tree,n=>n.props?.['aria-label']==='Nome e cognome')[0].props.value,'LUCA VERDI');
assert.equal(nodes(tree,n=>n.props?.['aria-label']==='Email')[0].props.value,'mario@example.com');
console.log('PASS: lettore documenti inserisce il nome confermato senza modificare i recapiti');
nodes(tree,n=>n.props?.['aria-label']==='Nome e cognome')[0].props.onChange({target:{value:'Luca\nVerdi'}});
tree=render();
assert.equal(nodes(tree,n=>n.props?.['aria-label']==='Nome e cognome')[0].props.value,'Luca Verdi','Gli a capo incollati nei dati non devono espandere la pagina senza limiti');
