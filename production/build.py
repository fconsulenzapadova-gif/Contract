"""Reproducible, guarded integration into the exact deployed build.

The iCloud TypeScript sources are not available. Keep the deployed app as an
immutable vendor snapshot; integrate reviewed forms and local document reading.
No source files from the original project are overwritten.
"""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'dist'
vendor = ROOT / 'vendor/deployed-app.js'
expected = '0c058e87134321a34edda49b190d84b3855d37369dc5bc66a6b4fd52cf84ffce'
assert hashlib.sha256(vendor.read_bytes()).hexdigest() == expected, 'Unexpected base deployment'
source = vendor.read_text()
patches = json.loads((ROOT / 'src/legal-patches.json').read_text())
# Python indexes Unicode codepoints: patch the UTF-16 code-unit representation.
units = source.encode('utf-16-le')
for patch in sorted(patches, key=lambda p: p['start'], reverse=True):
    a, b = patch['start'] * 2, patch['end'] * 2
    raw = units[a:b].decode('utf-16-le')
    assert raw[0] in ('"', "'", '`') and raw[-1] == raw[0], 'Invalid literal range'
    replacement = json.dumps(patch['replacement'], ensure_ascii=False)
    units = units[:a] + replacement.encode('utf-16-le') + units[b:]
source = units.decode('utf-16-le')
for name, following, factory in [
    ('qs', 'Js', 'createLeaseMediationAssignment(_,wr,Dr,cr)'),
    ('Js', 'Ys', 'createProfessionalDocument(_,wr,Dr,cr,"aml")'),
    ('Ys', 'Zs', 'createProfessionalDocument(_,wr,Dr,cr,"fee")'),
]:
    start = source.index(name + '=()=>{')
    # Each original component is an arrow function ending immediately before
    # the next top-level declaration. Read the boundary from the base snapshot.
    original = (ROOT / 'vendor/components' / (name + '.js')).read_text()
    assert source.count(original) == 1, f'Missing component {name}'
    source = source.replace(original, name + '=' + factory, 1)

start = source.index('Ks=()=>{')
end = source.index(',qs=', start)
assert 'Incarico Professionale di Valorizzazione Immobiliare' in source[start:end]
source = source[:start] + 'Ks=createMediationAssignment(_,wr,Dr,cr)' + source[end:]

def replace_once(old, new):
    global source
    assert source.count(old) == 1, f'Expected exactly one integration point: {old[:90]}'
    source = source.replace(old, new, 1)

# A shared editor header adds local reading outside the printable preview.
replace_once('wr=({title:e,icon:t,preview:n,clientName:r,headerAside:i})=>{',
             'wr=({title:e,icon:t,preview:n,clientName:r,headerAside:i})=>{i=identityHeader(_,n,i);')
# Existing multi-party fields have real callbacks but no field identifiers.
replace_once('Zs=(e,t,n,r,i)=>(0,P.jsx)(`input`,{type:`text`,value:e[n],',
             'Zs=(e,t,n,r,i)=>(0,P.jsx)(`input`,{type:`text`,"data-identity-field":n,value:e[n],')
replace_once('ne=(e,t,r=`120px`,i=`text`)=>(0,P.jsx)(`input`,{type:i,value:n[e]?.[t]??``,',
             'ne=(e,t,r=`120px`,i=`text`)=>(0,P.jsx)(`input`,{type:i,"data-identity-field":t,value:n[e]?.[t]??``,')
replace_once('re=(e,t,r=`110px`)=>(0,P.jsx)(`input`,{type:`date`,value:f(n[e]?.[t]??``),',
             're=(e,t,r=`110px`)=>(0,P.jsx)(`input`,{type:`date`,"data-identity-field":t,value:f(n[e]?.[t]??``),')
# Imported fields must not derive an unconfirmed CF or decode it over other
# reviewed fields. Invalidate calculations that began before the import too.
replace_once('o=(0,_.useRef)({source:null,index:null}),s={qualita:',
             'o=(0,_.useRef)({source:null,index:null}),identityVersion=(0,_.useRef)(0),s={qualita:')
replace_once('h=(e,t,n,i=`text`)=>{', 'h=(e,t,n,i=`text`,identityImport=!1)=>{')
replace_once('t===`natoIl`?a=i===`date`?p(n):u(n):t===`cf`?',
             't===`natoIl`?(a=i===`date`?p(n):u(n),o.current={source:`data`,index:e}):t===`cf`?')
replace_once('o.current={source:`data`,index:e},r(n=>n.map((n,r)=>r===e?{...n,[t]:a}:n))',
             'o.current={source:`data`,index:e},identityImport&&(identityVersion.current++,o.current={source:`identity`,index:e}),r(n=>n.map((n,r)=>r===e?{...n,[t]:a}:n))')
replace_once('onChange:n=>h(e,t,n.target.value,i),',
             'onChange:n=>h(e,t,n.target.value,i,n.identityImport===!0),')
replace_once('onChange:n=>h(e,t,n.target.value,`date`),',
             'onChange:n=>h(e,t,n.target.value,`date`,n.identityImport===!0),')
replace_once('o.current.source!==`cf`&&(n.forEach',
             'o.current.source!==`cf`&&o.current.source!==`identity`&&(n.forEach')
replace_once('let n=d(t.birthDate);if(!(!n||!t.firstName',
             'let n=d(t.birthDate),identityGeneration=identityVersion.current;if(!(!n||!t.firstName')
replace_once('i&&i!==t.currentCf&&r(t=>t.map((t,n)=>n===e?{...t,cf:i}:t))',
             'identityGeneration===identityVersion.current&&i&&i!==t.currentCf&&r(t=>t.map((t,n)=>n===e?{...t,cf:i}:t))')
replace_once('let e=async(e,t)=>{if(t.length===16)try{let n=await Is.parser.cfDecode(t);',
             'let e=async(e,t)=>{let identityGeneration=identityVersion.current;if(t.length===16)try{let n=await Is.parser.cfDecode(t);if(identityGeneration!==identityVersion.current)return;')

replace_once('Dr=({blocks:e,pageStyle:t,pageKeyGroups:n,pageHeader:r,bottomReservePx:i=Tr})=>{',
             'Dr=({blocks:e,pageStyle:t,pageKeyGroups:n,pageHeader:r,bottomReservePx:i=window.location.pathname==="/lease-contract-4-4-cedolare"?0:Tr})=>{e=useReviewedBlocks(_,e);r=brandDocumentHeader(_,r);')
replace_once('children:[r,e.map(e=>(0,P.jsx)(`div`,{className:`a4-flow-block`,children:u.get(e)},e))]',
             'children:[r,e.map(e=>(0,P.jsx)(`div`,{className:`a4-flow-block`,children:u.get(e)},e)),(0,P.jsx)(`footer`,{className:`document-page-number`,children:`${n+1} / ${d.length}`})]')
# Preserve live field values and measure styles only after attaching the clone.
replace_once('let s=n.importNode(a.current,!0);p(s);let c=n.createElement(`div`);c.className=`print-root`,c.appendChild(s),n.body.appendChild(c),await h(n),',
             'let s=n.importNode(a.current,!0);let live=a.current.querySelectorAll(`input,textarea,select`);s.querySelectorAll(`input,textarea,select`).forEach((field,index)=>{field.value=live[index].value;field.checked=live[index].checked});s.querySelectorAll(`.a4-measure-shell`).forEach(node=>node.remove());let c=n.createElement(`div`);c.className=`print-root`,c.appendChild(s),n.body.appendChild(c),await h(n),p(s),await h(n),')
replace_once('children:[(Te.get(t+1)??[]).map(Oe),Ae(t+1),ke(t+1)]',
             'children:[(Te.get(t+1)??[]).map(Oe),Ae(t+1),ke(t+1),(0,P.jsx)(`img`,{src:`/logo.png`,alt:`GEMÜT`,className:`allegato-brand-logo`})]')
# Do not pre-certify property conditions before documents have been checked.
for field, value in [('situazioneCatastale','in_ordine'), ('intestazioneAllineata','allineato'),
                     ('planimetria','conforme'), ('certificatoAgibilita','dotato'),
                     ('situazioneEdilizia','prima_1967'), ('gravami','NULLA'), ('statoImpianti','a_norma')]:
    needle = field + ':`' + value + '`'
    assert needle in source
    source = source.replace(needle, field + ':``')
for old, new in [
    ('Modulo non modificabile ai sensi del D.Lgs 231/07.', 'Dichiarazioni del cliente e sezione riservata alle verifiche del Mediatore.'),
    ('Informativa Antiriciclaggio', 'Dichiarazione antiriciclaggio'),
    ('Dichiarazione Provvigionale', 'Accordo sul compenso'),
    ('Contracts Pro', 'Gemüt · Contratti'),
    ('Provvigione', 'Compenso di mediazione'),
    ('Incarico di Vendita', 'Incarico di mediazione'),
    ('Incarico Vendita', 'Incarico di mediazione'),
    ("Mandato per conferire l'esclusiva per la vendita di un immobile.",
     'Incarico di mediazione immobiliare per la ricerca e la messa in relazione di potenziali acquirenti.'),
]:
    assert old in source, f'Missing label: {old}'
    source = source.replace(old, new)
source = source.replace('/logo.png', '/logo-gemut-2026.png')
replace_once('function Lc(){', 'const VisitSheet=createVisitSheet(_,wr,lr,Dr);function Lc(){')
replace_once('path:`/aml`,element:(0,P.jsx)(Js,{})',
             'path:`/visit-sheet`,element:(0,P.jsx)(VisitSheet,{})}),(0,P.jsx)(zt,{path:`/aml`,element:(0,P.jsx)(Js,{})')
replace_once('(0,P.jsxs)(Mn,{to:`/aml`,',
             '(0,P.jsxs)(Mn,{to:`/visit-sheet`,className:({isActive:e})=>`nav-item ${e?`active`:``}`,children:[(0,P.jsx)(lr,{size:18}),(0,P.jsx)(`span`,{children:`Scheda visita`})]}),(0,P.jsxs)(Mn,{to:`/aml`,')
replace_once('{title:`Dichiarazione antiriciclaggio`,',
             '{title:`Scheda visita`,description:`Scheda di visita immobiliare e informativa sulla privacy, compilabili e stampabili.`,icon:(0,P.jsx)(lr,{size:32}),path:`/visit-sheet`,color:`text-primary`},{title:`Dichiarazione antiriciclaggio`,')
source = 'import { createVisitSheet } from "./VisitSheet.js";\n' + source
source = 'import { identityHeader } from "./IdentityReader.js";\nimport { useReviewedBlocks } from "./DocumentReview.js";\nimport { createProfessionalDocument } from "./ProfessionalDocuments.js";\nimport { createLeaseMediationAssignment } from "./LeaseMediationAssignment.js";\nimport { createMediationAssignment, brandDocumentHeader } from "./MediationAssignment.js";\n' + source

from contract_integrations import integrate
source=integrate(ROOT,source)

OUTPUT.mkdir(exist_ok=True)
(OUTPUT / 'assets').mkdir(exist_ok=True)
(OUTPUT / 'assets/app.js').write_text(source)
for module in ROOT.glob('src/*.js'):
    (OUTPUT / 'assets' / module.name).write_text(module.read_text().replace('/logo.png', '/logo-gemut-2026.png'))
css = (ROOT / 'vendor/deployed-app.css').read_text()
remote_fonts = '@import "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap";'
assert css.count(remote_fonts) == 1, 'Expected original font import'
css = css.replace(remote_fonts, '@import "/fonts/app-fonts.css";', 1)
(OUTPUT / 'assets/app.css').write_text(css + '\n' + (ROOT / 'src/documents.css').read_text() + '\n' + (ROOT / 'src/identity.css').read_text() + '\n' + (ROOT / 'src/visit-sheet.css').read_text() + '\n' + (ROOT / 'src/contract-layout.css').read_text() + '\n' + (ROOT / 'src/ContractArchive.css').read_text() + '\n' + (ROOT / 'src/GemutTheme.css').read_text() + '\n' + (ROOT / 'src/ColumnLayout.css').read_text())
for item in (ROOT / 'public').iterdir():
    if item.is_dir(): shutil.copytree(item, OUTPUT / item.name, dirs_exist_ok=True)
    else: shutil.copyfile(item, OUTPUT / item.name)
shutil.copyfile(ROOT / 'public/logo.png', OUTPUT / 'logo-gemut-2026.png')
(OUTPUT / 'index.html').write_text('''<!doctype html>
<html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GEMÜT · Contratti</title><link rel="icon" href="/favicon.svg">
<link rel="stylesheet" href="/assets/app.css"><script type="module" src="/assets/app.js"></script>
</head><body><div id="root"></div></body></html>''')
(OUTPUT / 'build-manifest.json').write_text(json.dumps({'vendorSha256':expected,'appSha256':hashlib.sha256((OUTPUT/'assets/app.js').read_bytes()).hexdigest()}))
print(f'Build: {OUTPUT}')
