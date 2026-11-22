/* ================= 레이어 캐릭터(옷 입히기 인형) ================= */
// 꾸미기 아이템: 상의·하의·코스튬·모자·헤어·신발·장갑·액세서리·가방
// 낚시 장비 외형
const RODV=[{len:1.0,w:2.6,col:'#a8743f',grip:'#6a4a2a',rings:3,tipc:'#a8743f',bamboo:1},{len:1.08,w:2.6,col:'#e8e0d0',grip:'#5a5a6a',rings:4,tipc:'#ff6a5a'},{len:1.16,w:2.4,col:'#2b2b3a',grip:'#8a5a3a',rings:5,tipc:'#ffd23f'},{len:1.24,w:2.4,col:'#1a3a6a',grip:'#2b2b2b',rings:6,tipc:'#7fd0ff',stripe:'#c0d8ff'},{len:1.32,w:2.6,col:'#8a9aaa',grip:'#2b2b3a',rings:6,tipc:'#ffffff',stripe:'#ffd23f',metal:1},{len:1.42,w:3,col:'#ffcf3a',grip:'#2a4ab0',rings:7,tipc:'#7ff0ff',stripe:'#ffffff',trident:1,glow:'#ffe680'}];
const REELV=[{r:.045,col:'#8a8a9a',sp:'#5a5a6a'},{r:.05,col:'#c0c8d0',sp:'#7a8a9a'},{r:.05,col:'#2b2b3a',sp:'#e8504a',bait:1},{r:.055,col:'#e8e8f0',sp:'#2a6ab0'},{r:.06,col:'#3a3a4a',sp:'#ffd23f'},{r:.066,col:'#ffcf3a',sp:'#2a4ab0',glow:1}];
const LINEV=[{c:'rgba(255,255,255,.85)',w:1.2},{c:'rgba(200,240,255,.9)',w:1.3},{c:'#7fe08a',w:1.5},{c:'#ffb040',w:1.6,gloss:1},{c:'#e8f8ff',w:1.8,gloss:1,glow:'#bff4ff'},{c:'#ffe680',w:2,gloss:1,glow:'#fff3a0'}];
const POSES={
 idle:{lean:0,head:.05,rod:-1.05,bx:.1,by:.03,st:.05,kn:0,sit:0},
 show:{lean:0,head:.04,rod:-1.45,bx:.23,by:.02,st:.06,kn:0,sit:0},
 charge:{lean:-.3,head:-.12,rod:-2.6,bx:-.14,by:-.07,st:.09,kn:.25,sit:0},
 cast:{lean:.24,head:.12,rod:-.42,bx:.16,by:-.04,st:.1,kn:.2,sit:0},
 wait:{lean:0,head:.08,rod:-.75,bx:.12,by:.01,st:.06,kn:.05,sit:0},
 hook:{lean:-.22,head:-.1,rod:-1.4,bx:.08,by:-.05,st:.09,kn:.2,sit:0},
 reel:{lean:-.12,head:0,rod:-.85,bx:.11,by:.0,st:.08,kn:.15,sit:0,crank:1},
 fight:{lean:-.34,head:-.14,rod:-1.05,bx:.09,by:-.02,st:.12,kn:.38,sit:0,crank:1},
 lift:{lean:-.2,head:-.16,rod:-1.75,bx:.05,by:-.1,st:.09,kn:.2,sit:0},
 success:{lean:-.05,head:-.12,rod:-1.55,bx:.03,by:-.2,st:.06,kn:0,sit:0,cheer:1},
 big:{lean:-.1,head:-.22,rod:-1.9,bx:-.02,by:-.26,st:.1,kn:.1,sit:0,cheer:2},
 surprise:{lean:-.16,head:-.06,rod:-1.2,bx:.04,by:-.1,st:.08,kn:.1,sit:0,cheer:3},
 fail:{lean:.38,head:.38,rod:-.12,bx:.17,by:-.02,st:.1,kn:0,sit:1},
 rest:{lean:-.05,head:.12,rod:-.5,bx:.13,by:-.07,st:.1,kn:0,sit:1}};
function mkDoll(){return{p:Object.assign({},POSES.idle),pose:'idle',crankA:0,vy:0,lastY:0,hatLag:0,jump:0}}
function dollStep(d,pose,dt){d.pose=pose;const tg=POSES[pose]||POSES.idle,k=Math.min(1,dt*11);for(const key in tg){if(typeof tg[key]==='number')d.p[key]=(d.p[key]??0)+(tg[key]-(d.p[key]??0))*(key==='sit'||key==='cheer'||key==='crank'?Math.min(1,dt*16):k)}for(const key of['cheer','crank'])if(tg[key]==null)d.p[key]=(d.p[key]||0)*(1-Math.min(1,dt*16));if(d.p.crank>.3)d.crankA+=dt*14*(d.crankMul??1)}
// 2관절 IK: 어깨 s → 손 목표 t
function ik(s,t,a,b,bendSign){const dx=t.x-s.x,dy=t.y-s.y;let dd=Math.hypot(dx,dy);const mx=a+b-.001;let tx=t.x,ty=t.y;if(dd>mx){tx=s.x+dx/dd*mx;ty=s.y+dy/dd*mx;dd=mx}dd=Math.max(dd,Math.abs(a-b)+.001);const ang=Math.atan2(ty-s.y,tx-s.x),c=clamp((a*a+dd*dd-b*b)/(2*a*dd),-1,1),e=ang+bendSign*Math.acos(c);return{e:{x:s.x+Math.cos(e)*a,y:s.y+Math.sin(e)*a},h:{x:tx,y:ty}}}
function limb(c,pts,w,col,outline=true){c.beginPath();c.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)c.lineTo(pts[i].x,pts[i].y);c.lineCap='round';c.lineJoin='round';if(outline){c.lineWidth=w+3;c.strokeStyle=OL;c.stroke()}c.lineWidth=w;c.strokeStyle=col;c.stroke()}
function shade(col,k){return hexMix(col,k>0?'#ffffff':'#2b2140',Math.abs(k))}
// 인형 그리기: x,y 발 위치, h 키. 반환: 낚싯대 끝·릴·손 위치
function drawDoll(c,x,y,h,d,t,o={}){
 const w=o.wear||save.ward.wear,p=d.p,dir=o.dir||1,ten=o.ten||0,hold=o.hold||null;
 const top=WGET('top',w.top),bot=WGET('bottom',w.bottom),cos=w.costume&&w.costume!=='none'?WGET('costume',w.costume):null,hat=WGET('hat',w.hat),hair=WGET('hair',w.hair),shoe=WGET('shoes',w.shoes),glove=WGET('gloves',w.gloves),acc=w.acc,bag=w.bag;
 const gr=o.gear||save.gear,rv=RODV[clamp(+((gr.rod||'r0').slice(1)),0,5)],ev=REELV[clamp(+((gr.reel||'e0').slice(1)),0,5)];
 const skin='#ffe1c8',U=h,lw=Math.max(1.6,h*.012);
 const jumpY=(p.cheer>.5?-Math.abs(Math.sin(t*(p.cheer>1.5?7:5)))*h*(p.cheer>1.5?.08:.05):0);
 const breathe=Math.sin(t*2.2)*h*.004;
 c.save();c.translate(x,y);c.scale(dir,1);c.lineJoin='round';c.lineCap='round';
 // 그림자
 c.fillStyle='rgba(20,30,50,.22)';c.beginPath();c.ellipse(p.sit>.5?h*.08:0,0,h*.2,h*.035,0,0,7);c.fill();
 c.translate(0,jumpY);
 const sitK=p.sit,hip={x:sitK*-.02*U,y:-(.33-.2*sitK)*U+breathe};
 const lean=p.lean,R=(px,py,a)=>({x:px*Math.cos(a)-py*Math.sin(a),y:px*Math.sin(a)+py*Math.cos(a)});
 const nk=R(0,-.22*U,lean),neck={x:hip.x+nk.x,y:hip.y+nk.y};
 const hd=R(0,-.18*U,lean+p.head),head={x:neck.x+hd.x,y:neck.y+hd.y},HR=.2*U;
 const sF0=R(.05*U,.03*U,lean),sB0=R(-.05*U,.03*U,lean);const shF={x:neck.x+sF0.x,y:neck.y+sF0.y},shB={x:neck.x+sB0.x,y:neck.y+sB0.y};
 // 다리 목표
 const st=p.st*U,knee=p.kn;let fF,fB;
 if(sitK>.5){fF={x:hip.x+.22*U,y:-.02*U};fB={x:hip.x+.16*U,y:-.015*U}}else{fF={x:st,y:0};fB={x:-st*.8,y:0}}
 const lF=ik({x:hip.x+.035*U,y:hip.y},fF,.17*U,.16*U,sitK>.5?1:-1),lB=ik({x:hip.x-.035*U,y:hip.y},fB,.17*U,.16*U,sitK>.5?1:-1);
 // 낚싯대
 const rodA=p.rod+(o.rodJitter||0),u={x:Math.cos(rodA),y:Math.sin(rodA)},butt={x:hip.x+p.bx*U,y:hip.y+p.by*U},RL=rv.len*U*(o.rodScale||1);
 let hF={x:butt.x+u.x*.22*U,y:butt.y+u.y*.22*U},hB={x:butt.x+u.x*.05*U,y:butt.y+u.y*.05*U};
 const reelP={x:butt.x+u.x*.11*U-u.y*.045*U,y:butt.y+u.y*.11*U+u.x*.045*U};
 if(p.crank>.3){const a=d.crankA;hB={x:reelP.x+Math.cos(a)*.035*U,y:reelP.y+Math.sin(a)*.035*U}}
 if(p.cheer>.5){if(p.cheer<1.5){hF={x:shF.x+.21*U,y:shF.y-.13*U+Math.sin(t*10)*.012*U}}else if(p.cheer<2.5){hF={x:head.x+.12*U,y:head.y-.24*U};hB={x:head.x-.1*U,y:head.y-.24*U}}else{hF={x:shF.x+.2*U,y:shF.y-.12*U};hB={x:shB.x-.12*U,y:shB.y-.15*U}}}
 if(hold){hF={x:head.x+.14*U,y:head.y-.22*U};hB={x:head.x-.08*U,y:head.y-.24*U}}
 const aF=ik(shF,hF,.12*U,.115*U,1),aB=ik(shB,hB,.12*U,.115*U,1);
 // 실제 손에 맞춘 낚싯대 축
 let rb,rdir;if(p.cheer>.5||hold){rb={x:aB.h.x,y:aB.h.y};rdir=u;if(p.cheer>1.5||hold){rb={x:aF.h.x-.05*U,y:aF.h.y+.25*U};rdir={x:Math.cos(-1.45),y:Math.sin(-1.45)}}if(p.cheer<1.5&&p.cheer>.5){rb={x:aB.h.x-u.x*.07*U,y:aB.h.y-u.y*.07*U}}}else{rb={x:aF.h.x-u.x*.22*U,y:aF.h.y-u.y*.22*U};rdir=u}
 const tip0={x:rb.x+rdir.x*RL,y:rb.y+rdir.y*RL};
 const bend=clamp(ten/100,0,1)*(1.25-.12*(+((gr.rod||'r0').slice(1))))*.32*RL,toL=o.lineTo?{x:(o.lineTo.x-x)*dir,y:o.lineTo.y-y-jumpY}:null;
 let bx=0,by=0;if(toL&&bend>0){const dx=toL.x-tip0.x,dy=toL.y-tip0.y,dl=Math.hypot(dx,dy)||1;bx=dx/dl*bend;by=dy/dl*bend}
 const shk=o.tipShake?Math.sin(t*60)*o.tipShake*.012*U:0;
 const tip={x:tip0.x+bx+shk,y:tip0.y+by},ctrl={x:rb.x+rdir.x*RL*.6+bx*.2,y:rb.y+rdir.y*RL*.6+by*.2};
 const bagC=bag==='cooler'?'#4fb3e8':bag==='tackle'?'#5a7a4a':'#6a7a3a';
 // ---- 뒤 레이어: 망토·꼬리·가방
 const tor=(fn)=>{c.save();c.translate(hip.x,hip.y);c.rotate(lean);fn();c.restore()};
 if(top.cape&&!cos){tor(()=>{c.fillStyle=top.cape;c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.moveTo(-.1*U,-.24*U);c.quadraticCurveTo(-.26*U+Math.sin(t*2.5)*.03*U,-.05*U,-.22*U+Math.sin(t*3)*.04*U,.24*U-hip.y-.02*U);c.lineTo(-.02*U,.2*U-hip.y-.02*U);c.quadraticCurveTo(-.08*U,0,-.02*U,-.24*U);c.closePath();c.fill();c.stroke()})}
 if(cos&&cos.id!=='octo'){tor(()=>{const wg=Math.sin(t*4)*.15;c.save();c.translate(-.1*U,.02*U);c.rotate(.6+wg);c.fillStyle=cos.c;c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();if(cos.id==='shark'){c.moveTo(0,0);c.quadraticCurveTo(-.12*U,-.02*U,-.2*U,-.1*U);c.lineTo(-.17*U,.02*U);c.lineTo(-.22*U,.1*U);c.quadraticCurveTo(-.1*U,.06*U,0,.04*U)}else{c.ellipse(-.03*U,.02*U,.05*U,.03*U,0,0,7)}c.closePath();c.fill();c.stroke();c.restore()})}
 if(bag!=='none'&&!cos){tor(()=>{const bb=Math.sin(t*3)*.004*U+(p.cheer>.5?Math.sin(t*12)*.01*U:0);c.save();c.translate(-.15*U,-.13*U+bb);c.fillStyle=bagC;c.strokeStyle=OL;c.lineWidth=lw;
  if(bag==='tackle'){c.beginPath();c.roundRect(-.06*U,.02*U,.13*U,.1*U,.015*U);c.fill();c.stroke();c.fillStyle='#ffd23f';c.fillRect(-.06*U,.05*U,.13*U,.012*U);c.fillStyle='#3a3a3a';c.fillRect(-.012*U,.0,.024*U,.025*U)}
  else{c.beginPath();c.roundRect(-.06*U,-.06*U,.11*U,.16*U,.03*U);c.fill();c.stroke();c.fillStyle=shade(bagC,-.15);c.beginPath();c.roundRect(-.07*U,.02*U,.1*U,.07*U,.02*U);c.fill();c.stroke();if(bag==='cooler'){c.fillStyle='#fff';c.fillRect(-.06*U,-.045*U,.11*U,.02*U)}else{c.strokeStyle='#ffd23f';c.lineWidth=lw*.7;c.beginPath();c.moveTo(-.05*U,.025*U);c.lineTo(.02*U,.025*U);c.stroke()}}
  c.restore()})}
 // 뒤팔
 const sleeveC=cos?cos.c:top.c,sleeveW=.085*U*(top.puffy||cos?1.18:1)*(top.wide?1.1:1);
 const drawArm=(a,sh,front)=>{const cuff=top.sleeve==='short'&&!cos;
  if(cuff){limb(c,[sh,a.e],sleeveW,shade(sleeveC,front?0:-.12));limb(c,[a.e,a.h],.06*U,skin)}else{limb(c,[sh,a.e,a.h],sleeveW,shade(sleeveC,front?0:-.12));
   const mx=(a.e.x+a.h.x)/2,my=(a.e.y+a.h.y)/2;c.strokeStyle='rgba(43,33,64,.25)';c.lineWidth=lw*.6;c.beginPath();c.arc(a.e.x,a.e.y,sleeveW*.3,0,Math.PI);c.stroke();
   if(top.puffy&&!cos){c.beginPath();c.moveTo(mx-3,my-3);c.lineTo(mx+3,my+3);c.stroke()}
   const cdx=a.h.x-a.e.x,cdy=a.h.y-a.e.y,cl=Math.hypot(cdx,cdy)||1,cxp=a.h.x-cdx/cl*sleeveW*.55,cyp=a.h.y-cdy/cl*sleeveW*.55;limb(c,[{x:cxp-cdy/cl*sleeveW*.5,y:cyp+cdx/cl*sleeveW*.5},{x:cxp+cdy/cl*sleeveW*.5,y:cyp-cdx/cl*sleeveW*.5}],sleeveW*.35,cos?cos.c2:top.trim?top.c2:shade(top.c,-.18),false)}
  const gc=glove.id==='none'?skin:glove.c;c.fillStyle=gc;c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.arc(a.h.x,a.h.y,.04*U*(glove.puffy?1.25:1),0,7);c.fill();c.stroke();
  if(glove.finger){c.fillStyle=skin;for(let i=0;i<3;i++){c.beginPath();c.arc(a.h.x+.03*U,a.h.y-.02*U+i*.018*U,.01*U,0,7);c.fill()}}
  if(glove.shine){c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(a.h.x-.012*U,a.h.y-.014*U,.01*U,0,7);c.fill()}};
 drawArm(aB,shB,false);
 // 다리·신발
 const legC=cos?cos.c:bot.c;
 const drawLeg=(l,front)=>{const kn0={x:l.e.x,y:l.e.y},ft=l.h;const lc=shade(legC,front?0:-.12);
  if(bot.short&&!cos){limb(c,[{x:hip.x+(front?.035:-.035)*U,y:hip.y},kn0],.1*U,lc);limb(c,[kn0,ft],.065*U,skin)}
  else{limb(c,[{x:hip.x+(front?.035:-.035)*U,y:hip.y},kn0,ft],.095*U*(bot.puffy?1.15:1),lc);
   if(bot.stripe&&!cos){c.save();c.strokeStyle=bot.c2;c.lineWidth=.02*U;for(let i=1;i<4;i++){const q={x:lerp(kn0.x,ft.x,i/4),y:lerp(kn0.y,ft.y,i/4)};c.beginPath();c.moveTo(q.x-.04*U,q.y);c.lineTo(q.x+.04*U,q.y);c.stroke()}c.restore()}
   if(bot.side&&!cos){limb(c,[{x:hip.x+(front?.06:-.01)*U,y:hip.y},{x:kn0.x+.025*U,y:kn0.y},{x:ft.x+.02*U,y:ft.y-.03*U}],.012*U,bot.c2,false)}
   if(bot.pk&&front&&!cos){const q={x:lerp(hip.x,kn0.x,.55)+.02*U,y:lerp(hip.y,kn0.y,.55)};c.fillStyle=bot.c2;c.strokeStyle=OL;c.lineWidth=lw*.7;c.beginPath();c.roundRect(q.x-.025*U,q.y-.02*U,.05*U,.045*U,.008*U);c.fill();c.stroke()}
   if(bot.panel&&!cos){c.fillStyle=bot.c2;c.beginPath();c.arc(kn0.x+.01*U,kn0.y,.025*U,0,7);c.fill()}
   if(bot.gloss&&!cos){limb(c,[{x:kn0.x+.02*U,y:kn0.y-.04*U},{x:kn0.x+.02*U,y:kn0.y+.03*U}],.012*U,'rgba(255,255,255,.5)',false)}
   if(bot.stitch&&!cos){c.save();c.setLineDash([.012*U,.012*U]);limb(c,[{x:hip.x+(front?.06:-.01)*U,y:hip.y+.01*U},{x:kn0.x+.03*U,y:kn0.y},{x:ft.x+.025*U,y:ft.y-.04*U}],.006*U,bot.stitch,false);c.restore()}
   if(bot.shine&&!cos){c.fillStyle='rgba(255,255,255,.75)';star5(c,kn0.x+.015*U,kn0.y-.03*U,.012*U*(1+Math.sin(t*5)*.3))}}
  // 신발
  const sh=cos&&cos.id==='penguin'?{c:'#ff9a2a',c2:'#e07a10'}:shoe;c.save();c.translate(ft.x,ft.y);c.fillStyle=sh.c;c.strokeStyle=OL;c.lineWidth=lw;
  if(shoe.sandal&&!cos){c.fillStyle=skin;c.beginPath();c.ellipse(.03*U,-.015*U,.055*U,.025*U,0,0,7);c.fill();c.stroke();c.strokeStyle=shoe.c;c.lineWidth=.012*U;c.beginPath();c.moveTo(0,-.03*U);c.lineTo(.04*U,-.005*U);c.moveTo(.04*U,-.035*U);c.lineTo(.04*U,0);c.stroke()}
  else{const tall=(shoe.tall||0)*(cos?0:1);c.beginPath();c.moveTo(-.035*U,-.02*U-tall*.035*U);c.lineTo(.02*U,-.02*U-tall*.035*U);c.quadraticCurveTo(.075*U,-.025*U,.08*U,0);c.lineTo(-.04*U,0);c.closePath();c.fill();c.stroke();c.fillStyle=sh.c2;c.fillRect(-.04*U,-.008*U,.12*U,.008*U);
   if(shoe.id==='sneak'&&!cos){c.strokeStyle=shoe.c2;c.lineWidth=lw*.8;c.beginPath();c.moveTo(0,-.018*U);c.lineTo(.04*U,-.012*U);c.stroke()}
   if((shoe.gloss||shoe.shine)&&!cos){c.fillStyle='rgba(255,255,255,.6)';c.fillRect(-.02*U,-.02*U-tall*.03*U,.012*U,tall*.03*U+.008*U)}
   if(shoe.tall===1&&!cos&&!shoe.shine){c.strokeStyle='#e8d0a0';c.lineWidth=lw*.5;for(let i=0;i<2;i++){c.beginPath();c.moveTo(-.01*U,-.03*U-i*.01*U);c.lineTo(.015*U,-.026*U-i*.01*U);c.stroke()}}}
  c.restore()};
 drawLeg(lB,false);
 // 골반(바지 윗부분)
 c.fillStyle=legC;c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.ellipse(hip.x,hip.y,.08*U,.05*U,lean,0,7);c.fill();c.stroke();
 drawLeg(lF,true);
 // ---- 몸통(상의)
 tor(()=>{const hemExtra=(top.long?.1:top.ty==='robe'?.13:top.ty==='coat'?.06:top.ty==='tee'?0:.03)*U*(cos?0:1),sway=Math.sin(t*2.3)*.006*U+(p.cheer>.5?Math.sin(t*12)*.008*U:0)+(d.p.lean<-.25?.008*U:0);
  const wd=(top.wide||top.puffy===2?1.1:1)*(cos?1.08:1),tw=.13*U*wd,bw=.135*U*wd*(top.ty==='robe'?1.15:1),ty0=-.235*U,hy=.02*U+hemExtra;
  const body=()=>{c.beginPath();c.moveTo(-tw+.03*U,ty0);c.quadraticCurveTo(-tw-.005*U,ty0,-tw,ty0+.04*U);c.lineTo(-bw+sway,hy);c.quadraticCurveTo(0,hy+.015*U,bw+sway,hy);c.lineTo(tw,ty0+.04*U);c.quadraticCurveTo(tw+.005*U,ty0,tw-.03*U,ty0);c.closePath()};
  if(top.col==='hood'&&!cos){c.fillStyle=shade(top.c,-.1);c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.ellipse(-.07*U,ty0-.01*U,.08*U,.05*U,-.3,0,7);c.fill();c.stroke()}
  const mainC=cos?cos.c:top.c;const g=c.createLinearGradient(-tw,0,tw,0);g.addColorStop(0,shade(mainC,-.14));g.addColorStop(.6,mainC);g.addColorStop(1,shade(mainC,.08));
  body();c.fillStyle=g;c.fill();c.save();body();c.clip();
  if(cos){c.fillStyle=cos.c2;c.beginPath();c.ellipse(.03*U,-.08*U,.08*U,.12*U,0,0,7);c.fill();if(cos.id==='octo'){c.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<6;i++){c.beginPath();c.arc(-.08*U+(i%3)*.07*U,-.2*U+Math.floor(i/3)*.08*U,.012*U,0,7);c.fill()}}}
  else{
   if(top.pat==='stripe'){c.fillStyle=top.c2;for(let i=0;i<7;i++)c.fillRect(-.2*U,ty0+.012*U+i*.038*U,.4*U,.016*U)}
   if(top.pat==='denim'){c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;for(let i=-10;i<10;i++){c.beginPath();c.moveTo(i*.02*U,ty0);c.lineTo(i*.02*U+.1*U,hy);c.stroke()}}
   if(top.pat==='scale'){c.strokeStyle='rgba(255,215,80,.35)';c.lineWidth=1;for(let j=0;j<6;j++)for(let i=0;i<7;i++){c.beginPath();c.arc(-.15*U+i*.05*U+(j%2)*.025*U,ty0+.03*U+j*.04*U,.02*U,0,Math.PI);c.stroke()}}
   if(top.pat==='stars'){c.fillStyle='rgba(255,250,200,.8)';for(let i=0;i<7;i++)star5(c,-.1*U+(i*.37%1)*.2*U,ty0+.03*U+(i*.61%1)*.2*U,.01*U*(1+Math.sin(t*4+i)*.4))}
   if(top.block){c.fillStyle=top.c2;c.beginPath();c.moveTo(-.2*U,-.12*U);c.lineTo(.2*U,-.16*U);c.lineTo(.2*U,-.1*U);c.lineTo(-.2*U,-.06*U);c.fill()}
   if(top.ty==='vest'){c.fillStyle=top.c2;c.beginPath();c.moveTo(-.02*U,ty0);c.lineTo(.06*U,ty0);c.lineTo(.04*U,-.1*U);c.closePath();c.fill()}
   if(top.puffy){c.strokeStyle='rgba(43,33,64,.18)';c.lineWidth=lw*.7;for(let i=1;i<(top.puffy===2?6:5);i++){c.beginPath();c.moveTo(-.2*U,ty0+i*.05*U);c.quadraticCurveTo(0,ty0+i*.05*U+.012*U,.2*U,ty0+i*.05*U);c.stroke()}}
   if(top.reflect){c.fillStyle='#e8eef4';const ys=top.reflect===2?[-.17,-.07]:[-.1];ys.forEach(yy=>{c.fillRect(-.2*U,yy*U,.4*U,.022*U);c.fillStyle='rgba(255,255,255,.9)';c.fillRect(-.2*U+((t*.4)%1)*.4*U,yy*U,.03*U,.022*U);c.fillStyle='#e8eef4'})}
   if(top.panel){c.fillStyle=top.c2;c.fillRect(-.2*U,-.05*U,.4*U,.02*U);c.beginPath();c.roundRect(.0,-.17*U,.07*U,.05*U,.008*U);c.fill();c.fillStyle='#ff5a5a';c.beginPath();c.arc(.02*U,-.145*U,.008*U,0,7);c.fill();c.fillStyle='#7fff9a';c.beginPath();c.arc(.045*U,-.145*U,.008*U,0,7);c.fill()}
   if(top.lights){for(const yy of[-.18,-.1]){c.fillStyle=`rgba(120,240,255,${.6+.4*Math.sin(t*4+yy*20)})`;c.beginPath();c.arc(.08*U,yy*U,.012*U,0,7);c.fill()}}
   if(top.gloss){c.fillStyle=`rgba(255,255,255,${top.gloss})`;c.beginPath();c.ellipse(.06*U,-.15*U,.025*U,.07*U,-.3,0,7);c.fill()}
   if(top.shine){c.fillStyle='rgba(255,255,255,.55)';const sx=((t*.5)%1.6-.3)*.4*U;c.beginPath();c.moveTo(sx-.2*U,ty0);c.lineTo(sx-.17*U,ty0);c.lineTo(sx-.3*U,hy);c.lineTo(sx-.33*U,hy);c.fill()}
  }
  c.restore();body();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  if(!cos){
   c.strokeStyle='rgba(43,33,64,.25)';c.lineWidth=lw*.6;c.setLineDash([.01*U,.008*U]);c.beginPath();c.moveTo(-tw+.012*U,ty0+.05*U);c.lineTo(-bw+.015*U+sway,hy-.01*U);c.stroke();c.setLineDash([]);
   c.strokeStyle='rgba(43,33,64,.2)';c.beginPath();c.moveTo(-.04*U,hy-.035*U);c.quadraticCurveTo(-.02*U,hy-.05*U,0,hy-.035*U);c.moveTo(.03*U,hy-.03*U);c.quadraticCurveTo(.05*U,hy-.045*U,.07*U,hy-.03*U);c.stroke();
   if(top.zip){c.strokeStyle=top.trim?top.c2:'#8a8a9a';c.lineWidth=lw*1.1;c.beginPath();c.moveTo(.05*U,ty0+.01*U);c.lineTo(.05*U+sway*.5,hy-.005*U);c.stroke();c.strokeStyle='rgba(43,33,64,.4)';c.lineWidth=1;for(let i=0;i<8;i++){const yy=ty0+.02*U+i*(hy-ty0)/9;c.beginPath();c.moveTo(.045*U,yy);c.lineTo(.055*U,yy);c.stroke()}c.fillStyle='#c0c8d0';c.strokeStyle=OL;c.lineWidth=lw*.6;c.beginPath();c.roundRect(.04*U,ty0+.03*U+Math.sin(t*3)*.003*U,.02*U,.03*U,.005*U);c.fill();c.stroke()}
   if(top.btn||top.snap){for(let i=0;i<4;i++){c.fillStyle=top.snap?'#f0f0f0':shade(top.c,-.35);c.strokeStyle=OL;c.lineWidth=lw*.5;c.beginPath();c.arc(.05*U,ty0+.04*U+i*.055*U,.011*U,0,7);c.fill();c.stroke()}}
   if(top.dbtn){for(let i=0;i<3;i++)for(const xx of[.0,.08]){c.fillStyle='#ffd23f';c.strokeStyle=OL;c.lineWidth=lw*.5;c.beginPath();c.arc(xx*U,ty0+.05*U+i*.06*U,.012*U,0,7);c.fill();c.stroke()}}
   if(top.kanga){c.fillStyle=shade(top.c,-.08);c.strokeStyle=OL;c.lineWidth=lw*.7;c.beginPath();c.moveTo(-.05*U,-.03*U);c.lineTo(-.03*U,-.09*U);c.lineTo(.1*U,-.09*U);c.lineTo(.12*U,-.03*U);c.closePath();c.fill();c.stroke();c.strokeStyle='#fff';c.lineWidth=lw*.8;for(const xx of[.03,.07]){c.beginPath();c.moveTo(xx*U,ty0+.01*U);c.lineTo(xx*U+Math.sin(t*3+xx*50)*.005*U,ty0+.07*U);c.stroke()}}
   const pk=top.pk||0;for(let i=0;i<pk;i++){const px=(i%2?.07:-.07)*U+(i%2?0:.02*U),py=(i<2?-.06:-.17)*U;c.fillStyle=shade(top.ty==='vest'?top.c:top.c,-.08);c.strokeStyle=OL;c.lineWidth=lw*.6;c.beginPath();c.roundRect(px-.035*U,py-.025*U,.06*U,.05*U,.008*U);c.fill();c.stroke();if(top.flap){c.fillStyle=shade(top.c,-.15);c.beginPath();c.roundRect(px-.037*U,py-.03*U,.064*U,.016*U,.004*U);c.fill();c.stroke()}c.strokeStyle=top.stitch||'rgba(255,255,255,.35)';c.setLineDash([.006*U,.006*U]);c.beginPath();c.moveTo(px-.03*U,py+.018*U);c.lineTo(px+.02*U,py+.018*U);c.stroke();c.setLineDash([])}
   if(top.ring){c.strokeStyle='#c0c8d0';c.lineWidth=lw*.8;c.beginPath();c.arc(-.1*U,-.2*U,.012*U,0,7);c.stroke()}
   if(top.cross){c.fillStyle='#fff';c.fillRect(-.12*U,-.19*U,.05*U,.016*U);c.fillRect(-.103*U,-.207*U,.016*U,.05*U)}
   if(top.patch){c.fillStyle='#2a6ab0';c.beginPath();c.arc(-.09*U,-.17*U,.022*U,0,7);c.fill();c.fillStyle='#fff';c.font=`${.022*U}px ${FONT}`;c.textAlign='center';c.fillText('⚓',-.09*U,-.162*U);c.textAlign='left'}
   if(top.logo){c.fillStyle='#fff';star5(c,.06*U,-.15*U,.03*U)}
   if(top.trim){c.strokeStyle=top.c2;c.lineWidth=lw*1.4;body();c.stroke()}
   if(top.tube){c.strokeStyle='#8a9aaa';c.lineWidth=lw*1.6;c.beginPath();c.moveTo(-.1*U,-.2*U);c.quadraticCurveTo(-.2*U,-.1*U,-.12*U,-.03*U);c.stroke()}
   // 칼라
   c.lineWidth=lw;c.strokeStyle=OL;
   if(top.col==='high'||top.col==='fur'){c.fillStyle=top.col==='fur'?'#fff':shade(top.c,-.06);c.beginPath();c.roundRect(-.07*U,ty0-.035*U,.14*U,.05*U,.02*U);c.fill();c.stroke();if(top.col==='fur'){c.fillStyle='#f0ece4';for(let i=0;i<6;i++){c.beginPath();c.arc(-.06*U+i*.024*U,ty0-.035*U,.014*U,0,7);c.fill()}}}
   else if(top.col==='shirt'||top.col==='jabot'){c.fillStyle=top.col==='jabot'?'#fff':shade(top.c,.1);for(const sd of[-1,1]){c.beginPath();c.moveTo(.0,ty0+.005*U);c.lineTo(sd*.06*U,ty0-.012*U);c.lineTo(sd*.045*U+.01*U,ty0+.05*U);c.closePath();c.fill();c.stroke()}if(top.col==='jabot'){c.beginPath();for(let i=0;i<3;i++)c.arc(.02*U,ty0+.03*U+i*.022*U,.016*U,0,7);c.fill();c.stroke()}}
   else if(top.col==='round'||top.col==='rib'){c.strokeStyle=top.col==='rib'?shade(top.c,-.2):top.c2;c.lineWidth=.014*U;c.beginPath();c.arc(.0,ty0-.005*U,.05*U,.1,Math.PI-.1);c.stroke()}
   else if(top.col==='royal'){c.fillStyle=top.c2;c.beginPath();c.moveTo(-.1*U,ty0);c.quadraticCurveTo(0,ty0+.08*U,.1*U,ty0);c.lineTo(.08*U,ty0-.03*U);c.quadraticCurveTo(0,ty0+.03*U,-.08*U,ty0-.03*U);c.closePath();c.fill();c.stroke();c.fillStyle='#ff5a7a';c.beginPath();c.arc(0,ty0+.035*U,.015*U,0,7);c.fill();c.stroke()}
   else if(top.col==='ring'){c.fillStyle='#c0c8d0';c.beginPath();c.ellipse(0,ty0-.01*U,.09*U,.03*U,0,0,7);c.fill();c.stroke()}
   else if(top.col==='hood'){c.fillStyle=shade(top.c,-.12);c.beginPath();c.ellipse(-.02*U,ty0,.075*U,.025*U,0,0,7);c.fill();c.stroke()}
   if(bot.susp){c.strokeStyle=bot.c;c.lineWidth=.022*U;for(const xx of[-.06,.07]){c.beginPath();c.moveTo(xx*U,ty0);c.lineTo(xx*U,hy);c.stroke()}}
   if(acc==='scarf'){c.fillStyle='#e8504a';c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.roundRect(-.08*U,ty0-.03*U,.16*U,.045*U,.02*U);c.fill();c.stroke();c.save();c.translate(-.05*U,ty0);c.rotate(.3+Math.sin(t*4)*.15);c.beginPath();c.roundRect(-.12*U,-.005*U,.12*U,.035*U,.01*U);c.fill();c.stroke();c.fillStyle='#fff';c.fillRect(-.1*U,.005*U,.015*U,.02*U);c.fillRect(-.07*U,.005*U,.015*U,.02*U);c.restore()}}
  else{c.fillStyle=cos.c;c.strokeStyle=OL;c.lineWidth=lw;if(cos.id==='shark'){c.beginPath();c.moveTo(-.04*U,ty0);c.lineTo(-.12*U,ty0-.11*U);c.lineTo(.02*U,ty0-.02*U);c.closePath();c.fill();c.stroke()}}});
 // ---- 머리
 const drawHead=()=>{c.save();c.translate(head.x,head.y);c.rotate(lean+p.head);const hc=hair.c,mood=o.mood||'smile';
  const hood=cos?cos:null;
  if(hood){c.fillStyle=hood.c;c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.arc(0,-.01*U,HR*1.22,0,7);c.fill();c.stroke();
   if(hood.id==='octo'){for(let i=0;i<5;i++){c.save();c.translate((-.18+i*.09)*U,.18*U);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(Math.sin(t*3+i)*.04*U,.08*U,Math.sin(t*3+i+1)*.05*U,.14*U);c.lineWidth=.045*U+3;c.strokeStyle=OL;c.stroke();c.lineWidth=.045*U;c.strokeStyle=hood.c;c.stroke();c.restore()}}}
  else{c.fillStyle=hc;c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.ellipse(-.03*U,-.02*U,HR*1.02,HR*1.0,0,0,7);c.fill();c.stroke()}
  // 얼굴
  c.fillStyle=skin;c.strokeStyle=OL;c.lineWidth=lw;if(!hood){c.beginPath();c.ellipse(-.15*U,.04*U,.025*U,.034*U,0,0,7);c.fill();c.stroke()}c.beginPath();c.ellipse(.02*U,.02*U,HR*.9,HR*.86,0,0,7);c.fill();c.stroke();
  // 앞머리
  if(!hood){c.fillStyle=hc;c.beginPath();c.moveTo(-.18*U,-.02*U);c.quadraticCurveTo(-.15*U,-.2*U,.04*U,-.19*U);c.quadraticCurveTo(.18*U,-.17*U,.2*U,-.05*U);
   const sp=hair.short?.02:hair.curly?.05:.04;for(let i=0;i<5;i++){const xx=.17*U-i*.07*U;c.lineTo(xx-.035*U,-.06*U+(i%2)*sp*U);c.lineTo(xx-.07*U,-.1*U)}c.closePath();c.fill();c.stroke();
   if(hair.curly){c.fillStyle=hc;for(let i=0;i<4;i++){c.beginPath();c.arc(-.16*U+i*.03*U,.06*U+i*.01*U,.03*U,0,7);c.fill();c.stroke()}}}
  else if(hood.id==='penguin'){c.fillStyle='#ff9a2a';c.strokeStyle=OL;c.beginPath();c.moveTo(.04*U,-.2*U);c.lineTo(.16*U,-.17*U);c.lineTo(.05*U,-.15*U);c.closePath();c.fill();c.stroke();c.fillStyle=OL;c.beginPath();c.arc(-.03*U,-.2*U,.015*U,0,7);c.arc(.07*U,-.21*U,.015*U,0,7);c.fill()}
  else if(hood.id==='shark'){c.fillStyle='#fff';for(let i=0;i<7;i++){c.beginPath();c.moveTo((-.15+i*.05)*U,-.17*U+Math.abs(i-3)*.01*U);c.lineTo((-.125+i*.05)*U,-.12*U+Math.abs(i-3)*.01*U);c.lineTo((-.1+i*.05)*U,-.17*U+Math.abs(i-3)*.01*U);c.fill();c.stroke()}c.fillStyle=hood.c;c.beginPath();c.moveTo(-.06*U,-.24*U);c.lineTo(-.02*U,-.36*U);c.lineTo(.06*U,-.24*U);c.closePath();c.fill();c.stroke()}
  else if(hood.id==='octo'){c.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<4;i++){c.beginPath();c.arc(-.12*U+i*.08*U,-.2*U,.018*U,0,7);c.fill()}}
  // 눈·안경·입
  const ex=[.04*U,.13*U],eyY=.02*U,er=.022*U,blink=((t+.3)%3.6)<.13||mood==='sleep';
  for(const xx of ex){if(blink||mood==='happy'){c.strokeStyle=OL;c.lineWidth=lw*1.2;c.beginPath();if(mood==='happy')c.arc(xx,eyY+.01*U,er,Math.PI+.4,-.4);else c.arc(xx,eyY,er,.3,Math.PI-.3);c.stroke()}
   else if(mood==='grit'){c.strokeStyle=OL;c.lineWidth=lw*1.3;c.beginPath();c.moveTo(xx-er,eyY-er);c.lineTo(xx+er*.6,eyY);c.lineTo(xx-er,eyY+er);c.stroke()}
   else{c.fillStyle='#3a2a22';c.beginPath();c.ellipse(xx,eyY,er*.85,er*1.1,0,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(xx+er*.3,eyY-er*.4,er*.35,0,7);c.fill();if(mood==='o'||mood==='wow'){c.beginPath();c.arc(xx-er*.2,eyY+er*.4,er*.2,0,7);c.fill()}}}
  if(mood==='sad'){c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.moveTo(.0,-.04*U);c.lineTo(.07*U,-.025*U);c.moveTo(.17*U,-.04*U);c.lineTo(.1*U,-.025*U);c.stroke()}
  if(acc==='glasses'){c.strokeStyle='#6a3a1a';c.lineWidth=lw*1.2;for(const xx of ex){c.beginPath();c.arc(xx,eyY,er*2.1,0,7);c.stroke()}c.beginPath();c.moveTo(ex[0]+er*2.1,eyY);c.lineTo(ex[1]-er*2.1,eyY);c.moveTo(ex[0]-er*2.1,eyY);c.lineTo(-.08*U,eyY-.01*U);c.stroke()}
  if(acc==='sun'){c.fillStyle='#1a1a2a';for(const xx of ex){c.beginPath();c.ellipse(xx,eyY,er*2.2,er*1.7,0,0,7);c.fill()}c.strokeStyle='#1a1a2a';c.lineWidth=lw*1.2;c.beginPath();c.moveTo(ex[0],eyY);c.lineTo(ex[1],eyY);c.moveTo(ex[0]-er*2,eyY);c.lineTo(-.08*U,eyY-.01*U);c.stroke();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(ex[1]-er,eyY-er,er*.6,er*.6)}
  c.fillStyle='rgba(255,120,150,.4)';c.beginPath();c.ellipse(.02*U,.08*U,.025*U,.014*U,0,0,7);c.ellipse(.16*U,.08*U,.022*U,.013*U,0,0,7);c.fill();
  c.strokeStyle=OL;c.lineWidth=lw*1.1;c.beginPath();const mx=.1*U,my=.1*U;
  if(mood==='o'||mood==='wow'){c.fillStyle='#c04a5a';c.ellipse(mx,my+.005*U,.016*U,.022*U,0,0,7);c.fill();c.stroke()}
  else if(mood==='grit'){c.fillStyle='#fff';c.roundRect(mx-.025*U,my-.01*U,.05*U,.022*U,.006*U);c.fill();c.stroke()}
  else if(mood==='sad'){c.arc(mx,my+.025*U,.022*U,Math.PI+.5,-.5);c.stroke()}
  else if(mood==='happy'){c.fillStyle='#c04a5a';c.arc(mx,my-.005*U,.028*U,0,Math.PI);c.closePath();c.fill();c.stroke()}
  else if(mood==='sleep'){c.arc(mx,my,.01*U,0,7);c.stroke()}
  else{c.arc(mx,my-.012*U,.02*U,.3,Math.PI-.3);c.stroke()}
  // 모자
  const hlag=d.hatLag||0;c.save();c.translate(0,hlag);
  if(!hood){c.lineWidth=lw;c.strokeStyle=OL;
   if(hat.id==='cap'){c.fillStyle='#2b2b33';c.beginPath();c.ellipse(-.01*U,-.07*U,HR*1.03,HR*.82,0,Math.PI,0);c.closePath();c.fill();c.stroke();c.beginPath();c.ellipse(.17*U,-.07*U,.13*U,.035*U,.08,0,7);c.fill();c.stroke();c.strokeStyle='#fff';c.lineWidth=lw*1.2;c.beginPath();c.moveTo(-.02*U,-.16*U);c.quadraticCurveTo(.0,-.19*U,.02*U,-.16*U);c.quadraticCurveTo(.04*U,-.13*U,.06*U,-.16*U);c.stroke();c.fillStyle='rgba(255,255,255,.15)';c.beginPath();c.ellipse(-.06*U,-.2*U,.05*U,.02*U,-.3,0,7);c.fill()}
   else if(hat.id==='beanie'){c.fillStyle='#e85a6a';c.beginPath();c.ellipse(0,-.06*U,HR*1.04,HR*.95,0,Math.PI,0);c.closePath();c.fill();c.stroke();c.strokeStyle='rgba(43,33,64,.2)';for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(i*.04*U,-.07*U);c.lineTo(i*.035*U,-.2*U+Math.abs(i)*.015*U);c.stroke()}c.fillStyle='#ffd0d6';c.strokeStyle=OL;c.beginPath();c.roundRect(-.21*U,-.09*U,.42*U,.055*U,.02*U);c.fill();c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(0,-.27*U+Math.sin(t*4)*.004*U,.04*U,0,7);c.fill();c.stroke()}
   else if(hat.id==='straw'){c.fillStyle='#f2cf6a';c.beginPath();c.ellipse(.02*U,-.08*U,.32*U,.06*U,.03,0,7);c.fill();c.stroke();c.beginPath();c.ellipse(0,-.1*U,.17*U,.13*U,0,Math.PI,0);c.closePath();c.fill();c.stroke();c.fillStyle='#e8504a';c.fillRect(-.17*U,-.13*U,.34*U,.03*U);c.strokeStyle='rgba(160,110,30,.5)';c.lineWidth=1;for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(i*.04*U,-.1*U);c.lineTo(i*.05*U,-.04*U);c.stroke()}}
   else if(hat.id==='bucket'){c.fillStyle='#8aa060';c.beginPath();c.moveTo(-.28*U,-.04*U);c.lineTo(-.17*U,-.11*U);c.lineTo(-.15*U,-.24*U);c.quadraticCurveTo(0,-.28*U,.15*U,-.24*U);c.lineTo(.17*U,-.11*U);c.lineTo(.3*U,-.04*U);c.quadraticCurveTo(0,-.08*U,-.28*U,-.04*U);c.fill();c.stroke();c.strokeStyle='rgba(40,60,20,.5)';c.beginPath();c.moveTo(-.17*U,-.11*U);c.quadraticCurveTo(0,-.13*U,.17*U,-.11*U);c.stroke()}
   else if(hat.id==='captain'){c.fillStyle='#fff';c.beginPath();c.ellipse(0,-.17*U,.2*U,.07*U,0,0,7);c.fill();c.stroke();c.fillStyle='#2b2b3a';c.beginPath();c.roundRect(-.17*U,-.16*U,.34*U,.07*U,.02*U);c.fill();c.stroke();c.beginPath();c.ellipse(.15*U,-.09*U,.1*U,.025*U,.1,0,7);c.fill();c.stroke();c.fillStyle='#ffd23f';c.font=`${.06*U}px ${FONT}`;c.textAlign='center';c.fillText('⚓',0,-.13*U);c.textAlign='left'}
   else if(hat.id==='tricorn'){c.fillStyle='#2b2b3a';c.beginPath();c.moveTo(-.28*U,-.08*U);c.quadraticCurveTo(0,-.42*U,.3*U,-.08*U);c.quadraticCurveTo(0,-.16*U,-.28*U,-.08*U);c.fill();c.stroke();c.strokeStyle='#ffd23f';c.lineWidth=lw*1.2;c.beginPath();c.moveTo(-.24*U,-.1*U);c.quadraticCurveTo(0,-.2*U,.26*U,-.1*U);c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(0,-.2*U,.03*U,0,7);c.fill()}
   else if(hat.id==='icecrown'||hat.id==='seacrown'){c.fillStyle=hat.id==='icecrown'?'rgba(200,240,255,.95)':'#ffd23f';c.beginPath();c.moveTo(-.14*U,-.14*U);for(let i=0;i<5;i++){c.lineTo(-.14*U+.056*U*i+.028*U,-.28*U-(i%2)*.05*U);c.lineTo(-.14*U+.056*U*(i+1),-.16*U)}c.closePath();c.fill();c.stroke();c.fillStyle=hat.id==='icecrown'?'#fff':'#ff5a7a';c.beginPath();c.arc(0,-.19*U,.018*U,0,7);c.fill();if(hat.id==='seacrown'){c.fillStyle='#7ff0ff';c.beginPath();c.arc(-.08*U,-.19*U,.012*U,0,7);c.arc(.08*U,-.19*U,.012*U,0,7);c.fill()}}
   else if(hat.id==='helmet'){c.fillStyle='rgba(200,230,255,.28)';c.beginPath();c.arc(.02*U,-.02*U,HR*1.3,0,7);c.fill();c.strokeStyle='#c0c8d0';c.lineWidth=lw*2;c.stroke();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(.12*U,-.14*U,.04*U,.08*U,.5,0,7);c.fill();c.fillStyle='#c0c8d0';c.fillRect(-.12*U,.2*U,.28*U,.04*U)}}
  // 액세서리(머리)
  if(acc==='catears'){c.fillStyle=hood?hood.c:'#2b2b3a';c.strokeStyle=OL;c.lineWidth=lw;for(const sd of[-1,1]){c.beginPath();c.moveTo(sd*.06*U,-.2*U);c.lineTo(sd*.14*U,-.33*U);c.lineTo(sd*.18*U,-.17*U);c.fill();c.stroke();c.fillStyle='#ffb0c8';c.beginPath();c.moveTo(sd*.09*U,-.2*U);c.lineTo(sd*.14*U,-.29*U);c.lineTo(sd*.16*U,-.19*U);c.fill();c.fillStyle=hood?hood.c:'#2b2b3a'}}
  else if(acc==='flower'){const fx=.15*U,fy=-.13*U;for(let i=0;i<5;i++){c.fillStyle='#ff9ec4';c.beginPath();c.arc(fx+Math.cos(i*1.26)*.025*U,fy+Math.sin(i*1.26)*.025*U,.02*U,0,7);c.fill()}c.fillStyle='#ffd23f';c.beginPath();c.arc(fx,fy,.016*U,0,7);c.fill()}
  else if(acc==='headphones'){c.strokeStyle='#5a6aff';c.lineWidth=.03*U;c.beginPath();c.arc(-.02*U,-.02*U,.22*U,Math.PI*1.05,Math.PI*1.95);c.stroke();c.fillStyle='#5a6aff';c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.roundRect(-.26*U,-.04*U,.06*U,.1*U,.02*U);c.fill();c.stroke()}
  else if(acc==='halo'){c.strokeStyle='#ffe066';c.lineWidth=.025*U;c.beginPath();c.ellipse(0,-.33*U+Math.sin(t*2)*.01*U,.13*U,.035*U,0,0,7);c.stroke();c.strokeStyle='rgba(255,230,100,.35)';c.lineWidth=.06*U;c.stroke()}
  c.restore();c.restore()};
 drawHead();
 // ---- 낚싯대·릴
 const ri=+((gr.rod||'r0').slice(1)),skinR=o.rodSkin||save.wear.rod;const rsk=COS.rod.find(r=>r.id===skinR);const rodCol=rsk&&rsk.id!=='basic'?(rsk.id==='sakura'?'#ffb0cc':rsk.id==='neon'?'#3ae0ff':rsk.id==='goldrod'?'#ffcf3a':'#9a50e0'):rv.col;
 c.strokeStyle=OL;c.lineWidth=rv.w*1.4+3;c.beginPath();c.moveTo(rb.x,rb.y);c.quadraticCurveTo(ctrl.x,ctrl.y,tip.x,tip.y);c.stroke();
 const rg=c.createLinearGradient(rb.x,rb.y,tip.x,tip.y);rg.addColorStop(0,rodCol);rg.addColorStop(1,shade(rodCol,.25));c.strokeStyle=rg;c.lineWidth=rv.w*1.4;c.stroke();
 if(rv.bamboo){c.strokeStyle='rgba(80,50,20,.6)';c.lineWidth=2;for(let i=1;i<5;i++){const k=i/5,px=lerp(lerp(rb.x,ctrl.x,k),lerp(ctrl.x,tip.x,k),k),py=lerp(lerp(rb.y,ctrl.y,k),lerp(ctrl.y,tip.y,k),k);c.beginPath();c.arc(px,py,rv.w*.8,0,7);c.stroke()}}
 if(rv.stripe){c.strokeStyle=rv.stripe;c.lineWidth=1;c.beginPath();c.moveTo(rb.x+rdir.y*1.2,rb.y-rdir.x*1.2);c.quadraticCurveTo(ctrl.x,ctrl.y-1,tip.x,tip.y);c.stroke()}
 for(let i=1;i<=rv.rings;i++){const k=.2+i/(rv.rings+1)*.8,px=lerp(lerp(rb.x,ctrl.x,k),lerp(ctrl.x,tip.x,k),k),py=lerp(lerp(rb.y,ctrl.y,k),lerp(ctrl.y,tip.y,k),k);c.strokeStyle=rv.metal?'#e8eef4':'#c0c8d0';c.lineWidth=1.2;c.beginPath();c.arc(px-rdir.y*3,py+rdir.x*3,1.8+(1-k)*1.2,0,7);c.stroke()}
 c.strokeStyle=rv.grip;c.lineWidth=rv.w*2.6;c.beginPath();c.moveTo(rb.x,rb.y);c.lineTo(rb.x+rdir.x*.13*U,rb.y+rdir.y*.13*U);c.stroke();
 if(rv.glow){c.fillStyle=rv.glow;c.globalAlpha=.4+.3*Math.sin(t*4);c.beginPath();c.arc(tip.x,tip.y,.035*U,0,7);c.fill();c.globalAlpha=1}
 if(rv.trident){c.strokeStyle='#ffd23f';c.lineWidth=2;c.save();c.translate(tip.x,tip.y);c.rotate(Math.atan2(tip.y-ctrl.y,tip.x-ctrl.x));c.beginPath();c.moveTo(0,0);c.lineTo(.04*U,0);for(const s2 of[-1,0,1]){c.moveTo(.03*U,s2*.015*U);c.lineTo(.06*U,s2*.02*U)}c.stroke();c.restore()}
 if(rsk&&rsk.id==='kraken'){c.strokeStyle='#c070ff';c.lineWidth=2;c.beginPath();for(let i=0;i<3;i++){c.moveTo(tip.x,tip.y);c.quadraticCurveTo(tip.x+Math.sin(t*3+i)*8,tip.y-10-i*4,tip.x+Math.cos(t*2+i)*10,tip.y-18-i*3)}c.stroke()}
 c.fillStyle=rv.tipc;c.beginPath();c.arc(tip.x,tip.y,1.8,0,7);c.fill();
 // 릴
 const rp={x:rb.x+rdir.x*.11*U-rdir.y*.045*U,y:rb.y+rdir.y*.11*U+rdir.x*.045*U},rr=ev.r*U;
 c.strokeStyle=OL;c.lineWidth=2;c.beginPath();c.moveTo(rb.x+rdir.x*.11*U,rb.y+rdir.y*.11*U);c.lineTo(rp.x,rp.y);c.stroke();
 if(ev.glow){c.fillStyle='rgba(255,230,120,.35)';c.beginPath();c.arc(rp.x,rp.y,rr*1.8,0,7);c.fill()}
 c.fillStyle=ev.col;c.strokeStyle=OL;c.lineWidth=lw;c.beginPath();c.arc(rp.x,rp.y,rr,0,7);c.fill();c.stroke();c.fillStyle=ev.sp;c.beginPath();c.arc(rp.x,rp.y,rr*.6,0,7);c.fill();
 const ca=d.crankA;c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.5;c.beginPath();c.moveTo(rp.x+Math.cos(ca*2)*rr*.5,rp.y+Math.sin(ca*2)*rr*.5);c.lineTo(rp.x-Math.cos(ca*2)*rr*.5,rp.y-Math.sin(ca*2)*rr*.5);c.stroke();
 c.strokeStyle=OL;c.lineWidth=2;c.beginPath();c.moveTo(rp.x,rp.y);c.lineTo(rp.x+Math.cos(ca)*rr*1.2,rp.y+Math.sin(ca)*rr*1.2);c.stroke();c.fillStyle=ev.col;c.beginPath();c.arc(rp.x+Math.cos(ca)*rr*1.2,rp.y+Math.sin(ca)*rr*1.2,rr*.3,0,7);c.fill();c.stroke();
 // 앞팔
 drawArm(aF,shF,true);
 c.restore();
 const tw=(q)=>({x:x+q.x*dir,y:y+jumpY+q.y});
 return{tip:tw(tip),reel:tw(rp),hand:tw(aF.h),handB:tw(aB.h),head:tw(head)}}
