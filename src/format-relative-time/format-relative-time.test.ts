import { formatRelativeTime } from './format-relative-time';

const now = new Date('2026-06-15T12:00:00Z');
const at = (offsetMs: number) => new Date(now.getTime() + offsetMs);
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe('formatRelativeTime', () => {
  it.each([
    [-30 * SECOND, '30 seconds ago'],
    [-5 * MINUTE, '5 minutes ago'],
    [3 * HOUR, 'in 3 hours'],
    [-DAY, 'yesterday'],
    [2 * DAY, 'in 2 days'],
    [-14 * DAY, '2 weeks ago'],
    [-60 * DAY, '2 months ago'],
    [400 * DAY, 'next year'],
    [0, 'now'],
  ])('formats an offset of %i ms as %s', (offset, expected) => {
    expect(formatRelativeTime(at(offset), { now, locale: 'en' })).toBe(expected);
  });

  it('accepts timestamps', () => {
    expect(formatRelativeTime(now.getTime() - 2 * HOUR, { now, locale: 'en' })).toBe('2 hours ago');
  });

  it('uses the locale', () => {
    expect(formatRelativeTime(at(-DAY), { now, locale: 'pt-BR' })).toBe('ontem');
  });

  it('returns null for an invalid date', () => {
    expect(formatRelativeTime(new Date('nope'), { now })).toBeNull();
  });

  it('defaults now to the current time', () => {
    expect(formatRelativeTime(Date.now() - 3 * MINUTE, { locale: 'en' })).toBe('3 minutes ago');
  });
});
