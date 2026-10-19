import {createUnit,migrateUnits,updateRecord,removeRecord,moveRecord} from './ContractRecords.js';
import {useContractDraft} from './ContractDraft.js';
export function normalizeUnitLinks(input){
 const units=migrateUnits(input),principals=new Set(units.filter(u=>u.tipo==='principale').map(u=>u.id));
 return units.map(u=>u.mainUnitId&&!principals.has(u.mainUnitId)?{...u,mainUnitId:''}:u);
}
export function migrateModelUnits(data={},model=''){
 if(Array.isArray(data.units))return normalizeUnitLinks(data.units);
 if(model.includes('assign'))return [createUnit({comune:data.comune||'',via:data.indirizzo||'',descrizione:data.pertinenze||'',catastoLegacy:data.catasto||''})];
 if(model==='/lease-proposal'){
  const first=createUnit({via:data.immUbicazione||'',descrizione:data.immComposizione||'',foglio:data.foglio||'',particella:data.part||'',subalterno:data.sub||'',zc:data.zc||'',categoria:data.cat||'',classe:data.classe||'',vani:data.consVani||'',rendita:data.rendita||'',catastoLegacy:data.idCatastali||''});
  const second={tipo:'garage',foglio:data.foglio2||'',particella:data.part2||'',subalterno:data.sub2||'',zc:data.zc2||'',categoria:data.cat2||'',classe:data.classe2||'',vani:data.consVani2||'',rendita:data.rendita2||''};
  return [first,...Object.values(second).slice(1).some(Boolean)?[createUnit(second)]:[]];
 }
 if(model==='/purchase-proposal'){
  const first=createUnit({comune:data.immComune||'',via:data.immVia||'',numero:data.immCivico||'',descrizione:data.immComposizione||'',foglio:data.c1F||'',particella:data.c1M||'',subalterno:data.c1S||'',categoria:data.c1Cat||'',classe:data.c1Cl||'',vani:data.c1Vani||'',mq:data.c1Mq||'',rendita:data.c1Rend||''});
  const second={tipo:'altro',foglio:data.c2F||'',particella:data.c2M||'',subalterno:data.c2S||'',categoria:data.c2Cat||'',classe:data.c2Cl||'',vani:data.c2Vani||'',mq:data.c2Mq||'',rendita:data.c2Rend||''};
  return [first,...Object.values(second).slice(1).some(Boolean)?[createUnit(second)]:[]];
 }
 return normalizeUnitLinks(migrateUnits(data));
}
export function usePropertyUnits(React,data,model=typeof location==='undefined'?'':location.pathname){
 const [units,setUnits]=useContractDraft(React,'units',()=>migrateModelUnits(data,model),normalizeUnitLinks);
 return {units,onUnitChange:(id,field,value)=>setUnits(previous=>updateRecord(previous,id,field,value)),onAddUnit:()=>setUnits(previous=>[...previous,createUnit({tipo:'garage'})]),onRemoveUnit:id=>setUnits(previous=>removeRecord(previous,id)),onMoveUnit:(id,offset)=>setUnits(previous=>moveRecord(previous,id,offset))};
}
