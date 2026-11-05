// Test-only resolver: maps the "@/..." path alias to src/*.ts so route handlers can
// be imported by node:test without building the app.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcRoot = new URL("../../src/", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = new URL(specifier.slice(2), srcRoot);
    for (const candidate of [`${fileURLToPath(base)}.ts`, `${fileURLToPath(base)}.tsx`, fileURLToPath(base)]) {
      if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
    }
  }
  return nextResolve(specifier, context);
}
