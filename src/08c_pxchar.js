/* ================= 4.2 도트 캐릭터 (ChatGPT 생성 의상 시트 → 도트 프레임) =================
 세트를 통째로 입었을 때 그 세트의 도트 프레임으로 그림. 기본 세트는 동작 19개 전부,
 다른 세트는 대기·동작·낚싯대 자세 2~4개를 상태별로 나눠 씀. 세트가 아닌 조합은 기존 레이어 방식. */
const CPX=__CHARPX__,CPI={};
/* 4.7 최적화: 프레임 이미지는 필요할 때만 디코딩 (570장 → 입은 세트만) */
function cpiGet(s,k){const key=s+'/'+k;let i=CPI[key];if(!i){i=new Image();i.decoding='async';i.src=CPX[s][k].src;CPI[key]=i}return i}
const PXPRE={};function pxPre(s){if(PXPRE[s]||!CPX[s])return;PXPRE[s]=1;for(const k in CPX[s])cpiGet(s,k)}
let PXNOEXT=false;
function pxSetOf(w){for(const st of WSETS){if(!CPX[st.id])continue;let ok=(st.w.costume||'none')===(w.costume||'none');if(ok)for(const k in st.w)if(w[k]!==st.w[k]){ok=false;break}
 if(ok&&st.id==='s_basic'){const d=fresh().ward.wear;for(const k of['top','bottom','hat','shoes','gloves','acc','bag'])if(w[k]!==d[k])ok=false}if(ok)return st.id}return null}
const PX_ROD=['prep','castready','cast','wait','hook','reel','fight','rest'],PX_CHEER=['jump','happy','success','lift','surprise','wink'];
const PX_ALIAS={prep:'wait',rest:'wait',wait2:'wait',focus:'wait',castready2:'castready',cast2:'cast',reel2:'reel',fight2:'fight',lift:'success',happy:'success',jump:'success',surprise:'hook',run:'walk'};
function pxPick(sid,n){const F=CPX[sid];if(F[n])return{k:n,rod:false};const al=PX_ALIAS[n];if(al&&F[al])return{k:al,rod:false};
 if(PX_ROD.includes(n)){if(F.rod2&&['hook','reel','fight'].includes(n))return{k:'rod2'};if(F.rod)return{k:'rod'};return{k:'idle',rod:true}}
 if(n==='walk'||n==='run')return{k:F.walk?'walk':F.act?'act':'idle'};
 if(PX_CHEER.includes(n))return{k:F.cheer?'cheer':F.act?'act':'idle'};
 return{k:'idle'}}
function pxDraw(g,sid,n,cx,fy,h,ex={}){if(n!=='idle')pxPre(sid);let p=pxPick(sid,n),fr=CPX[sid][p.k],im=cpiGet(sid,p.k);if(!im.complete||!im.naturalWidth){const i2=cpiGet(sid,'idle');if(i2.complete&&i2.naturalWidth){p={k:'idle',rod:p.rod};fr=CPX[sid].idle;im=i2}else return null}
 const k=h/(CPX[sid].idle.bh||CPX[sid].idle.h),fw=fr.w*k,fh=fr.h*k,x=cx-fr.ax*fw,y=fy-fh;
 g.save();if(ex.dx)g.translate(ex.dx,0);if(ex.shake)g.translate((Math.random()-.5)*ex.shake,(Math.random()-.5)*ex.shake);if(ex.rot){g.translate(cx,fy);g.rotate(ex.rot);g.translate(-cx,-fy)}
 if(ex.sq){g.translate(cx,fy);g.scale(1+ex.sq*.5,1-ex.sq);g.translate(-cx,-fy)}
 g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(im,x,y,fw,fh);
 let tip=null;
 if(fr.tip){tip={x:x+fr.tip[0]*fw,y:y+fr.tip[1]*fh}}
 else if(p.rod||PX_ROD.includes(n)){const hx=x+fw*.74,hy=y+fh*.6,L=h*.55,a=-1.05;tip={x:hx+Math.cos(a)*L,y:hy+Math.sin(a)*L};
  const st=Math.max(2,Math.round(h/34));g.fillStyle='#3a2416';for(let u=0;u<=1;u+=1/40){g.fillRect(Math.round(hx+(tip.x-hx)*u)-st/2,Math.round(hy+(tip.y-hy)*u)-st/2,st+1,st+1)}
  g.fillStyle='#a8743f';for(let u=0;u<=1;u+=1/40){g.fillRect(Math.round(hx+(tip.x-hx)*u)-st/2+1,Math.round(hy+(tip.y-hy)*u)-st/2,st-1,st-1)}
  g.fillStyle='#2b2b2b';g.fillRect(Math.round(hx)-st,Math.round(hy)-st,st*2,st*2)}
 g.restore();if(tip&&ex.dx)tip.x+=ex.dx;return tip||{x:x+fw*.9,y:y+fh*.1}}
