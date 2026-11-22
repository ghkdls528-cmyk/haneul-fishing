/* ================= 세계 상태 ================= */
let S='title',T=0,gt=save.gt||30,weather='clear',wTimer=rnd(80,140),rainAmt=0,snowAmt=0,stormAmt=0,cloudAmt=.3;
let castM=0,practice=null,power=0,holding=false,idleT=0,combo=0,fever=0,goldenT=0,legendT=0,wishT=0,evT=rnd(18,30),jumpEv=null,school=null,shake=0,flash=0,flashCol='255,255,255',slowmo=0,lightning=0,zoom=0;
let bob={x:0,y:0,sx:0,tx:0,dip:0,dx:0,on:false},fish=null,fg={},app=null,lastRes=null,resultLock=0,usedGoldB=false,bossPending=null,curDepth=0,tourn=null,tipShake=0;
const parts=[],crit=[],rings=[],drops=[],gulls=[],clouds=[],shadows=[],meteors=[],flakes=[];
for(let i=0;i<5;i++)clouds.push({x:Math.random(),y:rnd(.08,.5),s:rnd(.6,1.3),v:rnd(.004,.012)});
for(let i=0;i<3;i++)shadows.push({x:Math.random(),y:Math.random(),v:rnd(.02,.05)*(Math.random()<.5?-1:1),s:rnd(30,60)});
function curLoc(){return LOCS.find(l=>l.id===save.loc)||LOCS[0]}
const clk=()=>{if(curLoc().night)return{i:3,f:.5,c:3.5};const c=(gt/(DAY/4))%4,i=Math.floor(c);return{i,f:c-i,c}};
const isNight=()=>clk().i===3;
function hexMix(a,b,k){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A1=p(a),B1=p(b);return'#'+A1.map((v,i)=>Math.round(v+(B1[i]-v)*k).toString(16).padStart(2,'0')).join('')}
function pal(){const{i,f}=clk(),j=(i+1)%4,k=clamp((f-.8)/.2,0,1),w=curLoc().w,o={};
 o.top=hexMix(PAL.sky[i].top,PAL.sky[j].top,k);o.bot=hexMix(PAL.sky[i].bot,PAL.sky[j].bot,k);const wa=PAL[w]||PAL.sea;o.sea=hexMix(wa[i][0],wa[j][0],k);o.deep=hexMix(wa[i][1],wa[j][1],k);
 if(w==='moon'){o.top='#120c3a';o.bot='#3a2a7a'}
 if(w==='ice'&&i<3){o.bot=hexMix(o.bot,'#ffffff',.4)}
 const dk=Math.max(rainAmt,stormAmt);if(dk>0){o.top=hexMix(o.top,stormAmt>.3?'#3a4250':'#6f7f8c',dk*.65);o.bot=hexMix(o.bot,'#9aa6ae',dk*.6);o.sea=hexMix(o.sea,'#3c5a6a',dk*.4)}
 if(snowAmt>0){o.top=hexMix(o.top,'#c8d4e0',snowAmt*.5)}
 return o}
function G(){const top=TOP,nav=NAV,l=curLoc(),deep=l.id==='deep',surf=top+(H-top-nav)*(deep?.26:W>H*1.2?.42:.44);
 const ch=Math.min(W*.4,230,(surf-top-6)/1.22)*(deep?.85:1),cx=Math.max(W*.13,ch*(l.plat==='boat'?.46:.6));
 const boat=l.plat==='boat',bb=boat?Math.sin(gt*1.3)*(stormAmt>.3?8:4):0;
 const lift={pier:.06,rock:.2,light:.16,boat:.1,stone:.18,dock:.07,beach:.12,ice:.02}[l.plat]||.08;
 const edge=Math.max(W*.33,cx+ch*(boat?.5:.64));
 return{top,nav,surf,bed:H-nav-2,ch,cx,edge,platY:surf-ch*lift+bb,bb}}

/* ================= 확률 ================= */
const MCODE={basic:'n',float:'f',bottom:'b',lure:'l',cast:'c',deep:'d'};
function condOK(f){const ph=clk().i,L0=save.loc;switch(f.hid){
 case 'moonj':return ph===3&&weather!=='rain'&&weather!=='storm'&&L0==='light';
 case 'rainbow':return ph===2&&(weather==='rain'||weather==='storm');
 case 'deep300':return save.method==='deep'&&curDepth>=250;
 case 'snownight':return L0==='ice'&&weather==='snow'&&ph===3;
 case 'meteor':return wishT>0||meteors.length>0||weather==='meteor';
 case 'goldcarp':return goldenT>0;
 case 'ghost':return ph===3&&(weather==='rain'||weather==='storm');
 case 'storm':return weather==='storm';}return true}
function weights(far,spotRare){const night=isNight(),bait=save.bait,ph=clk().i,meth=save.method,code=MCODE[meth];
 return FISH.map(f=>{if(!f.loc.includes(save.loc)||f.boss)return 0;let w=f.w;
  if(f.hid)w=condOK(f)?(f.r===7?1.6:1):0;
  if(f.night)w=night?Math.max(w,.6)*f.night:w;
  if(f.rain&&(weather==='rain'||weather==='storm'))w*=f.rain;
  if(meth!=='basic'){if(f.m.includes(code))w*=2.5;else if(f.r>0)w*=.35}else if(f.m==='d')w*=.05;
  if(meth==='deep'){if(f.depth)w*=curDepth+(bait==='deepb'?100:0)>=f.depth?2:.04;else if(!f.m.includes('d')&&f.r>0)w*=.2}
  else if(f.m==='d')w*=.08;
  if((far||meth==='cast')&&f.far)w*=meth==='cast'?2.5:2;if(far&&f.r<=1)w*=.6;
  if(save.wear.boat==='yacht'&&f.far)w*=1.3;
  const tg=f.tags;
  if(bait==='worm')w=Math.pow(w,.75);
  if(bait==='shrimpb'&&(tg.includes('dom')||f.m.includes('b')))w*=2.2;
  if(bait==='squidb'&&tg.includes('pred')&&f.r>=3)w*=2.5;
  if(bait==='deepb'&&f.m.includes('d'))w*=4;
  if(bait==='lure'){if(['zigzag','charge','jump'].includes(f.fm))w*=2.5;else if(f.r<=1)w*=.6}
  if(bait==='krill'&&(f.r===2||f.r===3))w*=1.3;
  if(bait==='egi'&&tg.includes('ceph'))w*=3.5;
  if(bait==='paste'&&(f.loc.includes('lake')||f.loc.includes('valley'))&&f.k==='fish'&&f.r<=3)w*=2.5;
  if(usedGoldB&&f.r>=4)w*=3;if(f.hid&&w>0)w*=(usedGoldB?2:1)*(fever>0?2:1);
  if(ph===2&&f.r>=3)w*=1.25;
  if(weather==='fog'&&f.r>=3)w*=1.35;
  if(fever>0&&f.r>=3)w*=1.5;if(goldenT>0&&(f.id==='gold'||f.id==='goldfish'))w*=5;if(legendT>0&&f.r>=5)w*=3;if(wishT>0&&f.r>=3)w*=1.5;if(spotRare&&f.r>=3)w*=2;
  return Math.max(0,w)})}
function pickFrom(ws){const tot=ws.reduce((a,b)=>a+b,0);let r=Math.random()*tot,i=0;for(;i<ws.length;i++){r-=ws[i];if(r<=0&&ws[i]>0)break}return FISH[Math.min(i,FISH.length-1)]}
const SIZEC=[{n:'소형',m:.8},{n:'일반형',m:1},{n:'대형',m:1.3},{n:'초대형',m:2.5}];
function makeFish(f,opt={}){const k=Math.random()**1.6;let size=f.min+(f.max-f.min)*k,giant=false,v='';const fv=fever>0?3:1;
 const can=f.r>=1&&!['chest','clam'].includes(f.k)&&!f.boss;if(save.bait==='squidb'&&f.r>=3)size=f.min+(f.max-f.min)*Math.random()**.8;
 if(can&&Math.random()<(.03*(usedGoldB?2:1)+(goldenT>0?.02:0)+(opt.spot?.01:0))){giant=true;size=f.max*rnd(1.4,1.9)}
 if(can&&!f.hid){const m=(usedGoldB?2:1)*(wishT>0?1.5:1)*fv;const r=Math.random();if(r<.006*m*(goldenT>0?6:1))v='gold';else if(r<.006*m*(goldenT>0?6:1)+.012*m)v='mut';else if(r<.006*m*(goldenT>0?6:1)+.021*m)v='albino'}
 size=Math.round(size);const pct=(size-f.min)/Math.max(1,f.max-f.min),sc=giant?3:pct<.2?0:pct<.75?1:2;
 const kg=kgOf(f,size);return{...f,size,giant,v,sc,pct:clamp(pct,0,1),kgv:+kg.toFixed(kg<10?2:1),p:Math.min(8,f.p+(giant?1:0))}}
function rollFish(spot){if(practice)return makeFish(FID[practice.id]);if(TEST&&window.__force){const id=window.__force;window.__force=null;return makeFish(FID[id])}if(bossPending){const f=FID[bossPending];return makeFish(f)}return makeFish(pickFrom(weights(castM>=45,spot)),{spot})}
function critL0(f){let L=f.k==='dwhale'?170:['whale','whaleking','orca','manta','kraken','oarfish'].includes(f.id)?155:['sunfish','tuna','hwangdara','dragon','marlin','swordfish','stormmarlin','hammer','dolphin','icesturgeon','sturgeon'].includes(f.id)?130:Math.min(110,Math.max(36,28+f.size*.6));return f.giant?L*1.35:f.boss?L*1.2:L}
function critL(f){const k=W>900&&H>600?1.25:1;return critL0(f)*k}

/* ================= 효과 ================= */
function toast(t,ms=1100){const e=$('toast');e.textContent=t;e.classList.remove('on');void e.offsetWidth;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),ms)}
const nq=[];let nOn=false;
function notice(t){if(!t||nq.includes(t))return;nq.push(t);while(nq.length>3)nq.shift();if(!nOn)nNext()}
function nNext(){if(document.body.classList.contains('busyF')&&nq.length){nOn=true;clearTimeout(nNext.w);nNext.w=setTimeout(nNext,300);return}const t=nq.shift();if(!t){nOn=false;return}nOn=true;const e=$('notice');e.textContent=t;e.classList.add('on');setTimeout(()=>{e.classList.remove('on');setTimeout(nNext,450)},nq.length?2000:2600)}
function bigText(t,sub,col){const e=$('big');e.innerHTML=`<b style="color:${col||'#ffe066'}">${t}</b>${sub?`<small>${sub}</small>`:''}`;e.classList.remove('on');void e.offsetWidth;e.classList.add('on');clearTimeout(bigText.h);bigText.h=setTimeout(()=>e.classList.remove('on'),1700)}
const PMAX=()=>LOWGFX?140:300;
function splash(x,y,n=14,sp=170,col='#d6f3ff'){for(let i=0;i<n&&parts.length<PMAX();i++)parts.push({x,y,vx:(Math.random()-.5)*sp,vy:-60-Math.random()*sp,l:.7+Math.random()*.45,t:0,c:col,r:2+Math.random()*3.5,g:1})}
function sparkle(x,y,n=20,cols=['#ffd23f','#fff','#ff9ec4']){for(let i=0;i<n&&parts.length<PMAX();i++){const a=Math.random()*6.28,s=60+Math.random()*180;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1.1,t:0,c:cols[i%cols.length],r:2+Math.random()*3.5,g:.25,star:1})}}
function ink(x,y,n=7){for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-.5)*30,y:y+(Math.random()-.5)*30,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,l:1.6,t:0,c:'rgba(40,25,60,.55)',r:10+Math.random()*10,g:0,grow:1})}
function ring(x,y,max=40,col='255,255,255',life=1){if(rings.length<40)rings.push({x,y,t:0,max,col,life})}
