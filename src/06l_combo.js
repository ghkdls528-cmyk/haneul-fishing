/* ================= 4.17 콤보 강화 (20콤보 이후가 밋밋하던 문제) =================
 - 새 단계: 25 폭풍 낚시꾼 · 30 용왕의 손맛 · 40 바다를 지배하는 자 · 50 전설 그 자체 · 75 신화의 낚시꾼 · 100 여수 바다의 주인
 - 배율: 20 이후에도 1콤보마다 골드 +2% (50콤보에서 ×2.8까지)
 - 10콤보마다(20·30·40…) 콤보 보물상자: 골드 + 경험치, 50·100엔 전설 미끼, 30·50·100엔 칭호
 - 연출: 다음 보상까지 게이지, 20콤보부터 무지개 테두리·콤보 숫자 불꽃, 단계마다 색이 바뀌는 숫자 */
COMBO_T.push([25,'폭풍 낚시꾼','#ff8a3d'],[30,'용왕의 손맛','#3fe0d0'],[40,'바다를 지배하는 자','#7a7dff'],[50,'전설 그 자체','#ffd700'],[75,'신화의 낚시꾼','#ff4fd8'],[100,'여수 바다의 주인','#ffffff']);
const CMB_TITLE={30:'파도를 탄 자',50:'콤보의 전설',100:'여수 바다의 주인'};
const comboExtra=()=>combo>20?.02*Math.min(combo-20,30):0;   // 기본 배율(최대 ×2.2) 위에 더하는 몫
function comboNext(){return combo<20?Math.ceil((combo+1)/5)*5:Math.ceil((combo+1)/10)*10}
function comboChest(n){const g=Math.round(150*n/10*(1+save.lv*.03)),xp=Math.round(20+n*1.5);save.gold+=g;addXp(xp);
 let extra='';if(n%50===0){save.goldB=(save.goldB||0)+1;extra=' · ✨전설 미끼 1개'}
 if(CMB_TITLE[n]&&!save.titles[CMB_TITLE[n]]){save.titles[CMB_TITLE[n]]=1;extra+=` · 🏷️ 칭호 「${CMB_TITLE[n]}」`}
 const t=comboTier(n);bigText(`🎁 ${n}콤보 보물상자!`,`🪙${g.toLocaleString()} · 경험치 ${xp}${extra}`,t?t[2]:'#ffd23f');
 sparkle(W/2,H*.3,60,['#ffd23f','#fff','#ff9ad8','#7ff0e6']);flash=Math.max(flash,.35);flashCol='255,230,150';
 if(window.SFX&&SFX.tre)SFX.tre(n>=50?5:4);else SFX.reward(6);vib([20,40,20,40,60]);persist();hud();return g}
const _sr418=showResult;showResult=function(){const before=combo;_sr418();if(!lastRes||!fish&&!lastRes.f)return;
 if(combo>before&&combo>20&&lastRes.f&&lastRes.f.r>0&&!lastRes.f.tre){const add=Math.round(lastRes.gold*comboExtra()/2.2);if(add>0){save.gold+=add;lastRes.gold+=add;lastRes.comboExtra=add;$('rGold').textContent='+'+lastRes.gold.toLocaleString();
  $('rRec').textContent=[$('rRec').textContent,`🔥 ${combo}콤보 보너스 +${add.toLocaleString()}`].filter(Boolean).join(' · ')}}
 if(combo>before&&combo>=20&&combo%10===0)setTimeout(()=>comboChest(combo),900);
 persist();hud()};
// 콤보 표시: 다음 보상 게이지 + 20 이후 불꽃
const _cu418=comboUp;comboUp=function(gold,bonus){_cu418(gold,bonus);if(combo<2)return;const el=$('combo'),nx=comboNext(),pv=nx<=20?nx-5:nx-10,p=Math.max(0,Math.min(1,(combo-pv)/(nx-pv)));
 const mult=(comboMult()+comboExtra()).toFixed(2);el.querySelector('i')&&(el.querySelector('i').textContent='×'+mult);
 el.insertAdjacentHTML('beforeend',`<em class="cg418"><u style="width:${p*100}%"></u></em><small class="cn418">${combo>=20?'🎁 ':''}${nx}콤보까지 ${nx-combo}</small>`);
 document.body.classList.toggle('streak20',combo>=20);if(combo>=20&&!save.set.calm){shake=Math.max(shake,2)}};
const _cb418=comboBreak;comboBreak=function(){_cb418();document.body.classList.toggle('streak20',combo>=20)};
const _up418=update;update=function(dt){_up418(dt);if(combo>=20&&!LOWGFX&&S!=='title'&&$('combo').classList.contains('on')&&Math.random()<dt*(combo>=50?18:10)){const r=$('combo').getBoundingClientRect();
 parts.push({x:r.left+r.width*(.25+Math.random()*.5),y:r.top+r.height*.35,vx:rnd(-12,12),vy:-rnd(30,70),l:.7,t:0,c:combo>=50?['#ffd700','#fff','#ff4fd8'][Math.random()*3|0]:['#ff8a3d','#ffd23f','#ff5a3a'][Math.random()*3|0],r:2+Math.random()*2,g:-.3})}};
if(TEST)Object.defineProperties(window.__w,{comboChest:{value:comboChest},comboExtra:{value:comboExtra},comboNext:{value:comboNext},setCombo:{value:n=>{combo=n}}});
