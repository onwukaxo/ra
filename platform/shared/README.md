Shared modules used by both client apps.

Rules:
- Only UI components, TypeScript types, and React hooks that are genuinely shared.
- No business logic or API-specific code.
- Prefer copy-first. Verify both apps build, then remove originals.
- Keep imports stable via `@shared/*` aliases.

