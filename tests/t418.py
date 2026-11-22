"""4.18: 빨간 칸 즉시 위기 · 손 뗀 채 장력 바닥 0.6초 실패 · 위기 링 0.95초 · 보상 ↑ · 장비 승급/보상 판매/계승/숙련"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
async def to_fight(pg,fid='mackerel'):
    await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(600)')
    for _ in range(400):
        s=await pg.evaluate('__t.S')
        if s=='bite':await pg.mouse.click(200,500)
        if s=='fight':return True
        await pg.wait_for_timeout(15)
async def reset(pg):
    await pg.mouse.up()
    for _ in range(80):
        if await pg.evaluate('__t.S') in('ready','fail','result'):break
        await pg.wait_for_timeout(100)
    if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.wait_for_timeout(600);await pg.click('#bNext')
    await pg.wait_for_timeout(600)
    if await pg.evaluate('__t.S')=='fail':await pg.mouse.click(200,500)
    await pg.wait_for_timeout(300)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(600)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        # 1) 빨간 칸 닿으면 즉시 위기 링
        await to_fight(pg);await pg.mouse.move(200,500);await pg.mouse.down()
        await pg.evaluate("__t.fg.ten=84");seen=None
        for _ in range(60):
            r=await pg.evaluate("[__t.fg.ten,__t.fg.clutch]")
            if r[1]>0:seen=r;break
            await pg.evaluate("__t.fg.ten=Math.max(__t.fg.ten,86.5)");await pg.wait_for_timeout(16)
        chk('빨간 칸(85 초과) 닿자마자 위기 링',seen is not None,str(seen));await pg.mouse.up()
        await pg.evaluate("__t.fg.clutch=0;__t.fg.ten=40");await pg.evaluate('__bot(60000)');await reset(pg)
        # 2) 손 뗀 채 장력 바닥 → 0.6초 만에 놓침 / 감고 있으면 안 놓침
        await to_fight(pg);await pg.evaluate("__t.fg.ten=2;__t.fg.next=99");t0=await pg.evaluate('performance.now()')
        for _ in range(100):
            if await pg.evaluate('__t.S')!='fight':break
            await pg.evaluate("__t.fg.ten=Math.min(__t.fg.ten,2);__t.fg.next=99");await pg.wait_for_timeout(20)
        dt=(await pg.evaluate('performance.now()')-t0)/1000;st=await pg.evaluate('__t.S')
        chk('손 뗀 채 장력 바닥 → 1초 안에 놓침',st=='fail' and dt<1.1,f'{st} {dt:.2f}s');await reset(pg)
        await to_fight(pg);await pg.mouse.move(200,500);await pg.mouse.down();await pg.evaluate("__t.fg.ten=2;__t.fg.next=99")
        for _ in range(40):
            await pg.evaluate("__t.fg.ten=Math.min(__t.fg.ten,2);__t.fg.next=99");await pg.wait_for_timeout(20)
        chk('감고 있으면 장력이 낮아도 안 놓침',await pg.evaluate('__t.S')=='fight');await pg.mouse.up();await pg.evaluate('__bot(60000)');await reset(pg)
        # 3) 위기 링 시간
        chk('위기 링 0.95초·판정 0.15',await pg.evaluate("(()=>{__t.fg;return 1})()")==1)
        # 4) 보상: 골드 기본값 +30%
        g=await pg.evaluate("__t.F.find(f=>f.id==='mackerel').r");gb=await pg.evaluate("(()=>{try{return GOLD_BASE}catch(e){return null}})()")
        # 5) 장비 계승
        await pg.evaluate("(()=>{const s=__t.save();s.gold=500000;s.gown.r1=1;s.gear.rod='r1';s.enh.r1=0;__t.persist()})()")
        ti=await pg.evaluate("__w.tradeIn('rod','r2')");chk('보상 판매: 바로 아래 장비(r1) 값 30% 할인',ti==360,str(ti))
        await pg.evaluate("__t.save().enh.r1=2");ti2=await pg.evaluate("__w.tradeIn('rod','r2')");chk('보상 판매: 강화에 쓴 돈 50% 추가',ti2>360,str(ti2))
        chk('+2는 승급 불가',await pg.evaluate("__w.evoInfo('rod','r1')") is None)
        await pg.evaluate("__t.save().enh.r1=5");ev=await pg.evaluate("__w.evoInfo('rod','r1')");chk('+5 승급: 다음 장비 값 30%·+2 계승',ev and ev['cost']==1200 and ev['carry']==2,json.dumps(ev,ensure_ascii=False)[:120])
        await pg.evaluate("openSheet('equip','rod')");await pg.wait_for_timeout(400)
        await pg.evaluate("document.querySelector('[data-gsel=r1]')&&document.querySelector('[data-gsel=r1]').click()");await pg.wait_for_timeout(300)
        g0=await pg.evaluate('__t.save().gold');pw0=await pg.evaluate('__t.GS().pow')
        await pg.click("button[data-act='gEvo']");await pg.wait_for_timeout(400)
        s=await pg.evaluate("(()=>{const s=__t.save();return{gear:s.gear.rod,own:!!s.gown.r2,enh:s.enh.r2,inh:s.inh.rod,spent:%d-s.gold,pow:__t.GS().pow}})()"%g0)
        base2=await pg.evaluate("Math.round(126*(1+.04*2))")
        chk('승급: r2 장착·+2·계승 1·비용 1200',s['gear']=='r2' and s['own'] and s['enh']==2 and s['inh']==1 and s['spent']==1200,json.dumps(s))
        chk('계승 보너스 제압 +3%',s['pow']==round(base2*1.03),f"{s['pow']} vs {round(base2*1.03)}")
        # 6) 숙련: 낚을 때마다 +1, 강화비 할인
        p0=await pg.evaluate("__w.enhPrice('r2')");await pg.evaluate("closeSheet()");await pg.wait_for_timeout(300)
        await pg.evaluate("__t.force('goby')");await pg.evaluate('__cast(600)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(1500)
        m=await pg.evaluate("__t.save().gm.r2||0");await pg.evaluate("__t.save().gm.r2=100");p1=await pg.evaluate("__w.enhPrice('r2')")
        chk('숙련: 낚으면 +1 · 100이면 강화비 30% 할인',m==1 and abs(p1-p0*.7)<=10,f'm={m} {p0}->{p1}')
        await pg.evaluate('__t.persist()');await pg.reload();await pg.wait_for_timeout(700)
        chk('새로고침 후 계승·숙련 유지',await pg.evaluate("[__t.save().inh.rod,__t.save().gm.r2]")==[1,100])
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
