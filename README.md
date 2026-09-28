<p align="center">
<img src="https://raw.githubusercontent.com/Bridge-UI/docs/main/assets/logo-main.svg" height="100" alt="Bridge UI logo">
</p>

<h2><p align="center">BridgeUI Adapters</p></h2>

<p align="center">
<a href="https://github.com/Bridge-UI/adapters/actions"><img src="https://github.com/Bridge-UI/adapters/actions/workflows/ci.yml/badge.svg" alt="Tests"></a>
<a href="LICENSE.md"><img src="https://img.shields.io/github/license/Bridge-UI/adapters" alt="License" /></a>
</p>

### 🚀 Introduction

`@bridge-ui/adapters` ships ready-made **date**, **icon**, **i18n**, and **rich-text** adapters for [`@bridge-ui/react`](https://www.npmjs.com/package/@bridge-ui/react) and [`@bridge-ui/vue`](https://www.npmjs.com/package/@bridge-ui/vue). Adapters implement the contracts from `@bridge-ui/core/Adapters` and are wired through `BridgeUIProvider` (React) or `createBridgeUI` (Vue) `global.*`.

Every adapter lives under a `react/` or `vue/` subpath — including framework-agnostic ones — so imports always follow `@bridge-ui/adapters/{react,vue}/<name>`.

### 📦 Install

```bash
npm install @bridge-ui/adapters
```

Then install the optional peer of each adapter you use (e.g. `dayjs`, `lucide-react`, `@tiptap/*`). Only `@bridge-ui/core` is a required peer; it is already installed with `@bridge-ui/react` / `@bridge-ui/vue`.

### 🔌 Usage

React:

```tsx
import { createDayjsDateAdapter } from "@bridge-ui/adapters/react/date-dayjs";
import { createLucideIconAdapter } from "@bridge-ui/adapters/react/icon-lucide";
import { BridgeUIProvider } from "@bridge-ui/react";

<BridgeUIProvider
  global={{
    icons: createLucideIconAdapter(),
    dates: createDayjsDateAdapter(),
  }}
>
  <App />
</BridgeUIProvider>;
```

Vue:

```ts
import { createDayjsDateAdapter } from "@bridge-ui/adapters/vue/date-dayjs";
import { createLucideIconAdapter } from "@bridge-ui/adapters/vue/icon-lucide";
import { createBridgeUI } from "@bridge-ui/vue";

app.use(
  createBridgeUI({
    global: {
      icons: createLucideIconAdapter(),
      dates: createDayjsDateAdapter(),
    },
  }),
);
```

### 🧩 Adapters

| Adapter            | Factory                        | `react/` peers                                               | `vue/` peers                          |
| ------------------ | ------------------------------ | ------------------------------------------------------------ | ------------------------------------- |
| `date-date-fns`    | `createDateFnsDateAdapter`     | `date-fns`                                                   | `date-fns`                            |
| `date-dayjs`       | `createDayjsDateAdapter`       | `dayjs`                                                      | `dayjs`                               |
| `date-luxon`       | `createLuxonDateAdapter`       | `luxon`                                                      | `luxon`                               |
| `date-moment`      | `createMomentDateAdapter`      | `moment` (+ `moment-timezone`)                               | `moment` (+ `moment-timezone`)        |
| `i18n-dictionary`  | `createDictionaryI18nAdapter`  | —                                                            | —                                     |
| `i18n-i18next`     | `createI18nextAdapter`         | `i18next`                                                    | —                                     |
| `i18n-vue-i18n`    | `createVueI18nAdapter`         | —                                                            | `vue-i18n`                            |
| `icon-lucide`      | `createLucideIconAdapter`      | `lucide-react`                                               | `@lucide/vue`                         |
| `icon-heroicons`   | `createHeroiconsIconAdapter`   | `@heroicons/react`                                           | `@heroicons/vue`                      |
| `icon-tabler`      | `createTablerIconAdapter`      | `@tabler/icons-react`                                        | `@tabler/icons-vue`                   |
| `icon-phosphor`    | `createPhosphorIconAdapter`    | `@phosphor-icons/react`                                      | `@phosphor-icons/vue`                 |
| `icon-fontawesome` | `createFontAwesomeIconAdapter` | `@fortawesome/react-fontawesome` + core                      | `@fortawesome/vue-fontawesome` + core |
| `rich-text-tiptap` | `createTiptapRichTextAdapter`  | `@tiptap/core`, `pm`, `starter-kit`, `extension-placeholder` | same                                  |

Font Awesome also needs `@fortawesome/fontawesome-svg-core` and `@fortawesome/free-solid-svg-icons`.

### 🎨 Tailwind

No extra `@source` is needed. `rich-text-tiptap` only emits the `bridge-rich-text-editable` class, which is styled by the `theme.css` of `@bridge-ui/react` / `@bridge-ui/vue`.

### 🔁 Migrating from `Adapters/Examples`

Adapters used to ship as `@bridge-ui/{react,vue}/Adapters/Examples/*`. Swap the import prefix; factory names are unchanged:

| Before                                      | After                              |
| ------------------------------------------- | ---------------------------------- |
| `@bridge-ui/react/Adapters/Examples/<name>` | `@bridge-ui/adapters/react/<name>` |
| `@bridge-ui/vue/Adapters/Examples/<name>`   | `@bridge-ui/adapters/vue/<name>`   |

Move the adapter peers (date libs, icon sets, i18n, Tiptap) to your app dependencies if they were only installed for the old subpaths.

### 🔧 Contributing

```bash
npm install
npm run build
npm run test:run
npm run lint
npm run type-check
npm run check:parity
```

Framework-agnostic adapters (`date-*`, `i18n-dictionary`, `rich-text-tiptap`) and their tests exist in both `src/react/` and `src/vue/`. Change both copies in the same PR — `npm run check:parity` fails when they drift. See [`AGENTS.md`](./AGENTS.md) for code conventions.

### 📝 License

Bridge UI Adapters is open-source software licensed under the [MIT license](LICENSE.md).
