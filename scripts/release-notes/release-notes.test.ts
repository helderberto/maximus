import { releaseNotes } from './release-notes';

const changelog = `# Changelog

## [Unreleased]

## [1.1.0] - 2026-12-01

### Added

- \`findPath\`.

## [1.0.0] - 2026-11-21

### Added

- \`buildPath\`.

[Unreleased]: https://example.com
`;

describe('releaseNotes', () => {
  it('returns the section body for a version', () => {
    expect(releaseNotes({ changelog, version: '1.1.0' })).toBe('### Added\n\n- `findPath`.');
  });

  it('stops before link references at the end', () => {
    expect(releaseNotes({ changelog, version: '1.0.0' })).toBe('### Added\n\n- `buildPath`.');
  });

  it('returns null for a version without a section', () => {
    expect(releaseNotes({ changelog, version: '2.0.0' })).toBeNull();
  });
});
