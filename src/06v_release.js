/* ================= 4.24 출시 준비 (안드로이드 앱 대비) =================
 - IS_APP: 안드로이드 앱(Capacitor) 안에서 실행 중인지 (앱 설정에서 사용자 에이전트 끝에 HaneulFishingApp을 붙임)
 - 뒤로 가기: 메뉴(시트)가 열려 있으면 휴대폰 뒤로 가기 버튼 → 메뉴만 닫힘 (게임이 꺼지거나 페이지를 떠나지 않음)
 - 세이브 코드: 설정 › 기록 옮기기. 웹에서 하던 기록을 앱(또는 다른 폰)으로 옮김. 불러오기 전 지금 기록은 haneul-fish-v4-preimport에 따로 보관 */
const IS_APP=/HaneulFishingApp/.test(navigator.userAgent||'')||!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
if(IS_APP)document.documentElement.classList.add('app424');

// ---- 뒤로 가기 버튼 ----
// 메뉴·옷장·수족관을 열면 기록(history)에 한 칸을 넣고, 뒤로 가기가 그 칸을 빼면 그 창만 닫음
let histOn=null,backPending=false,reopenId=null;
const BK={sheet:()=>$('sheet').classList.contains('show'),ward:()=>$('ward').classList.contains('on'),aq:()=>$('aq').classList.contains('on')};
const BKC={};
function backPush(id){if(backPending){reopenId=id;return}if(!histOn){try{history.pushState({hf424:1},'')}catch(e){return}}histOn=id}
function backDrop(id){if(histOn!==id)return;histOn=null;backPending=true;try{history.back()}catch(e){backPending=false}}
{const _os=openSheet;openSheet=function(){const was=BK.sheet()||$('sheet').classList.contains('on');_os.apply(this,arguments);if(!was&&$('sheet').classList.contains('on'))backPush('sheet')};
 const _cs=closeSheet;BKC.sheet=_cs;closeSheet=function(){_cs.apply(this,arguments);backDrop('sheet')};
 const _ow=openWard;openWard=function(){_ow.apply(this,arguments);if(BK.ward())backPush('ward')};
 const _cw=closeWard;BKC.ward=_cw;closeWard=function(){_cw.apply(this,arguments);backDrop('ward')};
 const _oa=openAq;openAq=function(){_oa.apply(this,arguments);if(BK.aq())backPush('aq')};
 const _ca=closeAq;BKC.aq=_ca;closeAq=function(){_ca.apply(this,arguments);backDrop('aq')};}
addEventListener('popstate',()=>{
 if(backPending){backPending=false;const r=reopenId;reopenId=null;// 닫으며 되돌리는 사이 다른 창을 열었다면 칸을 다시 넣음
  if(r&&BK[r]())backPush(r);return}
 if(histOn){const id=histOn;histOn=null;if(BK[id]())BKC[id]()}});

// ---- 세이브 코드 (기록 옮기기) ----
const SCODE='HNF1:';
function saveCode(){try{persist()}catch(e){}const js=JSON.stringify(save);return SCODE+btoa(unescape(encodeURIComponent(js)))}
function readCode(txt){txt=String(txt||'').replace(/\s+/g,'');if(!txt.startsWith(SCODE))return null;
 try{const o=JSON.parse(decodeURIComponent(escape(atob(txt.slice(SCODE.length)))));if(!o||typeof o!=='object'||Array.isArray(o)||typeof o.lv!=='number'||!o.dex||typeof o.dex!=='object')return null;return o}catch(e){return null}}
function importCode(txt){const o=readCode(txt);if(!o)return false;
 try{const cur=localStorage.getItem(SV_KEY);if(cur)localStorage.setItem('haneul-fish-v4-preimport',cur)}catch(e){}
 const s=sanitize(o);save=s;try{if(typeof s.gt==='number'&&isFinite(s.gt))gt=s.gt}catch(e){}persist();return true}
let scArm=false;
function saveCodeHTML(){return`<div class="sum sc424"><b>📦 기록 옮기기</b> · 웹에서 하던 기록을 앱이나 다른 폰으로 옮겨요.<br>① 하던 곳에서 <b>코드 복사</b> → ② 옮길 곳에서 붙여 넣고 <b>불러오기</b>
 <div class="sc424b"><button data-sc="copy">📋 코드 복사</button><button data-sc="load">${scArm?'한 번 더 누르면 덮어써요':'📥 불러오기'}</button></div>
 <textarea id="scBox" rows="3" placeholder="여기에 HNF1: 로 시작하는 코드를 붙여 넣으세요" spellcheck="false"></textarea>
 <small>불러오면 이 기기의 지금 기록은 덮어써져요(지금 기록은 따로 한 벌 보관해 둬요). 코드는 남에게 보내지 마세요.</small></div>`}
{const _sh=setHTML;setHTML=function(){return _sh()+saveCodeHTML()}}
$('sbody').addEventListener('click',async e=>{const b=e.target.closest('button[data-sc]');if(!b)return;const box=$('scBox');
 if(b.dataset.sc==='copy'){scArm=false;const c=saveCode();box.value=c;let ok=false;try{await navigator.clipboard.writeText(c);ok=true}catch(err){}
  if(!ok){box.focus();box.select();try{ok=document.execCommand('copy')}catch(err){}}toast(ok?'📋 코드를 복사했어요 · 옮길 곳에 붙여 넣으세요':'코드를 길게 눌러 직접 복사해 주세요',1600);return}
 if(b.dataset.sc==='load'){const v=box.value;if(!readCode(v)){scArm=false;toast('코드가 올바르지 않아요 · HNF1: 로 시작하는 코드 전체를 붙여 넣어 주세요',1800);return}
  if(!scArm){scArm=true;b.textContent='한 번 더 누르면 덮어써요';b.style.background='#ff6b6b';b.style.color='#fff';return}
  scArm=false;if(importCode(v)){toast('📥 기록을 불러왔어요 · 다시 시작해요',1200);setTimeout(()=>location.reload(),900)}else toast('불러오지 못했어요',1200)}});
if(TEST)Object.defineProperties(window.__w,{isApp:{get(){return IS_APP}},saveCode:{value:saveCode},readCode:{value:readCode},histOn:{get(){return histOn}}});
