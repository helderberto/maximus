interface Snapshot {
  changelog: string;
  version: string;
}

interface CheckChangelogOptions {
  base: Snapshot;
  head: Snapshot;
  changedFiles: string[];
}

const isSourceFile = (file: string): boolean => file.startsWith('src/') && !file.endsWith('.test.ts');

const unreleasedEntries = (changelog: string): string[] => {
  const section = changelog.split('## [Unreleased]')[1]?.split(/\n## \[/)[0] ?? '';
  return section.split('\n').filter((line) => line.trim().startsWith('- '));
};

const hasReleaseSection = (snapshot: Snapshot): boolean =>
  new RegExp(`^## \\[${snapshot.version.replaceAll('.', '\\.')}\\] - \\d{4}-\\d{2}-\\d{2}$`, 'm').test(
    snapshot.changelog,
  );

export const checkChangelog = ({ base, head, changedFiles }: CheckChangelogOptions): string[] => {
  const versionBumped = head.version !== base.version;
  const baseEntries = unreleasedEntries(base.changelog);
  const addedEntry = unreleasedEntries(head.changelog).some((entry) => !baseEntries.includes(entry));
  const released = versionBumped && hasReleaseSection(head);
  const errors: string[] = [];

  if (versionBumped && !released) {
    errors.push(`Version bumped to ${head.version}: add ## [${head.version}] - YYYY-MM-DD to CHANGELOG.md.`);
  }
  if (changedFiles.some(isSourceFile) && !addedEntry && !released) {
    errors.push('Source changed: add an entry under ## [Unreleased] in CHANGELOG.md.');
  }
  return errors;
};
