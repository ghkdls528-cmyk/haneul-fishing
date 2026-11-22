/* ================= 4.19 업적 200 · 칭호 효과 · 보물 랜덤 획득 · 낚시 모드 정리 · 수족관 개편 · 도감 형태 보기 =================
 ① 업적 약 210개(쉬운 것 ~ 콤보 200·만 마리 같은 아주 어려운 것) · 어려운 업적엔 칭호
 ② 칭호 효과: 칭호를 달면 능력이 붙음(골드·경험치·희귀 확률·입질·챔질 여유·장력 안정·크리티컬·보물 발견) + 칭호를 모을수록 수집 보너스(10개마다 골드·경험치 +1%, 최대 +15%)
 ③ 낚시 모드(보물 낚시·시간 제한 도전) 삭제 → 보물은 평소 낚시 중 확률로 함께 건짐. 같은 보물을 또 건지면 보물 레벨 업(최대 5, 장착 효과 +10%씩)
 ④ 수족관: 전시 의뢰(매일 3개) · 명성 등급(관람료 ↑) · 물고기 교감(수조 물고기를 탭하면 하트)
 ⑤ 도감: 소형·일반형·대형·초대형·돌연변이·황금·알비노를 눌러 모습 보기 (06 09_ui.js 미리보기와 연결) */
// ---------- ③ 모드 정리 ----------
save.mode='normal';try{if(typeof CH!=='undefined'&&CH)endChal()}catch(e){}
modeChip=function(){const b=$('cMode');if(b)b.remove()};modeChip();
for(let i=ACH.length-1;i>=0;i--)if(ACH[i].c==='도전')ACH.splice(i,1);
const _pb419=pickBgm;pickBgm=function(){const k=_pb419();return (goldenT>0||legendT>0)&&S!=='title'&&!(SND.preview&&performance.now()<SND.previewT)?BGMN.b5:k};  // 보물 곡은 황금·전설 이벤트 때
// 보물 레벨: 장착 효과 +10%씩
const _tv419=treVal;treVal=function(t){const R=save.tre[t.id];return _tv419(t)*(1+.1*Math.max(0,Math.min(5,(R&&R.lv)||1)-1))};
function treDrop(f){if(!f||f.r<=0||f.tre||f.boss||practice)return null;let p=.035+(fever>0?.02:0)+fxv('scroll')/100+tfx('tre')/100;const am=fxv('amulet');if(am&&(weather==='rain'||weather==='storm'))p*=1+am/100;
 if(Math.random()>=p)return null;const t=pickTre();if(!t)return null;const R=save.tre[t.id],isNew=!R;
 const r=R||(save.tre[t.id]={n:0,first:today(),loc:save.loc,lv:1});r.n++;r.lv=Math.min(5,(r.lv||1)+(isNew?0:1));save.st.tre=(save.st.tre||0)+1;const g=Math.round(t.val*(1+save.lv*.02)*.5);save.gold+=g;
 return{t,isNew,lv:r.lv,g}}
// ---------- ② 칭호 효과 ----------
const TFXN={gold:'골드',xp:'경험치',rare:'희귀(★3 이상) 확률',bite:'입질 대기 단축',win:'챔질 여유',stab:'장력 안정',crit:'크리티컬',tre:'보물 발견'};
const TITLE_FX={};  // 칭호 이름 → [종류, %]
function tfx(k){const t=save.title&&TITLE_FX[save.title];return t&&t[0]===k?t[1]:0}
function tcol(){return Math.min(15,Math.floor(Object.keys(save.titles||{}).length/10))}
function tfxText(n){const x=TITLE_FX[n];return x?`${TFXN[x[0]]} ${x[0]==='tre'?'+'+x[1]+'%p':'+'+x[1]+'%'}`:'골드 +2%'}
// ---------- ① 업적 ----------
const st_=k=>save.st[k]||0;
const ACH2=[];const A=(id,c,n,d,ok,g,title,fx)=>{ACH2.push({id:'z'+id,c,n,d,ok:sv=>{try{return!!ok(sv)}catch(e){return false}},g,title});if(title)TITLE_FX[title]=fx||['gold',3]};
const RN=['','일반','고급','희귀','영웅','전설','신화','히든'];
[[5,'첫 발걸음',100],[50,'익숙한 손',400],[100,'백 마리의 손맛',1000],[300,'바다의 단골',3000],[1000,'천 마리 낚시꾼',12000,'천 마리의 바다',['gold',5]],[2000,'멈추지 않는 릴',20000],[3000,'삼천 마리 전설',30000,'파도의 기억',['xp',6]],[5000,'오천 마리 대장정',50000,'여수 바다의 왕',['gold',8]],[10000,'만 마리의 신화',100000,'바다 그 자체',['rare',6]]]
 .forEach(([n,nm,g,t,fx],i)=>A('c'+i,'누적 낚시',nm,`물고기 ${n.toLocaleString()}마리 낚기`,s=>s.count>=n,g,t,fx));
for(let r=2;r<=7;r++)[[10,1],[50,3],[200,8],[500,20]].forEach(([n,m],i)=>{const hard=i>=2;A(`r${r}_${i}`,'등급별 낚시',`${RN[r]} ${['수집가','사냥꾼','달인','전설'][i]}`,`${RN[r]} 등급 ${n}마리 낚기`,s=>st_('r'+r)>=n,Math.round(m*150*r),hard?`${RN[r]} ${i===2?'달인':'의 전설'}`:null,hard?[r>=5?'rare':'gold',i===3?4:2+(r>=5?1:0)]:null)});
[[15,'불붙은 손',800],[25,'폭풍 낚시꾼',1500,'폭풍 낚시꾼',['crit',4]],[30,'용왕의 손맛',2500],[40,'바다를 지배하는 자',4000,'바다를 지배하는 자',['stab',4]],[50,'콤보 50',8000,'끊기지 않는 줄',['gold',6]],[60,'콤보 60',10000],[75,'신화의 낚시꾼',15000,'신화의 낚시꾼',['xp',7]],[100,'콤보 100',30000,'백연속의 전설',['rare',5]],[150,'콤보 150',50000,'끝없는 손맛',['gold',9]],[200,'콤보 200',80000,'여수 바다의 주인',['rare',8]]]
 .forEach(([n,nm,g,t,fx],i)=>A('cb'+i,'콤보',nm,`최고 콤보 ${n}연속`,s=>Math.max(s.comboBest||0,s.st.maxCombo||0)>=n,g,t,fx));
[[1,1],[10,3],[50,8]].forEach(([n,k],i)=>A('cc'+i,'콤보',`콤보 보물상자 ${n}개`,`콤보 보물상자 ${n}번 열기`,()=>st_('cchest')>=n,500*k,i===2?'보물상자 수집가':null,['tre',2]));
[[10,'정확한 손'],[50,'타이밍 장인'],[100,'퍼펙트 백 번',1],[300,'눈 감고도 퍼펙트',1],[1000,'시간을 멈춘 자',1]].forEach(([n,nm,t],i)=>A('pf'+i,'실력','PERFECT '+n,`PERFECT 챔질로 ${n}마리 낚기`,s=>(s.totalPerfectCatches||0)>=n,300*(i+1)**2,t?nm:null,['win',3+i]));
[[1,'첫 S등급'],[10,'S 열 번'],[50,'완벽주의자',1],[100,'S 백 번',1],[300,'손맛의 정점',1],[1000,'전설의 손놀림',1]].forEach(([n,nm,t],i)=>A('s'+i,'실력',nm,`실력 평가 S등급 ${n}번`,s=>((s.fightGradeCounts||{}).S||0)>=n,250*(i+1)**2,t?nm:null,['stab',2+i]));
[[1,'위기 탈출'],[10,'침착한 손'],[50,'역전의 명수',1],[100,'링 마스터',1],[300,'위기를 즐기는 자',1]].forEach(([n,nm,t],i)=>A('cl'+i,'실력',nm,`위기 링 ${n}번 성공`,()=>st_('clutch')>=n,300*(i+1)**2,t?nm:null,['stab',3+i]));
[[50,'크리티컬 50'],[200,'크리티컬 200'],[500,'급소 사냥꾼',1],[1000,'크리티컬 1000',1],[3000,'일격필살',1]].forEach(([n,nm,t],i)=>A('cr'+i,'실력',nm,`크리티컬 ${n}번`,()=>st_('crit')>=n,250*(i+1)**2,t?nm:null,['crit',4+i]));
[[5,'대물 낚시꾼'],[20,'초대형 사냥꾼',1],[50,'거대어 수집가',1],[100,'바다 괴물 조련사',1]].forEach(([n,nm,t],i)=>A('gi'+i,'대물·변종',nm,`초대형 ${n}마리`,()=>st_('giant')>=n,600*(i+1)**2,t?nm:null,['rare',3+i]));
[['gold','황금'],['mut','돌연변이'],['albino','알비노']].forEach(([v,vn])=>[[1],[5],[20]].forEach(([n],i)=>A(`v${v}${i}`,'대물·변종',`${vn} ${n}마리`,`${vn} 변종 ${n}마리 낚기`,()=>st_('v_'+v)>=n,[800,3000,10000][i],i===2?`${vn}의 손`:null,['rare',4])));
[[100,'100kg'],[5000,'5톤 트럭'],[10000,'10톤의 바다',1],[50000,'50톤의 전설',1]].forEach(([n,nm,t],i)=>A('kg'+i,'대물·변종',`누적 ${nm}`,`누적 무게 ${fmtKg(n)}`,s=>s.st.totalKg>=n,[500,5000,12000,40000][i],t?nm:null,['gold',4+i]));
[[10,'10kg 한 마리'],[100,'100kg 괴물'],[500,'500kg 전설',1]].forEach(([n,nm,t],i)=>A('mk'+i,'대물·변종',nm,`한 마리 ${n}kg 이상`,s=>s.rank[0]&&s.rank[0].kg>=n,[800,5000,20000][i],t?'거인 사냥꾼':null,['rare',5]));
BOSSES.forEach((b,k)=>[[5],[10]].forEach(([n],i)=>A(`b${b.id}${i}`,'보스',`${FID[b.id].n} ${n}회 처치`,`${FID[b.id].n} ${n}번 이기기`,s=>(s.boss[b.id]||{}).win>=n,[3000,8000][i]*(k+1),i===1?`${FID[b.id].n} 사냥꾼`:null,['crit',3+k])));
[[10,'보스 10'],[30,'보스 30',1],[60,'보스 학살자',1]].forEach(([n,nm,t],i)=>A('bt'+i,'보스',nm,`보스 총 ${n}번 처치`,s=>Object.values(s.boss).reduce((a,x)=>a+(x.win||0),0)>=n,[5000,15000,40000][i],t?nm:null,['stab',5+i]));
[[5,'보물 5종'],[10,'보물 10종'],[15,'보물 15종',1],[21,'보물 21종 완성',1]].forEach(([n,nm,t],i)=>A('tr'+i,'보물',nm,`보물 ${n}종 모으기`,s=>Object.keys(s.tre).length>=n,[1000,3000,8000,20000][i],t?['보물 감정사','용궁의 보물지기'][i-2]:null,['tre',3+i]));
[[1,'레벨 5 보물'],[5,'레벨 5 보물 5개',1]].forEach(([n,nm,t],i)=>A('tl'+i,'보물',nm,`보물 레벨 5를 ${n}개 만들기`,s=>Object.values(s.tre).filter(r=>(r.lv||1)>=5).length>=n,[3000,15000][i],t?'보물 연금술사':null,['tre',4]));
[[10],[50],[200]].forEach(([n],i)=>A('tn'+i,'보물',`보물 ${n}번 건지기`,`보물을 모두 ${n}번 건지기`,()=>st_('tre')>=n,[800,4000,15000][i],i===2?'심해의 행운아':null,['tre',5]));
LOCS.forEach((l,i)=>A('lc'+l.id,'도감',`${l.n} 도감 완성`,`${l.n}의 친구 모두 모으기`,s=>!!s.locDone[l.id+'_n'],1500*(i+1),i>=6?`${l.n.split(' ').pop()}의 주인`:null,['rare',2+Math.floor(i/3)]));
[[10],[20],[30],[40],[50],[60],[80],[100]].forEach(([n],i)=>A('lv'+i,'성장',`레벨 ${n}`,`레벨 ${n} 달성`,s=>s.lv>=n,n*120,n>=50?`Lv${n} 베테랑`:null,['xp',2+i]));
[[10000],[100000],[1000000],[10000000]].forEach(([n],i)=>A('ge'+i,'성장',`누적 골드 ${n.toLocaleString()}`,`낚시로 골드 ${n.toLocaleString()} 벌기`,()=>st_('goldE')>=n,[500,3000,20000,100000][i],i>=2?['백만장자 낚시꾼','천만장자 어부'][i-2]:null,['gold',5+i]));
[[10000],[100000],[1000000]].forEach(([n],i)=>A('sp'+i,'성장',`큰손 ${i+1}`,`골드 ${n.toLocaleString()} 쓰기`,()=>st_('spent')>=n,[300,2000,10000][i],i===2?'바다의 큰손':null,['gold',4]));
[[7],[30],[100],[365]].forEach(([n],i)=>A('at'+i,'성장',`출석 ${n}일`,`누적 ${n}일 출석`,s=>s.att.total>=n,[500,2000,8000,30000][i],i>=2?['꾸준한 낚시꾼','일년 내내 낚시'][i-2]:null,['xp',5]));
[[50],[100],[200]].forEach(([n],i)=>A('dy'+i,'성장',`하루 ${n}마리`,`하루에 ${n}마리 낚기`,()=>st_('dayMax')>=n,[800,3000,10000][i],i===2?'불꽃 낚시꾼':null,['bite',5]));
[['rain','비 오는 날','🌧️'],['storm','폭풍우','⛈️'],['fog','안개','🌫️'],['snow','눈 오는 날','❄️'],['night','밤','🌙']].forEach(([k,nm])=>[[10],[50],[200]].forEach(([n],i)=>A(`w${k}${i}`,'날씨·계절',`${nm} ${n}마리`,`${nm}에 ${n}마리 낚기`,()=>st_('w_'+k)>=n,[400,1500,6000][i],i===2?`${nm}의 낚시꾼`:null,[k==='night'?'rare':'bite',4])));
[['spring','봄'],['summer','여름'],['autumn','가을'],['winter','겨울']].forEach(([k,nm])=>[[30],[300]].forEach(([n],i)=>A(`ss${k}${i}`,'날씨·계절',`${nm} ${n}마리`,`${nm}에 ${n}마리 낚기`,()=>st_('s_'+k)>=n,[600,5000][i],i===1?`${nm}의 바다`:null,['xp',4])));
METHODS.forEach(m=>[[50],[300]].forEach(([n],i)=>A(`m${m.id}${i}`,'낚시 방식',`${m.n} ${n}마리`,`${m.n}으로 ${n}마리 낚기`,()=>st_('m_'+m.id)>=n,[600,4000][i],i===1?`${m.n} 장인`:null,['win',4])));
[[1],[5],[15]].forEach(([n],i)=>A('eq'+i,'장비',`승급 ${n}번`,`장비 승급 ${n}번`,s=>Object.values(s.inh||{}).reduce((a,x)=>a+x,0)>=n,[1000,5000,20000][i],i===2?'장비의 계승자':null,['stab',5]));
[[1],[5],[10]].forEach(([n],i)=>A('e5'+i,'장비',`+5 장비 ${n}개`,`+5 강화 장비 ${n}개`,s=>Object.values(s.enh||{}).filter(v=>v>=5).length>=n,[800,4000,12000][i],i===2?'대장장이':null,['crit',4]));
[[100],[500]].forEach(([n],i)=>A('gm'+i,'장비',`숙련 ${n}`,`한 장비 숙련 ${n}`,s=>Math.max(0,...Object.values(s.gm||{}))>=n,[1500,8000][i],i===1?'손에 붙은 낚싯대':null,['crit',5]));
[[10],[30],[60],[100]].forEach(([n],i)=>A('ti'+i,'칭호',`칭호 ${n}개`,`칭호 ${n}개 모으기`,s=>Object.keys(s.titles).length>=n,[1000,4000,12000,30000][i],i>=2?['칭호 수집가','이름이 너무 많은 자'][i-2]:null,['xp',5+i]));
[[3],[5],[10]].forEach(([n],i)=>A('aq'+i,'수족관',`명성 ${n}등급`,`수족관 명성 ${n}등급`,()=>aqFame().L>=n,[1000,4000,15000][i],i>=1?['인기 수족관 관장','여수 아쿠아리움 대표'][i-1]:null,['gold',4+i]));
[[5],[30],[100]].forEach(([n],i)=>A('aqr'+i,'수족관',`전시 의뢰 ${n}`,`전시 의뢰 ${n}번 완료`,()=>st_('aqReq')>=n,[800,4000,12000][i],i===2?'의뢰 해결사':null,['gold',5]));
[[30],[300]].forEach(([n],i)=>A('aqp'+i,'수족관',`교감 ${n}`,`수조 물고기와 ${n}번 교감`,()=>st_('aqPet')>=n,[500,3000][i],i===1?'물고기 친구':null,['bite',3]));
ACH.push(...ACH2);
// 기존 칭호엔 기본 효과(골드 +2%) · 칭호 상점 칭호는 경험치 +2%
(typeof TITLE_SHOP!=='undefined'?TITLE_SHOP:[]).forEach(x=>{if(!TITLE_FX[x.n])TITLE_FX[x.n]=['xp',2]});
ACH.forEach(a=>{if(a.title&&!TITLE_FX[a.title])TITLE_FX[a.title]=['gold',2]});
// ---------- 기록 모으기 + 효과 적용 ----------
const _sr421=showResult;showResult=function(){const f=fish,g0=save.gold;_sr421();if(!f||!lastRes||lastRes.f!==f||practice||f.tre)return;
 if(f.r>0){const s=save.st;s['r'+f.r]=(s['r'+f.r]||0)+1;if(f.v)s['v_'+f.v]=(s['v_'+f.v]||0)+1;
  const wk=weather==='rain'||weather==='storm'||weather==='fog'||weather==='snow'?weather:null;if(wk)s['w_'+wk]=(s['w_'+wk]||0)+1;if(isNight())s.w_night=(s.w_night||0)+1;
  s['s_'+seasonNow()]=(s['s_'+seasonNow()]||0)+1;s['m_'+save.method]=(s['m_'+save.method]||0)+1;s.dayMax=Math.max(s.dayMax||0,save.today.count||0);
  const pct=tfx('gold')+tcol();if(pct>0&&lastRes.gold>0){const b=Math.round(lastRes.gold*pct/100);save.gold+=b;lastRes.gold+=b;$('rGold').textContent='+'+lastRes.gold.toLocaleString()}
  const d=treDrop(f);if(d){lastRes.treDrop=d;$('rRec').textContent=[$('rRec').textContent,`💎 보물 「${d.t.n}」${d.isNew?' 첫 발견!':` Lv${d.lv}`} +${d.g.toLocaleString()}`].filter(Boolean).join(' · ');
   setTimeout(()=>{notice(`💎 ${d.isNew?'새 보물':'보물'} 「${d.t.n}」${d.isNew?' 발견!':` · 보물 레벨 ${d.lv}`}`);if(SFX.tre)SFX.tre(d.t.r);sparkle(W/2,H*.32,30,['#ffe066','#fff','#7ff0e6'])},700)}}
 save.st.goldE=(save.st.goldE||0)+Math.max(0,save.gold-g0);persist();hud()};
const _cc421=comboChest;comboChest=function(n){save.st.cchest=(save.st.cchest||0)+1;return _cc421(n)};
const _ax421=addXp;addXp=function(x){const p=tfx('xp')+tcol();return _ax421(p?Math.round(x*(1+p/100)):x)};
const _wt421=weights;weights=function(far,spot){const ws=_wt421(far,spot),p=tfx('rare');return p?ws.map((w,i)=>FISH[i].r>=3?w*(1+p/100):w):ws};
const _lb421=landBobber;landBobber=function(){_lb421();const p=tfx('bite');if(p&&fg&&fg.bite&&!bossPending){const k=1-p/100;fg.bite*=k;if(fg.cues)fg.cues=fg.cues.map(c=>c*k)}};
const _bn421=biteNow;biteNow=function(g){_bn421(g);const p=tfx('win');if(p&&fg.win)fg.win*=1+p/100};
const _gs421=GS;GS=function(gear=save.gear,enh=save.enh){const o=_gs421(gear,enh),s=tfx('stab'),c=tfx('crit');if(s)o.stab=Math.round(o.stab*(1+s/100));if(c)o.crit+=c;return o};
// ---------- 업적 화면: 분류별 접기, 받을 수 있는 건 위로 ----------
const _mh421=missionHTML;missionHTML=function(){if(sheet.tab!=='ach'){let h=_mh421();
  if(sheet.tab==='rec')h=h.replace(/<b>「([^」]*)」<\/b><button data-act="title"/g,(m,n)=>`<b>「${n}」<small style="display:block;color:#2a8a5a;font-size:12px">✨ ${tfxText(n)}</small></b><button data-act="title"`)
   .replace('<div class="sec">🎖️ 내 칭호</div>',`<div class="sec">🎖️ 내 칭호</div><div class="sum">달고 있는 칭호 효과: <b>${save.title?tfxText(save.title):'없음'}</b> · 칭호 수집 보너스: 골드·경험치 <b>+${tcol()}%</b> (10개마다 +1%, 최대 15%)</div>`);
  return h}
 const ok=a=>{try{return a.ok(save)}catch(e){return false}},done=ACH.filter(a=>save.ach[a.id]).length,ready=ACH.filter(a=>!save.ach[a.id]&&ok(a)),cats=[...new Set(ACH.map(a=>a.c))];
 const row=a=>{const c=save.ach[a.id],o=ok(a);return`<div class="row ${c?'eq':''}"><div class="ic">${c?'🏆':o?'🎁':'🔒'}</div><div><b>${a.n}</b><p>${a.d} · 🪙${a.g.toLocaleString()}${a.title?` · 칭호 「${a.title}」 <span style="color:#2a8a5a">(${tfxText(a.title)})</span>`:''}</p></div><button data-act="claimA" data-id="${a.id}" ${!o||c?'disabled':''}>${c?'완료':'받기'}</button></div>`};
 return`<div class="sum">🏆 업적 ${done}/${ACH.length} · 🎖️ 칭호 ${Object.keys(save.titles).length}개 (수집 보너스 +${tcol()}%)${save.title?` · 달고 있는 칭호 「${save.title}」 ${tfxText(save.title)}`:''}</div>`
  +(ready.length?`<div class="sec">🎁 지금 받을 수 있어요 (${ready.length})</div>`+ready.map(row).join(''):'')
  +cats.map(cat=>{const L=ACH.filter(a=>a.c===cat),dn=L.filter(a=>save.ach[a.id]).length;return`<details class="ach421"><summary>${cat} <span>${dn}/${L.length}</span></summary>${L.map(row).join('')}</details>`}).join('')};
// ---------- ④ 수족관 ----------
const FAME=[0,60,180,400,800,1500,2600,4200,6500,10000];
function aqFame(){const r=save.aq.rep||0;let L=1;for(let i=0;i<FAME.length;i++)if(r>=FAME[i])L=i+1;return{L,r,next:FAME[L]||null,prev:FAME[L-1]}}
const _ar421=aqRate;aqRate=function(){return Math.round(_ar421()*(1+.08*(aqFame().L-1)))};
const AQRQ=[{t:'rare',f:n=>`희귀(★3) 이상 ${n}마리 전시`,n:[2,3],ok:(s,n)=>s.filter(id=>FID[id].r>=3).length>=n},{t:'sp',f:n=>`서로 다른 친구 ${n}종 전시`,n:[4,6],ok:(s,n)=>new Set(s).size>=n},
 {t:'big',f:()=>`영웅(★4) 이상 1마리 전시`,n:[1],ok:s=>s.some(id=>FID[id].r>=4)},{t:'bottom',f:n=>`바닥 친구(게·불가사리·가오리 등) ${n}마리`,n:[1,2],ok:(s,n)=>s.filter(id=>AQ_BOTTOM.includes(FID[id].k)||AQ_BOTTOM.includes(id)).length>=n},
 {t:'loc',f:(n,l)=>`${LOCS.find(x=>x.id===l).n} 친구 ${n}마리`,n:[2,3],ok:(s,n,l)=>s.filter(id=>FID[id].loc.includes(l)).length>=n},{t:'full',f:()=>`수조를 가득 채우기`,n:[1],ok:s=>s.length>=aqCap()}];
function aqReqs(){const a=save.aq,d=today();if(!a.reqs||a.reqs.d!==d){const r=seeded('aq'+d),pool=AQRQ.slice(),list=[];const open=LOCS.filter(l=>save.locs[l.id]).map(l=>l.id);
  while(list.length<3&&pool.length){const T0=pool.splice(Math.floor(r()*pool.length),1)[0];list.push({t:T0.t,n:T0.n[Math.floor(r()*T0.n.length)],l:open[Math.floor(r()*open.length)]||'pier',c:0})}a.reqs={d,list}}return a.reqs}
function aqReqHTML(){const R=aqReqs(),F=aqFame(),s=save.aq.slots;return`<p class="aqp">⭐ 명성 ${F.L}등급 (${F.r}${F.next?' / '+F.next:''}) · 관람료 +${(F.L-1)*8}% · 의뢰는 매일 자정에 바뀌어요</p><div class="bar"><i style="width:${F.next?Math.min(100,(F.r-F.prev)/(F.next-F.prev)*100):100}%"></i></div>`
 +R.list.map((q,i)=>{const T0=AQRQ.find(x=>x.t===q.t),ok=T0.ok(s,q.n,q.l),g=Math.round(300*(1+.25*(F.L-1)));return`<div class="row ${q.c?'eq':''}"><div class="ic">${q.c?'✅':ok?'🎁':'📋'}</div><div><b>${T0.f(q.n,q.l)}</b><p>보상 🪙${g.toLocaleString()} · 명성 +40</p></div><button data-aq419="req" data-i="${i}" ${!ok||q.c?'disabled':''}>${q.c?'완료':'받기'}</button></div>`}).join('')
 +`<p class="aqp">🐟 수조 안 물고기를 톡 누르면 교감해요 (하루 한 번씩 명성 +3 · 골드 조금)</p>`}
const _ra421=renderAq;renderAq=function(){_ra421();const tb=$('aqTabs');if(tb&&!tb.querySelector('[data-aqt=req]'))tb.insertAdjacentHTML('afterbegin',`<button data-aqt="req" class="${AQX.tab==='req'?'on':''}">📋 의뢰·명성</button>`);
 if(AQX.tab==='req')$('aqBody').innerHTML=aqReqHTML();const F=aqFame();$('aqInfo').insertAdjacentHTML('beforeend',` · ⭐명성 ${F.L}등급`)};
$('aq').addEventListener('click',e=>{const b=e.target.closest('button[data-aq419]');if(!b||b.disabled)return;const R=aqReqs(),q=R.list[+b.dataset.i],T0=AQRQ.find(x=>x.t===q.t);
 if(!q.c&&T0.ok(save.aq.slots,q.n,q.l)){q.c=1;const F=aqFame(),g=Math.round(300*(1+.25*(F.L-1)));save.gold+=g;save.aq.rep=(save.aq.rep||0)+40;save.st.aqReq=(save.st.aqReq||0)+1;
  const F2=aqFame();if(F2.L>F.L){bigText(`⭐ 명성 ${F2.L}등급!`,`관람료 +${(F2.L-1)*8}%`,'#ffd23f');SFX.tre&&SFX.tre(4)}else SFX.coin();toast(`의뢰 완료! 🪙${g.toLocaleString()} · 명성 +40`,1000);persist();renderAq();hud()}});
const AQH=[];
$('aqc').addEventListener('pointerdown',e=>{const r=$('aqc').getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;let best=null,bd=46;
 for(const a of AQX.fish){const d=Math.hypot(a.x-px,a.y-py);if(d<bd){bd=d;best=a}}if(!best)return;
 for(let i=0;i<5;i++)AQH.push({x:best.x+rnd(-10,10),y:best.y-6,vy:-rnd(25,45),l:1.1});best.vx=-best.vx;
 const p=save.aq.pet||(save.aq.pet={d:'',ids:{}});if(p.d!==today()){p.d=today();p.ids={}}
 if(!p.ids[best.id]){p.ids[best.id]=1;const g=Math.round(5+GOLD_BASE[FID[best.id].r]*.1);save.gold+=g;save.aq.rep=(save.aq.rep||0)+3;save.st.aqPet=(save.st.aqPet||0)+1;toast(`💗 ${FID[best.id].n}와 교감! 명성 +3 · 🪙${g}`,900);persist();if(window.SND2)0;if(typeof react==='function')react('pet_love',1,.6)}
 else toast(`💗 ${FID[best.id].n}: 오늘은 이미 친해졌어요`,700)});
const _da421=drawAq;drawAq=function(t,dt){_da421(t,dt);if(!$('aq').classList.contains('on')||!AQH.length)return;const c=$('aqc'),g=c.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);g.font='16px sans-serif';g.textAlign='center';
 for(let i=AQH.length-1;i>=0;i--){const h=AQH[i];h.l-=dt;h.y+=h.vy*dt;if(h.l<=0){AQH.splice(i,1);continue}g.globalAlpha=Math.min(1,h.l*1.5);g.fillText('💗',h.x,h.y)}g.globalAlpha=1};
// ---------- ⑤ 도감 형태 보기 ----------
$('sbody').addEventListener('click',e=>{const b=e.target.closest('[data-dv]');if(!b)return;sheet.dv=sheet.dv===b.dataset.dv?'':b.dataset.dv;sheet.dvSel=sheet.sel;renderSheet()});
if(TEST)Object.defineProperties(window.__w,{tfx:{value:tfx},tcol:{value:tcol},TITLE_FX:{value:TITLE_FX},treDrop:{value:treDrop},aqFame:{value:aqFame},aqReqs:{value:aqReqs},ACH:{value:ACH},AQH:{value:AQH}});
