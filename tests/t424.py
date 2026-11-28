"""4.24 출시 준비: 휴대폰 뒤로 가기 → 메뉴만 닫힘 · 세이브 코드로 기록 옮기기 · 앱(WebView)에서 '앱 안 브라우저' 경고 안 뜸"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
OUT=os.path.join(os.path.dirname(__file__),'out');os.makedirs(OUT,exist_ok=True)
APP_UA='Mozilla/5.0 (Linux; Android 14; SM-S908N Build/UP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0 Mobile Safari/537.36 HaneulFishingApp'
async def start(pg):
    await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(500)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);errs=[]
        c1=await b.new_context(viewport={'width':384,'height':824},has_touch=True);pg=await c1.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
        await start(pg);await pg.click('#bStart');await pg.wait_for_timeout(500)
        await pg.evaluate("__t.set('lv',37);__t.set('gold',123456)");await pg.evaluate("__t.save().dex.mackerel=__t.save().dex.mackerel||{n:3}")
        # 뒤로 가기
        u0=pg.url;await pg.click("#nav button[data-open='equip']");await pg.wait_for_timeout(400)
        await pg.go_back();await pg.wait_for_timeout(500)
        st=await pg.evaluate("[document.getElementById('sheet').classList.contains('show'),__t.S,location.href]")
        chk('뒤로 가기 → 메뉴만 닫힘(게임 그대로)',not st[0] and st[1]!='title' and st[2]==u0,str(st))
        await pg.click("#nav button[data-open='map']");await pg.wait_for_timeout(400);await pg.click('#sClose');await pg.wait_for_timeout(500)
        await pg.click("#nav button[data-open='equip']");await pg.wait_for_timeout(500)
        chk('닫기 버튼으로 닫은 뒤 다시 열어도 바로 안 닫힘',await pg.evaluate("document.getElementById('sheet').classList.contains('show')"))
        await pg.go_back();await pg.wait_for_timeout(500)
        chk('두 번째도 뒤로 가기로 닫힘',not await pg.evaluate("document.getElementById('sheet').classList.contains('show')") and pg.url==u0)
        await pg.click("#nav button[data-open='aq']");await pg.wait_for_timeout(500);await pg.go_back();await pg.wait_for_timeout(500)
        chk('수족관도 뒤로 가기로 닫힘',not await pg.evaluate("document.getElementById('aq').classList.contains('on')") and pg.url==u0)
        # 세이브 코드 복사
        await pg.evaluate("openSheet('set')");await pg.wait_for_timeout(400)
        tx=await pg.evaluate("document.getElementById('sbody').innerText");chk('설정에 기록 옮기기',('기록 옮기기' in tx) and ('코드 복사' in tx),'')
        await pg.click("[data-sc='copy']");await pg.wait_for_timeout(400)
        code=await pg.evaluate("document.getElementById('scBox').value");chk('코드 만들기(HNF1:)',code.startswith('HNF1:') and len(code)>200,code[:20])
        await pg.screenshot(path=os.path.join(OUT,'t424_code.png'))
        # 다른 기기(새 브라우저 = 앱이라고 가정)에서 불러오기
        c2=await b.new_context(viewport={'width':384,'height':824},has_touch=True,user_agent=APP_UA);q=await c2.new_page();q.on('pageerror',lambda e:errs.append(str(e)))
        await start(q)
        chk('앱(WebView)에서는 앱 안 브라우저 경고 안 뜸',await q.evaluate("!document.getElementById('inappNote')&&__w.isApp"))
        await q.click('#bStart');await q.wait_for_timeout(500);await q.evaluate("__t.set('gold',5)");await q.evaluate("persist()")
        await q.evaluate("openSheet('set')");await q.wait_for_timeout(300)
        await q.fill('#scBox','HNF1:망가진코드');await q.click("[data-sc='load']");await q.wait_for_timeout(200)
        chk('잘못된 코드는 거절',await q.evaluate("__t.save().gold")==5)
        await q.fill('#scBox',code);await q.click("[data-sc='load']");await q.wait_for_timeout(200)
        chk('한 번 누르면 확인만(아직 안 덮어씀)',await q.evaluate("__t.save().gold")==5)
        await q.click("[data-sc='load']");await q.wait_for_timeout(2500)
        r=await q.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('haneul-fish-v4'));const pre=JSON.parse(localStorage.getItem('haneul-fish-v4-preimport')||'null');return [s.lv,s.gold,!!s.dex.mackerel,pre&&pre.gold]})()")
        chk('불러오기: 레벨·골드·도감 그대로 옮겨짐',r[0]==37 and r[1]==123456 and r[2],str(r))
        chk('불러오기 전 기록은 따로 보관(preimport)',r[3]==5,str(r))
        await q.click('#bStart');await q.wait_for_timeout(500)
        chk('불러온 뒤 게임 화면에 반영',await q.evaluate("__t.save().lv")==37)
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
