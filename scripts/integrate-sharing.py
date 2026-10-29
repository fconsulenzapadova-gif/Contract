"""Add one native route to the verified production app without rewriting its models."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'production/dist'
OUTPUT = ROOT / 'dist'
shutil.copytree(BASE, OUTPUT, dirs_exist_ok=True)
source = (BASE / 'assets/app.js').read_text()
manifest=json.loads((BASE/'build-manifest.json').read_text())
assert manifest['vendorSha256']=='0c058e87134321a34edda49b190d84b3855d37369dc5bc66a6b4fd52cf84ffce', 'Unexpected vendor provenance'
expected=manifest['appSha256']
assert hashlib.sha256((BASE / 'assets/app.js').read_bytes()).hexdigest() == expected, 'Production baseline has changed'

def once(old, new):
    global source
    assert source.count(old) == 1, f'Expected one integration point: {old}'
    source = source.replace(old, new, 1)

once('function Lc(){', 'const PropertySharing=createPropertySharing(_,wr,lr,useContractDraft,installNativePrint);function Lc(){')
once('path:`/visit-sheet`,element:', 'path:`/property-sharing`,element:(0,P.jsx)(PropertySharing,{closeSidebar:t})}),(0,P.jsx)(zt,{path:`/visit-sheet`,element:')
once('(0,P.jsxs)(Mn,{to:`/visit-sheet`,', '(0,P.jsxs)(Mn,{to:`/property-sharing`,className:({isActive:e})=>`nav-item ${e?`active`:``}`,children:[(0,P.jsx)(lr,{size:18}),(0,P.jsx)(`span`,{children:`Condivisione immobiliare`})]}),(0,P.jsxs)(Mn,{to:`/visit-sheet`,')
once('{title:`Scheda visita`,', '{title:`Scheda di condivisione immobiliare`,description:`Registra informazioni e materiali condivisi via email, WhatsApp, link o videochiamata, anche senza visita.`,icon:(0,P.jsx)(lr,{size:32}),path:`/property-sharing`,color:`text-primary`},{title:`Scheda visita`,')
# A closed initial mobile sidebar leaves room for the dashboard's new card.
once('let[e,t]=(0,_.useState)(!0);return', 'let[e,t]=(0,_.useState)(window.innerWidth>760);return')
once('children:`Compila direttamente sul documento`', 'children:window.location.pathname==="/property-sharing"?`Compila i campi e controlla l’anteprima`:`Compila direttamente sul documento`')
source = 'import {createPropertySharing} from "./PropertySharing.js";\nimport {installNativePrint} from "./NativePrint.js";\n' + source
(OUTPUT / 'assets/app.js').write_text(source)
html = (OUTPUT / 'index.html').read_text().replace('<link rel="stylesheet" href="/assets/app.css">', '<link rel="stylesheet" href="/assets/app.css"><link rel="stylesheet" href="/assets/PropertySharing.css">')
(OUTPUT / 'index.html').write_text(html)
files = {str(file.relative_to(OUTPUT)): hashlib.sha256(file.read_bytes()).hexdigest() for file in sorted(OUTPUT.rglob('*')) if file.is_file()}
unchanged = [name for name in files if (BASE/name).is_file() and hashlib.sha256((BASE/name).read_bytes()).hexdigest() == files[name]]
(ROOT / 'release-manifest.json').write_text(json.dumps({'baselineSha256': expected, 'unchangedBaselineFiles':len(unchanged), 'files':files}, indent=2)+'\n')
print(f'Integrated /property-sharing; {len(unchanged)} existing production files unchanged')
