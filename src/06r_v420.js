/* ================= 4.20 영웅 이상 상향 · 난이도 · 펫 대기 모션 · 낚싯배 자연스럽게 · 펫 선물 =================
 ① 난이도: 영웅(★4) 이상은 장력이 20% 더 빨리 오르고 저항이 1.25배 자주 · 빨간 칸 위기 쿨다운 1.2→0.9초 (보상은 01_data·06_game에서 상향)
 ② 낚싯배(먼바다·심해·달빛 바다): 캐릭터가 난간 위가 아니라 갑판 안에 서 있게 — 발을 조금 내리고 배 앞면을 캐릭터 위에 한 번 더 그려 다리가 가려지게
 ③ 펫 대기 모션: 고양이(낮잠·기지개·나비 쫓기·털 고르기·두리번·깡충), 펭귄(뒤뚱 걷기·배 미끄럼·날개 파닥·낮잠·생선 간식),
    갈매기(깃털 고르기·두리번·콕콕·낮잠·깡충), 수달(데굴 구르기·조개 톡톡·잠수·손 흔들기)
 ④ 펫 선물: 대기 중 가끔(약 1분 30초마다) 데려간 펫이 선물을 물어 옴 — 골드 조금, 드물게 황금 미끼 */
// ① 난이도
const _fi420=fight;fight=function(dt,g){const t0=fg.ten;_fi420(dt,g);if(S!=='fight'||!fish||fish.r<4||fg.clutch>0||fg.final>0)return;
 const d=fg.ten-t0;if(d>0)fg.ten=Math.min(104,fg.ten+d*.2);if(!fg.boss&&fg.surge<=0&&fg.charge<=0)fg.next-=dt*.25};
const _ct420=clutchTap;clutchTap=function(){_ct420();if(fg&&fg.redCd)fg.redCd=Math.min(fg.redCd,T+.9)};
// ② 낚싯배
const BOAT_SINK=.13;
const _G420=G;G=function(){const g=_G420();if(curLoc().plat==='boat'){g.deck=g.platY;g.platY+=g.ch*BOAT_SINK}return g};
const _db420=drawBoat;drawBoat=function(g,t){if(g.deck==null)return _db420(g,t);_db420(Object.assign({},g,{platY:g.deck}),t)};
function boatFront(g){const b=save.wear.boat,bk='c_boat_'+b,im=IPI[bk];if(!ipOk(bk)||g.deck==null)return;const y=g.deck,e=g.edge,dy={basic:.56,duck:.6,yacht:.8,whaleboat:.55}[b]||.55,asp=im.naturalHeight/im.naturalWidth;
 let w=e+60,h=w*asp;const need=(g.surf+16+g.bb-y)/(1-dy);if(h<need){h=need;w=h/asp}const x0=(e+30)-w,y0=y-h*dy,cut=y+g.ch*.02;
 ctx.save();ctx.beginPath();ctx.rect(0,cut,W,H);ctx.clip();ctx.imageSmoothingQuality='high';ctx.drawImage(im,x0,y0,w,h);ctx.restore()}
// ③ 펫 대기 모션
const PA={a:'idle',t:0,d:2,dir:1,gT:60+Math.random()*40};
const PACT={cat:['idle','nap','stretch','butterfly','groom','look','hop'],penguin:['idle','waddle','slide','flap','nap','snack'],seagull:['idle','preen','look','peck','nap','hop'],otter:['idle','roll','shell','dive','wave']};
const PDUR={idle:2.2,nap:5,stretch:1.6,butterfly:4,groom:2.4,look:1.6,hop:1.1,waddle:3,slide:2.2,flap:1.4,snack:2.2,preen:2.2,peck:1.8,roll:1.6,shell:2.6,dive:2.4,wave:1.6};
function petAct(p,dt){PA.t+=dt;if(PA.t>=PA.d){const L=PACT[p]||['idle'],prev=PA.a;let a='idle';if(prev==='idle'){a=L[1+Math.floor(Math.random()*(L.length-1))]}PA.a=a;PA.t=0;PA.d=PDUR[a]*(a==='idle'?.6+Math.random():1);if(a==='look')PA.dir*=-1}return PA.a}
function petTx(p,a,u,ch){  // u: 0~1 진행 → 그릴 때 변형
 const o={dx:0,dy:0,rot:0,sx:1,sy:1,fr:0,fx:null,flip:PA.dir<0};const s=Math.sin(u*Math.PI);
 if(a==='nap'){o.sy=.86+.03*Math.sin(u*20);o.sx=1.08;o.fx='z'}
 else if(a==='stretch'){o.sx=1+.22*s;o.sy=1-.14*s}
 else if(a==='butterfly'){o.dy=-Math.abs(Math.sin(u*Math.PI*4))*ch*.08;o.flip=Math.sin(u*Math.PI*3)<0;o.fx='bf'}
 else if(a==='groom'){o.rot=Math.sin(u*30)*.12;o.fr=2}
 else if(a==='hop'||a==='flap'){o.dy=-s*ch*.14;o.fr=2;if(a==='flap')o.sx=1+.12*Math.sin(u*40)}
 else if(a==='waddle'){o.dx=Math.sin(u*Math.PI*2)*ch*.12;o.rot=Math.sin(u*Math.PI*12)*.14;o.flip=Math.cos(u*Math.PI*2)<0}
 else if(a==='slide'){const k=u<.2?u/.2:u>.8?(1-u)/.2:1;o.rot=-1.35*k;o.dx=(u-.5)*ch*.3*k;o.dy=ch*.05*k}
 else if(a==='snack'){o.dy=-s*ch*.04;o.fx='fish';o.fr=2}
 else if(a==='preen'){o.rot=-.25*s+Math.sin(u*25)*.05}
 else if(a==='peck'){o.rot=Math.max(0,Math.sin(u*Math.PI*6))*.4;o.dy=Math.max(0,Math.sin(u*Math.PI*6))*ch*.02}
 else if(a==='roll'){o.rot=u*Math.PI*2}
 else if(a==='shell'){o.dy=-Math.abs(Math.sin(u*Math.PI*8))*ch*.02;o.fx='shell'}
 else if(a==='dive'){o.dy=s*ch*.35;o.fx='bub'}
 else if(a==='wave'){o.rot=Math.sin(u*Math.PI*6)*.15;o.fr=2}
 else o.sy=1+.025*Math.sin(u*8);
 return o}
const _dp420=drawPet;drawPet=function(g,t){
 const p=save.pet;if(g.deck!=null){const g2=Object.assign({},g,{platY:g.deck+g.ch*.05});if(p&&p!=='otter')return petIdle(g2,t,p)||(_dp420(g2,t),boatFront(g));boatFront(g);return _dp420(g,t)}
 if(!petIdle(g,t,p))_dp420(g,t)};
function petIdle(g,t,p){const idle=['ready','rest','wait','cast','charge'].includes(S)&&!(PETJOY>0)&&p&&['cat','penguin','seagull','otter'].includes(p);
 if(!idle||(p==='seagull'&&school)){PA.a='idle';PA.t=0;return false}
 const a=petAct(p,DOLLDT),u=Math.min(1,PA.t/PA.d),ch=g.ch,y=g.platY,o=petTx(p,a,u,ch);let x,yy,hgt,key;
 if(p==='cat'||p==='penguin'){x=Math.min(g.edge-ch*.12,g.cx+ch*.47);yy=y+1;hgt=ch*(p==='cat'?.34:.36);PETPOS={x,y:y-ch*.15,r:ch*.22}}
 else if(p==='seagull'){x=g.edge+ch*(save.decoOn.moonlamp?.7:.17);yy=y-ch*.04;hgt=ch*.26;if(curLoc().plat!=='boat'){const pw=ch*.07,pg=ctx.createLinearGradient(x-pw/2,0,x+pw/2,0);pg.addColorStop(0,'#8e5e36');pg.addColorStop(.5,'#b07a48');pg.addColorStop(1,'#6e4628');ctx.fillStyle=pg;ctx.fillRect(x-pw/2,yy,pw,g.surf-yy+12)}PETPOS={x,y:yy-ch*.12,r:ch*.18}}
 else{x=g.edge+ch*.32+Math.sin(t*.6)*10;yy=g.surf+Math.sin(t*2)*2+ch*.16;hgt=ch*.4;PETPOS={x,y:yy-ch*.22,r:ch*.2}}
 key='p_'+p+'_'+(o.fr===2?2:(p==='seagull'?1:0));if(!ipOk(key))key='p_'+p+'_0';if(!ipOk(key))return false;
 ctx.save();if(p==='otter'){ctx.beginPath();ctx.rect(0,0,W,g.surf+ch*.06);ctx.clip()}
 ctx.translate(x+o.dx,yy+o.dy-hgt*.45);ctx.rotate(o.rot);ctx.scale(o.sx*(o.flip?-1:1),o.sy);ipDraw(ctx,key,0,hgt*.45,hgt,.5,1);ctx.restore();
 if(p==='otter'){ctx.save();ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,g.surf+Math.sin(t*2)*2+ch*.06,ch*.16,3,0,0,7);ctx.stroke();ctx.restore()}
 if(g.deck!=null)boatFront(g);
 // 효과
 const top=yy+o.dy-hgt;
 if(o.fx==='z'){for(let i=0;i<3;i++){const k=((t*.6+i/3)%1);txt('z',x+hgt*.25+k*16,top-k*26,10+k*8,`rgba(255,255,255,${1-k})`)}}
 else if(o.fx==='bf'){const bx=x+Math.cos(t*2.3)*hgt*.7,by=top-hgt*.2+Math.sin(t*3.1)*hgt*.3;txt('🦋',bx,by,16)}
 else if(o.fx==='fish'&&u<.7){txt('🐟',x,top-6-u*10,15)}
 else if(o.fx==='shell'){txt('🐚',x,top+hgt*.35,14)}
 else if(o.fx==='bub'&&Math.random()<.3)parts.push({x:x+rnd(-8,8),y:g.surf+10,vx:0,vy:-30,l:.6,t:0,c:'rgba(255,255,255,.8)',r:2,g:-.2});
 if(S==='ready'){const v=(save.petLove||{})[p],d=new Date().toLocaleDateString('sv');if(!v||v.d!==d||v.n===0){const bx=PETPOS.x+ch*.1,by=PETPOS.y-ch*.28+Math.sin(t*3)*3;ctx.fillStyle='#fff';ctx.strokeStyle='#3b2a1a';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(bx-11,by-11,22,18,7);ctx.fill();ctx.stroke();ctx.fillStyle='#ff5a8a';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('♥',bx,by+2)}}
 return true}
// ④ 펫 선물
const GIFTS={cat:['🐟 작은 생선','🧶 털실 뭉치'],penguin:['🐟 멸치 한 마리','❄️ 반짝 얼음'],seagull:['🐚 조개껍데기','🪶 깃털'],otter:['🐚 예쁜 조개','🪨 반질반질 돌']};
const _up420=update;update=function(dt){_up420(dt);if(S!=='ready'||!save.pet||!inGame())return;PA.gT-=dt;if(PA.gT>0)return;PA.gT=80+Math.random()*40;
 const p=save.pet,lv=petLv(p),gold=Math.round(20+Math.random()*40*(1+lv*.3)),gb=Math.random()<.04+lv*.01,it=(GIFTS[p]||['🎁 선물'])[Math.random()*2|0];
 save.gold+=gold;if(gb)save.goldB=(save.goldB||0)+1;save.st.petGift=(save.st.petGift||0)+1;persist();hud();PETJOY=1.4;
 notice(`🎁 ${PETS.find(x=>x.id===p).n}가 ${it}을(를) 물어 왔어요! +${gold}${gb?' · ✨황금 미끼':''}`);if(typeof react==='function')react('pet_love',1,.5);if(PETPOS)sparkle(PETPOS.x,PETPOS.y,12,['#ffd23f','#fff','#ff9ad8'])};
if(TEST)Object.defineProperties(window.__w,{PA:{get(){return PA}},petTx:{value:petTx},G:{value:()=>G()}});
