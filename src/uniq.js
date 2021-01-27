/**
 *
 * Remove duplicated items from an array
 *
 * @category Function
 * @param {string | Array} key - Object key to compare and remove it from the original array or an Array that will be removed duplicated items
 * @param {Array} arr - An array
 * @returns {Array} - New array without the duplicated items
 */

export default function uniq(key) {
  if (Array.isArray(key)) {
    return [...new Set(key)]
  }
  return (arr) =>
    Array.from(
      arr
        .reduce(
          (acc, item) => item && item[key] && acc.set(item[key], item),
          new Map()
        )
        .values()
    )
}
