<a name="uniq"></a>

## uniq(key|arr) ⇒ (arr) ⇒ <code>[Array]</code>

Uniq can take an array as first argument and will remove the duplicated items and return a new array without duplication. But in case you want to remove duplicated objects from an array you sould pass the object key in the first argument and then uniq will return a function that accept an array as argument.

**Kind**: global function\
**Returns**: <code>Array</code> - new arry without duplications\
**Category**: Function

| Param | Type                | Description                     |
| ----- | ------------------- | ------------------------------- |
| key   | <code>string</code> | key to match duplicated objects |
| arr   | <code>array</code>  | the array with duplicated items |

**Example**

Simple array case

```js
const arr = [1, 2, 1, 3, 4, 1, 5];
const newArr = uniq(arr); // [1,2,3,4,5]
```

Case with array of objects

```js
const arr = [
  { id: 1, name: 'paul' },
  { id: 2, name: 'paul' },
  { id: 1, name: 'maximus' },
  { id: 3, name: 'anne' },
];
const uniqById = uniq('id');
const newArray = uniqById(arr); //[{id:1,name:'maximus'},{id:2,name:'paul'}{id:3,name:'anne'}]
```
