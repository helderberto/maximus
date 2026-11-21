import { convertKeys } from '@/convert-keys';
import type { KeyCase } from '@/convert-keys/types';
import type { TransformDataOptions } from './types';

/** The options as the runtime reads them. `TransformDataOptions` already checked them against the types. */
interface RuntimeOptions {
  keys?: KeyCase;
  exclude?: readonly string[];
  fields?: Record<string, string | ((dto: Record<string, unknown>) => unknown)>;
}

const transformOne = (dto: Record<string, unknown>, { keys, exclude, fields }: RuntimeOptions): unknown => {
  // Excluded keys are dropped before conversion, so their values are never walked.
  const kept = exclude?.length
    ? Object.fromEntries(Object.entries(dto).filter(([key]) => !exclude.includes(key)))
    : dto;
  const domain: Record<string, unknown> = keys ? { ...(convertKeys(kept, { to: keys }) as object) } : {};
  for (const [field, source] of Object.entries(fields ?? {})) {
    domain[field] = typeof source === 'function' ? source(dto) : dto[source];
  }
  return domain;
};

/**
 * Transforms a DTO into a domain object, or an array of DTOs into an array of domain objects.
 * The DTO type comes from the input and the domain type from the result's annotation, so callers
 * write no generics. Never mutates the input.
 *
 * - Without `keys`, `fields` gives every domain field a source: a DTO key or a function of the whole DTO.
 * - With `keys`, every DTO key is converted to that case, nested ones included, and `fields` only
 *   lists the domain fields that conversion does not already provide. `exclude` drops DTO keys
 *   the domain does not use.
 *
 * Missing fields, unknown keys, mismatched types and a missing annotation fail at compile time.
 *
 * @example
 * const user: User = transformData(userDto, {
 *   keys: 'camelCase',
 *   fields: { fullName: (dto) => `${dto.first_name} ${dto.last_name}` },
 * })
 */
export const transformData = <Input extends object, Result = unknown>(
  input: Input,
  // `NoInfer` keeps the options from guessing the types: they come from `input` and the annotation.
  options: NoInfer<TransformDataOptions<Input, Result>>,
): Result => {
  const runtime = options as RuntimeOptions;
  return (
    Array.isArray(input)
      ? input.map((dto: Record<string, unknown>) => transformOne(dto, runtime))
      : transformOne(input as Record<string, unknown>, runtime)
  ) as Result;
};
