# Security: avoid affected Git revisions

Historical versions of `eslint.config.mjs` contained an obfuscated remote-code loader. The affected file has Git blob SHA `2005a0a03b04e06840378dbd3ea508223f298bef`. The known-clean config restored in PR #10 has blob SHA `05e726d1b4201bc8c7716d2b058279676582e8c0`.

Before running npm, Node, ESLint, dev, build, test, or editor linting for this repository, run `git hash-object eslint.config.mjs` and verify that it matches the known-clean SHA above. If the hash is affected or unexpected, stop and inspect the config as text; do not execute project code until the difference has been reviewed. Start work from current `main` or a current branch tip whose config has been verified.

Do not check out and execute historical revisions containing the affected config. For historical review, use read-only commands such as `git show` and `git diff` without running project tools. PR #8 is closed and must not be revived or merged from an old head.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
