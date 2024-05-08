import { extractLocaleOptions } from "./extractLocaleOptions";
import type { IDateTimeFormatterBuildParams } from "./shared";

export function buildTimeFormatter({
  locale, 
  options
}: IDateTimeFormatterBuildParams): Intl.DateTimeFormat {
  const opts = (typeof options === 'string') ? { dateStyle: options, timeStyle: options } : options ?? {};
  const {formatOptions = {}, ...localeOptions} = extractLocaleOptions(opts);
  const { dateStyle, timeStyle, ...rest } = formatOptions;
  const newOptions = {
    ...localeOptions,
    ...(dateStyle && timeStyle ? { dateStyle, timeStyle } : rest),
  };
  return new Intl.DateTimeFormat(locale, newOptions);
}