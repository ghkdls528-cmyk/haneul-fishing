/* ================= 4.12 계절·강풍·불운 방지·희귀 입질·낚시터 이벤트·숨은 포인트·도감 수집 보상 ================= */
/* ---------- 계절 (4.22부터 게임 속 날짜로 흐름: 한 계절 = 게임 6일, 게임 하루 = DAY초) ---------- */
const SEASONS={spring:{n:'봄',ic:'🌸'},summer:{n:'여름',ic:'🌻'},autumn:{n:'가을',ic:'🍂'},winter:{n:'겨울',ic:'❄️'}};
const SEA_DAYS=6,SEA_ORD=['spring','summer','autumn','winter'];
function seasonInfo(){const d=Math.floor(Math.max(0,gt)/DAY),k=Math.floor(d/SEA_DAYS);return{id:SEA_ORD[k%4],day:d%SEA_DAYS+1,year:Math.floor(k/4)+1,left:SEA_DAYS-d%SEA_DAYS}}
function seasonNow(){if(TEST&&window.__season)return window.__season;return seasonInfo().id}
const seaKey=()=>'g'+seasonInfo().year+'-'+seasonNow();  // 제철 기록 키: 게임 속 해·계절
const SEAS={spring:['dodari','jjukkumi','ureok','bungeo','beodeul','jogi','hakgong','noraemi','gajami','crab','napjaru','pirami'],
 summer:['ojing','nongeo','mahi','bungjang','megi','jangeo','gomchi','nalchi','sunfish','jelly','butterfly','clown','ppaga'],
 autumn:['jeoneo','galchi','samchi','gamseong','mackerel','busiri','shrimp','eun','kkeokji','sancheon','gadara','trout'],
 winter:['bangeo','cod','pollock','bingeo','capelin','hongeo','gwangeo','char','kingcrab','icefish','byeongeo','ingeo']};
const SEAOF={};for(const s in SEAS)SEAS[s].forEach(id=>{if(FID[id])(SEAOF[id]=SEAOF[id]||[]).push(s)});
const SEA_IN=2.2,SEA_OFF=.5;
/* ---------- 낚시터 특징·이벤트 ---------- */
const LOCX={
 pier:{wx:'비·안개',tm:'아침',sea:'봄·가을',ev:['surge','surge','big'],tip:'초보 친구가 많아요. 가을엔 전어 떼!',sec:{t:'이곳에서 20마리 낚기',ok:s=>(s.reg.pier||{}).c>=20}},
 rock:{wx:'비·강풍',tm:'노을',sea:'가을·겨울',ev:['big','big','surge'],tip:'돔 종류의 고향. 대물 경보가 자주 울려요',sec:{t:'이곳에서 희귀 이상 5마리',ok:s=>(s.reg.rock||{}).r>=5}},
 valley:{wx:'비',tm:'아침',sea:'봄·여름',ev:['surge','surge','big'],tip:'비 오는 날 계곡 물고기가 신나요',sec:{t:'비 올 때 이곳에서 낚기',ok:s=>!!(s.secFlag||{}).valleyRain}},
 light:{wx:'안개·강풍',tm:'밤',sea:'여름·가을',ev:['surge','big','surge'],tip:'밤엔 오징어·갈치 떼가 몰려와요',sec:{t:'밤에 이곳에서 10마리',ok:s=>((s.secFlag||{}).lightNight||0)>=10}},
 lake:{wx:'안개',tm:'아침',sea:'봄·겨울',ev:['surge','big'],tip:'안개 낀 호수엔 희귀한 친구가 슬쩍',sec:{t:'안개 속에서 이곳 낚기',ok:s=>!!(s.secFlag||{}).lakeFog}},
 sea:{wx:'강풍·폭풍우',tm:'낮',sea:'여름·겨울',ev:['big','big','surge'],tip:'강풍이 불면 사냥꾼 물고기가 날뛰어요',sec:{t:'영웅 이상 3마리',ok:s=>((s.secFlag||{}).seaHero||0)>=3}},
 reef:{wx:'맑음',tm:'낮',sea:'여름',ev:['surge','surge','big'],tip:'맑은 여름날 열대어가 가득',sec:{t:'이곳 어종 15종 발견',ok:s=>locSpecies('reef').filter(f=>s.dex[f.id]).length>=15}},
 ice:{wx:'눈',tm:'밤',sea:'겨울',ev:['surge','big'],tip:'겨울·눈 오는 날이 제철',sec:{t:'눈 올 때 이곳 낚기',ok:s=>!!(s.secFlag||{}).iceSnow}},
 deep:{wx:'상관없음',tm:'상관없음',sea:'사계절',ev:['big','surge'],tip:'깊이 내릴수록 기묘한 친구들',sec:{t:'심해 200m 이상에서 낚기',ok:s=>!!(s.secFlag||{}).deep200}},
 moon:{wx:'맑음',tm:'밤',sea:'사계절',ev:['big','surge'],tip:'신화의 바다. 별똥별을 노려요',sec:{t:'신화 등급 1마리',ok:s=>(s.st.myth||0)>=1}}};
let EVT=null,evtNext=rnd(70,120);
/* ---------- 확률 보정: 계절·강풍·불운 방지·숨은 포인트·이벤트 ---------- */
function pityMul(){const d=save.dry||0;return d<10?1:Math.min(3,1+(d-10)*.1)}
const _weights0=weights;weights=function(far,spot){const ws=_weights0(far,spot),sn=seasonNow(),pm=pityMul(),sec=save.secret[save.loc];
 return ws.map((w,i)=>{if(!w)return 0;const f=FISH[i];if(f.boss)return w;const so=SEAOF[f.id];if(so)w*=so.includes(sn)?SEA_IN:SEA_OFF;
  if(weather==='wind'&&(f.tags||[]).includes('pred'))w*=1.6;
  if(f.r>=3&&f.r<=6){w*=pm;if(sec)w*=1.25}
  if(EVT&&EVT.k==='surge'&&EVT.id===f.id)w*=5;return w})};
const _rollFish1=rollFish;rollFish=function(spot){if(!practice&&!bossPending&&!CH&&(save.dry||0)>=30&&!(TEST&&(window.__force||window.__forceTre))){const ws=weights(castM>=45,spot).map((w,i)=>FISH[i].r>=3&&FISH[i].r<=5?w:0);if(ws.some(Boolean)){save.dry=0;setTimeout(()=>notice('🔮 바다가 술렁여요… 희귀한 친구가 다가왔어요!'),200);const f=makeFish(pickFrom(ws),{spot});f._sure=1;return f}}
 const f=_rollFish1(spot);if(EVT&&EVT.k==='big'&&f&&f.r>0&&!f.boss&&!f.tre&&Math.random()<.6){const g2=makeFish(FID[f.id],{spot});if(g2.size>f.size)return g2}return f};
/* ---------- 희귀 입질 연출 ---------- */
let rareFx=0,rareCol='255,210,90';
setInterval(()=>{if(S==='bite'&&fish&&fish.r>=4&&!fish._fx&&!fish.tre){fish._fx=1;rareFx=1.3;rareCol=fish.r>=6?'255,120,210':fish.r===7?'90,240,220':fish.r===5?'255,210,90':'255,140,80';
 toast(fish.r>=6?'🌈‼️ 심상치 않은 입질!!':fish.r===5?'🌟‼️ 엄청나게 묵직한 입질!':'‼️ 묵직한 입질!',900);vib&&vib([40,30,80]);if(SFX.warn)SFX.warn();if(fish.r>=5&&SFX.legend)setTimeout(()=>SFX.legend(),150)}},60);
/* ---------- 결과 후처리: 불운 카운터·최초 발견·계절 기록·이벤트 보상·숨은 포인트 ---------- */
const _sr1=showResult;showResult=function(){const f=fish;if(!f)return _sr1();const isNew=f.r>0&&!save.dex[f.id]&&!f.tre,L0=save.loc,ph=clk().i;_sr1();
 if(f.tre||practice)return;if(f.r>=3&&!f.boss)save.dry=0;else if(!f.boss)save.dry=(save.dry||0)+1;
 if(isNew)save.first[f.id]={d:today(),loc:L0,cm:f.size,w:weather,s:seasonNow()};
 if(f.r>0){const key=seaKey();const sc=save.seasonLog[key]||(save.seasonLog[key]={ids:{},done:0});if((SEAOF[f.id]||[]).includes(seasonNow()))sc.ids[f.id]=1}
 const sf=save.secFlag;if(L0==='valley'&&(weather==='rain'||weather==='storm'))sf.valleyRain=1;if(L0==='light'&&ph===3)sf.lightNight=(sf.lightNight||0)+1;if(L0==='lake'&&weather==='fog')sf.lakeFog=1;if(L0==='sea'&&f.r>=4)sf.seaHero=(sf.seaHero||0)+1;if(L0==='ice'&&weather==='snow')sf.iceSnow=1;if(L0==='deep'&&curDepth>=200)sf.deep200=1;
 const X=LOCX[L0];if(X&&!save.secret[L0]&&X.sec.ok(save)){save.secret[L0]=1;setTimeout(()=>{notice(`🗺️ 숨은 포인트 발견! ${curLoc().n} · 희귀 이상 +25%`);SFX.legend&&SFX.legend();flash=.6;flashCol='160,255,200'},1600)}
 if(EVT&&f.r>0){if(EVT.k==='surge'&&f.id===EVT.id){const b=Math.round(lastRes.gold*.5);save.gold+=b;lastRes.gold+=b;EVT.got++;$('rGold').textContent='+'+lastRes.gold.toLocaleString();$('rRec').textContent+=` · 🐟 떼 보너스 +${b}`}
  if(EVT.k==='big'){const pct=(f.size-f.min)/Math.max(1,f.max-f.min);if(pct>EVT.best){EVT.best=pct;EVT.bn=f.n;$('rRec').textContent+=` · 📏 대물 기록 ${Math.round(pct*100)}%`}}}
 if(isNew&&f.r>=5){$('rRec').textContent='🎉 세계 최초… 아니, 내 도감 최초의 '+RAR[f.r].n+'! · '+$('rRec').textContent}
 persist();hud()};
/* ---------- 낚시터 이벤트 스케줄 ---------- */
function startEvt(){const L0=save.loc,X=LOCX[L0];if(!X)return;const k=X.ev[Math.floor(Math.random()*X.ev.length)];
 if(k==='surge'){const pool=locSpecies(L0).filter(f=>f.r>=1&&f.r<=4&&!f.hid&&!f.boss&&!f.tre);if(!pool.length)return;const sn=seasonNow(),pref=pool.filter(f=>(SEAOF[f.id]||[]).includes(sn)),pk=(pref.length&&Math.random()<.6?pref:pool);const f=pk[Math.floor(Math.random()*pk.length)];EVT={k,id:f.id,n:f.n,t:75,got:0,loc:L0};notice(`🐟 ${f.n} 떼가 몰려왔어요! 75초 동안 5배 · 골드 +50%`)}
 else{EVT={k:'big',t:60,best:0,bn:'',loc:L0};notice('📏 대물 경보! 60초 동안 큰 물고기가 잘 나와요 · 가장 큰 기록으로 보상')}
 SFX.mission&&SFX.mission();save.st.evt=(save.st.evt||0)+1}
function endEvt(){const e=EVT;EVT=null;if(!e)return;if(e.k==='big'){const g=e.best>=.85?1200:e.best>=.65?600:e.best>0?200:0;if(g){save.gold+=g;save.st.bigEv=(save.st.bigEv||0)+(e.best>=.85?1:0);notice(`📏 대물 경보 끝! 최고 ${e.bn} ${Math.round(e.best*100)}% · 보상 🪙${g}`);SFX.coin()}else notice('📏 대물 경보가 끝났어요')}else notice(`🐟 ${e.n} 떼가 지나갔어요${e.got?` · ${e.got}마리!`:''}`);persist();hud()}
let evLast=performance.now();setInterval(()=>{const now=performance.now(),dt=Math.min(1,(now-evLast)/1000);evLast=now;if(!inGame()||document.hidden||CH||bossPending||practice||tourn)return;
 if(EVT){if(EVT.loc!==save.loc){EVT=null;return}EVT.t-=dt;if(EVT.t<=0&&!['fight','hook','land','bite'].includes(S))endEvt();return}
 if(!['ready','wait','cast'].includes(S))return;evtNext-=dt;if(evtNext<=0){evtNext=rnd(130,220);startEvt()}},250);
/* ---------- 강풍 ---------- */
for(const id of['pier','rock','light','sea','reef']){const l=LOCS.find(x=>x.id===id);if(l&&!l.wx.includes('wind'))l.wx.push('wind')}
const _sw0=setWeather;setWeather=function(w,ann){const prev=weather;_sw0(w,ann);if(ann&&w==='wind'&&prev!=='wind')notice('🌬️ 강풍이 불어요 · 사냥꾼 물고기 1.6배, 찌가 흔들려요')};
/* ---------- 계절·강풍·희귀 연출 그리기 ---------- */
const SPT=[];for(let i=0;i<14;i++)SPT.push({x:Math.random(),y:Math.random(),s:Math.random(),r:Math.random()*6});
let rareShadowT=0;
const _lf0=lifeFront;lifeFront=function(g,t){_lf0(g,t);drawClutch();const sn=seasonNow(),wd=weather==='wind'?1:0;
 /* 4.26 계절 입자는 06x_v426.js에서 새로 그림 */
 if(wd&&!LOWGFX){ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1.5;for(let i=0;i<8;i++){const x=((t*260+i*W*.31)%(W+200))-100,y=g.top+30+(i*53)%(g.surf-g.top-20);ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+30,y-4,x+60,y);ctx.stroke()}}
 // 큰 물고기 그림자(입질 직전)
 if(S==='wait'&&fish&&fish.r>=4&&!fish.tre&&bob.on&&fg.bite&&T>fg.bite-1.6){const a=Math.min(1,(T-(fg.bite-1.6))/1.2);ctx.fillStyle=`rgba(10,20,40,${.35*a})`;ctx.beginPath();ctx.ellipse(bob.x-20+Math.sin(t*2)*14,g.surf+26,26+fish.r*4,7+fish.r,0,0,7);ctx.fill()}
 if(rareFx>0){rareFx-=1/60;const a=Math.min(1,rareFx)*(save.set.calm?.3:1),gr=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75);gr.addColorStop(0,`rgba(${rareCol},0)`);gr.addColorStop(1,`rgba(${rareCol},${.55*a})`);ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);if(bob.on){ctx.strokeStyle=`rgba(${rareCol},${a})`;ctx.lineWidth=3;for(let k=0;k<2;k++){const rr=(1.3-rareFx)*60+k*18;ctx.beginPath();ctx.ellipse(bob.x,g.surf+3,rr,rr*.3,0,0,7);ctx.stroke()}}}};
/* 강풍이면 찌 흔들림 */
const _bob0=typeof bobber==='function'?bobber:null;if(_bob0){bobber=function(x,y,rot,c,id){return _bob0(x+(weather==='wind'&&!c?Math.sin(T*7)*2.5:0),y,(rot||0)+(weather==='wind'&&!c?Math.sin(T*5)*.15:0),c,id)}}
/* ---------- HUD: 계절 아이콘 + 이벤트·희귀 기운 배너 ---------- */
const WXN={clear:['☀️','맑음'],cloudy:['☁️','흐림'],rain:['🌧️','비'],storm:['⛈️','폭풍우'],snow:['❄️','눈'],fog:['🌫️','안개'],wind:['🌬️','강풍'],meteor:['🌠','별똥별']};
const _hud0=hud;hud=function(){_hud0();const sn=SEASONS[seasonNow()];$('clk').textContent=sn.ic+(WXN[weather]||['☀️'])[0];
 const extra=[];if(EVT)extra.push(EVT.k==='surge'?`<span class="ban fever">🐟 ${EVT.n} 떼 ${Math.ceil(EVT.t)}초</span>`:`<span class="ban goldt">📏 대물 경보 ${Math.ceil(EVT.t)}초${EVT.best?` · ${Math.round(EVT.best*100)}%`:''}</span>`);
 const d=save.dry||0;if(d>=10&&!CH)extra.push(`<span class="ban" style="background:#e8dcff">🔮 희귀 기운 ${'▮'.repeat(Math.min(5,Math.ceil((d-9)/4)))}${'▯'.repeat(5-Math.min(5,Math.ceil((d-9)/4)))}</span>`);
 // 4.16.1 깜빡임 수정: 예전엔 dataset.h를 비워서 기본 hud가 0.25초마다 칩 줄을 다시 그리고 → 여기서 또 끼워 넣기를 반복(모든 칩 등장 애니메이션 반복)
 {const bn=$('banners'),ins=extra.join(''),base=bn.dataset.h||'';if((bn.dataset.ex||'')!==ins||(ins&&!bn.innerHTML.startsWith(ins))){bn.innerHTML=ins+base;bn.dataset.ex=ins}}};
setInterval(()=>{if(inGame()&&(EVT||(save.dry||0)>=10))hud()},1000);
/* ---------- 오늘의 낚시 정보 (실제 확률) ---------- */
SH.info={t:'오늘의 낚시 정보',tabs:[]};
function liveRates(){const ws=weights(false,false);let tot=0;const by=[0,0,0,0,0,0,0,0];ws.forEach((w,i)=>{by[FISH[i].r]+=w;tot+=w});return by.map(x=>tot?x/tot*100:0)}
function infoHTML(){const L0=curLoc(),X=LOCX[L0.id]||{},sn=seasonNow(),S0=SEASONS[sn],wx=WXN[weather]||['☀️','맑음'],ph=PH[clk().i],rt=liveRates(),pm=pityMul();
 const seaHere=locSpecies(L0.id).filter(f=>(SEAOF[f.id]||[]).includes(sn));
 const wEff={rain:'비 좋아하는 물고기 ↑ (감성돔·볼락 등)',storm:'폭풍 전용 친구 · 비 좋아하는 물고기 ↑',fog:'희귀 이상 ×1.35',wind:'사냥꾼 물고기 ×1.6 · 찌가 흔들려요',snow:'빙하·겨울 친구 ↑',meteor:'별을 탭해 소원!',clear:'특별한 효과 없음',cloudy:'특별한 효과 없음'}[weather]||'';
 return`<div class="sum">${S0.ic} <b>${S0.n}</b> · ${wx[0]} ${wx[1]} · ${ph.ic} ${ph.n}<br><small>계절은 게임 속 날짜로 흘러요(한 계절 게임 ${SEA_DAYS}일 · 하루 ${Math.round(DAY/60)}분) — ${seasonInfo().year}년째 ${S0.n} ${seasonInfo().day}일째, 다음 계절까지 ${seasonInfo().left}일. 제철 물고기 ×${SEA_IN}, 제철 아닌 계절 물고기 ×${SEA_OFF} (사라지진 않아요)</small></div>
 <div class="sec">🌦️ 지금 날씨 효과</div><p>${wEff}</p>
 <div class="sec">🎲 지금 이곳 실제 출현 확률</div><div class="rtab">${[1,2,3,4,5,6,7,0].filter(r=>rt[r]>0.005).map(r=>`<div><span class="tag" style="background:${RAR[r].c}">${RAR[r].n}</span><b>${rt[r]<.1?rt[r].toFixed(2):rt[r].toFixed(1)}%</b></div>`).join('')}</div><p><small>미끼·낚시 방식·날씨·계절·숨은 포인트·불운 방지 보정이 모두 반영된 게임 내부 값이에요 (먼 거리 던지기·보물 낚시는 제외)</small></p>
 <div class="sec">🔮 불운 방지</div><p>희귀 이상을 못 낚은 지 <b>${save.dry||0}번</b>째 · 지금 희귀 이상 확률 ×${pm.toFixed(1)}<br><small>10번부터 조금씩 올라가 최대 ×3, 30번이 되면 다음 한 번은 희귀 이상이 꼭 나와요</small></p>
 <div class="sec">${L0.ic} ${L0.n}</div><p>💡 ${X.tip||''}<br>추천: 날씨 ${X.wx||'-'} · 시간 ${X.tm||'-'} · 계절 ${X.sea||'-'}</p><p>🗺️ 숨은 포인트: ${save.secret[L0.id]?'<b>발견! 희귀 이상 +25%</b>':`??? <small>(힌트: ${X.sec?X.sec.t:''})</small>`}</p>
 <p>🍂 이곳의 ${S0.n} 제철: ${seaHere.length?seaHere.map(f=>save.dex[f.id]?f.n:'???').join(', '):'없음'}</p>
 <div class="sec">🎪 낚시터 이벤트</div><p>${EVT?(EVT.k==='surge'?`🐟 지금 ${EVT.n} 떼 (${Math.ceil(EVT.t)}초)`:`📏 지금 대물 경보 (${Math.ceil(EVT.t)}초)`):'2~4분마다 물고기 떼(특정 어종 5배·골드 +50%) 또는 대물 경보(큰 개체 ↑·기록 보상)가 찾아와요'}</p>`}
const _rs1=renderSheet;renderSheet=function(){if(sheet.k==='info'){$('sTitle').textContent=SH.info.t;$('sTabs').style.display='none';$('sTabs').innerHTML='';$('sbody').innerHTML=infoHTML();return}_rs1();if(sheet.k==='dex'&&sheet.tab==='col')null};
const plc=document.querySelector('.pill.place');plc.style.pointerEvents='auto';plc.style.cursor='pointer';plc.addEventListener('click',e=>{e.stopPropagation();audio&&audio();openSheet('info')});
/* ---------- 도감 수집 보상 ---------- */
const own=(id)=>!!save.dex[id];
const DXG=[
 ['g_dom','🐟 돔 가족','돔 종류 모두',()=>FISH.filter(f=>(f.tags||[]).includes('dom')&&!f.boss&&!f.hid),{gold:3000,title:'돔 박사'}],
 ['g_ceph','🐙 문어·오징어 가족','두족류 모두',()=>FISH.filter(f=>(f.tags||[]).includes('ceph')&&!f.boss&&!f.hid),{gold:3000,bob:'star',title:'먹물 수집가'}],
 ['g_shark','🦈 상어·가오리','상어와 가오리 모두',()=>['hammer','whale','ray','manta','hongeo','starray'].map(i=>FID[i]).filter(Boolean),{gold:5000,title:'상어 친구'}],
 ['g_junk','🥾 바다 청소','잡동사니 모두',()=>FISH.filter(f=>f.r===0),{gold:1500,title:'바다 청소왕'}],
 ['g_deep','🌑 심해 탐험','심해 친구 모두',()=>locSpecies('deep').filter(f=>!f.boss&&!f.hid),{gold:8000,aq:'cave',title:'심해 탐험가'}],
 ['g_spring','🌸 봄 제철','봄 제철 물고기 모두',()=>SEAS.spring.map(i=>FID[i]).filter(Boolean),{gold:3000,title:'봄의 낚시꾼'}],
 ['g_summer','🌻 여름 제철','여름 제철 물고기 모두',()=>SEAS.summer.map(i=>FID[i]).filter(Boolean),{gold:3000,title:'여름의 낚시꾼'}],
 ['g_autumn','🍂 가을 제철','가을 제철 물고기 모두',()=>SEAS.autumn.map(i=>FID[i]).filter(Boolean),{gold:3000,title:'가을의 낚시꾼'}],
 ['g_winter','❄️ 겨울 제철','겨울 제철 물고기 모두',()=>SEAS.winter.map(i=>FID[i]).filter(Boolean),{gold:3000,title:'겨울의 낚시꾼'}],
 ['r_3','💜 희귀 등급 완성','희귀 등급 모두',()=>FISH.filter(f=>f.r===3&&!f.boss),{gold:6000,rod:'neon'}],
 ['r_4','🧡 영웅 등급 완성','영웅 등급 모두',()=>FISH.filter(f=>f.r===4&&!f.boss),{gold:10000,reel:'goldreel'}],
 ['r_5','💛 전설 등급 완성','전설 등급 모두',()=>FISH.filter(f=>f.r===5&&!f.boss),{gold:20000,title:'전설 사냥꾼'}],
 ['r_7','🔮 히든 완성','히든 친구 모두',()=>FISH.filter(f=>f.r===7),{gold:20000,title:'비밀을 아는 자'}],
 ['all','🏆 바다 대도감 완성','134종 모두',()=>FISH,{gold:100000,bob:'dexbob',aq:'moon',deco:'trophy',title:'바다의 수호자'}]];
BOBS.push({id:'dexbob',n:'무지개 찌',price:-1,c1:'#ff6ad5',c2:'#7af0ff',d:'도감 134종 완성 보상 · 무지개빛으로 빛나요'});
DECOS.push({id:'trophy',n:'대도감 트로피',ic:'🏆',price:-1,d:'134종을 모두 모은 사람만 가질 수 있는 황금 트로피'});
function rewText(r){const a=[];if(r.gold)a.push('🪙'+r.gold.toLocaleString());if(r.title)a.push(`칭호 「${r.title}」`);if(r.bob)a.push('🎏 '+BOBS.find(b=>b.id===r.bob).n);if(r.rod)a.push('🎣 '+COS.rod.find(x=>x.id===r.rod).n);if(r.reel)a.push('⚙️ '+COS.reel.find(x=>x.id===r.reel).n);if(r.aq)a.push('🐠 수족관 테마 '+AQ_THEMES.find(x=>x.id===r.aq).n);if(r.deco)a.push('🏆 낚시터 장식 트로피');return a.join(' · ')}
function giveRew(r){let g=r.gold||0;if(r.title)save.titles[r.title]=1;if(r.bob){if(save.bobs[r.bob])g+=1000;save.bobs[r.bob]=1}if(r.rod){const it=COS.rod.find(x=>x.id===r.rod);if(save.cos.rod[r.rod])g+=Math.max(0,it.price);save.cos.rod[r.rod]=1}if(r.reel){const it=COS.reel.find(x=>x.id===r.reel);if(save.cos.reel[r.reel])g+=Math.max(0,it.price);save.cos.reel[r.reel]=1}if(r.aq){if(save.aq.themes[r.aq])g+=2000;save.aq.themes[r.aq]=1}if(r.deco){save.deco[r.deco]=1;save.decoOn[r.deco]=1}save.gold+=g}
function masterN(){return FISH.filter(f=>{const v=(save.rec[f.id]||{}).vars||{};return f.r>0&&v['소형']&&v['일반형']&&v['대형']&&v['초대형']}).length}
function colHTML(){const all=dexPct(),mN=masterN(),done=DXG.filter(x=>save.dexG[x[0]]).length;
 return`<div class="sum">🏅 수집 보상 ${done}/${DXG.length} · 전체 도감 ${dexN()}/${FISH.length}<div class="bar"><i style="width:${all}%"></i></div><small>각 묶음을 다 모으면 칭호·찌·스킨·수족관 테마 같은 특별 보상! 이미 가진 아이템이면 골드로 바꿔 드려요</small></div>`+
 DXG.map(([id,n,d,L,r])=>{const list=L(),got=list.filter(f=>own(f.id)).length,ok=got>=list.length&&list.length,c=save.dexG[id];return`<div class="row ${c?'eq':''}"><div class="ic">${c?'✅':ok?'🎁':'🔒'}</div><div><b>${n}</b><p>${d} ${got}/${list.length} · ${rewText(r)}</p><div class="bar"><i style="width:${got/Math.max(1,list.length)*100}%"></i></div></div><button data-dxg="${id}" ${!ok||c?'disabled':''}>${c?'완료':'받기'}</button></div>`}).join('')+
 `<div class="sec">⭐ 마스터 도감 (완성 후에도 계속!)</div><div class="row"><div class="ic">📏</div><div><b>크기 마스터 ${mN}종</b><p>한 종을 소형·일반형·대형·초대형 모두 낚으면 마스터 · 10종마다 🪙3,000 (받은 단계 ${save.masterR||0})</p><div class="bar"><i style="width:${(mN%10)*10}%"></i></div></div><button data-dxg="master" ${Math.floor(mN/10)>(save.masterR||0)?'':'disabled'}>받기</button></div>`}
$('sbody').addEventListener('click',e=>{const b=e.target.closest('[data-dxg]');if(!b||b.disabled)return;e.stopPropagation();const id=b.dataset.dxg;
 if(id==='master'){const lv=Math.floor(masterN()/10);if(lv>(save.masterR||0)){save.gold+=3000*(lv-(save.masterR||0));save.masterR=lv;SFX.mission();toast('⭐ 크기 마스터 보상!',1000)}}
 else{const x=DXG.find(y=>y[0]===id);if(!x||save.dexG[id])return;const list=x[3]();if(!list.every(f=>own(f.id)))return;save.dexG[id]=1;giveRew(x[4]);SFX.dexdone&&SFX.dexdone();toast(`🏅 ${x[1]} 완성!`,1200);if(id==='all')dexCelebrate()}
 persist();hud();renderSheet()},true);
SH.dex.tabs=SH.dex.tabs.concat([['col','🏅 수집 보상']]);
const _dexHTML1=dexHTML;dexHTML=function(){if(sheet.tab==='col')return colHTML();let h=_dexHTML1();if(sheet.sel){const f=FID[sheet.sel],fr=save.first[f.id],so=SEAOF[f.id];const add=(so?`<p>🗓️ 제철: ${so.map(s=>SEASONS[s].ic+SEASONS[s].n).join('·')}${so.includes(seasonNow())?' <b>(지금 제철!)</b>':''}</p>`:'')+(fr?`<p>📅 첫 발견 ${fr.d} · ${(LOCS.find(l=>l.id===fr.loc)||{}).n||''} · ${fmtCm(fr.cm)}${fr.w&&WXN[fr.w]?' · '+WXN[fr.w][0]:''}</p>`:'');h=h.replace('</div></div><div class="grid">',add+'</div></div><div class="grid">')}return h};
const _dots0=dots;dots=function(){_dots0();if(DXG.some(x=>!save.dexG[x[0]]&&x[3]().length&&x[3]().every(f=>own(f.id))))$('dDot').classList.add('on')};
/* 134종 완성 축하 */
function dexCelebrate(){let o=$('dexCel');if(!o){o=document.createElement('div');o.id='dexCel';document.body.appendChild(o)}o.innerHTML=`<div class="celb"><div class="tro">🏆</div><h2>바다 대도감 완성!</h2><p>134종의 바다 친구를 모두 만났어요</p><p>칭호 「바다의 수호자」 · 무지개 찌 · 달빛 수조 · 황금 트로피</p><p><small>${today()} 완성 기록이 남았어요</small></p><button id="celOk">고마워요!</button></div>`;o.classList.add('on');save.dexDoneAt=save.dexDoneAt||today();SFX.bossWin&&SFX.bossWin();sparkle&&sparkle(W/2,H*.4,120,['#ffe066','#ff9ad8','#7af0ff','#fff']);$('celOk').onclick=()=>o.classList.remove('on')}
/* 트로피 장식 (코드 그림) */
const _dd0=drawDeco;drawDeco=function(g,t){_dd0(g,t);if(!save.decoOn.trophy)return;const x=g.cx-g.ch*.52,y=g.platY+1,s=g.ch/230;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const gl=ctx.createRadialGradient(0,-40,4,0,-40,60);gl.addColorStop(0,`rgba(255,230,120,${.35+.15*Math.sin(t*3)})`);gl.addColorStop(1,'rgba(255,230,120,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(0,-40,60,0,7);ctx.fill();
 const gd=ctx.createLinearGradient(-20,0,20,0);gd.addColorStop(0,'#b8790f');gd.addColorStop(.45,'#ffe066');gd.addColorStop(1,'#b8790f');ctx.fillStyle='#6a4a2a';ctx.fillRect(-16,-10,32,10);ctx.fillStyle=gd;ctx.strokeStyle='#3b2a1a';ctx.lineWidth=2;ctx.fillRect(-5,-26,10,16);ctx.strokeRect(-5,-26,10,16);
 ctx.beginPath();ctx.moveTo(-20,-62);ctx.lineTo(20,-62);ctx.quadraticCurveTo(18,-30,0,-26);ctx.quadraticCurveTo(-18,-30,-20,-62);ctx.closePath();ctx.fill();ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='#d8a020';ctx.beginPath();ctx.arc(-20,-50,8,Math.PI*.5,Math.PI*1.5);ctx.stroke();ctx.beginPath();ctx.arc(20,-50,8,-Math.PI*.5,Math.PI*.5);ctx.stroke();
 ctx.fillStyle='#fff';ctx.globalAlpha=.7;ctx.fillRect(-12,-58,4,18);ctx.restore()};
/* 업적 */
[['s1','계절','계절 친구','이번 계절 제철 물고기 5종',s=>{const k=seaKey();return Object.keys(((s.seasonLog||{})[k]||{}).ids||{}).length>=5},1500,'제철 미식가'],
 ['s2','탐험','숨은 포인트','숨은 포인트 1곳 발견',s=>Object.keys(s.secret||{}).length>=1,1000],['s3','탐험','비밀 지도 완성','숨은 포인트 10곳 모두',s=>LOCS.every(l=>(s.secret||{})[l.id]),15000,'비밀 지도 장인'],
 ['s4','이벤트','떼 사냥','물고기 떼·대물 경보 10번 만나기',s=>(s.st.evt||0)>=10,2000],['s5','이벤트','대물 장인','대물 경보에서 85% 이상 기록',s=>(s.st.bigEv||0)>=1,3000,'대물 장인']]
 .forEach(([id,c,n,d,ok,g,title])=>ACH.push({id,c,n,d,ok:sv=>{try{return!!ok(sv)}catch(e){return false}},g,title}));
if(TEST)Object.defineProperties(window.__w,{EVT:{get(){return EVT},set(v){EVT=v}},startEvt:{value:startEvt},endEvt:{value:endEvt},liveRates:{value:liveRates},SEAOF:{value:SEAOF},dexCelebrate:{value:dexCelebrate},setEvtNext:{value:v=>{evtNext=v}}});

/* 4.12 상단 낚시터 이름 짧게(호수 중복 방지) */
const LOCSHORT={pier:'선착장',rock:'갯바위',valley:'계곡',light:'방파제',lake:'호수',sea:'먼바다',reef:'산호초',ice:'빙하 호수',deep:'심해',moon:'달빛 바다'};
const _hud1=hud;hud=function(){_hud1();$('locName').textContent=LOCSHORT[save.loc]||curLoc().n.split(' ').pop()};
/* 4.12 먼바다 원경 */
function drawSeaFar(g,t,dk,night){const hgt=g.surf-g.top;
 ctx.fillStyle=dk('#9cc0d0','#9aa6ae','#c08a9a','#1a2a52');ctx.beginPath();ctx.moveTo(W*.05,g.surf);ctx.quadraticCurveTo(W*.14,g.surf-hgt*.1,W*.26,g.surf);ctx.fill();
 ctx.beginPath();ctx.moveTo(W*.62,g.surf);ctx.quadraticCurveTo(W*.7,g.surf-hgt*.16,W*.78,g.surf-hgt*.06);ctx.quadraticCurveTo(W*.86,g.surf-hgt*.12,W*.96,g.surf);ctx.fill();
 // 먼 화물선
 const sx=((t*6)%(W+200))-100,sy=g.surf-3;ctx.fillStyle=dk('#5a6a7a','#5a6470','#6a4a5a','#141c34');ctx.beginPath();ctx.moveTo(sx-30,sy-6);ctx.lineTo(sx+30,sy-6);ctx.lineTo(sx+24,sy);ctx.lineTo(sx-26,sy);ctx.fill();
 ['#e05a4a','#3a7ac8','#f0c040','#40a070'].forEach((c,i)=>{ctx.fillStyle=night?'#3a4058':c;ctx.fillRect(sx-24+i*9,sy-11,8,5)});ctx.fillStyle=dk('#f4f4f0','#d8d8d8','#e0c0c8','#5a6080');ctx.fillRect(sx+16,sy-16,8,10);if(night){ctx.fillStyle='#ffe08a';ctx.fillRect(sx+18,sy-14,2,2)}
 // 수평선 반짝임
 if(!night)for(let i=0;i<14;i++){const x=(i*W/14+Math.sin(t+i)*10),a=.4+.4*Math.sin(t*3+i*1.7);ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.fillRect(x,g.surf+3+(i%3)*4,6,1.5)}
 skyGulls(g,t,night)}
const _df1=drawFar;drawFar=function(g,P,t){_df1(g,P,t);if(save.loc==='sea'&&!ipOk('bg_sea')){const ph=clk().i,night=ph===3,dk=(a,b,c,d)=>night?d:ph===2?c:rainAmt>.4?b:a;drawSeaFar(g,t,dk,night)}};
