import { checkChangelog } from './check-changelog.ts';

const changelog = (unreleased: string, releases = ''): string =>
  `# Changelog\n\n## [Unreleased]\n${unreleased}\n${releases}## [0.11.0] - 2026-11-21\n\n- Old entry.\n`;

const base = { changelog: changelog(''), version: '0.11.0' };

describe('checkChangelog', () => {
  it('fails a source change without an [Unreleased] entry', () => {
    const errors = checkChangelog({ base, head: base, changedFiles: ['src/index.ts'] });
    expect(errors).toEqual(['Source changed: add an entry under ## [Unreleased] in CHANGELOG.md.']);
  });

  it('passes a source change with a new [Unreleased] entry', () => {
    const head = { changelog: changelog('\n### Added\n\n- `buildPath`.\n'), version: '0.11.0' };
    expect(checkChangelog({ base, head, changedFiles: ['src/index.ts', 'CHANGELOG.md'] })).toEqual([]);
  });

  it('fails a version bump without a matching release section', () => {
    const head = { changelog: changelog('\n- `buildPath`.\n'), version: '1.0.0' };
    const errors = checkChangelog({ base, head, changedFiles: ['package.json', 'CHANGELOG.md'] });
    expect(errors).toEqual(['Version bumped to 1.0.0: add ## [1.0.0] - YYYY-MM-DD to CHANGELOG.md.']);
  });

  it('passes a version bump with a matching release section', () => {
    const head = { changelog: changelog('', '## [1.0.0] - 2026-12-01\n\n- `buildPath`.\n\n'), version: '1.0.0' };
    expect(checkChangelog({ base, head, changedFiles: ['package.json', 'CHANGELOG.md', 'src/index.ts'] })).toEqual([]);
  });

  it('passes a change outside source', () => {
    expect(checkChangelog({ base, head: base, changedFiles: ['README.md', 'src/index.test.ts'] })).toEqual([]);
  });
});
