# Profile selection

Choose the nearest behavioral baseline, then describe differences as a manifest overlay.

| Profile | Choose when | Canonical source | Main constraints |
|---|---|---|---|
| `wiki-web` | Authenticated users edit rich articles and Git preserves history | Git/HTML | Atomic multi-file commits; identity and Git credentials remain separate |
| `manual-portal` | Accounts, roles, WYSIWYG manuals, uploads, and operational resources share a portal | Revisioned Postgres/ProseMirror | Server-side policy; private upload staging |
| `technical-atlas` | Reviewers propose precise changes to math/code-heavy sources and publish web/PDF/EPUB | Git/Quarto | Lossless semantic round trip; stable block anchors |
| `local-tutorial` | Documents and generated artifact bundles stay local by default | Filesystem/mixed | No implicit upload; atomic local publication |
| `hybrid-docs` | A new documentation project needs web editing plus adapter-based exports | Hybrid/ProseMirror | Pick one canonical representation per content type |

Ask these questions only when the answer changes the profile:

1. What is the canonical content representation?
2. Who can edit directly, and who can only propose?
3. Are application accounts required, or is Git identity enough?
4. Which assets may become public, and when?
5. What must users download or export?
6. What is a managed resource rather than an editorial asset?
7. Which outputs must be published and verified?
8. What data must stay local or tenant-isolated?

Do not select a profile from visual resemblance alone. Select by canonical source, permission model, editorial interaction, and publication boundary.
