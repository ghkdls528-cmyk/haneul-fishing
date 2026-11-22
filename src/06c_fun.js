/* ================= 4.4 재미 추가: 오늘의 대어 현상금 · 행운 상자 ================= */
// 오늘의 대어: 날짜로 정해지는 어종 1종(내가 열어둔 낚시터에서 잡을 수 있는 희귀~영웅). 잡으면 골드 ×3, 첫 포획 땐 현상금 추가.
function bountyOf(){const d=today();if(save.bounty&&save.bounty.date===d)return save.bounty;
 const open=LOCS.filter(l=>save.locs[l.id]).map(l=>l.id),pool=FISH.filter(f=>!f.boss&&!f.hid&&f.r>=2&&f.r<=4&&f.loc.some(x=>open.includes(x)));
 const r=seeded('b'+d),f=pool.length?pool[Math.floor(r()*pool.length)]:FID.mackerel;
 save.bounty={date:d,id:f.id,done:0,reward:Math.round(GOLD_BASE[f.r]*12+300*f.r)};return save.bounty}
function bountyHit(f,gold){const b=bountyOf();if(f.id!==b.id)return{gold,extra:0};const first=!b.done;b.done++;if(first)save.st.bounty=(save.st.bounty||0)+1;const extra=first?b.reward:0;
 setTimeout(()=>{notice(first?`🎯 오늘의 대어 ${f.n} 포획! 현상금 +${b.reward.toLocaleString()}골드`:`🎯 오늘의 대어 ${f.n}! 골드 3배`);SFX.reward(4)},first?900:400);
 return{gold:gold*3+extra,extra}}
// 행운 상자: 진짜 물고기 8마리마다 상자 등장 → 카드 3장 중 1장 고르기
const LUCK=[
 {id:'gold',ic:'💰',n:'골드 주머니',d:lv=>`${(800+lv*120).toLocaleString()}골드`,go:()=>{const g=800+save.lv*120;save.gold+=g}},
 {id:'goldb',ic:'✨',n:'황금 미끼',d:()=>'2개 (대어·변종 확률 2배)',go:()=>{save.goldB=(save.goldB||0)+2}},
 {id:'legend',ic:'👑',n:'전설의 시간',d:()=>'40초 동안 전설 어종 3배',go:()=>{legendT=40;notice('👑 전설 어종 출현 시간! 40초')}},
 {id:'golden',ic:'🌟',n:'황금 물결',d:()=>'30초 동안 황금 변종 6배',go:()=>{goldenT=30;notice('🌟 황금 물고기 출현! 30초')}},
 {id:'fever',ic:'🔥',n:'즉시 피버',d:()=>'15초 피버(골드 2배·빠른 입질)',go:()=>{fever=Math.max(fever,15)}},
 {id:'xp',ic:'📘',n:'경험치 책',d:lv=>`경험치 +${40+lv*8}`,go:()=>{addXp(40+save.lv*8)}},
 {id:'school',ic:'🐟',n:'물고기 떼 부르기',d:()=>'바로 물고기 떼 출현',go:()=>{const g=G();school={x:rnd(g.edge+60,W-40),t:0,life:16};notice('🐟 물고기 떼가 몰려왔어요!')}}];
let luckOpen=null;
let luckPend=0;function luckTick(f){if(f.r<=0)return;save.luck=(save.luck||0)+1;if(save.luck>=8){save.luck=0;luckPend=1}}
setInterval(()=>{if(!luckPend||luckOpen||S!=='ready'||(TEST&&window.__noLuck))return;if(document.querySelector('.ov.on,#reveal.on,#ward.on,#aq.on,.sheet.on'))return;luckPend=0;openLuck()},400);
function openLuck(){if(luckOpen)return;const pool=LUCK.filter(x=>x.id!=='school'||save.loc!=='deep');const pick=[];const r=pool.slice();while(pick.length<3&&r.length)pick.push(r.splice(Math.floor(Math.random()*r.length),1)[0]);
 luckOpen={pick,t:0};const el=$('luck');el.innerHTML=`<div class="lbox"><h3>🎁 행운 상자!</h3><p>8마리 낚을 때마다 열려요. 카드 1장을 고르세요</p><div class="lcards">${pick.map((c,i)=>`<button class="lcard" data-i="${i}"><span class="lback">?</span><span class="lfront"><b>${c.ic}</b><em>${c.n}</em><small>${c.d(save.lv)}</small></span></button>`).join('')}</div></div>`;el.classList.add('on');SFX.reward(3)}
$('luck').onclick=e=>{const b=e.target.closest('.lcard');if(!b||!luckOpen||luckOpen.done)return;luckOpen.done=1;save.st.luck=(save.st.luck||0)+1;const i=+b.dataset.i,c=luckOpen.pick[i];
 document.querySelectorAll('.lcard').forEach((x,j)=>{x.classList.add('flip');if(j!==i)x.classList.add('dim')});b.classList.add('pick');c.go();persist();hud();chips();SFX.coin();
 setTimeout(()=>{$('luck').classList.remove('on');luckOpen=null;toast(`${c.ic} ${c.n} 획득!`,1200)},1500)};

/* 4.5 화면 겹침 정리 */
const BUSYS=['charge','bite','hook','fight','land'];
function layoutTick(){const b=BUSYS.includes(S)||$('reveal').classList.contains('on'),rs=$('result').classList.contains('on');document.body.classList.toggle('busy',b);document.body.classList.toggle('resOn',rs&&!b);
 const bn=$('banners'),bb=bn.children.length&&!b&&!rs?bn.getBoundingClientRect().bottom:0,ch0=$('chHud'),cb=ch0&&ch0.style.display!=='none'?ch0.getBoundingClientRect().bottom:0,nt=Math.max(TOP+6,bb+6,cb+6),ne=$('notice');ne.style.top=nt+'px';
 if(b){$('combo').style.top='';return}
 const nb=ne.classList.contains('on')?ne.getBoundingClientRect().bottom:0;$('combo').style.top=Math.max(TOP+40,bb+8,nb+8,cb+8)+'px'}
setInterval(layoutTick,120);

/* 4.7 펫 쓰다듬기: 하루 5번까지 친밀도 +1, 10마다 레벨업(최대 5) · 레벨당 골드 +2% */
const PET_MSG={cat:['냥~','골골골…','냐앙!'],seagull:['끼룩!','끼룩끼룩~','퍼덕퍼덕'],penguin:['뀨!','뒤뚱뒤뚱~','삐약?'],otter:['꺅꺅!','조개 줄까?','뿌잉~']};
function petLv(id){const v=(save.petLove||{})[id];return v?Math.min(5,Math.floor(v.p/10)):0}
function petToday(id){const v=save.petLove[id]||(save.petLove[id]={p:0,n:0,d:''});const d=new Date().toLocaleDateString('sv');if(v.d!==d){v.d=d;v.n=0}return v}
function petTap(px,py){if(!save.pet||!PETPOS)return false;const dx=px-PETPOS.x,dy=py-PETPOS.y;if(dx*dx+dy*dy>PETPOS.r*PETPOS.r*1.6)return false;
 const id=save.pet,v=petToday(id),lv0=petLv(id);PETJOY=1.2;
 for(let i=0;i<6;i++)parts.push({x:PETPOS.x+rnd(-10,10),y:PETPOS.y-10,vx:rnd(-25,25),vy:rnd(-90,-50),l:1,t:0,c:'#ff7aa8',r:3,g:-.2,heart:1});
 if(id==='cat'&&SFX.meow)SFX.meow();else if(SFX.pop)SFX.pop();else SFX.coin();
 const m=PET_MSG[id]||['♥'];
 if(v.n<5){v.n++;v.p=Math.min(50,v.p+1);const lv=petLv(id);
  if(lv>lv0){SFX.mission&&SFX.mission();notice(`💕 ${PETS.find(p=>p.id===id).n} 친밀도 Lv${lv}! 골드 +${lv*2}%`)}else toast(`${m[v.n%m.length]} ♥${lv>=5?'MAX':v.p%10+'/10'}`,800)}
 else toast(`${m[0]} 오늘은 충분히 놀았어요`,800);
 persist();return true}
let PETJOY=0;

/* 4.8 수집형 업적·칭호: 장비·옷·꾸미기·펫·수족관·플레이 */
function spend(n){save.st.spent=(save.st.spent||0)+Math.max(0,+n||0)}
const _own=(o,ids)=>ids.every(i=>o&&o[i]);
const NEWACH=[
 ['b1','장비','첫 장비 구입','기본 외 장비 1개 갖기',s=>Object.keys(s.gown).filter(k=>!/0$/.test(k)).length>=1,300],
 ['b2','장비','장비 수집가','낚싯대·릴·낚싯줄 18종 모두 갖기',s=>[...RODS,...REELS,...LINES].every(x=>s.gown[x.id]),8000,'장비 수집가'],
 ['b3','장비','강화 입문','장비 하나를 +1 강화',s=>Object.values(s.enh).some(v=>v>=1),300],
 ['b4','장비','강화 장인','장비 하나를 +5까지 강화',s=>Object.values(s.enh).some(v=>v>=5),3000,'강화 장인'],
 ['b5','장비','포세이돈의 후예','최고 등급(★5) 장비 갖기',s=>['r5','e5','l5'].some(k=>s.gown[k]),5000,'포세이돈의 후예'],
 ['w1','옷장','멋쟁이 입문','기본 외 세트 1벌 갖기',()=>WSETS.filter(st=>st.id!=='s_basic'&&setOwned(st)).length>=1,300],
 ['w2','옷장','패셔니스타','세트 10벌 갖기',()=>WSETS.filter(setOwned).length>=10,3000,'패셔니스타'],
 ['w3','옷장','옷장의 주인','세트 모두 갖기',()=>WSETS.every(setOwned),15000,'옷장의 주인'],
 ['w4','옷장','인형탈 장인','상어·문어·펭귄·고양이 인형옷 세트 갖기',()=>['s_shark','s_octo','s_penguin','s_cat'].every(id=>{const st=WSETS.find(x=>x.id===id);return st&&setOwned(st)}),2000,'인형탈 장인'],
 ['w5','옷장','나만의 코디','내 코디 슬롯에 1벌 저장',s=>(s.ward.pre||[]).some(Boolean),200],
 ['c1','꾸미기','나만의 낚싯대','로드 스킨 1개 구입',s=>Object.keys(s.cos.rod||{}).some(k=>k!=='basic'),300],
 ['c2','꾸미기','선장님','기본 외 보트 갖기',s=>Object.keys(s.cos.boat||{}).some(k=>k!=='basic'),1000,'선장님'],
 ['c3','꾸미기','낚시터 디자이너','낚시터 장식 6종 모두 갖기',s=>_own(s.deco,DECOS.map(x=>x.id)),3000,'낚시터 디자이너'],
 ['c4','꾸미기','찌 수집가','찌 모두 갖기',s=>_own(s.bobs,BOBS.map(x=>x.id)),3000,'찌 수집가'],
 ['p1','펫','첫 친구','펫 1마리 데려오기',s=>Object.keys(s.pets||{}).length>=1,300],
 ['p2','펫','동물 친구','펫 4마리 모두 데려오기',s=>_own(s.pets,PETS.map(x=>x.id)),4000,'동물 친구'],
 ['p3','펫','단짝','펫 하나와 친밀도 Lv5',s=>PETS.some(p=>petLv(p.id)>=5),3000,'단짝'],
 ['q1','수족관','수족관 개장','물고기 1마리 전시',s=>s.aq.slots.length>=1,200],
 ['q2','수족관','아쿠아리스트','수족관 장식 6종 모두 갖기',s=>_own(s.aq.decos,AQ_DECOS.map(x=>x.id)),3000,'아쿠아리스트'],
 ['q3','수족관','테마 수집가','수족관 테마 4종 모두 갖기',s=>_own(s.aq.themes,AQ_THEMES.map(x=>x.id)),4000],
 ['q4','수족관','대형 수족관','수조를 끝까지 확장',s=>s.aq.cap>=AQ_CAP.length-1,5000,'수족관 건축가'],
 ['q5','수족관','먹이 주는 사육사','수족관 먹이 20번 주기',s=>(s.st.feed||0)>=20,1500,'사육사'],
 ['f1','플레이','손맛 마스터','손맛 마스터 10번',s=>(s.st.clean||0)>=10,1500,'손맛 마스터'],
 ['f2','플레이','현상금 사냥꾼','오늘의 대어 5번 잡기',s=>(s.st.bounty||0)>=5,2000,'현상금 사냥꾼'],
 ['f3','플레이','행운아','행운 상자 10번 열기',s=>(s.st.luck||0)>=10,1500,'행운아'],
 ['f4','플레이','큰손','골드 누적 10만 쓰기',s=>(s.st.spent||0)>=100000,3000,'큰손'],
 ['f5','플레이','바다 재벌','골드 누적 100만 쓰기',s=>(s.st.spent||0)>=1000000,20000,'바다 재벌'],
 ['f6','플레이','안개 속 낚시꾼','안개 속에서 10마리 낚기',s=>(s.st.fog||0)>=10,1500,'안개 사냥꾼'],
 ['f7','플레이','칭호 수집가','칭호 10개 모으기',s=>Object.keys(s.titles).length>=10,5000,'칭호 수집가']];
for(const[id,c,n,d,ok,g,title]of NEWACH)ACH.push({id,c,n,d,ok:sv=>{try{return!!ok(sv)}catch(e){return false}},g,title});
ACH.forEach(a=>{if(!a.c)a.c='낚시'});
let achBoot=false;
function achWatch(){if(!inGame()||document.body.classList.contains('busy'))return;save.achSeen=save.achSeen||{};const nw=ACH.filter(a=>!save.ach[a.id]&&!save.achSeen[a.id]&&(()=>{try{return a.ok(save)}catch(e){return false}})());
 if(!nw.length){achBoot=true;return}nw.forEach(a=>save.achSeen[a.id]=1);
 if(!achBoot&&nw.length>1){notice(`🏆 받을 수 있는 업적이 ${nw.length}개 있어요! 미션 › 업적`)}else nw.forEach(a=>{notice(`🏆 업적 「${a.n}」 달성!${a.title?` 칭호 「${a.title}」`:''} — 미션 › 업적에서 받기`);SFX.mission&&SFX.mission()});achBoot=true;persist()}
setInterval(achWatch,1500);

/* 4.8 안개 날씨 */
let fogAmt=0;
for(const id of['pier','rock','valley','lake','light']){const l=LOCS.find(x=>x.id===id);if(l&&!l.wx.includes('fog'))l.wx.push('fog')}
function drawFog(g,t,front){if(fogAmt<.02)return;const night=clk().i===3;ctx.save();if(front){ctx.fillStyle=`rgba(${night?'120,130,160':'235,240,242'},${.18*fogAmt})`;ctx.fillRect(0,g.surf,W,H-g.surf);if(!LOWGFX)for(let i=0;i<2;i++){const x=((t*(10+i*4)+i*W*.6)%(W+400))-200;ctx.fillStyle=`rgba(255,255,255,${.12*fogAmt})`;ctx.beginPath();ctx.ellipse(x,g.surf+6+i*8,150,10,0,0,7);ctx.fill()}ctx.restore();return}
 const gr=ctx.createLinearGradient(0,g.top,0,g.surf+40);gr.addColorStop(0,`rgba(${night?'120,130,160':'235,240,242'},${.15*fogAmt})`);gr.addColorStop(.75,`rgba(${night?'120,130,160':'235,240,242'},${.55*fogAmt})`);gr.addColorStop(1,`rgba(${night?'120,130,160':'235,240,242'},${.2*fogAmt})`);ctx.fillStyle=gr;ctx.fillRect(0,g.top,W,g.surf+40-g.top);
 if(!LOWGFX)for(let i=0;i<5;i++){const x=((t*(8+i*3)+i*W*.3)%(W+400))-200,y=g.surf-20-i*18+Math.sin(t*.4+i)*6;ctx.fillStyle=`rgba(${night?'150,160,190':'255,255,255'},${.22*fogAmt})`;ctx.beginPath();ctx.ellipse(x,y,160,16,0,0,7);ctx.fill()}
 ctx.restore()}
