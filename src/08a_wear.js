/* ================= 4.0 원본 캐릭터 의상 합성 엔진 =================
 원본 스프라이트(20동작)를 부위 지도(라벨)로 나눠, 원본의 주름·명암(밝기)을 그대로 살린 채
 부위별 재질·무늬·광택을 다시 칠하고, 디테일(후드·지퍼·단추·주머니)·모자·코스튬 후드를 얹는다.
 라벨: 1 모자 2 상의 3 하의 4 신발 5 가방 6 얼굴 7 손 */
const SM=__SMETA__,SLABU=__SLAB__,LIMG={};
Object.keys(SLABU).forEach(n=>{const i=new Image();i.src=SLABU[n];LIMG[n]=i});
const SPD={};
function hex3(h){if(Array.isArray(h))return h;h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function spData(n){if(SPD[n])return SPD[n];const im=IMG[n],li=LIMG[n],m=SM[n];if(!m||!im||!im.complete||!im.naturalWidth||!li||!li.complete||!li.naturalWidth)return null;
 try{const w=m.w,h=m.h,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0,w,h);const px=g.getImageData(0,0,w,h);g.clearRect(0,0,w,h);g.drawImage(li,0,0,w,h);const ld=g.getImageData(0,0,w,h).data,lab=new Uint8Array(w*h);for(let i=0;i<w*h;i++)lab[i]=Math.round(ld[i*4]/30);
  return SPD[n]={w,h,px,lab,m,masks:{}}}catch(e){return null}}
function spMask(d,r){if(d.masks[r])return d.masks[r];const c=document.createElement('canvas');c.width=d.w;c.height=d.h;const g=c.getContext('2d'),id=g.createImageData(d.w,d.h);for(let i=0;i<d.lab.length;i++)if(d.lab[i]===r||(r===2&&d.lab[i]===9))id.data[i*4+3]=255;g.putImageData(id,0,0);return d.masks[r]=c}
const hsh=(x,y)=>{const s=Math.sin(x*12.9898+y*78.233)*43758.5453;return s-Math.floor(s)};
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,a=hsh(xi,yi),b=hsh(xi+1,yi),c=hsh(xi,yi+1),d=hsh(xi+1,yi+1),u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
// 재질 무늬: [보조색 비율 t, 밝기 b]
function patTB(m,x,y){const p=m.p||6;let t=0,b=1;
 switch(m.pat){
  case'stripeH':t=Math.floor(y/p)&1;break;
  case'stripeV':t=Math.floor(x/p)&1;break;
  case'tartan':{const a=(x/p)%1<.5,c=(y/p)%1<.5;t=a&&c?1:a||c?.45:0;if(Math.floor(x)%p===Math.floor(p*.75)||Math.floor(y)%p===Math.floor(p*.75))b=1.18;break}
  case'knit':b=.84+.16*Math.abs(Math.sin(x*Math.PI/2.2));if(Math.floor(y)%3===0)b*=.9;break;
  case'rib':b=Math.floor(x/p)&1?.86:1.02;break;
  case'denim':b=.86+.16*hsh(Math.floor(x),Math.floor(y))+(((Math.floor(x)+Math.floor(y))%3===0)?.07:0);break;
  case'quilt':{const q=((x+y)/p)%1,r=((x-y+999)/p)%1,e=Math.min(q,1-q,r,1-r);b=e<.07?.74:.96+e*.3;break}
  case'mesh':b=(Math.floor(x)%p===0||Math.floor(y)%p===0)?.82:1.04;break;
  case'dots':{const row=Math.floor(y/p),xx=x+(row&1)*p/2,dx=xx%p-p/2,dy=y%p-p/2;t=dx*dx+dy*dy<p*p*.08?1:0;break}
  case'stars':{const cx=Math.floor(x/p),cy=Math.floor(y/p),hh=hsh(cx,cy);if(hh>.55){const sx=cx*p+p*hsh(cy,cx),sy=cy*p+p*hsh(cx+3,cy),dx=Math.abs(x-sx),dy=Math.abs(y-sy);if(dx+dy<1.6||(dx<.6&&dy<2.6)||(dy<.6&&dx<2.6))t=1}b=.95+.1*vnoise(x/9,y/9);break}
  case'scale':{const row=Math.floor(y/p),xx=x+(row&1)*p/2,dx=xx%p-p/2,dy=y%p,d=Math.hypot(dx,dy);if(Math.abs(d-p*.55)<.7&&dy>0){t=1;b=1.1}else b=.92+.12*(1-d/p);break}
  case'panel':{const gx=Math.floor(x)%(p*2),gy=Math.floor(y)%p;b=(gx===0||gy===0)?.72:1;break}
  case'metal':b=.88+.25*vnoise(x/5,y/14);if(hsh(Math.floor(x/2),Math.floor(y/2))>.985)b=1.5;break;
  case'velvet':b=.9+.14*vnoise(x/3,y/3);break;
  case'canvas':b=((Math.floor(x)^Math.floor(y))&1)?.94:1.03;break;
  case'cotton':b=.96+.06*hsh(Math.floor(x),Math.floor(y));break;
  case'fleece':b=.94+.1*vnoise(x/2,y/2);break;
  case'furp':b=1.02+.16*(vnoise(x/1.6,y/1.6)-.5);break;
  case'zig':{const k=Math.abs(((x/p)%2)-1);t=(y%p)/p<k?1:0;break}
  case'camo':{const v=vnoise(x/p,y/p)+.5*vnoise(x/(p/2)+9,y/(p/2));t=v>.95?1:0;b=v<.55?.8:1;break}
  case'tiger':{const v=Math.sin(x/p*2.2+vnoise(x/8,y/8)*3+y*.05);t=v>.55?1:0;break}
  case'skin':b=1;break}
 return[t,b]}
function shadeMat(m,x,y,s,o){const C=m._c||(m._c=hex3(m.c)),C2=m.c2?(m._c2||(m._c2=hex3(m.c2))):C;let[t,b]=m.pat?patTB(m,x,y):[0,1];
 let r=C[0]+(C2[0]-C[0])*t,g=C[1]+(C2[1]-C[1])*t,bl=C[2]+(C2[2]-C[2])*t;r*=b;g*=b;bl*=b;
 const gl=m.g||0;let k=s;if(gl)k=1+(k-1)*(1+gl*1.6);
 if(k<=1){const f=Math.pow(Math.max(0,k),1.08);r*=f;g*=f;bl*=f}else{const f=Math.min(1,(k-1)*(1.3+gl*2.2));r+=(255-r)*f;g+=(255-g)*f;bl+=(255-bl)*f}
 if(gl&&s>.96){const sp=Math.min(1,(s-.96)*gl*5);r+=(255-r)*sp*.6;g+=(255-g)*sp*.6;bl+=(255-bl)*sp*.6}
 o[0]=r;o[1]=g;o[2]=bl}
function zoneMat(m,lab,x,y,meta){if(!m||!m.z)return m;for(const z of m.z){let ok=false;
 if(z.k==='yband'){const y0=meta.chest[3],y1=meta.chest[4],u=(y-y0)/Math.max(1,y1-y0);ok=u>=z.a&&u<z.b}
 else if(z.k==='band'){ok=Math.abs(x-meta.chest[0])<meta.chest[2]*z.w}
 else if(z.k==='pyband'){const y0=meta.pants[0],y1=meta.pants[1],u=(y-y0)/Math.max(1,y1-y0);ok=u>=z.a&&u<z.b}
 else if(z.k==='sband'){const y0=meta.shoes?meta.shoes[0]:0,y1=meta.shoes?meta.shoes[1]:1,u=(y-y0)/Math.max(1,y1-y0);ok=u>=z.a&&u<z.b}
 if(ok)return z.m}return m}
function wearKey(w){return[w.top,w.bottom,w.costume,w.hat,w.shoes,w.gloves,w.acc,w.bag].join('|')}
function wearMats(w){const cs=w.costume&&w.costume!=='none'?WGET('costume',w.costume):null,top=cs?cs.top:(WGET('top',w.top)||{}).m,bot=cs?cs.bot:(WGET('bottom',w.bottom)||{}).m,hat=WGET('hat',w.hat)||{};
 return{1:cs?null:hat.cap||null,2:top,3:bot,4:(WGET('shoes',w.shoes)||{}).m,5:(WGET('bag',w.bag)||{}).m,7:(WGET('gloves',w.gloves)||{}).m,cs,hat}}
const WC={},WCK=[];
function wearSprite(n,w){const d=spData(n);if(!d)return null;const key=n+'#'+wearKey(w);if(WC[key])return WC[key];
 const m=d.m,M=wearMats(w),P=Math.round(m.h*.28),cw=m.w+P*2,ch=m.h+P*2;
 if(!m.shoes){let y0=1e9,y1=-1;for(let i=0;i<d.lab.length;i++)if(d.lab[i]===4){const y=(i/m.w)|0;if(y<y0)y0=y;if(y>y1)y1=y}m.shoes=[y0,y1]}
 const c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d');
 const hasFace=!!m.face,eraseCap=hasFace&&!M.cs&&HATS_ERASE.includes(M.hat.id)||(hasFace&&M.cs);
 // 1) 뒤쪽 레이어(후드·망토)
 g.save();g.translate(P,P);decoBehind(g,m,w,M);g.restore();
 // 2) 원본 다시 칠하기
 const src=d.px.data,out=new ImageData(m.w,m.h),o=out.data,tmp=[0,0,0],ref=m.ref;o.set(src);
 for(let i=0,n4=d.lab.length;i<n4;i++){const L=d.lab[i];if(!L||L===6||src[i*4+3]===0)continue;
  if(L===1&&eraseCap){o[i*4+3]=0;continue}
  let mt=M[L];if(!mt)continue;if(mt.erase){o[i*4+3]=0;continue}
  const x=i%m.w,y=(i/m.w)|0;mt=zoneMat(mt,L,x,y,m);
  const lum=(src[i*4]*.3+src[i*4+1]*.59+src[i*4+2]*.11)/255;shadeMat(mt,x,y,lum/(ref[L]||.7),tmp);
  o[i*4]=tmp[0];o[i*4+1]=tmp[1];o[i*4+2]=tmp[2]}
 const sc=document.createElement('canvas');sc.width=m.w;sc.height=m.h;sc.getContext('2d').putImageData(out,0,0);g.drawImage(sc,P,P);
 // 3) 옷 디테일(상의 부위 안으로만 잘라 그림)
 const dl=document.createElement('canvas');dl.width=m.w;dl.height=m.h;const gd=dl.getContext('2d');
 const topIt=M.cs?null:WGET('top',w.top),botIt=M.cs?null:WGET('bottom',w.bottom);
 decoTop(gd,m,(topIt&&topIt.dc||[]).concat(botIt&&botIt.dc||[]),M);
 gd.globalCompositeOperation='destination-in';gd.drawImage(spMask(d,2),0,0);g.drawImage(dl,P,P);
 // 4) 앞쪽 레이어(모자·코스튬 후드·소품)
 g.save();g.translate(P,P);decoFront(g,m,w,M);g.restore();
 const r={c,P,w:m.w,h:m.h};WC[key]=r;WCK.push(key);if(WCK.length>70){delete WC[WCK.shift()]}return r}
const HATS_ERASE=['beanie','straw','bucket','captain','tricorn','santa','helmet'];
const OLC='#3a2724';
function neckOf(m){return m.face?{x:m.face[0]+m.face[2]*.12,y:m.face[1]+m.face[3]*1.12}:{x:m.chest[0],y:m.chest[3]}}
function capDir(m){const c=m.cap;return((c[0]+c[2])/2>=m.head[0])?1:-1}
function gfill(g,col,lw=1.4){g.fillStyle=col;g.fill();g.lineWidth=lw;g.strokeStyle=OLC;g.stroke()}
function lgrad(g,x0,y0,x1,y1,c){const C=hex3(c),gr=g.createLinearGradient(x0,y0,x1,y1),f=(k)=>`rgb(${Math.min(255,C[0]*k)|0},${Math.min(255,C[1]*k)|0},${Math.min(255,C[2]*k)|0})`;gr.addColorStop(0,f(1.22));gr.addColorStop(.55,f(1));gr.addColorStop(1,f(.72));return gr}
function decoBehind(g,m,w,M){const dcs=[].concat((!M.cs&&WGET('top',w.top).dc)||[]);const N=neckOf(m),[hx,hy,hr]=m.head;
 for(const s of dcs){const[k,col]=s.split(':').concat([]);const cc=s.slice(s.indexOf(':')+1);
  if(k==='hood'&&m.face){g.beginPath();g.ellipse(N.x-hr*.35*capDir(m),N.y-hr*.15,hr*.75,hr*.42,-.2*capDir(m),0,7);gfill(g,lgrad(g,N.x,N.y-hr*.5,N.x,N.y+hr*.4,cc),1.6);g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=2;g.beginPath();g.ellipse(N.x-hr*.3*capDir(m),N.y-hr*.15,hr*.5,hr*.25,-.2*capDir(m),0,7);g.stroke()}
  if(k==='cape'){const cx=m.chest[0],y0=m.chest[3],y1=Math.min(m.h*.95,m.chest[4]+(m.h-m.chest[4])*.6),dir=capDir(m);g.beginPath();g.moveTo(cx-m.chest[2]*1.2,y0+4);g.quadraticCurveTo(cx-dir*m.chest[2]*2.2,(y0+y1)/2,cx-dir*m.chest[2]*2.0,y1);g.lineTo(cx+dir*m.chest[2]*.2,y1-6);g.quadraticCurveTo(cx+m.chest[2]*.4,(y0+y1)/2,cx+m.chest[2]*1.1,y0+4);g.closePath();gfill(g,lgrad(g,cx-40,y0,cx+40,y1,cc),1.6);g.strokeStyle='rgba(255,220,120,.7)';g.lineWidth=1.6;g.beginPath();g.moveTo(cx-dir*m.chest[2]*2.0,y1);g.lineTo(cx+dir*m.chest[2]*.2,y1-6);g.stroke()}}
 if(M.cs&&m.face&&M.cs.id==='shark'){const x=hx-capDir(m)*hr*.2,y=hy-hr*1.02;g.beginPath();g.moveTo(x-hr*.3,y+hr*.2);g.quadraticCurveTo(x-hr*.05,y-hr*.75,x+hr*.35,y-hr*.55);g.quadraticCurveTo(x+hr*.15,y-hr*.1,x+hr*.3,y+hr*.2);gfill(g,lgrad(g,x,y-hr*.6,x,y+hr*.2,'#7a8ea8'),1.6)}}
function decoTop(g,m,dcs,M){const[cx,cy,tw,y0,y1]=m.chest,N=neckOf(m),dir=capDir(m),H=y1-y0;g.lineCap='round';g.lineJoin='round';
 const zx=(y)=>cx+(N.x-cx)*Math.max(0,1-(y-N.y)/(H*.5))*.0; // 지퍼 선은 가슴 중심선
 for(const s of dcs){const k=s.split(':')[0],cc=s.slice(s.indexOf(':')+1);g.save();
  if(k==='zip'){g.strokeStyle=cc;g.lineWidth=1.8;g.beginPath();g.moveTo(cx,y0);g.lineTo(cx,y1);g.stroke();g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=.6;g.setLineDash([1,1.4]);g.beginPath();g.moveTo(cx+.6,y0);g.lineTo(cx+.6,y1);g.stroke();g.setLineDash([]);g.fillStyle=cc;g.beginPath();g.roundRect(cx-1.6,y0+H*.12,3.2,6,1.2);g.fill()}
  else if(k==='btns'||k==='dbtns'||k==='toggles'){const xs=k==='dbtns'?[cx-tw*.28,cx+tw*.28]:[cx];for(const xx of xs)for(let i=0;i<4;i++){const yy=y0+H*(.18+i*.19);g.fillStyle=cc;g.strokeStyle=OLC;g.lineWidth=.8;g.beginPath();if(k==='toggles')g.roundRect(xx-3.4,yy-1.2,6.8,2.6,1.2);else g.arc(xx,yy,2.1,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(xx-.6,yy-.6,.7,0,7);g.fill()}}
  else if(k==='pockets'||k==='pocket1'||k==='vpockets'){const ps=k==='pocket1'?[[cx-dir*tw*.45,y0+H*.22]]:k==='vpockets'?[[cx-tw*.5,y0+H*.2],[cx+tw*.5,y0+H*.2],[cx-tw*.5,y0+H*.55],[cx+tw*.5,y0+H*.55]]:[[cx-tw*.48,y0+H*.22],[cx+tw*.48,y0+H*.22]];
   for(const[px,py]of ps){const pw=tw*.42,ph=H*.2;g.fillStyle=cc;g.strokeStyle=OLC;g.lineWidth=.9;g.beginPath();g.roundRect(px-pw/2,py,pw,ph,2);g.fill();g.stroke();g.beginPath();g.roundRect(px-pw/2-.5,py-1,pw+1,ph*.32,1.5);g.fill();g.stroke();g.setLineDash([1.2,1.2]);g.strokeStyle='rgba(255,240,200,.7)';g.lineWidth=.6;g.strokeRect(px-pw/2+1.2,py+ph*.36,pw-2.4,ph*.56);g.setLineDash([]);g.fillStyle='#c8b27a';g.beginPath();g.arc(px,py+ph*.18,1,0,7);g.fill()}}
  else if(k==='kanga'){const ph=H*.24,pw=tw*1.2,py=y0+H*.6;g.fillStyle=cc;g.strokeStyle=OLC;g.lineWidth=.9;g.beginPath();g.moveTo(cx-pw/2,py+ph);g.lineTo(cx-pw*.38,py);g.lineTo(cx+pw*.38,py);g.lineTo(cx+pw/2,py+ph);g.closePath();g.fill();g.stroke();g.strokeStyle='rgba(0,0,0,.2)';g.setLineDash([1.2,1.2]);g.beginPath();g.moveTo(cx-pw*.36,py+2);g.lineTo(cx+pw*.36,py+2);g.stroke()}
  else if(k==='strings'){g.strokeStyle=cc;g.lineWidth=1.3;for(const sd of[-1,1]){g.beginPath();g.moveTo(N.x+sd*5,N.y+2);g.quadraticCurveTo(N.x+sd*6,N.y+H*.18,N.x+sd*4,N.y+H*.32);g.stroke();g.fillStyle='#ddd';g.beginPath();g.arc(N.x+sd*4,N.y+H*.33,1.4,0,7);g.fill()}}
  else if(k==='collar'){g.fillStyle=cc;g.strokeStyle=OLC;g.lineWidth=1;for(const sd of[-1,1]){g.beginPath();g.moveTo(N.x,N.y+H*.12);g.lineTo(N.x+sd*tw*.62,N.y-1);g.lineTo(N.x+sd*tw*.48,N.y+H*.2);g.closePath();g.fill();g.stroke()}}
  else if(k==='roundneck'||k==='ribneck'){g.strokeStyle=cc;g.lineWidth=k==='ribneck'?4:2.6;g.beginPath();g.ellipse(N.x,N.y+1,tw*.45,H*.08,0,.1,Math.PI-.1);g.stroke();if(k==='ribneck'){g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=.6;for(let a=.3;a<2.9;a+=.25){g.beginPath();g.moveTo(N.x+Math.cos(a)*tw*.4,N.y+1+Math.sin(a)*H*.06);g.lineTo(N.x+Math.cos(a)*tw*.5,N.y+1+Math.sin(a)*H*.1);g.stroke()}}}
  else if(k==='stitch'){g.strokeStyle=cc;g.lineWidth=.7;g.setLineDash([1.3,1.3]);g.beginPath();g.moveTo(cx-2.5,y0);g.lineTo(cx-2.5,y1);g.moveTo(cx+2.5,y0);g.lineTo(cx+2.5,y1);g.moveTo(cx-tw*1.3,y0+H*.12);g.lineTo(cx+tw*1.3,y0+H*.12);g.moveTo(cx-tw*1.3,y1-H*.1);g.lineTo(cx+tw*1.3,y1-H*.1);g.stroke();g.setLineDash([])}
  else if(k==='vlines'){g.strokeStyle=cc;g.lineWidth=2;for(const sd of[-1,1]){g.beginPath();g.moveTo(cx+sd*tw*.7,y0);g.lineTo(cx+sd*tw*.78,y1);g.stroke();g.beginPath();g.moveTo(cx+sd*tw*.84,y0);g.lineTo(cx+sd*tw*.92,y1);g.stroke()}}
  else if(k==='refl'||k==='refl2'){const ys=k==='refl'?[.6]:[.38,.66];for(const u of ys){const yy=y0+H*u,gr=g.createLinearGradient(0,yy-3,0,yy+3);gr.addColorStop(0,'#ffffff');gr.addColorStop(.5,cc);gr.addColorStop(1,'#9aa4ae');g.fillStyle=gr;g.fillRect(cx-tw*3,yy-3,tw*6,6);g.fillStyle='rgba(255,255,255,.8)';for(let x=cx-tw*3;x<cx+tw*3;x+=7)g.fillRect(x,yy-2.6,2.4,1)}}
  else if(k==='patch'||k==='logo'){const px=cx-dir*tw*.5,py=y0+H*.2;g.fillStyle=k==='logo'?'rgba(0,0,0,0)':cc;g.strokeStyle=OLC;g.lineWidth=.8;if(k==='patch'){g.beginPath();g.arc(px,py,4.2,0,7);g.fill();g.stroke();g.fillStyle='#1e3a6a';g.beginPath();g.ellipse(px-.4,py,2.2,1.3,0,0,7);g.fill();g.beginPath();g.moveTo(px+1.4,py);g.lineTo(px+3,py-1.4);g.lineTo(px+3,py+1.4);g.fill()}else{g.fillStyle=cc;g.beginPath();g.ellipse(px-.5,py,3.4,2,0,0,7);g.fill();g.beginPath();g.moveTo(px+2.4,py);g.lineTo(px+4.6,py-2);g.lineTo(px+4.6,py+2);g.fill()}}
  else if(k==='cross'){const px=cx-dir*tw*.5,py=y0+H*.22;g.fillStyle=cc;g.fillRect(px-1.3,py-4,2.6,8);g.fillRect(px-4,py-1.3,8,2.6)}
  else if(k==='trimv'){g.strokeStyle=cc;g.lineWidth=2.2;for(const sd of[-1,1]){g.beginPath();g.moveTo(cx+sd*3.2,y0);g.lineTo(cx+sd*3.2,y1);g.stroke()}g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=.6;for(const sd of[-1,1]){g.beginPath();g.moveTo(cx+sd*3.2-.5,y0);g.lineTo(cx+sd*3.2-.5,y1);g.stroke()}g.strokeStyle=cc;g.lineWidth=2.4;g.beginPath();g.moveTo(cx-tw*3,y1-2);g.lineTo(cx+tw*3,y1-2);g.stroke()}
  else if(k==='lights'){for(const[u,v]of[[-.45,.25],[.45,.25],[0,.5]]){const px=cx+u*tw,py=y0+H*v,gr=g.createRadialGradient(px,py,0,px,py,6);gr.addColorStop(0,'#fff');gr.addColorStop(.3,cc);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(px,py,6,0,7);g.fill()}}
  else if(k==='ring'){g.strokeStyle=cc;g.lineWidth=3;g.beginPath();g.ellipse(N.x,N.y+1,tw*.5,H*.07,0,0,7);g.stroke();g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=.8;g.stroke()}
  else if(k==='chestpanel'){const pw=tw*.9,ph=H*.26,px=cx-pw/2,py=y0+H*.22;g.fillStyle=cc;g.strokeStyle=OLC;g.lineWidth=.9;g.beginPath();g.roundRect(px,py,pw,ph,2.5);g.fill();g.stroke();const cl=['#ff5a5a','#ffd23f','#5aff9a','#5aaaff'];cl.forEach((c2,i)=>{g.fillStyle=c2;g.beginPath();g.arc(px+pw*(.2+i*.2),py+ph*.35,1.5,0,7);g.fill()});g.fillStyle='#9ae0ff';g.fillRect(px+pw*.15,py+ph*.6,pw*.7,ph*.2)}
  else if(k==='sailor'){g.fillStyle=cc;g.strokeStyle=OLC;g.lineWidth=1;g.beginPath();g.moveTo(N.x-tw*.9,N.y-2);g.lineTo(N.x+tw*.9,N.y-2);g.lineTo(N.x+tw*.25,N.y+H*.28);g.lineTo(N.x,N.y+H*.36);g.lineTo(N.x-tw*.25,N.y+H*.28);g.closePath();g.fill();g.stroke();g.strokeStyle='#fff';g.lineWidth=1;g.beginPath();g.moveTo(N.x-tw*.72,N.y+1);g.lineTo(N.x,N.y+H*.3);g.lineTo(N.x+tw*.72,N.y+1);g.stroke()}
  else if(k==='tie'){g.fillStyle=cc;g.strokeStyle=OLC;g.lineWidth=.9;g.beginPath();g.moveTo(N.x,N.y+H*.3);g.lineTo(N.x-5,N.y+H*.42);g.lineTo(N.x,N.y+H*.38);g.lineTo(N.x+5,N.y+H*.42);g.closePath();g.fill();g.stroke()}
  else if(k==='jabot'){g.fillStyle=cc;g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.7;for(let i=0;i<4;i++){g.beginPath();g.ellipse(N.x,N.y+3+i*4,5-i*.6,2.6,0,0,7);g.fill();g.stroke()}}
  else if(k==='pearls'){for(let a=.15;a<3.0;a+=.28){const px=N.x+Math.cos(a)*tw*.55,py=N.y+2+Math.sin(a)*H*.12;const gr=g.createRadialGradient(px-.6,py-.6,.2,px,py,2.2);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#d8cfc0');g.fillStyle=gr;g.beginPath();g.arc(px,py,1.9,0,7);g.fill()}}
  else if(k==='belt'){const yy=y0+H*.8;g.fillStyle=cc;g.fillRect(cx-tw*3,yy-3,tw*6,6);g.fillStyle='#ffd23f';g.strokeStyle=OLC;g.lineWidth=.8;g.beginPath();g.roundRect(cx-5,yy-4,10,8,1.5);g.fill();g.stroke();g.fillStyle=cc;g.fillRect(cx-2.5,yy-1.8,5,3.6)}
  else if(k==='straps'){g.strokeStyle=cc;g.lineWidth=4.2;for(const sd of[-1,1]){g.beginPath();g.moveTo(cx+sd*tw*.55,y0-2);g.lineTo(cx+sd*tw*.42,y1);g.stroke()}g.fillStyle=cc;g.strokeStyle=OLC;g.lineWidth=.9;g.beginPath();g.roundRect(cx-tw*.55,y0+H*.55,tw*1.1,H*.5,2);g.fill();g.stroke();g.fillStyle='#d9b45a';for(const sd of[-1,1]){g.beginPath();g.arc(cx+sd*tw*.43,y0+H*.6,1.8,0,7);g.fill()}}
  else if(k==='sparkle'){g.fillStyle=cc;for(let i=0;i<6;i++){const px=cx+(hsh(i,3)-.5)*tw*2.2,py=y0+H*hsh(i,7);star5(g,px,py,2.2)}}
  g.restore()}}
function decoFront(g,m,w,M){const[hx,hy,hr]=m.head,dir=capDir(m),F=m.face,N=neckOf(m);
 if(M.cs&&F)costumeHood(g,m,M.cs.id);
 else if(F){const h=M.hat.id;if(HATS_ERASE.includes(h)||h==='icecrown'||h==='seacrown')drawHat2(g,m,h)}
 const dcs=(!M.cs&&WGET('top',w.top).dc)||[];for(const s of dcs){if(s.startsWith('fur:')&&F){const cc=s.slice(4);for(let i=0;i<11;i++){const a=Math.PI*(.05+i*.09),x=N.x+Math.cos(a)*F[2]*.8,y=N.y-2+Math.sin(a)*F[3]*.32;const gr=g.createRadialGradient(x-1,y-1,0,x,y,5);gr.addColorStop(0,'#fff');gr.addColorStop(1,cc);g.fillStyle=gr;g.beginPath();g.arc(x,y,4.4,0,7);g.fill()}g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=.8;g.beginPath();g.ellipse(N.x,N.y,F[2]*.84,F[3]*.38,0,.1,Math.PI-.1);g.stroke()}}
 const a=w.acc;if(!F&&a!=='halo')return;
 if(a==='scarf'){g.fillStyle=lgrad(g,N.x,N.y-5,N.x,N.y+8,'#d8403a');g.strokeStyle=OLC;g.lineWidth=1.2;g.beginPath();g.ellipse(N.x,N.y+1,F[2]*.7,F[3]*.24,0,0,7);g.fill();g.stroke();g.beginPath();g.moveTo(N.x+dir*F[2]*.3,N.y+3);g.lineTo(N.x+dir*F[2]*.42,N.y+F[3]*.95);g.lineTo(N.x+dir*F[2]*.12,N.y+F[3]*.9);g.lineTo(N.x+dir*F[2]*.05,N.y+4);g.closePath();g.fill();g.stroke();g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=.9;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(N.x+i*F[2]*.25,N.y-F[3]*.15);g.lineTo(N.x+i*F[2]*.25,N.y+F[3]*.18);g.stroke()}}
 else if(a==='bowtie'){g.fillStyle='#d8303a';g.strokeStyle=OLC;g.lineWidth=1;g.beginPath();g.moveTo(N.x,N.y+3);g.lineTo(N.x-8,N.y-2);g.lineTo(N.x-8,N.y+8);g.closePath();g.moveTo(N.x,N.y+3);g.lineTo(N.x+8,N.y-2);g.lineTo(N.x+8,N.y+8);g.closePath();g.fill();g.stroke();g.beginPath();g.arc(N.x,N.y+3,2.4,0,7);g.fill();g.stroke()}
 else if(a==='medal'){g.strokeStyle='#2a5ad8';g.lineWidth=2.6;g.beginPath();g.moveTo(N.x-F[2]*.35,N.y-2);g.lineTo(N.x,N.y+F[3]*.6);g.lineTo(N.x+F[2]*.35,N.y-2);g.stroke();const gr=g.createRadialGradient(N.x-2,N.y+F[3]*.7-2,1,N.x,N.y+F[3]*.75,8);gr.addColorStop(0,'#fff6c0');gr.addColorStop(.5,'#ffcf3a');gr.addColorStop(1,'#b07a00');g.fillStyle=gr;g.strokeStyle=OLC;g.lineWidth=1;g.beginPath();g.arc(N.x,N.y+F[3]*.75,6.5,0,7);g.fill();g.stroke();g.fillStyle='#8a5a00';star5(g,N.x,N.y+F[3]*.75,3.2)}
 else if(a==='headphones'){g.strokeStyle='#3a4ad8';g.lineWidth=3.4;g.beginPath();g.arc(hx,hy+hr*.15,hr*.98,Math.PI*1.08,Math.PI*1.92);g.stroke();for(const sd of[-1,1]){const x=hx+sd*hr*.92,y=hy+hr*.3;g.fillStyle=lgrad(g,x,y-8,x,y+8,'#5a6aff');g.strokeStyle=OLC;g.lineWidth=1.2;g.beginPath();g.roundRect(x-5,y-8,10,16,4);g.fill();g.stroke()}}
 else if(a==='flower'){const x=hx+dir*hr*.62,y=hy-hr*.42;for(let i=0;i<5;i++){g.fillStyle='#ff9ec4';g.strokeStyle='#d0608a';g.lineWidth=.7;g.beginPath();g.arc(x+Math.cos(i*1.26)*4.2,y+Math.sin(i*1.26)*4.2,3.4,0,7);g.fill();g.stroke()}g.fillStyle='#ffd23f';g.beginPath();g.arc(x,y,2.6,0,7);g.fill()}
 else if(a==='catears'){for(const sd of[-1,1]){const x=hx+sd*hr*.5,y=hy-hr*.82;g.fillStyle='#2b2b3a';g.strokeStyle=OLC;g.lineWidth=1.2;g.beginPath();g.moveTo(x-7,y+6);g.lineTo(x+sd*3,y-11);g.lineTo(x+8,y+5);g.closePath();g.fill();g.stroke();g.fillStyle='#ffb0c8';g.beginPath();g.moveTo(x-3.5,y+3);g.lineTo(x+sd*2,y-6);g.lineTo(x+4,y+3);g.fill()}}
 else if(a==='halo'){g.strokeStyle='#ffe066';g.lineWidth=3;g.shadowColor='#fff3a0';g.shadowBlur=8;g.beginPath();g.ellipse(hx,hy-hr*1.18,hr*.55,hr*.13,0,0,7);g.stroke();g.shadowBlur=0}}
function drawHat2(g,m,id){const[hx,hy,hr]=m.head,F=m.face,dir=capDir(m),yb=F[1]-F[3]*.62,top=hy-hr*1.02,cx=hx,R=hr*1.04;g.save();g.lineJoin='round';
 const dome=(c,extra=0)=>{g.beginPath();g.moveTo(cx-R,yb);g.bezierCurveTo(cx-R,top-extra,cx+R,top-extra,cx+R,yb);g.closePath();gfill(g,lgrad(g,cx-R*.5,top,cx+R*.4,yb,c),1.8)};
 if(id==='beanie'){dome('#e85a6a',hr*.15);g.strokeStyle='rgba(0,0,0,.16)';g.lineWidth=1.1;for(let i=-4;i<=4;i++){g.beginPath();g.moveTo(cx+i*R*.2,yb-hr*.2);g.quadraticCurveTo(cx+i*R*.16,top+hr*.3,cx+i*R*.08,top+hr*.05);g.stroke()}g.beginPath();g.roundRect(cx-R*1.02,yb-hr*.32,R*2.04,hr*.36,5);gfill(g,lgrad(g,0,yb-hr*.3,0,yb,'#f7c6cc'),1.6);g.strokeStyle='rgba(0,0,0,.15)';for(let i=-9;i<=9;i++){g.beginPath();g.moveTo(cx+i*R*.105,yb-hr*.28);g.lineTo(cx+i*R*.105,yb-hr*.0);g.stroke()}const py=top-hr*.12;const gr=g.createRadialGradient(cx-3,py-3,1,cx,py,hr*.24);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#f0dde0');g.fillStyle=gr;g.strokeStyle=OLC;g.lineWidth=1.4;g.beginPath();g.arc(cx,py,hr*.22,0,7);g.fill();g.stroke()}
 else if(id==='straw'){g.beginPath();g.ellipse(cx+dir*hr*.05,yb-hr*.2,R*1.5,hr*.3,0,0,7);gfill(g,lgrad(g,0,yb-hr*.4,0,yb+hr*.3,'#efcb6a'),1.6);g.strokeStyle='rgba(140,95,25,.45)';g.lineWidth=.8;for(let i=0;i<26;i++){const a=i/26*Math.PI*2;g.beginPath();g.moveTo(cx+Math.cos(a)*R*.9,yb-hr*.2+Math.sin(a)*hr*.18);g.lineTo(cx+Math.cos(a)*R*1.45,yb-hr*.2+Math.sin(a)*hr*.28);g.stroke()}dome('#f2d47a',-hr*.05);g.fillStyle='#d8403a';g.strokeStyle=OLC;g.lineWidth=1.2;g.beginPath();g.moveTo(cx-R*.98,yb-hr*.12);g.bezierCurveTo(cx-R*.9,yb-hr*.38,cx+R*.9,yb-hr*.38,cx+R*.98,yb-hr*.12);g.lineTo(cx+R*.99,yb-hr*.02);g.bezierCurveTo(cx+R*.9,yb-hr*.26,cx-R*.9,yb-hr*.26,cx-R*.99,yb-hr*.02);g.closePath();g.fill();g.stroke();g.strokeStyle='rgba(140,95,25,.35)';for(let r=.3;r<1;r+=.17){g.beginPath();g.ellipse(cx,yb-hr*.5,R*r,hr*.5*r,0,Math.PI,0);g.stroke()}}
 else if(id==='bucket'){const R2=R*.92,yb2=yb-hr*.08;g.beginPath();g.moveTo(cx-R2*1.3,yb2+hr*.1);g.quadraticCurveTo(cx,yb2-hr*.22,cx+R2*1.3,yb2+hr*.1);g.quadraticCurveTo(cx,yb2+hr*.02,cx-R2*1.3,yb2+hr*.1);gfill(g,lgrad(g,0,yb2-hr*.3,0,yb2+hr*.2,'#7f9a5a'),1.6);g.beginPath();g.moveTo(cx-R2*.95,yb2);g.lineTo(cx-R2*.74,top+hr*.18);g.quadraticCurveTo(cx,top+hr*.02,cx+R2*.74,top+hr*.18);g.lineTo(cx+R2*.95,yb2);g.closePath();gfill(g,lgrad(g,cx-R2,top,cx+R2,yb2,'#8aa868'),1.8);g.strokeStyle='rgba(30,50,20,.45)';g.lineWidth=.8;g.setLineDash([1.4,1.4]);g.beginPath();g.moveTo(cx-R2*.9,yb2-hr*.1);g.quadraticCurveTo(cx,yb2-hr*.28,cx+R2*.9,yb2-hr*.1);g.stroke();g.beginPath();g.moveTo(cx-R2*.8,top+hr*.42);g.quadraticCurveTo(cx,top+hr*.24,cx+R2*.8,top+hr*.42);g.stroke();g.setLineDash([]);for(const sd of[-1,1]){g.fillStyle='#c8c8b0';g.beginPath();g.arc(cx+sd*R2*.55,top+hr*.6,1.6,0,7);g.fill()}}
 else if(id==='captain'){dome('#f6f6f2',hr*.02);g.beginPath();g.roundRect(cx-R*.98,yb-hr*.38,R*1.96,hr*.38,4);gfill(g,lgrad(g,0,yb-hr*.38,0,yb,'#1e2a4a'),1.6);g.beginPath();g.moveTo(cx+dir*R*.2,yb);g.quadraticCurveTo(cx+dir*R*1.2,yb+hr*.02,cx+dir*R*1.35,yb+hr*.18);g.quadraticCurveTo(cx+dir*R*.8,yb+hr*.22,cx+dir*R*.1,yb+hr*.1);g.closePath();gfill(g,lgrad(g,0,yb,0,yb+hr*.2,'#15151c'),1.4);g.strokeStyle='#ffd23f';g.lineWidth=1.6;g.beginPath();g.moveTo(cx-R*.9,yb-hr*.05);g.lineTo(cx+R*.9,yb-hr*.05);g.stroke();const bx=cx+dir*hr*.1,by=yb-hr*.55;g.fillStyle='#ffd23f';g.strokeStyle='#a07a10';g.lineWidth=.8;g.beginPath();g.ellipse(bx,by,hr*.24,hr*.16,0,0,7);g.fill();g.stroke();g.strokeStyle='#7a5a00';g.lineWidth=1.3;g.beginPath();g.moveTo(bx,by-hr*.1);g.lineTo(bx,by+hr*.1);g.moveTo(bx-hr*.08,by+hr*.04);g.quadraticCurveTo(bx,by+hr*.14,bx+hr*.08,by+hr*.04);g.moveTo(bx-hr*.05,by-hr*.05);g.lineTo(bx+hr*.05,by-hr*.05);g.stroke()}
 else if(id==='tricorn'){g.beginPath();g.moveTo(cx-R*1.45,yb-hr*.05);g.quadraticCurveTo(cx-R*.9,top-hr*.35,cx,top-hr*.05);g.quadraticCurveTo(cx+R*.9,top-hr*.35,cx+R*1.45,yb-hr*.05);g.quadraticCurveTo(cx,yb-hr*.32,cx-R*1.45,yb-hr*.05);gfill(g,lgrad(g,0,top,0,yb,'#2b2b3a'),1.8);g.strokeStyle='#ffd23f';g.lineWidth=2.2;g.beginPath();g.moveTo(cx-R*1.38,yb-hr*.08);g.quadraticCurveTo(cx,yb-hr*.38,cx+R*1.38,yb-hr*.08);g.stroke();g.fillStyle='#f4f2ec';const sx=cx,sy=top+hr*.38;g.beginPath();g.arc(sx,sy,hr*.16,0,7);g.fill();g.fillRect(sx-hr*.09,sy+hr*.08,hr*.18,hr*.1);g.fillStyle='#2b2b3a';g.beginPath();g.arc(sx-hr*.06,sy,hr*.045,0,7);g.arc(sx+hr*.06,sy,hr*.045,0,7);g.fill();g.strokeStyle='#f4f2ec';g.lineWidth=1.6;g.beginPath();g.moveTo(sx-hr*.3,sy+hr*.3);g.lineTo(sx+hr*.3,sy+hr*.42);g.moveTo(sx+hr*.3,sy+hr*.3);g.lineTo(sx-hr*.3,sy+hr*.42);g.stroke()}
 else if(id==='santa'){g.beginPath();g.moveTo(cx-R,yb-hr*.1);g.bezierCurveTo(cx-R*.8,top-hr*.2,cx+R*.4,top-hr*.5,cx-dir*R*1.25,top+hr*.25);g.bezierCurveTo(cx+R*.2,top-hr*.1,cx+R,top,cx+R,yb-hr*.1);g.closePath();gfill(g,lgrad(g,cx-R,top,cx+R,yb,'#d22c2c'),1.8);for(let i=0;i<12;i++){const x=cx-R+i*R*2/11,y=yb-hr*.12+Math.sin(i*1.7)*1.2;const gr=g.createRadialGradient(x-1,y-1,0,x,y,hr*.2);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#e8e4dc');g.fillStyle=gr;g.beginPath();g.arc(x,y,hr*.19,0,7);g.fill()}const px=cx-dir*R*1.25,py=top+hr*.3;const gr=g.createRadialGradient(px-2,py-2,1,px,py,hr*.24);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#e4e0d8');g.fillStyle=gr;g.beginPath();g.arc(px,py,hr*.22,0,7);g.fill()}
 else if(id==='helmet'){g.restore();g.save();const gr=g.createRadialGradient(hx-hr*.4,hy-hr*.2,hr*.1,hx,hy+hr*.1,hr*1.45);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.5,'rgba(190,225,255,.18)');gr.addColorStop(1,'rgba(120,170,230,.45)');g.fillStyle=gr;g.strokeStyle='#8aa0b8';g.lineWidth=2.4;g.beginPath();g.arc(hx,hy+hr*.25,hr*1.32,0,7);g.fill();g.stroke();g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=2.2;g.beginPath();g.arc(hx,hy+hr*.25,hr*1.12,Math.PI*1.15,Math.PI*1.45);g.stroke();const N=neckOf(m);g.fillStyle='#d8dee8';g.strokeStyle=OLC;g.lineWidth=1.2;g.beginPath();g.ellipse(N.x,N.y,F[2]*.75,F[3]*.22,0,0,7);g.fill();g.stroke();g.fillStyle='#5aaaff';g.beginPath();g.arc(N.x+F[2]*.4,N.y,1.8,0,7);g.fill();
  // 헬멧 안쪽 머리(모자를 지웠으니 머리카락으로 채움)
  g.globalCompositeOperation='destination-over';g.fillStyle='#3a2a22';g.beginPath();g.moveTo(cx-R*.98,yb+hr*.1);g.bezierCurveTo(cx-R,top,cx+R,top,cx+R*.98,yb+hr*.1);g.closePath();g.fill();g.globalCompositeOperation='source-over'}
 else if(id==='seacrown'){crown(g,(m.cap[0]+m.cap[2])/2-dir*hr*.2,m.cap[1]+hr*.12,R*.72,hr*.55,'#ffcf3a')}
 else if(id==='icecrown'){crown(g,(m.cap[0]+m.cap[2])/2-dir*hr*.15,m.cap[1]+hr*.05,R*.7,hr*.5,'#bfeaff',1)}
 g.restore()}
function crown(g,x,y,w,h,col,ice){g.beginPath();g.moveTo(x-w,y);for(let i=0;i<5;i++){const xx=x-w+(i+.5)*w*2/5;g.lineTo(xx,y-h*(i%2?.7:1));g.lineTo(x-w+(i+1)*w*2/5,y-h*.25)}g.lineTo(x+w,y+h*.18);g.lineTo(x-w,y+h*.18);g.closePath();g.fillStyle=ice?'rgba(200,240,255,.92)':lgrad(g,x,y-h,x,y+h*.2,col);g.strokeStyle=ice?'#5a9ac8':OLC;g.lineWidth=1.5;g.fill();g.stroke();
 for(let i=0;i<5;i++){const xx=x-w+(i+.5)*w*2/5,yy=y-h*(i%2?.5:.75);const gr=g.createRadialGradient(xx-1,yy-1,.3,xx,yy,3);gr.addColorStop(0,'#fff');gr.addColorStop(1,ice?'#8ad0ff':i%2?'#ff5a7a':'#f8f4ee');g.fillStyle=gr;g.beginPath();g.arc(xx,yy,2.3,0,7);g.fill()}
 g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=1;g.beginPath();g.moveTo(x-w*.9,y+h*.08);g.lineTo(x+w*.9,y+h*.08);g.stroke()}
function costumeHood(g,m,id){const[hx,hy,hr]=m.head,F=m.face,dir=capDir(m),C={shark:['#7a8ea8','#f4f4f0'],octo:['#ef7a8a','#ffd0d8'],penguin:['#2b2b3a','#fbfbf6'],cat:['#f2a24a','#fff1dc']}[id];
 const fx=F[0],fy=F[1]+F[3]*.02,frx=F[2]*1.04,fry=F[3]*1.14,cx=(fx+hx)/2,cy=(hy+fy)/2-hr*.12,RX=Math.max(frx*1.32,hr*1.08),RY=(fy+fry*1.12-(hy-hr*1.12))/2;
 g.save();if(id==='cat'){for(const sd of[-1,1]){const x=cx+sd*RX*.55,y=cy-RY*.82;g.beginPath();g.moveTo(x-RX*.28,y+RY*.25);g.lineTo(x+sd*RX*.1,y-RY*.38);g.lineTo(x+RX*.3,y+RY*.22);g.closePath();gfill(g,C[0],1.6);g.fillStyle='#ffb0c0';g.beginPath();g.moveTo(x-RX*.14,y+RY*.16);g.lineTo(x+sd*RX*.06,y-RY*.2);g.lineTo(x+RX*.15,y+RY*.15);g.fill()}}
 if(id==='octo'){for(let i=0;i<5;i++){const a=Math.PI*(.15+i*.17),x=cx+Math.cos(a)*RX*.95,y=cy+Math.sin(a)*RY*.55;g.beginPath();g.moveTo(x-5,y);g.quadraticCurveTo(x+(i-2)*4,y+16,x+(i-2)*7,y+24);g.quadraticCurveTo(x+(i-2)*3,y+14,x+5,y);g.closePath();gfill(g,C[0],1.3);g.fillStyle=C[1];g.beginPath();g.arc(x+(i-2)*4,y+14,1.6,0,7);g.fill()}}
 g.beginPath();g.ellipse(cx,cy,RX,RY,0,0,7);g.ellipse(fx,fy,frx,fry,0,0,7);
 const gr=g.createRadialGradient(cx-RX*.4,cy-RY*.5,RX*.1,cx,cy,RX*1.2);const c0=hex3(C[0]);gr.addColorStop(0,`rgb(${Math.min(255,c0[0]*1.25)|0},${Math.min(255,c0[1]*1.25)|0},${Math.min(255,c0[2]*1.25)|0})`);gr.addColorStop(1,`rgb(${c0[0]*.7|0},${c0[1]*.7|0},${c0[2]*.7|0})`);g.fillStyle=gr;g.fill('evenodd');g.lineWidth=1.8;g.strokeStyle=OLC;g.stroke();
 // 얼굴 테두리 안감
 g.lineWidth=3;g.strokeStyle=C[1];g.beginPath();g.ellipse(fx,fy,frx+1.5,fry+1.5,0,0,7);g.stroke();
 if(id==='shark'){g.fillStyle='#fff';g.strokeStyle='#9aa';g.lineWidth=.6;for(let i=0;i<9;i++){const a=Math.PI*(1.1+i*.1),x=fx+Math.cos(a)*(frx+3),y=fy+Math.sin(a)*(fry+3);g.save();g.translate(x,y);g.rotate(a+Math.PI/2);g.beginPath();g.moveTo(-2.6,0);g.lineTo(0,5);g.lineTo(2.6,0);g.closePath();g.fill();g.stroke();g.restore()}const ex=cx+dir*RX*.55,ey=cy-RY*.5;g.fillStyle='#1a1a22';g.beginPath();g.arc(ex,ey,2.8,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(ex-.8,ey-.8,.9,0,7);g.fill()}
 if(id==='penguin'){const bx=cx+dir*RX*.05,by=cy-RY*.58;g.fillStyle='#ffb020';g.strokeStyle=OLC;g.lineWidth=1.2;g.beginPath();g.moveTo(bx-6,by);g.lineTo(bx+dir*9,by+3);g.lineTo(bx-6,by+6);g.closePath();g.fill();g.stroke();for(const sd of[-1,1]){g.fillStyle='#fff';g.beginPath();g.arc(bx+sd*9,by-4,3.2,0,7);g.fill();g.fillStyle='#1a1a22';g.beginPath();g.arc(bx+sd*9+.6,by-4,1.8,0,7);g.fill()}}
 if(id==='octo'){g.fillStyle=C[1];for(let i=0;i<6;i++){const a=Math.PI*(1.15+i*.14);g.beginPath();g.arc(cx+Math.cos(a)*RX*.8,cy+Math.sin(a)*RY*.8,2.4,0,7);g.fill()}for(const sd of[-1,1]){g.fillStyle='#fff';g.beginPath();g.arc(cx+sd*RX*.32,cy-RY*.7,4,0,7);g.fill();g.fillStyle='#2b2140';g.beginPath();g.arc(cx+sd*RX*.32+.8,cy-RY*.68,2.2,0,7);g.fill()}}
 if(id==='cat'){g.strokeStyle='#c8641c';g.lineWidth=2.4;for(let i=0;i<3;i++){const a=Math.PI*(1.35+i*.15);g.beginPath();g.moveTo(cx+Math.cos(a)*RX*.98,cy+Math.sin(a)*RY*.98);g.lineTo(cx+Math.cos(a)*RX*.72,cy+Math.sin(a)*RY*.72);g.stroke()}}
 g.restore()}
// 게임 화면 그리기
function sprite(n,cx,fy,h,ex={}){const ps=pxSetOf(save.ward.wear);if(ps){const tp=pxDraw(ctx,ps,n,cx,fy,h,ex);if(tp){PXNOEXT=true;return tp}}PXNOEXT=false;if(ex.dx)cx+=ex.dx;const im0=IMG[n];let w=h*.75,x=cx-.5*w,y=fy-h;
 ctx.save();if(ex.shake)ctx.translate((Math.random()-.5)*ex.shake,(Math.random()-.5)*ex.shake);if(ex.rot){ctx.translate(cx,fy);ctx.rotate(ex.rot);ctx.translate(-cx,-fy)}
 if(ex.sq){ctx.translate(cx,fy);ctx.scale(1+ex.sq*.5,1-ex.sq);ctx.translate(-cx,-fy)}
 const ok=im0&&im0.complete&&im0.naturalWidth&&!im0.bad;
 if(ok){const ws=wearSprite(n,save.ward.wear),s=h/im0.naturalHeight;w=im0.naturalWidth*s;x=cx-ANC[n]*w;
  if(ws){const k=h/ws.h;ctx.drawImage(ws.c,x-ws.P*k,y-ws.P*k,ws.c.width*k,ws.c.height*k)}else ctx.drawImage(im0,x,y,w,h);
  if(save.ward.wear.acc==='halo'||['goldj','seaking','moonrobe'].includes(save.ward.wear.top)){ctx.globalAlpha=.5+.3*Math.sin(T*4);ctx.fillStyle='#fff8d0';for(let i=0;i<3;i++)star5(ctx,x+w*(.3+i*.2),y+h*(.45+Math.sin(T*3+i)*.1),2.5);ctx.globalAlpha=1}}
 else{ctx.fillStyle='#e9d6b4';ctx.strokeStyle=OL;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(cx-h*.18,fy-h*.55,h*.36,h*.5,12);ctx.fill();ctx.stroke();ctx.fillStyle='#ffe1c8';ctx.beginPath();ctx.arc(cx,fy-h*.72,h*.2,0,7);ctx.fill();ctx.stroke();w=h*.5;x=cx-w*.3}
 ctx.restore();const tp=TIP[n];return tp?{x:x+tp[0]*w,y:y+tp[1]*h}:{x:cx+h*.3,y:fy-h*.9}}
// 동작 이름 → 실제 스프라이트(걷기·달리기·앉기 포함)
function drawWearAt(g,n,cx,fy,h,w,o={}){const ps=pxSetOf(w);if(ps&&pxDraw(g,ps,n,cx,fy,h))return;const im0=IMG[n];if(!im0||!im0.naturalWidth)return;const ws=wearSprite(n,w),s=h/im0.naturalHeight,ww=im0.naturalWidth*s,x=cx-(ANC[n]||.5)*ww,y=fy-h;g.save();if(o.flip){g.translate(cx,0);g.scale(o.flip,1);g.translate(-cx,0)}if(ws){const k=h/ws.h;g.drawImage(ws.c,x-ws.P*k,y-ws.P*k,ws.c.width*k,ws.c.height*k)}else g.drawImage(im0,x,y,ww,h);g.restore()}
