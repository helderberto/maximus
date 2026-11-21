import { execFileSync, execSync } from 'node:child_process';

const runNode = (source: string): string => execFileSync('node', ['--input-type=module', '-e', source]).toString().trim();

describe('package exports', () => {
  beforeAll(() => {
    execSync('npm run build', { stdio: 'ignore' });
  });

  it('loads through import()', () => {
    const keys = runNode("const mod = await import('mxs'); console.log(JSON.stringify(Object.keys(mod)));");
    expect(JSON.parse(keys)).not.toContain('default');
  });

  it('loads through require()', () => {
    const keys = runNode(
      "import { createRequire } from 'node:module'; const mod = createRequire(import.meta.url)('mxs'); console.log(JSON.stringify(Object.keys(mod)));",
    );
    expect(JSON.parse(keys)).not.toContain('default');
  });
});
