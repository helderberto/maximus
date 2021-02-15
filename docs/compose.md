<a name="compose"></a>

## compose(...functions) ⇒ <code>function</code>

Compose takes HOCs and returns a function that combines them from the right to the left

**Kind**: global function\
**Returns**: <code>function</code> - the composed function\
**Category**: Function

| Param        | Type                  | Description              |
| ------------ | --------------------- | ------------------------ |
| ...functions | <code>function</code> | the functions to compose |

**Example**

```js
const increment = (x) => 1;
const double = (x) => x * 2;
const doubleAndIncrement = compose(increment, double);
doubleAndIncrement(1); //=> 3
```
