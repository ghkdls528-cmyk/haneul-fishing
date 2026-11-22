import sys,os;sys.path.insert(0,os.path.dirname(__file__));from _env import GAME,BOT,LAUNCH
import asyncio,json
from playwright.async_api import async_playwright
OUT=os.environ.get('SHOT_DIR',os.path.dirname(__file__))
ok=[];bad=[]
def chk(name,cond,info=''):
    (ok if cond else bad).append(name);print(('OK  ' if cond else 'BAD ')+name,info)
async def catch(pg,fid):
    await pg.evaluate(f"__t.force('{fid}')");await pg.evaluate('__cast(900)')
    r=await pg.evaluate('__bot(240000)')
    for _ in range(80):
        if await pg.evaluate("document.getElementById('result').classList.contains('on')"):break
        await pg.wait_for_timeout(100)
    return r
async def nxt(pg):
    await pg.wait_for_timeout(700);await pg.click('#bNext');await pg.wait_for_timeout(400)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**LAUNCH);ctx=await b.new_context(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=2);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(GAME+'?test');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_timeout(600)
        # 1) 4.13 세이브(새 필드 없음) 준비
        old=await pg.evaluate("""()=>{const s=JSON.parse(JSON.stringify(__t.save()));delete s.fightRecords;delete s.fightGradeCounts;
          Object.assign(s,{gold:123456,lv:30,count:77,dex:{mackerel:5,goby:2},best:{mackerel:{cm:41,kg:.9}},gear:{rod:'r5',reel:'e5',line:'l5'},gown:Object.assign(s.gown,{r5:1,e5:1,l5:1}),pets:{cat:1},pet:'cat',locs:Object.assign(s.locs,{rock:1})});
          s.ward.own['hat:cap']=1;localStorage.setItem('haneul-fish-v4',JSON.stringify(s));return s}""")
        # 열린 페이지가 닫힐 때 자기 세이브를 다시 쓰지 않도록, 저장 키를 덮어쓴 뒤 페이지를 닫고 새로 연다
        # 실제 4.13 사용자 저장소와 같게: 4.14.2의 복구용 사본(-safe)·저장 번호(-rev)는 없음
        raw=json.dumps(old)
        await pg.close();pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('haneul-fish-v4',"+json.dumps(raw)+");localStorage.removeItem('haneul-fish-v4-backup');localStorage.removeItem('haneul-fish-v4-safe');localStorage.removeItem('haneul-fish-v4-rev');sessionStorage.setItem('seeded','1')}")
        await pg.goto(GAME+'?test');await pg.add_script_tag(content=BOT);await pg.wait_for_timeout(700)
        s=await pg.evaluate('__t.save()')
        diff=[k for k in ['gold','lv','count','dex','best','gear','pets','pet','locs','ward','aq'] if json.dumps(s[k],sort_keys=True)!=json.dumps(old[k],sort_keys=True)]
        chk('4.13 세이브 보존(골드·도감·장비·의상·펫)',not diff,str(diff))
        chk('새 필드 기본값 추가',s.get('fightRecords')=={} and s.get('fightGradeCounts')=={'S':0,'A':0,'B':0,'C':0,'D':0},str(s.get('fightGradeCounts')))
        await pg.click('#bStart');await pg.wait_for_timeout(400)
        await pg.evaluate("window.__noLuck=1;__w.setEvtNext(9999);__t.set('set',Object.assign(__t.save().set,{reveal:'short'}))")
        # 2) 실제 낚시 → 결과 화면 평가
        g0=await pg.evaluate('__t.save().gold')
        r=await catch(pg,'mackerel');res=await pg.evaluate("({sk:__w.lastRes&&__w.lastRes.skill,rec:__t.save().fightRecords.mackerel,gc:__t.save().fightGradeCounts,vis:getComputedStyle(document.getElementById('rSkill')).display,txt:document.getElementById('rSkill').innerText,gold:__w.lastRes.gold})")
        print(' bot',r,'skill',res['sk'])
        sk=res['sk'];chk('평가 표시',sk is not None and res['vis']!='none' and f"{sk['total']}점" in res['txt'],res['txt'].replace('\n',' / ')[:120])
        chk('점수 = 항목 합',sk and sk['total']==sk['ten']+sk['eff']+sk['cri'] and 0<=sk['ten']<=50 and 0<=sk['eff']<=30 and sk['cri'] in (0,8,16,20))
        chk('등급 구간',sk and sk['g']==('S' if sk['total']>=90 else 'A' if sk['total']>=80 else 'B' if sk['total']>=65 else 'C' if sk['total']>=50 else 'D'))
        rec=res['rec'];chk('기록 저장(최초)',rec and rec['catchCount']==1 and rec['bestScore']==sk['total'] and abs(rec['bestTimeMs']-sk['t']*1000)<2 and rec['largestSize']>=41,str(rec))
        chk('등급 누적',sum(res['gc'].values())==1 and res['gc'][sk['g']]==1)
        chk('골드 정상 지급(평가와 무관)',(await pg.evaluate('__t.save().gold'))-g0==res['gold'])
        await pg.evaluate("document.getElementById('rSkillD').open=true");await pg.wait_for_timeout(300)
        await pg.screenshot(path=os.path.join(OUT,'t414_result.png'))
        box=await pg.evaluate("(()=>{const r=document.querySelector('#rSkill summary').getBoundingClientRect(),c=document.querySelector('#result .rcard').getBoundingClientRect();return{h:r.height,w:r.width,cardBottom:c.bottom,vh:innerHeight}})()")
        chk('접기 버튼 44px 이상·화면 안',box['h']>=44 and box['cardBottom']<=box['vh']+1,str(box))
        await nxt(pg)
        # 3) 두 번째 → 독립 갱신
        r=await catch(pg,'mackerel');res2=await pg.evaluate("({sk:__w.lastRes.skill,rec:__t.save().fightRecords.mackerel})")
        sk2,rec2=res2['sk'],res2['rec']
        chk('두 번째 기록',rec2['catchCount']==2 and rec2['bestScore']==max(sk['total'],sk2['total']) and rec2['bestTimeMs']==min(round(sk['t']*1000),round(sk2['t']*1000)),f"{sk['total']},{sk2['total']} / {sk['t']:.2f},{sk2['t']:.2f} → {rec2}")
        await nxt(pg)
        # 4) 실패 → 기록 안 남음
        before=await pg.evaluate('JSON.stringify([__t.save().fightRecords,__t.save().fightGradeCounts])')
        await pg.evaluate("__t.force('mackerel')");await pg.evaluate('__cast(900)')
        for _ in range(300):
            st=await pg.evaluate('__t.S')
            if st=='bite':await pg.mouse.click(200,500)
            if st=='fight':break
            await pg.wait_for_timeout(30)
        for _ in range(200):
            if await pg.evaluate('__t.S')!='fight':break
            await pg.wait_for_timeout(50)
        st=await pg.evaluate('__t.S');after=await pg.evaluate('JSON.stringify([__t.save().fightRecords,__t.save().fightGradeCounts])')
        chk('놓치면 기록 없음',st=='fail' and before==after,st)
        await pg.wait_for_timeout(600);await pg.mouse.click(200,500);await pg.wait_for_timeout(300)
        # 5) 새로고침 후 유지
        await pg.evaluate('__t.persist()');await pg.reload();await pg.wait_for_timeout(700)
        s2=await pg.evaluate('__t.save()')
        chk('새로고침 후 유지',s2['fightRecords']['mackerel']==rec2 and s2['gold']>=123456 and s2['dex']['goby']==2,str(s2['fightRecords']))
        # 6) 점수 계산 경계값
        cases=await pg.evaluate("""()=>{const fg=__t.fg,out=[];const C=(tot,safe,target,cl,win,miss)=>{fg.q414={tot,safe,target,caut:0,dang:0,crit:0,sc:{n:'보통'}};fg.clutchUsed=cl;fg.cWin=win;fg.cMiss=miss;const s=__w.score414();return[s.ten,s.eff,s.cri,s.total,s.g]};
          out.push(C(10,10,10,false,false,0));out.push(C(10,10,20,true,true,0));out.push(C(10,10,10,true,true,1));out.push(C(20,10,10,true,false,2));
          for(const sf of[8,7.9,6,5.9,3,2.9,0])out.push(C(10,sf,10,false,0,0));out.push(C(10,0,9.7,false,0,0));return out}""")
        print(' cases',cases)
        exp=[[50,30,20,100,'S'],[50,30,16,96,'S'],[50,30,8,88,'A'],[25,15,0,40,'D'],[40,30,20,90,'S'],[39,30,20,89,'A'],[30,30,20,80,'A'],[29,30,20,79,'B'],[15,30,20,65,'B'],[14,30,20,64,'C'],[0,30,20,50,'C'],[0,29,20,49,'D']]
        chk('점수 계산식·경계',cases==exp)
        chk('pageerror 0',not errs,str(errs[:3]))
        await b.close()
    print('PASS',len(ok),'FAIL',len(bad),bad)
asyncio.run(main())
