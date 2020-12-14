<a name="pipe"></a>

## pipe(...functions) ⇒ <code>function</code>

Pipe takes HOCs and returns a function that combines them, from the left to the right

**Kind**: global function
**Returns**: <code>function</code> - the composed function
**Category**: Function

| Param        | Type                  | Description              |
| ------------ | --------------------- | ------------------------ |
| ...functions | <code>function</code> | the functions to compose |

**Example**

```js
const increment = (x) => 1
const double = (x) => x * 2
const incrementAndDouble = pipe(increment, double)
incrementAndDouble(1) //=> 4
```
