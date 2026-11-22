# 세 가지 AI 나눠 쓰기

| 할 일 | 도구 | 결과를 넣는 곳 |
|---|---|---|
| 게임 기획·아이디어·사양서 | ChatGPT | `docs/specs/버전.md` 로 저장 |
| 이미지(물고기·의상 시트·배경) | Manus | `assets/incoming/` 에 PNG 넣기 |
| 구현·이미지 적용·테스트·빌드 | Claude Code | `dist/haneul-fishing.html` |

## Claude Code에 보내는 기본 문장
- 사양서: `docs/specs/4.14.md 를 읽고 구현해줘. CLAUDE.md 규칙 지키고, 끝나면 빌드하고 관련 테스트 돌려서 결과 보고해줘.`
- 이미지: `assets/incoming 에 넣은 이미지를 게임에 적용해줘. 어떤 물고기/세트인지 파일 이름 보고 판단하고, 적용 전후를 캡처해서 보여줘.`
- 작은 수정: `○○ 고쳐줘. 테스트는 최소로.`

## Manus에게 보낼 때 한 줄 덧붙이기
`HTML은 만들지 말고 이미지 파일(투명 PNG)만 주세요. 파일 이름은 물고기 ID(예: galchi.png) 또는 세트 이름으로.`
