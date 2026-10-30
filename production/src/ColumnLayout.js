/** Rearrange the existing shell without replacing its routes, state or actions. */
export function columnShell(React, provider) {
 const app=provider.props.children,[sidebar,main]=app.props.children;
 const [brand,navigation]=sidebar.props.children,[menu,content]=main.props.children;
 const toggle=React.cloneElement(menu.props.children[0],{className:'contract-menu-toggle','aria-label':menu.props.children[0].props.title});
 const side=React.cloneElement(sidebar,{className:sidebar.props.className+' contract-navigation-column'},
  React.cloneElement(brand,null,toggle,...React.Children.toArray(brand.props.children)),navigation);
 return React.cloneElement(provider,null,React.cloneElement(app,{className:'app-layout contract-app-columns'},side,
  React.cloneElement(main,{className:'main-content contract-main-column'},React.cloneElement(content,{className:'contract-route-column'}))));
}

const components=new WeakMap();
const editorContexts=new WeakMap();
export function columnEditorContext(React) {
 if(!editorContexts.has(React))editorContexts.set(React,React.createContext(null));
 return editorContexts.get(React);
}
/** Keep printable refs and callbacks intact; only non-document UI moves columns. */
export function documentColumns(React, layout, editorColumn) {
 let Columns=components.get(React);
 if(!Columns){
  const h=React.createElement;
  Columns=function DocumentColumns({layout,editorColumn}) {
   const [view,setView]=React.useState(editorColumn?'edit':'preview');
   const [textEditors,setTextEditors]=React.useState([]);
   const registerEditors=React.useCallback(editors=>setTextEditors(editors),[]);
   const [header,preview]=layout.props.children;
   const [information,actions]=header.props.children;
   const [title,tools]=information.props.children;
   const options=[['tools','Strumenti'],...(editorColumn?[['edit','Compila']]:[]),['preview','Anteprima']];
   return h(columnEditorContext(React).Provider,{value:registerEditors},h('div',{className:'contract-document-columns'+(editorColumn?' has-editor':'')+(layout.props.className.includes('pdf-exporting')?' pdf-exporting':''),'data-column':view},
    h('nav',{className:'contract-column-switcher pdf-hide','aria-label':'Colonne del documento'},...options.map(([key,label])=>h('button',{key,type:'button','aria-pressed':view===key,onClick:()=>setView(key)},label))),
    h('aside',{className:'contract-document-tools pdf-hide','aria-label':'Strumenti del documento',onChangeCapture:event=>{if(event.target.closest('.contrax-section-nav')&&event.target.value!=='')setView('preview');}},
     h('div',{className:'contract-column-title'},title),
     h('section',{className:'contract-document-actions','aria-label':'Stampa e visualizzazione'},h('h2',null,'Documento'),actions),tools,
     textEditors.length>0&&h('section',{className:'contract-text-tools','aria-label':'Testi estesi del documento'},h('h2',null,'Testi estesi'),...textEditors.map(editor=>h('div',{key:editor.key},h('p',null,editor.label),h('button',{type:'button',className:'contract-control-btn',onClick:event=>editor.open(event.currentTarget)},'Modifica il testo completo'))))),
    editorColumn&&h('div',{className:'contract-compilation-column pdf-hide'},editorColumn),
    React.cloneElement(preview,{className:preview.props.className+' contract-preview-column'})));
  };
  components.set(React,Columns);
 }
 return React.createElement(Columns,{layout,editorColumn});
}
