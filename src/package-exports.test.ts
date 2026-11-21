import { execFileSync, execSync } from 'node:child_process';
import { mkdtempSync, symlinkSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ENTRIES = {
  mxs: [
    'buildPath',
    'convertKeys',
    'createTypedEmitter',
    'createTypedStorage',
    'debounce',
    'dedupeInFlight',
    'formatRelativeTime',
    'mapWithConcurrency',
    'matchPath',
    'parseSearchParams',
    'removeDuplicates',
    'retry',
    'throttle',
    'transformData',
  ],
  'mxs/react': [
    'useClickOutside',
    'useDebouncedValue',
    'useEventListener',
    'useInterval',
    'useMediaQuery',
    'usePrevious',
    'useStorageState',
  ],
};

const runNode = (source: string): string =>
  execFileSync('node', ['--input-type=module', '-e', source]).toString().trim();

const exportedKeys = (loader: string): string[] =>
  JSON.parse(runNode(`${loader} console.log(JSON.stringify(Object.keys(mod).toSorted()));`));

const createConsumer = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'mxs-consumer-'));
  mkdirSync(join(dir, 'node_modules'));
  symlinkSync(process.cwd(), join(dir, 'node_modules', 'mxs'));
  writeFileSync(join(dir, 'package.json'), '{ "type": "module" }');
  const source = Object.entries(ENTRIES)
    .map(([entry, names]) => `import { ${names.join(', ')} } from '${entry}';\nconsole.log(${names[0]});\n`)
    .join('');
  writeFileSync(join(dir, 'index.ts'), source);
  return dir;
};

describe('package exports', () => {
  beforeAll(() => {
    execSync('npm run build', { stdio: 'ignore' });
  });

  it.each(Object.entries(ENTRIES))('loads every named export of %s through import()', (entry, names) => {
    expect(exportedKeys(`const mod = await import('${entry}');`)).toEqual(names.toSorted());
  });

  it.each(Object.entries(ENTRIES))('loads every named export of %s through require()', (entry, names) => {
    const loader = `import { createRequire } from 'node:module'; const mod = createRequire(import.meta.url)('${entry}');`;
    expect(exportedKeys(loader)).toEqual(names.toSorted());
  });

  it('resolves types for a nodenext consumer', () => {
    const dir = createConsumer();
    const tsc = join(process.cwd(), 'node_modules', '.bin', 'tsc');
    const args = ['--noEmit', '--strict', '--module', 'nodenext', '--moduleResolution', 'nodenext', 'index.ts'];
    expect(() => execFileSync(tsc, args, { cwd: dir })).not.toThrow();
  });
});
