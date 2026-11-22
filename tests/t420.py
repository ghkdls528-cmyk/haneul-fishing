"""4.20: 영웅 이상 보상·경험치 상향 · 위기 링 0.9초/0.13 · 도감 못 낚은 형태 잠금 · 장식 -1원 표시 · 산 펫 효과 모두 적용 · 펫 대기 모션·선물 · 낚싯배 위치"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(600)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.setGear('r5','e5','l5');__t.set('lv',40);__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        # 보상: 영웅 이상 큰 물고기 골드·경험치
        legend=await pg.evaluate("(()=>{const f=__t.F.find(x=>x.r===5&&!x.boss&&!x.hid);const s=__t.save();s.locs[f.loc[0]]=1;__t.set('loc',f.loc[0]);return f.id})()")
        res=None
        for _ in range(4):
            await pg.evaluate(f"__t.force('{legend}')");await pg.evaluate('__cast(600)');await pg.evaluate('__bot(90000)');await pg.wait_for_timeout(1500)
            if await pg.evaluate("document.getElementById('result').classList.contains('on')"):res=await pg.evaluate("[__w.lastRes.gold,__w.lastRes.xp]");break
            await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
        chk('전설 획득: 골드 1,000 이상·경험치 200 이상',res and res[0]>=1000 and res[1]>=200,str(res))
        if res:await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(300)
        await pg.evaluate("__t.set('loc','pier')")
        # 산 펫 효과: 펫을 데려가지 않아도 수달 골드 +12%
        await pg.evaluate("(()=>{const s=__t.save();s.pets.otter=1;s.pet=''})()")
        g=[]
        for own in [0,0,1]:
            await pg.evaluate(f"__t.save().pets.otter={own};__w.setCombo(0);__t.save().todaySp.ids.mackerel=1;Math.__r=Math.random;Math.random=()=>.5")
            for _ in range(4):
                await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(600)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(1300)
                if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
                await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
            g.append(await pg.evaluate("__w.lastRes.gold"));await pg.evaluate("Math.random=Math.__r");await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(300)
        chk('수달을 사기만 해도(데려가지 않아도) 골드 ↑',g[2]>g[1],str(g))
        # 도감 형태 잠금
        await pg.evaluate("(()=>{const s=__t.save();s.dex.mackerel=2;s.rec.mackerel={locs:['pier'],vars:{'일반형':1},last:null}})()")
        await pg.evaluate("openSheet('dex','all')");await pg.wait_for_timeout(400);await pg.click(".cell[data-f='mackerel']");await pg.wait_for_timeout(400)
        dv=await pg.evaluate("[...document.querySelectorAll('[data-dv]')].map(b=>b.dataset.dv+':'+(b.disabled?0:1))")
        chk('도감: 낚은 형태만 누를 수 있음',dv.count('일반형:1')==1 and sum(1 for x in dv if x.endswith(':1'))==1,str(dv));await pg.evaluate("closeSheet()")
        # 장식 -1원
        await pg.evaluate("openSheet('style','deco')");await pg.wait_for_timeout(400)
        txt=await pg.evaluate("document.getElementById('sbody').innerText");chk('장식: -1원 대신 보상 안내',('-1' not in txt) and ('보스 보상' in txt) and ('도감 완성 보상' in txt),txt[-200:].replace('\n',' '))
        await pg.evaluate("closeSheet()")
        # 펫 대기 모션·선물
        await pg.evaluate("(()=>{const s=__t.save();s.pets.cat=1;s.pet='cat'})()");acts=set()
        for _ in range(40):
            acts.add(await pg.evaluate("__w.PA.a"));await pg.wait_for_timeout(150)
            await pg.evaluate("__w.PA.t=__w.PA.d")
        chk('펫 대기 모션 여러 가지',len(acts)>=4,str(acts))
        g0=await pg.evaluate("__t.save().gold");await pg.evaluate("__w.PA.gT=0");await pg.wait_for_timeout(400)
        chk('펫 선물',await pg.evaluate("__t.save().gold")>g0 and await pg.evaluate("__t.save().st.petGift")==1)
        # 낚싯배: 캐릭터 발이 갑판 아래로
        await pg.evaluate("(()=>{const s=__t.save();s.locs.sea=1;__t.set('loc','sea')})()");await pg.wait_for_timeout(500)
        gg=await pg.evaluate("(()=>{const g=__w.G();return [g.deck,g.platY,g.ch]})()");chk('낚싯배: 캐릭터가 갑판 안(발 위치 0.13배 아래)',gg[0] is not None and abs(gg[1]-gg[0]-gg[2]*.13)<.5,str(gg))
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
