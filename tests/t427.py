"""4.27~4.28 영웅 이상: 변칙 장력(쿵!/휙!·떨림) · 변칙 패턴(소용돌이·연속 당김·죽은 척) · 버티기 보너스 · 광폭화 · 강적 보상 — 봇으로 실제 낚아 보기"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
OUT=os.path.join(os.path.dirname(__file__),'out');os.makedirs(OUT,exist_ok=True)
async def clear(pg):
    for _ in range(40):
        s=await pg.evaluate("__t.S")
        if s=='ready':return
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):
            await pg.wait_for_timeout(500);await pg.click('#bNext');await pg.wait_for_timeout(400);continue
        if s in ('fail','wait','cast'):await pg.wait_for_timeout(600);await pg.mouse.click(200,500)
        await pg.wait_for_timeout(250)
async def to_fight(pg,fid):
    await clear(pg)
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
    for _ in range(100):
        s=await pg.evaluate("__t.S")
        if s in ('result','fail','ready'):break
        await pg.wait_for_timeout(250)
    for _ in range(40):   # 희귀 연출(reveal)은 눌러서 넘김 → 결과 창
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
        if await pg.evaluate("__t.S")!='result':break
        if await pg.evaluate("!!document.querySelector('#reveal.on')"):await pg.mouse.click(200,400)
        await pg.wait_for_timeout(250)
    if await pg.evaluate("document.getElementById('result').classList.contains('on')"):
        g=await pg.evaluate("document.getElementById('rGold').textContent");r=await pg.evaluate("document.getElementById('rRec').textContent")
        await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(400);return 'win',g,r
    s=await pg.evaluate("__t.S");await clear(pg);return s,'',''
KEEP="(()=>{const f=__w.fg;if(!f)return;f.freeT=0;if(f.ten<35)f.ten=50;if(f.ten>80)f.ten=60;f.clutch=0})()"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);errs=[]
        pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(400);await pg.add_script_tag(content=BOT);await pg.click('#bStart');await pg.wait_for_timeout(500)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('lv',60);__t.set('gold',0)")
        await pg.evaluate("__t.setGear('r5','e5','l5')")
        ids=await pg.evaluate("(()=>{const o={};for(const r of [3,4,5,6,7]){const f=__t.F.find(x=>x.r===r&&!x.boss&&x.k!=='chest'&&!x.tre);if(f)o[r]=f.id}return o})()")
        print('fish',ids)
        await to_fight(pg,ids['3']);await pg.wait_for_timeout(2500);chk('★3 이하는 변칙 장력 없음',await pg.evaluate("!__w.h427"))
        await pg.evaluate('__bot(90000)');await finish(pg)
        # ★5: 장력을 가운데로 붙잡아 두고 관찰
        await to_fight(pg,ids['5'])
        for _ in range(30):
            if await pg.evaluate("__t.S")!='fight':break
            await pg.evaluate(KEEP);await pg.wait_for_timeout(100)
        h=await pg.evaluate("__w.h427");chk('★5 변칙: 3초 안에 쿵!/휙! 또는 변칙 패턴',bool(h) and (h['jk']>=1 or h['pats']>=1),json.dumps(h))
        await pg.evaluate("(()=>{const H=__w.h427;if(H){H.np=.01;H.rage=0}})()")
        pat=None
        for _ in range(45):
            if await pg.evaluate("__t.S")!='fight':break
            await pg.evaluate(KEEP+";(()=>{const f=__w.fg;if(f.hp<55)f.hp=80})()");q=await pg.evaluate("__w.h427&&__w.h427.pat&&__w.h427.pat.k")
            if q:pat=q
            await pg.wait_for_timeout(100)
        h=await pg.evaluate("__w.h427");chk('변칙 패턴 발생(소용돌이·연속 당김·죽은 척)',pat in ['swirl','triple','dead'],str(pat))
        chk('패턴 버티면 버티기 보너스 +5%',bool(h) and h['surv']>=1 and await pg.evaluate("__w.h428Bonus()")>=.05,json.dumps(h))
        await pg.screenshot(path=os.path.join(OUT,'t427_pattern.png'))
        for _ in range(20):
            if await pg.evaluate("__t.S")!='fight':break
            await pg.evaluate(KEEP+";__w.fg.hp=45");await pg.wait_for_timeout(120);h=await pg.evaluate("__w.h427")
            if h and h['raged']:break
        chk('★5 체력 50% 아래 광폭화',bool(h) and h['raged']>=1,json.dumps(h))
        await pg.screenshot(path=os.path.join(OUT,'t427_rage.png'))
        if await pg.evaluate("__t.S")=='fight':await pg.evaluate("__w.fg.hp=2")
        await pg.evaluate('__bot(90000)');res=await finish(pg);print('★5 결과',res)
        chk('강적 보상(전설 1.5 + 광폭화 + 버티기) 표시와 버틴 횟수',res[0]=='win' and '강적 보상 ×1.' in res[2] and '번 버팀' in res[2],str(res))
        wins={}
        for r in ['4','5','6','7']:
            if r not in ids:continue
            w=0
            for _ in range(3):
                await to_fight(pg,ids[r]);await pg.evaluate('__bot(90000)');res=await finish(pg)
                if res[0]=='win':w+=1
            wins[r]=w
        print('wins',wins)
        chk('봇(최고 장비)이 영웅~히든을 낚을 수 있음(1번 이상) — 어렵지만 불가능하진 않음',sum(wins.values())>=1,json.dumps(wins))
        mul=await pg.evaluate("__w.H427_MUL");chk('보상 배율 영웅 1.3·전설 1.5·신화 1.7·히든 2.0',mul=={'4':1.3,'5':1.5,'6':1.7,'7':2},json.dumps(mul))
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
