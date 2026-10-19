import test from 'node:test';
import assert from 'node:assert/strict';
import {extractIdentity} from '../src/IdentityData.js';
const now=new Date('2026-10-03T12:00:00Z');
const bbox=(x,y,w=200,h=22)=>({x0:x,y0:y,x1:x+w,y1:y+h});
const line=(text,x,y,w=200,words)=>({text,confidence:96,bbox:bbox(x,y,w),...(words?{words}: {})});
const word=(text,x,y,w=150)=>({text,confidence:96,bbox:bbox(x,y,w)});

test('CIE back parent labels and German translations never become holder values',()=>{
 const back=`COGNOME E NOME DEL PADRE E DELLA MADRE O DI CHI NE FA LE VECI / NAME UND VORNAME DES VATERS UND
CODICE FISCALE / STEUERNUMMER / FISCAL CODE
RSSMRA80A01H501U
RESIDENZA / WOHNORT / RESIDENCE
VIA DI PROVA 10 - ROMA`;
 const front=`CARTA DI IDENTITA
COGNOME/NACHNAME/SURNAME
ROSSI
NOME/VORNAME/NAME
MARIO
LUOGO E DATA DI NASCITA
GEBURTSORT / GEBURTSDATUM / PLACE AND DATE OF BIRTH
ROMA 01.01.1980
EMISSIONE/AUSSTELLUNG/ISSUING
02.03.2020
SCADENZA/GULTIG BIS/EXPIRY
01.01.2030
COMUNE DI / GEMEINDE / MUNICIPALITY
ROMA
CA12345AB`;
 const fields=extractIdentity([{text:back,confidence:95},{text:front,confidence:96}],'card',now).fields;
 for(const [key,value] of Object.entries({surname:'ROSSI',givenNames:'MARIO',birthPlace:'ROMA',birthDate:'1980-01-01',taxCode:'RSSMRA80A01H501U',residence:'VIA DI PROVA 10 - ROMA',issueDate:'2020-03-02',expiryDate:'2030-01-01',documentNumber:'CA12345AB',issuer:'COMUNE DI ROMA'}))assert.equal(fields[key].value,value,key);
 assert.equal(fields.surname.page,2);assert.equal(fields.taxCode.page,1);
});
test('birth translations on separate lines are skipped rather than copied as birthplace',()=>{
 const fields=extractIdentity([{text:'LUOGO E DATA DI NASCITA\nGEBURTSORT / GEBURTSDATUM / PLACE AND DATE OF BIRTH\nROMA 01.01.1980',confidence:96}],'card',now).fields;
 assert.equal(fields.birthPlace.value,'ROMA');assert.equal(fields.birthDate.value,'1980-01-01');
});
test('same-row issue and expiry values are selected by column, independently of OCR order',()=>{
 const lines=[line('01.01.2030',920,580),line('02.03.2020',390,580),line('EMISSIONE / ISSUING',390,540,320),line('SCADENZA / EXPIRY',920,540,300)];
 const fields=extractIdentity([{lines,confidence:96,width:1450,height:900}],'card',now).fields;
 assert.equal(fields.issueDate.value,'2020-03-02');assert.equal(fields.expiryDate.value,'2030-01-01');
 assert(fields.issueDate.bbox);assert(fields.expiryDate.bbox);assert.equal(fields.expiryDate.bbox.x0,920);
});
test('merged OCR lines split words into the correct CIE date columns',()=>{
 const lines=[line('EMISSIONE / ISSUING SCADENZA / EXPIRY',390,540,900,[word('EMISSIONE',390,540,140),word('/',540,540,8),word('ISSUING',560,540,100),word('SCADENZA',920,540,130),word('/',1060,540,8),word('EXPIRY',1080,540,90)]),line('02.03.2020 01.01.2030',390,580,750,[word('02.03.2020',390,580,170),word('01.01.2030',920,580,170)])];
 const fields=extractIdentity([{lines,confidence:96,width:1450,height:900}],'card',now).fields;
 assert.equal(fields.issueDate.value,'2020-03-02');assert.equal(fields.expiryDate.value,'2030-01-01');
});
test('unlabelled CIE fiscal code and spaced document number are recovered from their syntax',()=>{
 const fields=extractIdentity([{text:'CA 12345 AB\nRSSMRA80A01H501U',confidence:96}],'card',now).fields;
 assert.equal(fields.documentNumber.value,'CA12345AB');assert.equal(fields.taxCode.value,'RSSMRA80A01H501U');
});
test('a name label cannot consume a neighbouring nationality or signature label',()=>{
 const fields=extractIdentity([{text:'COGNOME / SURNAME\nCITTADINANZA / NATIONALITY\nITALIANA\nFIRMA DEL TITOLARE / SIGNATURE',confidence:97}],'card',now).fields;
 assert.equal(fields.surname.value,'');assert.equal(fields.givenNames.value,'');
});
test('birthplace and birth date retain separate value boxes, excluding each other',()=>{
 const lines=[line('LUOGO E DATA DI NASCITA',400,280,450),line('ROMA (RM) 01.01.1980',400,320,600,[word('ROMA',400,320,100),word('(RM)',515,320,60),word('01.01.1980',800,320,180)])];
 const fields=extractIdentity([{lines,width:1450,height:900}],'card',now).fields;
 assert.equal(fields.birthPlace.value,'ROMA');assert.equal(fields.birthDate.value,'1980-01-01');
 assert.equal(fields.birthPlace.bbox.x1,500);assert.equal(fields.birthDate.bbox.x0,800);
});
test('syntax extraction selects only the fiscal code or card number and their words',()=>{
 const lines=[line('CODICE FISCALE RSSMRA80A01H501U ESTREMI ATTO DI NASCITA',90,300,1200,[word('CODICE',90,300,110),word('FISCALE',210,300,110),word('RSSMRA80A01H501U',340,300,310),word('ESTREMI',760,300,110),word('ATTO',880,300,70),word('DI',965,300,30),word('NASCITA',1010,300,120)]),line('DOCUMENTO DI PROVA CA 12345 AB CAN 123456',90,200,1200,[word('DOCUMENTO',90,200,180),word('DI',280,200,30),word('PROVA',325,200,100),word('CA',750,200,40),word('12345',800,200,100),word('AB',915,200,40),word('CAN',1080,200,60),word('123456',1150,200,100)])];
 const fields=extractIdentity([{lines,width:1450,height:900}],'card',now).fields;
 assert.equal(fields.taxCode.value,'RSSMRA80A01H501U');assert.equal(fields.taxCode.bbox.x0,340);assert.equal(fields.taxCode.bbox.x1,650);
 assert.equal(fields.documentNumber.value,'CA12345AB');assert.equal(fields.documentNumber.bbox.x0,750);assert.equal(fields.documentNumber.bbox.x1,955);
});
test('inline text values end at the following field label',()=>{
 const fields=extractIdentity([{text:'COGNOME: ROSSI NOME: MARIO\nLUOGO E DATA DI NASCITA: ROMA 01.01.1980 CITTADINANZA: ITALIANA\nRILASCIATO DA: COMUNE DI ROMA SCADENZA: 01.01.2030',confidence:96}],'card',now).fields;
 assert.equal(fields.surname.value,'ROSSI');assert.equal(fields.givenNames.value,'MARIO');assert.equal(fields.birthPlace.value,'ROMA');assert.equal(fields.issuer.value,'COMUNE DI ROMA');assert.equal(fields.expiryDate.value,'2030-01-01');
});
test('a valid inline value cannot absorb an unrelated value in the next row',()=>{
 const lines=[line('COGNOME: ROSSI',400,280,300),line('ITALIANA',400,320,150)];
 const fields=extractIdentity([{lines,width:1450,height:900}],'card',now).fields;
 assert.equal(fields.surname.value,'ROSSI');assert.equal(fields.surname.alternatives.length,1);
});
test('a distant document number on the municipality label row is not its value',()=>{
 const lines=[line('COMUNE DI / MUNICIPALITY CA 12345 AB',70,140,1750,[word('COMUNE',70,140,120),word('DI',205,140,35),word('/',250,140,10),word('MUNICIPALITY',275,140,200),word('CA',1530,140,50),word('12345',1590,140,135),word('AB',1740,140,70)]),line('ROMA',70,200,180)];
 const fields=extractIdentity([{lines,width:2000,height:1300}],'card',now).fields;
 assert.equal(fields.issuer.value,'COMUNE DI ROMA');assert.equal(fields.issuer.bbox.x0,70);assert.equal(fields.documentNumber.value,'CA12345AB');
});
test('separate OCR blocks on the same row preserve both birthplace and birth date',()=>{
 const lines=[line('LUOGO E DATA DI NASCITA',340,280,550),line('ROMA (RM)',340,320,240),line('01.01.1980',770,320,200)];
 const fields=extractIdentity([{lines,width:1450,height:900}],'card',now).fields;
 assert.equal(fields.birthPlace.value,'ROMA');assert.equal(fields.birthDate.value,'1980-01-01');assert.equal(fields.birthDate.bbox.x0,770);
});
test('licence field 3 retains the birthplace following its date, with its own box',()=>{
 for(const page of [{text:'3. 01.01.1980 ROMA',confidence:96},{lines:[line('3. 01.01.1980 ROMA',90,200,500,[word('3.',90,200,30),word('01.01.1980',135,200,180),word('ROMA',350,200,110)])],width:1450,height:900}]){
  const fields=extractIdentity([page],'licence',now).fields;
  assert.equal(fields.birthDate.value,'1980-01-01');assert.equal(fields.birthPlace.value,'ROMA');
  if(page.lines){assert.equal(fields.birthPlace.bbox.x0,350);assert.equal(fields.birthDate.bbox.x0,135);}
 }
});
test('an explicitly labelled identity number retains supported non-CIE formats',()=>{
 const fields=extractIdentity([{text:'NUMERO DOCUMENTO: AB1234567',confidence:96}],'card',now).fields;
 assert.equal(fields.documentNumber.value,'AB1234567');
});
test('labelled document numbers retain letter groups separated by OCR spaces',()=>{
 for(const [text,kind,value] of [['NUMERO DOCUMENTO: AB 1234567','card','AB1234567'],['5. RM 1234567 A','licence','RM1234567A'],['DOCUMENT NUMBER: L 898902C3','passport','L898902C3'],['NUMERO DOCUMENTO: AB 123 4567','card','AB1234567'],['NUMERO DOCUMENTO: CA 123 45 AB','card','CA12345AB'],['C A 1 2 3 4 5 A B','card','CA12345AB']]){
  assert.equal(extractIdentity([{text,confidence:96}],kind,now).fields.documentNumber.value,value);
 }
 const page={lines:[line('5. RM 1234567 A',90,200,500,[word('5.',90,200,30),word('RM',140,200,45),word('1234567',200,200,170),word('A',385,200,25)])],width:1450,height:900};
 const field=extractIdentity([page],'licence',now).fields.documentNumber;
 assert.equal(field.value,'RM1234567A');assert.equal(field.bbox.x0,140);assert.equal(field.bbox.x1,410);
});
test('staggered labels in another column cannot block the issue date',()=>{
 for(const expiryY of [600,640]){
  const lines=[line('EMISSIONE / ISSUING',390,540,320),line('SCADENZA / EXPIRY',920,580,300),line('02.03.2020',390,600,200),line('01.01.2030',920,expiryY,200)];
  const fields=extractIdentity([{lines,width:1450,height:900}],'card',now).fields;
  assert.equal(fields.issueDate.value,'2020-03-02');assert.equal(fields.expiryDate.value,'2030-01-01');
  assert.equal(fields.issueDate.bbox.x0,390);assert.equal(fields.expiryDate.bbox.x0,920);
 }
});
