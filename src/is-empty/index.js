import { is } from '../is'

export function isEmpty(input) {
  if (!input) {
    return true
  }

  if (is(Function, input)) {
    return false
  }

  if (is(Array, input)) {
    return input.length === 0
  }

  if (is(String, input)) {
    const EMPTY_STRING_REGEXP = /^\s*$/
    return EMPTY_STRING_REGEXP.test(input)
  }

  if (is(Date, input)) {
    return false
  }

  if (is(Object, input)) {
    return Object.keys(input).length === 0
  }

  return false
}
