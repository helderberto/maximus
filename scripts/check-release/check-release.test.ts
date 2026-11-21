import { checkRelease } from './check-release.ts';

const changelog = '# Changelog\n\n## [Unreleased]\n\n## [1.0.0] - 2026-11-21\n\n- Added things.\n';

describe('checkRelease', () => {
  it('passes when the tag, version and changelog agree', () => {
    expect(checkRelease({ tag: 'v1.0.0', version: '1.0.0', changelog })).toEqual([]);
  });

  it('fails when the tag does not match the version', () => {
    expect(checkRelease({ tag: 'v1.0.1', version: '1.0.0', changelog })).toEqual([
      'Tag v1.0.1 does not match package.json version 1.0.0.',
    ]);
  });

  it('fails when the changelog has no section for the version', () => {
    expect(checkRelease({ tag: 'v1.1.0', version: '1.1.0', changelog })).toEqual([
      'CHANGELOG.md has no ## [1.1.0] - YYYY-MM-DD section.',
    ]);
  });
});
