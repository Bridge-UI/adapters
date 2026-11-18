# Bridge UI Adapters — agent instructions

This repository builds `@bridge-ui/adapters`: ready-made adapters for `@bridge-ui/react` and `@bridge-ui/vue`. Adapter contracts live in `@bridge-ui/core/Adapters` ([Bridge-UI/core](https://github.com/Bridge-UI/core)).

## Layout

```
src/
  react/<name>.ts        # one file per adapter → @bridge-ui/adapters/react/<name>
  react/__tests__/<name>.test.ts
  vue/<name>.ts          # → @bridge-ui/adapters/vue/<name>
  vue/__tests__/<name>.test.ts
```

- Every adapter lives under `react/` **and/or** `vue/`, including framework-agnostic ones. There is no root export.
- File names are kebab-case `{kind}-{lib}` (`date-dayjs`, `icon-lucide`). Each file is its own build entry and public subpath.
- No JSX or `.vue` SFCs: React adapters use `createElement`, Vue adapters use `h` / `defineComponent`.
- Depend only on `@bridge-ui/core` (peer) and `es-toolkit`. Never import from `@bridge-ui/react` or `@bridge-ui/vue`.
- Every third-party library is an **optional** peer in `package.json` (`peerDependencies` + `peerDependenciesMeta`) and a devDependency for tests.

## React/Vue parity

Framework-agnostic adapters (`date-*`, `i18n-dictionary`) and their tests exist in both folders. Any change must land in both copies in the same PR. `npm run check:parity` compares the pairs (ignoring the file-header JSDoc and the `@/react/` vs `@/vue/` import segment) and runs in CI.

New adapters ship under both `react/` and `vue/` unless the underlying library is framework-specific (e.g. `i18n-vue-i18n`).

## Import groups

Group all imports in this order, with a comment header per used group:

```ts
// ** External Imports
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { IconAdapter } from "@bridge-ui/core/Adapters";

// ** Local Imports
import { createLucideIconAdapter } from "@/react/icon-lucide";
```

- **External**: npm packages (`es-toolkit`, `dayjs`, `vitest`, …).
- **Core**: `@bridge-ui/core/*` subpaths — never the `@bridge-ui/core` barrel.
- **Local**: always the `@/` alias (→ `src/`), never relative paths. Tests import the adapter via `@/react/<name>` or `@/vue/<name>`.
- Omit empty groups; one blank line between groups; order within a group with Prettier.

## Tailwind

Adapters must not rely on consumers scanning this package with `@source`. Emit a named `bridge-*` class and style it in the `theme.css` of `@bridge-ui/react` / `@bridge-ui/vue`.

## Code style

- JSDoc on every exported function, type, and constant.
- Tests: Vitest, `test("it should ...")`; `describe()` allowed for grouped behavior.
- Prefer `es-toolkit/compat` utilities (`get`, `isNil`, `isString`, …).

## Scripts

```bash
npm run build         # dist/{react,vue}/*.js + .d.ts
npm run test:run
npm run lint
npm run type-check
npm run check:parity
npm run format:check
```

## Release

Independent semver. Bump `version` in `package.json`, merge to `main`, then publish a GitHub release with tag `v<version>`. The `release.yml` workflow has two jobs: **build** (version check, parity, build, tests, `npm pack`; no publish rights) and **publish** (environment `npm`, waits for a maintainer approval, then publishes the packed tarball via npm Trusted Publishing with provenance). Trusted Publisher on npm: repository `adapters`, workflow `release.yml`, environment `npm`.

## Supply chain

- `.npmrc` sets `ignore-scripts=true`; dependency install scripts never run.
- Actions are pinned by commit SHA; Dependabot bumps them and npm dependencies after a 7-day cooldown.
- `npm run check:supply-chain`: lockfile only from `registry.npmjs.org`, docs only install known packages, `npm audit signatures`.
- Pull requests run dependency review; workflow changes are audited by zizmor. See [SECURITY.md](SECURITY.md).
