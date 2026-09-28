/**
 * vue-i18n adapter. Wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Requires the optional `vue-i18n` peer.
 *
 * Passes Bridge source strings, `count`, and `params` to `i18n.t`.
 * Pass `vueI18n.global` (composition mode) or the result of `useI18n()`.
 */

// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Core Imports
import type { I18nAdapter } from "@bridge-ui/core/Adapters";

/**
 * The parts of a vue-i18n `Composer` the adapter uses. Structural so composers
 * typed from `createI18n({ messages })` (narrowed keys and locales) are accepted.
 */
export type VueI18nComposer = {
  locale: { value: string };
  t(key: string, ...args: unknown[]): string;
};

/**
 * Builds a vue-i18n-backed {@link I18nAdapter} for Bridge chrome strings.
 * Pass `vueI18n.global` (composition mode) or the result of `useI18n()`.
 */
export function createVueI18nAdapter(i18n: VueI18nComposer): I18nAdapter {
  return {
    setLocale(locale) {
      i18n.locale.value = locale;
    },
    t(message, count, params) {
      if (isNil(count)) {
        return params ? i18n.t(message, params) : i18n.t(message);
      }

      return params ? i18n.t(message, count, params) : i18n.t(message, count);
    },
  };
}
