# Security policy

## Supported versions

현재 `0.x` 최신 release만 보안 수정을 받습니다. 아직 alpha이므로 public API가 바뀔 수 있지만 보안 경계 변경에는 migration note를 제공합니다.

## Reporting

공개 Issue에 취약점, credential, private repository content, account 정보, learner data를 올리지 마세요. GitHub repository의 **Security → Report a vulnerability** private reporting을 사용하세요. Private reporting을 사용할 수 없으면 민감한 상세를 제외한 Issue로 maintainer에게 보안 연락 경로를 요청하세요.

다음 정보를 가능한 범위에서 포함하세요.

- 영향을 받는 version/profile/adapter
- 재현 조건과 영향
- credential 또는 개인정보 노출 여부
- 알려진 완화책

## Security boundaries

- application identity, membership, external credential을 분리합니다.
- upload는 public URL을 만들기 전에 staged validation을 통과합니다.
- fork PR 검증에는 deploy credential을 주지 않습니다.
- publish, rollback, quarantine, role 변경은 plan/approval/audit를 요구합니다.
- local-first profile은 명시적 opt-in 없이 데이터를 외부로 보내지 않습니다.
