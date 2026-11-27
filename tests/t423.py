"""4.23: 느슨한 줄 놓침 타이밍(등급별 여유·시작 유예) · 놓침 문구 위치 · 상점(뽑기·버프·대박 타임·보물 연마) · save.buf 저장"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
OUT=os.path.join(os.path.dirname(__file__),'out');os.makedirs(OUT,exist_ok=True)
async def to_bite(pg,fid):
    await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(600)')
    for _ in range(150):
        if await pg.evaluate("__t.S")=='bite':return True
        await pg.wait_for_timeout(60)
    return False
async def hook_then_release(pg,fid):
    """물고기를 걸고(챔질) 손을 뗀 채로 둔다 → 놓칠 때까지 걸린 힘겨루기 시간"""
    await to_bite(pg,fid)
    await pg.mouse.move(200,500);await pg.mouse.down();await pg.wait_for_timeout(60);await pg.mouse.up()
    t0=None;s=''
    for _ in range(200):
        s=await pg.evaluate("__t.S")
        if s=='fight' and t0 is None:t0=await pg.evaluate("performance.now()")
        if s=='fail':break
        await pg.wait_for_timeout(30)
    t1=await pg.evaluate("performance.now()");msg=await pg.evaluate("document.getElementById('toast').innerText")
    return s,((t1-t0)/1000 if t0 else None),msg
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':384,'height':824},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(500);await pg.click('#bStart');await pg.wait_for_timeout(500)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('lv',30)")
        # 손 떼고 놓칠 때까지(일반): 시작 유예 1.4초 + 바닥까지 + 0.6초
        s,dt,msg=await hook_then_release(pg,'mackerel')
        chk('일반: 걸자마자 손을 떼도 1.8초 이상 버팀(예전 약 0.8초)',s=='fail' and dt is not None and dt>=1.8,f'{s} {dt}')
        chk('놓침 문구: 큰 글씨 + 요령 작은 글씨',('줄이 느슨해서 도망갔어요' in msg) and ('\n' in msg),msg.replace('\n','|'))
        r=await pg.evaluate("(()=>{const e=document.getElementById('toast'),q=e.getBoundingClientRect(),w=e.offsetWidth,l=e.offsetLeft;return [l,l+w,e.offsetTop-e.offsetHeight/2,w,innerWidth,e.classList.contains('fail423')]})()")
        chk('놓침 문구: 가운데·넓게(좌우 대칭)·위쪽',abs((r[0]+r[1])/2-r[4]/2)<2 and r[3]>200 and r[2]<260 and r[5],str(r))
        await pg.screenshot(path=os.path.join(OUT,'t423_fail.png'))
        await pg.wait_for_timeout(900);await pg.mouse.click(200,500);await pg.wait_for_timeout(600)
        # 등급별 한계값
        lim=await pg.evaluate("(()=>{const out={};for(const r of [1,3,4,6]){const f=__t.F.find(x=>x.r===r&&!x.boss&&!x.hid&&x.k!=='chest');out[r]=f.id}return out})()")
        vals={}
        for r_,fid in lim.items():
            await to_bite(pg,fid);vals[r_]=await pg.evaluate("__w.slkLim()")
            await pg.evaluate('__bot(90000)');await pg.wait_for_timeout(1500)
            if await pg.evaluate("document.getElementById('result').classList.contains('on')"):await pg.wait_for_timeout(500);await pg.click('#bNext')
            else:await pg.mouse.click(200,500)
            await pg.wait_for_timeout(400)
        chk('느슨 한계: 일반 0.6 · 희귀 0.85 · 영웅↑ 1.1',vals.get('1')==.6 and vals.get('3')==.85 and vals.get('4')==1.1 and vals.get('6')==1.1,str(vals))
        # 상점
        await pg.evaluate("__t.set('gold',1000000)");await pg.evaluate("openSheet('equip','shop')");await pg.wait_for_timeout(400)
        tx=await pg.evaluate("document.getElementById('sbody').innerText");chk('장비 › 상점 탭(뽑기·버프·연마)',all(k in tx for k in ['행운 뽑기','희귀 물고기 향','황금 손','빠른 입질','대박 타임 즉시','보물 연마']),tx[:80].replace('\n',' '))
        await pg.screenshot(path=os.path.join(OUT,'t423_shop.png'))
        await pg.click("[data-shop='g1']");await pg.wait_for_timeout(1300)
        st=await pg.evaluate("[__t.save().st.gacha,document.querySelector('.gres').innerText]");chk('뽑기 1회: 횟수·결과 표시',st[0]==1 and len(st[1])>2,str(st))
        await pg.screenshot(path=os.path.join(OUT,'t423_gacha.png'))
        await pg.click("[data-shop='g10']");await pg.wait_for_timeout(1700)
        st=await pg.evaluate("[__t.save().st.gacha,document.querySelectorAll('.gres span').length]");chk('뽑기 10회: 결과 10개',st[0]==11 and st[1]==10,str(st))
        await pg.screenshot(path=os.path.join(OUT,'t423_gacha10.png'))
        ev=await pg.evaluate("(()=>{const s=__t.save();let g=0;const n=4000,g0=s.gold;const lv=s.lv,xp=s.xp;for(let i=0;i<n;i++){const b0=s.gold;__w.gachaRoll(1000);g+=s.gold-b0;s.lv=lv;s.xp=xp}s.gold=g0;return g/n/1000})()")
        chk('뽑기 골드 기대값 0.6~0.95 (골드가 빠져나감)',.6<=ev<=.95,f'{ev:.3f}')
        await pg.evaluate("(()=>{const s=__t.save();s.buf={rare:0,gold:0,bite:0}})()");await pg.evaluate("__w.JP.t=0")
        await pg.evaluate("__t.set('gold',1000000)");await pg.evaluate("openSheet('equip','shop')");await pg.wait_for_timeout(300)
        bc=await pg.evaluate("__w.bCost('gold')");g0=await pg.evaluate("__t.save().gold");await pg.click("[data-shop='b_gold']");await pg.wait_for_timeout(300)
        bf=await pg.evaluate("[__t.save().buf.gold,__t.save().gold,__w.bufGold()]");chk('버프 구매: 5분·골드 차감·효과 +30%',290<bf[0]<=300 and bf[1]==g0-bc and bf[2]==.3,str((bf,bc)))
        await pg.click("[data-shop='b_rare']");await pg.wait_for_timeout(300)
        await pg.evaluate("closeSheet()");await pg.wait_for_timeout(1300)
        ban=await pg.evaluate("(document.querySelector('.buf423')||{}).textContent||''");chk('버프 남은 시간 배너',('🪙' in ban) and ('🌟' in ban),ban)
        await pg.evaluate("__t.persist&&__t.persist()");await pg.wait_for_timeout(300);await pg.reload();await pg.wait_for_timeout(900)
        sv=await pg.evaluate("JSON.parse(localStorage.getItem('haneul-fish-v4')).buf");chk('버프 저장·불러오기',bool(sv) and sv.get('gold',0)>200 and sv.get('rare',0)>200,json.dumps(sv))
        await pg.add_script_tag(content=BOT);await pg.click('#bStart');await pg.wait_for_timeout(400);await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999)")
        await pg.evaluate("(()=>{const s=__t.save();s.tre.coin={n:1,first:'2026-01-01',loc:'pier',lv:1};s.gold=1000000})()");await pg.evaluate("openSheet('equip','shop')");await pg.wait_for_timeout(300)
        pc=await pg.evaluate("__w.polCost('coin',1)");await pg.click("[data-shop='p_coin']");await pg.wait_for_timeout(300)
        chk('보물 연마: Lv1→2, 골드 차감',await pg.evaluate("__t.save().tre.coin.lv")==2 and await pg.evaluate("__t.save().gold")==1000000-pc,str(pc))
        await pg.click("[data-shop='jp']");await pg.wait_for_timeout(300);chk('대박 타임 즉시 구매',await pg.evaluate("__w.JP.t")>25)
        await pg.evaluate("closeSheet()")
        await pg.wait_for_timeout(300);await pg.click('.goldShop');await pg.wait_for_timeout(400)
        chk('상단 골드를 누르면 상점',await pg.evaluate("document.getElementById('sheet').classList.contains('on')&&document.getElementById('sbody').innerText.includes('행운 뽑기')"))
        await pg.evaluate("closeSheet()")
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
