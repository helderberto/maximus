import { hasReleaseSection } from '../check-changelog/check-changelog.ts';

interface CheckReleaseOptions {
  tag: string;
  version: string;
  changelog: string;
}

export const checkRelease = ({ tag, version, changelog }: CheckReleaseOptions): string[] => {
  if (tag !== `v${version}`) {
    return [`Tag ${tag} does not match package.json version ${version}.`];
  }
  if (!hasReleaseSection({ version, changelog })) {
    return [`CHANGELOG.md has no ## [${version}] - YYYY-MM-DD section.`];
  }
  return [];
};
