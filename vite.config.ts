// ** External Imports
import { readdirSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const srcDir = resolve(__dirname, "src");

const frameworks = ["react", "vue"] as const;

/**
 * One lib entry per adapter file so each `./{react,vue}/<name>` subpath is
 * tree-shakable on its own.
 */
function collectLibEntries() {
  const entries: Record<string, string> = {};

  for (const framework of frameworks) {
    const dir = join(srcDir, framework);

    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".ts")) {
        continue;
      }

      entries[`${framework}/${name.replace(/\.ts$/, "")}`] = join(dir, name);
    }
  }

  return entries;
}

/**
 * Every bare import is a dependency or peer and stays out of the bundle.
 */
function isExternal(id: string) {
  return !id.startsWith(".") && !id.startsWith("@/") && !isAbsolute(id);
}

export default defineConfig({
  resolve: {
    alias: { "@": srcDir },
  },
  plugins: [
    dts({
      entryRoot: srcDir,
      tsconfigPath: "./tsconfig.json",
      include: ["src/**/*.ts"],
      exclude: ["src/**/__tests__/**"],
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: content.replace(/\{\n\}/g, "{}"),
      }),
    }),
  ],
  build: {
    lib: {
      formats: ["es"],
      entry: collectLibEntries(),
    },
    rollupOptions: {
      external: isExternal,
      checks: { pluginTimings: false },
      preserveEntrySignatures: "strict",
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
