/* ================= 사운드 ================= */
let AC=null,master=null,bgmGain=null,ambGain=null,ambLP=null,rainGain=null,noiseBuf=null,bgmNext=0,bgmStep=0,ambT=2;
function audio(){if(AC){if(AC.state==='suspended')AC.resume();return}
 try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}
 master=AC.createGain();master.gain.value=.9;master.connect(AC.destination);
 bgmGain=AC.createGain();bgmGain.gain.value=save.set.bgm?.05:0;bgmGain.connect(master);
 const n=AC.sampleRate*2|0;noiseBuf=AC.createBuffer(1,n,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 const wave=AC.createBufferSource();wave.buffer=noiseBuf;wave.loop=true;ambLP=AC.createBiquadFilter();ambLP.type='lowpass';ambLP.frequency.value=420;ambGain=AC.createGain();ambGain.gain.value=save.set.bgm?.05:0;const modG=AC.createGain();modG.gain.value=.65;
 const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=.13;lg.gain.value=.35;lfo.connect(lg).connect(modG.gain);lfo.start();wave.connect(ambLP).connect(modG).connect(ambGain).connect(master);wave.start();
 const rain=AC.createBufferSource();rain.buffer=noiseBuf;rain.loop=true;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=2500;rainGain=AC.createGain();rainGain.gain.value=0;rain.connect(hp).connect(rainGain).connect(master);rain.start();
 bgmNext=AC.currentTime+.2;setAmb()}
function setAmb(){if(!AC)return;const l=curLoc(),f={wave:520,gull:420,bird:900,frog:300,whale:300,bubble:700,wind:1400,deep:160,chime:350}[l.amb]||420;ambLP.frequency.setTargetAtTime(f,AC.currentTime,.5);ambGain.gain.setTargetAtTime(save.set.bgm?(l.amb==='deep'?.08:.05):0,AC.currentTime,.3)}
const sOn=()=>AC&&save.set.sfx;
function tone(f,d=.12,type='sine',v=.15,slide=0,delay=0,dest){if(!sOn())return;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+delay;o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(dest||master);o.start(t);o.stop(t+d+.02)}
function noise(d=.3,f=1200,v=.25,type='lowpass',sweep=0,delay=0){if(!sOn())return;const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain(),t=AC.currentTime+delay;s.buffer=noiseBuf;fl.type=type;fl.frequency.setValueAtTime(f,t);if(sweep)fl.frequency.exponentialRampToValueAtTime(sweep,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl).connect(g).connect(master);s.start(t,Math.random());s.stop(t+d)}
const arp=(notes,gap=.085,type='triangle',v=.13,len=.2)=>notes.forEach((f,i)=>tone(f,len,type,v,0,i*gap));
const SFX={
 click:()=>tone(660,.07,'triangle',.08,880),
 charge:()=>tone(220,.08,'square',.04),
 cast:()=>{noise(.35,600,.18,'bandpass',3000);tone(400,.3,'sine',.06,1200)},
 plop:()=>{tone(700,.16,'sine',.18,160);noise(.18,900,.12)},
 nibble:()=>tone(980,.04,'sine',.06),
 bell:()=>{tone(1760,.25,'sine',.1);tone(2637,.2,'sine',.05,0,.01)},
 twitch:()=>{tone(520,.05,'triangle',.06,780);noise(.08,1800,.05,'bandpass')},
 bite:()=>{tone(880,.09,'square',.1);tone(1320,.12,'square',.1,0,.09)},
 rare:()=>{[0,.22].forEach(d=>tone(70,.18,'sine',.35,50,d));arp([784,988,1319],.07,'triangle',.08,.25)},
 hook:()=>{tone(500,.12,'sawtooth',.08,1500);noise(.12,2000,.1,'highpass')},
 reel:()=>{const k=(COS.reel.find(r=>r.id===save.wear.reel)||{}).pitch||1;tone((1700+Math.random()*300)*k,.018,'square',.025)},
 warn:()=>tone(1200,.06,'square',.05),
 surge:()=>noise(.25,700,.14),
 crit:()=>{tone(1047,.1,'triangle',.12);tone(1568,.18,'triangle',.12,0,.08)},
 finish:()=>{arp([523,784,1047,1568],.05,'square',.07,.15);noise(.3,3000,.12,'highpass')},
 snap:()=>{noise(.15,3000,.3,'highpass');tone(180,.4,'sawtooth',.1,60)},
 jump:()=>{noise(.3,400,.18,'bandpass',2500);tone(300,.25,'sine',.08,900)},
 splash:(v=.3)=>noise(.45,1100,v),
 thunder:()=>{noise(1.4,300,.5,'lowpass',80);tone(55,1,'sine',.2,35)},
 star:()=>arp([1568,2093,2637,3136],.05,'sine',.06,.3),
 reward:(n=4)=>arp([523,659,784,1047,1319,1568].slice(0,n)),
 rareGet:()=>{arp([659,784,988,1319,1568],.07,'triangle',.14,.3);tone(196,.6,'sine',.12)},
 legend:()=>{arp([523,659,784,1047,784,1047,1319,1568,2093],.1,'triangle',.12,.28);tone(130,1.2,'sine',.15)},
 myth:()=>{arp([440,554,659,880,1109,1319,1760,2217],.11,'sawtooth',.06,.4);arp([880,1109,1319,1760],.11,'triangle',.1,.5);tone(110,2,'sine',.18);noise(1.5,5000,.05,'highpass')},
 boss:()=>{tone(65,1.4,'sawtooth',.14,45);tone(98,1.4,'sawtooth',.08,60,.1);[0,.5,1].forEach(d=>noise(.3,200,.3,'lowpass',80,d))},
 bossWin:()=>{arp([392,523,659,784,1047,1319,1568,2093],.09,'square',.07,.3);arp([1047,1319,1568,2093],.12,'triangle',.12,.6);tone(98,1.5,'sine',.2)},
 level:()=>arp([392,523,659,784,1047],.07,'square',.06,.22),
 upgrade:()=>{arp([523,784,1047],.06,'square',.06,.12);noise(.2,4000,.06,'highpass',0,.15);tone(2093,.3,'sine',.06,0,.2)},
 mission:()=>{arp([784,988,1175,1568],.07,'triangle',.11,.22)},
 dexdone:()=>{arp([523,659,784,1047,1319,1568,2093],.08,'triangle',.12,.35);tone(262,1.2,'sine',.15)},
 coin:()=>{tone(1319,.06,'square',.05);tone(1760,.12,'square',.05,0,.06)},
 shell:()=>{tone(1200,.05,'triangle',.06);tone(900,.05,'triangle',.06,0,.06)},
 meow:()=>{tone(700,.2,'triangle',.07,1100);tone(1100,.15,'triangle',.05,600,.18)},
 fail:()=>tone(300,.35,'triangle',.12,150)};
const SC=[[0,2,4,7,9],[0,2,4,7,9],[0,3,5,7,10],[0,3,5,7,10]];
function bgmTick(){if(!AC||!save.set.bgm)return;const now=AC.currentTime;if(bgmNext<now)bgmNext=now+.05;
 const boss=S==='fight'&&fish&&(fish.boss||fish.r>=5);
 while(bgmNext<now+.4){const ph=clk().i,sc=boss?[0,1,3,7,8]:SC[ph],base=boss?50:ph===3?57:60,beat=boss?.2:.36;
  if(bgmStep%8===0){[0,7].forEach(iv=>{const o=AC.createOscillator(),g=AC.createGain();o.type=boss?'sawtooth':'sine';o.frequency.value=440*Math.pow(2,(base-24+iv-69)/12);g.gain.setValueAtTime(0,bgmNext);g.gain.linearRampToValueAtTime(boss?.2:.35,bgmNext+.3);g.gain.exponentialRampToValueAtTime(.001,bgmNext+beat*8);o.connect(g).connect(bgmGain);o.start(bgmNext);o.stop(bgmNext+beat*8)})}
  if(Math.random()<(boss?.7:ph===3?.35:.55)){const note=base+sc[Math.floor(Math.random()*5)]+(Math.random()<.3?12:0),o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=440*Math.pow(2,(note-69)/12);g.gain.setValueAtTime(0,bgmNext);g.gain.linearRampToValueAtTime(.5,bgmNext+.02);g.gain.exponentialRampToValueAtTime(.001,bgmNext+beat*1.8);o.connect(g).connect(bgmGain);o.start(bgmNext);o.stop(bgmNext+beat*2)}
  bgmNext+=beat;bgmStep++}}
// 장소별 환경음(새소리·개구리·고래·바람·풍경 소리)
function ambTick(dt){if(!AC||!save.set.bgm||S==='title')return;ambT-=dt;if(ambT>0)return;ambT=rnd(2.5,6);const a=curLoc().amb,night=isNight(),v=.035;
 const out=bgmGain;
 if(a==='bird'&&!night){const f=rnd(2200,3200);for(let i=0;i<3;i++)tone(f+i*120,.07,'sine',v,f*1.3,i*.11,out)}
 else if(a==='frog'||(a==='bird'&&night)){for(let i=0;i<4;i++)tone(rnd(180,240),.06,'square',v*.6,0,i*.09,out)}
 else if(a==='gull'&&!night&&Math.random()<.5){tone(1400,.25,'sawtooth',v*.5,900,0,out);tone(1300,.2,'sawtooth',v*.4,850,.3,out)}
 else if(a==='whale'&&Math.random()<.35){tone(180,1.6,'sine',v*1.2,120,0,out);tone(240,1.2,'sine',v*.8,160,.8,out)}
 else if(a==='deep'){tone(rnd(60,90),2,'sine',v*1.5,0,0,out);if(Math.random()<.4)tone(rnd(900,1400),.05,'sine',v,0,.6,out)}
 else if(a==='bubble'){for(let i=0;i<5;i++)tone(rnd(500,1100),.05,'sine',v,rnd(900,1600),i*.07,out)}
 else if(a==='wind')noise(2.2,600,.06,'bandpass',1400);
 else if(a==='chime')arp([1568,1976,2349,2637].sort(()=>Math.random()-.5).slice(0,3),.25,'sine',.03,1.2);
 else if(a==='wave')noise(1.6,500,.08,'lowpass',200)}
const vib=p=>{if(!save.set.vib)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
