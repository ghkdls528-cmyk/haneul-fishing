/* ================= 4.26 물고기 행동 읽기 =================
 기존 저항 패턴(fm: burst·zigzag·charge·jump·dive·strong·hide·ink·float·puff·retreat·steady)은 그대로 두고, 그 위에:
 ① 신호(텔): 저항(돌진) 직전 0.35~0.65초 동안 물고기가 몸짓을 보여 줌 — 패턴마다 다른 신호
    몸 떨기(빨간 !: burst·retreat·charge) / 방향 꺾기(↔: zigzag·steady·hide) / 가라앉기(거품·⤓: dive·strong·ink) / 수면 부풀기(⤒: jump) / 숨 고르기(…: float·puff)
 ② 읽기: 저항이 시작되고 0.28초 뒤 손을 떼고 있으면 '👀 읽었다!' → 물고기 체력 -4%(지침) · 장력 -10
    한 판에 3번 읽으면 '물고기 마음을 읽었어요' → 이번 판 경험치 +15%
 ③ 성격: 낚을 때마다 개체 성격이 붙음(같은 물고기도 매번 조금씩 다름). 저항 패턴·등급에 따라 잘 나오는 성격이 다름
    성급한(신호 짧고 저항 잦음) / 느긋한(신호 길고 저항 드묾) / 영리한(35%는 신호 없이 · 읽으면 체력 -6%) / 끈질긴(읽어도 -3%) / 평범한
 낚시 시간은 늘리지 않음: 저항 간격 배율 평균 ≈ 1, 읽으면 오히려 짧아짐 */
const AI_TR={hasty:{n:'성급한',ic:'🔥',tell:.35,nx:.85,hp:4},calm:{n:'느긋한',ic:'🍃',tell:.65,nx:1.2,hp:4},smart:{n:'영리한',ic:'🧠',tell:.45,nx:1,hp:6,hide:.35},tough:{n:'끈질긴',ic:'💪',tell:.5,nx:1,hp:3},normal:{n:'평범한',ic:'🐟',tell:.5,nx:1,hp:4}};
const AI_TELL={burst:'shiver',retreat:'shiver',charge:'shiver',zigzag:'turn',steady:'turn',hide:'turn',dive:'dive',strong:'dive',ink:'dive',jump:'jump',float:'calm',puff:'calm'};
function aiTrait(f,fm){const w={hasty:1,calm:1,smart:1,tough:1,normal:2};
 if(['burst','zigzag','retreat','charge'].includes(fm))w.hasty+=2;if(['float','puff'].includes(fm))w.calm+=2;if(['hide','ink'].includes(fm))w.smart+=2;if(['strong','dive'].includes(fm))w.tough+=2;
 if(f.r>=4){w.smart+=1;w.tough+=1}if(f.r<=1)w.normal+=2;
 let r=Math.random()*Object.values(w).reduce((a,b)=>a+b,0);for(const k in w){r-=w[k];if(r<=0)return k}return 'normal'}
const AIX={fx:[]};
{const _sf=startFight;startFight=function(g){_sf.apply(this,arguments);if(S!=='fight'||!fish)return;const k=aiTrait(fish,fg.fm);fg.ai={k,reads:0,bonus:false,rd:null,tell:null,lastNext:fg.next};
 if(fish.r>=3&&!fish.tre)setTimeout(()=>{if(S==='fight')toast(`${AI_TR[k].ic} ${AI_TR[k].n} ${fish.n}${k==='smart'?' · 신호 없이 덤빌 때가 있어요':k==='hasty'?' · 자주 덤벼요':''}`,1300)},450)}}
{const _f=fight;fight=function(dt,g){const A=fg&&fg.ai;if(!A)return _f.apply(this,arguments);const tr=AI_TR[A.k],s0=fg.surge,n0=fg.next;
 // ① 저항 직전 신호
 if(fg.surge<=0&&fg.charge<=0&&!(fg.clutch>0)&&!(fg.final>0)&&!A.tell&&fg.next>0&&fg.next<tr.tell){A.tell={k:(tr.hide&&Math.random()<tr.hide)?'none':(AI_TELL[fg.fm]||'shiver'),t:fg.next,T0:fg.next}}
 _f.apply(this,arguments);if(S!=='fight'||!fg.ai)return;
 if(A.tell)A.tell.t-=dt;
 // 저항 간격이 새로 정해지면 성격 배율
 if(fg.next>n0+.05&&tr.nx!==1)fg.next*=tr.nx;
 // ② 저항 시작 → 0.28초 뒤 손을 떼고 있으면 읽기 성공
 if(s0<=0&&fg.surge>0){A.rd={at:T,told:!!(A.tell&&A.tell.k!=='none')};A.tell=null}
 if(A.rd&&T-A.rd.at>.28){if(!holding&&fg.surge>0){A.reads++;fg.hp=Math.max(1,fg.hp-tr.hp);fg.ten=Math.max(10,fg.ten-10);save.st.reads=(save.st.reads||0)+1;
   AIX.fx.push({x:fg.fx,y:fg.fy-34,l:1,t:A.reads>=3&&!A.bonus?'🧠 마음을 읽었다!':'👀 읽었다!'});if(SFX.click)SFX.click();vib(12);
   if(A.reads>=3&&!A.bonus){A.bonus=true;notice(`🧠 ${fish.n}의 마음을 읽었어요! 이번 판 경험치 +15%`)}}
  A.rd=null}}}
// 이번 판 경험치 +15%
{const _sr=showResult;showResult=function(){const A=fg&&fg.ai,f=fish;_sr.apply(this,arguments);if(A&&A.bonus&&lastRes&&lastRes.f===f&&!practice&&lastRes.xp>0){const b=Math.max(1,Math.round(lastRes.xp*.15));addXp(b);lastRes.xp+=b;try{$('rRec').textContent=[$('rRec').textContent,`🧠 마음 읽기 경험치 +${b}`].filter(Boolean).join(' · ')}catch(e){}}if(fg)fg.ai=null}}
// 신호 그리기
function aiDraw(t){if(S!=='fight'||!fg||!fg.ai)return;const A=fg.ai,x=fg.fx,y=fg.fy;
 if(A.tell&&A.tell.k!=='none'){const p=1-Math.max(0,A.tell.t)/A.tell.T0,a=.45+.55*p,k=A.tell.k;ctx.save();ctx.globalAlpha=a;ctx.lineWidth=3;ctx.lineCap='round';
  if(k==='shiver'){ctx.strokeStyle='#ff5a4a';for(const s of[-1,1])for(let i=0;i<2;i++){const r=16+i*8+Math.sin(t*40)*2;ctx.beginPath();ctx.arc(x,y,r,s>0?-.6:Math.PI-.6,s>0?.6:Math.PI+.6);ctx.stroke()}mark('!','#ff5a4a')}
  else if(k==='turn'){ctx.strokeStyle='#ffd23f';const o=10+Math.sin(t*18)*4;for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(x+s*(18+o),y-22);ctx.lineTo(x+s*(30+o),y-22);ctx.lineTo(x+s*(25+o),y-27);ctx.moveTo(x+s*(30+o),y-22);ctx.lineTo(x+s*(25+o),y-17);ctx.stroke()}mark('↔','#ffd23f')}
  else if(k==='dive'){ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.5;for(let i=0;i<5;i++){const by=y-8-((t*50+i*11)%34);ctx.beginPath();ctx.arc(x-10+i*5,by,2+i%2,0,7);ctx.stroke()}mark('⤓','#7fd0ff')}
  else if(k==='jump'){const g0=G(),r=10+p*26;ctx.strokeStyle='rgba(255,255,255,.95)';ctx.beginPath();ctx.ellipse(x,g0.surf+2,r,r*.25,0,0,7);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.ellipse(x,g0.surf,r*.6,4+p*5,0,Math.PI,0);ctx.fill();mark('⤒','#ffffff')}
  else{ctx.fillStyle='#fff';ctx.font=`18px ${FONT}`;ctx.textAlign='center';ctx.fillText('…',x,y-24);ctx.textAlign='left'}
  ctx.restore()}
 function mark(s,c){ctx.font=`bold 22px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#3b2a1a';ctx.strokeText(s,x,y-28-Math.abs(Math.sin(t*10))*3);ctx.fillStyle=c;ctx.fillText(s,x,y-28-Math.abs(Math.sin(t*10))*3);ctx.textAlign='left'}}
function aiFx(dt){AIX.fx=AIX.fx.filter(p=>{p.l-=dt;p.y-=26*dt;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,p.l*1.6));ctx.font=`17px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#3b2a1a';ctx.strokeText(p.t,p.x,p.y);ctx.fillStyle='#9dffb0';ctx.fillText(p.t,p.x,p.y);ctx.restore();return p.l>0})}
{let lt=0;const _lf=lifeFront;lifeFront=function(g,t){_lf.apply(this,arguments);try{aiDraw(t);aiFx(Math.min(.05,Math.max(0,t-lt)))}catch(e){}lt=t}}
if(TEST)Object.defineProperties(window.__w,{ai:{get(){return fg&&fg.ai}},aiTrait:{value:(id,fm)=>aiTrait(FID[id],fm)},AI_TR:{value:AI_TR},AI_TELL:{value:AI_TELL}});
