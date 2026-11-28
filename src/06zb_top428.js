/* ================= 4.28 상단 줄 다듬기 =================
 - 칭호를 레벨 칸 '안' 첫 줄로 (4.25의 아래 꼬리표 #titleRib는 숨김) · 둘째 줄은 % 가 안에 들어간 경험치바
 - 칭호가 길면 글자를 13→9.5px까지 맞춰 줄이고, 그래도 넘치면 천천히 좌우로 흘러가며 전부 보여 줌
 - 칭호가 없으면 첫 줄은 'Lv.N 낚시꾼' 대신 경험치 숫자
 - 레벨 숫자: 세 자리면 글자 작게 · 상단 칸 4개 높이·테두리·그림자 통일 */
{const xw=document.querySelector('#top .xpw'),bar=xw&&xw.querySelector('.xpbar');
 if(xw&&bar&&!$('xpTitle')){const tt=document.createElement('div');tt.id='xpTitle';tt.innerHTML='<span></span>';xw.insertBefore(tt,bar);const pc=document.createElement('b');pc.id='xpPct';bar.appendChild(pc);xw.classList.add('xp428')}}
function fit428(box){const sp=box.firstChild;if(!sp)return;box.classList.remove('marq');sp.style.removeProperty('--mq');let fs=13;box.style.fontSize=fs+'px';
 while(sp.scrollWidth>box.clientWidth+.5&&fs>9.5){fs-=.5;box.style.fontSize=fs+'px'}
 const over=sp.scrollWidth-box.clientWidth;if(over>1){box.classList.add('marq');sp.style.setProperty('--mq',(-over-4)+'px');sp.style.animationDuration=Math.max(4,over/12+3)+'s'}}
let top428='';
{const _hd=hud;hud=function(){_hd.apply(this,arguments);const need=xpNeed(save.lv),pct=Math.max(0,Math.min(100,Math.floor(save.xp/need*100))),tt=$('xpTitle'),pc=$('xpPct'),lv=$('lvNum');
 if(pc)pc.textContent=pct+'%';
 if(lv)lv.classList.toggle('n3',String(save.lv).length>=3);
 if(tt){const txt=save.title?save.title:`${save.xp.toLocaleString()} / ${need.toLocaleString()}`,key=txt+'|'+innerWidth+'|'+(save.title?1:0);
  if(key!==top428){top428=key;tt.firstChild.textContent=txt;tt.classList.toggle('hasT',!!save.title);tt.title=save.title?`${save.title} · ${save.xp}/${need}`:'';requestAnimationFrame(()=>fit428(tt))}}
 const r=$('titleRib');if(r){r.textContent='';document.body.classList.remove('hasTitle')}}}
addEventListener('resize',()=>{top428='';hud()});
// 꾸미기 세트 카드·미리보기 작은 그림: 옛 도트 그림(outfitpx) 대신 게임 속 실제 캐릭터 그림(charpx 윙크 포즈)으로 — 새로 받은 의상 시트가 꾸미기에도 보이게
for(const k in OPI){const f=CPX[k]&&(CPX[k].wink||CPX[k].idle);if(f&&f.src)OPI[k].src=f.src}
hud();
if(TEST)Object.defineProperties(window.__w,{top428:{value:()=>{const tt=$('xpTitle'),sp=tt.firstChild,lb=document.querySelector('#top .lvbox').getBoundingClientRect(),q=tt.getBoundingClientRect();return{fs:parseFloat(tt.style.fontSize),marq:tt.classList.contains('marq'),over:sp.scrollWidth-tt.clientWidth,inBox:q.left>=lb.left&&q.right<=lb.right+.5&&q.top>=lb.top&&q.bottom<=lb.bottom+.5,txt:sp.textContent}}}});
