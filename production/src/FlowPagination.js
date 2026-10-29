/** Measured splits preserve the exact source, including whitespace and Unicode. */
export function textSegments(text,fits){
 const output=[];let start=0;
 while(start<text.length){
  let low=1,high=text.length-start,best=0;
  while(low<=high){const middle=Math.floor((low+high)/2);if(fits(text.slice(start,start+middle),start)){best=middle;low=middle+1;}else high=middle-1;}
  if(best&&/[\uD800-\uDBFF]/.test(text[start+best-1])&&/[\uDC00-\uDFFF]/.test(text[start+best]||''))best--;
  if(!best)throw Error('Il contenuto non trova spazio nella pagina. Verificare il formato prima di stampare.');
  // Prefer a word/paragraph boundary without discarding the separator.
  if(start+best<text.length){const tail=text.slice(start+Math.max(0,best-160),start+best),at=Math.max(tail.lastIndexOf('\n'),tail.lastIndexOf(' '));if(at>=0&&best-tail.length+at+1>best*.7)best=best-tail.length+at+1;}
  output.push(text.slice(start,start+best));start+=best;
 }
 return output.length?output:[''];
}

/** Split a static, attached flow block using real font/line geometry, never character quotas. */
export function splitFlowElement(element,capacity){
 if(element.offsetHeight<=capacity+.5)return [element.innerHTML];
 const doc=element.ownerDocument,walker=doc.createTreeWalker(element,4),leaves=[];let leaf,total=0;
 while((leaf=walker.nextNode())){leaves.push({node:leaf,start:total,end:total+leaf.length});total+=leaf.length;}
 if(!total)throw Error('Un elemento grafico supera la pagina A4: verificarlo prima della stampa.');
 const host=element.cloneNode(false);host.removeAttribute('id');element.after(host);
 function point(offset){const item=leaves.find(item=>item.end>=offset)||leaves.at(-1);return [item.node,Math.max(0,offset-item.start)];}
 function fragment(start,end){
  const range=doc.createRange();if(!start)range.setStart(element,0);else range.setStart(...point(start));if(end===total)range.setEnd(element,element.childNodes.length);else range.setEnd(...point(end));
  let content=range.cloneContents(),ancestor=range.commonAncestorContainer;
  if(ancestor.nodeType===3)ancestor=ancestor.parentNode;
  // cloneContents omits its common ancestor. Keep every wrapper up to the flow
  // block so a slice within one text node retains pre-wrap, font and field identity.
  while(ancestor&&ancestor!==element){const wrapper=ancestor.cloneNode(false),outer=doc.createDocumentFragment();wrapper.appendChild(content);outer.appendChild(wrapper);content=outer;ancestor=ancestor.parentNode;}
  return content;
 }
 let start=0;const html=[];
 try{
  const text=element.textContent;
  for(const piece of textSegments(text,(candidate,offset)=>{host.replaceChildren(fragment(offset,offset+candidate.length));return host.offsetHeight<=capacity-2;})){
   host.replaceChildren(fragment(start,start+piece.length));html.push(host.innerHTML);start+=piece.length;
  }
 }finally{host.remove();}
 return html;
}
