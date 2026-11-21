import { readFileSync } from 'node:fs';
import { checkRelease } from './check-release.ts';

const errors = checkRelease({
  tag: process.argv[2] ?? '',
  version: JSON.parse(readFileSync('package.json', 'utf8')).version,
  changelog: readFileSync('CHANGELOG.md', 'utf8'),
});

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Release is consistent.');
