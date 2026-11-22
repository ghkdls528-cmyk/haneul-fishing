"""4.17 사운드 확장: 긴장 레이어 · 환경음 6종 · 천둥 · 물고기 그룹 · 이벤트 · 캐릭터/펫 반응음
사용법: python tools/audio_ext.py   → assets/audio/ext/*.mp3 (+ WAV 원본은 assets/incoming/audio_wav, git 제외)
make_audio.py의 악기·합성 함수를 그대로 씀."""
import os,sys,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from make_audio import *
def loopify(y,L):
    """L초 반복용: 꼬리를 머리에 크로스페이드"""
    n=int(L*SR);f=int(min(1.0,L/4)*SR);y=np.pad(y,(0,max(0,n+f-len(y))))
    r=np.linspace(0,1,f);h=y[:n].copy();h[:f]=y[:f]*r+y[n:n+f]*(1-r);return h
def lpn(sec,fc):return lp(noise(sec),fc)
def put(y,at,p):
    j=int(at*SR);k=min(len(p),len(y)-j)
    if k>0:y[j:j+k]+=p[:k]
def L_TENSION():  # 낚시 중 긴장: 조성 없는 낮은 심장박동 + 저음 너울(어느 BGM 조와도 안 부딪힘)
    L=8;y=np.zeros(int((L+1)*SR));beat=60/84
    for i in range(int(L/beat)+1):put(y,i*beat,kick(.9)[:int(.3*SR)]);put(y,i*beat+.22,kick(.5)[:int(.25*SR)])
    t=T(L+1);y+=.35*lpn(L+1,180)*(.6+.4*np.sin(2*np.pi*t/4))
    return norm(loopify(y,L),-6)
def L_DANGER():  # 장력 위험: 빠른 박동 + 떨리는 높은 바람결
    L=6;y=np.zeros(int((L+1)*SR));beat=60/132
    for i in range(int(L/beat)+1):put(y,i*beat,kick(1)[:int(.22*SR)])
    t=T(L+1);y+=.22*bp(noise(L+1),2500,6000)*(.5+.5*np.sin(2*np.pi*9*t))*(.6+.4*np.sin(2*np.pi*t/3))
    return norm(loopify(y,L),-5)
def A_WAVES():
    L=12;t=T(L+1);y=np.zeros_like(t)
    for c,(per,ph) in enumerate([(5.5,0),(4.3,1.7),(7.1,3.1)]):y+=lp(noise(L+1),500+250*c)*np.clip(np.sin(2*np.pi*t/per+ph),0,1)**3*(1-.25*c)
    y+=.15*lpn(L+1,250);return norm(loopify(y,L),-4)
def gull(f0):
    d=.42;tt=T(d);f=f0*(1+.35*np.sin(np.pi*tt/d))*(1-.25*tt/d);ph=2*np.pi*np.cumsum(f)/SR
    v=(np.sin(ph)+.5*np.sin(2*ph)+.3*np.sin(3*ph))*np.sin(np.pi*tt/d)**.6*(1+.3*np.sin(2*np.pi*28*tt));return bp(v,700,5000)
def A_GULLS():
    L=14;y=.12*lpn(L+1,600)
    for at,f0,g in [(1.0,1350,.8),(1.55,1250,.6),(6.2,1500,.7),(6.7,1420,.5),(7.15,1380,.4),(11.3,1300,.6)]:put(y,at,g*gull(f0))
    return norm(loopify(y,L),-6)
def wind_raw(sec,base=900,span=600):
    t=T(sec);n=noise(sec);out=np.zeros_like(n);f=base+span*np.sin(2*np.pi*t/6.3)+span*.5*np.sin(2*np.pi*t/2.7)
    for k in range(0,len(n),2048):out[k:k+2048]=bp(n[k:k+2048],max(150,f[k]*.5),f[k]*1.4)
    return out
def A_WIND():
    L=10;t=T(L+1);return norm(loopify(wind_raw(L+1)*(.55+.45*np.sin(2*np.pi*t/5+1)),L),-6)
def A_RAIN():
    L=8;y=.6*hp(lp(noise(L+1),9000),900);r2=np.random.default_rng(4)
    for _ in range(420):put(y,r2.uniform(0,L),bp(noise(.03),2500,8000)*np.exp(-T(.03)*160)*r2.uniform(.2,.7))
    return norm(loopify(y,L),-6)
def A_STORM():
    L=10;t=T(L+1);y=.7*hp(noise(L+1),600)+.5*wind_raw(L+1,1200,800)+.7*lp(noise(L+1),120)*(.5+.5*np.sin(2*np.pi*t/7))
    y+=.4*lp(noise(L+1),700)*np.clip(np.sin(2*np.pi*t/3.3),0,1)**4;return norm(loopify(y,L),-4)
def A_NIGHT():
    L=12;t=T(L+1);y=np.zeros_like(t)
    for per,ph in [(7.5,0),(5.9,2.2)]:y+=lp(noise(L+1),380)*np.clip(np.sin(2*np.pi*t/per+ph),0,1)**3
    r2=np.random.default_rng(8)
    for _ in range(9):put(y,r2.uniform(0,L),bell(nm(['A6','E7','C7'][r2.integers(0,3)]),.05)[:int(1.0*SR)]*.06)
    return norm(loopify(y,L),-6)
def S_THUNDER():
    t=T(2.6);y=lp(noise(2.6),300)*np.exp(-t*1.4)*np.minimum(1,t/.02)+.6*lp(noise(2.6),90)*np.exp(-t*.9)
    y[:int(.08*SR)]+=hp(noise(.08),1500)*np.exp(-T(.08)*40)*.8;return norm(y,-1)
def F_SMALL():return norm(mixl((0,np.sin(2*np.pi*np.cumsum(sweep(1500,700,.08))/SR)*np.exp(-T(.08)*35)),(0,.4*hp(noise(.12),2500)*np.exp(-T(.12)*30))),-3)
def F_BIG():
    spl=lp(noise(.9),1600)*np.exp(-T(.9)*4.5)*np.minimum(1,T(.9)/.01)
    return norm(mixl((0,.9*spl),(0,.8*tonef(sweep(120,50,.5),.6,dec=4)),(.05,.4*bp(noise(.5),600,2500)*np.exp(-T(.5)*7))),-1)
def F_RARE():return norm(small_rev(mixl(*[(i*.05,bell(nm(n),.05,glock=True)[:int(.5*SR)]*.6) for i,n in enumerate(['E6','B6','E7'])]),.6,.3)[:int(.7*SR)],-3)
def F_BOSS():
    t=T(1.6);f=70+25*np.sin(2*np.pi*3.5*t)*np.exp(-t);ph=2*np.pi*np.cumsum(f)/SR;gr=(2*(ph/(2*np.pi)%1)-1)
    y=lp(gr,500)*np.minimum(1,t/.15)*np.exp(-t*1.4)*(1+.35*np.sin(2*np.pi*30*t))+.6*lp(noise(1.6),900)*np.exp(-t*2.5)
    return norm(small_rev(y,1.2,.3)[:int(2.0*SR)],-1)
def E_GOLDEN():
    ns=['D6','F#6','A6','D7','F#7'];return norm(small_rev(mixl(*[(i*.06,bell(nm(n),.05,glock=True)[:int(.8*SR)]*.6) for i,n in enumerate(ns)],(.3,S04()[:int(.5*SR)]*.5)),.9,.3)[:int(1.3*SR)],-2)
def E_SCHOOL():
    r2=np.random.default_rng(5);parts=[]
    for i in range(14):f0=r2.uniform(700,1600);d=np.sin(2*np.pi*np.cumsum(sweep(f0,f0*1.8,.06))/SR)*np.exp(-T(.06)*35);parts.append((i*.05+r2.uniform(0,.03),d*r2.uniform(.4,.8)))
    parts.append((0,.3*lp(noise(.9),2000)*np.exp(-T(.9)*3)));return norm(mixl(*parts),-3)
def E_BIGFISH():
    def horn(d):t=T(d);return lp(np.sign(np.sin(2*np.pi*98*t))*.6+np.sin(2*np.pi*147*t),900)*np.minimum(1,t/.05)*np.minimum(1,(d-t)/.1)
    return norm(mixl((0,horn(.45)),(.6,horn(.7)),(.6,.4*lp(noise(.8),1500)*np.exp(-T(.8)*4))),-3)
def E_FEVER():
    ns=['C5','E5','G5','C6','E6','G6','C7'];parts=[(i*.07,marimba(nm(n),.1)[:int(.4*SR)]*.7) for i,n in enumerate(ns)]
    parts+=[(i*.14,.5*hp(noise(.06),1500)*np.exp(-T(.06)*50)) for i in range(4)];parts.append((.45,.6*bell(nm('C7'),.05,glock=True)[:int(.7*SR)]))
    return norm(small_rev(mixl(*parts),.7,.25)[:int(1.3*SR)],-2)
def E_BOSS():
    n=int(2.2*SR);t=T(2.2);br=np.zeros(n)
    for m in [nm('D2'),nm('A2'),nm('D3'),nm('F3')]:br+=lp(saw_stack(mf(m),n,cut=1200),1100)
    br*=np.minimum(1,t/.3)*np.exp(-t*1.1)
    return norm(small_rev(mixl((0,tom(1,70)),(.25,tom(.8,62)),(.5,.7*br)),1.2,.3)[:int(2.4*SR)],-1)
def voice(contour,vowels,dur):
    """짧고 귀여운 '목소리 같은' 소리: 성대 펄스 + 모음 공명 (실제 단어 아님)"""
    t=T(dur);f=np.interp(t,np.linspace(0,dur,len(contour)),contour)*(1+.012*np.sin(2*np.pi*6*t));ph=np.cumsum(f)/SR;src=2*(ph%1)-1
    FM={'a':(820,1250,2600),'o':(520,900,2400),'e':(500,1900,2600),'u':(350,800,2300),'i':(320,2300,3000)}
    y=np.zeros_like(t);seg=len(t)//len(vowels)
    for k,v in enumerate(vowels):
        a=k*seg;b=len(t) if k==len(vowels)-1 else (k+1)*seg
        for fi,g in zip(FM[v],(1,.7,.35)):y[a:b]+=g*bp(src[a:b],fi*.85,fi*1.15)
    y=lp(y,4000)  # 구간 경계 부드럽게
    return y*np.minimum(1,t/.02)*np.minimum(1,(dur-t)/.08)
def R_WOW():return norm(small_rev(voice([420,560,640,520],['u','a','a'],.55),.4,.2)[:int(.7*SR)],-3)
def R_NEW():return norm(mixl((0,voice([480,620,580],['o','o'],.32)),(.12,.35*bell(nm('A6'),.05,glock=True)[:int(.5*SR)])),-3)
def R_PAT():
    t=T(.6);pur=lp(noise(.6),300)*(.5+.5*np.sin(2*np.pi*24*t))*np.sin(np.pi*t/.6)
    return norm(mixl((0,.7*pur),(.1,.35*bell(nm('E6'),.05)[:int(.5*SR)])),-5)
def R_LOVE():return norm(small_rev(mixl(*[(i*.08,bell(nm(n),.05,glock=True)[:int(.5*SR)]*.6) for i,n in enumerate(['C6','E6','G6','C7'])],(0,.4*voice([560,700],['i','i'],.18))),.5,.25)[:int(.8*SR)],-3)
EXTS=[('layer_tension',L_TENSION),('layer_danger',L_DANGER),('amb_waves',A_WAVES),('amb_gulls',A_GULLS),('amb_wind',A_WIND),('amb_rain',A_RAIN),('amb_storm',A_STORM),('amb_night_waves',A_NIGHT),
      ('sfx_thunder',S_THUNDER),('fish_small_splash',F_SMALL),('fish_big_splash',F_BIG),('fish_rare_hook',F_RARE),('boss_roar',F_BOSS),
      ('evt_golden',E_GOLDEN),('evt_school',E_SCHOOL),('evt_bigfish',E_BIGFISH),('evt_fever',E_FEVER),('evt_boss',E_BOSS),
      ('react_wow',R_WOW),('react_new',R_NEW),('pet_pat',R_PAT),('pet_love',R_LOVE)]
LOOPS2={'layer_tension','layer_danger','amb_waves','amb_gulls','amb_wind','amb_rain','amb_storm','amb_night_waves'}
if __name__=='__main__':
    os.makedirs(os.path.join(OUT,'ext'),exist_ok=True);os.makedirs(WAV,exist_ok=True);mp=os.path.join(OUT,'audio_meta.json');meta=json.load(open(mp,encoding='utf-8'))
    for name,fn in EXTS:
        y=fn();lp_=name in LOOPS2
        if not lp_:y=tight(y);fi=int(.0015*SR);y=y.copy();y[:fi]*=np.linspace(0,1,fi)
        write_wav(os.path.join(WAV,name+'.wav'),y);sz=write_mp3(os.path.join(OUT,'ext',name+'.mp3'),y,64 if lp_ else 80)
        meta[name]={'samples':len(y),'sr':SR,'sec':round(len(y)/SR,3),'loop':lp_,'mp3':sz};print(name,f'{len(y)/SR:.2f}s',sz//1024,'KB',flush=True)
    json.dump(meta,open(mp,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
