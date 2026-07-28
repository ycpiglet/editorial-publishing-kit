import assert from "node:assert/strict";
import test from "node:test";
import { PROFILE_IDS } from "../src/contracts.js";
import { composeManifest, validateManifest } from "../src/manifest.js";

test("composes a valid manifest for every profile", () => {
  for (const profile of PROFILE_IDS) {
    const manifest = composeManifest({
      id: `example-${profile}`,
      name: `Example ${profile}`,
      profile,
    });

    assert.equal(manifest.spec.profile, profile);
    assert.equal(manifest.spec.automation.mode, "deferred");
    assert.deepEqual(validateManifest(manifest), []);
  }
});

test("reports invalid IDs and unknown capabilities", () => {
  const manifest = composeManifest({
    id: "valid-id",
    name: "Valid Name",
    profile: "wiki-web",
  });
  const invalid = {
    ...manifest,
    metadata: { ...manifest.metadata, id: "Not Valid" },
    spec: {
      ...manifest.spec,
      capabilities: [...manifest.spec.capabilities, "unknown:capability"],
    },
  };
  const issues = validateManifest(invalid);

  assert.ok(issues.some((current) => current.code === "metadata.id"));
  assert.ok(issues.some((current) => current.code === "capability.unknown"));
});

test("rejects weakened governance and invalid automation", () => {
  const manifest = composeManifest({
    id: "valid-id",
    name: "Valid Name",
    profile: "wiki-web",
  });
  const invalid = {
    ...manifest,
    spec: {
      ...manifest.spec,
      governance: {
        ...manifest.spec.governance,
        requireChangeRationale: false,
      },
      automation: {
        ...manifest.spec.automation,
        provider: "magic",
      },
    },
  };
  const issues = validateManifest(invalid);

  assert.ok(
    issues.some((current) => current.code === "governance.changeRationale"),
  );
  assert.ok(issues.some((current) => current.code === "automation.provider"));
});
