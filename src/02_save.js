/* ================= 저장 (v4, 이전 버전 자동 변환) ================= */
const today=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const weekKey=(d=new Date())=>{const t=new Date(d.getFullYear(),d.getMonth(),d.getDate());const day=(t.getDay()+6)%7;t.setDate(t.getDate()-day);return today(t)};
function fresh(){return{v:5,gold:0,lv:1,xp:0,count:0,dex:{},best:{},rec:{},up:{rod:0,reel:0,line:0,hook:0},baits:{worm:1},goldB:0,bait:'worm',methods:{basic:1,float:1},method:'basic',bobs:{red:1},bob:'red',
 cos:{outfit:{default:1},hat:{cap:1},acc:{none:1},rod:{basic:1},reel:{basic:1},boat:{basic:1}},wear:{outfit:'default',hat:'cap',acc:'none',rod:'basic',reel:'basic',boat:'basic'},
 deco:{},decoOn:{},pets:{},pet:'',loc:'pier',locs:{pier:1},locDone:{},reg:{},
 st:{perfect:0,junk:0,giant:0,snaps:0,maxCombo:0,legend:0,myth:0,hidden:0,crit:0,variant:0,totalKg:0,meth:0},
 petLove:{},dry:0,first:{},seasonLog:{},secret:{},secFlag:{},dexG:{},masterR:0,tre:{},mode:'normal',chal:{best:0,day:'',dayBest:0,runs:0,total:0},todaySp:{d:'',ids:{}},gear:{rod:'r0',reel:'e0',line:'l0'},gown:{r0:1,e0:1,l0:1},enh:{},ward:{own:{},wear:{top:'basic',bottom:'cargo',costume:'none',hat:'cap',hair:'basic',shoes:'boots',gloves:'none',acc:'glasses',bag:'pack'},pre:[null,null,null,null,null]},aq:{cap:0,slots:[],theme:'blue',themes:{blue:1},decos:{},decoOff:{},last:0,full:{},rare5:0},mythLog:[],comboBest:0,ach:{},daily:null,weekly:null,today:null,att:{last:'',day:0,streak:0,total:0},rank:[],titles:{},title:'',boss:{},tour:{date:'',entries:0,best:0,won:0},dexR:{},gt:30,set:{sfx:1,bgm:1,vib:1,calm:0,gfx:'auto',reveal:'full',classic:1,cv:1,snd:1,bgmVol:.35,sfxVol:.65},fightRecords:{},fightGradeCounts:{S:0,A:0,B:0,C:0,D:0},totalPerfectCatches:0,treEq:{slots:[null,null],ring:{d:'',n:0}}}}
const num=(v,d=0)=>Number.isFinite(+v)?+v:d,obj=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
function sanitize(s){const f=fresh(),o=Object.assign(f,obj(s));o.luck=Math.max(0,Math.min(7,+o.luck||0));o.cleanRun=Math.max(0,Math.min(999,+o.cleanRun||0));o.petLove=obj(o.petLove);o.dry=Math.max(0,Math.min(99,+o.dry||0));o.first=obj(o.first);o.seasonLog=obj(o.seasonLog);o.secret=obj(o.secret);o.secFlag=obj(o.secFlag);o.dexG=obj(o.dexG);o.masterR=Math.max(0,+o.masterR||0);o.tre=obj(o.tre);for(const k in o.tre){const v=o.tre[k];if(!v||typeof v!=='object'){delete o.tre[k];continue}v.n=Math.max(1,+v.n||1)}o.mode=o.mode==='treasure'?'treasure':'normal';{const c=obj(o.chal);o.chal={best:Math.max(0,+c.best||0),day:typeof c.day==='string'?c.day:'',dayBest:Math.max(0,+c.dayBest||0),runs:Math.max(0,+c.runs||0),total:Math.max(0,+c.total||0)}}{const t=obj(o.todaySp);o.todaySp={d:typeof t.d==='string'?t.d:'',ids:obj(t.ids)}}o.achSeen=obj(o.achSeen);for(const k in o.petLove){const v=o.petLove[k];if(!v||typeof v!=='object'){delete o.petLove[k];continue}v.p=Math.max(0,Math.min(50,+v.p||0));v.n=Math.max(0,Math.min(9,+v.n||0));v.d=typeof v.d==='string'?v.d:''}if(!o.bounty||typeof o.bounty!=="object"||typeof o.bounty.id!=="string")o.bounty=null;
 for(const k of['gold','lv','xp','count','goldB','gt'])o[k]=Math.max(k==='lv'?1:0,num(o[k],f[k]));
 for(const k of['dex','best','rec','baits','methods','bobs','deco','decoOn','pets','locs','locDone','reg','ach','titles','boss','dexR'])o[k]=obj(o[k]);
 o.up=Object.assign(fresh().up,obj(o.up));for(const k in o.up)o.up[k]=clamp(num(o.up[k]),0,10);
 o.st=Object.assign(fresh().st,obj(o.st));for(const k in o.st)o.st[k]=num(o.st[k]);
 {const s0=obj(o.set),old=s0.cv!==1;o.set=Object.assign(fresh().set,s0);if(old){o.set.classic=1;o.set.cv=1}}o.att=Object.assign(fresh().att,obj(o.att));o.tour=Object.assign(fresh().tour,obj(o.tour));
 o.cos=Object.assign(fresh().cos,obj(o.cos));for(const k in fresh().cos)o.cos[k]=Object.assign(fresh().cos[k],obj(o.cos[k]));
 o.wear=Object.assign(fresh().wear,obj(o.wear));for(const k in o.wear)if(!o.cos[k][o.wear[k]])o.wear[k]=fresh().wear[k];
 for(const k in o.dex)if(!FID[k])delete o.dex[k];
 o.gear=Object.assign(fresh().gear,obj(o.gear));o.gown=Object.assign(fresh().gown,obj(o.gown));o.enh=obj(o.enh);for(const[k,L]of[['rod',RODS],['reel',REELS],['line',LINES]])if(!L.find(x=>x.id===o.gear[k])||!o.gown[o.gear[k]])o.gear[k]=L[0].id;
 o.ward=Object.assign(fresh().ward,obj(o.ward));o.ward.own=obj(o.ward.own);o.ward.pre=Array.isArray(o.ward.pre)?o.ward.pre.slice(0,5).map(x=>x&&typeof x==='object'?x:null):[null,null,null,null,null];while(o.ward.pre.length<5)o.ward.pre.push(null);o.ward.wear=Object.assign(fresh().ward.wear,obj(o.ward.wear));for(const k in o.ward.wear){const it=WARD[k]&&WARD[k].find(x=>x.id===o.ward.wear[k]);if(!it||(it.price!==0&&!o.ward.own[k+':'+it.id]))o.ward.wear[k]=fresh().ward.wear[k]}
 o.aq=Object.assign(fresh().aq,obj(o.aq));o.aq.slots=Array.isArray(o.aq.slots)?o.aq.slots.filter(id=>FID[id]):[];o.aq.themes=Object.assign({blue:1},obj(o.aq.themes));o.aq.decos=obj(o.aq.decos);o.aq.fedAt=+o.aq.fedAt||0;o.aq.fedUntil=+o.aq.fedUntil||0;o.aq.decoOff=obj(o.aq.decoOff);o.aq.full=obj(o.aq.full);o.mythLog=Array.isArray(o.mythLog)?o.mythLog.slice(-30):[];
 o.rank=Array.isArray(o.rank)?o.rank.filter(r=>r&&FID[r.id]).slice(0,10):[];
 if(!LOCS.find(l=>l.id===o.loc)||!o.locs[o.loc])o.loc='pier';o.locs.pier=1;
 if(!BAITS.find(b=>b.id===o.bait))o.bait='worm';if(!METHODS.find(m=>m.id===o.method)||!o.methods[o.method])o.method='basic';o.methods.basic=1;o.methods.float=1;
 if(!o.bobs[o.bob])o.bob='red';if(o.pet&&!o.pets[o.pet])o.pet='';
 // 4.14 전투 기록 (없으면 기본값, 이상한 값만 정리)
 {const R=obj(o.fightRecords);o.fightRecords={};for(const k in R){const v=R[k];if(!v||typeof v!=='object')continue;o.fightRecords[k]={bestScore:clamp(Math.floor(num(v.bestScore)),0,100),bestTimeMs:Math.max(0,Math.round(num(v.bestTimeMs))),largestSize:Math.max(0,num(v.largestSize)),catchCount:Math.max(0,Math.floor(num(v.catchCount)))}}
  {const q=obj(o.treEq),sl=Array.isArray(q.slots)?q.slots:[],rg=obj(q.ring);o.treEq={slots:[0,1].map(i=>typeof sl[i]==='string'&&o.tre[sl[i]]?sl[i]:null),ring:{d:typeof rg.d==='string'?rg.d:'',n:Math.max(0,Math.min(3,Math.floor(num(rg.n))))}}} // 4.15 보물 장착
  o.totalPerfectCatches=Math.max(0,Math.floor(num(o.totalPerfectCatches)));const G0=obj(o.fightGradeCounts);o.fightGradeCounts={S:0,A:0,B:0,C:0,D:0};for(const k in o.fightGradeCounts)o.fightGradeCounts[k]=Math.max(0,Math.floor(num(G0[k])))}
 return o}
function migrate3(s){const o=fresh();
 for(const k of['gold','lv','xp','count','goldB','bait','bob','loc','gt'])if(s[k]!=null)o[k]=s[k];
 for(const k of['dex','best','baits','bobs','locs','locDone','ach','up','set'])if(s[k])o[k]=Object.assign(o[k],s[k]);
 o.st=Object.assign(o.st,obj(s.st));if(s.daily)o.daily=s.daily;if(s.today)o.today=s.today;
 const dc=obj(s.deco),don=obj(s.decoOn);for(const k in dc){if(k==='cat'){o.pets.cat=1;if(don.cat)o.pet='cat'}else{o.deco[k]=1;if(don[k])o.decoOn[k]=1}}
 for(const k in o.best){const b=o.best[k];if(typeof b==='number')o.best[k]={cm:b,kg:kgOf(FID[k]||{wk:.012},b)};o.rec[k]={locs:[],vars:{},last:null}}
 return o}
function migrate4(s){const o=Object.assign({},s);o.v=5;const up=obj(s.up),gown={r0:1,e0:1,l0:1},gear={rod:'r0',reel:'e0',line:'l0'},enh={};
 for(const[k,pre]of[['rod','r'],['reel','e'],['line','l']]){const lv=num(up[k]);const tier=Math.min(3,Math.floor(lv/3));for(let i=0;i<=tier;i++)gown[pre+i]=1;gear[k]=pre+tier;if(lv%3)enh[pre+tier]=lv%3}
 o.gown=gown;o.gear=gear;o.enh=enh;o.up={hook:num(up.hook)};
 const ward={own:{},wear:fresh().ward.wear};const oc=obj(s.cos),ow=obj(s.wear),map={navy:'wind',pink:'sweat',mint:'seasuit',red:'rescue',moon:'moonrobe'};for(const k in obj(oc.outfit))if(map[k])ward.own['top:'+map[k]]=1;if(map[ow.outfit])ward.wear.top=map[ow.outfit];
 const hm={straw:'straw',beanie:'beanie',bucket:'bucket',pirate:'tricorn',icecrown:'icecrown'};for(const k in obj(oc.hat))if(hm[k])ward.own['hat:'+hm[k]]=1;if(hm[ow.hat])ward.wear.hat=hm[ow.hat];
 const am={flower:'flower',catears:'catears',headphones:'headphones',halo:'halo'};for(const k in obj(oc.acc))if(am[k])ward.own['acc:'+am[k]]=1;if(am[ow.acc])ward.wear.acc=am[ow.acc];
 o.ward=ward;if(s.bait==='lure')o.bait='lure';return o}
function migrate2(s){const o=fresh();o.gold=num(s.coin);o.count=num(s.count);for(const k in obj(s.dex))if(FID[k])o.dex[k]=s.dex[k];for(const k in obj(s.best))if(FID[k])o.best[k]={cm:s.best[k],kg:kgOf(FID[k],s.best[k])};return o}
function kgOf(f,cm){return f.kg!=null?f.kg:Math.max(.01,(f.wk||.012)*cm*cm*cm/1000)}
let save=fresh(),canSave=true,loadNote='';
/* 4.14.2 저장 보호: 여러 탭·오래된 탭이 최신 기록을 덮어쓰지 않게
 - REV: 저장할 때마다 1씩 오르는 번호. 내 탭이 아는 번호보다 저장소 번호가 크면(다른 탭이 더 최근에 저장) 이 탭은 저장을 멈춤(staleTab)
 - SAFE: 새 코드만 쓰는 복구용 사본. 예전 버전 탭이 본 기록을 옛것으로 덮어써도, 불러올 때 번호가 더 큰 SAFE로 되돌림 */
const SV_KEY='haneul-fish-v4',SV_REV='haneul-fish-v4-rev',SV_SAFE='haneul-fish-v4-safe';let myRev=0,staleTab=false;
function revNow(){try{return Math.max(0,+(localStorage.getItem(SV_REV)||0)||0)}catch(e){return 0}}
function load(){let raw4=null,raw3=null,raw2=null;
 try{const a=localStorage.getItem(SV_KEY),b=localStorage.getItem(SV_SAFE);raw4=a;if(b){let ra=-1,rb=-1;try{ra=a?+(JSON.parse(a).rev||0):-1}catch(e){}try{rb=+(JSON.parse(b).rev||0)}catch(e){rb=-1}if(rb>ra){raw4=b;if(a)loadNote='이전 탭이 덮어쓴 기록을 더 최근 기록으로 되돌렸어요'}}
  myRev=revNow();if(raw4){try{myRev=Math.max(myRev,+(JSON.parse(raw4).rev||0))}catch(e){}}}catch(e){}
 try{raw4=raw4??localStorage.getItem('haneul-fish-v4');raw3=localStorage.getItem('haneul-fish-v3');raw2=localStorage.getItem('haneul-fish-v2')}catch(e){canSave=false;return}
 try{if(raw4){const s4=JSON.parse(raw4);if(s4.v===4){localStorage.setItem('haneul-fish-v4-pre5',raw4);save=sanitize(migrate4(s4));loadNote='2.0 기록을 3.0으로 옮겼어요 (강화 단계 → 새 장비로 환산)';persist();return}save=sanitize(s4);return}}catch(e){loadNote='저장 데이터 일부가 손상돼 백업에서 복구했어요';try{const b=localStorage.getItem('haneul-fish-v4-backup');if(b){save=sanitize(JSON.parse(b));return}}catch(e2){}}
 try{if(raw3){const s=JSON.parse(raw3);localStorage.setItem('haneul-fish-v3-backup',raw3);save=sanitize(migrate3(s));loadNote='이전 버전 기록을 그대로 옮겨 왔어요 (골드·레벨·도감·장비)';persist();return}}catch(e){loadNote='이전 기록을 읽지 못해 새로 시작해요'}
 try{if(raw2){save=sanitize(migrate2(JSON.parse(raw2)));loadNote='이전 버전 기록을 옮겨 왔어요';persist()}}catch(e){}}
let lastBackup=0;
function persist(){if(staleTab)return;try{try{save.gt=gt}catch(e0){}
 const r=revNow();if(r>myRev){staleTab=true;try{onStaleTab()}catch(e1){}return}
 myRev=r+1;save.rev=myRev;save.savedAt=Date.now();const js=JSON.stringify(save);localStorage.setItem(SV_KEY,js);localStorage.setItem(SV_REV,String(myRev));localStorage.setItem(SV_SAFE,js);
 if(Date.now()-lastBackup>60000){localStorage.setItem('haneul-fish-v4-backup',js);lastBackup=Date.now()}canSave=true}catch(e){canSave=false}}
// 다른 탭이 더 최근에 저장했을 때(화면 처리는 06h_safe.js에서 덮어씀)
let onStaleTab=()=>{};
function seeded(str){let h=2166136261;for(const c of str)h=Math.imul(h^c.charCodeAt(0),16777619);h>>>=0;return()=>(h=Math.imul(h^h>>>15,2246822507)>>>0,(h%10000)/10000)}
function ensureDaily(){const d=today();
 if(!save.daily||save.daily.date!==d||!Array.isArray(save.daily.list)){const r=seeded(d),pool=MT.slice(),list=[];while(list.length<3){const m=pool.splice(Math.floor(r()*pool.length),1)[0];list.push({t:m.t,n:m.n[Math.floor(r()*m.n.length)],p:0,c:0,g:m.g})}save.daily={date:d,list,sp:[]}}
 if(!save.today||save.today.date!==d)save.today={date:d,count:0,bestKg:0,bestName:''};
 const w=weekKey();if(!save.weekly||save.weekly.week!==w||!Array.isArray(save.weekly.list)){const r=seeded('w'+w),pool=WT.slice(),list=[];while(list.length<3){const m=pool.splice(Math.floor(r()*pool.length),1)[0];list.push({t:m.t,n:m.n[Math.floor(r()*m.n.length)],p:0,c:0,g:m.g})}save.weekly={week:w,list,locs:[]}}}
const dexPct=()=>Math.floor(FISH.filter(f=>save.dex[f.id]).length/FISH.length*100);
const dexN=()=>FISH.filter(f=>save.dex[f.id]).length;
const bossWins=()=>BOSSES.filter(b=>save.boss[b.id]&&save.boss[b.id].win>0).length;
load();ensureDaily();
