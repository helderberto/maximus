<a name="applyTo"></a>

## applyTo ⇒ <code>\*</code>

Takes a value and applies it to a function

**Kind**: global constant\
**Returns**: <code>\*</code> - the return of applied function with the value\
**Category**: Function

| Param    | Type                  | Description                              |
| -------- | --------------------- | ---------------------------------------- |
| value    | <code>\*</code>       | the value that will be applied           |
| function | <code>function</code> | the function that will receive the value |

**Example**

```js
const increment = (x) => 1;
applyTo(1, increment); // => 2
```
