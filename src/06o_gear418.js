/* ================= 4.18 손맛·난이도·보상 · 장비 계승 =================
 ① 손맛: 일반·고급·희귀는 더 빨리(목표 시간↓) 잡히고, 저항(돌진)이 1.5배 자주 옴
 ② 난이도: 손을 뗀 채 장력이 바닥(8 미만)으로 빠지면 0.6초 만에 놓침 · 빨간 칸(85 초과, "위험! 손 떼요")에 닿는 즉시 위기 링
    위기 링 시간도 촉박하게(06b CL_PER 1.25→0.95초, 판정 폭 0.17→0.15)
 ③ 보상: 물고기 골드 +30%(GOLD_BASE), 경험치 ↑(06_game), 미션 보상 +30%, 보물 가치 +20%
 ④ 장비 계승
   - 승급: +3 이상 강화한 장비 → 바로 위 단계로 진화. 비용 = 다음 장비 값의 40%(+4: 35%, +5: 30%). 강화 단계 절반(내림) 이어받음
   - 보상 판매: 새 장비를 살 때, 보유한 바로 아래 단계 장비 값 30% + 그 장비 강화에 쓴 돈 50%를 할인 (최대 60%)
   - 계승 보너스: 승급할 때마다 그 종류(낚싯대·릴·줄) 주요 능력 영구 +3% (최대 5번 = +15%)
   - 숙련도(추가): 장착한 장비로 물고기를 낚을 때마다 숙련 +1 → 그 장비 강화비 최대 30% 할인(100마리) */
T414_BASE[1]=3;T414_BASE[2]=4;T414_BASE[3]=5.5;
MT.forEach(m=>m.g=Math.round(m.g*1.3));WT.forEach(m=>m.g=Math.round(m.g*1.3));TRE.forEach(t=>t.val=Math.round(t.val*1.2));
// ① ② 전투
const _fi418=fight;fight=function(dt,g){_fi418(dt,g);if(S!=='fight'||!fish||fg.clutch>0||fg.final>0)return;
 if(fish.r>=1&&fish.r<=3&&!fg.boss&&fg.surge<=0&&fg.charge<=0)fg.next-=dt*.5;                       // 저항 1.5배 자주
 // 손을 뗀 채 장력이 바닥이면 0.6초 만에 놓침 — 점프·돌진·경고·얼음·약점처럼 '손 떼요' 구간과 그 직후 0.4초는 제외, 감고 있으면 세지 않음
 const free=fg.air>0||fg.warn>0||fg.roar>0||fg.diveT>0||fg.charge>0||fg.freeze>0||fg.weak>0||fg.ex>0;if(free)fg.freeT=T+.4;
 fg.slk=fg.ten<8&&!holding&&!free&&T>(fg.freeT||0)?(fg.slk||0)+dt:0;if(fg.slk>.6){fg.slk=0;fail('줄이 느슨해서 도망갔어요 · 장력을 놓지 마세요');return}
 if(fg.ten>85&&T>(fg.redCd||0)&&fg.hp>3){fg.redCd=T+1.2;fg.clutchUsed=false;startClutch()}};
const _ct418=clutchTap;clutchTap=function(){const w=fg.clutch;_ct418();if(w>0&&!(fg.clutch>0)&&S==='fight')fg.redCd=T+1.2};
// ④ 계승
function inh(){const q=save.inh||(save.inh={rod:0,reel:0,line:0});return q}
const _gs418=GS;GS=function(gear=save.gear,enh=save.enh){const o=_gs418(gear,enh),q=inh(),k=c=>1+.03*Math.min(5,q[c]||0);
 o.pow=Math.round(o.pow*k('rod'));o.stab=Math.round(o.stab*k('rod'));o.spd=+(o.spd*k('reel')).toFixed(2);o.max=+(o.max*k('line')).toFixed(1);o.grace=+(o.grace*k('line')).toFixed(2);return o};
const catOf=id=>Object.keys(GLIST).find(k=>GLIST[k].some(x=>x.id===id));
function gm(id){return(save.gm||(save.gm={}))[id]||0}
function enhPrice(it,lv){return Math.round(enhCost(it,lv)*(1-Math.min(.3,gm(it.id)*.003))/10)*10}
function enhSpent(it){let s=0;for(let i=0;i<(save.enh[it.id]||0);i++)s+=enhCost(it,i);return s}
function tradeIn(cat,it){const L=GLIST[cat],i=L.indexOf(it);if(i<=0)return 0;const lo=L[i-1];if(!save.gown[lo.id])return 0;return Math.min(Math.round(it.price*.6),Math.round(lo.price*.3+enhSpent(lo)*.5))}
function evoInfo(cat,it){const L=GLIST[cat],i=L.indexOf(it),nx=L[i+1],lv=save.enh[it.id]||0;if(!nx||lv<3||!save.gown[it.id])return null;
 return{nx,cost:Math.round(nx.price*({3:.4,4:.35,5:.3}[lv])/10)*10,carry:Math.max(save.enh[nx.id]||0,Math.floor(lv/2))}}
const pay418=p=>{if(save.gold>=p){save.gold-=p;spend(p);return true}toast('골드가 부족해요',700);return false};
// 장비 화면: 버튼 바꾸기 (구매가 할인 · 강화비 할인 · 승급)
const _gh418=gearHTML;gearHTML=function(cat){let h=_gh418(cat);const sel=gsel[cat]||save.gear[cat],it=GLIST[cat].find(x=>x.id===sel);if(!it)return h;
 const own=!!save.gown[it.id],lv=save.enh[it.id]||0,ti=own?0:tradeIn(cat,it);
 if(!own&&ti>0){const pr=it.price-ti;h=h.replace(/<button class="big" data-act="gBuy"[^>]*>구매 🪙[\d,]+<\/button>/,`<button class="big" data-act="gBuy" data-id="${it.id}" data-cat="${cat}" ${save.gold<pr?'disabled':''}>구매 🪙${pr.toLocaleString()} <small>(보상 판매 -${ti.toLocaleString()})</small></button>`)}
 if(own&&lv<ENH_MAX){const p=enhPrice(it,lv);h=h.replace(/(<button data-act="gEnh"[^>]*?)( disabled)?>강화 \+\d+ 🪙[\d,]+<\/button>/,`$1${save.gold<p?' disabled':''}>강화 +${lv+1} 🪙${p.toLocaleString()}${gm(it.id)?` <small>(숙련 -${Math.round(Math.min(.3,gm(it.id)*.003)*100)}%)</small>`:''}</button>`)}
 const ev=evoInfo(cat,it);if(ev)h=h.replace('<div class="gbtn">',`<div class="gbtn"><button class="big evo418" data-act="gEvo" data-id="${it.id}" data-cat="${cat}" ${save.gold<ev.cost?'disabled':''}>⬆️ 승급 → ${ev.nx.n} 🪙${ev.cost.toLocaleString()} <small>(+${ev.carry} 계승 · 영구 +3%)</small></button>`);
 else if(own&&GLIST[cat][GLIST[cat].indexOf(it)+1]&&lv<3)h=h.replace('<div class="gbtn">',`<p class="evh418">💡 +3 강화하면 <b>${GLIST[cat][GLIST[cat].indexOf(it)+1].n}</b>(으)로 승급할 수 있어요 (새로 사는 것보다 60% 이상 저렴)</p><div class="gbtn">`);
 const q=inh()[cat]||0;h=h.replace('<div class="gbtn">',`<p class="evh418">🧬 계승 ${q}/5 (${{rod:'제압·안정',reel:'감기 속도',line:'최대 하중·버팀'}[cat]} +${q*3}%) · 🎖️ 숙련 ${gm(it.id)}</p><div class="gbtn">`);
 return h};
$('sbody').addEventListener('click',e=>{const b=e.target.closest('button[data-act]');if(!b)return;const a=b.dataset.act;if(!['gBuy','gEnh','gEvo'].includes(a))return;
 const id=b.dataset.id,cat=b.dataset.cat||catOf(id),it=GLIST[cat].find(x=>x.id===id);let done=false;
 if(a==='gBuy'){const ti=tradeIn(cat,it);if(!ti)return;e.stopImmediatePropagation();if(pay418(it.price-ti)){save.gown[id]=1;save.gear[cat]=id;SFX.upgrade();sparkle(W/2,H*.4,30);toast(`구매 완료! 보상 판매 -${ti.toLocaleString()}`,1100);done=true}}
 else if(a==='gEnh'){e.stopImmediatePropagation();const lv=save.enh[id]||0;if(lv<ENH_MAX&&pay418(enhPrice(it,lv))){save.enh[id]=lv+1;SFX.upgrade();toast(`${it.n} +${lv+1} 강화!`,900);done=true}}
 else if(a==='gEvo'){e.stopImmediatePropagation();const ev=evoInfo(cat,it);if(ev&&pay418(ev.cost)){save.gown[ev.nx.id]=1;save.enh[ev.nx.id]=ev.carry;save.gear[cat]=ev.nx.id;gsel[cat]=ev.nx.id;const q=inh();q[cat]=Math.min(5,(q[cat]||0)+1);
  bigText('⬆️ 승급!',`${it.n} → ${ev.nx.n} +${ev.carry} · 계승 ${q[cat]}/5`,'#ffd23f');sparkle(W/2,H*.4,60,['#ffd23f','#fff','#7ff0e6']);SFX.upgrade();vib([20,30,60]);done=true}}
 if(done){persist();hud();chips();const st=$('sbody').scrollTop;renderSheet();$('sbody').scrollTop=st}},true);
// 숙련도: 물고기를 낚을 때 장착 장비에 +1
const _sr420=showResult;showResult=function(){const f=fish;_sr420();if(f&&f.r>0&&!f.tre&&!practice&&lastRes&&lastRes.f===f){const m=save.gm||(save.gm={});for(const c of['rod','reel','line'])m[save.gear[c]]=(m[save.gear[c]]||0)+1;persist()}};
if(TEST)Object.defineProperties(window.__w,{tradeIn:{value:(c,id)=>tradeIn(c,GLIST[c].find(x=>x.id===id))},evoInfo:{value:(c,id)=>evoInfo(c,GLIST[c].find(x=>x.id===id))},enhPrice:{value:id=>{const c=catOf(id);return enhPrice(GLIST[c].find(x=>x.id===id),save.enh[id]||0)}}});
