"""4.22: 계절이 게임 속 날짜로 흐름(한 계절 게임 6일) · 계절 바뀜 알림 · 제철 기록 키 · 좁은 화면 상단 줄(칭호 달아도 경험치바 보임)"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH)
        pg=await b.new_page(viewport={'width':384,'height':824},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(500);await pg.click('#bStart');await pg.wait_for_timeout(500)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);delete window.__season")
        si=await pg.evaluate("__w.seasonInfo()");chk('새 게임은 봄 1일째',si['id']=='spring' and si['day']==1 and si['year']==1,str(si))
        D=await pg.evaluate("__w.DAY");n=await pg.evaluate("__w.seaDays")
        seq=[]
        for k in range(5):
            await pg.evaluate(f"__w.gtSet({k*n*D+10})");seq.append(await pg.evaluate("__w.seasonInfo().id+__w.seasonInfo().year"))
        chk('게임 날짜로 봄→여름→가을→겨울→다음 해 봄',seq==['spring1','summer1','autumn1','winter1','spring2'],str(seq))
        # 계절 바뀜 알림: 경계 직전에서 흘려 보내기
        await pg.evaluate(f"__w.gtSet({n*D-0.5})");await pg.wait_for_timeout(400);await pg.evaluate(f"__w.gtSet({n*D+0.5})");await pg.wait_for_timeout(500)
        nt=''
        for _ in range(30):
            nt=await pg.evaluate("document.getElementById('notice').textContent")
            if '여름' in nt:break
            await pg.wait_for_timeout(200)
        chk('계절 바뀌면 알림',('여름' in nt),nt)
        # 제철 기록 키
        await pg.evaluate("__t.setGear('r5','e5','l5')")
        await pg.evaluate("__w.gtSet(10)")
        for _ in range(4):
            await pg.evaluate("__t.force('dodari')");await pg.evaluate('__cast(600)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(1800)
            if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
            await pg.mouse.click(200,500);await pg.wait_for_timeout(500)
        keys=await pg.evaluate("Object.keys(__t.save().seasonLog)");chk('제철 기록: 게임 속 해·계절 키(g1-spring)','g1-spring' in keys,str(keys))
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(300)
        # 정보 창 문구
        await pg.evaluate("openSheet('info')");await pg.wait_for_timeout(300);tx=await pg.evaluate("document.getElementById('sbody').innerText");await pg.evaluate("closeSheet()")
        chk('정보 창: 게임 속 날짜 안내',('게임 속 날짜' in tx) and ('실제 날짜' not in tx),tx[:120].replace('\n',' '))
        # 상단 줄
        for w in [360,384,412,700]:
            await pg.set_viewport_size({'width':w,'height':824});await pg.evaluate("(()=>{const s=__t.save();s.titles['전설의 바다 사냥꾼']=1;s.title='전설의 바다 사냥꾼';__t.set('gold',1234567);__w.hud()})()");await pg.wait_for_timeout(300)
            r=await pg.evaluate("(()=>{const q=s=>document.querySelector(s).getBoundingClientRect();const bar=q('.xpbar'),lv=q('.lvbox'),sm=q('#xpTxt'),g=q('#top .gold'),set=q('#setB');return [bar.width,sm.right<=lv.right+1,lv.right<=g.left,set.right<=innerWidth,document.getElementById('gold').textContent]})()")
            chk(f'폭 {w}: 경험치바 보임·칭호 칸 안·겹침 없음',r[0]>=40 and r[1] and r[2] and r[3],str(r))
        chk('넓은 화면은 골드 전체 숫자',r[4]=='1,234,567',r[4])
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
