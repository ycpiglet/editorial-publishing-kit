import type { CapabilityId, ProfileId } from "../../src/contracts.js";

export interface ProfilePresentation {
  readonly shortName: string;
  readonly monogram: string;
  readonly eyebrow: string;
  readonly promise: string;
  readonly scenario: string;
  readonly bestFor: readonly string[];
  readonly accent: string;
  readonly soft: string;
}

export const PROFILE_PRESENTATIONS: Readonly<
  Record<ProfileId, ProfilePresentation>
> = {
  "wiki-web": {
    shortName: "Wiki Web",
    monogram: "WW",
    eyebrow: "공동 지식 · 직접 편집",
    promise: "인증된 기여자가 읽던 자리에서 바로 고치고, Git 이력을 남깁니다.",
    scenario: "제품 지식 위키, 연구 노트, 내부·공개 백과",
    bestFor: ["Rich article", "Direct edit", "Git history"],
    accent: "#14634f",
    soft: "#dcece4",
  },
  "manual-portal": {
    shortName: "Manual Portal",
    monogram: "MP",
    eyebrow: "운영 포털 · 역할 관리",
    promise: "현장 사용자와 관리자가 같은 포털에서 매뉴얼·계정·파일을 운영합니다.",
    scenario: "장비 매뉴얼, 현장 운영 문서, 역할 기반 지식 포털",
    bestFor: ["WYSIWYG", "App accounts", "Private staging"],
    accent: "#b84d2c",
    soft: "#f4dfd5",
  },
  "technical-atlas": {
    shortName: "Technical Atlas",
    monogram: "TA",
    eyebrow: "정밀 교정 · 다중 출력",
    promise: "수학과 코드의 의미를 지키면서 특정 위치에 제안하고 여러 형식으로 출판합니다.",
    scenario: "기술 교재, 수학 아틀라스, Quarto book, 연구 문서",
    bestFor: ["Inline proposal", "Quarto", "PDF · EPUB"],
    accent: "#3559a4",
    soft: "#dfe7f7",
  },
  "local-tutorial": {
    shortName: "Local Tutorial",
    monogram: "LT",
    eyebrow: "Local-first · 불변 산출물",
    promise: "계정이나 클라우드 없이 실행하고, 검증된 결과 묶음을 장치에 안전하게 게시합니다.",
    scenario: "시뮬레이션 실습, 로컬 랩, 개인정보 민감 튜토리얼",
    bestFor: ["No cloud", "Checksums", "Artifact bundle"],
    accent: "#80572b",
    soft: "#eee3d3",
  },
  "hybrid-docs": {
    shortName: "Hybrid Docs",
    monogram: "HD",
    eyebrow: "조합형 · Adapter 기반",
    promise: "웹 편집과 source, 여러 저장소와 출력을 capability 단위로 조합합니다.",
    scenario: "개발자 포털, 제품 문서, 아직 정본이 결정되지 않은 새 프로젝트",
    bestFor: ["Rich + source", "Mixed visibility", "Multiple adapters"],
    accent: "#7350a3",
    soft: "#e9e0f3",
  },
};

export const CAPABILITY_LABELS: Readonly<Record<CapabilityId, string>> = {
  "account:manage": "계정 관리",
  "asset:download": "다운로드",
  "asset:upload": "업로드",
  "content:direct-edit": "직접 수정",
  "content:draft": "초안",
  "content:history": "Revision",
  "editor:source": "Source 편집",
  "editor:wysiwyg": "WYSIWYG",
  "publication:preview": "미리보기",
  "publication:release": "게시",
  "resource:manage": "리소스",
  "suggestion:inline": "위치 제안",
};

export const COMPARISON_CAPABILITIES = [
  "editor:wysiwyg",
  "editor:source",
  "content:direct-edit",
  "suggestion:inline",
  "account:manage",
  "asset:upload",
  "resource:manage",
  "publication:release",
] as const satisfies readonly CapabilityId[];
