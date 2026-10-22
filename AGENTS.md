# Security: review configuration before execution

Before installing dependencies or running project commands, inspect `eslint.config.mjs` and `next.config.ts` as text. Historical branches contain obfuscated executable loaders in both files. Do not import them to inspect them.

Approved SHA-256 values:
- `eslint.config.mjs`: `870f1adccecf3051cbcd9fd307cef51d7633cf510979c181a81f4b1797273493`
- `next.config.ts`: `614bce25b089c3f19b1e17a6346c74b858034040154c6621e7d35303004767cc`

Use `sha256sum eslint.config.mjs next.config.ts` before any project tooling. If a hash differs, stop and review the difference without execution. Do not restore old configurations during merges or cherry-picks. Use dependency installation with lifecycle scripts disabled for initial review. Preserve the predev, prebuild, and prelint integrity checks. Updating a baseline requires a deliberate static security review.

For historical investigation use `git show` or `git diff`, not checkout followed by execution. Old dormant branches remain potentially unsafe.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
