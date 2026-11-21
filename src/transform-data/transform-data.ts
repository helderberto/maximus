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
 * Transforms a DTO (the shape the API sends) into a domain object (the shape your app uses),
 * or an array of DTOs into an array of domain objects. Returns a new value and never mutates the input.
 *
 * The DTO type comes from `dto` and the domain type from the annotation on the result, so you
 * usually write no generics. When neither can be inferred, such as an `any` from `response.json()`,
 * pass both: `transformData<UserDto, User>(dto, options)`.
 *
 * Missing fields, unknown keys, mismatched types and an unknown DTO or domain type fail at compile time.
 *
 * @param dto - One DTO, or an array of DTOs.
 * @param options - `keys` converts every key to a case, `exclude` leaves DTO keys out, and `fields`
 * computes or copies domain fields. Without `keys`, `fields` lists every domain field.
 * @returns The domain object, or an array of them for an array input.
 *
 * @example
 * // Types from the input and the annotation
 * const user: User = transformData(userDto, {
 *   keys: 'camelCase',
 *   exclude: ['first_name', 'last_name'],
 *   fields: { fullName: (dto) => `${dto.first_name} ${dto.last_name}` },
 * })
 *
 * @example
 * // Both generics, when the input is `any`
 * const users = transformData<UserDto[], User[]>(await response.json(), { keys: 'camelCase' })
 */
export const transformData = <Dto extends object, Domain = unknown>(
  dto: Dto,
  // `NoInfer` keeps the options from guessing the types: they come from `dto` and the annotation, or the generics.
  options: NoInfer<TransformDataOptions<Dto, Domain>>,
): Domain => {
  const runtime = options as RuntimeOptions;
  return (
    Array.isArray(dto)
      ? dto.map((item: Record<string, unknown>) => transformOne(item, runtime))
      : transformOne(dto as Record<string, unknown>, runtime)
  ) as Domain;
};
