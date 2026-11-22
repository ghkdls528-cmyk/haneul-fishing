/* ================= 그리기: 캐릭터·낚싯줄 ================= */
// 낚싯대 끝 탄성: 장력과 줄 방향에 따라 휘는 끝마디
let arriveT=0;const DM=()=>false;let DOLL=mkDoll(),DOLLR=null,DOLLDT=.016;const RT=(tp,to,ten)=>DM()||PXNOEXT?tp:rodTip(tp,to,ten);
function dollPose(n){const r=lastRes;const map={idle:'idle',wink:'idle',castready:'charge',cast:'cast',wait:'wait',hook:'hook',reel:'reel',fight:'fight',lift:'lift',success:'success',happy:'success',jump:'big',surprise:'surprise',fail:'fail',rest:'rest'};let pose=map[n]||'idle',mood='smile',hold=false;
 if(S==='charge')mood='grit';else if(S==='bite')mood='o';else if(S==='fight')mood=fg.surge>0||fg.ten>80?'grit':holding?'grit':'smile';else if(S==='land')mood='wow';else if(S==='result'){mood='happy';if(r&&(r.f.r>=4||r.f.giant||r.f.boss)&&r.f.r>0){pose='big';hold=true}else if(r&&r.f.r===0){pose='surprise';mood='o'}else pose='success'}else if(S==='fail')mood='sad';else if(S==='rest')mood='sleep';if(S==='fight'&&!holding&&fg.surge<=0)pose='wait';return{pose,mood,hold}}
function rodTip(tip,to,ten){if(!tip)return tip;const rs=COS.rod.find(r=>r.id===save.wear.rod)||COS.rod[0],len=Math.max(14,G().ch*.13)*RODV[clamp(+((save.gear.rod||'r0').slice(1)),0,5)].len,dx=to?to.x-tip.x:1,dy=to?to.y-tip.y:0,a=Math.atan2(dy,dx),bend=clamp(ten/100,0,1)*.9,base=-1.1,ang=base+(a-base)*bend*.8;
 const ex=tip.x+Math.cos(ang)*len+(tipShake?Math.sin(T*60)*tipShake*4:0),ey=tip.y+Math.sin(ang)*len;
 const RV=RODV[clamp(+((save.gear.rod||'r0').slice(1)),0,5)];ctx.strokeStyle=rs.id!=='basic'&&rs.c?rs.c:RV.col;ctx.lineWidth=RV.w;ctx.lineCap='round';if(RV.glow){ctx.shadowColor=RV.glow;ctx.shadowBlur=8}ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.quadraticCurveTo(tip.x+Math.cos(base)*len*.6,tip.y+Math.sin(base)*len*.6,ex,ey);ctx.stroke();ctx.shadowBlur=0;
 if(RV.stripe){ctx.strokeStyle=RV.stripe;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.quadraticCurveTo(tip.x+Math.cos(base)*len*.6,tip.y+Math.sin(base)*len*.6,ex,ey);ctx.stroke()}
 for(let i=1;i<=Math.ceil(RV.rings/2);i++){const u=i/(Math.ceil(RV.rings/2)+1),qx=(1-u)*(1-u)*tip.x+2*(1-u)*u*(tip.x+Math.cos(base)*len*.6)+u*u*ex,qy=(1-u)*(1-u)*tip.y+2*(1-u)*u*(tip.y+Math.sin(base)*len*.6)+u*u*ey;ctx.strokeStyle='#d8dce4';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(qx,qy+1.6,1.6,0,7);ctx.stroke()}
 ctx.fillStyle=RV.tipc;ctx.beginPath();ctx.arc(ex,ey,1.8,0,7);ctx.fill();
 if(RV.trident){ctx.strokeStyle=RV.col;ctx.lineWidth=1.6;for(const a2 of[-.45,0,.45]){ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+Math.cos(ang+a2)*6,ey+Math.sin(ang+a2)*6);ctx.stroke()}}
 if(rs.id==='kraken'){ctx.strokeStyle='#c070ff';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<3;i++){ctx.moveTo(tip.x,tip.y);ctx.quadraticCurveTo(tip.x+Math.sin(T*3+i)*8,tip.y-10-i*4,tip.x+Math.cos(T*2+i)*10,tip.y-18-i*3)}ctx.stroke()}
 if(rs.glow){ctx.fillStyle=rs.line;ctx.globalAlpha=.4+.3*Math.sin(T*5);ctx.beginPath();ctx.arc(ex,ey,5,0,7);ctx.fill();ctx.globalAlpha=1}
 if(!isBobberM()&&(S==='wait'||S==='bite')){ctx.fillStyle='#ffd23f';ctx.strokeStyle=OL;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(ex,ey+4,4,0,7);ctx.fill();ctx.stroke()}
 return{x:ex,y:ey}}
function fline(a,b,ten){if(!a)return;const rs=COS.rod.find(r=>r.id===save.wear.rod)||COS.rod[0],lv=LINEV[clamp(+((save.gear.line||'l0').slice(1)),0,5)],col=rs.id!=='basic'?rs.line:lv.c,gl=rs.glow||lv.glow,sag=clamp(60-ten*.6,2,60),mx=(a.x+b.x)/2,my=Math.max(a.y,b.y)+sag-Math.abs(b.x-a.x)*.02;ctx.strokeStyle=ten>85?'rgba(255,170,170,.95)':col;ctx.lineWidth=lv.w+(gl?.3:0);
 if(gl){ctx.shadowColor=lv.glow||rs.line;ctx.shadowBlur=6}ctx.beginPath();ctx.moveTo(a.x,a.y);
 if(ten>85){for(let i=1;i<=12;i++){const u=i/12,x=(1-u)*(1-u)*a.x+2*(1-u)*u*mx+u*u*b.x,y=(1-u)*(1-u)*a.y+2*(1-u)*u*my+u*u*b.y;ctx.lineTo(x+(Math.random()-.5)*2,y+(Math.random()-.5)*2)}}else ctx.quadraticCurveTo(mx,my,b.x,b.y);ctx.stroke();ctx.shadowBlur=0}
function bobber(x,y,tilt=0,c=ctx,id=save.bob){const B=BOBS.find(b=>b.id===id)||BOBS[0];c.save();c.translate(x,y);c.rotate(tilt);
 if((id==='star'&&isNight())||id==='goldbob'){const gl=c.createRadialGradient(0,0,2,0,0,22);gl.addColorStop(0,id==='goldbob'?'rgba(255,220,90,.6)':'rgba(255,240,150,.7)');gl.addColorStop(1,'rgba(255,240,150,0)');c.fillStyle=gl;c.beginPath();c.arc(0,0,22,0,7);c.fill()}
 if(id==='heart'){c.fillStyle=B.c1;c.beginPath();c.moveTo(0,8);c.bezierCurveTo(-10,0,-7,-8,0,-3);c.bezierCurveTo(7,-8,10,0,0,8);c.fill();c.strokeStyle=OL;c.lineWidth=1.5;c.stroke()}
 else if(id==='star'){c.fillStyle=B.c2;c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?3.5:8;c.lineTo(Math.cos(a)*r,Math.sin(a)*r+1)}c.closePath();c.fill();c.strokeStyle=OL;c.lineWidth=1.5;c.stroke()}
 else{c.fillStyle=B.c2;c.beginPath();c.arc(0,3,6,0,Math.PI);c.fill();c.fillStyle=B.c1;c.beginPath();c.arc(0,3,6,Math.PI,0);c.fill();c.strokeStyle=OL;c.lineWidth=1.5;c.beginPath();c.arc(0,3,6,0,7);c.stroke()}
 c.fillStyle=B.c1;c.fillRect(-1,-10,2,6);c.restore()}
function lureDraw(x,y,t){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*6)*.3);ctx.fillStyle='#c8d8e8';ctx.strokeStyle=OL;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,0,9,4,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#ff6a6a';ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(-14,-4);ctx.lineTo(-14,4);ctx.fill();ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(-4,-2,6,1.5);ctx.restore()}
function sinker(x,y){ctx.fillStyle='#8a8a9a';ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(x,y,4,6,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#ffcf6b';ctx.beginPath();ctx.arc(x+4,y+8,2.5,0,7);ctx.fill()}
function bar(x,y,w,h,v,col,label,right){ctx.fillStyle='rgba(255,247,232,.96)';ctx.strokeStyle=OL;ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(x,y,w,h,h/2);ctx.fill();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x+3,y+3,Math.max(0,(w-6)*clamp(v,0,1)),h-6,(h-6)/2);ctx.fill();
 if(label)txt(label,x+4,y-5,15,'#fff','left');if(right)txt(right,x+w-4,y-5,15,'#fff','right')}
function txt(s,x,y,size,col='#fff',al='center'){ctx.font=size+'px '+FONT;ctx.textAlign=al;ctx.lineWidth=Math.max(3,size/7);ctx.strokeStyle=OL;ctx.strokeText(s,x,y);ctx.fillStyle=col;ctx.fillText(s,x,y);ctx.textAlign='left'}

function render(t){const g=G(),P=pal();ctx.save();const shk=save.set.calm?0:shake;if(shk)ctx.translate((Math.random()-.5)*shk,(Math.random()-.5)*shk);
 if(zoom>0&&S==='land'){const k=1+zoom*.18,fx=fg.lx||W/2,fy=fg.ly||H/2;ctx.translate(fx,fy);ctx.scale(k,k);ctx.translate(-fx,-fy)}
 drawSky(g,P,t);drawFar(g,P,t);drawSea(g,P,t);
 if(fever>0||goldenT>0||legendT>0){ctx.fillStyle=fever>0?`hsla(${t*120%360},90%,70%,.12)`:legendT>0?'rgba(255,140,220,.1)':'rgba(255,215,80,.12)';ctx.fillRect(0,0,W,g.surf)}
 crit.forEach(a=>{const y=a.bottom?a.y0:a.y0+Math.sin(t*1.5+a.seed)*8;a.y=y;const sx=a.turn!=null?Math.cos(a.turn*Math.PI):1;ctx.save();ctx.translate(a.x,y);ctx.scale(sx,1);drawCritter(ctx,a.f,0,0,a.L,a.dir,t,{seed:a.seed});ctx.restore()});
 if(school){for(let i=0;i<12;i++){const x=school.x+Math.sin(t*2+i)*55+(i%4-2)*10,y=g.surf+30+(i*7)%40+Math.sin(t*3+i)*6;drawCritter(ctx,FID.jeoneo,x,y,22,Math.cos(t*2+i)>0?1:-1,t,{seed:i})}}
 if(jumpEv){const u=jumpEv.t;if(u<1){const x=jumpEv.x+u*40,y=g.surf-Math.sin(u*Math.PI)*70;ctx.save();ctx.translate(x,y);ctx.rotate(-.8+u*1.6);drawCritter(ctx,jumpEv.f,0,0,40,1,t,{seed:3});ctx.restore()}
  else{const a=1-(jumpEv.t-1)/(jumpEv.life-1);ctx.strokeStyle=`rgba(255,230,120,${a*.8})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(jumpEv.x+20,g.surf+4,26+Math.sin(t*4)*4,6,0,0,7);ctx.stroke();txt('✨',jumpEv.x+20,g.surf-12,16)}}
 if(app&&(S==='wait'||S==='bite')){if(fg.rare){ctx.globalAlpha=.7;txt(app.f.v?'🌈':'✨',app.x,app.y-app.L*.45-Math.sin(t*4)*4,18);ctx.globalAlpha=1}drawCritter(ctx,app.f,app.x,app.y,app.L,app.dir,t,{seed:app.seed,mood:S==='bite'?'o':'',v:app.f.v})}
 drawPlatform(g,t);
 let n='idle',ex={},hy=g.ch;
 arriveT=Math.max(0,arriveT-DOLLDT);
 if(S==='ready'&&arriveT>0){n=arriveT>.9?'run':'walk';ex.dx=-arriveT*g.ch*.35;ex.sq=Math.abs(Math.sin(t*12))*.02}
 else if(S==='ready'&&idleT>9){n='sit';hy=g.ch*.86}
 else if(S==='title'||S==='ready'){n=(t%4)<.5?'wink':'idle';ex.sq=Math.sin(t*3)*.012}
 else if(S==='rest'){n='rest';hy=g.ch*.85}
 else if(S==='charge'){n='castready';ex.shake=power*3;ex.rot=-power*.08}
 else if(S==='cast')n=T<.16?'castready':'cast';
 else if(S==='wait'){n='wait';if(tipShake)ex.shake=tipShake*2}else if(S==='bite')n='hook';
 else if(S==='hook'){n='reel';ex.shake=4}
 else if(S==='fight'){n=fg.surge>0||fg.charge>0?'fight':holding?'reel':'wait';if(fg.surge>0)ex.shake=2+fish.p*.6;ex.rot=clamp((fg.ten-50)/100,0,.5)*.12}
 else if(S==='land')n='lift';
 else if(S==='result'&&lastRes){const r=lastRes;n=r.f.r===0||r.f.k==='jelly'?'surprise':(r.f.k==='chest'||r.rec||r.f.r>=4||r.f.v)&&(t%1)<.5?'jump':(t%1.2)<.6?'success':'happy'}
 else if(S==='fail')n='fail';
 const m0=save.method,hp0=hookPoint(g);let lt=null,lten=20;
 if(S==='cast'&&T>.16)lt={x:bob.x,y:bob.y};else if((S==='wait'||S==='bite')&&bob.on)lt=isBobberM()?{x:bob.x,y:g.surf}:{x:bob.x,y:g.surf};else if(S==='fight'){lt={x:fg.fx,y:fg.fy};lten=holding?fg.ten:fg.ten*.5}else if(S==='hook'){lt=hp0;lten=60}
 let tip0;if(DM()){const dn=dollPose(n);dollStep(DOLL,dn.pose,DOLLDT);DOLL.crankMul=S==='fight'&&holding?(fg.gs?fg.gs.spd:1):.25;
  const r=drawDoll(ctx,g.cx,g.platY+4,hy*(n==='rest'?1.12:1),DOLL,t,{lineTo:lt,ten:lten,tipShake:tipShake,mood:dn.mood,hold:dn.hold});tip0=r.tip;DOLLR=r;
  if(dn.hold&&lastRes)drawCritter(ctx,lastRes.f,r.head.x+g.ch*.02,r.head.y-g.ch*.34+Math.sin(t*6)*3,Math.min(g.ch*.75,critL(lastRes.f)),1,t,{seed:3,mood:'happy',v:lastRes.f.v})}
 else tip0=sprite(n,g.cx,g.platY+4,hy,ex);
 drawPet(g,t);
 if(S==='fight'&&fg.ten>80&&!LOWGFX&&Math.random()<.1)parts.push({x:g.cx+g.ch*.1,y:g.platY-g.ch*.85,vx:rnd(-20,20),vy:-40,l:.6,t:0,c:'#9fe0ff',r:2.5,g:1});
 if(S==='rest')txt('♪',g.cx+g.ch*.35,g.platY-g.ch*.8-Math.sin(t*2)*8,24);
 const m=save.method,hp=hookPoint(g);
 if(S==='cast'&&T>.16){const tp=RT(tip0,bob,20);fline(tp,bob,30);if(isBobberM())bobber(bob.x,bob.y);else if(m==='lure')lureDraw(bob.x,bob.y,t);else sinker(bob.x,bob.y)}
 if((S==='wait'||S==='bite')&&bob.on){
  if(isBobberM()){const y=g.surf+Math.sin(t*2.5)*2+bob.dip,tp=RT(tip0,{x:bob.x,y},20);fline(tp,{x:bob.x,y:y-6},20);
   ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bob.x,y+8);ctx.lineTo(bob.x,g.surf+38);ctx.stroke();ctx.fillStyle='#ffcf6b';ctx.beginPath();ctx.arc(bob.x,g.surf+40,3,0,7);ctx.fill();
   ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(bob.x,g.surf+4,12+(t*20)%20,3+(t*5)%5,0,0,7);ctx.stroke();
   if(S==='bite'){if(fish.bp==='float')bobber(bob.x,y,.9);else{ctx.globalAlpha=.55;bobber(bob.x,g.surf+6);ctx.globalAlpha=1}const s=1+Math.sin(T*30)*.08;ctx.save();ctx.translate(bob.x,g.surf-44);ctx.scale(s,s);txt(fg.rare?'!!':'!',0,0,fg.rare?62:54,fg.rare?'#ffe066':'#ffd23f');ctx.restore()}else bobber(bob.x,y,bob.dx*.02)}
  else{const tp=RT(tip0,{x:bob.x,y:g.surf},S==='bite'?70:25);fline(tp,{x:bob.x,y:g.surf},25);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bob.x,g.surf);ctx.lineTo(bob.x,bob.y);ctx.stroke();
   if(m==='lure')lureDraw(bob.x,bob.y,t);else sinker(bob.x,bob.y);
   if(S==='bite'){const s=1+Math.sin(T*30)*.08;ctx.save();ctx.translate(tp.x+10,tp.y-30);ctx.scale(s,s);txt(fg.rare?'!!':'!',0,0,fg.rare?56:48,'#ffd23f');ctx.restore();txt('🔔',tp.x-14,tp.y-10,18)}
   if(m==='lure'&&S==='wait'){const k=clamp(fg.lprog/(fg.bite*.5),0,1);bar(W/2-80,g.top+44,160,12,k,'#7fd0ff','관심도');if(T-fg.lastTw>1.8)txt('탭! 탭!',bob.x,bob.y-24,18,'#bfefff')}
   if(m==='deep'){const cur=Math.round(curDepth*(1-(bob.sink?clamp((g.bed-30-bob.y)/(g.bed-30-g.surf),0,1):0)));bar(W/2-90,g.top+44,180,14,cur/300,'#5a8aff','수심',`${cur}m / ${curDepth}m`)}}}
 if(S==='fight'||S==='hook'){const fx=S==='fight'?fg.fx:hp.x,fy=S==='fight'?fg.fy:hp.y,surge=S==='fight'&&(fg.surge>0||fg.charge>0),Lc=critL(fish),dir=surge?1:-1,head=['fish','eel','sunfish','billfish','hammer','dolphin','orca','dwhale','catfish','sturgeon','moray','dragon','oar','angler','file','box'].includes(fish.k);
  const tp=RT(tip0,{x:fx,y:fy},S==='fight'?(holding?fg.ten:fg.ten*.5):40);fline(tp,{x:fx,y:fy},S==='fight'?(holding?fg.ten:fg.ten*.5):40);
  if(S==='fight'&&fg.chance>0){ctx.strokeStyle=`rgba(255,230,90,${fg.chance/.75})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(fx,fy,Lc*.6+(1-fg.chance/.75)*20,0,7);ctx.stroke();txt('지금!',fx,fy-Lc*.6-10,20,'#ffe066')}
  if(S==='fight'&&fg.ex>0){ctx.strokeStyle=`rgba(255,120,200,${fg.ex})`;ctx.lineWidth=5;ctx.beginPath();ctx.arc(fx,fy,Lc*.7+Math.sin(T*20)*4,0,7);ctx.stroke();txt('결정타! 탭!',fx,fy-Lc*.7-12,22,'#ffb0e0')}
  if(S==='fight'&&fg.charge>0)txt('돌진 준비!',fx,fy-Lc*.5-10,20,'#ff8a8a');
  ctx.save();if(fg.air>0){ctx.translate(fx,fy);ctx.rotate(Math.sin(T*12)*.4-.3);ctx.translate(-fx,-fy)}
  drawCritter(ctx,fish,fx-(head?dir*Lc*.45:0),fy,Lc,dir,t,{seed:1,mood:surge||fg.roar>0?'hurt':holding?'o':'',v:fish.v,inflate:fish.k==='puffer'?(surge?1:clamp(1-fg.hp/100,0,1)):0});ctx.restore();
  if(S==='fight'&&fg.inkT>0){const a=clamp(fg.inkT/1.6,0,1);ctx.fillStyle=`rgba(30,15,45,${a*.75})`;ctx.beginPath();ctx.ellipse(fx,fy,Lc*1.4,Lc*.9,0,0,7);ctx.fill();if(fg.boss&&fg.fm==='ink'){ctx.fillStyle=`rgba(20,10,35,${a*.35})`;ctx.fillRect(0,g.surf,W,g.bed-g.surf)}}
  if(S==='fight'){const bw=Math.min(W*.8,360),bx=(W-bw)/2,by=g.top+28,hide=fg.inkT>0?.3:1;ctx.save();ctx.globalAlpha=hide;
   const z0=bx+3+(bw-6)*.55,z1=bx+3+(bw-6)*.85;ctx.fillStyle='rgba(255,247,232,.96)';ctx.strokeStyle=OL;ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(bx,by,bw,20,10);ctx.fill();ctx.stroke();
   ctx.fillStyle='rgba(92,207,106,.35)';ctx.fillRect(z0,by+3,z1-z0,14);ctx.fillStyle='rgba(255,77,77,.3)';ctx.fillRect(z1,by+3,bx+bw-3-z1,14);
   ctx.fillStyle=fg.ten>85?'#ff4d4d':fg.ten>=55?'#3fbf6a':fg.ten<8?'#9aa7b0':'#ffb13d';ctx.beginPath();ctx.roundRect(bx+3,by+3,Math.max(0,(bw-6)*clamp(fg.ten/100,0,1)),14,7);ctx.fill();
   txt('줄 장력',bx+4,by-5,15,'#fff','left');txt(fg.air>0?'점프! 손 떼요':fg.ten>85?'위험! 손 떼요':fg.ten>=55?'손맛 최고!':fg.ten<8?'줄이 느슨해요':'',bx+bw-4,by-5,15,fg.ten>85||fg.air>0?'#ff8a8a':'#b6ffc4','right');ctx.restore();
   bar(bx,by+46,bw,fg.boss?20:16,fg.hp/100,fg.boss?'#ff5a5a':'#ff7a6a',(fish.giant?'초대형 ':'')+(fg.boss?fish.n:'물고기 체력'),fg.boss?`${fg.phase+1}/3단계`:RAR[fish.r].n);
   if(fg.boss){for(const k of[.33,.66]){ctx.fillStyle=OL;ctx.fillRect(bx+3+(bw-6)*k-1,by+46,2,20)}}}}
 if(S==='charge'){const bw=Math.min(W*.62,280),bx=(W-bw)/2,by=g.top+40;bar(bx,by,bw,22,power,power>.92?'#ff4d4d':power>.68?'#a57fe0':'#ffb13d',save.method==='deep'?'내릴 깊이':'던질 힘',save.method==='deep'?Math.round(50+power*250)+'m':power>.68?'먼바다 · 희귀 ↑':'가까이')}
 if(S==='land'&&fish){const k=Math.min(1,T/.85),ex2=g.cx+g.ch*.35,ey=g.platY-g.ch*.75,x=fg.lx+(ex2-fg.lx)*k,y=fg.ly+(ey-fg.ly)*k-Math.sin(k*Math.PI)*(90+critL(fish)*.3);ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(k*Math.PI)*-.6+Math.sin(T*25)*.25*(1-k));drawCritter(ctx,fish,0,0,Math.min(fish.giant||fish.boss?150:110,critL(fish)),-1,t,{seed:1,mood:k<.8?'hurt':'happy',v:fish.v});ctx.restore();if(Math.random()<.5)parts.push({x,y,vx:rnd(-40,40),vy:rnd(-20,40),l:.6,t:0,c:'#d6f3ff',r:2.5,g:1})}
 for(const r of rings){const k=r.t/r.life;ctx.strokeStyle=`rgba(${r.col},${(1-k)*.8})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(r.x,r.y,r.max*k+3,(r.max*k+3)*.28,0,0,7);ctx.stroke()}
 for(const q of parts){ctx.globalAlpha=Math.max(0,1-q.t/q.l);ctx.fillStyle=q.c;if(q.star){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.t*4);ctx.fillRect(-q.r,-q.r/3,q.r*2,q.r*.66);ctx.fillRect(-q.r/3,-q.r,q.r*.66,q.r*2);ctx.restore()}else if(q.heart){const r=q.r*1.6;ctx.beginPath();ctx.moveTo(q.x,q.y+r);ctx.bezierCurveTo(q.x-r*1.6,q.y,q.x-r*.9,q.y-r*1.2,q.x,q.y-r*.3);ctx.bezierCurveTo(q.x+r*.9,q.y-r*1.2,q.x+r*1.6,q.y,q.x,q.y+r);ctx.fill()}else{ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.fill()}}ctx.globalAlpha=1;
 lifeFront(g,t);
 if(rainAmt>.05){ctx.fillStyle=`rgba(40,50,70,${rainAmt*.18+stormAmt*.12})`;ctx.fillRect(0,0,W,H)}
 if(curLoc().w==='deep'&&!LOWGFX){ctx.fillStyle='rgba(0,5,20,.15)';ctx.fillRect(0,g.surf,W,g.bed-g.surf)}
 const v=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.4,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,`rgba(0,10,25,${(S==='bite'&&fg.rare)||(S==='fight'&&(fg.boss||fish.r>=5))?.5:.22})`);ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
 if(flash>0){ctx.fillStyle=`rgba(${flashCol},${flash*(save.set.calm?.15:.6)})`;ctx.fillRect(0,0,W,H)}
 ctx.restore()}
