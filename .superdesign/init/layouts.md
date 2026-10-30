# Column layout in the served application

The immutable vendor supplies the route state, preview refs, zoom, print actions and menu state. Guarded integrations in `production/contract_integrations.py` pass its elements to `production/src/ColumnLayout.js` and load `production/src/ColumnLayout.css`.

- `columnShell`: navigation column with its own menu toggle; main contains only route content.
- `documentColumns`: tools column (title, zoom, PDF, drafts/archive, identity/CF, section navigation), optional independent compilation column, and full-height preview.
- `src/purchase/PurchaseTemplate.js` and `src/sharing/PropertySharing.tsx` pass `editorColumn` to the shared layout.
- At widths <=1100px a vertical selector chooses tools, compilation or preview. Preview stays measured offscreen when inactive.
- Section navigation reveals preview before deferred scrolling/focus. Incarichi wrappers have a fixed parent height.
- Purchase preview fields are directly editable; only explicit Expand opens a dialog. Print replaces overlong active fields with their continuation reference.

Dashboard and the public logo remain in the same application shell. No top menu/header remains above the document preview.
