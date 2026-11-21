import { convertKeys } from './convert-keys';
import type { KeyCase, Transformer, TransformerOptions } from './types';

type Source<Dto> = keyof Dto | { from: keyof Dto; keys: KeyCase } | ((dto: Dto) => unknown);

const readSource = <Dto>(dto: Dto, source: Source<Dto>): unknown => {
  if (typeof source === 'function') {
    return source(dto);
  }
  if (typeof source === 'object') {
    return convertKeys(dto[source.from], source.keys);
  }
  return dto[source];
};

/**
 * Creates a pure function that transforms a DTO into a domain object.
 *
 * - Without `keys`, `fields` gives every domain field a source: a DTO key, a DTO key with its
 *   keys converted (`{ from, keys }`), or a function of the whole DTO.
 * - With `keys`, every DTO key is converted to that case, nested ones included, and `fields`
 *   only lists the domain fields that conversion does not already provide.
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
  const { keys } = options;
  // The fields are read once. `TransformerOptions` already checked each source against its domain field.
  const fields = Object.entries(options.fields ?? {}) as [string, Source<Dto>][];
  return (dto) => {
    const domain = (keys ? { ...(convertKeys(dto, keys) as object) } : {}) as Record<string, unknown>;
    for (const [field, source] of fields) {
      domain[field] = readSource(dto, source);
    }
    return domain as Domain;
  };
};
