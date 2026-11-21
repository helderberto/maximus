# retry

Calls an async function until it resolves, waiting between attempts.

```ts
import { retry } from 'mxs';

const response = await retry(({ signal }) => fetch(url, { signal }), {
  attempts: 3,
  shouldRetry: (error) => !(error instanceof TypeError),
  signal: controller.signal,
});
```

## Signature

```ts
retry<T>(fn: (context: { attempt: number; signal?: AbortSignal }) => Promise<T>, options: RetryOptions): Promise<T>
```

| Option        | Description                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------- |
| `attempts`    | Total number of calls, including the first.                                                 |
| `backoff`     | `(attempt) => ms` to wait after a failed attempt. Defaults to exponential with full jitter. |
| `shouldRetry` | `(error, attempt) => boolean`. Return `false` to stop and reject right away.                |
| `signal`      | Aborting stops further attempts and rejects with `signal.reason`.                           |

## Behavior

- The default backoff waits a random time up to 100ms, 200ms, 400ms, and so on, capped at 30s.
- After the last attempt, it rejects with the last error.
- An already aborted signal rejects before calling `fn`.
- An abort during a wait rejects at once. It does not wait for the timer.
