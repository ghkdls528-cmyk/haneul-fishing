/* ================= 귀여운 바다 친구 그리기 ================= */
const OL='#2b2140';
function fs(c,fill,lw){c.fillStyle=fill;c.fill();c.lineWidth=lw;c.strokeStyle=OL;c.stroke()}
function eye(c,x,y,r,t,s,m,et){c.lineCap='round';
 if(m==='hurt'){c.strokeStyle=OL;c.lineWidth=r*.42;c.beginPath();c.moveTo(x-r*.6,y-r*.6);c.lineTo(x+r*.4,y);c.lineTo(x-r*.6,y+r*.6);c.stroke();return}
 if(m==='happy'){c.strokeStyle=OL;c.lineWidth=r*.4;c.beginPath();c.arc(x,y+r*.25,r*.65,Math.PI+.35,-.35);c.stroke();return}
 if(((t+s*1.7)%3.6)<.13){c.strokeStyle=OL;c.lineWidth=r*.36;c.beginPath();c.arc(x,y,r*.68,.25,Math.PI-.25);c.stroke();return}
 c.fillStyle='#fff';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.lineWidth=r*.2;c.strokeStyle=OL;c.stroke();
 c.fillStyle=et==='red'?'#e0405a':OL;c.beginPath();c.arc(x+r*.16,y+r*.08,r*.64,0,7);c.fill();
 c.fillStyle='#fff';if(et==='sparkle'){star5(c,x+r*.3,y-r*.15,r*.32)}else{c.beginPath();c.arc(x+r*.36,y-r*.22,r*.26,0,7);c.fill()}c.beginPath();c.arc(x-r*.02,y+r*.32,r*.12,0,7);c.fill();
 if(et==='sleepy'){c.fillStyle=OL;c.beginPath();c.arc(x,y,r*1.05,Math.PI,0);c.fill()}
 if(et==='angry'){c.strokeStyle=OL;c.lineWidth=r*.3;c.beginPath();c.moveTo(x-r*.9,y-r*1.4);c.lineTo(x+r*.8,y-r*.95);c.stroke()}}
function star5(c,x,y,r){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath();c.fill()}
function blush(c,x,y,r){c.fillStyle='rgba(255,105,140,.45)';c.beginPath();c.ellipse(x,y,r,r*.6,0,0,7);c.fill()}
function mouth(c,x,y,r,m){c.strokeStyle=OL;c.lineWidth=Math.max(1.2,r*.32);c.lineCap='round';c.beginPath();
 if(m==='hurt')c.arc(x,y+r*.5,r*.55,Math.PI+.5,-.5);else if(m==='o')c.arc(x,y,r*.35,0,7);else{c.arc(x-r*.3,y,r*.32,.2,Math.PI-.2);c.moveTo(x+r*.62,y);c.arc(x+r*.3,y,r*.32,.2,Math.PI-.2)}c.stroke()}
function face(c,x,y,L,t,s,m,gap=.11){const er=Math.max(2.4,L*.075);eye(c,x-L*gap,y,er,t,s,m);eye(c,x+L*gap,y,er,t,s,m);blush(c,x-L*gap*1.7,y+er*1.3,er*.75);blush(c,x+L*gap*1.7,y+er*1.3,er*.75);mouth(c,x,y+er*1.25,er*.75,m)}
function dbl(c,w,col){c.lineWidth=w+3;c.strokeStyle=OL;c.stroke();c.lineWidth=w;c.strokeStyle=col;c.stroke()}
function grad(c,y0,y1,a,b,mid){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);if(mid)g.addColorStop(mid,a);g.addColorStop(1,b);return g}
// 물고기가 아닌 생물: 큰 화면(도감·결과·수족관)에서는 따로 그린 뒤 입체 명암(위 빛·아래 그늘·하이라이트)을 입힘
const HQC={};function drawCritter(c,f,x,y,L,dir,t,o={}){if(FPI[f.id]&&FPI[f.id].naturalWidth&&!o.noPix){c.save();c.translate(x,y);c.scale(dir,1);if(f.r>=4||o.v){const gc=o.v==='mut'?'190,120,255':o.v==='albino'?'255,200,220':f.r>=6?'255,120,200':'255,230,120',gg=c.createRadialGradient(0,0,L*.1,0,0,L*.8);gg.addColorStop(0,`rgba(${gc},.4)`);gg.addColorStop(1,`rgba(${gc},0)`);c.fillStyle=gg;c.beginPath();c.arc(0,0,L*.8,0,7);c.fill()}const ok=drawPix(c,f,L,t,o,o.seed||0,o.mood);c.restore();if(ok)return}
 if(f.k!=='fish'&&L>=44&&!o._in&&!o.noHQ){const dp=Math.min(2,typeof DPR!=='undefined'?DPR:1),S=Math.ceil(L*2.4),key=S*dp|0;let T=HQC[key];if(!T){T=document.createElement('canvas');T.width=T.height=key;HQC[key]=T}const g=T.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,key,key);g.setTransform(dp,0,0,dp,0,0);drawCritter0(g,f,S/2,S/2,L,dir,t,Object.assign({},o,{_in:1}));
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';let gr=g.createLinearGradient(0,key*.25,0,key*.78);gr.addColorStop(0,'rgba(255,255,255,.26)');gr.addColorStop(.45,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(10,20,50,.26)');g.fillStyle=gr;g.fillRect(0,0,key,key);
  gr=g.createRadialGradient(key*.42,key*.36,0,key*.42,key*.36,key*.28);gr.addColorStop(0,'rgba(255,255,255,.3)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,key,key);g.globalCompositeOperation='source-over';
  c.drawImage(T,x-S/2,y-S/2,S,S);return}
 return drawCritter0(c,f,x,y,L,dir,t,o)}
function drawCritter0(c,f,x,y,L,dir,t,o={}){
 if(o.v&&f.r>0)f=varF(f,o.v);const s=o.seed||0,m=o.mood,lw=Math.max(1.2,L*.028),K=f.k;
 c.save();c.translate(x,y);c.scale(dir,1);c.lineJoin='round';c.lineCap='round';
 if(f.r>=4||f.glow||o.glow||o.v){const g=c.createRadialGradient(0,0,L*.1,0,0,L*.85),gc=o.v==='mut'?'190,120,255':o.v==='albino'?'255,200,220':f.glow?'150,230,255':f.r>=6?'255,120,200':'255,230,120';g.addColorStop(0,`rgba(${gc},${f.glow?.55:.45})`);g.addColorStop(1,`rgba(${gc},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,L*.85,0,7);c.fill()}
 if(K==='fish'){drawFish2(c,f,L,t,o,s,m)}
 else if(K==='octo'){const hb=Math.sin(t*3+s)*L*.03;
  for(let i=0;i<6;i++){const x0=-L*.22+i*L*.088,sw=Math.sin(t*5+i*1.3+s)*L*.08,sd=i<3?-1:1;c.beginPath();c.moveTo(x0,hb);c.quadraticCurveTo(x0+sw,L*.28,x0+sw*1.4+sd*L*.07,L*.42);c.quadraticCurveTo(x0+sw*1.6+sd*L*.12,L*.44,x0+sw*1.2+sd*L*.1,L*.36);dbl(c,L*.085,f.c);c.fillStyle=f.b;c.strokeStyle='rgba(120,40,40,.35)';c.lineWidth=Math.max(.6,L*.006);for(let k=1;k<6;k++){const u=k/6.5,xx=(1-u)*(1-u)*x0+2*(1-u)*u*(x0+sw)+u*u*(x0+sw*1.4+sd*L*.07),yy=(1-u)*(1-u)*hb+2*(1-u)*u*L*.28+u*u*L*.42;c.beginPath();c.arc(xx+L*.018,yy,L*.016*(1-u*.4),0,7);c.fill();c.stroke()}}
  c.beginPath();c.ellipse(0,-L*.13+hb,L*.3,L*.28,0,0,7);fs(c,grad(c,-L*.4,L*.1,f.c,f.b),lw);
  c.fillStyle='rgba(255,255,255,.35)';[[-.12,-.3,.05],[.1,-.32,.035],[.16,-.2,.03]].forEach(a=>{c.beginPath();c.arc(a[0]*L,a[1]*L+hb,a[2]*L,0,7);c.fill()});
  face(c,0,-L*.07+hb,L,t,s,m)}
 else if(K==='crab'){const wk=Math.sin(t*10+s);
  for(const sd of[-1,1])for(let j=0;j<3;j++){c.beginPath();c.moveTo(sd*L*.25,L*.04+j*L*.06);c.lineTo(sd*L*.42,L*.1+j*L*.07);c.lineTo(sd*L*.47,L*.25+j*L*.05+wk*sd*L*.02*(j%2?1:-1));dbl(c,L*.04,f.f)}
  for(const sd of[-1,1]){c.beginPath();c.moveTo(sd*L*.22,-L*.05);c.quadraticCurveTo(sd*L*.4,-L*.12,sd*L*.4,-L*.22);dbl(c,L*.05,f.f);
   const sn=(Math.sin(t*6+sd)+1)*.25;c.save();c.translate(sd*L*.42,-L*.3);c.beginPath();c.arc(0,0,L*.12,-Math.PI/2+sn,Math.PI*1.5-sn);c.lineTo(0,0);c.closePath();fs(c,f.c,lw);c.restore()}
  for(const sd of[-1,1]){c.beginPath();c.moveTo(sd*L*.08,-L*.12);c.lineTo(sd*L*.1,-L*.26);dbl(c,L*.03,f.f)}
  c.beginPath();c.ellipse(0,0,L*.34,L*.21,0,0,7);fs(c,grad(c,-L*.2,L*.2,f.c,f.b),lw);
  const er=Math.max(2.4,L*.065);eye(c,-L*.1,-L*.29,er,t,s,m);eye(c,L*.1,-L*.29,er,t,s,m);blush(c,-L*.18,L*.02,L*.05);blush(c,L*.18,L*.02,L*.05);mouth(c,0,0,L*.06,m)}
 else if(K==='shrimp'){const P=[[-.2,.24,.075],[-.25,.12,.09],[-.2,-.01,.105],[-.08,-.1,.12],[.07,-.12,.13],[.22,-.07,.14]];
  c.beginPath();c.moveTo(-.18*L,.3*L);c.lineTo(-.32*L,.4*L+Math.sin(t*8)*L*.03);c.lineTo(-.06*L,.4*L);c.closePath();fs(c,f.f,lw);
  for(const sd of[0,1]){c.beginPath();c.moveTo(.3*L,-.14*L);c.quadraticCurveTo(.55*L,-.42*L,(.85+sd*.1)*L,(-.3+sd*.12)*L+Math.sin(t*4+sd)*L*.06);c.lineWidth=Math.max(1,L*.015);c.strokeStyle=OL;c.stroke()}
  for(let i=0;i<4;i++){c.beginPath();c.moveTo((-.1+i*.08)*L,0);c.lineTo((-.12+i*.08)*L,.1*L+Math.sin(t*12+i)*L*.02);c.lineWidth=Math.max(1,L*.02);c.strokeStyle=OL;c.stroke()}
  P.forEach((p,i)=>{c.beginPath();c.arc(p[0]*L,p[1]*L+Math.sin(t*6+i)*L*.008,p[2]*L,0,7);fs(c,grad(c,(p[1]-p[2])*L,(p[1]+p[2])*L,f.c,f.b),lw)});
  eye(c,.27*L,-.13*L,Math.max(2.4,L*.07),t,s,m);blush(c,.26*L,-.02*L,L*.04);mouth(c,.33*L,-.04*L,L*.04,m)}
 else if(K==='puffer'){const inf=o.inflate||0,R=L*.33*(1+inf*.45);
  for(let i=0;i<16;i++){const a=i/16*6.283+.1;c.beginPath();c.moveTo(Math.cos(a-.12)*R*.95,Math.sin(a-.12)*R*.95);c.lineTo(Math.cos(a)*R*(1.15+inf*.08),Math.sin(a)*R*(1.15+inf*.08));c.lineTo(Math.cos(a+.12)*R*.95,Math.sin(a+.12)*R*.95);fs(c,f.f,lw*.8)}
  c.beginPath();c.moveTo(-R*.9,0);c.lineTo(-R*1.35,-R*.35+Math.sin(t*9)*R*.1);c.lineTo(-R*1.35,R*.35+Math.sin(t*9)*R*.1);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.arc(0,0,R,0,7);fs(c,grad(c,-R,R,f.c,f.b,.6),lw);
  c.fillStyle='rgba(140,90,20,.3)';[[-.4,-.4],[-.1,-.6],[-.55,-.05],[.05,-.35],[-.3,-.15]].forEach(p=>{c.beginPath();c.arc(p[0]*R,p[1]*R,R*.08,0,7);c.fill()});
  c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.ellipse(-R*.2,-R*.6,R*.35,R*.12,-.3,0,7);c.fill();
  c.save();c.translate(R*.05,R*.25);c.rotate(Math.sin(t*12)*.5);c.beginPath();c.ellipse(-R*.1,0,R*.18,R*.08,.3,0,7);fs(c,f.f,lw*.8);c.restore();
  eye(c,R*.42,-R*.22,Math.max(2.6,R*.25),t,s,m);blush(c,R*.3,R*.22,R*.15);mouth(c,R*.88,R*.08,R*.13,'o')}
 else if(K==='squid'){const fl=Math.sin(t*7+s);
  for(let i=0;i<5;i++){c.beginPath();c.moveTo(L*.26,(-.06+i*.03)*L);c.quadraticCurveTo(L*.4,(-.1+i*.05)*L+fl*L*.03,L*(.5+(i%2)*.04),(-.14+i*.07)*L+Math.sin(t*6+i)*L*.04);dbl(c,L*.04,f.f)}
  c.beginPath();for(let i=0;i<=40;i++){const a=i/40*6.283,rr=1+Math.sin(a*9+t*8)*.05,px=Math.cos(a)*L*.4*rr-L*.04,py=Math.sin(a)*L*.24*rr;i?c.lineTo(px,py):c.moveTo(px,py)}c.closePath();fs(c,f.f,lw*.8);
  c.beginPath();c.ellipse(-L*.04,0,L*.33,L*.19,0,0,7);fs(c,grad(c,-L*.2,L*.2,f.c,f.b),lw);
  c.save();c.clip();c.strokeStyle='rgba(150,110,80,.3)';c.lineWidth=L*.025;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-L*.3+i*L*.11,-L*.2);c.quadraticCurveTo(-L*.25+i*L*.11,-L*.05,-L*.32+i*L*.11,0);c.stroke()}c.restore();
  eye(c,L*.15,-L*.04,Math.max(2.6,L*.08),t,s,m);blush(c,L*.07,L*.07,L*.05)}
 else if(K==='seahorse'){c.translate(0,Math.sin(t*2.5+s)*L*.03);
  c.save();c.translate(-L*.14,-L*.02);c.rotate(Math.sin(t*14)*.3);c.beginPath();c.moveTo(0,-L*.08);c.quadraticCurveTo(-L*.14,0,0,L*.08);fs(c,f.f,lw*.8);c.restore();
  c.beginPath();c.moveTo(-L*.02,L*.16);c.quadraticCurveTo(-L*.1,L*.36,L*.04,L*.4);c.quadraticCurveTo(L*.14,L*.4,L*.1,L*.31);c.quadraticCurveTo(L*.06,L*.26,L*.02,L*.32);dbl(c,L*.08,f.c);
  c.beginPath();c.ellipse(0,0,L*.14,L*.21,.1,0,7);const g=c.createLinearGradient(-L*.14,0,L*.14,0);g.addColorStop(0,f.c);g.addColorStop(1,f.b);fs(c,g,lw);
  c.strokeStyle='rgba(180,100,20,.35)';c.lineWidth=lw*.7;for(let i=0;i<4;i++){c.beginPath();c.moveTo(L*.02,-L*.12+i*L*.07);c.lineTo(L*.13,-L*.1+i*L*.07);c.stroke()}
  c.beginPath();c.roundRect(L*.08,-L*.33,L*.24,L*.08,L*.04);fs(c,f.c,lw);c.beginPath();c.arc(L*.04,-L*.3,L*.13,0,7);fs(c,f.c,lw);
  c.beginPath();c.moveTo(-L*.04,-L*.42);c.lineTo(0,-L*.5);c.lineTo(L*.04,-L*.42);fs(c,f.f,lw*.8);
  eye(c,L*.07,-L*.32,Math.max(2.4,L*.065),t,s,m);blush(c,L*.03,-L*.22,L*.04)}
 else if(K==='star'){c.rotate(Math.sin(t*1.6+s)*.12);c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?L*.2:L*.44;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();c.lineWidth=lw*3+2;c.strokeStyle=OL;c.stroke();
  const g=c.createRadialGradient(0,0,L*.05,0,0,L*.45);g.addColorStop(0,f.b);g.addColorStop(1,f.c);c.lineWidth=lw*3;c.strokeStyle=g;c.stroke();c.fillStyle=g;c.fill();
  c.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;c.beginPath();c.arc(Math.cos(a)*L*.26,Math.sin(a)*L*.26,L*.025,0,7);c.fill()}
  face(c,0,0,L,t,s,m,.07)}
 else if(K==='jelly'){const p=1+Math.sin(t*4+s)*.08;c.globalAlpha=.92;
  for(let i=0;i<5;i++){const x0=(-.2+i*.1)*L;c.beginPath();c.moveTo(x0,L*.02);for(let k=1;k<=6;k++)c.lineTo(x0+Math.sin(t*4+k+i)*L*.04,L*.02+k*L*.07/p);c.lineWidth=Math.max(1.5,L*.03);c.strokeStyle=f.f;c.stroke()}
  c.beginPath();c.ellipse(0,L*.02,L*.3*p,L*.3/p,0,Math.PI,0);for(let i=0;i<=6;i++){const xx=L*.3*p-i*L*.1*p;c.quadraticCurveTo(xx+L*.05*p,L*.09,xx,L*.02)}c.closePath();
  const jg=c.createRadialGradient(0,-L*.1,L*.02,0,-L*.05,L*.34);jg.addColorStop(0,'rgba(255,255,255,.85)');jg.addColorStop(.5,f.b);jg.addColorStop(1,f.c);c.globalAlpha=.78;c.fillStyle=jg;c.fill();c.lineWidth=lw*.8;c.strokeStyle=f.f;c.stroke();c.globalAlpha=1;
  c.save();c.clip();c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=Math.max(.8,L*.01);for(let i=-4;i<=4;i++){c.beginPath();c.moveTo(i*L*.07*p,L*.05);c.quadraticCurveTo(i*L*.04*p,-L*.15,0,-L*.27/p);c.stroke()}
  c.fillStyle='rgba(255,170,220,.45)';for(let i=0;i<4;i++){const a=i*Math.PI/2+.78;c.beginPath();c.ellipse(Math.cos(a)*L*.07,-L*.1+Math.sin(a)*L*.04,L*.05,L*.03,a,0,7);c.fill()}c.restore();
  const gl=c.createRadialGradient(0,-L*.05,0,0,-L*.05,L*.45);gl.addColorStop(0,'rgba(220,240,255,.28)');gl.addColorStop(1,'rgba(220,240,255,0)');c.fillStyle=gl;c.beginPath();c.arc(0,-L*.05,L*.45,0,7);c.fill();
  c.fillStyle='rgba(255,255,255,.65)';c.beginPath();c.ellipse(-L*.1,-L*.17/p,L*.08,L*.035,-.5,0,7);c.fill();face(c,0,-L*.06,L,t,s,m,.1)}
 else if(K==='eel'){const N=16,pts=[];for(let i=0;i<=N;i++){const u=i/N;pts.push([(-.5+u)*L,Math.sin(u*7-t*(m==='hurt'?12:6)+s)*L*.06*(1-u*.7)])}
  const path=()=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]))};
  path();c.lineWidth=L*.16+3;c.strokeStyle=OL;c.stroke();path();const g=c.createLinearGradient(-L*.5,0,L*.5,0);g.addColorStop(0,f.f);g.addColorStop(1,f.c);c.lineWidth=L*.16;c.strokeStyle=g;c.stroke();
  c.save();c.translate(0,-L*.03);path();c.lineWidth=L*.04;c.strokeStyle='rgba(255,255,255,.9)';c.stroke();c.restore();
  const hp=pts[N];c.beginPath();c.moveTo(hp[0]-L*.04,hp[1]-L*.08);c.quadraticCurveTo(hp[0]+L*.12,hp[1]-L*.04,hp[0]+L*.14,hp[1]+L*.01);c.quadraticCurveTo(hp[0]+L*.06,hp[1]+L*.08,hp[0]-L*.04,hp[1]+L*.08);fs(c,f.c,lw);
  eye(c,hp[0]+L*.02,hp[1]-L*.015,Math.max(2.4,L*.045),t,s,m);blush(c,hp[0]+L*.04,hp[1]+L*.045,L*.025)}
 else if(K==='ray'){const fl=Math.sin(t*4+s);
  c.beginPath();c.moveTo(-L*.28,0);c.quadraticCurveTo(-L*.55,Math.sin(t*3)*L*.08,-L*.78,Math.sin(t*3+1)*L*.12);c.lineWidth=Math.max(1.5,L*.025);c.strokeStyle=OL;c.stroke();
  c.beginPath();c.moveTo(L*.32,0);c.quadraticCurveTo(L*.12,-L*.12,-L*.02,-L*.4*(.75+.25*fl));c.quadraticCurveTo(-L*.12,-L*.12,-L*.32,0);c.quadraticCurveTo(-L*.12,L*.12,-L*.02,L*.4*(.75-.25*fl));c.quadraticCurveTo(L*.12,L*.12,L*.32,0);
  const g=c.createRadialGradient(0,0,L*.05,0,0,L*.4);g.addColorStop(0,f.b);g.addColorStop(1,f.c);fs(c,g,lw);
  c.fillStyle='rgba(255,255,255,.4)';[[-.1,-.18],[-.06,.2],[-.18,.06]].forEach(p=>{c.beginPath();c.arc(p[0]*L,p[1]*L,L*.025,0,7);c.fill()});
  const er=Math.max(2.4,L*.055);eye(c,L*.12,-L*.07,er,t,s,m);eye(c,L*.12,L*.07,er,t,s,m);blush(c,L*.05,-L*.12,L*.03);blush(c,L*.05,L*.12,L*.03);mouth(c,L*.23,0,L*.035,m)}
 else if(K==='turtle'){const pd=Math.sin(t*4+s);
  for(const [px,py,ph] of [[L*.18,L*.1,0],[-L*.22,L*.1,1]]){c.save();c.translate(px,py);c.rotate(pd*(ph?-.4:.6)+.5);c.beginPath();c.ellipse(L*.08,0,L*.16,L*.055,0,0,7);fs(c,f.f,lw);c.restore()}
  c.beginPath();c.moveTo(L*.26,-L*.02);c.quadraticCurveTo(L*.34,-L*.08,L*.4,-L*.06);c.lineTo(L*.4,L*.05);c.quadraticCurveTo(L*.32,L*.06,L*.26,L*.06);fs(c,f.b,lw);
  c.beginPath();c.arc(L*.45,-L*.04,L*.12,0,7);fs(c,'#8fd0a4',lw);
  c.beginPath();c.ellipse(0,L*.02,L*.36,L*.28,0,Math.PI,0);c.closePath();fs(c,grad(c,-L*.26,0,f.c,f.f),lw);
  c.fillStyle='rgba(255,255,255,.22)';[[-.15,-.1],[.05,-.14],[.2,-.05],[-.25,-.02]].forEach(p=>{c.beginPath();c.arc(p[0]*L,p[1]*L,L*.065,0,7);c.fill()});
  c.beginPath();c.roundRect(-L*.36,0,L*.72,L*.06,L*.03);fs(c,f.b,lw);
  eye(c,L*.47,-L*.07,Math.max(2.4,L*.05),t,s,m);blush(c,L*.5,L*.01,L*.03);mouth(c,L*.53,0,L*.03,m)}
 else if(K==='sunfish'){const sw=Math.sin(t*3+s);
  c.beginPath();c.moveTo(-L*.1,-L*.3);c.quadraticCurveTo(-L*.05+sw*L*.05,-L*.72,L*.08,-L*.34);fs(c,f.f,lw);
  c.beginPath();c.moveTo(-L*.1,L*.3);c.quadraticCurveTo(-L*.05-sw*L*.05,L*.72,L*.08,L*.34);fs(c,f.f,lw);
  c.beginPath();c.ellipse(-L*.34,0,L*.08,L*.3,0,0,7);fs(c,f.f,lw);
  c.beginPath();c.ellipse(0,0,L*.38,L*.38,0,0,7);fs(c,grad(c,-L*.38,L*.38,f.c,f.b,.5),lw);
  c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(-L*.05,-L*.25,L*.2,L*.06,-.1,0,7);c.fill();
  c.save();c.translate(L*.08,L*.05);c.rotate(sw*.4);c.beginPath();c.ellipse(-L*.05,0,L*.08,L*.035,.3,0,7);fs(c,f.f,lw*.8);c.restore();
  eye(c,L*.22,-L*.08,Math.max(2.6,L*.07),t,s,m);blush(c,L*.18,L*.06,L*.05);mouth(c,L*.35,L*.04,L*.04,'o')}
 else if(K==='boot'){c.rotate(Math.sin(t*2)*.08);c.beginPath();c.moveTo(-L*.22,-L*.38);c.lineTo(L*.08,-L*.38);c.lineTo(L*.08,L*.06);c.quadraticCurveTo(L*.36,L*.06,L*.4,L*.2);c.quadraticCurveTo(L*.42,L*.3,L*.3,L*.3);c.lineTo(-L*.22,L*.3);c.closePath();fs(c,f.c,lw);
  c.beginPath();c.rect(-L*.22,L*.22,L*.64,L*.08);fs(c,'#4a3220',lw);c.beginPath();c.rect(-L*.25,-L*.42,L*.36,L*.08);fs(c,'#9b7048',lw);face(c,-L*.07,-L*.1,L,t,s,'hurt',.08)}
 else if(K==='can'){c.rotate(-.35+Math.sin(t*2)*.08);c.beginPath();c.roundRect(-L*.15,-L*.3,L*.3,L*.6,L*.05);const g=c.createLinearGradient(-L*.15,0,L*.15,0);g.addColorStop(0,'#c9ccd6');g.addColorStop(.4,'#fff');g.addColorStop(1,'#a9adbb');fs(c,g,lw);
  c.beginPath();c.rect(-L*.15,-L*.12,L*.3,L*.26);fs(c,'#ff5d5d',lw*.8);c.beginPath();c.ellipse(0,-L*.3,L*.15,L*.04,0,0,7);fs(c,'#dfe1e8',lw*.8);face(c,0,0,L,t,s,'o',.06)}
 else if(K==='chest'){const op=.25+Math.sin(t*3)*.08;
  c.fillStyle='rgba(255,220,90,.6)';c.beginPath();c.moveTo(-L*.25,-L*.05);c.lineTo(-L*.45,-L*.6);c.lineTo(L*.45,-L*.6);c.lineTo(L*.25,-L*.05);c.fill();
  c.beginPath();c.roundRect(-L*.32,-L*.05,L*.64,L*.32,L*.04);fs(c,f.c,lw);c.beginPath();c.rect(-L*.32,L*.04,L*.64,L*.05);fs(c,'#ffcf3f',lw*.7);
  [[-.15,-.08],[0,-.12],[.14,-.07]].forEach(p=>{c.beginPath();c.arc(p[0]*L,p[1]*L,L*.07,0,7);fs(c,'#ffd54a',lw*.7)});
  c.save();c.translate(-L*.32,-L*.05);c.rotate(-op);c.beginPath();c.roundRect(0,-L*.18,L*.64,L*.18,L*.06);fs(c,'#a3662f',lw);c.restore();c.beginPath();c.rect(-L*.05,-L*.02,L*.1,L*.12);fs(c,'#ffcf3f',lw*.7)}
 else if(K==='flat'){const rx=L*.5,ry=L*.22,w2=Math.sin(t*6+s);
  c.beginPath();c.moveTo(-rx*.85,0);c.lineTo(-rx-L*.18,-ry*.9+w2*3);c.lineTo(-rx-L*.18,ry*.9+w2*3);c.closePath();fs(c,f.f,lw);
  c.beginPath();for(let i=0;i<=24;i++){const a=i/24*Math.PI*2,rr=1+Math.sin(a*14+t*8)*.03;c.lineTo(Math.cos(a)*rx*1.08*rr,Math.sin(a)*ry*1.35*rr)}c.closePath();fs(c,f.f,lw*.8);
  c.beginPath();c.ellipse(0,0,rx,ry,0,0,7);c.fillStyle=grad(c,-ry,ry,f.c,f.b,.5);c.fill();c.save();c.clip();pattern(c,f,rx,ry,L,t);for(let i=0;i<40;i++){const hx=hsh(i,f.id.length),hy=hsh(i+9,3);c.fillStyle=i%3?'rgba(70,50,30,.22)':'rgba(255,245,220,.35)';c.beginPath();c.ellipse((hx-.5)*rx*1.9,(hy-.5)*ry*1.9,L*(.012+.02*hsh(i,7)),L*(.01+.015*hsh(i,8)),0,0,7);c.fill()}c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=Math.max(.6,L*.006);c.beginPath();c.moveTo(-rx*.9,0);c.quadraticCurveTo(0,-ry*.2,rx*.7,0);c.stroke();c.restore();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  const er=Math.max(2.4,L*.06);eye(c,rx*.45,-ry*.55,er,t,s,m,f.eye);eye(c,rx*.62,-ry*.35,er,t,s+1,m,f.eye);blush(c,rx*.5,ry*.2,er*.7);mouth(c,rx*.86,ry*.05,er*.5,m)}
 else if(K==='billfish'){const rx=L*.42,ry=L*.12,wag=Math.sin(t*7+s)*ry*.5;
  c.beginPath();c.moveTo(-rx*.85,0);c.quadraticCurveTo(-rx-L*.1,-ry,-rx-L*.22,-ry*2.4+wag);c.quadraticCurveTo(-rx-L*.1,wag*.4,-rx-L*.22,ry*2.4+wag);c.quadraticCurveTo(-rx-L*.1,ry,-rx*.85,0);fs(c,f.f,lw);
  c.beginPath();c.moveTo(-rx*.5,-ry*.8);c.quadraticCurveTo(-rx*.1,-ry*4.2-Math.sin(t*3+s)*ry*.4,rx*.45,-ry*.9);fs(c,f.f,lw);
  c.beginPath();c.moveTo(rx*.9,-ry*.15);c.lineTo(rx+L*(f.sword?.42:.36),0);c.lineTo(rx*.9,ry*.25);fs(c,f.c,lw*.8);
  c.beginPath();c.ellipse(0,0,rx,ry,0,0,7);c.fillStyle=grad(c,-ry,ry,f.c,f.b,.5);c.fill();c.save();c.clip();pattern(c,f,rx,ry,L,t);for(let i=0;i<40;i++){const hx=hsh(i,f.id.length),hy=hsh(i+9,3);c.fillStyle=i%3?'rgba(70,50,30,.22)':'rgba(255,245,220,.35)';c.beginPath();c.ellipse((hx-.5)*rx*1.9,(hy-.5)*ry*1.9,L*(.012+.02*hsh(i,7)),L*(.01+.015*hsh(i,8)),0,0,7);c.fill()}c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=Math.max(.6,L*.006);c.beginPath();c.moveTo(-rx*.9,0);c.quadraticCurveTo(0,-ry*.2,rx*.7,0);c.stroke();c.restore();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  eye(c,rx*.68,-ry*.15,Math.max(2.4,L*.035),t,s,m,f.eye);mouth(c,rx*.88,ry*.35,L*.02,m)}
 else if(K==='angler'){const R=L*.32,b=Math.sin(t*2+s)*L*.02;c.translate(0,b);
  c.beginPath();c.moveTo(-R*.9,0);c.lineTo(-R*1.5,-R*.4+Math.sin(t*6)*R*.1);c.lineTo(-R*1.5,R*.4+Math.sin(t*6)*R*.1);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.moveTo(R*.2,-R*.8);c.quadraticCurveTo(R*.9,-R*1.9,R*1.3,-R*1.1+Math.sin(t*2)*R*.15);c.lineWidth=lw*.8;c.strokeStyle=OL;c.stroke();
  const lx=R*1.3,ly=-R*1.1+Math.sin(t*2)*R*.15,gl=c.createRadialGradient(lx,ly,1,lx,ly,R*.6);gl.addColorStop(0,'rgba(255,250,160,.95)');gl.addColorStop(1,'rgba(255,250,160,0)');c.fillStyle=gl;c.beginPath();c.arc(lx,ly,R*.6,0,7);c.fill();c.fillStyle='#fffbb0';c.beginPath();c.arc(lx,ly,R*.12,0,7);c.fill();
  c.beginPath();c.ellipse(0,0,R*1.05,R*.85,0,0,7);c.fillStyle=grad(c,-R,R,f.c,f.b,.5);c.fill();c.save();c.clip();pattern(c,f,R,R,L,t);c.restore();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.beginPath();c.moveTo(R*.2,R*.3);c.quadraticCurveTo(R*.7,R*.75,R*1.02,R*.1);c.lineWidth=lw;c.stroke();c.fillStyle='#fff';for(let i=0;i<4;i++){c.beginPath();c.moveTo(R*(.35+i*.17),R*(.48-i*.08));c.lineTo(R*(.42+i*.17),R*(.3-i*.08));c.lineTo(R*(.49+i*.17),R*(.45-i*.1));c.fill();c.stroke()}
  eye(c,R*.45,-R*.35,Math.max(2.4,R*.16),t,s,m,'sleepy');blush(c,R*.3,R*.05,R*.1)}
 else if(K==='file'){const R=L*.36,w2=Math.sin(t*8+s)*R*.12;
  c.beginPath();c.moveTo(-R*.9,0);c.lineTo(-R*1.35,-R*.35+w2);c.lineTo(-R*1.35,R*.35+w2);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.moveTo(R*.15,-R*.78);c.lineTo(R*.05,-R*1.35);c.lineTo(R*.3,-R*.8);fs(c,f.f,lw*.8);
  c.beginPath();c.moveTo(R,0);c.quadraticCurveTo(R*.5,-R*.95,-R*.2,-R*.75);c.quadraticCurveTo(-R*.9,-R*.4,-R*.95,0);c.quadraticCurveTo(-R*.9,R*.4,-R*.2,R*.75);c.quadraticCurveTo(R*.5,R*.95,R,0);c.fillStyle=grad(c,-R,R,f.c,f.b,.5);c.fill();c.save();c.clip();pattern(c,f,R,R*.8,L,t);c.restore();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  eye(c,R*.4,-R*.25,Math.max(2.4,R*.2),t,s,m,f.eye);blush(c,R*.35,R*.2,R*.12);c.beginPath();c.ellipse(R*1.02,0,R*.08,R*.06,0,0,7);fs(c,'#ff9aa8',lw*.6)}
 else if(K==='squidL'){const fl=Math.sin(t*7+s);
  for(let i=0;i<6;i++){c.beginPath();c.moveTo(L*.2,(-.06+i*.025)*L);c.quadraticCurveTo(L*.38,(-.08+i*.035)*L+fl*L*.02,L*(.52+(i%2)*.05),(-.1+i*.045)*L+Math.sin(t*6+i)*L*.03);dbl(c,L*.03,f.f)}
  c.beginPath();c.moveTo(-L*.45,0);c.lineTo(-L*.3,-L*.16+fl*L*.02);c.lineTo(-L*.22,0);c.lineTo(-L*.3,L*.16-fl*L*.02);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.ellipse(-L*.03,0,L*.26,L*.11,0,0,7);c.fillStyle=grad(c,-L*.1,L*.1,f.c,f.b);c.fill();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.beginPath();c.ellipse(L*.2,0,L*.06,L*.08,0,0,7);fs(c,f.c,lw*.8);
  if(f.glow){c.fillStyle='rgba(140,200,255,.9)';for(let i=0;i<7;i++){c.beginPath();c.arc(-L*.2+i*L*.06,Math.sin(i*2)*L*.05,L*.012+Math.abs(Math.sin(t*4+i))*L*.008,0,7);c.fill()}}
  eye(c,L*.2,-L*.01,Math.max(2.4,L*.05),t,s,m,f.eye)}
 else if(K==='giantsquid'){const fl=Math.sin(t*2.5+s);
  for(let i=0;i<8;i++){c.beginPath();const sx=L*.12,sy=(-.05+i*.014)*L;c.moveTo(sx,sy);c.bezierCurveTo(L*.35,sy+Math.sin(t*2+i)*L*.12,L*.5,sy+Math.cos(t*1.6+i*1.3)*L*.18,L*(.6+(i%3)*.06),sy+Math.sin(t*2.2+i)*L*.2);dbl(c,L*(i<2?.022:.035),f.c)}
  c.beginPath();c.moveTo(-L*.52,0);c.lineTo(-L*.38,-L*.13+fl*L*.02);c.lineTo(-L*.3,0);c.lineTo(-L*.38,L*.13-fl*L*.02);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.ellipse(-L*.12,0,L*.3,L*.11,0,0,7);c.fillStyle=grad(c,-L*.1,L*.1,f.c,f.b);c.fill();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<6;i++){c.beginPath();c.arc(-L*.3+i*L*.07,-L*.03+Math.sin(i)*L*.03,L*.012,0,7);c.fill()}
  c.beginPath();c.ellipse(L*.14,0,L*.06,L*.075,0,0,7);fs(c,f.c,lw*.8);eye(c,L*.13,-L*.02,Math.max(3,L*.04),t,s,m,'angry')}
 else if(K==='moray'){const N=14,pts=[];for(let i=0;i<=N;i++){const u=i/N;pts.push([(-.5+u)*L,Math.sin(u*5-t*4+s)*L*.05*(1-u*.6)])}
  const path=()=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]))};
  path();c.lineWidth=L*.2+3;c.strokeStyle=OL;c.stroke();path();c.lineWidth=L*.2;c.strokeStyle=f.c;c.stroke();
  c.save();path();c.lineWidth=L*.2;c.strokeStyle='rgba(0,0,0,0)';c.restore();
  c.fillStyle='rgba(40,50,20,.4)';pts.forEach((p,i)=>{if(i%2)return;c.beginPath();c.arc(p[0],p[1]-L*.03,L*.025,0,7);c.fill()});
  const hp=pts[N];c.beginPath();c.ellipse(hp[0]+L*.04,hp[1],L*.13,L*.11,0,0,7);fs(c,f.c,lw);
  const op=(Math.sin(t*2)+1)*.5;c.beginPath();c.moveTo(hp[0]+L*.02,hp[1]+L*.03);c.lineTo(hp[0]+L*.17,hp[1]+L*.01+op*L*.04);c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  eye(c,hp[0]+L*.06,hp[1]-L*.04,Math.max(2.4,L*.035),t,s,m,f.eye)}
 else if(K==='catfish'){const rx=L*.5,ry=L*.18*(f.small?1.2:1),wag=Math.sin(t*6+s)*ry*.3;
  c.beginPath();c.ellipse(-rx-L*.06,wag,L*.12,ry*.8,0,0,7);fs(c,f.f,lw);
  c.beginPath();c.moveTo(-rx*.2,-ry*.85);c.lineTo(-rx*.05,-ry*1.7);c.lineTo(rx*.1,-ry*.9);fs(c,f.f,lw);
  c.beginPath();c.moveTo(rx,0);c.quadraticCurveTo(rx,-ry*1.1,rx*.2,-ry);c.quadraticCurveTo(-rx*.6,-ry*.8,-rx,0);c.quadraticCurveTo(-rx*.6,ry*.8,rx*.2,ry);c.quadraticCurveTo(rx,ry*1.1,rx,0);c.fillStyle=grad(c,-ry,ry,f.c,f.b,.55);c.fill();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.strokeStyle=OL;c.lineWidth=Math.max(1.2,lw*.55);for(const[a,b2]of[[-.3,.5],[.2,.9],[.4,1.2]]){c.beginPath();c.moveTo(rx*.92,ry*a*.4);c.quadraticCurveTo(rx*1.2,ry*a+Math.sin(t*3+a*5)*ry*.4,rx*(1.05+b2*.25),ry*a*2+Math.sin(t*3+a*5)*ry*.6);c.stroke()}
  eye(c,rx*.62,-ry*.4,Math.max(2.4,L*.04),t,s,m,'small');c.beginPath();c.moveTo(rx*.7,ry*.35);c.quadraticCurveTo(rx*.85,ry*.5,rx*.98,ry*.25);c.lineWidth=lw;c.stroke();blush(c,rx*.55,ry*.1,L*.03)}
 else if(K==='sturgeon'){const rx=L*.48,ry=L*.12,wag=Math.sin(t*5+s)*ry*.4;
  c.beginPath();c.moveTo(-rx*.8,0);c.quadraticCurveTo(-rx-L*.1,-ry*.4,-rx-L*.18,-ry*2+wag);c.lineTo(-rx-L*.1,wag*.5);c.lineTo(-rx-L*.14,ry*.8+wag);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.moveTo(-rx*.3,-ry*.9);c.lineTo(-rx*.15,-ry*1.9);c.lineTo(0,-ry*.95);fs(c,f.f,lw);
  c.beginPath();c.moveTo(rx+L*.12,ry*.1);c.quadraticCurveTo(rx*.6,-ry*1.2,-rx*.2,-ry);c.quadraticCurveTo(-rx,-ry*.6,-rx,0);c.quadraticCurveTo(-rx*.8,ry,0,ry);c.quadraticCurveTo(rx*.7,ry*1.1,rx+L*.12,ry*.1);c.fillStyle=grad(c,-ry,ry,f.c,f.b,.5);c.fill();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.fillStyle='#fff';for(let i=0;i<8;i++){const xx=-rx*.8+i*rx*.22;for(const yy of[-ry*.65,ry*.05]){c.beginPath();c.moveTo(xx-L*.015,yy);c.lineTo(xx,yy-L*.02);c.lineTo(xx+L*.015,yy);c.lineTo(xx,yy+L*.015);c.closePath();c.fill();c.lineWidth=lw*.4;c.stroke()}}
  c.strokeStyle=OL;c.lineWidth=Math.max(1,lw*.4);for(let i=0;i<3;i++){c.beginPath();c.moveTo(rx*.8+i*L*.02,ry*.6);c.lineTo(rx*.8+i*L*.02,ry*1.1+Math.sin(t*3+i)*2);c.stroke()}
  eye(c,rx*.6,-ry*.3,Math.max(2.4,L*.03),t,s,m,f.eye)}
 else if(K==='box'){const R=L*.3,w2=Math.sin(t*10+s);
  c.beginPath();c.ellipse(-R*1.25,0,R*.25,R*.4+w2*R*.05,0,0,7);fs(c,f.f,lw);
  c.beginPath();c.roundRect(-R,-R*.75,R*2,R*1.5,R*.35);c.fillStyle=grad(c,-R,R,f.c,f.b,.5);c.fill();c.save();c.clip();c.fillStyle='rgba(30,30,40,.6)';for(let i=0;i<10;i++){c.beginPath();c.arc(-R*.8+(i%5)*R*.4,-R*.35+Math.floor(i/5)*R*.6,R*.06,0,7);c.fill()}c.restore();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.save();c.translate(R*.1,R*.2);c.rotate(Math.sin(t*12)*.6);c.beginPath();c.ellipse(-R*.15,0,R*.18,R*.08,.3,0,7);fs(c,f.f,lw*.8);c.restore();
  eye(c,R*.55,-R*.25,Math.max(2.6,R*.24),t,s,m,f.eye);blush(c,R*.45,R*.2,R*.13);c.beginPath();c.ellipse(R*1.02,R*.1,R*.09,R*.07,0,0,7);fs(c,'#ff9aa8',lw*.6)}
 else if(K==='nudi'){const N=8;for(let i=0;i<N;i++){const u=i/(N-1),x=(-.4+u*.8)*L,y=Math.sin(u*4+t*3)*L*.03;c.beginPath();c.arc(x,y,L*(.12-Math.abs(u-.5)*.08),0,7);fs(c,f.c,lw*.6)}
  for(let i=0;i<6;i++){c.beginPath();c.moveTo(-L*.3+i*L*.1,-L*.08);c.lineTo(-L*.3+i*L*.1+Math.sin(t*4+i)*L*.02,-L*.22);c.lineWidth=L*.05;c.strokeStyle=f.f;c.stroke()}
  for(const sd of[-1,1]){c.beginPath();c.moveTo(L*.32,-L*.05);c.lineTo(L*.4+sd*L*.03,-L*.2);c.lineWidth=L*.035;c.strokeStyle=f.b;c.stroke()}
  eye(c,L*.33,0,Math.max(2.2,L*.045),t,s,m,f.eye);blush(c,L*.28,L*.06,L*.03)}
 else if(K==='urchin'){const R=L*.25;for(let i=0;i<20;i++){const a=i/20*6.283+Math.sin(t+i)*.05;c.beginPath();c.moveTo(Math.cos(a)*R,Math.sin(a)*R);c.lineTo(Math.cos(a)*R*1.9,Math.sin(a)*R*1.9);c.lineWidth=Math.max(1.4,L*.025);c.strokeStyle=f.f;c.stroke()}
  c.beginPath();c.arc(0,0,R,0,7);fs(c,grad(c,-R,R,f.b,f.c),lw);face(c,0,0,L,t,s,m,.07)}
 else if(K==='clam'){const op=(Math.sin(t*1.5+s)+1)*.12+.05;
  c.save();c.rotate(-op);c.beginPath();c.moveTo(-L*.38,0);c.quadraticCurveTo(-L*.3,-L*.35,0,-L*.38);c.quadraticCurveTo(L*.3,-L*.35,L*.38,0);c.closePath();fs(c,grad(c,-L*.38,0,f.b,f.c),lw);
  c.strokeStyle='rgba(43,33,64,.35)';c.lineWidth=lw*.6;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(0,0);c.lineTo(i*L*.14,-L*.33+Math.abs(i)*L*.05);c.stroke()}c.restore();
  c.fillStyle='#fff';c.beginPath();c.arc(0,-L*.06,L*.07,0,7);c.fill();c.lineWidth=lw*.6;c.strokeStyle=OL;c.stroke();c.fillStyle='rgba(255,180,220,.6)';c.beginPath();c.arc(-L*.02,-L*.08,L*.025,0,7);c.fill();
  c.beginPath();c.moveTo(-L*.38,0);c.quadraticCurveTo(-L*.3,L*.3,0,L*.32);c.quadraticCurveTo(L*.3,L*.3,L*.38,0);c.closePath();fs(c,grad(c,0,L*.32,f.c,f.f),lw);face(c,0,L*.14,L,t,s,m,.08)}
 else if(K==='manta'){const fl=Math.sin(t*2.4+s);
  c.beginPath();c.moveTo(-L*.22,0);c.quadraticCurveTo(-L*.5,Math.sin(t*2)*L*.05,-L*.7,Math.sin(t*2+1)*L*.08);c.lineWidth=Math.max(1.5,L*.015);c.strokeStyle=OL;c.stroke();
  c.beginPath();c.moveTo(L*.25,0);c.quadraticCurveTo(L*.1,-L*.15,-L*.05,-L*.5*(.7+.3*fl));c.quadraticCurveTo(-L*.12,-L*.12,-L*.25,0);c.quadraticCurveTo(-L*.12,L*.12,-L*.05,L*.5*(.7-.3*fl));c.quadraticCurveTo(L*.1,L*.15,L*.25,0);fs(c,grad(c,-L*.4,L*.4,f.c,f.b),lw);
  for(const sd of[-1,1]){c.beginPath();c.moveTo(L*.24,sd*L*.04);c.quadraticCurveTo(L*.36,sd*L*.08,L*.33,sd*L*.13);c.lineWidth=L*.035;c.strokeStyle=f.c;c.stroke()}
  const er=Math.max(2.4,L*.035);eye(c,L*.18,-L*.07,er,t,s,m);eye(c,L*.18,L*.07,er,t,s,m);mouth(c,L*.27,0,L*.03,m)}
 else if(K==='hammer'){const rx=L*.45,ry=L*.12,wag=Math.sin(t*5+s)*ry*.6;
  c.beginPath();c.moveTo(-rx*.8,0);c.quadraticCurveTo(-rx-L*.08,-ry*.3,-rx-L*.2,-ry*2.2+wag);c.lineTo(-rx-L*.1,wag*.3);c.lineTo(-rx-L*.15,ry*.9+wag);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.moveTo(-rx*.2,-ry*.9);c.lineTo(-rx*.05,-ry*2.6);c.lineTo(rx*.2,-ry*.9);fs(c,f.f,lw);
  c.beginPath();c.ellipse(0,0,rx,ry,0,0,7);c.fillStyle=grad(c,-ry,ry,f.c,f.b,.5);c.fill();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.beginPath();c.roundRect(rx*.75,-ry*1.8,L*.1,ry*3.6,L*.04);fs(c,f.c,lw);
  eye(c,rx*.8+L*.05,-ry*1.55,Math.max(2.4,L*.03),t,s,m);eye(c,rx*.8+L*.05,ry*1.55,Math.max(2.4,L*.03),t,s+1,m);mouth(c,rx*.85,ry*.3,L*.025,m)}
 else if(K==='dolphin'||K==='orca'||K==='dwhale'){const big=K==='dwhale',rx=L*.45,ry=L*(big?.2:.14),wag=Math.sin(t*(big?2:5)+s)*ry*.6;
  c.beginPath();c.moveTo(-rx*.85,0);c.quadraticCurveTo(-rx-L*.06,wag*.3,-rx-L*.14,wag);c.lineTo(-rx-L*.2,wag-ry*.9);c.lineTo(-rx-L*.12,wag);c.lineTo(-rx-L*.2,wag+ry*.9);c.closePath();fs(c,f.f,lw);
  if(!big){c.beginPath();c.moveTo(-rx*.15,-ry*.85);c.quadraticCurveTo(-rx*.05,-ry*(K==='orca'?2.6:2),rx*.15,-ry*.9);fs(c,f.f,lw)}
  c.beginPath();c.moveTo(rx+L*.08,ry*.2);c.quadraticCurveTo(rx,-ry*1.1,0,-ry);c.quadraticCurveTo(-rx,-ry*.7,-rx,0);c.quadraticCurveTo(-rx*.6,ry,0,ry);c.quadraticCurveTo(rx*.8,ry*1.05,rx+L*.08,ry*.2);
  c.fillStyle=grad(c,-ry,ry,f.c,f.b,K==='orca'?.45:.55);c.fill();c.save();c.clip();
  if(K==='orca'){c.fillStyle='#fff';c.beginPath();c.ellipse(rx*.45,-ry*.35,L*.06,ry*.25,0,0,7);c.fill();c.beginPath();c.ellipse(-rx*.2,ry*.5,rx*.6,ry*.5,0,0,7);c.fill()}
  if(big){c.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<12;i++)star5(c,-rx*.7+(i%6)*rx*.28,-ry*.4+Math.floor(i/6)*ry*.4,L*.012*(1+Math.sin(t*3+i)*.4))}
  c.restore();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.save();c.translate(rx*.2,ry*.5);c.rotate(.6+Math.sin(t*3)*.2);c.beginPath();c.ellipse(0,L*.04,L*.03,L*.07,0,0,7);fs(c,f.f,lw*.8);c.restore();
  eye(c,rx*.62,-ry*.15,Math.max(2.6,L*(big?.03:.04)),t,s,m,big?'sleepy':'');blush(c,rx*.62,ry*.3,L*.025);c.beginPath();c.arc(rx*.82,ry*.15,L*.04,.2,1.6);c.lineWidth=lw*.8;c.strokeStyle=OL;c.stroke();
  if(big){c.fillStyle='rgba(255,255,255,.8)';c.font=`${L*.06}px ${FONT}`;c.fillText('z',rx*.5,-ry*1.4-Math.sin(t)*4);c.fillText('Z',rx*.62,-ry*1.9-Math.sin(t+1)*4)}}
 else if(K==='dumbo'){const b=Math.sin(t*2+s)*L*.04;c.translate(0,b);
  for(let i=0;i<6;i++){c.beginPath();const x0=-L*.18+i*L*.072;c.moveTo(x0,L*.05);c.quadraticCurveTo(x0+Math.sin(t*3+i)*L*.04,L*.2,x0+Math.sin(t*3+i)*L*.06,L*.28);dbl(c,L*.05,f.c)}
  for(const sd of[-1,1]){c.save();c.translate(sd*L*.22,-L*.12);c.rotate(sd*(.4+Math.sin(t*4)*.35));c.beginPath();c.ellipse(sd*L*.06,0,L*.1,L*.06,0,0,7);fs(c,f.f,lw);c.restore()}
  c.beginPath();c.ellipse(0,-L*.08,L*.25,L*.22,0,0,7);fs(c,grad(c,-L*.3,L*.1,f.c,f.b),lw);face(c,0,-L*.05,L,t,s,m,.09)}
 else if(K==='blob'){const sq=1+Math.sin(t*2+s)*.05;c.scale(sq,1/sq);
  c.beginPath();c.moveTo(-L*.38,L*.05);c.lineTo(-L*.5,-L*.05);c.lineTo(-L*.48,L*.15);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.ellipse(0,0,L*.38,L*.25,0,0,7);fs(c,grad(c,-L*.25,L*.25,f.c,f.b),lw);
  c.beginPath();c.ellipse(L*.2,L*.04,L*.1,L*.09,0,0,7);fs(c,f.f,lw);
  eye(c,L*.08,-L*.08,Math.max(2.2,L*.04),t,s,m,'sleepy');eye(c,L*.28,-L*.08,Math.max(2.2,L*.04),t,s,m,'sleepy');
  c.beginPath();c.arc(L*.2,L*.2,L*.06,Math.PI+.4,-.4);c.lineWidth=lw;c.strokeStyle=OL;c.stroke()}
 else if(K==='oar'){const N=20,pts=[];for(let i=0;i<=N;i++){const u=i/N;pts.push([(-.5+u)*L,Math.sin(u*6-t*3+s)*L*.05*(1-u*.5)])}
  pts.forEach((p,i)=>{if(i%2||i>N-2)return;c.beginPath();c.moveTo(p[0],p[1]-L*.04);c.lineTo(p[0]+L*.01,p[1]-L*.1-Math.sin(t*5+i)*L*.015);c.lineWidth=L*.02;c.strokeStyle=f.f;c.stroke()});
  const path=()=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]))};path();c.lineWidth=L*.08+3;c.strokeStyle=OL;c.stroke();path();c.lineWidth=L*.08;c.strokeStyle=f.c;c.stroke();
  const hp=pts[N];for(let i=0;i<4;i++){c.beginPath();c.moveTo(hp[0]-L*.02,hp[1]-L*.04);c.lineTo(hp[0]-L*.02-i*L*.025,hp[1]-L*.18-i*L*.03+Math.sin(t*4+i)*L*.02);c.lineWidth=L*.018;c.strokeStyle=f.f;c.stroke()}
  c.beginPath();c.ellipse(hp[0],hp[1],L*.06,L*.05,0,0,7);fs(c,f.c,lw);eye(c,hp[0]+L*.015,hp[1]-L*.01,Math.max(2.2,L*.02),t,s,m)}
 else if(K==='hatchet'){const R=L*.3;c.beginPath();c.moveTo(-R*.8,-R*.2);c.lineTo(-R*1.3,-R*.5+Math.sin(t*8)*R*.1);c.lineTo(-R*1.3,R*.1+Math.sin(t*8)*R*.1);c.closePath();fs(c,f.f,lw);
  c.beginPath();c.moveTo(R*.9,-R*.3);c.lineTo(-R*.8,-R*.55);c.lineTo(-R*.8,0);c.quadraticCurveTo(0,R*1.1,R*.9,-R*.05);c.closePath();fs(c,grad(c,-R,R,f.c,f.b),lw);
  c.fillStyle=`rgba(120,200,255,${.6+Math.sin(t*3)*.3})`;for(let i=0;i<6;i++){c.beginPath();c.arc(-R*.5+i*R*.24,R*(.25+Math.sin(i*.6)*.1),R*.06,0,7);c.fill()}
  eye(c,R*.5,-R*.22,Math.max(2.6,R*.25),t,s,m,'big')}
 else if(K==='isopod'){c.translate(0,Math.sin(t*2+s)*L*.01);for(let i=0;i<7;i++){c.beginPath();c.moveTo(-L*.3+i*L*.09,L*.12);c.lineTo(-L*.32+i*L*.09+Math.sin(t*10+i)*L*.02,L*.22);c.lineWidth=Math.max(1.2,L*.02);c.strokeStyle=OL;c.stroke()}
  c.beginPath();c.ellipse(0,0,L*.4,L*.16,0,Math.PI,0);c.lineTo(L*.4,L*.12);c.lineTo(-L*.4,L*.12);c.closePath();fs(c,grad(c,-L*.16,L*.12,f.b,f.c),lw);
  c.strokeStyle='rgba(43,33,64,.4)';c.lineWidth=lw*.6;for(let i=1;i<8;i++){c.beginPath();c.moveTo(-L*.4+i*L*.1,-L*.15*Math.sin(i/8*Math.PI));c.lineTo(-L*.4+i*L*.1,L*.12);c.stroke()}
  for(const sd of[-1,1]){c.beginPath();c.moveTo(L*.38,-L*.03);c.quadraticCurveTo(L*.5,-L*.12,L*.55,-L*.05+sd*L*.03);c.lineWidth=Math.max(1,L*.015);c.strokeStyle=OL;c.stroke()}
  eye(c,L*.3,-L*.04,Math.max(2.2,L*.04),t,s,m,'');blush(c,L*.26,L*.05,L*.025)}
 else if(K==='gulper'){const N=12,pts=[];for(let i=0;i<=N;i++){const u=i/N;pts.push([(-.6+u*.6)*L,Math.sin(u*6-t*4+s)*L*.04*(1-u)])}
  c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.lineWidth=L*.04+3;c.strokeStyle=OL;c.stroke();c.lineWidth=L*.04;c.strokeStyle=f.c;c.stroke();
  c.fillStyle='#ff5aa0';c.beginPath();c.arc(pts[0][0],pts[0][1],L*.02*(1+Math.sin(t*5)*.4),0,7);c.fill();
  const op=.3+Math.sin(t*2)*.15;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(L*.25,-L*.3*op-L*.05,L*.42,-L*.08);c.lineTo(L*.42,L*.05);c.quadraticCurveTo(L*.25,L*.3*op+L*.05,0,0);fs(c,f.b,lw);
  c.beginPath();c.ellipse(L*.05,0,L*.08,L*.06,0,0,7);fs(c,f.c,lw);eye(c,L*.06,-L*.015,Math.max(2,L*.022),t,s,m)}
 else if(K==='eyeball'){const R=L*.3,lk=Math.sin(t*.8+s)*R*.2;for(let i=0;i<6;i++){c.beginPath();const a=Math.PI*.6+i*.15;c.moveTo(Math.cos(a)*R,Math.sin(a)*R);c.quadraticCurveTo(Math.cos(a)*R*1.6+Math.sin(t*3+i)*R*.2,Math.sin(a)*R*1.6,Math.cos(a)*R*2,Math.sin(a)*R*2.1);dbl(c,L*.025,f.c)}
  c.beginPath();c.arc(0,0,R,0,7);fs(c,'#fff',lw);c.save();c.clip();c.strokeStyle='rgba(220,80,100,.4)';c.lineWidth=1;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-R,-R*.6+i*R*.3);c.quadraticCurveTo(-R*.5,-R*.5+i*R*.3,-R*.3,-R*.55+i*R*.3);c.stroke()}c.restore();
  c.beginPath();c.arc(R*.2+lk,0,R*.5,0,7);fs(c,f.c,lw*.6);c.fillStyle=OL;c.beginPath();c.arc(R*.25+lk,0,R*.25,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(R*.35+lk,-R*.12,R*.1,0,7);c.fill()}
 else if(K==='dragon'){const N=14,pts=[];for(let i=0;i<=N;i++){const u=i/N;pts.push([(-.55+u)*L,Math.sin(u*5-t*3+s)*L*.08*(1-u*.4)])}
  const path=()=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]))};
  pts.forEach((p,i)=>{if(i%2||i>N-2)return;c.beginPath();c.moveTo(p[0]-L*.02,p[1]-L*.05);c.lineTo(p[0],p[1]-L*.11);c.lineTo(p[0]+L*.02,p[1]-L*.05);fs(c,f.f,lw*.6)});
  path();c.lineWidth=L*.11+3;c.strokeStyle=OL;c.stroke();path();c.lineWidth=L*.11;c.strokeStyle=f.c;c.stroke();path();c.lineWidth=L*.04;c.strokeStyle=f.b;c.translate(0,L*.025);c.stroke();c.translate(0,-L*.025);
  const hp=pts[N];c.beginPath();c.ellipse(hp[0]+L*.04,hp[1],L*.1,L*.075,0,0,7);fs(c,f.c,lw);
  for(const sd of[-1,1]){c.beginPath();c.moveTo(hp[0]+L*.01,hp[1]-L*.05);c.quadraticCurveTo(hp[0]-L*.04,hp[1]-L*.14,hp[0]-L*.08+sd*L*.02,hp[1]-L*.16);c.lineWidth=L*.02;c.strokeStyle=f.f;c.stroke()}
  c.strokeStyle=f.f;c.lineWidth=Math.max(1,L*.008);c.beginPath();c.moveTo(hp[0]+L*.12,hp[1]+L*.02);c.quadraticCurveTo(hp[0]+L*.2,hp[1]+L*.08+Math.sin(t*3)*L*.03,hp[0]+L*.24,hp[1]+L*.02);c.stroke();
  eye(c,hp[0]+L*.06,hp[1]-L*.02,Math.max(2.4,L*.025),t,s,m,'sparkle');blush(c,hp[0]+L*.08,hp[1]+L*.035,L*.015);
  c.fillStyle='#fff6b0';c.beginPath();c.arc(hp[0]+L*.18,hp[1]-L*.1,L*.03,0,7);c.fill()}
 else if(K==='weed'){for(let i=0;i<5;i++){c.beginPath();c.moveTo(0,L*.3);c.bezierCurveTo((i-2)*L*.1,0,(i-2)*L*.15+Math.sin(t*2+i)*L*.06,-L*.2,(i-2)*L*.12,-L*.38);c.lineWidth=L*.06;c.strokeStyle=i%2?f.c:f.f;c.stroke()}face(c,0,L*.05,L,t,s,'hurt',.06)}
 else if(K==='bottle'){c.rotate(-.5+Math.sin(t*2)*.08);c.beginPath();c.roundRect(-L*.13,-L*.2,L*.26,L*.48,L*.08);c.fillStyle='rgba(160,224,200,.7)';c.fill();c.lineWidth=lw;c.strokeStyle=OL;c.stroke();
  c.beginPath();c.roundRect(-L*.05,-L*.36,L*.1,L*.18,L*.02);c.fill();c.stroke();c.fillStyle='#b9773c';c.fillRect(-L*.05,-L*.4,L*.1,L*.06);
  c.fillStyle=f.b;c.save();c.rotate(.15);c.fillRect(-L*.07,-L*.08,L*.14,L*.26);c.restore();face(c,0,L*.15,L,t,s,'o',.05)}
 if((f.feat||'').includes('crown')){const cy=-L*(K==='jelly'?.32:K==='fish'?.5*f.asp+.08:.3),cx=K==='fish'?L*.15:0;c.beginPath();c.moveTo(cx-L*.12,cy);c.lineTo(cx-L*.12,cy-L*.1);c.lineTo(cx-L*.06,cy-L*.05);c.lineTo(cx,cy-L*.13);c.lineTo(cx+L*.06,cy-L*.05);c.lineTo(cx+L*.12,cy-L*.1);c.lineTo(cx+L*.12,cy);c.closePath();fs(c,'#ffd23f',lw*.8);c.fillStyle='#ff5a7a';c.beginPath();c.arc(cx,cy-L*.03,L*.02,0,7);c.fill()}
 if(o.v==='gold'){c.fillStyle='rgba(255,250,200,.9)';for(let i=0;i<3;i++){const a=t*2+i*2.1;star5(c,Math.cos(a)*L*.4,Math.sin(a)*L*.25,L*.035*(1+Math.sin(t*6+i)*.3))}}
 if(f.r>=5&&f.r<7){for(let i=0;i<4;i++){const a=t*1.5+i*1.57,rr=L*.55;c.fillStyle='#fff6b0';c.save();c.translate(Math.cos(a)*rr,Math.sin(a)*rr*.6);c.rotate(t*3);const z=L*.04*(1+Math.sin(t*6+i)*.4);c.fillRect(-z,-z*.25,z*2,z*.5);c.fillRect(-z*.25,-z,z*.5,z*2);c.restore()}}
 c.restore()}
function pattern(c,f,rx,ry,L,t){const P=f.pat;pattern2(c,P,rx,ry,L,t);
 if(P==='spots'){c.fillStyle='rgba(80,50,20,.25)';for(let i=0;i<9;i++){c.beginPath();c.arc(-rx*.7+(i%4)*rx*.42+(i>3?rx*.2:0),-ry*.45+Math.floor(i/4)*ry*.4,L*.03,0,7);c.fill()}}
 else if(P==='dots'){c.fillStyle='rgba(30,50,90,.3)';for(let i=0;i<6;i++){c.beginPath();c.arc(-rx*.5+i*rx*.2,-ry*.2,L*.018,0,7);c.fill()}}
 else if(P==='stripes'){c.fillStyle='rgba(40,30,50,.22)';for(let i=0;i<5;i++)c.fillRect(-rx*.65+i*rx*.32,-ry,L*.055,ry*2)}
 else if(P==='bigstripes'){c.fillStyle='#3a3f48';for(let i=0;i<4;i++)c.fillRect(-rx*.75+i*rx*.42,-ry,L*.1,ry*2)}
 else if(P==='waves'){c.strokeStyle='rgba(20,40,80,.5)';c.lineWidth=L*.02;for(let i=0;i<6;i++){c.beginPath();c.moveTo(-rx*.8+i*rx*.26,-ry);c.quadraticCurveTo(-rx*.65+i*rx*.26,-ry*.5,-rx*.82+i*rx*.26,-ry*.05);c.stroke()}}
 else if(P==='bands'){for(const bx of[rx*.25,-rx*.35]){c.beginPath();c.ellipse(bx,0,L*.06,ry*1.1,0,0,7);c.fillStyle='#fff';c.fill();c.lineWidth=Math.max(1,L*.02);c.strokeStyle=OL;c.stroke()}}
 else if(P==='bluedots'){c.fillStyle='#7fd8ff';for(let i=0;i<10;i++){c.beginPath();c.arc(-rx*.7+(i%5)*rx*.32,-ry*.45+Math.floor(i/5)*ry*.35,L*.022,0,7);c.fill()}}
 else if(P==='wspots'){c.fillStyle='rgba(255,255,255,.75)';for(let i=0;i<16;i++){c.beginPath();c.arc(-rx*.85+(i%8)*rx*.24,-ry*.55+Math.floor(i/8)*ry*.38,L*.02,0,7);c.fill()}}
 else if(P==='scute'){c.strokeStyle='rgba(40,70,60,.45)';c.lineWidth=L*.02;c.beginPath();c.moveTo(-rx*.9,ry*.05);c.quadraticCurveTo(0,-ry*.3,rx*.6,-ry*.1);c.stroke()}
 else if(P==='yline'){c.fillStyle='#ffd23f';c.fillRect(-rx,-ry*.12,rx*2,ry*.18)}
 else if(P==='mahi'){c.fillStyle='rgba(40,120,220,.55)';for(let i=0;i<10;i++){c.beginPath();c.arc(-rx*.7+(i%5)*rx*.3,-ry*.5+Math.floor(i/5)*ry*.4,L*.02,0,7);c.fill()}}
 else if(P==='tuna'){c.fillStyle='rgba(255,255,255,.25)';c.fillRect(-rx,ry*.05,rx*2,ry*.12)}
 else if(P==='rainbow'){const cols=['#ff7a9a','#ffb35c','#ffe066','#7be495','#6fc7ff','#a98bff'];cols.forEach((col,i)=>{c.fillStyle=col;c.globalAlpha=.55;c.fillRect(-rx+((i*rx*.36+t*30)%(rx*2.2))-rx*.1,-ry,rx*.2,ry*2)});c.globalAlpha=1}
 else if(P==='shine'){c.fillStyle='rgba(255,255,255,.55)';const x=((t*.6)%2-1)*rx*1.6;c.beginPath();c.moveTo(x,-ry);c.lineTo(x+L*.12,-ry);c.lineTo(x-L*.04,ry);c.lineTo(x-L*.16,ry);c.fill()}}


function pattern2(c,P,rx,ry,L,t){
 if(P==='bellystripes'){c.strokeStyle='rgba(30,40,70,.45)';c.lineWidth=L*.015;for(let i=0;i<4;i++){c.beginPath();c.moveTo(-rx*.6,ry*(.15+i*.15));c.lineTo(rx*.5,ry*(.1+i*.15));c.stroke()}}
 else if(P==='vstripes'){c.fillStyle='rgba(120,190,255,.55)';for(let i=0;i<8;i++)c.fillRect(-rx*.8+i*rx*.2,-ry,L*.012,ry*1.4)}
 else if(P==='scribble'){c.strokeStyle='rgba(255,120,60,.55)';c.lineWidth=L*.015;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-rx*.8+i*rx*.35,-ry*.5);c.quadraticCurveTo(-rx*.6+i*rx*.35,0,-rx*.8+i*rx*.35,ry*.4);c.stroke()}}
 else if(P==='scales'){c.strokeStyle='rgba(80,50,10,.25)';c.lineWidth=Math.max(.8,L*.01);for(let j=0;j<4;j++)for(let i=0;i<7;i++){c.beginPath();c.arc(-rx*.8+i*rx*.26+(j%2)*rx*.13,-ry*.7+j*ry*.4,L*.04,-.5*Math.PI,.5*Math.PI);c.stroke()}}
 else if(P==='leopard'){c.fillStyle='rgba(50,30,10,.45)';for(let i=0;i<14;i++){c.beginPath();c.ellipse(-rx*.8+(i%7)*rx*.27+(i>6?rx*.12:0),-ry*.4+Math.floor(i/7)*ry*.55,L*.03,L*.02,i,0,7);c.fill()}}
 else if(P==='bassline'){c.fillStyle='rgba(30,50,20,.5)';for(let i=0;i<8;i++){c.beginPath();c.ellipse(-rx*.75+i*rx*.2,Math.sin(i)*ry*.08,L*.035,L*.022,0,0,7);c.fill()}}
 else if(P==='redband'){c.fillStyle='rgba(255,110,140,.55)';c.fillRect(-rx,-ry*.1,rx*2,ry*.3);c.fillStyle='rgba(40,40,30,.35)';for(let i=0;i<12;i++){c.beginPath();c.arc(-rx*.8+(i%6)*rx*.3,-ry*.55+Math.floor(i/6)*ry*.25,L*.012,0,7);c.fill()}}
 else if(P==='parr'){c.fillStyle='rgba(60,80,110,.35)';for(let i=0;i<6;i++){c.beginPath();c.ellipse(-rx*.7+i*rx*.27,0,L*.035,ry*.35,0,0,7);c.fill()}c.fillStyle='rgba(255,120,120,.5)';for(let i=0;i<5;i++){c.beginPath();c.arc(-rx*.55+i*rx*.28,-ry*.45,L*.012,0,7);c.fill()}}
 else if(P==='pinkstripe'){c.fillStyle='rgba(255,120,170,.5)';for(let i=0;i<6;i++)c.fillRect(-rx*.7+i*rx*.24,-ry*.2,L*.03,ry*.9)}
 else if(P==='snake'){c.fillStyle='rgba(20,20,10,.45)';for(let i=0;i<7;i++){c.beginPath();c.ellipse(-rx*.8+i*rx*.27,(i%2?-1:1)*ry*.25,L*.05,L*.03,.5,0,7);c.fill()}}
 else if(P==='eyespot'){c.fillStyle='#2b2140';c.beginPath();c.arc(-rx*.55,-ry*.2,L*.06,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(-rx*.55,-ry*.2,L*.03,0,7);c.fill();c.fillStyle='rgba(30,30,40,.6)';c.fillRect(rx*.38,-ry,L*.05,ry*2)}
 else if(P==='angel'){c.fillStyle='rgba(20,20,60,.4)';for(let i=0;i<3;i++)c.fillRect(-rx*.55+i*rx*.4,-ry,L*.06,ry*2)}
 else if(P==='tang'){c.fillStyle='rgba(20,20,40,.75)';c.beginPath();c.moveTo(rx*.4,-ry*.5);c.quadraticCurveTo(-rx*.2,-ry*.9,-rx*.8,-ry*.2);c.quadraticCurveTo(-rx*.2,-ry*.2,rx*.4,-ry*.1);c.fill();c.fillStyle='#ffe066';c.beginPath();c.moveTo(-rx,-ry*.2);c.lineTo(-rx*.6,0);c.lineTo(-rx,ry*.4);c.fill()}
 else if(P==='lionstripe'){c.fillStyle='rgba(120,30,20,.45)';for(let i=0;i<9;i++)c.fillRect(-rx*.85+i*rx*.2,-ry,L*.025,ry*2)}
 else if(P==='charspots'){c.fillStyle='rgba(255,220,200,.75)';for(let i=0;i<12;i++){c.beginPath();c.arc(-rx*.8+(i%6)*rx*.3,-ry*.6+Math.floor(i/6)*ry*.35,L*.016,0,7);c.fill()}}
 else if(P==='stars'){c.fillStyle='rgba(255,255,220,.9)';for(let i=0;i<9;i++)star5(c,-rx*.8+(i*.37%1)*rx*1.6,-ry*.6+(i*.61%1)*ry*1.1,L*.02*(1+Math.sin(t*4+i)*.4))}
 else if(P==='aurora'){['#7affc0','#7ad8ff','#c07aff','#ff9ad8'].forEach((col,i)=>{c.fillStyle=col;c.globalAlpha=.45;c.beginPath();c.moveTo(-rx,-ry*.6+i*ry*.35);for(let x=-rx;x<=rx;x+=rx*.2)c.lineTo(x,-ry*.6+i*ry*.35+Math.sin(x*.05+t*2+i)*ry*.15);c.lineTo(rx,-ry*.4+i*ry*.35);c.lineTo(-rx,-ry*.4+i*ry*.35);c.fill()});c.globalAlpha=1}
 else if(P==='zap'){c.strokeStyle='rgba(255,240,120,.9)';c.lineWidth=L*.02;c.beginPath();c.moveTo(-rx*.6,-ry*.6);c.lineTo(-rx*.2,0);c.lineTo(-rx*.35,0);c.lineTo(rx*.1,ry*.6);c.stroke()}}
// 변종 색: 돌연변이(색 반전)·황금·알비노
const VARC={};
function hueShift(hex,deg){const n=parseInt(hex.slice(1),16),[h,s,l]=rgb2hsl(n>>16,n>>8&255,n&255),[r,g,b]=hsl2rgb((h+deg)%360,Math.min(1,s+.15),l);return'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}
function varF(f,v){const key=f.id+v;if(VARC[key])return VARC[key];const o=Object.assign({},f);
 if(v==='gold'){o.c='#ffcb3a';o.b='#fff1b8';o.f='#f0a800';o.pat=f.pat==='rainbow'?f.pat:'shine'}
 else if(v==='albino'){o.c='#fbf2f2';o.b='#ffffff';o.f='#f6d0da';o.eye='red'}
 else if(v==='mut'){o.c=hueShift(f.c,150);o.b=hueShift(f.b,150);o.f=hueShift(f.f,150)}
 return VARC[key]=o}
