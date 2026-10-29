# Compact tokens
Paper #ece9e2; paper-soft #f7f5ef; ink #12130f; graphite #666861; line #d8d4ca; blue #b3e5fc; sage #7d8777; clay #b55d42. Checked public CSS 2026-10-28. Avenir/Minion local with Arial/Georgia fallback; no proprietary redistribution.
```css
/* Identity tokens checked against the public GEMÜT website on 2026-10-28.
   Proprietary fonts are looked up locally; no unlicensed files are redistributed. */
:root {
 --gemut-paper:#ece9e2; --gemut-paper-soft:#f7f5ef; --gemut-ink:#12130f;
 --gemut-graphite:#666861; --gemut-line:#d8d4ca; --gemut-blue:#b3e5fc;
 --gemut-sage:#7d8777; --gemut-clay:#b55d42;
 --background:var(--gemut-paper); --surface:var(--gemut-paper-soft); --text-primary:var(--gemut-ink);
 --text-secondary:#50524b; --primary:#334b56; --primary-light:var(--gemut-blue); --border:var(--gemut-line);
 --font-sans:'Avenir Next',Avenir,'Segoe UI',Arial,sans-serif;
 --font-display:'Minion Variable Concept','Minion Pro',Georgia,serif;
}
body { font-family:var(--font-sans)!important; color:var(--gemut-ink); background:var(--gemut-paper); }
button,input,textarea,select { font-family:inherit; }
h1,h2,h3 { letter-spacing:-.025em; }
:focus-visible { outline:3px solid #334b56!important; outline-offset:3px; }
.btn,.contract-control-btn,.preview-zoom-btn { border-radius:5px; min-height:36px; }
.btn-primary { background:#334b56!important; color:#fff!important; border-color:#334b56; }
.btn-primary:hover { background:#203943!important; }
.nav-item { min-height:42px; color:var(--gemut-ink); border-radius:5px; }
.nav-item.active { background:var(--gemut-blue)!important; color:var(--gemut-ink)!important; box-shadow:none; }
.contract-editor-tools { width:min(760px,100%); gap:8px; }
.contract-editor-tools summary { padding:4px 0; }
.contract-control-btn { padding:6px 10px; border:1px solid #b2afa5; background:#fff; color:var(--gemut-ink); cursor:pointer; }
.contract-control-btn:disabled { opacity:.6; cursor:default; }
.document-preview-container { background:var(--gemut-paper)!important; }
.contract-editor-tools [role=alert] { color:#8c3528; }
input:not(.purchase-template-field):focus,textarea:focus,select:focus { outline-color:#334b56; }
@media(max-width:760px){
 .contract-editor-tools { font-size:13px; }
 .contract-draft-tools { align-items:stretch; }
 .contract-control-btn,.contract-editor-tools button { min-height:40px; }
 .preview-toolbar { flex-wrap:wrap; }
 .cf-assistant { max-width:100%; overflow-wrap:anywhere; }
 .contract-editor-tools details[open] { max-height:55vh; }
}
@media(prefers-reduced-motion:reduce){ *,*::before,*::after { scroll-behavior:auto!important; transition:none!important; animation:none!important; } }
@media print { body { background:#fff!important; } }

```