"""HANEUL FISHING 빌드: src/ 모듈 + assets/ 이미지 데이터 → dist/haneul-fishing.html (단일 HTML)
사용법: python build.py"""
import base64,json,glob,os
B=os.path.dirname(os.path.abspath(__file__));A=os.path.join(B,'assets');S=os.path.join(B,'src')
rd=lambda p:open(p,encoding='utf-8').read()
b64=lambda p,m:f'data:{m};base64,'+base64.b64encode(open(p,'rb').read()).decode()
sp={os.path.basename(f)[4:-5]:b64(f,'image/webp') for f in glob.glob(os.path.join(A,'sp2_*.webp'))}
sp['title']=b64(os.path.join(A,'sp','title.webp'),'image/webp')
lab={os.path.basename(f)[8:-4]:b64(f,'image/png') for f in glob.glob(os.path.join(A,'sp2_lab_*.png'))}
# 로드 순서가 중요함 (뒤 모듈이 앞 함수를 감싸서 확장함)
MODS=['00_core.js','01_data.js','04b_doll.js','04c_wear.js','02_save.js','03_sound.js','04_draw_fish.js','04d_fish2.js','04e_pix.js','04f_items.js','05_world.js','06_game.js','06b_gear.js','06c_fun.js','07_drawworld.js','07b_scenes.js','08a_wear.js','08c_pxchar.js','08_drawchar.js','09_ui.js','09b_ui3.js','06d_modes.js','06e_412.js','06f_414.js','06g_fun414.js','06h_safe.js']
js='\n'.join(rd(os.path.join(S,m)) for m in MODS)
for k,v in {'__SPRITES__':json.dumps(sp),'__SLAB__':json.dumps(lab),'__SMETA__':rd(os.path.join(A,'sp2_meta.json')),'__CHARPX__':rd(os.path.join(A,'charpx.json')),'__FISHPX__':rd(os.path.join(A,'fishpx.json')),'__ITEMPX__':rd(os.path.join(A,'itempx.json')),'__OUTFITPX__':rd(os.path.join(A,'outfitpx.json'))}.items():js=js.replace(k,v)
out=rd(os.path.join(S,'head.html'))+'<script>\n{\n'+js+'\n}\n</script>\n</body>\n</html>\n'
os.makedirs(os.path.join(B,'dist'),exist_ok=True)
p=os.path.join(B,'dist','haneul-fishing.html');open(p,'w',encoding='utf-8').write(out)
print('built',p,len(out)//1024,'KB')
