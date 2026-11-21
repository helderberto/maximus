import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { createTransformer } from './create-transformer';

interface UserDto {
  user_id: number;
  first_name: string;
}

interface User {
  userId: number;
  firstName: string;
}

const transformUser = createTransformer<UserDto, User>({ keys: 'camelCase' });
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

describe('createTransformer with arrays and query libraries', () => {
  it('transforms an array of DTOs into a new array of domain objects', () => {
    const copy = structuredClone(dtos);
    const users = transformUser(dtos);
    expect(users).toEqual([
      { userId: 1, firstName: 'Ada' },
      { userId: 2, firstName: 'Grace' },
    ]);
    expect(users).not.toBe(dtos);
    expect(dtos).toEqual(copy);
  });

  it('works with Array.prototype.map', () => {
    expect(dtos.map(transformUser)).toEqual(transformUser(dtos));
  });

  it('types one DTO, arrays and readonly arrays', () => {
    const readonlyDtos: readonly UserDto[] = dtos;
    expectTypeOf(transformUser(dtos[0]!)).toEqualTypeOf<User>();
    expectTypeOf(transformUser(dtos)).toEqualTypeOf<User[]>();
    expectTypeOf(transformUser(readonlyDtos)).toEqualTypeOf<User[]>();
    expectTypeOf(dtos.map(transformUser)).toEqualTypeOf<User[]>();
    // @ts-expect-error: the input is not a `UserDto`.
    transformUser({ id: 1 });
  });

  it('types TanStack Query `select` for one DTO and for arrays', () => {
    const types = () => {
      const user: User = useQuery({ queryFn: async (): Promise<UserDto> => dtos[0]!, select: transformUser });
      const users: User[] = useQuery({ queryFn: async () => dtos, select: transformUser });
      return [user, users];
    };
    expect(types).toBeTypeOf('function');
  });

  it('types RTK Query `transformResponse`', () => {
    const types = () => {
      const user: User = defineQuery<User>({ transformResponse: transformUser });
      const users: User[] = defineQuery<User[]>({
        transformResponse: (response: UserDto[]) => transformUser(response),
      });
      return [user, users];
    };
    expect(types).toBeTypeOf('function');
  });

  it('suggests every key case for `keys` and `to`, and only leaked keys for `exclude`', () => {
    const file = join(import.meta.dirname, 'completions-fixture.ts');
    const source = [
      "import { convertKeys } from '@/convert-keys';",
      "import { createTransformer } from '@/create-transformer';",
      "createTransformer<{ user_id: number }, { userId: number }>({ keys: '' });",
      "convertKeys({ user_id: 1 }, { to: '' });",
      "createTransformer<{ user_id: number; first_name: string }, { userId: number }>({ keys: 'camelCase', exclude: [''] });",
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
  });
});
