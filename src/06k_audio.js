/* ================= 4.16 오리지널 사운드 (BGM 5곡 · 효과음 20종, tools/make_audio.py로 직접 합성) =================
 소리 묶음: [효과음 bus] ← 기존 master(효과음·합성음)  /  [BGM bus] ← 음악 + 환경음(파도·비)  → [전체 out]
 - 음원은 MP3(base64)로 이 파일 안에 들어 있고, 필요할 때만 디코딩(BGM은 지금 곡·직전 곡만 메모리에 둠)
 - 첫 터치 때 AudioContext 시작(브라우저 자동 재생 정책), 백그라운드면 기존 코드가 AC.suspend()
 - 음원 디코딩이 안 되면 기존 합성음(SFX 원래 함수)으로 대신 재생 → 게임은 멈추지 않음 */
const AUD=__AUDIO__,AUDM=__AUDMETA__;
const SND={buf:{},load:{},bus:null,cur:null,curKey:'',want:'',wantT:0,prev:null,voices:[],last:{},uiT:0,charge:null,reel:null,warnT:0,preview:null,previewT:0};
function sndSet(){const s=save.set;s.snd=s.snd==null?1:+!!s.snd;s.bgmVol=clamp(num(s.bgmVol,.35),0,1);s.sfxVol=clamp(num(s.sfxVol,.65),0,1)}
sndSet();
function sndBuses(){if(SND.bus||!AC)return;try{
 const out=AC.createGain(),sfx=AC.createGain(),bgm=AC.createGain(),mus=AC.createGain();out.connect(AC.destination);sfx.connect(out);bgm.connect(out);mus.connect(bgm);
 master.disconnect();master.connect(sfx);                       // 기존 합성 효과음 → 효과음 묶음
 try{bgmGain.disconnect();bgmGain.connect(bgm)}catch(e){}       // 기존 환경음(새·개구리 등)
 try{ambGain.disconnect();ambGain.connect(bgm);rainGain.disconnect();rainGain.connect(bgm)}catch(e){}
 SND.bus={out,sfx,bgm,mus};sndApply(true)}catch(e){SND.bus=null}}
function sndApply(now){if(!SND.bus)return;const s=save.set,t=AC.currentTime,k=now?0:.08;
 SND.bus.out.gain.setTargetAtTime(s.snd?1:0,t,k);SND.bus.sfx.gain.setTargetAtTime(s.sfx?s.sfxVol*1.25:0,t,k);SND.bus.bgm.gain.setTargetAtTime(s.bgm?s.bgmVol*1.15:0,t,k)}
const _au416=audio;audio=function(){_au416();sndBuses()};
bgmTick=function(){};   // 예전 무작위 합성 BGM은 끔(새 BGM이 대신)
function b64buf(d){const s=atob(d.slice(d.indexOf(',')+1)),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u.buffer}
// MP3 앞쪽 인코더 지연(무음)을 찾아서 정확한 반복 구간을 잡음
function prepBuf(k,b){const m=AUDM[k]||{};let off=0;if(m.loop||/^bgm_/.test(k)){const d=b.getChannelData(0),lim=Math.min(d.length,6000);for(let i=0;i<lim;i++)if(Math.abs(d[i])>.003){off=i;break}}
 const len=m.samples&&m.sr?m.samples/m.sr:b.duration;return{b,ls:off/b.sampleRate,le:Math.min(b.duration,off/b.sampleRate+len)}}
function sndLoad(k){if(SND.buf[k])return Promise.resolve(SND.buf[k]);if(SND.load[k])return SND.load[k];if(!AC||!AUD[k])return Promise.resolve(null);
 return SND.load[k]=new Promise(res=>{const done=b=>{delete SND.load[k];if(b)SND.buf[k]=prepBuf(k,b);res(SND.buf[k]||null)};
  try{const p=AC.decodeAudioData(b64buf(AUD[k]),done,()=>done(null));if(p&&p.catch)p.catch(()=>done(null))}catch(e){done(null)}})}
function sndWarm(){if(!AC)return;for(const k in AUD)if(/^sfx_/.test(k))sndLoad(k)}
// 효과음 재생: 같은 소리 최소 간격·동시 3개·전체 12개 제한
function sp(k,o={}){if(!AC||!SND.bus||!save.set.sfx||!save.set.snd)return false;const B=SND.buf[k];if(!B){sndLoad(k);return false}
 const now=AC.currentTime,gap=o.gap??.06;if(now-(SND.last[k]||-9)<gap)return true;SND.last[k]=now;
 SND.voices=SND.voices.filter(v=>v.end>now);if(SND.voices.filter(v=>v.k===k).length>=3||SND.voices.length>=12)return true;
 try{const s=AC.createBufferSource(),g=AC.createGain();s.buffer=B.b;s.playbackRate.value=o.rate||1;g.gain.value=o.vol??1;s.connect(g).connect(SND.bus.sfx);s.start(now+(o.delay||0));
  SND.voices.push({k,end:now+(o.delay||0)+B.b.duration/(o.rate||1)})}catch(e){}
 return true}
// 반복 효과음(충전·릴): 켜고 끄기
function sloop(k,on,o={}){const key=k==='sfx_05_cast_charge'?'charge':'reel';let L=SND[key];
 if(on&&AC&&SND.bus&&save.set.sfx&&save.set.snd){const B=SND.buf[k];if(!B){sndLoad(k);return}
  if(!L){try{const s=AC.createBufferSource(),g=AC.createGain();s.buffer=B.b;s.loop=true;s.loopStart=B.ls;s.loopEnd=B.le;g.gain.value=0;s.connect(g).connect(SND.bus.sfx);s.start(0,B.ls);L=SND[key]={s,g}}catch(e){return}}
  L.g.gain.setTargetAtTime(o.vol??1,AC.currentTime,.03);if(o.rate)L.s.playbackRate.setTargetAtTime(o.rate,AC.currentTime,.05)}
 else if(L){const t=AC.currentTime;L.g.gain.setTargetAtTime(0,t,.025);try{L.s.stop(t+.15)}catch(e){}SND[key]=null}}
// --- 기존 SFX 이름에 새 음원 연결 (음원이 아직 없으면 원래 합성음) ---
const SFX0=Object.assign({},SFX);
const via=(k,fb,o)=>(...a)=>{if(!sp(k,typeof o==='function'?o(...a):o))fb&&fb(...a)};
Object.assign(SFX,{
 click:()=>{const t=performance.now();setTimeout(()=>{if(performance.now()-SND.uiT>140)via('sfx_01_button',SFX0.click,{gap:.07})()},0)},
 charge:()=>{},                                   // 충전음은 아래 update에서 누르는 동안만 반복
 cast:via('sfx_06_cast_throw',SFX0.cast),
 plop:via('sfx_07_float_splash',SFX0.plop),
 bite:via('sfx_08_bite',SFX0.bite,{gap:.3}),
 hook:()=>{queueMicrotask(()=>{const pf=fg&&fg.hj==='PERFECT';via(pf?'sfx_10_perfect_hook':'sfx_09_hook_success',SFX0.hook,{gap:.3})()})},  // PERFECT면 PERFECT음만
 reel:()=>{},                                     // 릴음은 감는 동안만 반복(아래)
 surge:via('sfx_12_fish_resistance',SFX0.surge,{gap:.45}),
 warn:()=>{if(!AC)return;const t=AC.currentTime;if(t-SND.warnT<1.4)return;SND.warnT=t;via('sfx_13_line_warning',SFX0.warn,{vol:.9})()},
 clutchOk:via('sfx_14_crisis_success',SFX0.finish),
 crit:via('sfx_15_critical',SFX0.crit,{gap:.2}),
 finish:via('sfx_16_finisher',SFX0.finish,{gap:.3}),
 reward:via('sfx_17_fish_caught',SFX0.reward,{gap:.35}),
 coin:via('sfx_04_gold',SFX0.coin,{gap:.12}),
 rareGet:()=>{if(fish&&fish.tre)return;via('sfx_18_rare_fish',SFX0.rareGet,{gap:.5,vol:1})()},
 legend:()=>{if(fish&&fish.tre)return;if(sp('sfx_18_rare_fish',{gap:.5}))sp('sfx_18_rare_fish',{gap:0,rate:1.26,vol:.45,delay:.2});else SFX0.legend()},
 myth:()=>{if(fish&&fish.tre)return;if(sp('sfx_18_rare_fish',{gap:.5,rate:.9}))sp('sfx_18_rare_fish',{gap:0,rate:1.335,vol:.5,delay:.24}),sp('sfx_20_legendary_treasure',{gap:0,vol:.35,delay:.5,rate:1.12});else SFX0.myth()},
 tre:(r)=>{const k=r>=5?'sfx_20_legendary_treasure':'sfx_19_treasure_found';if(!sp(k,{gap:.5}))(r>=4?SFX0.legend:SFX0.coin)()}});
// 메뉴 열기·닫기 (버튼 소리와 겹치지 않게)
const menuSnd=k=>{SND.uiT=performance.now();if(!sp(k,{gap:.15}))SFX0.click()};
const _os416=openSheet;openSheet=function(...a){const was=$('sheet').classList.contains('on');const r=_os416.apply(this,a);if(!was&&$('sheet').classList.contains('on'))menuSnd('sfx_02_menu_open');return r};
const _cs416=closeSheet;closeSheet=function(...a){const was=$('sheet').classList.contains('on');const r=_cs416.apply(this,a);if(was)menuSnd('sfx_03_menu_close');return r};
const _ow416=openWard;openWard=function(...a){const r=_ow416.apply(this,a);if($('ward').classList.contains('on'))menuSnd('sfx_02_menu_open');return r};
const _cw416=closeWard;closeWard=function(...a){const was=$('ward').classList.contains('on');const r=_cw416.apply(this,a);if(was)menuSnd('sfx_03_menu_close');return r};
const _oa416=openAq;openAq=function(...a){const r=_oa416.apply(this,a);if($('aq').classList.contains('on'))menuSnd('sfx_02_menu_open');return r};
const _ca416=closeAq;closeAq=function(...a){const was=$('aq').classList.contains('on');const r=_ca416.apply(this,a);if(was)menuSnd('sfx_03_menu_close');return r};
// --- BGM 자동 선택 · 크로스페이드 ---
const BGMN={b1:'bgm_01_yosu_morning',b2:'bgm_02_sunset_sea',b3:'bgm_03_moonlight_fishing',b4:'bgm_04_deep_sea_adventure',b5:'bgm_05_treasure_discovery'};
function pickBgm(){if(SND.preview&&performance.now()<SND.previewT)return SND.preview;SND.preview=null;
 if(S==='title')return BGMN.b1;if(save.mode==='treasure')return BGMN.b5;const L=save.loc;if(L==='sea'||L==='deep')return BGMN.b4;
 const ph=clk().i;return ph===3?BGMN.b3:ph===2?BGMN.b2:BGMN.b1}
function bgmSwitch(k){if(SND.curKey===k&&SND.cur)return;SND.curKey=k;
 const playing=SND.cur&&SND.cur.k;for(const x in SND.buf)if(/^bgm_/.test(x)&&x!==k&&x!==playing)delete SND.buf[x];  // 메모리: 지금 곡·새 곡만
 sndLoad(k).then(B=>{if(!B||SND.curKey!==k||!SND.bus)return;const t=AC.currentTime,F=1.5;
  if(SND.cur){const o=SND.cur;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0,t+F);try{o.s.stop(t+F+.05)}catch(e){}
   const ok=o.k;setTimeout(()=>{if(ok!==SND.curKey&&!(SND.cur&&SND.cur.k===ok))delete SND.buf[ok]},(F+.5)*1000)}  // 페이드 끝난 이전 곡 해제
  const s=AC.createBufferSource(),g=AC.createGain();s.buffer=B.b;s.loop=true;s.loopStart=B.ls;s.loopEnd=B.le;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+F);s.connect(g).connect(SND.bus.mus);s.start(t,B.ls);
  SND.cur={s,g,k}})}
let sndTick=0;
const _up417=update;update=function(dt){_up417(dt);if(!AC||!SND.bus)return;
 // 충전음: 누르는 동안만, 힘에 따라 음높이 상승
 sloop('sfx_05_cast_charge',S==='charge',{rate:.8+power*.9,vol:.8});
 // 릴음: 감는 동안만(위기 링·최종 연타 중 제외)
 const rk=(COS.reel.find(r=>r.id===save.wear.reel)||{}).pitch||1;sloop('sfx_11_reel',S==='fight'&&holding&&!(fg.clutch>0)&&!(fg.final>0),{rate:rk*(fg.gs?Math.min(1.5,.85+.15*fg.gs.spd):1),vol:.9});
 sndTick-=dt;if(sndTick>0)return;sndTick=.5;sndApply();
 if(AC.state!=='running'||!save.set.bgm||!save.set.snd)return;
 const w=pickBgm();if(w!==SND.want){SND.want=w;SND.wantT=0}else SND.wantT+=.5;
 if(SND.want!==SND.curKey&&(SND.wantT>=1||!SND.cur||SND.preview))bgmSwitch(SND.want)};  // 1초 이상 유지될 때만 전환(시간대 경계에서 왔다갔다 방지)
// 첫 터치에서 효과음 미리 디코딩
addEventListener('pointerdown',()=>{if(AC&&!SND.warm){SND.warm=1;sndWarm()}},true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AC&&AC.state==='suspended'&&!$('title').classList.contains('on'))AC.resume()});

// --- 설정: 소리 패널 ---
const SND_LIST=[['bgm_01_yosu_morning','🎵 여수의 작은 낚시터'],['bgm_02_sunset_sea','🎵 노을빛 여수 바다'],['bgm_03_moonlight_fishing','🎵 달빛 아래 낚시'],['bgm_04_deep_sea_adventure','🎵 깊은 바다의 모험'],['bgm_05_treasure_discovery','🎵 보물 발견의 순간'],
 ['sfx_01_button','버튼'],['sfx_02_menu_open','메뉴 열기'],['sfx_03_menu_close','메뉴 닫기'],['sfx_04_gold','골드'],['sfx_05_cast_charge','힘 모으기'],['sfx_06_cast_throw','던지기'],['sfx_07_float_splash','찌 착수'],['sfx_08_bite','입질'],['sfx_09_hook_success','챔질'],['sfx_10_perfect_hook','PERFECT 챔질'],
 ['sfx_11_reel','릴 감기'],['sfx_12_fish_resistance','물고기 저항'],['sfx_13_line_warning','장력 경고'],['sfx_14_crisis_success','위기 링 성공'],['sfx_15_critical','크리티컬'],['sfx_16_finisher','결정타'],['sfx_17_fish_caught','물고기 획득'],['sfx_18_rare_fish','희귀 물고기'],['sfx_19_treasure_found','보물 발견'],['sfx_20_legendary_treasure','대박 보물']];
function sndHTML(){const s=save.set,tg=(k,n)=>`<div class="tog"><span>${n}</span><button data-act="set" data-id="${k}">${s[k]?'켜짐':'꺼짐'}</button></div>`,
 sl=(k,n,on)=>`<div class="tog sl416"><span>${n}</span><input type="range" min="0" max="100" step="5" value="${Math.round(s[k]*100)}" data-vol="${k}" aria-label="${n}" ${on?'':'disabled'}><b data-volv="${k}">${Math.round(s[k]*100)}%</b></div>`;
 return `<div class="sec">🔊 소리</div>`+tg('snd','🔈 전체 사운드')+tg('bgm','🎵 배경음악·환경음')+sl('bgmVol','🎚️ 배경음악 음량',s.bgm&&s.snd)+tg('sfx','🔊 효과음')+sl('sfxVol','🎚️ 효과음 음량',s.sfx&&s.snd)
 +`<details class="sp416"><summary>🎧 사운드 미리 듣기 (배경음악 5곡 · 효과음 20종)</summary><div class="spg416">${SND_LIST.map(([k,n])=>`<button data-snd="${k}">${n}</button>`).join('')}</div><p>배경음악 미리 듣기는 20초 뒤 원래 음악으로 돌아가요</p></details>`}
const _sh416=setHTML;setHTML=function(){return sndHTML()+_sh416().replace(/<div class="tog"><span>🔊 효과음<\/span>.*?<\/div>/,'').replace(/<div class="tog"><span>🎵 배경음악·환경음<\/span>.*?<\/div>/,'')};
$('sbody').addEventListener('input',e=>{const r=e.target.closest('input[data-vol]');if(!r)return;save.set[r.dataset.vol]=clamp(+r.value/100,0,1);const v=$('sbody').querySelector(`[data-volv="${r.dataset.vol}"]`);if(v)v.textContent=r.value+'%';sndApply()});
$('sbody').addEventListener('change',e=>{if(e.target.closest('input[data-vol]')){persist();if(e.target.dataset.vol==='sfxVol')sp('sfx_17_fish_caught',{gap:0})}});
$('sbody').addEventListener('click',e=>{const b=e.target.closest('button[data-snd]');if(b){audio();const k=b.dataset.snd;
  if(/^bgm_/.test(k)){SND.preview=k;SND.previewT=performance.now()+20000;SND.want=k;bgmSwitch(k);toast('🎵 '+b.textContent.replace('🎵 ',''),1200)}
  else{SND.uiT=performance.now();if(/05_cast|11_reel/.test(k)){const p=sp(k,{gap:0})}else sp(k,{gap:0})}return}
 const t=e.target.closest('button[data-act="set"]');if(t&&['snd','bgm','sfx'].includes(t.dataset.id))setTimeout(()=>{sndApply();if(sheet.k==='set')renderSheet()},0)},false);
if(TEST)Object.defineProperties(window.__w,{SND:{get(){return SND}},sndLoad:{value:sndLoad},sp:{value:sp},pickBgm:{value:pickBgm},AUDK:{value:Object.keys(AUD)}});
// 닫기 버튼은 게임 시작 때 원래 함수가 직접 붙어 있어서, 닫는 소리가 나도록 다시 연결
$('sClose').onclick=$('sBack').onclick=()=>closeSheet();
if($('wClose'))$('wClose').onclick=()=>closeWard();
if($('aqClose'))$('aqClose').onclick=()=>closeAq();
