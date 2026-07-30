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
   - 언제 쓰는가
   - 왜 이 구조가 필요한가
   - 누가 사용하는가
   - 기본 운영 순서
   - 장점과 단점
   - 추천 신호
   - 실제 배포 또는 로컬 참조 구현
5. profile을 채택하고 프로젝트 이름/ID를 확인합니다.
6. scaffold command를 복사하거나 `publishing.project.json`을 다운로드합니다.
7. 실제 프로젝트에서 `epk doctor .`로 계약을 검증합니다.

## Profile UI에서 체험하는 것

| Profile | 실제 작성·상호작용 |
|---|---|
| `wiki-web` | 새 글 작성, 제목·본문 직접 수정, 편집 요약과 revision 저장, 특정 문장 proposal, history |
| `manual-portal` | WYSIWYG block 추가·편집, viewer/staff/admin 역할 전환, 계정 초대, private asset staging·검사, 게시 |
| `technical-atlas` | QMD source 수정, reader rebuild, 기술 문단 선택, persistent anchor proposal, Web/PDF/EPUB build proof |
| `local-tutorial` | 예측 메모, parameter 실행, 계산된 지표, 관찰 메모, atomic artifact bundle과 checksum |
| `hybrid-docs` | rich/source round-trip, canonical representation, output adapter on/off, 동일 revision preview receipt |

Studio 안의 저장과 build는 로컬 상태로 동작하는 체험용 vertical slice이며,
profile demo의 작성 내용은 새로고침하면 초기화됩니다.
외부 계정·Git·DB·실제 PDF renderer에는 연결하지 않지만, 사용자가 입력한 값과
revision·proposal·artifact·receipt 상태는 실제로 변합니다. 각 profile의
production 구현은 다음 링크에서 직접 비교합니다.

| Profile | 실제 구현 |
|---|---|
| `wiki-web` | [Bean Wiki](https://bean-wiki.vercel.app) · [source](https://github.com/ycpiglet/bean-wiki) |
| `manual-portal` | [TAG Manual](https://tagmanual.vercel.app) · source는 private |
| `technical-atlas` | [Robotics Math Atlas](https://ycpiglet.github.io/robotics-math-atlas/) · [source](https://github.com/ycpiglet/robotics-math-atlas) |
| `local-tutorial` | 웹 배포 없음. [MCLab source와 설치 안내](https://github.com/ycpiglet/manipulator-control-tutorial) |
| `hybrid-docs` | 별도 production 배포 없음. [Editorial Publishing Kit](https://github.com/ycpiglet/editorial-publishing-kit)이 첫 참조 구현 |

`local-tutorial`에 공개 웹 링크가 없는 것은 누락이 아니라 local-only privacy
boundary입니다. Studio는 이 차이를 `LIVE DEPLOYMENT`, `LOCAL-ONLY
IMPLEMENTATION`, `REFERENCE IMPLEMENTATION`으로 구분합니다.

## OS와 브라우저 지원

Studio는 OS 전용 UI toolkit이나 shell path를 직접 다루지 않습니다. Node.js의
path/http API와 정적 browser code만 사용하므로 Windows, macOS, Linux에서 같은
package와 명령을 사용합니다.

- 필수: Node.js 20 이상, npm, 최신 브라우저
- server: `127.0.0.1` loopback 전용
- 자동 검증: Ubuntu, Windows, macOS에서 `npm run verify`
- 화면 검증: Chromium desktop/mobile viewport
- browser storage, clipboard, Blob download가 차단된 관리형 브라우저에서는
  일부 편의 기능이 제한될 수 있습니다.
- port `4317`이 사용 중이면 `epk studio --port <다른 포트>`를 사용합니다.

따라서 지원 대상 데스크톱 OS 사이에서는 같은 코드 경로를 사용하지만, 오래된
브라우저·Node.js 20 미만·조직 정책·모든 Linux 배포판까지 무조건 보장한다는
의미는 아닙니다.

## 추천 방식

각 답변은 profile별 positive/negative signal을 가집니다. 결과는 선택된 신호를 합산하고 프로젝트 설명의 keyword를 보조 신호로 사용합니다.

- fit score와 1·2순위 margin을 함께 보여줍니다.
- positive signal은 “왜 맞는가”가 됩니다.
- negative signal과 profile 고유 제약은 trade-off가 됩니다.
- 답변이 절반 미만이면 강한 추천으로 표현하지 않습니다.
- 모든 질문을 완료하고 margin이 충분할 때만 `strong` confidence를 사용합니다.

추천은 결정을 자동화하지 않습니다. UI 체험과 운영 경계 확인을 거쳐 사용자가 profile을 채택합니다.

## Local data

인터뷰 답변과 채택 정보는 `epk-profile-studio:v1`이라는 versioned browser
storage 항목에만 저장됩니다. 다섯 profile demo의 체험 데이터는 영속 저장하지
않습니다.

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
