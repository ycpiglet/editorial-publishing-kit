# 거버넌스

## 역할

- Maintainer: contract/profile lifecycle, release, security response, 최종 merge를 책임집니다.
- Adapter owner: 특정 integration의 conformance, migration, credential boundary를 책임집니다.
- Contributor: Issue, reproduction, fixture, 문서, 코드, review로 참여합니다.
- Adopter: 실제 프로젝트의 마찰과 customization 이유를 제공하는 핵심 contributor입니다.

현재 초기 maintainer는 `@ycpiglet`입니다. 기여가 지속되면 영역별 owner를 `CODEOWNERS`와 이 문서에 추가합니다.

## 의사결정

- 작고 호환되는 구현은 linked Issue와 PR에서 결정합니다.
- contract, profile, privacy/security boundary, breaking change는 ADR이 필요합니다.
- ADR은 맥락, 결정, 대안, 결과, migration/rollback을 포함합니다.
- 결정은 영구적 진리가 아니라 당시 증거에 기반한 versioned 선택입니다.

## Lifecycle

공유 contract, profile, adapter는 다음 상태를 가집니다.

```text
experimental → stable → deprecated → removed
```

- Experimental: API가 바뀔 수 있으며 production adoption evidence를 수집합니다.
- Stable: conformance와 migration 정책이 있고 SemVer 보장을 받습니다.
- Deprecated: replacement, 사용량, 종료 조건, 제거 release가 명시됩니다.
- Removed: 약속한 window와 migration 완료 후에만 제거합니다.

## Release와 호환성

- patch: 호환되는 bug/documentation/template fix
- minor: additive capability/profile/adapter
- major: 기존 manifest, contract, generated project를 깨는 변경

alpha 기간에도 breaking change를 changelog와 migration note 없이 넣지 않습니다. 생성 template과 실제 adopter repository는 별개이므로 update가 로컬 변경을 덮어쓰지 않아야 합니다.

## Merge 기준

- linked problem 또는 명확한 maintenance rationale
- 필요한 test/fixture
- profile/adapter/contract 영향 분류
- migration과 rollback 검토
- 공개 기여에서 secret이나 private data가 없음
- CI 통과와 reviewer 승인

Maintainer도 자신의 중요한 contract/breaking change에는 동일한 evidence를 남깁니다.

## Runtime 운영

Agent Runtime은 별도 automation adapter입니다. runtime owner가 생겨도 domain owner 권한을 대신하지 않습니다. runtime 장애가 local build, test, scaffold, doctor를 막아서는 안 됩니다.
