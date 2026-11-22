"""보물 그림(투명 PNG) → 긴 변 128px webp → assets/itempx.json 의 tre_<보물id>
사용법: python tools/import_tre.py <폴더>
게임은 itempx.json에 tre_<id>가 있으면 그 그림을, 없으면 기존 코드 그림(drawTreasure)을 그린다(06i_tre415.js)."""
import base64,io,json,os,sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
B=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));P=os.path.join(B,'assets','itempx.json')
# 파일 → 보물 id (기존 보물과 같은 물건은 그 id, 새 물건은 새 id)
MAP={'treasure_chest_old':'goldchest','treasure_compass_ancient':'compass','treasure_jewel_crown':'crown','treasure_map_bottle':'letter','treasure_pearl':'pearl',
     'treasure_coin_pouch':'pouch','treasure_ship_bell':'bell','treasure_coral_ornament':'coral','treasure_hourglass':'hourglass','treasure_gold_fish':'goldfish'}
src=sys.argv[1];d=json.load(open(P,encoding='utf-8'))
for f,tid in MAP.items():
    im=Image.open(os.path.join(src,f+'.png')).convert('RGBA');a=np.array(im)
    if a[...,3].min()>200:raise SystemExit(f'{f}: 투명 배경이 아님')
    m=a[...,3]>24;lab,k=nd.label(nd.binary_dilation(m,iterations=2))          # 떨어진 작은 반짝이 정리
    if k>1:
        sz=nd.sum(m,lab,range(1,k+1));keep=np.isin(lab,np.nonzero(sz>=.03*sz.max())[0]+1);a[...,3]=np.where(keep,a[...,3],0)
    im=Image.fromarray(a,'RGBA');im=im.crop(im.getchannel('A').point(lambda v:255 if v>10 else 0).getbbox())
    s=128/max(im.size);im=im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))),Image.LANCZOS)
    b=io.BytesIO();im.save(b,'WEBP',quality=82,alpha_quality=80,method=6)
    d['tre_'+tid]='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode();print('tre_'+tid,im.size,len(b.getvalue())//1024,'KB')
json.dump(d,open(P,'w',encoding='utf-8'))
