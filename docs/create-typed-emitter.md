# createTypedEmitter

Creates an event emitter typed by one event map.

```ts
import { createTypedEmitter } from 'mxs';

const emitter = createTypedEmitter<{ login: { id: string }; logout: undefined }>();

const off = emitter.on('login', ({ id }) => console.log(id));
emitter.emit('login', { id: '1' });
emitter.emit('logout');
off();
```

## Signature

```ts
createTypedEmitter<Events>(): {
  on: (name, listener) => () => void;
  emit: (name, ...payload) => void;
}
```

## Behavior

- Event names and payloads are checked at compile time.
- Events whose payload is `undefined` are emitted without one.
- `on` returns the unsubscribe function.
- Listeners added or removed during an `emit` do not change that emit.
- This is the one function that takes a generic: the event map has no literal to infer it from.
