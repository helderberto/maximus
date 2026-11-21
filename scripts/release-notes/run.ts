import { readFileSync } from 'node:fs';
import { releaseNotes } from './release-notes';

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const notes = releaseNotes({ changelog: readFileSync('CHANGELOG.md', 'utf8'), version });

if (notes === null) {
  console.error(`CHANGELOG.md has no section for ${version}.`);
  process.exit(1);
}
console.log(notes);
