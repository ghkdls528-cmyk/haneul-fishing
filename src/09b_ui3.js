const OPX=__OUTFITPX__,OPI={};Object.keys(OPX).forEach(k=>{const i=new Image();i.src=OPX[k];OPI[k]=i});
/* ================= 4.0 옷장(꾸미기) — 원본 캐릭터 + 의상 레이어 ================= */
const WX={slot:'set',sel:null,anim:'idle',rot:0,spin:false,cmp:false,at:0,fx:0};
const WTABS=[...WSLOT.filter(([k])=>k==='set'||k==='pre'),['rodskin','로드 스킨'],['reelskin','릴 스킨'],['boat','보트'],['deco','장식'],['pet','펫']];
const RNAME=['','일반','고급','희귀','영웅','전설'],RCOL=['','#9aa6ae','#4cae5a','#3a8ef0','#a35af0','#ffb020'];
const owns=(slot,it)=>it.price===0||!!save.ward.own[slot+':'+it.id];
const setOwned=st=>Object.entries(st.w).every(([k,v])=>{const it=WGET(k,v);return it&&owns(k,it)});
const setOn=st=>Object.entries(st.w).every(([k,v])=>save.ward.wear[k]===v)&&(st.w.costume||'none')===(save.ward.wear.costume||'none');
function openWard(){if(['fight','bite','hook','land'].includes(S)){toast('낚시 중엔 열 수 없어요',900);return}if(S==='charge')S='ready';WX.sel=null;WX.cmp=false;$('ward').classList.add('on');renderWard()}
function closeWard(){$('ward').classList.remove('on');persist();hud()}
$('wClose').onclick=closeWard;
function tryWear(){const w=Object.assign({},save.ward.wear);if(!WX.sel)return w;
 if(WX.slot==='set'){if(!WX.sel.w.costume)w.costume='none';Object.assign(w,WX.sel.w)}
 else if(WX.slot==='pre'){if(WX.sel.w)Object.assign(w,WX.sel.w)}
 else if(WARD[WX.slot]){w[WX.slot]=WX.sel.id;if(['top','bottom'].includes(WX.slot))w.costume='none'}return w}
function cardItem(it){const own=owns(WX.slot,it),eq=save.ward.wear[WX.slot]===it.id,sel=WX.sel&&WX.sel.id===it.id,lock=it.price<0&&!own;
 return`<div class="wcard r${it.r} ${sel?'sel':''} ${eq?'eq':''} ${lock?'lock':''}" data-wi="${it.id}"><canvas width="132" height="132" data-wic="${it.id}"></canvas>${eq?'<span class="st eq">착용 중</span>':own?'<span class="st own">보유</span>':''}<i style="background:${RCOL[it.r]}">${RNAME[it.r]}</i><b>${it.n}</b><small class="pr">${own?'':lock?'🔒 보스 보상':'🪙 '+it.price.toLocaleString()}</small></div>`}
function cardSet(st){const own=setOwned(st),on=setOn(st),sel=WX.sel&&WX.sel.id===st.id,{c,lock}=setCost(st),r=setRar(st);
 return`<div class="wcard r${r} ${sel?'sel':''} ${on?'eq':''} ${lock?'lock':''}" data-wi="${st.id}"><canvas width="132" height="132" data-wic="${st.id}"></canvas>${on?'<span class="st eq">착용 중</span>':own?'<span class="st own">보유</span>':''}<i style="background:${RCOL[r]}">${st.th}</i><b>${st.n}</b><small class="pr">${own?'':lock?'🔒 보스 보상 포함':'🪙 '+c.toLocaleString()+' (15%↓)'}</small></div>`}
function cardPre(i){const p=save.ward.pre[i];return`<div class="wcard r1 ${WX.sel&&WX.sel.id==='p'+i?'sel':''}" data-wi="p${i}"><canvas width="132" height="132" data-wic="p${i}"></canvas><b>코디 ${i+1}</b><small>${p?'저장됨':'비어 있음'}</small><div class="wpre"><button data-wact="preSave" data-id="${i}">저장</button>${p?`<button data-wact="preLoad" data-id="${i}">입기</button><button data-wact="preDel" data-id="${i}">비우기</button>`:''}</div></div>`}
function renderWard(){$('wGold').textContent='🪙 '+save.gold.toLocaleString();
 $('wTabs').innerHTML=WTABS.map(([id,n])=>`<button data-ws="${id}" class="${WX.slot===id?'on':''}">${n}</button>`).join('');
 const g=$('wGrid');
 if(WX.slot==='set'){g.className='wgrid';g.innerHTML=WSETS.map(cardSet).join('');requestAnimationFrame(drawWardIcons)}
 else if(WX.slot==='pre'){g.className='wgrid';g.innerHTML=[0,1,2,3,4].map(cardPre).join('');requestAnimationFrame(drawWardIcons)}
 else if(WARD[WX.slot]){g.className='wgrid';g.innerHTML=WARD[WX.slot].map(cardItem).join('');requestAnimationFrame(drawWardIcons)}
 else{g.className='wlist';g.innerHTML=wardListHTML()}
 renderWardBar()}
function wardListHTML(){const t=WX.slot;
 if(t==='deco')return DECOS.map(x=>{const own=save.deco[x.id],on=save.decoOn[x.id];return`<div class="row ${on?'eq':''}"><div class="ic">${icH('d_'+x.id,x.ic)}</div><div><b>${x.n}</b><p>${x.d}</p></div>${own?`<button data-wact="togDeco" data-id="${x.id}">${on?'끄기':'켜기'}</button>`:x.price<0?`<button disabled>${x.id==='trophy'?'🏆 도감 완성 보상':'👹 보스 보상'}</button>`:`<button data-wact="buyDeco" data-id="${x.id}">🪙 ${x.price.toLocaleString()}</button>`}</div>`}).join('');
 if(t==='pet')return`<div class="sum" style="margin:0 0 8px;font-size:13px">낚시터에서 펫을 톡 누르면 쓰다듬어요 · 하루 5번 친밀도 ♥+1, 10마다 레벨업(최대 Lv5, 레벨당 골드 +2%)</div>`+PETS.map(x=>{const own=save.pets[x.id],eq=save.pet===x.id,pl=(save.petLove||{})[x.id],lv=petLv(x.id);return`<div class="row ${eq?'eq':''}"><div class="ic">${icH('p_'+x.id+'_0',x.ic)}</div><div><b>${x.n}${own?` <span style="color:#ff5a8a;font-size:13px">💕Lv${lv} ${pl?(lv>=5?'MAX':`${pl.p%10}/10`):'0/10'}</span>`:''}</b><p>${x.d}</p></div>${own?`<button data-wact="petEq" data-id="${x.id}">${eq?'쉬게 하기':'데려가기'}</button>`:`<button data-wact="petBuy" data-id="${x.id}">🪙 ${x.price.toLocaleString()}</button>`}</div>`}).join('');
 const cat={rodskin:'rod',reelskin:'reel',boat:'boat'}[t],list=COS[cat];
 return list.map(x=>{const own=save.cos[cat][x.id],eq=save.wear[cat]===x.id;return`<div class="row ${eq?'eq':''}"><div class="ic">${icH('c_'+cat+'_'+x.id,{rod:'🎣',reel:'⚙️',boat:'🚤'}[cat])}</div><div><b>${x.n}</b><p>${x.d||''}</p></div>${own?`<button data-wact="cosEq" data-cat="${cat}" data-id="${x.id}" ${eq?'disabled':''}>${eq?'사용 중':'사용'}</button>`:x.price<0?'<button disabled>🔒</button>':`<button data-wact="cosBuy" data-cat="${cat}" data-id="${x.id}">🪙 ${x.price.toLocaleString()}</button>`}</div>`}).join('')}
function renderWardBar(){const b=$('wBar');
 if(WX.slot==='pre'){b.innerHTML=`<p>지금 입은 코디를 슬롯에 저장하고, 언제든 한 번에 갈아입을 수 있어요. (최대 5개)</p>`;return}
 if(!WX.sel){b.innerHTML=`<p>${WARD[WX.slot]||WX.slot==='set'?'카드를 누르면 바로 입어 보고, 지금 옷과 나란히 비교할 수 있어요.':'장식·펫·보트는 낚시터 화면에 바로 나타나요.'}</p>`;return}
 if(WX.slot==='set'){const st=WX.sel,own=setOwned(st),on=setOn(st),{c,lock}=setCost(st),parts=Object.entries(st.w).map(([k,v])=>WGET(k,v).n).join(' · ');
  b.innerHTML=`<div><b>${st.n}</b> <span class="tag" style="background:${RCOL[setRar(st)]}">${st.th}</span><p>${parts}</p></div>`+(on?'<button disabled>착용 중</button>':own?`<button class="big" data-wact="setWear">세트 입기</button>`:lock?'<button disabled>🔒 보스 보상 필요</button>':`<button class="big" data-wact="setBuy">🪙 ${c.toLocaleString()} 세트 구매</button>`);return}
 const it=WX.sel,own=owns(WX.slot,it),eq=save.ward.wear[WX.slot]===it.id;
 b.innerHTML=`<div><b>${it.n}</b> <span class="tag" style="background:${RCOL[it.r]}">${RNAME[it.r]}</span><p>${it.d||''}</p></div>`+(eq?'<button disabled>착용 중</button>':own?`<button class="big" data-wact="wear">입기</button>`:it.price<0?'<button disabled>🔒 보스 보상</button>':`<button class="big" data-wact="buy">🪙 ${it.price.toLocaleString()} 구매</button>`)}
$('wTabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;WX.slot=b.dataset.ws;WX.sel=null;WX.cmp=false;renderWard()};
$('wGrid').onclick=e=>{if(e.target.closest('button[data-wact]')){wardAct(e);return}const c0=e.target.closest('.wcard');if(!c0)return;const id=c0.dataset.wi;
 if(WX.slot==='set')WX.sel=WSETS.find(x=>x.id===id);else if(WX.slot==='pre'){const i=+id.slice(1);WX.sel=save.ward.pre[i]?{id,w:save.ward.pre[i]}:null}else WX.sel=WARD[WX.slot].find(x=>x.id===id);
 WX.cmp=!!WX.sel&&wearKey(tryWear())!==wearKey(save.ward.wear);WX.fx=.6;renderWard();SFX.click()};
$('wBar').onclick=wardAct;
function wardAct(e){const b=e.target.closest('button[data-wact]');if(!b||b.disabled)return;const a=b.dataset.wact,id=b.dataset.id;let ok=true;const pay=pr=>save.gold>=pr?(save.gold-=pr,spend(pr),true):(ok=false);
 if(a==='buy'){const it=WX.sel;if(it.price>=0&&pay(it.price)){save.ward.own[WX.slot+':'+it.id]=1;wearIt(it);SFX.upgrade();toast('구매 완료! 바로 입었어요 ✨',1000)}}
 else if(a==='wear'){wearIt(WX.sel);SFX.click()}
 else if(a==='setBuy'){const st=WX.sel,{c,lock}=setCost(st);if(!lock&&pay(c)){for(const k in st.w){const it=WGET(k,st.w[k]);if(it.price>0)save.ward.own[k+':'+it.id]=1}wearSet(st);SFX.upgrade();toast(`${st.n} 세트 구매! ✨`,1100)}}
 else if(a==='setWear'){wearSet(WX.sel);SFX.click()}
 else if(a==='preSave'){save.ward.pre[+id]=Object.assign({},save.ward.wear);toast(`코디 ${+id+1}에 저장했어요`,800);SFX.click()}
 else if(a==='preLoad'){const p=save.ward.pre[+id];if(p){const w=Object.assign({},save.ward.wear,p);let miss=0;for(const k in w){const it=WGET(k,w[k]);if(WARD[k]&&it&&!owns(k,it)){w[k]=fresh().ward.wear[k];miss++}}save.ward.wear=w;WX.fx=.8;WX.anim='win';WX.at=0;toast(miss?`코디를 입었어요 (없는 옷 ${miss}개는 기본으로)`:'코디를 입었어요 ✨',1000);SFX.upgrade()}}
 else if(a==='preDel'){save.ward.pre[+id]=null}
 else if(a==='togDeco')save.decoOn[id]=save.decoOn[id]?0:1;
 else if(a==='buyDeco'){const x=DECOS.find(y=>y.id===id);if(pay(x.price)){save.deco[id]=1;save.decoOn[id]=1;SFX.coin()}}
 else if(a==='petBuy'){const x=PETS.find(y=>y.id===id);if(pay(x.price)){save.pets[id]=1;save.pet=id;SFX.coin()}}
 else if(a==='petEq')save.pet=save.pet===id?'':id;
 else if(a==='cosBuy'){const cat=b.dataset.cat,x=COS[cat].find(y=>y.id===id);if(x.price>=0&&pay(x.price)){save.cos[cat][id]=1;save.wear[cat]=id;SFX.coin()}}
 else if(a==='cosEq'){const cat=b.dataset.cat;if(save.cos[cat][id])save.wear[cat]=id}
 if(!ok){toast('골드가 부족해요',700);return}persist();hud();renderWard()}
function wearIt(it){save.ward.wear[WX.slot]=it.id;if(['top','bottom'].includes(WX.slot))save.ward.wear.costume='none';WX.cmp=false;WX.at=0;WX.anim='win';WX.fx=.9}
function wearSet(st){if(!st.w.costume)save.ward.wear.costume='none';Object.assign(save.ward.wear,st.w);WX.cmp=false;WX.at=0;WX.anim='win';WX.fx=.9}
document.querySelector('#ward .wctl').onclick=e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.wa;if(a==='rot')WX.spin=!WX.spin;else if(a==='cmp'){WX.cmp=!WX.cmp}else{WX.anim=a;WX.at=0}document.querySelectorAll('#ward .wctl button').forEach(x=>x.classList.toggle('on',x.dataset.wa===WX.anim||(x.dataset.wa==='rot'&&WX.spin)||(x.dataset.wa==='cmp'&&WX.cmp)))};
let wDrag=null;$('wc').addEventListener('pointerdown',e=>{wDrag=e.clientX;WX.spin=false});$('wc').addEventListener('pointermove',e=>{if(wDrag!=null){WX.rot+=(e.clientX-wDrag)*.02;wDrag=e.clientX}});addEventListener('pointerup',()=>{wDrag=null});
// 카드 미리보기: 부위에 맞춰 확대
const WZOOM={hat:[.0,.0,1,.55],acc:[.0,.1,1,.7],shoes:[.0,.6,1,1],gloves:[.0,.3,1,.85],bag:[.0,.2,1,.8],bottom:[0,.45,1,1]};
function drawWardIcons(){document.querySelectorAll('#wGrid canvas[data-wic]').forEach(c=>{const g=c.getContext('2d'),id=c.dataset.wic;let w=Object.assign({},save.ward.wear),z=null,pose='idle';
 if(WX.slot==='set'){const st=WSETS.find(x=>x.id===id),oi=OPI[id];if(oi&&oi.naturalWidth){g.clearRect(0,0,132,132);const bg=g.createRadialGradient(66,60,10,66,66,80);bg.addColorStop(0,'#3a4466');bg.addColorStop(1,'#1e2440');g.fillStyle=bg;g.fillRect(0,0,132,132);g.imageSmoothingEnabled=false;const k=Math.min(124/oi.naturalHeight,128/oi.naturalWidth);g.drawImage(oi,66-oi.naturalWidth*k/2,128-oi.naturalHeight*k,oi.naturalWidth*k,oi.naturalHeight*k);return}if(!st.w.costume)w.costume='none';Object.assign(w,st.w)}
 else if(WX.slot==='pre'){const p=save.ward.pre[+id.slice(1)];if(!p){g.clearRect(0,0,132,132);g.fillStyle='#f2ece2';g.fillRect(0,0,132,132);g.fillStyle='#c8b8a0';g.font='44px sans-serif';g.textAlign='center';g.fillText('+',66,80);return}Object.assign(w,p)}
 else{w[WX.slot]=id;if(['top','bottom'].includes(WX.slot))w.costume='none';z=WZOOM[WX.slot];if(WX.slot==='bag')pose='walk'}
 g.clearRect(0,0,132,132);const bg=g.createRadialGradient(66,60,10,66,66,80);bg.addColorStop(0,'#fff');bg.addColorStop(1,'#e6f0f6');g.fillStyle=bg;g.fillRect(0,0,132,132);
 g.save();if(z){const zh=z[3]-z[1],k=Math.min(2.2,1/zh);g.translate(66,66);g.scale(k,k);g.translate(-66,-(z[1]+zh/2)*124-6)}drawWearAt(g,pose,66,126,112,w);g.restore()})}
function drawWard(t,dt){if(!$('ward').classList.contains('on'))return;const c=$('wc'),r=c.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);if(!w||!h)return;if(c.width!==w*DPR){c.width=w*DPR;c.height=h*DPR}const g=c.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);
 const bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#ffe8c8');bg.addColorStop(1,'#ffc9a0');g.fillStyle=bg;g.fillRect(0,0,w,h);
 g.save();g.globalAlpha=.25;g.fillStyle='#fff';g.beginPath();g.moveTo(w*.35,0);g.lineTo(w*.65,0);g.lineTo(w*.8,h);g.lineTo(w*.2,h);g.fill();g.restore();
 for(let i=0;i<10;i++){g.fillStyle='rgba(255,255,255,.6)';star5(g,(i*97+t*20)%w,(i*53)%h,3+Math.sin(t*3+i)*1.5)}
 WX.at+=dt;WX.fx=Math.max(0,WX.fx-dt);const A=WX.anim,k=WX.at;let pose='idle',dy=0,sq=0;
 const seq=(arr,per)=>arr[Math.floor(k/per)%arr.length];
 if(A==='idle'){pose=seq(['idle','idle','wink'],1.3);dy=Math.sin(k*3)*1.5}
 else if(A==='walk'){pose='walk';dy=-Math.abs(Math.sin(k*7))*5;sq=Math.sin(k*14)*.015}
 else if(A==='run'){pose='run';dy=-Math.abs(Math.sin(k*10))*9;sq=Math.sin(k*20)*.02}
 else if(A==='jump'){const u=(k%1.3)/1.3;pose=u<.15||u>.85?'idle':'jump';dy=-Math.max(0,Math.sin(Math.min(1,Math.max(0,(u-.12)/.76))*Math.PI))*h*.16;sq=u<.15?.06:u>.88?.05:0}
 else if(A==='cast')pose=seq(['prep','castready','cast','wait'],.65);
 else if(A==='reel'){pose=seq(['reel','fight'],.8);dy=pose==='fight'?Math.sin(k*30)*1:0}
 else if(A==='win'){pose=seq(['success','lift','happy'],.9);if(k>2.7&&!WX.loop)WX.anim='idle'}
 else if(A==='rest')pose=seq(['rest','sit'],1.6);
 if(WX.spin)WX.rot+=dt*1.6;const cs=Math.cos(WX.rot),sx=(cs>=0?1:-1)*Math.max(.12,Math.abs(cs));
 const H0=Math.min(h*.72,w*(WX.cmp&&WX.sel?.48:.85)),wear=tryWear(),fy=h*.86;
 const one=(x,wr,label,fxk)=>{g.fillStyle='rgba(120,70,40,.25)';g.beginPath();g.ellipse(x,fy-2,H0*.28*(1+dy/120),H0*.04,0,0,7);g.fill();
  g.save();g.translate(x,fy);g.scale(sx*(1+sq),1-sq);g.translate(-x,-fy);drawWearAt(g,pose,x,fy+dy,H0,wr);g.restore();
  if(fxk>0){const u=1-fxk/.9;g.save();g.globalAlpha=Math.min(1,fxk*1.6);for(let i=0;i<14;i++){const a=i/14*Math.PI*2+u*3,rr=H0*(.15+u*.45);g.fillStyle=i%2?'#fff6b0':'#ffffff';star5(g,x+Math.cos(a)*rr,fy-H0*.5+Math.sin(a)*rr*.8,3+3*(1-u))}g.globalAlpha=fxk*.5;const gr=g.createRadialGradient(x,fy-H0*.5,0,x,fy-H0*.5,H0*.6);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(x-H0,fy-H0*1.2,H0*2,H0*1.3);g.restore()}
  if(label){g.font=`15px ${FONT}`;g.textAlign='center';g.fillStyle='#7a4a2a';g.fillText(label,x,h*.08+10);g.textAlign='left'}};
 if(WX.cmp&&WX.sel){one(w*.27,save.ward.wear,'지금 착용',0);one(w*.73,wear,'미리보기 ✨',WX.fx)}else one(w*.5,wear,WX.sel?'미리보기':'',WX.fx)
 const oi=!WX.cmp&&WX.slot==='set'&&WX.sel&&OPI[WX.sel.id];if(oi&&oi.naturalWidth){const bh=Math.min(h*.5,130),k=bh/oi.naturalHeight,bw=oi.naturalWidth*k,bx=w-bw-14,by=h*.12;g.fillStyle='rgba(30,36,64,.85)';g.beginPath();g.roundRect(bx-6,by,bw+12,bh+22,10);g.fill();g.imageSmoothingEnabled=false;g.drawImage(oi,bx,by+4,bw,bh);g.imageSmoothingEnabled=true;g.fillStyle='#ffe9a8';g.font=`11px ${FONT}`;g.textAlign='center';g.fillText('세트 일러스트',bx+bw/2,by+bh+17);g.textAlign='left'}}

/* ================= 3.0 장비 상점(능력치 비교·강화·시험 낚시) ================= */
const GLIST={rod:RODS,reel:REELS,line:LINES},GPRE={rod:'r',reel:'e',line:'l'};
const GSTAT={rod:[['dist','캐스팅 거리','m','던질 수 있는 최대 거리 · 45m부터 먼바다 어종'],['pow','제압력','','물고기 체력을 깎는 힘'],['stab','장력 안정성','','감을 때 장력이 덜 올라감'],['crit','크리티컬 보너스','%','크리티컬·약점 공격 피해 ↑'],['big','대형어 대응','%','힘 4 이상·초대형에게 추가 피해']],
 reel:[['spd','회수 속도','m/s','초당 끌어오는 거리 = 제압 속도'],['eff','손맛 구간','%','초록 칸 폭(넓을수록 쉬움)'],['tred','장력 증가 감소','%','감을 때 장력 상승 ↓'],['fat','지친 물고기 보너스','%','체력 30% 이하일 때 회수 ↑'],['crx','크리티컬 추가','%','크리티컬 피해 추가']],
 line:[['max','최대 장력','kg','이보다 힘센 물고기는 장력이 빨리 오름'],['grace','끊김 버팀','초','빨간 칸에서 버티는 시간'],['sres','돌진 대응','%','저항·돌진·점프 때 장력 상승 ↓'],['rec','장력 회복','/초','손을 떼면 장력이 내려가는 속도'],['big','대형어 대응','%','대형 어종 추가 피해']]};
const TESTF=['goby','mackerel','gamseong','chamdom','tuna','marlin'];
let gsel={rod:null,reel:null,line:null};
function gearHTML(cat){const L=GLIST[cat],cur=save.gear[cat],sel=gsel[cat]||cur,it=L.find(x=>x.id===sel),hyp=Object.assign({},save.gear,{[cat]:it.id}),A=GS(),B=GS(hyp),own=!!save.gown[it.id],eq=cur===it.id,lv=save.enh[it.id]||0,tier=+it.id.slice(1);
 const rows=GSTAT[cat].map(([k,n,u,dsc])=>{const a=A[k],b=B[k],d=+(b-a).toFixed(2),mx={dist:80,pow:200,stab:165,crit:30,big:85,spd:2.5,eff:45,tred:40,fat:60,crx:35,max:45,grace:1.2,sres:50,rec:95}[k];return`<div class="st"><span>${n}<small>${dsc}</small></span><div class="sb"><i style="width:${Math.min(100,a/mx*100)}%"></i><i class="nw" style="width:${Math.min(100,b/mx*100)}%"></i></div><b>${a}${u}${d?` → <em class="${d>0?'up':'dn'}">${b}${u} (${d>0?'+':''}${d})</em>`:''}</b></div>`}).join('');
 const F1=FID[TESTF[tier]],Fs=FID.mackerel,Fb=FID.tuna,ta=estTime(A,Fs),tb=estTime(B,Fs),ba=snapRisk(A,Fb),bb=snapRisk(B,Fb);
 const tt=G=>snapRisk(G,Fb)==='매우 위험'?'끊김 거의 확실':estTime(G,Fb).toFixed(1)+'초';const eff=`<div class="eff">🐟 고등어 예상 제압 <b>${ta.toFixed(1)}초 → ${tb.toFixed(1)}초</b>${tb<ta?` <em class="up">(${Math.round((1-tb/ta)*100)}% 빨라짐)</em>`:''} <small>(능숙하게 조작했을 때, 실측 ±40%)</small><br>🐋 참다랑어(대형) 줄 위험도 <b>${ba} → ${bb}</b> · 제압 ${tt(A)} → ${tt(B)}${cat==='rod'?`<br>🏹 최대 캐스팅 ${A.dist}m → ${B.dist}m`:''}<br>⭐ 추천 어종: ${cat==='rod'?it.rec:locSafeFish(B).slice(0,3).map(f=>f.n).join('·')} · 추천 낚시터: ${cat==='rod'?it.rl:LOCS.filter(l=>save.lv>=l.lv).slice(-2).map(l=>l.n.split(' ').pop()).join('·')}</div>`;
 let btns='';if(!own)btns=`<button class="big" data-act="gBuy" data-id="${it.id}" data-cat="${cat}" ${save.gold<it.price?'disabled':''}>구매 🪙${it.price.toLocaleString()}</button>`;else{btns=eq?'<button disabled>장착 중</button>':`<button class="big alt" data-act="gEq" data-id="${it.id}" data-cat="${cat}">장착</button>`;btns+=lv<ENH_MAX?`<button data-act="gEnh" data-id="${it.id}" ${save.gold<enhCost(it,lv)?'disabled':''}>강화 +${lv+1} 🪙${enhCost(it,lv).toLocaleString()}</button>`:'<button disabled>강화 최고</button>'}
 btns+=`<button data-act="gTest" data-id="${it.id}" data-cat="${cat}">🎯 시험 낚시 (${F1.n})</button>`;
 return`<div class="gdet"><div class="gh"><canvas width="220" height="80" id="gIcon"></canvas><div><b style="font-size:20px">${it.n}${lv?` +${lv}`:''}</b> <span class="tag" style="background:${RAR[it.r].c}">${['','일반','고급','희귀','영웅','전설'][it.r]}</span><p>${eq?'✅ 장착 중':own?'보유 중':'미보유'} · 강화 ${lv}/${ENH_MAX} (단계당 주요 능력 +4%)</p></div></div>${rows}${eff}<div class="gbtn">${btns}</div></div>`+
 L.map(x=>{const o=!!save.gown[x.id],e=cur===x.id;return`<div class="row ${e?'eq':''} ${x.id===sel?'sel':''}" data-gsel="${x.id}" data-cat="${cat}"><div class="ic">${icH('g_'+x.id,{rod:'🎣',reel:'⚙️',line:'🧵'}[cat])}</div><div><b>${x.n}${save.enh[x.id]?' +'+save.enh[x.id]:''}</b><p>${cat==='rod'?`${x.dist}m · 제압 ${x.pow} · 안정 ${x.stab}`:cat==='reel'?`${x.spd}m/s · 장력 -${x.tred}%`:`최대 ${x.max}kg · 버팀 ${x.grace}초`}</p></div><span>${e?'장착':o?'보유':'🪙'+x.price.toLocaleString()}</span></div>`}).join('')}
function locSafeFish(gs){return FISH.filter(f=>f.r>=2&&f.r<=5&&!f.boss&&!f.hid&&fishPull({...f,kgv:kgOf(f,(f.min+f.max)/2)})<=gs.max).sort((a,b)=>b.r-a.r||b.p-a.p)}
function drawGearIcon(){const c=$('gIcon');if(!c)return;const g=c.getContext('2d'),cat=sheet.tab,it=GLIST[cat]&&GLIST[cat].find(x=>x.id===(gsel[cat]||save.gear[cat]));if(!it)return;g.clearRect(0,0,220,80);if(ipOk('g_'+it.id)){const sl=+it.id.slice(1);if(cat==='rod'){g.save();g.translate(110,40);g.rotate(Math.PI/4);ipDraw(g,'g_'+it.id,0,0,150,.5,.5);g.restore()}else ipDraw(g,'g_'+it.id,110,78,76,.5,1);if(sl>=4){g.fillStyle='rgba(255,230,120,.8)';for(let i=0;i<5;i++){g.beginPath();g.arc(30+i*40,12+(i%2)*56,2,0,7);g.fill()}}return}const tier=+it.id.slice(1);
 if(cat==='rod'){const v=RODV[tier];g.lineCap='round';g.strokeStyle=OL;g.lineWidth=v.w*2+3;g.beginPath();g.moveTo(10,70);g.quadraticCurveTo(110,30,210,12-tier*1.5);g.stroke();g.strokeStyle=v.col;g.lineWidth=v.w*2;g.stroke();g.strokeStyle=v.grip;g.lineWidth=v.w*4;g.beginPath();g.moveTo(10,70);g.lineTo(45,58);g.stroke();for(let i=1;i<=v.rings;i++){const k=.25+i/(v.rings+1)*.75,x=lerp(10,210,k),y=lerp(70,12,k)+Math.sin(k*Math.PI)*-8;g.strokeStyle='#c0c8d0';g.lineWidth=1.5;g.beginPath();g.arc(x,y+5,2.5,0,7);g.stroke()}if(v.glow){g.fillStyle=v.glow;g.beginPath();g.arc(210,12-tier*1.5,8,0,7);g.fill()}}
 else if(cat==='reel'){const v=REELV[tier],r=v.r*500;g.fillStyle=v.col;g.strokeStyle=OL;g.lineWidth=2;g.beginPath();g.arc(110,40,r,0,7);g.fill();g.stroke();g.fillStyle=v.sp;g.beginPath();g.arc(110,40,r*.6,0,7);g.fill();const a=performance.now()/1000*4;g.beginPath();g.moveTo(110,40);g.lineTo(110+Math.cos(a)*r*1.3,40+Math.sin(a)*r*1.3);g.lineWidth=3;g.stroke()}
 else{const v=LINEV[tier];g.strokeStyle=v.c;g.lineWidth=v.w*2;if(v.glow){g.shadowColor=v.glow;g.shadowBlur=8}g.beginPath();for(let x=10;x<=210;x+=4)g.lineTo(x,40+Math.sin(x*.05+performance.now()/400)*14);g.stroke();g.shadowBlur=0}}
function startPractice(cat,id){const F=FID[TESTF[+id.slice(1)]],hyp=Object.assign({},save.gear,{[cat]:id}),own=save.gown[id];const before=estTime(GS(),{...F,kgv:kgOf(F,(F.min+F.max)/2)});if(own)save.gear[cat]=id;const after=estTime(GS(),{...F,kgv:kgOf(F,(F.min+F.max)/2)});
 if(!own){practice={id:F.id,before,after,tmpGear:Object.assign({},save.gear),cat,want:id};save.gear[cat]=id}else practice={id:F.id,before,after};
 window.__practiceF=F.id;closeSheet();go('ready');notice(`🎯 시험 낚시! ${F.n}를 상대로 던져 보세요 (보상 없음)`)}

/* ================= 3.0 수족관 ================= */
const AQX={tab:'show',fish:[],food:[]};
function openAq(){if(['fight','bite','hook','land'].includes(S)){toast('낚시 중엔 열 수 없어요',900);return}if(S==='charge')S='ready';$('aq').classList.add('on');aqSync();renderAq()}
function closeAq(){$('aq').classList.remove('on');persist();hud()}
$('aqClose').onclick=closeAq;
const aqCap=()=>AQ_CAP[save.aq.cap];
function aqRate(){return Math.round(save.aq.slots.reduce((a,id)=>a+GOLD_BASE[FID[id].r]*.25,0))}
function aqBank(){const a=save.aq;if(!a.slots.length||!a.last)return 0;const now=Date.now(),hrs=Math.min(6,(now-a.last)/3600000);let bon=0;if(a.fedUntil){bon=Math.max(0,Math.min(now,a.fedUntil)-Math.max(a.last,a.fedAt||0))/3600000;bon=Math.min(bon,hrs)}return Math.floor(aqRate()*(hrs+bon*.5))}
const AQ_BOTTOM=['crab','octo','flat','isopod','star','urchin','clam','catfish','sturgeon','nudi','ray','angler','blob','boot','can','bottle','box','chest','weed'];
function aqFeed(){const a=save.aq,r=$('aqc').getBoundingClientRect();if(!a.slots.length){toast('먼저 물고기를 전시해 주세요',800);return}for(let i=0;i<9;i++)AQX.food.push({x:r.width*(.2+Math.random()*.6),y:-rnd(0,40),vy:rnd(18,30),s:Math.random()*6,life:14});SFX.splash&&SFX.splash(.12);
 const now=Date.now(),cd=30*60000;if(!a.fedAt||now-a.fedAt>=cd){a.fedAt=now;a.fedUntil=now+2*3600000;save.st.feed=(save.st.feed||0)+1;toast('🍤 냠냠! 2시간 동안 관람료 ×1.5',1100)}else toast(`🍤 냠냠 · 보너스는 ${Math.ceil((cd-(now-a.fedAt))/60000)}분 뒤에 다시`,1100);persist();renderAq()}
function aqSync(){const r=$('aqc').getBoundingClientRect();AQX.fish=save.aq.slots.map((id,i)=>{const f=FID[id],old=AQX.fish.find(a=>a.id===id);return old||{id,f:{...f,size:(f.min+f.max)/2},x:Math.random()*r.width,y:r.height*(.2+Math.random()*.55),vx:(Math.random()<.5?-1:1)*rnd(18,40),seed:i*1.7,dir:1}})}
function renderAq(){const a=save.aq,cap=aqCap(),T0=AQX.tab;$('aqGold').textContent='🪙 '+save.gold.toLocaleString();
 const fed=a.fedUntil&&Date.now()<a.fedUntil;$('aqInfo').innerHTML=`전시 ${a.slots.length}/${cap} · 관람료 ${aqRate()}/시간${fed?' <span style="color:#e86a2a">×1.5</span>':''} · 쌓인 관람료 <b>🪙${aqBank()}</b> <button data-aq="claim" ${aqBank()<1?'disabled':''}>받기</button> <button data-aq="feed">🍤 먹이</button>`;
 $('aqTabs').innerHTML=[['show','전시'],['theme','테마'],['deco','장식'],['exp','확장'],['rew','보상']].map(([id,n])=>`<button data-aqt="${id}" class="${T0===id?'on':''}">${n}</button>`).join('');
 let h='';const own=FISH.filter(f=>save.dex[f.id]&&f.r>0&&!['chest'].includes(f.k));
 if(T0==='show')h=`<p class="aqp">물고기를 눌러 전시하거나 빼요. 전설 이상은 특별 전시대에 올라가요.</p><div class="aqg">`+(own.length?own.map(f=>`<button data-aq="tog" data-id="${f.id}" class="${a.slots.includes(f.id)?'on':''}" style="border-color:${RAR[f.r].c}">${a.slots.includes(f.id)?'✅ ':''}${f.n}</button>`).join(''):'<p>아직 잡은 물고기가 없어요</p>')+'</div>';
 else if(T0==='theme')h=AQ_THEMES.map(x=>{const o=a.themes[x.id],e=a.theme===x.id;return`<div class="row ${e?'eq':''}"><div class="ic" style="background:${IPX['aqbg_'+x.id]?`url(${IPX['aqbg_'+x.id]}) center/cover`:`linear-gradient(${x.top},${x.bot})`};border-radius:10px"></div><div><b>${x.n}</b></div>${o?`<button data-aq="theme" data-id="${x.id}" ${e?'disabled':''}>${e?'사용 중':'사용'}</button>`:`<button data-aq="buyTheme" data-id="${x.id}" ${save.gold<x.price?'disabled':''}>🪙${x.price.toLocaleString()}</button>`}</div>`}).join('');
 else if(T0==='deco')h=`<p class="aqp">산 장식은 언제든 빼거나 다시 설치할 수 있어요.</p>`+AQ_DECOS.map(x=>{const o=a.decos[x.id],on=o&&!a.decoOff[x.id];return`<div class="row ${on?'eq':''}"><div class="ic">${icH('aq_'+x.id,x.ic)}</div><div><b>${x.n}</b><p>${o?(on?'설치됨':'보관 중'):''}</p></div>${o?`<button data-aq="togDeco" data-id="${x.id}">${on?'빼기':'설치'}</button>`:`<button data-aq="buyDeco" data-id="${x.id}" ${save.gold<x.price?'disabled':''}>🪙${x.price.toLocaleString()}</button>`}</div>`}).join('');
 else if(T0==='exp'){const n=a.cap+1;h=`<p class="aqp">지금 ${cap}칸 · 수조가 넓어지면 더 많은 친구를 전시하고 관람료도 늘어요.</p>`+(n<AQ_CAP.length?`<div class="row"><div class="ic">🏗️</div><div><b>${AQ_CAP[n]}칸으로 확장</b></div><button data-aq="exp" ${save.gold<AQ_CAPP[n]?'disabled':''}>🪙${AQ_CAPP[n].toLocaleString()}</button></div>`:'<p>최대 크기예요!</p>')}
 else{h=AQ_CAP.map((c,i)=>{const done=a.cap>=i&&a.slots.length>=c,cl=a.full[i];return`<div class="row ${cl?'eq':''}"><div class="ic">${cl?'✅':done?'🎁':'🐠'}</div><div><b>${c}칸 수조 가득 채우기</b><p>🪙${AQ_FULL[i].toLocaleString()}</p></div><button data-aq="full" data-i="${i}" ${!done||cl?'disabled':''}>${cl?'완료':'받기'}</button></div>`}).join('');const r5=a.slots.filter(id=>FID[id].r>=5).length;h+=`<div class="row ${a.rare5?'eq':''}"><div class="ic">🏆</div><div><b>전설 이상 3종 특별 전시</b><p>${r5}/3 · 🪙5,000 + 칭호 「수족관 관장」</p></div><button data-aq="r5" ${r5<3||a.rare5?'disabled':''}>${a.rare5?'완료':'받기'}</button></div>`}
 $('aqBody').innerHTML=h}
$('aq').addEventListener('click',e=>{const tb=e.target.closest('[data-aqt]');if(tb){AQX.tab=tb.dataset.aqt;renderAq();return}const b=e.target.closest('button[data-aq]');if(!b||b.disabled)return;const a=save.aq,k=b.dataset.aq,id=b.dataset.id;let ok=true;const pay=p=>save.gold>=p?(save.gold-=p,spend(p),true):(ok=false);
 if(k==='tog'){const i=a.slots.indexOf(id);if(i>=0)a.slots.splice(i,1);else if(a.slots.length<aqCap()){if(!a.slots.length||!a.last)a.last=Date.now();a.slots.push(id);SFX.splash(.15)}else toast('수조가 가득 찼어요 · 확장해 보세요',900);aqSync()}
 else if(k==='feed'){aqFeed();return}
 else if(k==='claim'){const g0=aqBank();save.gold+=g0;a.last=Date.now();SFX.coin();toast('관람료 🪙'+g0,900)}
 else if(k==='theme')a.theme=id;
 else if(k==='buyTheme'){const x=AQ_THEMES.find(y=>y.id===id);if(pay(x.price)){a.themes[id]=1;a.theme=id;SFX.coin()}}
 else if(k==='buyDeco'){const x=AQ_DECOS.find(y=>y.id===id);if(pay(x.price)){a.decos[id]=1;delete a.decoOff[id];SFX.coin()}}
 else if(k==='togDeco'){if(a.decos[id]){if(a.decoOff[id])delete a.decoOff[id];else a.decoOff[id]=1;SFX.click&&SFX.click()}}
 else if(k==='exp'){const n=a.cap+1;if(n<AQ_CAP.length&&pay(AQ_CAPP[n])){a.cap=n;SFX.upgrade();toast(`수조 확장! ${AQ_CAP[n]}칸`,900)}}
 else if(k==='full'){const i=+b.dataset.i;if(a.cap>=i&&a.slots.length>=AQ_CAP[i]&&!a.full[i]){a.full[i]=1;save.gold+=AQ_FULL[i];SFX.mission();toast('수족관 완성 보상 🪙'+AQ_FULL[i].toLocaleString(),1000)}}
 else if(k==='r5'){if(a.slots.filter(x=>FID[x].r>=5).length>=3&&!a.rare5){a.rare5=1;save.gold+=5000;save.titles['수족관 관장']=1;SFX.mission();toast('특별 전시 보상! 칭호 「수족관 관장」',1200)}}
 if(!ok){toast('골드가 부족해요',700);return}persist();hud();renderAq()});
function drawAq(t,dt){if(!$('aq').classList.contains('on'))return;const c=$('aqc'),r=c.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);if(c.width!==w*DPR){c.width=w*DPR;c.height=h*DPR}const g=c.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);
 const th=AQ_THEMES.find(x=>x.id===save.aq.theme)||AQ_THEMES[0],BGI='aqbg_'+th.id,useI=ipOk(BGI);if(useI){const im=IPI[BGI],sc=Math.max(w/im.naturalWidth,h/im.naturalHeight);g.drawImage(im,(w-im.naturalWidth*sc)/2,(h-im.naturalHeight*sc)/2,im.naturalWidth*sc,im.naturalHeight*sc)}else{const bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,th.top);bg.addColorStop(1,th.bot);g.fillStyle=bg;g.fillRect(0,0,w,h)}
 g.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<4;i++){const x=((i*w*.3+t*12)%(w+100))-50;g.beginPath();g.moveTo(x,0);g.lineTo(x+40,0);g.lineTo(x-20,h);g.lineTo(x-70,h);g.fill()}
 if(!useI){const sand=th.id==='cave'?'#2a2a3a':th.id==='moon'?'#3a3070':'#f2e0b0';g.fillStyle=sand;g.beginPath();g.moveTo(0,h);g.lineTo(0,h*.88);for(let x=0;x<=w;x+=20)g.lineTo(x,h*.88+Math.sin(x*.04)*5);g.lineTo(w,h);g.fill()}
 const D={};for(const k in save.aq.decos)if(!save.aq.decoOff[k])D[k]=1;const by=h*.9;
 if(ipOk('aq_plant')){const hh=h;
  if(D.ship)ipDraw(g,'aq_ship',w*.8,by+4,hh*.3,.5,1);
  if(D.castle)ipDraw(g,'aq_castle',w*.18,by+4,hh*.28,.5,1);
  if(D.coral){ipDraw(g,'aq_coral',w*.36,by+6,hh*.22,.5,1)}
  if(D.chest)ipDraw(g,'aq_chest',w*.58,by+6,hh*.17,.5,1);
  if(D.plant){for(const[px,ph,fl]of[[w*.05,.34,0],[w*.95,.3,1],[w*.66,.2,0]]){g.save();g.translate(px,by+6);g.transform(1,0,Math.sin(t*1.2+px)*.06,1,0,0);ipDraw(g,'aq_plant',0,0,hh*ph,.5,1,fl);g.restore()}}
  if(D.bubbler){ipDraw(g,'aq_bubbler',w*.45,by+6,hh*.2,.5,1);for(let i=0;i<10;i++){const y=by-hh*.18-((t*60+i*37)%(h*.7));g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1.5;g.beginPath();g.arc(w*.45+Math.sin(t*3+i)*6,y,3+i%3,0,7);g.stroke()}}
 }else{
 if(D.plant)for(let i=0;i<6;i++){const x=w*(.05+i*.17);g.strokeStyle=i%2?'#3fa66b':'#2f8a5a';g.lineWidth=5;g.lineCap='round';for(let k=-1;k<=1;k++){g.beginPath();g.moveTo(x+k*6,by);g.quadraticCurveTo(x+k*8+Math.sin(t*1.3+i+k)*10,by-40,x+k*10+Math.sin(t*1.3+i+k)*14,by-70-(k+1)*10);g.stroke()}}
 if(D.coral){const cols=['#ff7aa8','#ffb35c','#b07aff'];for(let i=0;i<3;i++){const x=w*(.3+i*.2);g.strokeStyle=cols[i];g.lineWidth=6;g.beginPath();g.moveTo(x,by);g.lineTo(x,by-25);g.lineTo(x-12,by-45);g.moveTo(x,by-25);g.lineTo(x+14,by-42);g.stroke()}}
 if(D.castle){const x=w*.18;g.fillStyle='#e8c88a';g.strokeStyle=OL;g.lineWidth=2;g.fillRect(x-30,by-50,60,50);g.strokeRect(x-30,by-50,60,50);for(const xx of[-30,15])g.fillRect(x+xx,by-70,15,20);g.fillStyle='#5a3a22';g.beginPath();g.arc(x,by-12,10,Math.PI,0);g.fill()}
 if(D.ship){const x=w*.78;g.save();g.translate(x,by-10);g.rotate(-.2);g.fillStyle='#6a4a2a';g.strokeStyle=OL;g.lineWidth=2;g.beginPath();g.moveTo(-60,0);g.lineTo(60,0);g.lineTo(45,25);g.lineTo(-45,25);g.closePath();g.fill();g.stroke();g.beginPath();g.moveTo(0,0);g.lineTo(0,-70);g.stroke();g.fillStyle='rgba(240,230,210,.6)';g.beginPath();g.moveTo(2,-65);g.lineTo(40,-30);g.lineTo(2,-20);g.fill();g.restore()}
 if(D.chest){drawCritter(g,FID.chest,w*.55,by-14,60,1,t,{seed:1})}
 if(D.bubbler){for(let i=0;i<10;i++){const y=by-((t*60+i*37)%(h*.85));g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1.5;g.beginPath();g.arc(w*.45+Math.sin(t*3+i)*6,y,3+i%3,0,7);g.stroke()}}
 }
 // 특별 전시대
 const sp=AQX.fish.filter(a=>a.f.r>=5);sp.forEach((a,i)=>{const px=w*(.25+i*.25);g.fillStyle='rgba(255,230,140,.18)';g.beginPath();g.moveTo(px-20,0);g.lineTo(px+20,0);g.lineTo(px+70,by);g.lineTo(px-70,by);g.fill();g.fillStyle='#d8c8a0';g.strokeStyle=OL;g.lineWidth=2;g.beginPath();g.roundRect(px-40,by-16,80,16,4);g.fill();g.stroke();g.font=`12px ${FONT}`;g.textAlign='center';g.fillStyle=OL;g.fillText(a.f.n,px,by-4);g.textAlign='left'});
 // 먹이
 AQX.food=AQX.food.filter(p=>{p.life-=dt;if(p.y<by-6){p.y+=p.vy*dt;p.x+=Math.sin(t*2+p.s)*.3}g.fillStyle='#e8904a';g.strokeStyle='#8a4a20';g.lineWidth=1;g.beginPath();g.arc(p.x,p.y,3,0,7);g.fill();g.stroke();return p.life>0&&!p.eaten});
 AQX.fish.forEach((a,i)=>{const special=a.f.r>=5;const L=Math.min(110,critL0(a.f)*.7);if(special){const k=sp.indexOf(a),px=w*(.25+k*.25);a.x+=(px+Math.sin(t*.6+i)*30-a.x)*dt*.8;a.y+=(by-60-L*.3+Math.sin(t+i)*8-a.y)*dt*.8;a.dir=Math.cos(t*.6+i)>0?1:-1}else{
  const bot=AQ_BOTTOM.includes(a.f.k),small=L<45,spd=(bot?14:small?46:Math.max(18,40-L*.15))*(a.f.r>=3?1.1:1);a.vy=a.vy||0;
  // 목표 정하기: 먹이 > 무리 > 배회
  let tx=a.tx,ty=a.ty,boost=1;const fd=AQX.food.filter(p=>!p.eaten).sort((p,q)=>Math.hypot(p.x-a.x,p.y-a.y)-Math.hypot(q.x-a.x,q.y-a.y))[0];
  if(fd&&(!bot||fd.y>by-40)){tx=fd.x;ty=fd.y;boost=1.8;if(Math.hypot(fd.x-a.x,fd.y-a.y)<10+L*.25){fd.eaten=1;a.joy=1;for(let k=0;k<3;k++)AQX.bub=(AQX.bub||[]),AQX.bub.push({x:a.x,y:a.y-6,r:2+k,l:1})}}
  else{a.wt=(a.wt||0)-dt;if(a.tx==null||a.wt<=0||Math.hypot(a.tx-a.x,a.ty-a.y)<14){a.wt=rnd(2.5,6);a.tx=rnd(30,w-30);a.ty=bot?by-8-rnd(0,14):rnd(h*.15,by-40-L*.2)}
   if(small){const mates=AQX.fish.filter(b=>b!==a&&b.f.r<5&&(b.id===a.id||Math.min(110,critL0(b.f)*.7)<45));if(mates.length){const mx=mates.reduce((s,b)=>s+b.x,0)/mates.length,my=mates.reduce((s,b)=>s+b.y,0)/mates.length;a.tx=a.tx*.6+mx*.4;a.ty=a.ty*.6+my*.4}}
   tx=a.tx;ty=a.ty}
  const dx=tx-a.x,dy=ty-a.y,d=Math.hypot(dx,dy)||1,ms=spd*boost;a.vx+=(dx/d*ms-a.vx)*Math.min(1,dt*1.4);a.vy+=(dy/d*ms*.6-a.vy)*Math.min(1,dt*1.4);
  // 서로 너무 붙지 않게
  for(const b of AQX.fish){if(b===a)continue;const ex=a.x-b.x,ey=a.y-b.y,dd=Math.hypot(ex,ey);if(dd>0&&dd<18){a.vx+=ex/dd*20*dt;a.vy+=ey/dd*20*dt}}
  a.x+=a.vx*dt;a.y+=a.vy*dt+Math.sin(t*1.5+a.seed)*.15;a.y=Math.max(h*.08,Math.min(by-6,a.y));a.x=Math.max(-20,Math.min(w+20,a.x));
  if(Math.abs(a.vx)>4)a.dir=a.vx>0?1:-1;a.joy=Math.max(0,(a.joy||0)-dt)}
  drawCritter(g,a.f,a.x,a.y,L,a.dir,t,{seed:a.seed,mood:a.joy>0?'happy':undefined})});
 if(AQX.bub){AQX.bub=AQX.bub.filter(b=>{b.l-=dt;b.y-=30*dt;g.strokeStyle=`rgba(255,255,255,${b.l})`;g.lineWidth=1.2;g.beginPath();g.arc(b.x,b.y,b.r,0,7);g.stroke();return b.l>0})}
 if(!AQX.fish.length){g.fillStyle='rgba(255,255,255,.85)';g.font=`18px ${FONT}`;g.textAlign='center';g.fillText('아래 목록에서 물고기를 전시해 보세요 🐠',w/2,h*.45);g.textAlign='left'}
 if(Math.floor(t*2)!==Math.floor((t-dt)*2)){const el=$('aqInfo').querySelector('b');if(el)el.textContent='🪙'+aqBank()}}
