import type { ConvertKeys, Depth, KeyCase } from '@/convert-keys/types';

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

interface ConvertOptions<Case extends KeyCase, D extends Depth | undefined> {
  /** Converts every key of the DTO to this case. */
  keys: Case;
  /** How many object levels to convert. Omit it to convert every level. */
  depth?: D;
}

type CaseOptions<Dto, Domain, Case extends KeyCase, D extends Depth | undefined> =
  MissingFields<ConvertKeys<Dto, Case, D>, Domain> extends infer Missing extends keyof Domain
    ? [Missing] extends [never]
      ? ConvertOptions<Case, D> & { fields?: PatchFields<Dto, Domain, Missing> }
      : ConvertOptions<Case, D> & { fields: PatchFields<Dto, Domain, Missing> }
    : never;

export interface PickOptions<Dto, Domain> {
  keys?: undefined;
  depth?: undefined;
  fields: FieldMapping<Dto, Domain>;
}

// A caller who passes `<Dto, Domain>` gets no inference for the rest, so every case and depth
// is spelled out as one member of a union, discriminated by the `keys` and `depth` literals.
type ConvertedOptions<Dto, Domain> = {
  [Case in KeyCase]: { [D in Depth | 'all']: CaseOptions<Dto, Domain, Case, D extends Depth ? D : undefined> }[
    Depth | 'all'];
}[KeyCase];

/**
 * Without `keys`, `fields` lists every domain field. With `keys`, the DTO is converted
 * (down to `depth` levels) and `fields` lists only the domain fields conversion does not provide.
 */
export type TransformerOptions<Dto, Domain> = PickOptions<Dto, Domain> | ConvertedOptions<Dto, Domain>;

/**
 * Transforms one DTO into one domain object, or an array of DTOs into an array of domain objects.
 * One generic signature (not overloads) so `select` and `.map` infer the result. The conditional
 * does not distribute, so a caller that widens the input to `unknown` (RTK Query) gets `Domain`.
 */
export type Transformer<Dto, Domain> = <Input extends Dto | readonly Dto[]>(
  input: Input,
) => [Input] extends [readonly Dto[]] ? Domain[] : Domain;
