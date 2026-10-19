import {adaptDocument,convertPrintableFields} from './DocumentTypography.js';

/** Keep the editable React tree mounted; only a temporary static copy prints. */
export function installNativePrint(root){
 if(!root)return()=>{};
 const doc=root.ownerDocument,win=doc.defaultView;let copy;
 const restore=()=>{copy?.remove();copy=null;doc.body.classList.remove('contract-native-print');};
 const prepare=()=>{
  if(copy)return;
  adaptDocument(root);
  copy=root.cloneNode(true);
  const live=root.querySelectorAll('input,textarea,select');
  copy.querySelectorAll('input,textarea,select').forEach((field,index)=>{field.value=live[index].value;field.checked=live[index].checked;});
  copy.querySelectorAll('.a4-measure-shell').forEach(node=>node.remove());
  copy.classList.add('contract-native-print-copy');
  doc.body.appendChild(copy);
  convertPrintableFields(copy);
  doc.body.classList.add('contract-native-print');
 };
 win.addEventListener('beforeprint',prepare);win.addEventListener('afterprint',restore);
 return()=>{restore();win.removeEventListener('beforeprint',prepare);win.removeEventListener('afterprint',restore);};
}
