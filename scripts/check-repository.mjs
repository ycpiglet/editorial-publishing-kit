import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const requiredFiles = [
  ".github/ISSUE_TEMPLATE/adoption-feedback.yml",
  ".github/ISSUE_TEMPLATE/bug.yml",
  ".github/ISSUE_TEMPLATE/feature.yml",
  ".github/ISSUE_TEMPLATE/profile-request.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  "CONTRIBUTING.md",
  "docs/ARCHITECTURE.md",
  "docs/PROJECT_PLAN.md",
  "schemas/publishing-project.schema.json",
  "skills/bootstrap-editorial-publishing/SKILL.md",
  "skills/bootstrap-editorial-publishing/agents/openai.yaml",
  "templates/project/AGENTS.md.tmpl",
];

for (const relativePath of requiredFiles) {
  await access(path.join(root, relativePath));
}

const packageJson = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8"),
);
assert.equal(packageJson.license, "Apache-2.0");
assert.equal(packageJson.bin.epk, "dist/src/cli.js");

const schema = JSON.parse(
  await readFile(
    path.join(root, "schemas/publishing-project.schema.json"),
    "utf8",
  ),
);
assert.equal(schema.properties.kind.const, "PublishingProject");

const skill = await readFile(
  path.join(root, "skills/bootstrap-editorial-publishing/SKILL.md"),
  "utf8",
);
assert.match(skill, /^---\nname: bootstrap-editorial-publishing\n/u);
assert.doesNotMatch(skill, /\bTODO\b/u);

const agentMetadata = await readFile(
  path.join(
    root,
    "skills/bootstrap-editorial-publishing/agents/openai.yaml",
  ),
  "utf8",
);
assert.match(agentMetadata, /\$bootstrap-editorial-publishing/u);

for (const relativePath of [
  ".github/ISSUE_TEMPLATE/adoption-feedback.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
]) {
  const content = await readFile(path.join(root, relativePath), "utf8");
  assert.match(content, /why|Why|rationale|이유/u);
}

process.stdout.write("Repository contract checks passed.\n");
