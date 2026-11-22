"""캐릭터 단독 포즈(투명 PNG, character_sNN_failure.png / character_sNN_rest.png) → assets/charpx.json 의 해당 세트 fail / rest 교체
사용법: python tools/import_poses.py <폴더> [--apply]
 - 크기: 그 세트의 기존 같은 포즈 높이에 맞춤(세트 안 다른 포즈와 비율 유지)
 - ax: 몸 아래쪽(다리) 중심 · tip: 휴식 포즈는 낚싯대 끝(가는 부분 중 오른쪽 위 끝)
 - 떨어진 작은 조각 정리(머리 위 소용돌이처럼 큰 건 유지) · webp q74 alpha 60
 - 교체 전 charpx.json 백업(assets/incoming/, git 제외)"""
import base64,glob,io,json,os,re,shutil,sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
B=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));CP=os.path.join(B,'assets','charpx.json')
SET={'s01':'s_basic','s03':'s_knit','s04':'s_denim','s05':'s_stripe','s06':'s_overall','s07':'s_check','s08':'s_track','s09':'s_sweat','s10':'s_sailor','s12':'s_rainpro','s13':'s_vest','s15':'s_summer','s16':'s_deep','s17':'s_exped'}
POSE={'failure':'fail','rest':'rest'}
# 예전 그림 높이가 큰 소용돌이·물웅덩이까지 포함해 기준으로 쓰기 어려운 경우 직접 지정(다른 세트 실패 포즈 평균)
HFIX={('s_basic','fail'):222}
def frame(im,H,rod):
    a=np.array(im);m=a[...,3]>24;lab,k=nd.label(nd.binary_dilation(m,iterations=1))
    if k>1:
        sz=nd.sum(m,lab,range(1,k+1));keep=np.isin(lab,np.nonzero(sz>=.015*sz.max())[0]+1);a[...,3]=np.where(keep,a[...,3],0)
    im=Image.fromarray(a,'RGBA');im=im.crop(im.getchannel('A').point(lambda v:255 if v>10 else 0).getbbox())
    s=H/im.height;w=max(1,round(im.width*s));im=im.resize((w,H),Image.LANCZOS)
    A=np.array(im)[:,:,3]>40;body=nd.binary_erosion(A,iterations=4);by,bx=np.nonzero(body if body.any() else A)
    low=by>by.min()+(by.max()-by.min())*.55;ax=float(bx[low].mean() if low.any() else bx.mean())/w
    tip=None
    if rod:
        thin=A&~nd.binary_dilation(body,iterations=3);ty,tx=np.nonzero(thin)
        if len(tx):i=int(np.argmax(tx*1.0-ty*1.0));tip=[round(tx[i]/w,3),round(ty[i]/H,3)]
    b=io.BytesIO();im.save(b,'WEBP',quality=74,alpha_quality=60,method=6)
    return {'src':'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode(),'ax':round(ax,3),'tip':tip,'w':w,'h':H},im
def run(src,apply):
    d=json.load(open(CP,encoding='utf-8'));done=[]
    for f in sorted(glob.glob(os.path.join(src,'character_s*_*.png'))):
        mm=re.match(r'character_(s\d\d)_(failure|rest)\.png',os.path.basename(f))
        if not mm or mm.group(1) not in SET:print('건너뜀',f);continue
        sid,pose=SET[mm.group(1)],POSE[mm.group(2)];old=d[sid][pose]
        fr,_=frame(Image.open(f).convert('RGBA'),HFIX.get((sid,pose),old['h']),pose=='rest')
        d[sid][pose]=fr;done.append((sid,pose,old['w'],old['h'],fr['w'],fr['h'],fr['ax'],fr['tip']))
    for x in done:print(*x)
    if apply:
        bk=os.path.join(B,'assets','incoming','charpx.backup-before-4.16.1.json')
        if not os.path.exists(bk):shutil.copy(CP,bk);print('백업',bk)
        json.dump(d,open(CP,'w',encoding='utf-8'));print('적용',len(done),'포즈')
if __name__=='__main__':run(sys.argv[1],'--apply' in sys.argv)
