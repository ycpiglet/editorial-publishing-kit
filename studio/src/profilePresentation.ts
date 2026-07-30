import type { CapabilityId, ProfileId } from "../../src/contracts.js";

export interface ProfileWorkflowStep {
  readonly title: string;
  readonly description: string;
}

export interface ProfileReference {
  readonly name: string;
  readonly type: "live" | "local" | "reference";
  readonly description: string;
  readonly primaryUrl: string;
  readonly primaryLabel: string;
  readonly sourceUrl?: string;
  readonly sourceLabel?: string;
}

export interface ProfilePresentation {
  readonly shortName: string;
  readonly monogram: string;
  readonly eyebrow: string;
  readonly promise: string;
  readonly scenario: string;
  readonly bestFor: readonly string[];
  readonly when: string;
  readonly why: string;
  readonly who: string;
  readonly workflow: readonly ProfileWorkflowStep[];
  readonly strengths: readonly string[];
  readonly tradeoffs: readonly string[];
  readonly recommendationSignals: readonly string[];
  readonly mission: string;
  readonly missionSteps: readonly string[];
  readonly reference: ProfileReference;
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
    when:
      "문서가 한 번 완성되는 납품물이 아니라 여러 사람이 계속 고쳐야 하는 살아 있는 지식일 때 적합합니다.",
    why:
      "읽기와 편집 사이의 이동을 줄이면서 모든 변경을 revision과 작성자에 연결해, 잘못된 수정도 비교하고 되돌릴 수 있습니다.",
    who:
      "제품 전문가, 연구원, 문서 운영자와 공개 기여자가 같은 지식 본문을 함께 관리하는 팀에 맞습니다.",
    workflow: [
      {
        title: "읽고 발견",
        description: "독자가 문맥 안에서 오류나 빠진 설명을 발견합니다.",
      },
      {
        title: "직접 수정 또는 제안",
        description: "권한이 있으면 바로 저장하고, 없으면 같은 위치에 제안합니다.",
      },
      {
        title: "Diff와 이력",
        description: "편집 요약, 작성자, 이전 revision을 비교하고 검토합니다.",
      },
      {
        title: "자동 게시",
        description: "승인된 정본이 reader에 반영되고 검색·링크가 다시 만들어집니다.",
      },
    ],
    strengths: [
      "읽던 화면에서 수정해 기여 진입 장벽이 낮습니다.",
      "누가 무엇을 왜 바꿨는지 revision으로 추적하고 복원할 수 있습니다.",
      "공개 reader와 Git 기반 검토 흐름을 한 콘텐츠 모델에 연결하기 쉽습니다.",
    ],
    tradeoffs: [
      "직접 게시에는 로그인과 Git 권한 정책을 정확히 설계해야 합니다.",
      "계정·대용량 자산·동시 편집이 커지면 별도 서비스와 저장소가 필요합니다.",
      "문서 구조를 자유 HTML로 열어두면 round-trip과 보안 검증 비용이 커집니다.",
    ],
    recommendationSignals: [
      "인증 사용자가 본문을 직접 고쳐야 한다.",
      "권한이 없는 기여자에게 PR형 제안 경로도 필요하다.",
      "문서 이력과 복원을 Git revision으로 설명할 수 있다.",
    ],
    mission:
      "짧은 커피 지식 글을 고쳐 새 revision으로 저장하고, 별도의 문장 개선 제안도 남겨보세요.",
    missionSteps: [
      "직접 수정에서 제목과 본문을 바꿉니다.",
      "편집 요약을 적고 revision을 저장합니다.",
      "제안 모드에서 특정 문장에 개선 의견을 등록합니다.",
      "읽기 화면과 history에서 두 결과의 차이를 확인합니다.",
    ],
    reference: {
      name: "Bean Wiki",
      type: "live",
      description:
        "공개 커피 백과 reader, TipTap 편집기, GitHub 직접 commit/PR fallback과 revision history를 사용하는 실제 Wiki Web 구현입니다.",
      primaryUrl: "https://bean-wiki.vercel.app",
      primaryLabel: "라이브 위키 열기",
      sourceUrl: "https://github.com/ycpiglet/bean-wiki",
      sourceLabel: "공개 소스",
    },
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
    when:
      "현장 매뉴얼이 계정, 장비, 담당자, 점검 사진과 함께 운영되어야 하고 역할마다 할 수 있는 일이 다를 때 적합합니다.",
    why:
      "비기술 사용자는 WYSIWYG로 작성하고, 시스템은 본문·권한·자산을 하나의 운영 경계에서 검증할 수 있습니다.",
    who:
      "현장 작업자, 매뉴얼 작성자, 안전 검토자와 계정·리소스를 책임지는 운영 관리자에게 맞습니다.",
    workflow: [
      {
        title: "로그인과 범위 선택",
        description: "사용자 identity와 현장 membership으로 보이는 자료를 정합니다.",
      },
      {
        title: "Block 작성",
        description: "제목·절차·경고·체크리스트를 보이는 모양 그대로 편집합니다.",
      },
      {
        title: "자산 staging",
        description: "사진과 PDF를 비공개로 올려 형식·메타데이터·안전을 검사합니다.",
      },
      {
        title: "검토와 게시",
        description: "역할별 승인 후 정해진 독자와 현장에 revision을 공개합니다.",
      },
    ],
    strengths: [
      "Git을 모르는 현장 사용자도 보이는 화면 그대로 작성할 수 있습니다.",
      "계정·역할·문서·파일·운영 리소스를 한 포털에서 관리할 수 있습니다.",
      "업로드를 곧바로 공개하지 않고 private staging과 정책 검사를 거칩니다.",
    ],
    tradeoffs: [
      "인증, 데이터베이스, object storage, 백업과 감사 로그 운영이 필요합니다.",
      "역할이 많아질수록 권한 조합과 tenant 격리 테스트가 복잡해집니다.",
      "수학·코드처럼 source 의미가 중요한 문서를 일반 WYSIWYG 정본으로 강제하면 손실이 생깁니다.",
    ],
    recommendationSignals: [
      "현장 사용자에게 Git 없는 WYSIWYG 작성 경험이 필요하다.",
      "관리자가 사용자 초대와 역할을 직접 운영해야 한다.",
      "점검 사진·PDF를 검사한 뒤 제한적으로 공개해야 한다.",
    ],
    mission:
      "점검 절차를 WYSIWYG block으로 작성하고, 역할과 파일 상태에 따라 게시 가능 여부가 어떻게 달라지는지 확인하세요.",
    missionSteps: [
      "작성자 역할에서 절차 제목과 본문을 수정합니다.",
      "경고 또는 체크리스트 block을 추가합니다.",
      "점검 사진을 private staging에서 검사 완료 상태로 보냅니다.",
      "관리자 역할로 전환해 게시 계획을 확정합니다.",
    ],
    reference: {
      name: "TAG Manual",
      type: "live",
      description:
        "Supabase 계정, 현장 선택, 운영 매뉴얼, 관리자 CRUD와 로봇 리소스를 결합한 실제 Manual Portal입니다. 내부 콘텐츠는 로그인 후 확인합니다.",
      primaryUrl: "https://tagmanual.vercel.app",
      primaryLabel: "라이브 포털 열기",
      sourceUrl: "https://github.com/ycpiglet/tag_manual",
      sourceLabel: "비공개 소스",
    },
    accent: "#a43c21",
    soft: "#f4dfd5",
  },
  "technical-atlas": {
    shortName: "Technical Atlas",
    monogram: "TA",
    eyebrow: "정밀 교정 · 다중 출력",
    promise: "수학과 코드의 의미를 지키면서 특정 위치에 제안하고 여러 형식으로 출판합니다.",
    scenario: "기술 교재, 수학 아틀라스, Quarto book, 연구 문서",
    bestFor: ["Inline proposal", "Quarto", "PDF · EPUB"],
    when:
      "수식·코드·인용과 개념 링크가 정본의 일부이고, 같은 원고에서 웹·PDF·EPUB을 만들어야 할 때 적합합니다.",
    why:
      "source를 정본으로 유지해 기술 의미를 보존하고, 독자는 렌더링된 문장을 선택해 정확한 위치에 교정을 제안할 수 있습니다.",
    who:
      "기술 저자, 수학·로봇공학 전문가, 교정자와 여러 형식의 교재를 운영하는 출판 팀에 맞습니다.",
    workflow: [
      {
        title: "Source 저작",
        description: "QMD/Markdown에 수식, 코드, 인용과 구조화 메타데이터를 기록합니다.",
      },
      {
        title: "리뷰 build",
        description: "정본 revision으로 독자가 확인할 웹 preview를 만듭니다.",
      },
      {
        title: "위치 제안",
        description: "선택 인용문·앞뒤 문맥·문단 anchor를 함께 남깁니다.",
      },
      {
        title: "다중 출력",
        description: "검증된 같은 revision에서 Web, PDF, EPUB을 생성합니다.",
      },
    ],
    strengths: [
      "수식·코드·인용의 의미와 diff가 source에 그대로 남습니다.",
      "텍스트 인용과 안정 anchor로 리플로우 문서의 제안 위치를 복원할 수 있습니다.",
      "하나의 검증된 revision에서 웹·책·증명권 등 여러 산출물을 만들 수 있습니다.",
    ],
    tradeoffs: [
      "저자는 Quarto/Markdown과 build toolchain을 배워야 합니다.",
      "완전한 WYSIWYG보다 semantic fidelity와 preview 검증을 우선합니다.",
      "PDF·EPUB의 pagination과 reflow는 웹과 별도의 시각 검수가 필요합니다.",
    ],
    recommendationSignals: [
      "수학·코드·인용을 손실 없이 round-trip해야 한다.",
      "독자가 렌더링된 특정 문장에 교정 제안을 남겨야 한다.",
      "동일 원고로 Web·PDF·EPUB을 검증해 배포해야 한다.",
    ],
    mission:
      "짧은 기술 원고를 source에서 수정하고, 렌더링된 문단에 교정 제안을 남긴 뒤 세 출력의 build proof를 만들어보세요.",
    missionSteps: [
      "Source 편집을 열어 제목과 본문을 바꿉니다.",
      "Reader preview에서 교정할 문단을 선택합니다.",
      "대체 문장을 적어 anchor와 함께 제안합니다.",
      "Web·PDF·EPUB build를 실행하고 같은 revision인지 확인합니다.",
    ],
    reference: {
      name: "Robotics Math Atlas",
      type: "live",
      description:
        "개념 그래프 reader, 안정 문단 anchor, 리뷰 제안과 동일 QMD 원고의 HTML·PDF·EPUB 출판을 사용하는 실제 Technical Atlas입니다.",
      primaryUrl: "https://ycpiglet.github.io/robotics-math-atlas/",
      primaryLabel: "라이브 아틀라스 열기",
      sourceUrl: "https://github.com/ycpiglet/robotics-math-atlas",
      sourceLabel: "공개 소스",
    },
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
    when:
      "실습 데이터가 장치를 떠나면 안 되거나, 실행 결과를 다시 재생·비교할 수 있는 증거 묶음으로 남겨야 할 때 적합합니다.",
    why:
      "계정과 서버를 없애 개인정보 경계를 단순화하고, 실행 설정·로그·보고서·checksum을 한 불변 run으로 묶어 재현성을 높입니다.",
    who:
      "학생, 교육자, 시뮬레이션 연구자와 민감한 실험을 로컬에서 반복하는 엔지니어에게 맞습니다.",
    workflow: [
      {
        title: "예측 기록",
        description: "실행 전에 바꿀 변수와 예상 결과를 짧게 적습니다.",
      },
      {
        title: "로컬 실행",
        description: "pinned runtime에서 설정값과 seed를 고정해 계산합니다.",
      },
      {
        title: "관찰과 비교",
        description: "그래프·요약값을 보고 예측과 실제 차이를 기록합니다.",
      },
      {
        title: "불변 게시",
        description: "config, log, report, note와 manifest를 새 run 폴더에 원자적으로 저장합니다.",
      },
    ],
    strengths: [
      "계정·클라우드 없이 민감한 데이터와 학습 기록을 장치 안에 둡니다.",
      "실행마다 확정 설정과 checksum이 남아 결과를 재생하고 비교하기 쉽습니다.",
      "네트워크 장애와 중앙 서비스 상태에 학습 흐름이 의존하지 않습니다.",
    ],
    tradeoffs: [
      "Python·native runtime·그래픽 드라이버 등 로컬 설치 호환성을 관리해야 합니다.",
      "협업과 외부 공유는 명시적 export/publisher를 별도로 켜야 합니다.",
      "웹 링크 하나로 즉시 체험하는 제품이 아니므로 설치·패키징 UX가 중요합니다.",
    ],
    recommendationSignals: [
      "실행 데이터의 자동 원격 전송을 금지해야 한다.",
      "파라미터·로그·보고서를 재현 가능한 artifact로 남겨야 한다.",
      "학습자가 예측→실행→관찰→비교를 직접 반복해야 한다.",
    ],
    mission:
      "실행 전 예측을 쓰고 제어 파라미터를 바꾼 뒤, 결과와 관찰 메모가 하나의 검증된 run으로 묶이는 과정을 체험하세요.",
    missionSteps: [
      "예상 응답을 한 문장으로 기록합니다.",
      "Kp와 Kd를 조정해 로컬 run을 실행합니다.",
      "계산된 overshoot와 settling time을 확인합니다.",
      "관찰 메모를 저장해 artifact manifest를 완성합니다.",
    ],
    reference: {
      name: "MCLab · Manipulator Control Tutorial",
      type: "local",
      description:
        "Windows·macOS·Linux용 로컬 MuJoCo 학습 앱입니다. 웹에 배포하지 않는 것이 privacy boundary이며, 저장소에서 설치 화면과 실제 artifact 흐름을 확인할 수 있습니다.",
      primaryUrl: "https://github.com/ycpiglet/manipulator-control-tutorial",
      primaryLabel: "로컬 앱 저장소 열기",
    },
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
    when:
      "비기술 저자와 개발자가 함께 쓰고, 웹·Git·PDF·API 등 요구가 섞여 있어 한 가지 기존 프로필로 설명하기 어려울 때 적합합니다.",
    why:
      "기능을 capability와 adapter 계약으로 분리해, 프로젝트마다 처음부터 다시 만들지 않고 필요한 조합만 교체할 수 있습니다.",
    who:
      "제품 문서 팀, 플랫폼 엔지니어, API 작성자와 여러 문서 제품을 장기 운영하는 조직에 맞습니다.",
    workflow: [
      {
        title: "정본 선택",
        description: "콘텐츠 유형마다 rich model, Git source 또는 DB 중 하나를 명시합니다.",
      },
      {
        title: "편집 방식 연결",
        description: "저자별로 Rich와 Source surface를 같은 schema 위에 둡니다.",
      },
      {
        title: "계약 검증",
        description: "capability, 권한, 자산과 adapter 조합을 manifest로 검사합니다.",
      },
      {
        title: "선택 출력",
        description: "필요한 Web·Git·PDF·API publisher만 같은 revision에 연결합니다.",
      },
    ],
    strengths: [
      "새 프로젝트에서 공통 계정·자산·편집·게시 계약을 재사용할 수 있습니다.",
      "기존 시스템을 한 번에 버리지 않고 adapter 단위로 점진적으로 이전할 수 있습니다.",
      "서로 다른 출력이 어떤 canonical revision을 사용했는지 설명할 수 있습니다.",
    ],
    tradeoffs: [
      "유연성만 믿고 모든 capability를 켜면 가장 복잡한 시스템이 됩니다.",
      "content type별 정본과 round-trip 규칙을 초기에 결정해야 합니다.",
      "adapter마다 동일한 권한·revision·실패 복구 계약을 검증할 테스트가 필요합니다.",
    ],
    recommendationSignals: [
      "Rich 편집과 source 편집을 모두 제공해야 한다.",
      "DB·Git·object storage와 여러 publisher를 조합해야 한다.",
      "여러 프로젝트에 같은 기반을 재사용하되 차이는 manifest로 남기고 싶다.",
    ],
    mission:
      "같은 문서를 Rich와 Source에서 번갈아 고치고, 필요한 출력 adapter만 골라 하나의 revision으로 preview를 만들어보세요.",
    missionSteps: [
      "Rich 화면에서 제목과 본문을 수정합니다.",
      "Source 화면으로 전환해 같은 내용이 유지되는지 확인합니다.",
      "Web·Git·PDF·API 중 필요한 출력만 켭니다.",
      "Preview build를 실행해 revision과 adapter receipt를 확인합니다.",
    ],
    reference: {
      name: "Editorial Publishing Kit",
      type: "reference",
      description:
        "현재 보고 있는 Studio가 첫 Hybrid Docs 참조 구현입니다. 아직 별도 production 사이트는 없으며, 공통 계약과 profile 확장 구조는 공개 저장소에서 확인할 수 있습니다.",
      primaryUrl: "https://github.com/ycpiglet/editorial-publishing-kit",
      primaryLabel: "공개 기반 저장소",
    },
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
