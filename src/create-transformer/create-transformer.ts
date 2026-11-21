import { convertKeys } from '@/convert-keys';
import type { Transformer, TransformerOptions } from './types';

type Source<Dto> = keyof Dto | ((dto: Dto) => unknown);

/**
 * Creates a pure function that transforms a DTO into a domain object, or an array of DTOs into an array
 * of domain objects. It never mutates its input.
 *
 * - Without `keys`, `fields` gives every domain field a source: a DTO key or a function of the whole DTO.
 * - With `keys`, every DTO key is converted to that case, down to `depth` object levels (every level
 *   when omitted), and `fields` only lists the domain fields that conversion does not already provide.
 *
 * Missing fields, unknown keys and mismatched types fail at compile time.
 *
 * @example
 * const transformUser = createTransformer<UserDto, User>({
 *   keys: 'camelCase',
 *   fields: { fullName: (dto) => `${dto.first_name} ${dto.last_name}` },
 * })
 */
export const createTransformer = <Dto, Domain>(options: TransformerOptions<Dto, Domain>): Transformer<Dto, Domain> => {
  const { keys, depth } = options;
  // The fields are read once. `TransformerOptions` already checked each source against its domain field.
  const fields = Object.entries(options.fields ?? {}) as [string, Source<Dto>][];
  const transformOne = (dto: Dto): Domain => {
    const converted = keys ? (convertKeys(dto, { to: keys, depth }) as object) : {};
    const domain: Record<string, unknown> = { ...converted };
    for (const [field, source] of fields) {
      domain[field] = typeof source === 'function' ? source(dto) : dto[source];
    }
    return domain as Domain;
  };
  // The cast restates the conditional return type. `Array.isArray` picks the matching branch at runtime.
  return ((input: Dto | readonly Dto[]) =>
    Array.isArray(input) ? input.map((dto: Dto) => transformOne(dto)) : transformOne(input as Dto)) as Transformer<
    Dto,
    Domain
  >;
};
