"""4.14+ 짜릿한 손맛: 챔질 판정·기존 챔질 범위·콤보 연출·획득 문구·희귀 연출 시간·설정 끔·기록 저장"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json,time
from playwright.async_api import async_playwright
OUT=os.environ.get('SHOT_DIR',os.path.dirname(__file__))
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
# 입질 후 정확히 at초에 탭 (페이지 안에서 프레임마다 확인)
TAP_AT="""(at)=>new Promise(res=>{const cv=document.getElementById('c');const f=()=>{const S=__t.S;
 if(S==='bite'&&__w.T>=at){const t=__w.T;cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:200,clientY:500,bubbles:true}));window.dispatchEvent(new PointerEvent('pointerup'));setTimeout(()=>res({t,S:__t.S,hj:__t.fg.hj,big:document.getElementById('big').innerText}),60);return}
 if(S==='fail'||S==='ready'){res({S});return}requestAnimationFrame(f)};f()})"""
async def to_bite(pg,fid):
    await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(900)')
async def finish(pg):
    r=await pg.evaluate('__bot(120000)')
    for _ in range(60):
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
        await pg.wait_for_timeout(100)
    return r
async def nxt(pg):
    await pg.wait_for_timeout(650);await pg.click('#bNext');await pg.wait_for_timeout(300)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);ctx=await b.new_context(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("window.__noLuck=1;window.__no427=1;__w.setEvtNext(9999);__t.set('lv',40);__t.setGear('r5','e5','l5');__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        s0=await pg.evaluate('__t.save()');chk('새 필드 기본값',s0.get('totalPerfectCatches')==0)
        # 1) 판정 구간
        J=await pg.evaluate("[0,.04,.05,.13,.21,.22,.29,.30,.43,.44,.8].map(t=>__w.hookJudge(t))")
        chk('판정 구간(±80/160/300ms)',J==['GREAT','GREAT','PERFECT','PERFECT','PERFECT','GREAT','GREAT','GOOD','GOOD','NORMAL','NORMAL'],str(J))
        # 2) 최적 시점 탭 → PERFECT 연출 + 전투 시작
        await to_bite(pg,'mackerel');r=await pg.evaluate(TAP_AT,.13);print(' perfect tap',r)
        chk('PERFECT 판정·문구',r.get('hj')=='PERFECT' and 'PERFECT' in r.get('big',''),str(r))
        await finish(pg);res=await pg.evaluate("({hj:__w.lastRes.hj,tp:__t.save().totalPerfectCatches,sk:document.getElementById('rSkill').textContent})")
        chk('PERFECT 획득 기록·결과 표시',res['hj']=='PERFECT' and res['tp']==1 and 'PERFECT' in res['sk'],str(res['tp']))
        await nxt(pg)
        # 3) 기존 챔질 성공 범위 유지: 입질 창 끝 무렵(늦은 탭)도 성공
        await to_bite(pg,'mackerel')
        for _ in range(300):
            if await pg.evaluate('__t.S')=='bite':break
            await pg.wait_for_timeout(15)
        win=await pg.evaluate('__t.fg.win');r=await pg.evaluate(TAP_AT,max(.45,win-.02));print(' late tap',r,'win',win)
        chk('늦은 탭(NORMAL)도 챔질 성공',r.get('S') in('hook','fight') and r.get('hj')=='NORMAL',str(r))
        await finish(pg);await nxt(pg)
        # 4) 콤보 5 → 테두리 효과 · 최고 콤보 알림 · 실패 시 해제
        notes=[]
        for i in range(4):
            await to_bite(pg,'mackerel');await finish(pg)
            n=await pg.evaluate("document.getElementById('notice').innerText");notes.append(n);await nxt(pg)
        st=await pg.evaluate("({c:document.body.classList.contains('streak5'),best:__t.save().comboBest})");print(' streak',st,notes)
        chk('콤보 5 이상 테두리 효과',st['c'] and st['best']>=5,str(st))
        await pg.screenshot(path=os.path.join(OUT,'t414f_streak.png'))
        await to_bite(pg,'mackerel')
        for _ in range(300):
            if await pg.evaluate('__t.S')=='fight':break
            if await pg.evaluate('__t.S')=='bite':await pg.mouse.click(200,500)
            await pg.wait_for_timeout(30)
        for _ in range(200):
            if await pg.evaluate('__t.S')!='fight':break
            await pg.wait_for_timeout(50)
        st2=await pg.evaluate("({S:__t.S,c:document.body.classList.contains('streak5')})");chk('놓치면 콤보 연출 해제',st2['S']=='fail' and not st2['c'],str(st2))
        await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
        # 5) 획득 문구: 전설 + 첫 발견 (희귀 연출 '전체' 모드에서 시간 측정)
        await pg.evaluate("__t.set('set',Object.assign(__t.save().set,{reveal:'full'}))")
        leg=await pg.evaluate("__t.F.find(f=>f.r===5&&!f.boss&&!f.hid).id")
        await to_bite(pg,leg);await pg.evaluate('__bot(120000)')
        t0=time.time()
        for _ in range(100):
            if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
            await pg.wait_for_timeout(50)
        dt=time.time()-t0
        fx=await pg.evaluate("({t:document.getElementById('catchFx').innerText,c:document.getElementById('catchFx').className})")
        await pg.wait_for_timeout(250);await pg.screenshot(path=os.path.join(OUT,'t414f_legend.png'))
        chk('전설 문구 LEGENDARY! + NEW FISH!',fx['t'].startswith('LEGENDARY!') and 'NEW FISH!' in fx['t'],str(fx))
        chk('희귀 연출 단축(결과까지 2.6초 이내)',dt<2.6,f'{dt:.2f}s')
        await nxt(pg)
        tags=await pg.evaluate("""[__w.catchTags({r:7,hid:'x'},{rec:1,isNew:1},0,1).map(x=>x[0]),__w.catchTags({r:2},{rec:1,isNew:0},1,0).map(x=>x[0]),__w.catchTags({r:6},{rec:0,isNew:1},0,0).map(x=>x[0]),__w.catchTags({r:1},{rec:0,isNew:0},0,0).length]""")
        chk('문구 우선순위',tags==[['SECRET DISCOVERY!','HUGE CATCH!','PERSONAL RECORD!','NEW FISH!'],['BIG CATCH!','PERSONAL RECORD!'],['MYTHIC!','NEW FISH!'],0],str(tags))
        # 6) 효과음·진동 끔 + PERFECT → 오류 없음
        await pg.evaluate("__t.set('set',Object.assign(__t.save().set,{sfx:0,vib:0,reveal:'short'}))")
        await to_bite(pg,'mackerel');r=await pg.evaluate(TAP_AT,.13);await finish(pg);chk('소리·진동 끔에서도 정상',r.get('hj')=='PERFECT' and not errs,str(r))
        # 7) 바로 다음 낚시 가능 (결과 뜨고 0.7초 안에 다음)
        t1=time.time();await pg.wait_for_timeout(650);await pg.click('#bNext');await pg.wait_for_timeout(200)
        chk('결과 → 다음 낚시 즉시',await pg.evaluate('__t.S')=='ready' and not await pg.evaluate("document.getElementById('result').classList.contains('on')"))
        # 8) 새로고침 후 기록 유지
        tp=await pg.evaluate('__t.save().totalPerfectCatches');await pg.evaluate('__t.persist()');await pg.reload();await pg.wait_for_timeout(600)
        chk('새로고침 후 유지',await pg.evaluate('__t.save().totalPerfectCatches')==tp and tp>=2,str(tp))
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
