import type { ConvertKeys, ConvertKeysOptions, Depth, KeyCase } from './types';

const SEPARATORS = new Set(['_', '-', ' ']);

const isUpper = (char: string): boolean => char !== char.toLowerCase();

// Mirrors `SplitWords` in types.ts, one UTF-16 unit at a time, so runtime keys match the inferred ones.
const splitWords = (key: string): string[] => {
  const words: string[] = [];
  let word = '';
  let prev = '';
  for (let index = 0; index < key.length; index++) {
    const char = key.charAt(index);
    if (SEPARATORS.has(char)) {
      if (word) {
        words.push(word);
      }
      word = '';
    } else if (isUpper(char) && prev !== '' && !SEPARATORS.has(prev) && !isUpper(prev)) {
      if (word) {
        words.push(word);
      }
      word = char;
    } else {
      word += char;
    }
    prev = char;
  }
  if (word) {
    words.push(word);
  }
  return words;
};

const capitalize = (word: string): string => {
  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const joinInCase = (words: string[], keyCase: KeyCase): string => {
  switch (keyCase) {
    case 'camelCase':
      return words.map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word))).join('');
    case 'PascalCase':
      return words.map(capitalize).join('');
    case 'snake_case':
      return words.map((word) => word.toLowerCase()).join('_');
    case 'kebab-case':
      return words.map((word) => word.toLowerCase()).join('-');
    case 'CONSTANT_CASE':
      return words.map((word) => word.toUpperCase()).join('_');
  }
};

export const convertKey = (key: string, keyCase: KeyCase): string => {
  const prefix = /^_*/.exec(key)?.[0] ?? '';
  return prefix + joinInCase(splitWords(key.slice(prefix.length)), keyCase);
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

interface Walk {
  to: KeyCase;
  depth: number;
  /** Keys already converted in this call. API responses repeat the same keys across items. */
  cache: Map<string, string>;
}

const convertCached = (key: string, { to, cache }: Walk): string => {
  let converted = cache.get(key);
  if (converted === undefined) {
    converted = convertKey(key, to);
    cache.set(key, converted);
  }
  return converted;
};

const convertLevels = (value: unknown, walk: Walk): unknown => {
  if (Array.isArray(value)) {
    return value.map((item: unknown) => convertLevels(item, walk));
  }
  if (walk.depth < 1 || !isPlainObject(value)) {
    return value;
  }
  const next = { ...walk, depth: walk.depth - 1 };
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    // Safe to assign: a converted key never ends in `_`, so it can never be `__proto__`.
    result[convertCached(key, walk)] = convertLevels(value[key], next);
  }
  return result;
};

/**
 * Returns a copy of a value with its keys in another case: camelCase, PascalCase, snake_case,
 * kebab-case or CONSTANT_CASE. Walks plain objects and arrays, down to `depth` object levels
 * (every level when omitted). The result type carries the converted keys. Never mutates the input.
 *
 * @example
 * convertKeys({ user_id: 1, home_address: { street_name: 'Main' } }, { to: 'camelCase', depth: 1 })
 * // => { userId: 1, homeAddress: { street_name: 'Main' } }
 */
export const convertKeys = <Value, Case extends KeyCase, D extends Depth | undefined = undefined>(
  value: Value,
  { to, depth }: ConvertKeysOptions<Case, D>,
): ConvertKeys<Value, Case, D> =>
  convertLevels(value, { to, depth: depth ?? Infinity, cache: new Map() }) as ConvertKeys<Value, Case, D>;
