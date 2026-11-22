/* ================= 4.14+ 짜릿한 손맛 (연출만 추가 · 골드·경험치·확률 변화 없음) =================
 ① 챔질 타이밍 판정 PERFECT/GREAT/GOOD/NORMAL (기존 챔질 성공 범위·퍼펙트 챔질 효과는 그대로)
 ② 릴 감기 중 장력 20~65 유지하면 작은 반짝임
 ③ 기존 콤보에 연출 보강: 콤보 2부터 작은 별, 5부터 화면 테두리·배경 반짝임, 최고 콤보 갱신 알림
 ④ 획득 문구(NEW FISH! · PERSONAL RECORD! · BIG/HUGE CATCH! · LEGENDARY! · MYTHIC! · SECRET DISCOVERY!)
    + 크기별 등장(대형 확대 · 초대형 약한 흔들림) + 희귀 연출 시간 단축(최대 1.2초, 대형 +0.5초) */
const HOOK_OPT=.13; // 입질 시작 후 최적 챔질 시점(초) = 기존 퍼펙트 챔질 구간(0~0.26초)의 가운데
function hookJudge(t){const d=Math.abs(t-HOOK_OPT);return d<=.08?'PERFECT':d<=.16?'GREAT':d<=.30?'GOOD':'NORMAL'}
let perfStreak=0;
function fxHook(j){const calm=save.set.calm;
 if(j==='PERFECT'){perfStreak++;const k=Math.min(4,perfStreak);
  bigText(perfStreak>1?`PERFECT ×${perfStreak}`:'PERFECT!','완벽한 챔질',['#fff36a','#ffd23f','#ffb04a','#ff8ad8'][k-1]);
  flash=Math.max(flash,.25+.08*k);flashCol='255,250,210';if(!calm)shake=Math.max(shake,2+k);
  sparkle(bob.x,G().surf,10+k*6,['#fff36a','#fff','#ffd23f']);
  vib(25);toast('PERFECT 챔질! ✨',700)}
 else{perfStreak=0;
  if(j==='GREAT'){sparkle(bob.x,G().surf,8,['#bfefff','#fff']);toast('GREAT 챔질!',650)}
  else if(j==='GOOD')toast('GOOD',500)}}
const _dn414=down;down=function(px,py){const wasBite=S==='bite',t=T;_dn414(px,py);if(wasBite&&S==='hook'){fg.hj=hookJudge(t);fg.hjT=t;fxHook(fg.hj)}};

// 장력 PERFECT 구간(20~65)에서 감는 중 작은 반짝임 (판정·전투 수치에는 영향 없음)
const _fi415=fight;fight=function(dt,g){_fi415(dt,g);if(S!=='fight'||LOWGFX)return;
 if(holding&&fg.ten>=20&&fg.ten<=65&&!(fg.clutch>0)){fg.pzT=(fg.pzT||0)+dt;if(Math.random()<dt*5)sparkle(fg.fx,fg.fy,2,['#fff','#9dffb0'])}};

// 콤보 연출 보강 (기존 콤보·배율·단계 문구는 그대로)
function streakCls(){const b=document.body;b.classList.toggle('streak5',combo>=5);b.classList.toggle('streak8',combo>=8)}
const _cu414=comboUp;comboUp=function(gold,bonus){_cu414(gold,bonus);streakCls();if(combo>=2&&!LOWGFX){const r=$('combo').getBoundingClientRect();sparkle(r.left+r.width/2,r.top+r.height/2,6+Math.min(14,combo),['#ffe066','#fff'])}};
const _cb414=comboBreak;comboBreak=function(){_cb414();streakCls()};
// 콤보 5 이상: 하늘에 작은 반짝임
const _up414=update;update=function(dt){_up414(dt);if(combo>=5&&S!=='title'&&!LOWGFX&&Math.random()<dt*(combo>=8?2.2:1.2)){const g=G();parts.push({x:Math.random()*W,y:g.top+Math.random()*(g.surf-g.top)*.7,vx:0,vy:6,l:1.2,t:0,c:combo>=8?'#ffb0e8':'#fff6b0',r:2+Math.random()*1.5,g:0,star:1})}};

// 획득 문구 · 크기별 등장
const CATCH_DUR=[0,0,.3,.5,.7,1,1.2,1.2];
function catchTags(f,r,big,huge){const t=[];
 if(f.hid||f.r===7)t.push(['SECRET DISCOVERY!','#7ff0e6']);if(f.r===6)t.push(['MYTHIC!','#ff8ad8']);if(f.r===5)t.push(['LEGENDARY!','#ffd23f']);
 if(huge)t.push(['HUGE CATCH!','#ff9a4a']);else if(big)t.push(['BIG CATCH!','#ffb04a']);
 if(r.rec)t.push(['PERSONAL RECORD!','#7fff9a']);if(r.isNew)t.push(['NEW FISH!','#9fd8ff']);return t}
function showCatchFx(r){const f=r.f,el=$('catchFx'),card=document.querySelector('#result .rcard');if(!el||!card)return;
 const sc=sizeCls414(f),big=f.r>0&&sc.r>=1.2,huge=f.r>0&&(f.giant||sc.r>=1.5),tags=catchTags(f,r,big,huge);
 card.classList.remove('bigIn','hugeIn');void card.offsetWidth;if(huge)card.classList.add(save.set.calm?'bigIn':'hugeIn');else if(big)card.classList.add('bigIn');
 if(!tags.length){el.innerHTML='';el.className='';return}
 const dur=Math.max(.9,(CATCH_DUR[f.r]||0)+(big?.5:0)+.9);
 el.innerHTML=`<b style="color:${tags[0][1]}">${tags[0][0]}</b>`+(tags.length>1?`<small>${tags.slice(1).map(x=>x[0]).join(' · ')}</small>`:'');
 el.style.setProperty('--d',dur+'s');el.className='';void el.offsetWidth;el.className='on'+(f.r>=5||huge?' hi':'');
 if(huge&&!save.set.calm)vib([30,30,40])}
// 희귀 연출(기존 화면) 시간을 사양 최대값으로 줄임 · 탭하면 바로 넘어가는 건 그대로
const _rv414=reveal;reveal=function(f,done){_rv414(f,done);if(rv&&rv.f===f&&!f.boss){const sc=sizeCls414(f),cap=Math.max(.5,(CATCH_DUR[f.r]||.5)+((f.giant||sc.r>=1.2)?.5:0));rv.dur=Math.min(rv.dur,cap)}};

const _sr415=showResult;showResult=function(){const f=fish,hj=fg&&fg.hj,prevBest=save.comboBest||0;_sr415();
 if(!f||!lastRes||lastRes.f!==f||f.tre)return;
 lastRes.hj=hj;if(hj==='PERFECT'&&f.r>0){save.totalPerfectCatches=(save.totalPerfectCatches||0)+1}
 if(combo>prevBest&&combo>=3){lastRes.comboRec=combo;setTimeout(()=>notice(`🔥 최고 콤보 갱신! ${combo}연속`),700)}
 const sk=document.querySelector('#rSkill .sk414');if(sk&&hj)sk.insertAdjacentHTML('afterbegin',`<div><small>챔질 판정</small><b class="hj${hj}">${hj}</b></div><div><small>최고 콤보</small><b>${save.comboBest||0}연속</b></div>`);
 persist();
 // 희귀 연출이 떠 있으면 끝난 뒤(결과 화면이 보일 때) 문구를 띄움
 if(rv&&rv.f===f){const d=rv.done;rv.done=()=>{d();showCatchFx(lastRes)}}else showCatchFx(lastRes)};
if(TEST)Object.defineProperties(window.__w,{hookJudge:{value:hookJudge},catchTags:{value:catchTags},perfStreak:{get(){return perfStreak}}});
