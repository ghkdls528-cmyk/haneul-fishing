"""4.14.2 기록 지키기: 오래된 탭이 최신 기록을 덮어쓰지 않는지 · 예전 버전 탭이 덮어써도 복구되는지 · 탭으로 돌아오면 최신 기록 · 앱 안 브라우저 안내"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
GOLD="(()=>{try{return JSON.parse(localStorage.getItem('haneul-fish-v4')).gold}catch(e){return null}})()"
async def opened(ctx,errs):
    pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)));await pg.goto(GAME+'?test');await pg.wait_for_timeout(700);return pg
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);ctx=await b.new_context(viewport={'width':390,'height':844},has_touch=True);errs=[]
        A=await opened(ctx,errs);await A.evaluate('localStorage.clear()');await A.reload();await A.wait_for_timeout(600)
        await A.click('#bStart');await A.wait_for_timeout(900)
        chk('시작 직후 저장',await A.evaluate(GOLD)==0 and (await A.evaluate('__w.saveRev'))['rev']>=1)
        await A.evaluate("__t.set('gold',1000);__t.persist()")
        # 1) 새 탭 B가 이어서 진행
        B=await opened(ctx,errs);chk('새 탭이 기록 불러옴',await B.evaluate('__t.save().gold')==1000)
        await B.click('#bStart');await B.wait_for_timeout(500);await B.evaluate("__t.set('gold',2500);__t.persist()")
        # 2) 오래된 탭 A가 저장해도 덮어쓰지 않음
        await A.evaluate('__t.persist()');st=await A.evaluate('__w.saveRev')
        chk('오래된 탭 저장 차단',await A.evaluate(GOLD)==2500 and st['staleTab'],str(st))
        await A.wait_for_timeout(300);chk('오래된 탭에 안내 표시',await A.evaluate("!!document.getElementById('staleBar')"))
        await A.close();await B.wait_for_timeout(300)
        chk('오래된 탭을 닫아도 최신 유지',await B.evaluate(GOLD)==2500)
        # 3) 예전 버전(보호 기능 없는) 탭이 옛 기록으로 덮어쓴 상황 → 다음에 열 때 복구
        await B.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('haneul-fish-v4'));s.gold=0;s.rev=1;localStorage.setItem('haneul-fish-v4',JSON.stringify(s))})()")
        C=await opened(ctx,errs);chk('예전 탭 덮어쓰기 복구',await C.evaluate('__t.save().gold')==2500,str(await C.evaluate('__t.save().gold')))
        # 4) 숨겨진 탭으로 돌아오면 최신 기록으로 새로고침
        await C.click('#bStart');await C.wait_for_timeout(400);await C.evaluate("__t.set('gold',3100);__t.persist()")
        await B.evaluate("document.dispatchEvent(new Event('visibilitychange'))");await B.wait_for_timeout(1200)
        chk('돌아온 탭 최신 기록',await B.evaluate('__t.save().gold')==3100,str(await B.evaluate('__t.save().gold')))
        # 5) 새로고침·다시 열기(패치 후) 유지
        await C.close();await B.reload();await B.wait_for_timeout(700);chk('새로고침 후 유지',await B.evaluate('__t.save().gold')==3100)
        await B.close();D=await opened(ctx,errs);chk('모두 닫고 다시 열기',await D.evaluate('__t.save().gold')==3100)
        # 6) 설정의 기록 초기화는 그대로 동작
        await D.click('#bStart');await D.wait_for_timeout(400)
        await D.evaluate("(()=>{const b=document.createElement('button');b.dataset.act='reset';b.dataset.armed='1';document.getElementById('sbody').appendChild(b);b.click()})()")
        await D.wait_for_timeout(300);await D.reload();await D.wait_for_timeout(700)
        g=await D.evaluate('__t.save().gold');chk('기록 초기화 후 다시 열면 초기 상태',g==0,str(g))
        await ctx.close()
        # 7) 카카오톡 앱 안 브라우저 안내
        k=await b.new_context(viewport={'width':390,'height':844},user_agent='Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Mobile Safari/537.36 KAKAOTALK 10.8.0')
        await k.add_init_script('window.__inappTest=1');K=await k.new_page();K.on('pageerror',lambda e:errs.append(str(e)));await K.goto(GAME+'?test');await K.wait_for_timeout(700)
        chk('카카오톡 안내·열기 버튼',await K.evaluate("!!document.getElementById('inappNote')&&!!document.getElementById('inappOpen')"))
        n=await b.new_context(viewport={'width':390,'height':844});N=await n.new_page();await N.goto(GAME+'?test');await N.wait_for_timeout(500)
        chk('일반 브라우저는 안내 없음',not await N.evaluate("!!document.getElementById('inappNote')"))
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
