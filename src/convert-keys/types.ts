import type { KEY_CASES } from './constants';

export type KeyCase = (typeof KEY_CASES)[number];

type Separator = '_' | '-' | ' ';

type IsUpper<Char extends string> = Char extends Lowercase<Char> ? false : true;

type Push<Words extends string[], Word extends string> = Word extends '' ? Words : [...Words, Word];

/** Splits on `_`, `-` and spaces, and before a capital that follows a lowercase letter or digit. */
type SplitWords<
  Key extends string,
  Word extends string = '',
  Prev extends string = '',
  Words extends string[] = [],
> = Key extends `${infer Char}${infer Rest}`
  ? Char extends Separator
    ? SplitWords<Rest, '', Char, Push<Words, Word>>
    : IsUpper<Char> extends true
      ? Prev extends '' | Separator
        ? SplitWords<Rest, `${Word}${Char}`, Char, Words>
        : IsUpper<Prev> extends true
          ? SplitWords<Rest, `${Word}${Char}`, Char, Words>
          : SplitWords<Rest, Char, Char, Push<Words, Word>>
      : SplitWords<Rest, `${Word}${Char}`, Char, Words>
  : Push<Words, Word>;

type JoinWords<Words extends string[], Glue extends string> = Words extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? Rest extends []
    ? First
    : `${First}${Glue}${JoinWords<Rest, Glue>}`
  : '';

type CapitalizeWords<Words extends string[]> = { [I in keyof Words]: Capitalize<Lowercase<Words[I]>> };
type LowercaseWords<Words extends string[]> = { [I in keyof Words]: Lowercase<Words[I]> };
type UppercaseWords<Words extends string[]> = { [I in keyof Words]: Uppercase<Words[I]> };

type JoinInCase<Words extends string[], Case extends KeyCase> = Case extends 'camelCase'
  ? Words extends [infer First extends string, ...infer Rest extends string[]]
    ? `${Lowercase<First>}${JoinWords<CapitalizeWords<Rest>, ''>}`
    : ''
  : Case extends 'PascalCase'
    ? JoinWords<CapitalizeWords<Words>, ''>
    : Case extends 'snake_case'
      ? JoinWords<LowercaseWords<Words>, '_'>
      : Case extends 'kebab-case'
        ? JoinWords<LowercaseWords<Words>, '-'>
        : JoinWords<UppercaseWords<Words>, '_'>;

type SplitLeadingUnderscores<Key extends string, Prefix extends string = ''> = Key extends `_${infer Rest}`
  ? SplitLeadingUnderscores<Rest, `${Prefix}_`>
  : [Prefix, Key];

/** One key in the target case. Leading underscores are kept: `_id` stays `_id`. */
export type ConvertKey<Key extends string, Case extends KeyCase> = string extends Key
  ? Key
  : SplitLeadingUnderscores<Key> extends [infer Prefix extends string, infer Rest extends string]
    ? `${Prefix}${JoinInCase<SplitWords<Rest>, Case>}`
    : Key;

type Unconverted = Date | RegExp | Error | Promise<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>;

/** Every key in the target case, nested objects and arrays included. */
export type ConvertKeys<Value, Case extends KeyCase> = Value extends readonly unknown[]
  ? { [I in keyof Value]: ConvertKeys<Value[I], Case> }
  : Value extends Unconverted | ((...args: never[]) => unknown)
    ? Value
    : Value extends object
      ? {
          [K in keyof Value as K extends string ? ConvertKey<K, Case> : K extends number ? K : never]: ConvertKeys<
            Value[K],
            Case
          >;
        }
      : Value;

export interface ConvertKeysOptions<Case extends KeyCase> {
  /**
   * The target case. Words split on `_`, `-`, spaces, and before a capital that follows a lowercase
   * letter or digit. Leading underscores stay: `_id` stays `_id`.
   *
   * @example
   * { to: 'camelCase' } // user_id => userId
   * { to: 'PascalCase' } // user_id => UserId
   * { to: 'snake_case' } // userId => user_id
   * { to: 'kebab-case' } // userId => user-id
   * { to: 'CONSTANT_CASE' } // userId => USER_ID
   */
  to: Case;
}
