"""Replace only the purchase proposal in the current, verified release build."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'dist'
source = (OUTPUT / 'assets/app.js').read_text()

def once(old, new):
    global source
    assert source.count(old) == 1, f'Purchase integration mismatch: {old}'
    source = source.replace(old, new, 1)

once('function Lc(){', 'const ExactPurchase=createPurchaseTemplate(_,wr,lr,useContractDraft);function Lc(){')
once('path:`/purchase-proposal`,element:(0,P.jsx)(Or,{})', 'path:`/purchase-proposal`,element:(0,P.jsx)(ExactPurchase,{closeSidebar:t})')
# The same layout creates a print iframe. Convert fixed fields before its normal converter.
once(':convertPrintableFields(e),m=()=>', ':(convertPurchaseFields(e),convertPrintableFields(e)),m=()=>')
source = 'import {createPurchaseTemplate,convertPurchaseFields} from "./PurchaseTemplate.js";\n' + source
(OUTPUT / 'assets/app.js').write_text(source)
shutil.copyfile(ROOT / 'src/purchase/PurchaseTemplate.js', OUTPUT / 'assets/PurchaseTemplate.js')
shutil.copyfile(ROOT / 'src/purchase/purchase-template.css', OUTPUT / 'assets/purchase-template.css')
shutil.copytree(ROOT / 'public/purchase-template', OUTPUT / 'purchase-template', dirs_exist_ok=True)
html = (OUTPUT / 'index.html').read_text().replace('</head>', '<link rel="stylesheet" href="/assets/purchase-template.css"></head>')
(OUTPUT / 'index.html').write_text(html)
manifest = json.loads((ROOT / 'release-manifest.json').read_text())
manifest['files'] = {str(p.relative_to(OUTPUT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUTPUT.rglob('*')) if p.is_file()}
(ROOT / 'release-manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
print('Integrated exact two-page /purchase-proposal')
