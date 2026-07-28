# Profile Studio

Profile Studio는 새 프로젝트를 만들기 전에 운영 방식을 인터뷰하고, 추천 profile의 실제 상호작용을 체험한 뒤 실행 가능한 manifest를 채택하는 local-only 웹 UI입니다.

## 실행

저장소에서:

```bash
npm install
npm run studio
```

배포된 npm package에서는:

```bash
epk studio
epk studio --port 4400
```

기본 주소는 `http://127.0.0.1:4317`입니다. loopback interface만 사용하며 계정, 분석 도구, 원격 API가 없습니다.

## 흐름

1. 프로젝트 이름과 목적을 한 문장으로 적습니다.
2. 여덟 축에 답합니다.
   - 프로젝트 형태
   - canonical source
   - 편집 경험
   - direct edit와 proposal
   - identity와 membership
   - upload/asset workflow
   - publication outputs
   - privacy/tenant boundary
3. profile ranking, fit score, 답변에서 나온 근거와 trade-off를 확인합니다.
4. capability matrix와 다섯 interactive UI를 비교합니다.
5. profile을 채택하고 프로젝트 이름/ID를 확인합니다.
6. scaffold command를 복사하거나 `publishing.project.json`을 다운로드합니다.
7. 실제 프로젝트에서 `epk doctor .`로 계약을 검증합니다.

## Profile UI에서 체험하는 것

| Profile | 상호작용 |
|---|---|
| `wiki-web` | 읽기, WYSIWYG direct edit, 특정 위치 proposal, revision history |
| `manual-portal` | WYSIWYG block editor, 역할 전환, private asset staging과 검사 |
| `technical-atlas` | 기술 문단 선택, persistent anchor evidence, inline proposal, PDF/EPUB |
| `local-tutorial` | 로컬 parameter 실행, atomic artifact bundle과 checksum, no-cloud boundary |
| `hybrid-docs` | rich/source 전환, canonical representation, output adapter on/off |

이 UI는 실제 provider에 연결된 production editor가 아니라 profile contract의 대표 vertical slice입니다. 채택 후 실제 adapter와 Publishing API가 각 동작을 구현합니다.

## 추천 방식

각 답변은 profile별 positive/negative signal을 가집니다. 결과는 선택된 신호를 합산하고 프로젝트 설명의 keyword를 보조 신호로 사용합니다.

- fit score와 1·2순위 margin을 함께 보여줍니다.
- positive signal은 “왜 맞는가”가 됩니다.
- negative signal과 profile 고유 제약은 trade-off가 됩니다.
- 답변이 절반 미만이면 강한 추천으로 표현하지 않습니다.
- 모든 질문을 완료하고 margin이 충분할 때만 `strong` confidence를 사용합니다.

추천은 결정을 자동화하지 않습니다. UI 체험과 운영 경계 확인을 거쳐 사용자가 profile을 채택합니다.

## Local data

입력 내용은 `epk-profile-studio:v1`이라는 versioned browser storage 항목에만 저장됩니다.

- `초기화`로 즉시 지울 수 있습니다.
- server는 정적 파일만 제공하고 입력을 받는 API가 없습니다.
- cloud, telemetry, account, cookie가 없습니다.
- 다운로드는 브라우저가 메모리에서 manifest file을 만듭니다.

## 개발 검증

```bash
npm run verify
npm run studio
```

변경 시 interview scoring unit test, Studio typecheck/build, local server security header, browser 주요 흐름을 함께 검증합니다.
