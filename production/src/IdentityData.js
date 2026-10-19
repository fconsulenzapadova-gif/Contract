import {collectIdentityCandidates} from "./IdentityLayout.js";
/** Local OCR interpretation. Confidence is evidence for review, never certification. */
export const IDENTITY_FIELDS = [
 ['surname','Cognome'], ['givenNames','Nome'], ['birthPlace','Luogo di nascita'],
 ['birthDate','Data di nascita'], ['taxCode','Codice fiscale'], ['residence','Residenza'],
 ['documentNumber','Numero documento'], ['issuer','Autorità di rilascio'],
 ['issueDate','Data di rilascio'], ['expiryDate','Scadenza'],
];
export const STATUS_LABELS = {read:'Letto · da confermare',uncertain:'Da verificare',missing:'Non leggibile',inconsistent:'Incoerente',absent:'Non presente',manual:'Corretto · da confermare'};
const optional = new Set(['taxCode','residence']);
const normal = s => String(s||'').normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().replace(/[^\p{L}\p{N}]/gu,'');
const today = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const datePattern = /(?:\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[./-]\d{1,2}[./-]\d{4}|\d{1,2}\s+[A-ZÀ-Ü]{3,12}\s+\d{4})/i;

export function normalizeDate(raw) {
 const match=String(raw).match(datePattern); if(!match)return '';
 const text=match[0];let year,month,day;
 if(/^\d{4}/.test(text)) [year,month,day]=text.split(/[-/]/).map(Number);
 else if(/^[\d./-]+$/.test(text)) [day,month,year]=text.split(/[./-]/).map(Number);
 else {const parts=text.split(/\s+/);day=+parts[0];year=+parts[2];const months=['GENJAN','FEB','MARMAR','APR','MAGMAY','GIUJUN','LUGJUL','AGO AUG','SETSEP','OTTOCT','NOV','DICDEC'];month=months.findIndex(m=>m.includes(parts[1].slice(0,3).toUpperCase()))+1;}
 return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

export function validTaxCode(code) {
 const cf=String(code).toUpperCase();
 if(!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-EHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(cf))return false;
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ';const oddLetters=[1,0,5,7,9,13,15,17,19,21,2,4,18,20,11,3,6,8,12,14,16,10,22,25,24,23];const oddNumbers=[1,0,5,7,9,13,15,17,19,21];
 let sum=0;for(let i=0;i<15;i++){const c=cf[i],digit=/\d/.test(c);sum+=i%2===0?(digit?oddNumbers[+c]:oddLetters[alphabet.indexOf(c)]):(digit?+c:alphabet.indexOf(c));}
 return alphabet[sum%26]===cf[15];
}

export function validateField(key,value,now=new Date()) {
 const text=String(value||'').trim();if(!text)return '';
 if(text.length>180)return 'Valore troppo lungo: verificare la lettura.';
 if(['birthDate','issueDate','expiryDate'].includes(key)){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(text))return 'Inserire una data completa.';
  const d=new Date(text+'T12:00:00Z');if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==text||+text.slice(0,4)<1900)return 'Data non valida.';
  if(key==='birthDate'&&text>today(now))return 'Data di nascita futura.';
  if(key==='issueDate'&&text>today(now))return 'Data di rilascio futura.';
 }
 if(key==='taxCode'&&!validTaxCode(text))return 'Codice fiscale: formato o carattere di controllo non valido.';
 if(['givenNames','surname'].includes(key)&&!/^\p{L}[\p{L}\p{M}\s'’.-]*$/u.test(text))return 'Nome con caratteri inattesi: confrontare con il documento.';
 if(key==='documentNumber'&&!/^[A-Z0-9][A-Z0-9 /.-]{3,24}$/i.test(text))return 'Numero documento con formato inatteso.';
 return '';
}
export function isExpired(fields,now=new Date()){
 const field=fields?.expiryDate;
 return Boolean(field?.value&&field.status!=='inconsistent'&&!validateField('expiryDate',field.value,now)&&field.value<today(now));
}

export function mrzCheckDigit(text) {
 const weights=[7,3,1];let sum=0;
 for(let i=0;i<text.length;i++){const c=text[i];const n=c==='<'?0:/\d/.test(c)?+c:c.charCodeAt(0)-55;if(n<0||n>35)return '';sum+=n*weights[i%3];}
 return String(sum%10);
}

function mrzDate(text,birth,now){
 if(!/^\d{6}$/.test(text))return '';
 let year=2000+Number(text.slice(0,2));const md=`-${text.slice(2,4)}-${text.slice(4,6)}`;
 if(birth&&`${year}${md}`>today(now))year-=100;
 // A previous-century expiry remains visible as expired rather than silently renewed.
 if(!birth&&year>now.getFullYear()+30)year-=100;
 return `${year}${md}`;
}

function mrzValues(lines,now){
 const clean=lines.map(l=>({...l,text:l.text.toUpperCase().replace(/\s/g,'')}));
 const results=[];
 for(let i=0;i<clean.length;i++){
  const a=clean[i],b=clean[i+1],c=clean[i+2];let names,number,dob,expiry,checks=[],composite;
  if(a.text.length===44&&a.text.startsWith('P<')&&b?.text.length===44&&a.page===b.page){
   names=a.text.slice(5);number=b.text.slice(0,9);dob=b.text.slice(13,19);expiry=b.text.slice(21,27);
   checks=[['documentNumber',number,b.text[9]],['birthDate',dob,b.text[19]],['expiryDate',expiry,b.text[27]]];
   composite=b.text.slice(0,10)+b.text.slice(13,20)+b.text.slice(21,43);
   checks.push(['all',composite,b.text[43]]);
  }else if(a.text.length===30&&/^[IAC]</.test(a.text)&&b?.text.length===30&&c?.text.length===30&&a.page===b.page&&a.page===c.page){
   names=c.text;number=a.text.slice(5,14);dob=b.text.slice(0,6);expiry=b.text.slice(8,14);
   checks=[['documentNumber',number,a.text[14]],['birthDate',dob,b.text[6]],['expiryDate',expiry,b.text[14]]];
   checks.push(['all',a.text.slice(5,30)+b.text.slice(0,7)+b.text.slice(8,15)+b.text.slice(18,29),b.text[29]]);
  }else continue;
  const split=names.split('<<'),decode=x=>x.replace(/</g,' ').replace(/\s+/g,' ').trim();
  const invalid=new Set(checks.filter(([,v,d])=>mrzCheckDigit(v)!==d).map(([key])=>key));
  results.push({values:{surname:decode(split[0]),givenNames:decode(split.slice(1).join(' ')),documentNumber:number.replace(/<+$/,''),birthDate:mrzDate(dob,true,now),expiryDate:mrzDate(expiry,false,now)},invalid,confidence:Math.min(a.confidence,b.confidence,c?.confidence??100),page:a.page});
 }
 return results;
}

export function reviewFields(fields,now=new Date()) {
 const out=Object.fromEntries(Object.entries(fields).map(([key,field])=>[key,{...field}]));
 for(const [key,field] of Object.entries(out)){
  const error=validateField(key,field.value,now);
  if(error){field.status='inconsistent';field.message=error;field.confirmed=false;}
 }
 const birth=out.birthDate,issue=out.issueDate,expiry=out.expiryDate;
 for(const [left,right,message] of [[birth,issue,'Il rilascio precede la nascita.'],[issue,expiry,'La scadenza precede il rilascio.']]){
  if(left?.value&&right?.value&&left.status!=='inconsistent'&&right.status!=='inconsistent'&&left.value>right.value){right.status='inconsistent';right.message=message;right.confirmed=false;}
 }
 return out;
}

export function extractIdentity(pages,kind='card',now=new Date()) {
 const lines=pages.flatMap((p,page)=>(p.lines?.length?p.lines:String(p.text||'').split(/\r?\n/).map(text=>({text}))).map(l=>({text:l.text.trim(),confidence:Number(l.confidence??p.confidence??0),page:page+1})).filter(l=>l.text));
 const collected=collectIdentityCandidates(pages,kind,normalizeDate),seen=collected.seen;
 const candidates=Object.fromEntries(IDENTITY_FIELDS.map(([key])=>[key,collected.candidates[key]||[]]));
 const add=(key,value,source,mrz=false,error='')=>{if(value)candidates[key].push({value,confidence:source.confidence,page:source.page,bbox:source.bbox||null,mrz,error,source:mrz?'Zona MRZ':'Testo del documento'});};
 for(const mrz of mrzValues(lines,now))for(const [key,value] of Object.entries(mrz.values))add(key,value,mrz,true,mrz.invalid.has(key)||mrz.invalid.has('all')?'Controllo MRZ non valido: confrontare con il documento.':'');
 const fields={};
 for(const [key,label] of IDENTITY_FIELDS){
  const list=candidates[key],chosen=list[0];let status='read',message='Confrontare con il documento e confermare.';
  if(!chosen){status=optional.has(key)&&!seen.has(key)?'absent':'missing';message=status==='absent'?'Dato non presente o non individuato in questo tipo di documento.':'Dato atteso non recuperato: inserire manualmente o caricare un’immagine più chiara.';}
  else if(list.some(c=>normal(c.value)!==normal(chosen.value))){status='inconsistent';message='Valori discordanti tra pagine o testo e MRZ: '+[...new Set(list.map(c=>c.value))].join(' / ');}
  else if(list.some(c=>c.error)){status='inconsistent';message=list.find(c=>c.error).error;}
  else if(chosen.confidence<85){status='uncertain';message='Lettura con bassa confidenza: confrontare e correggere il valore.';}
  fields[key]={label,value:chosen?.value||'',status,message,confidence:chosen?.confidence??null,page:chosen?.page??null,bbox:chosen?.bbox||null,source:chosen?.source||null,alternatives:list.filter((item,index)=>list.findIndex(c=>normal(c.value)===normal(item.value))===index),confirmed:false};
 }
 const reviewed=reviewFields(fields,now),warnings=[];
 if(!lines.length)warnings.push('Nessun testo leggibile. Provare una foto più nitida e ben illuminata.');
 if(pages.some(p=>p.confidence<55))warnings.push('Lettura debole su una o più pagine: verificare tutti i campi.');
 if(kind==='card'&&pages.length===1)warnings.push('È stata letta una sola pagina: il retro può contenere dati necessari.');
 const expired=isExpired(reviewed,now);
 return {kind,fields:reviewed,warnings,expired};
}
