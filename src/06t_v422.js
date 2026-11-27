/* ================= 4.22 계절이 게임 속 날짜로 흐름 · 상단 줄 좁은 화면 최적화 =================
 ① 계절: 실제 달력 대신 게임 시간(gt)으로 — 한 계절 게임 6일(약 48분 플레이), 바뀌면 큰 글씨·알림 (06e seasonInfo)
 ② 상단 줄: 칭호를 달아도 경험치바가 가려지지 않게(칭호는 줄임표, 숫자 대신 %), 폭 420 이하에서 골드를 '123.4만'처럼 줄여 씀 */
function fmtGoldHud(g){if(innerWidth>420||g<100000)return g.toLocaleString();if(g>=1e8)return(Math.floor(g/1e7)/10)+'억';return(Math.floor(g/1e3)/10)+'만'}
let sea422=null;
const _up422b=update;update=function(dt){_up422b(dt);const s=seasonNow();if(sea422===null){sea422=s;return}
 if(s!==sea422){sea422=s;const S0=SEASONS[s];hud();if(TEST&&window.__season)return;
  bigText(`${S0.ic} ${S0.n}이 왔어요!`,'제철 물고기가 바뀌었어요',{spring:'#ff9ad8',summer:'#7ff0e6',autumn:'#ffb040',winter:'#cfe8ff'}[s]);notice(`${S0.ic} ${seasonInfo().year}년째 ${S0.n} — 제철 물고기 ×${SEA_IN}`);if(SFX.reward)SFX.reward(3)}};
addEventListener('resize',()=>hud());
if(TEST)Object.defineProperties(window.__w,{seasonInfo:{value:()=>seasonInfo()},fmtGoldHud:{value:g=>fmtGoldHud(g)},seaDays:{value:SEA_DAYS},DAY:{value:DAY},gtSet:{value:v=>{gt=v}},gtGet:{value:()=>gt}});
