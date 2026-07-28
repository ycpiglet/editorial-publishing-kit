# ADR-0002: Agent Runtime은 지연 도입하고 automation port를 먼저 고정

- 상태: Accepted
- 날짜: 2026-07-28

## 맥락

`ycpiglet/agent_runtime`은 project overlay, task ownership, multi-worktree orchestration, 검증 gate, compound capture를 제공하는 성숙한 agent workflow template입니다. 반면 이 저장소의 첫 단계는 소수 contract와 profile, generator를 검증하는 일입니다. Runtime template은 수백 개 파일과 광범위한 운영 protocol을 포함하므로 지금 설치하면 제품보다 orchestration이 더 큰 비중을 차지합니다.

## 결정

초기에는 Agent Runtime을 설치하거나 core dependency로 import하지 않습니다.

대신:

- `AutomationPort`를 core 경계로 둡니다.
- `feedback.accepted`, `task.started`, `validation.completed`, `change.merged`, `release.published` event vocabulary를 둡니다.
- manifest의 automation provider 기본값을 `none/deferred`로 둡니다.
- runtime 연결은 별도 adapter package로 구현합니다.
- runtime이 없어도 scaffold, doctor, test, build, release validation의 핵심 경로가 동작해야 합니다.

Agent Runtime에서 즉시 차용하는 운영 원칙은 project overlay, Issue→task traceability, 평가→제안→검증→merge, decision/changelog, repeated request의 executable check 전환입니다.

## 도입 신호

다음 중 둘 이상이 한두 번이 아니라 반복적으로 발생하면 도입 Issue를 엽니다.

1. 세 명 이상의 maintainer/agent가 같은 release를 조율한다.
2. 두 개 이상의 concurrent worktree가 일상적으로 활성화된다.
3. adapter/output release matrix가 독립 ownership과 병렬 검증을 요구한다.
4. 약 20개 이상의 scoped open Issue 또는 multi-wave roadmap을 지속 운영한다.
5. ownership collision, stale task, 반복 요청 누락이 실제 incident나 지연을 만든다.

숫자는 자동 설치 스위치가 아니라 설계 검토를 여는 신호입니다.

## 도입 조건

- tagged Agent Runtime release를 pin한다.
- 현재 package/version 호환성을 검증한다.
- EPK event와 Runtime task/event mapping을 문서화한다.
- 최소 한 release cycle을 opt-in으로 운영한다.
- disable/rollback 경로를 검증한다.
- runtime-managed template과 EPK project template의 소유 경계를 명시한다.

## 결과

지금은 작은 CLI와 contract를 빠르게 검증할 수 있습니다. 규모가 커졌을 때 core를 다시 쓰지 않고 orchestration을 추가할 수 있습니다. 단기적으로 자동 ownership과 multi-agent 효율을 얻지 못하지만, 그 필요가 실제 evidence로 나타날 때 비용을 지불합니다.
