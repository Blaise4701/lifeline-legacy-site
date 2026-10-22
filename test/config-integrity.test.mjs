import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, copyFileSync, appendFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyConfigIntegrity } from "../scripts/check-config-integrity.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
test("approved configuration passes without importing it", () => verifyConfigIntegrity(root));
for (const name of ["eslint.config.mjs", "next.config.ts"]) {
  test("rejects appended executable content in " + name, () => {
    const fixture = mkdtempSync(join(tmpdir(), "llfg-config-"));
    try {
      for (const file of ["eslint.config.mjs", "next.config.ts"]) copyFileSync(join(root, file), join(fixture, file));
      appendFileSync(join(fixture, name), '\nthrow new Error("This code must never execute");\n');
      assert.throws(() => verifyConfigIntegrity(fixture), /differs from the reviewed configuration/);
    } finally { rmSync(fixture, { recursive: true, force: true }); }
  });
}
