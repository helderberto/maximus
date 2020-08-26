import { isString } from '../is'

describe('maximus.is', () => {
  test('should ensure the value is a string', () => {
    expect(isString('any_test')).toBeTruthy()
  })

  test('should ensure the value null returns false', () => {
    expect(isString(null)).toBeFalsy()
  })

  test('should ensure the value undefined returns false', () => {
    expect(isString(undefined)).toBeFalsy()
  })
})
