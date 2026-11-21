import type { TypedEmitter } from './types';

/**
 * Creates an event emitter typed by one event map. Event names and payloads are checked at compile time.
 * Events whose payload is `undefined` are emitted without a payload.
 *
 * @example
 * const emitter = createTypedEmitter<{ login: { id: string }; logout: undefined }>()
 * const off = emitter.on('login', ({ id }) => console.log(id))
 * emitter.emit('login', { id: '1' })
 */
export const createTypedEmitter = <Events>(): TypedEmitter<Events> => {
  const listeners = new Map<keyof Events, Set<(...args: unknown[]) => void>>();
  return {
    on: (name, listener) => {
      const set = listeners.get(name) ?? new Set();
      // Listeners are stored untyped. `emit` only passes the payload typed for the same name.
      const untyped = listener as (...args: unknown[]) => void;
      set.add(untyped);
      listeners.set(name, set);
      return () => {
        set.delete(untyped);
      };
    },
    emit: (name, ...args) => {
      for (const listener of [...(listeners.get(name) ?? [])]) {
        listener(...args);
      }
    },
  };
};
