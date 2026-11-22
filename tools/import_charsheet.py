"""캐릭터 의상 시트(26칸, 검은 배경) → assets/charpx.json 세트 프레임 교체 (4.6 방식)
사용법: python tools/import_charsheet.py <시트 폴더> <미리보기 폴더> [--apply]
 시트 구조: 1줄 8칸 idle wink walk run jump sit surprise happy
           2줄 6칸 prep castready cast wait hook reel
           3줄 6칸 (게임에서 안 씀 → 버림)
           4줄 6칸 fight lift success fail (5번째 칸 버림) rest
 - 줄: 가로 투영의 빈 곳으로 나눔 · 칸: 몸통(굵은 부분) 중심을 찾아 조각을 가장 가까운 몸통에 붙임(넓은 던지기 칸이 안 잘림)
 - 배경 제거: 검은 배경이 아닌 부분 + 그 안의 구멍을 채운 실루엣 알파(검은 옷·모자 보존). 바깥과 이어진 다리 사이 배경은 지워짐
 - 몸통에서 떨어진 작은 조각(반짝이·느낌표·땀방울)은 지움
 - idle 높이 240px 기준으로 세트 전체를 같은 비율로 줄임 · webp q74 alpha 60 · ax(발 중심)·tip(낚싯대 끝) 계산
 - KEEP: 기존 프레임을 그대로 두는 포즈 (fail은 웃는 그림인 세트만, rest는 노을 액자 그림이라 전부)"""
import base64,io,json,os,sys,shutil
import numpy as np
from PIL import Image
from scipy import ndimage as nd
B=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));CP=os.path.join(B,'assets','charpx.json')
MAP={'s03':'s_knit','s04':'s_denim','s05':'s_stripe','s06':'s_overall','s07':'s_check','s08':'s_track','s09':'s_sweat','s10':'s_sailor','s12':'s_rainpro','s13':'s_vest','s15':'s_summer','s16':'s_deep','s17':'s_exped'}
SAD_FAIL=set()   # 4번째 줄 4칸(fail)은 모든 세트가 '잡은 물고기 옆에 선' 그림이라 실패 장면에 안 맞음 → 전부 기존 fail 유지 (4.14.6)
ROWS=[['idle','wink','walk','run','jump','sit','surprise','happy'],['prep','castready','cast','wait','hook','reel'],None,['fight','lift','success','fail',None,'rest']]
ROD={'prep','castready','cast','wait','hook','reel','fight'}
BG=14   # 이 밝기 이하 = 검은 배경
def bands(m):
    p=m.sum(1)>2;out=[];y=0;H=len(p)
    while y<H:
        if p[y]:
            y0=y
            while y<H and p[y]:y+=1
            if y-y0>40:out.append((y0,y))
        else:y+=1
    return out
def cut_row(img,m,y0,y1,n):
    mm=m[y0:y1];body=nd.binary_erosion(mm,iterations=6)          # 몸통(가는 낚싯대·줄은 사라짐)
    col=nd.uniform_filter1d(body.sum(0).astype(float),25);W=len(col)
    # 몸통 덩어리 n개 찾기: 몸통 연결 요소 중 큰 것 n개의 중심
    # 칸은 대략 고르게 놓여 있음 → 고른 간격 위치에서 시작해 주변 몸통 무게중심으로 2번 보정
    xs_all=np.arange(W);cx=[(i+.5)*W/n for i in range(n)]
    for _ in range(2):
        cx=[float((xs_all*col)[max(0,int(c-W/n/2)):int(c+W/n/2)].sum()/max(1e-6,col[max(0,int(c-W/n/2)):int(c+W/n/2)].sum())) for c in cx]
    # 몸통 덩어리(굵은 부분)를 가장 가까운 중심에 배정 → 그 칸의 '몸'
    lab,k=nd.label(body);own=np.zeros(k+1,int)
    for j in range(1,k+1):own[j]=int(np.argmin([abs(float(nd.center_of_mass(body,lab,j)[1])-c) for c in cx]))
    lab2,k2=nd.label(nd.binary_dilation(mm,iterations=2))
    cells=[np.zeros_like(mm) for _ in range(n)]
    for i in range(1,k2+1):
        part=(lab2==i)&mm;ys,xs=np.nonzero(part)
        if len(xs)==0:continue
        # 조각 안에 몸통이 있으면 그 몸통 칸으로(가장 많이 겹친 칸), 없으면(낚싯대 끝·줄 조각) 가장 가까운 중심으로
        hits=np.bincount(own[lab[part]][lab[part]>0],minlength=n) if (lab[part]>0).any() else None
        if hits is not None and hits.sum()>0:
            # 두 캐릭터가 낚싯대로 이어진 경우: 칸 경계(중심 사이 가운데)로 나눔
            if (hits>0).sum()>1:
                bnd=[(cx[q]+cx[q+1])/2 for q in range(n-1)];colc=np.searchsorted(bnd,xs)
                for q in range(n):
                    sel=colc==q
                    if sel.any():cells[q][ys[sel],xs[sel]]=True
                continue
            c=int(np.argmax(hits))
        else:c=int(np.argmin([abs(xs.mean()-x) for x in cx]))
        cells[c]|=part
    return cells
def clean(cell,rgb):
    # 실루엣 채우기: 구멍 채운 뒤, 큰 '순수 검정' 구멍(다리 사이 등)은 다시 비움
    filled=nd.binary_fill_holes(cell);holes=filled&~cell;lab,k=nd.label(holes);out=filled.copy()
    mx=rgb.max(2)
    for i in range(1,k+1):
        h=lab==i
        if h.sum()>120 and mx[h].mean()<8:out[h]=False
    # 몸통에서 떨어진 작은 조각 제거
    lab,k=nd.label(nd.binary_dilation(out,iterations=1));   # 1px만 이어 붙임: 머리 가까이 떠 있는 '!'·반짝이도 떨어진 조각으로 봄
    if k>1:
        sz=nd.sum(out,lab,range(1,k+1));main=int(np.argmax(sz))+1;keep=lab==main
        for i in range(1,k+1):
            if i!=main and sz[i-1]>=.08*sz[main-1]:keep|=lab==i   # 큰 조각(물보라 등)은 유지
        out&=keep
    a=nd.gaussian_filter(out.astype(float),.6);return np.clip(a*255,0,255).astype(np.uint8)
def frame(rgb,alpha,k,rod):
    ys,xs=np.nonzero(alpha>20);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    im=Image.fromarray(np.dstack([rgb,alpha])[y0:y1,x0:x1],'RGBA');w,h=max(1,round((x1-x0)*k)),max(1,round((y1-y0)*k));im=im.resize((w,h),Image.LANCZOS)
    A=np.array(im)[:,:,3]>40;body=nd.binary_erosion(A,iterations=max(2,round(5*k*2)));by,bx=np.nonzero(body if body.any() else A)
    low=by>by.min()+(by.max()-by.min())*.55;ax=float(bx[low].mean() if low.any() else bx.mean())/w   # 몸 아래쪽(다리) 중심
    tip=None
    if rod:
        thin=A&~nd.binary_dilation(body,iterations=3);ty,tx=np.nonzero(thin)
        if len(tx):i=int(np.argmax(tx*1.0-ty*1.0));tip=[round(tx[i]/w,3),round(ty[i]/h,3)]
    b=io.BytesIO();im.save(b,'WEBP',quality=74,alpha_quality=60,method=6)
    return {'src':'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode(),'ax':round(ax,3),'tip':tip,'w':w,'h':h},im
def run(src,prev,apply):
    os.makedirs(prev,exist_ok=True);d=json.load(open(CP,encoding='utf-8'));new={}
    for code,sid in MAP.items():
        rgb=np.array(Image.open(os.path.join(src,f'set_{code}.png')).convert('RGB'));m=rgb.max(2)>BG
        bs=bands(m);assert len(bs)==4,(code,bs)
        frames={};crops={}
        for r,(y0,y1) in enumerate(bs):
            names=ROWS[r]
            if not names:continue
            cells=cut_row(rgb,m,y0,y1,len(names))
            for nm,cm in zip(names,cells):
                if nm is None:continue
                if nm=='rest' or (nm=='fail' and code not in SAD_FAIL):continue
                crops[nm]=(clean(cm,rgb[y0:y1]),rgb[y0:y1])
        ia=crops['idle'][0];ys=np.nonzero(ia>20)[0];k=240/(ys.max()-ys.min()+1)
        for nm,(a,c) in crops.items():
            fr,im=frame(c,a,k,nm in ROD);frames[nm]=(fr,im)
        out={}
        for nm in d[sid]:out[nm]=frames[nm][0] if nm in frames else d[sid][nm]   # 순서·키 유지, 없는 건 기존 유지
        new[sid]=out
        # 확인용 19포즈 시트
        P=list(d[sid].keys());W=150;sheet=Image.new('RGBA',(W*10,2*290),(200,222,255,255))
        from PIL import ImageDraw;dr=ImageDraw.Draw(sheet)
        for i,nm in enumerate(P):
            f=out[nm];im=Image.open(io.BytesIO(base64.b64decode(f['src'].split(',')[1]))).convert('RGBA');s=min((W-6)/im.width,250/im.height,1.0)
            im=im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))));x,y=(i%10)*W,(i//10)*290;sheet.alpha_composite(im,(x+3,y+20+250-im.height))
            dr.text((x+3,y+3),nm+(' (기존)' if nm not in frames else ''),fill=(0,0,0) if nm in frames else (200,0,0))
            if f.get('tip'):tx,ty=x+3+f['tip'][0]*im.width,y+20+250-im.height+f['tip'][1]*im.height;dr.ellipse((tx-4,ty-4,tx+4,ty+4),outline=(255,0,0),width=2)
            ax=x+3+f['ax']*im.width;dr.line((ax,y+262,ax,y+272),fill=(0,140,0),width=3)
        sheet.convert('RGB').save(os.path.join(prev,f'{sid}.png'));print(sid,'new',sorted(frames),'kept',[n for n in P if n not in frames])
    if apply:
        bk=os.path.join(B,'assets','incoming','charpx.backup-before-4.14.4.json')
        if not os.path.exists(bk):shutil.copy(CP,bk);print('백업',bk)
        d.update(new);json.dump(d,open(CP,'w',encoding='utf-8'));print('charpx.json 교체 완료',len(new),'세트')
if __name__=='__main__':run(sys.argv[1],sys.argv[2],'--apply' in sys.argv)
