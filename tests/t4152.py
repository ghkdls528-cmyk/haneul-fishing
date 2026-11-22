"""4.15.2: 상태 칩·알림 깜빡임 없음 · 물속 친구 짧은 탭(던지지 않음) / 꾹 누르면 던짐 · 받침 정리"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(3000)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))");await pg.wait_for_timeout(3000)
        # 1) 한 번 낚는 동안 상태 칩은 숨김 1번·보임 1번만
        await pg.evaluate("window.__op=[];window.__iv=setInterval(()=>__op.push(+getComputedStyle(document.getElementById('banners')).opacity>.5),50)")
        await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(500)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(900);await pg.click('#bNext');await pg.wait_for_timeout(800)
        v=await pg.evaluate('clearInterval(__iv),__op');flips=sum(1 for a,c in zip(v,v[1:]) if a!=c);chk('상태 칩: 한 번 낚는 동안 2번 이하로만 바뀜',flips<=2,str(flips))
        # 2) 알림이 떠 있을 때 던져도 다시 깜빡이지 않음(한 번 사라지면 다시 안 나타남)
        await pg.evaluate("window.__no=[];__w.notice('👑 테스트 알림');window.__iv=setInterval(()=>{const e=document.getElementById('notice');__no.push([+getComputedStyle(e).opacity,e.textContent])},50)");await pg.wait_for_timeout(700)
        await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(500)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(400)
        n=await pg.evaluate('clearInterval(__iv),__no')
        # 같은 알림(같은 글자)이 사라졌다가 다시 나타난 횟수만 셈 — 다른 알림이 이어서 나오는 건 정상
        ups={};prev=False
        for o,t in n:
            v=o>.5
            if v and not prev:ups[t]=ups.get(t,0)+1
            prev=v
        chk('알림: 같은 알림이 다시 나타나는 깜빡임 없음',all(c<=1 for c in ups.values()),str(ups));await pg.wait_for_timeout(700);await pg.click('#bNext');await pg.wait_for_timeout(500)
        # 3) 물속 친구: 짧게 탭하면 던지지 않고 반응 / 꾹 누르면 던짐
        async def fish_pos():
            for _ in range(40):
                t=await pg.evaluate("(()=>{const a=__w.crit.find(a=>!a.flee&&a.y>0&&a.x>40&&a.x<350);return a?[a.x,a.y]:null})()")
                if t:return t
                await pg.wait_for_timeout(250)
        t=await fish_pos();await pg.mouse.click(t[0],t[1]);await pg.wait_for_timeout(150)
        st=await pg.evaluate("[__t.S,document.getElementById('toast').textContent]");chk('짧은 탭: 던지지 않고 물고기 반응',st[0]=='ready' and ('???' in st[1] or '!' in st[1]),str(st))
        await pg.wait_for_timeout(700);t=await fish_pos();await pg.mouse.move(t[0],t[1]);await pg.mouse.down();await pg.wait_for_timeout(600);await pg.mouse.up();await pg.wait_for_timeout(200)
        s=await pg.evaluate('__t.S');chk('물고기 위를 꾹 누르면 그대로 던짐',s in('cast','wait'),s)
        await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(900)
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.click('#bNext')
        # 4) 받침: 수중 배경 있는 낚시터는 받침이 수면 근처에서 끝남(화면 아래쪽 왼편이 물속 그림)
        res={}
        for L in ['rock','light','valley','reef']:
            await pg.evaluate(f"(()=>{{const s=__t.save();s.locs['{L}']=1;__t.set('loc','{L}')}})()");await pg.wait_for_timeout(600)
            px=await pg.evaluate("(()=>{const c=document.getElementById('c'),g=c.getContext('2d'),d=window.devicePixelRatio||1,y=Math.round((innerHeight*.75)*d),x=Math.round(20*d),p=g.getImageData(x,y,1,1).data;return[p[0],p[1],p[2]]})()")
            res[L]=px
        # 물속(파랑·초록 계열)이면 B 또는 G가 R보다 큼 — 예전 바위·콘크리트·모래 벽은 회색/베이지(R≥B)
        chk('받침이 화면 아래까지 물을 가리지 않음',all(p[2]>p[0]+8 or p[1]>p[0]+8 for p in res.values()),str(res))
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())

# 4.16.1: 희귀 기운·선물상자·오늘의 대어 칩이 대기 화면에서 반복 깜빡이지 않음
async def chips():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(500)
        await pg.evaluate("(()=>{const s=__t.save();s.dry=15;s.luck=4;__t.persist()})()");await pg.reload();await pg.wait_for_timeout(500);await pg.click('#bStart');await pg.wait_for_timeout(1200)
        await pg.evaluate("window.__a=0;document.getElementById('banners').addEventListener('animationstart',()=>__a++)");await pg.wait_for_timeout(5000)
        a=await pg.evaluate('__a');txt=await pg.evaluate("document.getElementById('banners').textContent")
        print(('OK  ' if a==0 and '희귀 기운' in txt and '4/8' in txt else 'BAD ')+'상태 칩: 대기 화면 5초 동안 등장 애니메이션 반복 없음',a,txt)
        print('errs',errs);await b.close()
asyncio.run(chips())
