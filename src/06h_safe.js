/* ================= 4.14.2 기록 지키기 (휴대폰) =================
 - 다른 탭이 더 최근에 저장하면 이 탭은 저장을 멈추고(02_save.js persist), 다시 보면 자동 새로고침해서 최신 기록을 불러옴
 - 시작하자마자 한 번 저장 · 브라우저에 "이 사이트 기록 지우지 않기"(storage.persist) 요청
 - 카카오톡·네이버 등 앱 안 브라우저면 크롬·사파리로 열라고 안내 (앱 안 브라우저는 기록이 지워지기 쉬움) */
function staleBanner(){let b=$('staleBar');if(b)return;b=document.createElement('button');b.id='staleBar';b.type='button';
 b.textContent='📱 다른 창에서 더 최근에 게임을 했어요 · 눌러서 최신 기록 불러오기';
 b.style.cssText='position:fixed;left:8px;right:8px;top:calc(env(safe-area-inset-top,0px) + 6px);z-index:60;min-height:44px;border:3px solid #3b2a1a;border-radius:14px;background:#fff3c4;color:#3b2a1a;font:16px Jua,sans-serif;padding:6px 10px;box-shadow:0 4px 0 #3b2a1a';
 b.onclick=()=>location.reload();document.body.appendChild(b)}
onStaleTab=()=>{if(document.hidden)return;staleBanner()};
addEventListener('storage',e=>{if(e.key===SV_REV&&(+e.newValue||0)>myRev){staleTab=true;onStaleTab()}});
// 숨겨져 있던 탭으로 돌아왔는데 다른 탭이 더 최근에 저장했다면 → 바로 최신 기록으로 새로고침
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&(staleTab||revNow()>myRev)){staleTab=true;location.reload()}});
addEventListener('pageshow',e=>{if(e.persisted&&revNow()>myRev){staleTab=true;location.reload()}}); // 뒤로가기 캐시로 되살아난 탭
$('bStart').addEventListener('click',()=>{setTimeout(persist,400);try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}});

// 앱 안 브라우저 안내
(function(){const ua=navigator.userAgent||'',kakao=/KAKAOTALK/i.test(ua),inapp=kakao||/NAVER\(inapp|Instagram|FBAN|FBAV|Line\/|DaumApps|everytimeApp|; wv\)/i.test(ua);if(!inapp||TEST&&!window.__inappTest)return;
 const t=$('title');if(!t)return;const d=document.createElement('div');d.id='inappNote';
 d.style.cssText='position:absolute;left:10px;right:10px;top:calc(env(safe-area-inset-top,0px) + 8px);z-index:5;background:#fff8ea;border:3px solid #3b2a1a;border-radius:14px;padding:8px 10px;font:14px Jua,sans-serif;color:#3b2a1a;text-align:center;line-height:1.4';
 d.innerHTML='⚠️ 앱 안 브라우저에서는 낚시 기록이 지워질 수 있어요.<br>'+(kakao?'<button id="inappOpen" type="button" style="margin-top:6px;min-height:44px;padding:6px 14px;border:2px solid #3b2a1a;border-radius:12px;background:#ffd23f;font:15px Jua,sans-serif">크롬·사파리로 열기</button>':'오른쪽 위 메뉴에서 <b>다른 브라우저로 열기</b>를 눌러 주세요.');
 t.appendChild(d);const ob=$('inappOpen');if(ob)ob.onclick=()=>{location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(location.href.replace(/[?&]test\b/,''))}})();
if(TEST)Object.defineProperties(window.__w,{saveRev:{get(){return{myRev,staleTab,rev:revNow()}}}});
