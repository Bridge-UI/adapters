/**
 * In-memory dictionary i18n adapter. Wire via `BridgeUIProvider` /
 * `createBridgeUI` `global.i18n`.
 *
 * Source English strings are the lookup keys. Messages are keyed by locale;
 * `setLocale` updates the locale used by `t` (Bridge `setLocale` syncs it).
 * `t` replaces `{{name}}` from `params` and picks `|` plural forms when
 * `count` is set (`one | other`).
 */

// ** External Imports
import { get, isNil } from "es-toolkit/compat";

// ** Core Imports
import {
  interpolateMessage,
  selectPluralMessage,
  type I18nAdapter,
} from "@bridge-ui/core/Adapters";

/**
 * Locale-keyed Bridge chrome strings (`source English` → translation).
 */
export type DictionaryI18nMessages = Record<string, Record<string, string>>;

/**
 * Default chrome-string dictionary (`en-US` and `pt-BR`).
 */
// prettier-ignore
export const defaultDictionaryI18nMessages: DictionaryI18nMessages = {
  "en-US": {
    "OK": "OK",
    "Hue": "Hue",
    "URL": "URL",
    "Next": "Next",
    "Date": "Date",
    "Size": "Size",
    "Bold": "Bold",
    "Link": "Link",
    "Apply": "Apply",
    "Close": "Close",
    "Reset": "Reset",
    "Value": "Value",
    "Share": "Share",
    "Other": "Other",
    "Alpha": "Alpha",
    "Clear": "Clear",
    "Today": "Today",
    "Cancel": "Cancel",
    "Slides": "Slides",
    "Search": "Search",
    "Legend": "Legend",
    "Series": "Series",
    "Italic": "Italic",
    "Columns": "Columns",
    "Loading": "Loading",
    "No data": "No data",
    "Carousel": "Carousel",
    "Previous": "Previous",
    "Category": "Category",
    "End time": "End time",
    "Last page": "Last page",
    "Heading 1": "Heading 1",
    "Heading 2": "Heading 2",
    "Heading 3": "Heading 3",
    "Next year": "Next year",
    "Underline": "Underline",
    "Next slide": "Next slide",
    "Loading...": "Loading...",
    "No options": "No options",
    "Pagination": "Pagination",
    "Expand row": "Expand row",
    "First page": "First page",
    "Select row": "Select row",
    "Blockquote": "Blockquote",
    "Code block": "Code block",
    "Formatting": "Formatting",
    "Next month": "Next month",
    "Next years": "Next years",
    "Start time": "Start time",
    "Bullet list": "Bullet list",
    "Select year": "Select year",
    "Ordered list": "Ordered list",
    "Select month": "Select month",
    "Hide password": "Hide password",
    "Show password": "Show password",
    "Filter column": "Filter column",
    "Rows per page": "Rows per page",
    "Previous year": "Previous year",
    "Resize panels": "Resize panels",
    "Strikethrough": "Strikethrough",
    "Previous slide": "Previous slide",
    "Sort ascending": "Sort ascending",
    "Cancel sorting": "Cancel sorting",
    "Previous month": "Previous month",
    "Previous years": "Previous years",
    "Clear selection": "Clear selection",
    "Decrement value": "Decrement value",
    "Increment value": "Increment value",
    "Select all rows": "Select all rows",
    "Sort descending": "Sort descending",
    "Slide {{index}}": "Slide {{index}}",
    "Select all items": "Select all items",
    "Select end month": "Select end month",
    "Go to slide {{index}}": "Go to slide {{index}}",
    "Saturation and brightness": "Saturation and brightness",
    "Page {{page}} of {{count}}": "Page {{page}} of {{count}}",
    "Slide {{index}} of {{count}}": "Slide {{index}} of {{count}}",
    "Pie chart with {{count}} slices: {{items}}.": "Pie chart with {{count}} slices: {{items}}.",
    "{{selected}} of {{total}} row(s) selected.": "{{selected}} of {{total}} row selected. | {{selected}} of {{total}} rows selected.",
    "Scatter chart with {{count}} series ({{names}}) and {{points}} points.": "Scatter chart with {{count}} series ({{names}}) and {{points}} points.",
    "Funnel chart with {{count}} stages, from {{first}} ({{firstValue}}) to {{last}} ({{lastValue}}).": "Funnel chart with {{count}} stages, from {{first}} ({{firstValue}}) to {{last}} ({{lastValue}}).",
    "Chart with {{count}} series ({{names}}) across {{categories}} categories, from {{first}} to {{last}}.": "Chart with {{count}} series ({{names}}) across {{categories}} categories, from {{first}} to {{last}}.",
  },
  "pt-BR": {
    "OK": "OK",
    "URL": "URL",
    "Date": "Data",
    "Hue": "Matiz",
    "Link": "Link",
    "Today": "Hoje",
    "Value": "Valor",
    "Close": "Fechar",
    "Next": "Próxima",
    "Bold": "Negrito",
    "Clear": "Limpar",
    "Other": "Outros",
    "Series": "Série",
    "Size": "Tamanho",
    "Apply": "Aplicar",
    "Slides": "Slides",
    "Legend": "Legenda",
    "Italic": "Itálico",
    "Columns": "Colunas",
    "Cancel": "Cancelar",
    "Reset": "Redefinir",
    "Alpha": "Opacidade",
    "Search": "Pesquisar",
    "No data": "Sem dados",
    "Previous": "Anterior",
    "Carousel": "Carrossel",
    "Loading": "Carregando",
    "Category": "Categoria",
    "Share": "Participação",
    "Blockquote": "Citação",
    "Heading 1": "Título 1",
    "Heading 2": "Título 2",
    "Heading 3": "Título 3",
    "Pagination": "Paginação",
    "Underline": "Sublinhado",
    "Formatting": "Formatação",
    "Next year": "Próximo ano",
    "Strikethrough": "Tachado",
    "End time": "Horário final",
    "Next month": "Próximo mês",
    "Last page": "Última página",
    "Next slide": "Próximo slide",
    "Loading...": "Carregando...",
    "No options": "Nenhuma opção",
    "Next years": "Próximos anos",
    "Expand row": "Expandir linha",
    "First page": "Primeira página",
    "Code block": "Bloco de código",
    "Previous year": "Ano anterior",
    "Select year": "Selecionar ano",
    "Start time": "Horário inicial",
    "Hide password": "Ocultar senha",
    "Select row": "Selecionar linha",
    "Show password": "Mostrar senha",
    "Ordered list": "Lista numerada",
    "Previous month": "Mês anterior",
    "Select month": "Selecionar mês",
    "Filter column": "Filtrar coluna",
    "Previous slide": "Slide anterior",
    "Clear selection": "Limpar seleção",
    "Decrement value": "Diminuir valor",
    "Increment value": "Aumentar valor",
    "Previous years": "Anos anteriores",
    "Rows per page": "Linhas por página",
    "Slide {{index}}": "Slide {{index}}",
    "Sort ascending": "Ordenar crescente",
    "Bullet list": "Lista com marcadores",
    "Cancel sorting": "Cancelar ordenação",
    "Sort descending": "Ordenar decrescente",
    "Resize panels": "Redimensionar painéis",
    "Select end month": "Selecionar mês final",
    "Select all items": "Selecionar todos os itens",
    "Select all rows": "Selecionar todas as linhas",
    "Saturation and brightness": "Saturação e brilho",
    "Go to slide {{index}}": "Ir para o slide {{index}}",
    "Page {{page}} of {{count}}": "Página {{page}} de {{count}}",
    "Slide {{index}} of {{count}}": "Slide {{index}} de {{count}}",
    "Pie chart with {{count}} slices: {{items}}.": "Gráfico de pizza com {{count}} fatias: {{items}}.",
    "{{selected}} of {{total}} row(s) selected.": "{{selected}} de {{total}} linha selecionada. | {{selected}} de {{total}} linhas selecionadas.",
    "Scatter chart with {{count}} series ({{names}}) and {{points}} points.": "Gráfico de dispersão com {{count}} séries ({{names}}) e {{points}} pontos.",
    "Funnel chart with {{count}} stages, from {{first}} ({{firstValue}}) to {{last}} ({{lastValue}}).": "Gráfico de funil com {{count}} etapas, de {{first}} ({{firstValue}}) a {{last}} ({{lastValue}}).",
    "Chart with {{count}} series ({{names}}) across {{categories}} categories, from {{first}} to {{last}}.": "Gráfico com {{count}} séries ({{names}}) em {{categories}} categorias, de {{first}} a {{last}}.",
  },
};

/**
 * Builds a locale-keyed dictionary {@link I18nAdapter} for Bridge chrome strings.
 * Unknown locales / messages fall back to the English source string.
 * Locale starts as `"en-US"` until {@link I18nAdapter.setLocale}.
 */
export function createDictionaryI18nAdapter(): I18nAdapter {
  let locale = "en-US";

  return {
    setLocale(next) {
      locale = next;
    },
    t(message, count, params) {
      const translated = get(
        defaultDictionaryI18nMessages,
        [locale, message],
        message,
      );
      const template = isNil(count)
        ? translated
        : selectPluralMessage(translated, count);

      return interpolateMessage(template, params);
    },
  };
}
