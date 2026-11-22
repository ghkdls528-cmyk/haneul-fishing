import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio
from playwright.async_api import async_playwright
async def tostart(pg,fid='mackerel'):
    await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(900)')
    for k in range(300):
        s=await pg.evaluate('__t.S')
        if s=='bite':await pg.mouse.click(200,500)
        if s=='fight':break
        await pg.wait_for_timeout(30)
    await pg.wait_for_timeout(300)
async def tap_at(pg,target):
    # target phase
    for k in range(400):
        ph=await pg.evaluate("__w.clPhase()")
        if ph>=target:break
        await pg.wait_for_timeout(8)
    await pg.mouse.move(200,500);await pg.mouse.down();await pg.mouse.up()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('lv',30);__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        for name,plan in [('바로 성공',[1.0]),('한 번 빗나가고 성공',[0.6,1.0]),('두 번 빗나감',[0.6,0.6]),('손 안 떼고 계속 누름',None)]:
            await tostart(pg)
            await pg.evaluate("__w.startClutch()")
            if plan is None:
                await pg.mouse.move(200,500);await pg.mouse.down();await pg.wait_for_timeout(900);s1=await pg.evaluate("[__t.S,__w.fg.clutch]");await pg.wait_for_timeout(2500);await pg.mouse.up()
                print(name,'0.9초 뒤',s1,'→',await pg.evaluate("[__t.S,__w.fg.clutch,__w.fg.cMiss]"))
            else:
                for i,t in enumerate(plan):
                    if i==0:
                        await pg.wait_for_timeout(500);await pg.screenshot(path='/tmp/cl_ring.png') if name=='바로 성공' else None
                    await tap_at(pg,t);await pg.wait_for_timeout(120)
                    if name=='한 번 빗나가고 성공' and i==0:await pg.wait_for_timeout(400);await pg.screenshot(path='/tmp/cl_retry.png')
                await pg.wait_for_timeout(300)
                print(name,'→',await pg.evaluate("[__t.S,__w.fg.clutch,__w.fg.cMiss,__w.fg.cWin||0]"))
            # 정리
            for k in range(200):
                s=await pg.evaluate('__t.S')
                if s=='fight':await pg.evaluate("__w.fg.hp=0")
                if await pg.evaluate("!!document.querySelector('#reveal.on')"):await pg.mouse.click(200,400)
                if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.wait_for_timeout(700);await pg.click('#bNext');break
                if s=='fail':await pg.wait_for_timeout(600);await pg.mouse.click(200,500);break
                if s=='ready':break
                await pg.wait_for_timeout(100)
            await pg.wait_for_timeout(600)
        # 자연 발생: 약한 장비로 참다랑어
        await pg.evaluate("__t.setGear('r0','e0','l0')");await tostart(pg,'tuna');await pg.mouse.move(200,500);await pg.mouse.down()
        hit=False
        for k in range(300):
            if await pg.evaluate("__w.fg.clutch>0"):hit=True;break
            if await pg.evaluate("__t.S")!='fight':break
            await pg.wait_for_timeout(50)
        await pg.mouse.up();print('자연 발생 위기',hit)
        if hit:await tap_at(pg,1.0);await pg.wait_for_timeout(300);print(' 자연 위기 탭 →',await pg.evaluate("[__t.S,__w.fg.cWin||0]"))
        print('errs',errs);await b.close()
asyncio.run(main())
