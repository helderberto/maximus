# formatRelativeTime

Formats a date relative to now, picking the largest unit that fits.

```ts
import { formatRelativeTime } from 'mxs';

formatRelativeTime(Date.now() - 5 * 60_000);
// => '5 minutes ago'

formatRelativeTime(tomorrow, { locale: 'pt-BR' });
// => 'amanhã'
```

## Signature

```ts
formatRelativeTime(date: Date | number, options?: { now?: Date | number; locale?: Intl.LocalesArgument }): string | null
```

| Option   | Description                                        |
| -------- | -------------------------------------------------- |
| `now`    | The reference time. Defaults to `Date.now()`.      |
| `locale` | Any `Intl` locale. Defaults to the runtime locale. |

## Behavior

- Units go from seconds to years. A month is 30 days and a year is 365.
- Uses `Intl.RelativeTimeFormat` with `numeric: 'auto'`, so you get "yesterday" and "now".
- Returns `null` for an invalid date.
