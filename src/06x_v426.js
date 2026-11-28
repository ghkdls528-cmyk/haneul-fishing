/* ================= 4.26 계절 입자 (나비 삭제) =================
 - 낚시터에 날던 나비(타원 두 개 그림)는 퀄리티가 낮아 삭제 (07_drawworld lifeFront)
 - 예전 봄·가을 타원 꽃잎(06e)도 삭제하고 새로 그림
   봄: 벚꽃잎(끝이 갈라진 꽃잎, 팔랑이며 뒤집힘) / 여름: 수면 윤슬 반짝임 + 떠다니는 빛 알갱이 + 가끔 산들바람 /
   가을: 단풍잎(5갈래, 빙글빙글) / 겨울: 크기 다른 눈송이(가까운 건 크고 빠르게)
 - 비·폭풍이 세면 줄이고, 저사양이면 개수 절반, '화면 흔들림·번쩍임 줄이기'면 반짝임 약하게 */
const SEAP=[];for(let i=0;i<46;i++)SEAP.push({x:Math.random(),y:Math.random(),s:Math.random(),r:Math.random()*6.283,k:Math.floor(Math.random()*3),z:.45+Math.random()*.8});
function petal(c,sz,col){c.fillStyle=col;c.beginPath();c.moveTo(0,-sz);c.bezierCurveTo(sz*.9,-sz*.7,sz*.8,sz*.6,0,sz);c.bezierCurveTo(-sz*.8,sz*.6,-sz*.9,-sz*.7,0,-sz);c.fill();
 c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-sz*.18,-sz*.2,sz*.22,sz*.45,-.3,0,7);c.fill();
 c.fillStyle='rgba(120,40,70,.35)';c.beginPath();c.moveTo(-sz*.18,-sz*.95);c.lineTo(0,-sz*.62);c.lineTo(sz*.18,-sz*.95);c.closePath();c.fill()}
function maple(c,sz,col){c.fillStyle=col;c.beginPath();const P=[[0,-1],[.22,-.48],[.62,-.72],[.5,-.22],[.98,-.12],[.55,.14],[.68,.52],[.18,.34],[0,.62],[-.18,.34],[-.68,.52],[-.55,.14],[-.98,-.12],[-.5,-.22],[-.62,-.72],[-.22,-.48]];
 P.forEach(([x,y],i)=>i?c.lineTo(x*sz,y*sz):c.moveTo(x*sz,y*sz));c.closePath();c.fill();c.strokeStyle='rgba(90,30,10,.45)';c.lineWidth=Math.max(.8,sz*.08);c.beginPath();c.moveTo(0,sz*.62);c.lineTo(0,sz*1.05);c.moveTo(0,sz*.5);c.lineTo(0,-sz*.7);c.moveTo(0,0);c.lineTo(sz*.55,-.2*sz);c.moveTo(0,0);c.lineTo(-sz*.55,-.2*sz);c.stroke()}
function seasonFx(g,t){if(S==='title'||rainAmt>.6||stormAmt>.4)return;const sn=seasonNow(),n=LOWGFX?Math.floor(SEAP.length/2):SEAP.length,fade=1-Math.max(rainAmt,stormAmt)*1.4,wd=weather==='wind'?1:0,top=g.top,hh=g.surf-g.top+30,calm=save.set.calm?.35:1;
 if(fade<=0)return;ctx.save();ctx.globalAlpha=fade;
 if(sn==='spring'){const cols=['#ffc4d8','#ffb0c8','#ffd8e6'];for(let i=0;i<n;i++){const p=SEAP[i],sp=(22+p.s*26)*(1+wd*2.5)*p.z,x=((p.x*(W+80)+t*sp+Math.sin(t*.9+p.r)*30)%(W+80))-40,y=top+((p.y*hh+t*(14+p.s*14)*p.z)%hh);
  ctx.save();ctx.translate(x,y);ctx.rotate(t*(.8+p.s)+p.r);ctx.scale(Math.cos(t*(2+p.s*2)+p.r),1);petal(ctx,(4+p.s*3)*p.z,cols[p.k]);ctx.restore()}}
 else if(sn==='autumn'){const cols=['#e0552a','#f08a24','#d8a21c','#b83a22'];for(let i=0;i<Math.min(n,18);i++){const p=SEAP[i],sp=(18+p.s*22)*(1+wd*2.5)*p.z,x=((p.x*(W+80)+t*sp+Math.sin(t*.7+p.r)*40)%(W+80))-40,y=top+((p.y*hh+t*(20+p.s*18)*p.z)%hh);
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*1.3+p.r)*1.2+t*.6*(p.k%2?1:-1));ctx.scale(1,Math.cos(t*(1.6+p.s)+p.r)*.6+.4*Math.sign(Math.cos(t*(1.6+p.s)+p.r)||1));maple(ctx,(5+p.s*4)*p.z,cols[(p.k+i)%4]);ctx.restore()}}
 else if(sn==='winter'&&weather!=='snow'){for(let i=0;i<n;i++){const p=SEAP[i],z=p.z,x=((p.x*(W+40)+Math.sin(t*(.6+p.s)+p.r)*18*z+t*6*(1+wd*4))%(W+40))-20,y=top-10+((p.y*(H-top)+t*(22+38*z))%(H-top));
  if(y>g.surf+8&&z<.9)continue;const rr=1.2+z*2.2;ctx.fillStyle=`rgba(255,255,255,${.55+z*.35})`;ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.fill();if(z>1){ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=.8;for(let a=0;a<3;a++){const an=a*1.047+p.r;ctx.beginPath();ctx.moveTo(x-Math.cos(an)*rr*2,y-Math.sin(an)*rr*2);ctx.lineTo(x+Math.cos(an)*rr*2,y+Math.sin(an)*rr*2);ctx.stroke()}}}}
 else if(sn==='summer'){const night=isNight();
  // 수면 윤슬: 반짝이는 별 모양이 나타났다 사라짐
  for(let i=0;i<Math.min(n,22);i++){const p=SEAP[i],ph=(t*(.5+p.s*.6)+p.r)%1,a=Math.sin(ph*Math.PI)*calm;if(a<.05)continue;const x=p.x*W,y=g.surf+2+p.y*26,s=(2+p.s*3.5)*a;
   ctx.fillStyle=night?`rgba(200,220,255,${.7*a})`:`rgba(255,255,235,${.9*a})`;ctx.beginPath();ctx.moveTo(x,y-s*1.6);ctx.lineTo(x+s*.35,y);ctx.lineTo(x,y+s*1.6);ctx.lineTo(x-s*.35,y);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(x-s*1.6,y);ctx.lineTo(x,y+s*.3);ctx.lineTo(x+s*1.6,y);ctx.lineTo(x,y-s*.3);ctx.closePath();ctx.fill()}
  // 떠다니는 빛 알갱이 (밤엔 반딧불처럼)
  for(let i=22;i<Math.min(n,34);i++){const p=SEAP[i],x=((p.x*W+Math.sin(t*.4+p.r)*40+t*8)%(W+20))-10,y=top+20+p.y*(g.surf-top-40)+Math.sin(t*.8+p.r)*14,a=(.35+.35*Math.sin(t*2+p.r))*calm,rr=night?2.2:1.8+p.s*1.6;
   const gr=ctx.createRadialGradient(x,y,0,x,y,rr*4);gr.addColorStop(0,night?`rgba(220,255,140,${a})`:`rgba(255,255,255,${a*.9})`);gr.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,rr*4,0,7);ctx.fill()}
  // 가끔 산들바람 줄기
  if(!night){const ph=(t*.12)%1;if(ph<.35){const a=Math.sin(ph/.35*Math.PI)*.35;ctx.strokeStyle=`rgba(255,255,255,${a})`;ctx.lineWidth=1.6;ctx.lineCap='round';for(let k=0;k<3;k++){const x=ph/.35*(W+240)-160+k*40,y=top+50+k*34;ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+30,y-8,x+60,y+8,x+100,y-2);ctx.stroke()}}}}
 ctx.restore()}
{const _lf=lifeFront;lifeFront=function(g,t){_lf.apply(this,arguments);try{seasonFx(g,t)}catch(e){}}}
if(TEST)Object.defineProperties(window.__w,{seasonFx:{value:(g,t)=>seasonFx(g,t)}});
