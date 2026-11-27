"""4.19: 느슨함 0.3초 · 업적 ~200·칭호 효과·수집 보너스 · 낚시 모드 삭제 · 보물 랜덤 획득/레벨 · 수족관 의뢰·명성·교감 · 도감 형태 보기"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(600)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.setGear('r5','e5','l5');__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        # 1) 느슨함 0.3초
        await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(600)')
        for _ in range(400):
            s=await pg.evaluate('__t.S')
            if s=='bite':await pg.mouse.click(200,500)
            if s=='fight':break
            await pg.wait_for_timeout(15)
        t0=await pg.evaluate("__t.fg.ten=2;__t.fg.next=99;performance.now()")
        for _ in range(250):
            if await pg.evaluate('__t.S')!='fight':break
            await pg.evaluate("__t.fg.ten=Math.min(__t.fg.ten,2);__t.fg.next=99");await pg.wait_for_timeout(15)
        dt=(await pg.evaluate('performance.now()')-t0)/1000;chk('손 뗀 채 장력 바닥 → 시작 유예 1.4초 + 0.6초 뒤 놓침 (4.23)',await pg.evaluate('__t.S')=='fail' and 1.7<=dt<2.8,f'{dt:.2f}s')
        await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
        # 2) 업적·칭호
        n=await pg.evaluate("__w.ACH.length");t=await pg.evaluate("__w.ACH.filter(a=>a.title).length");chk('업적 250개 이상·칭호 붙은 업적 100개 이상',n>=250 and t>=100,f'{n} / {t}')
        hard=await pg.evaluate("__w.ACH.filter(a=>/콤보 (50|100|150|200)|10,000마리|5,000마리|콤보 보물상자 50|S등급 1000/.test(a.d)).map(a=>a.n+':'+(a.title||''))");chk('어려운 업적(콤보 50·100·200, 만 마리 등)에 칭호',len(hard)>=6 and all(':' in h and h.split(':')[1] for h in hard if '콤보 5' in h or '콤보 1' in h),str(hard))
        await pg.evaluate("(()=>{const s=__t.save();s.comboBest=50;s.st.maxCombo=50})()")
        await pg.evaluate("openSheet('mission','ach')");await pg.wait_for_timeout(400)
        await pg.click("button[data-act='claimA'][data-id='zcb4']");await pg.wait_for_timeout(300)
        tt=await pg.evaluate("[!!__t.save().titles['끊기지 않는 줄'],__t.save().ach.zcb4]");chk('콤보 50 업적 받기 → 칭호 획득',tt==[True,1],str(tt))
        await pg.evaluate("closeSheet()");await pg.evaluate("__t.save().title='끊기지 않는 줄'");chk('칭호 효과(골드 +6%) 적용',await pg.evaluate("__w.tfx('gold')")==6)
        await pg.evaluate("(()=>{const s=__t.save();for(let i=0;i<34;i++)s.titles['테스트'+i]=1})()");chk('칭호 수집 보너스(35개 → +3%)',await pg.evaluate("__w.tcol()")==3)
        for _try in range(4):
            await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(600)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(1500)
            if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
            await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
        r=await pg.evaluate("({g:__w.lastRes.gold,st:__t.save().st.r1,m:__t.save().st.m_basic})");chk('기록 모으기(등급·낚시 방식)',r['st']>=1 and r['m']>=1,str(r));await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(300)
        # 3) 낚시 모드 삭제
        chk('낚시 모드 버튼 숨김·모드 normal·도전 업적 없음',await pg.evaluate("[getComputedStyle(document.getElementById('cMode')||document.body).display==='none'||!document.getElementById('cMode'),__t.save().mode,__w.ACH.some(a=>a.c==='도전')]")==[True,'normal',False])
        # 4) 보물 랜덤 획득·레벨
        await pg.evaluate("Math.__r=Math.random;Math.random=()=>.001")
        d1=await pg.evaluate("(()=>{const f=__t.FID.mackerel;const r=__w.treDrop(Object.assign({},f,{r:1}));return r&&[r.t.id,r.isNew,r.lv]})()")
        d2=await pg.evaluate("(()=>{const f=__t.FID.mackerel;const r=__w.treDrop(Object.assign({},f,{r:1}));return r&&[r.t.id,r.isNew,r.lv]})()")
        await pg.evaluate("Math.random=Math.__r")
        chk('낚시 중 보물 획득 → 같은 보물 또 얻으면 레벨 업',d1 and d2 and d1[0]==d2[0] and d1[1] and not d2[1] and d2[2]==2,f'{d1} {d2}')
        await pg.evaluate("Math.__r=Math.random;Math.random=()=>.99")
        chk('평소엔 확률(3.5%)이라 안 나옴',await pg.evaluate("__w.treDrop(Object.assign({},__t.FID.mackerel,{r:1}))") is None)
        await pg.evaluate("Math.random=Math.__r")
        # 5) 수족관
        await pg.evaluate("(()=>{const s=__t.save();for(const id of ['mackerel','goby','clown','dolddom','octopus','crab'])s.dex[id]=1;s.aq.slots=['mackerel','goby','clown','dolddom','octopus','crab'];__t.persist()})()")
        await pg.evaluate("openAq()");await pg.wait_for_timeout(500)
        await pg.click("[data-aqt='req']");await pg.wait_for_timeout(300)
        rq=await pg.evaluate("document.querySelectorAll('[data-aq419=req]').length");chk('수족관 의뢰 3개',rq==3,str(rq))
        ena=await pg.evaluate("[...document.querySelectorAll('[data-aq419=req]')].filter(b=>!b.disabled).length")
        if ena:
            r0=await pg.evaluate("__t.save().aq.rep||0");await pg.click("[data-aq419=req]:not([disabled])");await pg.wait_for_timeout(300);r1=await pg.evaluate("__t.save().aq.rep||0")
            chk('의뢰 완료 → 명성 +40',r1-r0==40,f'{r0}->{r1}')
        fx=await pg.evaluate("(()=>{const a=__w&&document.getElementById('aqc').getBoundingClientRect();return a?[a.left,a.top]:null})()")
        await pg.wait_for_timeout(400);pos=await pg.evaluate("(()=>{const c=document.getElementById('aqc').getBoundingClientRect();return [c.left,c.top]})()")
        fpos=await pg.evaluate("(()=>{try{return null}catch(e){return null}})()")
        r0=await pg.evaluate("__t.save().aq.rep||0")
        # 물고기 위치는 화면 내부 상태라 여러 지점을 눌러 봄
        for x in range(30,370,25):
            for y in range(40,260,30):
                await pg.mouse.click(pos[0]+x,pos[1]+y)
                if (await pg.evaluate("__t.save().aq.rep||0"))>r0:break
            if (await pg.evaluate("__t.save().aq.rep||0"))>r0:break
        chk('수조 물고기 탭 → 교감(명성 +3)',(await pg.evaluate("__t.save().aq.rep||0"))-r0==3)
        await pg.evaluate("closeAq()");await pg.wait_for_timeout(300)
        # 6) 도감 형태 보기
        await pg.evaluate("(()=>{const s=__t.save();s.dex.mackerel=3;s.rec.mackerel=Object.assign(s.rec.mackerel||{locs:['pier'],last:null},{vars:Object.assign((s.rec.mackerel||{}).vars||{},{gold:1})})})()");await pg.evaluate("openSheet('dex','all')");await pg.wait_for_timeout(400)
        await pg.click(".cell[data-f='mackerel']");await pg.wait_for_timeout(400)
        nb=await pg.evaluate("document.querySelectorAll('[data-dv]').length");await pg.click("[data-dv='gold']");await pg.wait_for_timeout(500)
        chk('도감 형태 버튼 7개·황금 선택',nb==7 and await pg.evaluate("document.querySelector('[data-dv=gold]').classList.contains('on')"),str(nb))
        await pg.screenshot(path=os.environ.get('SHOT_DIR','.')+'/t419_dex.png')
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
