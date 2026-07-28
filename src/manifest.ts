import {
  ADAPTER_SLOTS,
  API_VERSION,
  CANONICAL_STORES,
  CONTENT_REPRESENTATIONS,
  CORE_CAPABILITIES,
  MANIFEST_KIND,
  PROFILE_IDS,
  type AdapterSelection,
  type CapabilityId,
  type ProfileId,
  type PublishingProjectManifest,
  type ValidationIssue,
} from "./contracts.js";
import { getProfile } from "./profiles.js";

export const MANIFEST_SCHEMA_URL =
  "https://raw.githubusercontent.com/ycpiglet/editorial-publishing-kit/main/schemas/publishing-project.schema.json";

export const AGENT_RUNTIME_ACTIVATION_CRITERIA = [
  "Three or more maintainers or agents regularly coordinate changes.",
  "Two or more concurrent worktrees are routinely active.",
  "The adapter or release matrix needs independent ownership and verification.",
  "A multi-wave roadmap or sustained queue of roughly twenty scoped issues exists.",
] as const;

export interface ComposeManifestInput {
  readonly id: string;
  readonly name: string;
  readonly profile: ProfileId;
}

export function composeManifest(
  input: ComposeManifestInput,
): PublishingProjectManifest {
  const profile = getProfile(input.profile);
  if (profile === undefined) {
    throw new Error(`Unknown profile: ${input.profile}`);
  }

  return {
    $schema: MANIFEST_SCHEMA_URL,
    apiVersion: API_VERSION,
    kind: MANIFEST_KIND,
    metadata: {
      id: input.id,
      name: input.name,
    },
    spec: {
      profile: profile.id,
      kitVersion: "0.1.0-alpha.0",
      content: {
        canonicalStore: profile.canonicalStore,
        representation: profile.representation,
      },
      capabilities: [...profile.capabilities],
      adapters: profile.adapters.map((selected) => ({ ...selected })),
      governance: {
        feedback: "github-issues-and-pull-requests",
        requireChangeRationale: true,
        compatibilityPolicy: "semver-and-migrations",
      },
      automation: {
        provider: "none",
        mode: "deferred",
        activationCriteria: [...AGENT_RUNTIME_ACTIVATION_CRITERIA],
      },
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function issue(
  severity: ValidationIssue["severity"],
  code: string,
  path: string,
  message: string,
): ValidationIssue {
  return { severity, code, path, message };
}

function isCapability(value: unknown): value is CapabilityId {
  return (
    typeof value === "string" &&
    (CORE_CAPABILITIES.includes(
      value as (typeof CORE_CAPABILITIES)[number],
    ) ||
      /^x-[a-z0-9-]+\/[a-z0-9:-]+$/u.test(value))
  );
}

function validateAdapters(
  value: unknown,
  issues: ValidationIssue[],
): value is readonly AdapterSelection[] {
  if (!Array.isArray(value)) {
    issues.push(
      issue("error", "adapters.type", "$.spec.adapters", "Expected an array."),
    );
    return false;
  }

  const seenIds = new Set<string>();
  value.forEach((adapterValue, index) => {
    const path = `$.spec.adapters[${index}]`;
    if (!isRecord(adapterValue)) {
      issues.push(
        issue("error", "adapter.type", path, "Expected an object."),
      );
      return;
    }

    if (
      typeof adapterValue.id !== "string" ||
      adapterValue.id.trim().length === 0
    ) {
      issues.push(
        issue("error", "adapter.id", `${path}.id`, "Expected a non-empty ID."),
      );
    } else if (seenIds.has(adapterValue.id)) {
      issues.push(
        issue(
          "error",
          "adapter.id.duplicate",
          `${path}.id`,
          `Duplicate adapter ID: ${adapterValue.id}`,
        ),
      );
    } else {
      seenIds.add(adapterValue.id);
    }

    if (
      typeof adapterValue.slot !== "string" ||
      !ADAPTER_SLOTS.includes(
        adapterValue.slot as (typeof ADAPTER_SLOTS)[number],
      )
    ) {
      issues.push(
        issue(
          "error",
          "adapter.slot",
          `${path}.slot`,
          `Expected one of: ${ADAPTER_SLOTS.join(", ")}`,
        ),
      );
    }

    if (
      typeof adapterValue.implementation !== "string" ||
      adapterValue.implementation.trim().length === 0
    ) {
      issues.push(
        issue(
          "error",
          "adapter.implementation",
          `${path}.implementation`,
          "Expected a versioned implementation name.",
        ),
      );
    }

    if (typeof adapterValue.required !== "boolean") {
      issues.push(
        issue(
          "error",
          "adapter.required",
          `${path}.required`,
          "Expected a boolean.",
        ),
      );
    }
  });

  return issues.every((current) => current.severity !== "error");
}

export function validateManifest(value: unknown): readonly ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!isRecord(value)) {
    return [
      issue("error", "manifest.type", "$", "Expected a JSON object."),
    ];
  }

  if (value.apiVersion !== API_VERSION) {
    issues.push(
      issue(
        "error",
        "manifest.apiVersion",
        "$.apiVersion",
        `Expected ${API_VERSION}.`,
      ),
    );
  }
  if (value.kind !== MANIFEST_KIND) {
    issues.push(
      issue(
        "error",
        "manifest.kind",
        "$.kind",
        `Expected ${MANIFEST_KIND}.`,
      ),
    );
  }

  if (!isRecord(value.metadata)) {
    issues.push(
      issue("error", "metadata.type", "$.metadata", "Expected an object."),
    );
  } else {
    if (
      typeof value.metadata.id !== "string" ||
      !/^[a-z0-9][a-z0-9-]*$/u.test(value.metadata.id)
    ) {
      issues.push(
        issue(
          "error",
          "metadata.id",
          "$.metadata.id",
          "Use lowercase letters, digits, and hyphens.",
        ),
      );
    }
    if (
      typeof value.metadata.name !== "string" ||
      value.metadata.name.trim().length === 0
    ) {
      issues.push(
        issue(
          "error",
          "metadata.name",
          "$.metadata.name",
          "Expected a non-empty project name.",
        ),
      );
    }
  }

  if (!isRecord(value.spec)) {
    issues.push(
      issue("error", "spec.type", "$.spec", "Expected an object."),
    );
    return issues;
  }

  const profileId = value.spec.profile;
  if (
    typeof profileId !== "string" ||
    !PROFILE_IDS.includes(profileId as ProfileId)
  ) {
    issues.push(
      issue(
        "error",
        "spec.profile",
        "$.spec.profile",
        `Expected one of: ${PROFILE_IDS.join(", ")}`,
      ),
    );
  }

  const capabilities = value.spec.capabilities;
  if (!Array.isArray(capabilities)) {
    issues.push(
      issue(
        "error",
        "capabilities.type",
        "$.spec.capabilities",
        "Expected an array.",
      ),
    );
  } else {
    const seenCapabilities = new Set<string>();
    capabilities.forEach((capability, index) => {
      if (!isCapability(capability)) {
        issues.push(
          issue(
            "error",
            "capability.unknown",
            `$.spec.capabilities[${index}]`,
            `Unknown capability: ${String(capability)}`,
          ),
        );
      } else if (seenCapabilities.has(capability)) {
        issues.push(
          issue(
            "error",
            "capability.duplicate",
            `$.spec.capabilities[${index}]`,
            `Duplicate capability: ${capability}`,
          ),
        );
      } else {
        seenCapabilities.add(capability);
      }
    });
  }

  validateAdapters(value.spec.adapters, issues);

  if (
    typeof value.spec.kitVersion !== "string" ||
    value.spec.kitVersion.trim().length === 0
  ) {
    issues.push(
      issue(
        "error",
        "spec.kitVersion",
        "$.spec.kitVersion",
        "Expected a non-empty kit version.",
      ),
    );
  }

  if (!isRecord(value.spec.content)) {
    issues.push(
      issue(
        "error",
        "content.type",
        "$.spec.content",
        "Expected an object.",
      ),
    );
  } else {
    if (
      typeof value.spec.content.canonicalStore !== "string" ||
      !CANONICAL_STORES.includes(
        value.spec.content
          .canonicalStore as (typeof CANONICAL_STORES)[number],
      )
    ) {
      issues.push(
        issue(
          "error",
          "content.canonicalStore",
          "$.spec.content.canonicalStore",
          `Expected one of: ${CANONICAL_STORES.join(", ")}`,
        ),
      );
    }
    if (
      typeof value.spec.content.representation !== "string" ||
      !CONTENT_REPRESENTATIONS.includes(
        value.spec.content
          .representation as (typeof CONTENT_REPRESENTATIONS)[number],
      )
    ) {
      issues.push(
        issue(
          "error",
          "content.representation",
          "$.spec.content.representation",
          `Expected one of: ${CONTENT_REPRESENTATIONS.join(", ")}`,
        ),
      );
    }
  }

  if (!isRecord(value.spec.governance)) {
    issues.push(
      issue(
        "error",
        "governance.type",
        "$.spec.governance",
        "Expected an object.",
      ),
    );
  } else {
    if (
      value.spec.governance.feedback !==
      "github-issues-and-pull-requests"
    ) {
      issues.push(
        issue(
          "error",
          "governance.feedback",
          "$.spec.governance.feedback",
          "Expected github-issues-and-pull-requests.",
        ),
      );
    }
    if (value.spec.governance.requireChangeRationale !== true) {
      issues.push(
        issue(
          "error",
          "governance.changeRationale",
          "$.spec.governance.requireChangeRationale",
          "Project overlays must require a recorded change rationale.",
        ),
      );
    }
    if (
      value.spec.governance.compatibilityPolicy !== "semver-and-migrations"
    ) {
      issues.push(
        issue(
          "error",
          "governance.compatibilityPolicy",
          "$.spec.governance.compatibilityPolicy",
          "Expected semver-and-migrations.",
        ),
      );
    }
  }

  if (!isRecord(value.spec.automation)) {
    issues.push(
      issue(
        "error",
        "automation.type",
        "$.spec.automation",
        "Expected an object.",
      ),
    );
  } else {
    if (
      value.spec.automation.provider !== "none" &&
      value.spec.automation.provider !== "agent-runtime" &&
      value.spec.automation.provider !== "custom"
    ) {
      issues.push(
        issue(
          "error",
          "automation.provider",
          "$.spec.automation.provider",
          "Expected none, agent-runtime, or custom.",
        ),
      );
    }
    if (
      value.spec.automation.mode !== "deferred" &&
      value.spec.automation.mode !== "enabled"
    ) {
      issues.push(
        issue(
          "error",
          "automation.mode",
          "$.spec.automation.mode",
          "Expected deferred or enabled.",
        ),
      );
    }
    if (
      !Array.isArray(value.spec.automation.activationCriteria) ||
      value.spec.automation.activationCriteria.some(
        (criterion) =>
          typeof criterion !== "string" || criterion.trim().length === 0,
      )
    ) {
      issues.push(
        issue(
          "error",
          "automation.activationCriteria",
          "$.spec.automation.activationCriteria",
          "Expected an array of non-empty criteria.",
        ),
      );
    }
  }

  if (typeof profileId === "string") {
    const profile = getProfile(profileId);
    if (profile !== undefined && Array.isArray(capabilities)) {
      const missing = profile.capabilities.filter(
        (required) => !capabilities.includes(required),
      );
      if (missing.length > 0) {
        issues.push(
          issue(
            "warning",
            "profile.capabilities.missing",
            "$.spec.capabilities",
            `Profile defaults removed: ${missing.join(", ")}. Document why this overlay differs.`,
          ),
        );
      }
    }
  }

  return issues;
}

export function formatManifest(
  manifest: PublishingProjectManifest,
): string {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}
