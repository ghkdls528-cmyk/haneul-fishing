import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
BOT=BOT
async def play(pg,maxs=60):
    await pg.evaluate('__cast(900)');await pg.evaluate("(()=>{__bot(60000)})()")
    for k in range(maxs*4):
        if await pg.evaluate("!!document.querySelector('#reveal.on')"):await pg.mouse.click(200,400)
        if await pg.evaluate("document.getElementById('result').classList.contains('on')||__t.S==='fail'"):return await pg.evaluate('__t.S')
        await pg.wait_for_timeout(250)
    return await pg.evaluate('__t.S')
async def nxt(pg):
    if await pg.evaluate("document.getElementById('result').classList.contains('on')"):
        await pg.wait_for_timeout(700);await pg.click('#bNext')
    await pg.wait_for_timeout(500)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(500);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('lv',30);__t.setGear('r4','e4','l4');__t.set('set',Object.assign(__t.save().set,{reveal:'short'}));const s=__t.save();for(const l of['rock','valley','light','lake','sea','reef','ice','deep','moon'])s.locs[l]=1")
        # 1 계절 효과: 전어(가을) 비율
        r={}
        for sn in['spring','autumn']:
            await pg.evaluate(f"window.__season='{sn}';__t.save().loc='pier';__t.setWeather('clear')");c=await pg.evaluate("__t.roll(6000)");r[sn]=round(c.get('jeoneo',0)/60,2),round(c.get('dodari',0)/60,2)
        print('계절 전어%,도다리% (봄,가을):',r)
        # 2 강풍: 사냥꾼(pred) 비율 먼바다
        for w in['clear','wind']:
            await pg.evaluate(f"__t.save().loc='sea';__t.setWeather('{w}')");c=await pg.evaluate("(()=>{const c=__t.roll(6000);let p=0;for(const id in c)if((__t.FID[id].tags||[]).includes('pred'))p+=c[id];return p/60})()");print('먼바다 사냥꾼%',w,round(c,1))
        # 3 실제 확률표 = 롤 시뮬
        await pg.evaluate("__t.save().loc='rock';__t.setWeather('clear');window.__season='autumn'")
        lr=await pg.evaluate("__w.liveRates().map(x=>+x.toFixed(2))");sim=await pg.evaluate("(()=>{const c=__t.roll(20000),r=[0,0,0,0,0,0,0,0];for(const id in c)r[__t.FID[id].r]+=c[id];return r.map(x=>+(x/200).toFixed(2))})()")
        print('갯바위 표시 확률',lr);print('갯바위 2만회 시뮬',sim)
        # 4 불운 방지
        for d in[0,15,25]:
            await pg.evaluate(f"__t.save().dry={d}");print(' dry',d,'희귀이상%',round(sum(await pg.evaluate("__w.liveRates()").__await__() if False else (await pg.evaluate("__w.liveRates().slice(3,7)"))),2))
        # 평균 시도 수 시뮬(선착장, 불운방지 적용/미적용)
        await pg.evaluate("__t.save().loc='pier'")
        avg=await pg.evaluate("""(()=>{const s=__t.save(),out=[];for(const pity of[0,1]){let tot=0,mx=0;for(let k=0;k<400;k++){let n=0;s.dry=0;while(true){n++;let f;if(pity&&s.dry>=30){f={r:3}}else{const w=weights(false,false);if(!pity){}let t=0;const ws=w.map((x,i)=>pity?x:x);f=pickFrom(ws)}if(f.r>=3&&f.r<=6)break;if(pity)s.dry++;if(n>500)break}tot+=n;mx=Math.max(mx,n)}out.push([+(tot/400).toFixed(1),mx])}s.dry=0;return out})()""")
        print('선착장 희귀 이상까지 평균/최대 시도 (보정 없음, 보정 있음):',avg)
        # 5 강제 30 → 확정 희귀
        await pg.evaluate("__t.save().dry=30");s=await play(pg);print('dry30 →',await pg.evaluate("__w.lastRes&&[__w.lastRes.f.n,__w.lastRes.f.r]"),'dry now',await pg.evaluate("__t.save().dry"));await nxt(pg)
        # 6 희귀 입질 연출
        await pg.evaluate("__t.force('chamdom')");await pg.evaluate('__cast(900)');await pg.evaluate("(()=>{__bot(60000)})()")
        for k in range(200):
            if await pg.evaluate("__t.S")=='bite':await pg.wait_for_timeout(150);await pg.screenshot(path='/tmp/r_bite.png');break
            await pg.wait_for_timeout(40)
        print('rare bite toast',await pg.evaluate("(document.getElementById('toast')||{}).textContent"))
        for k in range(200):
            if await pg.evaluate("!!document.querySelector('#reveal.on')"):await pg.mouse.click(200,400)
            if await pg.evaluate("document.getElementById('result').classList.contains('on')||__t.S==='fail'"):break
            await pg.wait_for_timeout(200)
        print('first rec',await pg.evaluate("JSON.stringify(__t.save().first.chamdom||null)"));await nxt(pg)
        # 7 이벤트: 떼
        await pg.evaluate("__t.save().loc='pier';__w.startEvt()");print('evt',await pg.evaluate("JSON.stringify(__w.EVT)"))
        if (await pg.evaluate("__w.EVT.k"))!='surge':await pg.evaluate("__w.EVT=null;(()=>{for(let i=0;i<20&&(!__w.EVT||__w.EVT.k!=='surge');i++){__w.EVT=null;__w.startEvt()}})()")
        ev=await pg.evaluate("JSON.parse(JSON.stringify(__w.EVT))");c=await pg.evaluate("__t.roll(4000)");print('surge',ev['n'],'roll%',round(c.get(ev['id'],0)/40,1))
        await pg.wait_for_timeout(1200);await pg.screenshot(path='/tmp/r_evt.png')
        await pg.evaluate(f"__t.force('{ev['id']}')");g0=await pg.evaluate("__t.save().gold");s=await play(pg);print('surge catch rRec',await pg.evaluate("rRec.textContent"),'got',await pg.evaluate("__w.EVT&&__w.EVT.got"));await nxt(pg)
        await pg.evaluate("__w.EVT.t=0.1");await pg.wait_for_timeout(800);print('evt ended',await pg.evaluate("__w.EVT"))
        # 대물
        await pg.evaluate("(()=>{for(let i=0;i<30;i++){__w.EVT=null;__w.startEvt();if(__w.EVT.k==='big')break}})()");print('big evt',await pg.evaluate("__w.EVT.k"))
        s=await play(pg);print('big catch',await pg.evaluate("rRec.textContent"));await nxt(pg);g0=await pg.evaluate("__t.save().gold");await pg.evaluate("__w.EVT.best=.9;__w.EVT.bn='테스트';__w.EVT.t=.1");await pg.wait_for_timeout(800);print('big reward',await pg.evaluate("__t.save().gold")-g0)
        # 8 숨은 포인트 (선착장 20마리)
        await pg.evaluate("__t.save().reg.pier.c=19");s=await play(pg);await pg.wait_for_timeout(1800);print('secret',await pg.evaluate("JSON.stringify(__t.save().secret)"));await nxt(pg)
        # 9 정보 창
        await pg.click('.pill.place');await pg.wait_for_timeout(500);await pg.screenshot(path='/tmp/r_info.png');await pg.evaluate("document.getElementById('sheet').classList.remove('on','show')")
        # 10 도감 수집 보상: 전부 등록 후 all
        await pg.evaluate("(()=>{const s=__t.save();__t.F.forEach(f=>s.dex[f.id]=1)})()");await pg.click('[data-open=dex]',force=True);await pg.wait_for_timeout(400);await pg.click('#sTabs [data-tab=col]');await pg.wait_for_timeout(400);await pg.screenshot(path='/tmp/r_col.png')
        g0=await pg.evaluate("__t.save().gold");await pg.click('[data-dxg=r_3]');await pg.wait_for_timeout(300);await pg.click('[data-dxg=all]');await pg.wait_for_timeout(800)
        print('col gold+',await pg.evaluate("__t.save().gold")-g0,'items',await pg.evaluate("JSON.stringify([__t.save().cos.rod.neon,__t.save().bobs.dexbob,__t.save().aq.themes.moon,__t.save().deco.trophy,__t.save().titles['바다의 수호자']])"),'cel',await pg.evaluate("document.getElementById('dexCel').classList.contains('on')"))
        await pg.screenshot(path='/tmp/r_cel.png');await pg.click('#celOk');await pg.evaluate("document.getElementById('sheet').classList.remove('on','show')");await pg.wait_for_timeout(600);await pg.screenshot(path='/tmp/r_trophy.png')
        # 11 강풍·계절 화면
        await pg.evaluate("__t.setWeather('wind');window.__season='spring'");await pg.wait_for_timeout(800);await pg.screenshot(path='/tmp/r_wind.png')
        await pg.reload();await pg.wait_for_timeout(800);print('reload',await pg.evaluate("JSON.stringify((s=>[s.dry,Object.keys(s.first).length,s.secret,s.dexG,Object.keys(s.seasonLog)])(__t.save()))"))
        print('errs',errs);await b.close()
asyncio.run(main())
