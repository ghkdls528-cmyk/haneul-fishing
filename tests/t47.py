import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
BOT=BOT
async def nxt(pg):
    for _ in range(14):
        if await pg.evaluate("!!document.querySelector('#reveal.on')"):await pg.mouse.click(200,400)
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.click('#bNext');return
        if await pg.evaluate('__t.S')=='fail':await pg.mouse.click(200,500);return
        await pg.wait_for_timeout(250)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(500);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("__t.set('lv',30);__t.setGear('r4','e4','l4');__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        bo=json.loads(await pg.evaluate("JSON.stringify(bountyOf())"));print('오늘의 대어',bo,await pg.evaluate("__t.FID[bountyOf().id].n"),'loc',await pg.evaluate("__t.FID[bountyOf().id].loc"))
        print('배너',await pg.evaluate("document.getElementById('banners').innerText"))
        # 대어 낚기: 해당 지역으로 이동 후 강제
        loc=(await pg.evaluate("__t.FID[bountyOf().id].loc"))[0]
        await pg.evaluate(f"(()=>{{const s=__t.save();s.loc='{loc}';s.locs['{loc}']=1}})()")
        g0=await pg.evaluate('__t.save().gold');await pg.evaluate(f"__t.force('{bo['id']}')");await pg.evaluate('__cast(900)');await pg.wait_for_timeout(900)
        r=await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(2500);g1=await pg.evaluate('__t.save().gold')
        print('대어 포획',r['r'],'골드',g0,'→',g1,'(+',g1-g0,') done',await pg.evaluate('bountyOf().done'))
        await pg.screenshot(path='/tmp/b1.png');await nxt(pg);await pg.wait_for_timeout(400)
        # 행운 상자: 7마리 더
        await pg.evaluate("(()=>{const s=__t.save();s.loc='pier'})()")
        for i in range(8):
            await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(900)');await pg.wait_for_timeout(700);await pg.evaluate('__bot(40000)');await pg.wait_for_timeout(1700)
            if await pg.evaluate("document.getElementById('luck').classList.contains('on')"):break
            await nxt(pg);await pg.wait_for_timeout(300)
        on=await pg.evaluate("document.getElementById('luck').classList.contains('on')");print('행운 상자 열림',on,'luck',await pg.evaluate('__t.save().luck'))
        await pg.screenshot(path='/tmp/b2.png')
        if on:
            s0=json.loads(await pg.evaluate("JSON.stringify({g:__t.save().gold,gb:__t.save().goldB,lt:0,gt:0,fe:0,xp:__t.save().xp})"))
            await pg.click('.lcard[data-i="1"]');await pg.wait_for_timeout(700);await pg.screenshot(path='/tmp/b3.png')
            s1=json.loads(await pg.evaluate("JSON.stringify({g:__t.save().gold,gb:__t.save().goldB,lt:0,gt:0,fe:0,xp:__t.save().xp})"))
            print('고른 카드',await pg.evaluate("document.querySelectorAll('.lcard em')[1].textContent"),'전',s0,'후',s1)
            await pg.wait_for_timeout(1200);print('닫힘',not await pg.evaluate("document.getElementById('luck').classList.contains('on')"))
        await pg.reload();await pg.wait_for_timeout(500);print('새로고침 후 bounty 유지',await pg.evaluate("JSON.stringify(__t.save().bounty)"))
        print(errs);await b.close()
asyncio.run(main())
