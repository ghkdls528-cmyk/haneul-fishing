/* ================= 4.27 영웅 이상 '변칙 장력' · 4.28 강화(패턴·버티기 보너스·강적 격파) =================
 영웅(★4)·전설(★5)·신화(★6)·히든(★7) 물고기 (보물·연습 제외, 보스 포함) · 시작 유예(freeT) 동안은 변칙 없음
 ① 변칙 장력: 0.7~1.6초마다(등급이 높을수록 자주) 예고 없이
    · 쿵! 확 당김(+14~24 × 등급 배율) — 빨간 칸 근처면 위기 링까지 / · 휙! 확 풀림(-16~26) — 손을 떼고 있으면 느슨해짐 / · 장력 떨림 상시
 ② 변칙 패턴(4.28): 3.5~6초마다 하나씩, 화면에 큰 글씨로 예고
    · 🌀 소용돌이 2.4초: 장력이 크게 출렁임(±) → 끊어서 눌러야 버팀
    · ⚡ 연속 당김 1.4초: 쿵쿵쿵 3번 연속(위기 링 각오)
    · 😴 죽은 척 1.6초: 장력이 쭉 빠졌다가(감지 말고 기다리기) 끝에 '속았지!' 확 당김
    패턴이 끝날 때 아직 걸려 있으면 '💪 버텼다!' → 보상 +5%씩 쌓임(최대 +50%), 화면 왼쪽 위 배지로 표시
 ③ 광폭화: 전설 이상 체력 50%, 신화·히든은 25%에서 한 번 더 — 2.5초 저항 몰아침·감을 때 장력 더 오름
 ④ 보상: 골드·경험치 영웅 ×1.3 · 전설 ×1.5 · 신화 ×1.7 · 히든 ×2.0 + 광폭화 버팀 +0.1 + 버티기 보너스
    낚으면 '🏆 강적 격파!' 큰 글씨·금빛 폭발·진동 (신화·히든은 무지개) */
const H427_LV={4:1,5:1.15,6:1.3,7:1.5},H427_MUL={4:1.3,5:1.5,6:1.7,7:2.0};
const H427={fx:[]};
const H428_PAT=[['swirl','🌀 소용돌이!','끊어서 눌러요',2.4,'#7fd0ff'],['triple','⚡ 연속 당김!','쿵쿵쿵 버텨요',1.4,'#ffd23f'],['dead','😴 죽은 척…','감지 말고 기다려요',1.6,'#c8b8ff']];
function h427On(){if(TEST&&window.__no427)return false;return S==='fight'&&fish&&fish.r>=4&&!fish.tre&&!practice&&fg}
function h428Bonus(H){return Math.min(.5,((H&&H.surv)||0)*.05)}
{const _f=fight;fight=function(dt,g){_f.apply(this,arguments);if(!h427On()||fg.clutch>0||fg.final>0||fg.roar>0)return;
 const lv=H427_LV[Math.min(7,fish.r)]||1,H=fg.h427||(fg.h427={nj:rnd(.8,1.3),np:rnd(2.2,3.2),pat:null,r1:0,r2:0,rage:0,raged:0,jk:0,pats:0,surv:0});
 if(T<(fg.freeT||0))return;
 // 장력 떨림
 fg.ten+=Math.sin(T*(5+lv*2))*11*lv*dt+Math.sin(T*13.7)*5*lv*dt;
 // 쿵!/휙! (패턴 중에는 패턴이 대신)
 H.nj-=dt;if(!H.pat&&H.nj<=0&&fg.surge<=0){H.nj=rnd(.7,1.6)/lv;const up=fg.ten<55?Math.random()<.72:Math.random()<.45;
  if(up)jolt(rnd(14,24)*lv);else if(fg.ten>30){fg.ten=Math.max(12,fg.ten-rnd(16,26)*lv);H.jk++;H427.fx.push({t:'휙!',c:'#7fd0ff',l:.7});SFX.splash&&SFX.splash(.12)}}
 function jolt(d,txt){fg.ten=Math.min(100,fg.ten+d);H.jk++;H427.fx.push({t:txt||'쿵!',c:'#ff5a4a',l:.7});shake=Math.max(shake,3+lv);vib(18);SFX.surge&&SFX.surge()}
 // 변칙 패턴
 if(!H.pat&&H.rage<=0){H.np-=dt;if(H.np<=0){const P=H428_PAT[Math.floor(Math.random()*H428_PAT.length)];H.pat={k:P[0],t:P[3],T:P[3],i:0};H.pats++;bigText(P[1],P[2],P[4]);vib([20,30,20]);SFX.warn&&SFX.warn()}}
 if(H.pat){const p=H.pat,e=p.T-p.t;p.t-=dt;
  if(p.k==='swirl')fg.ten+=Math.sin(e*7.5)*70*lv*dt;
  else if(p.k==='triple'){const due=[.15,.55,.95];while(p.i<3&&e>=due[p.i]){p.i++;jolt(rnd(13,19)*lv,['쿵!','쿵!!','쿵!!!'][p.i-1])}}
  else if(p.k==='dead'){if(p.t>.25){fg.ten=Math.max(14,fg.ten-55*dt);fg.hp=Math.min(100,fg.hp)}else if(!p.snap){p.snap=1;jolt(rnd(26,34)*lv,'속았지!')}}
  if(p.t<=0){H.pat=null;H.np=rnd(3.5,6)/Math.sqrt(lv);if(S==='fight'&&fg.hp>0){H.surv++;H427.fx.push({t:`💪 버텼다! +${Math.round(h428Bonus(H)*100)}%`,c:'#9dffb0',l:1.1,up:1});SFX.coin&&SFX.coin()}}}
 // 광폭화
 const rage=()=>{H.rage=2.5;H.raged++;H.pat=null;bigText('🔥 광폭화!',`${fish.n}이(가) 날뛰어요 · 버티면 보상 +10%`,'#ff5a4a');flash=.35;flashCol='255,60,60';shake=Math.max(shake,7);vib([30,40,60]);SFX.boss&&SFX.boss()};
 if(fish.r>=5&&!H.r1&&fg.hp<50){H.r1=1;if(fg.hp>=15)rage()}  // 거의 다 낚았으면 생략(낚는 연출을 가리지 않게)
 if(fish.r>=6&&!H.r2&&fg.hp<25){H.r2=1;if(fg.hp>=8)rage()}
 if(H.rage>0){H.rage-=dt;if(holding)fg.ten+=26*lv*dt;if(fg.surge<=0&&fg.charge<=0)fg.next=Math.min(fg.next,.3)}
 fg.ten=clamp(fg.ten,0,104)}}
// 보상 상향 + 강적 격파 연출
{const _sr=showResult;showResult=function(){const f=fish,H=fg&&fg.h427;_sr.apply(this,arguments);if(!f||f.r<4||f.tre||practice||!lastRes||lastRes.f!==f)return;
 const m=(H427_MUL[Math.min(7,f.r)]||1)+(H&&H.raged?.1:0)+h428Bonus(H),bg=Math.round(lastRes.gold*(m-1)),bx=Math.round((lastRes.xp||0)*(m-1));if(bg<=0&&bx<=0)return;
 save.gold+=bg;lastRes.gold+=bg;if(bx>0){addXp(bx);lastRes.xp+=bx}save.st.bossKill=(save.st.bossKill||0)+1;
 try{$('rGold').textContent='+'+lastRes.gold.toLocaleString();$('rRec').textContent=[$('rRec').textContent,`🔥 강적 보상 ×${m.toFixed(2).replace(/0$/,'')} (+${bg.toLocaleString()})${H&&H.surv?` · 💪 ${H.surv}번 버팀`:''}`].filter(Boolean).join(' · ')}catch(e){}
 const rb=f.r>=6;let tries=0;const show=()=>{if(++tries>40)return;if(!$('result').classList.contains('on')){setTimeout(show,150);return}/* 희귀 연출(LEGENDARY 등)이 끝나고 결과 창이 뜬 뒤에 */notice(`🏆 강적 격파! ×${m.toFixed(2).replace(/0$/,'')} · 🪙+${bg.toLocaleString()}`);sparkle(W/2,H0()*.3,rb?70:45,rb?['#ff7ad9','#7ff0ff','#ffe066','#9dffb0','#fff']:['#ffe066','#ffb020','#fff']);vib([40,30,40,30,90])};setTimeout(show,300);persist();hud()}}
function H0(){return H}
// 시작 안내 · 글자 · 버티기 배지
{const _sf=startFight;startFight=function(g){_sf.apply(this,arguments);if(h427On())setTimeout(()=>{if(h427On())notice(`⚠️ ${RAR[Math.min(7,fish.r)].n} · 변칙 장력·패턴 · 보상 ×${H427_MUL[Math.min(7,fish.r)]}~`)},1900)}}
{let lt=0;const _lf=lifeFront;lifeFront=function(g,t){_lf.apply(this,arguments);const dt=Math.min(.05,Math.max(0,t-lt));lt=t;
 if(S==='fight'&&fg&&fg.h427&&h427On()){const Hh=fg.h427,b=h428Bonus(Hh),pat=Hh.pat;ctx.save();
  if(b>0||pat||Hh.rage>0){const tx=Hh.rage>0?'🔥 광폭화':pat?{swirl:'🌀 소용돌이',triple:'⚡ 연속 당김',dead:'😴 죽은 척'}[pat.k]:`💪 버티기 +${Math.round(b*100)}%`;ctx.font=`bold 15px ${FONT}`;const tw=ctx.measureText(tx).width+18,x=10,y=(G().top||100)+86;
   ctx.fillStyle=Hh.rage>0?'rgba(255,80,60,.92)':pat?'rgba(40,50,90,.88)':'rgba(255,247,232,.94)';ctx.strokeStyle='#3b2a1a';ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(x,y,tw,26,12);ctx.fill();ctx.stroke();ctx.fillStyle=Hh.rage>0||pat?'#fff':'#7a3e10';ctx.fillText(tx,x+9,y+18);
   if(pat){ctx.fillStyle='#ffd23f';ctx.fillRect(x+6,y+22,(tw-12)*Math.max(0,pat.t/pat.T),3)}}
  ctx.restore()}
 if(!H427.fx.length)return;
 H427.fx=H427.fx.filter(p=>{p.l-=dt;if(S!=='fight'||!fg)return false;const y=(fg.fy||g.surf)-52-((p.up?1.1:.7)-p.l)*30;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,p.l*2));ctx.font=`bold ${p.up?20:26}px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=5;ctx.strokeStyle='#3b2a1a';ctx.strokeText(p.t,fg.fx,y);ctx.fillStyle=p.c;ctx.fillText(p.t,fg.fx,y);ctx.restore();return p.l>0})}}
if(TEST)Object.defineProperties(window.__w,{h427:{get(){return fg&&fg.h427}},H427_MUL:{value:H427_MUL},h428Bonus:{value:()=>h428Bonus(fg&&fg.h427)}});
