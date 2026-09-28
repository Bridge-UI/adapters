// ** External Imports
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["**/dist/**", "**/coverage/**", "**/node_modules/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    plugins: {
      perfectionist,
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "perfectionist/sort-interfaces": [
        "error",
        {
          order: "asc" as const,
          type: "alphabetical" as const,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          order: "asc" as const,
          type: "alphabetical" as const,
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          order: "asc" as const,
          type: "line-length" as const,
          fallbackSort: {
            order: "asc" as const,
            type: "alphabetical" as const,
          },
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          order: "asc" as const,
          type: "line-length" as const,
        },
      ],
      "perfectionist/sort-arrays": [
        "error",
        {
          order: "asc" as const,
          type: "line-length" as const,
          useConfigurationIf: {
            matchesAstSelector: "TSAsExpression > ArrayExpression",
          },
          fallbackSort: {
            order: "asc" as const,
            type: "alphabetical" as const,
          },
        },
      ],
    },
  },
  eslintConfigPrettier,
);
