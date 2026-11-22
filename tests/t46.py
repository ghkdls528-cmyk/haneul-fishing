import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio
from playwright.async_api import async_playwright
BOT=BOT
async def shotflow(pg,tag):
    await pg.wait_for_timeout(600);await pg.screenshot(path=f'/tmp/q_{tag}_0.png',clip={'x':0,'y':120,'width':390,'height':420})
    await pg.mouse.move(200,500);await pg.mouse.down();await pg.wait_for_timeout(700);await pg.screenshot(path=f'/tmp/q_{tag}_1.png',clip={'x':0,'y':120,'width':390,'height':420});await pg.mouse.up()
    await pg.wait_for_timeout(250);await pg.screenshot(path=f'/tmp/q_{tag}_2.png',clip={'x':0,'y':120,'width':390,'height':420})
    await pg.wait_for_timeout(2500)
    if await pg.evaluate('__t.S') in ('wait','bite'):await pg.mouse.click(200,500)
    await pg.wait_for_timeout(1200)
    if await pg.evaluate('__t.S')!='ready':await pg.mouse.click(200,500);await pg.wait_for_timeout(600)
    await pg.evaluate("__t.force('chamdom')");await pg.evaluate('__cast(900)');await pg.wait_for_timeout(900)
    for _ in range(60):
        s=await pg.evaluate('__t.S')
        if s=='bite':await pg.mouse.click(200,500)
        if s=='fight':break
        await pg.wait_for_timeout(100)
    await pg.mouse.down();await pg.wait_for_timeout(500);await pg.screenshot(path=f'/tmp/q_{tag}_3.png',clip={'x':0,'y':120,'width':390,'height':420});await pg.mouse.up()
    r=await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(700);await pg.screenshot(path=f'/tmp/q_{tag}_4.png',clip={'x':0,'y':120,'width':390,'height':420})
    for _ in range(12):
        if await pg.evaluate("!!document.querySelector('#reveal.on')"):await pg.mouse.click(200,400)
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.click('#bNext');break
        await pg.wait_for_timeout(300)
    await pg.wait_for_timeout(500);return r['r']
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(500);await pg.click('#bStart')
        await pg.evaluate("__t.set('lv',60);__t.setGear('r3','e3','l3')")
        print('basic',await shotflow(pg,'basic'))
        for sid in ['s_pirate','s_knit']:
            await pg.evaluate(f"(()=>{{const st=__w.WSETS.find(s=>s.id==='{sid}');const w=__t.save().ward.wear;if(!st.w.costume)w.costume='none';Object.assign(w,st.w)}})()")
            print(sid,await shotflow(pg,sid))
        print(errs);await b.close()
asyncio.run(main())
