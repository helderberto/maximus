import { execFileSync, execSync } from 'node:child_process';
import { mkdtempSync, symlinkSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EXPORTS = ['removeDuplicates'];

const runNode = (source: string): string =>
  execFileSync('node', ['--input-type=module', '-e', source]).toString().trim();

const exportedKeys = (loader: string): string[] =>
  JSON.parse(runNode(`${loader} console.log(JSON.stringify(Object.keys(mod).toSorted()));`));

const createConsumer = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'mxs-consumer-'));
  mkdirSync(join(dir, 'node_modules'));
  symlinkSync(process.cwd(), join(dir, 'node_modules', 'mxs'));
  writeFileSync(join(dir, 'package.json'), '{ "type": "module" }');
  writeFileSync(join(dir, 'index.ts'), `import { ${EXPORTS.join(', ')} } from 'mxs';\nconsole.log(${EXPORTS[0]});\n`);
  return dir;
};

describe('package exports', () => {
  beforeAll(() => {
    execSync('npm run build', { stdio: 'ignore' });
  });

  it('loads every named export through import()', () => {
    expect(exportedKeys("const mod = await import('mxs');")).toEqual(EXPORTS.toSorted());
  });

  it('loads every named export through require()', () => {
    const loader = "import { createRequire } from 'node:module'; const mod = createRequire(import.meta.url)('mxs');";
    expect(exportedKeys(loader)).toEqual(EXPORTS.toSorted());
  });

  it('resolves types for a nodenext consumer', () => {
    const dir = createConsumer();
    const tsc = join(process.cwd(), 'node_modules', '.bin', 'tsc');
    const args = ['--noEmit', '--strict', '--module', 'nodenext', '--moduleResolution', 'nodenext', 'index.ts'];
    expect(() => execFileSync(tsc, args, { cwd: dir })).not.toThrow();
  });
});
