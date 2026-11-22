"""하늘이의 여수 낚시 — 오리지널 BGM 5곡 · 효과음 20종 제작 (외부 음원 없이 신디사이저로 직접 합성)
사용법: python tools/make_audio.py            → assets/audio/bgm|sfx/*.mp3 (배포용) + assets/incoming/audio_wav/*.wav (16bit 원본, git 제외)
        python tools/make_audio.py bgm 1      → BGM 1곡만
악기: 피아노·마림바·플럭·기타·벨/글로켄·패드·스트링·베이스(가산 합성), 킥·셰이커·우드블록·림(합성 타악기), 스테레오 리버브(합성 IR 컨볼루션)
루프: 곡 길이(마디 단위 정확한 샘플 수) + 꼬리를 합성한 뒤 꼬리를 곡 앞에 더해서 반복 이음새가 끊기지 않게 함."""
import os,sys,json,math
import numpy as np
# scipy.signal은 이 PC의 앱 제어 정책에 막혀서, 필터·컨볼루션을 numpy FFT로 직접 구현(오프라인 렌더링이라 위상 0 필터로 충분)
def _nfft(n):return 1<<(int(n)-1).bit_length()
def fftconvolve(a,b):
    n=len(a)+len(b)-1;N=_nfft(n);return np.fft.irfft(np.fft.rfft(a,N)*np.fft.rfft(b,N),N)[:n]
def _ffilt(x,H):
    x=np.asarray(x,float)
    if x.ndim>1:return np.stack([_ffilt(x[i],H) for i in range(x.shape[0])])
    N=_nfft(len(x)+1024);X=np.fft.rfft(x,N);f=np.fft.rfftfreq(N,1/SR);return np.fft.irfft(X*H(f),N)[:len(x)]
import lameenc
SR=44100;B=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(B,'assets','audio');WAV=os.path.join(B,'assets','incoming','audio_wav')
rng=np.random.default_rng(7)
mf=lambda m:440.0*2**((m-69)/12)
NOTE={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def nm(s):  # 'C#5' → midi
    b=NOTE[s[0]];i=1
    while i<len(s) and s[i] in '#b':b+=1 if s[i]=='#' else -1;i+=1
    return b+12*(int(s[i:])+1)
def env_adsr(n,a,d,s,r,sus_len):
    a=max(1,int(a*SR));d=max(1,int(d*SR));r=max(1,int(r*SR));sl=max(0,int(sus_len*SR)-a-d)
    e=np.concatenate([np.linspace(0,1,a,endpoint=False),np.linspace(1,s,d,endpoint=False),np.full(sl,s),np.linspace(s,0,r)])
    return e[:n] if len(e)>=n else np.pad(e,(0,n-len(e)))
def lp(x,fc,order=2):return _ffilt(x,lambda f:1/np.sqrt(1+(f/max(1,fc))**(2*order)))
def hp(x,fc,order=2):return _ffilt(x,lambda f:1/np.sqrt(1+(max(1,fc)/np.maximum(f,1e-3))**(2*order)))
def bp(x,f1,f2):return _ffilt(x,lambda f:1/np.sqrt(1+(f/max(1,f2))**4)/np.sqrt(1+(max(1,f1)/np.maximum(f,1e-3))**4))
_cache={}
def additive(freq,dur,partials,decays,amps,inharm=0.0,attack=.004,tail=1.0):
    n=int((dur+tail)*SR);t=np.arange(n)/SR;y=np.zeros(n)
    for k,(p,dk,a) in enumerate(zip(partials,decays,amps)):
        f=freq*p*(1+inharm*p*p)
        if f>SR*.45:continue
        y+=a*np.sin(2*np.pi*f*t+rng.uniform(0,6.28))*np.exp(-t*dk)
    att=np.minimum(1,t/attack);rel=np.ones(n);ri=int(dur*SR)
    if ri<n:rel[ri:]=np.exp(-(t[ri:]-dur)*8)
    return y*att*rel
# ---------- 악기 ----------
def piano(m,dur,v=1.):
    k=('pi',m,round(dur,3))
    if k not in _cache:
        f=mf(m);P=list(range(1,10));A=[1/(p**1.15) for p in P];bright=1.0 if m>60 else .8
        D=[(1.1+.35*p)*(1+(m-60)/48) for p in P]
        y=additive(f,dur,P,D,A,inharm=.00025,attack=.003,tail=1.4)
        hn=int(.02*SR);ham=rng.normal(0,1,hn)*np.exp(-np.arange(hn)/SR*220)*.08;y[:hn]+=hp(ham,1500)
        _cache[k]=y/np.max(np.abs(y))
    return _cache[k]*v
def marimba(m,dur,v=1.):
    k=('ma',m)
    if k not in _cache:
        f=mf(m);y=additive(f,.05,[1,3.93,9.2],[5.5,14,30],[1,.32,.08],attack=.002,tail=1.0)
        cn=int(.008*SR);y[:cn]+=rng.normal(0,1,cn)*np.exp(-np.arange(cn)/SR*600)*.15
        _cache[k]=y/np.max(np.abs(y))
    return _cache[k]*v
def pluck(m,dur,v=1.,bright=1.):
    k=('pl',m,round(dur,2),bright)
    if k not in _cache:
        f=mf(m);P=list(range(1,12));A=[(1/p)*(.75**(p-1))**(1/bright) for p in P];D=[3+2.2*p for p in P]
        y=additive(f,dur,P,D,A,attack=.002,tail=.6);_cache[k]=y/np.max(np.abs(y))
    return _cache[k]*v
def guitar(m,dur,v=1.):
    k=('gt',m,round(dur,2))
    if k not in _cache:
        f=mf(m);P=list(range(1,14));A=[(1/p**.9)*abs(math.sin(p*math.pi*.18))+.02 for p in P];D=[1.6+1.1*p for p in P]
        y=additive(f,dur,P,D,A,attack=.003,tail=1.2);y=lp(y,4200);_cache[k]=y/np.max(np.abs(y))
    return _cache[k]*v
def bell(m,dur,v=1.,glock=False):
    k=('be',m,glock)
    if k not in _cache:
        f=mf(m);P=[1,2.76,5.4,8.93] if not glock else [1,2.0,3.0,4.16,5.43];A=[1,.5,.28,.12] if not glock else [1,.12,.25,.08,.06]
        D=[1.2,2.4,4,7] if not glock else [1.8,6,5,9,12];y=additive(f,.05,P,D,A,attack=.0015,tail=2.4 if not glock else 1.6)
        _cache[k]=y/np.max(np.abs(y))
    return _cache[k]*v
def saw_stack(f,n,det=(0,-7,7),maxh=40,cut=3000):
    t=np.arange(n)/SR;y=np.zeros(n)
    for c in det:
        ff=f*2**(c/1200);H=int(min(maxh,cut/ff))
        for h in range(1,max(2,H)):y+=np.sin(2*np.pi*ff*h*t+rng.uniform(0,6.28))/h
    return y
def pad(ms,dur,v=1.,a=.8,r=1.2,cut=1800):
    n=int((dur+r)*SR);y=np.zeros(n)
    for m in ms:y+=saw_stack(mf(m),n,cut=cut)
    y=lp(y,cut);y*=env_adsr(n,a,.5,.8,r,dur);return y/ (np.max(np.abs(y))+1e-9)*v
def strings(ms,dur,v=1.):
    n=int((dur+1.0)*SR);t=np.arange(n)/SR;y=np.zeros(n)
    for m in ms:
        f=mf(m);vib=1+.004*np.sin(2*np.pi*5.2*t)*np.minimum(1,t/1.0);ph=2*np.pi*np.cumsum(f*vib)/SR
        for h in range(1,int(min(18,3500/f))):y+=np.sin(h*ph+rng.uniform(0,6.28))/h
    y=lp(y,2600);y*=env_adsr(n,1.0,.4,.85,1.0,dur);return y/(np.max(np.abs(y))+1e-9)*v
def bass(m,dur,v=1.):
    k=('bs',m,round(dur,2))
    if k not in _cache:
        f=mf(m);y=additive(f,dur,[1,2,3,4],[1.2,2.5,4,6],[1,.45,.2,.08],attack=.006,tail=.25);_cache[k]=lp(y,900)/np.max(np.abs(y))
    return _cache[k]*v
def kick(v=1.):
    n=int(.35*SR);t=np.arange(n)/SR;f=45+75*np.exp(-t*28);y=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9);return y*v
def shaker(v=1.):
    n=int(.09*SR);t=np.arange(n)/SR;y=bp(rng.normal(0,1,n),5000,11000)*np.minimum(1,t/.012)*np.exp(-t*45);return y/np.max(np.abs(y))*v
def wood(v=1.,f=1100):
    n=int(.12*SR);t=np.arange(n)/SR;y=(np.sin(2*np.pi*f*t)+.5*np.sin(2*np.pi*f*2.7*t))*np.exp(-t*55);return y/np.max(np.abs(y))*v
def rim(v=1.):
    n=int(.1*SR);t=np.arange(n)/SR;y=bp(rng.normal(0,1,n),1500,5000)*np.exp(-t*70)+.4*np.sin(2*np.pi*520*t)*np.exp(-t*60);return y/np.max(np.abs(y))*v
def tom(v=1.,f=110):
    n=int(.5*SR);t=np.arange(n)/SR;ff=f*(1+.5*np.exp(-t*20));y=np.sin(2*np.pi*np.cumsum(ff)/SR)*np.exp(-t*7)+.15*bp(rng.normal(0,1,n),200,2000)*np.exp(-t*30);return y/np.max(np.abs(y))*v
# ---------- 믹서 ----------
class Mix:
    def __init__(s,sec,bpm):s.n=int(round(sec*SR));s.bpm=bpm;s.L=np.zeros(s.n+SR*6);s.R=np.zeros(s.n+SR*6);s.wet={};s.beat=60/bpm
    def add(s,y,t,pan=0.,send=.25,gain=1.):
        i=int(round(t*SR));j=min(len(s.L),i+len(y))
        if i>=len(s.L):return
        y=y[:j-i]*gain;l=math.cos((pan+1)*math.pi/4);r=math.sin((pan+1)*math.pi/4)
        s.L[i:j]+=y*l*1.414*(1-send*.3);s.R[i:j]+=y*r*1.414*(1-send*.3)
        if send>0:
            w=s.wet.setdefault('w',[np.zeros(len(s.L)),np.zeros(len(s.L))]);w[0][i:j]+=y*l*send;w[1][i:j]+=y*r*send
    def b(s,beats):return beats*s.beat
    def render(s,rev=2.4,damp=4000):
        if 'w' in s.wet:
            n=int(rev*SR);t=np.arange(n)/SR;irL=rng.normal(0,1,n)*np.exp(-t*6.9/rev);irR=rng.normal(0,1,n)*np.exp(-t*6.9/rev)
            irL=lp(irL,damp);irR=lp(irR,damp);pd=int(.018*SR);irL=np.concatenate([np.zeros(pd),irL]);irR=np.concatenate([np.zeros(int(.025*SR)),irR])
            irL/=np.sqrt(np.sum(irL**2));irR/=np.sqrt(np.sum(irR**2))
            wl=fftconvolve(s.wet['w'][0],irL)[:len(s.L)];wr=fftconvolve(s.wet['w'][1],irR)[:len(s.L)]
            s.L+=wl*.9;s.R+=wr*.9
        # 루프: 꼬리(곡 길이 이후)를 앞에 더함
        L=s.L[:s.n].copy();R=s.R[:s.n].copy();tl=s.L[s.n:];tr=s.R[s.n:];k=min(len(tl),s.n);L[:k]+=tl[:k];R[:k]+=tr[:k]
        y=np.stack([L,R],1)
        # 반복용 곡이라 저음 필터를 '원형'으로(끝과 처음이 이어진 것으로 보고) 걸어 이음새 튐을 없앰
        f=np.fft.rfftfreq(len(L),1/SR);Hh=1/np.sqrt(1+(35/np.maximum(f,1e-3))**4);y=np.stack([np.fft.irfft(np.fft.rfft(y[:,c])*Hh,len(L)) for c in range(2)],1)
        pk=np.max(np.abs(y));y=y/pk*10**(-3/20)  # 피크 -3dBFS
        return y
def mel(seq,octs=0):  # "E5 1 D5 .5 r .5 ..." → [(midi|None,beats)]
    a=seq.split();out=[]
    for i in range(0,len(a),2):out.append((None if a[i]=='r' else nm(a[i])+12*octs,float(a[i+1])))
    return out
def play_mel(M,start_beat,seq,inst,pan=0,send=.3,gain=1.,leg=.95,octs=0,**kw):
    b=start_beat
    for m,l in seq:
        if m is not None:M.add(inst(m+12*octs,M.b(l)*leg,**kw),M.b(b),pan,send,gain)
        b+=l
    return b
CH={  # 코드: 근음 미디 + 구성음
 'maj':[0,4,7],'min':[0,3,7],'maj7':[0,4,7,11],'min7':[0,3,7,10],'add9':[0,4,7,14],'sus2':[0,2,7],'sus4':[0,5,7],'7':[0,4,7,10],'m9':[0,3,7,10,14],'6':[0,4,7,9]}
def chord(sym,base=48):
    # 'F', 'Dm', 'Bbmaj7', 'C/E' ...
    sl=None
    if '/' in sym:sym,sl=sym.split('/')
    i=1
    while i<len(sym) and sym[i] in '#b':i+=1
    root=NOTE[sym[0]]+sum(1 if c=='#' else -1 for c in sym[1:i]);q=sym[i:]
    kind={'':'maj','m':'min','maj7':'maj7','m7':'min7','add9':'add9','sus2':'sus2','sus4':'sus4','7':'7','m9':'m9','6':'6'}[q]
    r=base+((root-base)%12);notes=[r+x for x in CH[kind]]
    bassn=r-12 if not sl else base-12+((NOTE[sl[0]]+(1 if '#' in sl else -1 if 'b' in sl[1:] else 0)-base)%12)
    return notes,bassn
# ================= BGM =================
def bgm1():  # 여수의 작은 낚시터 — F장조 100BPM, 32마디 (A A' B A'' 각 8마디)
    bpm=100;bars=32;M=Mix(bars*4*60/bpm,bpm)
    A=['F','C/E','Dm','Bb','F','C','Bb','C'];Bs=['Bb','C','Am','Dm','Gm','C','F','C']
    prog=A+A+Bs+A
    mA=mel("A5 1 C6 .5 A5 .5 G5 1 F5 1  E5 1.5 F5 .5 G5 2  F5 1 D5 .5 E5 .5 F5 1 A5 1  G5 3 r 1 "
           "A5 1 C6 .5 D6 .5 C6 1 A5 1  G5 1.5 A5 .5 G5 1 E5 1  F5 1 G5 .5 F5 .5 D5 1 E5 1  F5 3 r 1")
    mA2=mel("A5 1 C6 .5 A5 .5 G5 1 F5 1  E5 1.5 F5 .5 G5 2  F5 1 D5 .5 E5 .5 F5 1 A5 1  G5 2 A5 .5 Bb5 .5 C6 1 "
            "D6 1 C6 .5 Bb5 .5 A5 1 F5 1  G5 1.5 A5 .5 G5 1 E5 1  F5 1 G5 .5 A5 .5 G5 1 E5 1  F5 4")
    mB=mel("D6 1.5 C6 .5 Bb5 1 D6 1  C6 1.5 Bb5 .5 A5 2  C6 1 A5 1 G5 1 E5 1  F5 1 A5 1 D5 2 "
           "D5 1 E5 .5 F5 .5 G5 1 Bb5 1  A5 1.5 G5 .5 E5 2  F5 1 A5 1 C6 1 F6 1  E6 2 D6 .5 E6 .5 C6 1")
    b=0;b=play_mel(M,b,mA,marimba,pan=.15,send=.25,gain=.55);b=play_mel(M,b,mA2,piano,pan=.1,send=.3,gain=.5)
    b=play_mel(M,b,mB,piano,pan=.1,send=.32,gain=.5);play_mel(M,b-0,mB[:0]+mA2,marimba,pan=.15,send=.25,gain=.55)
    play_mel(M,64,mel("r 8 F6 .5 A6 .5 C7 1 r 6 E6 .5 G6 .5 C7 1 r 6"),bell,pan=-.4,send=.5,gain=.12,glock=True)
    for bar,c in enumerate(prog):
        ns,bn=chord(c,53);t0=bar*4
        for k,beat in enumerate([0,1,2,3]):  # 부드러운 피아노 펼침화음
            M.add(piano(ns[k%len(ns)]-12+ (12 if k==3 else 0),M.b(.9),.6),M.b(t0+beat+.5),-.25,.3,.22)
        M.add(bass(bn,M.b(1.8)),M.b(t0),0,.1,.42);M.add(bass(bn+ (7 if bar%2 else 12),M.b(1.5)),M.b(t0+2),0,.1,.3)
        for e in range(8):  # 플럭 아르페지오(가볍게)
            if bar>=8 and e%2==1:M.add(pluck(ns[(e//2)%len(ns)]+12,M.b(.4),bright=.8),M.b(t0+e*.5),.45,.35,.09)
        M.add(kick(),M.b(t0),0,0,.38);M.add(kick(),M.b(t0+2.5),0,0,.22)
        for e in range(8):M.add(shaker(),M.b(t0+e*.5+.02),.3,.05,.06 if e%2 else .035)
        M.add(rim(),M.b(t0+3),-.2,.15,.07)
        if bar%4==3:M.add(bell(ns[2]+24,.3,glock=True),M.b(t0+3.5),-.5,.5,.08)
    return M.render(rev=2.0),bpm,bars
def bgm2():  # 노을빛 여수 바다 — D장조 84BPM, 24마디
    bpm=84;bars=24;M=Mix(bars*4*60/bpm,bpm)
    prog=['D','Bm','G','A','D/F#','G','Em','A', 'G','A','F#m','Bm','Em','A','D','D', 'Bm','G','D','A','G','A','D','A']
    m1=mel("F#5 2 E5 1 D5 1  F#5 1.5 G5 .5 A5 2  G5 2 F#5 1 E5 1  E5 3 r 1 "
           "D5 1 E5 .5 F#5 .5 A5 2  B5 1.5 A5 .5 G5 2  G5 1 F#5 1 E5 1 D5 1  E5 4")
    m2=mel("B5 2 A5 1 G5 1  A5 1.5 F#5 .5 E5 2  F#5 1 A5 1 C#6 1 D6 1  B5 3 r 1 "
           "G5 1 A5 .5 B5 .5 D6 1 B5 1  C#6 1.5 B5 .5 A5 2  A5 1 F#5 1 E5 1 F#5 1  D5 4")
    m3=mel("D6 1.5 C#6 .5 B5 2  B5 1 A5 1 G5 2  F#5 1 G5 .5 A5 .5 B5 1 A5 1  A5 3 r 1 "
           "G5 1.5 A5 .5 B5 1 D6 1  C#6 1.5 B5 .5 A5 2  F#5 1 E5 1 D5 1 E5 1  D5 4")
    b=play_mel(M,0,m1,piano,pan=.1,send=.35,gain=.5);b=play_mel(M,b,m2,piano,pan=.1,send=.35,gain=.5);play_mel(M,b,m3,piano,pan=.1,send=.35,gain=.5)
    for bar,c in enumerate(prog):
        ns,bn=chord(c,50);t0=bar*4
        pat=[0,2,1,2,0,2,1,2]  # 핑거피킹
        for e,i in enumerate(pat):M.add(guitar(ns[i%len(ns)]+(12 if e%4==3 else 0),M.b(.9)),M.b(t0+e*.5),-.35,.25,.16)
        M.add(guitar(bn,M.b(2)),M.b(t0),-.2,.2,.2);M.add(bass(bn,M.b(3.5)),M.b(t0),0,.1,.3)
        M.add(pad([n+12 for n in ns],M.b(4)),M.b(t0),0,.5,.07)
        if 8<=bar<16 or bar>=20:M.add(strings([ns[0]+12,ns[1]+12],M.b(4)),M.b(t0),.25,.5,.09)
        if bar%2==1:M.add(bell(ns[1]+24,.2,glock=True),M.b(t0+3.5),.5,.55,.07)
        M.add(shaker(),M.b(t0+1),.3,.1,.025);M.add(shaker(),M.b(t0+3),.3,.1,.025)
    return M.render(rev=2.8),bpm,bars
def bgm3():  # 달빛 아래 낚시 — A 단조(도리안) 72BPM, 20마디
    bpm=72;bars=20;M=Mix(bars*4*60/bpm,bpm)
    prog=['Am','Fmaj7','Cmaj7','G6','Am','Fmaj7','Dm','Esus4', 'Fmaj7','G6','Am','Am', 'Dm','Am','Fmaj7','Esus4', 'Am','Fmaj7','G6','Am']
    for bar,c in enumerate(prog):
        ns,bn=chord(c,52);t0=bar*4
        M.add(pad(ns,M.b(4),a=1.4,r=2,cut=1300),M.b(t0),0,.6,.16)
        M.add(piano(bn,M.b(3.5),.8),M.b(t0),-.1,.4,.22)
        if bar%2==0:M.add(piano(bn+7,M.b(1.8),.6),M.b(t0+2),-.1,.4,.14)
        for e,i in enumerate([0,1,2,1,3,2,1,2]):  # 은은한 플럭
            if bar>=4:M.add(pluck(ns[i%len(ns)]+12,M.b(.6),bright=.6),M.b(t0+e*.5),.35*(1 if e%2 else -1),.55,.06)
    pent=[nm(x) for x in ['A5','C6','D6','E6','G6','A6']]
    r2=np.random.default_rng(3);b=8
    while b<bars*4-2:  # 물방울 벨: 정해진 씨앗으로 고정된 '별빛' 선율
        M.add(bell(int(pent[r2.integers(0,6)]),.1),M.b(b),float(r2.uniform(-.6,.6)),.7,.09);b+=float(r2.choice([1.5,2,2.5,3]))
    mel1=mel("E5 2 D5 1 C5 1  B4 2 C5 1 D5 1  E5 3 G5 1  A5 4  G5 2 E5 1 D5 1  C5 2 D5 2  E5 4  E5 4 "
             "C5 2 D5 1 E5 1  G5 2 A5 2  E5 2 D5 1 C5 1  A4 4")
    play_mel(M,16,mel1,piano,pan=.15,send=.5,gain=.36)
    return M.render(rev=3.4,damp=3200),bpm,bars
def bgm4():  # 깊은 바다의 모험 — D 도리안 100BPM, 30마디
    bpm=100;bars=30;M=Mix(bars*4*60/bpm,bpm)
    prog=['Dm','Dm','C','C','Bb','Bb','C','A7']*3+['Dm','C','Bb','C','Dm','A7']
    ost=[0,0,7,0,10,0,7,5]
    for bar,c in enumerate(prog):
        ns,bn=chord(c,50);t0=bar*4
        for e,iv in enumerate(ost):M.add(bass(bn+(iv if c.startswith('Dm') else [0,0,7,0,12,0,7,4][e]),M.b(.45)),M.b(t0+e*.5),0,.05,.32 if e%2==0 else .22)
        M.add(pad(ns,M.b(4),a=.6,r=1.4,cut=1500),M.b(t0),0,.55,.11)
        M.add(tom(f=98),M.b(t0),-.1,.25,.2);M.add(tom(f=130),M.b(t0+2.5),.15,.25,.12)
        for e in range(4):M.add(shaker(),M.b(t0+e+.5),.25,.15,.04)
        if bar%4==3:M.add(tom(f=82),M.b(t0+3.5),0,.3,.16)
        if bar%2==1:M.add(bell(ns[2]+24,.2),M.b(t0+1.5),-.5,.6,.06)
    mA=mel("D5 1 F5 .5 A5 .5 G5 1 F5 1  E5 1.5 F5 .5 D5 2  C5 1 E5 .5 G5 .5 A5 1 G5 1  E5 4 "
           "D5 1 F5 .5 A5 .5 C6 1 Bb5 1  A5 1.5 G5 .5 F5 2  G5 1 A5 .5 Bb5 .5 A5 1 G5 1  A5 4")
    mB=mel("F5 1.5 G5 .5 A5 1 D6 1  C6 2 A5 2  Bb5 1 A5 .5 G5 .5 F5 1 G5 1  A5 4 "
           "D6 1.5 C6 .5 Bb5 1 A5 1  G5 1.5 F5 .5 E5 2  F5 1 G5 1 A5 1 C#6 1  D6 4")
    b=8;b=play_mel(M,b*4,mA,piano,pan=.15,send=.4,gain=.42,octs=-1);b=play_mel(M,b,mB,piano,pan=.15,send=.4,gain=.42,octs=-1)
    play_mel(M,b,mA,marimba,pan=.2,send=.35,gain=.32,octs=-1)
    return M.render(rev=2.6,damp=3500),bpm,bars
def bgm5():  # 보물 발견의 순간 — G장조 108BPM, 32마디
    bpm=108;bars=32;M=Mix(bars*4*60/bpm,bpm)
    A=['G','Em','C','D','G','Em','Am','D'];B_=['C','D','Bm','Em','C','D','G','D']
    prog=A+A+B_+A
    m1=mel("D6 .5 B5 .5 G5 .5 B5 .5 D6 1 G6 1  F#6 .5 E6 .5 D6 .5 E6 .5 B5 2  C6 .5 E6 .5 G6 .5 E6 .5 D6 1 B5 1  A5 3 r 1 "
           "D6 .5 B5 .5 G5 .5 B5 .5 D6 1 G6 1  A6 .5 G6 .5 F#6 .5 E6 .5 D6 2  E6 .5 C6 .5 A5 .5 C6 .5 B5 1 A5 1  G5 3 r 1")
    m2=mel("E6 1 G6 1 E6 .5 D6 .5 C6 1  D6 1 F#6 1 A6 2  F#6 1 D6 1 B5 .5 D6 .5 F#6 1  E6 3 r 1 "
           "C6 .5 D6 .5 E6 .5 G6 .5 E6 1 C6 1  D6 .5 E6 .5 F#6 .5 A6 .5 F#6 1 D6 1  G6 1 F#6 .5 E6 .5 D6 1 B5 1  A5 4")
    b=play_mel(M,0,m1,bell,pan=.2,send=.35,gain=.3,glock=True);b=play_mel(M,b,m1,marimba,pan=.15,send=.25,gain=.5)
    b=play_mel(M,b,m2,piano,pan=.1,send=.3,gain=.48);play_mel(M,b,m1,marimba,pan=.15,send=.25,gain=.5);play_mel(M,b,m1,bell,pan=-.3,send=.4,gain=.16,glock=True)
    for bar,c in enumerate(prog):
        ns,bn=chord(c,55);t0=bar*4
        for e in range(8):M.add(pluck(ns[[0,2,1,2][e%4]]+(12 if e>=4 else 0),M.b(.45),bright=1.1),M.b(t0+e*.5),-.4,.3,.1)
        M.add(piano(ns[0]-12,M.b(1.8),.6),M.b(t0),-.2,.3,.16);M.add(piano(ns[1]-12,M.b(1.8),.5),M.b(t0+2),-.2,.3,.13)
        M.add(bass(bn,M.b(1.6)),M.b(t0),0,.1,.36);M.add(bass(bn+7,M.b(.9)),M.b(t0+2),0,.1,.26);M.add(bass(bn+12,M.b(.9)),M.b(t0+3),0,.1,.22)
        M.add(kick(),M.b(t0),0,0,.34);M.add(kick(),M.b(t0+2),0,0,.25)
        for e in range(8):M.add(shaker(),M.b(t0+e*.5+.02),.35,.05,.05 if e%2 else .03)
        M.add(wood(f=1250),M.b(t0+1),.4,.2,.08);M.add(wood(f=900),M.b(t0+3),.4,.2,.08)
        if bar%2==1:M.add(bell(ns[0]+36,.1,glock=True),M.b(t0+3.5),.6,.55,.08)
    return M.render(rev=2.2),bpm,bars
# ================= 효과음 =================
def norm(y,db=-2):y=np.asarray(y,float);return y/(np.max(np.abs(y))+1e-9)*10**(db/20)
def tight(y,th=1e-3):
    a=np.abs(y);idx=np.nonzero(a>th*np.max(a))[0];return y[max(0,idx[0]-20):idx[-1]+200] if len(idx) else y
def T(sec):return np.arange(int(sec*SR))/SR
def tonef(f,sec,dec=8,wave='sin'):
    t=T(sec);f=np.asarray(f,float)
    if f.ndim:f=np.pad(f,(0,max(0,len(t)-len(f))),mode='edge')[:len(t)]
    ph=2*np.pi*np.cumsum(np.broadcast_to(f,t.shape))/SR
    y=np.sin(ph) if wave=='sin' else (2*(ph/(2*np.pi)%1)-1)
    return y*np.exp(-t*dec)*np.minimum(1,t/.004)
def mixl(*parts):
    n=max(int(off*SR)+len(p) for off,p in parts);y=np.zeros(n)
    for off,p in parts:i=int(off*SR);y[i:i+len(p)]+=p
    return y
def small_rev(y,rev=.6,wet=.25):
    n=int(rev*SR);t=np.arange(n)/SR;ir=lp(rng.normal(0,1,n)*np.exp(-t*6.9/rev),5000);ir/=np.sqrt(np.sum(ir**2))
    c=fftconvolve(y,ir);c=np.pad(c,(0,max(0,len(y)+n-len(c))))[:len(y)+n];return np.concatenate([y,np.zeros(n)])+c*wet
def noise(sec):return rng.normal(0,1,int(sec*SR))
def sweep(f0,f1,sec):t=T(sec);return f0*(f1/f0)**(t/sec)
def S01():  # 버튼: 나무 플럭 클릭
    return norm(mixl((0,wood(1,1450)[:int(.09*SR)]),(0,.4*pluck(nm('E6'),.05,bright=.7)[:int(.12*SR)])),-6)
def S02():  # 메뉴 열기: 가볍게 올라가는 반짝임
    y=mixl(*[(i*.055,bell(nm(n),.05,glock=True)[:int(.3*SR)]*.8) for i,n in enumerate(['C6','E6','G6','C7'])],(0,.25*bp(noise(.3),4000,10000)*np.exp(-T(.3)*12)))
    return norm(small_rev(y,.5,.2)[:int(.42*SR)],-5)
def S03():  # 메뉴 닫기: 부드럽게 내려감
    y=mixl(*[(i*.06,pluck(nm(n),.08,bright=.8)[:int(.2*SR)]) for i,n in enumerate(['G5','E5','C5'])]);return norm(y[:int(.3*SR)],-6)
def S04():  # 골드: 동전 부딪힘
    def coin(f):t=T(.45);return (np.sin(2*np.pi*f*t)+.6*np.sin(2*np.pi*f*2.41*t)+.3*np.sin(2*np.pi*f*3.9*t))*np.exp(-t*9)*np.minimum(1,t/.001)
    y=mixl((0,coin(2093)),(.07,.8*coin(2637)),(.14,.6*coin(3136)),(0,.3*hp(noise(.03),6000)));return norm(small_rev(y,.4,.2)[:int(.6*SR)],-3)
def S05():  # 캐스팅 충전(반복용): 부드럽게 맥동하는 상승 톤 — 게임이 재생 속도로 음높이를 올림
    t=T(1.0);f=330*(1+.5*t);y=np.sin(2*np.pi*np.cumsum(f)/SR)*(.6+.4*np.sin(2*np.pi*8*t))+.25*np.sin(2*np.pi*np.cumsum(f*2)/SR)
    fade=int(.02*SR);y[:fade]*=np.linspace(0,1,fade);y[-fade:]*=np.linspace(1,0,fade);return norm(lp(y,2500),-8)
def S06():  # 캐스팅 발사: 휙
    n=noise(.35);t=T(.35);f=sweep(600,3500,.35);out=np.zeros_like(n)
    for k in range(0,len(n),512):out[k:k+512]=bp(n[k:k+512],max(200,f[k]*.6),f[k]*1.2)
    y=mixl((0,out*np.abs(np.sin(np.pi*np.minimum(1,t/.33)))**1.5),(0,.2*tonef(sweep(300,900,.3),.3,dec=6)));return norm(y,-3)
def S07():  # 찌 떨어짐: 작은 물보라
    t=T(.45);plip=np.sin(2*np.pi*np.cumsum(sweep(1100,380,.12))/SR)*np.exp(-T(.12)*30)
    spl=lp(noise(.45),2500)*np.exp(-t*9)*np.minimum(1,t/.01);y=mixl((0,.7*plip),(0,.5*spl),(.03,.25*bp(noise(.2),2000,6000)*np.exp(-T(.2)*20)));return norm(y,-3)
def S08():  # 입질: 물방울 + 팝 (또렷하게)
    drop=np.sin(2*np.pi*np.cumsum(sweep(600,1800,.08))/SR)*np.exp(-T(.08)*25)
    pop=np.sin(2*np.pi*np.cumsum(sweep(1400,700,.06))/SR)*np.exp(-T(.06)*40)
    y=mixl((0,drop),(.1,pop),(.1,.4*bell(nm('A6'),.05,glock=True)[:int(.25*SR)]));return norm(y,-1)
def S09():  # 챔질 성공: 줄 튕김 + 상승
    tw=pluck(nm('E4'),.15,bright=1.6)[:int(.3*SR)]*np.exp(-T(.3)*6);up=tonef(sweep(500,1400,.2),.22,dec=6)
    y=mixl((0,tw),(0,.3*hp(noise(.04),3000)),(.06,.45*up));return norm(y,-2)
def S10():  # PERFECT: 더 강하고 맑은 타격
    y=mixl((0,pluck(nm('E4'),.15,bright=2)[:int(.3*SR)]),(0,.5*hp(noise(.05),2500)*np.exp(-T(.05)*40)),(0,.6*kick()[:int(.2*SR)]),
           (.05,.5*bell(nm('E6'),.05,glock=True)[:int(.5*SR)]),(.1,.45*bell(nm('B6'),.05,glock=True)[:int(.5*SR)]),(.05,.35*tonef(sweep(700,2100,.2),.25,dec=5)))
    return norm(small_rev(y,.6,.25)[:int(.6*SR)],-1)
def S11():  # 릴 감기(반복용): 작고 부드러운 딸깍 회전음 0.5초 루프
    n=int(.5*SR);y=np.zeros(n);cl=bp(noise(.012),2500,7000)*np.exp(-T(.012)*300)
    for k in range(12):i=int(k*n/12);y[i:i+len(cl)]+=cl*(.7 if k%2 else 1)
    t=np.arange(n)/SR;y+=.12*np.sin(2*np.pi*180*t)*(.5+.5*np.sin(2*np.pi*24*t));return norm(y,-10)
def S12():  # 물고기 저항: 물살 + 저음
    t=T(.6);y=mixl((0,lp(noise(.6),1800)*np.exp(-t*4.5)*np.minimum(1,t/.03)),(0,.7*tonef(sweep(110,60,.4),.45,dec=5)),(.05,.3*bp(noise(.3),900,3000)*np.exp(-T(.3)*8)))
    return norm(y,-2)
def S13():  # 장력 경고: 짧고 둥근 두 번 경고 (날카롭지 않게)
    def bp_(f):t=T(.11);return np.sin(2*np.pi*f*t)*np.sin(np.pi*t/.11)+.25*np.sin(2*np.pi*f*2*t)*np.sin(np.pi*t/.11)
    return norm(mixl((0,bp_(740)),(.15,bp_(740))),-5)
def S14():  # 위기 링 성공: 반짝 타격 + 상승
    y=mixl((0,.5*kick()[:int(.15*SR)]),(0,.5*hp(noise(.03),3000)),*[(i*.05,bell(nm(n),.05,glock=True)[:int(.4*SR)]*.6) for i,n in enumerate(['G5','C6','E6','G6'])]);return norm(small_rev(y,.5,.25)[:int(.6*SR)],-2)
def S15():  # 크리티컬: 강하고 시원한 타격
    y=mixl((0,kick()[:int(.3*SR)]),(0,.7*hp(noise(.08),2000)*np.exp(-T(.08)*30)),(0,.5*tonef(sweep(1600,600,.15),.2,dec=12)),
           (.04,.55*bell(nm('C7'),.05,glock=True)[:int(.5*SR)]),(.04,.4*bell(nm('G6'),.05)[:int(.6*SR)]));return norm(small_rev(y,.7,.3)[:int(.8*SR)],-1)
def S16():  # 결정타: 물보라 + 밝은 승리
    spl=lp(noise(.7),3000)*np.exp(-T(.7)*5)*np.minimum(1,T(.7)/.01)
    y=mixl((0,.7*kick()),(0,.6*spl),*[(.08+i*.07,marimba(nm(n),.1)[:int(.5*SR)]*.7) for i,n in enumerate(['C5','E5','G5','C6'])],(.36,.6*bell(nm('C7'),.05,glock=True)[:int(.6*SR)]))
    return norm(small_rev(y,.8,.3)[:int(1.0*SR)],-1)
def S17():  # 일반 물고기 획득: 귀엽고 경쾌
    y=mixl(*[(i*.07,marimba(nm(n),.1)[:int(.4*SR)]) for i,n in enumerate(['G5','C6','E6'])],(.21,.6*bell(nm('G6'),.05,glock=True)[:int(.4*SR)]));return norm(small_rev(y,.5,.2)[:int(.6*SR)],-2)
def S18():  # 희귀 물고기: 반짝이는 상승 선율 (게임에서 등급별 속도·겹침)
    ns=['C6','E6','G6','B6','D7','G7'];y=mixl(*[(i*.09,bell(nm(n),.05,glock=True)[:int(.7*SR)]*.6) for i,n in enumerate(ns)],
       *[(i*.09,marimba(nm(n)-12,.1)[:int(.5*SR)]*.4) for i,n in enumerate(ns)],(0,.5*pad([nm('C4'),nm('G4'),nm('E5')],.9,a=.05,r=.4)[:int(1.2*SR)]))
    return norm(small_rev(y,1.0,.3)[:int(1.2*SR)],-1.5)
def S19():  # 보물 발견: 신비로운 금속 반짝임 + 황금 보상음
    shim=sum(bell(nm(n),.05)[:int(1.1*SR)]*.4 for n in ['A6','E7'])
    y=mixl((0,shim),(.15,S04()[:int(.5*SR)]*.6),*[(.25+i*.08,marimba(nm(n),.1)[:int(.5*SR)]*.6) for i,n in enumerate(['A5','C#6','E6','A6'])])
    return norm(small_rev(y,1.0,.3)[:int(1.2*SR)],-1.5)
def S20():  # 대박 보물: 강한 상승 선율 + 종소리
    up=['G5','B5','D6','G6','B6','D7'];y=mixl((0,.6*kick()),*[(i*.08,bell(nm(n),.05,glock=True)[:int(.8*SR)]*.6) for i,n in enumerate(up)],
       *[(i*.08,pluck(nm(n)-12,.1,bright=1.2)[:int(.4*SR)]*.5) for i,n in enumerate(up)],(.5,.9*bell(nm('G5'),.05)[:int(1.3*SR)]),(.5,.6*bell(nm('D6'),.05)[:int(1.3*SR)]),
       (.5,.4*pad([nm('G3'),nm('D4'),nm('B4'),nm('G5')],1.1,a=.05,r=.5)[:int(1.3*SR)]),(.48,S04()[:int(.5*SR)]*.5))
    return norm(small_rev(y,1.2,.35)[:int(1.8*SR)],-1)
BGMS=[('bgm_01_yosu_morning',bgm1),('bgm_02_sunset_sea',bgm2),('bgm_03_moonlight_fishing',bgm3),('bgm_04_deep_sea_adventure',bgm4),('bgm_05_treasure_discovery',bgm5)]
SFXS=[('sfx_01_button',S01),('sfx_02_menu_open',S02),('sfx_03_menu_close',S03),('sfx_04_gold',S04),('sfx_05_cast_charge',S05),('sfx_06_cast_throw',S06),('sfx_07_float_splash',S07),
      ('sfx_08_bite',S08),('sfx_09_hook_success',S09),('sfx_10_perfect_hook',S10),('sfx_11_reel',S11),('sfx_12_fish_resistance',S12),('sfx_13_line_warning',S13),('sfx_14_crisis_success',S14),
      ('sfx_15_critical',S15),('sfx_16_finisher',S16),('sfx_17_fish_caught',S17),('sfx_18_rare_fish',S18),('sfx_19_treasure_found',S19),('sfx_20_legendary_treasure',S20)]
LOOPS={'sfx_05_cast_charge','sfx_11_reel'}
def write_wav(p,y):
    import wave;y=np.clip(y,-1,1);ch=1 if y.ndim==1 else y.shape[1];d=(y*32767).astype('<i2').tobytes()
    with wave.open(p,'wb') as w:w.setnchannels(ch);w.setsampwidth(2);w.setframerate(SR);w.writeframes(d)
def write_mp3(p,y,kbps):
    y=np.clip(y,-1,1);ch=1 if y.ndim==1 else 2;e=lameenc.Encoder();e.set_bit_rate(kbps);e.set_in_sample_rate(SR);e.set_channels(ch);e.set_quality(2)
    data=e.encode((y*32767).astype('<i2').tobytes())+e.flush();open(p,'wb').write(data);return len(data)
def main():
    os.makedirs(os.path.join(OUT,'bgm'),exist_ok=True);os.makedirs(os.path.join(OUT,'sfx'),exist_ok=True);os.makedirs(WAV,exist_ok=True)
    only=sys.argv[1:] ;meta={}
    mp=os.path.join(OUT,'audio_meta.json')
    if os.path.exists(mp):meta=json.load(open(mp,encoding='utf-8'))
    if not only or only[0]=='bgm':
        for i,(name,fn) in enumerate(BGMS):
            if len(only)>1 and str(i+1)!=only[1]:continue
            y,bpm,bars=fn();n=len(y);write_wav(os.path.join(WAV,name+'.wav'),y);sz=write_mp3(os.path.join(OUT,'bgm',name+'.mp3'),y,80)
            meta[name]={'samples':n,'sr':SR,'sec':round(n/SR,2),'bpm':bpm,'bars':bars,'mp3':sz};print(name,f'{n/SR:.1f}s',bpm,'BPM',sz//1024,'KB',flush=True)
    if not only or only[0]=='sfx':
        for name,fn in SFXS:
            y=fn();y=y if name in LOOPS else tight(y)
            if name not in LOOPS:fi=int(.0015*SR);y=y.copy();y[:fi]*=np.linspace(0,1,fi)   # 시작 딱 소리 방지
            n=len(y);write_wav(os.path.join(WAV,name+'.wav'),y);sz=write_mp3(os.path.join(OUT,'sfx',name+'.mp3'),y,96)
            meta[name]={'samples':n,'sr':SR,'sec':round(n/SR,3),'loop':name in LOOPS,'mp3':sz};print(name,f'{n/SR:.2f}s',sz//1024,'KB',flush=True)
    json.dump(meta,open(mp,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
if __name__=='__main__':main()
