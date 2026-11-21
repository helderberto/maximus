import { dedupeInFlight } from './dedupe-in-flight';

describe('dedupeInFlight', () => {
  it('shares one call between concurrent identical calls', async () => {
    const fn = vi.fn(async (id: number) => ({ id }));
    const fetchUser = dedupeInFlight(fn);
    const [a, b] = await Promise.all([fetchUser(1), fetchUser(1)]);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it('calls again for different arguments', async () => {
    const fn = vi.fn(async (id: number) => id);
    const fetchUser = dedupeInFlight(fn);
    await Promise.all([fetchUser(1), fetchUser(2)]);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('calls again once the previous call settles', async () => {
    const fn = vi.fn(async (id: number) => id);
    const fetchUser = dedupeInFlight(fn);
    await fetchUser(1);
    await fetchUser(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('calls again after a rejection', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('a')).mockResolvedValueOnce('ok');
    const load = dedupeInFlight(fn);
    await expect(load()).rejects.toThrow('a');
    await expect(load()).resolves.toBe('ok');
  });

  it('uses a custom key', async () => {
    const fn = vi.fn(async (user: { id: number; name: string }) => user.id);
    const load = dedupeInFlight(fn, { key: (user) => String(user.id) });
    await Promise.all([load({ id: 1, name: 'a' }), load({ id: 1, name: 'b' })]);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('keeps the function signature', () => {
    const load = dedupeInFlight(async (id: number, full: boolean) => ({ id, full }));
    expectTypeOf(load).toEqualTypeOf<(id: number, full: boolean) => Promise<{ id: number; full: boolean }>>();
  });
});
