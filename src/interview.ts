import {
  PROFILE_IDS,
  type ProfileDefinition,
  type ProfileId,
} from "./contracts.js";
import { getProfile, recommendProfiles } from "./profiles.js";

export const INTERVIEW_QUESTION_IDS = [
  "project-shape",
  "canonical-source",
  "editing-experience",
  "contribution-model",
  "identity-model",
  "asset-workflow",
  "publication-outputs",
  "privacy-boundary",
] as const;

export type InterviewQuestionId = (typeof INTERVIEW_QUESTION_IDS)[number];

interface ProfileSignal {
  readonly profile: ProfileId;
  readonly weight: number;
  readonly reason: string;
}

export interface InterviewOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly signals: readonly ProfileSignal[];
}

export interface InterviewQuestion {
  readonly id: InterviewQuestionId;
  readonly step: string;
  readonly title: string;
  readonly prompt: string;
  readonly multiple: boolean;
  readonly options: readonly InterviewOption[];
}

export type InterviewAnswers = Partial<
  Readonly<Record<InterviewQuestionId, readonly string[]>>
>;

export interface InterviewInput {
  readonly purpose?: string;
  readonly answers: InterviewAnswers;
}

export interface InterviewRecommendation {
  readonly profile: ProfileDefinition;
  readonly score: number;
  readonly fitPercent: number;
  readonly reasons: readonly string[];
  readonly tradeoffs: readonly string[];
  readonly matchedPurposeTerms: readonly string[];
}

export interface InterviewResult {
  readonly recommendations: readonly InterviewRecommendation[];
  readonly answeredQuestions: number;
  readonly totalQuestions: number;
  readonly completionPercent: number;
  readonly confidence: "exploring" | "directional" | "strong";
  readonly scoreMargin: number;
}

function signal(
  profile: ProfileId,
  weight: number,
  reason: string,
): ProfileSignal {
  return { profile, weight, reason };
}

export const INTERVIEW_QUESTIONS: readonly InterviewQuestion[] = [
  {
    id: "project-shape",
    step: "01 · 목적",
    title: "무엇을 계속 살아 있게 만들고 있나요?",
    prompt:
      "화면 모양이 아니라 콘텐츠가 만들어지고 검토되는 실제 작업에 가장 가까운 것을 고르세요.",
    multiple: false,
    options: [
      {
        id: "living-knowledge",
        label: "살아 있는 지식 위키",
        description: "여러 사람이 글을 직접 다듬고 이력을 남깁니다.",
        signals: [
          signal("wiki-web", 6, "지속적인 공동 문서 편집이 핵심입니다."),
          signal("hybrid-docs", 2, "혼합형 문서 운영에도 지식 축이 있습니다."),
        ],
      },
      {
        id: "operations-manual",
        label: "운영 매뉴얼 포털",
        description: "현장 사용자, 역할, 매뉴얼, 파일과 운영 리소스가 만납니다.",
        signals: [
          signal(
            "manual-portal",
            7,
            "역할 기반 운영 매뉴얼이 프로젝트의 중심입니다.",
          ),
          signal("hybrid-docs", 2, "복수 문서 유형을 한 흐름에 묶어야 합니다."),
        ],
      },
      {
        id: "technical-publication",
        label: "기술 아틀라스·책",
        description: "수학·코드·인용을 교정하고 여러 형식으로 출판합니다.",
        signals: [
          signal(
            "technical-atlas",
            7,
            "정밀 교정과 기술 출판이 핵심입니다.",
          ),
          signal("hybrid-docs", 1, "웹 편집을 보조 축으로 둘 수 있습니다."),
        ],
      },
      {
        id: "local-learning",
        label: "로컬 실습·튜토리얼",
        description: "학습자가 로컬에서 실행하고 산출물 묶음을 관리합니다.",
        signals: [
          signal(
            "local-tutorial",
            7,
            "로컬 실행과 불변 산출물 묶음이 핵심입니다.",
          ),
        ],
      },
      {
        id: "mixed-documentation",
        label: "아직 섞여 있는 문서 제품",
        description: "웹 편집, Git, 여러 출력과 대상 독자가 함께 있습니다.",
        signals: [
          signal(
            "hybrid-docs",
            7,
            "요구가 혼합되어 있어 균형 잡힌 출발점이 필요합니다.",
          ),
          signal("wiki-web", 1, "공동 편집 축을 유지할 수 있습니다."),
          signal("manual-portal", 1, "운영 포털 축을 확장할 수 있습니다."),
          signal("technical-atlas", 1, "기술 출판 축을 확장할 수 있습니다."),
        ],
      },
    ],
  },
  {
    id: "canonical-source",
    step: "02 · 정본",
    title: "어디에 있는 내용이 최종 진실인가요?",
    prompt:
      "정본은 나중에 adapter를 고르는 가장 큰 기준입니다. 익숙한 도구보다 실제 복구 기준을 고르세요.",
    multiple: false,
    options: [
      {
        id: "git",
        label: "Git 저장소",
        description: "파일과 commit이 정본이며 review와 배포가 연결됩니다.",
        signals: [
          signal("technical-atlas", 6, "Git source와 출판 이력이 자연스럽습니다."),
          signal("wiki-web", 5, "문서 이력을 Git commit으로 보존할 수 있습니다."),
          signal("hybrid-docs", 2, "Git export 또는 정본 adapter를 둘 수 있습니다."),
          signal(
            "manual-portal",
            -2,
            "계정 중심 포털에는 transaction DB가 더 자연스러울 수 있습니다.",
          ),
        ],
      },
      {
        id: "revision-database",
        label: "Revision 데이터베이스",
        description: "본문, 권한, 제안과 자산 관계를 transaction으로 관리합니다.",
        signals: [
          signal(
            "manual-portal",
            6,
            "계정·본문·제안·자산을 한 transaction 경계에 둘 수 있습니다.",
          ),
          signal("hybrid-docs", 4, "DB 정본과 Git/export adapter를 조합할 수 있습니다."),
          signal(
            "technical-atlas",
            -2,
            "Quarto source를 DB 정본으로 옮기면 왕복 손실 검증이 필요합니다.",
          ),
        ],
      },
      {
        id: "filesystem",
        label: "로컬 파일시스템",
        description: "사용자 장치의 문서와 산출물이 복구 기준입니다.",
        signals: [
          signal(
            "local-tutorial",
            7,
            "로컬 파일과 artifact manifest가 자연스러운 정본입니다.",
          ),
          signal("technical-atlas", 2, "Git 이전 단계의 source 작업과 잘 맞습니다."),
          signal(
            "manual-portal",
            -3,
            "다중 계정과 동시 편집은 별도 coordination이 필요합니다.",
          ),
        ],
      },
      {
        id: "undecided",
        label: "아직 결정하지 못함",
        description: "기존 제약을 더 확인한 뒤 정본을 정하고 싶습니다.",
        signals: [
          signal(
            "hybrid-docs",
            5,
            "adapter 경계를 먼저 두고 정본 결정을 미룰 수 있습니다.",
          ),
          signal("wiki-web", 1, "Git 기반 경로를 후보로 유지할 수 있습니다."),
          signal("manual-portal", 1, "DB 기반 경로를 후보로 유지할 수 있습니다."),
          signal("technical-atlas", 1, "source 기반 경로를 후보로 유지할 수 있습니다."),
          signal("local-tutorial", 1, "local-first 경로를 후보로 유지할 수 있습니다."),
        ],
      },
    ],
  },
  {
    id: "editing-experience",
    step: "03 · 편집",
    title: "작성자는 어떤 편집 경험을 기대하나요?",
    prompt:
      "WYSIWYG는 접근성을 높이고 source 편집은 기술 의미를 보존합니다. 실제 저자의 역량과 콘텐츠를 기준으로 고르세요.",
    multiple: false,
    options: [
      {
        id: "wysiwyg",
        label: "WYSIWYG 중심",
        description: "도구막대와 block UI로 본문을 직접 편집합니다.",
        signals: [
          signal("manual-portal", 5, "비기술 사용자에게 rich editor가 적합합니다."),
          signal("wiki-web", 5, "인증 사용자의 직접 rich editing과 잘 맞습니다."),
          signal("hybrid-docs", 3, "새 문서는 rich canonical model로 시작할 수 있습니다."),
          signal(
            "technical-atlas",
            -2,
            "수학·코드·인용은 보호 node와 source fallback이 필요합니다.",
          ),
        ],
      },
      {
        id: "source",
        label: "Source 중심",
        description: "Markdown, QMD, config 또는 code-aware editor를 사용합니다.",
        signals: [
          signal(
            "technical-atlas",
            6,
            "기술 의미와 multi-format source를 온전히 보존합니다.",
          ),
          signal("local-tutorial", 5, "문서와 config를 로컬 source로 관리합니다."),
          signal("wiki-web", 2, "Git content source view를 제공할 수 있습니다."),
          signal(
            "manual-portal",
            -2,
            "현장 저자에게 source 편집 학습비용이 생길 수 있습니다.",
          ),
        ],
      },
      {
        id: "both",
        label: "Rich + Source 둘 다",
        description: "안전한 node는 시각 편집하고 고급 의미는 source로 다룹니다.",
        signals: [
          signal(
            "hybrid-docs",
            6,
            "두 편집 방식을 capability로 조합하는 기본 profile입니다.",
          ),
          signal("wiki-web", 4, "rich editor와 source view를 함께 제공할 수 있습니다."),
          signal("technical-atlas", 3, "보호 node와 source fallback 전략에 맞습니다."),
          signal("manual-portal", 2, "관리자에게 source 도구를 추가할 수 있습니다."),
        ],
      },
    ],
  },
  {
    id: "contribution-model",
    step: "04 · 기여",
    title: "사람들은 바로 고치나요, 먼저 제안하나요?",
    prompt:
      "권한만이 아니라 실제 사용자 의도를 고려합니다. 같은 사람도 상황에 따라 직접 수정과 제안을 오갈 수 있습니다.",
    multiple: false,
    options: [
      {
        id: "direct",
        label: "인증 사용자가 직접 수정",
        description: "권한이 있으면 본문을 바로 저장하고 이력을 남깁니다.",
        signals: [
          signal("wiki-web", 5, "인증 사용자의 direct Git edit가 핵심입니다."),
          signal("manual-portal", 4, "역할 capability로 직접 저장을 제어할 수 있습니다."),
          signal("local-tutorial", 3, "로컬 소유자가 source를 직접 수정합니다."),
          signal("hybrid-docs", 2, "직접 편집 capability를 선택할 수 있습니다."),
        ],
      },
      {
        id: "proposal",
        label: "특정 위치에 먼저 제안",
        description: "선택 영역과 맥락을 남기고 reviewer가 반영합니다.",
        signals: [
          signal(
            "technical-atlas",
            6,
            "정확한 source 위치의 교정 제안이 핵심입니다.",
          ),
          signal("wiki-web", 3, "권한이 없을 때 proposal fallback을 제공할 수 있습니다."),
          signal("hybrid-docs", 3, "inline suggestion lifecycle을 기본으로 둘 수 있습니다."),
          signal("manual-portal", 2, "현장 feedback을 본문 review로 연결할 수 있습니다."),
        ],
      },
      {
        id: "direct-and-proposal",
        label: "직접 수정과 제안 모두",
        description: "역할과 작업에 따라 direct/propose를 명시적으로 선택합니다.",
        signals: [
          signal(
            "hybrid-docs",
            6,
            "두 흐름을 공통 capability와 policy로 조합합니다.",
          ),
          signal("wiki-web", 5, "직접 commit과 PR fallback을 함께 지원합니다."),
          signal("manual-portal", 5, "역할 기반 direct와 review를 함께 운영합니다."),
          signal("technical-atlas", 3, "source owner와 외부 reviewer를 분리할 수 있습니다."),
        ],
      },
    ],
  },
  {
    id: "identity-model",
    step: "05 · 계정",
    title: "누가 들어오고, 누가 권한을 관리하나요?",
    prompt:
      "로그인 identity, 프로젝트 membership, 외부 게시 credential을 분리해서 생각하세요.",
    multiple: false,
    options: [
      {
        id: "application-accounts",
        label: "앱 계정과 역할 관리",
        description: "관리자가 초대, 활성화, 역할과 접근 범위를 관리합니다.",
        signals: [
          signal(
            "manual-portal",
            7,
            "운영자가 application account와 역할을 관리합니다.",
          ),
          signal("hybrid-docs", 4, "membership capability를 기본으로 확장할 수 있습니다."),
          signal(
            "local-tutorial",
            -4,
            "로컬 실습에는 중앙 계정이 불필요한 운영비용이 됩니다.",
          ),
        ],
      },
      {
        id: "oauth-membership",
        label: "OAuth 로그인 + 프로젝트 membership",
        description: "외부 로그인은 쓰되 프로젝트 권한은 별도로 판정합니다.",
        signals: [
          signal("wiki-web", 6, "사이트 identity와 Git credential을 분리할 수 있습니다."),
          signal("hybrid-docs", 5, "provider와 project membership을 조합할 수 있습니다."),
          signal("manual-portal", 3, "운영 account에 OAuth provider를 붙일 수 있습니다."),
        ],
      },
      {
        id: "git-identity",
        label: "Git forge identity",
        description: "Issue, PR, commit attribution이 주된 참여 경로입니다.",
        signals: [
          signal(
            "technical-atlas",
            6,
            "review와 publication provenance를 Git identity로 연결합니다.",
          ),
          signal("wiki-web", 5, "commit/PR attribution과 직접 편집 권한에 맞습니다."),
          signal("local-tutorial", 2, "source contributor에게만 identity가 필요합니다."),
        ],
      },
      {
        id: "local-no-account",
        label: "로컬 사용자, 계정 없음",
        description: "클라우드 로그인 없이 장치 소유자가 실행하고 관리합니다.",
        signals: [
          signal(
            "local-tutorial",
            8,
            "계정 없는 local-first privacy 원칙과 정확히 맞습니다.",
          ),
          signal(
            "manual-portal",
            -5,
            "다중 역할 포털은 identity와 membership이 필요합니다.",
          ),
          signal(
            "wiki-web",
            -3,
            "공동 웹 편집에는 기여자 identity가 필요합니다.",
          ),
        ],
      },
    ],
  },
  {
    id: "asset-workflow",
    step: "06 · 파일",
    title: "이미지와 파일은 어떻게 들어오고 살아가나요?",
    prompt:
      "업로드 버튼보다 staging, 검사, 메타데이터, 참조, quarantine와 복구가 필요한지 판단하세요.",
    multiple: false,
    options: [
      {
        id: "private-staging",
        label: "Private staging 후 공개",
        description: "형식·크기·안전·저작권 정보를 확인한 뒤 attach합니다.",
        signals: [
          signal(
            "manual-portal",
            6,
            "운영 파일을 private staging과 policy로 관리합니다.",
          ),
          signal("hybrid-docs", 5, "공통 asset lifecycle을 그대로 사용할 수 있습니다."),
          signal("wiki-web", 3, "Git 직접 upload보다 안전한 staging을 추가할 수 있습니다."),
        ],
      },
      {
        id: "git-assets",
        label: "Git과 함께 관리",
        description: "문서와 asset path를 같은 review와 commit 경계에 둡니다.",
        signals: [
          signal("wiki-web", 5, "문서와 이미지 변경을 atomic commit으로 묶습니다."),
          signal("technical-atlas", 5, "book source와 figure를 함께 검증합니다."),
          signal("local-tutorial", 2, "source asset을 local Git에서 관리할 수 있습니다."),
        ],
      },
      {
        id: "local-managed-assets",
        label: "로컬 설치·checksum 관리",
        description: "외부 resource를 pin하고 로컬 cache와 산출물을 검증합니다.",
        signals: [
          signal(
            "local-tutorial",
            8,
            "pinned resource, checksum, atomic local publish와 일치합니다.",
          ),
          signal("technical-atlas", 2, "build resource를 재현 가능하게 관리할 수 있습니다."),
        ],
      },
      {
        id: "minimal-assets",
        label: "파일이 거의 없음",
        description: "본문과 링크가 중심이며 복잡한 upload lifecycle은 필요 없습니다.",
        signals: [
          signal("technical-atlas", 2, "source 중심 출판으로 시작할 수 있습니다."),
          signal("wiki-web", 2, "텍스트 위키의 작은 범위로 시작할 수 있습니다."),
          signal("local-tutorial", 2, "내장 asset만 쓰는 작은 실습에 맞습니다."),
        ],
      },
    ],
  },
  {
    id: "publication-outputs",
    step: "07 · 출력",
    title: "사용자가 실제로 받는 결과물은 무엇인가요?",
    prompt:
      "여러 개를 고를 수 있습니다. preview와 live verification이 필요한 최종 결과를 모두 선택하세요.",
    multiple: true,
    options: [
      {
        id: "web-reader",
        label: "반응형 웹 reader",
        description: "검색·탐색 가능한 웹 화면과 고정 URL을 제공합니다.",
        signals: [
          signal("wiki-web", 4, "reader web이 주 publication surface입니다."),
          signal("manual-portal", 4, "운영 포털 안에서 manual을 게시합니다."),
          signal("hybrid-docs", 4, "웹을 기본 output adapter로 둘 수 있습니다."),
          signal("technical-atlas", 3, "기술 reader를 Pages로 게시할 수 있습니다."),
        ],
      },
      {
        id: "pdf-epub",
        label: "PDF·EPUB·print",
        description: "pagination과 reflow를 검증한 다운로드 산출물이 필요합니다.",
        signals: [
          signal(
            "technical-atlas",
            7,
            "동일 source에서 web, PDF, EPUB을 만드는 핵심 profile입니다.",
          ),
          signal("hybrid-docs", 3, "multi-format renderer를 adapter로 추가할 수 있습니다."),
        ],
      },
      {
        id: "local-artifact",
        label: "로컬 report·artifact bundle",
        description: "manifest와 checksum이 있는 불변 산출물을 장치에 게시합니다.",
        signals: [
          signal(
            "local-tutorial",
            8,
            "atomic local artifact publication과 정확히 맞습니다.",
          ),
          signal("hybrid-docs", 1, "선택적 local publisher를 추가할 수 있습니다."),
        ],
      },
      {
        id: "structured-export",
        label: "구조화 export·API",
        description: "다른 시스템이 읽을 JSON, HTML, Markdown 또는 feed가 필요합니다.",
        signals: [
          signal("hybrid-docs", 5, "복수 adapter와 export를 조합하는 데 적합합니다."),
          signal("manual-portal", 3, "운영 시스템과 resource를 연계할 수 있습니다."),
          signal("wiki-web", 2, "Git content와 feed를 외부에 제공할 수 있습니다."),
          signal("technical-atlas", 2, "Pandoc/Quarto output을 확장할 수 있습니다."),
        ],
      },
    ],
  },
  {
    id: "privacy-boundary",
    step: "08 · 경계",
    title: "절대로 섞이거나 밖으로 나가면 안 되는 것은 무엇인가요?",
    prompt:
      "기능보다 먼저 privacy와 tenant 경계를 고릅니다. adapter가 있다는 이유만으로 전송을 허용하지 않습니다.",
    multiple: false,
    options: [
      {
        id: "public-content",
        label: "공개 콘텐츠 중심",
        description: "작성 단계만 보호하고 게시 결과는 공개합니다.",
        signals: [
          signal("wiki-web", 4, "공개 reader와 기여 workflow에 적합합니다."),
          signal("technical-atlas", 4, "공개 기술 publication에 적합합니다."),
          signal("hybrid-docs", 2, "공개 output adapter를 기본으로 둘 수 있습니다."),
        ],
      },
      {
        id: "project-isolation",
        label: "프로젝트·조직별 격리",
        description: "계정, DB, bucket, credential과 공개 범위를 분리합니다.",
        signals: [
          signal(
            "manual-portal",
            6,
            "운영자·현장·민감 resource를 프로젝트 경계로 격리합니다.",
          ),
          signal("hybrid-docs", 5, "tenant별 adapter와 policy를 구성할 수 있습니다."),
          signal("wiki-web", 2, "membership 범위와 publishing credential을 분리합니다."),
        ],
      },
      {
        id: "local-only",
        label: "로컬 밖으로 자동 전송 금지",
        description: "문서와 학습 산출물은 명시적 opt-in 없이는 장치를 떠나지 않습니다.",
        signals: [
          signal(
            "local-tutorial",
            9,
            "local-first privacy와 opt-in adapter 원칙에 정확히 맞습니다.",
          ),
          signal(
            "manual-portal",
            -5,
            "중앙 계정·DB 포털은 local-only 요구와 충돌합니다.",
          ),
          signal(
            "wiki-web",
            -3,
            "웹 공동 편집은 원격 저장과 identity가 필요합니다.",
          ),
        ],
      },
      {
        id: "mixed-visibility",
        label: "공개와 제한 콘텐츠 혼합",
        description: "문서·resource·asset마다 visibility와 retention이 다릅니다.",
        signals: [
          signal(
            "hybrid-docs",
            6,
            "콘텐츠 유형별 visibility와 adapter를 분리할 수 있습니다.",
          ),
          signal("manual-portal", 4, "role과 resource 범위로 접근을 제어할 수 있습니다."),
          signal("wiki-web", 2, "draft와 공개 publication을 분리할 수 있습니다."),
          signal("local-tutorial", 2, "local artifact를 opt-in export와 분리할 수 있습니다."),
        ],
      },
    ],
  },
] as const;

const PROFILE_TRADEOFFS: Readonly<Record<ProfileId, readonly string[]>> = {
  "wiki-web": [
    "계정·리소스 운영이 커지면 application membership adapter가 추가로 필요합니다.",
    "여러 파일이 연결된 저장은 하나의 atomic Git tree update로 구현해야 합니다.",
  ],
  "manual-portal": [
    "DB와 object storage 운영, server-side 권한 정책이 필요합니다.",
    "Quarto 수학·코드 source를 일반 WYSIWYG 정본으로 강제하면 안 됩니다.",
  ],
  "technical-atlas": [
    "완전한 WYSIWYG보다 의미 보존과 round-trip 검증을 우선합니다.",
    "app 계정·운영 포털 기능은 별도 identity/resource adapter가 필요합니다.",
  ],
  "local-tutorial": [
    "다중 사용자 웹 편집과 중앙 계정은 기본 범위가 아닙니다.",
    "외부 공유는 명시적으로 활성화한 publication adapter를 통해서만 가능합니다.",
  ],
  "hybrid-docs": [
    "유연한 대신 content type별 정본과 adapter를 초기에 명확히 정해야 합니다.",
    "모든 기능을 켜기보다 실제 workflow에 필요한 capability만 안정화해야 합니다.",
  ],
};

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function selectedOptions(answers: InterviewAnswers): InterviewOption[] {
  const selected: InterviewOption[] = [];
  for (const question of INTERVIEW_QUESTIONS) {
    const answer = answers[question.id] ?? [];
    for (const optionId of answer) {
      const option = question.options.find((candidate) => candidate.id === optionId);
      if (option !== undefined) {
        selected.push(option);
      }
    }
  }
  return selected;
}

export function isInterviewComplete(answers: InterviewAnswers): boolean {
  return INTERVIEW_QUESTIONS.every(
    (question) => (answers[question.id]?.length ?? 0) > 0,
  );
}

export function recommendFromInterview(
  input: InterviewInput,
): InterviewResult {
  const answeredQuestions = INTERVIEW_QUESTIONS.filter(
    (question) => (input.answers[question.id]?.length ?? 0) > 0,
  ).length;
  const completionPercent = Math.round(
    (answeredQuestions / INTERVIEW_QUESTIONS.length) * 100,
  );
  const evidenceCoverage =
    0.35 + 0.65 * (answeredQuestions / INTERVIEW_QUESTIONS.length);
  const scores = new Map<ProfileId, number>(
    PROFILE_IDS.map((profileId) => [profileId, 0]),
  );
  const reasons = new Map<ProfileId, string[]>(
    PROFILE_IDS.map((profileId) => [profileId, []]),
  );
  const cautions = new Map<ProfileId, string[]>(
    PROFILE_IDS.map((profileId) => [profileId, []]),
  );
  let maximumPossible = 0;

  for (const option of selectedOptions(input.answers)) {
    maximumPossible += Math.max(
      0,
      ...option.signals.map((current) => current.weight),
    );
    for (const current of option.signals) {
      scores.set(
        current.profile,
        (scores.get(current.profile) ?? 0) + current.weight,
      );
      const target = current.weight >= 0 ? reasons : cautions;
      target.get(current.profile)?.push(current.reason);
    }
  }

  const purpose = input.purpose?.trim() ?? "";
  const purposeRecommendations =
    purpose.length > 0 ? recommendProfiles(purpose) : [];
  const maximumPurposeMatches = Math.max(
    0,
    ...purposeRecommendations.map((current) => current.matchedTerms.length),
  );
  maximumPossible += maximumPurposeMatches * 2;
  for (const recommendation of purposeRecommendations) {
    if (recommendation.matchedTerms.length === 0) {
      continue;
    }
    const profileId = recommendation.profile.id;
    scores.set(
      profileId,
      (scores.get(profileId) ?? 0) + recommendation.matchedTerms.length * 2,
    );
    reasons
      .get(profileId)
      ?.push(`프로젝트 설명의 “${recommendation.matchedTerms.join(", ")}” 신호가 맞습니다.`);
  }

  const recommendations = PROFILE_IDS.map((profileId) => {
    const profile = getProfile(profileId);
    if (profile === undefined) {
      throw new Error(`Profile registry is missing ${profileId}.`);
    }
    const purposeMatch = purposeRecommendations.find(
      (current) => current.profile.id === profileId,
    );
    const score = scores.get(profileId) ?? 0;
    return {
      profile,
      score,
      fitPercent:
        maximumPossible === 0
          ? profileId === "hybrid-docs"
            ? 30
            : 0
          : Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  (score / maximumPossible) * 100 * evidenceCoverage,
                ),
              ),
            ),
      reasons: unique(reasons.get(profileId) ?? []).slice(0, 5),
      tradeoffs: unique([
        ...(cautions.get(profileId) ?? []),
        ...PROFILE_TRADEOFFS[profileId],
      ]).slice(0, 3),
      matchedPurposeTerms: purposeMatch?.matchedTerms ?? [],
    } satisfies InterviewRecommendation;
  }).sort(
    (left, right) =>
      right.score - left.score ||
      PROFILE_IDS.indexOf(left.profile.id) - PROFILE_IDS.indexOf(right.profile.id),
  );

  const first = recommendations[0]?.score ?? 0;
  const second = recommendations[1]?.score ?? 0;
  const scoreMargin = first - second;
  const confidence =
    completionPercent < 50
      ? "exploring"
      : completionPercent === 100 && scoreMargin >= 6
        ? "strong"
        : "directional";

  return {
    recommendations,
    answeredQuestions,
    totalQuestions: INTERVIEW_QUESTIONS.length,
    completionPercent,
    confidence,
    scoreMargin,
  };
}
