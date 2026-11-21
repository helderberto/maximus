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
  /** Converts every key of the DTO to this case, nested ones included. */
  keys: Case;
  /** DTO keys, by their original name, to leave out of the result. Only keys the domain does not use. */
  exclude?: readonly ExcludableKeys<Dto, Domain, Case>[];
}

type CaseOptions<Dto, Domain, Case extends KeyCase> =
  MissingFields<ConvertKeys<Dto, Case>, Domain> extends infer Missing extends keyof Domain
    ? [Missing] extends [never]
      ? ConvertOptions<Dto, Domain, Case> & { fields?: PatchFields<Dto, Domain, Missing> }
      : ConvertOptions<Dto, Domain, Case> & { fields: PatchFields<Dto, Domain, Missing> }
    : never;

export interface PickOptions<Dto, Domain> {
  keys?: undefined;
  /** Without `keys`, only the fields listed in `fields` are kept, so there is nothing to exclude. */
  exclude?: undefined;
  fields: FieldMapping<Dto, Domain>;
}

type ConvertedOptions<Dto, Domain> = { [Case in KeyCase]: CaseOptions<Dto, Domain, Case> }[KeyCase];

/**
 * Without `keys`, `fields` lists every domain field. With `keys`, the whole DTO is converted,
 * minus `exclude`, and `fields` lists only the domain fields conversion does not provide.
 */
export type DtoOptions<Dto, Domain> = PickOptions<Dto, Domain> | ConvertedOptions<Dto, Domain>;

/** Shown when the result has no type annotation, so there is no domain type to check against. */
export interface AnnotateTheResultType {
  'Annotate the result: const user: User = transformData(dto, options)': never;
}

/** Shown when the input is `any`, as from `response.json()`, so there is no DTO type to check against. */
export interface TypeTheInput {
  'Type the input: const dto: UserDto = await response.json()': never;
}

/** Shown when one input is annotated as an array result, or an array input as one result. */
export interface ResultMustMatchInput {
  'Annotate an array input with an array result, and one DTO with one domain object': never;
}

type ItemOf<Value> = Value extends readonly (infer Item)[] ? Item : Value;

type IsArray<Value> = [Value] extends [readonly unknown[]] ? true : false;

/** The options for `transformData`, checked against the item types of the input and the annotated result. */
export type TransformDataOptions<Input, Result> = 0 extends 1 & Input
  ? TypeTheInput
  : unknown extends Result
    ? AnnotateTheResultType
    : IsArray<Input> extends IsArray<Result>
      ? DtoOptions<ItemOf<Input>, ItemOf<Result>>
      : ResultMustMatchInput;
