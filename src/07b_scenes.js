/* 4.7 장면 재디자인: 푸른 산속 계곡 폭포 · 등대 방파제 */
function srnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function rockBlob(x,y,w,h,c1,c2,seed){const n=9;ctx.beginPath();for(let i=0;i<=n;i++){const a=Math.PI+i/n*Math.PI,r=1+(srnd(seed+i)-.5)*.22;const px=x+Math.cos(a)*w*r,py=y+Math.sin(a)*h*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();
 const gr=ctx.createLinearGradient(x-w,y-h,x+w*.6,y);gr.addColorStop(0,c1);gr.addColorStop(1,c2);ctx.fillStyle=gr;ctx.fill();ctx.strokeStyle='rgba(20,30,30,.35)';ctx.lineWidth=1.5;ctx.stroke()}
function fern(x,y,s,t,col){ctx.strokeStyle=col;ctx.lineWidth=1.6*s;ctx.lineCap='round';for(let k=-2;k<=2;k++){const sw=Math.sin(t*1.6+x*.05+k)*2;ctx.beginPath();ctx.moveTo(x,y);const ex=x+k*9*s+sw,ey=y-(16-Math.abs(k)*3)*s;ctx.quadraticCurveTo(x+k*3*s,ey-4*s,ex,ey);ctx.stroke();for(let j=1;j<4;j++){const u=j/4,px=x+(ex-x)*u,py=y+(ey-y)*u;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+(k>=0?3:-3)*s,py-3*s);ctx.stroke()}}}
function drawValleyScene(g,t,dk,ph,night){const hgt=g.surf-g.top;
 // 먼 산 두 겹 + 안개
 mountains(g,dk('#9fd0b8','#9aaea8','#b88a9a','#18284c'),hgt*.72,1);
 ctx.fillStyle=dk('rgba(255,255,255,.28)','rgba(220,225,230,.3)','rgba(255,200,210,.2)','rgba(80,100,150,.15)');ctx.fillRect(0,g.surf-hgt*.42,W,hgt*.12);
 mountains(g,dk('#6fb886','#74927e','#8e6070','#112440'),hgt*.46,3);
 const pc0=dk('#3f8a5e','#55705f','#5e4054','#0e1c32');for(let i=0;i<9;i++)pine(W*(.02+i*.07),g.surf-hgt*.2-(srnd(i)*hgt*.08),.6+srnd(i+9)*.25,t,pc0);
 // 절벽
 const cx0=W*.6,lip=g.surf-hgt*.62,fx=W*.79,fw=Math.max(26,W*.085);
 const rc1=dk('#8c9a8a','#8a908a','#9a7a80','#2a3348'),rc2=dk('#5a6a5e','#5c635e','#6a4a58','#161d30'),rc3=dk('#47554c','#4a504c','#523a48','#10162a');
 ctx.fillStyle=rc2;ctx.beginPath();ctx.moveTo(cx0,g.surf);ctx.lineTo(cx0+W*.03,lip+hgt*.18);ctx.lineTo(cx0+W*.08,lip+hgt*.05);ctx.lineTo(fx-fw*.7,lip-4);ctx.lineTo(fx+fw*.7,lip-6);ctx.lineTo(W*.93,lip-hgt*.06);ctx.lineTo(W+10,lip-hgt*.02);ctx.lineTo(W+10,g.surf);ctx.closePath();ctx.fill();
 // 바위 층
 for(let i=0;i<14;i++){const u=srnd(i+40),v=srnd(i+70),x=cx0+W*.05+u*(W*.42),y=lip+10+v*(g.surf-lip-20);if(Math.abs(x-fx)<fw*.9)continue;rockBlob(x,y,14+srnd(i)*22,9+srnd(i+3)*12,rc1,rc3,i*7)}
 // 이끼·덩굴
 ctx.fillStyle=dk('#5aa86a','#5e8a66','#6a6a5a','#1a3a3a');for(let i=0;i<8;i++){const x=cx0+W*.06+srnd(i+90)*W*.38;if(Math.abs(x-fx)<fw)continue;ctx.beginPath();ctx.ellipse(x,lip+srnd(i+5)*14-6,10+srnd(i)*12,4,0,0,7);ctx.fill()}
 ctx.strokeStyle=dk('#3e8a52','#4e7058','#5a4a50','#12283a');ctx.lineWidth=1.5;for(let i=0;i<7;i++){const x=cx0+W*.08+srnd(i+120)*W*.36;if(Math.abs(x-fx)<fw)continue;const L=20+srnd(i+130)*40;ctx.beginPath();ctx.moveTo(x,lip);ctx.quadraticCurveTo(x+Math.sin(t+i)*4,lip+L*.5,x+Math.sin(t*1.3+i)*3,lip+L);ctx.stroke()}
 const pc=dk('#2f7a52','#4a6a58','#5a3a50','#0c1a30');pine(cx0+W*.1,lip+2,.8,t,pc);pine(W*.93,lip-hgt*.06+2,1,t,pc);pine(W*.99,lip-hgt*.02,.75,t,pc);
 // 폭포 물줄기
 const top=lip-4,bot=g.surf-2,wa=dk('rgba(225,246,255,.92)','rgba(215,230,240,.9)','rgba(255,225,235,.88)','rgba(150,180,230,.75)'),wb=dk('rgba(150,210,235,.9)','rgba(150,180,200,.9)','rgba(220,170,190,.85)','rgba(70,100,170,.75)');
 const gr=ctx.createLinearGradient(fx-fw,0,fx+fw,0);gr.addColorStop(0,wb);gr.addColorStop(.3,wa);gr.addColorStop(.7,wa);gr.addColorStop(1,wb);
 ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(fx-fw*.6,top);ctx.quadraticCurveTo(fx-fw*.66,top+8,fx-fw*.62,top+14);ctx.lineTo(fx-fw*.8,bot);ctx.lineTo(fx+fw*.8,bot);ctx.lineTo(fx+fw*.62,top+14);ctx.quadraticCurveTo(fx+fw*.66,top+8,fx+fw*.6,top);ctx.closePath();ctx.fill();
 // 흐르는 결
 ctx.save();ctx.clip();ctx.lineCap='round';const H0=bot-top;
 for(let i=0;i<16;i++){const u=(i+.5)/16,x=fx-fw*.6+u*fw*1.2,len=14+srnd(i)*26,sp=110+srnd(i+3)*80,off=(t*sp+srnd(i+8)*H0)%(H0+len)-len;ctx.strokeStyle=i%3?'rgba(255,255,255,.75)':'rgba(170,215,240,.8)';ctx.lineWidth=i%4?1.5:2.5;ctx.beginPath();ctx.moveTo(x+(u-.5)*fw*.3*(off/H0),top+off);ctx.lineTo(x+(u-.5)*fw*.3*((off+len)/H0),top+off+len);ctx.stroke()}
 ctx.restore();
 // 꼭대기 물 넘침 하이라이트
 ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(fx-fw*.6,top+1);ctx.quadraticCurveTo(fx,top-3+Math.sin(t*4)*1.2,fx+fw*.6,top+1);ctx.stroke();
 // 물보라·안개
 for(let i=0;i<10;i++){const a=(t*.8+srnd(i))%1,x=fx+(srnd(i+20)-.5)*fw*2.4,y=bot-4-a*24,r=(8+srnd(i+30)*10)*(1+a);ctx.fillStyle=`rgba(255,255,255,${.5*(1-a)})`;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
 for(let k=0;k<3;k++){const a=((t*.6+k/3)%1);ctx.strokeStyle=`rgba(255,255,255,${.6*(1-a)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(fx,bot+3,fw*(.8+a*1.6),3+a*3,0,0,7);ctx.stroke()}
 if(!LOWGFX&&Math.random()<.25)parts.push({x:fx+rnd(-fw*.7,fw*.7),y:bot-2,vx:rnd(-30,30),vy:rnd(-70,-30),l:.6,t:0,c:'rgba(230,248,255,.9)',r:rnd(1.5,2.5),g:1});
 // 무지개 (맑은 낮)
 if(ph<2&&rainAmt<.2){ctx.save();ctx.globalAlpha=.18+.06*Math.sin(t*.5);const rc=['#ff6a6a','#ffb04a','#ffe95a','#7ae07a','#6ab0ff','#a07aff'];for(let i=0;i<6;i++){ctx.strokeStyle=rc[i];ctx.lineWidth=3;ctx.beginPath();ctx.arc(fx,bot+6,fw*1.9-i*3,Math.PI*1.08,Math.PI*1.62);ctx.stroke()}ctx.restore()}
 // 앞쪽 바위·고사리·풀
 rockBlob(fx-fw*1.3,g.surf+2,22,12,rc1,rc3,301);rockBlob(fx+fw*1.25,g.surf+2,26,14,rc1,rc3,302);rockBlob(W*.97,g.surf+2,30,16,rc1,rc3,303);
 const fc=dk('#4fa36b','#5a8466','#7a4a5a','#16304a');fern(fx-fw*1.5,g.surf-8,1,t,fc);fern(fx+fw*1.5,g.surf-10,1.1,t,fc);fern(W*.97,g.surf-12,1,t,fc);
 for(let i=0;i<5;i++)pine(W*(.05+i*.11),g.surf-26-(i%2)*12,1+(i%3)*.2,t,pc);for(let i=0;i<7;i++)grass(W*.02+i*W*.07,g.surf-2,1,t,fc)}
function tetra(x,y,s,c1,c2,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);const arms=[[0,-1],[-.9,.5],[.9,.5],[.15,.15]];
 for(const [ax,ay] of arms){const ex=ax*s,ey=ay*s;const gr=ctx.createLinearGradient(-s,-s,s,s);gr.addColorStop(0,c1);gr.addColorStop(1,c2);ctx.strokeStyle=gr;ctx.lineCap='round';ctx.lineWidth=s*.62;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(ex,ey);ctx.stroke()}
 ctx.fillStyle=c1;ctx.beginPath();ctx.arc(0,0,s*.36,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=1;for(const [ax,ay] of arms){ctx.beginPath();ctx.arc(ax*s,ay*s,s*.3,0,7);ctx.stroke()}ctx.restore()}
function drawLightScene(g,t,dk,ph,night){const hgt=g.surf-g.top;
 // 먼 섬
 ctx.fillStyle=dk('#86b0c4','#8a9aa4','#b27a8e','#17264c');ctx.beginPath();ctx.moveTo(W*.05,g.surf);ctx.quadraticCurveTo(W*.2,g.surf-hgt*.16,W*.36,g.surf);ctx.fill();
 // 긴 방파제 (원근: 뒤로 갈수록 얇게)
 const bx0=W*.34,bx1=W*.9,byT0=g.surf-8,byT1=g.surf-16;
 ctx.fillStyle=dk('#c9c4b8','#a8a8a6','#c09aa0','#3a4260');ctx.beginPath();ctx.moveTo(bx0,byT0);ctx.lineTo(bx1,byT1);ctx.lineTo(bx1,byT1+8);ctx.lineTo(bx0,byT0+4);ctx.closePath();ctx.fill();
 ctx.fillStyle=dk('#9c978c','#85847f','#957078','#283050');ctx.beginPath();ctx.moveTo(bx0,byT0+4);ctx.lineTo(bx1,byT1+8);ctx.lineTo(bx1,g.surf);ctx.lineTo(bx0,g.surf);ctx.closePath();ctx.fill();
 const tc1=dk('#d8d4ca','#b8b8b4','#d0aab0','#4a5272'),tc2=dk('#8a867c','#7a7a76','#8a6a72','#22283e');
 for(let i=0;i<22;i++){const u=i/21,x=bx0+(bx1-bx0)*u+srnd(i)*6,y=g.surf-1-srnd(i+5)*3;tetra(x,y,5.5-u*1.5,tc1,tc2,srnd(i+9)*3)}
 // 등대 (빨간 등대)
 const lx=W*.87,base=byT1+2,lh=Math.min(g.ch*1.15,hgt*.75),bw=Math.max(14,W*.035),tw=bw*.72;
 ctx.fillStyle=dk('#d8d2c4','#b0b0ac','#c8a8a8','#454c6a');ctx.fillRect(lx-bw*1.3,base-6,bw*2.6,8);
 const red=dk('#e2483e','#b8524a','#d0506a','#7a2a40'),redS=dk('#a82a28','#86403a','#982a48','#4a1a2c'),wht=dk('#fbf7ee','#dcdcd8','#f4d8d8','#9aa4c4'),whtS=dk('#d2cbbd','#b4b4b0','#c8a8b0','#6a7494');
 const tg=ctx.createLinearGradient(lx-bw,0,lx+bw,0);tg.addColorStop(0,red);tg.addColorStop(.45,red);tg.addColorStop(1,redS);ctx.fillStyle=tg;ctx.beginPath();ctx.moveTo(lx-bw,base-6);ctx.lineTo(lx-tw,base-lh);ctx.lineTo(lx+tw,base-lh);ctx.lineTo(lx+bw,base-6);ctx.closePath();ctx.fill();
 for(let i=0;i<2;i++){const y0=base-lh*(.3+i*.32),y1=y0-lh*.1,w0=bw-(bw-tw)*((base-y0)/lh),w1=bw-(bw-tw)*((base-y1)/lh);const wg=ctx.createLinearGradient(lx-bw,0,lx+bw,0);wg.addColorStop(0,wht);wg.addColorStop(.5,wht);wg.addColorStop(1,whtS);ctx.fillStyle=wg;ctx.beginPath();ctx.moveTo(lx-w0,y0);ctx.lineTo(lx-w1,y1);ctx.lineTo(lx+w1,y1);ctx.lineTo(lx+w0,y0);ctx.fill()}
 ctx.fillStyle=dk('#5a3a2a','#4a3a30','#4a2a30','#1a1420');ctx.beginPath();ctx.roundRect(lx-bw*.28,base-6-bw*.9,bw*.56,bw*.9,[bw*.28,bw*.28,0,0]);ctx.fill();
 ctx.fillStyle=night?'#ffe9a0':'#6a8aa8';ctx.fillRect(lx-2,base-lh*.55,4,6);ctx.fillRect(lx-2,base-lh*.82,4,6);
 // 전망대·등롱
 const gy=base-lh;ctx.fillStyle=dk('#3b3b48','#3b3b48','#3b2b38','#151522');ctx.fillRect(lx-tw*1.45,gy-3,tw*2.9,4);ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=1;for(let i=0;i<=6;i++){const x=lx-tw*1.4+i*tw*2.8/6;ctx.beginPath();ctx.moveTo(x,gy-3);ctx.lineTo(x,gy-9);ctx.stroke()}ctx.beginPath();ctx.moveTo(lx-tw*1.4,gy-9);ctx.lineTo(lx+tw*1.4,gy-9);ctx.stroke();
 const lr=tw*.85,lt=gy-3-lr*1.6,lit=night||rainAmt>.5||ph===2;ctx.fillStyle=lit?'#fff3a8':'rgba(190,225,245,.9)';ctx.fillRect(lx-lr,lt,lr*2,lr*1.6);ctx.strokeStyle='#2a2a34';ctx.lineWidth=1.2;ctx.strokeRect(lx-lr,lt,lr*2,lr*1.6);ctx.beginPath();ctx.moveTo(lx,lt);ctx.lineTo(lx,lt+lr*1.6);ctx.stroke();
 ctx.fillStyle=red;ctx.beginPath();ctx.moveTo(lx-lr*1.25,lt);ctx.quadraticCurveTo(lx,lt-lr*1.6,lx+lr*1.25,lt);ctx.closePath();ctx.fill();ctx.fillStyle='#2a2a34';ctx.fillRect(lx-1,lt-lr*1.5,2,lr*.6);
 if(lit){const cy=lt+lr*.8,gl=ctx.createRadialGradient(lx,cy,2,lx,cy,lr*7);gl.addColorStop(0,'rgba(255,240,170,.75)');gl.addColorStop(1,'rgba(255,240,170,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(lx,cy,lr*7,0,7);ctx.fill();
  const a=t*1.1,dir=Math.cos(a),sp=.09;ctx.fillStyle=`rgba(255,243,170,${.1+.12*Math.abs(dir)})`;ctx.beginPath();ctx.moveTo(lx,cy);const L=W*1.1;ctx.lineTo(lx+dir*L,cy-L*sp);ctx.lineTo(lx+dir*L,cy+L*sp);ctx.closePath();ctx.fill();
  // 수면 반사
  for(let i=0;i<8;i++){const y=g.surf+4+i*5,w=(6+i*2)*(1+.3*Math.sin(t*3+i));ctx.fillStyle=`rgba(255,235,150,${.35-i*.035})`;ctx.fillRect(lx-w/2+Math.sin(t*2+i)*3,y,w,1.6)}}
 if(night){for(let i=0;i<14;i++){ctx.fillStyle=['#ffe08a','#ff9ec4','#9fe8ff'][i%3];ctx.globalAlpha=.5+.5*Math.sin(t*2+i);ctx.fillRect(bx0+(bx1-bx0)*(i/14)+2,byT0-2-(byT1-byT0)*(i/14)*-1-3,2,2)}ctx.globalAlpha=1}
 // 파도 부딪힘
 const sx=bx0+(bx1-bx0)*((t*.13)%1);if(Math.sin(t*2.3)>.92&&!LOWGFX&&Math.random()<.4)parts.push({x:sx,y:g.surf-4,vx:rnd(-15,15),vy:rnd(-60,-30),l:.5,t:0,c:'rgba(255,255,255,.9)',r:2,g:1})}
function drawLightPlat(g,t,night){const y=g.platY,e=g.edge;
 const top=night?'#7a8296':'#e6e1d6',face=night?'#555d72':'#bdb7aa',face2=night?'#3a4256':'#8f897d';
 // 4.15.1 물속까지 꽉 찬 벽이 수중 배경을 가려서: 수면 조금 아래까지만 옆면, 그 아래는 기둥 3개
 const sb=g.surf+14,fg=ctx.createLinearGradient(0,y+12,0,sb);fg.addColorStop(0,face);fg.addColorStop(1,face2);ctx.fillStyle=fg;ctx.fillRect(0,y+12,e,sb-y-12);
 const pg=ctx.createLinearGradient(0,sb,0,g.bed);pg.addColorStop(0,face2);pg.addColorStop(1,night?'rgba(40,50,70,.55)':'rgba(110,120,120,.45)');ctx.fillStyle=pg;const pw=Math.max(14,e*.07);
 for(const px of[e*.12,e*.5,e-pw-2]){ctx.fillRect(px,sb,pw,g.bed-sb);ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(px+pw-3,sb,3,g.bed-sb);ctx.fillStyle=pg}
 ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(0,sb-3,e,3);
 ctx.fillStyle=top;ctx.fillRect(0,y,e,12);ctx.fillStyle=night?'#8a92a6':'#f4f0e8';ctx.fillRect(0,y,e,2.5);
 ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=1.5;for(let x=e*.22;x<e;x+=e*.26){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+12);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y+12);ctx.lineTo(x,sb);ctx.stroke()}
 ctx.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<18;i++){ctx.fillRect(srnd(i)*e,y+14+srnd(i+3)*(sb-y-20),2,2)}
 // 물때 라인
 ctx.fillStyle=night?'rgba(30,60,60,.5)':'rgba(70,110,90,.35)';ctx.fillRect(0,g.surf-2,e,10);
 // 난간
 const ry=y-g.ch*.26,rc=night?'#9aa2b8':'#8a929c';ctx.strokeStyle=rc;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(3,ry);ctx.lineTo(e*.36,ry);ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(3,ry+g.ch*.12);ctx.lineTo(e*.36,ry+g.ch*.12);ctx.stroke();ctx.lineWidth=3;for(let x=3;x<=e*.36+1;x+=e*.12){ctx.beginPath();ctx.moveTo(x,ry-1);ctx.lineTo(x,y);ctx.stroke()}
 // 계선주(볼라드)
 const bx=e-g.ch*.16;ctx.fillStyle=night?'#4a4a58':'#3a3a44';ctx.beginPath();ctx.roundRect(bx-6,y-14,12,14,[5,5,1,1]);ctx.fill();ctx.fillRect(bx-9,y-15,18,3);ctx.strokeStyle='#c9a26a';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(bx,y-10);ctx.quadraticCurveTo(bx+14,y+20,e+8,g.surf+4);ctx.stroke();
 // 테트라포드 더미
 const c1=night?'#8a92a8':'#dcd7cc',c2=night?'#40475e':'#8e897d';
 [[e+30,g.surf+4,13,1.9],[e+6,g.surf-4,17,.3],[e+20,g.surf+14,15,2.6],[e-2,g.surf+16,16,.9]].forEach(([x,yy,s,r])=>tetra(x,yy,s,c1,c2,r+Math.sin(t*.3)*0));
 ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=2;for(let k=0;k<4;k++){const a=(t*.5+k/4)%1;ctx.globalAlpha=1-a;ctx.beginPath();ctx.ellipse(e+20,g.surf+4,18+a*30,2+a*2,0,0,7);ctx.stroke()}ctx.globalAlpha=1;
 if(Math.sin(t*1.7)>.95&&!LOWGFX&&Math.random()<.4)splash(e+18,g.surf,8+stormAmt*14,160+stormAmt*100)}
/* 4.8 여수 선착장 · 돌산 갯바위 재디자인 */
function hillLayer(g,col,h,seed,x0,x1){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x0,g.surf);const n=10;for(let i=0;i<=n;i++){const u=i/n,x=x0+(x1-x0)*u;ctx.lineTo(x,g.surf-h*(.35+.65*Math.abs(Math.sin(u*3.1+seed))*(1-Math.abs(u-.5)*.6)))}ctx.lineTo(x1,g.surf);ctx.closePath();ctx.fill()}
function gullFly(x,y,s,t,col){const f=Math.sin(t*8)*s*.5;ctx.strokeStyle=col;ctx.lineWidth=1.8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-s,y-f);ctx.quadraticCurveTo(x-s*.4,y-s*.5,x,y);ctx.quadraticCurveTo(x+s*.4,y-s*.5,x+s,y-f);ctx.stroke()}
function skyGulls(g,t,night){if(night||rainAmt>.6||save.pet==='seagull')return;for(let i=0;i<3;i++){const sp=12+i*5,x=((t*sp+i*W*.45)%(W+120))-60,y=g.top+(g.surf-g.top)*(.18+i*.09)+Math.sin(t*.8+i)*8;gullFly(x,y,5+i,t+i,'rgba(70,80,90,.75)')}}
function harborBoat(x,y,s,t,c1,night){ctx.save();ctx.translate(x,y+Math.sin(t*1.4+x)*1.5);ctx.rotate(Math.sin(t*1.1+x)*.03);
 ctx.fillStyle=c1;ctx.beginPath();ctx.moveTo(-18*s,-4*s);ctx.lineTo(20*s,-6*s);ctx.lineTo(15*s,3*s);ctx.lineTo(-15*s,3*s);ctx.closePath();ctx.fill();
 ctx.fillStyle=night?'#8a90a8':'#f4f4f0';ctx.fillRect(-6*s,-12*s,12*s,8*s);ctx.fillStyle=night?'#ffe08a':'#6aa0c8';ctx.fillRect(-4*s,-10*s,3*s,3*s);ctx.fillRect(1*s,-10*s,3*s,3*s);
 ctx.strokeStyle=night?'#6a7088':'#5a5a5a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(8*s,-6*s);ctx.lineTo(8*s,-22*s);ctx.lineTo(18*s,-6*s);ctx.stroke();
 if(night){ctx.fillStyle='rgba(255,220,130,.9)';ctx.beginPath();ctx.arc(8*s,-22*s,1.6,0,7);ctx.fill()}ctx.restore()}
function drawPierFar(g,t,dk,ph,night){const hgt=g.surf-g.top;
 hillLayer(g,dk('#9cc4d2','#9aa8b0','#c08a9a','#1c2c54'),hgt*.42,1.3,W*.2,W*1.05);
 // 여수 시가지
 const cx0=W*.34,cx1=W*.98,base=g.surf-6;for(let i=0;i<26;i++){const u=i/25,x=cx0+(cx1-cx0)*u,bw=6+srnd(i)*9,bh=10+srnd(i+3)*30*(1-Math.abs(u-.55));ctx.fillStyle=dk(i%3?'#dfe8ee':'#c8d6de','#b8c0c6','#e0b8c0','#26365e');ctx.fillRect(x,base-bh,bw,bh);
  if(night){ctx.fillStyle=['#ffe08a','#fff3c0','#9fe8ff'][i%3];for(let k=0;k<3;k++)if(srnd(i*7+k)>.35)ctx.fillRect(x+2+(k%2)*3,base-bh+3+k*5,2,2)}}
 // 돌산대교
 const bx0=W*.4,bx1=W*.99,by=g.surf-hgt*.2,tw=[bx0+(bx1-bx0)*.32,bx0+(bx1-bx0)*.72],bc=night?'#5a6ea8':'rgba(255,255,255,.95)';
 ctx.strokeStyle=bc;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx0,by);ctx.lineTo(bx1,by);ctx.stroke();ctx.lineWidth=2.5;for(const x of tw){ctx.beginPath();ctx.moveTo(x-3,by+16);ctx.lineTo(x-2,by-hgt*.2);ctx.moveTo(x+3,by+16);ctx.lineTo(x+2,by-hgt*.2);ctx.stroke()}
 ctx.lineWidth=1;for(const x of tw)for(let k=1;k<=6;k++){ctx.beginPath();ctx.moveTo(x,by-hgt*.2+3);ctx.lineTo(x-k*(bx1-bx0)*.045,by);ctx.moveTo(x,by-hgt*.2+3);ctx.lineTo(x+k*(bx1-bx0)*.045,by);ctx.stroke()}
 ctx.fillStyle=night?'#3a4a7a':'rgba(255,255,255,.8)';for(let x=bx0+10;x<bx1;x+=(bx1-bx0)/8)ctx.fillRect(x-2,by,4,g.surf-by);
 if(night){const cols=['#ff5d8f','#ffd23f','#5df0ff','#9b7bff'];for(let i=0;i<30;i++){ctx.fillStyle=cols[(i+Math.floor(t*3))%4];ctx.fillRect(bx0+(bx1-bx0)*i/29-1.5,by-3,3,3)}
  for(const x of tw){ctx.fillStyle=cols[Math.floor(t*2)%4];ctx.globalAlpha=.5;ctx.fillRect(x-3,by-hgt*.2,6,hgt*.2);ctx.globalAlpha=1}}
 // 정박한 어선들
 harborBoat(W*.5,g.surf-2,1,t,dk('#2f6fb8','#4a6a88','#7a4a70','#28386a'),night);harborBoat(W*.66,g.surf-1,.85,t,dk('#e05a4a','#9a5a50','#b04a5a','#4a2a40'),night);harborBoat(W*.83,g.surf-2,1.1,t,dk('#2aa07a','#4a8070','#6a5a60','#1a4a4a'),night);
 // 왼쪽 언덕과 소나무
 ctx.fillStyle=dk('#6aa890','#73887f','#93506a','#10203f');ctx.beginPath();ctx.moveTo(-10,g.surf);ctx.quadraticCurveTo(W*.14,g.surf-hgt*.36,W*.36,g.surf);ctx.fill();
 const pc=dk('#2f7a52','#4a6a58','#5a3a50','#0c1a30');pine(W*.06,g.surf-hgt*.18,1,t,pc);pine(W*.15,g.surf-hgt*.24,1.2,t,pc);pine(W*.25,g.surf-hgt*.12,.9,t,pc);
 skyGulls(g,t,night)}
function drawRockFar(g,t,dk,ph,night){const hgt=g.surf-g.top;
 hillLayer(g,dk('#8fbccc','#98a6ae','#b8869a','#1a2a52'),hgt*.32,2.1,W*.25,W*1.05);
 // 해안 절벽 (돌산 해안)
 const c1=dk('#7a8a88','#7c8486','#8a6a78','#1e2844'),c2=dk('#56635f','#5c6466','#664a5a','#141a32');
 ctx.fillStyle=c2;ctx.beginPath();ctx.moveTo(W*.5,g.surf);ctx.lineTo(W*.56,g.surf-hgt*.28);ctx.lineTo(W*.63,g.surf-hgt*.36);ctx.lineTo(W*.72,g.surf-hgt*.3);ctx.lineTo(W*.8,g.surf-hgt*.44);ctx.lineTo(W*.9,g.surf-hgt*.4);ctx.lineTo(W*1.02,g.surf-hgt*.48);ctx.lineTo(W*1.02,g.surf);ctx.closePath();ctx.fill();
 ctx.fillStyle=c1;ctx.globalAlpha=.45;for(let i=0;i<9;i++){const x=W*(.56+i*.05),y=g.surf-hgt*(.1+srnd(i+4)*.24),w2=W*(.02+srnd(i+11)*.03);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w2*.6,y-hgt*.05);ctx.lineTo(x+w2,y+hgt*.04);ctx.lineTo(x+w2*.3,y+hgt*.09);ctx.closePath();ctx.fill()}ctx.globalAlpha=1;ctx.strokeStyle=c2;ctx.lineWidth=1;for(let i=0;i<6;i++){const x=W*(.58+i*.07);ctx.beginPath();ctx.moveTo(x,g.surf-hgt*(.3+srnd(i)*.1));ctx.lineTo(x+W*.01,g.surf-hgt*.05);ctx.stroke()}
 ctx.fillStyle=dk('#5aa070','#5a806a','#6a5a60','#12283a');ctx.beginPath();ctx.moveTo(W*.58,g.surf-hgt*.3);for(let i=0;i<=8;i++)ctx.lineTo(W*(.58+i*.055),g.surf-hgt*(.36+(i%3)*.04+(i>4?.06:0)));ctx.lineTo(W*1.02,g.surf-hgt*.4);ctx.lineTo(W*1.02,g.surf-hgt*.46);ctx.closePath();ctx.fill();
 const pc=dk('#2f7a52','#4a6a58','#5a3a50','#0c1a30');for(let i=0;i<5;i++)pine(W*(.66+i*.08),g.surf-hgt*(.4+(i%2)*.04),.6+(i%3)*.12,t,pc);
 // 작은 정자 섬
 ctx.fillStyle=c2;ctx.beginPath();ctx.ellipse(W*.38,g.surf,W*.07,hgt*.07,0,Math.PI,0);ctx.fill();ctx.fillStyle=dk('#c0504a','#a05a50','#a04a5a','#4a2a3a');ctx.beginPath();ctx.moveTo(W*.36,g.surf-hgt*.1);ctx.lineTo(W*.38,g.surf-hgt*.14);ctx.lineTo(W*.40,g.surf-hgt*.1);ctx.fill();ctx.fillStyle=c2;ctx.fillRect(W*.365,g.surf-hgt*.1,2,hgt*.04);ctx.fillRect(W*.393,g.surf-hgt*.1,2,hgt*.04);
 // 바위에 부서지는 파도
 for(let i=0;i<3;i++){const x=W*(.6+i*.14),a=(t*.5+i*.33)%1;ctx.fillStyle=`rgba(255,255,255,${.7*(1-a)})`;ctx.beginPath();ctx.arc(x,g.surf-2-a*10,4+a*8,0,7);ctx.fill()}
 skyGulls(g,t,night)}
function drawPierPlat(g,t,night){const y=g.platY,e=g.edge,pw=Math.max(10,g.ch*.08),wl=g.surf;
 const w1=night?'#5a4a40':'#b07a48',w2=night?'#45382f':'#8e5e36',w3=night?'#3a2e26':'#6e4628';
 // 말뚝 (물때·따개비·밧줄)
 const posts=[g.ch*.12,e*.5,e-pw*.6];for(const px of posts){const pg=ctx.createLinearGradient(px-pw/2,0,px+pw/2,0);pg.addColorStop(0,w2);pg.addColorStop(.5,w1);pg.addColorStop(1,w3);ctx.fillStyle=pg;ctx.fillRect(px-pw/2,y+14,pw,g.bed-y);
  ctx.fillStyle=night?'rgba(30,60,50,.6)':'rgba(60,100,70,.55)';ctx.fillRect(px-pw/2,wl-6,pw,16);ctx.fillStyle=night?'#8a8a90':'#e8e4d8';for(let k=0;k<5;k++)ctx.beginPath(),ctx.arc(px-pw/2+2+srnd(px+k)*(pw-4),wl+2+srnd(px*2+k)*8,1.5,0,7),ctx.fill();
  ctx.strokeStyle=night?'#8a7a60':'#d8c08a';ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(px-pw/2,y+22+k*4);ctx.lineTo(px+pw/2,y+20+k*4);ctx.stroke()}
  for(let k=0;k<2;k++){const a=(t*.6+k*.5+px*.01)%1;ctx.strokeStyle=`rgba(255,255,255,${.6*(1-a)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(px,wl+2,pw*.7+a*12,1.5+a*2,0,0,7);ctx.stroke()}}
 // 가로 보강재
 ctx.strokeStyle=w3;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(posts[0],y+24);ctx.lineTo(posts[1],wl-10);ctx.moveTo(posts[1],y+24);ctx.lineTo(posts[2],wl-10);ctx.stroke();
 // 상판 (널빤지 결)
 ctx.fillStyle=w3;ctx.fillRect(0,y+12,e,8);
 const n=Math.ceil(e/18);for(let i=0;i<n;i++){const x=i*18;ctx.fillStyle=[w1,w2,w1][i%3];ctx.fillRect(x,y,17,13);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(x,y,17,2);ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+3,y+5+srnd(i)*3);ctx.lineTo(x+13,y+6+srnd(i+1)*3);ctx.stroke();ctx.fillStyle=night?'#2a2a30':'#4a3a2a';ctx.fillRect(x+2,y+9,1.5,1.5);ctx.fillRect(x+14,y+9,1.5,1.5)}
 ctx.fillStyle='rgba(0,0,0,.25)';for(let i=1;i<n;i++)ctx.fillRect(i*18-1,y,1,13);
 // 타이어 방현재
 const fx=e-2;ctx.fillStyle=night?'#1a1a20':'#2a2a2e';ctx.beginPath();ctx.ellipse(fx,y+22,6,9,0,0,7);ctx.fill();ctx.fillStyle=night?'#2a2a30':'#4a4a50';ctx.beginPath();ctx.ellipse(fx,y+22,3,5,0,0,7);ctx.fill();
 // 사다리
 ctx.strokeStyle=night?'#8a92a8':'#9aa4ac';ctx.lineWidth=2;const lx=e*.72;ctx.beginPath();ctx.moveTo(lx,y+14);ctx.lineTo(lx,wl+20);ctx.moveTo(lx+10,y+14);ctx.lineTo(lx+10,wl+20);for(let k=y+22;k<wl+18;k+=9){ctx.moveTo(lx,k);ctx.lineTo(lx+10,k)}ctx.stroke();
 // 계선주 + 감긴 밧줄
 const bx=e-g.ch*.06;ctx.fillStyle=night?'#4a4a58':'#3a3a44';ctx.beginPath();ctx.roundRect(bx-5,y-11,10,11,[4,4,1,1]);ctx.fill();ctx.fillRect(bx-8,y-12,16,3);
 ctx.strokeStyle='#c9a26a';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(bx,y-8);ctx.quadraticCurveTo(bx+16,y+24,e+12,wl+4);ctx.stroke();
 // 물에 비친 그림자
 ctx.fillStyle=night?'rgba(0,0,20,.25)':'rgba(0,40,60,.15)';ctx.fillRect(0,wl,e,14)}
function crab(x,y,s,t,dir){const w=Math.sin(t*10)*1.5;ctx.save();ctx.translate(x,y);ctx.scale(dir,1);ctx.fillStyle='#e0553a';ctx.strokeStyle='#7a2a1a';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,-3*s,5*s,3.2*s,0,0,7);ctx.fill();ctx.stroke();
 for(const sd of[-1,1]){for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(sd*3*s,-2*s);ctx.lineTo(sd*(6+k)*s,(1+(k%2?w:-w)*.3)*s);ctx.stroke()}ctx.beginPath();ctx.arc(sd*6*s,-6*s,2*s,0,7);ctx.fill();ctx.stroke()}
 ctx.fillStyle='#222';ctx.fillRect(-2*s,-7*s,1.2*s,1.2*s);ctx.fillRect(1*s,-7*s,1.2*s,1.2*s);ctx.restore()}
function drawRockPlat(g,t,night){const y=g.platY,e=g.edge,wl=g.surf;
 const r1=night?'#525a70':'#a39a8c',r2=night?'#3a4256':'#7d756a',r3=night?'#262c3e':'#59524a',r4=night?'#6a7288':'#c4bbad';
 // 몸통
 ctx.fillStyle=r2;ctx.beginPath();ctx.moveTo(-10,g.bed);ctx.lineTo(-10,y+4);ctx.lineTo(e*.18,y-4);ctx.lineTo(e*.45,y-2);ctx.lineTo(e*.72,y-6);ctx.lineTo(e*.95,y+2);ctx.lineTo(e+10,y+16);ctx.lineTo(e+22,wl-6);ctx.lineTo(e+18,wl+30);ctx.lineTo(e+34,g.bed);ctx.closePath();ctx.fill();
 // 면(facet) 음영
 const fac=[[[-10,y+4],[e*.18,y-4],[e*.3,y+30],[-10,y+44]],[[e*.18,y-4],[e*.45,y-2],[e*.52,y+26],[e*.3,y+30]],[[e*.45,y-2],[e*.72,y-6],[e*.8,y+24],[e*.52,y+26]],[[e*.72,y-6],[e*.95,y+2],[e+10,y+16],[e*.8,y+24]]];
 fac.forEach((P,i)=>{ctx.fillStyle=[r1,r4,r1,r2][i];ctx.beginPath();P.forEach(([x,yy],k)=>k?ctx.lineTo(x,yy):ctx.moveTo(x,yy));ctx.closePath();ctx.fill()});
 ctx.fillStyle=r3;ctx.beginPath();ctx.moveTo(e*.3,y+30);ctx.lineTo(e*.52,y+26);ctx.lineTo(e*.8,y+24);ctx.lineTo(e+10,y+16);ctx.lineTo(e+22,wl-6);ctx.lineTo(e*.6,wl+10);ctx.lineTo(-10,y+60);ctx.lineTo(-10,y+44);ctx.closePath();ctx.globalAlpha=.55;ctx.fill();ctx.globalAlpha=1;
 // 갈라진 틈
 ctx.strokeStyle=r3;ctx.lineWidth=1.5;ctx.lineCap='round';[[e*.12,y+8,e*.2,y+40],[e*.5,y+6,e*.46,y+36],[e*.62,y+30,e*.7,wl-10],[e*.25,y+50,e*.38,wl]].forEach(([a,b,c,d])=>{ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo((a+c)/2+4,(b+d)/2);ctx.lineTo(c,d);ctx.stroke()});
 // 따개비·굴
 ctx.fillStyle=night?'#9aa0b0':'#ece6da';for(let i=0;i<26;i++){const x=srnd(i+50)*(e+10),yy=wl-12+srnd(i+80)*22;ctx.beginPath();ctx.arc(x,yy,1.2+srnd(i)*1.6,0,7);ctx.fill()}
 // 해초·이끼 (물때)
 ctx.fillStyle=night?'#1e3a3a':'#3f7a4a';ctx.beginPath();ctx.moveTo(-10,wl-4);for(let x=-10;x<=e+20;x+=8)ctx.lineTo(x,wl-4+Math.sin(x*.3)*3);ctx.lineTo(e+20,wl+8);ctx.lineTo(-10,wl+8);ctx.closePath();ctx.fill();
 ctx.strokeStyle=night?'#2a5040':'#4f9a5a';ctx.lineWidth=2;for(let i=0;i<8;i++){const x=srnd(i+200)*e;ctx.beginPath();ctx.moveTo(x,wl);ctx.quadraticCurveTo(x+Math.sin(t*1.5+i)*4,wl+10,x+Math.sin(t+i)*6,wl+20);ctx.stroke()}
 // 웅덩이 (조수 웅덩이)
 ctx.fillStyle=night?'rgba(60,90,140,.6)':'rgba(120,200,220,.75)';ctx.beginPath();ctx.ellipse(e*.36,y+4,e*.09,2.5,0,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(e*.33,y+3,4,1);
 // 상단 하이라이트·풀
 ctx.strokeStyle=night?'rgba(255,255,255,.12)':'rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-10,y+4);ctx.lineTo(e*.18,y-4);ctx.lineTo(e*.45,y-2);ctx.lineTo(e*.72,y-6);ctx.lineTo(e*.95,y+2);ctx.stroke();
 grass(e*.05,y+3,.8,t,night?'#2a5040':'#5aa35a');
 // 게 한 마리
 if(!night){const cx2=e*.45+Math.sin(t*.4)*e*.25,dir=Math.cos(t*.4)>0?1:-1;crab(cx2,wl-6+Math.sin(t*.4)*0,1.1,t,dir)}
 // 물속 바위: 푸른 기운·작은 돌
 ctx.save();ctx.beginPath();ctx.moveTo(-10,wl+8);ctx.lineTo(e+20,wl+8);ctx.lineTo(e+18,wl+30);ctx.lineTo(e+34,g.bed);ctx.lineTo(-10,g.bed);ctx.closePath();ctx.clip();const uw=ctx.createLinearGradient(0,wl,0,g.bed);uw.addColorStop(0,night?'rgba(10,30,70,.6)':'rgba(30,110,140,.55)');uw.addColorStop(1,night?'rgba(5,10,40,.9)':'rgba(15,60,90,.88)');ctx.fillStyle=uw;ctx.fillRect(-10,wl+8,e+50,g.bed-wl);
 for(let i=0;i<9;i++){rockBlob(srnd(i+300)*(e+20),wl+30+srnd(i+310)*(g.bed-wl-40),10+srnd(i)*14,7+srnd(i+2)*8,night?'#2a3450':'#5a7a88',night?'#151c34':'#34505e',i+400)}
 ctx.strokeStyle=night?'#1e4a40':'#3f8a5a';ctx.lineWidth=2.5;for(let i=0;i<6;i++){const x=srnd(i+500)*e,y0=g.bed-srnd(i+510)*30;ctx.beginPath();ctx.moveTo(x,y0);ctx.quadraticCurveTo(x+Math.sin(t*1.2+i)*8,y0-30,x+Math.sin(t*1.5+i)*10,y0-60-srnd(i)*30);ctx.stroke()}ctx.restore();
 // 파도 부딪힘
 for(let k=0;k<3;k++){const a=(t*.7+k/3)%1;ctx.strokeStyle=`rgba(255,255,255,${.7*(1-a)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(e+20,wl+4,12+a*26,2+a*2,0,0,7);ctx.stroke()}
 if(Math.sin(t*1.1)>.96&&!LOWGFX&&Math.random()<.35)splash(e+16,wl,7+stormAmt*14,150+stormAmt*100)}
