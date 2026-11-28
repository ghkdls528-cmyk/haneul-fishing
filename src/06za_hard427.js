/* ================= 4.27 영웅 이상 '변칙 장력' + 보상 상향 =================
 영웅(★4)·전설(★5)·신화(★6)·히든(★7) 물고기 (보물·연습 제외, 보스 포함)
 ① 변칙 장력: 1.1~2.4초마다(등급이 높을수록 자주) 예고 없이
    · 쿵! — 확 당김(장력 +10~18 × 등급 배율): 빨간 칸 근처면 위기 링까지 갈 수 있음
    · 휙! — 확 풀림(장력 -12~20 × 등급 배율): 손을 떼고 있으면 줄이 느슨해질 수 있음(장력 30 이상일 때만)
    · 장력 떨림: 항상 조금씩 출렁임
 ② 광폭화: 전설 이상은 체력 50% 아래에서 2.5초(히든은 25%에서 한 번 더) — 저항이 몰아치고 감을 때 장력 더 오름, 화면 붉은 번쩍
 ③ 보상: 골드·경험치 영웅 ×1.3 · 전설 ×1.5 · 신화 ×1.7 · 히든 ×2.0 (기존 4.20 상향 위에 추가) · 광폭화를 버티면 +10% 더
 시작 유예(freeT, 4.23) 동안은 변칙 없음 */
const H427_LV={4:1,5:1.15,6:1.3,7:1.5},H427_MUL={4:1.3,5:1.5,6:1.7,7:2.0};
const H427={fx:[]};
function h427On(){if(TEST&&window.__no427)return false;return S==='fight'&&fish&&fish.r>=4&&!fish.tre&&!practice&&fg}
{const _f=fight;fight=function(dt,g){_f.apply(this,arguments);if(!h427On()||fg.clutch>0||fg.final>0||fg.roar>0)return;
 const lv=H427_LV[Math.min(7,fish.r)]||1,H=fg.h427||(fg.h427={nj:rnd(1.2,2),r1:0,r2:0,rage:0,raged:0,jk:0});
 if(T<(fg.freeT||0))return;
 // 장력 떨림
 fg.ten+=Math.sin(T*(5+lv*2))*9*lv*dt+Math.sin(T*13.7)*4*lv*dt;
 // 쿵!/휙!
 H.nj-=dt;if(H.nj<=0&&fg.surge<=0){H.nj=rnd(1.1,2.4)/lv;const up=fg.ten<55?Math.random()<.75:Math.random()<.42;
  if(up){fg.ten=Math.min(100,fg.ten+rnd(10,18)*lv);H.jk++;H427.fx.push({t:'쿵!',c:'#ff5a4a',l:.7});shake=Math.max(shake,3);vib(15);SFX.surge&&SFX.surge()}
  else if(fg.ten>30){fg.ten=Math.max(12,fg.ten-rnd(12,20)*lv);H.jk++;H427.fx.push({t:'휙!',c:'#7fd0ff',l:.7});SFX.splash&&SFX.splash(.12)}}
 // 광폭화
 const rage=k=>{H.rage=2.5;H.raged++;bigText('🔥 광폭화!',`${fish.n}이(가) 날뛰어요 · 버티면 보상 +10%`,'#ff5a4a');flash=.35;flashCol='255,60,60';shake=Math.max(shake,6);vib([30,40,60]);SFX.boss&&SFX.boss()};
 if(fish.r>=5&&!H.r1&&fg.hp<50){H.r1=1;if(fg.hp>=15)rage()}  // 거의 다 낚았으면 생략(낚는 연출을 가리지 않게)
 if(fish.r>=7&&!H.r2&&fg.hp<25){H.r2=1;if(fg.hp>=8)rage()}
 if(H.rage>0){H.rage-=dt;if(holding)fg.ten+=22*lv*dt;if(fg.surge<=0&&fg.charge<=0)fg.next=Math.min(fg.next,.35)}
 fg.ten=clamp(fg.ten,0,104)}}
// 보상 상향
{const _sr=showResult;showResult=function(){const f=fish,H=fg&&fg.h427;_sr.apply(this,arguments);if(!f||f.r<4||f.tre||practice||!lastRes||lastRes.f!==f)return;
 const m=(H427_MUL[Math.min(7,f.r)]||1)+(H&&H.raged?.1:0),bg=Math.round(lastRes.gold*(m-1)),bx=Math.round((lastRes.xp||0)*(m-1));if(bg<=0&&bx<=0)return;
 save.gold+=bg;lastRes.gold+=bg;if(bx>0){addXp(bx);lastRes.xp+=bx}
 try{$('rGold').textContent='+'+lastRes.gold.toLocaleString();$('rRec').textContent=[$('rRec').textContent,`🔥 강적 보상 ×${m.toFixed(1)} (+${bg.toLocaleString()})`].filter(Boolean).join(' · ')}catch(e){}persist();hud()}}
// 시작 안내 · 쿵!/휙! 글자
{const _sf=startFight;startFight=function(g){_sf.apply(this,arguments);if(h427On())setTimeout(()=>{if(h427On())notice(`⚠️ ${RAR[Math.min(7,fish.r)].n} · 장력이 변칙적으로 출렁여요 · 보상 ×${H427_MUL[Math.min(7,fish.r)]}`)},1900)}}
{let lt=0;const _lf=lifeFront;lifeFront=function(g,t){_lf.apply(this,arguments);const dt=Math.min(.05,Math.max(0,t-lt));lt=t;if(!H427.fx.length)return;
 H427.fx=H427.fx.filter(p=>{p.l-=dt;if(S!=='fight'||!fg)return false;const y=(fg.fy||g.surf)-52-(0.7-p.l)*30;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,p.l*2));ctx.font=`bold 26px ${FONT}`;ctx.textAlign='center';ctx.lineWidth=5;ctx.strokeStyle='#3b2a1a';ctx.strokeText(p.t,fg.fx,y);ctx.fillStyle=p.c;ctx.fillText(p.t,fg.fx,y);ctx.restore();return p.l>0})}}
if(TEST)Object.defineProperties(window.__w,{h427:{get(){return fg&&fg.h427}},H427_MUL:{value:H427_MUL}});
