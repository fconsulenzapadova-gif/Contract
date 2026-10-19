import {createContractRecordsUI} from './ContractRecordsUI.js';
const cache=new WeakMap();
export function recordsUI(React){if(!cache.has(React))cache.set(React,createContractRecordsUI(React));return cache.get(React);}
