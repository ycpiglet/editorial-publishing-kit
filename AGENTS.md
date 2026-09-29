# Editorial Publishing Kit contributor guide

Read `docs/ARCHITECTURE.md`, the relevant ADR, and `publishing.project.json` in generated projects before changing shared behavior.

## Sources of truth

- Domain and manifest contracts: `src/contracts.ts`
- Profile defaults and recommendation: `src/profiles.ts`
- Manifest composition/validation: `src/manifest.ts`
- Project generation and drift detection: `src/scaffold.ts`
- Interview scoring: `src/interview.ts`
- Local Studio server: `src/studio-server.ts`
- Interactive adoption UI: `studio/src/`
- Generated project assets: `templates/project/`
- Codex workflow: `skills/bootstrap-editorial-publishing/`

Do not edit `dist/`; it is generated. Change canonical sources and run `npm run verify`.

## Change ownership

- Keep one-project differences in a project manifest overlay.
- Add a profile default only for a recurring capability bundle.
- Add an adapter when domain meaning is stable and an external system differs.
- Change shared contracts only for recurring semantics and add migration notes.
- Keep Agent Runtime optional behind `AutomationPort`.

Preserve unrelated adopter behavior and local modifications. Never make template update logic overwrite a drifted managed file without an explicit plan and merge path.

## Verification

Run:

```bash
npm run verify
node dist/src/cli.js studio
python /home/keti-itp-01/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/bootstrap-editorial-publishing
```

If the Codex skill validator is unavailable outside this environment, `npm run check` still verifies the repository-owned skill contract.
