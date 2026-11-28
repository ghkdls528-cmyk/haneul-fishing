"""4.25 장비 보물: 도감에서 보물 탭 삭제 · 장비 › 보물(이야기·등급·주/부가 옵션) · 보물 레벨 제한 없음 · 상점 연마 삭제 · 칭호 두 번째 줄"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
OUT=os.path.join(os.path.dirname(__file__),'out');os.makedirs(OUT,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);errs=[]
        pg=await b.new_page(viewport={'width':384,'height':824},has_touch=True);pg.on('pageerror',lambda e:errs.append(str(e)))
        # 예전 세이브(4.24): 보물 Lv5 상한·옵션 없음
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(400);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("(()=>{const s=__t.save();s.lv=30;s.tre={coin:{n:6,first:'2026-01-01',loc:'pier',lv:5},crown:{n:1,first:'2026-01-02',loc:'pier',lv:1}};s.treEq.slots=['coin','crown'];persist()})()")
        await pg.reload();await pg.wait_for_timeout(600)
        r=await pg.evaluate("(()=>{const s=__t.save();return [s.tre.coin.lv,(s.tre.coin.opt||[]).length,(s.tre.crown.opt||[]).length,s.tre.coin.n]})()")
        chk('예전 세이브 보물 유지 + 옵션 자동 부여(★1 Lv5=1+1개, ★5=3개)',r==[5,2,3,6],str(r))
        await pg.add_script_tag(content=BOT);await pg.click('#bStart');await pg.wait_for_timeout(400)
        # 도감에 보물 탭 없음
        await pg.click("#nav button[data-open='dex']");await pg.wait_for_timeout(400)
        tabs=await pg.evaluate("document.getElementById('sheet').innerText");chk('도감에 보물 탭 없음','💰 보물' not in tabs and '보물 수집' not in tabs,'')
        await pg.click('#sClose');await pg.wait_for_timeout(500)
        # 장비 › 보물
        await pg.click("#nav button[data-open='equip']");await pg.wait_for_timeout(400)
        await pg.evaluate("(()=>{for(const b of document.querySelectorAll('#sheet [data-tab],#sheet .tabs button'))if((b.textContent||'').includes('보물'))b.click()})()");await pg.wait_for_timeout(400)
        tx=await pg.evaluate("document.getElementById('sbody').innerText")
        chk('장비 › 보물: 하늘호 이야기·등급·옵션',all(k in tx for k in ['하늘호','신화','조개','⭐','＋','아직 못 찾은 보물']),tx[:90].replace('\n',' '))
        await pg.screenshot(path=os.path.join(OUT,'t425_tre.png'))
        # 레벨 제한 없음 + 효과 배율
        m=await pg.evaluate("[__w.treLvMul(1),__w.treLvMul(5),__w.treLvMul(10),__w.treLvMul(20),__w.treLvMul(60)]")
        chk('레벨 배율 1·1.4·1.9·2.3·3.9 (끝없이 오름)',[round(x,2) for x in m]==[1,1.4,1.9,2.3,3.9],str(m))
        got=await pg.evaluate("(()=>{const s=__t.save();s.tre={};for(let i=0;i<200;i++)__w.treGive();const L=Object.values(s.tre);return [Math.max(...L.map(r=>r.lv)),L.every(r=>r.lv===r.n),L.every(r=>Array.isArray(r.opt))]})()")
        chk('같은 보물을 또 건지면 Lv+1, 5 넘어서 계속 오름·옵션 붙음',got[0]>5 and got[1] and got[2],str(got))
        await pg.evaluate("(()=>{const s=__t.save();s.tre={coin:{n:9,first:'x',loc:'pier',lv:9}};s.treEq.slots=['coin',null]})()")
        s2=await pg.evaluate("(()=>{const s=__t.save();s.tre.coin.lv=12;__w.ensureOpt('coin');return [s.tre.coin.opt.length, __w.fxvNow('coin')]})()")
        chk('Lv10 넘으면 부가 옵션 3개(★1: 1 + Lv5·Lv10)',s2[0]==3,str(s2))
        cap=await pg.evaluate("(()=>{const s=__t.save();s.tre.compass={n:1,first:'x',loc:'pier',lv:9000,opt:[['bite',99]]};s.treEq.slots=['compass',null];return __w.fxvNow('compass')})()")
        chk('효과 상한(입질 대기 단축 최대 60%)',cap==60,str(cap))
        # 저장·정리
        await pg.evaluate("(()=>{const s=__t.save();s.tre.coin.opt.push(['hack',1e9],'x');persist()})()");await pg.reload();await pg.wait_for_timeout(600)
        sv=await pg.evaluate("(()=>{const s=__t.save();return [s.tre.coin.lv,s.tre.coin.opt.every(o=>Array.isArray(o)&&o[0]!=='hack'),s.tre.compass.lv]})()")
        chk('저장: 레벨 12 유지·이상한 옵션 정리',sv[0]==12 and sv[1] and sv[2]==9000,str(sv))
        # 상점에 연마 없음
        await pg.add_script_tag(content=BOT);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.click('.goldShop');await pg.wait_for_timeout(400)
        st=await pg.evaluate("document.getElementById('sbody').innerText");chk('상점: 보물 연마 없음·뽑기 있음',('보물 연마' not in st) and ('행운 뽑기' in st))
        await pg.click('#sClose');await pg.wait_for_timeout(500)
        # 칭호 두 번째 줄
        for w in [360,384,412,700]:
            await pg.set_viewport_size({'width':w,'height':820});await pg.evaluate("__t.save().title='전설의 황금참돔 왕 사냥꾼';hud()");await pg.wait_for_timeout(300)
            q=await pg.evaluate("(()=>{const g=s=>document.querySelector(s).getBoundingClientRect();const rb=g('#titleRib'),lv=g('.lvbox'),bar=g('.xpbar'),bn=document.querySelector('#banners').getBoundingClientRect();const el=document.getElementById('titleRib');return [Math.round(rb.top-lv.bottom),Math.round(bar.width),el.scrollWidth<=el.clientWidth+1,Math.round(bn.top-rb.bottom),el.textContent]})()")
            chk(f'폭 {w}: 칭호가 경험치바 아래 줄에 전부 보임·배너와 안 겹침',-3<=q[0]<=3 and q[1]>=40 and q[2] and q[3]>=0,str(q))
            if w==384:await pg.screenshot(path=os.path.join(OUT,'t425_top.png'),clip={'x':0,'y':0,'width':384,'height':170})
        await pg.evaluate("__t.save().title='';hud()");await pg.wait_for_timeout(200)
        chk('칭호 없으면 두 번째 줄 숨김',await pg.evaluate("getComputedStyle(document.getElementById('titleRib')).display==='none'&&!document.body.classList.contains('hasTitle')"))
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
