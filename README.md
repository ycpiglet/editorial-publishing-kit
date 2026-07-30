# Editorial Publishing Kit

한 번 만든 출판 기반을 여러 프로젝트에서 같은 방식으로 재사용하고, 현장에서 생긴 수정 이유를 다시 공통 자산으로 돌려보내는 프로젝트입니다.

이 저장소는 모든 프로젝트를 하나의 CMS나 데이터베이스로 합치지 않습니다. 대신 문서·revision·제안·계정 권한·업로드/다운로드·자산·리소스·게시의 **공통 계약**, 프로젝트 목적별 **프로필**, 외부 시스템별 **adapter**, 생성/검증 **CLI**, 그리고 Codex **skill**을 함께 버전 관리합니다.

> 상태: `v0.1.0-alpha`. Profile Studio, 프로젝트 생성과 계약 검증 기반은 동작하지만 실제 본문을 편집·게시하는 Publishing API와 provider adapter는 로드맵 단계입니다.

## 빠른 시작

```bash
npm install
npm run verify

# 로컬 인터뷰·비교·채택 UI
npm run studio

# 목적에 맞는 프로필 추천
npm run epk -- recommend "계정과 권한이 있는 WYSIWYG 장비 매뉴얼"

# 새 프로젝트 기반 생성
npm run epk -- init ../new-manual \
  --name "New Manual" \
  --profile manual-portal

# 생성 결과와 로컬 변경 확인
npm run epk -- doctor ../new-manual
```

생성기는 기존 파일을 덮어쓰지 않습니다. `.epk/state.json`에는 생성 당시 파일 checksum이 기록되며, `doctor`는 계약 오류와 의도적인 로컬 수정을 구분해 보여줍니다.

패키지 설치 후에는 `epk studio`로 같은 UI를 실행합니다. 인터뷰 답변과 채택 상태는 해당 브라우저의 versioned local storage에만 남고 원격으로 전송되지 않습니다. 자세한 흐름은 [Profile Studio 사용법](docs/PROFILE_STUDIO.md)을 참고하세요.

Studio의 각 profile에는 언제·왜·누가 사용하는지, 기본 사용법, 장점·단점과
추천 신호가 함께 표시됩니다. 사용자는 짧은 글을 직접 작성하고 revision 저장,
위치 제안, WYSIWYG block, source rebuild, local artifact, output adapter 흐름을
체험한 뒤 실제 Bean Wiki, TAG Manual, Robotics Math Atlas 배포와 MCLab 로컬
구현을 열어 비교할 수 있습니다.

Studio build와 test는 Ubuntu, Windows, macOS CI에서 같은 명령으로 검증합니다.
실행에는 Node.js 20 이상과 최신 데스크톱 브라우저가 필요합니다.

## 프로필

| 프로필 | 기준 프로젝트 | 적합한 용도 |
|---|---|---|
| `wiki-web` | Bean Wiki | 인증 사용자의 rich article 직접 편집, Git 기반 이력 |
| `manual-portal` | Tag Manual | WYSIWYG, 계정/권한, 업로드와 운영 리소스가 있는 포털 |
| `technical-atlas` | Robotics Math Atlas | 위치 기반 교정 제안, Quarto, web/PDF/EPUB |
| `local-tutorial` | Manipulator Control Tutorial | 로컬 문서와 불변 artifact bundle, opt-in 외부 전송 |
| `hybrid-docs` | 네 프로젝트의 공통 기반 | 새 문서 프로젝트의 균형 잡힌 기본값 |

프로필은 완성 애플리케이션이 아니라 시작점입니다. 프로젝트별 차이는 `publishing.project.json` overlay로 남기고, 같은 차이가 반복되면 profile이나 adapter로 승격합니다.

## 공유하는 것과 격리하는 것

공유합니다:

- domain schema와 lifecycle
- WYSIWYG/source editor capability와 persistent block ID
- 특정 위치 suggestion anchor와 review 상태
- identity, membership, external credential의 분리
- private staging → 검사 → attach의 upload pipeline
- Asset와 Resource의 구분, 버전과 관계
- save와 publish의 분리, preview/diff/verify
- project profile, template, conformance test, skill

프로젝트별로 격리합니다:

- 물리 DB, bucket, Git repository와 credential
- canonical content representation
- 공개/비공개 및 개인정보 정책
- renderer와 배포 target
- 로컬 learner artifact의 외부 전송 여부

## 피드백이 제품으로 돌아오는 방식

Issue 양식은 재현뿐 아니라 사용자 영향과 로컬 변경 이유를 받습니다. PR은 영향을 받는 profile/adapter, 호환성, migration, 검증 증거를 요구합니다.

```text
현장 불편/버그/로컬 수정
  → Issue로 맥락과 이유 수집
  → project overlay / profile / adapter / contract로 분류
  → fixture와 회귀 검사
  → PR·검토·릴리스
  → template update 또는 migration
```

자세한 절차는 [CONTRIBUTING.md](CONTRIBUTING.md)와 [기여 피드백 루프](docs/CONTRIBUTION_LOOP.md)를 참고하세요.

## Agent Runtime

지금은 Agent Runtime을 필수 종속성으로 넣지 않습니다. 작은 초기 저장소에 전체 orchestration을 적용하면 템플릿과 운영 표면이 실제 제품보다 커지기 때문입니다.

대신 core가 `AutomationPort`와 안정적인 event contract만 소유합니다. 동시 worktree, 다중 agent/maintainer, adapter release matrix가 실제로 증가하면 별도 adapter로 Agent Runtime을 연결합니다. 결정과 정량적 도입 기준은 [ADR-0002](docs/adr/0002-defer-agent-runtime.md)에 기록했습니다.

## 문서

- [프로젝트 계획](docs/PROJECT_PLAN.md)
- [아키텍처](docs/ARCHITECTURE.md)
- [Profile Studio 사용법](docs/PROFILE_STUDIO.md)
- [거버넌스](docs/GOVERNANCE.md)
- [4개 프로젝트 기준선](docs/research/FOUR_PROJECT_BASELINE.md)
- [공통 kit 결정](docs/adr/0001-composable-kit-not-one-cms.md)

## 라이선스

Apache-2.0. 기여 전 [보안 정책](SECURITY.md)과 [행동 강령](CODE_OF_CONDUCT.md)을 확인하세요.

---

Editorial Publishing Kit is a profile-driven, adapter-based foundation for consistent editorial workflows across web, Git, Quarto, and local-first documentation projects.
