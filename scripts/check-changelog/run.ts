import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { checkChangelog } from './check-changelog';

const baseRef = process.argv[2] ?? 'origin/main';

const git = (args: string[]): string => execFileSync('git', args).toString();

const gitShow = (path: string): string => {
  try {
    return execFileSync('git', ['show', `${baseRef}:${path}`], { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  } catch {
    return '';
  }
};

const versionOf = (packageJson: string): string => JSON.parse(packageJson || '{}').version ?? '';

const errors = checkChangelog({
  base: { changelog: gitShow('CHANGELOG.md'), version: versionOf(gitShow('package.json')) },
  head: { changelog: readFileSync('CHANGELOG.md', 'utf8'), version: versionOf(readFileSync('package.json', 'utf8')) },
  changedFiles: git(['diff', '--name-only', `${baseRef}...HEAD`])
    .split('\n')
    .filter(Boolean),
});

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('CHANGELOG.md is up to date.');
