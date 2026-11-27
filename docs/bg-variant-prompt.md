# 배경 변형 그림 요청 프롬프트 (폭풍·겨울·봄)

다른 AI(Manus·ChatGPT 이미지 등)에 그대로 복사해서 쓰는 요청문입니다.

## 쓰는 법
1. **원본 그림을 꼭 함께 첨부**하세요: `assets/incoming/backgrounds_4.14/bg_<낚시터>.png` (2048×1024).
   원본 없이 새로 그리면 수평선·땅 위치가 달라져서 게임에 못 씁니다.
2. 한 번에 **낚시터 1곳 × 변형 1종**씩 요청하세요(예: 선착장 폭풍). 10곳 × 3종 = 30장.
3. 아래 **공통 요청문** + **낚시터별 한 줄** + **변형별 한 줄**을 이어 붙여 보내면 됩니다.
4. 받은 파일은 `assets/incoming/backgrounds_variants/` 폴더에 `bg_<낚시터>_<변형>.png` 이름으로 넣어 주세요.
   예: `bg_pier_storm.png`, `bg_rock_winter.png`, `bg_valley_spring.png`
5. 우선순위: 폭풍(storm) → 겨울(winter) → 봄(spring). 일부만 와도 그 그림부터 적용합니다.

---

## 공통 요청문 (한국어)

```
첨부한 픽셀 아트 게임 배경 그림을 '같은 장면의 다른 날씨/계절 버전'으로 수정해 주세요.

꼭 지킬 것:
- 크기는 원본과 똑같이 2048×1024 픽셀, 가로 2:1.
- 구도는 1픽셀도 바꾸지 마세요. 수평선 높이, 땅·바위·건물·다리·등대·나무의 위치와 모양이 원본과 정확히 겹쳐야 합니다. 특히 그림 맨 아래 가장자리(땅·방파제·모래·수평선이 끝나는 줄)는 원본과 똑같아야 합니다 — 게임이 그 바로 아래에 바다를 이어 붙입니다.
- 새 물체를 추가하거나 기존 물체를 지우지 말고, 날씨·계절 표현만 덧입혀 주세요.
- 원본과 같은 귀여운 픽셀 아트 스타일, 같은 픽셀 크기, 같은 선 굵기.
- 사람·캐릭터·동물·배를 새로 그리지 마세요.
- 글자, 숫자, 간판 글씨, 로고, 워터마크, 서명 없음. 적십자 모양 없음.
- 위쪽 하늘에는 게임 메뉴가 겹쳐 보이므로 너무 복잡한 무늬는 피해 주세요.
- 결과는 PNG 한 장.
```

## Common prompt (English — 이미지 AI가 영어를 더 잘 알아들을 때)

```
Edit the attached pixel-art game background into a different weather/season version of the SAME scene.

Strict rules:
- Output exactly 2048x1024 px (2:1), same as the original.
- Do NOT change the composition at all: horizon height and the positions and shapes of land, rocks, buildings, bridge, lighthouse and trees must overlap the original pixel-perfectly. The very bottom edge (where land / breakwater / sand / horizon ends) must stay identical — the game attaches its sea directly below it.
- Do not add or remove objects; only repaint weather/season details.
- Keep the same cute pixel-art style, same pixel size and outline thickness.
- No people, characters, animals or boats added.
- No text, numbers, signage lettering, logos, watermarks or signatures. No red cross symbol.
- Game menus overlay the upper sky, so avoid very busy patterns there.
- Output a single PNG.
```

---

## 변형별 한 줄

| 변형 | 파일 끝 | 한국어 | English |
|---|---|---|---|
| 폭풍우 | `_storm` | 폭풍우 버전: 낮게 깔린 짙은 먹구름, 비스듬한 굵은 빗줄기, 먼바다에 높은 파도와 흰 물보라, 바람에 휘어진 나무와 풀, 전체적으로 어둡고 푸른 회색 톤(번개는 그리지 마세요 — 게임이 따로 번쩍임). | Storm version: low dark storm clouds, slanted heavy rain streaks, high waves with white foam on the distant sea, trees and grass bent by wind, overall dark blue-grey mood (no lightning bolt — the game adds flashes itself). |
| 겨울 | `_winter` | 한겨울 버전: 지붕·바위·땅·나뭇가지에 두껍게 쌓인 하얀 눈, 처마 고드름, 물가 가장자리에 얇은 얼음, 잎 없는 나무, 차갑고 맑은 하늘색 톤(눈 내리는 입자는 그리지 마세요 — 게임이 따로 내림). | Deep winter version: thick white snow on roofs, rocks, ground and branches, icicles on eaves, thin ice along the water's edge, leafless trees, cold clear pale-blue mood (no falling snowflakes — the game adds them). |
| 봄 | `_spring` | 봄 버전: 나무를 활짝 핀 분홍 벚꽃나무로, 땅에 연두 새싹과 노란·분홍 들꽃, 따뜻하고 화사한 파스텔 톤(꽃잎 날리는 입자는 그리지 마세요 — 게임이 따로 날림). | Spring version: trees in full pink cherry blossom, fresh light-green sprouts and small yellow/pink wildflowers on the ground, warm bright pastel mood (no flying petals — the game adds them). |

## 낚시터별 한 줄 (원본 파일 · 장면 설명)

| 원본 파일 | 낚시터 | 한국어 설명 | English |
|---|---|---|---|
| `bg_pier.png` | 여수 선착장 | 맨 아래 항구 콘크리트 부두와 가로등, 뒤로 흰 사장교와 초록 언덕·바닷가 마을 | concrete harbor quay with a street lamp at the bottom, white cable-stayed bridge, green hills and a seaside town behind |
| `bg_rock.png` | 돌산 갯바위 | 오른쪽 큰 바위 절벽과 소나무, 가운데 바위 위 작은 정자, 멀리 푸른 산줄기 | big rocky cliff with pine trees on the right, small pavilion on a rock in the middle, distant blue mountain ridges |
| `bg_valley.png` | 푸른 산속 계곡 | 침엽수 숲과 바위 절벽 사이로 떨어지는 큰 폭포, 뒤로 높은 산 | large waterfall falling between conifer forest and rock cliffs, tall mountains behind |
| `bg_light.png` | 등대 방파제 | 테트라포드가 쌓인 방파제와 빨강·흰 줄무늬 등대, 멀리 낮은 산 | breakwater lined with tetrapods and a red-and-white striped lighthouse, low distant mountains |
| `bg_lake.png` | 신비로운 호수 | 호숫가 풀밭, 오른쪽 전통 정자와 나무 데크·큰 버드나무, 뒤로 겹겹 산 | lakeside meadow with a traditional Korean pavilion, wooden deck and a big willow tree on the right, layered mountains behind |
| `bg_sea.png` | 먼바다 낚싯배 | 거의 하늘뿐: 뭉게구름, 맨 아래 수평선에 작은 섬들과 먼 배 한 척 | mostly sky with big cumulus clouds, small islands and one distant ship on the horizon at the bottom |
| `bg_reef.png` | 열대 산호초 | 하얀 모래 해변, 가운데 야자수와 열대 덤불·바위 | white sand beach with palm trees, tropical bushes and rocks in the middle |
| `bg_ice.png` | 얼어붙은 빙하 호수 | 설산과 푸른 빙하 절벽, 눈 덮인 침엽수, 맨 아래 눈 덮인 바위 | snowy mountains with a blue glacier cliff, snow-covered conifers, snowy rocks at the bottom |
| `bg_deep.png` | 깊은 심해 | 짙은 남색 밤하늘, 맨 아래 붉은 노을빛 구름과 수평선의 작은 등대 불빛 | deep navy night sky, reddish dusk clouds near the bottom and a tiny lighthouse light on the horizon |
| `bg_moon.png` | 신비한 달빛 바다 | 은하수와 큰 보름달이 뜬 밤, 오른쪽 신비한 바위산 섬과 왼쪽 수풀 | night with the Milky Way and a big full moon, mystical rocky mountain island on the right, foliage on the left |

### 낚시터별 주의
- **빙하 호수(ice)**: 원래 겨울 장면이라 `_winter`는 "눈이 더 펑펑 쌓인 한겨울", `_spring`은 "얼음이 녹기 시작해 물가에 작은 꽃과 새싹"으로 요청하세요.
- **열대 산호초(reef)**: `_winter`는 눈 대신 "차가운 잿빛 하늘·잔잔한 겨울 바다", `_spring`은 "꽃이 핀 열대 덤불(히비스커스)"로 요청하세요.
- **먼바다(sea)·심해(deep)·달빛 바다(moon)·방파제(light)**: 나무가 거의 없어서 `_spring`/`_winter`는 하늘·바다 색감과 구름, (겨울) 떠다니는 작은 얼음 조각, (봄) 멀리 갈매기 떼 정도만 — 그래도 구도는 그대로.
- **달빛 바다(moon)·심해(deep)**: 밤 장면 그대로 두고(낮으로 바꾸지 말 것) 날씨·계절만.

## 예시 (선착장 폭풍, 원본 bg_pier.png 첨부)
```
[공통 요청문 붙여넣기]
장면: 맨 아래 항구 콘크리트 부두와 가로등, 뒤로 흰 사장교와 초록 언덕·바닷가 마을.
변형: 폭풍우 버전: 낮게 깔린 짙은 먹구름, 비스듬한 굵은 빗줄기, 먼바다에 높은 파도와 흰 물보라, 바람에 휘어진 나무와 풀, 전체적으로 어둡고 푸른 회색 톤(번개는 그리지 마세요).
파일 이름: bg_pier_storm.png
```
