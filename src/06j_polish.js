/* ================= 4.15.2 화면 정리 · 작은 재미 =================
 ① 갯바위·계곡·산호초: 수중 배경 그림이 있으면 받침(바위·돌·모래)을 수면 조금 아래까지만 그리고 물색으로 섞음
    (예전엔 화면 맨 아래까지 꽉 차서 물속 배경·물고기를 가렸음)
 ② 물속 친구 탭: 낚시 준비 중 헤엄치는 물고기를 탭하면 놀라서 도망 + 이름(못 잡은 친구는 ??? 힌트). 보상 없음 */
const CLIP_PLAT=['rock','stone','beach','light'];
const _dp416=drawPlatform;drawPlatform=function(g,t){const L=curLoc();
 if(!CLIP_PLAT.includes(L.plat)||!ipOk('uw_'+L.id))return _dp416(g,t);
 const cy=g.surf+16,xe=Math.min(W,g.edge+90);
 ctx.save();ctx.beginPath();ctx.moveTo(-5,-5);ctx.lineTo(W+5,-5);ctx.lineTo(W+5,cy);for(let x=W;x>=-5;x-=12)ctx.lineTo(x,cy+Math.sin(x*.09+t*1.2)*3);ctx.closePath();ctx.clip();
 _dp416(g,t);ctx.restore();
 // 잘린 경계를 물색으로 섞어 '물에 잠기는' 느낌
 const P=pal(),gr=ctx.createLinearGradient(0,g.surf+2,0,cy+4);gr.addColorStop(0,P.sea+'00');gr.addColorStop(1,P.sea+'d0');ctx.fillStyle=gr;ctx.fillRect(0,g.surf+2,xe,cy+4-g.surf-2)};

// 물속 친구 탭
let critTapT=0;
function critTap(px,py){const g=G();if(py<g.surf+10||py>g.bed)return false;
 let best=null,bd=1e9;for(const a of crit){if(a.flee||a.y==null)continue;const dx=Math.abs(px-a.x),dy=Math.abs(py-a.y);if(dx<a.L*.6&&dy<Math.max(18,a.L*.35)){const d=dx+dy;if(d<bd){bd=d;best=a}}}
 if(!best)return false;
 best.flee=1;best.dir=px<best.x?1:-1;ring(best.x,best.y,26,'255,255,255',.6);for(let i=0;i<6;i++)parts.push({x:best.x+rnd(-8,8),y:best.y+rnd(-6,6),vx:rnd(-20,20),vy:-rnd(30,70),l:.9,t:0,c:'rgba(255,255,255,.8)',r:2+Math.random()*2,g:-.2});
 tone(880+Math.random()*200,.06,'sine',.06);vib(10);
 const f=best.f,known=save.dex[f.id];if(performance.now()-critTapT>600){critTapT=performance.now();toast(known?`🐟 ${f.n}! 놀라서 도망갔어요`:'❓ ??? · 아직 못 낚은 친구! 이 낚시터에서 낚을 수 있어요',known?900:1500)}
 return true}
// 물고기 위를 눌러도 일단 평소처럼 힘 모으기 시작 → 짧게 톡 떼면(0.18초 안) 던지기 취소하고 물고기 반응, 꾹 누르면 그대로 던짐
let critPend=null;
function critAt(px,py){const g=G();if(py<g.surf+10||py>g.bed)return null;let best=null,bd=1e9;for(const a of crit){if(a.flee||a.y==null)continue;const dx=Math.abs(px-a.x),dy=Math.abs(py-a.y);if(dx<a.L*.6&&dy<Math.max(18,a.L*.35)){const d=dx+dy;if(d<bd){bd=d;best=a}}}return best}
const _dn416=down;down=function(px,py){critPend=S==='ready'&&px!=null&&inGame()&&critAt(px,py)?{px,py}:null;return _dn416(px,py)};
// 손 뗌은 게임이 시작할 때 원래 up 함수로 등록돼 있어서, 그보다 먼저 받는(capture) 리스너로 짧은 탭만 가로챔
function critUp(){if(critPend&&S==='charge'&&T<.18){const c=critPend;critPend=null;go('ready');power=0;idleT=0;critTap(c.px,c.py)}else critPend=null}
addEventListener('pointerup',critUp,true);addEventListener('pointercancel',()=>{critPend=null},true);
if(TEST)Object.defineProperties(window.__w,{critTap:{value:critTap},crit:{get(){return crit}}});
