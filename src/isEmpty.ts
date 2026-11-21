/**
 * It checks if value is empty
 *
 * @category Function
 * @param {any} - value to be checked
 * @returns {Boolean} returns boolean if value is empty
 *
 * @example
 * isEmpty('') //=> true
 * isEmpty({}) //=> true
 * isEmpty([]) //=> true
 * isEmpty() //=> true
 *
 * @deprecated Removed in 1.0. Use a type-specific check: `length`, `size` or `Object.keys`.
 */
export const isEmpty = (value: any): boolean => {
  return (
    value === null ||
    value === '' ||
    typeof value === 'undefined' ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};
