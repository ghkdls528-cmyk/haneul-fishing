/* ================= 4.21 최종 그림 · 추천 미끼 이름 · 지역 보너스 · 황금상자 · 도파민 =================
 ① 찌 그림: itempx bob_<찌id>가 있으면 그림으로(빛나는 효과는 그대로), 없으면 기존 코드 그림
 ② 도감 추천 미끼: 옛 이름 '메탈 루어'가 남아 있던 버그 → 실제 미끼 이름(반짝이 루어 등)으로, 확률 계산(weights)과 같은 기준
 ③ 지역 골드 보너스: 열어 둔 낚시터 중 가장 높은 보너스를 모든 낚시터에서 (06d·09_ui의 locGM)
 ④ 황금상자: 영웅(★4) 물고기와 같은 골드 계산 + 대박 뽑기(75% ×1.3 · 20% ×2와 보물 · 5% ×5 대박)
 ⑤ 도파민: 대박 타임(영웅 이상을 낚으면 30초 동안 희귀 이상 1.5배·골드 +20%, 이어서 낚으면 시간 연장)
          결과 화면 골드 숫자가 빠르게 올라가는 연출 */
// ① 찌
const _bob421=bobber;bobber=function(x,y,tilt=0,c=ctx,id=save.bob){const k='bob_'+id;if(!ipOk(k))return _bob421(x,y,tilt,c,id);
 const im=IPI[k],h=24,w=h*im.naturalWidth/im.naturalHeight;c.save();c.translate(x,y);c.rotate(tilt);
 if((id==='star'&&isNight())||id==='goldbob'){const gl=c.createRadialGradient(0,0,2,0,0,22);gl.addColorStop(0,id==='goldbob'?'rgba(255,220,90,.6)':'rgba(255,240,150,.7)');gl.addColorStop(1,'rgba(255,240,150,0)');c.fillStyle=gl;c.beginPath();c.arc(0,0,22,0,7);c.fill()}
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(im,-w/2,-14,w,h);c.restore()};
// ② 추천 미끼
const bn=id=>(BAITS.find(b=>b.id===id)||{}).n||id;
baitPref=function(f){const a=[],tg=f.tags||[],m=f.m||'';
 if(m.includes('d'))a.push(bn('deepb'));if(tg.includes('ceph'))a.push(bn('egi'));if(tg.includes('pred')&&f.r>=3)a.push(bn('squidb'));
 if(['zigzag','charge','jump'].includes(f.fm))a.push(bn('lure'));if(tg.includes('dom')||m.includes('b'))a.push(bn('shrimpb'));
 if((f.loc.includes('lake')||f.loc.includes('valley'))&&f.k==='fish'&&f.r<=3)a.push(bn('paste'));if(f.r===2||f.r===3)a.push(bn('krill'));
 if(!a.length)a.push(bn('worm'));return[...new Set(a)].slice(0,2)};
// ③ 지역 보너스
function locGM(){let m=1;for(const l of LOCS)if(save.locs[l.id])m=Math.max(m,LOC_GM[l.id]||1);return m}
// ④ 황금상자
let CHEST=null;
// 상자 ×2 이상: 보물 하나 확정(treDrop과 같은 기록 방식)
function giveTre(){const t=pickTre();if(!t)return null;const R=save.tre[t.id],isNew=!R,r=R||(save.tre[t.id]={n:0,first:today(),loc:save.loc,lv:1});r.n++;r.lv=(r.lv||1)+(isNew?0:1);save.st.tre=(save.st.tre||0)+1;return{t,isNew,lv:r.lv}}
function chestGold(g){const r=Math.random(),lv=1+save.lv*.02;let k=1.3,tier=0;if(r<.05){k=5;tier=2}else if(r<.25){k=2;tier=1}CHEST={tier,k};return Math.round(Math.max(g,GOLD_BASE[4])*k*lv)}
// ⑤ 대박 타임
const JP={t:0,n:0};
const _wt422=weights;weights=function(far,spot){const ws=_wt422(far,spot);return JP.t>0?ws.map((w,i)=>FISH[i].r>=3?w*1.5:w):ws};
const _up422=update;update=function(dt){_up422(dt);if(JP.t>0){JP.t=Math.max(0,JP.t-dt);document.body.classList.toggle('jp421',JP.t>0);if(JP.t===0){JP.n=0;notice('💫 대박 타임 끝!')}}};
const _hud422=hud;hud=function(){_hud422();const bn_=$('banners');if(!bn_)return;let c=bn_.querySelector('.jp421b');if(JP.t>0){const tx=`💫 대박 타임 ${Math.ceil(JP.t)}초${JP.n>1?' ×'+JP.n:''}`;if(!c){bn_.insertAdjacentHTML('afterbegin',`<span class="ban jp421b">${tx}</span>`)}else c.textContent=tx}else if(c)c.remove()};
setInterval(()=>{if(JP.t>0)hud()},1000);
const _sr422=showResult;showResult=function(){const f=fish;CHEST=null;_sr422();if(!f||!lastRes||lastRes.f!==f||practice)return;
 let add=0;
 {const k=(JP.t>0?.2:0)+bufGold();if(k>0&&f.r>0&&!f.tre){add=Math.round(lastRes.gold*k);save.gold+=add;lastRes.gold+=add}}  // 대박 타임 +20% · 4.23 황금 손 버프 +30%
 if(f.k==='chest'&&CHEST){const C=CHEST;const msg=C.tier===2?'🎰 대박!! 황금상자 ×5':C.tier===1?'✨ 황금상자 ×2 + 보물':'💰 황금상자';
  setTimeout(()=>{bigText(msg,`🪙 ${lastRes.gold.toLocaleString()}`,C.tier===2?'#ff5fae':'#ffd23f');sparkle(W/2,H*.35,C.tier===2?120:60,['#ffd23f','#fff','#ff9ad8','#7ff0e6']);flash=C.tier?1:.5;flashCol='255,220,120';(C.tier===2?SFX.legend:SFX.rare)();vib(C.tier===2?[40,40,40,40,120]:[30,30,60])},450);
  if(C.tier>=1){const d=giveTre();
   if(d)$('rRec').textContent=[$('rRec').textContent,`💎 상자 속 보물 「${d.t.n}」${d.isNew?' 첫 발견!':` Lv${d.lv}`}`].filter(Boolean).join(' · ')}}
 if(f.r>=4&&!f.tre&&!f.boss){JP.n++;JP.t=Math.min(90,JP.t+30);setTimeout(()=>{notice(JP.n>1?`💫 대박 타임 연장! ${Math.ceil(JP.t)}초 (×${JP.n})`:'💫 대박 타임 30초! 희귀 이상 1.5배 · 골드 +20%');hud()},1000)}
 // 골드 숫자 올라가기
 const el=$('rGold'),LR=lastRes,to=lastRes.gold,d0=performance.now(),dur=Math.min(1400,350+Math.log10(Math.max(10,to))*250);let lastTick=0;
 const step=()=>{const k=Math.min(1,(performance.now()-d0)/dur),v=Math.round(LR.gold*(1-Math.pow(1-k,3)))/* 4.27 뒤에 붙는 보너스(강적 보상 등)까지 반영 */;el.textContent='+'+v.toLocaleString();el.style.transform=`scale(${1+.25*Math.sin(k*Math.PI)})`;
  if(k-lastTick>.12&&k<1){lastTick=k;if(AC&&SND.bus)sp('sfx_04_gold',{gap:.08,vol:.35,rate:1+k*.5})}if(k<1)requestAnimationFrame(step);else el.style.transform=''};
 requestAnimationFrame(step);persist();hud()};
// 보물 지도 효과 문구(낚시 모드 삭제에 맞춤)
TRE_FX.scroll.f=v=>`보물 발견 확률 +${v}%p`;
if(TEST)Object.defineProperties(window.__w,{locGM:{value:locGM},chestGold:{value:chestGold},JP:{get(){return JP}},baitPref:{value:id=>baitPref(FID[id])},baitNames:{value:()=>BAITS.map(b=>b.n)},gold4:{value:GOLD_BASE[4]},wts:{value:()=>weights(false,false)},scrollTxt:{value:v=>TRE_FX.scroll.f(v)},bobOk:{value:id=>ipOk('bob_'+id)},hud:{value:()=>hud()}});
