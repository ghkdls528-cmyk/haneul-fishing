/* ================= 4.9 보물 낚시 · 시간 제한 도전 · 도감/장비 개선 · 다양성 보너스 ================= */
const TRE=[
 ['coin','옛날 동전','coin',1,90,30,'*','','바닷속에서 수백 년 잠든 엽전. 녹이 슬어도 반짝여요',0.6],
 ['letter','편지 든 유리병','bottle',1,120,24,'*','','누군가의 소원이 적힌 편지가 들어 있어요',0.8],
 ['map','낡은 보물 지도','scroll',2,230,14,'*','','X 표시가 된 아주 오래된 지도',0.3],
 ['pearl','진주','pearl',2,260,14,'pier,rock,light,reef,sea','','조개 속에서 자란 하얀 진주',0.4,'#fff6ee'],
 ['jade','비 오는 날의 비취','gem',3,550,6,'valley,lake','rain','비 내리는 민물에서만 반짝이는 비취',0.2,'#4ad08a'],
 ['celadon','청자 항아리','vase',3,460,8,'pier,rock,light,sea,deep','','옛 무역선에 실려 있던 귀한 청자',2.5],
 ['compass','해적의 나침반','compass',3,500,7,'light,sea,deep,moon,reef','','바늘이 늘 보물 쪽을 가리킨대요',0.5],
 ['ring','은빛 반지','ring',3,520,6,'*','','작은 보석이 박힌 반짝이는 반지',0.1,'#7fd0ff'],
 ['goldchest','황금 보물상자','chest',4,1500,2,'*','','금화가 가득 찬 묵직한 상자',12],
 ['blackpearl','흑진주','pearl',4,1100,3,'reef,deep,light,sea','night','밤에만 빛나는 검은 진주',0.4,'#3a3a54'],
 ['sapphire','바다 사파이어','gem',4,1200,3,'deep,moon,reef','','깊은 바다색을 닮은 보석',0.2,'#3a7aff'],
 ['amulet','폭풍의 부적','amulet',4,1300,4,'*','storm','폭풍우 속에서만 떠오르는 번개 부적',0.3],
 ['icebrooch','얼음꽃 브로치','gem',4,1100,4,'ice','','녹지 않는 얼음으로 만든 브로치',0.2,'#cff4ff'],
 ['crown','가라앉은 왕관','crown',5,3000,1.2,'*','fog','안개 낀 날, 옛 왕국의 왕관이 떠오른대요',3],
 ['moonpearl','달빛 진주','pearl',5,2800,1.5,'moon,light','night','달빛을 머금은 신비한 진주',0.5,'#d8ccff'],
 ['trident','용궁의 삼지창','trident',5,3500,.8,'deep,moon','','용왕이 쓰던 전설의 삼지창',9]
].map(([id,n,kind,r,val,w,loc,cond,d,kg,col])=>({id,n,kind,r,val,w,loc:loc==='*'?null:loc.split(','),cond,d,kg,col}));
const TREI={};TRE.forEach(t=>TREI[t.id]=t);
const TRE_COND={night:'🌙 밤',storm:'⛈️ 폭풍우',rain:'🌧️ 비',fog:'🌫️ 안개',snow:'❄️ 눈'};
function treCondOK(t){if(!t.cond)return true;const ph=clk().i;return t.cond==='night'?ph===3:t.cond==='storm'?weather==='storm':t.cond==='rain'?(weather==='rain'||weather==='storm'):weather===t.cond}
function treHere(){return TRE.filter(t=>(!t.loc||t.loc.includes(save.loc))&&treCondOK(t))}
function pickTre(){const L=treHere();if(!L.length)return null;const ws=L.map(t=>t.w*(fever>0&&t.r>=4?2:1)*(usedGoldB&&t.r>=4?3:1)*(t.cond?1.6:1));let r=Math.random()*ws.reduce((a,b)=>a+b,0);for(let i=0;i<L.length;i++){r-=ws[i];if(r<=0)return L[i]}return L[L.length-1]}
function makeTre(t){const f=makeFish(FID.chest);Object.assign(f,{tre:t.id,n:t.n,d:t.d,r:t.r,p:Math.min(5,1+t.r*.7),giant:false,v:'',kgv:t.kg});return f}
const _rollFish0=rollFish;rollFish=function(spot){if(save.mode==='treasure'&&!CH&&!practice&&!bossPending&&!(TEST&&window.__force)&&Math.random()<.6){const t=pickTre();if(t)return makeTre(t)}if(TEST&&window.__forceTre){const t=TREI[window.__forceTre];window.__forceTre=null;if(t)return makeTre(t)}return _rollFish0(spot)};
function treasureResult(){const f=fish,t=TREI[f.tre],rec=save.tre[t.id],isNew=!rec;let gold=Math.round(t.val*(1+save.lv*.02)*rnd(.9,1.1)*(fever>0?1.5:1));const xp=8+t.r*14;
 const R=save.tre[t.id]||(save.tre[t.id]={n:0,first:today(),loc:save.loc});R.n++;save.st.tre=(save.st.tre||0)+1;save.gold+=gold;mission('gold',gold);addXp(xp);
 lastRes={f,isNew,rec:false,gold,xp,feverStart:false,todayBest:false,released:false,bossMsg:'',tre:t};persist();hud();go('result');fillResult(lastRes,1,1);
 $('rName').textContent='💰 '+t.n;$('rCm').textContent='보물';$('rKg').textContent=fmtKg(t.kg);$('rDesc').textContent=t.d;
 $('rRec').textContent=isNew?'📜 새 보물 기록! 도감 › 보물에서 볼 수 있어요':`보물 기록 · ${R.n}번째`;
 $('rBadges').innerHTML=`<span class="tag" style="background:${RAR[t.r].c}">${RAR[t.r].n} ${'★'.repeat(t.r)}</span><span class="tag" style="background:#ffd23f">💰 보물</span>`+(isNew?'<span class="tag">NEW 보물</span>':'')+(t.cond?`<span class="tag red">${TRE_COND[t.cond]} 한정</span>`:'');
 flash=t.r>=4?1:.4;flashCol='255,215,90';sparkle(W/2,H*.36,30+t.r*14,['#ffe066','#fff','#ffb020','#fff3a0']);if(t.r>=4){SFX.legend&&SFX.legend();notice(`💎 ${RAR[t.r].n} 보물 「${t.n}」 발견!`)}else SFX.coin();
 resultLock=.6;reveal(f,()=>{$('result').classList.add('on');$('result').classList.toggle('lite',false)})}
/* 보물 그림 (코드 그래픽) */
function drawTreasure(c,t,x,y,s,tm){const k=t.kind,col=t.col||'#fff';c.save();c.translate(x,y);c.scale(s,s);c.lineJoin='round';c.lineCap='round';const OLc='#3b2a1a';c.strokeStyle=OLc;c.lineWidth=2.2;
 const gold=(a,b)=>{const g=c.createLinearGradient(a,-30,b,30);g.addColorStop(0,'#fff2a0');g.addColorStop(.45,'#ffc531');g.addColorStop(1,'#b8790f');return g};
 const shine=(px,py,r)=>{c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.ellipse(px,py,r,r*.55,-.6,0,7);c.fill()};
 if(k==='coin'){c.fillStyle=gold(-30,30);c.beginPath();c.arc(0,0,30,0,7);c.fill();c.stroke();c.strokeStyle='#a8700e';c.lineWidth=2;c.beginPath();c.arc(0,0,23,0,7);c.stroke();c.fillStyle='#8a5a10';c.fillRect(-7,-7,14,14);c.fillStyle='#ffd860';c.fillRect(-4,-4,8,8);c.fillStyle='rgba(60,120,90,.35)';c.beginPath();c.arc(14,12,9,0,7);c.fill();shine(-12,-14,7)}
 else if(k==='bottle'){const g=c.createLinearGradient(-20,0,20,0);g.addColorStop(0,'rgba(140,220,200,.6)');g.addColorStop(.5,'rgba(220,255,245,.75)');g.addColorStop(1,'rgba(100,190,170,.6)');c.fillStyle=g;c.beginPath();c.moveTo(-8,-34);c.lineTo(8,-34);c.lineTo(8,-20);c.quadraticCurveTo(20,-14,20,0);c.lineTo(20,28);c.quadraticCurveTo(20,34,12,34);c.lineTo(-12,34);c.quadraticCurveTo(-20,34,-20,28);c.lineTo(-20,0);c.quadraticCurveTo(-20,-14,-8,-20);c.closePath();c.fill();c.stroke();
  c.fillStyle='#b07a48';c.fillRect(-7,-42,14,10);c.strokeRect(-7,-42,14,10);c.fillStyle='#f4e4c0';c.save();c.rotate(.15);c.fillRect(-10,-6,18,30);c.strokeStyle='#a08050';c.lineWidth=1;c.strokeRect(-10,-6,18,30);c.strokeStyle='#e05a5a';c.beginPath();c.moveTo(-10,8);c.lineTo(8,8);c.stroke();c.restore();shine(-12,-2,4)}
 else if(k==='scroll'){c.fillStyle='#f0dca8';c.beginPath();c.moveTo(-34,-18);c.lineTo(30,-22);c.lineTo(34,20);c.lineTo(-30,24);c.closePath();c.fill();c.stroke();c.fillStyle='#d8bc80';for(const xx of[-34,32]){c.beginPath();c.ellipse(xx,0,6,24,0,0,7);c.fill();c.stroke()}
  c.strokeStyle='#8a6a40';c.lineWidth=1.5;c.setLineDash([3,3]);c.beginPath();c.moveTo(-22,12);c.quadraticCurveTo(-6,-14,12,4);c.stroke();c.setLineDash([]);c.strokeStyle='#e0403a';c.lineWidth=3;c.beginPath();c.moveTo(10,-2);c.lineTo(20,8);c.moveTo(20,-2);c.lineTo(10,8);c.stroke();c.fillStyle='#4a8a5a';c.beginPath();c.ellipse(-20,-6,6,4,0,0,7);c.fill()}
 else if(k==='pearl'){c.fillStyle='#e8b8c8';c.beginPath();c.moveTo(-36,10);c.quadraticCurveTo(0,40,36,10);c.lineTo(-36,10);c.fill();c.stroke();c.fillStyle='#f4d0dc';c.beginPath();c.moveTo(-34,6);c.quadraticCurveTo(-30,-34,0,-34);c.quadraticCurveTo(30,-34,34,6);c.closePath();c.fill();c.stroke();c.strokeStyle='rgba(160,90,110,.5)';c.lineWidth=1.5;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(0,4);c.lineTo(i*14,-28);c.stroke()}
  const pg=c.createRadialGradient(-5,-1,2,0,6,16);pg.addColorStop(0,'#fff');pg.addColorStop(.55,col);pg.addColorStop(1,hexMix(col,'#000000',.35));c.fillStyle=pg;c.strokeStyle=OLc;c.lineWidth=2;c.beginPath();c.arc(0,8,15,0,7);c.fill();c.stroke();shine(-5,2,4)}
 else if(k==='vase'){const g=c.createLinearGradient(-26,0,26,0);g.addColorStop(0,'#5f9a8a');g.addColorStop(.45,'#a8d8c8');g.addColorStop(1,'#4a7a6a');c.fillStyle=g;c.beginPath();c.moveTo(-10,-34);c.lineTo(10,-34);c.lineTo(8,-26);c.quadraticCurveTo(30,-18,26,8);c.quadraticCurveTo(22,32,12,36);c.lineTo(-12,36);c.quadraticCurveTo(-22,32,-26,8);c.quadraticCurveTo(-30,-18,-8,-26);c.closePath();c.fill();c.stroke();
  c.strokeStyle='rgba(40,80,70,.5)';c.lineWidth=1;[[-12,-6,-4,6],[4,-14,14,0],[-6,14,6,22],[10,10,18,18]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke()});c.strokeStyle='#e8f8f0';c.lineWidth=1.5;c.beginPath();c.arc(0,4,8,0,7);c.stroke();c.beginPath();c.moveTo(-6,-2);c.quadraticCurveTo(0,10,6,-2);c.stroke();shine(-14,-8,5)}
 else if(k==='compass'){c.fillStyle=gold(-30,30);c.beginPath();c.arc(0,0,30,0,7);c.fill();c.stroke();c.fillStyle='#fdf6e4';c.beginPath();c.arc(0,0,23,0,7);c.fill();c.stroke();c.fillStyle=gold(-6,6);c.fillRect(-5,-38,10,9);c.strokeRect(-5,-38,10,9);
  c.save();c.rotate(Math.sin((tm||0)*2)*.4+.3);c.fillStyle='#e0403a';c.beginPath();c.moveTo(0,-19);c.lineTo(5,0);c.lineTo(-5,0);c.closePath();c.fill();c.fillStyle='#4a5a7a';c.beginPath();c.moveTo(0,19);c.lineTo(5,0);c.lineTo(-5,0);c.closePath();c.fill();c.restore();c.fillStyle=OLc;c.beginPath();c.arc(0,0,3,0,7);c.fill();c.font='bold 8px sans-serif';c.textAlign='center';c.fillText('N',0,-12+-6);shine(-14,-14,5)}
 else if(k==='ring'){c.lineWidth=9;c.strokeStyle=OLc;c.beginPath();c.ellipse(0,8,24,20,0,0,7);c.stroke();c.lineWidth=6;const g=c.createLinearGradient(-24,0,24,0);g.addColorStop(0,'#c8d0dc');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#8a94a4');c.strokeStyle=g;c.stroke();
  c.lineWidth=2.2;c.strokeStyle=OLc;c.fillStyle=col;c.beginPath();c.moveTo(0,-28);c.lineTo(12,-16);c.lineTo(0,-4);c.lineTo(-12,-16);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.moveTo(0,-26);c.lineTo(5,-18);c.lineTo(0,-16);c.closePath();c.fill()}
 else if(k==='gem'){const g=c.createLinearGradient(-26,-26,26,26);g.addColorStop(0,'#ffffff');g.addColorStop(.35,col);g.addColorStop(1,hexMix(col,'#000000',.45));c.fillStyle=g;c.beginPath();c.moveTo(-26,-8);c.lineTo(-14,-26);c.lineTo(14,-26);c.lineTo(26,-8);c.lineTo(0,30);c.closePath();c.fill();c.stroke();
  c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=1.2;c.beginPath();c.moveTo(-26,-8);c.lineTo(26,-8);c.moveTo(-14,-26);c.lineTo(-8,-8);c.lineTo(0,30);c.lineTo(8,-8);c.lineTo(14,-26);c.stroke();if(t.id==='icebrooch'){c.strokeStyle='#fff';c.lineWidth=2;for(let i=0;i<3;i++){c.save();c.translate(0,0);c.rotate(i*Math.PI/3);c.beginPath();c.moveTo(-9,0);c.lineTo(9,0);c.stroke();c.restore()}}shine(-10,-16,5)}
 else if(k==='amulet'){c.strokeStyle='#c8a050';c.lineWidth=2;c.beginPath();c.moveTo(-22,-36);c.quadraticCurveTo(0,-14,22,-36);c.stroke();c.strokeStyle=OLc;c.lineWidth=2.2;c.fillStyle='#3a4a7a';c.beginPath();c.arc(0,4,24,0,7);c.fill();c.stroke();c.strokeStyle=gold(-20,20);c.lineWidth=4;c.beginPath();c.arc(0,4,20,0,7);c.stroke();
  c.fillStyle='#ffe066';c.strokeStyle=OLc;c.lineWidth=1.5;c.beginPath();c.moveTo(4,-12);c.lineTo(-8,6);c.lineTo(0,6);c.lineTo(-4,20);c.lineTo(9,0);c.lineTo(1,0);c.closePath();c.fill();c.stroke();c.globalAlpha=.4+.3*Math.sin((tm||0)*6);c.fillStyle='#fff8b0';c.beginPath();c.arc(0,4,26,0,7);c.fill();c.globalAlpha=1}
 else if(k==='crown'){c.fillStyle=gold(-34,34);c.beginPath();c.moveTo(-34,22);c.lineTo(-34,-14);c.lineTo(-18,4);c.lineTo(0,-26);c.lineTo(18,4);c.lineTo(34,-14);c.lineTo(34,22);c.closePath();c.fill();c.stroke();c.fillStyle='#b8790f';c.fillRect(-34,14,68,8);c.strokeRect(-34,14,68,8);
  [[-34,-14,'#ff5a7a'],[0,-26,'#5ab0ff'],[34,-14,'#5ae0a0']].forEach(([a,b,cc])=>{c.fillStyle=cc;c.beginPath();c.arc(a,b,5,0,7);c.fill();c.stroke()});c.fillStyle='#e0403a';c.beginPath();c.arc(0,6,6,0,7);c.fill();c.stroke();c.fillStyle='rgba(80,140,110,.35)';c.beginPath();c.ellipse(-20,16,8,4,0,0,7);c.fill();shine(-20,-2,5)}
 else if(k==='trident'){c.fillStyle=gold(-10,10);c.fillRect(-4,-10,8,50);c.strokeRect(-4,-10,8,50);c.beginPath();c.moveTo(-24,-36);c.lineTo(-24,-10);c.lineTo(24,-10);c.lineTo(24,-36);c.lineTo(18,-20);c.lineTo(6,-20);c.lineTo(0,-44);c.lineTo(-6,-20);c.lineTo(-18,-20);c.closePath();c.fill();c.stroke();
  c.fillStyle='#5ae0ff';c.beginPath();c.arc(0,-12,5,0,7);c.fill();c.stroke();c.globalAlpha=.35+.25*Math.sin((tm||0)*3);c.strokeStyle='#8af0ff';c.lineWidth=3;c.beginPath();c.arc(0,-24,26,0,7);c.stroke();c.globalAlpha=1}
 else{c.restore();if(FID.chest)drawCritter(c,FID.chest,x,y,64*s,1,tm||0,{seed:1});if(t.id==='goldchest'){c.save();c.globalAlpha=.5+.3*Math.sin((tm||0)*4);c.fillStyle='#ffe066';for(let i=0;i<6;i++){c.beginPath();c.arc(x+(i-2.5)*10*s,y-26*s-(i%2)*6*s,2.5*s,0,7);c.fill()}c.restore()}return}
 c.restore()}
/* 결과 카드: 보물이면 전용 그림 */
const _drc0=drawResultCard;drawResultCard=function(t){if(lastRes&&lastRes.tre&&$('result').classList.contains('on')){const c=rcx,T0=lastRes.tre;c.clearRect(0,0,560,340);const bg=c.createRadialGradient(280,170,20,280,170,320);bg.addColorStop(0,'#fffdf2');bg.addColorStop(1,'#ffe9a8');c.fillStyle=bg;c.fillRect(0,0,560,340);
 c.save();c.translate(280,170);c.rotate(t*.3);c.fillStyle='#ffd23f';c.globalAlpha=.3;for(let i=0;i<14;i++){c.rotate(Math.PI/7);c.beginPath();c.moveTo(0,0);c.lineTo(400,-36);c.lineTo(400,36);c.fill()}c.restore();
 for(let i=0;i<10;i++){c.fillStyle=`rgba(255,240,150,${.5+.5*Math.sin(t*3+i)})`;const a=i/10*Math.PI*2+t*.5;c.beginPath();c.arc(280+Math.cos(a)*120,170+Math.sin(a)*90,3,0,7);c.fill()}
 drawTreasure(c,T0,280,170+Math.sin(t*2)*6,2.4,t);return}return _drc0(t)};
const LOC_GM={pier:1,rock:1,valley:1.35,light:1.35,lake:1.4,sea:1,reef:1.7,ice:2.2,deep:1.35,moon:1.35};
const _sr0=showResult;showResult=function(){if(fish&&fish.tre){treasureResult();return}const f=fish,isNew=f&&!save.dex[f.id]&&f.r>0;_sr0();if(!lastRes||lastRes.f!==f)return;
 // 4.9 다양성 보너스: 첫 발견 + 오늘 처음 잡은 종
 let extra=0;const tags=[];const lm=LOC_GM[save.loc]||1;if(lm>1&&f.r>0&&!f.boss){const b=Math.round(lastRes.gold*(lm-1));extra+=b;tags.push(`📍 지역 +${Math.round((lm-1)*100)}%`)}if(isNew&&!f.boss){const b=GOLD_BASE[f.r]*2;extra+=b;tags.push(`🆕 첫 발견 +${b}`)}
 const td=today();if(save.todaySp.d!==td)save.todaySp={d:td,ids:{}};if(f.r>0&&!f.boss){if(!save.todaySp.ids[f.id]){save.todaySp.ids[f.id]=1;const b=Math.round(lastRes.gold*.3);extra+=b;if(!isNew)tags.push(`🌱 오늘 처음 +${b}`)}}
 if(extra){save.gold+=extra;lastRes.gold+=extra;$('rGold').textContent='+'+lastRes.gold.toLocaleString();$('rRec').textContent=[$('rRec').textContent,...tags].filter(Boolean).join(' · ');persist();hud()}
 if(CH)chalCatch(f)};
/* ---------- 시간 제한 도전 ---------- */
let CH=null;const CH_SEC=90,CH_PTS=[0,100,180,350,700,1500,3000,2500];
function chalCatch(f){if(f.r<=0){CH.chain=0;toast('잡동사니 · 연속 끊김',800)}else{CH.chain++;const sz=SIZEC[f.sc]?SIZEC[f.sc].m:1,mul=1+.15*Math.min(CH.chain-1,10),pts=Math.round(CH_PTS[f.r]*sz*mul*(f.v?1.5:1));CH.score+=pts;CH.n++;toast(`+${pts.toLocaleString()}점${CH.chain>1?` · 연속 ${CH.chain} ×${mul.toFixed(2)}`:''}`,900)}
 chHud();setTimeout(()=>{if(CH&&S==='result'&&resultLock<=0){if(typeof rv!=='undefined'&&rv)revealSkip();$('bNext').click()}},1400);setTimeout(()=>{if(CH&&S==='result'){if(typeof rv!=='undefined'&&rv)revealSkip();if(resultLock<=0)$('bNext').click()}},2400)}
const _fail0=fail;fail=function(msg,kind){if(CH){CH.chain=0;chHud()}return _fail0(msg,kind)};
function startChal(){if(!['ready','fail'].includes(S)){toast('낚시가 끝난 뒤에 시작할 수 있어요',900);return}if(practice||bossPending){toast('지금은 시작할 수 없어요',900);return}closeSheet();CH={t:CH_SEC,score:0,n:0,chain:0};document.body.classList.add('chal');chHud();notice(`⏱️ 시간 제한 도전 시작! ${CH_SEC}초 동안 최대한 많이`);SFX.mission&&SFX.mission()}
function chHud(){let h=$('chHud');if(!h){h=document.createElement('div');h.id='chHud';document.body.appendChild(h)}if(!CH){h.style.display='none';return}h.style.display='';const s=Math.ceil(CH.t);h.innerHTML=`<b class="${s<=10?'hot':''}">⏱️ ${s}초</b><span>🏁 ${CH.score.toLocaleString()}점</span><span>🐟 ${CH.n}</span>${CH.chain>1?`<span>🔥 ${CH.chain}연속</span>`:''}<button id="chStop">그만</button>`;$('chStop').onclick=()=>{if(CH){CH.t=0;CH.quit=1}}}
let chLast=performance.now();setInterval(()=>{const now=performance.now(),dt=Math.min(.5,(now-chLast)/1000);chLast=now;if(!CH)return;const paused=document.hidden||$('sheet').classList.contains('on')||$('ward').classList.contains('on')||$('aq').classList.contains('on');if(!paused&&CH.t>0){const p=Math.ceil(CH.t);CH.t=Math.max(0,CH.t-dt);if(Math.ceil(CH.t)!==p){chHud();if(CH.t<=5&&CH.t>0)SFX.nibble&&SFX.nibble()}}
 if(CH.t<=0&&['ready','fail','charge'].includes(S)){if(S==='charge')go('ready');endChal()}},100);
function endChal(){const c=CH;CH=null;document.body.classList.remove('chal');chHud();const td=today(),R=save.chal;if(R.day!==td){R.day=td;R.dayBest=0;R.runs=0}
 R.runs++;R.total++;const full=R.runs<=3,newBest=c.score>R.best&&c.score>0,newDay=c.score>R.dayBest;let reward=Math.round(c.score*.5*(full?1:.25));if(newBest&&R.best>0)reward+=300;R.best=Math.max(R.best,c.score);R.dayBest=Math.max(R.dayBest,c.score);if(c.n>0)save.gold+=reward;else reward=0;persist();hud();
 let ov=$('chEnd');if(!ov){ov=document.createElement('div');ov.id='chEnd';document.body.appendChild(ov)}
 ov.innerHTML=`<div class="chbox"><h3>${c.quit?'도전 종료':'⏱️ 시간 끝!'}</h3><div class="chsc">${c.score.toLocaleString()}<small>점</small></div><p>🐟 ${c.n}마리${newBest?' · <b style="color:#e8504a">🏆 개인 최고 기록!</b>':newDay?' · <b>📅 오늘 최고 기록!</b>':''}</p><p>오늘 최고 ${R.dayBest.toLocaleString()} · 개인 최고 ${R.best.toLocaleString()}</p><p class="chrw">보상 🪙${reward.toLocaleString()} ${full?`<small>(오늘 ${R.runs}/3회 · 전액)</small>`:'<small>(오늘 3회 이후 25%)</small>'}</p><div class="chb"><button id="chAgain">다시 도전</button><button id="chOk" class="alt">확인</button></div></div>`;ov.classList.add('on');SFX[newBest?'bossWin':'reward']&&SFX[newBest?'bossWin':'reward'](4);
 $('chOk').onclick=()=>ov.classList.remove('on');$('chAgain').onclick=()=>{ov.classList.remove('on');startChal()}}
/* 도전 중 입질 빠르게: 대기 시간 계산 뒤 보정 */
/* ---------- 모드 선택 ---------- */
SH.mode={t:'낚시 모드',tabs:[]};
function modeHTML(){const m=save.mode,R=save.chal,td=today(),runs=R.day===td?R.runs:0,here=treHere(),got=Object.keys(save.tre).length;
 return`<div class="sum">원하는 방식으로 낚시해요. 보물 낚시는 계속 유지되고, 도전은 한 판(${CH_SEC}초)씩 진행돼요.</div>
 <div class="row ${m==='normal'&&!CH?'eq':''}"><div class="ic">🎣</div><div><b>일반 낚시</b><p>물고기를 낚아 도감을 채워요</p></div><button data-mact="normal" ${m==='normal'?'disabled':''}>${m==='normal'?'사용 중':'선택'}</button></div>
 <div class="row ${m==='treasure'?'eq':''}"><div class="ic">💰</div><div><b>보물 낚시</b><p>던질 때마다 60% 확률로 보물이 걸려요 · 물고기는 덜 나와요<br>지금 이곳의 보물 ${here.length}종 · 수집 ${got}/${TRE.length}</p></div><button data-mact="treasure" ${m==='treasure'?'disabled':''}>${m==='treasure'?'사용 중':'선택'}</button></div>
 <div class="row"><div class="ic">⏱️</div><div><b>시간 제한 도전</b><p>${CH_SEC}초 동안 최대한 많이! 희귀도·크기·연속 낚시로 점수 ↑ · 입질이 빨라져요<br>오늘 최고 ${R.day===td?R.dayBest.toLocaleString():0} · 개인 최고 ${R.best.toLocaleString()} · 오늘 보상 ${Math.min(runs,3)}/3회</p></div><button data-mact="chal">${CH?'진행 중':'시작'}</button></div>
 <div class="sec">💰 지금 이곳에서 나오는 보물</div>`+(here.length?here.map(t=>`<div class="row" style="grid-template-columns:48px 1fr auto"><div class="ic"><canvas width="96" height="96" data-tre="${t.id}" style="width:44px;height:44px"></canvas></div><div><b>${save.tre[t.id]?t.n:'???'}</b><p>${RAR[t.r].n} ${'★'.repeat(t.r)}${t.cond?' · '+TRE_COND[t.cond]+' 한정':''}</p></div><span>${save.tre[t.id]?'✅':''}</span></div>`).join(''):'<p>여기서는 지금 나오는 보물이 없어요</p>')}
function treHTML(){const got=TRE.filter(t=>save.tre[t.id]).length;return`<div class="sum">💰 보물 수집 ${got}/${TRE.length} · 누적 ${(save.st.tre||0)}개<div class="bar"><i style="width:${got/TRE.length*100}%"></i></div>낚시 모드에서 「보물 낚시」를 고르면 보물이 걸려요</div>`+
 TRE.map(t=>{const R=save.tre[t.id];const where=t.loc?t.loc.map(l=>(LOCS.find(x=>x.id===l)||{}).n||l).join('·'):'모든 낚시터';return`<div class="row ${R?'eq':''}" style="grid-template-columns:56px 1fr"><div class="ic"><canvas width="112" height="112" data-tre="${t.id}" style="width:52px;height:52px;${R?'':'filter:brightness(0) opacity(.35)'}"></canvas></div><div><b>${R?t.n:'??? '}</b> <span class="tag" style="background:${RAR[t.r].c}">${RAR[t.r].n}</span><p>${R?`${t.d} · ${R.n}개 · 첫 발견 ${R.first}`:`💡 ${where}${t.cond?' · '+TRE_COND[t.cond]+'일 때':''}`} · 가치 약 🪙${t.val.toLocaleString()}</p></div></div>`}).join('')}
function drawTreCells(){document.querySelectorAll('canvas[data-tre]').forEach(cv=>{const t=TREI[cv.dataset.tre],g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);drawTreasure(g,t,cv.width/2,cv.height/2+2,cv.width/112,0)})}
/* ---------- 도감: 검색·필터·정렬·선호·힌트 ---------- */
const DXF={q:'',r:-1,own:'all',sort:'base'};
const _dexList0=dexList;dexList=function(){let L=_dexList0();const q=DXF.q.trim();if(q)L=L.filter(f=>save.dex[f.id]&&f.n.includes(q));if(DXF.r>=0)L=L.filter(f=>f.r===DXF.r);if(DXF.own==='got')L=L.filter(f=>save.dex[f.id]);else if(DXF.own==='no')L=L.filter(f=>!save.dex[f.id]);
 const bc=f=>(save.best[f.id]||{}).cm||-1,bk=f=>(save.best[f.id]||{}).kg||-1;if(DXF.sort==='cm')L=L.slice().sort((a,b)=>bc(b)-bc(a));else if(DXF.sort==='kg')L=L.slice().sort((a,b)=>bk(b)-bk(a));else if(DXF.sort==='got')L=L.slice().sort((a,b)=>(save.dex[b.id]?1:0)-(save.dex[a.id]?1:0));else if(DXF.sort==='rare')L=L.slice().sort((a,b)=>b.r-a.r);return L};
function baitPref(f){const a=[],tg=f.tags||[];if(tg.includes('ceph'))a.push('에기');if(['zigzag','charge','jump'].includes(f.fm))a.push('메탈 루어');if(tg.includes('dom')||(f.m||'').includes('b'))a.push('새우 미끼');if((f.loc.includes('lake')||f.loc.includes('valley'))&&f.k==='fish'&&f.r<=3)a.push('떡밥');if(f.r===2||f.r===3)a.push('크릴 밑밥');if(!a.length)a.push('지렁이');return a.slice(0,2)}
function prefHTML(f){const ph=f.night?'🌙 밤':f.r>=3?'🌇 노을에 조금 더':'⏰ 언제나',wx=f.rain?'🌧️ 비':f.r>=3?'🌫️ 안개 때 조금 더':'☀️ 날씨 상관없음',meth=(f.m||'n').split('').map(c=>({n:'일반',f:'찌',b:'바닥',l:'루어',c:'원투',d:'심해'})[c]).filter(Boolean).join('·');
 const fk={...f,kgv:kgOf(f,(f.min+f.max)/2)},need=LINES.find(l=>fishPull(fk)<=l.max),risk=snapRisk(GS(),fk);
 const got=save.dex[f.id],locs=f.loc.map(l=>(LOCS.find(x=>x.id===l)||{}).n).filter(Boolean).join(', ');
 return`<p>⏱️ 선호 시간 ${ph} · 날씨 ${wx} · 🪱 추천 미끼 ${baitPref(f).join('·')}</p><p>🧵 추천 낚싯줄 ${need?need.n+' 이상':'전설의 실도 버거워요'} · 지금 장비 줄 위험도 <b>${risk}</b></p>`+(got?'':`<p style="background:#fff6d8;border-radius:10px;padding:6px 8px">💡 힌트: ${f.boss?'보스 도전으로만 만나요':f.hid?'특별한 조건에서만 나타나요 — 시간·날씨를 바꿔 가며 '+locs+'에 가 보세요':`${locs}에서 ${meth.split('·')[0]} 낚시로${f.night?', 밤에':''}${f.rain?', 비 올 때':''} · ${baitPref(f)[0]}를 써 보세요`}</p>`)}
const _dexHTML0=dexHTML;dexHTML=function(){if(sheet.tab==='tre')return treHTML();let h=_dexHTML0();if(sheet.sel){const f=FID[sheet.sel];h=h.replace('</div></div><div class="grid">',prefHTML(f)+'</div></div><div class="grid">')}
 const rc=[[-1,'전체'],[1,'일반'],[2,'고급'],[3,'희귀'],[4,'영웅'],[5,'전설'],[6,'신화'],[7,'히든'],[0,'잡동사니']].map(([r,n])=>`<button data-dxr="${r}" class="${DXF.r===r?'on':''}">${n}</button>`).join('');
 const bar=`<div class="dexf"><input id="dexQ" type="search" placeholder="🔍 발견한 물고기 이름 검색" value="${DXF.q.replace(/"/g,'')}" enterkeyhint="search"><select id="dexSort"><option value="base">기본 순서</option><option value="cm">큰 크기 순</option><option value="kg">무거운 순</option><option value="got">보유 먼저</option><option value="rare">희귀도 순</option></select><select id="dexOwn"><option value="all">전체</option><option value="got">보유</option><option value="no">미발견</option></select><div class="dxr">${rc}</div></div>`;
 return bar.replace(`value="${DXF.sort}"`,`value="${DXF.sort}" selected`).replace(`<option value="${DXF.own}">`,`<option value="${DXF.own}" selected>`)+h};
function dexRefresh(){const tmp=document.createElement('div');tmp.innerHTML=dexHTML();const ng=tmp.querySelector('.grid'),og=$('sbody').querySelector('.grid');if(ng&&og)og.innerHTML=ng.innerHTML;const ns=tmp.querySelectorAll('.sum')[0],os=$('sbody').querySelector('.sum');if(ns&&os)os.innerHTML=ns.innerHTML;$('sbody').querySelectorAll('[data-dxr]').forEach(b=>b.classList.toggle('on',+b.dataset.dxr===DXF.r))}
$('sbody').addEventListener('input',e=>{if(e.target.id==='dexQ'){DXF.q=e.target.value;dexRefresh()}});
$('sbody').addEventListener('change',e=>{if(e.target.id==='dexSort'){DXF.sort=e.target.value;dexRefresh()}else if(e.target.id==='dexOwn'){DXF.own=e.target.value;dexRefresh()}});
$('sbody').addEventListener('click',e=>{const r=e.target.closest('[data-dxr]');if(r){DXF.r=+r.dataset.dxr;dexRefresh();return}const m=e.target.closest('[data-mact]');if(m&&!m.disabled){const a=m.dataset.mact;if(a==='chal'){if(!CH)startChal();return}save.mode=a;persist();toast(a==='treasure'?'💰 보물 낚시 모드':'🎣 일반 낚시 모드',900);modeChip();renderSheet();SFX.click&&SFX.click()}},true);
SH.dex.tabs=SH.dex.tabs.concat([['tre','💰 보물']]);
const _rs0=renderSheet;renderSheet=function(){if(sheet.k==='mode'){$('sTitle').textContent=SH.mode.t;$('sTabs').innerHTML='';$('sTabs').style.display='none';$('sbody').innerHTML=modeHTML();requestAnimationFrame(drawTreCells);return}_rs0();if(sheet.k==='dex'&&sheet.tab==='tre')requestAnimationFrame(drawTreCells)};
/* 모드 칩 */
function modeChip(){let b=$('cMode');if(!b){b=document.createElement('button');b.id='cMode';b.setAttribute('aria-label','낚시 모드 바꾸기');$('chips').appendChild(b);b.onclick=()=>{audio&&audio();if(['fight','bite','hook','land'].includes(S)){toast('낚시 중엔 바꿀 수 없어요',900);return}openSheet('mode')}}b.textContent=CH?'⏱️ 도전 중':save.mode==='treasure'?'💰 보물 낚시':'🎮 모드';b.classList.toggle('hot',save.mode==='treasure'||!!CH)}
setInterval(modeChip,500);
/* ---------- 장비: 장단점·추천 ---------- */
function gearProsCons(cat,it){const L=GLIST[cat],cur=L.find(x=>x.id===save.gear[cat]),keys={rod:[['dist','캐스팅 거리'],['pow','제압력'],['stab','장력 안정성'],['crit','크리티컬'],['big','대형어 대응']],reel:[['spd','회수 속도'],['eff','손맛 구간'],['tred','장력 증가 감소'],['fat','지친 물고기 보너스'],['crx','크리티컬 추가']],line:[['max','최대 장력'],['grace','끊김 버팀'],['sres','돌진 대응'],['rec','장력 회복'],['big','대형어 대응']]}[cat];
 const pros=[],cons=[];for(const[k,n]of keys){const a=cur[k]||0,b=it[k]||0;if(b>a)pros.push(n);else if(b<a)cons.push(n)}
 if(it.id===cur.id)return'<div class="eff" style="background:#f4f8ff">✅ 지금 장착한 장비예요</div>';
 const pr=it.price-(save.gown[it.id]?it.price:0);if(!save.gown[it.id]&&pr>save.gold)cons.push(`골드 ${(pr-save.gold).toLocaleString()} 부족`);
 const tier=+it.id.slice(1),ct=+cur.id.slice(1);if(tier>ct&&!save.gown[it.id])cons.push(`강화비 단계당 🪙${enhCost(it,0).toLocaleString()}부터`);
 const use={rod:['선착장·갯바위 근거리','방파제·계곡','먼바다 원투·대형어','심해·보스'],reel:['작은 물고기 빠르게','손맛 구간 넓게 · 루어','지친 대형어 마무리','보스 장기전'],line:['일반 물고기','돌진하는 사냥꾼','대형 회유어','초대형·보스']}[cat][Math.min(3,Math.floor(tier*.7))];
 return`<div class="eff" style="background:#fbfff4">👍 장점: ${pros.length?pros.join(', '):'지금보다 나은 점 없음'}<br>👎 단점: ${cons.length?cons.join(', '):'없음'}<br>🎯 이런 낚시에 좋아요: ${use}</div>`}
const _gearHTML0=gearHTML;gearHTML=function(cat){const h=_gearHTML0(cat),L=GLIST[cat],sel=gsel[cat]||save.gear[cat],it=L.find(x=>x.id===sel);return h.replace('<div class="gbtn">',gearProsCons(cat,it)+'<div class="gbtn">')};
/* ---------- 4.9 업적 ---------- */
[['t1','보물','첫 보물','보물 1개 건지기',s=>(s.st.tre||0)>=1,300],['t2','보물','보물 사냥꾼','보물 8종 모으기',s=>Object.keys(s.tre||{}).length>=8,4000,'보물 사냥꾼'],['t3','보물','용궁의 주인','보물 16종 모두 모으기',s=>TRE.every(t=>(s.tre||{})[t.id]),20000,'용궁의 주인'],
 ['h1','도전','첫 도전','시간 제한 도전 완료',s=>(s.chal||{}).total>=1,300],['h2','도전','스피드 낚시꾼','도전 3,000점',s=>(s.chal||{}).best>=3000,2000,'스피드 낚시꾼'],['h3','도전','번개 손','도전 8,000점',s=>(s.chal||{}).best>=8000,6000,'번개 손']]
 .forEach(([id,c,n,d,ok,g,title])=>ACH.push({id,c,n,d,ok:sv=>{try{return!!ok(sv)}catch(e){return false}},g,title}));
if(TEST)Object.defineProperties(window.__w,{CH:{get(){return CH}},TRE:{value:TRE},DXF:{value:DXF},startChal:{value:startChal}});
