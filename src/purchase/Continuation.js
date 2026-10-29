/** Split only at source offsets: joined printed fragments reproduce the original text. */
export function splitTextToFit(text, fits) {
 const fragments=[];let offset=0;
 while(offset<text.length){
  let low=1,high=text.length-offset,best=0;
  while(low<=high){const middle=Math.floor((low+high)/2);if(fits(text.slice(offset,offset+middle))){best=middle;low=middle+1;}else high=middle-1;}
  if(!best)throw new Error('Lo spazio di continuazione non contiene una riga di testo.');
  if(best<text.length-offset){
   const candidate=text.slice(offset,offset+best),boundary=Math.max(candidate.lastIndexOf('\n'),candidate.lastIndexOf(' '));
   if(boundary>best*.6)best=boundary+1;
   const last=text.charCodeAt(offset+best-1),next=text.charCodeAt(offset+best);
   if(last>=0xD800&&last<=0xDBFF&&next>=0xDC00&&next<=0xDFFF)best--;
  }
  if(!best)throw new Error('Lo spazio di continuazione non contiene un carattere completo.');
  fragments.push(text.slice(offset,offset+best));offset+=best;
 }
 return fragments;
}
/** Measures with the same point sizes and wrapping used by the printed A4 pages. */
export function createTextMeasurer(doc=document) {
 const node=doc.createElement('div');
 node.style.cssText="position:fixed;left:-100000px;top:0;visibility:hidden;pointer-events:none;box-sizing:content-box;margin:0;padding:0;border:0;min-height:0;max-height:none;height:auto;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;font-family:'Gemut Minion','Minion Pro',Georgia,serif;";
 doc.body.appendChild(node);
 return {
  height(text,width=493,size=11,line=15.4,weight=400){node.style.width=width+'pt';node.style.fontSize=size+'pt';node.style.lineHeight=line+'pt';node.style.fontWeight=String(weight);node.textContent=text||'\u00a0';return node.getBoundingClientRect().height*.75;},
  dispose(){node.remove();}
 };
}
/** Pack small fields together; a single field can continue over any number of pages. */
export function paginateContinuationEntries(entries,measure,capacity=584) {
 const pages=[];let page=[],used=0;
 const finish=()=>{if(page.length)pages.push(page);page=[];used=0;};
 for(const entry of entries){
  let remaining=entry.text,part=1;
  while(remaining.length){
   const title=entry.id+' · '+entry.label+(part>1?' (continua)':'');
   const overhead=measure.height(title,493,11,15.4,600)+(entry.context?measure.height(entry.context,493,9,12):0)+24;
   if(capacity-used-overhead<32&&page.length)finish();
   const available=capacity-used-overhead;
   const fragments=splitTextToFit(remaining,text=>measure.height(text)<=available+.1);
   const text=fragments[0];
   page.push({...entry,title,text,part});used+=overhead+measure.height(text);remaining=remaining.slice(text.length);part++;
   if(remaining.length)finish();
  }
 }
 finish();return pages;
}
export function continuationPages(React,pages,{kind,title,firstPage=3,signatures}) {
 const h=React.createElement,total=firstPage-1+pages.length;
 return pages.map((entries,index)=>h('article',{className:'a4-page contract-continuation-page '+kind+'-continuation-page',key:'continuation-'+index,'aria-label':`Allegato, pagina ${firstPage+index} di ${total}`},
  h('header',{className:'contract-continuation-header'},h('strong',null,title),h('span',null,`Pagina ${firstPage+index} di ${total}`)),
  h('p',{className:'contract-continuation-intro'},'Continuazione dei campi richiamati nel modulo. Ogni riferimento identifica il campo corrispondente.'),
  h('div',{className:'contract-continuation-body'},...entries.map(entry=>h('section',{className:'contract-continuation-entry',key:entry.key+'-'+entry.part},
   h('h2',null,entry.title),entry.context&&h('div',{className:'contract-continuation-context'},entry.context),
   h('div',{className:'contract-continuation-text','data-continuation-key':entry.key,'data-continuation-part':entry.part},entry.text)))),
  h('footer',{className:'contract-continuation-footer'},h('div',null,'Firme per richiamo alla continuazione'),h('div',{className:'contract-continuation-signatures'},...signatures.map(label=>h('span',{key:label},label+' ____________________'))),h('small',null,`${title} · Allegato · ${firstPage+index} / ${total}`))));
}
