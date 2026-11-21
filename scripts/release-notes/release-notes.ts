interface ReleaseNotesOptions {
  changelog: string;
  version: string;
}

export const releaseNotes = ({ changelog, version }: ReleaseNotesOptions): string | null => {
  const heading = new RegExp(`^## \\[${version.replaceAll('.', '\\.')}\\] - .*$`, 'm');
  const match = heading.exec(changelog);
  if (!match) {
    return null;
  }
  const rest = changelog.slice(match.index + match[0].length);
  const end = rest.search(/^(## \[|\[[^\]]+\]: )/m);
  return (end === -1 ? rest : rest.slice(0, end)).trim();
};
