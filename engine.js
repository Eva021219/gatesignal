(function(root){
'use strict';
const POLICY={version:'0.1-demo',emptyToleranceKg:1000,weightTolerance:0.15,maxAgeMinutes:30,serviceMinutes:3};
function assess(c){
 const reasons=[], tasks=[]; let score=Math.min(20,Math.floor(c.wait/10)),eligible=true;
 if(c.customs!=='clear'){eligible=false;score+=35;reasons.push(c.customs==='hold'?'Customs hold: exit prohibited.':'Customs clearance unknown: verify before exit.');tasks.push('Contact customs liaison');}
 if(!Number.isFinite(c.weight)||c.weight<0||!Number.isFinite(c.declared)||c.declared<0||!Number.isFinite(c.tare)||c.tare<=0||!Number.isFinite(c.age)||c.age<0||!Number.isFinite(c.wait)||c.wait<0||(c.reefer&&(!Number.isFinite(c.temp)||!Number.isFinite(c.limit)))){eligible=false;score+=40;reasons.push('Invalid or missing evidence: manual verification required.');tasks.push('Verify source data');}
 if(c.age>POLICY.maxAgeMinutes){eligible=false;score+=25;reasons.push('Evidence older than 30 minutes: refresh required.');tasks.push('Refresh source evidence');}
 const conflict=c.empty?c.weight>c.tare+POLICY.emptyToleranceKg:Math.abs(c.weight-c.declared)>Math.max(1000,c.declared*POLICY.weightTolerance);
 if(conflict){eligible=false;score+=30;reasons.push(c.empty?'Carrier says empty; measured gross weight exceeds tare + 1,000 kg.':'Measured and declared gross weight differ beyond demo tolerance.');tasks.push('Request reweigh and manifest reconciliation');}
 const hot=c.reefer&&c.temp>c.limit;
 if(hot){score+=50;reasons.push('Reefer temperature exceeds cargo demo limit.');tasks.unshift('Request reefer technician / powered holding area');}
 if(!reasons.length)reasons.push('Fresh evidence, weight consistent, customs clear.');
 return {id:c.id,eligible,hot,conflict,score,reasons,tasks,action:hot?'URGENT CARE':eligible?'RELEASE REVIEW':c.customs==='hold'?'CUSTOMS HOLD':'VERIFY',route:eligible?'Exit review queue':hot?'Powered holding request':'Inspection / holding request'};
}
function seed(mode='crisis'){
 return Array.from({length:100},(_,i)=>{const c={id:'LA-'+String(i+1).padStart(4,'0'),empty:false,tare:3800,declared:18000+(i%7)*1000,weight:18000+(i%7)*1000,customs:'clear',reefer:i%8===0,temp:3,limit:5,age:5+i%12,wait:10+i*2};
 if(i%13===0)c.customs='hold';if(i%17===0){c.empty=true;c.declared=3800;}if(i%19===0)c.age=45;
 if(mode==='crisis'&&i%8===0)c.temp=9;
 return c;});
}
function compare(containers,lanes,horizon=60){
 // Same arrivals, service time and capacity for both policies. A blocked head
 // stops strict FIFO; triage puts blocked boxes in a separate holding request.
 const capacity=Math.floor(horizon/POLICY.serviceMinutes)*lanes;
 const fifo=[];for(const c of containers){if(!assess(c).eligible)break;fifo.push(c);}
 const triage=containers.filter(c=>assess(c).eligible).sort((a,b)=>assess(b).score-assess(a).score||a.id.localeCompare(b.id));
 function metrics(list){const served=list.slice(0,capacity);return {served:served.length,meanExitMinutes:served.length?Number((served.reduce((s,c,i)=>s+c.wait+(Math.floor(i/Math.max(lanes,1))+1)*POLICY.serviceMinutes,0)/served.length).toFixed(1)):null,ids:served.map(c=>c.id)};}
 return {fifo:metrics(fifo),triage:metrics(triage),capacity,horizon,lanes};
}
function convert(value,kind,toDisplay=true,imperial=false){if(!imperial)return value;if(kind==='weight')return toDisplay?value*2.20462262185:value/2.20462262185;if(kind==='temp')return toDisplay?value*9/5+32:(value-32)*5/9;return value;}
root.GateEngine={POLICY,assess,seed,compare,convert};if(typeof module!=='undefined')module.exports=root.GateEngine;
})(typeof window!=='undefined'?window:globalThis);
