import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const approved = {
  "eslint.config.mjs": "870f1adccecf3051cbcd9fd307cef51d7633cf510979c181a81f4b1797273493",
  "next.config.ts": "614bce25b089c3f19b1e17a6346c74b858034040154c6621e7d35303004767cc",
};

// Read configuration as data. Never import or execute it to validate it.
export function verifyConfigIntegrity(root) {
  for (const [name, expected] of Object.entries(approved)) {
    const actual = createHash("sha256").update(readFileSync(resolve(root, name))).digest("hex");
    if (actual !== expected) {
      throw new Error(name + " differs from the reviewed configuration. Stop and inspect it without executing it. Update this baseline only after a security review.");
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    verifyConfigIntegrity(fileURLToPath(new URL("../", import.meta.url)));
    console.log("Configuration integrity check passed.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
