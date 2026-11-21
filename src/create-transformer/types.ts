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

/** Keys of `Dto` whose value is assignable to `Value`. Optional keys carry `undefined`. */
type KeysWithValue<Dto, Value> = Exclude<{ [K in keyof Dto]: Dto[K] extends Value ? K : never }[keyof Dto], undefined>;

/** Copies a DTO field with its keys converted to one case, nested keys included. */
export interface ConvertedField<From, Case> {
  from: From;
  keys: Case;
}

type ConvertedFields<Dto, Value> = Exclude<
  {
    [K in keyof Dto]: {
      [Case in KeyCase]: ConvertKeys<Dto[K], Case> extends Value ? ConvertedField<K, Case> : never;
    }[KeyCase];
  }[keyof Dto],
  undefined
>;

/** A DTO key to copy, a DTO key to copy with its keys converted, or a function of the whole DTO. */
export type FieldSource<Dto, Value> = KeysWithValue<Dto, Value> | ConvertedFields<Dto, Value> | ((dto: Dto) => Value);

/** One source for every domain field, optional fields included. */
export type FieldMapping<Dto, Domain> = {
  [K in keyof Domain]-?: FieldSource<Dto, Domain[K]>;
};

/** Domain fields the converted DTO does not already provide with the right type. */
type MissingFields<Converted, Domain> = Exclude<
  {
    [K in keyof Domain]: K extends keyof Converted
      ? Converted[K] extends Domain[K]
        ? never
        : K
      : undefined extends Domain[K]
        ? never
        : K;
  }[keyof Domain],
  undefined
>;

type PatchFields<Dto, Domain, Missing extends keyof Domain> = {
  [K in Missing]-?: FieldSource<Dto, Domain[K]>;
} & {
  [K in Exclude<keyof Domain, Missing>]?: FieldSource<Dto, Domain[K]>;
};

type CaseOptions<Dto, Domain, Case extends KeyCase, Missing extends keyof Domain> = [Missing] extends [never]
  ? { keys: Case; fields?: PatchFields<Dto, Domain, Missing> }
  : { keys: Case; fields: PatchFields<Dto, Domain, Missing> };

export interface PickOptions<Dto, Domain> {
  keys?: undefined;
  fields: FieldMapping<Dto, Domain>;
}

/**
 * Without `keys`, `fields` lists every domain field. With `keys`, the whole DTO is converted
 * and `fields` lists only the domain fields that conversion does not already provide.
 */
export type TransformerOptions<Dto, Domain> =
  | PickOptions<Dto, Domain>
  | {
      [Case in KeyCase]: CaseOptions<Dto, Domain, Case, MissingFields<ConvertKeys<Dto, Case>, Domain>>;
    }[KeyCase];

export type Transformer<Dto, Domain> = (dto: Dto) => Domain;
