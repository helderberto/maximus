import type { FieldMapping, Mapper } from './types';

/**
 * Creates a pure function that maps a DTO to a domain object. Every domain field gets a source:
 * a DTO key to copy, or a function that computes the value from the whole DTO.
 * Missing fields, unknown keys and mismatched types fail at compile time.
 *
 * @example
 * const toUser = createMapper<UserDto, User>({
 *   id: 'user_id',
 *   fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
 * })
 * toUser({ user_id: '1', first_name: 'Ada', last_name: 'Lovelace' })
 * // => { id: '1', fullName: 'Ada Lovelace' }
 */
export const createMapper = <Dto, Domain>(fields: FieldMapping<Dto, Domain>): Mapper<Dto, Domain> => {
  // The mapping is read once. `FieldMapping` already checked each source against its domain field.
  const entries = Object.entries(fields) as [string, keyof Dto | ((dto: Dto) => unknown)][];
  return (dto) => {
    const domain: Record<string, unknown> = {};
    for (const [field, source] of entries) {
      domain[field] = typeof source === 'function' ? source(dto) : dto[source];
    }
    return domain as Domain;
  };
};
