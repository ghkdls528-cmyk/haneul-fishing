# HANEUL FISHING (하늘이의 여수 낚시) — Claude Code 작업 지침

## 사용자
- **한국어로 답변**, 결론 먼저, 쉬운 말. GitHub는 처음이라 사용자가 직접 눌러야 하는 건 한 단계씩 안내.
- 확인 안 된 건 [추정]/[확인 필요] 표시. 테스트하지 않은 기능을 "완료"라고 보고하지 말 것.
- 이미지 생성은 Manus, 게임 기획 의견은 ChatGPT를 씀. Claude Code는 **구현·검증 담당**.

## 절대 규칙
1. **단일 HTML**: 결과물은 `dist/haneul-fishing.html` 하나. 이미지는 base64로 파일 안에 넣는다(외부 폴더 의존 금지).
2. **세이브 보호**: localStorage 키 `haneul-fish-v4`(+ `-backup`, 4.14.2부터 `-safe`·`-rev`)와 기존 필드는 절대 지우거나 초기화하지 않는다. 저장은 반드시 `persist()`로(저장 번호로 오래된 탭의 덮어쓰기를 막음, 06h_safe.js). 새 필드는 `src/02_save.js`의 `fresh()` 기본값 + `sanitize`에 안전한 정리 코드를 함께 추가한다.
3. 기존 콘텐츠(물고기 134종, 낚시터 10곳, 장비, 의상 30세트, 펫, 업적·칭호, 수족관, 보물) 삭제 금지. (보물 낚시·시간 제한 도전 모드는 4.19에서, 도감 보물 탭·상점 보물 연마는 4.25에서 사용자 요청으로 삭제 — 보물 자체는 장비 › 보물에 그대로)
4. 브랜드 로고 금지(모자 등은 무지 또는 물고기 엠블럼). 적십자 금지(구조대는 초록 십자).
5. 주인공 얼굴은 사용자 본인 캐릭터. 새 얼굴을 만들지 말 것.
6. 모바일 세로(390×844) 우선. 좁은 폰(360·384 폭, 갤럭시 S22 울트라)에서도 상단 줄이 안 겹치는지 확인.

## 구조
- `src/head.html` — HTML·CSS
- `src/*.js` — 게임 모듈. **로드 순서는 `build.py`의 `MODS`**. 뒤 모듈(06d_modes, 06e_412 등)은 앞 함수를 `const _x0=fn; fn=function(){...}` 식으로 감싸서 확장한다. 새 기능도 이 방식으로 새 모듈에 넣는 걸 권장.
  - 00_core 캔버스·DPR / 01_data 물고기·낚시터·장비 데이터 / 02_save 저장·마이그레이션 / 05_world 확률(weights, rollFish, makeFish)
  - 06_game 낚시 상태기계(S: ready→charge→cast→wait→bite→hook→fight→land→result/fail) / 06b_gear 장비·위기 링(clutch)
  - 06c_fun 오늘의 대어·행운상자·업적 알림·화면 겹침 정리·펫 쓰다듬기·안개
  - 06d_modes 보물 낚시·시간 제한 도전·도감 검색/필터·장비 장단점·지역 골드
  - 06e_412 계절·강풍·불운 방지·희귀 입질·낚시터 이벤트·숨은 포인트·도감 수집 보상·정보 창
  - 06z_fishai 물고기 행동 읽기: 신호 AI_TELL·성격 AI_TR(fg.ai)·읽기 보너스 / 06y_aq426 수족관 등급 카드·세트 보너스 AQ_SETB·보물 방울(save.aq.pb)·aqL(크기 안전값) / 06x_v426 계절 입자 seasonFx(나비는 07 lifeFront에서 삭제)
  - 06w_tre425 장비 보물: 이야기 TSTORY·등급 TGRADE·부가 옵션 TOPT(save.tre[id].opt, ensureOpt)·레벨 무제한 treLvMul·효과 상한 TCAP·도감 보물 탭 삭제·칭호 두 번째 줄 #titleRib
  - 06v_release 4.24 출시 준비: 뒤로 가기(메뉴·옷장·수족관만 닫힘, history 한 칸)·세이브 코드(설정 › 기록 옮기기, HNF1:)·앱 감지 IS_APP(UA에 HaneulFishingApp). 안드로이드 앱은 android-app/(Capacitor) · docs/android-release.md
  - 06u_v423 느슨 놓침 한계 slkLim(등급별)·놓침 문구 상자(toast.f423)·장비 › 상점(뽑기 GACHA·버프 BUF/save.buf·대박 타임 즉시·보물 연마 polCost)·상단 골드 누르면 상점
  - 06t_v422 계절 흐름 알림·좁은 화면 골드 줄여 쓰기(fmtGoldHud) — 계절 계산 자체는 06e seasonInfo(게임 6일=한 계절)
  - 06s_v421 찌 그림(itempx bob_<id>)·추천 미끼 이름(baitPref)·지역 보너스 locGM(열어 둔 최고)·황금상자 chestGold(대박 뽑기)·대박 타임(JP)·골드 숫자 연출
  - 06r_v420 영웅 이상 난이도·낚싯배 갑판(G의 deck)·펫 대기 모션(PA, petTx)·펫 선물 / 펫 효과는 PET_ON(id)=산 펫 모두 적용
  - 06q_v419 업적 ~210(ACH2)·칭호 효과(TITLE_FX, tfx)·보물 랜덤 획득(treDrop)·수족관 의뢰/명성/교감·낚시 모드 숨김
  - 06o_gear418 손맛(★1~3 빠르게)·난이도(빨간 칸 즉시 위기·느슨 0.6초)·보상↑·장비 승급/보상 판매/계승/숙련 (save.inh·save.gm)
  - 06m_bgfx 배경 시간대·날씨·계절 (영역 지도·계절 덧그림은 python tools/make_bg_fx.py <원본 폴더>로 다시 만듦) / 06l_combo 20콤보 이후 단계·보상 / 06n_sound2 동적 음악·환경음·물고기 그룹·이벤트·반응음 (python tools/audio_ext.py)
  - 06k_audio 오리지널 BGM·효과음(assets/audio, base64 MP3) · 자동 BGM 전환 · 설정 › 소리 · SFX 이름에 음원 연결 — 음원 다시 만들기: python tools/make_audio.py
  - 06j_polish 받침 잘라 물색으로 섞기(수중 배경 있는 갯바위·계곡·산호초·방파제) · 물속 친구 탭
  - 06i_tre415 보물 그림(itempx tre_<id>)·보물 장착 칸·종류별 효과(TRE_FX, fxv) / 06h_safe 기록 보호
  - 06g_fun414 챔질 PERFECT 판정·콤보 연출·획득 문구·희귀 연출 단축 (연출만, 보상 변화 없음)
  - 06f_414 전투 밸런스(목표 시간·장비 단계·체급·저항 패턴) / 실력 평가·개인 기록(fightRecords) / 테스트용 전투 시뮬레이터
  - 07_drawworld / 07b_scenes 배경(선착장·갯바위·계곡·방파제·먼바다는 07b)
  - 08c_pxchar 캐릭터 스프라이트(CPX), 04e_pix 물고기 스프라이트(FPX), 04f_items 장비·펫·수조 이미지(IPX)
  - 09_ui / 09b_ui3 화면·시트·옷장·수족관
- `assets/charpx.json` 캐릭터 30세트 프레임(`{세트id:{포즈:{src,ax,tip,w,h}}}`), `fishpx.json` 물고기 134종, `itempx.json` 장비·스킨·보트·장식·펫·수조, `outfitpx.json`, `sp2_*` 옛 스프라이트
- `assets/incoming/` — Manus가 만든 새 이미지를 여기에 넣으면 처리해서 위 json에 합친다.
- `docs/specs/` — ChatGPT 등에서 받은 사양서를 버전별로 넣는다 (예: `4.14.md`).

## 빌드·테스트
- 빌드: `python build.py` → `dist/haneul-fishing.html`
- 테스트 준비(최초 1회): `pip install playwright pillow numpy scipy` 후 `python -m playwright install chromium`
- 테스트: `python tests/t46.py` 처럼 하나씩. URL에 `?test`를 붙이면 `window.__t`, `__w`, `__cast`, `__bot` 테스트 훅이 열린다. `window.__noLuck=1`(행운 상자 끔), `__w.setEvtNext(9999)`(낚시터 이벤트 끔).
  - t46 세트 낚시 / t47 오늘의 대어·행운 상자 / t48 손맛 마스터·화면 겹침 / t56 수족관 먹이·업적 / t57 보물·도전·도감 필터 / t61 4.12 계절·이벤트·수집 보상 / t64 위기 링 / t414 4.14 세이브 호환·실력 평가·기록 / t414m 낚시 방식 6종·보스 실전 / t414f 챔질 판정·콤보 연출·획득 문구 / t414s 여러 탭·예전 탭 덮어쓰기 방지·앱 안 브라우저 안내 / t415 보물 21종·장착 칸·효과 / t4152 칩·알림 깜빡임·물속 친구 탭·받침 / t416 사운드(디코딩·BGM 전환·이벤트 효과음·설정) / t417 배경 변화·콤보·사운드 확장 / t418 난이도 규칙·장비 계승 / t419 업적·칭호·보물 획득·수족관·도감 형태 / t420 보상·펫·도감 잠금·장식·낚싯배 / t421 찌 그림·추천 미끼·지역 보너스·황금상자·대박 타임 / t422 계절 흐름·좁은 화면 상단 줄 / t423 느슨 놓침 타이밍·놓침 문구·상점 / t424 뒤로 가기·세이브 코드·앱 감지 / t425 장비 보물·레벨 무제한·칭호 두 번째 줄 / t426 계절 입자·나비 삭제·하늘 덧칠·수족관 리뉴얼·물고기 행동 읽기
  - 4.14 전투 시간은 실시간 대신 `__w.sim414(id,{n,gear:[rod,reel,line 단계 0~5],size:'s'|'n'|'l'|'g'})`로 화면 없이 빠르게 측정(실제 fight 함수 사용). 보정값은 `src/06f_414.js`의 `T414_C`·`T414_CB`.
- 작은 수정은 관련 테스트 1~2개만, 큰 업데이트는 전부 + 화면 캡처 확인.
- 게임 오류(pageerror) 0건이 기본 조건. 폰트 404는 오프라인 환경이면 무시.

## GitHub 자동 반영 (사용자 요청: 고칠 때마다 자동으로 올리기)
- 저장소: https://github.com/ghkdls528-cmyk/haneul-fishing (공개) · 게임 주소: https://ghkdls528-cmyk.github.io/haneul-fishing/
- 게임을 고치면: 빌드 → 관련 테스트 통과 → `git add -A` → 커밋(무엇을 바꿨는지 한 줄) → `git push`. 따로 묻지 않고 올림.
- 테스트가 실패하거나 확인 안 된 상태면 올리지 말고 먼저 알릴 것.
- push하면 `.github/workflows/pages.yml`이 `python build.py`로 빌드해서 GitHub Pages에 `index.html`로 배포(1~2분). `dist/`는 저장소에 넣지 않음.
- 공개 저장소이므로 개인정보(이름·사는 곳·직장 등)는 파일에 적지 말 것.
- git·gh 경로: `C:\Program Files\Git\cmd\git.exe`, `C:\Program Files\GitHub CLI\gh.exe` (계정 ghkdls528-cmyk로 로그인됨)

## 이미지 적용 요령 (지금까지 쓴 방식)
- scipy DLL이 이 PC 보안 정책에 막히면 도구들이 자동으로 tools/ndlite.py(numpy)로 대신함. 보물·찌: `python tools/import_tre.py <폴더>` (찌는 MAP의 '@' 항목 → bob_<id>)
- 물고기: 투명 PNG → 잘라서 긴 변 96px 도트화(색 28개, 외곽선 진갈색 #34201e) → 머리 오른쪽 → `fishpx.json[id]`
- 캐릭터 시트: 칸 자르기 → 배경 제거(실루엣 채움 알파) → 높이 240px webp(q74, alpha_quality 60) → `charpx.json[세트][포즈]`, 낚싯대 끝 `tip` 좌표 계산
- 낚시터 배경: `bg_<낚시터id>.png`(가로 2:1) 폴더를 `assets/incoming/`에 두고 `python tools/import_bg.py <폴더>` → `itempx.json`의 `bg_<id>`(webp 1600px). 원본은 `assets/incoming/`(git 제외)에 보관. 세로 화면 중심 위치는 `07_drawworld.js` drawFar의 `{moon:.7,light:.6}`. 수중 배경은 `bg_<id>_underwater.png` → 같은 도구로 `uw_<id>`(1280px q72), drawSea에서 사용.
- 꼭 적용 전후를 화면으로 비교하고, 로고·적십자가 있으면 지운다.

## 버전 기록
- 최신: 4.26 (라벤더 후드·계절 입자·배경 자국 수정·수족관 리뉴얼·물고기 행동 읽기). 4.25 (장비 보물: 하늘호 이야기·등급·옵션, 보물 레벨 무제한, 연마 삭제, 칭호 두 번째 줄). 4.24 (출시 준비: 뒤로 가기·기록 옮기기·개인정보처리방침·Capacitor 설정). 4.23 (느슨 놓침 타이밍·상점: 뽑기·버프·보물 연마). 4.22 계절이 게임 속 날짜로 흐름·좁은 화면 상단 줄. 4.21 최종 그림·황금상자 대박·대박 타임·지역 보너스 어디서나. 이전: 4.14+ (전투 밸런스(목표 시간은 사양의 절반)·실력 평가·개인 기록·짜릿한 손맛 연출). 이력은 `docs/CHANGELOG.md`.
- 버전을 올릴 때 `src/09_ui.js` 등에 표시되는 버전 문구가 있으면 함께 바꾸고, CHANGELOG에 한 줄 추가.
