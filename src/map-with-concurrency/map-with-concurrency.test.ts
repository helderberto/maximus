import { mapWithConcurrency } from './map-with-concurrency';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('mapWithConcurrency', () => {
  it('maps items in input order', async () => {
    const result = await mapWithConcurrency([30, 10, 20], {
      limit: 2,
      fn: async (ms) => {
        await delay(ms);
        return ms * 2;
      },
    });
    expect(result).toEqual([60, 20, 40]);
  });

  it('never runs more than limit at once', async () => {
    let running = 0;
    let peak = 0;
    await mapWithConcurrency([1, 2, 3, 4, 5, 6], {
      limit: 2,
      fn: async () => {
        running += 1;
        peak = Math.max(peak, running);
        await delay(5);
        running -= 1;
      },
    });
    expect(peak).toBe(2);
  });

  it('passes the index', async () => {
    expect(await mapWithConcurrency(['a', 'b'], { limit: 1, fn: async (item, index) => `${item}${index}` })).toEqual([
      'a0',
      'b1',
    ]);
  });

  it('rejects on the first error and stops starting new items', async () => {
    const fn = vi.fn(async (item: number) => {
      if (item === 1) {
        throw new Error('boom');
      }
      await delay(5);
      return item;
    });
    await expect(mapWithConcurrency([1, 2, 3, 4], { limit: 1, fn })).rejects.toThrow('boom');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resolves an empty array for no items', async () => {
    expect(await mapWithConcurrency([], { limit: 2, fn: async () => 1 })).toEqual([]);
  });

  it('treats a limit below 1 as 1', async () => {
    let running = 0;
    let peak = 0;
    await mapWithConcurrency([1, 2, 3], {
      limit: 0,
      fn: async () => {
        running += 1;
        peak = Math.max(peak, running);
        await delay(1);
        running -= 1;
      },
    });
    expect(peak).toBe(1);
  });

  it('infers the result type', () => {
    expectTypeOf(mapWithConcurrency([1], { limit: 1, fn: async (n) => String(n) })).toEqualTypeOf<Promise<string[]>>();
  });
});
