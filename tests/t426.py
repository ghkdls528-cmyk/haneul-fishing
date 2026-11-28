"""4.26: 라벤더 후드 새 그림 · 나비 삭제 · 계절 입자(벚꽃·윤슬·단풍·눈) · 배경(반사 막대·하늘 톱니 자국) · 수족관 리뉴얼(등급별·세트 보너스·보물 방울) · 물고기 행동 읽기(신호·읽기·성격)"""
import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
ok=[];bad=[]
def chk(n,c,i=''):(ok if c else bad).append(n);print(('OK  ' if c else 'BAD ')+n,i)
OUT=os.path.join(os.path.dirname(__file__),'out');os.makedirs(OUT,exist_ok=True)
TRACE="""(()=>{const P=CanvasRenderingContext2D.prototype,o=P.ellipse,f=P.fillRect,res={bf:0,deep:0};const g0=window.__w&&__w.G?null:null;
 P.ellipse=function(...a){if(this.canvas.id==='c'&&(String(this.fillStyle)==='#ff9ec4'||String(this.fillStyle)==='#ffd23f')&&a[3]===5)res.bf++;return o.apply(this,a)};
 P.fillRect=function(...a){return f.apply(this,a)};
 return new Promise(r=>setTimeout(()=>{P.ellipse=o;P.fillRect=f;r(res)},1500))})()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);errs=[]
        pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True);pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(400);await pg.add_script_tag(content=BOT);await pg.click('#bStart');await pg.wait_for_timeout(600)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('lv',30)")
        # 나비 삭제 (선착장 낮)
        r=await pg.evaluate(TRACE);chk('낚시터 나비(분홍·노랑 날개) 안 그림',r['bf']==0,str(r))
        # 계절 입자: 네 계절 모두 오류 없이 그려짐 + 화면 캡처
        for s in ['spring','summer','autumn','winter']:
            await pg.evaluate(f"window.__season='{s}'");await pg.wait_for_timeout(700)
            await pg.screenshot(path=os.path.join(OUT,f't426_{s}.png'),clip={'x':0,'y':100,'width':390,'height':330})
        await pg.evaluate("window.__season=null")
        chk('계절 입자 4계절 오류 없음',not errs,str(errs[:2]))
        # 배경: 하늘 덧칠이 원래 무늬를 살림(계곡 아침 = 먼 산이 평평한 색이 아님)
        await pg.evaluate("(()=>{const s=__t.save();s.locs.valley=1;s.loc='valley'})()");await pg.evaluate("__w.gtSet(__w.DAY*3.12)");await pg.wait_for_timeout(1800)
        v=await pg.evaluate("(()=>{const c=document.getElementById('c'),g=c.getContext('2d'),d=devicePixelRatio||1,img=g.getImageData(0,Math.round(230*d),Math.round(140*d),Math.round(40*d)).data;let mn=1e9,mx=0;for(let i=0;i<img.length;i+=4){const l=img[i]*.3+img[i+1]*.59+img[i+2]*.11;mn=Math.min(mn,l);mx=Math.max(mx,l)}return [__w.bfxTime(),Math.round(mx-mn)]})()")
        chk('계곡 하늘 영역: 먼 산 무늬가 살아 있음(밝기 차 > 25)',v[1]>25,str(v))
        await pg.screenshot(path=os.path.join(OUT,'t426_valley.png'),clip={'x':0,'y':100,'width':390,'height':300})
        # 수족관
        await pg.evaluate("(()=>{const s=__t.save();const ids=[];for(const r of [1,2,3,4,5,6]){__t.F.filter(f=>f.r===r&&f.k!=='chest'&&!f.boss).slice(0,3).forEach(f=>{s.dex[f.id]={n:1};ids.push(f.id)})}s.aq.cap=3;s.aq.slots=ids.slice(0,6).concat(ids.slice(15,17));persist()})()")
        await pg.click("#nav button[data-open='aq']");await pg.wait_for_timeout(1500)
        tx=await pg.evaluate("document.getElementById('aqBody').innerText")
        chk('수족관 전시 목록이 등급별(신화~일반)',all(k in tx for k in ['신화','전설','영웅','희귀','고급','일반']) and tx.index('신화')<tx.index('일반'),tx[:60].replace('\n',' '))
        empty=await pg.evaluate("[...document.querySelectorAll('#aqBody canvas[data-aqf]')].filter(c=>!c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)).map(c=>c.dataset.aqf)")
        chk('카드마다 물고기 그림',not empty,str(empty))
        sb=await pg.evaluate("[__w.aqSetBonus(),__w.aqRateNow()]");chk('등급 세트 보너스: ★1·★2 3마리씩 = +8%',sb[0]==8,str(sb))
        await pg.click("[data-aq6f='on']");await pg.wait_for_timeout(300);n_on=await pg.evaluate("document.querySelectorAll('#aqBody .aq6c').length");chk('전시 중만 보기',n_on==8,str(n_on))
        await pg.click("[data-aq6f='all']");await pg.wait_for_timeout(300)
        g0=await pg.evaluate("__t.save().gold");await pg.evaluate("__w.aqSpawnBub()");await pg.wait_for_timeout(300)
        k=await pg.evaluate("__w.aqPopFirst()");g1=await pg.evaluate("__t.save().gold")
        chk('보물 방울 누르면 골드',k is not None and g1>g0,f'{k} {g0}->{g1}')
        await pg.screenshot(path=os.path.join(OUT,'t426_aq.png'))
        # 방울 터치(캔버스 좌표)
        await pg.evaluate("__w.aqSpawnBub()");await pg.wait_for_timeout(200)
        pos=await pg.evaluate("(()=>{const b=__w.AQ6.bub[__w.AQ6.bub.length-1],r=document.getElementById('aqc').getBoundingClientRect();return [r.left+b.x,r.top+b.y]})()")
        g2=await pg.evaluate("__t.save().gold");await pg.mouse.click(pos[0],pos[1]-4);await pg.wait_for_timeout(300)
        chk('방울을 손가락으로 눌러도 골드',await pg.evaluate("__t.save().gold")>g2)
        # 4.28 신화·전설 4마리 이상 전시해도 전시대가 수조 안에
        await pg.evaluate("(()=>{const s=__t.save();const hi=__t.F.filter(f=>f.r>=5&&f.k!=='chest'&&!f.boss).slice(0,6).map(f=>f.id);hi.forEach(id=>s.dex[id]={n:1});s.aq.slots=hi.concat(s.aq.slots).slice(0,15);__w.aqSync?__w.aqSync():0})()")
        await pg.click("#aqClose");await pg.wait_for_timeout(300);await pg.click("#nav button[data-open='aq']");await pg.wait_for_timeout(4500)
        inn=await pg.evaluate("(()=>{const c=document.getElementById('aqc'),w=c.width/devicePixelRatio;const sp=__w.aqFish().filter(a=>a.f.r>=5);return sp.map(a=>[a.f.r,Math.round(a.x),Math.round(w)])})()")
        top4=sorted(inn,key=lambda x:-x[0])[:4]
        chk('전설·신화 6마리 전시: 등급 높은 4마리가 수조 안 전시대에',len(inn)>=4 and all(10<x[1]<x[2]-10 for x in top4),str(inn))
        await pg.screenshot(path=os.path.join(OUT,'t426_aq_myth.png'))
        cap=await pg.evaluate("(()=>{const s=__t.save();s.aq.pb={d:'',n:0};__w.aqPbLeft();s.aq.pb.n=40;return __w.aqPbLeft()})()");chk('보물 방울 하루 40개 제한',cap==0,str(cap))
        await pg.evaluate("__t.persist&&__t.persist()");await pg.reload();await pg.wait_for_timeout(700)
        pb=await pg.evaluate("JSON.parse(localStorage.getItem('haneul-fish-v4')).aq.pb");chk('방울 횟수 저장',pb and pb['n']==40,json.dumps(pb))
        await pg.add_script_tag(content=BOT);await pg.click('#bStart');await pg.wait_for_timeout(500);await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('lv',30)")
        # 물고기 성격: 모든 저항 패턴에서 성격이 나옴
        tr=await pg.evaluate("(()=>{const out={};for(const fm of Object.keys(__w.AI_TELL)){const c={};for(let i=0;i<400;i++){const k=__w.aiTrait('mackerel',fm);c[k]=(c[k]||0)+1}out[fm]=c}return out})()")
        chk('저항 패턴마다 성격 분포가 다름(돌진형은 성급, 휴식형은 느긋, 숨기형은 영리가 많음)',tr['burst'].get('hasty',0)>tr['float'].get('hasty',0) and tr['float'].get('calm',0)>tr['burst'].get('calm',0) and tr['hide'].get('smart',0)>tr['burst'].get('smart',0),json.dumps({k:tr[k] for k in ['burst','float','hide']}))
        # 실제 낚시: 걸고 → 성격·신호 → 손 뗀 채 저항 → 읽기
        fid=await pg.evaluate("__t.F.find(f=>f.fm==='zigzag'&&f.r===2&&!f.boss).id")
        await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(600)')
        for _ in range(150):
            if await pg.evaluate("__t.S")=='bite':break
            await pg.wait_for_timeout(60)
        await pg.mouse.move(200,500);await pg.mouse.down();await pg.wait_for_timeout(60);await pg.mouse.up()
        for _ in range(60):
            if await pg.evaluate("__t.S")=='fight':break
            await pg.wait_for_timeout(30)
        ai=await pg.evaluate("__w.ai&&__w.ai.k");chk('힘겨루기 시작하면 개체 성격',ai in ['hasty','calm','smart','tough','normal'],str(ai))
        # 4.28: 화살표 신호 대신 '거품 톡!' — 거품이 뜨면 손가락으로 눌러 터뜨림
        await pg.evaluate("(()=>{const f=__w.fg;f.freeT=0;f.ten=50;f.ai.nb=.05})()")
        pos=None
        for _ in range(30):
            pos=await pg.evaluate("(()=>{const b=__w.ai&&__w.ai.bub;return b?[b.x,b.y]:null})()")
            if pos:break
            await pg.wait_for_timeout(40)
        chk('힘겨루기 중 반짝 거품이 뜸',pos is not None,str(pos))
        await pg.screenshot(path=os.path.join(OUT,'t426_bubble.png'))
        hp0=await pg.evaluate("__w.fg.hp")
        if pos:
            pos=await pg.evaluate("(()=>{const b=__w.ai.bub;return b?[b.x,b.y]:null})()") or pos
            await pg.mouse.click(pos[0],pos[1])
        await pg.wait_for_timeout(200)
        rd=await pg.evaluate("__w.ai?__w.ai.reads:-1");hp1=await pg.evaluate("__w.fg.hp")
        chk('거품을 톡 누르면 팡! (물고기 지침)',rd>=1 and hp1<hp0,f'{rd} {hp0}->{hp1}')
        chk('화살표 신호 없음(4.28 삭제)',await pg.evaluate("!('tell' in (__w.ai||{}))"))
        await pg.screenshot(path=os.path.join(OUT,'t426_fight.png'))
        await pg.evaluate('__bot(90000)');await pg.wait_for_timeout(2500)
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
