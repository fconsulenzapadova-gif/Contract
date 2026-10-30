import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = process.env.BASE_URL || 'http://localhost:5178';
const out = 'work/qa-inline-columns';
await fs.mkdir(out, {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
const context = await browser.newContext({viewport:{width:1600,height:1000}});
const page = await context.newPage();
const errors = [];
const report={base,inline:false,explicitEditor:false,layouts:[],errors};
const only=process.env.ONLY||'all';
await context.addInitScript(()=>{window.print=()=>{(window.parent.__columnPrints||=[]).push(document.documentElement.outerHTML);window.dispatchEvent(new Event('afterprint'));};});
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(base+'/purchase-proposal', {waitUntil:'networkidle'});
  if (['all','inline'].includes(only)) {
    const seller = page.locator('.purchase-template-field[aria-label="Modifica: Venditore: nome e cognome"]');
    await seller.click();
    assert.equal(await page.locator('dialog[open]').count(), 0, 'Un clic sul campo non deve aprire un editor');
    await seller.fill('Lucia Bianchi');
    const buyer = page.locator('.purchase-template-field[aria-label="Modifica: Proponente: nome e cognome"]');
    await buyer.click();
    await buyer.pressSequentially('Mario Rossi');
    assert.equal(await buyer.inputValue(), 'Mario Rossi');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    assert.equal(await page.locator('.purchase-editor [name="vNome"]').inputValue(), 'Lucia Bianchi');
    await page.reload({waitUntil:'networkidle'});
    await seller.click();
    assert.equal(await seller.inputValue(), 'Lucia Bianchi');
    await page.getByRole('button', {name:'Espandi: Venditore: nome e cognome',exact:true}).click();
    await page.getByRole('dialog').waitFor({state:'visible'});
    assert.equal(await page.getByLabel('Testo integrale del campo', {exact:true}).inputValue(), 'Lucia Bianchi');
    await page.getByRole('button', {name:'Chiudi editor',exact:true}).click();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    const note=page.locator('.purchase-template-field[aria-label="Modifica: Note"]');
    const text=('Paragrafo città e caratteri integri.\n\n'+'Testo lungo '.repeat(20)+'\n').repeat(28)+'ULTIMA_RIGA_INLINE';
    await note.fill(text);
    await page.waitForFunction(()=>document.querySelector('[data-continuation-key="note"]'));
    assert.equal(await page.locator('.contract-continuation-text[data-continuation-key="note"]').evaluateAll(nodes=>nodes.map(n=>n.textContent).join('')),text);
    // Native printing while the inline field is still active must use its reference.
    await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
    assert((await page.locator('.contract-native-print-copy').innerText()).includes('ULTIMA_RIGA_INLINE'));
    assert.equal(await page.locator('.contract-native-print-copy .purchase-template-value[aria-label="Modifica: Note"]').innerText(),'[A24]');
    await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
    await page.getByRole('button',{name:'Salva PDF',exact:true}).click();
    await page.waitForFunction(()=>window.__columnPrints?.length>0);
    const html=await page.evaluate(()=>window.__columnPrints.at(-1));
    assert(html.includes('ULTIMA_RIGA_INLINE'));
    assert(!html.includes('contract-document-tools'));
    const printed=await context.newPage();
    await printed.setContent(html,{waitUntil:'networkidle'});
    await printed.emulateMedia({media:'print'});
    await printed.pdf({path:out+'/inline-continuazioni.pdf',format:'A4',preferCSSPageSize:true,printBackground:true,margin:{top:'0',bottom:'0',left:'0',right:'0'}});
    await printed.close();
    report.inline=true;report.explicitEditor=true;report.longText=true;report.nativePrint=true;report.pdf=true;
    console.log('PASS: campi inline, digitazione continua, bozza, sincronizzazione e apertura esplicita');
  }
  if(['all','text-tools'].includes(only)){
    await page.goto(base+'/aml',{waitUntil:'networkidle'});
    const text='Finalità del rapporto, testo integrale. '.repeat(350)+'FINE_TESTO_LATERALE';
    await page.locator('.a4-page [name="purpose"]').fill(text);
    await page.locator('.contract-flow-fragment').first().waitFor();
    assert.equal(await page.locator('.a4-page .long-text-edit').count(),0,'Anche gli strumenti dei testi lunghi devono stare fuori dal contratto');
    const open=page.locator('.contract-document-tools').getByRole('button',{name:'Modifica il testo completo',exact:true}).first();
    await open.click();
    const dialog=page.getByRole('dialog',{name:'Modifica testo completo',exact:true});
    await dialog.waitFor();
    assert.equal(await dialog.locator('textarea').first().inputValue(),text);
    await dialog.locator('textarea').first().fill(text+' AGGIUNTA');
    await dialog.getByRole('button',{name:'Chiudi',exact:true}).click();
    assert(await open.evaluate(n=>n===document.activeElement),'Chiudendo torna il focus al comando laterale');
    const count=await page.evaluate(()=>window.__columnPrints?.length||0);
    await page.getByRole('button',{name:'Salva PDF',exact:true}).click();
    await page.waitForFunction(n=>(window.__columnPrints?.length||0)>n,count);
    const html=await page.evaluate(()=>window.__columnPrints.at(-1));
    assert(html.includes('FINE_TESTO_LATERALE AGGIUNTA'));
    assert(!html.includes('contract-text-tools'));
    const printed=await context.newPage();await printed.setContent(html,{waitUntil:'networkidle'});
    await printed.emulateMedia({media:'print'});
    await printed.pdf({path:out+'/aml-testi-laterali.pdf',format:'A4',preferCSSPageSize:true,printBackground:true,margin:{top:'0',bottom:'0',left:'0',right:'0'}});
    await printed.close();
    report.longTextTools=true;
    await page.goto(base+'/purchase-proposal',{waitUntil:'networkidle'});
  }
  if (['all','layout'].includes(only)) {
    const geometry = await page.locator('.document-preview-container').evaluate(viewport => {
      const rect = viewport.getBoundingClientRect();
      const button = [...document.querySelectorAll('button')].find(b => b.textContent.trim()==='Salva PDF');
      const tool = button.getBoundingClientRect();
      return {top:rect.top,left:rect.left,toolRight:tool.right,toolTop:tool.top,inside:!!button.closest('.contract-document-tools')};
    });
    assert(geometry.top <= 1, 'Il foglio deve avere una colonna a tutta altezza senza intestazione sopra');
    assert(geometry.inside && geometry.toolRight <= geometry.left, 'PDF e strumenti devono stare nella colonna laterale');
    await page.screenshot({path:out+'/desktop.png'});
    console.log('PASS: colonne verticali e anteprima senza barre superiori');
    const routes=['/purchase-proposal','/lease-proposal','/sales-assign','/lease-assign','/lease-contract-4-4','/lease-contract-4-4-cedolare','/lease-contract-concordato','/lease-contract-students','/lease-contract-transitorio','/lease-allegato-b','/property-sharing','/visit-sheet','/aml','/commission'];
    for(const width of [1600,834,390]){
      await page.setViewportSize({width,height:1000});
      for(const route of routes){
        await page.goto(base+route,{waitUntil:'networkidle'});
        const compact=width<=1100;
        const switcher=page.getByRole('navigation',{name:'Colonne del documento'});
        if(compact)await switcher.getByRole('button',{name:'Anteprima',exact:true}).click();
        const paper=page.locator('.document-preview-container');
        assert(await paper.isVisible(),route+' preview visible');
        const bounds=await paper.boundingBox();
        assert(bounds.y<=1,route+' no header above paper');
        assert(Math.abs(bounds.height-1000)<=1,route+' preview uses exactly the viewport height');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' no horizontal page overflow');
        assert(await page.getByRole('button',{name:/menu$/,exact:false}).first().evaluate(b=>!!b.closest('.contract-navigation-column')));
        if(compact)await switcher.getByRole('button',{name:'Strumenti',exact:true}).click();
        await page.getByRole('button',{name:'Archivio e riuso dati',exact:true}).click();
        await page.getByRole('dialog',{name:'Archivio locale e riuso dei dati'}).waitFor();
        await page.getByRole('button',{name:'Chiudi archivio',exact:true}).click();
        const fiscal=page.locator('.contract-fiscal-tools>summary');
        if(await fiscal.count())await fiscal.click();
        assert(await page.locator('.contract-document-tools').evaluate(n=>n.scrollWidth<=n.clientWidth+1),route+' tools fit their column');
        const sections=page.getByLabel('Vai a una sezione del documento',{exact:true});
        if(compact&&await sections.count()&&await sections.locator('option').count()>1){
          await sections.selectOption({index:1});
          await page.waitForFunction(()=>document.querySelector('.contract-document-columns').dataset.column==='preview');
          await page.waitForFunction(()=>document.activeElement?.matches('.a4-page h2,.a4-page h3'));
          assert(await paper.isVisible(),route+' section navigation reveals the preview');
          await switcher.getByRole('button',{name:'Strumenti',exact:true}).click();
        }
        assert(await page.getByRole('button',{name:'Salva PDF',exact:true}).isVisible(),route+' PDF reachable in tools');
        if(route==='/purchase-proposal'){
          if(compact)await switcher.getByRole('button',{name:'Anteprima',exact:true}).click();
          const inline=page.locator('.purchase-template-field[aria-label="Modifica: Proponente: nome e cognome"]');
          await inline.fill('Prova diretta '+width);
          assert.equal(await page.locator('dialog[open]').count(),0);
          await page.screenshot({path:out+'/purchase-'+width+'.png'});
        }
        if(compact&&route==='/property-sharing'){
          await switcher.getByRole('button',{name:'Compila',exact:true}).click();
          await page.getByRole('textbox',{name:'Nome e cognome',exact:true}).fill('Condivisione mobile');
          await switcher.getByRole('button',{name:'Strumenti',exact:true}).click();
          const count=await page.evaluate(()=>window.__columnPrints?.length||0);
          await page.getByRole('button',{name:'Salva PDF',exact:true}).click();
          await page.waitForFunction(n=>(window.__columnPrints?.length||0)>n,count);
          assert((await page.evaluate(()=>window.__columnPrints.at(-1))).includes('Condivisione mobile'));
        }
        report.layouts.push({route,width,pass:true});
      }
    }
  }
  assert.deepEqual(errors, []);
  report.pass=true;await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));
} finally {
  await browser.close();
}
