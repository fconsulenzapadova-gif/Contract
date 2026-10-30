"""Add the two approved closing forms after the unchanged existing integrations."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'dist'
target = OUTPUT / 'assets/app.js'
source = target.read_text()

def once(old, new):
    global source
    assert source.count(old) == 1, f'Closing integration mismatch: {old[:90]}'
    source = source.replace(old, new, 1)

once('function Lc(){', 'const KeyReturn=createClosingDocument(_,wr,Dr,lr,"keys"),PracticeRelease=createClosingDocument(_,wr,Dr,lr,"release");function Lc(){')
once('window.location.pathname==="/property-sharing"?', '["/property-sharing","/key-return","/practice-release"].includes(window.location.pathname)?')
once('path:`/visit-sheet`,element:', 'path:`/key-return`,element:(0,P.jsx)(KeyReturn,{closeSidebar:t})}),(0,P.jsx)(zt,{path:`/practice-release`,element:(0,P.jsx)(PracticeRelease,{closeSidebar:t})}),(0,P.jsx)(zt,{path:`/visit-sheet`,element:')
once('(0,P.jsxs)(Mn,{to:`/visit-sheet`,', '(0,P.jsxs)(Mn,{to:`/key-return`,className:({isActive:e})=>`nav-item ${e?`active`:``}`,children:[(0,P.jsx)(lr,{size:18}),(0,P.jsx)(`span`,{children:`Riconsegna chiavi`})]}),(0,P.jsxs)(Mn,{to:`/practice-release`,className:({isActive:e})=>`nav-item ${e?`active`:``}`,children:[(0,P.jsx)(lr,{size:18}),(0,P.jsx)(`span`,{children:`Liberatoria e chiusura`})]}),(0,P.jsxs)(Mn,{to:`/visit-sheet`,')
once('{title:`Scheda visita`,', '{title:`Riconsegna chiavi`,description:`Verbale di riconsegna delle chiavi da parte del conduttore, con ricevuta e firme.`,icon:(0,P.jsx)(lr,{size:32}),path:`/key-return`,color:`text-primary`},{title:`Liberatoria e chiusura della pratica`,description:`Chiusura di incarichi o proposte non accettate, senza ulteriori richieste economiche GEMÜT.`,icon:(0,P.jsx)(lr,{size:32}),path:`/practice-release`,color:`text-primary`},{title:`Scheda visita`,')
source = 'import {createClosingDocument} from "./ClosingDocuments.js";\n' + source
target.write_text(source)
css = OUTPUT / 'assets/app.css'
css.write_text(css.read_text() + '\n' + (ROOT / 'production/src/closing-documents.css').read_text())
manifest = json.loads((ROOT / 'release-manifest.json').read_text())
manifest['files'] = {str(file.relative_to(OUTPUT)): hashlib.sha256(file.read_bytes()).hexdigest()
                     for file in sorted(OUTPUT.rglob('*')) if file.is_file()}
(ROOT / 'release-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Integrated /key-return and /practice-release')
