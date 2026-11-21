import { checkRelease } from './check-release.ts';

const changelog = '# Changelog\n\n## [Unreleased]\n\n## [1.0.0] - 2026-11-21\n\n- Added things.\n';

describe('checkRelease', () => {
  it('publishes a new version with a changelog section', () => {
    expect(checkRelease({ version: '1.0.0', changelog, published: ['0.10.1'] })).toEqual({
      publish: true,
      errors: [],
    });
  });

  it('skips a version already on npm', () => {
    expect(checkRelease({ version: '1.0.0', changelog, published: ['0.10.1', '1.0.0'] })).toEqual({
      publish: false,
      errors: [],
    });
  });

  it('fails a new version without a changelog section', () => {
    expect(checkRelease({ version: '1.1.0', changelog, published: ['1.0.0'] })).toEqual({
      publish: false,
      errors: ['CHANGELOG.md has no ## [1.1.0] - YYYY-MM-DD section.'],
    });
  });
});
