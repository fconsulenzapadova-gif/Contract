import {useContractDraft} from './ContractDraft.js';
import {migrateParties} from './ContractRecords.js';
import {physicalIdentityBlocks,personSignatureBlocks} from './ProposalRecords.js';
export function useOptionalPhysicalRecords(React,slot,label,sign=false){
 const [people,setPeople]=useContractDraft(React,slot,[],value=>Array.isArray(value)&&value.length?migrateParties(value):[]);
 return {people,blocks:[...physicalIdentityBlocks(React,people,setPeople,label,slot,0),...(sign?personSignatureBlocks(React,people,label,slot+'-sign'):[])]};
}
