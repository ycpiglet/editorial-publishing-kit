---
name: bootstrap-editorial-publishing
description: Select, scaffold, validate, and evolve reusable editorial publishing projects with the Editorial Publishing Kit. Use when starting a wiki, WYSIWYG manual portal, technical or Quarto atlas, local tutorial, or hybrid documentation project; when adding shared editing, suggestion, account, upload/download, resource, or publication capabilities; or when deciding whether a project-specific customization should become an upstream profile, adapter, Issue, or PR.
---

# Bootstrap Editorial Publishing

Build from a versioned project profile and explicit adapters. Preserve each project's canonical source and deployment model while applying the same editorial safety contracts.

## Start or inspect a project

1. Read repository instructions and look for `publishing.project.json`.
2. If the manifest exists, run `epk doctor .` before editing managed files.
3. If no manifest exists, summarize the project's purpose, canonical content, author types, required outputs, account model, assets, and privacy constraints.
4. Prefer `epk studio` for a first-time adopter. Guide the user through the local interview, ranked recommendation, profile UI examples, and adoption desk. The Studio stores answers only in that browser.
5. When a browser UI is unavailable, run `epk recommend "<purpose>"` as the text fallback. Read [profile-selection.md](references/profile-selection.md) if the result is ambiguous.
6. Explain the chosen profile, recommendation reasons, trade-offs, and important constraints. Run the command produced by the Studio, or:

   ```bash
   epk init <directory> --name "<name>" --profile <profile>
   ```

   In the kit source repository, use `npm run epk --` before the arguments.

7. Never overwrite colliding files. Merge deliberately and record the rationale in `docs/editorial/DECISIONS.md`.
8. Run `epk doctor .` again and report managed-file drift separately from invalid contracts.

## Apply editorial changes

1. Pin the current document or resource revision.
2. Choose `direct` only when both user intent and project capability allow direct editing; otherwise create a proposal.
3. Anchor a proposal with a persistent block ID, revision, exact text, and prefix/suffix context.
4. Keep save and publish separate. Validate, preview, and show a diff before publication.
5. Treat uploads as private staging until type, size, safety, and metadata checks pass.
6. Quarantine referenced assets before deletion and keep restoration possible.
7. Separate login identity, project membership, and external publishing credentials.
8. Verify the published revision or artifact checksum after deployment.

Do not make a skill or agent bypass the project's API and adapter safety boundary to write directly to Git, a database, storage, or an account provider.

## Extend without forking the system

Read [extension-points.md](references/extension-points.md) before adding capabilities, adapters, or automation.

- Use a manifest overlay for a project-only policy.
- Add a profile default when the same capability set recurs across projects.
- Add an adapter when semantics stay constant but storage, rendering, identity, or deployment differs.
- Change a shared contract only when the meaning itself recurs.
- Keep Agent Runtime behind the automation port. Enable it only when the repository's recorded adoption criteria are met.

## Return improvements upstream

When users report friction, bugs, or local customization:

1. Capture the affected profile, kit version, task, user impact, reproduction, and local diff.
2. Remove secrets, private content, learner data, and personal information.
3. Classify the change as project-only, profile-wide, adapter-wide, or contract-wide.
4. Open the matching Issue before broad architectural work.
5. Link the Issue from the PR and include tests, migration impact, and why the default was insufficient.
6. Turn a repeated request into a conformance fixture or executable check whenever practical.
