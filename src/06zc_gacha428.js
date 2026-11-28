/* ================= 4.28 행운 뽑기 개선 (골드를 날린 느낌 줄이고 더 짜릿하게) =================
 - 버프: 상점 10분·뽑기 15분, 최대 4시간 (06u) · 동전 환급 40~80% (06u)
 - 천장: 대박(×5 이상) 없이 10번째 뽑기는 💎 장비 보물 확정, 대박(×10 이상) 없이 50번째는 ×10 천장 대박 — save.gpity.n10 / n50
 - 행운 포인트: 뽑을 때마다 1점(save.gpity.pt) → 교환: 20점 원하는 버프 30분 · 40점 장비 보물 확정 · 100점 ×10 대박 확정
 - 골드 기대값(천장 포함) 약 1배: 쓴 골드는 평균적으로 돌아오고, 경험치·버프·보물이 덤 (돈 복사는 안 되게)
 - 천장·포인트 진행도를 뽑기 칸 아래 막대로 보여 줌 */
const GP_EX=[['rare',20,'🌟 희귀 물고기 향 30분'],['gold',20,'🪙 황금 손 30분'],['bite',20,'⚡ 빠른 입질 30분'],['tre',40,'💎 장비 보물 확정'],['jack',100,'💰 대박 확정 ×10']];
function gp(){const q=save.gpity||(save.gpity={n10:0,n50:0,pt:0});return q}
{const _gr=gachaRoll;gachaRoll=function(cost){const q=gp();q.pt++;q.n10++;q.n50++;let r;
 if(q.n50>=50){const g=cost*10;save.gold+=g;r={ic:'🎰',t:`천장 대박!! ×10 · 🪙${g.toLocaleString()}`,lv:5,g,x:10,pity:1}}
 else if(q.n10>=10){const d=giveTre();r=d?{ic:'💎',t:`천장 보물 「${d.t.n}」${d.isNew?' 첫 발견!':` Lv${d.lv}`}`,lv:4,pity:1}:_gr.apply(this,arguments)}
 else r=_gr.apply(this,arguments);
 if(r.lv>=4)q.n10=0;if(r.x>=10)q.n50=0;if(q.n10>=10)q.n10=0;return r}}
function gpHTML(){const q=gp();const bar=(v,m,c)=>`<div class="gpbar"><i style="width:${Math.min(100,v/m*100)}%;background:${c}"></i></div>`;
 return`<div class="gp428"><div class="gprow"><span>💎 보물 천장</span><b>${q.n10}/10</b>${bar(q.n10,10,'linear-gradient(90deg,#ffd23f,#ff9a3d)')}</div>
 <div class="gprow"><span>🎰 ×10 대박 천장</span><b>${q.n50}/50</b>${bar(q.n50,50,'linear-gradient(90deg,#ff7ad9,#a050ff)')}</div>
 <div class="gprow"><span>🎟️ 행운 포인트</span><b>${q.pt.toLocaleString()}점</b><small>뽑을 때마다 +1</small></div>
 <div class="gpex">${GP_EX.map(([k,c,n])=>`<button data-gpx="${k}" ${q.pt<c?'disabled':''}><span>${n}</span><small>${c}점</small></button>`).join('')}</div></div>`}
{const _sh=shopHTML;shopHTML=function(){return _sh.apply(this,arguments).replace('<div class="sec">🧪 버프',gpHTML()+'<div class="sec">🧪 버프')}}
$('sbody').addEventListener('click',e=>{const b=e.target.closest('button[data-gpx]');if(!b||b.disabled)return;const k=b.dataset.gpx,it=GP_EX.find(x=>x[0]===k),q=gp();if(!it||q.pt<it[1])return;q.pt-=it[1];
 if(BUF[k]){addBuf(k,1800);toast(`${BUF[k].ic} ${BUF[k].n} 30분 · 남은 ${mmss(save.buf[k])}`,1100);SFX.reward&&SFX.reward(2)}
 else if(k==='tre'){const d=giveTre();if(d){bigText('💎 보물 확정!',`「${d.t.n}」${d.isNew?' 첫 발견!':` Lv${d.lv}`}`,'#7ff0e6');SFX.rare&&SFX.rare()}else{q.pt+=it[1];toast('지금은 보물을 줄 수 없어요',900);return}}
 else if(k==='jack'){const g=gCost()*10;save.gold+=g;LASTG=[{ic:'💰',t:`포인트 대박!! ×10 · 🪙${g.toLocaleString()}`,lv:4,g,x:10}];gachaFx(LASTG[0])}
 persist();hud();reShop()});
if(TEST)Object.defineProperties(window.__w,{gp:{value:()=>gp()}});
