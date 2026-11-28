"""4.27 영웅 이상 변칙 장력(쿵!/휙!·떨림)·광폭화·보상 상향 — 봇으로 실제 낚아 보기"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
OUT=os.path.join(os.path.dirname(__file__),'out');os.makedirs(OUT,exist_ok=True)
async def to_fight(pg,fid):
    await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(600)')
    for _ in range(150):
        if await pg.evaluate("__t.S")=='bite':break
        await pg.wait_for_timeout(60)
    await pg.mouse.move(200,500);await pg.mouse.down();await pg.wait_for_timeout(60);await pg.mouse.up()
    for _ in range(60):
        if await pg.evaluate("__t.S")=='fight':return True
        await pg.wait_for_timeout(30)
    return False
async def finish(pg):
    for _ in range(80):
        s=await pg.evaluate("__t.S")
        if s in ('result','fail','ready'):break
        await pg.wait_for_timeout(250)
    s=await pg.evaluate("__t.S")
    if await pg.evaluate("document.getElementById('result').classList.contains('on')"):
        g=await pg.evaluate("document.getElementById('rGold').textContent");r=await pg.evaluate("document.getElementById('rRec').textContent")
        await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(400);return 'win',g,r
    await pg.wait_for_timeout(1200);await pg.mouse.click(200,500);await pg.wait_for_timeout(500);return s,'',''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);errs=[]
        pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(400);await pg.add_script_tag(content=BOT);await pg.click('#bStart');await pg.wait_for_timeout(500)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('lv',60);__t.set('gold',0)")
        await pg.evaluate("__t.setGear('r5','e5','l5')")
        ids=await pg.evaluate("(()=>{const o={};for(const r of [3,4,5,7]){const f=__t.F.find(x=>x.r===r&&!x.boss&&x.k!=='chest'&&!x.tre);if(f)o[r]=f.id}return o})()")
        print('fish',ids)
        # ★3은 변칙 없음
        await to_fight(pg,ids['3']);await pg.wait_for_timeout(2500);chk('★3 이하는 변칙 장력 없음',await pg.evaluate("!__w.h427"))
        await pg.evaluate('__bot(90000)');res=await finish(pg)
        # ★5: 변칙 + 광폭화 + 봇이 낚을 수 있는지
        await to_fight(pg,ids['5']);await pg.evaluate('__bot(90000)')
        tens=[]
        for _ in range(40):
            tens.append(await pg.evaluate("__w.fg.ten"));await pg.wait_for_timeout(100)
            if await pg.evaluate("__t.S")!='fight':break
        h=await pg.evaluate("__w.h427");chk('★5 변칙 장력: 쿵!/휙! 발생',h and h['jk']>=1,json.dumps(h))
        await pg.evaluate("__w.fg.hp=45");await pg.wait_for_timeout(300);h=await pg.evaluate("__w.h427");chk('★5 체력 50% 아래 광폭화',h and h['raged']==1,json.dumps(h))
        await pg.screenshot(path=os.path.join(OUT,'t427_rage.png'))
        res=await finish(pg);print('★5 결과',res)
        chk('★5 광폭화 버티면 보상 ×1.6 표시',res[0]!='win' or '×1.6' in res[2],str(res))
        # 실제로 낚을 수 있는지(봇, 장비 최고): 영웅·전설·히든 각 2번
        wins={}
        for r in ['4','5','7']:
            if r not in ids:continue
            w=0
            for _ in range(4):
                await to_fight(pg,ids[r]);await pg.evaluate('__bot(90000)');res=await finish(pg)
                if res[0]=='win':w+=1;rr=res[2]
            wins[r]=w
        print('wins',wins)
        chk('봇(최고 장비)이 영웅~히든을 낚을 수 있음(12번 중 3번 이상) — 사람은 신호를 보고 더 잘 함',sum(wins.values())>=3,json.dumps(wins))
        # 보상: 광폭화 버티고 낚으면 ×1.6 · 영웅은 ×1.3
        got=None
        for _ in range(3):
            await to_fight(pg,ids['5']);await pg.evaluate('__bot(90000)');await pg.wait_for_timeout(1700)
            if await pg.evaluate("__t.S")=='fight':
                await pg.evaluate("__w.fg.hp=45");await pg.wait_for_timeout(400);await pg.evaluate("__w.fg.hp=2")
            res=await finish(pg)
            if res[0]=='win':got=res;break
        chk('전설 광폭화 버티고 낚으면 강적 보상 ×1.6',got is not None and '×1.6' in got[2],str(got))
        got=None
        for _ in range(3):
            await to_fight(pg,ids['4']);await pg.evaluate('__bot(90000)');await pg.wait_for_timeout(1700)
            if await pg.evaluate("__t.S")=='fight':await pg.evaluate("__w.fg.hp=2")
            res=await finish(pg)
            if res[0]=='win':got=res;break
        chk('영웅 강적 보상 ×1.3',got is not None and '×1.3' in got[2],str(got))
        mul=await pg.evaluate("__w.H427_MUL");chk('보상 배율 영웅 1.3·전설 1.5·신화 1.7·히든 2.0',mul=={'4':1.3,'5':1.5,'6':1.7,'7':2},json.dumps(mul))
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
