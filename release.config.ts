import type { Options } from 'semantic-release';

// Same release flow as the other packages: the version comes from Conventional Commit types.
export default {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        // `feat` is minor and `fix` patch by default. These types cut a patch release too.
        releaseRules: [
          { type: 'docs', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'build', release: 'patch' },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'perf', section: 'Performance' },
            { type: 'revert', section: 'Reverts' },
            { type: 'refactor', section: 'Refactoring' },
            { type: 'docs', section: 'Documentation' },
            { type: 'build', section: 'Build' },
            { type: 'style', section: 'Styles' },
            { type: 'chore', hidden: true },
            { type: 'ci', hidden: true },
            { type: 'test', hidden: true },
          ],
        },
      },
    ],
    // Keeps the `# Changelog` heading on top and adds each release under it.
    ['@semantic-release/changelog', { changelogTitle: '# Changelog' }],
    '@semantic-release/npm',
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version}',
      },
    ],
  ],
} satisfies Options;
