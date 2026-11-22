"""낚시터 배경 그림(2048x1024 PNG 등)을 webp로 줄여 assets/itempx.json 의 bg_<낚시터id> 에 넣는다.
사용법: python tools/import_bg.py <배경 폴더>   (파일 이름: bg_pier.png, bg_rock.png ...)
게임은 itempx.json에 bg_<id>가 있으면 그 그림을, 없으면 기존 코드 그림을 그린다(07_drawworld.js drawFar)."""
import base64,glob,io,json,os,sys
from PIL import Image
B=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));P=os.path.join(B,'assets','itempx.json')
LOCS={'pier','rock','light','valley','lake','sea','reef','ice','deep','moon'}
W,Q=1600,80   # 휴대폰 화면(세로)에서 하늘 높이 기준 충분한 크기 · 10장 합계 약 1.2MB
src=sys.argv[1];d=json.load(open(P,encoding='utf-8'));n=0
for f in sorted(glob.glob(os.path.join(src,'bg_*.*'))):
    k=os.path.splitext(os.path.basename(f))[0]
    if k[3:] not in LOCS:print('건너뜀(낚시터 이름 아님):',f);continue
    im=Image.open(f).convert('RGB');h=round(im.height*W/im.width);im=im.resize((W,h),Image.LANCZOS)
    b=io.BytesIO();im.save(b,'WEBP',quality=Q,method=6)
    d[k]='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode();n+=1;print(k,im.size,len(b.getvalue())//1024,'KB')
json.dump(d,open(P,'w',encoding='utf-8'))  # 기존 파일과 같은 형식
print('적용',n,'장 →',P)
