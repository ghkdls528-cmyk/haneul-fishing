import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
BOT=BOT
async def play(pg,maxs=60):
    await pg.evaluate('__cast(900)');await pg.evaluate("(()=>{__bot(60000)})()")
    for k in range(maxs*4):
        if await pg.evaluate("!!document.querySelector('#reveal.on')"):await pg.mouse.click(200,400)
        s=await pg.evaluate('__t.S')
        if s in('result','fail') and await pg.evaluate("document.getElementById('result').classList.contains('on')||__t.S==='fail'"):return s
        await pg.wait_for_timeout(250)
    return await pg.evaluate('__t.S')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(500);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("window.__noLuck=1;__t.set('lv',30);__t.setGear('r3','e3','l3');__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        # 1 모드 시트 — 4.19에서 낚시 모드 삭제(사용자 요청)로 검사 제외
        # 2 보물: 강제 + 자연
        await pg.evaluate("window.__forceTre='crown'");g0=await pg.evaluate("__t.save().gold")
        s=await play(pg);print('tre forced',s,'name',await pg.evaluate("rName.textContent"),'gold+',await pg.evaluate("__t.save().gold")-g0,'rec',await pg.evaluate("JSON.stringify(__t.save().tre)"))
        await pg.wait_for_timeout(900);await pg.screenshot(path='/tmp/m_tre.png');await pg.click('#bNext');await pg.wait_for_timeout(500)
        cnt={'tre':0,'fish':0}
        for i in range(5):
            s=await play(pg);t=await pg.evaluate("!!(__w.lastRes&&__w.lastRes.tre)");cnt['tre' if t else 'fish']+=1
            if s=='result':
                await pg.wait_for_timeout(800);await pg.click('#bNext');await pg.wait_for_timeout(400)
            else:await pg.wait_for_timeout(800)
        print('treasure mode 5 casts',cnt,'collected',await pg.evaluate("Object.keys(__t.save().tre)"))
        # 3 도감 보물 탭·필터
        await pg.click('[data-open=dex]',force=True);await pg.wait_for_timeout(400);print('dex tre tab (4.25 removed)',await pg.evaluate("!!document.querySelector('#sTabs [data-tab=tre]')"))
        await pg.click('#sTabs [data-tab=all]');await pg.wait_for_timeout(400)
        n_all=await pg.evaluate("document.querySelectorAll('#sbody .grid .cell').length")
        await pg.click('[data-dxr="3"]');await pg.wait_for_timeout(300);n_r3=await pg.evaluate("document.querySelectorAll('#sbody .grid .cell').length")
        await pg.select_option('#dexOwn','got');await pg.wait_for_timeout(300);n_got=await pg.evaluate("document.querySelectorAll('#sbody .grid .cell').length")
        await pg.click('[data-dxr="-1"]');await pg.wait_for_timeout(300);n_got_all=await pg.evaluate("document.querySelectorAll('#sbody .grid .cell').length")
        await pg.fill('#dexQ','고');await pg.wait_for_timeout(300);n_q=await pg.evaluate("[...document.querySelectorAll('#sbody .grid .cell div')].map(d=>d.textContent)")
        print('dex all',n_all,'희귀',n_r3,'희귀+보유',n_got,'보유',n_got_all,'검색 고',n_q,'focus',await pg.evaluate("document.activeElement.id"))
        await pg.fill('#dexQ','');await pg.select_option('#dexOwn','no');await pg.wait_for_timeout(200);await pg.click('#sbody .grid .cell');await pg.wait_for_timeout(500);await pg.screenshot(path='/tmp/m_dexd.png')
        await pg.select_option('#dexOwn','all');await pg.select_option('#dexSort','kg');await pg.wait_for_timeout(300);print('sort kg first',await pg.evaluate("document.querySelector('#sbody .grid .cell div').textContent"))
        await pg.evaluate("document.getElementById('sheet').classList.remove('on','show')");await pg.wait_for_timeout(300)
        # 4 장비 장단점
        await pg.click('[data-open=equip]',force=True);await pg.wait_for_timeout(400);await pg.click('[data-gsel=r1]');await pg.wait_for_timeout(300);print('gear r1',await pg.evaluate("[...document.querySelectorAll('.eff')].pop().innerText"))
        await pg.click('[data-gsel=r5]');await pg.wait_for_timeout(300);print('gear r5',await pg.evaluate("[...document.querySelectorAll('.eff')].pop().innerText"));await pg.screenshot(path='/tmp/m_gear.png')
        await pg.evaluate("document.getElementById('sheet').classList.remove('on','show')");await pg.wait_for_timeout(300)
        # 5 시간 제한 도전 — 4.19에서 삭제(사용자 요청)로 검사 제외
        await pg.reload();await pg.wait_for_timeout(700)
        print('after reload',await pg.evaluate("JSON.stringify([__t.save().mode,__t.save().chal,Object.keys(__t.save().tre).length,__t.save().todaySp.d])"))
        print('errs',errs);await b.close()
asyncio.run(main())
