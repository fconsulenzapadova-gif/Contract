import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';

test('the sharing model preserves mixed delivery states and rejects unsupported imported values', async () => {
 const moduleUrl=new URL('../src/sharing/model.ts',import.meta.url);
 assert(existsSync(moduleUrl),'A native sharing model must exist');
 const {normalizeSharingData,updateMaterial}=await import(moduleUrl);
 const data=normalizeSharingData({name:'Mario Rossi',channels:['Email','bogus'],materials:[
  {id:'plan',kind:'Planimetrie',description:'piano-1.pdf',status:'sent'},
  {id:'photo',kind:'Foto / video',description:'foto.zip',status:'pending'}]});
 assert.deepEqual(data.channels,['Email']);
 assert.equal(data.materials[0].status,'sent');
 assert.equal(data.materials[1].status,'pending');
 const changed=updateMaterial(data,'photo',{description:'video.mp4',status:'sent'});
 assert.equal(changed.materials[0].description,'piano-1.pdf');
 assert.equal(changed.materials[1].description,'video.mp4');
 assert.equal(data.materials[1].status,'pending','updates must not mutate the previous draft');
 assert.equal(normalizeSharingData({materials:[{id:'bad',status:'received'}]}).materials[0].status,'');
 assert.equal(normalizeSharingData({name:{unexpected:true}}).name,'');
});

test('empty materials never certify delivery and rows keep stable unique identities',async()=>{
 const moduleUrl=new URL('../src/sharing/model.ts',import.meta.url);
 assert(existsSync(moduleUrl),'A native sharing model must exist');
 const {normalizeSharingData,createMaterial}=await import(moduleUrl);
 const blank=normalizeSharingData({});
 assert(blank.materials.every(row=>row.status===''));
 assert.deepEqual(blank.channels,[]);
 assert.notEqual(createMaterial().id,createMaterial().id);
 const rows=normalizeSharingData({materials:[{id:'same',status:'sent'},{id:'same',status:'pending'}]}).materials;
 assert.notEqual(rows[0].id,rows[1].id);
 assert.deepEqual(rows.map(row=>row.status),['sent','pending']);
});

test('oversized imported descriptions remain intact but cannot produce a clipped two-page document', async()=>{
 const {normalizeSharingData,contentIssues}=await import('../src/sharing/model.ts');
 const data=normalizeSharingData({materials:[{description:'riga\n'.repeat(30)}]});
 assert.equal(data.materials[0].description,'riga\n'.repeat(30));
 assert(contentIssues(data).length>0,'Too many line breaks must require editing before print');
});
