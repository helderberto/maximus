export type ScalarType = 'string' | 'number' | 'boolean';

export type ArrayType = 'string[]' | 'number[]';

interface TypeMap {
  string: string;
  number: number;
  boolean: boolean;
  'string[]': string[];
  'number[]': number[];
}

type FieldWithDefault =
  | { readonly type: 'string'; readonly default: string }
  | { readonly type: 'number'; readonly default: number }
  | { readonly type: 'boolean'; readonly default: boolean };

/**
 * One schema field: `'string'`, `'number'`, `'boolean'`, `'string[]'`, `'number[]'`,
 * or `{ type, default }` for a scalar that falls back to `default` instead of `null`.
 */
export type Field = ScalarType | ArrayType | FieldWithDefault;

export type SearchParamsSchema = Readonly<Record<string, Field>>;

type FieldValue<F> = F extends ArrayType
  ? TypeMap[F]
  : F extends ScalarType
    ? TypeMap[F] | null
    : F extends { type: infer T extends ScalarType }
      ? TypeMap[T]
      : never;

/** The parsed object. Scalars without a default are `null` when missing or invalid. */
export type SearchParamsResult<S extends SearchParamsSchema> = { -readonly [K in keyof S]: FieldValue<S[K]> };
