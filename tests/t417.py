"""4.17: 살아 있는 배경(시간대 7·날씨·계절) · 콤보 강화(20 이후) · 사운드 확장(동적 음악·환경음·물고기 그룹·이벤트·반응음)"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json,time
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH,args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(1200)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.setGear('r5','e5','l5');__t.set('lv',40);__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        # ---- 배경 ----
        T=[('morning',60),('noon',150),('afternoon',220),('golden',255),('pink',290),('dusk',350),('night',420)]
        got=[]
        for lab,gt in T:
            await pg.evaluate(f"__t.setTime({gt})");got.append(await pg.evaluate("__w.bfxTime()"))
        chk('시간대 7종 구분',got==[x for x,_ in T],str(got))
        # 같은 지점 픽셀이 시간대마다 달라지는지(하늘 한 점)
        async def skypx(js):
            await pg.evaluate(js);await pg.evaluate("__w.bfxComposeNow()")
            return await pg.evaluate("(()=>{const c=__w.BFX.cur.c.getContext('2d').getImageData(400,60,1,1).data;return[c[0],c[1],c[2]]})()")
        cols={lab:await skypx(f"__t.setWeather('clear');__t.setTime({gt})") for lab,gt in T}
        dist=lambda a,c:sum(abs(x-y) for x,y in zip(a,c));labs=list(cols);mind=min(dist(cols[a],cols[c]) for i,a in enumerate(labs) for c in labs[i+1:])
        chk('시간대마다 하늘색이 서로 다름(최소 차 30 이상)',mind>=30,json.dumps(cols))
        w={wx:await skypx(f"__t.setTime(150);__t.setWeather('{wx}')") for wx in ['clear','cloudy','rain','storm','fog']}
        chk('날씨마다 하늘이 다름·폭풍이 가장 어두움',min(w,key=lambda k:sum(w[k]))=='storm' and len({tuple(v) for v in w.values()})==5,json.dumps(w))
        # 계절 덧그림(호수)
        await pg.evaluate("(()=>{const s=__t.save();s.locs.lake=1;__t.set('loc','lake');__t.setWeather('clear');__t.setTime(150)})()")
        sea={}
        for sn in ['spring','summer','autumn','winter']:
            await pg.evaluate(f"window.__season='{sn}';__w.bfxComposeNow()")
            sea[sn]=await pg.evaluate("(()=>{const g=__w.BFX.cur.c.getContext('2d'),d=g.getImageData(0,0,__w.BFX.cur.c.width,__w.BFX.cur.c.height).data;let r=0,gg=0,b=0,n=0;for(let i=0;i<d.length;i+=4*97){r+=d[i];gg+=d[i+1];b+=d[i+2];n++}return[Math.round(r/n),Math.round(gg/n),Math.round(b/n)]})()")
        chk('계절: 가을이 가장 붉고 겨울이 가장 희다',sea['autumn'][0]-sea['autumn'][1]>sea['summer'][0]-sea['summer'][1] and sum(sea['winter'])>sum(sea['summer']),json.dumps(sea))
        await pg.evaluate("window.__season='summer';__t.set('loc','pier')")
        # 프레임 나눠 계산: 조건 바뀐 뒤 한 프레임 안에서 오래 막히지 않음
        lt=await pg.evaluate("""new Promise(res=>{__t.setTime(255);let worst=0,last=performance.now(),n=0;const f=()=>{const now=performance.now();worst=Math.max(worst,now-last);last=now;if(++n<90)requestAnimationFrame(f);else res([worst,__w.BFX.key])};requestAnimationFrame(f)})""")
        chk('배경 다시 계산 중 프레임 멈춤 60ms 이하',lt[0]<60,f'{lt[0]:.0f}ms')
        # ---- 콤보 ----
        await pg.evaluate("__w.setCombo(19)");g0=await pg.evaluate("__t.save().gold")
        await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(500)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(2200)
        r=await pg.evaluate("({c:__w.combo,big:document.getElementById('big').innerText,cls:document.body.classList.contains('streak20'),bar:!!document.querySelector('#combo .cg418'),g:__t.save().gold})")
        chk('20콤보 보물상자·무지개 테두리·게이지',r['c']==20 and '20콤보 보물상자' in r['big'] and r['cls'] and r['bar'],json.dumps(r,ensure_ascii=False))
        await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(400)
        await pg.evaluate("__w.setCombo(29)");await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(500)');await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(2200)
        r2=await pg.evaluate("({ex:__w.lastRes.comboExtra||0,title:!!__t.save().titles['파도를 탄 자'],tier:document.getElementById('combo').innerText})")
        chk('30콤보: 추가 골드 보너스·칭호·새 단계 이름',r2['ex']>0 and r2['title'] and '용왕의 손맛' in r2['tier'],json.dumps(r2,ensure_ascii=False))
        await pg.wait_for_timeout(600);await pg.click('#bNext');await pg.wait_for_timeout(400)
        chk('배율 50콤보에서 ×2.8 상한',abs(await pg.evaluate("__w.setCombo(60),1+.06*20+__w.comboExtra()")-2.8)<1e-9)
        await pg.evaluate("__w.setCombo(0)")
        # ---- 사운드 ----
        await pg.evaluate("Promise.all(__w.AUDK.map(k=>__w.sndLoad(k)))")
        n=await pg.evaluate("__w.AUDK.length");chk('음원 47개(기존 25 + 새 22)',n==47,str(n))
        await pg.evaluate("__t.setWeather('clear');__t.setTime(150);__t.set('loc','pier')");await pg.wait_for_timeout(5600)
        am=await pg.evaluate("Object.keys(__w.SND2.loops)");chk('맑은 낮 선착장: 파도+갈매기',set(['amb_waves','amb_gulls'])<=set(am),str(am))
        await pg.evaluate("__t.setWeather('storm')");await pg.wait_for_timeout(5600);am=await pg.evaluate("Object.keys(__w.SND2.loops).filter(k=>__w.SND2.loops[k].v>0)")
        chk('폭풍우: 폭풍 소리만',am==['amb_storm'],str(am))
        await pg.evaluate("__t.setWeather('clear');__t.setTime(420)");await pg.wait_for_timeout(5600);am=await pg.evaluate("Object.keys(__w.SND2.loops).filter(k=>__w.SND2.loops[k].v>0)")
        chk('밤: 밤바다 물결',am==['amb_night_waves'],str(am));await pg.evaluate("__t.setTime(150)")
        # 동적 음악: 힘겨루기·위험
        await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(500)')
        for _ in range(300):
            s=await pg.evaluate('__t.S')
            if s=='bite':await pg.mouse.click(200,500)
            if s=='fight':break
            await pg.wait_for_timeout(15)
        await pg.wait_for_timeout(500);st=await pg.evaluate("[__w.musicState(),+(__w.SND2.loops.layer_tension&&__w.SND2.loops.layer_tension.v||0).toFixed(2),Math.round(__w.SND2.filt.frequency.value)]")
        await pg.evaluate("__w.startClutch()");await pg.wait_for_timeout(500);st2=await pg.evaluate("[__w.musicState(),+(__w.SND2.loops.layer_danger&&__w.SND2.loops.layer_danger.v||0).toFixed(2)]")
        chk('동적 음악: 힘겨루기 긴장 레이어·저역 필터 / 위기 링 위험 레이어',st[0]=='fight' and st[1]>.3 and st[2]<9000 and st2[0]=='danger' and st2[1]>.3,f'{st} {st2}')
        await pg.evaluate('__bot(60000)');await pg.wait_for_timeout(3500)
        back=await pg.evaluate("[__w.musicState(),+(__w.SND2.loops.layer_tension?__w.SND2.loops.layer_tension.v:0).toFixed(2),+(__w.SND2.loops.layer_danger?__w.SND2.loops.layer_danger.v:0).toFixed(2)]")
        chk('끝나면 긴장 레이어 꺼짐(음악 계속)',back[1]==0 and back[2]==0 and await pg.evaluate("!!__w.SND.cur"),str(back))
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.click('#bNext');await pg.wait_for_timeout(400)
        else:await pg.mouse.click(200,500);await pg.wait_for_timeout(400)
        # 물고기 그룹
        grp=await pg.evaluate("['goby','mackerel','tuna'].map(id=>{const f=__t.FID[id];return __w.fishGroup(Object.assign({},f,{size:f.max,sc:2,kgv:20}))}).concat([__w.fishGroup(Object.assign({},__t.FID.goby,{sc:0,kgv:.05})),__w.fishGroup({boss:'kraken'})])")
        chk('물고기 그룹 분류',grp[3]=='small' and grp[4]=='boss' and 'big' in grp[0]+grp[1],str(grp))
        # 이벤트: 황금 물고기 시작 → evt_golden 한 번
        await pg.evaluate("__w.SND2.ev={};__t.golden()");await pg.wait_for_timeout(400);await pg.evaluate("__t.golden()");await pg.wait_for_timeout(300)
        ev=await pg.evaluate("Object.keys(__w.SND2.ev)");chk('황금 물고기 이벤트음(중복 없이)',ev.count('evt_golden')==1,str(ev))
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
