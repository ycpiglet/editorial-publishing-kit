# ADR-0001: 하나의 CMS 대신 composable publishing kit

- 상태: Accepted
- 날짜: 2026-07-28

## 맥락

Bean Wiki, Tag Manual, Robotics Math Atlas, Manipulator Control Tutorial은 지속적으로 콘텐츠나 산출물을 수정·게시하지만 canonical source, 계정, editor, review, storage, output이 다릅니다. 매번 독립 구현하면 계정·revision·asset·publish 안전 규칙이 달라지고, 하나의 CMS로 강제하면 Quarto semantics와 local privacy 같은 고유 요구를 잃습니다.

## 결정

다음을 공통화합니다.

- domain contract와 lifecycle
- project manifest와 profile
- adapter port와 conformance
- template, CLI, skill, 향후 MCP
- feedback와 migration governance

다음을 프로젝트별로 격리합니다.

- DB/storage/repository/credential
- canonical content representation
- deployment target
- visibility, tenant, privacy policy

## 결과

새 프로젝트는 목적에 가까운 profile에서 시작하고 overlay로 차이를 표현합니다. 기존 프로젝트는 저장 방식을 바꾸지 않고 adapter로 참여할 수 있습니다. 공통 contract를 설계하고 conformance를 유지하는 비용은 생기지만, 반복 구현과 무분별한 fork보다 추적 가능하고 점진적입니다.

## 기각한 대안

- 모든 프로젝트를 하나의 multi-tenant CMS/DB로 이동
- skill만 공유하고 agent가 각 Git/DB/storage를 직접 수정
- HTML 또는 Markdown 하나를 모든 canonical format으로 강제
- template 복사 후 중앙 upgrade/migration 없이 각자 유지
