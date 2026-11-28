"""4.28 상단 줄: 칭호는 레벨 칸 안 첫 줄(길면 글자 줄임 → 그래도 넘치면 흘러가기) · 경험치바 안에 % · 상단 칸 높이 통일 · 좁은 폰 겹침 없음"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
OUT=os.path.join(os.path.dirname(__file__),'out');os.makedirs(OUT,exist_ok=True)
GEO="""(()=>{const g=s=>document.querySelector(s).getBoundingClientRect();const pills=[...document.querySelectorAll('#top .pill'),document.getElementById('setB')].map(e=>e.getBoundingClientRect());
 const hs=pills.map(r=>Math.round(r.height)),tops=pills.map(r=>Math.round(r.top));let ov=false;for(let i=1;i<pills.length;i++)if(pills[i].left<pills[i-1].right-1)ov=true;
 const bar=g('.xpbar'),pc=g('#xpPct'),lb=g('.lvbox');return{hs,tops,ov,right:Math.round(pills[pills.length-1].right),W:innerWidth,bar:Math.round(bar.width),pcIn:pc.left>=bar.left-1&&pc.right<=bar.right+1,barIn:bar.right<=lb.right,...__w.top428()}})()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);errs=[]
        for w in [360,384,412,700]:
            pg=await b.new_page(viewport={'width':w,'height':820});pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(400);await pg.click('#bStart');await pg.wait_for_timeout(600)
            for t,lv,gold in [('전설의 황금참돔 왕 사냥꾼',7,530),('탐험가',42,1234567),('바다의 지배자 사냥꾼',123,98765432),('',15,2000)]:
                await pg.evaluate(f"__t.set('lv',{lv});__t.set('gold',{gold});__t.save().title='{t}';hud()");await pg.wait_for_timeout(350)
                q=await pg.evaluate(GEO)
                good=q['inBox'] and len(set(q['hs']))==1 and len(set(q['tops']))==1 and not q['ov'] and q['right']<=q['W'] and q['bar']>=40 and q['pcIn'] and q['barIn'] and q['fs']>=9.5 and (q['marq'] or q['over']<=1)
                if t=='' :good=good and '/' in q['txt']
                if w>=412 and t:good=good and not q['marq']   # 보통 폭에서는 흘러가지 않고 다 보임
                chk(f'폭 {w} · 칭호 「{t or "없음"}」 Lv{lv}: 칸 안·높이 통일·겹침 없음',good,str({k:q[k] for k in ['hs','ov','bar','fs','marq','over','inBox','txt']}))
            await pg.evaluate("__t.set('lv',42);__t.set('gold',1234567);__t.save().title='전설의 황금참돔 왕 사냥꾼';hud()");await pg.wait_for_timeout(400)
            await pg.screenshot(path=os.path.join(OUT,f't428_{w}.png'),clip={'x':0,'y':0,'width':w,'height':90})
            await pg.close()
        # 4.28 행운 뽑기: 천장·행운 포인트·버프 4시간
        pg=await b.new_page(viewport={'width':390,'height':844});pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(400);await pg.click('#bStart');await pg.wait_for_timeout(500)
        await pg.evaluate("window.__noLuck=1;__t.set('lv',30)")
        r=await pg.evaluate("(()=>{const s=__t.save();s.gpity={n10:9,n50:0,pt:0};const t0=Object.keys(s.tre).length;const x=__w.gachaRoll(1000);return [x.pity||0,x.t,s.gpity.n10,s.gpity.pt]})()")
        chk('10번째 뽑기(대박 없이) → 보물 천장 확정',r[0]==1 and '천장 보물' in r[1] and r[2]==0 and r[3]==1,str(r))
        r=await pg.evaluate("(()=>{const s=__t.save();s.gpity={n10:0,n50:49,pt:0};const g0=s.gold;const x=__w.gachaRoll(1000);return [x.x,s.gold-g0,s.gpity.n50]})()")
        chk('50번째 뽑기 → ×10 천장 대박',r[0]==10 and r[1]==10000 and r[2]==0,str(r))
        ev=await pg.evaluate("(()=>{const s=__t.save();let g=0;const n=4000,g0=s.gold,lv=s.lv,xp=s.xp;s.gpity={n10:0,n50:0,pt:0};for(let i=0;i<n;i++){const b0=s.gold;__w.gachaRoll(1000);g+=s.gold-b0;s.lv=lv;s.xp=xp}s.gold=g0;return g/n/1000})()")
        chk('뽑기 골드 기대값(천장 포함) 0.8~1.05 — 날리지도, 돈 복사도 아님',.8<=ev<=1.05,f'{ev:.3f}')
        await pg.evaluate("(()=>{const s=__t.save();s.gold=5e7;s.gpity={n10:0,n50:0,pt:120};s.buf={rare:0,gold:0,bite:0}})()");await pg.evaluate("openSheet('equip','shop')");await pg.wait_for_timeout(400)
        tx=await pg.evaluate("document.getElementById('sbody').innerText");chk('상점에 천장 막대·행운 포인트 교환',all(k in tx for k in ['보물 천장','대박 천장','행운 포인트','120점']),'')
        await pg.screenshot(path=os.path.join(OUT,'t428_gacha.png'))
        await pg.click("[data-gpx='gold']");await pg.wait_for_timeout(300);await pg.click("[data-gpx='jack']");await pg.wait_for_timeout(500)
        r=await pg.evaluate("[__t.save().gpity.pt,Math.round(__t.save().buf.gold)]");chk('포인트 교환: 버프 30분(20점)·×10 대박(100점)',r[0]==0 and 1790<r[1]<=1800,str(r))
        bb=await pg.evaluate("(()=>{const s=__t.save();s.buf.rare=0;for(let i=0;i<40;i++){const c=document.querySelector(\"[data-shop='b_rare']\");if(c)c.click()}return Math.round(s.buf.rare)})()")
        chk('버프 겹쳐 사면 최대 4시간(14400초)',bb==14400,str(bb))
        await pg.evaluate("persist()");await pg.reload();await pg.wait_for_timeout(600)
        sv=await pg.evaluate("JSON.parse(localStorage.getItem('haneul-fish-v4'))");chk('천장·포인트·4시간 버프 저장',sv['buf']['rare']>14000 and 'gpity' in sv,json.dumps(sv.get('gpity')))
        await pg.close()
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
