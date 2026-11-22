"""4.14: 낚시 방식 6종 + 실제 보스전(보상·평가) 확인 — 실시간"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('lv',40);__t.set('set',Object.assign(__t.save().set,{reveal:'short'}));__t.setGear('r5','e5','l5');const s=__t.save();for(const m of['basic','float','bottom','lure','cast','deep'])s.methods[m]=1;s.locs.rock=1")
        out={}
        for m in ['basic','float','bottom','lure','cast','deep']:
            await pg.evaluate(f"__t.set('method','{m}')");await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(900)')
            for _ in range(400):   # 루어는 기다리는 동안 톡톡
                s=await pg.evaluate('__t.S')
                if s in('bite','hook','fight'):break
                if m=='lure' and s=='wait':await pg.mouse.click(200,500)
                await pg.wait_for_timeout(250 if m=='lure' else 60)
            r=await pg.evaluate('__bot(120000)');sk=await pg.evaluate('__w.lastRes&&__w.lastRes.skill&&[__w.lastRes.f.id,__w.lastRes.skill.total,__w.lastRes.skill.g,+__w.lastRes.skill.t.toFixed(1)]')
            out[m]=[r['r'],sk];print(m,r['r'],sk)
            if r['r']=='result':
                await pg.wait_for_timeout(700);await pg.click('#bNext');await pg.wait_for_timeout(300)
            else:
                await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
        # 보스 (황금 비늘 왕, 갯바위)
        await pg.evaluate("__t.set('method','basic');__t.set('loc','rock');__t.boss('goldking')");await pg.wait_for_timeout(300);await pg.evaluate('__cast(900)')
        r=await pg.evaluate('__bot(200000)');await pg.wait_for_timeout(400)
        bs=await pg.evaluate("(()=>{const s=__t.save();return{win:s.boss.goldking&&s.boss.goldking.win,title:!!s.titles['황금 손'],item:!!s.bobs.goldbob,skill:__w.lastRes&&__w.lastRes.skill&&[__w.lastRes.skill.total,__w.lastRes.skill.g,+__w.lastRes.skill.t.toFixed(1)],rec:s.fightRecords.goldking}})()")
        print('boss',r['r'],r['log'],bs)
        print('methods ok',all(v[0]=='result' for v in out.values()),'boss ok',r['r']=='result' and bs['win']==1 and bs['title'] and bs['item'])
        print('errs',errs);await b.close()
asyncio.run(main())
