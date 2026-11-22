window.__bot=function(maxMs){return new Promise(res=>{const cv=document.getElementById('c');let held=false,start=performance.now(),log={air:0,ink:0,charge:0,crit:0,ex:0,phases:0,maxTen:0};let lastPhase=0,tapT=0;
 const dn=()=>{cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:200,clientY:500,bubbles:true}));held=true},upf=()=>{window.dispatchEvent(new PointerEvent('pointerup'));held=false};
 const iv=setInterval(()=>{const S=__t.S,fg=__t.fg;if(performance.now()-start>maxMs){clearInterval(iv);upf();res({r:'timeout',S,log});return}
  if(S==='bite'){dn();setTimeout(upf,30);return}
  if(S==='fight'){log.maxTen=Math.max(log.maxTen,fg.ten);
   if(fg.clutch>0){log.clutch=1;if(held)upf();const el=2.2-fg.clutch;if(window.__clutchOK!==false&&el>(window.__clutchAt||1.38)&&!fg.cTap){fg.cTap=1;dn();setTimeout(upf,20)}return}
   if(fg.final>0){log.final=(log.final||0)+1;if(performance.now()-tapT>110){tapT=performance.now();dn();setTimeout(upf,25)}return}
   if(fg.freeze>0&&performance.now()-tapT>120){tapT=performance.now();log.ice=(log.ice||0)+1;dn();setTimeout(upf,25);return}
   if(fg.weak>0&&performance.now()-tapT>150){tapT=performance.now();log.weak=(log.weak||0)+1;if(held)upf();setTimeout(dn,20);return}
   if(fg.warn>0||fg.diveT>0){if(held)upf();return}if(fg.air>0)log.air++;if(fg.inkT>0)log.ink++;if(fg.charge>0)log.charge++;if(fg.phase>lastPhase){lastPhase=fg.phase;log.phases++}
   if((fg.chance>0||fg.ex>0)&&performance.now()-tapT>150){tapT=performance.now();if(held)upf();setTimeout(dn,20);if(fg.ex>0)log.ex++;else log.crit++;return}
   if(fg.air>0||fg.charge>0||fg.roar>0){if(held)upf();return}
   if(fg.ten<58&&!held)dn();else if(fg.ten>80&&held)upf();return}
  if(S!=='wait'&&S!=='hook'&&S!=='cast'&&S!=='land'){clearInterval(iv);if(held)upf();res({r:S,log,t:Math.round((performance.now()-start)/100)/10});}},30)})};
window.__cast=function(pw){return new Promise(res=>{const cv=document.getElementById('c');cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:200,clientY:500,bubbles:true}));setTimeout(()=>{window.dispatchEvent(new PointerEvent('pointerup'));res()},pw||700)})};
