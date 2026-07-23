/* PlowOps shared store — seeded demo data + business rules. window.PlowStore */
(function(){
'use strict';
const KEY='plowops_v1';
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=off=>{const d=new Date();if(off)d.setDate(d.getDate()+off);return iso(d);};
const rnd=i=>((i*9301+49297)%233280)/233280;
const DRIVERS=['Marcus Webb','Danny Ortega','Kayla Brooks','Tom Reyes','Jess Hutchins','Alan Pruitt','Sam Kowalski','Nina Vidal','Chris Dunn','Ray Thibodeau'];
const MECHS=['Earl Simmons','Pete Marsh','Joan Kelly','Hank Ellison','Omar Diaz','Walt Freeman','Tanya Ruiz','Bud Larson','Ivy Chen','Gus Novak'];
const MAKES=['Ford F-350','Ford F-550','Chevy 3500HD','Ram 3500','Intl CV515'];
const STREETS=['S Quebec Way','Emerson St','E Hampden Ave','Market St','E Arapahoe Rd','W Colfax Ave','S Broadway','Larimer St','E 6th Ave','Monaco Pkwy','S Wadsworth Blvd','Federal Blvd','E Evans Ave','S Colorado Blvd','W Alameda Ave','Blake St','S Havana St','E Iliff Ave','Sheridan Blvd','E Belleview Ave'];
const CNAMES=['Hillcrest HOA','Redstone Dental','J. Whitfield','QuikStop #12','M. Ferraro','Cedar Point Office Park','K. Osei','Summit Credit Union','TruNorth Gym','L. Petrov','Bramble & Co.','R. Castellanos','Aspen Ridge Apartments','D. McKinney','Frontline Church','H. Yamamoto','Peak Storage','S. Delgado','Ironworks Brewing','B. Antonelli','T. Nguyen','Copper Kettle Diner','A. Brandt','Silverline Logistics','P. Okafor','Meadowbrook HOA','G. Silva','Rocky Top Vet Clinic','E. Lindqvist','Stapleton Row Homes','C. Beaumont','Vantage Point Realty','N. Adeyemi','The Filling Station','F. Kowalczyk','Birchwood Assisted Living','W. Tran','Mile High Signs','O. Vasquez','Sunrise Plaza'];
const EQ=[['Boss 9\'2" V-plow','Plow attachment','t1'],['Western Pro Plus 8\'','Plow attachment','t2'],['Boss 8\'2" straight blade','Plow attachment','t3'],['Fisher XV2 9\'6"','Plow attachment','t4'],['SnowEx 1075 spreader','Spreader','t1'],['SaltDogg SHPE2000','Spreader','t5'],['Meyer Lot Pro 8\'','Plow attachment',null],['Western Wide-Out 8\'','Plow attachment',null],['Hydraulic line kit','Hand tool','t1'],['Steel snow shovels x4','Hand tool','t2'],['Ice scraper set','Hand tool','t3'],['Tire chains - set of 4','Hand tool',null],['Roof rake 24\'','Hand tool',null],['Torque wrench kit','Hand tool',null],['Jump pack 2000A','Hand tool','t6'],['Impact driver kit','Hand tool',null],['Salt - 50 lb bags x10','Consumable','t5'],['Floor jack 3-ton','Shop tool',null]];
function seed(){
  const co='co1';
  const drivers=DRIVERS.map((n,i)=>({id:'d'+(i+1),co,name:n,role:'driver',phone:'(303) 555-0'+(120+i)}));
  const mechanics=MECHS.map((n,i)=>({id:'m'+(i+1),co,name:n,role:'mechanic',phone:'(720) 555-0'+(140+i)}));
  const trucks=[];for(let i=1;i<=50;i++){const miles=15000+Math.round(rnd(i)*80000);trucks.push({id:'t'+i,co,unit:'T-'+pad(i),make:MAKES[i%5],year:2015+((i*7)%10),plate:'CO '+String(10000+((i*837)%89999)).slice(0,5),miles,oilAt:miles-Math.round(rnd(i+3)*5600),mpg:9+(i%4),status:i%17===0?'shop':'active'});}
  const clients=CNAMES.map((n,i)=>({id:'c'+(i+1),co,name:n,addr:(300+((i*727)%9400))+' '+STREETS[i%20]+(i%2?', Denver CO':', Aurora CO'),email:n.toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.|\.$/g,'')+'@mail.com',type:i%3===0?'commercial':'residential',rate:i%3===0?145:65,x:+(6+rnd(i+11)*88).toFixed(1),y:+(6+rnd(i+29)*88).toFixed(1)}));
  const schedule=[];const st=['04:00','04:00','05:00','05:30','06:00','04:30','07:00','05:00'],en=['12:00','12:00','13:00','13:30','14:00','12:30','15:00','13:00'];
  for(let i=0;i<8;i++)schedule.push({id:'s'+(i+1),co,date:today(0),driverId:'d'+(i+1),truckId:'t'+(i+1),start:st[i],end:en[i]});
  for(let i=0;i<5;i++)schedule.push({id:'s'+(9+i),co,date:today(1),driverId:'d'+(i+1),truckId:'t'+(i+6),start:'04:00',end:'12:00'});
  const jobs=[];let j=1;
  [[-1,8],[-3,7],[-5,6],[-6,6],[-8,5],[-10,5]].forEach(([off,count])=>{for(let i=0;i<count;i++){const c=clients[i%12];jobs.push({id:'j'+(j++),co,clientId:c.id,driverId:'d'+((i%6)+1),truckId:'t'+((i%6)+1),ts:today(off)+'T0'+(4+(i%6))+':'+pad((i*13)%60)+':00',lat:+(39.79-c.y*0.0016).toFixed(4),lng:+(-105.08+c.x*0.0022).toFixed(4),photo:true,emailed:true,notified:true});}});
  const routes=[{id:'r1',co,date:today(0),driverId:'d1',truckId:'t1',status:'assigned',miles:0,pos:null,crumbs:[],stops:clients.slice(0,8).map(c=>({clientId:c.id,status:'pending',ts:null}))}];
  const timesheets=[];let tsn=1;
  for(let off=1;off<=12;off++){const n=4+((off*3)%5);for(let i=0;i<n;i++){timesheets.push({id:'ts'+(tsn++),co,driverId:'d'+((i+off)%10+1),truckId:'t'+(((i+off*2)%12)+1),date:today(-off),clockIn:'0'+(4+(i%3))+':0'+(i%6),clockOut:(11+(i%4))+':'+pad((i*17)%60),miles:16+Math.round(rnd(off*10+i)*22),stops:4+((i+off)%5)});}}
  const repairs=[
   {id:'rp1',co,ts:today(-1)+'T09:14:00',item:'Boss 9\'2" V-plow - cutting edge',truckId:'t3',from:'d3',to:'m1',msg:'Cutting edge cracked on the curb cut at Cedar Point. Blade still drops but it is chewing through bolts.',photo:true,status:'in progress'},
   {id:'rp2',co,ts:today(0)+'T05:52:00',item:'Hydraulic line - driver side lift',truckId:'t7',from:'d7',to:'m2',msg:'Line is weeping fluid at the fitting. Losing lift after ~20 min. Need a crimp or new line before tonight.',photo:true,status:'open'},
   {id:'rp3',co,ts:today(-2)+'T14:30:00',item:'SaltDogg spreader - auger jam',truckId:'t5',from:'d5',to:'m4',msg:'Auger seized mid-lot. Cleared the chunk but motor sounds rough.',photo:true,status:'fixed'}];
  const estimates=[
   {id:'Q-88',co,clientId:'c21',status:'sent',perPush:145,seasonal:1450,created:today(-4)},
   {id:'Q-89',co,clientId:'c14',status:'draft',perPush:65,seasonal:780,created:today(-1)}];
  const inv1=jobs.filter(x=>x.clientId==='c1').map(x=>x.id),inv2=jobs.filter(x=>x.clientId==='c2').map(x=>x.id);
  const invoices=[
   {id:'INV-1039',co,clientId:'c1',period:'Dec 26 - Jan 15',status:'paid',jobIds:inv1,amount:inv1.length*145},
   {id:'INV-1040',co,clientId:'c2',period:'Jan 1 - Jan 15',status:'sent',jobIds:inv2,amount:inv2.length*65}];
  return{v:1,companies:[{id:co,name:'Summit Snow & Ice',phone:'(303) 555-0141',email:'dispatch@summitsnow.co',website:'summitsnow.co',logo:null,region:'Denver-Aurora-Lakewood'}],
   session:{companyId:null},drivers,mechanics,trucks,equipment:EQ.map(([name,cat,truckId],i)=>({id:'e'+(i+1),co,name,cat,truckId,cond:i===8?'needs repair':'good'})),
   clients,schedule,routes,jobs,timesheets,repairs,estimates,invoices,
   settings:{gasPrice:3.89,oilInterval:5000},counters:{truck:50,estimate:89,invoice:1040,eq:18}};
}
let state=null,subs=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function load(){try{const raw=localStorage.getItem(KEY);if(raw){state=JSON.parse(raw);return;}}catch(e){}state=seed();save();}
function notify(){subs.forEach(f=>{try{f(state);}catch(e){}});}
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{state=JSON.parse(e.newValue);notify();}catch(err){}}});
window.PlowStore={
  get:()=>state,
  update(fn){fn(state);save();notify();},
  subscribe(f){subs.push(f);return()=>{subs=subs.filter(x=>x!==f);};},
  reset(){state=seed();save();notify();},
  today,pad,
  uid:p=>p+Math.random().toString(36).slice(2,8),
  latLng(c){return{lat:+(39.79-c.y*0.0016).toFixed(4),lng:+(-105.08+c.x*0.0022).toFixed(4)};},
  gps(c){const p=this.latLng(c);return p.lat.toFixed(4)+'° N, '+Math.abs(p.lng).toFixed(4)+'° W';},
  fmtGps:(lat,lng)=>(+lat).toFixed(4)+'° N, '+Math.abs(+lng).toFixed(4)+'° W',
  distMi:(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)*0.14,
  optimize(cs,start){const rem=cs.slice(),out=[];let cur=start||{x:50,y:96},total=0;while(rem.length){let bi=0,bd=1e9;rem.forEach((c,i)=>{const d=Math.hypot(c.x-cur.x,c.y-cur.y);if(d<bd){bd=d;bi=i;}});const n=rem.splice(bi,1)[0];total+=bd*0.14;out.push(n);cur=n;}return{order:out,miles:Math.round(total*10)/10};},
  canAssign(st,date,driverId,truckId,ignoreId){for(const s of st.schedule){if(s.date!==date||s.id===ignoreId)continue;
    if(s.driverId===driverId){const t=st.trucks.find(t=>t.id===s.truckId);return{ok:false,msg:'Blocked: that driver already holds '+(t?t.unit:'a truck')+' on this day.'};}
    if(s.truckId===truckId){const d=st.drivers.find(d=>d.id===s.driverId);return{ok:false,msg:'Blocked: that truck is already booked by '+(d?d.name:'another driver')+' on this day.'};}}
    return{ok:true,msg:''};},
  oil(t,interval){const int=interval||5000,since=t.miles-t.oilAt;return{since,int,due:since>=int,pct:Math.min(100,Math.round(since/int*100)),left:Math.max(0,int-since)};},
  money:n=>'$'+Math.round(n).toLocaleString('en-US'),
  fuel(miles,mpg,price){const gal=miles/(mpg||10);return{gal:Math.round(gal*10)/10,cost:Math.round(gal*(price||3.89)*100)/100};},
  hours(a,b){if(!a||!b)return 0;const[h1,m1]=a.split(':').map(Number),[h2,m2]=b.split(':').map(Number);return Math.round(((h2*60+m2)-(h1*60+m1))/6)/10;},
  fmtTs(ts){const d=new Date(ts);if(isNaN(d))return ts;return pad(d.getMonth()+1)+'/'+pad(d.getDate())+' '+String(((d.getHours()+11)%12)+1)+':'+pad(d.getMinutes())+(d.getHours()<12?' AM':' PM');}
};
load();
})();
