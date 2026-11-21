import { hasReleaseSection } from '../check-changelog/check-changelog.ts';

interface CheckReleaseOptions {
  version: string;
  changelog: string;
  published: string[];
}

interface ReleaseDecision {
  publish: boolean;
  errors: string[];
}

export const checkRelease = ({ version, changelog, published }: CheckReleaseOptions): ReleaseDecision => {
  if (published.includes(version)) {
    return { publish: false, errors: [] };
  }
  if (!hasReleaseSection({ version, changelog })) {
    return { publish: false, errors: [`CHANGELOG.md has no ## [${version}] - YYYY-MM-DD section.`] };
  }
  return { publish: true, errors: [] };
};
