import { createTypedEmitter } from './create-typed-emitter';

interface Events {
  login: { id: string };
  logout: undefined;
}

describe('createTypedEmitter', () => {
  it('delivers payloads to listeners', () => {
    const emitter = createTypedEmitter<Events>();
    const listener = vi.fn();
    emitter.on('login', listener);
    emitter.emit('login', { id: '1' });
    expect(listener).toHaveBeenCalledWith({ id: '1' });
  });

  it('emits events without payload', () => {
    const emitter = createTypedEmitter<Events>();
    const listener = vi.fn();
    emitter.on('logout', listener);
    emitter.emit('logout');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes through the returned function', () => {
    const emitter = createTypedEmitter<Events>();
    const listener = vi.fn();
    const off = emitter.on('logout', listener);
    off();
    emitter.emit('logout');
    expect(listener).not.toHaveBeenCalled();
  });

  it('keeps delivering when a listener unsubscribes during emit', () => {
    const emitter = createTypedEmitter<Events>();
    const second = vi.fn();
    const off = emitter.on('logout', () => off());
    emitter.on('logout', second);
    emitter.emit('logout');
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('only notifies listeners of the emitted event', () => {
    const emitter = createTypedEmitter<Events>();
    const listener = vi.fn();
    emitter.on('login', listener);
    emitter.emit('logout');
    expect(listener).not.toHaveBeenCalled();
  });

  it('types event names and payloads', () => {
    const emitter = createTypedEmitter<Events>();
    emitter.on('login', (payload) => expectTypeOf(payload).toEqualTypeOf<{ id: string }>());
    // @ts-expect-error: login requires a payload, so the call must not type-check.
    emitter.emit('login');
    // @ts-expect-error: 'signup' is not an event name, so the call must not type-check.
    emitter.emit('signup');
  });
});
