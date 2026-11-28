/* 4.6 아이템 이미지(장비·스킨·배·장식·펫·수조) */
const IPX=__ITEMPX__,IPI={};
// 4.28 최적화: 큰 배경 그림(낚시터·물속·시간대 지도·계절 덧그림·수족관 테마 ≈ 60장)은 시작할 때 한꺼번에 풀지 않고 처음 쓸 때 풂 → 시작 속도·메모리 절약
const IPLAZY=/^(bg_|uw_|bgfx_|bgs_|aqbg_)/;
for(const k in IPX){const i=new Image();if(IPLAZY.test(k))i._lz=1;else i.src=IPX[k];IPI[k]=i}
function ipOk(k){const i=IPI[k];if(i&&i._lz){i._lz=0;i.decoding='async';i.src=IPX[k];return false}return !!(i&&i.complete&&i.naturalWidth)}
function ipWarm(L){['bg_','uw_','bgfx_'].forEach(p=>ipOk(p+L));['spring','autumn','winter'].forEach(s=>ipOk('bgs_'+L+'_'+s))}
try{ipWarm(save.loc)}catch(e){}
function icH(k,fb){return IPX[k]?`<img class="icimg" src="${IPX[k]}" alt="">`:fb}
function ipDraw(g,k,x,y,h,ax=.5,ay=1,flip=false){const i=IPI[k];if(!i||!i.complete||!i.naturalWidth)return 0;const w=h*i.naturalWidth/i.naturalHeight;g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';if(flip){g.translate(x,0);g.scale(-1,1);x=0}g.drawImage(i,x-w*ax,y-h*ay,w,h);g.restore();return w}
function ipDrawW(g,k,x,y,w,ax=.5,ay=1){const i=IPI[k];if(!i||!i.complete||!i.naturalWidth)return 0;return ipDraw(g,k,x,y,w*i.naturalHeight/i.naturalWidth,ax,ay)}
