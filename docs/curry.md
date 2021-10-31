## curry(fn) ⇒ <code>function</code>

A function that takes multiple arguments and returns a curried method.

**Kind**: global function\
**Returns**: <code>function</code> - the curried method with arguments\
**Category**: Function

| Param | Type                  | Description           |
| ----- | --------------------- | --------------------- |
| fn    | <code>function</code> | the function to curry |

**Example**

```js
const sum = (a, b, c) => a + b + c
const curriedSum = curry(sum)
curriedSum(1)(2, 3) //=> 6
```
