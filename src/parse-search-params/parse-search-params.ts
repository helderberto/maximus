import type { ArrayType, Field, ScalarType, SearchParamsResult, SearchParamsSchema } from './types';

type Scalar = string | number | boolean;

interface FieldEntry {
  name: string;
  field: Field;
}

export interface ParseSearchParamsOptions<S extends SearchParamsSchema> {
  /** Maps each query key to a field type. The result type is inferred from it. */
  schema: S;
}

const BOOLEANS = new Map([
  ['', true],
  ['1', true],
  ['true', true],
  ['0', false],
  ['false', false],
]);

const isArrayType = (field: Field): field is ArrayType => field === 'string[]' || field === 'number[]';

const coerce = (raw: string, type: ScalarType): Scalar | null => {
  if (type === 'string') {
    return raw;
  }
  if (type === 'boolean') {
    return BOOLEANS.get(raw) ?? null;
  }
  const number = Number(raw);
  return raw.trim() !== '' && Number.isFinite(number) ? number : null;
};

const readField = (params: URLSearchParams, { name, field }: FieldEntry) => {
  if (isArrayType(field)) {
    const type = field === 'string[]' ? 'string' : 'number';
    return params.getAll(name).flatMap((raw) => coerce(raw, type) ?? []);
  }
  const raw = params.get(name);
  const value = raw === null ? null : coerce(raw, typeof field === 'string' ? field : field.type);
  return value ?? (typeof field === 'string' ? null : field.default);
};

/**
 * Parses a query string into a typed object described by a schema.
 * Missing or invalid scalars become `null`, or the field default. Arrays collect repeated keys.
 *
 * @param search - a query string, `URLSearchParams` or `URL`
 * @param options - `schema` maps each key to `'string'`, `'number'`, `'boolean'`, an array type, or `{ type, default }`
 *
 * @example
 * parseSearchParams('?page=2&tag=a&tag=b', { schema: { page: { type: 'number', default: 1 }, tag: 'string[]' } })
 * // => { page: 2, tag: ['a', 'b'] }
 */
export const parseSearchParams = <const S extends SearchParamsSchema>(
  search: string | URLSearchParams | URL,
  options: ParseSearchParamsOptions<S>,
): SearchParamsResult<S> => {
  const params = search instanceof URL ? search.searchParams : new URLSearchParams(search);
  const entries = Object.entries(options.schema).map(([name, field]) => [name, readField(params, { name, field })]);
  // Object.fromEntries loses key types. Each entry is built from its own schema field.
  return Object.fromEntries(entries) as SearchParamsResult<S>;
};
