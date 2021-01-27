/**
 *
 * Remove duplicated items from an array
 *
 * @category Function
 * @param {string | Array} prop - Object propperty to compare and remove it from the original array or an Array that will be removed duplicated items
 * @param {Array} arr - An array
 * @returns {Array} - New array without the duplicated items
 */

export const uniq = (prop) => {
  if (Array.isArray(prop)) {
    return [...new Set(prop)]
  }
  return (arr) =>
    Array.from(
      arr
        .reduce(
          (acc, item) => item && item[prop] && acc.set(item[prop], item),
          new Map()
        )
        .values()
    )
}
