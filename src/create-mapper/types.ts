/** Keys of `Dto` whose value is assignable to `Value`. Optional keys carry `undefined`. */
export type KeysWithValue<Dto, Value> = Exclude<
  { [K in keyof Dto]: Dto[K] extends Value ? K : never }[keyof Dto],
  undefined
>;

/** A DTO key to copy, or a function that computes the field from the whole DTO. */
export type FieldSource<Dto, Value> = KeysWithValue<Dto, Value> | ((dto: Dto) => Value);

/** One source for every domain field, optional fields included. */
export type FieldMapping<Dto, Domain> = {
  [K in keyof Domain]-?: FieldSource<Dto, Domain[K]>;
};

export type Mapper<Dto, Domain> = (dto: Dto) => Domain;
