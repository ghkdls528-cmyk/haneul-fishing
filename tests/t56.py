import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(500)
        await pg.evaluate("window.__noLuck=1;const s=__t.save();s.gold=500000;s.lv=30;s.aq.slots=['mackerel','goby','clown','dolddom','octopus'].filter(x=>__t.FID[x]);s.aq.last=Date.now()-3600000")
        print('aq slots',await pg.evaluate("__t.save().aq.slots"))
        await pg.click('[data-open=aq]',force=True);await pg.wait_for_timeout(600)
        b0=await pg.evaluate("document.querySelector('#aqInfo b').textContent")
        await pg.click('[data-aq=feed]');await pg.wait_for_timeout(2500);await pg.screenshot(path='/tmp/feed.png')
        print('bank before',b0,'after',await pg.evaluate("document.querySelector('#aqInfo b').textContent"),'feed st',await pg.evaluate("__t.save().st.feed"),'fed',await pg.evaluate("[__t.save().aq.fedAt>0,__t.save().aq.fedUntil>Date.now()]"))
        await pg.wait_for_timeout(4000);await pg.screenshot(path='/tmp/feed2.png')
        await pg.click('[data-aq=feed]');await pg.wait_for_timeout(300);print('2nd feed st',await pg.evaluate("__t.save().st.feed"))
        await pg.evaluate("document.getElementById('aq').classList.remove('on')")
        # 업적: 구매 후 알림
        await pg.click('[data-open=style]',force=True);await pg.wait_for_timeout(400);await pg.click('[data-ws=pet]');await pg.wait_for_timeout(300)
        await pg.click('[data-wact=petBuy][data-id=cat]');await pg.wait_for_timeout(300)
        await pg.evaluate("document.getElementById('ward').classList.remove('on')");await pg.wait_for_timeout(2500)
        print('spent',await pg.evaluate("__t.save().st.spent"),'notice',await pg.evaluate("document.getElementById('notice').textContent"),'seen',await pg.evaluate("Object.keys(__t.save().achSeen)"))
        await pg.click('[data-open=mission]',force=True);await pg.wait_for_timeout(400)
        tabs=await pg.evaluate("[...document.querySelectorAll('#sTabs button')].map(b=>b.dataset.tab)");print('mission tabs',tabs)
        await pg.click('#sTabs [data-tab=ach]');await pg.wait_for_timeout(400);await pg.screenshot(path='/tmp/ach.png')
        n0=await pg.evaluate("__t.save().gold");await pg.click('[data-act=claimA][data-id=p1]');await pg.wait_for_timeout(300)
        print('claim p1 gold+',await pg.evaluate("__t.save().gold")-n0,'ach',await pg.evaluate("__t.save().ach.p1"))
        await pg.reload();await pg.wait_for_timeout(600);print('after reload',await pg.evaluate("JSON.stringify([__t.save().st.feed,__t.save().st.spent,__t.save().ach.p1,__t.save().aq.fedUntil>0])"))
        print('errs',errs);await b.close()
asyncio.run(main())
