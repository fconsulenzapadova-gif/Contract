"""Reviewed integrations into the selected readable bundle revision; vendor remains immutable."""
from pathlib import Path
import re

def integrate(root: Path, source: str):
    def once(old,new):
        nonlocal source
        assert source.count(old)==1, f'Contract integration mismatch: {old[:90]}'
        source=source.replace(old,new,1)
    # Replace five faithfully extracted contract templates, preserving distinct clauses.
    following={'ac':'oc','oc':'sc','sc':'cc','cc':'lc','uc':'dc'}
    for name,file in [('ac','lease-students'),('oc','lease-4-4'),('sc','lease-4-4-cedolare'),('cc','lease-concordato'),('uc','lease-transitorio')]:
        start=source.index(name+'=()=>{')
        # Locate the next top-level declaration recorded from the immutable snapshot.
        if name=='cc': end=source.index(',lc=',start)
        elif name=='uc': end=source.index(',dc=',start)
        else:end=source.index(','+following[name]+'=',start)
        replacement=(root/'src/templates'/f'{file}.fragment.js').read_text().split('\n',1)[1].strip().rstrip(';')
        source=source[:start]+replacement+source[end:]
    start=source.index('rc=({keyPrefix:');end=source.index(',ic=',start)
    source=source[:start]+'rc=props=>recordsUI(_).introBlocks(props)'+source[end:]
    start=source.index('ic=()=>');end=start+re.search(r',\s*ac\s*=',source[start:]).start()
    source=source[:start]+'ic=()=>createParty()'+source[end:]
    start=source.index('Dr=({blocks:');end=source.index(',Or=',start)
    source=source[:start]+'Dr=createAdaptiveDocument(_,brandDocumentHeader,useReviewedBlocks)'+source[end:]
    # Save independent model states, not layout/zoom/dialog state.
    for name in ['Or','Gs']:
        needle=name+'=()=>{let[e,t]=(0,_.useState)({'
        once(needle,name+'=()=>{let[e,t]=useContractDraft(_,"document",{')
    once('[n,r]=(0,_.useState)(()=>Array.from({length:Bs},()=>Hs()))','[n,r]=useContractDraft(_,"proposers",()=>Array.from({length:Bs},()=>Hs()),migrateParties)')
    once('[i,a]=(0,_.useState)(!0),o=(0,_.useRef)', '[i,a]=useContractDraft(_,"companyPresent",!0),o=(0,_.useRef)')
    source=source.replace('n.toUpperCase().replace(/[^A-Z0-9]/g,``).slice(0,16)','normalizeFiscalCode(n)')
    # Legacy proposal tax effects overwrite manual facts and guess century. Shared assistant handles them.
    start=source.index('(0,_.useEffect)(()=>{let e=async(e,t)=>{let n=d(t.birthDate)')
    end=source.index(';let se=',start)
    source=source[:start]+source[end+1:]
    # Repeat people and units also in the two proposals, keeping their clauses distinct.
    once('Or=()=>{let[e,t]=useContractDraft(_,"document",{', 'Or=()=>{let[e,t]=useContractDraft(_,"document",{')
    for component,following in [('Or','Pr'),('Gs','Ks')]:
        start=source.index(component+'=()=>{')
        if component=='Or': end=source.index(',Pr=',start)
        else: end=source.index(',Ks=',start)
        part=source[start:end]
        if component=='Or':
            assert '}),n={' in part
            part=part.replace('}),n={','}),proposalRecords=useProposalRecords(_,e),n={',1)
            assert 'Dr,{blocks:[' in part and '],pageStyle:u,pageHeader:m' in part
            part=part.replace('Dr,{blocks:[','Dr,{blocks:mergeProposalBlocks(_, [',1).replace('],pageStyle:u,pageHeader:m','],proposalRecords),pageStyle:u,pageHeader:m',1)
        else:
            assert '}),[n,r]=' in part
            part=part.replace('}),[n,r]=','}),proposalRecords=useProposalRecords(_,e),[n,r]=',1)
            part=part.replace('blocks:le,','blocks:mergeProposalBlocks(_,le,proposalRecords,n,r),',1)
            part=part.replace('"data-identity-field":t,value:n[e]?.','"data-identity-field":t,"data-record-id":n[e]?.id,value:n[e]?.')
            # Capture the stable person id in callbacks. An identity import can finish
            # after a row has been removed or reordered; its old index is then unsafe.
            old_update='n.map((n,r)=>r===e?{...n,[t]:a}:n)'
            assert part.count(old_update)==1
            part=part.replace(old_update,'n.map((n,r)=>(typeof e===`string`?n.id===e:r===e)?{...n,[t]:a}:n)')
            for input_type in ['i','`date`']:
                old_callback=f'onChange:n=>h(e,t,n.target.value,{input_type},n.identityImport===!0)'
                assert part.count(old_callback)==1
                part=part.replace(old_callback,f'onChange:event=>h(n[e]?.id??e,t,event.target.value,{input_type},event.identityImport===!0)')
            part=part.replace('children:t===0?`Il sottoscritto`:`e`','children:partyGrammar(n[t]).prefix')
            part=part.replace('children:`nato/a a`','children:partyGrammar(n[t]).born+` a`')
            part=part.replace('r(e=>e.length>=zs?e:[...e,Hs()])','r(e=>[...e,Hs()])')
            part=part.replace('disabled:n.length>=zs','disabled:!1')
            part=part.replace('`Dati del ${Vs[t]} proponente`','`Dati del proponente ${t+1}`')
            assert 'f=e=>{let t=d(e);return t?Ri(t,`yyyy-MM-dd`):``}' in part
            part=part.replace('f=e=>{let t=d(e);return t?Ri(t,`yyyy-MM-dd`):``}','f=e=>normalizeBirthDate(e)')
        source=source[:start]+part+source[end:]
    # Shared header exposes record controls outside the A4 document and the fiscal assistant.
    once('i=identityHeader(_,n,i);','i=withSectionNavigation(_,toolsHeader(_,n,identityHeader(_,n,i),Is));')
    # Preserve the shared preview's refs/actions while putting its UI in side columns.
    once('wr=({title:e,icon:t,preview:n,clientName:r,headerAside:i})=>{',
         'wr=({title:e,icon:t,preview:n,clientName:r,headerAside:i,editorColumn})=>{')
    start=source.index('wr=({title:');end=source.index(',Tr=38',start)
    layout=source[start:end]
    marker='return(0,P.jsxs)(`div`,{className:`flex flex-col h-full w-full bg-background'
    assert layout.count(marker)==1 and layout.endswith('})}')
    layout=layout.replace(marker,'return documentColumns(_,(0,P.jsxs)(`div`,{className:`flex flex-col h-full w-full bg-background',1)
    source=source[:start]+layout[:-1]+',editorColumn)}'+source[end:]
    once('function Lc(){let[e,t]=(0,_.useState)(!0);',
         'function Lc(){return columnShell(_,useLegacyContractShell());}function useLegacyContractShell(){let[e,t]=(0,_.useState)(()=>innerWidth>1100);')
    once('c(!0),await new Promise(e=>setTimeout(e,300));','c(!0),await prepareDocument(a.current);')
    # A single shared local archive is reachable from the dashboard too.
    once('function Lc(){','const DashboardArchive=createArchiveTools(_),Dashboard=()=>_.createElement(_.Fragment,null,_.createElement(DashboardArchive),_.createElement(Ic));function Lc(){')
    once('path:`/`,element:(0,P.jsx)(Ic,{})','path:`/`,element:(0,P.jsx)(Dashboard,{})')
    once("Seleziona un tipo di contratto per iniziare. Potrai compilare i dati a sinistra e visualizzarne un'anteprima impaginata a destra, pronta per il salvataggio o il download in PDF.","Crea un documento o riprendi una bozza dall’archivio locale. I dati restano in questo browser: esporta una copia per conservarli.")
    once('(0,P.jsx)(`div`,{className:`logo-icon`,children:(0,P.jsx)(ur,{size:20})})','(0,P.jsx)(`img`,{src:`/logo-gemut-2026.png`,alt:`GEMÜT`,className:`contrax-app-logo`})')
    # Accessible names for all fixed Allegato B slots, including its checkboxes.
    assert source.count('name:e.name,')==2, 'Allegato field naming integration changed'
    source=source.replace('name:e.name,','name:e.name,"aria-label":fieldLabel(e.name),')
    once('style:t,"aria-pressed":r,children:r?`X`:``','style:t,"aria-pressed":r,"aria-label":fieldLabel(e.name),children:r?`X`:``')
    # Bounded shared print orchestration; original field converters remain route-specific.
    start=source.index('g=async()=>{if(a.current){c(!0),await prepareDocument(a.current);')
    end=source.index(';(0,_.useEffect)(()=>{let e=new ResizeObserver',start)
    source=source[:start]+"g=async()=>{if(!a.current||s)return;c(!0);try{await printDocument(a.current,{filename:m(),convert:p})}catch(error){alert(error.message||`Impossibile preparare il PDF. Riprova.`)}finally{c(!1)}}"+source[end:]
    once('[n,r]=(0,_.useState)(()=>Object.fromEntries(e.map(e=>[e.name,``])))','[n,r]=useContractDraft(_,"allegatoFields",()=>Object.fromEntries(e.map(e=>[e.name,``])))')
    once('[i,a]=(0,_.useState)(()=>Object.fromEntries(t.map(e=>[e.name,!1])))','[i,a]=useContractDraft(_,"allegatoChecks",()=>Object.fromEntries(t.map(e=>[e.name,!1])))')
    # Keep the old converter byte-for-byte for Allegato B, which has its own overlay geometry.
    start=source.index('p=e=>{e.querySelectorAll(`.pdf-hide`)');end=source.index('},m=()=>',start)+1
    old=source[start:end]
    original=old[len('p='):]
    source=source[:start]+'p=e=>e.querySelector(`.allegato-b-page`)?('+original+')(e):convertPrintableFields(e)'+source[end:]
    imports='''import {columnShell,documentColumns} from "./ColumnLayout.js";
import {withSectionNavigation} from "./EditorNavigation.js";
import {createArchiveTools} from "./ContractArchiveUI.js";
import {fieldLabel} from "./AccessibleFields.js";
import {printDocument} from "./SharedPrint.js";
import {useProposalRecords,mergeProposalBlocks} from "./ProposalRecords.js";
import {partyGrammar} from "./ContractRecords.js";
import {recordsUI} from "./ContractGlue.js";
import {createParty,createUnit,migrateParties,migrateStudentParties,migrateUnits,updateRecord,removeRecord,moveRecord} from "./ContractRecords.js";
import {normalizeUnitLinks,usePropertyUnits} from "./PropertyUnits.js";
import {useContractDraft} from "./ContractDraft.js";
import {createAdaptiveDocument} from "./AdaptiveDocument.js";
import {toolsHeader} from "./ContractEditorTools.js";
import {normalizeFiscalCode,normalizeBirthDate} from "./FiscalCode.js";
import {prepareDocument,convertPrintableFields} from "./DocumentTypography.js";
'''
    return imports+source
