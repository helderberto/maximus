export interface FormatRelativeTimeOptions {
  /**
   * The reference time.
   * @defaultValue `Date.now()`
   */
  now?: Date | number;
  /**
   * Any `Intl` locale, such as `'en'` or `'pt-BR'`.
   * @defaultValue the runtime locale
   */
  locale?: Intl.LocalesArgument;
}

const UNITS = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
  ['second', 1],
] as const;

/**
 * Formats a date relative to now, picking the largest fitting unit ("5 minutes ago", "tomorrow").
 * Uses `Intl.RelativeTimeFormat` with `numeric: 'auto'`. Months are 30 days and years 365.
 *
 * @param date - a `Date` or timestamp
 * @param options - `now` defaults to the current time; `locale` defaults to the runtime locale
 * @returns the formatted string, or `null` for an invalid date
 *
 * @example
 * formatRelativeTime(Date.now() - 5 * 60_000) // => '5 minutes ago'
 */
export const formatRelativeTime = (date: Date | number, options?: FormatRelativeTimeOptions): string | null => {
  const diffSeconds = (new Date(date).getTime() - new Date(options?.now ?? Date.now()).getTime()) / 1000;
  if (Number.isNaN(diffSeconds)) {
    return null;
  }
  const [unit, seconds] = UNITS.find(([, size]) => Math.abs(diffSeconds) >= size) ?? UNITS[UNITS.length - 1];
  const format = new Intl.RelativeTimeFormat(options?.locale, { numeric: 'auto' });
  return format.format(Math.round(diffSeconds / seconds), unit);
};
