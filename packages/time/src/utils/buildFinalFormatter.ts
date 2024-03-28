import { validateDate } from "./validateDate";
import {parse as parser} from './parse';

export interface BuildFinalFormatterOptions {
  formatter: Intl.DateTimeFormat;
  formatterName: string;
  parse?: (value: string | number | Date) => Date | undefined;
  forRange?: boolean;
}

/**
 * buildFinalFormatter - takes an Intl.DateTimeFormat object and returns a
 * basic format function. When calling the format function, it will validate
 * the given input date(s) and return the formatted date string.
 */
export function buildFinalFormatter({
  formatter, 
  formatterName, 
  parse = parser, 
  forRange = false
}: BuildFinalFormatterOptions): (date: string | number | Date, date2?: string | number | Date) => string {
  return (date: string | number | Date, date2?: string | number | Date): string => {
    if (!date) return '';
    const trueDate = validateDate({date, parse, errorMessage: `[${formatterName}] date "${date}" is Invalid.`});
    if (!forRange || !date2) {
      return formatter.format(trueDate);
    }
    const endDate = validateDate({date: date2, parse, errorMessage: `[${formatterName}] second date "${date2}" is Invalid.`});
    return formatter.formatRange(trueDate, endDate);
  }
}
