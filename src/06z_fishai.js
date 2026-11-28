/* ================= 4.26 물고기 성격 · 4.28 '거품 톡!' =================
 (4.26의 화살표 신호 ↔·⤓·⤒ + '손 떼면 읽기'는 무엇을 해야 할지 알기 어렵다는 의견으로 4.28에 삭제)
 ① 성격: 낚을 때마다 개체 성격이 붙음(같은 물고기도 매번 조금씩 다름). 저항 패턴·등급에 따라 잘 나오는 성격이 다름
    성급한(저항 잦음·거품 빨리 사라짐) / 느긋한(저항 드묾·거품 오래) / 영리한(거품이 옆으로 흔들림·터뜨리면 체력 -6%) / 끈질긴(-3%) / 평범한
 ② 거품 톡!: 힘겨루기 중 2~4초마다 물고기가 반짝이는 거품을 뱉음 → 그 거품을 손가락으로 톡 누르면
    물고기 체력 -4%(지침) · 장력이 가운데(55)로 안정 · '팡!' — 한 판에 3개 터뜨리면 이번 판 경험치 +15%
 낚시 시간은 늘리지 않음(저항 간격 배율 평균 ≈ 1, 거품을 터뜨리면 오히려 짧아짐) */
const AI_TR={hasty:{n:'성급한',ic:'🔥',life:.95,nx:.85,hp:4},calm:{n:'느긋한',ic:'🍃',life:1.6,nx:1.2,hp:4},smart:{n:'영리한',ic:'🧠',life:1.15,nx:1,hp:6,wob:1},tough:{n:'끈질긴',ic:'💪',life:1.3,nx:1,hp:3},normal:{n:'평범한',ic:'🐟',life:1.3,nx:1,hp:4}};
const AI_TELL={burst:1,retreat:1,charge:1,zigzag:1,steady:1,hide:1,dive:1,strong:1,ink:1,jump:1,float:1,puff:1};
function aiTrait(f,fm){const w={hasty:1,calm:1,smart:1,tough:1,normal:2};
 if(['burst','zigzag','retreat','charge'].includes(fm))w.hasty+=2;if(['float','puff'].includes(fm))w.calm+=2;if(['hide','ink'].includes(fm))w.smart+=2;if(['strong','dive'].includes(fm))w.tough+=2;
 if(f.r>=4){w.smart+=1;w.tough+=1}if(f.r<=1)w.normal+=2;
 let r=Math.random()*Object.values(w).reduce((a,b)=>a+b,0);for(const k in w){r-=w[k];if(r<=0)return k}return 'normal'}
const AIX={fx:[]};
{const _sf=startFight;startFight=function(g){_sf.apply(this,arguments);if(S!=='fight'||!fish)return;const k=aiTrait(fish,fg.fm);fg.ai={k,reads:0,bonus:false,bub:null,nb:rnd(1.6,2.6)};
 if(!save.st.bubTip&&!fish.tre){save.st.bubTip=1;setTimeout(()=>{if(S==='fight')notice('🫧 물고기가 뱉는 반짝 거품을 톡! 누르면 물고기가 지쳐요')},700)}
 else if(fish.r>=3&&!fish.tre)setTimeout(()=>{if(S==='fight')toast(`${AI_TR[k].ic} ${AI_TR[k].n} ${fish.n}${k==='hasty'?' · 자주 덤벼요':k==='calm'?' · 느긋해요':''}`,1200)},450)}}
{const _f=fight;fight=function(dt,g){const A=fg&&fg.ai;if(!A)return _f.apply(this,arguments);const tr=AI_TR[A.k],n0=fg.next;
 _f.apply(this,arguments);if(S!=='fight'||!fg.ai)return;
 // 저항 간격이 새로 정해지면 성격 배율
 if(fg.next>n0+.05&&tr.nx!==1)fg.next*=tr.nx;
 // 거품
 const busy=fg.clutch>0||fg.final>0||fg.roar>0||T<(fg.freeT||0);
 if(A.bub){A.bub.l-=dt;A.bub.y-=22*dt;A.bub.x+=tr.wob?Math.sin(T*6)*40*dt:0;if(A.bub.l<=0||busy)A.bub=null}
 else if(!busy){A.nb-=dt;if(A.nb<=0){A.nb=rnd(2.2,3.8);A.bub={x:clamp(fg.fx+rnd(-30,30),30,W-30),y:fg.fy-26,l:tr.life,L:tr.life}}}}}
function aiPop(){const A=fg&&fg.ai;if(!A||!A.bub)return;const b=A.bub,tr=AI_TR[A.k];A.bub=null;A.reads++;fg.hp=Math.max(1,fg.hp-tr.hp);fg.ten+=(55-fg.ten)*.4;save.st.reads=(save.st.reads||0)+1;
 AIX.fx.push({x:b.x,y:b.y-14,l:1,t:A.reads>=3&&!A.bonus?'🫧 팡팡팡! 경험치 +15%':'🫧 팡!'});for(let i=0;i<12;i++){const an=Math.random()*6.283;parts.push({x:b.x,y:b.y,vx:Math.cos(an)*rnd(60,140),vy:Math.sin(an)*rnd(60,140),l:.5,t:0,c:['#ffffff','#bff4ff','#ffe066'][i%3],r:2.5,g:0})}
 if(SFX.splash)SFX.splash(.18);vib(14);if(A.reads>=3&&!A.bonus)A.bonus=true}
$('c').addEventListener('pointerdown',e=>{const A=S==='fight'&&fg&&fg.ai;if(!A||!A.bub)return;if(Math.hypot(e.clientX-A.bub.x,e.clientY-A.bub.y)<46)aiPop()},true);
// 이번 판 경험치 +15%
{const _sr=showResult;showResult=function(){const A=fg&&fg.ai,f=fish;_sr.apply(this,arguments);if(A&&A.bonus&&lastRes&&lastRes.f===f&&!practice&&lastRes.xp>0){const b=Math.max(1,Math.round(lastRes.xp*.15));addXp(b);lastRes.xp+=b;try{$('rRec').textContent=[$('rRec').textContent,`🫧 거품 톡! 경험치 +${b}`].filter(Boolean).join(' · ')}catch(e){}}if(fg)fg.ai=null}}
// 거품 그리기
function aiDraw(t){if(S!=='fight'||!fg||!fg.ai||!fg.ai.bub)return;const b=fg.ai.bub,a=Math.min(1,b.l*3),k=1-b.l/b.L,R=19+Math.sin(t*9)*1.5;ctx.save();ctx.globalAlpha=a;
 const gl=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,R*2.2);gl.addColorStop(0,'rgba(255,240,150,.55)');gl.addColorStop(1,'rgba(255,240,150,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(b.x,b.y,R*2.2,0,7);ctx.fill();
 const pg=ctx.createRadialGradient(b.x-R*.35,b.y-R*.4,2,b.x,b.y,R);pg.addColorStop(0,'#ffffff');pg.addColorStop(.55,'rgba(190,240,255,.75)');pg.addColorStop(1,'rgba(120,200,255,.55)');ctx.fillStyle=pg;ctx.strokeStyle='#ffffff';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(b.x,b.y,R,0,7);ctx.fill();ctx.stroke();
 ctx.strokeStyle='#ffd23f';ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,R+5,-Math.PI/2,-Math.PI/2+(1-k)*6.283);ctx.stroke();
 ctx.font=`bold 14px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=3.5;ctx.strokeStyle='#3b2a1a';ctx.strokeText('톡!',b.x,b.y+5);ctx.fillStyle='#fff';ctx.fillText('톡!',b.x,b.y+5);ctx.textAlign='left';ctx.restore()}
function aiFx(dt){AIX.fx=AIX.fx.filter(p=>{p.l-=dt;p.y-=26*dt;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,p.l*1.6));ctx.font=`17px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#3b2a1a';ctx.strokeText(p.t,p.x,p.y);ctx.fillStyle='#9dffb0';ctx.fillText(p.t,p.x,p.y);ctx.restore();return p.l>0})}
{let lt=0;const _lf=lifeFront;lifeFront=function(g,t){_lf.apply(this,arguments);try{aiDraw(t);aiFx(Math.min(.05,Math.max(0,t-lt)))}catch(e){}lt=t}}
if(TEST)Object.defineProperties(window.__w,{aiPop:{value:()=>aiPop()},ai:{get(){return fg&&fg.ai}},aiTrait:{value:(id,fm)=>aiTrait(FID[id],fm)},AI_TR:{value:AI_TR},AI_TELL:{value:AI_TELL}});
