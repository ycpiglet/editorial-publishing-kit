import { createHash } from "node:crypto";
import {
  access,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  KIT_VERSION,
  type ProfileId,
  type PublishingProjectManifest,
  type ValidationIssue,
} from "./contracts.js";
import {
  composeManifest,
  formatManifest,
  validateManifest,
} from "./manifest.js";

const TEMPLATE_ROOT = fileURLToPath(
  new URL("../../templates/project/", import.meta.url),
);

export interface ScaffoldOptions {
  readonly targetDir: string;
  readonly name: string;
  readonly id: string;
  readonly profile: ProfileId;
  readonly dryRun?: boolean;
  readonly generatedAt?: string;
}

export interface ScaffoldPlan {
  readonly targetDir: string;
  readonly manifest: PublishingProjectManifest;
  readonly files: readonly string[];
}

export interface TemplateState {
  readonly schemaVersion: 1;
  readonly kitVersion: string;
  readonly profile: ProfileId;
  readonly generatedAt: string;
  readonly managedFiles: Readonly<Record<string, string>>;
}

export interface DoctorResult {
  readonly ok: boolean;
  readonly manifestIssues: readonly ValidationIssue[];
  readonly driftedFiles: readonly string[];
  readonly missingFiles: readonly string[];
}

function checksum(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectTemplateFiles(
  directory = TEMPLATE_ROOT,
  prefix = "",
): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const collected: string[] = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      collected.push(
        ...(await collectTemplateFiles(
          path.join(directory, entry.name),
          relativePath,
        )),
      );
    } else if (entry.isFile()) {
      collected.push(relativePath);
    }
  }
  return collected.sort();
}

function outputPathForTemplate(templatePath: string): string {
  return templatePath.endsWith(".tmpl")
    ? templatePath.slice(0, -".tmpl".length)
    : templatePath;
}

function renderTemplate(
  content: string,
  replacements: Readonly<Record<string, string>>,
): string {
  return content.replace(/\{\{([A-Z_]+)\}\}/gu, (match, key: string) => {
    return replacements[key] ?? match;
  });
}

async function buildFiles(
  options: ScaffoldOptions,
): Promise<{
  readonly manifest: PublishingProjectManifest;
  readonly files: ReadonlyMap<string, string>;
  readonly state: TemplateState;
}> {
  const manifest = composeManifest({
    id: options.id,
    name: options.name,
    profile: options.profile,
  });
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const replacements = {
    PROJECT_ID: options.id,
    PROJECT_NAME: options.name,
    PROFILE: options.profile,
  };
  const files = new Map<string, string>();
  files.set("publishing.project.json", formatManifest(manifest));

  for (const templatePath of await collectTemplateFiles()) {
    const content = await readFile(
      path.join(TEMPLATE_ROOT, templatePath),
      "utf8",
    );
    files.set(
      outputPathForTemplate(templatePath),
      renderTemplate(content, replacements),
    );
  }

  const managedFiles = Object.fromEntries(
    [...files.entries()].map(([relativePath, content]) => [
      relativePath,
      checksum(content),
    ]),
  );
  const state: TemplateState = {
    schemaVersion: 1,
    kitVersion: KIT_VERSION,
    profile: options.profile,
    generatedAt,
    managedFiles,
  };
  files.set(".epk/state.json", `${JSON.stringify(state, null, 2)}\n`);
  return { manifest, files, state };
}

export async function planScaffold(
  options: ScaffoldOptions,
): Promise<ScaffoldPlan> {
  const targetDir = path.resolve(options.targetDir);
  const { manifest, files } = await buildFiles(options);
  return {
    targetDir,
    manifest,
    files: [...files.keys()].sort(),
  };
}

export async function scaffoldProject(
  options: ScaffoldOptions,
): Promise<ScaffoldPlan> {
  const targetDir = path.resolve(options.targetDir);
  const built = await buildFiles(options);
  const collisions: string[] = [];
  for (const relativePath of built.files.keys()) {
    if (await exists(path.join(targetDir, relativePath))) {
      collisions.push(relativePath);
    }
  }
  if (collisions.length > 0) {
    throw new Error(
      `Refusing to overwrite existing files:\n${collisions
        .map((file) => `- ${file}`)
        .join("\n")}`,
    );
  }

  const plan: ScaffoldPlan = {
    targetDir,
    manifest: built.manifest,
    files: [...built.files.keys()].sort(),
  };
  if (options.dryRun === true) {
    return plan;
  }

  for (const [relativePath, content] of built.files.entries()) {
    const destination = path.join(targetDir, relativePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content, { encoding: "utf8", flag: "wx" });
  }
  return plan;
}

export async function doctorProject(targetDir: string): Promise<DoctorResult> {
  const resolvedTarget = path.resolve(targetDir);
  const manifestPath = path.join(resolvedTarget, "publishing.project.json");
  let manifestIssues: readonly ValidationIssue[];
  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as unknown;
    manifestIssues = validateManifest(manifest);
  } catch (error) {
    manifestIssues = [
      {
        severity: "error",
        code: "manifest.read",
        path: "$",
        message:
          error instanceof Error
            ? error.message
            : "Could not read publishing.project.json.",
      },
    ];
  }

  const driftedFiles: string[] = [];
  const missingFiles: string[] = [];
  try {
    const state = JSON.parse(
      await readFile(path.join(resolvedTarget, ".epk/state.json"), "utf8"),
    ) as Partial<TemplateState>;
    const managedFiles = state.managedFiles ?? {};
    for (const [relativePath, expectedChecksum] of Object.entries(
      managedFiles,
    )) {
      const managedPath = path.join(resolvedTarget, relativePath);
      try {
        const content = await readFile(managedPath, "utf8");
        if (checksum(content) !== expectedChecksum) {
          driftedFiles.push(relativePath);
        }
      } catch {
        missingFiles.push(relativePath);
      }
    }
  } catch (error) {
    manifestIssues = [
      ...manifestIssues,
      {
        severity: "warning",
        code: "state.read",
        path: "$.epk",
        message:
          error instanceof Error
            ? error.message
            : "Could not read .epk/state.json.",
      },
    ];
  }

  return {
    ok:
      manifestIssues.every((current) => current.severity !== "error") &&
      missingFiles.length === 0,
    manifestIssues,
    driftedFiles: driftedFiles.sort(),
    missingFiles: missingFiles.sort(),
  };
}
