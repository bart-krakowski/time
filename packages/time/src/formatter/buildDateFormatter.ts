import { extractLocaleOptions } from "./extractLocaleOptions";
import type { IDateFormatterBuildParams } from "./shared";

export function buildDateFormatter({
  locale, 
  options
}: IDateFormatterBuildParams): Intl.DateTimeFormat {
  const opts = (typeof options === 'string') ? { dateStyle: options } : options ?? {};
  const {formatOptions = {}, ...localeOptions} = extractLocaleOptions(opts);
  const { dateStyle, ...rest } = formatOptions;
  const newOptions = {
    ...localeOptions,
    ...(dateStyle ? { dateStyle } : rest),
  };
  return new Intl.DateTimeFormat(locale, newOptions);
}