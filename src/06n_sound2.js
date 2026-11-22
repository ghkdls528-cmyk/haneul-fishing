/* ================= 4.17 사운드 확장 — 상황에 반응하는 소리 =================
 ① 동적 음악: 같은 곡을 이어서 틀면서 상태에 따라 음악 크기·밝기(저역 필터)와 긴장 레이어 2개(심장박동·위험)를 조절
    대기 → 입질(살짝 긴장) → 힘겨루기(긴장) → 장력 위험·위기 링(위험) → 끝나면 1.5초에 걸쳐 원래대로
 ② 환경음 6종: 실제 날씨·시간대·장소에 연결(파도·갈매기·바닷바람·비·폭풍우·밤바다), 천둥은 기존 번개에 연결
 ③ 물고기 그룹: 작은/보통/대형/희귀/보스 — 챔질·저항·끌어올림 소리가 달라짐
 ④ 이벤트: 황금 물고기·물고기 떼·대물 경보·피버·보스 등장 (같은 이벤트 4초 안 중복 없음)
 ⑤ 반응음: 대어·도감 첫 등록·펫 쓰다듬기·친밀도 상승 (확률·간격 제한으로 피로하지 않게) */
const SND2={loops:{},filt:null,ev:{},react:{},prev:{golden:0,school:null,evt:null,fever:0},t:0,state:'calm'};
function snd2Route(){if(SND2.filt||!SND.bus||!AC)return;try{const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=20000;f.Q.value=.3;
 SND.bus.mus.disconnect();SND.bus.mus.connect(f);f.connect(SND.bus.bgm);SND2.filt=f;
 try{ambGain.disconnect();rainGain.disconnect()}catch(e){}   // 예전 합성 파도·빗소리 대신 새 환경음
 }catch(e){}}
// 반복 소리(레이어·환경음) 켜기/끄기: 목표 음량으로 천천히
function loop2(k,vol,fade=1.2){if(!AC||!SND.bus)return;let L=SND2.loops[k];
 if(vol>.001){const B=SND.buf[k];if(!B){sndLoad(k);return}
  if(!L){try{const s=AC.createBufferSource(),g=AC.createGain();s.buffer=B.b;s.loop=true;s.loopStart=B.ls;s.loopEnd=B.le;g.gain.value=0;s.connect(g).connect(SND.bus.bgm);s.start(0,B.ls+Math.random()*(B.le-B.ls)*.8);L=SND2.loops[k]={s,g,v:0}}catch(e){return}}
  if(Math.abs(L.v-vol)>.005){L.g.gain.setTargetAtTime(vol,AC.currentTime,fade/3);L.v=vol}}
 else if(L){const t=AC.currentTime;L.g.gain.setTargetAtTime(0,t,fade/3);const s=L.s;setTimeout(()=>{try{s.stop()}catch(e){}},fade*1500);delete SND2.loops[k]}}
// ① 동적 음악 상태
function musicState(){if(S==='fight'){if(fg.clutch>0||fg.final>0||(fg.ten||0)>82)return'danger';return'fight'}if(S==='bite'||S==='hook')return'bite';if(S==='land'||S==='result')return'win';return'calm'}
const MSTATE={calm:{m:1,f:20000,t:0,d:0},bite:{m:.8,f:9000,t:.35,d:0},fight:{m:.68,f:4200,t:.75,d:0},danger:{m:.5,f:1800,t:.35,d:.85},win:{m:.9,f:20000,t:0,d:0}};
function musicTick(){const st=musicState(),M=MSTATE[st],t=AC.currentTime,k=st==='calm'||st==='win'?.5:.12;SND2.state=st;
 if(SND.cur)SND.cur.g.gain.setTargetAtTime(M.m,t,k);if(SND2.filt)SND2.filt.frequency.setTargetAtTime(M.f,t,k);
 loop2('layer_tension',M.t*.55,st==='calm'?1.5:.5);loop2('layer_danger',M.d*.55,.4)}
// ② 환경음
function ambWant(){const L=curLoc(),night=isNight(),sea=['pier','rock','light','sea','reef','deep','moon'].includes(L.id),w={};
 if(weather==='storm'){w.amb_storm=.8;return w}
 if(weather==='rain'){w.amb_rain=.7;if(sea)w.amb_waves=.35;return w}
 if(weather==='wind'||L.amb==='wind'||L.id==='ice')w.amb_wind=L.id==='ice'?.45:.6;
 if(sea&&L.id!=='deep'){if(night||L.night)w.amb_night_waves=.6;else{w.amb_waves=.55;if(['gull','wave'].includes(L.amb)&&weather!=='fog')w.amb_gulls=.45}}
 return w}
const AMBK=['amb_waves','amb_gulls','amb_wind','amb_rain','amb_storm','amb_night_waves'];
function ambTick2(){const w=S==='title'?{}:ambWant();for(const k of AMBK)loop2(k,(w[k]||0)*(S==='fight'?.6:1),2)}
const _at417=ambTick;ambTick=function(dt){const a=curLoc().amb;if(a==='wave'||a==='wind'||a==='gull')return;_at417(dt)};  // 새 환경음과 겹치는 예전 합성 소리 끔
// ④ 이벤트·⑤ 반응: 간격·확률 제한
function evt(k,gap=4){if(!AC)return;const t=AC.currentTime;if(t-(SND2.ev[k]||-99)<gap)return;SND2.ev[k]=t;sp(k,{gap:0,vol:.95})}
function react(k,p,gap){if(!AC||Math.random()>p)return;const t=AC.currentTime;if(t-(SND2.react[k]||-99)<gap)return;SND2.react[k]=t;sp(k,{gap:0,vol:.9,rate:.96+Math.random()*.08})}
function eventTick(){const P=SND2.prev;
 if(goldenT>0&&!(P.golden>0))evt('evt_golden');P.golden=goldenT;
 if(school&&!P.school)evt('evt_school');P.school=school;
 const E=typeof EVT!=='undefined'?EVT:null;if(E&&E!==P.evt)evt(E.k==='big'?'evt_bigfish':'evt_school');P.evt=E;
 if(fever>0&&!(P.fever>0))evt('evt_fever');P.fever=fever}
const _upd417=update;update=function(dt){_upd417(dt);if(!AC||!SND.bus)return;snd2Route();SND2.t-=dt;if(SND2.t>0)return;SND2.t=.1;
 musicTick();eventTick();if((SND2.amT=(SND2.amT||0)-1)<=0){SND2.amT=5;ambTick2()}};
// 천둥 · 보스 등장
SFX.thunder=()=>{if(!sp('sfx_thunder',{gap:1.5,vol:.85}))SFX0.thunder()};
SFX.boss=()=>{if(AC&&SND.buf.evt_boss)evt('evt_boss',3);else SFX0.boss()};
// ③ 물고기 그룹
function fishGroup(f){if(!f)return'normal';if(f.boss)return'boss';const big=f.giant||f.sc>=2||(f.kgv||0)>=8;if(f.r>=3&&!f.tre)return big?'rarebig':'rare';if(big)return'big';if(f.sc===0||(f.kgv||1)<.3)return'small';return'normal'}
SFX.surge=()=>{const g=fishGroup(fish),rate=g==='small'?1.3:g==='big'||g==='rarebig'?.8:g==='boss'?.7:1;if(!sp('sfx_12_fish_resistance',{gap:.45,rate,vol:g==='small'?.7:1}))SFX0.surge()};
const _sf417=startFight;startFight=function(g){_sf417(g);if(S!=='fight'||!fish)return;const G=fishGroup(fish);
 if(G==='boss')sp('boss_roar',{gap:1});else if(G==='rare'||G==='rarebig')sp('fish_rare_hook',{gap:.5,vol:.8})};
const _ln417=landNow;landNow=function(g){const G=fishGroup(fish);_ln417(g);if(G==='small')sp('fish_small_splash',{gap:.3});else if(G!=='normal'&&G!=='rare')sp('fish_big_splash',{gap:.5})};
// ⑤ 대어·도감 첫 등록
const _sr419=showResult;showResult=function(){const f=fish;_sr419();if(!f||!lastRes||lastRes.f!==f||f.tre)return;
 const big=f.giant||f.boss||f.r>=5;if(big)setTimeout(()=>react('react_wow',1,6),350);else if(lastRes.isNew&&f.r>0)setTimeout(()=>react('react_new',.8,3),300)};
// ⑤ 펫
SFX.pop=()=>{};
const _pt417=petTap;petTap=function(px,py){const id=save.pet,lv0=id?petLv(id):0;const r=_pt417(px,py);if(r&&id){if(petLv(id)>lv0)react('pet_love',1,1);else react('pet_pat',.7,1.4)}return r};
// 첫 터치 때 짧은 소리들도 미리 디코딩
addEventListener('pointerdown',()=>{if(AC&&!SND2.warm){SND2.warm=1;for(const k of Object.keys(AUD))if(/^(fish_|evt_|react_|pet_|sfx_thunder)/.test(k))sndLoad(k)}},true);
// 사운드 미리 듣기 목록에 추가
SND_LIST.push(['layer_tension','⚡ 긴장 레이어'],['layer_danger','⚠️ 위험 레이어'],['amb_waves','🌊 잔잔한 파도'],['amb_gulls','🕊️ 갈매기'],['amb_wind','🌬️ 바닷바람'],['amb_rain','🌧️ 빗소리'],['amb_storm','⛈️ 폭풍우'],['amb_night_waves','🌙 밤바다'],
 ['sfx_thunder','천둥'],['fish_small_splash','작은 물고기'],['fish_big_splash','대형 물고기'],['fish_rare_hook','희귀 입질'],['boss_roar','보스 포효'],
 ['evt_golden','황금 물고기'],['evt_school','물고기 떼'],['evt_bigfish','대물 경보'],['evt_fever','피버'],['evt_boss','보스 등장'],['react_wow','대어 반응'],['react_new','첫 발견 반응'],['pet_pat','펫 쓰다듬기'],['pet_love','친밀도 상승']);
// 미리 듣기: 반복 소리는 3초만
$('sbody').addEventListener('click',e=>{const b=e.target.closest('button[data-snd]');if(!b)return;const k=b.dataset.snd;if(!/^(layer_|amb_)/.test(k))return;audio();
 sndLoad(k).then(()=>{loop2(k,.8,.2);setTimeout(()=>loop2(k,0,.5),3000)})});
if(TEST)Object.defineProperties(window.__w,{SND2:{get(){return SND2}},fishGroup:{value:fishGroup},ambWant:{value:ambWant},musicState:{value:musicState}});
