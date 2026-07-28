import type {
  AdapterSelection,
  CapabilityId,
  ProfileDefinition,
  ProfileId,
} from "./contracts.js";

function adapter(
  id: string,
  slot: AdapterSelection["slot"],
  implementation: string,
  required = true,
): AdapterSelection {
  return { id, slot, implementation, required };
}

export const PROFILES: Readonly<Record<ProfileId, ProfileDefinition>> = {
  "wiki-web": {
    id: "wiki-web",
    title: "Wiki Web",
    summary:
      "Authenticated contributors edit rich articles while Git remains the publication history.",
    inspiredBy: ["bean-wiki"],
    canonicalStore: "git",
    representation: "html@1",
    capabilities: [
      "content:draft",
      "content:direct-edit",
      "content:history",
      "editor:wysiwyg",
      "suggestion:inline",
      "asset:upload",
      "asset:download",
      "resource:manage",
      "publication:preview",
      "publication:release",
    ],
    adapters: [
      adapter("primary-content", "content", "git-html@1"),
      adapter("project-identity", "identity", "oauth-membership@1"),
      adapter("article-assets", "assets", "git-assets@1"),
      adapter("resource-catalog", "resources", "versioned-resources@1"),
      adapter("reader-renderer", "renderer", "semantic-html@1"),
      adapter("production", "publisher", "vercel@1"),
    ],
    constraints: [
      "Use one atomic tree commit for related content and index changes.",
      "Keep site identity separate from external Git credentials.",
    ],
  },
  "manual-portal": {
    id: "manual-portal",
    title: "Manual Portal",
    summary:
      "A role-aware WYSIWYG portal with managed accounts, manuals, uploads, and operational resources.",
    inspiredBy: ["tag_manual"],
    canonicalStore: "postgres",
    representation: "prosemirror-json@1",
    capabilities: [
      "account:manage",
      "content:draft",
      "content:direct-edit",
      "content:history",
      "editor:wysiwyg",
      "suggestion:inline",
      "asset:upload",
      "asset:download",
      "resource:manage",
      "publication:preview",
      "publication:release",
    ],
    adapters: [
      adapter("primary-content", "content", "postgres-revisions@1"),
      adapter("project-identity", "identity", "application-accounts@1"),
      adapter("manual-assets", "assets", "private-object-storage@1"),
      adapter("resource-catalog", "resources", "versioned-resources@1"),
      adapter("reader-renderer", "renderer", "semantic-html@1"),
      adapter("production", "publisher", "web-application@1"),
    ],
    constraints: [
      "Stage and validate uploads before assigning a public URL.",
      "Enforce account capabilities on the server, not only in the UI.",
    ],
  },
  "technical-atlas": {
    id: "technical-atlas",
    title: "Technical Atlas",
    summary:
      "Git-authored technical material with precise inline proposals and multi-format publication.",
    inspiredBy: ["robotics-math-atlas"],
    canonicalStore: "git",
    representation: "quarto@1",
    capabilities: [
      "content:draft",
      "content:history",
      "editor:source",
      "suggestion:inline",
      "asset:upload",
      "asset:download",
      "resource:manage",
      "publication:preview",
      "publication:release",
    ],
    adapters: [
      adapter("primary-content", "content", "quarto-git@1"),
      adapter("project-identity", "identity", "git-forge@1"),
      adapter("atlas-assets", "assets", "git-assets@1"),
      adapter("resource-catalog", "resources", "versioned-resources@1"),
      adapter("book-renderer", "renderer", "quarto-multiformat@1"),
      adapter("production", "publisher", "github-pages@1"),
    ],
    constraints: [
      "Preserve math, citation, code, and custom block semantics during editing.",
      "Anchor proposals with persistent block IDs plus textual context.",
    ],
  },
  "local-tutorial": {
    id: "local-tutorial",
    title: "Local Tutorial",
    summary:
      "A local-first tutorial whose documents and immutable artifact bundles stay under user control.",
    inspiredBy: ["manipulator-control-tutorial"],
    canonicalStore: "filesystem",
    representation: "mixed@1",
    capabilities: [
      "content:draft",
      "content:direct-edit",
      "content:history",
      "editor:source",
      "asset:download",
      "resource:manage",
      "publication:preview",
      "publication:release",
    ],
    adapters: [
      adapter("primary-content", "content", "local-files@1"),
      adapter("project-identity", "identity", "local-user@1", false),
      adapter("tutorial-assets", "assets", "managed-local-assets@1"),
      adapter("resource-catalog", "resources", "local-resources@1"),
      adapter("report-renderer", "renderer", "local-report@1"),
      adapter("production", "publisher", "atomic-local-artifact@1"),
    ],
    constraints: [
      "Never upload learner data unless a project explicitly enables an adapter.",
      "Publish terminal artifact bundles atomically and keep cleanup recoverable.",
    ],
  },
  "hybrid-docs": {
    id: "hybrid-docs",
    title: "Hybrid Docs",
    summary:
      "A balanced default for new documentation projects that need web editing and Git-compatible exports.",
    inspiredBy: [
      "bean-wiki",
      "tag_manual",
      "robotics-math-atlas",
      "manipulator-control-tutorial",
    ],
    canonicalStore: "hybrid",
    representation: "prosemirror-json@1",
    capabilities: [
      "account:manage",
      "content:draft",
      "content:direct-edit",
      "content:history",
      "editor:wysiwyg",
      "editor:source",
      "suggestion:inline",
      "asset:upload",
      "asset:download",
      "resource:manage",
      "publication:preview",
      "publication:release",
    ],
    adapters: [
      adapter("primary-content", "content", "revision-store@1"),
      adapter("project-identity", "identity", "oauth-membership@1"),
      adapter("document-assets", "assets", "private-object-storage@1"),
      adapter("resource-catalog", "resources", "versioned-resources@1"),
      adapter("document-renderer", "renderer", "semantic-multiformat@1"),
      adapter("production", "publisher", "project-defined@1"),
    ],
    constraints: [
      "Choose one canonical representation per content type.",
      "Treat Git export as an adapter unless Git is explicitly the canonical store.",
    ],
  },
};

const PROFILE_KEYWORDS: Readonly<Record<ProfileId, readonly string[]>> = {
  "wiki-web": [
    "wiki",
    "knowledge",
    "article",
    "encyclopedia",
    "위키",
    "지식",
    "게시글",
    "백과",
  ],
  "manual-portal": [
    "manual",
    "portal",
    "account",
    "role",
    "wysiwyg",
    "매뉴얼",
    "포털",
    "계정",
    "권한",
    "운영",
  ],
  "technical-atlas": [
    "atlas",
    "math",
    "quarto",
    "book",
    "pdf",
    "epub",
    "review",
    "수학",
    "교정",
    "책",
    "논문",
  ],
  "local-tutorial": [
    "local",
    "tutorial",
    "simulation",
    "artifact",
    "privacy",
    "로컬",
    "튜토리얼",
    "시뮬레이션",
    "실습",
    "개인정보",
  ],
  "hybrid-docs": [
    "docs",
    "documentation",
    "developer",
    "reference",
    "api",
    "문서",
    "개발자",
    "레퍼런스",
  ],
};

export interface ProfileRecommendation {
  readonly profile: ProfileDefinition;
  readonly score: number;
  readonly matchedTerms: readonly string[];
}

export function getProfile(id: string): ProfileDefinition | undefined {
  return PROFILES[id as ProfileId];
}

export function listProfiles(): readonly ProfileDefinition[] {
  return Object.values(PROFILES);
}

export function recommendProfiles(
  purpose: string,
): readonly ProfileRecommendation[] {
  const normalized = purpose.toLocaleLowerCase();
  const recommendations = listProfiles().map((profile) => {
    const matchedTerms = PROFILE_KEYWORDS[profile.id].filter((keyword) =>
      normalized.includes(keyword),
    );
    return {
      profile,
      score: matchedTerms.length,
      matchedTerms,
    };
  });

  if (recommendations.every((item) => item.score === 0)) {
    return recommendations
      .map((item) =>
        item.profile.id === "hybrid-docs" ? { ...item, score: 1 } : item,
      )
      .sort((left, right) => right.score - left.score);
  }

  return recommendations.sort(
    (left, right) =>
      right.score - left.score ||
      left.profile.id.localeCompare(right.profile.id),
  );
}

export function hasCapability(
  profile: ProfileDefinition,
  capability: CapabilityId,
): boolean {
  return profile.capabilities.includes(capability);
}
