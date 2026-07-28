# Contributing

실사용에서 발견한 불편, 버그, 로컬 customization은 이 프로젝트의 핵심 입력입니다.

## Issue부터 시작하는 경우

- 버그: 재현, 기대/실제 결과, 사용자 영향을 남기세요.
- 개선: 해결책보다 반복되는 문제를 먼저 설명하세요.
- adoption feedback: 생성 기반에서 무엇을 왜 바꿨는지 보여주세요.
- profile/adapter: 실제 대표 프로젝트와 기존 profile이 부족한 이유를 적으세요.
- 보안 취약점: 공개 Issue를 만들지 말고 `SECURITY.md`를 따르세요.

## 개발

```bash
npm install
npm run verify
npm run epk -- recommend "your project purpose"
```

변경 전 관련 Issue와 ADR을 확인하세요. contract나 breaking change라면 먼저 Issue에서 범위와 migration을 합의합니다.

## Pull request

1. 가능하면 `agent/<short-description>` 또는 설명적인 feature branch를 사용합니다.
2. 한 PR은 하나의 명확한 문제를 해결합니다.
3. 왜 기본 profile/contract가 부족했는지 설명합니다.
4. 영향 profile, adapter, version class, migration/rollback을 적습니다.
5. focused test나 conformance fixture를 추가합니다.
6. `npm run verify` 결과를 남깁니다.
7. rendered output을 바꾸면 안정된 조건의 preview/diff를 첨부합니다.

기존 project-specific behavior와 관련 없는 사용자 변경을 보존하세요. 생성 파일을 source of truth처럼 수동 수정하지 말고 canonical template이나 generator를 바꾸세요.

## 코드와 계약 스타일

- 외부 dependency보다 작고 명시적인 contract를 우선합니다.
- manifest에 credential이나 secret을 넣지 않습니다.
- destructive action은 plan/preview/restore 경로를 가집니다.
- backward compatibility가 어렵다면 deprecation과 migration을 먼저 만듭니다.
- 문서 요구가 반복되면 가능한 한 executable check로 바꿉니다.

## Review

Maintainer는 correctness뿐 아니라 owning layer가 맞는지 검토합니다. project overlay로 충분한 차이를 shared contract에 넣거나, 반복되는 adapter 차이를 각 프로젝트에 복사하지 않습니다.
