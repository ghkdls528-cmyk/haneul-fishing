/* ================= 4.1 도트 물고기 스프라이트 (ChatGPT 생성 그림 → 도트 변환) =================
 그림이 있는 종은 이 스프라이트를 쓰고, 없는 종은 코드 그림을 씀.
 움직임: 세로 조각을 꼬리 쪽일수록 크게 흔드는 몸통 물결 + 위아래 출렁 + (해파리·문어류) 늘었다 줄었다 */
const FPX=__FISHPX__,FPI={},FPV={};
Object.keys(FPX).forEach(id=>{const i=new Image();i.src=FPX[id];FPI[id]=i});
const PX_BODY={fish:1,eel:1,moray:1,billfish:1,catfish:1,sturgeon:1,hammer:1,dolphin:1,orca:1,oar:1,gulper:1,dragon:1,flat:1,angler:1,file:1,box:1,puffer:1,hatchet:1,dwhale:1};
function pxVariant(id,v){const key=id+v;if(FPV[key])return FPV[key];const im=FPI[id];const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);
 try{const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const r=p[i],gg=p[i+1],b=p[i+2],l=(r*.3+gg*.59+b*.11)/255;let o;
  if(v==='gold'){const k=Math.pow(l,.8);o=[255*Math.min(1,k*1.25),205*Math.min(1,k*1.15)+20*k,60*k]}
  else if(v==='albino'){const k=.55+l*.5;o=[255*k,236*k,240*k];if(r>gg*1.3&&r>b*1.2)o=[255,150,175]}
  else{const[h,s,ll]=rgb2hsl(r,gg,b);o=hsl2rgb((h+150)%360,Math.min(1,s*1.2+.1),ll)}
  p[i]=o[0];p[i+1]=o[1];p[i+2]=o[2]}g.putImageData(d,0,0)}catch(e){}
 return FPV[key]=c}
function drawPix(c,f,L,t,o,s,m){const im=FPI[f.id];if(!im||!im.complete||!im.naturalWidth)return false;
 const src=o.v&&f.r>0?pxVariant(f.id,o.v):im,w=im.naturalWidth,h=im.naturalHeight,K=f.k,isBody=PX_BODY[K],wide=w>=h;
 const base=K==='fish'||K==='billfish'||K==='eel'||K==='moray'||K==='oar'?1.12:K==='star'||K==='urchin'||K==='clam'||K==='chest'||K==='can'||K==='boot'||K==='bottle'?.8:.95;
 let sc=L*base/(wide?w:h*.95);if(f.giant)sc*=1;const dw=w*sc,dh=h*sc,hurt=m==='hurt',spd=(hurt?14:6)*(f.p>=4?.8:1),amp=isBody?dh*(K==='eel'||K==='oar'||K==='moray'?.12:.07):0;
 c.save();c.imageSmoothingEnabled=false;
 const by=Math.sin(t*2+s)*L*.02;
 if(K==='jelly'||K==='octo'||K==='dumbo'||K==='giantsquid'||K==='squid'||K==='squidL'){const k=1+Math.sin(t*3+s)*.05;c.translate(0,by);c.scale(1/k,k);c.drawImage(src,-dw/2,-dh/2,dw,dh)}
 else if(K==='puffer'&&o.inflate){const k=1+o.inflate*.35;c.scale(k,k);c.drawImage(src,-dw/2,-dh/2,dw,dh)}
 else if(!isBody){c.rotate(Math.sin(t*1.5+s)*.05);c.translate(0,by);c.drawImage(src,-dw/2,-dh/2,dw,dh)}
 else{const N=Math.min(w,24);for(let i=0;i<N;i++){const sx=Math.floor(w*i/N),ex=Math.floor(w*(i+1)/N),u=i/(N-1),dy=Math.sin(t*spd+s-u*2.6)*amp*Math.pow(1-u,1.6)+by;
   c.drawImage(src,sx,0,ex-sx,h,-dw/2+sx*sc,-dh/2+dy,(ex-sx)*sc+.6,dh)}}
 c.restore();
 // 변종·고등급 반짝이
 if(o.v==='gold'||f.r>=5){c.save();for(let i=0;i<4;i++){const a=t*1.6+i*1.57,xx=Math.cos(a)*dw*.42,yy=Math.sin(a*1.3)*dh*.35,z=Math.max(1.5,L*.025)*(1+Math.sin(t*6+i)*.5);c.fillStyle=o.v==='gold'?'#fff6b0':f.r>=6?'#ffd0f0':'#fff6c8';c.fillRect(xx-z,yy-z*.3,z*2,z*.6);c.fillRect(xx-z*.3,yy-z,z*.6,z*2)}c.restore()}
 if(o.v==='mut'){c.save();c.globalAlpha=.25+.15*Math.sin(t*4);c.fillStyle='#b070ff';c.beginPath();c.ellipse(0,0,dw*.55,dh*.55,0,0,7);c.fill();c.restore()}
 return true}
