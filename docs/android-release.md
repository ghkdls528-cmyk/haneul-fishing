# 안드로이드 앱 · Google Play 출시 준비 (4.24)

상태 표시: ✅ 이 PC에서 끝냄·테스트함 / ⏳ 도구 설치 후 할 일 / 🙋 사용자가 직접 정해야 함 / [확인 필요]

## 1. 앱 방식: Capacitor 선택 (TWA 아님)

| 기준 | Capacitor (선택) | TWA (신뢰할 수 있는 웹 활동) |
|---|---|---|
| 게임 코드 재사용 | 지금 단일 HTML을 앱 안에 그대로 넣음 | 웹사이트를 크롬으로 띄움 |
| 오프라인 | 됨 (게임 파일이 앱 안에 있음) | 서비스 워커를 따로 만들어야 함 |
| 저장 데이터 | 앱 전용 저장소. 크롬 '사이트 데이터 삭제'에 안 지워짐 | 크롬 저장소 공유. 크롬 데이터 지우면 같이 지워짐 |
| 필수 조건 | 없음 | 도메인 **맨 위**에 `/.well-known/assetlinks.json` 필요 → 지금 주소(`ghkdls528-cmyk.github.io/haneul-fishing/`)는 하위 폴더라 별도 저장소가 필요 |
| 뒤로 가기 | WebView 기록을 따라감 → 4.24에서 게임이 처리 | 크롬과 같음 |
| 업데이트 | 앱 업데이트를 올려야 반영 | 웹만 고치면 바로 반영 |
| 정책 | 내용이 앱에 들어 있어 '웹사이트를 감싸기만 한 앱' 문제 없음 | 웹뷰 앱 정책상 문제는 없지만 웹 의존 |
| 크기 | 약 25MB(게임 HTML) + 앱 틀. AAB 제한 200MB 안 | 작음 |

결론: 이 게임은 **기록을 기기에 저장**하고 **인터넷 없이도 돌아가는** 게 중요해서 Capacitor가 더 안전합니다.
단점: 게임을 고칠 때마다 Play에 새 버전을 올려야 앱에 반영됩니다. 웹 주소는 지금처럼 자동 반영돼요.

## 2. 4.24에서 게임에 미리 반영한 것 ✅ (tests/t424.py 13개 통과)
- **휴대폰 뒤로 가기**: 메뉴·옷장·수족관이 열려 있으면 그 창만 닫힘. 아무것도 안 열려 있으면 앱 종료(안드로이드 기본 동작).
- **기록 옮기기(세이브 코드)**: 설정 › 기록 옮기기. 웹에서 하던 기록을 앱으로 옮김.
  - 웹 기록과 앱 기록은 저장소가 달라서 자동으로 옮겨지지 않기 때문에 꼭 필요해요.
  - 불러오기 전 기록은 `haneul-fish-v4-preimport`에 한 벌 보관해요.
- **앱 안 브라우저 경고 제외**: 원래 안드로이드 WebView(`; wv)`)를 카카오톡 같은 앱 안 브라우저로 보고 "기록이 지워질 수 있어요" 경고를 띄우는 코드가 있었음. 우리 앱(`HaneulFishingApp`)에서는 안 뜨게 함.
- **개인정보처리방침 페이지**: `docs/privacy.html` → 배포 후 `https://ghkdls528-cmyk.github.io/haneul-fishing/privacy.html`

## 3. 개인정보·권한 점검 결과 (코드 확인)
- 외부로 보내는 코드: `fetch`·XHR·분석·광고·결제 **없음** (src 전체 검색).
- 외부 접속은 **Google Fonts 글꼴 1건**뿐(src/head.html 7~8줄). 인터넷이 없으면 기본 글꼴로 나옴.
  - 앱에서는 글꼴 파일(Jua, OFL 라이선스)을 앱 안에 넣는 게 좋아요. 글꼴 파일 다운로드 허락이 필요해서 아직 안 함 ⏳.
- 필요한 권한: `INTERNET`(Capacitor 기본), `VIBRATE`(진동, 일반 권한). 그 외 권한은 추가하지 말 것.
  - WebView에서 진동이 동작하려면 `android/app/src/main/AndroidManifest.xml`에 `<uses-permission android:name="android.permission.VIBRATE"/>` 추가 ⏳ [확인 필요: 실제 기기에서 진동]
- **Data safety(데이터 보안) 답변**: "데이터를 수집하거나 공유하지 않음". 기록은 기기에만 저장되고 전송되지 않아요.
  - 단, Google Fonts 접속을 남기면 [확인 필요]. 글꼴을 앱 안에 넣으면 깔끔해요.
- 광고 없음, 앱 내 결제 없음. 상점은 게임 골드만 써요.
- 뽑기(가챠)는 **실제 돈과 무관**한 게임 골드 전용 [추정: 콘텐츠 등급 설문에서 "랜덤 아이템 구매(유료)" 아님].

## 4. Play 요구사항 (2026-11 확인)
- **target API 36(Android 16) 이상**: 2026-08-31부터 새 앱·업데이트에 필수. Capacitor 8이 targetSdk 36, minSdk 24.
  - 출처: [Google Play target API 정책](https://support.google.com/googleplay/android-developer/answer/11926878), [Android target SDK 안내](https://developer.android.com/google/play/requirements/target-sdk), [Capacitor 8 업데이트 안내](https://capacitorjs.com/docs/updating/8-0)
- **AAB(Android App Bundle)** 업로드 필수. **Play 앱 서명** + 업로드 키(직접 만들고 잃어버리지 않게 보관).
- **개인 개발자 계정**(2023-11-13 이후 생성)은 프로덕션 출시 전 **비공개 테스트에 테스터 12명 이상이 14일 연속 참여**해야 함.
  - 출처: [Play Console 도움말](https://support.google.com/googleplay/android-developer/answer/14151465)
- Edge-to-edge: Android 15+에서 앱이 화면 끝까지 그려짐.
  - 게임 CSS는 이미 `env(safe-area-inset-*)`과 `viewport-fit=cover`를 씀. [확인 필요: 실제 기기에서 상단 줄이 상태 표시줄에 가리지 않는지]

## 5. 🙋 사용자가 정해야 할 것
1. **패키지 ID**: 설정 파일엔 `io.github.ghkdls528cmyk.haneulfishing`으로 적어 둠. **출시 후엔 영원히 못 바꿈**. 다른 걸 원하면 출시 전에 바꾸세요.
2. **Google Play 개발자 계정**: 등록비(1회) 결제와 본인 인증은 사용자가 직접.
3. **업로드 키 비밀번호**: 키 파일(.jks)과 비밀번호는 사용자가 보관. 저장소(공개)에 절대 올리지 않음(`android-app/.gitignore`에 제외해 둠).
4. **개인정보처리방침 문의 이메일**: `docs/privacy.html`의 [ ] 칸.
5. **테스터 12명**(개인 계정이면).
6. 스토어 그림: 아이콘 512×512, 대표 이미지 1024×500, 휴대폰 스크린샷 2장 이상. 아이콘은 Manus로 만들기 권장.

## 6. ⏳ 이 PC에 필요한 도구 (지금 없음)
- Node.js LTS, JDK 21, Android Studio(Otter 2025.2.1 이상, Android SDK 36 포함) — 합쳐서 수 GB.
- 실제 안드로이드 폰 + USB 디버깅(또는 에뮬레이터).

## 7. 도구 설치 후 빌드 순서
```powershell
cd android-app
npm install
npx cap add android          # android/ 폴더 생성 (처음 1번)
npm run sync                 # 게임 빌드 → www/index.html 복사 → 안드로이드 프로젝트에 반영
npx cap open android         # Android Studio에서 열기 → 폰 연결 후 ▶ 실행
```
- 처음 1번: `AndroidManifest.xml`에 VIBRATE 권한 추가, 세로 고정(`android:screenOrientation="portrait"`), 앱 아이콘·스플래시 넣기.
- 출시 파일: Android Studio › Build › Generate Signed App Bundle → `.aab`.
- 버전: `android/app/build.gradle`의 `versionCode`(올릴 때마다 +1)·`versionName`(예: 4.24).

## 8. 실제 기기에서 꼭 볼 것 (아직 안 함)
설치·첫 실행 / 낚시 한 판 / 뒤로 가기(메뉴 닫힘 → 앱 종료) / 홈으로 나갔다 오기(소리 멈춤·기록 유지) / 앱 완전히 끄고 다시 켜기 / 비행기 모드에서 실행 / 진동 / 상단 줄과 상태 표시줄 겹침 / 기록 옮기기(웹 → 앱) / 앱 업데이트 후 기록 유지
