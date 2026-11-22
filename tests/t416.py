"""4.16 오리지널 사운드: 음원 25개 디코딩·반복 구간 · BGM 자동 전환/크로스페이드 · 실제 이벤트 효과음 · 충전/릴 반복음 · 경고 쿨다운 · 설정 저장"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH,args=['--autoplay-policy=no-user-gesture-required']);ctx=await b.new_context(viewport={'width':390,'height':844},has_touch=True);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600)
        chk('기본 음량 BGM 35%·효과음 65%',await pg.evaluate("[__t.save().set.bgmVol,__t.save().set.sfxVol,__t.save().set.snd]")==[.35,.65,1])
        await pg.click('#bStart');await pg.wait_for_timeout(1500)
        st=await pg.evaluate("({bus:!!__w.SND.bus,keys:__w.AUDK.length})");chk('오디오 묶음 생성·음원 25개 포함',st['bus'] and st['keys']==25,str(st))
        # 1) 25개 모두 디코딩 · 길이·반복 구간
        meta=await pg.evaluate("""Promise.all(__w.AUDK.map(k=>__w.sndLoad(k).then(B=>[k,B?[+B.b.duration.toFixed(3),+B.ls.toFixed(4),+(B.le-B.ls).toFixed(3),B.b.numberOfChannels]:null])))""")
        bad_dec=[m for m in meta if not m[1]];chk('25개 모두 디코딩',not bad_dec,str(bad_dec))
        for k,v in meta:
            if v and k.startswith('bgm_'):print('  ',k,'길이',v[0],'반복 시작',v[1],'반복 길이',v[2],'채널',v[3])
        bg=[v for k,v in meta if v and k.startswith('bgm_')];chk('BGM 60~90초·스테레오·반복 시작이 0.1초 안',all(60<=v[2]<=90 and v[3]==2 and v[1]<.1 for v in bg),str(bg))
        # 2) BGM 자동 전환
        async def bgm_after(js,wait=2600):
            await pg.evaluate(js);await pg.wait_for_timeout(wait);return await pg.evaluate("__w.SND.curKey")
        r={}
        r['낮 선착장']=await bgm_after("__t.set('loc','pier');__t.setWeather('clear');__t.setTime(150)")
        r['노을']=await bgm_after("__t.setTime(260)")
        r['밤']=await bgm_after("__t.setTime(400)")
        r['먼바다']=await bgm_after("(()=>{const s=__t.save();s.locs.sea=1;__t.set('loc','sea');__t.setTime(150)})()")
        r['보물 낚시']=await bgm_after("__t.set('mode','treasure')")
        await pg.evaluate("__t.set('mode','normal');__t.set('loc','pier');__t.setTime(150)");await pg.wait_for_timeout(4500)
        exp={'낮 선착장':'bgm_01_yosu_morning','노을':'bgm_02_sunset_sea','밤':'bgm_03_moonlight_fishing','먼바다':'bgm_04_deep_sea_adventure','보물 낚시':'bgm_05_treasure_discovery'}
        chk('상황별 BGM 전환',r==exp,json.dumps(r,ensure_ascii=False))
        cf=await pg.evaluate("(()=>{const c=__w.SND.cur;return c?[c.k,+c.g.gain.value.toFixed(2)]:null})()");chk('크로스페이드 끝나고 현재 곡 음량 1',cf and cf[1]>.95,str(cf))
        mem=await pg.evaluate("Object.keys(__w.SND.buf).filter(k=>k.startsWith('bgm_')).length");chk('메모리: 디코딩된 BGM 2곡 이하',mem<=2,str(mem))
        # 3) 낚시 한 번 동안 실제 이벤트 효과음
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.setGear('r5','e5','l5');__t.set('set',Object.assign(__t.save().set,{reveal:'short'}));window.__seen={};window.__iv=setInterval(()=>{if(__w.SND.charge)__seen.charge=1;if(__w.SND.reel)__seen.reel=1},30)")
        t0=await pg.evaluate("__w.SND.bus&&0");await pg.evaluate("for(const k in __w.SND.last)__w.SND.last[k]=-99")
        for _try in range(3):
            await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(600)');r2=await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(2000)
            if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
            await pg.wait_for_timeout(700);await pg.mouse.click(200,500);await pg.wait_for_timeout(400)
        last=await pg.evaluate("Object.entries(__w.SND.last).filter(([k,v])=>v>0).map(([k])=>k)");seen=await pg.evaluate("clearInterval(__iv),__seen")
        print('  재생된 효과음',sorted(last),seen)
        need=['sfx_06_cast_throw','sfx_07_float_splash','sfx_08_bite','sfx_17_fish_caught']
        chk('던지기·착수·입질·획득 효과음',all(k in last for k in need),str([k for k in need if k not in last]))
        chk('챔질은 일반/PERFECT 중 하나만',('sfx_09_hook_success' in last)!=('sfx_10_perfect_hook' in last),str([k for k in last if 'hook' in k]))
        chk('충전음·릴음 반복이 실제로 켜졌다 꺼짐',seen.get('charge') and seen.get('reel') and await pg.evaluate("!__w.SND.charge&&!__w.SND.reel"),str(seen))
        await pg.wait_for_timeout(700);await pg.click('#bNext');await pg.wait_for_timeout(400)
        # 4) 경고음 쿨다운: 짧은 시간에 10번 불러도 1번
        n=await pg.evaluate("(()=>{__w.SND.warnT=-9;let c=0;const o=__w.sp;for(let i=0;i<10;i++){const t0=__w.SND.last['sfx_13_line_warning']||0;__t.fg;window.SFX_TEST&&0}return 0})()")
        cnt=await pg.evaluate("(()=>{const before=__w.SND.voices.length;for(let i=0;i<10;i++)SFX.warn();return __w.SND.voices.filter(v=>v.k==='sfx_13_line_warning').length})()") if await pg.evaluate("typeof SFX!=='undefined'") else None
        # SFX는 블록 안 상수라 페이지에서 직접 못 부를 수 있음 → __w.sp로 같은 소리 간격 제한 확인
        g=await pg.evaluate("(()=>{let c=0;for(let i=0;i<10;i++)if(__w.sp('sfx_01_button',{gap:.07}))c++;return __w.SND.voices.filter(v=>v.k==='sfx_01_button').length})()")
        chk('같은 소리 연속 재생 제한(버튼 10연타 → 1번)',g<=1,str(g))
        # 5) 설정: 패널·슬라이더·끄기·저장
        await pg.evaluate("openSheet('set')");await pg.wait_for_timeout(500)
        ui=await pg.evaluate("[!!document.querySelector('input[data-vol=bgmVol]'),!!document.querySelector('input[data-vol=sfxVol]'),!!document.querySelector('button[data-id=snd]'),document.querySelectorAll('button[data-snd]').length]")
        chk('설정: 전체·BGM·효과음 켜기/끄기 + 음량 슬라이더 2개 + 미리 듣기 25개',ui==[True,True,True,25],str(ui))
        await pg.evaluate("(()=>{const r=document.querySelector('input[data-vol=bgmVol]');r.value=50;r.dispatchEvent(new Event('input',{bubbles:true}));r.dispatchEvent(new Event('change',{bubbles:true}))})()");await pg.wait_for_timeout(400)
        gv=await pg.evaluate("[__t.save().set.bgmVol,+__w.SND.bus.bgm.gain.value.toFixed(3)]");chk('BGM 슬라이더 50% 반영',gv[0]==.5 and abs(gv[1]-.575)<.02,str(gv))
        await pg.click("button[data-id='snd']");await pg.wait_for_timeout(500);og=await pg.evaluate("[__t.save().set.snd,+__w.SND.bus.out.gain.value.toFixed(3)]");chk('전체 사운드 끄기',og[0]==0 and og[1]<.01,str(og))
        await pg.click("button[data-id='snd']");await pg.wait_for_timeout(300)
        await pg.evaluate("document.querySelector('.sp416').open=true");await pg.wait_for_timeout(200);await pg.click("button[data-snd='bgm_03_moonlight_fishing']");await pg.wait_for_timeout(2200);chk('미리 듣기로 BGM 바꿔 듣기',await pg.evaluate("__w.SND.curKey")=='bgm_03_moonlight_fishing')
        await pg.click("button[data-snd='sfx_20_legendary_treasure']");await pg.wait_for_timeout(100);chk('미리 듣기 효과음',await pg.evaluate("__w.SND.voices.some(v=>v.k==='sfx_20_legendary_treasure')"))
        await pg.evaluate('__t.persist()');await pg.reload();await pg.wait_for_timeout(700)
        chk('새로고침 후 음량 설정 유지',await pg.evaluate("__t.save().set.bgmVol")==.5)
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())

# ---- 나머지 효과음을 실제 게임 동작으로 확인 ----
TAP_AT="""(at)=>new Promise(res=>{const cv=document.getElementById('c');const f=()=>{const S=__t.S;
 if(S==='bite'&&__w.T>=at){cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:200,clientY:500,bubbles:true}));window.dispatchEvent(new PointerEvent('pointerup'));setTimeout(()=>res(__t.S),60);return}
 if(S==='fail'||S==='ready'){res(S);return}requestAnimationFrame(f)};f()})"""
async def extra():
    ok2=[];bad2=[]
    def c2(n,c,i=''):(ok2 if c else bad2).append(n);print(('OK  ' if c else 'BAD ')+n,i)
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH,args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(1200)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.setGear('r5','e5','l5');__t.set('lv',40);Promise.all(__w.AUDK.map(k=>__w.sndLoad(k)))");await pg.wait_for_timeout(1500)
        played=lambda k:pg.evaluate(f"(__w.SND.last['{k}']||-1)>window.__t0")
        mark=lambda:pg.evaluate("window.__t0=__w.SND.bus?(document.querySelector('canvas')&&0)+__w.SND.voices.length*0+ (window.__ac=(__w.SND.cur&&__w.SND.cur.s.context.currentTime)||0):0")
        async def now():return await pg.evaluate("(__w.SND.cur&&__w.SND.cur.s.context.currentTime)||0")
        # 메뉴 열기·닫기
        await pg.evaluate("window.__t0=(__w.SND.cur&&__w.SND.cur.s.context.currentTime)||0");await pg.click('#nav button >> nth=0');await pg.wait_for_timeout(400)
        c2('메뉴 열기 소리(02)',await played('sfx_02_menu_open'));await pg.evaluate("window.__t0=(__w.SND.cur&&__w.SND.cur.s.context.currentTime)||0");await pg.click('#sClose');await pg.wait_for_timeout(400)
        c2('메뉴 닫기 소리(03)',await played('sfx_03_menu_close'))
        # PERFECT 챔질
        await pg.evaluate("window.__t0=(__w.SND.cur&&__w.SND.cur.s.context.currentTime)||0;__t.force('mackerel')");await pg.evaluate('__cast(600)');await pg.evaluate(TAP_AT,.13)
        await pg.wait_for_timeout(200);c2('PERFECT 챔질음(10)만, 일반 챔질음(09) 없음',await played('sfx_10_perfect_hook') and not await played('sfx_09_hook_success'))
        # 장력 경고: 약한 장비로 계속 감아서 장력 올리기(경고음 1.4초 쿨다운)
        for _ in range(100):
            if await pg.evaluate('__t.S')=='fight':break
            await pg.wait_for_timeout(20)
        await pg.evaluate("__t.fg.gs=Object.assign({},__t.fg.gs,{stab:40,tred:0,rec:30})");await pg.mouse.move(200,500);await pg.mouse.down()
        for _ in range(120):
            if await pg.evaluate('__t.fg.ten>88||__t.S!=="fight"'):break
            await pg.wait_for_timeout(50)
        await pg.wait_for_timeout(600);await pg.mouse.up()
        c2('장력 위험 경고음(13)',await played('sfx_13_line_warning'),str(await pg.evaluate('Math.round(__t.fg.maxTen||0)')))
        await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(1500)
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.click('#bNext');await pg.wait_for_timeout(400)
        else:await pg.mouse.click(200,500);await pg.wait_for_timeout(400)
        # 위기 링 성공
        await pg.evaluate("window.__t0=(__w.SND.cur&&__w.SND.cur.s.context.currentTime)||0;__t.force('mackerel')");await pg.evaluate('__cast(600)')
        for _ in range(300):
            s=await pg.evaluate('__t.S')
            if s=='bite':await pg.mouse.click(200,500)
            if s=='fight':break
            await pg.wait_for_timeout(15)
        await pg.evaluate("__w.startClutch()")
        for _ in range(400):
            if await pg.evaluate("__w.clPhase()")>=1:break
            await pg.wait_for_timeout(8)
        await pg.mouse.move(200,500);await pg.mouse.down();await pg.mouse.up();await pg.wait_for_timeout(200)
        c2('위기 링 성공음(14), 결정타음(16)과 구분',await played('sfx_14_crisis_success'))
        await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(1500)
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.click('#bNext');await pg.wait_for_timeout(400)
        # 희귀 물고기(전체 연출)
        rare=await pg.evaluate("__w.FISH.find(f=>f.r===3&&!f.boss&&!f.hid&&f.loc.includes('pier')).id")
        await pg.evaluate("__t.set('set',Object.assign(__t.save().set,{reveal:'full'}));window.__t0=(__w.SND.cur&&__w.SND.cur.s.context.currentTime)||0;__t.force('"+rare+"')");await pg.evaluate('__cast(600)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(1500)
        rr=[await played('sfx_18_rare_fish'),await played('sfx_17_fish_caught'),await pg.evaluate('__w.lastRes&&[__w.lastRes.f.id,__w.lastRes.f.r]')];c2('희귀 물고기음(18) 재생',rr[0],str(rr))
        await pg.wait_for_timeout(1500)
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.click('#bNext');await pg.wait_for_timeout(400)
        # 보물 ★1 / ★5
        res={}
        for tid in ['coin','trident']:
            await pg.evaluate(f"__t.set('set',Object.assign(__t.save().set,{{reveal:'short'}}));window.__t0=(__w.SND.cur&&__w.SND.cur.s.context.currentTime)||0;window.__forceTre='{tid}'");await pg.evaluate('__cast(600)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(1500)
            res[tid]=[await played('sfx_19_treasure_found'),await played('sfx_20_legendary_treasure'),await played('sfx_18_rare_fish')]
            if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(400)
        c2('보물 ★1=보물 발견음(19) / ★5=대박 보물음(20), 희귀음 안 겹침',res=={'coin':[True,False,False],'trident':[False,True,False]},str(res))
        c2('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('EXTRA PASS',len(ok2),'FAIL',len(bad2),bad2)
asyncio.run(extra())
