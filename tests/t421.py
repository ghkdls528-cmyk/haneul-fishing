"""4.21: 찌 그림 · 도감 추천 미끼(메탈 루어 → 실제 미끼 이름) · 지역 보너스 어디서나 · 황금상자 영웅급+대박 뽑기 · 대박 타임 · 골드 숫자 올라가기"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
OUT=os.path.join(os.path.dirname(__file__),'out');os.makedirs(OUT,exist_ok=True)
async def catch(pg,fid,ms=90000):
    for _ in range(5):
        await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(600)');await pg.evaluate(f'__bot({ms})');await pg.wait_for_timeout(1500)
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):return True
        await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
    return False
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(600);await pg.click('#bStart');await pg.wait_for_timeout(600)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.setGear('r5','e5','l5');__t.set('lv',30);__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        # 추천 미끼
        r=await pg.evaluate("(()=>{const names=new Set(__w.baitNames());let bad=[],metal=0;for(const f of __t.F){const a=__w.baitPref(f.id);if(a.some(x=>x.includes('메탈')))metal++;for(const x of a)if(!names.has(x))bad.push(f.id+':'+x)}return [metal,bad.slice(0,5),__w.baitPref('mackerel')]})()")
        chk('도감 추천 미끼: 메탈 루어 0 · 모두 실제 미끼 이름',r[0]==0 and not r[1],str(r))
        # 지역 보너스
        g=await pg.evaluate("(()=>{const s=__t.save();const a=__w.locGM();s.locs.ice=1;const b=__w.locGM();return [a,b]})()")
        chk('지역 보너스: 얼음 낚시터를 열면 어디서나 ×2.2',g[0]==1 and abs(g[1]-2.2)<1e-9,str(g))
        await pg.evaluate("__t.set('loc','pier');__w.setCombo(0)")
        if await catch(pg,'mackerel',60000):
            tx=await pg.evaluate("document.getElementById('result').innerText");chk('선착장에서도 지역 보너스 표시',('지역 +120%' in tx),tx.replace('\n',' ')[:200])
            await pg.wait_for_timeout(1700);gt=await pg.evaluate("[document.getElementById('rGold').textContent,__w.lastRes.gold]")
            chk('골드 숫자 올라가기: 끝나면 최종 골드',gt[0].replace(',','')=='+'+str(gt[1]),str(gt))
            await pg.click('#bNext');await pg.wait_for_timeout(300)
        else:chk('고등어 낚기',False)
        await pg.evaluate("__t.save().locs.ice=0")
        # 황금상자: 대박 뽑기 확률·금액
        cg=await pg.evaluate("(()=>{const R=Math.random;const out=[];for(const v of [.5,.1,.01]){Math.random=()=>v;out.push(__w.chestGold(0))}Math.random=R;return out})()")
        base=await pg.evaluate("__w.gold4")
        chk('황금상자: 최소 영웅 기본 골드×1.3, ×2, 대박 ×5',cg[0]>=base*1.3 and abs(cg[1]/cg[0]-2/1.3)<.02 and abs(cg[2]/cg[0]-5/1.3)<.02,str((base,cg)))
        # 실전 황금상자
        t0=await pg.evaluate("Object.keys(__t.save().tre).length")
        got=await catch(pg,'chest',90000)
        if got:
            lr=await pg.evaluate("__w.lastRes.gold");chk('실전 황금상자 골드 ≥ 영웅 기본 골드',lr>=base,str(lr))
            jp=await pg.evaluate("[__w.JP.t,document.body.classList.contains('jp421')]");await pg.wait_for_timeout(1200)
            chk('상자(★4)도 대박 타임 시작',jp[0]>20,str(jp))
            await pg.screenshot(path=os.path.join(OUT,'t421_chest.png'))
            await pg.click('#bNext');await pg.wait_for_timeout(500)
        else:chk('황금상자 낚기',False)
        # 대박 타임: 배너·희귀 확률·골드 +20%
        await pg.evaluate("__w.JP.t=25;__w.JP.n=1;__w.hud()");await pg.wait_for_timeout(400)
        bn=await pg.evaluate("(document.querySelector('.jp421b')||{}).textContent||''");chk('대박 타임 배너',bn.startswith('💫 대박 타임'),bn)
        w=await pg.evaluate("(()=>{const a=__w.wts();__w.JP.t=0;const c=__w.wts();__w.JP.t=25;let k=-1;a.forEach((v,i)=>{if(__t.F[i].r>=3&&c[i]>0)k=a[i]/c[i]});return k})()")
        chk('대박 타임: 희귀 이상 가중치 1.5배',abs(w-1.5)<.05,str(w))
        await pg.screenshot(path=os.path.join(OUT,'t421_jp.png'))
        await pg.evaluate("__w.JP.t=.05");await pg.wait_for_timeout(500)
        chk('대박 타임 끝나면 배너·테두리 사라짐',await pg.evaluate("!document.querySelector('.jp421b')&&!document.body.classList.contains('jp421')"))
        # 찌 그림
        bb=await pg.evaluate("['red','yellow','heart','star','goldbob'].map(id=>__w.bobOk(id))")
        chk('찌 그림 5종 로드',all(bb),str(bb))
        for id in ['red','goldbob']:
            await pg.evaluate(f"__t.save().bob='{id}'");await pg.evaluate('__cast(500)');await pg.wait_for_timeout(1800)
            await pg.screenshot(path=os.path.join(OUT,f't421_bob_{id}.png'));await pg.mouse.click(200,500);await pg.wait_for_timeout(800)
        # 보물 지도 문구
        chk('보물 지도 문구: 보물 발견 확률',(await pg.evaluate("__w.scrollTxt(3)"))=='보물 발견 확률 +3%p')
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
