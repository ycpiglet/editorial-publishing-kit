export const API_VERSION = "publishing.ycpiglet.dev/v1alpha1" as const;
export const MANIFEST_KIND = "PublishingProject" as const;
export const KIT_VERSION = "0.1.0-alpha.0" as const;

export const PROFILE_IDS = [
  "wiki-web",
  "manual-portal",
  "technical-atlas",
  "local-tutorial",
  "hybrid-docs",
] as const;

export type ProfileId = (typeof PROFILE_IDS)[number];

export const CORE_CAPABILITIES = [
  "account:manage",
  "asset:download",
  "asset:upload",
  "content:direct-edit",
  "content:draft",
  "content:history",
  "editor:source",
  "editor:wysiwyg",
  "publication:preview",
  "publication:release",
  "resource:manage",
  "suggestion:inline",
] as const;

export type CoreCapability = (typeof CORE_CAPABILITIES)[number];
export type ExtensionCapability = `x-${string}/${string}`;
export type CapabilityId = CoreCapability | ExtensionCapability;

export const CANONICAL_STORES = [
  "git",
  "postgres",
  "filesystem",
  "hybrid",
] as const;
export type CanonicalStore = (typeof CANONICAL_STORES)[number];

export const CONTENT_REPRESENTATIONS = [
  "prosemirror-json@1",
  "html@1",
  "markdown@1",
  "quarto@1",
  "mixed@1",
] as const;
export type ContentRepresentation = (typeof CONTENT_REPRESENTATIONS)[number];

export const ADAPTER_SLOTS = [
  "content",
  "identity",
  "assets",
  "resources",
  "renderer",
  "publisher",
  "automation",
] as const;

export type AdapterSlot = (typeof ADAPTER_SLOTS)[number];

export interface AdapterSelection {
  readonly id: string;
  readonly slot: AdapterSlot;
  readonly implementation: string;
  readonly required: boolean;
}

export interface ProfileDefinition {
  readonly id: ProfileId;
  readonly title: string;
  readonly summary: string;
  readonly inspiredBy: readonly string[];
  readonly canonicalStore: CanonicalStore;
  readonly representation: ContentRepresentation;
  readonly capabilities: readonly CapabilityId[];
  readonly adapters: readonly AdapterSelection[];
  readonly constraints: readonly string[];
}

export interface PublishingProjectManifest {
  readonly $schema?: string;
  readonly apiVersion: typeof API_VERSION;
  readonly kind: typeof MANIFEST_KIND;
  readonly metadata: {
    readonly id: string;
    readonly name: string;
  };
  readonly spec: {
    readonly profile: ProfileId;
    readonly kitVersion: string;
    readonly content: {
      readonly canonicalStore: ProfileDefinition["canonicalStore"];
      readonly representation: ProfileDefinition["representation"];
    };
    readonly capabilities: readonly CapabilityId[];
    readonly adapters: readonly AdapterSelection[];
    readonly governance: {
      readonly feedback: "github-issues-and-pull-requests";
      readonly requireChangeRationale: true;
      readonly compatibilityPolicy: "semver-and-migrations";
    };
    readonly automation: {
      readonly provider: "none" | "agent-runtime" | "custom";
      readonly mode: "deferred" | "enabled";
      readonly activationCriteria: readonly string[];
    };
  };
}

export interface ActorRef {
  readonly id: string;
  readonly kind: "user" | "agent" | "service";
  readonly displayName?: string;
  readonly externalIdentity?: string;
}

export type DocumentStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "published"
  | "archived";

export interface DocumentEnvelope {
  readonly id: string;
  readonly projectId: string;
  readonly type: string;
  readonly slug: string;
  readonly locale: string;
  readonly title: string;
  readonly status: DocumentStatus;
  readonly representation: string;
  readonly body: unknown;
  readonly revisionId: string;
  readonly schemaVersion: string;
  readonly visibility: "public" | "authenticated" | "project" | "restricted";
  readonly createdBy: ActorRef;
  readonly updatedBy: ActorRef;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UpdateDocumentCommand {
  readonly documentId: string;
  readonly baseRevisionId: string;
  readonly idempotencyKey: string;
  readonly editSummary: string;
  readonly mode: "direct" | "propose";
  readonly body: unknown;
}

export interface SuggestionAnchor {
  readonly revisionId: string;
  readonly blockId: string;
  readonly exact: string;
  readonly prefix: string;
  readonly suffix: string;
  readonly from?: number;
  readonly to?: number;
}

export type SuggestionStatus =
  | "open"
  | "accepted"
  | "rejected"
  | "outdated"
  | "published";

export interface SuggestionRecord {
  readonly id: string;
  readonly documentId: string;
  readonly anchor: SuggestionAnchor;
  readonly replacement: string;
  readonly rationale: string;
  readonly status: SuggestionStatus;
  readonly proposedBy: ActorRef;
  readonly reviewedBy?: ActorRef;
}

export type AssetStatus =
  | "staged"
  | "scanning"
  | "ready"
  | "quarantined"
  | "rejected";

export interface AssetRecord {
  readonly id: string;
  readonly projectId: string;
  readonly status: AssetStatus;
  readonly filename: string;
  readonly mediaType: string;
  readonly bytes: number;
  readonly checksum: string;
  readonly alt?: string;
  readonly caption?: string;
  readonly author?: string;
  readonly license?: string;
  readonly sourceUrl?: string;
  readonly parentAssetId?: string;
}

export interface ResourceRecord {
  readonly id: string;
  readonly projectId: string;
  readonly type: string;
  readonly version: string;
  readonly title: string;
  readonly visibility: DocumentEnvelope["visibility"];
  readonly relations: readonly {
    readonly kind: string;
    readonly targetId: string;
  }[];
}

export interface MembershipRecord {
  readonly id: string;
  readonly projectId: string;
  readonly actor: ActorRef;
  readonly role: string;
  readonly status: "invited" | "active" | "suspended" | "removed";
  readonly capabilities: readonly CapabilityId[];
}

export interface PublicationJob {
  readonly id: string;
  readonly projectId: string;
  readonly revisionId: string;
  readonly idempotencyKey: string;
  readonly state:
    | "planned"
    | "validating"
    | "rendering"
    | "staged"
    | "publishing"
    | "verifying"
    | "published"
    | "failed"
    | "rolled_back";
  readonly artifactChecksum?: string;
  readonly liveUrl?: string;
}

export interface ExternalRevision {
  readonly id: string;
  readonly sourceRevision: string;
  readonly publishedAt: string;
  readonly checksum?: string;
}

export interface ContentAdapter {
  readonly id: string;
  inspect(documentId: string): Promise<unknown>;
  load(documentId: string): Promise<DocumentEnvelope>;
  stage(command: UpdateDocumentCommand): Promise<unknown>;
  publish(staged: unknown): Promise<ExternalRevision>;
  rollback(target: ExternalRevision): Promise<ExternalRevision>;
}

export interface ValidationIssue {
  readonly severity: "error" | "warning";
  readonly code: string;
  readonly path: string;
  readonly message: string;
}
