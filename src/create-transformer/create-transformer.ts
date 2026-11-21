import { convertKeys } from '@/convert-keys';
import type { Transformer, TransformerOptions } from './types';

type Source<Dto> = keyof Dto | ((dto: Dto) => unknown);

/**
 * Creates a pure function that transforms a DTO into a domain object. It never mutates the DTO.
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
  return (dto) => {
    const converted = keys ? (convertKeys(dto, { to: keys, depth }) as object) : {};
    const domain: Record<string, unknown> = { ...converted };
    for (const [field, source] of fields) {
      domain[field] = typeof source === 'function' ? source(dto) : dto[source];
    }
    return domain as Domain;
  };
};
