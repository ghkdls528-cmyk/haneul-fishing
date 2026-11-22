/* 4.6 아이템 이미지(장비·스킨·배·장식·펫·수조) */
const IPX=__ITEMPX__,IPI={};for(const k in IPX){const i=new Image();i.src=IPX[k];IPI[k]=i}
function ipOk(k){const i=IPI[k];return !!(i&&i.complete&&i.naturalWidth)}
function icH(k,fb){return IPX[k]?`<img class="icimg" src="${IPX[k]}" alt="">`:fb}
function ipDraw(g,k,x,y,h,ax=.5,ay=1,flip=false){const i=IPI[k];if(!i||!i.complete||!i.naturalWidth)return 0;const w=h*i.naturalWidth/i.naturalHeight;g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';if(flip){g.translate(x,0);g.scale(-1,1);x=0}g.drawImage(i,x-w*ax,y-h*ay,w,h);g.restore();return w}
function ipDrawW(g,k,x,y,w,ax=.5,ay=1){const i=IPI[k];if(!i||!i.complete||!i.naturalWidth)return 0;return ipDraw(g,k,x,y,w*i.naturalHeight/i.naturalWidth,ax,ay)}
