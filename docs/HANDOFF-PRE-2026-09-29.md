# 재개 인수인계 — 2026-09-28 종료 기준

## 기준과 한계

- 분석 기준: **2026-09-28 23:59:59 KST**. 2026-09-29의 작업·수정·대화는 의도적으로 이 문서의 근거에서 제외했다.
- 기준 원격/커밋: `origin/main` (`fe6c6e5`, 2026-07-29). 이 문서는 그 커밋에서 분기한 `codex/handoff-pre-20260929`에만 있다.
- 채팅 원문 transcript는 저장소에 없었다. 따라서 아래 “대화 재구성”은 `AGENTS.md`, README, 커밋 제목과 작업 브랜치에서 확인되는 **요청→결과**만 적은 것이며, 발화의 인용문이 아니다.

## 제품 목표와 완료된 흐름

공통 출판 계약, 프로젝트별 profile/adapter, 생성·검증 CLI와 Codex skill을 제공한다. Bean Wiki·TAG Manual·Robotics Math Atlas·MCLab을 하나의 CMS로 합치지 않고, 공통 의미만 재사용하는 것이 핵심이다.

마지막 통합 결과는 v0.1.0-alpha 기반에 interactive Profile Studio를 추가한 것이다. `agent/interactive-profile-studio`의 마지막 확인 가능 커밋은 `2e3aff7` (2026-07-28)이며, Studio가 프로젝트 프로필을 비교하고 짧은 편집·revision·위치 제안·WYSIWYG·adapter 흐름을 체험하도록 만들었다. 그 뒤 `main`은 credentials/key ignore 보안 수정만 통합했다.

## 중단 지점

- 이 저장소에서 **활성 claim/미완료 작업 카드/세션 포인터는 발견되지 않았다**. 따라서 재개할 특정 구현을 추정하면 안 된다.
- 남아 있는 작업트리는 `agent/interactive-profile-studio`와 `codex/self-hosted-ci-20260729`이다. 전자는 Studio 기능, 후자는 신뢰 Linux 검증을 가리키며, 어느 쪽도 이 기준시점에서 `main`에 추가 통합할 미검증 변경이라는 증거는 없다.
- 다음 작업은 제품 로드맵의 Publishing API/provider adapter를 시작할지, Studio 피드백을 반영할지 소유자가 정한 뒤 새 task로 등록해야 한다.

## 새 세션의 정확한 시작 순서

1. `AGENTS.md`, `docs/ARCHITECTURE.md`, 관련 ADR, `skills/bootstrap-editorial-publishing/`을 읽는다.
2. `git fetch --prune origin` 뒤 `origin/main`과 위 두 브랜치의 merge-base/차이를 검토한다. 기존 작업트리를 재사용하거나 수정하지 않는다.
3. 목적이 정해진 뒤 새 worktree/branch를 만들고, canonical source만 수정한다 (`dist/` 직접 수정 금지).
4. `npm run verify`, Studio 실행, repository-owned skill check를 수행한다.

## 프롬프트·기록 정본

- 공통 작업 프롬프트: `AGENTS.md`
- 제품·현황: `README.md`, `docs/PROFILE_STUDIO.md`
- 계약 소스: `src/contracts.ts`, `src/profiles.ts`, `src/manifest.ts`, `src/scaffold.ts`, `src/interview.ts`, `src/studio-server.ts`
- 확인용 Git trail: `8b089ea` → `41f1f0e` → `2e3aff7` → `fe6c6e5`
