import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { checkRelease } from './check-release.ts';

const { name, version } = JSON.parse(readFileSync('package.json', 'utf8'));

const { publish, errors } = checkRelease({
  version,
  changelog: readFileSync('CHANGELOG.md', 'utf8'),
  published: JSON.parse(execFileSync('npm', ['view', name, 'versions', '--json']).toString()),
});

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `publish=${publish}\nversion=${version}\n`);
}
console.log(publish ? `Publishing ${version}.` : `${version} is already on npm. Nothing to publish.`);
