/* ================= 입력 ================= */
const inGame=()=>!$('title').classList.contains('on')&&!$('result').classList.contains('on')&&!$('sheet').classList.contains('on');
const isBobberM=()=>save.method==='basic'||save.method==='float';
function tryMeteor(px,py){for(let i=0;i<meteors.length;i++){const m=meteors[i];if(Math.hypot(m.x-px,m.y-py)<56){meteors.splice(i,1);wishT=60;SFX.star();sparkle(px,py,30,['#fff6b0','#fff','#b0d8ff']);notice('🌠 소원을 빌었어요! 60초 동안 희귀·변종 확률 ↑');return true}}return false}
function down(px,py){if(!inGame())return;audio();idleT=0;if(S==='ready'&&petTap(px,py))return;
 if(px!=null&&meteors.length&&tryMeteor(px,py))return;
 if(S==='ready'||S==='rest'){go('charge');SFX.charge()}
 else if(S==='wait'){if(save.method==='lure'){twitch();return}
  toast('앗, 너무 일렀어요!');SFX.fail();if(app){app.flee=1;app.dir*=-1;crit.push(app);app=null}bob.on=false;comboBreak();hud();go('ready')}
 else if(S==='bite'){const extra=(save.method==='float'?.1:0)+(save.bob==='star'?.12:0)+(save.bob==='goldbob'?.15:0);fg.perfect=T<.26+extra;go('hook');SFX.hook();vib(40);
  if(fg.perfect){toast('퍼펙트 챔질! ✨');tone(1320,.15,'triangle',.12);save.st.perfect++;mission('perfect',1)}}
 else if(S==='fight'){holding=true;fg.pressAt=T;if(fg.clutch>0){clutchTap();return}if(fg.final>0){fg.mash++;SFX.twitch();sparkle(fg.fx,fg.fy,4);return}if(fg.boss)bossPress();hint()}
 else if(S==='fail'&&T>.45)go('ready')}
function up(){if(S==='charge')castOut();if(holding){holding=false;hint()}}
cv.addEventListener('pointerdown',e=>{e.preventDefault();down(e.clientX,e.clientY)});
addEventListener('pointerup',up);addEventListener('pointercancel',up);addEventListener('blur',up);
addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat){e.preventDefault();down()}});
addEventListener('keyup',e=>{if(e.code==='Space')up()});
cv.addEventListener('contextmenu',e=>e.preventDefault());

/* ================= 진행 ================= */
function go(s){S=s;T=0;hint()}
function hint(){if(S==='fight'&&fg&&fg.clutch>0){$('hint').textContent='손을 떼고, 링이 초록 원에 겹칠 때 탭!';return}const lure=save.method==='lure',m={ready:bossPending?'보스가 기다려요! 꾹 눌러 던지기':'화면을 꾹 눌러 힘 모으기',charge:save.method==='deep'?'힘만큼 깊이 내려가요':'떼면 던져요!',cast:'',wait:lure?'톡톡 탭해서 루어를 움직여요':save.method==='deep'?'바닥까지 내려가는 중…':isBobberM()?'물고기가 다가와요… 찌를 잘 보세요':'낚싯대 끝 방울 소리에 집중!',bite:'지금 탭!!',fight:holding?'감는 중! 빨간 칸이면 손 떼기':'꾹 눌러서 릴 감기',fail:'탭해서 다시',rest:'탭하면 일어나요 ♪'};$('hint').textContent=m[S]||''}
function castOut(){const g=G();bob.sx=g.cx+g.ch*.5;bob.tx=g.edge+30+(W-g.edge-56)*Math.max(.06,power);bob.on=false;bob.dx=0;
 usedGoldB=false;if(save.bait==='goldb'){if(save.goldB>0){save.goldB--;usedGoldB=true}else{save.bait='worm';notice('황금 미끼를 다 써서 지렁이로 바꿨어요')}persist();chips()}
 const gs0=GS();castM=Math.round(8+power*(gs0.dist-8));bob.tx=g.edge+30+(W-g.edge-56)*clamp(castM/78,.05,1);
 curDepth=save.method==='deep'?Math.round(50+power*250):0;
 go('cast');SFX.cast();toast(save.method==='deep'?`깊이 ${curDepth}m`:`${castM}m${castM>=45?' · 먼바다!':''}`,700);if(power>.92)tone(1046,.1,'triangle',.08)
 const rs=COS.rod.find(r=>r.id===save.wear.rod);fg={trail:rs&&rs.trail}}
function hookPoint(g){const m=save.method;if(m==='lure')return{x:bob.x,y:bob.y};if(m==='bottom'||m==='cast')return{x:bob.x,y:g.bed-26};if(m==='deep')return{x:bob.x,y:g.bed-30};return{x:bob.x,y:g.surf+38}}
function landBobber(){const g=G(),m=save.method;bob.on=true;bob.x=bob.tx;splash(bob.x,g.surf,12,150);ring(bob.x,g.surf+3,36);ring(bob.x,g.surf+3,60,'255,255,255',1.4);SFX.plop();
 if(m==='lure'){bob.y=g.surf+34}else if(m!=='basic'&&m!=='float'){bob.y=g.surf+6;bob.sink=1}
 const nearJump=jumpEv&&Math.abs(jumpEv.x-bob.x)<80,nearSchool=school&&Math.abs(school.x-bob.x)<90;
 if(nearJump)toast('명당이다! ✨',900);if(nearSchool)toast('물고기 떼 한가운데!',900);
 let catHelp=false;if(PET_ON('cat')&&Math.random()<.14){catHelp=true;setTimeout(()=>{SFX.meow();toast('냥! 물고기 발견 🐱',900)},500)}
 fish=rollFish(nearJump||catHelp);
 let bt=rnd(2.2,5.2)*(fever>0?.5:1)*(save.bait==='krill'?.7:1)*(catHelp?.5:1)*(PET_ON('penguin')&&save.loc==='ice'?.8:1);if(nearSchool)bt*=.45;if(nearJump)bt*=.7;if(fish.r>=4)bt+=.8;if(m==='deep')bt+=curDepth/90;if(m==='lure')bt*=.8;if(CH)bt*=.55;if(bossPending)bt=2.6;
 fg=Object.assign(fg,{bite:bt,cues:[],rare:fish.r>=4||fish.giant||!!fish.hid||!!fish.v,lprog:0,lastTw:-9});
 const bp=fish.bp,n=bp==='nibble'?3:bp==='slam'?1:2;for(let i=0;i<n;i++)fg.cues.push(bt*(bp==='slam'?.86:.62+i*.11));
 if(fish.r>0&&!['chest','clam'].includes(fish.k)){const dir=Math.random()<.5?1:-1,Lc=critL(fish),hp=hookPoint(g);app={f:fish,L:Lc,dir,x:dir>0?-Lc:W+Lc,sx:dir>0?-Lc:W+Lc,sy:m==='deep'?g.bed-30:clamp(hp.y+rnd(-60,60),g.surf+40,g.bed-30),seed:Math.random()*9}}else app=null;
 if(bossPending){bigText('BOSS 출현!',FID[bossPending].n,'#ff6a6a');SFX.boss();shake=10;flash=.6;flashCol='255,80,80'}
 go('wait')}
function twitch(){const g=G();if(bob.x<g.edge+30){toast('루어 회수',700);bob.on=false;if(app){app.flee=1;crit.push(app);app=null}go('ready');return}
 bob.x-=8;bob.y=clamp(bob.y+rnd(-12,12),g.surf+20,g.bed-30);fg.lastTw=T;SFX.twitch();ring(bob.x,bob.y,14,'200,240,255',.5);sparkle(bob.x,bob.y,3,['#bfefff'])}
function endPractice(){if(practice&&practice.tmpGear)save.gear=practice.tmpGear;practice=null}
function fail(msg,kind){if(practice){endPractice();toast('시험 낚시 실패 · '+msg,1600);go('fail');bob.on=false;app=null;fish=null;return}comboBreak();go('fail');toast(msg);SFX.fail();bob.on=false;if(kind==='snap'){save.st.snaps++;SFX.snap();vib([60,40,60])}
 if(bossPending&&fish&&fish.boss){const b=save.boss[fish.boss]||(save.boss[fish.boss]={win:0});b.cd=Date.now()+90000;bossPending=null;notice('보스가 도망갔어요… 90초 뒤 다시 도전할 수 있어요')}
 if(app){app.flee=1;crit.push(app)}else if(fish&&fish.r>0&&!fish.boss){const g=G();crit.push({f:fish,L:critL(fish),dir:1,x:fg.fx||bob.x,y0:fg.fy||g.surf+40,seed:1,flee:1})}app=null;fish=null;persist();hud()}

function update(dt){
 const g=G(),L0=curLoc();T+=dt;if(S!=='title')gt+=dt;bgmTick();ambTick(dt);
 // 날씨
 wTimer-=dt;if(wTimer<=0&&S!=='title'&&!(bossPending&&weather==='storm')){setWeather(L0.wx[Math.floor(Math.random()*L0.wx.length)],true);wTimer=rnd(90,160)}
 const wr=weather==='rain'||weather==='storm';rainAmt+=((wr?1:0)-rainAmt)*dt*.5;stormAmt+=((weather==='storm'?1:0)-stormAmt)*dt*.5;snowAmt+=((weather==='snow'?1:0)-snowAmt)*dt*.5;cloudAmt+=((weather==='clear'||weather==='meteor'?.3:weather==='fog'?.6:1)-cloudAmt)*dt*.4;fogAmt+=((weather==='fog'?1:0)-fogAmt)*dt*.4;
 if(rainGain)rainGain.gain.value=save.set.bgm?rainAmt*(.05+stormAmt*.04):0;
 if(stormAmt>.5&&Math.random()<dt*.18){lightning=.5;setTimeout(()=>SFX.thunder(),300)}lightning=Math.max(0,lightning-dt*2);
 // 이벤트
 if(fever>0){fever-=dt;if(fever<=0){fever=0;notice('피버 타임 끝!')}}
 if(goldenT>0){goldenT-=dt;if(goldenT<=0){goldenT=0;notice('황금 물고기들이 돌아갔어요')}}
 if(legendT>0){legendT-=dt;if(legendT<=0){legendT=0;notice('전설 어종 출현 시간 끝')}}
 if(wishT>0)wishT=Math.max(0,wishT-dt);
 if(S!=='title'){evT-=dt;if(evT<=0){evT=rnd(22,40);const r=Math.random(),gull=PET_ON('seagull');
  if(r<(gull?.3:.4))startJump();else if(r<(gull?.75:.65)&&L0.id!=='deep'){school={x:rnd(g.edge+60,W-40),t:0,life:13};notice(gull?'🕊️ 갈매기가 물고기 떼를 찾았어요! 화살표 쪽에 던져요':'🐟 물고기 떼가 몰려왔어요! 근처에 던져 보세요')}
  else if(r<.85&&goldenT<=0){goldenT=30;notice('🌟 황금 물고기 출현! 30초 동안 황금 변종 6배');SFX.reward(3)}
  else if(legendT<=0){legendT=40;notice('👑 전설 어종 출현 시간! 40초 동안 전설 3배');SFX.rareGet()}}}
 if((isNight()||weather==='meteor')&&L0.id!=='deep'&&S!=='title'&&Math.random()<dt*(weather==='meteor'?.5:.06)&&meteors.length<2)meteors.push({x:rnd(W*.3,W),y:rnd(g.top,g.surf*.5),vx:-rnd(180,260),vy:rnd(70,110),t:0});
 for(let i=meteors.length-1;i>=0;i--){const m=meteors[i];m.t+=dt;m.x+=m.vx*dt;m.y+=m.vy*dt;if(m.t>2.4||m.y>g.surf)meteors.splice(i,1)}
 if(jumpEv){jumpEv.t+=dt;if(jumpEv.t>jumpEv.life)jumpEv=null}
 if(school){school.t+=dt;if(Math.random()<dt*6)splash(school.x+rnd(-40,40),g.surf,2,60);if(school.t>school.life)school=null}
 if(tourn){tourn.t-=dt;if(tourn.t<=0)endTour()}
 shake=Math.max(0,shake-dt*18);flash=Math.max(0,flash-dt*2.2);tipShake=Math.max(0,tipShake-dt*3);zoom=Math.max(0,zoom-dt*.8);
 // 상태
 if(S==='ready'){idleT+=dt;if(idleT>18)go('rest')}
 if(S==='charge'){const sp=save.method==='cast'?1.25:.85,p=(T*sp)%2;power=p<1?p:2-p}
 if(S==='cast'){const k=Math.min(1,T/.75),sy=g.platY-g.ch*.95;bob.x=bob.sx+(bob.tx-bob.sx)*k;bob.y=sy+(g.surf-sy)*k-Math.sin(k*Math.PI)*H*.15;if(fg.trail&&Math.random()<.6)parts.push({x:bob.x,y:bob.y,vx:rnd(-20,20),vy:rnd(-10,20),l:.6,t:0,c:fg.trail,r:2.5,g:.2,star:1});if(k>=1)landBobber()}
 if(S==='wait')waitTick(dt,g);
 if(S==='bite'){const m=save.method;if(isBobberM())bob.dip=(fish.bp==='float'?-14:20)+Math.sin(T*40)*4;else tipShake=1;const hp=hookPoint(g);if(app){app.x=hp.x-app.dir*app.L*.45+Math.sin(T*30)*3;app.y=hp.y}if(T>fg.win)fail('놓쳤다! 미끼만 먹고 도망…')}
 if(S==='hook'&&T>.32)startFight(g);
 if(S==='fight')fight(dt,g);
 if(S==='land'&&T>=(fish&&(fish.giant||fish.boss||fish.r>=5)?1.6:1.05))showResult();
 if(resultLock>0)resultLock-=dt;
 // 파티클·생명체
 for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.t+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=300*q.g*dt;if(q.grow)q.r+=dt*14;if(q.t>q.l)parts.splice(i,1)}
 for(let i=rings.length-1;i>=0;i--){rings[i].t+=dt;if(rings[i].t>rings[i].life)rings.splice(i,1)}
 for(let i=crit.length-1;i>=0;i--){const a=crit[i];if(a.flee){a.x+=a.dir*170*dt;if(a.x<-220||a.x>W+220)crit.splice(i,1);continue}a.x+=a.vx*dt;if(a.turn==null&&Math.random()<dt*.04&&!a.bottom){a.turn=0}if(a.turn!=null){a.turn+=dt*2;if(a.turn>=1){a.dir*=-1;a.vx*=-1;a.turn=null}}if(a.x<-160||a.x>W+160)crit.splice(i,1)}
 const want=LOWGFX?4:W<500?6:9;while(crit.filter(a=>!a.flee).length<want)if(!spawnAmbient(true,g))break;
 clouds.forEach(c=>{c.x+=c.v*dt*(rainAmt>.5?1.8:1);if(c.x>1.3)c.x=-.3});
 shadows.forEach(s=>{s.x+=s.v*dt;if(s.x>1.2)s.x=-.2;if(s.x<-.2)s.x=1.2});
 const pr=rainAmt>.05?Math.floor(rainAmt*(LOWGFX?40:90)*(1+stormAmt*.6)):0;if(pr){while(drops.length<pr)drops.push({x:Math.random()*W,y:Math.random()*g.surf,v:rnd(500,700)});drops.forEach(d=>{d.y+=d.v*dt;d.x-=d.v*(.15+stormAmt*.25)*dt;if(d.y>g.surf){if(Math.random()<.25)ring(d.x,g.surf+rnd(2,12),10,'255,255,255',.5);d.y=rnd(-40,0);d.x=Math.random()*W*1.2}});if(drops.length>pr)drops.length=pr}else drops.length=0;
 const ps=snowAmt>.05?Math.floor(snowAmt*(LOWGFX?30:70)):0;if(ps){while(flakes.length<ps)flakes.push({x:Math.random()*W,y:Math.random()*H,v:rnd(25,60),s:rnd(1.5,3.5),p:Math.random()*6});flakes.forEach(f=>{f.y+=f.v*dt;f.x+=Math.sin(T+f.p)*12*dt;if(f.y>H)f.y=-5});if(flakes.length>ps)flakes.length=ps}else flakes.length=0;
 if(gulls.length<2&&Math.random()<dt*.06&&!isNight()&&L0.w!=='deep')gulls.push({x:-40,y:rnd(.12,.35),v:rnd(40,70),s:rnd(.7,1.1),ph:Math.random()*6});
 for(let i=gulls.length-1;i>=0;i--){const b=gulls[i];b.x+=b.v*dt;if(b.x>W+60)gulls.splice(i,1)}
 if(S==='fight'&&holding&&Math.random()<dt*10)SFX.reel()}
function setWeather(w,announce){if(w===weather)return;weather=w;if(announce)notice({rain:'🌧️ 비가 내려요 · 감성돔·볼락이 신나요',storm:'⛈️ 폭풍우! 특별한 물고기가 나타날지도',snow:'❄️ 눈이 내려요',cloudy:'☁️ 구름이 몰려와요',fog:'🌫️ 안개가 꼈어요 · 희귀한 친구가 슬쩍 다가와요',meteor:'🌠 별똥별이 쏟아져요! 별을 탭해서 소원 빌기',clear:'☀️ 날이 개었어요'}[w]||'')}
function waitTick(dt,g){const m=save.method,hp=hookPoint(g);bob.dip*=.86;bob.dx*=.97;
 if(bob.sink){const ty=m==='deep'?g.bed-30:g.bed-26;bob.y+=(ty-bob.y)*dt*(m==='deep'?.9:2.2);if(Math.abs(ty-bob.y)<3)bob.sink=0}
 if(m==='lure'){if(T-fg.lastTw<1.8)fg.lprog+=dt;else fg.lprog=Math.max(0,fg.lprog-dt*.3);bob.y+=Math.sin(T*3)*.2;
  if(app){const tx=bob.x-app.dir*app.L*.5,k=clamp(fg.lprog/(fg.bite*.5),0,1);app.x+=(lerp(app.sx,tx,k)-app.x)*dt*3;app.y+=(bob.y-app.y)*dt*2}
  if(fg.lprog>=fg.bite*.5){biteNow(g)}return}
 const tt=m==='deep'&&bob.sink?0:T;
 if(app){const u=clamp((tt-fg.bite*.08)/(fg.bite*.5),0,1),e=1-(1-u)**2,tx=hp.x-app.dir*app.L*.5;app.x=app.sx+(tx-app.sx)*e;app.y=app.sy+(hp.y-app.sy)*e+Math.sin(T*3)*4;if(u>=1)app.x=tx+Math.sin(T*10)*2}
 if(m==='deep'&&bob.sink)return;
 if(fg.rare&&T>fg.bite*.6&&!fg.rareCue){fg.rareCue=1;SFX.rare();ring(bob.x,isBobberM()?g.surf+3:hp.y,90,fish.v==='gold'?'255,215,80':fish.r>=6?'255,120,200':'255,215,80',2);vib(30)}
 if(fg.cues.length&&T>fg.cues[0]){fg.cues.shift();const bp=fish.bp;
  if(isBobberM()){if(bp==='nibble'){bob.dip=6;SFX.nibble();ring(bob.x,g.surf+3,20)}else if(bp==='drag'){bob.dx=(Math.random()<.5?-1:1)*14;bob.dip=4;SFX.nibble()}else if(bp==='float'){bob.dip=-5;SFX.nibble()}else{bob.dip=3;SFX.nibble()}}
  else{tipShake=.5;SFX.bell()}
  if(app)app.x+=app.dir*5}
 if(isBobberM()&&fish.bp==='drag'&&T>fg.bite*.6)bob.x+=bob.dx*dt;
 if(T>fg.bite)biteNow(g)}
function biteNow(g){const base={nibble:.8,slam:.55,drag:1.05,float:.9}[fish.bp]||.8;fg.win=Math.max(.42,(base-fish.p*.04+(save.bob==='yellow'?.15:0))*(1+.04*save.up.hook)+(save.method==='float'?.1:0));go('bite');
 if(isBobberM()){bob.dip=fish.bp==='float'?-14:24;splash(bob.x,g.surf,fish.bp==='slam'?16:8)}else{tipShake=1;SFX.bell()}
 SFX.bite();SFX.splash(.15);vib(80);shake=fish.bp==='slam'?5:2;if(fg.rare){flash=.8;flashCol=fish.r>=6?'255,140,210':'255,220,120';shake=8}}
function startFight(g){const boss=fish.boss?BOSSES.find(b=>b.id===fish.boss):null,gs=GS(),pull=fishPull(fish),ts=clamp(pull/gs.max,.45,2.4);
 const hpMax=hpOf(fish)*(boss?2.6:1)*(save.method==='deep'?1.15:1);const hp=hookPoint(g);
 Object.assign(fg,{ten:35,hp:fg.perfect?(boss?85:70):100,hpMax,surge:0,next:.9+Math.random(),slack:0,over:0,fx:hp.x,fy:hp.y,lfx:hp.x,vx:0,chance:0,crits:0,sweet:0,warnT:0,phase:0,roar:0,boss,air:0,inkT:0,charge:0,exUsed:false,ex:0,fm:boss?boss.ph[0]:fish.fm,gs,pull,ts,ft:0,clutch:0,clutchUsed:false,final:0,finalDone:false,mash:0,spT:4,weakT:3,warn:0,weak:0,glare:0,diveT:0,freeze:0,dark:0,ice:0});
 bob.on=false;go('fight');
 if(boss){bigText('1단계',boss.pn[0],'#ff9a6a');SFX.boss()}else if(fish.r>=5){bigText(RAR[fish.r].n+' 등급!','특별한 손맛이 기다려요',RAR[fish.r].c);SFX.rare()}
 if(pull>gs.max*1.3&&!practice)setTimeout(()=>{if(S==='fight')toast(`힘이 센 녀석! (약 ${pull}kg · 내 줄 ${gs.max}kg)`,1200)},400)}
function fight(dt,g){const p=fish.p,fm=fg.fm,gs=fg.gs,ts=fg.ts,sr=1-gs.sres/100;fg.ft+=dt;
 if(fg.roar>0){fg.roar-=dt;fg.ten=Math.max(20,fg.ten-40*dt);shake=Math.max(shake,4);return}
 if(fg.clutch>0){clutchTick(dt);return}
 if(fg.final>0){finalTick(dt);if(fg.finalDone)landNow(g);return}
 if(fg.boss){bossTick(dt,g);if(fg.warn>0){fg.ten=Math.max(0,fg.ten-(holding?-5:gs.rec*.5)*dt)}}
 fg.next-=dt;
 if(fg.next<=0&&fg.surge<=0&&fg.charge<=0){
  const mul=fm==='hide'?2:fm==='float'?.5:1,len=fm==='strong'?1.4:1;
  if(fm==='charge'&&Math.random()<.5){fg.charge=.75;toast('돌진 준비! 손 떼요',700);SFX.warn()}
  else{fg.surge=(.35+Math.random()*.45*(p/3))*(fm==='burst'?1.4:1)*len*(.6+.4*fg.hp/100);fg.smul=mul;splash(fg.fx,g.surf,6+p*2);SFX.surge();
   if(fm==='ink'){ink(fg.fx,fg.fy,10);fg.inkT=1.6}if(fish.k==='jelly'&&!fish.boss){shake=6;toast('찌릿!',600);vib(60)}if(fm==='burst'||fm==='hide')fg.dash=(Math.random()<.5?-1:1);
   if(fm==='retreat'){fg.fx=Math.min(W-20,fg.fx+60);fg.hp=Math.min(100,fg.hp+3);for(let i=0;i<8;i++)parts.push({x:fg.fx-20,y:fg.fy,vx:-rnd(80,180),vy:rnd(-30,30),l:.5,t:0,c:'#d6f3ff',r:2.5,g:0})}
   if(fm==='jump'&&Math.random()<.7){fg.air=1;SFX.jump();splash(fg.fx,g.surf,16,160);toast('점프! 손 떼요',700)}}
  fg.next=(.7+Math.random()*Math.max(.6,2.6-p*.25))*(fm==='hide'?1.8:fm==='float'?1.6:fm==='strong'?1.3:1)}
 if(fg.charge>0){fg.charge-=dt;if(fg.charge<=0){fg.surge=.7;fg.smul=2.2;fg.dash=1;SFX.surge();splash(fg.fx,g.surf,20,200);shake=6}}
 if(fg.surge>0){fg.surge-=dt;fg.ten+=(10+p*9)*ts*sr*dt*(fg.smul||1)*(fm==='float'?.5:1);fg.hp=Math.min(100,fg.hp+(1+p*.6)*dt);if(fg.surge<=0){fg.chance=.75;fg.chanceAt=T;fg.dash=0;fg.smul=1}}
 if(fg.air>0){fg.air-=dt;if(holding)fg.ten+=70*ts*sr*dt;if(fg.air<=0){splash(fg.fx,g.surf,18,170);SFX.splash(.2)}}
 if(fg.inkT>0)fg.inkT-=dt;if(fg.chance>0)fg.chance-=dt;if(fg.ex>0)fg.ex-=dt;
 const zLo=85-gs.eff,sweet=fg.ten>=zLo&&fg.ten<=85;fg.ftime=(fg.ftime||0)+dt;
 if(holding){fg.ten+=(34+p*4)*ts*(100/gs.stab)*(1-gs.tred/100)*dt*(fg.surge>0?1.5:1)*(fm==='strong'?1.25:fm==='float'?.8:1)+(fm==='dive'?8*ts*dt:0)+(fg.charge>0?60*ts*sr*dt:0);
  if(fg.ten<92){const zm=sweet?1.7:fg.ten>85?.4:1,pf=fish.k==='puffer'&&fg.surge>0?.6:1,bigB=(p>=4||fish.giant)?1+gs.big/100:1,fatB=fg.hp<30?1+gs.fat/100:1,frz=fg.freeze>0?.15:1;
   fg.hp-=DMGK/fg.hpMax*(gs.pow/100)*gs.spd*zm*pf*bigB*fatB*frz*dt;if(sweet){fg.sweet+=dt;if(Math.random()<dt*6)sparkle(fg.fx,fg.fy,1,[(COS.reel.find(r=>r.id===save.wear.reel)||{}).col||'#9dffb0'])}}
  if(fg.chance>0&&fg.pressAt>=fg.chanceAt){fg.chance=0;const cd=12*(1+(gs.crit+gs.crx)/100)*(gs.pow/100)/Math.sqrt(fg.hpMax);fg.hp-=cd;fg.crits++;save.st.crit++;mission('crit',1);toast(`크리티컬! -${cd.toFixed(0)}% 💥`,700);SFX.crit();sparkle(fg.fx,fg.fy,14);vib(30)}
  if(fg.ex>0&&fg.pressAt>=fg.exAt){fg.ex=0;fg.hp-=(fg.boss?16:30)*(1+gs.fat/200);SFX.finish();toast('결정타!! ⚡',900);sparkle(fg.fx,fg.fy,30,['#fff36a','#fff','#ffb0d0']);shake=6;vib([20,30,60])}}
 else fg.ten-=gs.rec*dt;
 fg.vx=(fg.fx-fg.lfx)/Math.max(dt,.001);fg.lfx=fg.fx;if(fg.vx>0)fg.ten+=Math.min(fg.vx,220)*.06*ts*dt*(holding?1:.4);else fg.ten-=Math.min(-fg.vx,220)*.03*dt;
 fg.ten=clamp(fg.ten,0,104);fg.maxTen=Math.max(fg.maxTen||0,fg.ten);
 if(fg.ten<8&&!(fg.air>0||fg.warn>0||fg.roar>0||fg.diveT>0||fg.clutch>0)){fg.slack+=dt;fg.hp=Math.min(100,fg.hp+4*dt)}else fg.slack=Math.max(0,fg.slack-dt);
 if(fg.ten>85){fg.warnT-=dt;if(fg.warnT<=0){SFX.warn();fg.warnT=.25}}
 if(!fg.exUsed&&fg.hp<22&&fg.surge<=0&&!fg.boss){fg.exUsed=true;fg.ex=1.1;fg.exAt=T;toast('지쳤다! 지금 탭해서 결정타',900);SFX.bite()}
 if(fg.boss){const want=fg.hp<33?2:fg.hp<66?1:0;if(want>fg.phase){fg.phase=want;fg.fm=fg.boss.ph[want];fg.roar=1.2;bigText(`${want+1}단계`,fg.boss.pn[want],want===2?'#ff5a5a':'#ff9a6a');SFX.boss();flash=.5;flashCol='255,90,90';ink(fg.fx,fg.fy,fg.fm==='ink'?14:4)}}
 const dist=Math.max(0,fg.hp)/100,base=bob.tx+(g.edge+24-bob.tx)*(1-dist);
 const lat=fg.fm==='zigzag'?Math.sin(T*3.2)*55:(fg.fm==='burst'||fg.fm==='hide'||fg.fm==='charge')?(fg.dash||0)*80*Math.min(1,Math.max(fg.surge,0)*3):fg.fm==='float'?Math.sin(T*.8)*25:Math.sin(T*1.5)*18;
 fg.fx+=(clamp(base+lat,g.edge+16,W-20)-fg.fx)*dt*3.5;
 const hp0=hookPoint(g),deep=save.method==='deep'?g.bed-30:null;
 fg.fy=fg.air>0?g.surf-Math.sin((1-fg.air)*Math.PI)*90:(deep??Math.max(g.surf+30,hp0.y))+(fg.fm==='dive'||fg.diveT>0?16:0)+(fg.surge>0?24:6)*(.5+dist*.5)+Math.sin(T*5)*6;
 if(deep==null&&!isBobberM())fg.fy=lerp(g.surf+38,fg.fy,dist);
 fg.over=fg.ten>=100?fg.over+dt:0;
 if(fg.over>gs.grace){if(!fg.clutchUsed&&fg.hp>3)startClutch();else fail('툭! 줄이 끊어졌어요 · '+snapMsg(),'snap')}
 else if(fg.slack>2.8)fail('줄이 느슨해서 도망갔어요');
 else if(fg.hp<=0){if(fg.boss&&!fg.finalDone)startFinal();else landNow(g)}}
function landNow(g){go('land');app=null;fg.lx=fg.fx;fg.ly=fg.fy;const big=critL(fish);splash(fg.fx,g.surf,Math.min(70,14+big*.35),120+big*1.6);ring(fg.fx,g.surf+3,big*.9);SFX.jump();SFX.splash(.3+Math.min(.3,big/400));vib([30,40,30]);
 if(fish.r>=4||fish.giant||fish.boss){zoom=1;shake=fish.r>=5||fish.boss?10:5}
 if(fish.giant||fish.boss||fish.r>=5){slowmo=1.4;bigText(fish.boss?'제압 완료!!':fish.giant?'초대형!!':RAR[fish.r].n+'!!',fish.n,fish.boss?'#ff6a6a':fish.giant?'#ffe066':RAR[fish.r].c)}}
function practiceResult(f){const pr=practice;endPractice();if(pr.want&&!save.gown[pr.want])setTimeout(()=>notice('마음에 들면 장비 메뉴에서 구매해 보세요!'),800);const t=fg.ft||0;go('ready');fish=null;
 $('tourRes').innerHTML=`<h2>🎯 시험 낚시 결과</h2><p style="font-size:18px">${f.n}를 <b>${t.toFixed(1)}초</b> 만에 제압!</p><p>이전 장비 예상: <b>${pr.before.toFixed(1)}초</b> → 지금 장비 예상: <b>${pr.after.toFixed(1)}초</b></p><p>크리티컬 ${fg.crits||0}번 · 최고 장력 ${Math.round(fg.maxTen||0)}%</p><p style="color:#8a6a4a">시험 낚시는 보상·도감에 기록되지 않아요</p><button class="big" id="tourOk">확인</button>`;
 $('tourOv').classList.add('on');$('tourOk').onclick=()=>$('tourOv').classList.remove('on')}
function spawnAmbient(edge,g){const pool=FISH.filter(f=>f.loc.includes(save.loc)&&f.r>=1&&f.r<=4&&!['chest','clam'].includes(f.k)&&!f.hid&&!f.boss&&(f.id!=='galchi'||isNight())&&(save.loc==='deep'||f.m!=='d'));if(!pool.length)return false;
 const f0=pool[Math.floor(Math.random()*pool.length)],f={...f0,size:f0.min+Math.random()*(f0.max-f0.min)*.5};
 const dir=Math.random()<.5?1:-1,bottom=['crab','star','urchin','nudi','isopod','flat','clam'].includes(f.k),Lp=Math.min(95,critL(f)*.72),spd=Math.max(.4,Math.min(1.3,60/Lp));
 crit.push({f,L:Lp,dir,x:edge?(dir>0?-Lp:W+Lp):Math.random()*W,y0:bottom?g.bed-Lp*.3:g.surf+50+Math.random()*Math.max(30,g.bed-g.surf-110),vx:(['star','urchin','clam','nudi'].includes(f.k)?4:f.k==='crab'?14:(16+Math.random()*26)*spd)*dir,seed:Math.random()*10,bottom});return true}
function startJump(){const g=G(),pool=FISH.filter(f=>f.loc.includes(save.loc)&&f.k==='fish'&&!f.hid&&!f.boss&&f.m!=='d');if(!pool.length||save.loc==='deep')return;const f=pool[Math.floor(Math.random()*pool.length)];
 jumpEv={x:rnd(g.edge+50,W-40),t:0,life:7,f:{...f,size:f.min+(f.max-f.min)*.6}};SFX.jump();setTimeout(()=>{SFX.splash(.2);if(jumpEv)splash(jumpEv.x+30,G().surf,14,140)},800);splash(jumpEv.x,g.surf,10,120)}

/* ================= 결과·기록 ================= */
function showResult(){const f=fish;if(!f)return;const isNew=!save.dex[f.id],prev=save.best[f.id],rec=f.r>0&&(!prev||prev.cm<f.size),L0=save.loc;
 if(practice){practiceResult(f);return}
 if(f.r>0){combo++;save.st.maxCombo=Math.max(save.st.maxCombo,combo);mission('combo',combo)}else{comboBreak();save.st.junk++}
 let feverStart=false;if(f.r>0&&combo>0&&combo%5===0&&fever<=0){fever=20;feverStart=true}
 const cm=(f.r>0?comboMult():1)+(save.bob==='heart'?.05:0),fm=fever>0&&!feverStart?2:1,vm={mut:3,gold:5,albino:3}[f.v]||1;
 let pm=1+PETS.reduce((a,x)=>a+(PET_ON(x.id)?petLv(x.id)*.02:0),0);if(PET_ON('otter'))pm+=.12;if(PET_ON('penguin'))pm+=L0==='ice'?.3:.05;if(save.wear.boat==='duck'&&curLoc().plat==='boat')pm+=.05;if(save.wear.boat==='whaleboat'&&curLoc().plat==='boat')pm+=.1;if(save.bob==='goldbob')pm+=.1;
 const base0=f.r===0?10:GOLD_BASE[f.r]*(.7+.6*(f.pct||0))*SIZEC[f.sc].m*vm*(1+.12*Math.log2(1+f.kgv))*pm;let gold=f.r===0?10:Math.round(base0*cm*fm);const comboBonus=f.r>0?Math.round(base0*(cm-1)):0;
 if(f.r>0&&weather==='fog')save.st.fog=(save.st.fog||0)+1;
 fg.clean=f.r>0&&!practice&&(fg.ftime||0)>=2.5&&(fg.sweet||0)/(fg.ftime||1)>=.6&&(fg.maxTen||0)<95;if(fg.clean){gold=Math.round(gold*1.5);save.st.clean=(save.st.clean||0)+1;save.cleanRun=(save.cleanRun||0)+1;if(save.cleanRun%3===0){gold+=500;setTimeout(()=>notice(`🎯 손맛 마스터 ${save.cleanRun}연속! +500🪙`),900)}}else if(f.r>0)save.cleanRun=0;
 if(f.r>0){const bh=bountyHit(f,gold);gold=bh.gold;fg.bounty=bh.extra||(bountyOf().id===f.id?1:0)}if(f.k==='chest')gold=chestGold(gold);/* 4.21 영웅급 + 대박 뽑기 (06s) */if(f.id==='clam')gold+=200;if(f.id==='bottle')gold+=100;
 const released=['turtle','sunfish','dolphin','orca','whale','manta','dwhale','dragon'].includes(f.id);if(released)gold+=100;
 const xp=Math.round((Math.max(1,f.r)*17+8)*(f.giant?2:1)*(f.v?1.5:1)*(fg.perfect?1.2:1)*(f.boss?3:1)*(f.r>=4?1+(f.r-3)*.8:1)+Math.min(40,f.size*.05)); // 4.20 영웅 ×1.8 · 전설 ×2.6 · 신화 ×3.4 · 히든 ×4.2
 save.dex[f.id]=(save.dex[f.id]||0)+1;if(rec)save.best[f.id]={cm:f.size,kg:f.kgv};save.count++;save.gold+=gold;
 const r0=save.rec[f.id]||(save.rec[f.id]={locs:[],vars:{},last:null});r0.last={d:today(),loc:L0,cm:f.size,kg:f.kgv};if(!r0.locs.includes(L0))r0.locs.push(L0);r0.vars[SIZEC[f.sc].n]=1;if(f.v)r0.vars[f.v]=1;
 if(f.r>=5&&f.r<7)save.st.legend++;if(f.r===6){save.st.myth++;save.mythLog.push({id:f.id,d:today(),kg:f.kgv,loc:L0})}if(f.hid&&HIDTITLE[f.id]&&!save.titles[HIDTITLE[f.id]]){save.titles[HIDTITLE[f.id]]=1;setTimeout(()=>notice(`🔮 히든 칭호 「${HIDTITLE[f.id]}」 획득!`),1500)}if(f.giant)save.st.giant++;if(f.v)save.st.variant++;if(f.hid&&isNew)save.st.hidden++;if(f.r>0)save.st.totalKg+=f.kgv;if(save.method!=='basic'&&f.r>0){save.st.meth++;mission('method',1)}
 if(f.r>0){save.rank.push({id:f.id,n:f.n,kg:f.kgv,cm:f.size,loc:L0,d:today(),v:f.v||'',g:f.giant?1:0});save.rank.sort((a,b)=>b.kg-a.kg);save.rank=save.rank.slice(0,10)}
 ensureDaily();save.today.count++;let todayBest=false;if(f.r>0&&f.kgv>save.today.bestKg){save.today.bestKg=f.kgv;save.today.bestName=f.n;todayBest=true}
 const rg=save.reg[L0]||(save.reg[L0]={c:0,r:0,cl:{}});if(f.r>0){rg.c++;if(f.r>=3)rg.r++}
 luckTick(f);mission('catch',1,f);mission('gold',gold);if(isNew)wmission('newsp',1);if(f.r>0){wmission('catch',1);if(f.r>=3)wmission('rare',1);wmission('heavykg',f.kgv);const wl=save.weekly.locs;if(!wl.includes(L0)){wl.push(L0);wmission('locs',wl.length,true)}}
 let bossMsg='';if(f.boss){const b=BOSSES.find(x=>x.id===f.boss),st=save.boss[b.id]||(save.boss[b.id]={win:0});const first=!st.win;st.win++;st.cd=Date.now()+60000;bossPending=null;wmission('boss',1);
  const bg=first?b.rew.gold:Math.round(b.rew.gold*.3);save.gold+=bg;gold+=bg;
  if(first){save.titles[b.rew.title]=1;const[cat,id]=b.rew.item;if(cat==='bob')save.bobs[id]=1;else save.cos[cat][id]=1;if(b.rew.deco)save.deco[b.rew.deco]=1;bossMsg=`🏆 칭호 「${b.rew.title}」 + 보상 장비 획득!`}SFX.bossWin()}
 if(tourn&&f.r>0){tourn.got.push(f.kgv);tourn.got.sort((a,b)=>b-a);tourn.got=tourn.got.slice(0,3);tourn.score=+tourn.got.reduce((a,b)=>a+b,0).toFixed(2)}
 if(PET_ON('otter')&&Math.random()<.25){const sg=Math.round(rnd(20,80));save.gold+=sg;setTimeout(()=>{SFX.shell();notice(`🦦 수달이 조개를 주워 왔어요! +${sg}`)},900)}
 lastRes={f,isNew,rec:rec&&!isNew,gold,xp,feverStart,todayBest,released,bossMsg,clean:fg.clean,sweetPct:Math.round(100*(fg.sweet||0)/Math.max(.1,fg.ftime||0))};
 const beforePct=dexPct();addXp(xp);checkLocDone();const afterPct=dexPct();if(isNew&&[25,50,75,100].some(m=>beforePct<m&&afterPct>=m)){setTimeout(()=>{SFX.dexdone();notice(`📖 도감 ${afterPct}% 달성! 도감에서 보상 받기`)},1200)}
 if(f.r>0)comboUp(gold,comboBonus);save.comboBest=Math.max(save.comboBest||0,combo);
 persist();hud();go('result');fillResult(lastRes,fm,cm);
 if(f.boss){}else if(f.r===6){flash=1;flashCol='255,150,220';sparkle(W/2,H*.35,90,['#ff9ad8','#fff','#b0a0ff','#ffe066']);notice('🌈 신화 등급 '+f.n+' 획득!')}
 else if(f.r===5||f.r===7){flash=1;flashCol=f.r===7?'120,240,230':'255,230,140';sparkle(W/2,H*.35,70);notice((f.r===7?'🔮 히든 ':'🌟 전설 ')+f.n+' 획득!')}
 else if(f.r>=3||f.giant||f.v){sparkle(W/2,H*.38,40);if(isNew)notice('✨ 희귀 친구 발견! '+f.n)}else if(f.r===0)tone(220,.4,'triangle',.12,110);else SFX.reward(4);
 if(feverStart)setTimeout(()=>{toast('🔥 피버 타임! 골드 2배 · 변종·히든 확률 ↑',1600);SFX.reward(5)},500);
 resultLock=.6;reveal(f,()=>{$('result').classList.add('on');$('result').classList.toggle('lite',f.r<=2&&!f.giant&&!f.v)})}
function addXp(x){save.xp+=x;let need=xpNeed(save.lv);while(save.xp>=need){save.xp-=need;save.lv++;const r=save.lv*100;save.gold+=r;SFX.level();notice(`🎉 레벨 업! Lv ${save.lv} · 보상 🪙${r}`);LOCS.forEach(l=>{if(l.lv===save.lv)notice(`🗺️ 새 낚시터 해금 가능: ${l.n}`)});BOSSES.forEach(b=>{if(b.lv===save.lv)notice(`👹 보스 도전 가능: ${FID[b.id].n}`)});need=xpNeed(save.lv)}}
const xpNeed=lv=>Math.round(60*Math.pow(lv,1.45));
function mission(t,v,f){ensureDaily();const d=save.daily;
 if(t==='catch'&&f&&f.r>0&&!d.sp.includes(f.id))d.sp.push(f.id);
 d.list.forEach(m=>{if(m.c)return;const was=m.p>=m.n;
  if(m.t==='catch'&&t==='catch'&&f&&f.r>0)m.p++;
  if(m.t==='rare'&&t==='catch'&&f&&f.r>=3)m.p++;
  if(m.t==='perfect'&&t==='perfect')m.p++;
  if(m.t==='combo'&&t==='combo')m.p=Math.max(m.p,v);
  if(m.t==='gold'&&t==='gold')m.p+=v;
  if(m.t==='species')m.p=d.sp.length;
  if(m.t==='heavy'&&t==='catch'&&f&&f.r>0&&f.kgv>=1)m.p++;
  if(m.t==='crit'&&t==='crit')m.p++;
  if(m.t==='method'&&t==='method')m.p++;
  m.p=Math.min(m.p,m.n);if(!was&&m.p>=m.n){SFX.mission();notice('📜 오늘의 미션 완료! 보상을 받아요')}});dots()}
function wmission(t,v,abs){ensureDaily();save.weekly.list.forEach(m=>{if(m.c||m.t!==t)return;const was=m.p>=m.n;m.p=Math.min(abs?v:+(m.p+v).toFixed(2),m.n);if(!was&&m.p>=m.n){SFX.mission();notice('📅 주간 미션 완료!')}})}
function checkLocDone(){LOCS.forEach(l=>{if(save.locDone[l.id+'_n'])return;const sp=locSpecies(l.id);if(sp.length&&sp.every(f=>save.dex[f.id])){save.locDone[l.id+'_n']=1;SFX.dexdone();notice(`🏅 ${l.n} 수집 완료! 낚시터 메뉴에서 보상 받기`)}})}
const locSpecies=id=>FISH.filter(f=>f.loc.includes(id)&&f.r>0&&!f.hid&&!f.boss&&f.k!=='chest');
const REG=[{t:'c',n:15,f:n=>`여기서 ${n}마리 낚기`,g:1},{t:'r',n:3,f:n=>`여기서 희귀 이상 ${n}마리`,g:2.5},{t:'all',f:()=>'이곳 친구 모두 모으기',g:6}];
function dots(){const d=save.daily,m=(d&&d.list.some(x=>!x.c&&x.p>=x.n))||(save.weekly&&save.weekly.list.some(x=>!x.c&&x.p>=x.n))||ACH.some(x=>!save.ach[x.id]&&x.ok(save))||save.att.last!==today();
 const l=LOCS.some(x=>(save.locDone[x.id+'_n']&&!save.locDone[x.id])||(!save.locs[x.id]&&canUnlock(x)))||BOSSES.some(b=>bossReady(b)&&!(save.boss[b.id]&&save.boss[b.id].win));
 $('mDot').classList.toggle('on',!!m);$('lDot').classList.toggle('on',!!l);$('dDot').classList.toggle('on',[25,50,75,100].some(p=>dexPct()>=p&&!save.dexR[p]))}
function canUnlock(l){if(save.lv<l.lv||save.gold<l.cost)return false;const r=l.req;if(!r)return true;if(r.dex&&dexN()<r.dex)return false;if(r.meth&&!save.methods[r.meth])return false;if(r.boss&&bossWins()<r.boss)return false;return true}
function bossReady(b){const st=save.boss[b.id];return save.lv>=b.lv&&save.locs[b.loc]&&!(st&&st.cd>Date.now())}
/* ================= 출석·대회 ================= */
function claimAtt(){const d=today();if(save.att.last===d)return;const y=new Date();y.setDate(y.getDate()-1);const yd=today(y);const a=save.att;a.streak=a.last===yd?a.streak+1:1;a.day=a.day%7+1;a.last=d;a.total++;
 const r=ATT[a.day-1],bonus=1+Math.min(.3,(a.streak-1)*.05);let msg=[];if(r.g){const gg=Math.round(r.g*bonus);save.gold+=gg;msg.push('🪙'+gg)}if(r.gb){save.goldB+=r.gb;msg.push('✨황금 미끼 ×'+r.gb)}SFX.mission();toast(`출석 ${a.day}일째! ${msg.join(' ')}`,1500);persist();hud()}
const isWeekend=()=>[0,6].includes(new Date().getDay())||(TEST&&window.__forceWeekend);
const RIVALS=['바다곰 박씨','여수 갈매기','김선장','은빛 비늘','새벽 조사','돌산 할매'];
function startTour(){ensureDaily();const t=save.tour;if(t.date!==today()){t.date=today();t.entries=0}if(!isWeekend()||t.entries>=3||tourn)return;t.entries++;
 const avg=locSpecies(save.loc).filter(f=>f.r<=3).map(f=>kgOf(f,(f.min+f.max)/2)).sort((a,b)=>a-b),med=avg[Math.floor(avg.length/2)]||1,k=1+save.lv*.03;
 const sim=()=>{const ks=[];const n=Math.floor(rnd(5,10));for(let i=0;i<n;i++){const f=pickFrom(weights(false,false));if(f.r>0)ks.push(makeFish(f).kgv)}ks.sort((a,b)=>b-a);return +(ks.slice(0,3).reduce((a,b)=>a+b,0)*rnd(.8,1.15)).toFixed(2)};
 tourn={t:180,score:0,got:[],rivals:RIVALS.slice().sort(()=>Math.random()-.5).slice(0,4).map(n=>({n,score:sim()})),loc:save.loc};
 notice('🏆 주말 낚시 대회 시작! 3분 동안 가장 무거운 3마리 합계로 겨뤄요');SFX.boss();persist()}
function endTour(){const t=tourn;tourn=null;const all=[...t.rivals,{n:'하늘이(나)',score:t.score,me:1}].sort((a,b)=>b.score-a.score),rank=all.findIndex(x=>x.me)+1,rw=[1500,800,500][rank-1]||150;save.gold+=rw;save.tour.best=Math.max(save.tour.best,t.score);
 if(rank===1){save.tour.won++;save.titles['주말 낚시왕']=1}SFX[rank===1?'bossWin':'reward'](5);
 $('tourRes').innerHTML=`<h2>🏆 대회 결과 ${rank}위!</h2>`+all.map((x,i)=>`<div class="row ${x.me?'eq':''}" style="grid-template-columns:40px 1fr auto"><div class="ic">${['🥇','🥈','🥉'][i]||i+1}</div><b>${x.n}</b><span>${x.score.toFixed(2)}kg</span></div>`).join('')+`<p>보상 🪙${rw}${rank===1?' + 칭호 「주말 낚시왕」':''}</p><button class="big" id="tourOk">확인</button>`;
 $('tourOv').classList.add('on');$('tourOk').onclick=()=>$('tourOv').classList.remove('on');persist();hud()}
