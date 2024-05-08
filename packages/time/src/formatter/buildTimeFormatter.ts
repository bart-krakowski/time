import { extractLocaleOptions } from "./extractLocaleOptions";
import type { ITimeFormatterBuildParams } from "./shared";

export function buildTimeFormatter({
  locale, 
  options
}: ITimeFormatterBuildParams): Intl.DateTimeFormat {
  const opts = (typeof options === 'string') ? { dateStyle: options } : options ?? {};
  const {formatOptions = {}, ...localeOptions} = extractLocaleOptions(opts);
  const { timeStyle, ...rest } = formatOptions;
  const newOptions = {
    ...localeOptions,
    ...(timeStyle ? { timeStyle } : rest),
  };
  return new Intl.DateTimeFormat(locale, newOptions);
}