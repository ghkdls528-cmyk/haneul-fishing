/* ================= 4.15 보물 업데이트 =================
 ① 보물 그림: itempx.json의 tre_<보물id>가 있으면 그 그림, 없으면 기존 코드 그림(drawTreasure)
 ② 보물 장착: 장비 › 보물 탭. 칸 1개(레벨 10부터 2칸). 수집한 보물을 장착하면 종류(kind)별 효과
    수치는 ★3 기준이고 등급에 따라 ★1 ×0.6 · ★2 ×0.8 · ★3 ×1 · ★4 ×1.25 · ★5 ×1.5 */
const _dt415=drawTreasure;drawTreasure=function(c,t,x,y,s,tm){const k='tre_'+t.id;
 if(ipOk(k)){const im=IPI[k],L=76*s,sc=L/Math.max(im.naturalWidth,im.naturalHeight),w=im.naturalWidth*sc,h=im.naturalHeight*sc;
  c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(im,x-w/2,y-h/2,w,h);c.restore();return}
 return _dt415(c,t,x,y,s,tm)};

const TRE_STAR=[0,.6,.8,1,1.25,1.5];
// 종류별 효과(★3 기준 값) · u: 표시 단위
const TRE_FX={
 coin:{v:4,f:v=>`금화 +${v}%`},
 bottle:{v:8,f:v=>`일일·주간 미션 보상 +${v}%`},
 scroll:{v:4,f:v=>`보물 낚시 보물 확률 +${v}%p`},
 pearl:{v:3,f:v=>`희귀(★3 이상) 물고기 확률 +${v}%`},
 gem:{v:5,f:v=>`경험치 +${v}%`},
 vase:{v:6,f:v=>`물고기 판매 금화 +${v}%`},
 compass:{v:8,f:v=>`입질 대기시간 -${v}%`},
 ring:{v:3,f:v=>`콤보가 끊길 때 1번 보호 (하루 ${Math.max(1,Math.round(v))}회)`},
 chest:{v:8,f:v=>`금화 +${v}%`},
 amulet:{v:30,f:v=>`비·폭풍 때 보물·희귀어 확률 ×${(1+v/100).toFixed(2)}`},
 crown:{v:25,f:v=>`다른 장착 보물 효과 ×${(1+v/100).toFixed(2)}`},
 trident:{v:10,f:v=>`보스 전투 줄 장력 여유 +${v}%`},
 // 4.15 새 보물 (위와 겹치지 않는 비슷한 크기)
 pouch:{v:8,f:v=>`수족관 관람료 +${v}%`},
 bell:{v:8,f:v=>`챔질 가능 시간 +${v}%`},
 coral:{v:4,f:v=>`대형 개체 확률 +${v}%p`},
 hourglass:{v:10,f:v=>`피버 타임 +${v}%`},
 fishstatue:{v:5,f:v=>`변종(황금·돌연변이·알비노) 확률 +${v}%`}};
const treR1=v=>Math.round(v*10)/10;
function treVal(t){const fx=TRE_FX[t.kind];return fx?fx.v*TRE_STAR[t.r]:0}
function treText(t){const fx=TRE_FX[t.kind];return fx?fx.f(t.kind==="ring"?fx.v:treR1(treVal(t))):''}
function treSlots(){return save.lv>=10?2:1}
function treEqList(){const q=save.treEq||(save.treEq={slots:[null,null],ring:{d:'',n:0}});return q.slots.slice(0,treSlots()).filter(id=>id&&TREI[id]&&save.tre[id]).map(id=>TREI[id])}
// 종류별 합계(%) — 왕관은 자기 말고 나머지에 곱함
function fxv(kind){const L=treEqList();let v=0;for(const t of L)if(t.kind===kind)v+=treVal(t);if(!v)return 0;
 if(kind!=='crown'){const cr=L.filter(t=>t.kind==='crown').reduce((a,t)=>a+treVal(t),0);if(cr)v*=1+cr/100}return v}
function treChance(){let p=.6+fxv('scroll')/100;const am=fxv('amulet');if(am&&(weather==='rain'||weather==='storm'))p*=1+am/100;return Math.min(.9,p)}

// --- 효과 연결 ---
const _sr416=showResult;showResult=function(){const f=fish;_sr416();if(!f||!lastRes||lastRes.f!==f||practice)return;
 let pct=fxv('coin')+fxv('chest');if(!f.tre&&f.r>0)pct+=fxv('vase');
 if(pct>0&&lastRes.gold>0){const b=Math.round(lastRes.gold*pct/100);if(b>0){save.gold+=b;lastRes.gold+=b;lastRes.treBonus=b;$('rGold').textContent='+'+lastRes.gold.toLocaleString();
  $('rRec').textContent=[$('rRec').textContent,`💰 보물 효과 +${b.toLocaleString()}`].filter(Boolean).join(' · ')}}
 if(lastRes.feverStart){const h=fxv('hourglass');if(h)fever*=1+h/100}
 persist();hud()};
// 일일·주간 미션 보상 +% (유리병)
{let pre=null;$('sbody').addEventListener('click',e=>{const b=e.target.closest('button[data-act]');pre=b&&(b.dataset.act==='claimM'||b.dataset.act==='claimW')?{a:b.dataset.act,i:+b.dataset.i,g:save.gold}:null},true);
 $('sbody').addEventListener('click',()=>{if(!pre)return;const P=pre;pre=null;const gain=save.gold-P.g,v=fxv('bottle');if(gain>0&&v){const b=Math.round(gain*v/100);save.gold+=b;persist();hud();setTimeout(()=>toast(`📜 유리병 효과 +${b.toLocaleString()}`,900),950)}})}
// 희귀(★3 이상) 확률 (진주) · 비·폭풍 때 희귀어 (부적)
const _wt415=weights;weights=function(far,spot){const ws=_wt415(far,spot),pv=fxv('pearl'),am=(weather==='rain'||weather==='storm')?fxv('amulet'):0;if(!pv&&!am)return ws;
 const k=(1+pv/100)*(1+am/100);return ws.map((w,i)=>FISH[i].r>=3?w*k:w)};
// 경험치 (보석)
const _ax415=addXp;addXp=function(x){const v=fxv('gem');return _ax415(v?Math.round(x*(1+v/100)):x)};
// 입질 대기시간 (나침반)
const _lb415=landBobber;landBobber=function(){_lb415();const v=fxv('compass');if(v&&fg&&fg.bite&&!bossPending){const k=1-v/100;fg.bite*=k;if(fg.cues)fg.cues=fg.cues.map(c=>c*k)}};
// 챔질 가능 시간 (난파선의 종)
const _bn415=biteNow;biteNow=function(g){_bn415(g);const v=fxv('bell');if(v&&fg.win)fg.win*=1+v/100};
// 콤보 보호 (은빛 반지, 하루 3회)
const _cb415=comboBreak;comboBreak=function(){const v=fxv('ring'),q=save.treEq;
 if(v&&combo>=2&&q){const d=today();if(q.ring.d!==d)q.ring={d,n:0};if(q.ring.n<3){q.ring.n++;notice(`💍 은빛 반지가 ${combo}연속 콤보를 지켰어요 (오늘 ${q.ring.n}/3)`);persist();return}}
 return _cb415()};
// 보스 전투 줄 장력 여유 (삼지창)
const _sf415=startFight;startFight=function(g){_sf415(g);const v=fxv('trident');if(v&&S==='fight'&&fg.boss){const k=1+v/100;fg.ts/=k;fg.gs=Object.assign({},fg.gs,{grace:fg.gs.grace*k})}};
// 수족관 관람료 (금화 꾸러미)
const _aq415=aqRate;aqRate=function(){const v=fxv('pouch');return Math.round(_aq415()*(1+v/100))};
// 대형 개체 (산호) · 변종 (황금 물고기상)
const _mf415=makeFish;makeFish=function(f0,opt){const f=_mf415(f0,opt);if(!(f.r>=1)||f.boss||f.tre||['chest','clam'].includes(f.k))return f;
 const cv=fxv('coral');if(cv&&!f.giant&&f.sc<2&&Math.random()<cv/100){f.size=Math.round(f0.min+(f0.max-f0.min)*rnd(.76,1));f.pct=clamp((f.size-f0.min)/Math.max(1,f0.max-f0.min),0,1);f.sc=2;const kg=kgOf(f0,f.size);f.kgv=+kg.toFixed(kg<10?2:1)}
 const sv=fxv('fishstatue');if(sv&&!f.v&&!f.hid&&Math.random()<.039*sv/100)f.v=['gold','mut','albino'][Math.floor(Math.random()*3)];
 return f};

// --- 장비 › 보물 탭 ---
SH.equip.tabs.push(['tre','💰 보물']);
function treEqHTML(){const n=treSlots(),L=treEqList(),q=save.treEq,owned=TRE.filter(t=>save.tre[t.id]);
 const slot=i=>{const id=q.slots[i];const t=i<n&&id&&TREI[id]&&save.tre[id]?TREI[id]:null;
  return i>=n?`<div class="row"><div class="ic">🔒</div><div><b>${i+1}번 칸</b><p>레벨 10에 열려요</p></div></div>`
  :`<div class="row ${t?'eq':''}" style="grid-template-columns:56px 1fr auto"><div class="ic">${t?`<canvas width="112" height="112" data-tre="${t.id}" style="width:48px;height:48px"></canvas>`:'➕'}</div><div><b>${i+1}번 칸 · ${t?t.n:'비어 있음'}</b><p>${t?treText(t):'아래 목록에서 보물을 골라 장착해요'}</p></div>${t?`<button data-treq="${t.id}">해제</button>`:''}</div>`};
 const crown=L.some(t=>t.kind==='crown');
 return `<div class="sum">💰 보물 장착 ${L.length}/${n}칸 · 수집한 보물을 장착하면 효과가 생겨요<br><small>효과는 ★3 기준 · ★1 ×0.6 · ★2 ×0.8 · ★4 ×1.25 · ★5 ×1.5${crown?' · 👑 왕관이 다른 보물 효과를 키워요':''}</small></div>`
 +[0,1].map(slot).join('')+`<div class="sec">수집한 보물 ${owned.length}/${TRE.length}</div>`
 +(owned.length?owned.map(t=>{const on=q.slots.slice(0,n).includes(t.id);return`<div class="row ${on?'eq':''}" style="grid-template-columns:56px 1fr auto"><div class="ic"><canvas width="112" height="112" data-tre="${t.id}" style="width:48px;height:48px"></canvas></div><div><b>${t.n} <span style="color:${RAR[t.r].c}">${'★'.repeat(t.r)}</span></b><p>${treText(t)}</p></div><button data-treq="${t.id}">${on?'해제':'장착'}</button></div>`}).join('')
 :'<p style="text-align:center;color:#8a6a4a">아직 모은 보물이 없어요. 낚시 모드에서 「보물 낚시」를 해 보세요!</p>')}
const _eh415=equipHTML;equipHTML=function(){return sheet.tab==='tre'?treEqHTML():_eh415()};
const _rs415=renderSheet;renderSheet=function(){_rs415();if(sheet.k==='equip'&&sheet.tab==='tre')drawTreCells()};
$('sbody').addEventListener('click',e=>{const b=e.target.closest('button[data-treq]');if(!b)return;const id=b.dataset.treq,q=save.treEq,n=treSlots(),i=q.slots.indexOf(id);
 if(i>=0&&i<n){q.slots[i]=null;toast(`${TREI[id].n} 해제`,700)}
 else{const e0=[0,1].slice(0,n).find(k=>!q.slots[k]||!save.tre[q.slots[k]]);if(e0==null){toast('칸이 가득 찼어요 · 먼저 하나를 해제해요',1000);return}q.slots[e0]=id;SFX.coin&&SFX.coin();toast(`💰 ${TREI[id].n} 장착 · ${treText(TREI[id])}`,1100)}
 persist();const st=$('sbody').scrollTop;renderSheet();$('sbody').scrollTop=st});
if(TEST)Object.defineProperties(window.__w,{fxv:{value:fxv},treChance:{value:treChance},treText:{value:t=>treText(TREI[t])},treSlots:{value:treSlots},
 call415:{value:(n,...a)=>({addXp,aqRate,weights,makeFish:id=>makeFish(FID[id]),xp:()=>save.xp,lv:()=>save.lv})[n](...a)},combo:{get(){return combo}},fever:{get(){return fever}}});
