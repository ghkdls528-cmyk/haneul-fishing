/* ================= 4.14 낚시의 긴장감과 손맛 개선 =================
 기능 1 등급·장비별 목표 전투 시간 / 기능 2 체급·저항 패턴 차별화 / 기능 3 실력 평가·개인 기록
 기존 전투 공식(fight)은 그대로 두고, 한 프레임 동안의 체력·장력 변화량에 배율을 곱하는 방식으로 감싼다.
 → 장비 강화·장점(대물·지친 물고기·크리티컬·장력 안정)은 그대로 살아 있고, 물고기 체력 수치는 건드리지 않음. */
// 4.14 사양 목표의 절반 (사용자 결정: 4.13의 빠른 속도감과 4.14 긴장감의 중간)
const T414_BASE=[1.5,4,5.5,7.5,10,14,19,22.5];             // 잡동사니~히든 (최고 단계 장비 기준 목표 초)
const T414_BOSS={goldking:22.5,whaleking:27.5,stormmarlin:32.5,icesturgeon:37.5,kraken:42.5,moonqueen:47.5}; // 기존 해금 순서 = 난이도 순서
const T414_GEAR=[1.45,1.35,1.25,1.15,1.07,1.0];           // 장비 1~6단계 평균 → 목표 시간 배율
// 기존 저항 패턴(fm) → 사양서 10개 유형 [장력 변화 배율, 감기 효율 배율]
const T414_PAT={burst:[1.30,.85],strong:[1.05,.75],zigzag:[1.20,.90],charge:[1.45,.70],float:[.70,1.30],jump:[1.15,.85],steady:[1.20,.90],dive:[1.10,.80],retreat:[1.35,.75],hide:[1.25,.85],ink:[1.25,.85],puff:[.70,1.30]};
const T414_PATNAME={burst:'순간 저항형',strong:'지속 저항형',zigzag:'방향 전환형',charge:'돌진형',float:'휴식형',jump:'반복 몸부림형',steady:'좌우 흔들림형',dive:'잠수형',retreat:'연속 돌진형',hide:'불규칙형',ink:'불규칙형',puff:'휴식형'};
// 10개 유형의 감기 효율 평균(시간 기준)으로 나눠, 패턴 차이는 남기고 등급 평균은 목표 시간에 맞춤
const T414_RN=[.85,.75,.90,.70,1.30,.85,.90,.80,.75,.85].reduce((a,x)=>a+1/x,0)/10;
// 실측 보정값(봇 시뮬레이션으로 맞춘 내부 수치): 등급별·보스별
const T414_C=[2.54,3.36,3.23,3.9,4.54,4.19,3.06,4.17],T414_CB={goldking:2.95,whaleking:4.34,stormmarlin:3.30,icesturgeon:3.46,kraken:3.26,moonqueen:4.99};
const T414_GRADE=[[90,'S','완벽한 낚시'],[80,'A','능숙한 낚시'],[65,'B','안정적인 낚시'],[50,'C','아쉬운 낚시'],[0,'D','다시 도전']];

function tier414(gear){const ids=[gear.rod,gear.reel,gear.line],Ls=[RODS,REELS,LINES];let s=0;for(let i=0;i<3;i++){const k=Ls[i].findIndex(x=>x.id===ids[i]);s+=k<0?1:k+1}return s/3}
function gearMul414(t){const i=clamp(t,1,6)-1,a=Math.floor(i),b=Math.min(5,a+1);return T414_GEAR[a]+(T414_GEAR[b]-T414_GEAR[a])*(i-a)}
function sizeCls414(f){const mid=(f.min+f.max)/2,r=mid>0?f.size/mid:1;if(f.giant||r>=1.5)return{k:3,n:'초대형',m:1.3,r};if(r>=1.2)return{k:2,n:'대형',m:1.15,r};if(r>=.8)return{k:1,n:'보통',m:1,r};return{k:0,n:'소형',m:.85,r}}
function patOf414(fm){return T414_PAT[fm]||[1,1]}
// 패턴의 시간 배율(평균 1) · 체급 배율과 곱한 값은 0.75~1.60배로 제한
function diff414(f){const sc=sizeCls414(f),pt=(1/patOf414(f.fm)[1])/T414_RN,d=clamp(sc.m*pt,.75,1.6);return{sc,pt,d}}
function target414(f,tier){if(f.boss)return(T414_BOSS[f.boss]||60)*gearMul414(tier);return T414_BASE[f.r]*gearMul414(tier)*diff414(f).d}

// 장비 능력치에 단계 정보·강화 전 기준값을 함께 담음 (예상 시간·전투 배율 계산용)
const _GS414=GS;GS=function(gear=save.gear,enh=save.enh){const o=_GS414(gear,enh),r=_GS414(gear,{});o.tier=tier414(gear);o.refPow=r.pow;o.refSpd=r.spd;return o};
// 장비 비교·시험 낚시의 예상 시간도 4.14 기준으로
const _est414=estTime;estTime=function(gs,f){if(gs.tier==null)return _est414(gs,f);const ff=Object.assign({size:(f.min+f.max)/2,giant:false},f),ts=fishPull(ff)/gs.max;
 return Math.max(.8,target414(ff,gs.tier)*(gs.refPow*gs.refSpd)/(gs.pow*gs.spd)*(ts>1?1+(ts-1)*.8:1))};

const _sf414=startFight;startFight=function(g){_sf414(g);if(S!=='fight'||!fish||(TEST&&window.__off414))return;
 const f=fish,gs=fg.gs,tier=gs.tier!=null?gs.tier:tier414(save.gear),boss=!!fg.boss,dd=diff414(f),target=target414(f,tier),
  base=boss?(T414_BOSS[f.boss]||60)*gearMul414(tier):T414_BASE[f.r]*gearMul414(tier)*(boss?1:dd.sc.m),
  r0=DMGK/fg.hpMax*((gs.refPow||gs.pow)/100)*(gs.refSpd||gs.spd),C=boss?(T414_CB[f.boss]||1.25):T414_C[f.r];
 // K: 기준 장비로 base 초에 끝나도록 감기 효율을 맞추는 배율 (강화·장점은 실제 장비 값으로 추가 반영)
 // 약한 장비는 장력이 빨리 올라 손을 자주 떼야 함 → 감는 시간 비율(hf)이 줄어드는 만큼은 보정해서
 //  장비 차이가 사양서 배율(1단계 ×1.45)에 가깝게 나오게 함. 줄 끊김 위험(낚싯줄 단점)은 그대로.
 const p=f.p,pull=fg.pull,hfOf=x=>{const gn=(34+p*4)*clamp(pull/x.max,.45,2.4)*(100/x.stab)*(1-x.tred/100);return x.rec/(x.rec+gn)},
  top=_GS414({rod:RODS[5].id,reel:REELS[5].id,line:LINES[5].id},{}),hfK=clamp(hfOf(top)/hfOf(gs),1,3);
 const K=100/(r0*C*base)*hfK;
 fg.q414={K,target,tier,sc:dd.sc,pt:boss?1:clamp(dd.d/dd.sc.m,.1,9),tot:0,safe:0,caut:0,dang:0,crit:0}};
// 한 프레임의 체력·장력 변화량에 배율 적용
const _fi414=fight;fight=function(dt,g){const q=fg.q414;if(!q)return _fi414(dt,g);
 const busy=fg.clutch>0||fg.final>0,h0=fg.hp,t0=fg.ten;_fi414(dt,g);
 // 사양서 기준: 안전 20~75 · 75 초과 주의 · 85 초과 위험 · 95 이상 끊김 직전
 q.tot+=dt;const v=Math.min(100,fg.ten);if(v>=20&&v<=75)q.safe+=dt;if(v>75)q.caut+=dt;if(v>85)q.dang+=dt;if(v>=95)q.crit+=dt;
 if(S!=='fight'||busy||fg.clutch>0||fg.final>0)return;
 const pat=fg.boss?patOf414(fg.fm):null,pt=fg.boss?(1/pat[1])/T414_RN:q.pt,dmg=q.K/pt,dh=fg.hp-h0;
 if(dh<0)fg.hp=h0+dh*dmg;else if(dh>0)fg.hp=Math.min(100,h0+dh*Math.min(1,dmg));
 const dT=fg.ten-t0;if(dT>0)fg.ten=Math.min(104,t0+dT*patOf414(fg.fm)[0])};
// 보스 약점 공격도 같은 비율로 (안 그러면 긴 보스전에서 약점만으로 끝나 버림)
const _bp414=bossPress;bossPress=function(){const q=fg.q414,h0=fg.hp;_bp414();if(q&&fg.hp<h0){const pt=(1/patOf414(fg.fm)[1])/T414_RN;fg.hp=h0+(fg.hp-h0)*Math.min(1,q.K/pt)}};

function score414(){const q=fg.q414;if(!q)return null;const t=Math.max(.1,q.tot);
 const ten=Math.floor(50*Math.min(1,q.safe/t)),eff=Math.floor(30*Math.min(1,q.target/t)),
  cri=!fg.clutchUsed?20:fg.cWin?(fg.cMiss?8:16):0,total=ten+eff+cri,gr=T414_GRADE.find(x=>total>=x[0]);
 return{total,ten,eff,cri,g:gr[1],gn:gr[2],t,target:q.target,clutch:!!fg.clutchUsed,cMiss:fg.cMiss||0,sc:q.sc.n,zones:{safe:q.safe,caut:q.caut,dang:q.dang,crit:q.crit}}}
const _ln414=landNow;landNow=function(g){fg.sc414=practice?null:score414();_ln414(g)};

function rec414(f,s){const R=save.fightRecords,id=f.id,o=R[id]||(R[id]={bestScore:0,bestTimeMs:0,largestSize:0,catchCount:0});
 const prevBest=save.best[id]&&save.best[id].cm||0,ms=Math.round(s.t*1000),first=o.catchCount===0;
 const nb={score:!first&&s.total>o.bestScore,time:!first&&ms<o.bestTimeMs,size:!first&&f.size>o.largestSize};
 o.bestScore=Math.max(o.bestScore,s.total);o.bestTimeMs=o.bestTimeMs>0?Math.min(o.bestTimeMs,ms):ms;o.largestSize=Math.max(o.largestSize,prevBest,f.size);o.catchCount++;
 save.fightGradeCounts[s.g]=(save.fightGradeCounts[s.g]||0)+1;return{nb,first,o}}
function skillHtml414(s,r){const tags=[r.first?'첫 기록!':'',r.nb.score?'최고 점수 갱신!':'',r.nb.time?'최단 시간 갱신!':'',r.nb.size?'최고 크기 갱신!':''].filter(Boolean);
 return `<details id="rSkillD"><summary><span class="g414 g${s.g}">${s.g}</span><b>${s.total}점</b><span class="gn">${s.gn}</span><span class="tm">${s.t.toFixed(1)}초</span>${tags.length?`<i>${tags[0]}</i>`:''}<span class="arw">▾</span></summary>
 <div class="sk414"><div><small>장력 관리</small><b>${s.ten} / 50</b></div><div><small>전투 효율</small><b>${s.eff} / 30</b></div><div><small>위기 대응</small><b>${s.cri} / 20</b></div><div><small>전투 시간</small><b>${s.t.toFixed(1)}초</b><small>목표 ${s.target.toFixed(1)}초</small></div></div>
 <p class="pb414">개인 최고 · ${r.o.bestScore}점 · 최단 ${(r.o.bestTimeMs/1000).toFixed(1)}초 · ${fmtCm(r.o.largestSize)} · ${r.o.catchCount}번째${tags.length>1?' · '+tags.slice(1).join(' · '):''}</p></details>`}
const _sr414=showResult;showResult=function(){const f=fish,s=fg&&fg.sc414,el=$('rSkill');if(el){el.innerHTML='';el.style.display='none'}
 _sr414();
 if(!f||!s||practice||f.tre||!lastRes||lastRes.f!==f)return;
 const r=rec414(f,s);lastRes.skill=s;lastRes.skillRec=r;persist();
 if(el){el.innerHTML=skillHtml414(s,r);el.style.display=''}};

if(TEST){
 // 화면 없이 실제 전투 함수(fight)를 빠르게 돌려 보는 시뮬레이터 (봇 조작 = tests/bot.js와 같은 규칙)
 const simOne=(id,o,g)=>{const base=FID[id];let f=makeFish(base);
  if(o.size){const mid=(base.min+base.max)/2,m={s:.7,n:1,l:1.32,g:1.7}[o.size],gi=o.size==='g';f=Object.assign(f,{size:Math.round(mid*m),giant:gi,p:Math.min(8,base.p+(gi?1:0))});f.kgv=+kgOf(f,f.size).toFixed(2)}
  else if(o.noGiant&&f.giant){f=Object.assign(f,{giant:false,size:base.max,p:base.p});f.kgv=+kgOf(f,f.size).toFixed(2)}
  fish=f;fg={perfect:Math.random()<(o.perfect??.4)};holding=false;startFight(g);
  const st={tap:0,want:null,wantAt:0,clutches:0};let t=0;const dt=1/60,react=o.react??.12,cp=o.clutchP??.85;
  const press=()=>{if(!holding)down()},rel=()=>{if(holding)up()},tap=()=>{rel();down();up()};
  while(S==='fight'&&t<400){t+=dt;T+=dt;
   if(fg.clutch>0){rel();if(clPhase()<0){fg.cT0=clNow()-CL_PER*(Math.random()<cp?1:.4)}clutchTap();if(S==='fight')_fi_step(dt,g);continue}
   if(fg.final>0){if(t-st.tap>.11){st.tap=t;tap()}}
   else if(fg.freeze>0){if(t-st.tap>.12){st.tap=t;tap()}}
   else if(fg.weak>0||fg.chance>0||fg.ex>0){if(st.want==null){st.want=1;st.wantAt=t+react}else if(t>=st.wantAt&&t-st.tap>.15){st.tap=t;st.want=null;rel();if(fg.weak>0)down();else press()}}
   else{st.want=null;if(fg.warn>0||fg.diveT>0||fg.air>0||fg.charge>0||fg.roar>0)rel();else if(fg.ten<58)press();else if(fg.ten>80)rel()}
   _fi_step(dt,g);if(o.trace&&Math.round(t*60)%10===0)o.trace.push([+t.toFixed(2),Math.round(fg.ten),+fg.hp.toFixed(1),holding?1:0,+(fg.slack||0).toFixed(2),+(fg.vx||0).toFixed(0)])}
  const ok=S==='land',sc=ok?fg.sc414:null,out={ok,t:fg.q414?fg.q414.tot:t,st:S,clutch:!!fg.clutchUsed,cWin:!!fg.cWin,cMiss:fg.cMiss||0,sc:sizeCls414(f).n,score:sc&&sc.total,g:sc&&sc.g,ten:sc&&sc.ten,maxTen:fg.maxTen||0};
  holding=false;return out};
 const _fi_step=(dt,g)=>fight(dt,g);
 const sim414=(id,o={})=>{const g=G(),keep=JSON.stringify(save),k={S,fish,fg,holding,app,bossPending,combo},out=[];
  const gearKeep=Object.assign({},save.gear),enhKeep=Object.assign({},save.enh);
  if(o.gear){save.gear={rod:RODS[o.gear[0]].id,reel:REELS[o.gear[1]].id,line:LINES[o.gear[2]].id};save.enh=o.enh?{[save.gear.rod]:o.enh,[save.gear.reel]:o.enh,[save.gear.line]:o.enh}:{}}
  const n=o.n||20;for(let i=0;i<n;i++){try{out.push(simOne(id,o,g))}catch(e){out.push({err:String(e)})}}
  save=JSON.parse(keep);S=k.S;fish=k.fish;fg=k.fg;holding=false;app=k.app;bossPending=k.bossPending;combo=k.combo;T=0;go('ready');persist();return out};
 Object.defineProperties(window.__w,{sim414:{value:sim414},score414:{value:score414},T414:{value:{T414_BASE,T414_BOSS,T414_GEAR,T414_PAT,T414_C,T414_CB,T414_RN,sizeCls414,target414,tier414,gearMul414}},setHold:{value:v=>{holding=v}}});
}
