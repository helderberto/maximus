// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { useMediaQuery } from './use-media-query';

const createMatchMedia = (initial: boolean) => {
  const target = new EventTarget();
  let matches = initial;
  const matchMedia = (media: string) =>
    Object.assign(target, {
      media,
      get matches() {
        return matches;
      },
    });
  const change = (next: boolean) => {
    matches = next;
    target.dispatchEvent(new Event('change'));
  };
  return { matchMedia, change };
};

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns whether the query matches', () => {
    vi.stubGlobal('matchMedia', createMatchMedia(true).matchMedia);
    const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'));
    expect(result.current).toBe(true);
  });

  it('updates when the match changes', () => {
    const media = createMatchMedia(false);
    vi.stubGlobal('matchMedia', media.matchMedia);
    const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'));
    act(() => media.change(true));
    expect(result.current).toBe(true);
  });

  it('returns false on the server', () => {
    const Probe = () => String(useMediaQuery('(min-width: 600px)'));
    expect(renderToString(createElement(Probe))).toBe('false');
  });
});
