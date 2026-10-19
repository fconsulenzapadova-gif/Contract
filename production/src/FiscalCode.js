/** Local theoretical coding and reversible birth facts; never an attribution lookup. */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MONTHS = 'ABCDEHLMPRST';
const OMOCODIA = 'LMNPQRSTUV';
const NUMERIC_POSITIONS = [6,7,9,10,12,13,14];
const ODD = [1,0,5,7,9,13,15,17,19,21,2,4,18,20,11,3,6,8,12,14,16,10,22,25,24,23];
const DERIVABLE = new Set(['cf','sesso','natoIl','natoA','prov']);
const placeCache = new WeakMap();
const err = (code,message,field) => ({code,message,...field?{field}:{}});
const pad = value => String(value).padStart(2,'0');
const today = now => `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;

export function normalizeFiscalCode(raw) { return String(raw??'').replace(/\s/gu,'').toUpperCase(); }
export function normalizeName(raw) {
  return String(raw??'').normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().replace(/[\s'’‘ʼ.\-]/gu,'');
}
const normalPlace = raw => String(raw??'').normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().replace(/[’‘ʼ]/gu,"'").replace(/\s+/gu,' ').trim();
function nameParts(raw) {
  const value = normalizeName(raw);
  if (!/^[A-Z]+$/.test(value)) return null;
  return {consonants:value.replace(/[AEIOU]/g,''),vowels:value.replace(/[^AEIOU]/g,'')};
}
export function encodeSurname(raw) {
  const parts=nameParts(raw); return parts?(parts.consonants+parts.vowels+'XXX').slice(0,3):'';
}
export function encodeGivenName(raw) {
  const parts=nameParts(raw); if(!parts)return '';
  return parts.consonants.length>=4?parts.consonants[0]+parts.consonants[2]+parts.consonants[3]:encodeSurname(raw);
}
export function checksum(body) {
  const value=normalizeFiscalCode(body);if(!/^[A-Z0-9]{15}$/.test(value))return '';
  let sum=0;
  for(let i=0;i<15;i++){const c=value[i],n=/\d/.test(c)?Number(c):ALPHABET.indexOf(c);sum+=i%2===0?ODD[n]:n;}
  return ALPHABET[sum%26];
}
function deomocodeBody(value) {
  const chars=value.slice(0,15).split('');
  for(const index of NUMERIC_POSITIONS)if(OMOCODIA.includes(chars[index]))chars[index]=String(OMOCODIA.indexOf(chars[index]));
  return chars.join('');
}
function numericChecksum(value) {
  let sum=0;for(let i=0;i<10;i++){let n=Number(value[i]);if(i%2===1){n*=2;if(n>9)n-=9;}sum+=n;}
  return String((10-sum%10)%10)===value[10];
}
function realDate(year,month,day) {
  if(!Number.isInteger(year)||year<1||year>9999||month<1||month>12||day<1||day>31)return false;
  const days=[31,(year%4===0&&(year%100!==0||year%400===0))?29:28,31,30,31,30,31,31,30,31,30,31];
  return day<=days[month-1];
}
export function normalizeBirthDate(raw) {
  let year,month,day;const text=String(raw??'').trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(text))[year,month,day]=text.split('-').map(Number);
  else if(/^\d{1,2}[/.\-]\d{1,2}[/.\-]\d{4}$/.test(text))[day,month,year]=text.split(/[/.\-]/).map(Number);
  else return '';
  return realDate(year,month,day)?`${String(year).padStart(4,'0')}-${pad(month)}-${pad(day)}`:'';
}
export function validateFiscalCode(raw) {
  const normalized=normalizeFiscalCode(raw),result={original:String(raw??''),normalized,kind:'invalid',valid:false,errors:[],omocodia:false,baseBody:''};
  if(!normalized){result.kind='empty';return result;}
  if(/^\d{11}$/.test(normalized)){
    result.kind='numeric';result.valid=numericChecksum(normalized);
    if(!result.valid)result.errors.push(err('checksum','Identificativo numerico: carattere di controllo non valido.','cf'));
    return result;
  }
  if(!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(normalized)){
    result.errors.push(err('structure','Codice fiscale: struttura non valida.','cf'));return result;
  }
  result.kind='individual';result.baseBody=deomocodeBody(normalized);
  result.omocodia=NUMERIC_POSITIONS.some(index=>OMOCODIA.includes(normalized[index]));
  if(checksum(normalized.slice(0,15))!==normalized[15])result.errors.push(err('checksum','Codice fiscale: carattere di controllo non valido.','cf'));
  const year2=Number(result.baseBody.slice(6,8)),month=MONTHS.indexOf(result.baseBody[8])+1,encodedDay=Number(result.baseBody.slice(9,11));
  const sex=encodedDay>=41&&encodedDay<=71?'F':encodedDay>=1&&encodedDay<=31?'M':'';
  const day=sex==='F'?encodedDay-40:encodedDay;
  if(!sex||!realDate(2000+year2,month,day))result.errors.push(err('date','Codice fiscale: giorno, mese o data impossibile.','natoIl'));
  result.birth={year2,month,day,sex};result.valid=result.errors.length===0;return result;
}
export function deriveBirthDateCandidates(birth,{now=new Date(),minYear=1861,maxYear=now.getFullYear()}={}) {
  const candidates=[];
  for(let year=Math.floor(minYear/100)*100+birth.year2;year<=maxYear;year+=100){
    if(year<minYear||!realDate(year,birth.month,birth.day))continue;
    const date=`${year}-${pad(birth.month)}-${pad(birth.day)}`;if(date<=today(now))candidates.push(date);
  }
  return candidates;
}
function periodDate(raw) {
  if(raw instanceof Date){if(Number.isNaN(raw.getTime()))return '';return `${String(raw.getFullYear()).padStart(4,'0')}-${pad(raw.getMonth()+1)}-${pad(raw.getDate())}`;}
  return normalizeBirthDate(String(raw??'').slice(0,10));
}
function placeRecord(record) {
  if(!record||!/^([A-Z]\d{3})$/.test(String(record.belfioreCode??'').toUpperCase()))return null;
  const code=String(record.belfioreCode).toUpperCase(),start=periodDate(record.creationDate),end=periodDate(record.expirationDate);
  return {...record,belfioreCode:code,name:String(record.name??''),province:code.startsWith('Z')?'EE':String(record.province??'').toUpperCase(),foreign:code.startsWith('Z'),creationDate:start,expirationDate:end,periodKnown:Boolean(start&&end)};
}
function connectorOf(adapter) { return adapter?.belfioreConnector||adapter?.parser?.belfioreConnector||adapter; }
async function allPlaces(adapter) {
  const connector=connectorOf(adapter);
  if(!connector||typeof connector!=='object')return null;
  if(Array.isArray(connector.places))return connector.places.map(placeRecord).filter(Boolean);
  if(typeof connector.scanData==='function'||typeof connector.toArray==='function'){
    if(!placeCache.has(connector))placeCache.set(connector,Promise.resolve().then(async()=>{
      const records=typeof connector.scanData==='function'?[...connector.scanData()]:await connector.toArray();
      return records.map(placeRecord).filter(Boolean);
    }).catch(error=>{placeCache.delete(connector);throw error;}));
    return placeCache.get(connector);
  }
  return null;
}
const activeAt = (place,date) => !date||place.periodKnown&&place.creationDate<=date&&place.expirationDate>=date;
const uniquePlaces = records => [...new Map(records.map(record=>[`${record.belfioreCode}|${normalPlace(record.name)}|${record.province}|${record.creationDate}|${record.expirationDate}`,record])).values()];
const uniqueIdentity = records => [...new Map(records.map(record=>[`${record.belfioreCode}|${normalPlace(record.name)}|${record.province}`,record])).values()];
export async function lookupPlaces(query,{adapter,parser,birthDate='',province=''}={}) {
  const data=await allPlaces(adapter||parser);
  if(!data)return {places:[],all:[],errors:[err('place-data','Archivio dei luoghi non disponibile. Verificare manualmente il luogo.','natoA')]};
  const search=normalPlace(query),code=/^[A-Z]\d{3}$/.test(search),pr=String(province??'').trim().toUpperCase();
  const all=uniquePlaces(data.filter(place=>(code?place.belfioreCode===search:normalPlace(place.name)===search)&&(!pr||pr===place.province)));
  const date=birthDate?normalizeBirthDate(birthDate):'';
  return {places:all.filter(place=>activeAt(place,date)),all,errors:[]};
}
export async function decodeFiscalCode(raw,options={}) {
  const checked=validateFiscalCode(raw),out={...checked,derived:{},warnings:[],officiallyVerified:false,date:null,place:null};
  if(!checked.valid||checked.kind!=='individual')return out;
  const {now=new Date(),existingDate='',selectedDate=''}=options,{birth}=checked;
  const matches=date=>Boolean(date&&Number(date.slice(0,4))%100===birth.year2&&Number(date.slice(5,7))===birth.month&&Number(date.slice(8,10))===birth.day&&date<=today(now));
  const existing=normalizeBirthDate(existingDate),selected=normalizeBirthDate(selectedDate),candidates=deriveBirthDateCandidates(birth,options);
  let date='',source='unresolved';
  if(selectedDate){if(matches(selected)){date=selected;source='chosen';}else out.errors.push(err('date-selection','La data scelta non corrisponde al codice fiscale.','natoIl'));}
  else if(existingDate){if(matches(existing)){date=existing;source='existing';}else out.errors.push(err('date-conflict','La data di nascita inserita non corrisponde al codice fiscale.','natoIl'));}
  if(date&&!candidates.includes(date))candidates.push(date);
  out.date={...birth,candidates:candidates.sort(),selected:date,source,ambiguous:!date,partial:`${pad(birth.day)}/${pad(birth.month)}/••${pad(birth.year2)}`};
  out.derived.sesso=birth.sex;if(date)out.derived.natoIl=date;
  if(!date)out.warnings.push(err('century',`Il codice indica ${out.date.partial}: confermare l'anno completo di nascita.`, 'natoIl'));
  const placeCode=checked.baseBody.slice(11,15),found=await lookupPlaces(placeCode,{...options,birthDate:date}),candidatesByIdentity=uniqueIdentity(found.places);
  const existingPlace=normalPlace(options.existingPlace);
  const matchingExisting=candidatesByIdentity.filter(place=>normalPlace(place.name)===existingPlace&&(!options.existingProvince||place.province===String(options.existingProvince).toUpperCase()));
  out.errors.push(...found.errors);
  let place=null;
  if(!found.errors.length){
    if(!found.all.length)out.errors.push(err('place-unknown',`Codice del luogo ${placeCode} non trovato nell'archivio locale.`, 'natoA'));
    else if(date&&!found.places.length)out.errors.push(err('place-date','Il luogo codificato non risulta valido alla data di nascita scelta. Verificare il documento e l’archivio storico.','natoA'));
    else if(matchingExisting.length===1)place=matchingExisting[0];
    else if(candidatesByIdentity.length===1)place=candidatesByIdentity[0];
    else out.warnings.push(err('place-ambiguous','Il codice del luogo ha più denominazioni storiche: completare la data e verificare il luogo.','natoA'));
  }
  out.place={code:placeCode,candidates:found.places,selected:place};
  if(place){out.derived.natoA=place.name;out.derived.prov=place.province;
    if(!date)out.warnings.push(err('place-century','Il periodo del luogo va verificato dopo la conferma dell’anno di nascita.','natoA'));
  }
  return out;
}
export async function computeFiscalCode(person,options={}) {
  const out={code:'',theoretical:true,officiallyVerified:false,complete:false,errors:[],place:null};
  const {nome,cognome,sesso,natoIl,natoA}=person||{};
  if([nome,cognome,sesso,natoIl,natoA].some(value=>!String(value??'').trim()))return out;
  out.complete=true;
  const surname=encodeSurname(cognome),given=encodeGivenName(nome),date=normalizeBirthDate(natoIl),sex=String(sesso).toUpperCase();
  if(!surname||!given)out.errors.push(err('name','Nome o cognome contiene caratteri non convertibili automaticamente. Confrontare il codice attribuito.','nome'));
  if(!['M','F'].includes(sex))out.errors.push(err('sex','Per il calcolo serve il sesso anagrafico codificato M o F.','sesso'));
  if(!date||date>today(options.now||new Date()))out.errors.push(err('date','Inserire una data di nascita completa, valida e non futura.','natoIl'));
  if(out.errors.length)return out;
  const explicitCode=String(person.belfioreCode||'').trim();
  const found=await lookupPlaces(explicitCode||natoA,{...options,birthDate:date,province:explicitCode?'':person.prov});out.errors.push(...found.errors);
  if(explicitCode&&found.places.length&&!found.places.some(place=>(normalPlace(natoA)===place.belfioreCode||normalPlace(natoA)===normalPlace(place.name))&&(!person.prov||String(person.prov).toUpperCase()===place.province)))out.errors.push(err('place-conflict','Il codice catastale scelto non corrisponde al luogo o alla provincia inseriti.','natoA'));
  const codes=[...new Set(found.places.map(place=>place.belfioreCode))];
  if(!found.errors.length){
    if(!found.all.length)out.errors.push(err('place-unknown','Luogo non trovato: usare la denominazione dell’archivio o il codice catastale documentato.','natoA'));
    else if(!found.places.length)out.errors.push(err('place-date','Luogo non valido alla data di nascita o periodo storico non disponibile. Verificare il luogo.','natoA'));
    else if(codes.length!==1)out.errors.push(err('place-ambiguous','Esistono più luoghi con questa denominazione: indicare la provincia o scegliere il codice catastale.','natoA'));
  }
  if(out.errors.length)return out;
  out.place=found.places[0];
  const [year,month,day]=date.split('-').map(Number),body=surname+given+pad(year%100)+MONTHS[month-1]+pad(day+(sex==='F'?40:0))+codes[0];
  out.code=body+checksum(body);return out;
}
function sameField(field,left,right) {
  if(field==='cf')return normalizeFiscalCode(left)===normalizeFiscalCode(right);
  if(field==='natoIl')return normalizeBirthDate(left)===normalizeBirthDate(right);
  if(field==='natoA')return normalPlace(left)===normalPlace(right);
  return String(left??'').trim().toUpperCase()===String(right??'').trim().toUpperCase();
}
export function planDerivedChanges(person,derived,source='cf',code='') {
  const plan={id:person.id,patch:{},fields:{},conflicts:[],source,code};
  for(const [field,proposed] of Object.entries(derived||{})){
    if(!DERIVABLE.has(field)||!String(proposed??'').trim())continue;
    const current=person[field]??'',prior=person._fiscalCode?.fields?.[field],tracked=prior&&sameField(field,current,prior.value);
    if(sameField(field,current,proposed))continue;
    if(!String(current).trim()||tracked){plan.patch[field]=proposed;plan.fields[field]={source,code,value:proposed,officiallyVerified:false};}
    else plan.conflicts.push({field,current,proposed,source,code});
  }
  return plan;
}
export function applyDerivedChanges(person,plan) {
  if(!Object.keys(plan.patch||{}).length)return person;
  if(plan.id!==person.id)throw new Error('La proposta appartiene a un’altra persona.');
  return {...person,...plan.patch,_fiscalCode:{...person._fiscalCode,fields:{...person._fiscalCode?.fields,...plan.fields}}};
}
function clearStaleFacts(person,code) {
  let output=person,fields={...person._fiscalCode?.fields},changed=false;
  for(const [field,prior] of Object.entries(fields)){
    if(!sameField(field,person[field],prior.value)){delete fields[field];changed=true;continue;}
    if(prior.source==='cf'&&normalizeFiscalCode(prior.code)!==code){output={...output,[field]:''};delete fields[field];changed=true;}
  }
  return changed?{...output,_fiscalCode:{...output._fiscalCode,fields}}:output;
}
export async function synchronizeFiscalCode(person,options={}) {
  const code=normalizeFiscalCode(person.cf),localCheck=validateFiscalCode(code);
  if(code && (!localCheck.valid || (code.length!==16&&localCheck.kind!=='numeric'))){
   const normalized=String(person.cf??'')===code?person:{...person,cf:code};
   return {person:normalized,changed:normalized!==person,decoded:localCheck,computed:null,conflicts:[],errors:code.length>=16||/^\d{11}$/.test(code)?localCheck.errors:[]};
  }
  let output=clearStaleFacts(person,code);if(String(person.cf??'')!==code)output={...output,cf:code};let decoded=null,computed=null,conflicts=[];
  const cfPrior=output._fiscalCode?.fields?.cf,generated=cfPrior?.source==='theoretical'&&sameField('cf',output.cf,cfPrior.value);
  // An entered CF drives reverse decoding; a generated CF is refreshed from manual birth data.
  if(code&&!generated){
    decoded=await decodeFiscalCode(output.cf,{...options,existingDate:output.natoIl,existingPlace:output.natoA,existingProvince:output.prov});
    if(decoded.valid&&decoded.kind==='individual'){
      const plan=planDerivedChanges(output,decoded.derived,'cf',code);output=applyDerivedChanges(output,plan);conflicts.push(...plan.conflicts);
      const confirmed=output._fiscalCode?.names;
      const legacyNames=options.legacyFullName&&confirmed?.confirmed&&confirmed.displayValue===output.nome?confirmed:null;
      if(!options.legacyFullName||legacyNames){
        for(const [field,encoder,segment] of [['cognome',encodeSurname,code.slice(0,3)],['nome',encodeGivenName,code.slice(3,6)]]){
          if(String((legacyNames||output)[field]??'').trim()&&encoder((legacyNames||output)[field])!==segment)conflicts.push({field,current:output[field],proposed:null,source:'cf',code,message:`${field==='nome'?'Nome':'Cognome'} non coerente con la sigla ${segment} del codice fiscale. Non è ricavabile dal codice.`});
        }
      }
    }
  }
  const confirmedNames=output._fiscalCode?.names;
  const splitConfirmed=options.legacyFullName&&confirmedNames?.confirmed&&confirmedNames.displayValue===output.nome;
  if(!options.legacyFullName||splitConfirmed){
    computed=await computeFiscalCode(splitConfirmed?{...output,nome:confirmedNames.nome,cognome:confirmedNames.cognome}:output,options);
    if(computed.code){
      const checked=validateFiscalCode(output.cf),equivalent=checked.valid&&checked.kind==='individual'&&checked.baseBody===computed.code.slice(0,15);
      if(!equivalent&&(!code||generated))output=applyDerivedChanges(output,planDerivedChanges(output,{cf:computed.code},'theoretical',computed.code));
      else if(!equivalent&&code)conflicts.push({field:'cf',current:output.cf,proposed:computed.code,source:'theoretical',code:computed.code});
    }else if(generated){
      const fields={...output._fiscalCode?.fields};delete fields.cf;output={...output,cf:'',_fiscalCode:{...output._fiscalCode,fields}};
    }
  }else if(generated){const fields={...output._fiscalCode?.fields};delete fields.cf;output={...output,cf:'',_fiscalCode:{...output._fiscalCode,fields}};}
  conflicts=[...new Map(conflicts.map(conflict=>[`${conflict.field}|${conflict.proposed}`,conflict])).values()];
  return {person:output,changed:JSON.stringify(output)!==JSON.stringify(person),decoded,computed,conflicts,errors:[...decoded?.errors||[],...computed?.errors||[]]};
}
