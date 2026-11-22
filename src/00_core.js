
'use strict';
const SPR=__SPRITES__;
const CAP={"cast": [0.0, 0.075, 0.329, 0.461], "castready": [0.014, 0.057, 0.667, 0.436], "fail": [0.183, 0.182, 0.643, 0.496], "fight": [0.0, 0.168, 0.272, 0.489], "happy": [0.02, 0.118, 0.808, 0.496], "hook": [0.0, 0.082, 0.568, 0.432], "idle": [0.02, 0.007, 0.821, 0.382], "jump": [0.095, 0.029, 0.878, 0.364], "lift": [0.066, 0.007, 0.502, 0.404], "prep": [0.062, 0.021, 0.708, 0.354], "reel": [0.016, 0.089, 0.391, 0.471], "rest": [0.022, 0.061, 0.589, 0.429], "success": [0.091, 0.096, 0.57, 0.411], "surprise": [0.013, 0.079, 0.937, 0.471], "wait": [0.092, 0.046, 0.742, 0.496], "wink": [0.025, 0.021, 0.803, 0.482]};
const $=id=>document.getElementById(id);
const TEST=location.search.includes('test');
const cv=$('c'),ctx=cv.getContext('2d');
if(!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(typeof r==='number'?r:(r[0]||0),w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
let W=0,H=0,TOP=60,NAV=80,DPR=1,LOWGFX=false;
function resize(){DPR=LOWGFX?1:Math.min(3,Math.max(1,devicePixelRatio||1));W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);
 TOP=$('top').getBoundingClientRect().bottom+4;NAV=H-$('nav').getBoundingClientRect().top;
 $('hint').style.bottom=(NAV+8)+'px';$('chips').style.bottom=(NAV+38)+'px';document.documentElement.style.setProperty('--gb',(TOP+104)+'px')}
addEventListener('resize',resize);
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,k)=>a+(b-a)*k;
const FONT='Jua,"Apple SD Gothic Neo",sans-serif';
/* ================= 캐릭터 스프라이트 ================= */
const IMG={},ANC={walk:.5,run:.5,sit:.5,idle:.5,wink:.45,jump:.5,surprise:.55,happy:.5,prep:.4,castready:.42,cast:.3,wait:.42,hook:.4,reel:.38,fight:.42,lift:.4,success:.45,fail:.4,rest:.5};
const TIP={wait:[.97,.02],hook:[.86,.03],reel:[.95,.06],fight:[.7,.03],cast:[.98,.12],prep:[.95,.02]};
Object.keys(ANC).forEach(n=>{const i=new Image();i.onerror=()=>{i.bad=1};i.src=SPR[n]||'';IMG[n]=i});
$('titleImg').src=SPR.title||'';$('titleImg').onerror=function(){this.style.display='none'};
// 의상 색 바꾸기: 베이지 점퍼·바지 픽셀만 골라 색상 회전(이미지별 1회 계산 후 캐시)
const OUTC={};
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function hsl2rgb(h,s,l){h/=360;const f=(n)=>{const k=(n+h*12)%12,a=s*Math.min(l,1-l);return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))};return[f(0),f(8),f(4)]}
function outfitImg(n,o){if(!o||o.hue==null)return IMG[n];const key=o.id+'_'+n;if(OUTC[key])return OUTC[key];const im=IMG[n];if(!im.complete||!im.naturalWidth||im.bad)return im;
 try{const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height),p=d.data;
  for(let i=0;i<p.length;i+=4){if(p[i+3]<40)continue;const[h,s,l]=rgb2hsl(p[i],p[i+1],p[i+2]);if(h>=18&&h<=58&&s<.42&&s>.06&&l>.38&&l<.95&&i/4%c.width>c.width*.05){const nl=o.id==='red'?l*.9:l;const[r,gg,b]=hsl2rgb(o.hue,Math.min(1,s*.6+o.sat*.6),nl);p[i]=r;p[i+1]=gg;p[i+2]=b}}
  g.putImageData(d,0,0);OUTC[key]=c;return c}catch(e){return im}}
