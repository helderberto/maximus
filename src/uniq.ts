/**
 *
 * Remove duplicated items from an array
 *
 * @category Function
 * @param {string | Array} key - Object key to compare and remove it from the original array or an Array that will be removed duplicated items
 * @param {Array} arr - An array
 * @returns {Array} - New array without the duplicated items
 */

export default function uniq<T>(key: string | T[]): T[] | ((arr: { [key: string]: any }[]) => { [key: string]: any }[]) {
  if (Array.isArray(key)) {
    return Array.from(new Set(key));
  }
  return (arr: { [key: string]: any }[]) =>
    Array.from(arr.reduce((acc, item) => item && item[key as string] && acc.set(item[key as string], item), new Map()).values());
}
