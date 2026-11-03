import type { Translate } from "@/ui/i18n";

/** Builds labelled options from domain values, reading `<namespace>.options.<value>`. */
export const toOptions = (values: readonly string[], namespace: string, t: Translate) =>
  values.map((value) => ({ value, label: t(`${namespace}.options.${value}`) }));
