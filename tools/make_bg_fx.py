"""낚시터 배경 10장 → 시간대·날씨·계절 변화용 데이터 (원본 구도·도트 그대로, 게임이 실시간으로 다시 그림)
사용법: python tools/make_bg_fx.py <원본 배경 폴더(bg_<id>.png 2048x1024)> [미리보기 폴더]
만드는 것 (assets/itempx.json · assets/bgfx_meta.json):
 - bgfx_<id>      : 영역 지도 PNG (R=하늘, G=구름 밝기, B=식물) — 1600x800(배경 그림과 같은 크기)
 - bgs_<id>_spring/autumn/winter : 계절 덧그림(webp, 투명) — 봄 꽃·연두 / 단풍 / 눈 덮임·겨울 식생
 - bgfx_meta.json : 밤 불빛 위치·등대 불빛 위치·지평선 높이
같은 크기로 줄인 뒤 계산하므로 import_bg.py가 넣은 bg_<id>와 픽셀이 정확히 맞음."""
import base64,io,json,os,sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
B=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));IP=os.path.join(B,'assets','itempx.json');MP=os.path.join(B,'assets','bgfx_meta.json')
W=1600
# 장소별 설정: sky_max = 하늘이 내려올 수 있는 최대 높이(비율), seasons = 계절 덧그림 만들지 여부, town = 밤 불빛 있는 곳
CFG={'pier':dict(sky_max=.7,seasons=1,town=1),'rock':dict(sky_max=.7,seasons=1,town=0),'light':dict(sky_max=.7,seasons=0,town=0,lamp=1),
     'valley':dict(sky_max=.56,seasons=1,town=0),'lake':dict(sky_max=.63,seasons=1,town=0,lantern=1),'sea':dict(sky_max=.88,seasons=0,town=0),
     'reef':dict(sky_max=.72,seasons=1,town=0),'ice':dict(sky_max=.3,seasons=0,town=0),'deep':dict(sky_max=.95,seasons=0,town=0),'moon':dict(sky_max=.8,seasons=0,town=0)}
def hsv(a):
    r,g,b=a[...,0],a[...,1],a[...,2];mx=np.max(a,-1);mn=np.min(a,-1);d=mx-mn+1e-6
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60;s=np.where(mx>0,(mx-mn)/(mx+1e-6),0);return h,s,mx
def to_hsv_rgb(h,s,v):
    c=v*s;x=c*(1-np.abs((h/60)%2-1));m=v-c;z=np.zeros_like(h);hi=(h//60).astype(int)%6
    r=np.select([hi==0,hi==1,hi==2,hi==3,hi==4,hi==5],[c,x,z,z,x,c]);g=np.select([hi==0,hi==1,hi==2,hi==3,hi==4,hi==5],[x,c,c,x,z,z]);b=np.select([hi==0,hi==1,hi==2,hi==3,hi==4,hi==5],[z,z,x,c,c,x])
    return np.stack([r+m,g+m,b+m],-1)
def analyze(loc,img):
    a=np.asarray(img.convert('RGB')).astype(float)/255;H,Wd=a.shape[:2];h,s,v=hsv(a);r,g,b=a[...,0],a[...,1],a[...,2]
    yy=np.mgrid[0:H,0:Wd][0];cfg=CFG[loc]
    blue=(b>r+.04)&(b>=g-.02)&(v>.3);cloud=(s<.28)&(v>.72)&(b>=r-.03)
    if loc in('deep','moon'):blue=(b>r)&(v>.08);cloud=cloud|((s<.35)&(v>.5))
    # 먼 산(채도 낮은 파랑·보라)이 하늘로 잡히지 않게: 매끈함(주변 밝기 변화)도 봄 — 하늘은 거의 평평, 산·폭포는 질감이 있음
    tex=nd.uniform_filter(np.abs(np.diff(v,axis=1,prepend=v[:,:1])),9)+nd.uniform_filter(np.abs(np.diff(v,axis=0,prepend=v[:1])),9)
    smooth=tex<cfg.get('tex',.035)
    cand=(blue|cloud)&(yy<H*cfg['sky_max'])&(smooth|cloud&(v>.85))
    lab,k=nd.label(cand);top=set(np.unique(lab[0]))-{0};sky=np.isin(lab,list(top))
    sky=nd.binary_closing(sky,iterations=2)&(yy<H*cfg['sky_max']);sky=nd.binary_opening(sky,iterations=2)|(yy<3);sky=nd.binary_fill_holes(sky)
    # 지평선(열마다 하늘의 가장 아래) — 밤 불빛 위치 계산용. 하늘을 자르는 데는 쓰지 않음(야자수·구름 틈에서 네모 구멍이 생겼음)
    hz=np.array([(np.nonzero(sky[:,x])[0].max()+1) if sky[:,x].any() else 0 for x in range(Wd)]);hz=nd.median_filter(hz,25)
    # 구름: 같은 줄의 파란 하늘 기준보다 밝은 정도
    base=np.zeros(H)
    for y in range(H):
        row=v[y][sky[y]&blue[y]&~cloud[y]]
        base[y]=np.median(row) if len(row)>20 else np.nan
    idx=np.arange(H);ok=~np.isnan(base);base=np.interp(idx,idx[ok],base[ok]) if ok.any() else np.full(H,.7)
    lum=(r*.3+g*.59+b*.11);cl=np.clip((lum-base[:,None]*.95)/np.maximum(.08,1-base[:,None]),0,1)*np.clip(1.2-s*2.5,0,1)
    cl=np.where(sky,nd.gaussian_filter(cl,1.0),0)
    fol=(h>65)&(h<170)&(s>.2)&(v>.1)&~sky
    if not cfg['seasons']:fol&=False
    return a,sky,cl,fol,hz,h,s,v
def lights(loc,a,sky,hz,h,s,v):
    H,Wd=sky.shape;rng=np.random.default_rng(11);pts=[];cfg=CFG[loc]
    if cfg.get('town'):
        yy=np.mgrid[0:H,0:Wd][0];band=(yy>hz[None,:]+4)&(yy<hz[None,:]+H*.16)&~sky
        wall=band&(s<.22)&(v>.62)   # 밝은 벽(건물)
        ys,xs=np.nonzero(wall);n=min(90,len(xs))
        if n:sel=rng.choice(len(xs),n,replace=False);pts=[[int(xs[i]),int(ys[i])] for i in sel]
    lamp=None
    if cfg.get('lamp'):
        red=(a[...,0]>.6)&(a[...,1]<.35)&(a[...,2]<.35)&(np.mgrid[0:H,0:Wd][0]<H*.7)
        ys,xs=np.nonzero(red)
        if len(xs):top=ys.min();sel=ys<top+10;lamp=[int(xs[sel].mean()),int(top-6)]
    if cfg.get('lantern'):
        warm=(a[...,0]>.8)&(a[...,1]>.6)&(a[...,2]<.5)&~sky;ys,xs=np.nonzero(warm)
        if len(xs):sel=rng.choice(len(xs),min(12,len(xs)),replace=False);pts+= [[int(xs[i]),int(ys[i])] for i in sel]
    return pts,lamp
def blocks(H,Wd,cell,seed):
    rng=np.random.default_rng(seed);n=rng.random(((H+cell-1)//cell,(Wd+cell-1)//cell));return np.kron(n,np.ones((cell,cell)))[:H,:Wd]
def season_overlays(loc,a,sky,fol,h,s,v):
    H,Wd=sky.shape;out={}
    if not fol.any():return out
    # 가을: 초록 → 노랑·주황·빨강·갈색 (도트 느낌 유지를 위해 6px 덩어리 단위로 색 고르기)
    n=blocks(H,Wd,6,1);hh=np.select([n<.35,n<.65,n<.85],[38+n*20,22+n*10,8+n*8],28);ss=np.clip(s*1.15+.1,0,1);vv=np.clip(v*(.95+.1*n),0,1)
    rgb=to_hsv_rgb(hh,ss,vv);alpha=fol.astype(float);out['autumn']=(rgb,alpha)
    # 겨울: 식물은 짙은 청록·회색 + 밝은 면(빛 받는 윗면)과 윗가장자리에 눈 (도트 덩어리 단위)
    hh=np.full_like(h,165.0);ss=s*.35;vv=v*.75;rgb=to_hsv_rgb(hh,ss,vv);alpha=fol.astype(float)
    land=~sky;yy=np.mgrid[0:H,0:Wd][0];hzr=np.array([np.nonzero(sky[:,x])[0].max()+1 if sky[:,x].any() else 0 for x in range(Wd)])
    near=land&(yy>hzr[None,:]-2)&(yy<hzr[None,:]+H*.42)                  # 바다·바닥 말고 경치 쪽만
    loc_mean=nd.uniform_filter(v,9);bright=(v>loc_mean+.04)&(s<.75)
    topedge=land&np.roll(sky,2,0)|land&np.roll(sky,1,0)
    dz=blocks(H,Wd,3,5)
    snow=near&((bright&(dz<.75))|topedge|((fol|(s<.25))&(dz<.18)))
    snow=nd.binary_closing(snow,iterations=1)&near
    sn=np.stack([np.full((H,Wd),.94),np.full((H,Wd),.97),np.ones((H,Wd))],-1)*(.9+.1*blocks(H,Wd,2,7)[...,None])
    rgb=np.where(snow[...,None],sn,rgb);alpha=np.maximum(alpha,snow*.95);out['winter']=(rgb,alpha)
    # 봄: 연두·파스텔 + 분홍 꽃 송이
    hh=np.clip(h*.85+15,70,120);ss=s*.75;vv=np.clip(v*1.12+.04,0,1);rgb=to_hsv_rgb(hh,ss,vv);alpha=fol.astype(float)*.85
    rng=np.random.default_rng(9);fl=np.zeros((H,Wd),bool);ys,xs=np.nonzero(fol&(blocks(H,Wd,5,3)<.3))
    cols=np.array([[1,.62,.76],[1,.74,.84],[.96,.5,.68],[1,.88,.93]])
    pk=np.zeros((H,Wd,3))
    for i in rng.choice(len(xs),min(len(xs),16000),replace=False) if len(xs) else []:
        y,x=ys[i],xs[i];c=cols[rng.integers(0,4)];sz=rng.integers(2,5)
        pk[y:y+sz+1,x:x+sz+1]=c;fl[y:y+sz+1,x:x+sz+1]=True
    fl&=fol;rgb=np.where(fl[...,None],pk,rgb);alpha=np.maximum(alpha,fl*1.0);out['spring']=(rgb,alpha)
    return out
def png_b64(arr):
    b=io.BytesIO();Image.fromarray(arr).save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode(),len(b.getvalue())
def webp_b64(rgb,alpha):
    a=np.dstack([np.clip(rgb*255,0,255),np.clip(alpha*255,0,255)]).astype('uint8');b=io.BytesIO();Image.fromarray(a,'RGBA').save(b,'WEBP',quality=80,alpha_quality=70,method=6)
    return 'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode(),len(b.getvalue())
def main():
    src=sys.argv[1];prev=sys.argv[2] if len(sys.argv)>2 else None;d=json.load(open(IP,encoding='utf-8'));meta={}
    for loc in CFG:
        p=os.path.join(src,f'bg_{loc}.png')
        if not os.path.exists(p):continue
        im=Image.open(p).convert('RGB');h0=round(im.height*W/im.width);im=im.resize((W,h0),Image.LANCZOS)
        a,sky,cl,fol,hz,h,s,v=analyze(loc,im)
        mask=np.dstack([nd.gaussian_filter(sky.astype(float),.7)*255,cl*255,fol*255]).astype('uint8')
        d['bgfx_'+loc],nb=png_b64(mask);tot=nb
        ov=season_overlays(loc,a,sky,fol,h,s,v)
        if loc=='reef':ov.pop('winter',None)   # 열대 섬엔 눈 대신 색감만
        for sn,(rgb,al) in ov.items():d[f'bgs_{loc}_{sn}'],n2=webp_b64(rgb,al);tot+=n2
        pts,lamp=lights(loc,a,sky,hz,h,s,v);meta[loc]={'w':W,'h':h0,'hz':int(np.median(hz)),'lights':pts,'lamp':lamp}
        print(loc,'하늘',f'{sky.mean()*100:.0f}%','식물',f'{fol.mean()*100:.1f}%','계절',list(ov),'불빛',len(pts),'등대',lamp,f'{tot//1024}KB',flush=True)
        if prev:
            os.makedirs(prev,exist_ok=True);vis=(a*255).astype('uint8').copy();vis[sky]=(vis[sky]*.4+np.array([255,0,255])*.6).astype('uint8');vis[fol]=(vis[fol]*.5+np.array([255,255,0])*.5).astype('uint8')
            Image.fromarray(vis).resize((800,400)).save(os.path.join(prev,f'mask_{loc}.png'))
            for sn,(rgb,al) in ov.items():
                c=(a*(1-al[...,None])+rgb*al[...,None]);Image.fromarray((c*255).astype('uint8')).resize((800,400)).save(os.path.join(prev,f'season_{loc}_{sn}.png'))
    json.dump(d,open(IP,'w',encoding='utf-8'));json.dump(meta,open(MP,'w',encoding='utf-8'))
if __name__=='__main__':main()
