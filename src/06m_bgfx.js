/* ================= 4.17 살아 있는 배경: 시간대 7 · 날씨 · 계절 =================
 원본 배경 그림(bg_<id>)을 그대로 쓰되, 영역 지도(bgfx_<id>: R 하늘·G 구름·B 식물)로
 - 하늘: 시간대·날씨에 맞는 새 하늘(그라데이션·구름·해·달·별)로 다시 칠함(원래 밝기 차이는 살려서 산·구름 모양 유지)
 - 땅·건물: 빛 색·채도·대비 조정, 밤엔 어둡게 + 창문·가로등·등대 불빛
 - 계절: 봄·가을·겨울 덧그림(bgs_<id>_<계절>) + 계절 색감
 - 바다(게임 물): 노을 윤슬 기둥, 폭풍 흰 포말
 계산은 조건(장소·시간대·날씨·계절)이 바뀔 때만, 여러 프레임에 나눠서(끊김 방지) 하고 2초 동안 부드럽게 바뀜 */
const BFXM=__BGFXMETA__;
const BFX={src:null,srcL:'',key:'',cur:null,prev:null,fade:1,job:null,rect:null,noise:null,on:true};
const hx=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
// 시간대 팔레트: 하늘(위·가운데·지평선), 구름 밝은 면·그늘, 땅 빛(곱), 채도, 해/달
const BFX_T={
 morning:{sky:['#79c2ee','#a6daf4','#fde8c6'],cl:'#fff7ec',cs:'#c4d1e4',lm:[1.03,1.0,.95],sat:1.0,sun:[.18,.55,26,'#fff1c4',.5]},
 noon:{sky:['#3d9de6','#6fbbf2','#c6eaff'],cl:'#ffffff',cs:'#c9d9ec',lm:[1.03,1.03,1.03],sat:1.08,sun:[.5,.12,22,'#fffbe8',.45]},
 afternoon:{sky:['#5aa3de','#92c4e8','#f4dfb4'],cl:'#fff0d6',cs:'#c4bfc9',lm:[1.06,.99,.9],sat:1.03,sun:[.74,.4,24,'#ffe9b0',.5]},
 golden:{sky:['#3d5aa6','#ee9c4e','#ffd27a'],cl:'#ffc574',cs:'#a25c78',lm:[1.12,.9,.68],sat:1.12,sun:[.62,.78,34,'#ffcf6a',.9]},
 pink:{sky:['#58489a','#e888a8','#ffc2a0'],cl:'#ffb6c8',cs:'#87598c',lm:[1.02,.84,.9],sat:1.02,sun:[.58,.97,30,'#ff9d7a',.7]},
 dusk:{sky:['#1a1d4c','#483878','#d6786a'],cl:'#6c5c8c',cs:'#2a2650',lm:[.58,.52,.72],sat:.8,glow:1},
 night:{sky:['#060c26','#0e1b44','#253768'],cl:'#3c4874',cs:'#151b38',lm:[.33,.37,.56],sat:.7,moon:[.8,.2,20]}};
// 날씨: 하늘을 이 색으로 얼마나 바꿀지, 덮는 구름 양, 땅 밝기·채도
const BFX_W={clear:{mix:0,cover:0,lv:1,sat:1},cloudy:{sky:['#8d98a6','#a8b2bc','#c3c8cc'],mix:.7,cover:.55,lv:.86,sat:.78},
 rain:{sky:['#6c7886','#86909a','#a2a9af'],mix:.85,cover:.75,lv:.72,sat:.62,wet:1},storm:{sky:['#2c323d','#424956','#5b636e'],mix:.95,cover:.92,lv:.55,sat:.45,wet:1},
 fog:{sky:['#b9c2c8','#c9cfd2','#d6dadb'],mix:.75,cover:.2,lv:.92,sat:.6,fog:1},snow:{sky:['#a9b4c0','#c2cad2','#dde2e6'],mix:.75,cover:.5,lv:.95,sat:.7}};
const BFX_S={spring:{lm:[1.03,1.0,1.0],sat:1.04},summer:{lm:[1.0,1.02,1.0],sat:1.12,con:1.05},autumn:{lm:[1.06,.97,.86],sat:1.02},winter:{lm:[.94,.98,1.07],sat:.85}};
function bfxTime(){const L=curLoc();if(L.night||L.id==='deep')return'fixed';const c=clk();return c.i===0?'morning':c.i===1?(c.f<.55?'noon':'afternoon'):c.i===2?(c.f<.4?'golden':c.f<.75?'pink':'dusk'):'night'}
function bfxWx(){return BFX_W[weather]?weather:'clear'}
function bfxKey(){return [save.loc,bfxTime(),bfxWx(),seasonNow()].join('|')}
// 2D 값 노이즈(구름 덮개용) 한 번만
function bfxNoise(){if(BFX.noise)return BFX.noise;const w=256,h=128,r=new Float32Array(w*h),base=[];let s=7;const rnd2=()=>(s=(s*16807)%2147483647)/2147483647;
 for(const sc of[32,16,8,4]){const gw=Math.ceil(w/sc)+1,gh=Math.ceil(h/sc)+1,g=new Float32Array(gw*gh);for(let i=0;i<g.length;i++)g[i]=rnd2();base.push([sc,gw,g])}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){let v=0,a=.5,t=0;for(const[sc,gw,g]of base){const fx=x/sc,fy=y/sc,ix=fx|0,iy=fy|0,u=fx-ix,vv=fy-iy,s1=u*u*(3-2*u),s2=vv*vv*(3-2*vv);
  const n=g[iy*gw+ix]*(1-s1)*(1-s2)+g[iy*gw+ix+1]*s1*(1-s2)+g[(iy+1)*gw+ix]*(1-s1)*s2+g[(iy+1)*gw+ix+1]*s1*s2;v+=n*a;t+=a;a*=.5}r[y*w+x]=v/t}
 return BFX.noise={w,h,r}}
function bfxLoad(L){if(BFX.srcL===L&&BFX.src)return BFX.src;if(!ipOk('bg_'+L)||!ipOk('bgfx_'+L)||!BFXM[L])return null;
 try{const im=IPI['bg_'+L],w=im.naturalWidth,h=im.naturalHeight,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(im,0,0);const px=g.getImageData(0,0,w,h).data;g.clearRect(0,0,w,h);g.drawImage(IPI['bgfx_'+L],0,0,w,h);const mp=g.getImageData(0,0,w,h).data;
  const rowL=new Float32Array(h),rowC=new Float32Array(h*3);for(let y=0;y<h;y++){let s=0,n=0,cr=0,cg=0,cb=0;for(let x=0;x<w;x+=4){const i=(y*w+x)*4;if(mp[i]>180&&mp[i+1]<30){s+=px[i]*.3+px[i+1]*.59+px[i+2]*.11;cr+=px[i];cg+=px[i+1];cb+=px[i+2];n++}}rowL[y]=n?s/n:0;if(n){rowC[y*3]=cr/n;rowC[y*3+1]=cg/n;rowC[y*3+2]=cb/n}}
  let last=180;for(let y=0;y<h;y++){if(rowL[y])last=rowL[y];else rowL[y]=last}{let a=[170,200,230];for(let y=0;y<h;y++){if(rowC[y*3]||rowC[y*3+1]||rowC[y*3+2])a=[rowC[y*3],rowC[y*3+1],rowC[y*3+2]];else{rowC[y*3]=a[0];rowC[y*3+1]=a[1];rowC[y*3+2]=a[2]}}}
  BFX.src={L,w,h,px,mp,rowL,rowC,ov:{},hz:(BFXM[L].hz||h*.6)};BFX.srcL=L;return BFX.src}catch(e){BFX.on=false;return null}}
function bfxOverlay(S0,sn){if(sn==='summer')return null;if(S0.ov[sn]!==undefined)return S0.ov[sn];const k='bgs_'+S0.L+'_'+sn;if(!ipOk(k)){S0.ov[sn]=null;return null}
 const c=document.createElement('canvas');c.width=S0.w;c.height=S0.h;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(IPI[k],0,0,S0.w,S0.h);return S0.ov[sn]=g.getImageData(0,0,S0.w,S0.h).data}
function lerp3(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
function bfxStart(){const L=save.loc,S0=bfxLoad(L);if(!S0)return false;const key=bfxKey(),[,tm,wx,sn]=key.split('|');
 const T0=tm==='fixed'?null:BFX_T[tm],W0=BFX_W[wx],SE=BFX_S[sn],out=new ImageData(S0.w,S0.h),ov=bfxOverlay(S0,sn),N=bfxNoise();
 // 하늘색 3단(시간대 × 날씨)
 let sky=null,cl=null,cs=null,sunP=null;
 if(T0){sky=T0.sky.map(hx);cl=hx(T0.cl);cs=hx(T0.cs);if(W0.sky){const ws=W0.sky.map(hx),dark=tm==='night'?.3:tm==='dusk'?.5:1;sky=sky.map((c,i)=>lerp3(c,ws[i].map(v=>v*dark),W0.mix));cl=lerp3(cl,ws[2].map(v=>v*dark),W0.mix*.8);cs=lerp3(cs,ws[0].map(v=>v*dark*.85),W0.mix*.8)}
  if(T0.sun&&W0.mix<.8){const[sx,sy,sr,sc,gl]=T0.sun;sunP={x:sx*S0.w,y:sy*S0.hz,r:sr*S0.w/1600,c:hx(sc),g:gl*(1-W0.mix)}}}
 const lmT=T0?T0.lm:[1,1,1],lm=[lmT[0]*SE.lm[0]*W0.lv,lmT[1]*SE.lm[1]*W0.lv,lmT[2]*SE.lm[2]*W0.lv],sat=(T0?T0.sat:1)*SE.sat*W0.sat,con=SE.con||1;
 const night=tm==='night'||tm==='dusk',stars=tm==='night'?(W0.cover<.6?1:.25):tm==='dusk'?.35:0,moon=T0&&T0.moon&&W0.cover<.8?T0.moon:null;
 BFX.job={key,S0,out,row:0,o:{sky,cl,cs,sunP,lm,sat,con,stars,moon,night,ov,N,cover:W0.cover,fog:!!W0.fog,wet:!!W0.wet,fixed:!T0,tm,dark:tm==='fixed'?W0.lv:1}};return true}
function bfxRows(budget){const J=BFX.job,S0=J.S0,o=J.o,{w,h,px,mp,rowL,rowC}=S0,d=J.out.data,N=o.N,hz=S0.hz,t0=performance.now();
 while(J.row<h&&performance.now()-t0<budget){const y=J.row++,ty=Math.min(1,y/Math.max(1,hz));
  let gr=null;if(o.sky){gr=ty<.55?lerp3(o.sky[0],o.sky[1],ty/.55):lerp3(o.sky[1],o.sky[2],(ty-.55)/.45)}
  const fogY=o.fog?.35+.45*Math.exp(-Math.abs(y-hz)/70):0,ny=((y/h*N.h*1.6)|0)%N.h;
  for(let x=0;x<w;x++){const i=(y*w+x)*4;let r=px[i],g=px[i+1],b=px[i+2];
   // 계절 덧그림
   if(o.ov){const a=o.ov[i+3]/255;if(a>0){r+=(o.ov[i]-r)*a;g+=(o.ov[i+1]-g)*a;b+=(o.ov[i+2]-b)*a}}
   const L=r*.3+g*.59+b*.11;
   // 땅 색 조정
   let lr=r*o.lm[0],lg=g*o.lm[1],lb=b*o.lm[2];const l2=lr*.3+lg*.59+lb*.11;lr=l2+(lr-l2)*o.sat;lg=l2+(lg-l2)*o.sat;lb=l2+(lb-l2)*o.sat;
   if(o.con!==1){lr=128+(lr-128)*o.con;lg=128+(lg-128)*o.con;lb=128+(lb-128)*o.con}
   if(o.wet){const k=.1;lr=lr*(1-k)+60*k;lg=lg*(1-k)+70*k;lb=lb*(1-k)+82*k}
   let m=mp[i]/255;
   if(gr&&m>0){const rel=Math.max(.65,Math.min(1.5,L/Math.max(40,rowL[y]))),cg=mp[i+1]/255;
    const nv=N.r[ny*N.w+(((x/w*N.w*2.2)|0)%N.w)],pc=o.cover?Math.max(0,Math.min(1,(nv-(1-o.cover))*2.6)):0,cc=Math.max(cg,pc*(1-ty*.35));
    /* 4.26 하늘 칸을 평평한 색으로 바꾸지 않고 원래 무늬(먼 산·구름 결)를 살려 색만 입힘 → 경계의 톱니 자국 없앰 */const q0=Math.max(30,rowC[y*3]),q1=Math.max(30,rowC[y*3+1]),q2=Math.max(30,rowC[y*3+2]);let sr=Math.min(255,r*gr[0]/q0),sg=Math.min(255,g*gr[1]/q1),sb=Math.min(255,b*gr[2]/q2);
    const lit=Math.min(1,.55+.45*rel),cr=o.cs[0]+(o.cl[0]-o.cs[0])*lit,cgc=o.cs[1]+(o.cl[1]-o.cs[1])*lit,cb=o.cs[2]+(o.cl[2]-o.cs[2])*lit;
    sr+=(cr-sr)*cc;sg+=(cgc-sg)*cc;sb+=(cb-sb)*cc;
    if(o.sunP){const dx=x-o.sunP.x,dy=y-o.sunP.y,dd=Math.sqrt(dx*dx+dy*dy),R=o.sunP.r,gl=o.sunP.g*Math.exp(-dd/(R*5))*(1-cc*.7);
     if(dd<R&&cc<.5){sr=o.sunP.c[0];sg=o.sunP.c[1];sb=o.sunP.c[2]}else{sr+=(o.sunP.c[0]-sr)*gl;sg+=(o.sunP.c[1]-sg)*gl;sb+=(o.sunP.c[2]-sb)*gl}}
    if(o.moon){const mx=o.moon[0]*w,my=o.moon[1]*hz,R=o.moon[2]*w/1600,dx=x-mx,dy=y-my,dd=Math.sqrt(dx*dx+dy*dy);
     if(dd<R){const sh=Math.sqrt((dx+R*.35)**2+(dy-R*.15)**2)<R*.85;sr=sh?sr:248;sg=sh?sg:240;sb=sh?sb:205}else{const gl=.35*Math.exp(-(dd-R)/(R*2.2));sr+=(220-sr)*gl;sg+=(225-sg)*gl;sb+=(240-sb)*gl}}
    if(o.stars&&cc<.35){const hsh=((x*73856093)^(y*19349663))>>>0;if(hsh%9973<4*o.stars){const v=hsh%3===0?255:210;sr=sg=sb=v;sb=255}}
    r=lr+(sr-lr)*m;g=lg+(sg-lg)*m;b=lb+(sb-lb)*m}
   else if(o.fixed){r=lr*o.dark;g=lg*o.dark;b=lb*o.dark}else{r=lr;g=lg;b=lb}
   if(o.fog){const f=Math.min(.85,fogY*(m>.5?.9:1));r+=(212-r)*f;g+=(220-g)*f;b+=(224-b)*f}
   d[i]=r<0?0:r>255?255:r;d[i+1]=g<0?0:g>255?255:g;d[i+2]=b<0?0:b>255?255:b;d[i+3]=255}}
 if(J.row<h)return false;
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.putImageData(J.out,0,0);
 // 밤·해 진 뒤 불빛
 const lights=BFXM[S0.L]&&BFXM[S0.L].lights||[];if(o.night&&lights.length){g.save();g.globalCompositeOperation='lighter';
  for(const[x,y]of lights){const k=((x*31+y*17)%10)/10;if(o.tm==='dusk'&&k>.6)continue;const col=k<.7?'255,210,120':'255,170,90';const gr2=g.createRadialGradient(x,y,0,x,y,9);gr2.addColorStop(0,`rgba(${col},.85)`);gr2.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr2;g.fillRect(x-9,y-9,18,18);g.fillStyle=`rgba(${col},1)`;g.fillRect(x-1,y-1,3,3)}g.restore()}
 BFX.prev=BFX.cur;BFX.cur={key:J.key,c,L:S0.L,night:o.night};BFX.fade=BFX.prev&&BFX.prev.L===S0.L?0:1;BFX.job=null;return true}
function bfxComposeNow(){if(!bfxStart())return false;while(!bfxRows(1e9));BFX.key=bfxKey();BFX.fade=1;return true}
function bfxTick(){if(!BFX.on)return;const key=bfxKey();if(BFX.job){bfxRows(6);return}if(key!==BFX.key){BFX.key=key;if(BFX.srcL&&BFX.srcL!==save.loc){BFX.src=null;BFX.srcL=''}bfxStart()}}
const _df417=drawFar;drawFar=function(g,P,t){const L0=save.loc;bfxTick();const C=BFX.cur;
 if(!BFX.on||!C||C.L!==L0||!ipOk('bg_'+L0))return _df417(g,P,t);
 const iw=C.c.width,ih=C.c.height,h0=g.surf+4,k=Math.max(W/iw,(h0-g.top+40)/ih),w=iw*k,h=ih*k,x=clamp(W/2-w*({moon:.7,light:.6}[L0]||.5),W-w,0),y=h0-h;BFX.rect={x,y,k};
 ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 if(BFX.fade<1&&BFX.prev&&BFX.prev.L===L0){ctx.drawImage(BFX.prev.c,x,y,w,h);ctx.globalAlpha=BFX.fade}ctx.drawImage(C.c,x,y,w,h);ctx.globalAlpha=1;BFX.fade=Math.min(1,BFX.fade+DOLLDT/2);
 // 등대 불빛: 밤엔 돌아가는 빛줄기
 const M=BFXM[L0];if(M&&M.lamp&&C.night){const lx=x+M.lamp[0]*k,ly=y+M.lamp[1]*k,a=t*1.1;ctx.globalCompositeOperation='lighter';
  for(const s of[1,-1]){const aa=a+(s<0?Math.PI:0),gx=ctx.createRadialGradient(lx,ly,0,lx,ly,W*.7);gx.addColorStop(0,'rgba(255,240,170,.5)');gx.addColorStop(1,'rgba(255,240,170,0)');ctx.fillStyle=gx;ctx.beginPath();ctx.moveTo(lx,ly);ctx.arc(lx,ly,W*.7,aa-.09,aa+.09);ctx.closePath();ctx.fill()}
  ctx.fillStyle='rgba(255,245,200,.95)';ctx.beginPath();ctx.arc(lx,ly,4+Math.sin(t*6),0,7);ctx.fill();ctx.globalCompositeOperation='source-over'}
 ctx.restore();
 if(lightning>0){ctx.fillStyle=`rgba(255,255,255,${lightning*(save.set.calm?.15:.7)})`;ctx.fillRect(0,0,W,g.surf);const lx=W*.6;ctx.strokeStyle=`rgba(255,250,200,${lightning*2})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(lx,g.top);ctx.lineTo(lx-20,g.top+(g.surf-g.top)*.3);ctx.lineTo(lx+10,g.top+(g.surf-g.top)*.5);ctx.lineTo(lx-14,g.surf-10);ctx.stroke()}};
// 게임 바다: 노을 윤슬 기둥 · 폭풍 흰 포말 · 비 파문
const _ds417=drawSea;drawSea=function(g,P,t){_ds417(g,P,t);if(!BFX.on)return;const tm=bfxTime(),sx=BFX.rect&&BFX.cur?null:null;
 if((tm==='golden'||tm==='pink'||tm==='morning')&&!(rainAmt>.4)){const sp=sun(g),col=tm==='pink'?'255,170,170':tm==='golden'?'255,205,110':'255,240,200';ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<22;i++){const f=.5+.5*Math.sin(t*(1.8+i*.31)+i*2.3),dx=(i-10.5)*13+Math.sin(t*1.1+i)*6,ww=(6+f*20)*(1-Math.abs(i-10.5)/13),yy=g.surf+1+(i*7%5)*1.8;if(ww<2)continue;ctx.fillStyle=`rgba(${col},${.25+f*.35})`;ctx.fillRect(sp.x+dx-ww/2,yy,ww,1.8)}/* 4.26 수면 띠에만 */ctx.restore()}
 if(stormAmt>.25){ctx.save();ctx.globalAlpha=stormAmt;ctx.fillStyle='rgba(20,30,45,.25)';ctx.fillRect(0,g.surf,W,30);ctx.fillStyle='rgba(255,255,255,.85)';
  for(let i=0;i<14;i++){const x=((i*W/14+t*(60+i*7))%(W+80))-40,yy=g.surf+4+(i%4)*6+Math.sin(t*4+i)*3,len=18+(i%3)*10;ctx.beginPath();ctx.ellipse(x,yy,len,3,-.05,0,7);ctx.fill();if(Math.sin(t*3+i*2)>.6){ctx.fillRect(x-len*.6,yy-7-Math.random()*6,3,3);ctx.fillRect(x+len*.3,yy-10-Math.random()*6,2,2)}}ctx.restore()}
 if(rainAmt>.3&&!LOWGFX){ctx.save();ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1;for(let i=0;i<10;i++){const p=((t*.9+i*.37)%1),x=(i*131.7+Math.floor(t*.9+i*.37)*97)%W,yy=g.surf+6+(i%5)*7;ctx.globalAlpha=(1-p)*rainAmt;ctx.beginPath();ctx.ellipse(x,yy,3+p*14,1+p*2.5,0,0,7);ctx.stroke()}ctx.restore()}};
if(TEST)Object.defineProperties(window.__w,{BFX:{get(){return BFX}},bfxComposeNow:{value:bfxComposeNow},bfxKey:{value:bfxKey},bfxTime:{value:bfxTime}});
