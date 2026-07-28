# 네 프로젝트 기준선

조사일: 2026-07-28

| 프로젝트 | 조사 기준 | 가져올 강점 | 공통 kit에서 보완할 점 |
|---|---|---|---|
| [Bean Wiki](https://github.com/ycpiglet/bean-wiki/tree/d4ce9a95fa2059a449a1f2a8b246cc78d95d1d84) | `d4ce9a9` | TipTap rich editor, authenticated direct Git edit, PR fallback, history/restore | persistent block ID, atomic related-file update, draft/conflict conformance, asset lifecycle |
| `ycpiglet/tag_manual` (private baseline) | `b720029` | WYSIWYG manual blocks, application accounts/roles, DB/Storage workflow | append-only revision consistency, XSS/input boundary, private staging, delete/restore lifecycle |
| [Robotics Math Atlas](https://github.com/ycpiglet/robotics-math-atlas/tree/48dae1a8e5be52a854279e9e52287545d70bb6f1) | `48dae1a` | exact-location proposal, one-proposal/one-commit provenance, web/PDF/EPUB, trusted deploy | content-independent anchor, complete suggestion lifecycle, proposer provenance, safe structured editing |
| [Manipulator Control Tutorial](https://github.com/ycpiglet/manipulator-control-tutorial/tree/2c61600274668a0b34097cdd6f7c72f4e2153b0a) | `2c61600` | pinned resource install, checksum, atomic local publication, cleanup/recovery, local privacy | treat output as ArtifactBundle, optional adapter contract; do not force web account/CMS behavior |

## 공통 결론

공통점은 같은 UI가 아니라 **지속적으로 수정되는 source와 검증된 publication boundary**입니다.

- Bean의 직접 편집은 `content:direct-edit` capability가 됩니다.
- Tag의 WYSIWYG는 shared editor profile의 기준이 됩니다.
- Atlas의 위치 제안은 shared suggestion anchor가 됩니다.
- Manipulator의 atomic local artifact와 privacy는 local publisher의 기준이 됩니다.

물리 storage를 통일하지 않고, 같은 revision·proposal·asset·resource·publication 결과를 adapter가 반환하도록 합니다.

## 최초 migration slice

첫 실험은 Manual Portal 문서 하나입니다.

1. shared ProseMirror schema로 연다.
2. revision conflict와 draft를 지원한다.
3. 선택 영역 proposal을 생성하고 reviewer가 반영한다.
4. asset을 private staging에서 검사 후 attach한다.
5. preview/diff를 만든다.
6. revision, suggestion, asset ref, audit/outbox를 transaction으로 저장한다.
7. reader HTML을 게시하고 live revision을 검증한다.

이 slice가 통과한 뒤 Git HTML, Quarto, local artifact adapter를 붙입니다.
