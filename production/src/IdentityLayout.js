/** Associate labels and values using OCR word geometry; never flatten columns. */
const labels={
 surname:['COGNOME','NACHNAME','SURNAME'],givenNames:['NOME','VORNAME','GIVEN NAMES','GIVEN NAME','NAME'],
 birthPlace:['LUOGO E DATA DI NASCITA','COMUNE E DATA DI NASCITA','LUOGO DI NASCITA','COMUNE DI NASCITA','PLACE AND DATE OF BIRTH','PLACE OF BIRTH','GEBURTSORT'],
 birthDate:['DATA DI NASCITA','DATE OF BIRTH','GEBURTSDATUM'],
 issueDate:['DATA DI EMISSIONE','DATA DI RILASCIO','DATE OF ISSUE','ISSUING DATE','EMISSIONE','RILASCIO','AUSSTELLUNG','AUSSTELLUNGSDATUM','ISSUING'],
 expiryDate:['DATA DI SCADENZA','DATE OF EXPIRY','EXPIRATION DATE','SCADENZA','GULTIG BIS','GULTIGKEIT','EXPIRY'],
 taxCode:['CODICE FISCALE','FISCAL CODE','STEUERNUMMER','C.F.','CF'],
 residence:['RESIDENZA','RESIDENTE A','RESIDENTE IN','RESIDENCE','ADDRESS','WOHNORT','ANSCHRIFT'],
 documentNumber:['NUMERO DEL DOCUMENTO','NUMERO DOCUMENTO','NUMERO PASSAPORTO','NUMERO PATENTE','DOCUMENT NUMBER','DOCUMENT NO','PASSPORT NUMBER','PASSPORT NO','N. DOCUMENTO','NUMERO'],
 issuer:['RILASCIATO DA','RILASCIATA DA','AUTORITA DI RILASCIO','ISSUING AUTHORITY','AUTHORITY','AUTORITA','COMUNE DI','GEMEINDE','MUNICIPALITY'],
 ignore:['CITTADINANZA','NATIONALITY','STAATSANGEHORIGKEIT','SESSO','SEX','GESCHLECHT','STATURA','HEIGHT','GROSSE','FIRMA DEL TITOLARE','SIGNATURE','UNTERSCHRIFT','ESTREMI ATTO DI NASCITA','CARTA DI IDENTITA','IDENTITY CARD','DOCUMENTO DI PROVA','DOCUMENTO DI IDENTITA','CAN'],
};
const normalize=text=>String(text||'').normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().replace(/\bN0ME\b/g,'NOME');
const entries=Object.entries(labels).flatMap(([key,names])=>names.map(name=>({key,name,re:new RegExp('^'+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+')+'(?=$|[\\s/|:;.,-])','i')}))).sort((a,b)=>b.name.length-a.name.length);
const parentHeading=text=>/(?:COGNOME|NOME|NAME|VORNAME).*(?:PADRE|MADRE|VATERS?|MUTTER|ELTERN|FATHER|MOTHER|VECI)/i.test(text);
const separators=/^[\s/|:;.,-]+/;
function firstLabel(text){const normalized=normalize(text);for(const entry of entries){const m=normalized.match(entry.re);if(m)return {...entry,length:m[0].length};}return null;}
export function matchIdentityLabel(text,kind='card'){
 if(parentHeading(text))return {key:'ignore',length:text.length};
 if(kind==='licence'){const m=text.match(/^\s*(1|2|3|4[abc]|5)[.)]?\s+/i);if(m)return {key:({1:'surname',2:'givenNames',3:'birthPlace','4a':'issueDate','4b':'expiryDate','4c':'issuer',5:'documentNumber'})[m[1].toLowerCase()],length:m[0].length};}
 const leading=text.match(/^\s*/)[0].length;const found=firstLabel(text.slice(leading));if(!found)return null;
 let end=leading+found.length;
 while(end<text.length){const separator=text.slice(end).match(separators);if(separator)end+=separator[0].length;
  if(separator&&/[:;]/.test(separator[0]))break;
  const next=firstLabel(text.slice(end));if(!next||next.name==='COMUNE DI'||!(next.key===found.key||(found.key==='birthPlace'&&next.key==='birthDate')))break;end+=next.length;
 }
 return {key:found.key,length:end,municipality:found.key==='issuer'&&['COMUNE DI','GEMEINDE','MUNICIPALITY'].includes(found.name)};
}
const union=items=>items.length?{x0:Math.min(...items.map(i=>i.x0)),y0:Math.min(...items.map(i=>i.y0)),x1:Math.max(...items.map(i=>i.x1)),y1:Math.max(...items.map(i=>i.y1))}:null;
const height=box=>Math.max(8,box.y1-box.y0);
const fiscal=/(?<![A-Z0-9])(?:[A-Z]\s*){6}(?:[0-9LMNPQRSTUV]\s*){2}[A-EHLMPRST]\s*(?:[0-9LMNPQRSTUV]\s*){2}[A-Z]\s*(?:[0-9LMNPQRSTUV]\s*){3}[A-Z](?![A-Z0-9])/i;
const cieNumber=/\b[A-Z]\s*[A-Z]\s*(?:\d\s*){5}[A-Z]\s*[A-Z]\b/i;
const date=/(?:\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[./-]\d{1,2}[./-]\d{4}|\d{1,2}\s+[A-ZÀ-Ü]{3,12}\s+\d{4})/i;

export function flattenOcr(data){
 return (data.blocks||[]).flatMap(block=>(block.paragraphs||[]).flatMap(paragraph=>(paragraph.lines||[]).map(line=>({text:line.text.trim(),confidence:line.confidence,bbox:line.bbox,words:(line.words||[]).map(word=>({text:word.text,confidence:word.confidence,bbox:word.bbox}))}))));
}
function tokensOf(line){
 if(line.words?.length)return line.words.filter(w=>w.text.trim()).map(w=>({...w,text:w.text.trim()}));
 const parts=[...line.text.matchAll(/\S+/g)],box=line.bbox;
 return parts.map(m=>({text:m[0],confidence:line.confidence,...(box?{bbox:{x0:box.x0+(box.x1-box.x0)*m.index/line.text.length,x1:box.x0+(box.x1-box.x0)*(m.index+m[0].length)/line.text.length,y0:box.y0,y1:box.y1}}:{})}));
}
function sourceSpan(source,start,end){
 const words=source.words||tokensOf(source),selected=[];let offset=0;
 for(const word of words){const limit=offset+word.text.length;if(limit>start&&offset<end)selected.push(word);offset=limit+1;}
 return {...source,bbox:union(selected.map(w=>w.bbox).filter(Boolean)),confidence:selected.length?Math.min(...selected.map(w=>w.confidence??source.confidence)):source.confidence};
}
function textAnchors(text,kind){
 if(parentHeading(text))return [{key:'ignore',start:0,end:text.length}];
 const result=[];
 for(const part of text.matchAll(/\S+/g)){
  if(result.length&&part.index<result.at(-1).end)continue;
  const found=matchIdentityLabel(text.slice(part.index),kind);if(!found)continue;
  if(found.municipality&&result.at(-1)?.key==='issuer'&&part.index===result.at(-1).end)continue;
  result.push({...found,start:part.index,end:part.index+found.length});
 }
 return result;
}

export function collectIdentityCandidates(pages,kind,normalizeDate){
 const candidates={},seen=new Set();
 const add=(key,value,source,anchor)=>{
  if(!value)return;
  const bbox=source.bbox||null;
  (candidates[key]??=[]).push({value,confidence:Math.min(source.confidence??0,anchor?.confidence??100),page:source.page,bbox,source:'Testo del documento'});
 };
 const addValue=(key,raw,source,anchor)=>{
  let start=raw.search(/[^\s:;]/),end=raw.replace(/[\s;]+$/g,'').length;
  if(start<0)return;let value=raw.slice(start,end);if(!value||parentHeading(value))return;
  if(matchIdentityLabel(value,kind)&&!(key==='issuer'&&/^COMUNE DI\s+\p{L}/iu.test(value)))return;
  if(key==='birthPlace'){
   const found=value.match(date);if(found){
    add('birthDate',normalizeDate(found[0]),sourceSpan(source,start+found.index,start+found.index+found[0].length),anchor);seen.add('birthDate');
    if(value.slice(0,found.index).trim()){end=start+found.index;value=raw.slice(start,end).trim();}
    else{start+=found.index+found[0].length;start+=raw.slice(start,end).search(/\S/)<0?0:raw.slice(start,end).search(/\S/);value=raw.slice(start,end).trim();}
   }
   const province=value.match(/\s*\([A-Z]{2}\)\s*$/i);if(province){end=start+province.index;value=value.slice(0,province.index).trim();}
   value=value.replace(/\s+/g,' ').trim();
  }
  if(['birthDate','issueDate','expiryDate'].includes(key)){const found=value.match(date);if(!found)return;start+=found.index;end=start+found[0].length;value=normalizeDate(found[0]);}
  if(key==='taxCode'){const found=value.match(fiscal);if(!found)return;start+=found.index;end=start+found[0].length;value=found[0].replace(/\s+/g,'').toUpperCase();}
  if(key==='documentNumber'){
   const found=(kind==='card'?value.match(cieNumber):null)||value.match(/\b(?:[A-Z]{1,3}\s+)?[A-Z0-9.-]*\d[A-Z0-9.-]*(?:\s+\d[A-Z0-9.-]*)*(?:\s+[A-Z]{1,3})?\b/i);
   if(!found)return;start+=found.index;end=start+found[0].length;value=found[0].replace(/\s+/g,'').toUpperCase();
  }
  if(['givenNames','surname'].includes(key)&&(!/^\p{L}[\p{L}\p{M}\s'’.-]*$/u.test(value)||/\d/.test(value)))return;
  if(key==='issuer'&&anchor?.municipality&&!/^COMUNE\b/i.test(value))value='COMUNE DI '+value;
  add(key,value,sourceSpan({...source,text:raw},start,end),anchor);
 };
 pages.forEach((page,pageIndex)=>{
  const lines=(page.lines?.length?page.lines:String(page.text||'').split(/\r?\n/).map(text=>({text}))).filter(l=>l.text?.trim()).map(l=>({...l,text:l.text.trim(),confidence:Number(l.confidence??page.confidence??0),page:pageIndex+1}));
  const geometric=lines.some(l=>l.bbox);
  if(geometric){
   // Sparse OCR can return independent blocks for two values on one physical row.
   const rows=[];
   for(const line of [...lines].filter(l=>l.bbox).sort((a,b)=>a.bbox.y0-b.bbox.y0||a.bbox.x0-b.bbox.x0)){
    const row=rows.find(r=>Math.abs((r.bbox.y0+r.bbox.y1-line.bbox.y0-line.bbox.y1)/2)<Math.min(height(r.bbox),height(line.bbox))*.45);
    if(row){row.tokens.push(...tokensOf(line));row.tokens.sort((a,b)=>a.bbox.x0-b.bbox.x0);row.text=row.tokens.map(w=>w.text).join(' ');row.bbox=union([row.bbox,line.bbox]);}
    else rows.push({...line,index:rows.length,tokens:tokensOf(line)});
   }
   const anchors=[];
   for(const row of rows){
    if(parentHeading(row.text)){anchors.push({key:'ignore',bbox:row.bbox,row,confidence:row.confidence,start:0,end:row.tokens.length});continue;}
    for(let i=0;i<row.tokens.length;i++){
     const text=row.tokens.slice(i).map(t=>t.text).join(' '),label=matchIdentityLabel(text,kind);if(!label)continue;
     if(label.municipality&&anchors.at(-1)?.row===row&&anchors.at(-1)?.key==='issuer'&&anchors.at(-1)?.end===i)continue;
     let size=0,end=i;while(end<row.tokens.length&&size<label.length){size+=row.tokens[end].text.length+1;end++;}
     const words=row.tokens.slice(i,end),bbox=union(words.map(w=>w.bbox).filter(Boolean));if(!bbox)continue;
     anchors.push({...label,bbox,row,confidence:Math.min(...words.map(w=>w.confidence??row.confidence)),start:i,end});i=end-1;
    }
   }
   for(const anchor of anchors){
    if(anchor.key==='ignore')continue;seen.add(anchor.key);
    const h=height(anchor.bbox),peers=anchors.filter(a=>a!==anchor&&Math.abs(a.bbox.y0-anchor.bbox.y0)<h*5&&a.bbox.x0>anchor.bbox.x1+h*.3).sort((a,b)=>a.bbox.x0-b.bbox.x0);
    const left=anchor.bbox.x0-h,right=peers[0]?peers[0].bbox.x0-h*.3:Infinity;
    const barrier=anchors.filter(a=>a.key!==anchor.key&&a!==anchor&&a.bbox.y0>=anchor.bbox.y1&&a.bbox.x1>=left&&a.bbox.x0<Math.min(right,anchor.bbox.x1)).sort((a,b)=>a.bbox.y0-b.bbox.y0)[0]?.bbox.y0??Infinity;
    const last=anchors.filter(a=>a.row===anchor.row&&a.start>=anchor.end).sort((a,b)=>a.start-b.start)[0]?.start??anchor.row.tokens.length;
    let inline=anchor.row.tokens.slice(anchor.end,last);
    if(inline[0]&&inline[0].bbox.x0-anchor.bbox.x1>h*3)inline=[];
    const beforeInline=(candidates[anchor.key]||[]).length;
    if(inline.length)addValue(anchor.key,inline.map(w=>w.text).join(' '),{page:pageIndex+1,words:inline,bbox:union(inline.map(w=>w.bbox)),confidence:Math.min(...inline.map(w=>w.confidence??anchor.row.confidence))},anchor);
    if((candidates[anchor.key]||[]).length>beforeInline)continue;
    const nextRows=rows.filter(r=>r!==anchor.row&&r.bbox&&r.bbox.y0>=anchor.bbox.y1-h*.15&&r.bbox.y0<Math.min(barrier,anchor.bbox.y1+Math.max(h*5,(page.width||0)*.08))).sort((a,b)=>a.bbox.y0-b.bbox.y0);
    for(const row of nextRows){
     const words=row.tokens.filter((w,index)=>w.bbox&&w.bbox.x0>=left&&w.bbox.x0<right&&!anchors.some(a=>a.row===row&&index>=a.start&&index<a.end));
     if(!words.length)continue;
     const value=words.map(w=>w.text).join(' ');if(matchIdentityLabel(value,kind))continue;
     const before=(candidates[anchor.key]||[]).length;
     addValue(anchor.key,value,{page:pageIndex+1,words,bbox:union(words.map(w=>w.bbox)),confidence:Math.min(...words.map(w=>w.confidence??row.confidence))},anchor);
     if((candidates[anchor.key]||[]).length>before||anchor.key==='birthPlace'&&date.test(value))break;
    }
   }
  }else{
   for(let i=0;i<lines.length;i++){
    const line=lines[i],anchors=textAnchors(line.text,kind);
    for(let a=0;a<anchors.length;a++){
    const label=anchors[a];if(label.key==='ignore')continue;seen.add(label.key);
    const inline=line.text.slice(label.end,anchors[a+1]?.start??line.text.length).trim();if(inline)addValue(label.key,inline,{...line,text:inline,words:[]},{...label,confidence:line.confidence});
    else for(let j=i+1;j<Math.min(lines.length,i+7);j++){
     const next=matchIdentityLabel(lines[j].text,kind);if(next){if(next.key===label.key||label.key==='birthPlace'&&next.key==='birthDate')continue;break;}
     const before=(candidates[label.key]||[]).length;addValue(label.key,lines[j].text,lines[j],{...label,confidence:line.confidence});
     if((candidates[label.key]||[]).length>before||label.key==='birthPlace'&&date.test(lines[j].text))break;
    }
    }
   }
  }
  // Syntax anchors are independent of the order of front and back and labels.
  for(const line of lines){
   if(line.text.includes('<')||parentHeading(line.text))continue;
   const text=tokensOf(line).map(w=>w.text).join(' '),source={...line,text};
   const code=text.match(fiscal);if(code)add('taxCode',code[0].replace(/\s/g,'').toUpperCase(),sourceSpan(source,code.index,code.index+code[0].length));
   if(kind==='card'){const number=text.toUpperCase().match(cieNumber);if(number)add('documentNumber',number[0].replace(/\s/g,''),sourceSpan(source,number.index,number.index+number[0].length));}
  }
 });
 return {candidates,seen};
}
