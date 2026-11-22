/* ================= 3.0 장비 능력치 ================= */
function GS(gear=save.gear,enh=save.enh){const r=RODS.find(x=>x.id===gear.rod)||RODS[0],e=REELS.find(x=>x.id===gear.reel)||REELS[0],l=LINES.find(x=>x.id===gear.line)||LINES[0];
 const er=(enh[r.id]||0),ee=(enh[e.id]||0),el=(enh[l.id]||0);
 return{dist:Math.round(r.dist*(1+.02*er)),pow:Math.round(r.pow*(1+.04*er)),stab:Math.round(r.stab*(1+.04*er)),crit:r.crit,big:r.big+l.big,
  spd:+(e.spd*(1+.04*ee)).toFixed(2),eff:e.eff,tred:Math.min(60,Math.round(e.tred*(1+.04*ee))),fat:e.fat,crx:e.crx,
  max:+(l.max*(1+.04*el)).toFixed(1),grace:+(l.grace*(1+.04*el)).toFixed(2),sres:l.sres,rec:l.rec}}
const DMGK=14,hpOf=f=>(1+f.p*.35+(f.giant?1:0))*(1+Math.sqrt(f.kgv||kgOf(f,(f.min+f.max)/2))/7);
const fishPull=f=>Math.round(3+f.p*2.2+Math.sqrt(f.kgv||kgOf(f,(f.min+f.max)/2))*1.6);
// 예상 제압 시간(초): 장비 비교 화면에 쓰는 계산식 = 전투 공식과 같은 값으로 근사
function estTime(gs,f){const p=f.p,hpMax=hpOf(f),ts=fishPull(f)/gs.max;
 // 실측 보정식: 봇 실측(고등어 하급 4.6초·상급 1.45초, 참다랑어 상급 약 3초)에 맞춘 값. 숙련 조작 기준
 const dps=DMGK/hpMax*(gs.pow/100)*gs.spd*1.7*((p>=4)?1+gs.big/100:1);
 return Math.max(.8,70/dps*(ts>1?1+(ts-1)*.8:1)+p*.1)}
function snapRisk(gs,f){const pull=fishPull(f),r=pull/gs.max;return r<.7?'안전':r<1?'보통':r<1.4?'위험':'매우 위험'}

/* ================= 역전(줄 끊기기 직전)·최종 제압 ================= */
/* 4.13 위기 링: 줄어드는 링이 초록 원에 겹칠 때 탭 · 빗나가도 1번 더 기회 */
const CL_PER=.9,CL_WIN=.13,CL_TRIES=2;   // 4.18 1.25→0.95 · 4.20 0.9초·판정 0.13   // 4.18 더 촉박하게(1.25초·0.17)
function clNow(){return performance.now()/1000}
function startClutch(){fg.clutchUsed=true;fg.clutch=1;fg.cT0=clNow()+.45;fg.cMiss=0;fg.cFb=null;slowmo=Math.max(slowmo,1.2);flash=.5;flashCol='255,60,60';shake=save.set.calm?0:6;SFX.warn();setTimeout(()=>SFX.warn(),150);vib([80,40,80]);bigText('위기!','줄어드는 링이 초록 원에 겹칠 때 탭!','#ff6a6a');hint()}
function clPhase(){return (clNow()-fg.cT0)/CL_PER}
function clutchTick(dt){fg.ten=Math.max(96,fg.ten-dt*2);const ph=clPhase();if(ph>=1+CL_WIN/CL_PER){fg.cMiss++;if(fg.cMiss>=CL_TRIES){fg.clutch=0;fail('아깝다! 링을 놓쳤어요 · '+snapMsg(),'snap');return}fg.cT0=clNow()+.35;fg.cFb={t:clNow(),k:'late'};SFX.warn()}}
function clutchTap(){const ph=clPhase();if(ph<0)return;const d=Math.abs(ph-1)*CL_PER,win=CL_WIN+(save.up.hook||0)*.01;
 if(d<=win){fg.clutch=0;fg.ten=45;fg.over=0;setTimeout(hint,0);fg.hp=Math.max(1,fg.hp-10);fg.cWin=1;fg.cFb={t:clNow(),k:'ok'};(SFX.clutchOk||SFX.finish)();bigText(d<win*.4?'완벽한 역전!!':'역전!!','줄이 버텨냈어요','#7fff9a');sparkle(fg.fx,fg.fy,40,['#7fff9a','#fff','#ffe066']);flash=.6;flashCol='120,255,160';vib([20,30,60]);slowmo=.6;save.st.clutch=(save.st.clutch||0)+1;return}
 fg.cMiss++;fg.cFb={t:clNow(),k:ph<1?'early':'late'};
 if(fg.cMiss>=CL_TRIES){fg.clutch=0;fail((ph<1?'조금 빨랐어요! ':'조금 늦었어요! ')+snapMsg(),'snap');return}
 fg.cT0=clNow()+.35;SFX.fail&&SFX.fail();vib(30)}
function drawClutch(){if(S!=='fight'||!(fg.clutch>0))return;const cx=Math.min(W-132,Math.max(132,fg.fx)),cy=Math.min(H*.66,Math.max(H*.34,fg.fy)),Rt=34,R0=120,ph=Math.max(0,Math.min(1.3,clPhase()));
 ctx.save();ctx.fillStyle='rgba(20,10,20,.28)';ctx.fillRect(0,0,W,H);
 const win=CL_WIN/CL_PER*(R0-Rt);ctx.fillStyle='rgba(120,255,160,.25)';ctx.beginPath();ctx.arc(cx,cy,Rt+win,0,7);ctx.arc(cx,cy,Math.max(4,Rt-win),0,7,true);ctx.fill();
 ctx.lineWidth=5;ctx.strokeStyle='#7fff9a';ctx.beginPath();ctx.arc(cx,cy,Rt,0,7);ctx.stroke();
 if(clPhase()>=0){const r=R0-(R0-Rt)*ph,near=Math.abs(r-Rt)<=win;ctx.lineWidth=near?7:5;ctx.strokeStyle=near?'#fff36a':'#ff6a6a';ctx.beginPath();ctx.arc(cx,cy,Math.max(3,r),0,7);ctx.stroke()}
 ctx.fillStyle='#fff';ctx.strokeStyle='#3b2a1a';ctx.lineWidth=4;ctx.font='bold 18px Jua,sans-serif';ctx.textAlign='center';const tx=clPhase()<0?'준비…':'탭!';ctx.strokeText(tx,cx,cy+6);ctx.fillText(tx,cx,cy+6);
 ctx.font='bold 14px Jua,sans-serif';const left=CL_TRIES-fg.cMiss;const lt=`기회 ${'●'.repeat(left)}${'○'.repeat(fg.cMiss)}`;ctx.strokeText(lt,cx,cy+R0+26);ctx.fillText(lt,cx,cy+R0+26);
 if(fg.cFb&&clNow()-fg.cFb.t<.9){const m={early:'조금 빨라요! 한 번 더',late:'조금 늦어요! 한 번 더',ok:'좋아요!'}[fg.cFb.k];ctx.fillStyle='#ffd23f';ctx.strokeText(m,cx,cy-R0-12);ctx.fillText(m,cx,cy-R0-12)}
 ctx.restore()}
function snapMsg(){const gs=fg.gs||GS(),pull=fg.pull||fishPull(fish||{p:1,kgv:1});const left=Math.max(1,Math.round(fg.hp||0));
 return pull>gs.max?`물고기 힘 ${pull}kg > 줄 ${gs.max}kg · 낚싯줄을 바꿔 보세요 (체력 ${left}% 남음)`:`체력 ${left}% 남았어요! 빨간 칸에선 손을 떼요`}
function startFinal(){fg.final=4;fg.mash=0;bigText('최종 제압!','4초 안에 12번 연타!','#ffe066');SFX.boss();shake=8}
function finalTick(dt){fg.final-=dt;shake=Math.max(shake,2);if(fg.mash>=12){fg.final=0;fg.finalDone=true;fg.hp=0}else if(fg.final<=0){fg.hp=22;fg.ten=50;toast('보스가 다시 버텨요! 한 번 더!',1200);SFX.surge()}}
/* ================= 보스 경고·약점·특수기 ================= */
const BOSS_SP={goldking:['glare','황금 비늘 번쩍임'],whaleking:['dive','심해 잠수'],stormmarlin:['bolt','번개 내려치기'],icesturgeon:['freeze','결빙 — 연타로 얼음 깨기'],kraken:['slam','촉수 내려치기'],moonqueen:['eclipse','월식 — 어둠']};
function bossTick(dt,g){const b=fg.boss,sp=BOSS_SP[b.id],gs=fg.gs,ts=fg.ts;
 for(const k of['glare','diveT','freeze','dark','weak']){if(fg[k]>0)fg[k]=Math.max(0,fg[k]-dt)}
 if(fg.warn>0){fg.warn-=dt;if(fg.warn<=0)bossSpecial(sp[0],gs,ts);return}
 fg.spT-=dt;if(fg.spT<=0&&!fg.weak){fg.warn=.9;fg.spT=rnd(6,9)-fg.phase;flash=.35;flashCol='255,60,60';SFX.warn();toast('⚠️ '+sp[1],900);return}
 fg.weakT-=dt;if(fg.weakT<=0&&fg.weak<=0&&fg.surge<=0){fg.weak=1.3;fg.weakAt=T;fg.weakT=rnd(4.5,6.5);SFX.bite()}
 if(fg.diveT>0&&holding)fg.ten+=22*ts*dt}
function bossSpecial(k,gs,ts){const sr=1-gs.sres/100;
 if(k==='glare'){fg.glare=1.2;flash=.9;flashCol='255,240,180';if(holding)fg.ten+=15*ts*sr}
 else if(k==='dive'){fg.diveT=2.2;SFX.surge()}
 else if(k==='bolt'){lightning=.8;SFX.thunder();flash=.7;flashCol='255,255,220';if(holding){fg.ten+=40*ts*sr;toast('번개에 손을 대고 있었어요!',700)}}
 else if(k==='freeze'){fg.freeze=2.5;fg.ice=0;SFX.surge()}
 else if(k==='slam'){shake=12;ink(fg.fx,fg.fy,12);fg.inkT=1.6;SFX.splash(.4);if(holding)fg.ten+=30*ts*sr}
 else if(k==='eclipse'){fg.dark=2.5}}
function bossPress(){if(fg.weak>0&&fg.pressAt>=fg.weakAt){fg.weak=0;const gs=fg.gs,d=9*(gs.pow/100)*(1+gs.crit/100);fg.hp-=d;fg.weakHits=(fg.weakHits||0)+1;SFX.crit();toast(`약점 공격! -${d.toFixed(0)}%`,700);sparkle(fg.fx,fg.fy,24,['#ff6a6a','#fff','#ffe066']);shake=5}
 if(fg.freeze>0){fg.ice++;SFX.twitch();if(fg.ice>=5){fg.freeze=0;toast('얼음을 깼어요!',700);sparkle(fg.fx,fg.fy,16,['#bfefff','#fff'])}}}

/* ================= 콤보 ================= */
let comboGold=0;
function comboTier(n){let t=null;for(const c of COMBO_T)if(n>=c[0])t=c;return t}
function comboUp(gold,bonus){comboGold+=bonus;if(combo<2)return;const t=comboTier(combo),prev=comboTier(combo-1);const el=$('combo');el.innerHTML=`<b>${combo}</b><small>콤보${t?' · '+t[1]:''}</small><i>×${comboMult().toFixed(2)}</i>`;el.style.setProperty('--cc',t?t[2]:'#fff');el.classList.remove('on','up');void el.offsetWidth;el.classList.add('on','up');
 tone(440*Math.pow(2,Math.min(combo,24)/12),.12,'triangle',.1);if(t&&t!==prev){bigText(t[1],`${combo}연속!`,t[2]);SFX.reward(5)}}
const comboMult=()=>1+.06*Math.min(combo,20);
function comboBreak(){if(combo>=3){$('cEnd').innerHTML=`콤보 종료 · <b>${combo}연속</b> · 보너스 <b>+${comboGold.toLocaleString()}</b>`;$('cEnd').classList.remove('on');void $('cEnd').offsetWidth;$('cEnd').classList.add('on')}combo=0;comboGold=0;$('combo').classList.remove('on')}

/* ================= 희귀도별 획득 연출 ================= */
let rv=null;
function reveal(f,done){const short=save.set.reveal==='short';const lvl=f.boss?8:f.r===7?7:f.r>=3?f.r:(f.giant||f.v)?3:0;
 if(lvl===0||short){if(lvl>=5&&short)SFX.rareGet();done();return}
 const dur={3:1.1,4:1.6,5:2.4,6:3,7:3.2,8:2.6}[lvl];rv={f,lvl,t:0,dur,done};$('reveal').classList.add('on');
 ({3:()=>SFX.rareGet(),4:()=>{SFX.rareGet();SFX.reward(6)},5:()=>SFX.legend(),6:()=>SFX.myth(),7:()=>{tone(110,1.2,'sine',.2);setTimeout(()=>SFX.star(),900);setTimeout(()=>SFX.legend(),1500)},8:()=>SFX.bossWin()})[lvl]()}
function revealSkip(){if(!rv)return;const d=rv.done;rv=null;$('reveal').classList.remove('on');d()}
$('reveal').addEventListener('pointerdown',e=>{e.preventDefault();revealSkip()});
const rvc=$('rvc'),rvx=rvc.getContext('2d');
function drawReveal(dt,t){if(!rv)return;rv.t+=dt;const w=rvc.width=innerWidth,h=rvc.height=innerHeight,c=rvx,f=rv.f,k=clamp(rv.t/rv.dur,0,1),L=Math.min(w,h)*.5,cx=w/2,cy=h*.45,col=RAR[f.r].c;
 c.clearRect(0,0,w,h);
 if(rv.lvl===3){c.fillStyle='rgba(20,10,40,.35)';c.fillRect(0,0,w,h);const g=c.createRadialGradient(cx,cy,L*.3,cx,cy,Math.max(w,h)*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(165,127,224,${.55+.25*Math.sin(t*10)})`);c.fillStyle=g;c.fillRect(0,0,w,h)}
 else if(rv.lvl===4){c.fillStyle='rgba(40,25,5,.45)';c.fillRect(0,0,w,h);c.save();c.translate(cx,cy);c.rotate(t*.5);c.fillStyle='rgba(255,200,80,.25)';for(let i=0;i<16;i++){c.rotate(Math.PI/8);c.beginPath();c.moveTo(0,0);c.lineTo(w,-40);c.lineTo(w,40);c.fill()}c.restore();for(let i=0;i<40;i++){const a=i*2.4+t,r=(t*200+i*30)%(Math.max(w,h)*.7);c.fillStyle='#ffd23f';star5(c,cx+Math.cos(a)*r,cy+Math.sin(a)*r,4)}}
 else if(rv.lvl===5||rv.lvl===8){const dk=k<.25?k/.25:1;c.fillStyle=`rgba(10,5,0,${.75*dk})`;c.fillRect(0,0,w,h);const sx=(k*1.6-.3)*w;const g=c.createLinearGradient(sx-200,0,sx+200,0);g.addColorStop(0,'rgba(255,220,120,0)');g.addColorStop(.5,'rgba(255,220,120,.55)');g.addColorStop(1,'rgba(255,220,120,0)');c.fillStyle=g;c.fillRect(0,0,w,h);c.save();c.translate(cx,cy);c.rotate(-t*.3);c.fillStyle=rv.lvl===8?'rgba(255,90,90,.25)':'rgba(255,215,80,.22)';for(let i=0;i<12;i++){c.rotate(Math.PI/6);c.beginPath();c.moveTo(0,0);c.lineTo(w,-60);c.lineTo(w,60);c.fill()}c.restore()}
 else if(rv.lvl===6){for(let i=0;i<8;i++){c.fillStyle=`hsla(${(t*90+i*45)%360},90%,62%,.9)`;c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,Math.max(w,h),i/8*6.283+t*.8,(i+1)/8*6.283+t*.8);c.closePath();c.fill()}c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.arc(cx,cy,L*(.6+.1*Math.sin(t*6)),0,7);c.fill()}
 else if(rv.lvl===7){c.fillStyle='rgba(0,0,0,.92)';c.fillRect(0,0,w,h);const kr=k<.45?0:(k-.45)/.55;c.save();c.translate(cx,cy);c.rotate(t*.6);c.strokeStyle='rgba(120,240,230,.8)';c.lineWidth=2;for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,L*(.55+i*.12),0,7);c.stroke()}c.fillStyle='rgba(120,240,230,.9)';c.font=`${L*.07}px ${FONT}`;c.textAlign='center';const gl='◇△○☆◎◈▽□';for(let i=0;i<16;i++){c.save();c.rotate(i/16*6.283);c.fillText(gl[i%8],0,-L*.68);c.restore()}c.restore();if(kr>0){c.fillStyle=`rgba(120,240,230,${kr*.4})`;c.beginPath();c.arc(cx,cy,L*kr*1.5,0,7);c.fill()}}
 // 물고기 등장
 const appear=rv.lvl===7?clamp((k-.45)/.25,0,1):clamp(k/.3,0,1),sc=rv.lvl===6?(.3+.7*appear):(.6+.4*appear),spin=rv.lvl===6?(1-appear)*6:0;
 if(appear>0){c.save();c.globalAlpha=appear;c.translate(cx,cy+(1-appear)*60);c.rotate(spin);c.scale(sc,sc);drawCritter(c,f,0,0,L*.9*(f.k==='fish'?1:.85),1,t,{seed:2,mood:'happy',v:f.v});c.restore()}
 if(rv.lvl===7&&k<.45){c.fillStyle='#7ff0e6';c.font=`${L*.3}px ${FONT}`;c.textAlign='center';c.fillText('???',cx,cy+L*.1)}
 // 타이틀
 const tt={3:['희귀!','RARE'],4:['영웅!','EPIC'],5:['전설 획득!','LEGENDARY'],6:['신화 등장!!','MYTHIC'],7:['비밀 발견!','HIDDEN'],8:['보스 격파!!','BOSS DEFEATED']}[rv.lvl];
 const ta=clamp((k-.15)/.2,0,1),ts=1+(1-ta)*.8;if(ta>0){c.save();c.translate(cx,h*.16);c.scale(ts,ts);c.globalAlpha=ta;c.textAlign='center';c.font=`${Math.min(64,w*.13)}px ${FONT}`;c.lineWidth=8;c.strokeStyle=OL;c.strokeText(tt[0],0,0);c.fillStyle=rv.lvl===6?`hsl(${t*120%360},90%,70%)`:rv.lvl===8?'#ff7a7a':col;c.fillText(tt[0],0,0);c.font=`${Math.min(22,w*.05)}px ${FONT}`;c.lineWidth=4;c.strokeText(tt[1],0,34);c.fillStyle='#fff';c.fillText(tt[1],0,34);c.restore()}
 if(k>.4){c.textAlign='center';c.font=`${Math.min(34,w*.08)}px ${FONT}`;c.lineWidth=6;c.strokeStyle=OL;const nm=(f.v?VN[f.v]+' ':'')+(f.giant?'초대형 ':'')+f.n;c.strokeText(nm,cx,h*.78);c.fillStyle='#fff';c.fillText(nm,cx,h*.78)}
 c.font='15px '+FONT;c.fillStyle='rgba(255,255,255,.75)';c.textAlign='center';c.fillText('탭하면 건너뛰기',cx,h-30-(NAV>0?0:0));c.textAlign='left';
 if(rv.t>=rv.dur+.4)revealSkip()}
