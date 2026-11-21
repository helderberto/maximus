type Segment<Pattern extends string> = Pattern extends `${infer Head}/${infer Rest}` ? Head | Segment<Rest> : Pattern;

type RequiredName<S> = S extends `:${string}?`
  ? never
  : S extends `:${infer Name}`
    ? Name
    : S extends '*'
      ? '*'
      : never;

type OptionalName<S> = S extends `:${infer Name}?` ? Name : never;

type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type PathParams<Pattern extends string> = Simplify<
  { [K in RequiredName<Segment<Pattern>>]: string } & { [K in OptionalName<Segment<Pattern>>]?: string }
>;

export type HasRequiredParams<Pattern extends string> = [RequiredName<Segment<Pattern>>] extends [never] ? false : true;
