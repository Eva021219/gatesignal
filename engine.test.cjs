const assert=require('node:assert/strict');const E=require('./engine.js');let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
const clean=()=>({...E.seed('daily')[1]});
test('100 deterministic containers',()=>assert.deepEqual(E.seed(),E.seed()));
test('Clean evidence eligible',()=>assert.equal(E.assess(clean()).eligible,true));
test('Customs hold cannot be cleared by temperature urgency',()=>{const a=E.assess({...clean(),customs:'hold',reefer:true,temp:10});assert.equal(a.eligible,false);assert.equal(a.hot,true);assert.equal(a.action,'URGENT CARE');});
test('Empty / heavy contradiction blocks exit',()=>assert.equal(E.assess({...clean(),empty:true,weight:20000}).eligible,false));
test('Unknown customs blocks exit',()=>assert.equal(E.assess({...clean(),customs:'unknown'}).eligible,false));
test('Stale evidence blocks exit',()=>assert.equal(E.assess({...clean(),age:31}).eligible,false));
test('Freshness boundary accepted',()=>assert.equal(E.assess({...clean(),age:30}).eligible,true));
test('Invalid numeric data blocked',()=>{for(const v of [NaN,-1,Infinity])assert.equal(E.assess({...clean(),weight:v}).eligible,false);});
test('Zero lanes produces zero potential exits',()=>assert.equal(E.compare(E.seed(),0).triage.served,0));
test('All-clear FIFO and triage use identical capacity',()=>{const m=E.compare(Array.from({length:100},(_,i)=>({...clean(),id:String(i)})),2);assert.equal(m.fifo.served,40);assert.equal(m.triage.served,40);});
test('Every modeled triage exit is eligible',()=>{const d=E.seed();for(const id of E.compare(d,4).triage.ids)assert.equal(E.assess(d.find(c=>c.id===id)).eligible,true);});
test('Crisis changes urgent workload while daily remains useful',()=>{assert.equal(E.seed('daily').filter(c=>E.assess(c).hot).length,0);assert.equal(E.seed().filter(c=>E.assess(c).hot).length,13);});
console.log(`${checks} checks passed`);
test('Unit conversions preserve canonical values',()=>{for(const k of ['weight','temp'])for(const v of [0,5,3800,18000])assert.ok(Math.abs(E.convert(E.convert(v,k,true,true),k,false,true)-v)<1e-7);});
test('Fahrenheit cargo limit converts correctly',()=>assert.equal(E.convert(41,'temp',false,true),5));
console.log(`${checks} total checks passed`);
