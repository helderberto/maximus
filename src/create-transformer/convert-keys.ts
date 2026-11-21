import type { KeyCase } from './types';

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

/** Converts the keys of plain objects, nested ones and those inside arrays included. Other values pass through. */
export const convertKeys = (value: unknown, keyCase: KeyCase): unknown => {
  if (Array.isArray(value)) {
    return value.map((item: unknown) => convertKeys(item, keyCase));
  }
  if (!isPlainObject(value)) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [convertKey(key, keyCase), convertKeys(item, keyCase)]),
  );
};
