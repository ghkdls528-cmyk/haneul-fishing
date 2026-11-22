import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
BOT=BOT
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(500);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("window.__noLuck=1;__t.set('lv',30);__t.setGear('r1','e1','l2');__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        for sid in ['s_shark','s_pirate']:
            await pg.evaluate(f"(()=>{{const st=__w.WSETS.find(s=>s.id==='{sid}');const w=__t.save().ward.wear;if(!st.w.costume)w.costume='none';Object.assign(w,st.w)}})()")
            print(sid,'pxSetOf',await pg.evaluate("__w.pxSetOf(__t.save().ward.wear)"))
            await pg.wait_for_timeout(300);await pg.screenshot(path=f'/tmp/c_{sid}_ready.png')
            await pg.evaluate("__t.force('giantoct')");await pg.evaluate('__cast(900)')
            for i in range(40):
                s=await pg.evaluate('__t.S')
                if s in('bite','hook','fight'):break
                await pg.wait_for_timeout(150)
            await pg.evaluate("(()=>{__bot(60000).then(r=>window.__br=r)})()")
            for i in range(30):
                if await pg.evaluate('__t.S')=='fight':break
                await pg.wait_for_timeout(40)
            await pg.wait_for_timeout(250);await pg.evaluate("__w.notice('테스트 알림: 손맛 중엔 보류돼야 함')");await pg.wait_for_timeout(150)
            info=await pg.evaluate("({busy:document.body.classList.contains('busy'),ban:getComputedStyle(banners).opacity,banN:banners.children.length,notice:document.getElementById('notice').classList.contains('on'),S:__t.S})")
            print(sid,'fight',info);await pg.screenshot(path=f'/tmp/c_{sid}_fight.png')
            for i in range(80):
                if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
                if await pg.evaluate("!!document.querySelector('#reveal.on')"):await pg.mouse.click(200,400)
                await pg.wait_for_timeout(250)
            print('result badges',await pg.evaluate("rBadges.innerText"),'clean',await pg.evaluate("JSON.stringify({c:__w.lastRes&&__w.lastRes.clean,p:__w.lastRes&&__w.lastRes.sweetPct})"))
            await pg.wait_for_timeout(600);print('notice after',await pg.evaluate("document.getElementById('notice').classList.contains('on')"))
            await pg.screenshot(path=f'/tmp/c_{sid}_res.png');await pg.click('#bNext');await pg.wait_for_timeout(500)
        print('errs',errs);await b.close()
asyncio.run(main())
