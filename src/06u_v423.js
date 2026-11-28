/* ================= 4.23 느슨한 줄 놓침 타이밍 · 놓침 문구 위치 · 골드 쓸 곳(상점: 뽑기·버프·보물 연마) =================
 ① 느슨함 놓침: 0.3초 → 일반·고급 0.6초 / 희귀 0.85초 / 영웅 이상 1.1초, 힘겨루기 시작 1.4초·위기 링 뒤 0.6초 유예,
    손을 놓아 장력이 바닥 근처(20 아래)면 절반 속도로 빠짐, 세는 동안 화면 가운데 '꾹! 줄이 느슨해요' 깜빡임 + 짧은 진동 (06o_gear418)
 ② 놓침 문구: 좁은 칸에 4줄로 갈라져 캐릭터 얼굴을 덮던 문구 → 화면 가운데 위쪽 반투명 상자, 큰 글씨(이유) + 작은 글씨(요령)
 ③ 장비 › 🛍️ 상점: 🎰 행운 뽑기(1회·10회, 동전~초대박 ×25·보물·버프·경험치) · 🧪 버프 5분(희귀 향·황금 손·빠른 입질) · 💫 대박 타임 즉시
    · (4.25에서 💎 보물 연마 삭제) — 버프 남은 시간은 save.buf(초)에 저장 */
// ① 느슨함
function slkLim(){const r=fish?fish.r:1;return r>=4?1.1:r>=3?.85:.6}
const _sf423=startFight;startFight=function(g){_sf423(g);fg.freeT=T+1.4;fg.slk=0};
const _lf423=lifeFront;lifeFront=function(g,t){_lf423(g,t);if(S==='fight'&&fish&&(fg.slk||0)>0){const k=fg.slk/slkLim(),a=.55+.45*Math.abs(Math.sin(performance.now()/90));
 ctx.save();ctx.globalAlpha=a;txt('꾹! 줄이 느슨해요',W/2,H*.27,26,k>.5?'#ff7a7a':'#fff');ctx.restore();if(!fg.slkV){fg.slkV=1;vib(25)}}else if(fg)fg.slkV=0};
// ② 놓침 문구
const _to423=toast;toast=function(t,ms){_to423(t,ms);const e=$('toast');e.classList.toggle('fail423',!!toast.f423);
 if(typeof t==='string'&&t.includes(' · ')){const [a,...r]=t.split(' · ');e.textContent='';const s=document.createElement('span');s.textContent=a;const sm=document.createElement('small');sm.textContent=r.join(' · ');e.append(s,sm)}};
const _fa423=fail;fail=function(m,k){toast.f423=1;try{return _fa423(m,k)}finally{toast.f423=0}};
// ③ 상점
const BUF={rare:{n:'희귀 물고기 향',ic:'🌟',d:'희귀(★3) 이상 확률 ×1.5',k:1.3},gold:{n:'황금 손',ic:'🪙',d:'낚을 때 골드 +30%',k:1},bite:{n:'빠른 입질',ic:'⚡',d:'입질 기다림 40% 짧게',k:.7}};
const BUF_SEC=600; // 4.28 5분→10분
const r50=v=>Math.round(v/50)*50;
const gCost=()=>r50(600+save.lv*160),bCost=id=>r50((1500+save.lv*250)*BUF[id].k),jpCost=()=>r50(2500+save.lv*300);
function bufGold(){return(save.buf&&save.buf.gold>0)?.3:0}
const mmss=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function addBuf(id,sec=BUF_SEC){save.buf[id]=Math.min(14400,(save.buf[id]||0)+sec)}
// 버프 효과
const _wt423=weights;weights=function(far,spot){const ws=_wt423(far,spot);return save.buf.rare>0?ws.map((w,i)=>FISH[i].r>=3?w*1.5:w):ws};
const _wk423=waitTick;waitTick=function(dt,g){return _wk423(save.buf.bite>0?dt*1.6:dt,g)};
let bufTick=0;
const _up423=update;update=function(dt){_up423(dt);let any=0;for(const k in BUF)if(save.buf[k]>0){save.buf[k]=Math.max(0,save.buf[k]-dt);any=1;if(save.buf[k]===0)notice(`${BUF[k].ic} ${BUF[k].n} 효과가 끝났어요`)}
 if(any&&(bufTick+=dt)>=1){bufTick=0;hud()}};
const _hd423=hud;hud=function(){_hd423();const bn=$('banners');if(!bn)return;let c=bn.querySelector('.buf423');const on=Object.keys(BUF).filter(k=>save.buf[k]>0);
 if(on.length){const tx=on.map(k=>`${BUF[k].ic}${mmss(save.buf[k])}`).join(' ');if(!c)bn.insertAdjacentHTML('afterbegin',`<span class="ban buf423">${tx}</span>`);else c.textContent=tx}else if(c)c.remove()};
// 뽑기
const GACHA=[ // [무게, 종류, 값]
 [41.6,'coin'],[16,'xp'],[14,'buf'],[12,'tre'],[10,'x',2],[4,'x',5],[2,'jp',3],[.4,'x',25]];
function gachaRoll(cost){let r=Math.random()*GACHA.reduce((a,b)=>a+b[0],0),p=GACHA[GACHA.length-1];for(const q of GACHA){r-=q[0];if(r<=0){p=q;break}}
 const [,k,v]=p;
 if(k==='coin'){const g=Math.round(cost*rnd(.4,.8));/* 4.28 환급 30~80% → 40~80% (천장과 합쳐 평균 약 1배) */save.gold+=g;return{ic:'🪙',t:`동전 ${g.toLocaleString()}`,lv:0,g}}
 if(k==='xp'){const x=Math.round(xpNeed(save.lv)*rnd(.15,.3));addXp(x);return{ic:'📘',t:`경험치 +${x.toLocaleString()}`,lv:0}}
 if(k==='buf'){const id=Object.keys(BUF)[Math.floor(Math.random()*3)];addBuf(id,900);return{ic:BUF[id].ic,t:`${BUF[id].n} 15분`,lv:1}}
 if(k==='tre'){const d=giveTre();if(d)return{ic:'💎',t:`보물 「${d.t.n}」${d.isNew?' 첫 발견!':` Lv${d.lv}`}`,lv:2};const g=cost;save.gold+=g;return{ic:'🪙',t:`동전 ${g.toLocaleString()}`,lv:0,g}}
 if(k==='jp'){const g=cost*v;save.gold+=g;JP.n++;JP.t=Math.min(90,JP.t+30);return{ic:'💫',t:`대박 타임 30초 + 🪙${g.toLocaleString()}`,lv:3,g}}
 const g=cost*v;save.gold+=g;return{ic:v>=25?'🎰':v>=5?'💰':'🪙',t:`${v>=25?'초대박!! ':v>=5?'대박! ':''}×${v} · 🪙${g.toLocaleString()}`,lv:v>=25?5:v>=5?4:1,g,x:v}}
let LASTG=null,gBusy=false;
function shopHTML(){const gc=gCost(),gold=save.gold,st=save.st;
 const last=LASTG?(LASTG.length===1?`<div class="gres l${LASTG[0].lv}">${LASTG[0].ic} ${LASTG[0].t}</div>`:`<div class="gres l${Math.max(...LASTG.map(x=>x.lv))}">`+LASTG.slice().sort((a,b)=>b.lv-a.lv).map(x=>`<span>${x.ic} ${x.t}</span>`).join('')+'</div>'):'<div class="gres">무엇이 나올까요?</div>';
 const owned=TRE.filter(t=>save.tre[t.id]);
 return `<div class="sum">🪙 ${gold.toLocaleString()} 골드 · 골드를 써서 더 크게! (가격은 레벨에 따라 올라가요)</div>`
 +`<div class="sec">🎰 행운 뽑기 <small>(뽑은 횟수 ${st.gacha||0})</small></div><div class="gacha"><div id="gReel" class="greel">🎰</div>${last}
  <div class="gbtns"><button data-shop="g1" ${gold<gc||gBusy?'disabled':''}>1회 🪙${gc.toLocaleString()}</button><button data-shop="g10" ${gold<gc*9||gBusy?'disabled':''}>10회 🪙${(gc*9).toLocaleString()} <small>(1회 무료)</small></button></div>
  <p class="gp">동전 · 경험치 · 버프 · 보물 · ×2 · ×5 대박 · 💫대박 타임 · ×25 초대박</p></div>`
 +`<div class="sec">🧪 버프 (10분 · 겹쳐 사면 시간 연장, 최대 4시간)</div>`
 +Object.keys(BUF).map(id=>{const b=BUF[id],c=bCost(id),on=save.buf[id]>0;return`<div class="row ${on?'eq':''}" style="grid-template-columns:44px 1fr auto"><div class="ic">${b.ic}</div><div><b>${b.n}</b><p>${b.d}${on?` · 남은 시간 ${mmss(save.buf[id])}`:''}</p></div><button data-shop="b_${id}" ${gold<c?'disabled':''}>🪙${c.toLocaleString()}</button></div>`}).join('')
 +`<div class="row" style="grid-template-columns:44px 1fr auto"><div class="ic">💫</div><div><b>대박 타임 즉시</b><p>30초 동안 희귀 이상 ×1.5 · 골드 +20% (영웅 이상을 낚으면 연장)</p></div><button data-shop="jp" ${gold<jpCost()?'disabled':''}>🪙${jpCost().toLocaleString()}</button></div>`
}/* 4.25 보물 연마 삭제(보물은 같은 보물을 또 건지면 레벨 업, 제한 없음) */
SH.equip.tabs.push(['shop','🛍️ 상점']);
const _eh423=equipHTML;equipHTML=function(){return sheet.tab==='shop'?shopHTML():_eh423()};
const _rs423=renderSheet;renderSheet=function(){_rs423();if(sheet.k==='equip'&&sheet.tab==='shop'&&typeof drawTreCells==='function')drawTreCells()};
const reShop=()=>{const st=$('sbody').scrollTop;renderSheet();$('sbody').scrollTop=st;hud()};
function gachaFx(best){const L=best.lv;if(L>=4){bigText(best.x>=25?'🎰 초대박!!':best.lv===3?'💫 대박 타임!':'💰 대박!',best.t,L>=5?'#ff5fae':'#ffd23f');sparkle(W/2,H*.4,L>=5?140:80,['#ffd23f','#fff','#ff9ad8','#7ff0e6']);flash=1;flashCol='255,220,120';shake=L>=5?10:5;SFX.legend();vib(L>=5?[50,40,50,40,160]:[40,30,80])}
 else if(L>=2){SFX.rare();vib([25,25,40])}else if(SFX.coin)SFX.coin()}
function doGacha(n){if(gBusy)return;const c=gCost(),price=n>1?c*9:c;if(save.gold<price){toast('골드가 모자라요',900);return}
 save.gold-=price;save.st.gacha=(save.st.gacha||0)+n;gBusy=true;const res=[];for(let i=0;i<n;i++)res.push(gachaRoll(c));
 if(res.some(x=>x.x>=25))save.titles['뽑기의 신']=1;persist();hud();
 const el=$('gReel'),sym=['🪙','📘','🌟','💎','💰','💫','🎰','⚡'];let i=0;if(el)el.classList.add('spin');const btns=[...document.querySelectorAll('[data-shop^="g"]')];btns.forEach(b=>b.disabled=true);
 const iv=setInterval(()=>{if(el)el.textContent=sym[i++%sym.length];if(i%2&&SFX.click)SFX.click()},70);
 setTimeout(()=>{clearInterval(iv);gBusy=false;LASTG=res;const best=res.slice().sort((a,b)=>b.lv-a.lv)[0];gachaFx(best);if(sheet.k==='equip'&&sheet.tab==='shop')reShop();
  const e2=$('gReel');if(e2){e2.textContent=best.ic;e2.classList.add('pop')}},n>1?1300:950)}
$('sbody').addEventListener('click',e=>{const b=e.target.closest('button[data-shop]');if(!b)return;const a=b.dataset.shop;
 if(a==='g1'||a==='g10'){doGacha(a==='g1'?1:10);return}
 if(a.startsWith('b_')){const id=a.slice(2),c=bCost(id);if(save.gold<c)return;save.gold-=c;addBuf(id);SFX.reward&&SFX.reward(2);toast(`${BUF[id].ic} ${BUF[id].n} · ${mmss(save.buf[id])}`,1000)}
 else if(a==='jp'){const c=jpCost();if(save.gold<c)return;save.gold-=c;JP.n++;JP.t=Math.min(90,JP.t+30);document.body.classList.add('jp421');SFX.legend();notice('💫 대박 타임 30초! 희귀 이상 1.5배 · 골드 +20%')}

 persist();reShop()});
if(TEST)Object.defineProperties(window.__w,{slkLim:{value:()=>slkLim()},fg:{get(){return fg}},gCost:{value:()=>gCost()},gachaRoll:{value:c=>gachaRoll(c)},doGacha:{value:n=>doGacha(n)},bCost:{value:id=>bCost(id)},bufGold:{value:()=>bufGold()}});
// 상단 골드를 누르면 바로 상점 (낚시 중에는 무시)
{const gp=$('gold').closest('.pill');gp.classList.add('goldShop');gp.addEventListener('click',e=>{e.stopPropagation();if(['charge','cast','bite','hook','fight','land'].includes(S))return;openSheet('equip','shop')})}
