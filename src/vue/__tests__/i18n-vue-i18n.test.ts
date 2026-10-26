// ** External Imports
import { expect, test } from "vitest";
import { createI18n } from "vue-i18n";

// ** Local Imports
import { createVueI18nAdapter } from "@/vue/i18n-vue-i18n";

test("it should forward messages to vue-i18n", () => {
  const vueI18n = createI18n({
    legacy: false,
    locale: "en-US",
    messages: {
      "en-US": { Close: "Close" },
      "pt-BR": { Close: "Fechar" },
    },
  });
  const adapter = createVueI18nAdapter(vueI18n.global);

  expect(adapter.t("Close")).toBe("Close");
  adapter.setLocale?.("pt-BR");
  expect(adapter.t("Close")).toBe("Fechar");
});

test("it should interpolate the params of plural messages", () => {
  const key = "{{selected}} of {{total}} row(s) selected.";
  const vueI18n = createI18n({
    legacy: false,
    locale: "pt-BR",
    messages: {
      "pt-BR": {
        [key]:
          "{selected} de {total} linha selecionada. | {selected} de {total} linhas selecionadas.",
      },
    },
  });
  const adapter = createVueI18nAdapter(vueI18n.global);

  expect(adapter.t(key, 1, { total: 50, selected: 1 })).toBe(
    "1 de 50 linha selecionada.",
  );
  expect(adapter.t(key, 2, { total: 50, selected: 2 })).toBe(
    "2 de 50 linhas selecionadas.",
  );
});

test("it should pick the plural form without params", () => {
  const vueI18n = createI18n({
    legacy: false,
    locale: "en-US",
    messages: { "en-US": { "{n} item": "{n} item | {n} items" } },
  });
  const adapter = createVueI18nAdapter(vueI18n.global);

  expect(adapter.t("{n} item", 1)).toBe("1 item");
  expect(adapter.t("{n} item", 3)).toBe("3 items");
});

test("it should interpolate the params without a count", () => {
  const vueI18n = createI18n({
    legacy: false,
    locale: "en-US",
    messages: { "en-US": { "Hello {name}": "Hello {name}" } },
  });
  const adapter = createVueI18nAdapter(vueI18n.global);

  expect(adapter.t("Hello {name}", undefined, { name: "Ana" })).toBe(
    "Hello Ana",
  );
});
