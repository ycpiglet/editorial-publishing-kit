import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { doctorProject, scaffoldProject } from "../src/scaffold.js";

test("scaffolds, validates, and detects intentional local drift", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "epk-test-"));
  const targetDir = path.join(temporaryRoot, "manual");
  const plan = await scaffoldProject({
    targetDir,
    id: "service-manual",
    name: "Service Manual",
    profile: "manual-portal",
    generatedAt: "2026-07-28T00:00:00.000Z",
  });

  assert.ok(plan.files.includes("publishing.project.json"));
  assert.ok(plan.files.includes(".github/PULL_REQUEST_TEMPLATE.md"));
  assert.equal((await doctorProject(targetDir)).ok, true);

  const decisionsPath = path.join(
    targetDir,
    "docs/editorial/DECISIONS.md",
  );
  const decisions = await readFile(decisionsPath, "utf8");
  await writeFile(decisionsPath, `${decisions}\nLocal reason: field workflow.\n`);

  const result = await doctorProject(targetDir);
  assert.equal(result.ok, true);
  assert.deepEqual(result.driftedFiles, ["docs/editorial/DECISIONS.md"]);
});

test("refuses to overwrite managed files", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "epk-test-"));
  const options = {
    targetDir: path.join(temporaryRoot, "wiki"),
    id: "team-wiki",
    name: "Team Wiki",
    profile: "wiki-web" as const,
    generatedAt: "2026-07-28T00:00:00.000Z",
  };
  await scaffoldProject(options);

  await assert.rejects(
    scaffoldProject(options),
    /Refusing to overwrite existing files/u,
  );
});
