/* ================= 4.0 물고기 일러스트 엔진 =================
 종마다 체형·머리/입·눈·지느러미·꼬리·무늬·특징을 따로 지정(FSPEC)하고,
 그라데이션 명암·비늘·지느러미살·하이라이트를 그린 정지 그림을 캐시한 뒤
 세로 띠로 잘라 몸통 물결(유영)을 주고, 눈 깜빡임·가슴지느러미는 매 프레임 그린다. */
const FPRE={std:[.55,.22,.55,.5,.42],deep:[.5,.2,.5,.56,.6],disc:[.5,.26,.45,.5,.85],torp:[.45,.1,.62,.5,.36],long:[.5,.25,1.1,.5,.16],carp:[.5,.28,.4,.56,.45],chunky:[.66,.26,.32,.55,.44],tiny:[.55,.3,.45,.5,.5],bass:[.58,.24,.5,.55,.38],slim:[.5,.2,.72,.5,.26],shark:[.4,.14,.3,.5,.34]};
// id: [체형, 높이비, 무늬, 등지느러미, 꼬리, 입, 눈크기, 특징, 색(등,옆,배,지느러미,홍채)]
const FSPEC={
 goby:['chunky',.36,'spots:#5a4026','double','round','wide',1.25,'eyetop','#7a5e3a,#c9a56c,#f3e6c8,#d9b77a,#3a2a1a'],
 jeoneo:['deep',.44,'dotrows,gillspot','low','deep','small',1,'','#3e6e8e,#b8d4ea,#f4f8fc,#9ab8d0,#2a2a3a'],
 mackerel:['torp',.3,'waves','double','deep','small',1,'finlets','#1f5a6e,#7fb4c4,#f2f6f8,#6e9aaa,#1a1a26'],
 noraemi:['std',.32,'mottle:#6a4a2a','long','trunc','pout',1,'','#5a5a32,#a58a52,#e8dcc0,#9a7a48,#3a2a1a'],
 clown:['tiny',.52,'clown','double','round','small',1.2,'finedge','#d8501a,#ff7a2a,#ffb070,#ff7a2a,#2a1a10'],
 rockfish:['bass',.42,'vbars:5:.22','spiky','trunc','wide',1.4,'','#8a3a2a,#c8664a,#f0c8b0,#b85a40,#d8a020'],
 ssom:['chunky',.44,'mottle:#7a1a14,spots:#f6c0a0','spiky','round','wide',1.15,'cheekspine','#9a2a20,#d8503a,#f8c0a8,#c8402e,#e0b020'],
 bengeo:['deep',.5,'scales:.5','long','fork','pout',1,'','#1a2230,#34425a,#6a7890,#2a3448,#3a7ad0'],
 gamseong:['deep',.52,'vbars:6:.16,scales:.35','spiky','fork','lips',1.05,'','#3a4250,#9aa4b0,#e8ecf0,#4a5260,#d8a020'],
 dolddom:['deep',.58,'vbars:7:.85','spiky','trunc','beak',1,'','#2a2a32,#d8dce0,#f4f4f2,#4a4a52,#2a2a2a'],
 jeongang:['torp',.32,'scute,lateral','double','deep','small',1.15,'','#4a7a6a,#b8c8b0,#f2f0e0,#c8b860,#1a1a20'],
 samchi:['slim',.22,'spotrows','double','deep','teeth',.9,'finlets','#2a5a8a,#a8c0d8,#f4f6fa,#6a88a8,#1a1a26'],
 chamdom:['deep',.5,'bluedots,scales:.4','spiky','fork','lips',1.05,'gloss','#d8506a,#ff8aa0,#fde8ec,#f07a90,#e0a020'],
 bangeo:['torp',.3,'yline','long','deep','small',1,'','#2a4a7a,#9ab8d0,#f4f6f8,#e8c040,#1a1a26'],
 mahi:['mahi',.38,'bluedots,irid','long','deep','small',1,'blunt','#1a7a6a,#5ac88a,#f4e060,#2aa8a0,#1a1a20'],
 tuna:['torp',.36,'tuna','finlets','lunate','small',.85,'finlets,keel','#14204a,#5a6e9a,#e8ecf4,#3a4a7a,#1a1a20'],
 whale:['shark',.3,'wspots','shark','shark','flat',.7,'gillslits','#3a5a7a,#5a7a9a,#e8eef4,#3a5a7a,#1a1a20'],
 gold:['deep',.5,'scales:.6,bluedots','spiky','fork','lips',1.05,'gloss','#c08010,#ffcf3a,#fff4c0,#f0a800,#a04a00'],
 rainbow:['deep',.5,'rainbow,scales:.5','spiky','fork','lips',1.05,'gloss','#d8506a,#ff8aa0,#fde8ec,#c080ff,#e0a020'],
 ureok:['chunky',.44,'mottle:#14141a,vbars:4:.3','spiky','trunc','wide',1.2,'','#26262e,#5a5a66,#a8a8b0,#3a3a44,#d0a030'],
 nongeo:['bass',.3,'spots:#1a1a20:small','double','trunc','wide',1,'','#4a5a6a,#b0bcc8,#f2f4f6,#8a98a8,#d8a020'],
 busiri:['torp',.28,'yline','long','deep','small',1,'','#2a4a72,#a0bcd2,#f4f6f8,#f0c838,#1a1a26'],
 hwangdara:['torp',.34,'yband','sickle','lunate','small',.85,'finlets,keel','#1a2a5a,#8aa0c8,#eef2f8,#f6d030,#1a1a20'],
 gadara:['torp',.38,'bellystripes','finlets','lunate','small',.9,'finlets,keel','#1a2a4a,#6a7e9a,#eef2f6,#3a4a6a,#1a1a20'],
 nolraegi:['std',.32,'scribble','long','round','lips',1.05,'','#2a8a5a,#6ad08a,#e8f8d0,#40a870,#c04020'],
 hakgong:['long',.12,'lateral:#4a7ac8','low','fork','halfbeak',1,'','#3a6a9a,#c8d8e8,#f8fafc,#8ab0d0,#1a1a26'],
 seongdae:['chunky',.36,'spots:#8a1a10:small','double','fork','under',1.1,'gurnard','#a82a20,#e8604a,#fbd0c0,#3a7ad0,#e0a020'],
 jogi:['std',.34,'scales:.35','long','pointed','small',1.05,'redlip','#8a8a7a,#d8c060,#f8e070,#e8c040,#2a2a1a'],
 byeongeo:['disc',.72,'scales:.25,sheen','sickle','deep','tiny',1,'nopelvic','#8a9aa8,#d8e0e8,#f8fafc,#b0bcc8,#2a2a30'],
 nalchi:['torp',.26,'lateral:#3a6ab0','low','flyfork','small',1.05,'flywings','#1f4a8a,#8ab0d8,#f4f8fc,#9ac0e8,#1a1a26'],
 bungeo:['carp',.46,'scales:.8','long','fork','small',1,'','#6a6a3a,#c8b064,#f0e4b8,#a08a4a,#c8a020'],
 ingeo:['carp',.42,'scales:.9','long','fork','small',.95,'barbel','#5a4a2a,#c89048,#f0d8a0,#b07a3a,#c88020'],
 hyangeo:['carp',.44,'mirror','long','fork','small',.95,'barbel','#4a5a4a,#90a088,#e0e4d8,#7a8a70,#c88020'],
 sogari:['bass',.38,'leopard','spiky','round','wide',1.05,'','#6a5a2a,#d8c070,#f4ecc8,#b8a050,#d8a020'],
 bass:['bass',.34,'bassline','double','trunc','bigmouth',1,'','#3a5a2a,#90b060,#f0f4d8,#7a9a50,#c04020'],
 bluegill:['deep',.6,'vbars:6:.18','spiky','trunc','small',1.05,'earflap,orangebelly','#3a4a5a,#7a90a0,#f0b070,#6a7a8a,#2a2a2a'],
 trout:['std',.3,'pinkstripe,spots:#2a2a20:small','norm','trunc','small',1,'adipose','#4a6a5a,#b8c8b8,#f4f2ec,#a0a890,#2a2a1a'],
 sancheon:['std',.3,'parr,spots:#2a2a20:small','norm','trunc','small',1.05,'adipose','#4a5a6a,#b0bccc,#f4f4f6,#9aa4b0,#2a2a1a'],
 pirami:['slim',.28,'vbars:8:.12,lateral:#5a8ad0','norm','fork','small',1,'orangefin','#5a7aa0,#c8d8e8,#f8fafc,#f0a060,#1a1a26'],
 eun:['slim',.26,'gillyellow','norm','fork','small',1,'adipose','#5a6a3a,#c8c8a0,#f4f2e0,#d8c070,#1a1a1a'],
 gamulchi:['long',.2,'snake','long','round','wide',.9,'flathead','#2a3a2a,#6a7a5a,#d8dcc8,#4a5a3a,#c0a030'],
 kkeokji:['bass',.36,'vbars:6:.3','spiky','round','wide',1.05,'opercspot','#4a3a2a,#8a6a4a,#e0ccb0,#6a5038,#c08020'],
 beodeul:['slim',.26,'lateral:#3a3020,spots:#4a3a2a:small','norm','fork','small',1,'','#5a5030,#a89870,#ece4cc,#90805a,#2a2a1a'],
 goldfish:['tiny',.6,'scales:.5','tall','veil','small',1.35,'','#e0401a,#ff7a30,#ffc890,#ff8a40,#2a1a10'],
 napjaru:['deep',.46,'irid,pinkstripe','long','fork','small',1.05,'redanal','#5a6a8a,#c0b8d8,#f4eef8,#e06080,#2a2a30'],
 butterfly:['disc',.78,'eyestripe,eyespot','long','trunc','snout',1,'','#e0b010,#ffe040,#fff6b0,#ffd020,#1a1a1a'],
 angel:['disc',.95,'angelbars','sail','filament','small',1,'tallanal','#8a8a90,#e0e4e8,#f8fafc,#b0b4b8,#c03020'],
 bluetang:['disc',.66,'tang','long','trunc','small',1.1,'yellowtail','#1a3a9a,#3a7af0,#8ab8ff,#2a5ad0,#1a1a26'],
 chromis:['tiny',.46,'sheen','norm','deep','small',1.15,'','#2a5ab8,#4a9af0,#b8e0ff,#3a8ae0,#1a1a26'],
 lionfish:['chunky',.5,'lionstripe','frill','round','wide',1.05,'lionfan','#8a1a14,#e85a3a,#fbe0d0,#f0a090,#d8a020'],
 parrot:['std',.42,'parrotscales','long','lunate','beak',1.05,'','#1a8a7a,#4ad0b0,#c8f4e0,#f07ab0,#c04020'],
 coel:['chunky',.38,'wspots:big','lobed','lobe','wide',.9,'lobefins','#1a2a4a,#3a5a8a,#7a90b0,#2a4a7a,#3ad0f0'],
 viper:['slim',.24,'glowdots','tallray','fork','fangs',1.2,'','#0e1424,#2a3a5a,#4a5a7a,#1a2a44,#a8f0ff'],
 glass:['std',.38,'glass','norm','fork','small',1.1,'glassbody','#a8d8e8,#d8f0f8,#f4fcff,#c8e8f4,#1a1a26'],
 bingeo:['slim',.2,'lateral:#c8d8e8,glassy','norm','fork','small',1.1,'adipose','#7a9aa8,#d8e6ec,#f8fcfe,#c0d4dc,#1a1a26'],
 capelin:['slim',.2,'lateral:#a0b8c0','norm','fork','small',1,'adipose','#3a6a5a,#b8ccc4,#f4f8f6,#90a8a0,#1a1a26'],
 char:['std',.3,'charspots','norm','trunc','small',1,'adipose,whiteedge,orangebelly','#3a4a5a,#7a8a9a,#f08a50,#e07040,#2a2a1a'],
 cod:['chunky',.34,'mottle:#6a5a3a,lateral:#f4f0e0','triple','trunc','under',1,'chinbarbel','#6a5a3a,#b8a070,#f2ecd8,#9a8458,#2a2a1a'],
 pollock:['std',.28,'mottle:#5a4a3a','triple','trunc','under',1.05,'','#5a4a3a,#b0a088,#f0ece0,#8a7a64,#2a2a1a'],
 icefish:['slim',.26,'glass','long','trunc','wide',1.3,'glassbody','#b8d8e8,#e0f0f8,#f8fcff,#d0e8f4,#1a2a3a'],
 fairy:['std',.38,'crystalfacets','norm','veil','small',1.3,'fairywings,glassbody','#a8e0ff,#d8f4ff,#ffffff,#c8ecff,#3a8ad0'],
 galaxy:['tiny',.38,'stars','norm','round','small',1.25,'','#141a40,#2a3a80,#5a6ab0,#3a4a90,#ffe080'],
 rabbit:['tiny',.55,'sheen','norm','round','small',1.25,'ears','#e8e4f4,#f8f6fc,#ffffff,#f0d8e8,#c04070'],
 crystal:['std',.4,'crystalfacets','norm','fork','small',1.15,'','#4ab8d8,#9ae8f8,#e8fcff,#8ad8f0,#1a4a6a'],
 aurora:['carp',.42,'aurora,scales:.5','long','veil','small',1.05,'barbel','#2a8a6a,#7ae0b0,#e8d8ff,#b08aff,#c04080'],
 meteorf:['torp',.32,'flame','low','deep','small',1.1,'tailstar','#c83a10,#ff9a30,#fff0a0,#ffc040,#2a1a10'],
 goldcarp:['carp',.44,'scales:1,shine','long','veil','small',1.05,'barbel,gloss','#b07a00,#ffcf3a,#fff4c0,#f0b020,#8a3a00'],
 ghost:['torp',.3,'waves,ghost','double','deep','small',1.1,'finlets,ghostbody','#6a7ab0,#c0c8f0,#f4f6ff,#a8b0e0,#7a40c0'],
 thunder:['std',.38,'zap','spiky','deep','teeth',1.1,'electric','#1a1a24,#3a3a4a,#f0e040,#f0d020,#f0e040'],
 goldking:['deep',.52,'scales:.8,bluedots','spiky','fork','lips',1.05,'gloss','#b07000,#ffcf3a,#fff4c0,#ff9a20,#c03000'],
 whaleking:['shark',.3,'wspots','shark','shark','flat',.75,'gillslits','#1a3a6a,#3a6aa8,#e0eaf6,#2a5a98,#ffd040']};
FPRE.mahi=[.74,.16,.2,.55,.38];
const FCACHE={};let FCN=0;
function shadeHex(h,k){const c=hex3(h);return`rgb(${Math.max(0,Math.min(255,c[0]*k))|0},${Math.max(0,Math.min(255,c[1]*k))|0},${Math.max(0,Math.min(255,c[2]*k))|0})`}
function mixHex(a,b,k){const A=hex3(a),B=hex3(b);return'#'+[0,1,2].map(i=>Math.round(A[i]+(B[i]-A[i])*k).toString(16).padStart(2,'0')).join('')}
function hueHex(h,deg){const c=hex3(h),[hh,s,l]=rgb2hsl(c[0],c[1],c[2]),r=hsl2rgb((hh+deg+360)%360,s,l);return'#'+r.map(v=>v.toString(16).padStart(2,'0')).join('')}
function fspec(f,v){const S=FSPEC[f.id]||['std',f.asp||.42,'','norm','fork','small',1,'',''];const P=FPRE[S[0]]||FPRE.std;
 let col=(S[8]||'').split(',');if(col.length<5)col=[shadeHex(f.c,.7),f.c,f.b,f.f,'#2a1a10'].map(x=>x.startsWith('rgb')?'#556677':x);
 col=col.map(x=>x.trim());
 const sp={sh:S[0],pk:P[0],ped:P[1],nose:P[2],tk:P[3],a:S[1]||P[4],pt:S[2]?S[2].split(','):[],do:S[3],tl:S[4],mo:S[5],ey:S[6]||1,ex:(S[7]||'').split(',').filter(Boolean),back:col[0],side:col[1],belly:col[2],fin:col[3],iris:col[4],r:f.r};
 if(v==='gold'){sp.back='#b07800';sp.side='#ffcf3a';sp.belly='#fff4c0';sp.fin='#f0b020';sp.iris='#8a3a00';sp.metal=1}
 else if(v==='albino'){sp.back='#f0d6d8';sp.side='#fbf0f0';sp.belly='#ffffff';sp.fin='#f8c8d4';sp.iris='#e0405a';sp.pale=1}
 else if(v==='mut'){for(const k of['back','side','belly','fin'])sp[k]=hueHex(sp[k],150);sp.iris='#40e070';sp.mut=1}
 if(sp.ex.includes('gloss')||f.r>=5)sp.metal=sp.metal||(f.r>=5?.6:.3);
 return sp}
// 몸통 윤곽: s 0(꼬리 자루)~1(주둥이)
function fbody(sp,Lb,H){const N=30,top=[],bot=[];for(let i=0;i<=N;i++){const s=i/N;let e;if(s<sp.pk)e=sp.ped+(1-sp.ped)*Math.pow(Math.sin(Math.PI/2*s/sp.pk),.8);else e=Math.pow(Math.max(0,Math.cos(Math.PI/2*(s-sp.pk)/(1-sp.pk))),sp.nose);
 let tt=-H*sp.tk*e,bb=H*(1-sp.tk)*Math.pow(e,.9);if(sp.ex.includes('blunt')&&s>.8){tt=-H*sp.tk*Math.max(e,.55*(1-(s-.8)/.2*.6))}
 if(sp.ex.includes('flathead')&&s>.7)tt*=.85;
 const x=-Lb/2+s*Lb;top.push([x,tt]);bot.push([x,bb])}return{top,bot}}
function fpath(c,top,bot){c.beginPath();c.moveTo(top[0][0],top[0][1]);for(let i=1;i<top.length-1;i++){const mx=(top[i][0]+top[i+1][0])/2,my=(top[i][1]+top[i+1][1])/2;c.quadraticCurveTo(top[i][0],top[i][1],mx,my)}const n=top.length-1;c.quadraticCurveTo(top[n][0]+.5,top[n][1],bot[n][0],bot[n][1]);
 for(let i=bot.length-2;i>0;i--){const mx=(bot[i][0]+bot[i-1][0])/2,my=(bot[i][1]+bot[i-1][1])/2;c.quadraticCurveTo(bot[i][0],bot[i][1],mx,my)}c.lineTo(bot[0][0],bot[0][1]);c.closePath()}
const at=(arr,s)=>{const i=Math.max(0,Math.min(arr.length-1,Math.round(s*(arr.length-1))));return arr[i]};
function finFill(c,sp,x0,y0,x1,y1,a=.92){const g=c.createLinearGradient(x0,y0,x1,y1),F=hex3(sp.fin);g.addColorStop(0,`rgba(${F[0]*.85|0},${F[1]*.85|0},${F[2]*.85|0},${a})`);g.addColorStop(1,`rgba(${Math.min(255,F[0]*1.18)|0},${Math.min(255,F[1]*1.18)|0},${Math.min(255,F[2]*1.18)|0},${a*.72})`);return g}
function finDraw(c,sp,lw,rays,base,tip){c.fillStyle=finFill(c,sp,base[0],base[1],tip[0],tip[1],sp.glassy?.45:.92);c.fill();
 if(sp.ex.includes('finedge')||sp.ex.includes('whiteedge')){c.lineWidth=lw*1.4;c.strokeStyle=sp.ex.includes('whiteedge')?'rgba(255,255,255,.95)':'#1a1a1a';c.stroke()}else{c.lineWidth=lw*.7;c.strokeStyle=shadeHex(sp.fin,.58);c.stroke()}
 c.save();c.clip();c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=lw*.45;for(const r of rays){c.beginPath();c.moveTo(r[0],r[1]);c.lineTo(r[2],r[3]);c.stroke()}const hl=c.createLinearGradient(base[0],base[1],tip[0],tip[1]);hl.addColorStop(0,'rgba(255,255,255,0)');hl.addColorStop(1,'rgba(255,255,255,.22)');c.fillStyle=hl;c.fillRect(-9999,-9999,19999,19999);c.restore();c.beginPath()}
function drawFinsBack(c,sp,B,Lb,H,lw){const{top,bot}=B,d=sp.do;
 const dorsal=(s0,s1,h,spiky,n=7,back=.25)=>{const p0=at(top,s0),p1=at(top,s1);c.beginPath();c.moveTo(p0[0],p0[1]+lw);const rays=[];if(spiky){c.lineTo(p0[0],p0[1])}
  if(spiky){const tips=[];for(let i=0;i<=n;i++){const u=i/n,p=at(top,s0+(s1-s0)*u),hh=h*(1-Math.abs(u-.3)*.85);tips.push([p,[p[0]-hh*back,p[1]-hh]])}
   for(let i=0;i<=n;i++){const[p,tp]=tips[i];if(i===0)c.lineTo(tp[0],tp[1]);else{const[pp,tq]=tips[i-1];c.quadraticCurveTo((tq[0]+tp[0])/2+h*.04,(tq[1]+tp[1])/2+h*.32,tp[0],tp[1])}}
   c.lineTo(p1[0],p1[1]+lw);c.closePath();c.fillStyle=finFill(c,sp,p0[0],p0[1],p0[0],p0[1]-h,.88);c.fill();c.lineWidth=lw*.55;c.strokeStyle=shadeHex(sp.fin,.6);c.stroke();
   c.strokeStyle=shadeHex(sp.fin,.55);c.lineWidth=lw*.75;for(const[p,tp]of tips){c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(tp[0]-(p[0]-tp[0])*.08,tp[1]-(p[1]-tp[1])*.08);c.stroke()}return}
  else{const m=at(top,s0+(s1-s0)*.35);c.quadraticCurveTo(m[0]-h*back,m[1]-h*1.25,p1[0]-h*back*.3,p1[1]-h*.15);for(let i=0;i<=6;i++){const p=at(top,s0+(s1-s0)*i/6);rays.push([p[0],p[1],p[0]-h*back,p[1]-h*(1-Math.abs(i/6-.35))])}}
  c.lineTo(p1[0],p1[1]+lw);c.closePath();finDraw(c,sp,lw,rays,p0,[p0[0],p0[1]-h])};
 const anal=(s0,s1,h,back=.25)=>{const p0=at(bot,s0),p1=at(bot,s1),m=at(bot,s0+(s1-s0)*.35);c.beginPath();c.moveTo(p0[0],p0[1]-lw);c.quadraticCurveTo(p0[0]-h*.1,p0[1]+h*.5,m[0]-h*back-h*.1,m[1]+h);c.quadraticCurveTo(p1[0]+h*.05,p1[1]+h*.9,p1[0],p1[1]-lw);c.closePath();const rays=[];for(let i=0;i<=5;i++){const p=at(bot,s0+(s1-s0)*i/5);rays.push([p[0],p[1],p[0]-h*back,p[1]+h])}finDraw(c,sp,lw,rays,p0,[p0[0],p0[1]+h])};
 if(d==='norm')dorsal(.38,.64,H*.34,0);
 else if(d==='spiky')dorsal(.3,.72,H*.42,1,8);
 else if(d==='double'){dorsal(.5,.7,H*.32,1,5);dorsal(.3,.46,H*.26,0)}
 else if(d==='triple'){dorsal(.58,.72,H*.3,0);dorsal(.4,.54,H*.28,0);dorsal(.22,.36,H*.24,0)}
 else if(d==='long')dorsal(.16,.7,H*.24,0);
 else if(d==='low')dorsal(.38,.6,H*.18,0);
 else if(d==='sail'){const p0=at(top,.3),p1=at(top,.66);c.beginPath();c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(p0[0]-H*.15,p0[1]-H*.8,p0[0]-H*.55,p0[1]-H*.7);c.quadraticCurveTo(p1[0]-H*.3,p1[1]-H*.3,p1[0],p1[1]);c.closePath();finDraw(c,sp,lw,[[p0[0],p0[1],p0[0]-H*.6,p0[1]-H*.9],[p1[0],p1[1],p0[0]-H*.5,p0[1]-H*.8]],p0,[p0[0],p0[1]-H])}
 else if(d==='sickle'){const p0=at(top,.42),p1=at(top,.62);c.beginPath();c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(p0[0]+H*.05,p0[1]-H*.6,p0[0]-H*.45,p0[1]-H*.75);c.quadraticCurveTo(p1[0]-H*.15,p1[1]-H*.3,p1[0],p1[1]);c.closePath();finDraw(c,sp,lw,[],p0,[p0[0],p0[1]-H*.7])}
 else if(d==='finlets'){dorsal(.5,.66,H*.36,1,5,.3);dorsal(.32,.42,H*.22,0)}
 else if(d==='frill'){for(let i=0;i<11;i++){const s=.28+i*.045,p=at(top,s),hh=H*(.9-Math.abs(i-4)*.06);c.beginPath();c.moveTo(p[0]-2,p[1]);c.quadraticCurveTo(p[0]-hh*.2,p[1]-hh*.6,p[0]-hh*.3,p[1]-hh);c.lineTo(p[0]+3,p[1]);c.closePath();c.fillStyle=i%2?'rgba(250,220,210,.9)':'rgba(200,60,40,.9)';c.fill();c.strokeStyle=shadeHex('#8a1a14',1);c.lineWidth=lw*.5;c.stroke()}}
 else if(d==='tallray'){dorsal(.5,.62,H*.3,0);const p=at(top,.55);c.strokeStyle=sp.fin;c.lineWidth=lw*.8;c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[0]-H*.1,p[1]-H*.9,p[0]-H*.45,p[1]-H*1.1);c.stroke();c.fillStyle='#a8f0ff';c.beginPath();c.arc(p[0]-H*.45,p[1]-H*1.1,lw*1.6,0,7);c.fill()}
 else if(d==='tall')dorsal(.4,.66,H*.6,0,7,.35);
 else if(d==='lobed'){dorsal(.55,.68,H*.3,0);dorsal(.26,.36,H*.3,0)}
 else if(d==='shark'){const p0=at(top,.46),p1=at(top,.62);c.beginPath();c.moveTo(p0[0],p0[1]+lw);c.quadraticCurveTo(p0[0]+H*.15,p0[1]-H*.7,p0[0]-H*.25,p0[1]-H*.9);c.quadraticCurveTo(p1[0]-H*.25,p1[1]-H*.2,p1[0],p1[1]+lw);c.closePath();c.fillStyle=lgradF(c,p0[0],p0[1]-H,p0[0],p0[1],sp.back);c.fill();c.lineWidth=lw;c.strokeStyle=shadeHex(sp.back,.5);c.stroke()}
 // 뒷지느러미(배쪽)
 if(d==='long'&&sp.sh!=='carp')anal(.12,.38,H*.22);else if(sp.ex.includes('tallanal')){const p0=at(bot,.3),p1=at(bot,.62);c.beginPath();c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(p0[0]-H*.15,p0[1]+H*.8,p0[0]-H*.55,p0[1]+H*.7);c.quadraticCurveTo(p1[0]-H*.3,p1[1]+H*.3,p1[0],p1[1]);c.closePath();finDraw(c,sp,lw,[],p0,[p0[0],p0[1]+H])}
 else if(d==='sickle'||sp.tl==='lunate')anal(.3,.42,H*.36,.5);else if(d!=='shark'&&d!=='frill')anal(.24,.38,H*.24);else if(d==='frill')anal(.2,.36,H*.3);
 if(sp.ex.includes('finlets')){for(let i=0;i<5;i++){const s=.06+i*.045;for(const arr of[top,bot]){const p=at(arr,s),sg=arr===top?-1:1;c.beginPath();c.moveTo(p[0]-H*.04,p[1]);c.lineTo(p[0]-H*.05,p[1]+sg*H*.1);c.lineTo(p[0]+H*.03,p[1]);c.closePath();c.fillStyle=sp.id==='tuna'||sp.ex.includes('keel')?'#f6d030':sp.fin;c.fill();c.lineWidth=lw*.4;c.strokeStyle='rgba(0,0,0,.3)';c.stroke()}}}
 if(sp.ex.includes('adipose')){const p=at(top,.18);c.beginPath();c.ellipse(p[0],p[1]-H*.04,H*.07,H*.05,-.3,Math.PI,0);c.fillStyle=sp.fin;c.fill();c.lineWidth=lw*.6;c.strokeStyle=shadeHex(sp.fin,.55);c.stroke()}}
function lgradF(c,x0,y0,x1,y1,col){const g=c.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,shadeHex(col,1.15));g.addColorStop(1,shadeHex(col,.75));return g}
function drawTail(c,sp,B,Lb,H,lw){const p=B.top[0],q=B.bot[0],x=p[0]+lw,yc=(p[1]+q[1])/2,T=sp.tl,h=H*.5,len=Lb*.26;c.save();c.translate(x,yc);let rays=[];c.beginPath();
 if(T==='fork'||T==='deep'||T==='flyfork'){const dp=T==='deep'?.55:.35,lo=T==='flyfork'?1.25:1;c.moveTo(0,-h*.25);c.quadraticCurveTo(-len*.5,-h*.5,-len,-h*1.05);c.quadraticCurveTo(-len*(1-dp)*.9,-h*.15,-len*(1-dp),0);c.quadraticCurveTo(-len*(1-dp)*.9,h*.15,-len*lo,h*1.05*lo);c.quadraticCurveTo(-len*.5,h*.5,0,h*.25);rays=[[0,0,-len,-h],[0,0,-len,h],[0,0,-len*.9,-h*.5],[0,0,-len*.9,h*.5],[0,0,-len*(1-dp),0]]}
 else if(T==='lunate'){c.moveTo(0,-h*.12);c.quadraticCurveTo(-len*.4,-h*.4,-len*1.05,-h*1.3);c.quadraticCurveTo(-len*.55,-h*.2,-len*.5,0);c.quadraticCurveTo(-len*.55,h*.2,-len*1.05,h*1.3);c.quadraticCurveTo(-len*.4,h*.4,0,h*.12);rays=[[0,0,-len,-h*1.2],[0,0,-len,h*1.2]]}
 else if(T==='shark'){c.moveTo(0,-h*.18);c.quadraticCurveTo(-len*.5,-h*.6,-len*1.15,-h*1.5);c.quadraticCurveTo(-len*.65,-h*.1,-len*.55,h*.05);c.quadraticCurveTo(-len*.6,h*.3,-len*.8,h*.9);c.quadraticCurveTo(-len*.35,h*.35,0,h*.15)}
 else if(T==='round'){c.moveTo(0,-h*.3);c.bezierCurveTo(-len*.6,-h*.9,-len*1.05,-h*.6,-len,0);c.bezierCurveTo(-len*1.05,h*.6,-len*.6,h*.9,0,h*.3);for(let i=-3;i<=3;i++)rays.push([0,0,-len*.95,i*h*.22])}
 else if(T==='trunc'){c.moveTo(0,-h*.3);c.quadraticCurveTo(-len*.5,-h*.75,-len*.85,-h*.85);c.quadraticCurveTo(-len*.78,0,-len*.85,h*.85);c.quadraticCurveTo(-len*.5,h*.75,0,h*.3);for(let i=-3;i<=3;i++)rays.push([0,0,-len*.82,i*h*.26])}
 else if(T==='pointed'){c.moveTo(0,-h*.3);c.quadraticCurveTo(-len*.6,-h*.5,-len*1.05,0);c.quadraticCurveTo(-len*.6,h*.5,0,h*.3);for(let i=-2;i<=2;i++)rays.push([0,0,-len,i*h*.12])}
 else if(T==='veil'){const L2=len*1.6;c.moveTo(0,-h*.3);c.bezierCurveTo(-L2*.4,-h*1.3,-L2*1.05,-h*1.2,-L2,-h*.25);c.quadraticCurveTo(-L2*.8,0,-L2*1.02,h*.3);c.bezierCurveTo(-L2*1.05,h*1.25,-L2*.4,h*1.35,0,h*.3);for(let i=-4;i<=4;i++)rays.push([0,0,-L2,i*h*.3])}
 else if(T==='filament'){c.moveTo(0,-h*.2);c.quadraticCurveTo(-len*.5,-h*.45,-len*1.5,-h*1.25);c.quadraticCurveTo(-len*.7,-h*.2,-len*.7,0);c.quadraticCurveTo(-len*.7,h*.2,-len*1.5,h*1.25);c.quadraticCurveTo(-len*.5,h*.45,0,h*.2)}
 else if(T==='lobe'){c.moveTo(0,-h*.3);c.quadraticCurveTo(-len*.5,-h*.95,-len*.7,-h*.7);c.quadraticCurveTo(-len*.55,-h*.15,-len*.75,-h*.12);c.quadraticCurveTo(-len*1.1,0,-len*.75,h*.12);c.quadraticCurveTo(-len*.55,h*.15,-len*.7,h*.7);c.quadraticCurveTo(-len*.5,h*.95,0,h*.3)}
 c.closePath();if(T==='shark'){c.fillStyle=lgradF(c,0,-h,0,h,sp.back);c.fill();c.lineWidth=lw;c.strokeStyle=shadeHex(sp.back,.5);c.stroke()}else finDraw(c,sp,lw,rays,[0,0],[-len,0]);
 if(sp.ex.includes('yellowtail')){c.fillStyle='#ffd020';c.fill();c.lineWidth=lw*.8;c.strokeStyle='#a08000';c.stroke()}
 c.restore()}
// 무늬(몸통 안에서 잘라 그림)
function drawPattern(c,sp,B,Lb,H,lw,id){const x0=-Lb/2,x1=Lb/2,yT=-H*sp.tk,yB=H*(1-sp.tk),rnd=(i)=>hsh(i,id.length*7.3);
 for(const P of sp.pt){const[k,a1,a2]=P.split(':');c.save();
  if(k==='spots'){const sm=a2==='small';c.fillStyle=a1||shadeHex(sp.back,.6);for(let i=0;i<(sm?46:22);i++){const x=x0+Lb*(.1+.8*rnd(i)),y=yT+H*(.08+.6*rnd(i+50));c.globalAlpha=.75;c.beginPath();c.ellipse(x,y,H*(sm?.03:.06)*(.6+rnd(i+9)),H*(sm?.025:.045),0,0,7);c.fill()}}
  else if(k==='dotrows'){c.fillStyle=shadeHex(sp.back,.55);for(let r=0;r<4;r++)for(let i=0;i<9;i++){const x=x0+Lb*(.2+i*.075),y=yT+H*(.18+r*.09);c.beginPath();c.arc(x,y,H*.018,0,7);c.fill()}}
  else if(k==='spotrows'){c.fillStyle=shadeHex(sp.back,.5);for(let r=0;r<3;r++)for(let i=0;i<14;i++){const x=x0+Lb*(.1+i*.055+r*.02),y=yT+H*(.3+r*.16);c.beginPath();c.ellipse(x,y,H*.04,H*.05,0,0,7);c.fill()}}
  else if(k==='gillspot'){c.fillStyle='#1a1a22';c.beginPath();c.arc(x0+Lb*.68,yT+H*.3,H*.06,0,7);c.fill()}
  else if(k==='waves'){c.strokeStyle=shadeHex(sp.back,.45);c.lineWidth=H*.05;for(let i=0;i<13;i++){const x=x0+Lb*(.08+i*.062);c.beginPath();c.moveTo(x,yT);for(let j=1;j<=4;j++)c.lineTo(x+(j%2?H*.05:-H*.02),yT+H*.11*j);c.stroke()}}
  else if(k==='mottle'){for(let i=0;i<34;i++){c.fillStyle=a1||shadeHex(sp.back,.6);c.globalAlpha=.25+.35*rnd(i+3);c.beginPath();c.ellipse(x0+Lb*rnd(i),yT+H*rnd(i+40)*.9,H*(.06+.08*rnd(i+70)),H*(.04+.06*rnd(i+90)),rnd(i)*3,0,7);c.fill()}}
  else if(k==='vbars'){const n=+a1||6,al=+a2||.3;c.fillStyle=`rgba(20,20,28,${al})`;for(let i=0;i<n;i++){const x=x0+Lb*(.12+.72*i/(n-1));c.beginPath();c.moveTo(x-H*.06,yT-2);c.quadraticCurveTo(x+H*.02,0,x-H*.04,yB+2);c.lineTo(x+H*.06,yB+2);c.quadraticCurveTo(x+H*.1,0,x+H*.06,yT-2);c.fill()}}
  else if(k==='scales'){const al=+a1||.4,R=H*.085;c.lineWidth=Math.max(.6,lw*.45);for(let r=0;r*R*.8<H;r++)for(let i=0;i*R<Lb*.82;i++){const x=x0+Lb*.08+i*R+(r%2)*R/2,y=yT+r*R*.8;c.strokeStyle=`rgba(255,255,255,${al*.55})`;c.beginPath();c.arc(x,y,R*.62,.2,Math.PI-.2);c.stroke();c.strokeStyle=`rgba(0,0,0,${al*.22})`;c.beginPath();c.arc(x,y+.6,R*.62,.3,Math.PI-.3);c.stroke()}}
  else if(k==='bluedots'){for(let i=0;i<30;i++){const x=x0+Lb*(.12+.76*rnd(i)),y=yT+H*(.1+.5*rnd(i+20));c.fillStyle='rgba(90,200,255,.9)';c.beginPath();c.arc(x,y,H*.022,0,7);c.fill();c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.arc(x-H*.006,y-H*.006,H*.008,0,7);c.fill()}}
  else if(k==='yline'||k==='yband'){const y=yT+H*.42,g=c.createLinearGradient(0,y-H*.06,0,y+H*.06);g.addColorStop(0,'rgba(255,220,60,0)');g.addColorStop(.5,'rgba(255,214,48,.95)');g.addColorStop(1,'rgba(255,220,60,0)');c.fillStyle=g;c.fillRect(x0,y-H*(k==='yband'?.09:.06),Lb,H*(k==='yband'?.18:.12))}
  else if(k==='lateral'){c.strokeStyle=a1||'rgba(255,255,255,.6)';c.lineWidth=H*.035;c.globalAlpha=.85;c.beginPath();c.moveTo(x0,yT+H*.48);c.quadraticCurveTo(0,yT+H*.36,x1*.75,yT+H*.38);c.stroke()}
  else if(k==='scute'){c.fillStyle='rgba(255,240,180,.7)';for(let i=0;i<14;i++){const x=x0+Lb*(.05+i*.035);c.beginPath();c.moveTo(x,yT+H*.48);c.lineTo(x+H*.04,yT+H*.43);c.lineTo(x+H*.08,yT+H*.48);c.lineTo(x+H*.04,yT+H*.53);c.fill()}}
  else if(k==='tuna'){const g=c.createLinearGradient(0,yT,0,yB);g.addColorStop(.35,'rgba(0,0,0,0)');g.addColorStop(.5,'rgba(120,170,255,.35)');g.addColorStop(.62,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x0,yT,Lb,H)}
  else if(k==='wspots'){const big=a1==='big';c.fillStyle='rgba(255,255,255,.85)';for(let r=0;r<(big?3:5);r++)for(let i=0;i<(big?7:16);i++){const x=x0+Lb*(.06+i*(big?.12:.055)+(r%2)*.02),y=yT+H*(.1+r*(big?.22:.1));if(big){c.beginPath();c.ellipse(x,y,H*.06,H*.035,rnd(i+r*9),0,7);c.fill()}else{c.beginPath();c.arc(x,y,H*.022,0,7);c.fill()}}if(!big){c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=H*.012;for(let i=0;i<14;i++){const x=x0+Lb*(.08+i*.06);c.beginPath();c.moveTo(x,yT);c.lineTo(x,yT+H*.5);c.stroke()}}}
  else if(k==='bellystripes'){c.strokeStyle='rgba(30,40,70,.6)';c.lineWidth=H*.03;for(let i=0;i<4;i++){c.beginPath();c.moveTo(x0+Lb*.1,yT+H*(.6+i*.08));c.quadraticCurveTo(0,yT+H*(.55+i*.08),x1*.7,yT+H*(.58+i*.08));c.stroke()}}
  else if(k==='scribble'){c.strokeStyle='rgba(220,60,120,.75)';c.lineWidth=H*.025;for(let i=0;i<7;i++){c.beginPath();const y=yT+H*(.15+i*.09);c.moveTo(x1*.35,y);c.bezierCurveTo(x1*.5,y-H*.06,x1*.6,y+H*.06,x1*.85,y);c.stroke()}}
  else if(k==='leopard'){for(let i=0;i<26;i++){const x=x0+Lb*(.1+.75*rnd(i)),y=yT+H*(.1+.75*rnd(i+33)),r=H*(.04+.03*rnd(i+5));c.fillStyle='rgba(30,20,10,.85)';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.fillStyle=sp.side;c.beginPath();c.arc(x,y,r*.45,0,7);c.fill()}}
  else if(k==='bassline'){c.fillStyle='rgba(30,50,20,.65)';for(let i=0;i<12;i++){const x=x0+Lb*(.1+i*.065),y=yT+H*.48+Math.sin(i*1.7)*H*.03;c.beginPath();c.ellipse(x,y,H*.07,H*.06,0,0,7);c.fill()}}
  else if(k==='pinkstripe'){const y=yT+H*.48,g=c.createLinearGradient(0,y-H*.1,0,y+H*.1);g.addColorStop(0,'rgba(255,100,150,0)');g.addColorStop(.5,'rgba(255,90,140,.7)');g.addColorStop(1,'rgba(255,100,150,0)');c.fillStyle=g;c.fillRect(x0,y-H*.1,Lb,H*.2)}
  else if(k==='parr'){c.fillStyle='rgba(50,60,90,.45)';for(let i=0;i<8;i++){c.beginPath();c.ellipse(x0+Lb*(.15+i*.085),yT+H*.48,H*.045,H*.11,0,0,7);c.fill()}}
  else if(k==='gillyellow'){c.fillStyle='rgba(255,210,40,.9)';c.beginPath();c.ellipse(x0+Lb*.64,yT+H*.45,H*.08,H*.06,0,0,7);c.fill()}
  else if(k==='snake'){c.fillStyle='rgba(20,30,15,.7)';for(let i=0;i<10;i++){const x=x0+Lb*(.08+i*.085);c.beginPath();c.ellipse(x,yT+H*.35,H*.08,H*.12,.4,0,7);c.fill();c.beginPath();c.ellipse(x+Lb*.04,yT+H*.72,H*.05,H*.07,-.3,0,7);c.fill()}}
  else if(k==='irid'||k==='sheen'){const g=c.createLinearGradient(x0,yT,x1,yB);g.addColorStop(0,'rgba(120,200,255,0)');g.addColorStop(.4,'rgba(140,220,255,.35)');g.addColorStop(.6,'rgba(255,160,220,.3)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(x0,yT,Lb,H)}
  else if(k==='clown'){for(const[u,w]of[[.25,.07],[.55,.1],[.82,.09]]){const x=x0+Lb*u;c.fillStyle='#1a1a1a';c.beginPath();c.ellipse(x,0,H*w+H*.035,H,0,0,7);c.fill();c.fillStyle='#fdfdfa';c.beginPath();c.ellipse(x,0,H*w,H,0,0,7);c.fill()}}
  else if(k==='eyestripe'){c.fillStyle='rgba(20,20,20,.9)';const x=x0+Lb*.84;c.fillRect(x-H*.06,yT,H*.12,H)}
  else if(k==='eyespot'){const x=x0+Lb*.2,y=yT+H*.35;c.fillStyle='#1a1a1a';c.beginPath();c.arc(x,y,H*.09,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=H*.02;c.stroke()}
  else if(k==='angelbars'){c.fillStyle='rgba(20,20,26,.85)';for(const u of[.3,.58,.84]){const x=x0+Lb*u;c.fillRect(x-H*.03,yT-H,H*.06,H*3)}}
  else if(k==='tang'){c.fillStyle='rgba(10,15,40,.92)';c.beginPath();c.moveTo(x1*.6,yT+H*.15);c.bezierCurveTo(0,yT-H*.05,x0*.6,yT+H*.15,x0*.9,yT+H*.55);c.bezierCurveTo(x0*.4,yT+H*.35,x0*.1,yT+H*.62,x1*.3,yT+H*.45);c.bezierCurveTo(x1*.5,yT+H*.38,x1*.7,yT+H*.3,x1*.6,yT+H*.15);c.fill()}
  else if(k==='lionstripe'){for(let i=0;i<12;i++){const x=x0+Lb*(.05+i*.08);c.fillStyle=i%2?'rgba(255,240,230,.95)':'rgba(140,30,20,.85)';c.beginPath();c.moveTo(x,yT-2);c.quadraticCurveTo(x+H*.08,0,x,yB+2);c.lineTo(x+H*.07,yB+2);c.quadraticCurveTo(x+H*.15,0,x+H*.07,yT-2);c.fill()}}
  else if(k==='parrotscales'){const R=H*.11;c.lineWidth=lw*.8;for(let r=0;r*R*.8<H;r++)for(let i=0;i*R<Lb*.8;i++){const x=x0+Lb*.08+i*R+(r%2)*R/2,y=yT+r*R*.8;c.strokeStyle='rgba(255,120,180,.75)';c.beginPath();c.arc(x,y,R*.6,.2,Math.PI-.2);c.stroke()}}
  else if(k==='glowdots'){for(let i=0;i<14;i++){const x=x0+Lb*(.1+i*.055),y=yB-H*.12;const g=c.createRadialGradient(x,y,0,x,y,H*.06);g.addColorStop(0,'#e8ffff');g.addColorStop(.4,'#6af0ff');g.addColorStop(1,'rgba(80,220,255,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,H*.06,0,7);c.fill()}}
  else if(k==='glass'){c.strokeStyle='rgba(120,150,180,.75)';c.lineWidth=lw*.8;c.beginPath();c.moveTo(x0,yT+H*.48);c.lineTo(x1*.6,yT+H*.45);c.stroke();c.lineWidth=lw*.5;for(let i=0;i<13;i++){const x=x0+Lb*(.08+i*.055);c.beginPath();c.moveTo(x,yT+H*.47);c.lineTo(x-H*.08,yT+H*.12);c.moveTo(x,yT+H*.47);c.lineTo(x-H*.08,yB-H*.15);c.stroke()}c.fillStyle='rgba(255,170,120,.35)';c.beginPath();c.ellipse(x1*.25,yT+H*.65,H*.16,H*.11,0,0,7);c.fill()}
  else if(k==='glassy'){c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x0,yT,Lb,H)}
  else if(k==='charspots'){for(let i=0;i<26;i++){const x=x0+Lb*(.1+.72*rnd(i)),y=yT+H*(.1+.5*rnd(i+11));c.fillStyle=i%3?'rgba(255,200,220,.9)':'rgba(255,140,90,.9)';c.beginPath();c.arc(x,y,H*.03,0,7);c.fill()}}
  else if(k==='crystalfacets'){c.lineWidth=lw*.6;for(let i=0;i<22;i++){const x=x0+Lb*(.05+.85*rnd(i)),y=yT+H*rnd(i+30),r=H*(.1+.12*rnd(i+60));c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r*.8,y);c.lineTo(x,y+r);c.lineTo(x-r*.8,y);c.closePath();c.fillStyle=`rgba(255,255,255,${.12+.25*rnd(i+7)})`;c.fill();c.strokeStyle='rgba(255,255,255,.55)';c.stroke()}}
  else if(k==='stars'){for(let i=0;i<24;i++){c.fillStyle=i%4?'rgba(255,255,255,.9)':'rgba(255,230,140,.95)';star5(c,x0+Lb*(.08+.85*rnd(i)),yT+H*(.08+.84*rnd(i+17)),H*(.025+.03*rnd(i+3)))}const g=c.createRadialGradient(0,0,0,0,0,Lb*.4);g.addColorStop(0,'rgba(160,120,255,.35)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x0,yT,Lb,H)}
  else if(k==='aurora'){for(let i=0;i<4;i++){const g=c.createLinearGradient(x0,0,x1,0),h1=['#7af0c0','#a080ff','#ff8ad8','#80d0ff'][i];g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.5,h1);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=.45;c.fillStyle=g;c.beginPath();c.moveTo(x0,yT+H*(.15+i*.2));c.bezierCurveTo(x0*.3,yT+H*(.05+i*.2),x1*.3,yT+H*(.3+i*.2),x1,yT+H*(.12+i*.2));c.lineTo(x1,yT+H*(.22+i*.2));c.bezierCurveTo(x1*.3,yT+H*(.4+i*.2),x0*.3,yT+H*(.15+i*.2),x0,yT+H*(.25+i*.2));c.fill()}}
  else if(k==='rainbow'){const cols=['#ff6a6a','#ffb04a','#ffe04a','#6ae08a','#5ab0ff','#a080ff'];cols.forEach((cc,i)=>{c.globalAlpha=.45;c.fillStyle=cc;c.fillRect(x0,yT+H*i/6,Lb,H/6+1)})}
  else if(k==='flame'){for(let i=0;i<9;i++){const y=yT+H*(.15+i*.08);c.fillStyle=i%2?'rgba(255,240,120,.6)':'rgba(255,120,30,.55)';c.beginPath();c.moveTo(x1*.4,y);c.quadraticCurveTo(0,y-H*.08,x0,y+Math.sin(i)*H*.05);c.quadraticCurveTo(0,y+H*.06,x1*.4,y+H*.03);c.fill()}}
  else if(k==='zap'){c.fillStyle='#f6e040';c.strokeStyle='#1a1a1a';c.lineWidth=lw*.6;for(const u of[.25,.55]){const x=x0+Lb*u;c.beginPath();c.moveTo(x,yT);c.lineTo(x+H*.18,yT+H*.4);c.lineTo(x+H*.05,yT+H*.42);c.lineTo(x+H*.2,yB);c.lineTo(x-H*.05,yT+H*.55);c.lineTo(x+H*.08,yT+H*.52);c.lineTo(x-H*.06,yT);c.closePath();c.fill();c.stroke()}}
  else if(k==='mirror'){for(let i=0;i<7;i++){const x=x0+Lb*(.25+i*.08),y=yT+H*(i%2?.3:.5);const g=c.createRadialGradient(x-H*.03,y-H*.03,1,x,y,H*.1);g.addColorStop(0,'rgba(255,250,220,.95)');g.addColorStop(1,'rgba(200,180,120,.5)');c.fillStyle=g;c.beginPath();c.ellipse(x,y,H*.1,H*.08,0,0,7);c.fill();c.strokeStyle='rgba(90,80,40,.5)';c.lineWidth=lw*.5;c.stroke()}}
  else if(k==='shine'){const g=c.createLinearGradient(x0,yT,x1*.3,yB);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.45,'rgba(255,255,230,.6)');g.addColorStop(.55,'rgba(255,255,230,.0)');c.fillStyle=g;c.fillRect(x0,yT,Lb,H)}
  else if(k==='ghost'){c.fillStyle='rgba(200,190,255,.25)';c.fillRect(x0,yT,Lb,H)}
  c.restore()}
 if(sp.mut){for(let i=0;i<7;i++){c.fillStyle=i%2?'rgba(255,60,200,.5)':'rgba(80,255,160,.45)';c.beginPath();c.ellipse(x0+Lb*(.15+.7*hsh(i,5)),yT+H*(.15+.7*hsh(i,9)),H*.1,H*.07,hsh(i,3)*3,0,7);c.fill()}}}
function renderFishStatic(f,v,L){const sp=fspec(f,v);sp.id=f.id;const Lb=L*.78,H=L*sp.a*.95,lw=Math.max(1,L*.016),PADX=L*.2,cw=Math.ceil(L*1.5+PADX),ch=Math.ceil(H*3.2+L*.3),cv=document.createElement('canvas');cv.width=cw;cv.height=ch;const c=cv.getContext('2d');
 const ox=L*.62+PADX,oy=ch/2+H*(sp.tk-.5)*.3;c.translate(ox,oy);c.lineJoin='round';c.lineCap='round';sp.glassy=sp.ex.includes('glassbody');
 const B=fbody(sp,Lb,H);
 // 뒤쪽: 꼬리·지느러미
 drawTail(c,sp,B,Lb,H,lw);drawFinsBack(c,sp,B,Lb,H,lw);
 if(sp.ex.includes('flywings')||sp.ex.includes('gurnard')){const p=at(B.top,.66),wl=sp.ex.includes('gurnard')?L*.42:L*.62;c.save();c.translate(p[0],p[1]+H*.35);c.rotate(-.35);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-wl*.3,-H*1.1,-wl,-H*.55);c.quadraticCurveTo(-wl*.6,-H*.05,0,H*.12);c.closePath();const sp2=Object.assign({},sp,{fin:sp.ex.includes('gurnard')?'#5a9ae8':sp.fin});finDraw(c,sp2,lw,[[0,0,-wl,-H*.55],[0,0,-wl*.8,-H*.8],[0,0,-wl*.6,-H*.9],[0,0,-wl*.85,-H*.3]],[0,0],[-wl,0]);c.restore()}
 if(sp.ex.includes('lionfan')){for(let i=0;i<7;i++){const p=at(B.bot,.7);c.save();c.translate(p[0],p[1]-H*.3);c.rotate(.3+i*.18);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-L*.1,H*.2,-L*.36,H*.18);c.lineTo(-L*.34,H*.24);c.quadraticCurveTo(-L*.1,H*.28,0,H*.05);c.closePath();c.fillStyle=i%2?'rgba(250,225,215,.92)':'rgba(190,60,40,.9)';c.fill();c.strokeStyle='rgba(90,20,10,.6)';c.lineWidth=lw*.5;c.stroke();c.restore()}}
 if(sp.ex.includes('fairywings')){for(const r of[-.5,-.15]){c.save();const p=at(B.top,.55);c.translate(p[0],p[1]);c.rotate(r);c.beginPath();c.ellipse(-L*.06,-H*.7,L*.1,H*.75,-.3,0,7);const g=c.createLinearGradient(0,-H*1.4,0,0);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(160,220,255,.4)');c.fillStyle=g;c.fill();c.strokeStyle='rgba(120,180,230,.8)';c.lineWidth=lw*.6;c.stroke();c.restore()}}
 // 몸통
 fpath(c,B.top,B.bot);const bg=c.createLinearGradient(0,-H*sp.tk,0,H*(1-sp.tk));bg.addColorStop(0,sp.back);bg.addColorStop(.42,sp.side);bg.addColorStop(.7,mixHex(sp.side,sp.belly,.6));bg.addColorStop(1,sp.belly);
 c.save();if(sp.glassy||sp.ex.includes('ghostbody'))c.globalAlpha=.62;c.fillStyle=bg;c.fill();c.restore();
 c.save();fpath(c,B.top,B.bot);c.clip();
 if(sp.ex.includes('orangebelly')){const g=c.createLinearGradient(0,0,0,H*(1-sp.tk));g.addColorStop(0,'rgba(255,140,60,0)');g.addColorStop(1,'rgba(255,130,50,.75)');c.fillStyle=g;c.fillRect(-Lb,0,Lb*2,H)}
 drawPattern(c,sp,B,Lb,H,lw,f.id);
 // 입체 명암: 위쪽 빛·아래쪽 그늘·머리쪽 하이라이트
 let g=c.createLinearGradient(0,-H*sp.tk,0,H*(1-sp.tk));g.addColorStop(0,'rgba(255,255,255,.28)');g.addColorStop(.35,'rgba(255,255,255,0)');g.addColorStop(.75,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,20,40,.28)');c.fillStyle=g;c.fillRect(-Lb,-H*1.2,Lb*2,H*2.4);
 g=c.createRadialGradient(Lb*.2,-H*.25,0,Lb*.2,-H*.25,Lb*.45);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(-Lb,-H*1.2,Lb*2,H*2.4);
 if(sp.metal){const m=sp.metal;for(const[u,a]of[[-.25,.55],[.15,.4]]){const gg=c.createLinearGradient(Lb*(u-.08),0,Lb*(u+.08),0);gg.addColorStop(0,'rgba(255,255,255,0)');gg.addColorStop(.5,`rgba(255,255,240,${a*m})`);gg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gg;c.fillRect(-Lb,-H,Lb*2,H*2)}}
 // 아가미 덮개
 const gp=at(B.top,.74),gq=at(B.bot,.74);c.strokeStyle=shadeHex(sp.side,.6);c.globalAlpha=.6;c.lineWidth=lw*.9;c.beginPath();c.moveTo(gp[0],gp[1]*.75);c.quadraticCurveTo(gp[0]-H*.18,(gp[1]+gq[1])/2,gq[0],gq[1]*.75);c.stroke();c.globalAlpha=1;
 if(sp.ex.includes('gillslits')){c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=lw;for(let i=0;i<5;i++){const p=at(B.top,.62+i*.03);c.beginPath();c.moveTo(p[0],p[1]*.3);c.lineTo(p[0]-H*.03,H*.2);c.stroke()}}
 if(sp.ex.includes('opercspot')){const p=at(B.top,.76);c.fillStyle='#1a2a5a';c.beginPath();c.arc(p[0],p[1]*.25,H*.06,0,7);c.fill();c.strokeStyle='#7ad0ff';c.lineWidth=lw;c.stroke()}
 if(sp.ex.includes('earflap')){const p=at(B.top,.74);c.fillStyle='#1a1a24';c.beginPath();c.ellipse(p[0]-H*.08,p[1]*.2+H*.02,H*.07,H*.06,0,0,7);c.fill()}
 c.restore();
 // 외곽선
 fpath(c,B.top,B.bot);c.lineWidth=lw*.95;c.strokeStyle=shadeHex(sp.back,.5);c.stroke();
 // 배·가슴 지느러미(몸 앞)
 if(!sp.ex.includes('nopelvic')){const p=at(B.bot,.56),q=at(B.bot,.5);c.beginPath();c.moveTo(p[0],p[1]-lw);c.quadraticCurveTo(p[0]-H*.02,p[1]+H*.2,p[0]-H*.2,p[1]+H*.3);c.quadraticCurveTo(q[0]-H*.04,q[1]+H*.14,q[0],q[1]-lw);c.closePath();finDraw(c,sp,lw,[[p[0],p[1],p[0]-H*.22,p[1]+H*.2]],p,[p[0],p[1]+H*.3])}
 if(sp.ex.includes('lobefins')){for(const s of[.62,.35]){const p=at(B.bot,s);c.beginPath();c.ellipse(p[0]-H*.12,p[1]+H*.08,H*.2,H*.09,.4,0,7);c.fillStyle=lgradF(c,0,p[1],0,p[1]+H*.2,sp.fin);c.fill();c.lineWidth=lw*.8;c.strokeStyle=shadeHex(sp.fin,.5);c.stroke()}}
 // 입·주둥이·특징(머리)
 const nose=B.top[B.top.length-1],mx=nose[0],my=H*.06+(sp.ex.includes('eyetop')?H*.05:0),M=sp.mo,ol=shadeHex(sp.back,.35);c.lineCap='round';
 if(M==='halfbeak'){c.fillStyle='#e8eef4';c.beginPath();c.moveTo(mx-H*.2,my+H*.05);c.lineTo(mx+L*.22,my+H*.1);c.lineTo(mx+L*.22,my+H*.16);c.lineTo(mx-H*.2,my+H*.14);c.closePath();c.fill();c.strokeStyle=ol;c.lineWidth=lw*.6;c.stroke();c.fillStyle='#e05050';c.beginPath();c.arc(mx+L*.22,my+H*.13,H*.04,0,7);c.fill()}
 else if(M==='beak'){c.fillStyle='#f4ece0';c.beginPath();c.moveTo(mx-H*.09,my-H*.08);c.quadraticCurveTo(mx+H*.08,my-H*.06,mx+H*.06,my+H*.03);c.quadraticCurveTo(mx+H*.04,my+H*.1,mx-H*.09,my+H*.09);c.closePath();c.fill();c.strokeStyle=ol;c.lineWidth=lw*.7;c.stroke();c.beginPath();c.moveTo(mx-H*.1,my+H*.01);c.lineTo(mx+H*.12,my+H*.02);c.stroke()}
 else if(M==='snout'){c.fillStyle=sp.side;c.beginPath();c.moveTo(mx-H*.08,my-H*.07);c.lineTo(mx+H*.16,my-H*.015);c.lineTo(mx+H*.16,my+H*.03);c.lineTo(mx-H*.08,my+H*.09);c.closePath();c.fill();c.strokeStyle=ol;c.lineWidth=lw*.8;c.stroke()}
 else if(M==='fangs'){c.fillStyle='#f8f8ff';for(let i=0;i<4;i++){const x=mx-H*.05-i*H*.07;c.beginPath();c.moveTo(x,my-H*.02);c.lineTo(x+H*.02,my+H*.22);c.lineTo(x+H*.04,my-H*.02);c.fill()}c.strokeStyle=ol;c.lineWidth=lw;c.beginPath();c.moveTo(mx,my);c.lineTo(mx-H*.3,my+H*.06);c.stroke()}
 else if(M==='teeth'){c.strokeStyle=ol;c.lineWidth=lw*1.1;c.beginPath();c.moveTo(mx,my);c.lineTo(mx-H*.22,my+H*.05);c.stroke();c.fillStyle='#fff';for(let i=0;i<3;i++){const x=mx-H*.04-i*H*.06;c.beginPath();c.moveTo(x,my+H*.005);c.lineTo(x+H*.015,my+H*.06);c.lineTo(x+H*.03,my+H*.005);c.fill()}}
 else if(M==='wide'||M==='bigmouth'||M==='flat'){const w=M==='bigmouth'?H*.4:M==='flat'?H*.35:H*.28;c.strokeStyle=ol;c.lineWidth=lw*1.1;c.beginPath();c.moveTo(mx+lw,my-H*.02);c.quadraticCurveTo(mx-w*.5,my+H*.1,mx-w,my+H*.04);c.stroke();c.fillStyle='rgba(255,140,150,.5)';c.beginPath();c.ellipse(mx-w*.3,my+H*.05,w*.25,H*.025,0,0,7);c.fill()}
 else if(M==='under'){c.strokeStyle=ol;c.lineWidth=lw;c.beginPath();c.moveTo(mx-H*.02,my+H*.1);c.quadraticCurveTo(mx-H*.12,my+H*.14,mx-H*.2,my+H*.08);c.stroke()}
 else if(M==='lips'||M==='pout'){c.fillStyle=M==='pout'?'#ffa0b0':shadeHex(sp.side,1.1);c.beginPath();c.ellipse(mx-lw,my+H*.02,H*.06,H*.045,0,0,7);c.fill();c.strokeStyle=ol;c.lineWidth=lw*.8;c.stroke();c.beginPath();c.moveTo(mx-H*.06,my+H*.02);c.lineTo(mx+H*.02,my+H*.02);c.stroke()}
 else if(M==='tiny'){c.strokeStyle=ol;c.lineWidth=lw*.8;c.beginPath();c.arc(mx-H*.03,my,H*.025,.3,2.6);c.stroke()}
 else{c.strokeStyle=ol;c.lineWidth=lw;c.beginPath();c.arc(mx-H*.07,my-H*.01,H*.06,.3,1.9);c.stroke()}
 if(sp.ex.includes('redlip')){c.fillStyle='#ff6a5a';c.beginPath();c.ellipse(mx-lw,my+H*.02,H*.04,H*.03,0,0,7);c.fill()}
 if(sp.ex.includes('barbel')||sp.ex.includes('chinbarbel')){c.strokeStyle=shadeHex(sp.back,.6);c.lineWidth=lw*.9;c.beginPath();if(sp.ex.includes('chinbarbel')){c.moveTo(mx-H*.12,my+H*.14);c.quadraticCurveTo(mx-H*.1,my+H*.28,mx-H*.16,my+H*.34)}else{c.moveTo(mx-H*.02,my+H*.04);c.quadraticCurveTo(mx+H*.08,my+H*.2,mx-H*.02,my+H*.3);c.moveTo(mx-H*.06,my+H*.06);c.quadraticCurveTo(mx,my+H*.16,mx-H*.1,my+H*.22)}c.stroke()}
 if(sp.ex.includes('cheekspine')){c.fillStyle=shadeHex(sp.side,.8);for(let i=0;i<3;i++){const p=at(B.top,.78+i*.04);c.beginPath();c.moveTo(p[0],p[1]*.5);c.lineTo(p[0]-H*.04,p[1]*.5-H*.12);c.lineTo(p[0]+H*.04,p[1]*.5);c.fill()}}
 if(sp.ex.includes('ears')){for(const k of[-.15,.12]){c.save();const p=at(B.top,.6+k);c.translate(p[0],p[1]);c.rotate(k);c.beginPath();c.ellipse(0,-L*.12,L*.045,L*.13,0,0,7);c.fillStyle='#fbf8ff';c.fill();c.strokeStyle='#b8a8c8';c.lineWidth=lw;c.stroke();c.fillStyle='#ffb8d0';c.beginPath();c.ellipse(0,-L*.12,L*.02,L*.085,0,0,7);c.fill();c.restore()}}
 if(sp.ex.includes('redanal')){const p=at(B.bot,.3);c.strokeStyle='#e04060';c.lineWidth=lw*1.4;c.beginPath();c.moveTo(p[0]-H*.05,p[1]+H*.1);c.lineTo(p[0]-H*.25,p[1]+H*.15);c.stroke()}
 if(sp.ex.includes('orangefin')){const p=at(B.bot,.55);c.fillStyle='rgba(255,140,60,.7)';c.beginPath();c.ellipse(p[0]-H*.1,p[1]+H*.12,H*.1,H*.05,.5,0,7);c.fill()}
 const eyeS=sp.ex.includes('eyetop')?.8:.84,ep=at(B.top,eyeS),er=Math.max(2.2,H*.13*sp.ey*(sp.sh==='disc'?.75:sp.sh==='long'?1.6:sp.sh==='slim'?1.25:1));
 const eyeY=sp.ex.includes('eyetop')?ep[1]+er*.4:ep[1]*.42-H*.02;
 const r={cv,ox,oy,L,Lb,H,lw,eye:[ep[0]-er*.2,eyeY,er],pec:[at(B.top,.7)[0],H*(.5-sp.tk)*.4+H*.16],sp,blush:sp.sh!=='shark'};return r}
function fishEye(c,x,y,r,iris,t,s,m){c.save();if(m==='hurt'){c.strokeStyle='#2b2140';c.lineWidth=r*.4;c.lineCap='round';c.beginPath();c.moveTo(x-r*.6,y-r*.6);c.lineTo(x+r*.4,y);c.lineTo(x-r*.6,y+r*.6);c.stroke();c.restore();return}
 if(m==='happy'){c.strokeStyle='#2b2140';c.lineWidth=r*.38;c.lineCap='round';c.beginPath();c.arc(x,y+r*.25,r*.65,Math.PI+.35,-.35);c.stroke();c.restore();return}
 const bl=((t+s*1.7)%3.8)<.12;
 c.fillStyle='#fffdf8';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.lineWidth=Math.max(.8,r*.14);c.strokeStyle='rgba(40,30,50,.85)';c.stroke();
 if(bl){c.fillStyle=shadeHex(iris,.5);c.beginPath();c.ellipse(x,y,r*1.02,r*.22,0,0,7);c.fill();c.restore();return}
 const g=c.createRadialGradient(x+r*.12,y+r*.1,r*.1,x+r*.12,y+r*.05,r*.72);g.addColorStop(0,shadeHex(iris,1.6));g.addColorStop(.6,iris);g.addColorStop(1,shadeHex(iris,.45));c.fillStyle=g;c.beginPath();c.arc(x+r*.14,y+r*.06,r*.7,0,7);c.fill();
 c.fillStyle='#120c18';c.beginPath();c.arc(x+r*.18,y+r*.08,r*.38,0,7);c.fill();
 c.fillStyle='#fff';c.beginPath();c.ellipse(x+r*.38,y-r*.22,r*.24,r*.2,-.4,0,7);c.fill();c.globalAlpha=.85;c.beginPath();c.arc(x-r*.05,y+r*.36,r*.1,0,7);c.fill();c.restore()}
function drawFish2(c,f,L,t,o,s,m){const v=o.v&&f.r>0?o.v:'',DP=Math.min(2,(typeof DPR!=='undefined'?DPR:1)),bucket=L*DP<=48?48:L*DP<=96?96:L*DP<=180?180:L*DP<=320?320:480,key=f.id+'|'+v+'|'+bucket;
 let R=FCACHE[key];if(!R){R=renderFishStatic(f,v,bucket);FCACHE[key]=R;FCN++}
 const k=L/R.L,cw=R.cv.width,ch=R.cv.height,sp=R.sp,spd=(m==='hurt'?14:6)*(sp.sh==='torp'||sp.sh==='slim'?1.3:sp.sh==='disc'?.7:1),amp=R.H*k*(sp.sh==='long'||sp.sh==='slim'?.22:.14),N=16;
 const bend=u=>Math.sin(t*spd+s-u*2.6)*amp*Math.pow(1-u,1.7);
 const gx0=-R.ox*k,gy0=-R.oy*k,tailX=-R.Lb*.5-R.Lb*.3;
 if(sp.ex.includes('ghostbody'))c.globalAlpha=.55+Math.sin(t*2)*.15;
 for(let i=0;i<N;i++){const sx=cw*i/N,sw=cw/N+1,xm=(sx+sw/2-R.ox),u=Math.max(0,Math.min(1,(xm-tailX)/(R.Lb*.5-tailX)));const dy=bend(u);c.drawImage(R.cv,sx,0,sw,ch,gx0+sx*k,gy0+dy,sw*k+.5,ch*k)}
 c.globalAlpha=1;
 // 가슴지느러미(파닥)
 const pu=(R.pec[0]-tailX)/(R.Lb*.5-tailX),px=R.pec[0]*k,py=R.pec[1]*k+bend(pu),fl=Math.sin(t*7+s)*.35;c.save();c.translate(px,py);c.rotate(.5+fl);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-R.H*k*.22,-R.H*k*.12,-R.H*k*.34,R.H*k*.04);c.quadraticCurveTo(-R.H*k*.16,R.H*k*.12,0,0);c.closePath();c.fillStyle=finFill(c,sp,0,0,-R.H*k*.34,0,.7);c.fill();c.lineWidth=R.lw*k*.5;c.strokeStyle=shadeHex(sp.fin,.65);c.stroke();c.strokeStyle='rgba(0,0,0,.15)';for(let i=1;i<4;i++){c.beginPath();c.moveTo(0,0);c.lineTo(-R.H*k*.3,R.H*k*(-.08+i*.04));c.stroke()}c.restore();
 // 눈·볼
 const eu=(R.eye[0]-tailX)/(R.Lb*.5-tailX),ex=R.eye[0]*k,ey=R.eye[1]*k+bend(eu),er=R.eye[2]*k;
 if(R.blush){c.fillStyle='rgba(255,110,140,.35)';c.beginPath();c.ellipse(ex+er*.3,ey+er*1.25,er*.6,er*.35,0,0,7);c.fill()}
 fishEye(c,ex,ey,er,sp.iris,t,s,m);
 if(sp.ex.includes('electric')&&Math.sin(t*9)>.3){c.strokeStyle='rgba(255,240,90,.9)';c.lineWidth=Math.max(1,L*.012);c.beginPath();for(let i=0;i<3;i++){const a=t*5+i*2.1,r0=L*.42;c.moveTo(Math.cos(a)*r0,Math.sin(a)*r0*.5);c.lineTo(Math.cos(a+.2)*r0*1.12,Math.sin(a+.2)*r0*.55);c.lineTo(Math.cos(a+.1)*r0*1.25,Math.sin(a+.1)*r0*.62)}c.stroke()}
 if(sp.ex.includes('tailstar')){for(let i=0;i<4;i++){const xx=(tailX-R.Lb*(.1+i*.12))*k,yy=Math.sin(t*4+i)*R.H*k*.3;c.fillStyle=`rgba(255,236,140,${.8-i*.18})`;star5(c,xx,yy,L*(.06-i*.01))}}
 if(sp.ex.includes('fairywings')||sp.ex.includes('crystal')){}
}
// 도감 서식지 배경(계곡·호수=민물, 산호초, 심해, 빙하, 달빛, 바다)
function habOf(f){const l=LOCS.find(x=>x.id===f.loc[0]);return l?l.w:'sea'}
function drawHabitat(g,w,h,hab,t){let gr=g.createLinearGradient(0,0,0,h);const P={sea:['#9ad8f4','#2a86b8','#e8d6a8'],fresh:['#c8ecd8','#4aa08a','#8a7a5a'],reef:['#8ae8f0','#1aa0c0','#f4e0b0'],ice:['#e8f6ff','#8ac0e0','#f4fbff'],deep:['#1a2a50','#060a1a','#14182a'],moon:['#3a2a7a','#0e1440','#2a2a50']}[hab]||['#9ad8f4','#2a86b8','#e8d6a8'];
 gr.addColorStop(0,P[0]);gr.addColorStop(1,P[1]);g.fillStyle=gr;g.fillRect(0,0,w,h);
 if(hab==='sea'||hab==='reef'||hab==='fresh'||hab==='ice'){g.save();g.globalAlpha=.18;g.fillStyle='#fff';for(let i=0;i<4;i++){const x=(i*.27+.08)*w+Math.sin(t*.4+i)*w*.03;g.beginPath();g.moveTo(x,0);g.lineTo(x+w*.08,0);g.lineTo(x+w*.2,h);g.lineTo(x+w*.06,h);g.fill()}g.restore()}
 if(hab==='deep'||hab==='moon'){for(let i=0;i<26;i++){const x=hsh(i,1)*w,y=(hsh(i,2)*h-t*6*(.3+hsh(i,3)))%h;g.fillStyle=hab==='moon'?'rgba(255,240,180,.7)':'rgba(140,220,255,.55)';g.beginPath();g.arc(x,(y+h)%h,1+hsh(i,4)*1.6,0,7);g.fill()}if(hab==='moon'){const mg=g.createRadialGradient(w*.82,h*.18,0,w*.82,h*.18,h*.3);mg.addColorStop(0,'rgba(255,245,200,.9)');mg.addColorStop(.3,'rgba(255,240,190,.5)');mg.addColorStop(1,'rgba(255,240,190,0)');g.fillStyle=mg;g.fillRect(0,0,w,h)}}
 // 바닥
 g.fillStyle=P[2];g.beginPath();g.moveTo(0,h);for(let x=0;x<=w;x+=w/12)g.lineTo(x,h*.86+Math.sin(x*.05)*h*.03);g.lineTo(w,h);g.fill();
 if(hab==='reef'){const cc=['#ff7a9a','#ffb04a','#c08aff','#ff6a5a'];for(let i=0;i<6;i++){const x=w*(.05+i*.18),y=h*.9;g.strokeStyle=cc[i%4];g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x-8,y-22,x-4+Math.sin(t+i)*2,y-34);g.moveTo(x,y-10);g.quadraticCurveTo(x+10,y-22,x+12,y-30);g.stroke();g.fillStyle=cc[(i+1)%4];g.beginPath();g.arc(x+w*.08,y-6,7,Math.PI,0);g.fill()}}
 if(hab==='fresh'){for(let i=0;i<7;i++){g.fillStyle=['#8a8a7a','#a09a88','#6a6a60'][i%3];g.beginPath();g.ellipse(w*(.08+i*.14),h*.93,10+hsh(i,5)*8,6,0,0,7);g.fill()}g.strokeStyle='#4a8a3a';g.lineWidth=3;for(let i=0;i<5;i++){const x=w*(.1+i*.2);g.beginPath();g.moveTo(x,h);g.quadraticCurveTo(x+Math.sin(t*1.5+i)*8,h*.75,x+Math.sin(t*1.5+i)*12,h*.58);g.stroke()}}
 if(hab==='ice'){g.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<5;i++){const x=w*(.05+i*.22);g.beginPath();g.moveTo(x,h);g.lineTo(x+12,h*.72);g.lineTo(x+26,h*.8);g.lineTo(x+34,h);g.fill()}for(let i=0;i<20;i++){g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(hsh(i,7)*w,(hsh(i,8)*h+t*12*(.5+hsh(i,9)))%h,1.4,0,7);g.fill()}}
 if(hab==='sea'){g.strokeStyle='#3a8a5a';g.lineWidth=4;g.lineCap='round';for(let i=0;i<3;i++){const x=w*(.12+i*.38);g.beginPath();g.moveTo(x,h);g.quadraticCurveTo(x+Math.sin(t+i)*10,h*.7,x+Math.sin(t*1.2+i)*14,h*.52);g.stroke()}}
 for(let i=0;i<8;i++){const x=hsh(i,11)*w,y=h-((t*20*(.5+hsh(i,12))+hsh(i,13)*h)%h);g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1;g.beginPath();g.arc(x+Math.sin(t*2+i)*3,y,2+hsh(i,14)*3,0,7);g.stroke()}}
