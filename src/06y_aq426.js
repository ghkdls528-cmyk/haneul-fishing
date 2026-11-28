/* ================= 4.26 수족관 리뉴얼 =================
 ① 전시 목록: 등급별(★1~★6)로 묶은 그림 카드 · '전시 중만 보기' · 등급마다 전시 수
 ② 등급 세트 보너스: 같은 등급 3마리 이상 전시하면 관람료 +(★1 3% · ★2 5% · ★3 8% · ★4 12% · ★5 18% · ★6 25%)
 ③ 수조 연출: 일렁이는 물빛(코스틱), 영웅(★4) 이상 빛 오라, 전설 이상 반짝이 꼬리, 물고기를 누르면 이름표
 ④ 보물 방울: 전시한 물고기가 가끔 빛나는 방울을 뱉음 → 눌러서 골드. 8% 황금 진주(×8) · 1% 전설 진주(×30). 하루 40개까지 (save.aq.pb)
 ⑤ 작은 물고기가 한가운데 뭉치던 무리 짓기 힘을 약하게 (09b) */
function aqL(f){const v=critL0(f);return isFinite(v)&&v>0?v:70}  // 황금 참돔처럼 크기 값이 없는 물고기도 안전하게
const AQ_SETB={1:3,2:5,3:8,4:12,5:18,6:25};
const AQ6={f:'all',bub:[],fx:[],tag:null,next:6,cnt:{}};
function aqGradeCnt(){const c={};for(const id of save.aq.slots){const f=FID[id];if(f)c[f.r]=(c[f.r]||0)+1}return c}
function aqSetBonus(){const c=aqGradeCnt();let p=0;for(const r in c)if(c[r]>=3)p+=AQ_SETB[r]||0;return p}
{const _ar=aqRate;aqRate=function(){const b=_ar.apply(this,arguments),p=aqSetBonus();return p?Math.round(b*(1+p/100)):b}}
function aqPbLeft(){const a=save.aq,d=today();if(!a.pb||a.pb.d!==d)a.pb={d,n:0};return Math.max(0,40-a.pb.n)}
// ① 전시 목록
function aqShowHTML(){const a=save.aq,own=FISH.filter(f=>save.dex[f.id]&&f.r>0&&f.k!=='chest'),c=aqGradeCnt(),cap=aqCap();
 let h=`<div class="aq6top"><span>전시 ${a.slots.length}/${cap}${aqSetBonus()?` · 🎖️ 등급 보너스 관람료 +${aqSetBonus()}%`:''}</span><span class="aq6f"><button data-aq6f="all" class="${AQ6.f==='all'?'on':''}">전체</button><button data-aq6f="on" class="${AQ6.f==='on'?'on':''}">전시 중</button></span></div>`;
 if(!own.length)return h+'<p class="aqp">아직 잡은 물고기가 없어요. 낚시하면 여기에 모여요!</p>';
 for(let r=6;r>=1;r--){let L=own.filter(f=>f.r===r);if(AQ6.f==='on')L=L.filter(f=>a.slots.includes(f.id));if(!L.length)continue;const n=c[r]||0,on=n>=3;
  h+=`<div class="aq6sec" style="--rc:${RAR[r].c}"><b>${'★'.repeat(r)} ${RAR[r].n}</b><span>전시 ${n}마리 · ${on?`<em>세트 보너스 +${AQ_SETB[r]}% 적용 중</em>`:`3마리면 관람료 +${AQ_SETB[r]}%`}</span></div><div class="aq6g">`
  +L.map(f=>{const sel=a.slots.includes(f.id);return`<button data-aq="tog" data-id="${f.id}" class="aq6c ${sel?'on':''}" style="--rc:${RAR[r].c}"><canvas data-aqf="${f.id}" width="128" height="80"></canvas><span>${f.n}</span>${sel?'<i>✓</i>':''}</button>`}).join('')+'</div>'}
 return h}
function aqDrawCards(){document.querySelectorAll('#aqBody canvas[data-aqf]').forEach(cv=>{const f=FID[cv.dataset.aqf];if(!f)return;const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);
 const L=Math.min(104,Math.max(56,aqL(f)*.9));try{drawCritter(g,{...f,size:(f.min+f.max)/2},cv.width/2,cv.height/2+2,L,1,0,{seed:1})}catch(e){}})}
{const _ra=renderAq;renderAq=function(){_ra.apply(this,arguments);if(AQX.tab==='show'){const st=$('aqBody').scrollTop;$('aqBody').innerHTML=aqShowHTML();aqDrawCards();$('aqBody').scrollTop=st}}}
$('aq').addEventListener('click',e=>{const b=e.target.closest('[data-aq6f]');if(!b)return;AQ6.f=b.dataset.aq6f;renderAq()});
// ③④ 수조 연출 + 보물 방울
function aqSpawnBub(w,h){const L=AQX.fish;if(!L.length||aqPbLeft()<=0)return;const a=L[Math.floor(Math.random()*L.length)],r=Math.random(),k=r<.01?'legend':r<.09?'gold':'pearl';
 AQ6.bub.push({x:a.x,y:a.y-8,vy:-(14+Math.random()*8),k,t:0,ph:Math.random()*6});if(SFX.splash)SFX.splash(.06)}
function aqPopBub(b){const a=save.aq;aqPbLeft();a.pb.n++;const mul=b.k==='legend'?30:b.k==='gold'?8:1,g=Math.max(10,Math.round(aqRate()*rnd(.08,.18)*mul));save.gold+=g;save.st.aqPearl=(save.st.aqPearl||0)+1;
 const cols=b.k==='legend'?['#ff7ad9','#7ff0ff','#ffe066','#fff']:b.k==='gold'?['#ffe066','#ffb020','#fff']:['#ffffff','#cfefff','#ffe8f4'];
 for(let i=0;i<(b.k==='pearl'?14:40);i++){const an=Math.random()*6.283,sp=40+Math.random()*(b.k==='pearl'?80:200);AQ6.fx.push({x:b.x,y:b.y,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:.7+Math.random()*.5,c:cols[i%cols.length]})}
 AQ6.fx.push({txt:`+🪙${g.toLocaleString()}`,x:b.x,y:b.y-10,vy:-36,l:1.4,big:b.k!=='pearl'});
 if(b.k==='legend'){bigText('🌈 전설 진주!!',`🪙${g.toLocaleString()} · 수족관 대박`,'#ff7ad9');SFX.legend&&SFX.legend();vib&&vib([30,40,30,40,80])}
 else if(b.k==='gold'){toast(`✨ 황금 진주! 🪙${g.toLocaleString()}`,1100);SFX.rare&&SFX.rare();vib&&vib([25,30,40])}else{SFX.coin&&SFX.coin()}
 persist();hud();const ag=$('aqGold');if(ag)ag.textContent='🪙 '+save.gold.toLocaleString()}
{const _da=drawAq;drawAq=function(t,dt){_da.apply(this,arguments);if(!$('aq').classList.contains('on'))return;const c=$('aqc'),w=c.width/DPR,h=c.height/DPR,g=c.getContext('2d');g.save();g.setTransform(DPR,0,0,DPR,0,0);
 // 일렁이는 물빛
 if(!LOWGFX){g.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const x=(i/7*w+Math.sin(t*.35+i*1.7)*w*.12+w)%w,y=h*(.08+((i*37)%30)/100)+Math.sin(t*.6+i)*8,rr=w*(.1+((i*13)%7)/60);const gr=g.createRadialGradient(x,y,0,x,y,rr);gr.addColorStop(0,'rgba(190,240,255,.11)');gr.addColorStop(1,'rgba(190,240,255,0)');g.fillStyle=gr;g.beginPath();g.ellipse(x,y,rr,rr*.45,Math.sin(t*.2+i)*.4,0,7);g.fill()}}
 // 영웅 이상 오라 · 전설 이상 반짝이 꼬리
 g.globalCompositeOperation='lighter';for(const a of AQX.fish){const r=a.f.r;if(r<4)continue;const L=Math.min(110,aqL(a.f)*.7),pu=.75+.25*Math.sin(t*3+a.seed),rr=L*(.55+r*.05)*pu,col=r>=6?'255,140,230':r>=5?'255,210,90':'190,140,255';
  const gr=g.createRadialGradient(a.x,a.y,0,a.x,a.y,rr);gr.addColorStop(0,`rgba(${col},.32)`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.beginPath();g.arc(a.x,a.y,rr,0,7);g.fill();
  if(r>=5&&Math.random()<dt*14)AQ6.fx.push({x:a.x-a.dir*L*.4,y:a.y+(Math.random()-.5)*L*.3,vx:-a.dir*10,vy:-6,l:.8,c:r>=6?'#ffb0f0':'#ffe680',s:1})}
 g.globalCompositeOperation='source-over';
 // 보물 방울
 AQ6.next-=dt;if(AQ6.next<=0){AQ6.next=rnd(18,40);if(AQ6.bub.length<3)aqSpawnBub(w,h)}
 AQ6.bub=AQ6.bub.filter(b=>{b.t+=dt;b.y+=b.vy*dt;b.x+=Math.sin(t*2+b.ph)*.4;const R=b.k==='pearl'?11:14,pul=1+.08*Math.sin(t*6+b.ph);
  const gl=g.createRadialGradient(b.x,b.y,0,b.x,b.y,R*2.4);gl.addColorStop(0,b.k==='legend'?`hsla(${(t*160)%360},100%,75%,.55)`:b.k==='gold'?'rgba(255,215,80,.5)':'rgba(255,255,255,.35)');gl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gl;g.beginPath();g.arc(b.x,b.y,R*2.4,0,7);g.fill();
  const pg=g.createRadialGradient(b.x-R*.35,b.y-R*.35,1,b.x,b.y,R*pul);pg.addColorStop(0,'#fff');pg.addColorStop(.6,b.k==='legend'?`hsl(${(t*160+120)%360},90%,72%)`:b.k==='gold'?'#ffd34a':'#e8f6ff');pg.addColorStop(1,b.k==='gold'?'#c98a10':b.k==='legend'?'#a050ff':'#9cc8e8');
  g.fillStyle=pg;g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=1.5;g.beginPath();g.arc(b.x,b.y,R*pul,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.ellipse(b.x-R*.35,b.y-R*.4,R*.28,R*.16,-.6,0,7);g.fill();
  return b.y>-R&&!b.done});
 // 반짝이·글자
 AQ6.fx=AQ6.fx.filter(p=>{p.l-=dt;if(p.txt){p.y+=p.vy*dt;g.globalAlpha=Math.max(0,Math.min(1,p.l));g.font=`${p.big?22:16}px ${FONT}`;g.textAlign='center';g.lineWidth=4;g.strokeStyle='#3b2a1a';g.strokeText(p.txt,p.x,p.y);g.fillStyle=p.big?'#ffe066':'#fff';g.fillText(p.txt,p.x,p.y);g.textAlign='left';g.globalAlpha=1;return p.l>0}
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.94;p.vy=p.vy*.94+(p.s?-4:20)*dt;g.globalAlpha=Math.max(0,p.l);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.s?1.6:2.4,0,7);g.fill();g.globalAlpha=1;return p.l>0});
 // 이름표
 if(AQ6.tag){const a=AQX.fish.find(x=>x.id===AQ6.tag.id);AQ6.tag.l-=dt;if(a&&AQ6.tag.l>0){const tx=`${a.f.n} ${'★'.repeat(a.f.r)}`;g.font=`14px ${FONT}`;const tw=g.measureText(tx).width+16,x=Math.max(4,Math.min(w-tw-4,a.x-tw/2)),y=Math.max(4,a.y-Math.min(110,aqL(a.f)*.7)*.45-30);
  g.globalAlpha=Math.min(1,AQ6.tag.l*2);g.fillStyle='rgba(255,247,232,.95)';g.strokeStyle=RAR[a.f.r].c;g.lineWidth=2.5;g.beginPath();g.roundRect(x,y,tw,24,10);g.fill();g.stroke();g.fillStyle='#3b2a1a';g.fillText(tx,x+8,y+17);g.globalAlpha=1}else AQ6.tag=null}
 g.restore()}}
$('aqc').addEventListener('pointerdown',e=>{const r=$('aqc').getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
 const b=AQ6.bub.find(b=>!b.done&&Math.hypot(b.x-x,b.y-y)<(b.k==='pearl'?24:28));if(b){b.done=1;aqPopBub(b);return}
 let best=null,bd=1e9;for(const a of AQX.fish){const d=Math.hypot(a.x-x,a.y-y),L=Math.min(110,aqL(a.f)*.7);if(d<Math.max(24,L*.6)&&d<bd){bd=d;best=a}}if(best){AQ6.tag={id:best.id,l:2.2};best.joy=1.2;SFX.click&&SFX.click()}});
if(TEST)Object.defineProperties(window.__w,{aqSetBonus:{value:()=>aqSetBonus()},aqRateNow:{value:()=>aqRate()},AQ6:{get(){return AQ6}},aqSpawnBub:{value:()=>{const c=$('aqc');aqSpawnBub(c.width/DPR,c.height/DPR)}},aqPopFirst:{value:()=>{const b=AQ6.bub[0];if(b){b.done=1;aqPopBub(b);return b.k}return null}},aqPbLeft:{value:()=>aqPbLeft()}});

/* ---- 4.28 더 화려하게: 특별 전시대·신화 연출·떠다니는 빛가루·거품 기둥·쇼타임 ---- */
function aqStand(g,a,px,by,sw,t){const r=a.f.r,col=r>=6?`hsl(${(t*60)%360},90%,70%)`:r>=5?'#ffd23f':'#c8a0ff';
 // 위에서 내려오는 빛기둥
 const lg=g.createLinearGradient(0,0,0,by);lg.addColorStop(0,r>=6?`hsla(${(t*60)%360},100%,80%,.28)`:'rgba(255,230,140,.26)');lg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=lg;g.beginPath();g.moveTo(px-sw*.22,0);g.lineTo(px+sw*.22,0);g.lineTo(px+sw*.75,by);g.lineTo(px-sw*.75,by);g.fill();
 // 받침대(대리석 + 금테)
 const h=18,x=px-sw/2,y=by-h;const mg=g.createLinearGradient(0,y,0,by);mg.addColorStop(0,'#fff8ec');mg.addColorStop(1,'#d8c8b0');g.fillStyle=mg;g.strokeStyle='#3b2a1a';g.lineWidth=2;g.beginPath();g.roundRect(x,y,sw,h,5);g.fill();g.stroke();
 g.fillStyle='#e8b830';g.fillRect(x+3,y+2,sw-6,3);g.fillStyle=col;for(const k of[-1,1]){g.beginPath();g.arc(px+k*(sw/2-9),y+11,3.2,0,7);g.fill()}
 g.font=`bold ${sw<70?10:11}px ${FONT}`;g.textAlign='center';g.fillStyle=r>=6?'#c0308a':r>=5?'#9a6a00':'#6a40b0';g.fillText(a.f.n,px,by-4);g.textAlign='left';
 // 위로 올라가는 반짝이
 for(let i=0;i<4;i++){const ph=(t*.5+i*.25+px*.01)%1,yy=by-h-ph*70,xx=px+Math.sin(t*2+i*1.7)*sw*.3;g.globalAlpha=1-ph;g.fillStyle=r>=6?`hsl(${(t*90+i*80)%360},100%,75%)`:'#fff6c0';g.beginPath();g.arc(xx,yy,1.8,0,7);g.fill()}g.globalAlpha=1}
const AQ7={mote:[],show:0,next:rnd(40,70),sh:[]};for(let i=0;i<26;i++)AQ7.mote.push({x:Math.random(),y:Math.random(),s:Math.random(),p:Math.random()*6.28});
{const _da=drawAq;drawAq=function(t,dt){_da.apply(this,arguments);if(!$('aq').classList.contains('on'))return;const c=$('aqc'),w=c.width/DPR,h=c.height/DPR,g=c.getContext('2d');g.save();g.setTransform(DPR,0,0,DPR,0,0);
 // 떠다니는 빛가루
 if(!LOWGFX)for(const m of AQ7.mote){const x=((m.x*w+t*(4+m.s*6)+Math.sin(t*.5+m.p)*14)%w+w)%w,y=((m.y*h-t*(3+m.s*5))%h+h)%h,a=.25+.35*Math.sin(t*1.7+m.p);g.fillStyle=`rgba(255,255,230,${Math.max(0,a)})`;g.beginPath();g.arc(x,y,.8+m.s*1.4,0,7);g.fill()}
 // 바닥 거품 기둥 2개
 for(const vx of[.14,.86])for(let i=0;i<7;i++){const ph=(t*.45+i/7)%1,y=h*.92-ph*h*.85,x=w*vx+Math.sin(t*2.5+i*1.3)*6;g.strokeStyle=`rgba(255,255,255,${.75*(1-ph)})`;g.lineWidth=1.2;g.beginPath();g.arc(x,y,1.5+ph*3.5,0,7);g.stroke()}
 // 신화(★6 이상): 주위를 도는 별
 for(const a of AQX.fish){if(a.f.r<6)continue;const L=Math.min(110,aqL(a.f)*.7);for(let k=0;k<4;k++){const an=t*2.2+k*1.571,x=a.x+Math.cos(an)*L*.6,y=a.y+Math.sin(an)*L*.28;g.fillStyle=`hsl(${(t*120+k*90)%360},100%,78%)`;g.beginPath();for(let j=0;j<5;j++){const aa=j*1.2566-1.5708,rr=j%1?2:4.2;g.lineTo(x+Math.cos(aa)*rr,y+Math.sin(aa)*rr);g.lineTo(x+Math.cos(aa+.628)*1.8,y+Math.sin(aa+.628)*1.8)}g.closePath();g.fill()}}
 // 가장자리 어둡게(깊이감)
 const vg=g.createRadialGradient(w/2,h*.45,Math.min(w,h)*.35,w/2,h*.45,Math.max(w,h)*.75);vg.addColorStop(0,'rgba(0,20,40,0)');vg.addColorStop(1,'rgba(0,20,40,.28)');g.fillStyle=vg;g.fillRect(0,0,w,h);
 // 쇼타임: 40~70초마다 4초 동안 불꽃 + 보물 방울 2개
 if(AQX.fish.length>=3){AQ7.next-=dt;if(AQ7.next<=0&&AQ7.show<=0){AQ7.show=4;AQ7.next=rnd(45,75);for(let k=0;k<2&&AQ6.bub.length<4;k++)aqSpawnBub(w,h);SFX.reward&&SFX.reward(2);vib&&vib([20,30,20])}}
 if(AQ7.show>0){AQ7.show-=dt;if(Math.random()<dt*5){const x=rnd(w*.15,w*.85),y=rnd(h*.12,h*.5),hue=Math.random()*360;for(let i=0;i<22;i++){const an=i/22*6.283,sp=rnd(50,90);AQ7.sh.push({x,y,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:.9,c:`hsl(${(hue+i*8)%360},100%,72%)`})}}
  const a=Math.min(1,AQ7.show,4-AQ7.show);g.globalAlpha=a;g.font=`bold 20px ${FONT}`;g.textAlign='center';g.lineWidth=5;g.strokeStyle='#3b2a1a';g.strokeText('🎆 수족관 쇼타임!',w/2,30);g.fillStyle='#ffe066';g.fillText('🎆 수족관 쇼타임!',w/2,30);g.textAlign='left';g.globalAlpha=1}
 g.globalCompositeOperation='lighter';AQ7.sh=AQ7.sh.filter(p=>{p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=30*dt;p.vx*=.97;g.globalAlpha=Math.max(0,p.l);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,2,0,7);g.fill();return p.l>0});g.globalAlpha=1;g.globalCompositeOperation='source-over';
 g.restore()}}
if(TEST)Object.defineProperties(window.__w,{AQ7:{get(){return AQ7}},aqFish:{value:()=>AQX.fish}});
