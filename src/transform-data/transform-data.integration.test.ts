import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { transformData } from './transform-data';

interface UserDto {
  user_id: number;
  first_name: string;
}

interface User {
  userId: number;
  firstName: string;
}

// A reusable transform is a plain function with a return annotation. No generics.
const transformUser = (dto: UserDto): User => transformData(dto, { keys: 'camelCase' });
const transformUsers = (dtos: readonly UserDto[]): User[] => transformData(dtos, { keys: 'camelCase' });
const dtos: UserDto[] = [
  { user_id: 1, first_name: 'Ada' },
  { user_id: 2, first_name: 'Grace' },
];

// Minimal copies of the TanStack Query and RTK Query option types the transformer is passed to.
declare function useQuery<Data, Selected = Data>(options: {
  queryFn: () => Promise<Data>;
  select?: (data: Data) => Selected;
}): Selected;
declare function defineQuery<Result>(options: {
  transformResponse?(response: unknown, meta: unknown, arg: number): Result | Promise<Result>;
}): Result;

describe('transformData with arrays and query libraries', () => {
  it('transforms an array of DTOs into a new array of domain objects', () => {
    const copy = structuredClone(dtos);
    const users: User[] = transformData(dtos, { keys: 'camelCase' });
    expect(users).toEqual([
      { userId: 1, firstName: 'Ada' },
      { userId: 2, firstName: 'Grace' },
    ]);
    expect(users).not.toBe(dtos);
    expect(dtos).toEqual(copy);
  });

  it('matches Array.prototype.map with a reusable function', () => {
    expect(dtos.map(transformUser)).toEqual(transformUsers(dtos));
  });

  it('types one DTO, arrays and readonly arrays from the annotation', () => {
    const readonlyDtos: readonly UserDto[] = dtos;
    const users: readonly User[] = transformData(readonlyDtos, { keys: 'camelCase' });
    expectTypeOf(transformUser(dtos[0]!)).toEqualTypeOf<User>();
    expectTypeOf(transformUsers(readonlyDtos)).toEqualTypeOf<User[]>();
    expectTypeOf(dtos.map(transformUser)).toEqualTypeOf<User[]>();
    expect(users).toHaveLength(2);
    // @ts-expect-error: an array input cannot be annotated as one result.
    const mismatched: User = transformData(dtos, { keys: 'camelCase' });
    expect(mismatched).toBeDefined();
  });

  it('types TanStack Query `select` with a reusable function or an annotated arrow', () => {
    const types = () => {
      const user: User = useQuery({ queryFn: async (): Promise<UserDto> => dtos[0]!, select: transformUser });
      const users: User[] = useQuery({
        queryFn: async () => dtos,
        select: (data): User[] => transformData(data, { keys: 'camelCase' }),
      });
      return [user, users];
    };
    expect(types).toBeTypeOf('function');
  });

  it('types RTK Query `transformResponse` with a reusable function or an annotated arrow', () => {
    const types = () => {
      const user: User = defineQuery<User>({ transformResponse: transformUser });
      // RTK Query lets `transformResponse` return a promise, so an inline arrow annotates its result.
      const users: User[] = defineQuery<User[]>({
        transformResponse: (response: UserDto[]): User[] => transformData(response, { keys: 'camelCase' }),
      });
      return [user, users];
    };
    expect(types).toBeTypeOf('function');
  });

  it('takes both generics when the input is `any`, as from `response.json()`', async () => {
    const response = new Response(JSON.stringify(dtos));
    const users = transformData<UserDto[], User[]>(await response.json(), { keys: 'camelCase' });
    expectTypeOf(users).toEqualTypeOf<User[]>();
    expect(users).toEqual(transformUsers(dtos));
    const json: unknown = { user_id: 1, first_name: 'Ada' };
    const user = transformData<UserDto, User>(json as UserDto, { keys: 'camelCase' });
    expect(user).toEqual({ userId: 1, firstName: 'Ada' });
  });

  it('checks the options against both generics', async () => {
    const response = new Response('{}');
    const body: unknown = await response.json();
    // @ts-expect-error: snake_case keeps `user_id`, so `userId` needs a source.
    const snake = transformData<UserDto, User>(body as UserDto, { keys: 'snake_case' });
    // @ts-expect-error: one DTO cannot be paired with an array domain type.
    const mismatched = transformData<UserDto, User[]>(body as UserDto, { keys: 'camelCase' });
    expect([snake, mismatched]).toHaveLength(2);
  });

  it('suggests key cases and leaked keys, and shows one description per option on hover', () => {
    const file = join(import.meta.dirname, 'completions-fixture.ts');
    const source = [
      "import { convertKeys } from '@/convert-keys';",
      "import { transformData } from '@/transform-data';",
      "const a: { userId: number } = transformData({ user_id: 1 }, { keys: '' });",
      "convertKeys({ user_id: 1 }, { to: '' });",
      "const b: { userId: number } = transformData({ user_id: 1, first_name: 'Ada' }, { keys: 'camelCase', exclude: [''] });",
    ].join('\n');
    const config = ts.getParsedCommandLineOfConfigFile(
      join(process.cwd(), 'tsconfig.json'),
      {},
      {
        ...ts.sys,
        onUnRecoverableConfigFileDiagnostic: () => undefined,
      },
    );
    const service = ts.createLanguageService({
      getScriptFileNames: () => [file],
      getScriptVersion: () => '1',
      getScriptSnapshot: (name) =>
        name === file
          ? ts.ScriptSnapshot.fromString(source)
          : ts.sys.fileExists(name)
            ? ts.ScriptSnapshot.fromString(readFileSync(name, 'utf8'))
            : undefined,
      getCurrentDirectory: () => process.cwd(),
      getCompilationSettings: () => config?.options ?? {},
      getDefaultLibFileName: ts.getDefaultLibFilePath,
      fileExists: (name) => name === file || ts.sys.fileExists(name),
      readFile: (name) => (name === file ? source : ts.sys.readFile(name)),
    });
    const suggestionsAfter = (marker: string) =>
      service
        .getCompletionsAtPosition(file, source.indexOf(marker) + marker.length, {})
        ?.entries.map((entry) => entry.name);
    const cases = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'CONSTANT_CASE'];
    expect(suggestionsAfter("keys: '")).toEqual(cases);
    expect(suggestionsAfter("to: '")).toEqual(cases);
    expect(suggestionsAfter("exclude: ['")).toEqual(['first_name']);
    // Each option shows one description on hover, not the merged docs of every union member.
    const hover = (marker: string) =>
      ts.displayPartsToString(service.getQuickInfoAtPosition(file, source.indexOf(marker) + 1)?.documentation);
    expect(hover("keys: 'camelCase'")).toMatch(/^Converts every key of the DTO to this case/);
    expect(hover('transformData({')).toMatch(/^Transforms a DTO/);
  });
});
