/** Bind short labels and trailing punctuation to atomic inline controls. */
export function composeInlineData(React,node){
 if(Array.isArray(node))return node.map(n=>composeInlineData(React,n));
 if(!node?.props)return node;
 if(node.type==='input'||node.type==='textarea'||node.type==='select')return node;
 let children=React.Children.toArray(node.props.children||[]).map(child=>composeInlineData(React,child));
 children=children.reduce((items,child)=>{if(typeof child==='string'&&typeof items.at(-1)==='string')items[items.length-1]+=child;else items.push(child);return items;},[]);
 if(node.type==='p'){
  const out=[];
  const isField=child=>['input','select'].includes(child?.type)||['strong','span'].includes(child?.type)&&React.Children.toArray(child.props.children).length===1&&['input','select'].includes(React.Children.toArray(child.props.children)[0]?.type);
  for(let i=0;i<children.length;i++){
   const child=children[i];if(!isField(child)){out.push(child);continue;}
   let before='',after='';
   if(typeof out.at(-1)==='string'){
    const text=out.pop(),match=text.match(/(.*?)(\s*(?:[\p{L}.°€:]+\s*){1,3}|\s*[([]\s*)$/u);
    if(match){if(match[1])out.push(match[1]);before=match[2];}else out.push(text);
   }
   if(typeof children[i+1]==='string'){
    const match=children[i+1].match(/^([,.);:]+)(.*)$/su);
    if(match){after=match[1];children[i+1]=match[2];}
   }
   // Whitespace inside an inline-block collapses at its edge. Keep the word
   // separator outside so punctuation remains attached and the next group wraps.
   const gap=before.match(/^\s+/)?.[0]||'';
   if(gap)out.push(gap);
   out.push(React.createElement('span',{className:'contract-inline-value',key:'inline-'+i},before.slice(gap.length),child,after));
  }
  children=out;
 }
 if(node.type==='strong'&&children.every(child=>typeof child==='string'))return React.cloneElement(node,{style:{...node.props.style,whiteSpace:'nowrap',display:'inline-block'}},...children);
 return React.cloneElement(node,null,...children);
}
