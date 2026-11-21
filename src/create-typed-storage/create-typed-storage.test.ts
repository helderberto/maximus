import { createTypedStorage } from './create-typed-storage';

interface Settings {
  theme: 'light' | 'dark';
}

const parseSettings = (value: unknown): Settings | null =>
  typeof value === 'object' && value !== null && 'theme' in value && (value.theme === 'light' || value.theme === 'dark')
    ? { theme: value.theme }
    : null;

const createMemoryStorage = (): Storage => {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => {
      data.delete(key);
    },
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
};

describe('createTypedStorage', () => {
  it('round-trips a value as JSON', () => {
    const storage = createMemoryStorage();
    const settings = createTypedStorage({ key: 'settings', parse: parseSettings, storage });
    expect(settings.set({ theme: 'dark' })).toBe(true);
    expect(storage.getItem('settings')).toBe('{"theme":"dark"}');
    expect(settings.get()).toEqual({ theme: 'dark' });
  });

  it('returns null for a missing key', () => {
    const settings = createTypedStorage({ key: 'settings', parse: parseSettings, storage: createMemoryStorage() });
    expect(settings.get()).toBeNull();
  });

  it('returns null for corrupt JSON', () => {
    const storage = createMemoryStorage();
    storage.setItem('settings', '{oops');
    expect(createTypedStorage({ key: 'settings', parse: parseSettings, storage }).get()).toBeNull();
  });

  it('returns null when parse rejects the value', () => {
    const storage = createMemoryStorage();
    storage.setItem('settings', '{"theme":"blue"}');
    expect(createTypedStorage({ key: 'settings', parse: parseSettings, storage }).get()).toBeNull();
  });

  it('removes the value', () => {
    const storage = createMemoryStorage();
    const settings = createTypedStorage({ key: 'settings', parse: parseSettings, storage });
    settings.set({ theme: 'light' });
    settings.remove();
    expect(settings.get()).toBeNull();
  });

  it('degrades when storage throws', () => {
    const storage = createMemoryStorage();
    const fail = () => {
      throw new Error('denied');
    };
    const broken = { ...storage, getItem: fail, setItem: fail, removeItem: fail };
    const settings = createTypedStorage({ key: 'settings', parse: parseSettings, storage: broken });
    expect(settings.get()).toBeNull();
    expect(settings.set({ theme: 'dark' })).toBe(false);
    expect(() => settings.remove()).not.toThrow();
  });

  it('degrades when no storage exists', () => {
    vi.stubGlobal('localStorage', undefined);
    const settings = createTypedStorage({ key: 'settings', parse: parseSettings });
    expect(settings.get()).toBeNull();
    expect(settings.set({ theme: 'dark' })).toBe(false);
    vi.unstubAllGlobals();
  });

  it('infers the value type from parse', () => {
    const settings = createTypedStorage({ key: 'settings', parse: parseSettings, storage: createMemoryStorage() });
    expectTypeOf(settings.get()).toEqualTypeOf<Settings | null>();
  });
});
