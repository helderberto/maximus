import type { ConvertKey, ConvertKeys, KeyCase } from '@/convert-keys/types';

/** Keys of `Dto` whose value is assignable to `Value`. Optional keys carry `undefined`. */
type KeysWithValue<Dto, Value> = Exclude<{ [K in keyof Dto]: Dto[K] extends Value ? K : never }[keyof Dto], undefined>;

/** A DTO key to copy, or a function that computes the field from the whole DTO. */
export type FieldSource<Dto, Value> = KeysWithValue<Dto, Value> | ((dto: Dto) => Value);

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

/** DTO keys whose converted name is not a domain field: the ones that would otherwise stay on the result. */
type ExcludableKeys<Dto, Domain, Case extends KeyCase> = {
  [K in keyof Dto]-?: K extends string ? (ConvertKey<K, Case> extends keyof Domain ? never : K) : never;
}[keyof Dto];

interface ConvertOptions<Dto, Domain, Case extends KeyCase> {
  /**
   * Converts every key of the DTO to this case, nested objects and arrays included.
   * `fields` then only needs the domain fields that conversion does not already provide.
   * Leave it out to convert nothing and keep only the listed `fields`.
   *
   * @example
   * { keys: 'camelCase' } // { user_id: 1, home_address: { street_name } } => { userId: 1, homeAddress: { streetName } }
   */
  keys: Case;
  /**
   * DTO keys to leave out of the result, by their original names. Without it, every converted key
   * stays on the result, even ones the domain type does not declare. Only accepts keys whose converted
   * name is not a domain field, so your editor suggests exactly the keys that would leak.
   * Excluded values are never walked. `fields` can still read them.
   *
   * @example
   * { keys: 'camelCase', exclude: ['first_name', 'last_name', 'password_hash'] }
   */
  exclude?: readonly ExcludableKeys<Dto, Domain, Case>[];
}

// Documented once, on `PickOptions.fields`: TypeScript merges the docs of every union member into one hover.
interface PatchFieldsOption<Fields> {
  fields: Fields;
}

type CaseOptions<Dto, Domain, Case extends KeyCase> =
  MissingFields<ConvertKeys<Dto, Case>, Domain> extends infer Missing extends keyof Domain
    ? [Missing] extends [never]
      ? ConvertOptions<Dto, Domain, Case> & Partial<PatchFieldsOption<PatchFields<Dto, Domain, Missing>>>
      : ConvertOptions<Dto, Domain, Case> & PatchFieldsOption<PatchFields<Dto, Domain, Missing>>
    : never;

export interface PickOptions<Dto, Domain> {
  // `keys` and `exclude` are documented once, on `ConvertOptions`, for the same reason as `fields`.
  keys?: undefined;
  exclude?: undefined;
  /**
   * Domain fields, each with a source: a DTO key to copy, or a function of the original DTO.
   * Fields always read the DTO before conversion, so use its original keys.
   *
   * - With `keys`: only the domain fields that conversion does not already provide.
   * - Without `keys`: every domain field. DTO keys not listed here are dropped.
   *
   * @example
   * fields: {
   *   userId: 'user_id',
   *   fullName: (dto) => `${dto.first_name} ${dto.last_name}`,
   *   createdAt: (dto) => new Date(dto.created_at),
   * }
   */
  fields: FieldMapping<Dto, Domain>;
}

type ConvertedOptions<Dto, Domain> = { [Case in KeyCase]: CaseOptions<Dto, Domain, Case> }[KeyCase];

/**
 * Without `keys`, `fields` lists every domain field. With `keys`, the whole DTO is converted,
 * minus `exclude`, and `fields` lists only the domain fields conversion does not provide.
 */
export type DtoOptions<Dto, Domain> = PickOptions<Dto, Domain> | ConvertedOptions<Dto, Domain>;

/** Shown when the domain type is unknown: no annotation on the result and no generics. */
export interface AnnotateTheResultType {
  'Annotate the result (const user: User = transformData(dto, options)) or pass both generics (transformData<UserDto, User>(dto, options))': never;
}

/** Shown when the input is `any`, as from `response.json()`, and no generics were passed. */
export interface TypeTheInput {
  'Type the input (const dto: UserDto = await response.json()) or pass both generics (transformData<UserDto, User>(dto, options))': never;
}

/** Shown when one DTO is paired with an array domain type, or an array of DTOs with one domain object. */
export interface ResultMustMatchInput {
  'Pair an array of DTOs with an array result (User[]), and one DTO with one domain object (User)': never;
}

type ItemOf<Value> = Value extends readonly (infer Item)[] ? Item : Value;

type IsArray<Value> = [Value] extends [readonly unknown[]] ? true : false;

/**
 * The options of `transformData`, checked against the DTO type and the domain type.
 * For arrays, they are checked against the item types: `UserDto[]` and `User[]` check as `UserDto` and `User`.
 */
export type TransformDataOptions<Dto, Domain> = 0 extends 1 & Dto
  ? TypeTheInput
  : unknown extends Domain
    ? AnnotateTheResultType
    : IsArray<Dto> extends IsArray<Domain>
      ? DtoOptions<ItemOf<Dto>, ItemOf<Domain>>
      : ResultMustMatchInput;
