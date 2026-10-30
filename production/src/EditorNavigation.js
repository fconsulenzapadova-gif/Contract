/** A shared section jump keeps long documents navigable without altering their legal order. */
const components=new WeakMap();
export function withSectionNavigation(React,children){
 let Navigator=components.get(React);
 if(!Navigator){const h=React.createElement;
  Navigator=function Navigator({children}){
   const [sections,setSections]=React.useState([]),nodes=React.useRef([]);
   React.useEffect(()=>{
    let frame;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
     const seen=new Set(),items=[];nodes.current=[];
     for(const node of document.querySelectorAll('.a4-page h2,.a4-page h3,.purchase-mobile-editor h2,.purchase-editor h2,.sharing-editor h2')){
      if(node.closest('.a4-measure-shell,.contract-native-print-copy'))continue;const title=node.textContent.trim();if(!title||seen.has(title))continue;seen.add(title);items.push(title);nodes.current.push(node);
     }
     setSections(previous=>JSON.stringify(previous)===JSON.stringify(items)?previous:items);
    });};
    const observer=new MutationObserver(update),root=document.querySelector('.document-preview-container');if(root)observer.observe(root,{childList:true,subtree:true});update();return()=>{observer.disconnect();cancelAnimationFrame(frame);};
   },[]);
   return h('div',{className:'contrax-editor-workspace'},children,sections.length>0&&h('label',{className:'contrax-section-nav'},'Vai alla sezione',h('select',{'aria-label':'Vai a una sezione del documento',value:'',onChange:event=>{if(event.target.value==='')return;const node=nodes.current[Number(event.target.value)];if(node){node.setAttribute('tabindex','-1');requestAnimationFrame(()=>{node.scrollIntoView({block:'start',behavior:'auto'});node.focus({preventScroll:true});});}}},h('option',{value:''},'Scegli una sezione'),...sections.map((title,index)=>h('option',{value:index,key:title},title)))));
  };components.set(React,Navigator);
 }
 return React.createElement(Navigator,null,children);
}
