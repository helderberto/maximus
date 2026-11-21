import { ESLint } from 'eslint';

const eslint = new ESLint({ ignore: false });

const ruleIdsFor = async (file: string): Promise<string[]> => {
  const [result] = await eslint.lintFiles([`eslint-fixtures/${file}`]);
  return result.messages.map((message) => message.ruleId ?? 'parse-error');
};

describe('eslint rules', () => {
  it.each([
    ['default-export.ts', 'import/no-default-export'],
    ['namespace-import.ts', 'import/no-namespace'],
    ['export-all.ts', 'no-restricted-syntax'],
    ['enum.ts', 'no-restricted-syntax'],
    ['PascalCase.ts', 'check-file/filename-naming-convention'],
    ['BadFolder/index.ts', 'check-file/folder-naming-convention'],
    ['braceless-if.ts', 'curly'],
    ['three-params.ts', 'max-params'],
    ['too-many-lines.ts', 'max-lines'],
    ['prettier-violation.ts', 'prettier/prettier'],
  ])('%s fails with %s', async (file, ruleId) => {
    expect(await ruleIdsFor(file)).toContain(ruleId);
  });
});
