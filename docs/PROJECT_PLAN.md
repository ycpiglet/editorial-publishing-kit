# 프로젝트 계획

## 목표

새 프로젝트마다 계정, 편집, 제안, 파일, 리소스, 게시 기능을 다시 설계하지 않게 한다. 프로젝트 목적을 설명하면 가장 가까운 profile을 추천하고, 동일한 계약·템플릿·검증·skill을 제공한다. 현장에서 수정한 이유는 Issue/PR과 실행 가능한 회귀 검사로 회수한다.

## 성공 지표

초기부터 다음 지표를 기록하되 숫자 자체보다 마찰의 원인을 찾는 데 사용한다.

- 새 저장소에서 유효한 manifest와 기여 기반을 만드는 데 걸리는 시간
- 생성 직후 project overlay의 수와 이유가 기록되지 않은 drift 수
- profile별 반복 customization과 upstream 전환 비율
- Issue 접수부터 재현/분류/결정까지의 시간
- adapter conformance 실패와 배포 후 회귀
- deprecated contract 사용량과 migration 완료율

## 작업 원칙

1. 새 CMS 전체를 먼저 만들지 않고 하나의 검증 가능한 vertical slice를 완성한다.
2. contract는 공유하되 DB, storage, credential, canonical source는 프로젝트별로 격리한다.
3. UI와 agent는 궁극적으로 같은 API와 policy boundary를 지난다.
4. local customization은 허용하되 checksum, 결정 기록, Issue/PR로 이유를 보존한다.
5. repeated request는 문서 조항만 추가하지 않고 가능한 한 fixture나 검사로 바꾼다.

## 단계

### Phase 0 — Foundation (`v0.1-alpha`, 현재)

산출물:

- document, revision, suggestion, account, asset, resource, publication TypeScript 계약
- 다섯 profile과 목적 기반 추천
- 여덟 축 interview, 추천 근거·trade-off, profile별 hands-on authoring UI,
  사용 시점·대상·장단점 가이드와 실제 참조 구현 링크
- manifest 다운로드와 `epk studio` local adoption flow
- `publishing.project.json` schema
- 충돌 없는 scaffold와 managed-file drift 검사
- GitHub Issue forms, PR evidence template, governance/ADR
- 재사용 가능한 `bootstrap-editorial-publishing` Codex skill
- Agent Runtime 비종속 automation port

완료 기준:

- `npm run verify`가 깨끗하게 통과한다.
- 다섯 profile이 유효한 manifest를 생성한다.
- 같은 target에 재실행해 기존 파일을 덮어쓰지 않는다.
- 로컬 customization을 contract 오류와 구분해 탐지한다.
- 사용자가 계정이나 cloud 없이 interview → profile 비교 → 글 작성·저장·
  제안·게시 체험 → 실제 구현 확인 → manifest 채택을 완료한다.
- Ubuntu, Windows, macOS에서 같은 verify workflow가 통과한다.

### Phase 1 — Adapter SDK와 conformance (`v0.2`)

산출물:

- Content, Identity, Asset, Resource, Renderer, Publisher adapter interface
- adapter fixture kit와 reference in-memory adapter
- revision conflict, idempotency, rollback, credential isolation 검사
- template update plan/diff/apply와 3-way merge 정책

완료 기준:

- adapter가 공통 revision/diff/audit 결과를 반환한다.
- untrusted test가 production credential 없이 실행된다.
- template upgrade가 로컬 수정 파일을 자동 overwrite하지 않는다.

### Phase 2 — Manual Portal vertical slice (`v0.3`)

첫 pilot은 Tag Manual 계열입니다.

산출물:

- TipTap/ProseMirror shared schema와 persistent block UUID
- draft, append-only revision, optimistic conflict
- selection 기반 suggestion 생성/검토/반영
- application account와 capability policy
- private upload staging, metadata, attach, quarantine/restore
- preview/diff와 web publication verification

완료 기준:

- 한 문서를 WYSIWYG으로 편집하고 같은 UI에서 특정 위치 suggestion을 처리한다.
- current document, revision, suggestion, asset ref, audit/outbox가 하나의 transaction 경계를 가진다.
- 동일 workflow가 향후 MCP tool contract로 표현 가능하다.

### Phase 3 — 기존 프로젝트 adapter (`v0.4`)

순서:

1. Bean Wiki: `GitHtmlAdapter`, direct commit/PR fallback, atomic tree update
2. Robotics Math Atlas: `QuartoQmdAdapter`, source span, protected semantic node, Pages publisher
3. Manipulator Control Tutorial: `LocalArtifactAdapter`, privacy opt-in, atomic publication/cleanup

각 adapter는 실제 프로젝트를 바꾸기 전에 golden corpus와 representative vertical slice로 검증합니다.

### Phase 4 — MCP와 선택적 Agent Runtime (`v0.5`)

산출물:

- read-only inspect/list/diff/status MCP resources/tools
- plan/preview가 선행되는 update/publish/quarantine/role tools
- `AutomationPort` → Agent Runtime event adapter
- task ownership, repeated-request capture, multi-worktree verification

진입 조건:

- [ADR-0002](adr/0002-defer-agent-runtime.md)의 도입 신호가 실제로 충족되고,
- tagged Agent Runtime release를 pin할 수 있으며,
- runtime이 없어도 local CLI/CI가 계속 동작한다.

### Phase 5 — Stable (`v1.0`)

완료 기준:

- 두 종류 이상의 canonical store와 publisher가 같은 conformance suite를 통과한다.
- profile/contract의 SemVer와 deprecation window가 운영된다.
- template migration과 rollback이 실사용 프로젝트에서 검증된다.
- 편집, suggestion, asset, account, publication 보안 경계가 위협 모델과 함께 검증된다.
- 최소 두 개 실제 프로젝트의 adoption feedback이 다음 릴리스에 반영된다.

## 첫 번째 구현 우선순위

1. Template update/merge와 conformance harness
2. Manual Portal in-memory vertical slice
3. shared editor/suggestion anchor contract
4. upload staging 및 Asset/Resource lifecycle
5. Git/Quarto/local reference adapters
6. MCP server
7. Agent Runtime adapter

Agent Runtime은 일곱 번째이지만 automation port와 event vocabulary는 첫 버전부터 고정합니다. 이 순서라면 runtime 도입 시 제품 core를 다시 쓰지 않습니다.
