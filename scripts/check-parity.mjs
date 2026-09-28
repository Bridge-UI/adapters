// ** External Imports
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const srcDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "../src");

/** Framework-agnostic adapters: `react/` and `vue/` copies must match. */
const agnosticAdapters = [
  "date-date-fns",
  "date-dayjs",
  "date-luxon",
  "date-moment",
  "i18n-dictionary",
  "rich-text-tiptap",
];

/** Tests that legitimately differ between `react/` and `vue/`. */
const frameworkSpecificTests = ["icon-fontawesome"];

/**
 * Drops the leading file-header JSDoc, which may name framework-specific
 * wiring (`BridgeUIProvider` vs `createBridgeUI`).
 */
function withoutHeader(source) {
  return source.replace(/^\/\*\*[\s\S]*?\*\/\s*/, "");
}

function read(framework, file) {
  return withoutHeader(readFileSync(join(srcDir, framework, file), "utf8"));
}

const pairs = agnosticAdapters.map((name) => `${name}.ts`);

const reactTests = new Set(readdirSync(join(srcDir, "react/__tests__")));

for (const file of readdirSync(join(srcDir, "vue/__tests__"))) {
  const name = file.replace(/\.test\.ts$/, "");

  if (reactTests.has(file) && !frameworkSpecificTests.includes(name)) {
    pairs.push(`__tests__/${file}`);
  }
}

const drifted = pairs.filter((file) => {
  return read("react", file) !== read("vue", file);
});

if (drifted.length > 0) {
  console.error("react/ and vue/ copies drifted:");

  for (const file of drifted) {
    console.error(`  - ${file}`);
  }

  process.exit(1);
}

console.log(`${pairs.length} agnostic react/vue pairs in sync.`);
