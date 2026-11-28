/* ================= 4.25 장비 보물 (하늘호의 보물) =================
 - 보물은 도감에서 빠지고 '장비 보물'로만 다룸 (장비 › 💎 보물)
 - 새 이야기: 보물선 「하늘호」가 용왕께 바칠 21가지 보물을 싣고 가다 여수 바다에 가라앉음
 - 새 등급: 조개(★1)·산호(★2)·진주(★3)·용궁(★4)·신화(★5)
 - 옵션: 주 옵션(보물 종류 효과, 레벨마다 강해짐) + 부가 옵션(처음 등급만큼, Lv 5·10·20·40에 하나씩 더)
 - 보물 레벨 제한 없음: Lv10까지 레벨당 주 옵션 +10%, 그 뒤로는 +4%씩 끝없이
 - save.tre[id].opt = [[옵션키, 값], ...] (02_save sanitize에서 정리) */
const TGRADE={1:['조개','#d8c4a4'],2:['산호','#ff9f8a'],3:['진주','#a9dcff'],4:['용궁','#b48cff'],5:['신화','#ffcf3f']};
const TSTORY_MAIN='옛날 여수 바다를 오가던 보물선 「하늘호」가 용왕께 바칠 스물한 가지 보물을 싣고 가다 큰 폭풍에 가라앉았어요. 바닷속에서 오래 잠든 보물들은 바다의 힘을 머금은 장비가 되었고, 그 힘을 다룰 낚시꾼을 기다리고 있대요.';
const TSTORY={
 coin:'하늘호 선원들이 뱃삯으로 받던 엽전. 지니고 있으면 이상하게 주머니가 묵직해져요.',
 letter:'하늘호 막내 선원이 고향 어머니께 쓴 편지. "꼭 돌아갈게요"라는 약속이 담겨 있어요.',
 map:'선장이 몰래 그려 둔 침몰 지점 지도. 지도를 펼치면 바닷속 보물이 희미하게 보인대요.',
 pearl:'용왕께 바칠 첫 번째 선물. 진주를 품은 낚시꾼에게는 귀한 물고기가 다가와요.',
 jade:'비 오는 날 하늘호 갑판을 지키던 비취. 빗물에 닿으면 초록빛 지혜가 깨어나요.',
 celadon:'고려 도공이 용궁 잔치를 위해 빚은 청자. 낚은 물고기가 더 값지게 팔려요.',
 compass:'폭풍 속에서도 하늘호를 이끌던 나침반. 바늘이 물고기가 있는 쪽을 가리켜요.',
 ring:'선장이 약혼녀에게 주려던 반지. 끊어질 뻔한 인연(콤보)을 지켜 줘요.',
 goldchest:'하늘호 창고 맨 안쪽에 있던 금고. 열 때마다 금화가 새로 차오른대요.',
 blackpearl:'밤바다 용궁 문지기가 맡겨 둔 검은 진주. 어둠 속 귀한 물고기를 불러요.',
 sapphire:'깊은 바다의 색을 그대로 담은 보석. 바라볼수록 낚시 실력이 늘어요.',
 amulet:'하늘호를 삼킨 폭풍이 남긴 번개 부적. 비바람이 칠수록 힘이 세져요.',
 icebrooch:'북쪽 빙하 왕국이 보낸 축하 선물. 녹지 않는 얼음에 지혜가 얼어 있어요.',
 crown:'용왕께 바칠 마지막 보물. 함께 지닌 다른 보물들의 힘을 깨워 줘요.',
 moonpearl:'보름달이 뜰 때마다 하늘호 돛대에 걸어 두던 진주. 달빛 물고기를 불러요.',
 trident:'용왕이 하늘호를 지키라고 내려 준 삼지창. 바다의 왕과 싸울 때 줄을 버텨 줘요.',
 pouch:'하늘호 요리사가 아껴 모은 금화 꾸러미. 수족관 손님들이 더 많이 찾아와요.',
 bell:'하늘호의 뱃종. 뎅— 울리면 물고기가 놀라 바늘을 더 오래 물고 있어요.',
 coral:'용궁 잔치 상을 꾸미던 붉은 산호. 커다란 물고기가 이 빛을 좋아해요.',
 hourglass:'하늘호가 가라앉던 밤에 멈춘 모래시계. 신나는 시간(피버)을 더 길게 붙잡아요.',
 goldfish:'용왕의 막내딸을 닮은 황금 물고기상. 신기한 빛깔의 물고기를 불러와요.'};
// 부가 옵션: 키 → [보물 종류(효과 연결), 이름, ★3 기준 값, 단위]
const TOPT={gold:['coin','골드','3','%'],xp:['gem','경험치','3','%'],rare:['pearl','희귀 확률','2.5','%'],bite:['compass','입질 대기 단축','5','%'],
 win:['bell','챔질 여유','5','%'],sell:['vase','판매 금화','4','%'],aq:['pouch','수족관 관람료','5','%'],big:['coral','대형 개체','2','%p'],var:['fishstatue','변종 확률','4','%']};
const TOPT_K=Object.keys(TOPT),TOPT_BASE=[0,1,1,2,2,3],TOPT_MS=[5,10,20,40];
// 종류별 합계 상한 (레벨 제한이 없어도 게임이 깨지지 않게)
const TCAP={coin:150,chest:150,vase:150,gem:150,pouch:200,bottle:200,pearl:100,compass:60,bell:120,coral:30,fishstatue:150,scroll:25,trident:80,amulet:200,crown:100,hourglass:150};
function treLvMul(lv){lv=Math.max(1,Math.floor(lv||1));return lv<=10?1+.1*(lv-1):1.9+.04*(lv-10)}
function treOptN(t,lv){return TOPT_BASE[t.r]+TOPT_MS.filter(m=>(lv||1)>=m).length}
function nextMs(lv){return TOPT_MS.find(m=>m>(lv||1))||0}
function rollOpt(t,have){const used=have.map(o=>o[0]),pool=TOPT_K.filter(k=>!used.includes(k)&&TOPT[k][0]!==t.kind);const k=pool[Math.floor(Math.random()*pool.length)]||TOPT_K[0];
 return[k,Math.round(+TOPT[k][2]*TRE_STAR[t.r]*rnd(.6,1.25)*10)/10]}
// 모자란 부가 옵션 채우기 → 새로 붙은 옵션 목록
function ensureOpt(id){const t=TREI[id],R=save.tre[id];if(!t||!R)return[];if(!Array.isArray(R.opt))R.opt=[];const add=[];
 while(R.opt.length<treOptN(t,R.lv)&&R.opt.length<TOPT_K.length-1){const o=rollOpt(t,R.opt);R.opt.push(o);add.push(o)}return add}
function optText(o){const d=TOPT[o[0]];return d?`${d[1]} ${o[0]==='bite'?'-':'+'}${o[1]}${d[3]}`:''}
// 레벨 제한 없음: 06q의 레벨 배율(최대 Lv5)을 새 배율로
treVal=function(t){const fx=TRE_FX[t.kind],R=save.tre[t.id];return fx?fx.v*TRE_STAR[t.r]*treLvMul(R&&R.lv):0};
// 장착 보물의 부가 옵션도 같은 종류 효과에 더함 + 상한
{const _fx=fxv;fxv=function(kind){let v=_fx(kind);for(const t of treEqList()){const R=save.tre[t.id];if(R&&Array.isArray(R.opt))for(const o of R.opt)if(TOPT[o[0]]&&TOPT[o[0]][0]===kind)v+=o[1]}
 return TCAP[kind]?Math.min(TCAP[kind],v):v}}
// 보물을 얻을 때: 레벨 제한 없이 오르고, 새 옵션이 붙으면 알림
function treGain(t,isNew){const R=save.tre[t.id];if(!R)return;if(!isNew){/* 06q·06s가 이미 +1 했지만 예전엔 5에서 멈췄음 */}
 const add=ensureOpt(t.id);if(add.length&&!isNew)setTimeout(()=>{notice(`✨ 「${t.n}」 Lv${R.lv} · 새 옵션 ${add.map(optText).join(', ')}`);SFX.rare&&SFX.rare()},1500);persist()}
{const _gt=giveTre;giveTre=function(){const d=_gt.apply(this,arguments);if(d){treGain(d.t,d.isNew);d.lv=save.tre[d.t.id].lv}return d}}
{const _td=treDrop;treDrop=function(f){const d=_td.apply(this,arguments);if(d){treGain(d.t,d.isNew);d.lv=save.tre[d.t.id].lv}return d}}
// 도감에서 보물 탭 빼기
SH.dex.tabs=SH.dex.tabs.filter(t=>t[0]!=='tre');
// 장비 › 보물 탭을 장비 보물 화면으로
SH.equip.tabs=SH.equip.tabs.map(t=>t[0]==='tre'?['tre','💎 보물']:t);
function gradeTag(t){const g=TGRADE[t.r];return`<span class="tg425" style="background:${g[1]}">${g[0]} ${'★'.repeat(t.r)}</span>`}
function treItemHTML(t,on){const R=save.tre[t.id],lv=R.lv||1,nm=nextMs(lv),opts=(R.opt||[]).map(o=>`<li>＋ ${optText(o)}</li>`).join('');
 return`<div class="row tre425 ${on?'eq':''}"><div class="ic"><canvas width="112" height="112" data-tre="${t.id}" style="width:48px;height:48px"></canvas></div>
 <div><b>${t.n}</b> ${gradeTag(t)} <span class="lv425">Lv${lv}</span>
 <p class="mo425">⭐ ${treText(t)}</p>${opts?`<ul class="op425">${opts}</ul>`:''}
 <p class="st425">${TSTORY[t.id]||t.d}</p>
 <p class="nx425">보유 ${R.n}개 · 같은 보물을 또 건지면 Lv+1${nm?` · Lv${nm}에 새 옵션`:''}</p></div>
 <button data-treq="${t.id}">${on?'해제':'장착'}</button></div>`}
treEqHTML=function(){const n=treSlots(),L=treEqList(),q=save.treEq,owned=TRE.filter(t=>save.tre[t.id]).sort((a,b)=>b.r-a.r||(save.tre[b.id].lv||1)-(save.tre[a.id].lv||1)),miss=TRE.filter(t=>!save.tre[t.id]);
 const slot=i=>{const id=q.slots[i];const t=i<n&&id&&TREI[id]&&save.tre[id]?TREI[id]:null;
  return i>=n?`<div class="row"><div class="ic">🔒</div><div><b>${i+1}번 칸</b><p>레벨 10에 열려요</p></div></div>`
  :`<div class="row ${t?'eq':''}" style="grid-template-columns:56px 1fr auto"><div class="ic">${t?`<canvas width="112" height="112" data-tre="${t.id}" style="width:48px;height:48px"></canvas>`:'➕'}</div><div><b>${i+1}번 칸 · ${t?t.n+' Lv'+(save.tre[t.id].lv||1):'비어 있음'}</b><p>${t?treText(t)+((save.tre[t.id].opt||[]).length?' · '+save.tre[t.id].opt.map(optText).join(' · '):''):'아래에서 보물을 골라 장착해요'}</p></div>${t?`<button data-treq="${t.id}">해제</button>`:''}</div>`};
 return`<div class="sum">⚓ <b>하늘호의 보물</b><br><small>${TSTORY_MAIN}</small></div>
 <div class="sum">💎 장착 ${L.length}/${n}칸 · 등급 조개★1 · 산호★2 · 진주★3 · 용궁★4 · 신화★5<br><small>⭐ 주 옵션은 레벨마다 강해지고(레벨 제한 없음), ＋ 부가 옵션은 Lv 5·10·20·40에 하나씩 더 붙어요. 보물은 낚시 중에 가끔 건지거나 상점 뽑기에서 나와요.</small></div>`
 +[0,1].map(slot).join('')+`<div class="sec">가진 보물 ${owned.length}/${TRE.length}</div>`
 +(owned.length?owned.map(t=>treItemHTML(t,q.slots.slice(0,n).includes(t.id))).join(''):'<p style="text-align:center;color:#8a6a4a">아직 건진 보물이 없어요. 낚시하다 보면 가끔 보물이 걸려요!</p>')
 +(miss.length?`<div class="sec">아직 못 찾은 보물 ${miss.length}개</div><div class="miss425">`+miss.map(t=>{const where=t.loc?t.loc.map(l=>(LOCS.find(x=>x.id===l)||{}).n||l).join('·'):'모든 낚시터';
  return`<div><canvas width="112" height="112" data-tre="${t.id}" style="width:40px;height:40px;filter:brightness(0) opacity(.35)"></canvas><span>${gradeTag(t)}<small>${where}${t.cond?' · '+TRE_COND[t.cond]:''}</small></span></div>`}).join('')+'</div>':'')};
// 처음 불러올 때 예전 보물에도 옵션 붙이기
for(const id in save.tre)ensureOpt(id);

// ---- 칭호를 두 번째 줄로 (경험치바가 칭호를 가리지 않게) ----
{const lb=document.querySelector('#top .lvbox');if(lb&&!$('titleRib')){const r=document.createElement('div');r.id='titleRib';lb.appendChild(r)}}
{const _hd=hud;hud=function(){_hd.apply(this,arguments);const need=xpNeed(save.lv),x=$('xpTxt'),r=$('titleRib');
 if(x){x.textContent=innerWidth<=420?`${Math.floor(save.xp/need*100)}%`:`${save.xp}/${need}`;x.title=''}
 if(r){const t=save.title||'';if(r.textContent!==(t?'🏷️ '+t:''))r.textContent=t?'🏷️ '+t:'';document.body.classList.toggle('hasTitle',!!t)}}}
function ribB(){const r=$('titleRib');return r&&r.textContent?r.getBoundingClientRect().bottom:0} // 알림 상자가 칭호 줄 아래로 (06c)
hud();
if(TEST)Object.defineProperties(window.__w,{treLvMul:{value:treLvMul},ensureOpt:{value:ensureOpt},optText:{value:optText},TOPT:{value:TOPT},TGRADE:{value:TGRADE},TSTORY:{value:TSTORY},treGive:{value:()=>giveTre()},fxvNow:{value:k=>fxv(k)}});
