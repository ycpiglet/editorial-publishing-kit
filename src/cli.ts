#!/usr/bin/env node

import path from "node:path";
import { pathToFileURL } from "node:url";
import { PROFILE_IDS, type ProfileId } from "./contracts.js";
import { doctorProject, scaffoldProject } from "./scaffold.js";
import {
  getProfile,
  listProfiles,
  recommendProfiles,
} from "./profiles.js";
import { serveStudio } from "./studio-server.js";

const USAGE = `Editorial Publishing Kit

Usage:
  epk profile list
  epk profile show <profile>
  epk recommend <project purpose>
  epk init <directory> --profile <profile> [--name <name>] [--id <id>] [--dry-run]
  epk doctor [directory]
  epk studio [--port <port>]

Profiles:
  ${PROFILE_IDS.join(", ")}
`;

function option(args: readonly string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  return slug.length > 0 ? slug : "publishing-project";
}

function printProfiles(): void {
  for (const profile of listProfiles()) {
    process.stdout.write(
      `${profile.id.padEnd(18)} ${profile.title}\n  ${profile.summary}\n`,
    );
  }
}

async function run(args: readonly string[]): Promise<number> {
  const [command, subcommand, ...rest] = args;
  if (
    command === undefined ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
    process.stdout.write(USAGE);
    return 0;
  }

  if (command === "profile" && subcommand === "list") {
    printProfiles();
    return 0;
  }

  if (command === "profile" && subcommand === "show") {
    const id = rest[0];
    const profile = id === undefined ? undefined : getProfile(id);
    if (profile === undefined) {
      process.stderr.write(`Unknown profile: ${id ?? "(missing)"}\n`);
      return 2;
    }
    process.stdout.write(`${JSON.stringify(profile, null, 2)}\n`);
    return 0;
  }

  if (command === "recommend") {
    const purpose = [subcommand, ...rest].filter(Boolean).join(" ").trim();
    if (purpose.length === 0) {
      process.stderr.write("Describe the project purpose after recommend.\n");
      return 2;
    }
    const recommendations = recommendProfiles(purpose);
    const first = recommendations[0];
    if (first === undefined) {
      process.stderr.write("No profiles are registered.\n");
      return 1;
    }
    process.stdout.write(
      `Recommended: ${first.profile.id} — ${first.profile.title}\n${first.profile.summary}\n`,
    );
    if (first.matchedTerms.length > 0) {
      process.stdout.write(`Matched: ${first.matchedTerms.join(", ")}\n`);
    } else {
      process.stdout.write(
        "No specific profile signals matched; using the balanced default.\n",
      );
    }
    process.stdout.write("\nAlternatives:\n");
    for (const item of recommendations.slice(1, 3)) {
      process.stdout.write(`- ${item.profile.id}: ${item.profile.summary}\n`);
    }
    return 0;
  }

  if (command === "init") {
    const target = subcommand;
    if (target === undefined || target.startsWith("--")) {
      process.stderr.write("Provide a target directory.\n");
      return 2;
    }
    const profileValue = option(rest, "--profile");
    const profile = getProfile(profileValue ?? "");
    if (profile === undefined) {
      process.stderr.write(
        `Provide --profile with one of: ${PROFILE_IDS.join(", ")}\n`,
      );
      return 2;
    }
    const resolvedTarget = path.resolve(target);
    const name = option(rest, "--name") ?? path.basename(resolvedTarget);
    const id = option(rest, "--id") ?? slugify(name);
    const plan = await scaffoldProject({
      targetDir: resolvedTarget,
      name,
      id,
      profile: profile.id as ProfileId,
      dryRun: rest.includes("--dry-run"),
    });
    process.stdout.write(
      `${rest.includes("--dry-run") ? "Would create" : "Created"} ${
        plan.files.length
      } files in ${plan.targetDir}\n`,
    );
    for (const file of plan.files) {
      process.stdout.write(`- ${file}\n`);
    }
    return 0;
  }

  if (command === "studio") {
    const studioArgs =
      subcommand === undefined ? rest : [subcommand, ...rest];
    const portValue = option(studioArgs, "--port");
    const port = portValue === undefined ? 4317 : Number(portValue);
    if (
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535
    ) {
      process.stderr.write("--port must be an integer from 1 to 65535.\n");
      return 2;
    }
    const running = await serveStudio({ port });
    process.stdout.write(
      `Profile Studio ready at ${running.url}\nAnswers stay in this browser. Press Ctrl+C to stop.\n`,
    );
    await new Promise<void>((resolve) => {
      let closing = false;
      const shutdown = () => {
        if (closing) {
          return;
        }
        closing = true;
        void running.close().finally(resolve);
      };
      process.once("SIGINT", shutdown);
      process.once("SIGTERM", shutdown);
    });
    return 0;
  }

  if (command === "doctor") {
    const target =
      subcommand === undefined || subcommand.startsWith("--")
        ? process.cwd()
        : subcommand;
    const result = await doctorProject(target);
    for (const current of result.manifestIssues) {
      process.stdout.write(
        `${current.severity.toUpperCase()} ${current.path} ${current.message}\n`,
      );
    }
    for (const file of result.driftedFiles) {
      process.stdout.write(
        `NOTICE ${file} differs from the generated baseline; record why before upstreaming.\n`,
      );
    }
    for (const file of result.missingFiles) {
      process.stdout.write(`ERROR managed file is missing: ${file}\n`);
    }
    process.stdout.write(
      result.ok ? "Project contract is valid.\n" : "Project contract failed.\n",
    );
    return result.ok ? 0 : 1;
  }

  process.stderr.write(USAGE);
  return 2;
}

export async function main(args = process.argv.slice(2)): Promise<void> {
  try {
    process.exitCode = await run(args);
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}

const entry = process.argv[1];
if (entry !== undefined && import.meta.url === pathToFileURL(entry).href) {
  await main();
}
