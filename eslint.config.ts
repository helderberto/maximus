import js from '@eslint/js';
import checkFile from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'eslint-fixtures'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: { globals: globals.node },
    plugins: { import: importPlugin, 'check-file': checkFile },
    rules: {
      curly: ['error', 'all'],
      'max-params': ['error', 2],
      'max-lines': ['error', 200],
      'no-restricted-syntax': [
        'error',
        { selector: 'TSEnumDeclaration', message: 'Use an `as const` object instead of `enum`.' },
        { selector: 'ExportAllDeclaration', message: 'Use named exports instead of `export *`.' },
      ],
      'import/no-default-export': 'error',
      'import/no-namespace': 'error',
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{ts,js}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { '**/': 'KEBAB_CASE' }],
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['../*'], message: 'Import across folders through the `@/` alias.' }] },
      ],
    },
  },
  {
    files: ['*.config.{ts,js}'],
    rules: {
      // Vite and ESLint load their config through a default export.
      'import/no-default-export': 'off',
    },
  },
);
