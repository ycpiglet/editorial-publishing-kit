# Extension points

Use the narrowest reusable layer that owns a difference.

| Layer | Use for | Example |
|---|---|---|
| Project overlay | A single project's policy or endpoint | Private visibility or a repository path |
| Profile | A recurring bundle of capabilities and adapters | Account-managed WYSIWYG manual portals |
| Adapter | Same domain meaning, different external system | Git HTML versus revisioned Postgres |
| Shared contract | Meaning used by every adapter and interface | Revision, suggestion anchor, asset lifecycle |
| Automation port | Coordination and workflow orchestration | Agent Runtime event bridge |

For a new adapter:

1. State the invariant shared with existing adapters.
2. Define inspect, load, stage, publish, rollback, and verification behavior as applicable.
3. Provide a deterministic fixture and failure cases.
4. Keep credentials out of project manifests.
5. Return revision, diff, warning, approval, and audit information through common contracts.
6. Document migrations and rollback before declaring the adapter stable.

For a new profile:

1. Cite at least one representative project.
2. Show why an overlay on an existing profile is insufficient.
3. Define capabilities, default adapters, canonical representation, and constraints.
4. Add recommendation keywords and tests.
5. Include adoption feedback that proves the profile reduces repeated work.

For Agent Runtime:

- Do not import it into domain or adapter contracts.
- Bridge only documented automation events.
- Pin a released runtime version.
- Preserve local CLI and CI operation when the runtime is absent.
- Record the adoption trigger in an ADR and verify that the trigger still applies.
