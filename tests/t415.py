"""4.15 보물: 새 보물 21종 · 그림 · 장착 칸(레벨 10부터 2칸) · 종류별 효과 · 등급 보정 · 저장"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
async def catch(pg,fid):
    await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(900)');r=await pg.evaluate('__bot(90000)')
    for _ in range(60):
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
        await pg.wait_for_timeout(100)
    return r
async def nxt(pg):
    await pg.wait_for_timeout(650);await pg.click('#bNext');await pg.wait_for_timeout(300)
async def equip(pg,ids):
    await pg.evaluate(f"__t.save().treEq.slots={json.dumps(ids+[None]*(2-len(ids)))};__t.persist()")
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);ctx=await b.new_context(viewport={'width':390,'height':844},has_touch=True);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(300)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.setGear('r5','e5','l5');__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        T=await pg.evaluate("__w.TRE.map(t=>[t.id,t.r,t.kind])");chk('보물 21종',len(T)==21,str(len(T)))
        new=[t for t in T if t[0] in('pouch','bell','coral','hourglass','goldfish')];chk('새 보물 5종 ★1~5',sorted(t[1] for t in new)==[1,2,3,4,5],str(new))
        imgs=await pg.evaluate("['goldchest','compass','crown','letter','pearl','pouch','bell','coral','hourglass','goldfish'].map(id=>!!(__w.IPI['tre_'+id]&&__w.IPI['tre_'+id].naturalWidth))")
        chk('새 그림 10장 로드',all(imgs),str(imgs))
        # 칸 수
        await pg.evaluate("__t.set('lv',5)");chk('레벨 9 이하 1칸',await pg.evaluate('__w.treSlots()')==1)
        await pg.evaluate("__t.set('lv',12)");chk('레벨 10 이상 2칸',await pg.evaluate('__w.treSlots()')==2)
        # 보물 모두 수집한 상태로
        await pg.evaluate("(()=>{const s=__t.save();for(const t of __w.TRE)s.tre[t.id]={n:1,first:'2026-11-22',loc:'pier'}})()")
        # UI로 장착: 장비 › 보물 탭
        await pg.evaluate("openSheet('equip','tre')");await pg.wait_for_timeout(500)
        await pg.click("button[data-treq='coin']");await pg.wait_for_timeout(200);await pg.click("button[data-treq='crown']");await pg.wait_for_timeout(200)
        sl=await pg.evaluate("__t.save().treEq.slots");chk('탭에서 장착',sl==['coin','crown'],str(sl))
        await pg.click("button[data-treq='jade']");await pg.wait_for_timeout(200);chk('칸이 차면 더 장착 안 됨',await pg.evaluate("__t.save().treEq.slots")==['coin','crown'])
        # 등급 보정·왕관: 옛날 동전 ★1 = 4×0.6=2.4% · 왕관 ★5 = 25×1.5=37.5% → 2.4×1.375=3.3
        v=await pg.evaluate("__w.fxv('coin')");chk('등급 보정·왕관 곱',abs(v-3.3)<1e-6,str(v))
        txt=await pg.evaluate("[__w.treText('coin'),__w.treText('crown'),__w.treText('ring'),__w.treText('goldchest')]");print(' 효과 문구',txt)
        await pg.click("button[data-treq='crown']");await pg.wait_for_timeout(200);chk('탭에서 해제',await pg.evaluate("__t.save().treEq.slots")==['coin',None])
        await pg.evaluate("closeSheet()");await pg.wait_for_timeout(300)
        # 금화: 황금 보물상자 ★4 = 10%
        await equip(pg,['goldchest']);g0=await pg.evaluate('__t.save().gold');await catch(pg,'mackerel')
        r=await pg.evaluate("({gold:__w.lastRes.gold,b:__w.lastRes.treBonus,now:__t.save().gold})")
        base=r['gold']-(r['b'] or 0);chk('금화 +10% (보물상자 ★4)',r['b'] and abs(r['b']-round(base*0.10))<=1 and r['now']-g0>=r['gold'],str(r));await nxt(pg)
        # 경험치: 보석(비취 ★3) 5%
        await equip(pg,['jade']);x0=await pg.evaluate("__w.call415('xp')");lv0=await pg.evaluate("__w.call415('lv')");await pg.evaluate("__w.call415('addXp',100)")
        x1=await pg.evaluate("__w.call415('xp')");chk('경험치 +5% (비취)',lv0==await pg.evaluate("__w.call415('lv')") and x1-x0==105,f'{x0}->{x1}')
        # 수족관 관람료: 금화 꾸러미 ★1 = 8×0.6=4.8%
        await pg.evaluate("__t.save().aq.slots=['mackerel','goby','tuna']");await equip(pg,[]);a0=await pg.evaluate("__w.call415('aqRate')");await equip(pg,['pouch']);a1=await pg.evaluate("__w.call415('aqRate')")
        chk('수족관 관람료 +4.8% (꾸러미 ★1)',a1==round(a0*1.048),f'{a0}->{a1}')
        # 희귀 확률: 진주 ★2 = 3×0.8=2.4% → ★3 이상 가중치만 ×1.024
        await equip(pg,[]);w0=await pg.evaluate("__w.call415('weights',false,false)");await equip(pg,['pearl']);w1=await pg.evaluate("__w.call415('weights',false,false)")
        R=await pg.evaluate("__w.FISH.map(f=>f.r)");okw=all((abs(b_-a_*1.024)<1e-9 if R[i]>=3 else b_==a_) for i,(a_,b_) in enumerate(zip(w0,w1)));chk('희귀어 가중치 ×1.024 (진주 ★2)',okw)
        # 보물 낚시 확률: 지도 ★2 = 4×0.8=3.2%p
        await equip(pg,['map']);c=await pg.evaluate("__w.treChance()");chk('보물 확률 0.6→0.632 (지도)',abs(c-.632)<1e-9,str(c))
        # 부적(★4): 비 올 때만 ×1.375
        await equip(pg,['amulet']);await pg.evaluate("__t.setWeather('clear')");c0=await pg.evaluate("__w.treChance()");await pg.evaluate("__t.setWeather('rain')");c1=await pg.evaluate("__w.treChance()")
        chk('부적: 비 올 때만 보물 확률 ×1.375',abs(c0-.6)<1e-9 and abs(c1-.825)<1e-9,f'{c0},{c1}');await pg.evaluate("__t.setWeather('clear')")
        # 입질 대기: 나침반 ★3 = -8%  (같은 무작위값으로 비교할 수 없으니 실제 대기 평균 비교 대신 fg.bite 비율을 직접 확인)
        await equip(pg,['compass']);await pg.evaluate("__t.force('mackerel')");await pg.evaluate("Math.__r=Math.random;Math.random=()=>.5");await pg.evaluate('__cast(900)')
        for _ in range(200):
            if await pg.evaluate('__t.S')=='wait':break
            await pg.wait_for_timeout(15)
        bt1=await pg.evaluate('__t.fg.bite');await pg.evaluate("Math.random=Math.__r");await pg.evaluate('__bot(60000)');await nxt(pg)
        await equip(pg,[]);await pg.evaluate("__t.force('mackerel')");await pg.evaluate("Math.__r=Math.random;Math.random=()=>.5");await pg.evaluate('__cast(900)')
        for _ in range(200):
            if await pg.evaluate('__t.S')=='wait':break
            await pg.wait_for_timeout(15)
        bt0=await pg.evaluate('__t.fg.bite');await pg.evaluate("Math.random=Math.__r");await pg.evaluate('__bot(60000)');await nxt(pg)
        chk('입질 대기 -8% (나침반)',abs(bt1-bt0*.92)<1e-6,f'{bt0:.3f}->{bt1:.3f}')
        # 콤보 보호: 은빛 반지, 하루 3회
        await equip(pg,['ring']);await catch(pg,'mackerel');await nxt(pg);await catch(pg,'mackerel');await nxt(pg)
        c0=await pg.evaluate('__w.combo');await pg.evaluate("fail('x')");await pg.wait_for_timeout(200)
        ring=await pg.evaluate("__t.save().treEq.ring")
        # fail()은 페이지에서 원래 함수를 부르므로, 게임 안 경로(너무 일찍 탭)로 다시 확인
        await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
        await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(900)')
        for _ in range(200):
            if await pg.evaluate('__t.S')=='wait':break
            await pg.wait_for_timeout(15)
        await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
        c1=await pg.evaluate('__w.combo');ring=await pg.evaluate("__t.save().treEq.ring");chk('반지가 콤보 지킴',c0>=2 and c1==c0 and ring['n']>=1,f'combo {c0}->{c1} ring {ring}')
        # 삼지창: 보스전 줄 여유 +15% (★5)
        await equip(pg,['trident']);await pg.evaluate("(()=>{const s=__t.save();s.locs.rock=1;__t.set('loc','rock')})()");await pg.evaluate("__t.boss('goldking')");await pg.evaluate('__cast(900)')
        for _ in range(400):
            s=await pg.evaluate('__t.S')
            if s=='bite':await pg.mouse.click(200,500)
            if s=='fight':break
            await pg.wait_for_timeout(15)
        gr=await pg.evaluate("[__t.fg.gs.grace,__t.GS().grace]");chk('삼지창: 보스전 줄 여유 ×1.15',abs(gr[0]-gr[1]*1.15)<1e-6,str(gr))
        await pg.evaluate('__bot(150000)');await nxt(pg)
        # 저장·새로고침
        await equip(pg,['coin','crown']);await pg.evaluate('__t.persist()');await pg.reload();await pg.wait_for_timeout(700)
        chk('새로고침 후 장착 유지',await pg.evaluate("__t.save().treEq.slots")==['coin','crown'])
        # 예전 세이브(treEq 없음) · 없는 보물을 가리키는 칸은 정리
        await pg.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('haneul-fish-v4'));delete s.treEq;localStorage.setItem('haneul-fish-v4',JSON.stringify(s));localStorage.setItem('haneul-fish-v4-safe',JSON.stringify(s))})()")
        pg2=await ctx.new_page();pg2.on('pageerror',lambda e:errs.append(str(e)));await pg2.goto(GAME+'?test');await pg2.wait_for_timeout(700)
        chk('예전 세이브에 기본값',await pg2.evaluate("JSON.stringify(__t.save().treEq)")=='{"slots":[null,null],"ring":{"d":"","n":0}}')
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
