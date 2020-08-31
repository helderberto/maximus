const mx = require('../index')

describe('maximus.capitalize', () => {
  test('should capitalize the first letter of a text', () => {
    expect(mx.capitalize('any_test')).toBe('Any_test')
    expect(mx.capitalize('aNy_TeSt')).toBe('Any_test')
  })

  test('should throws an TypeError with null value', () => {
    expect(() => mx.capitalize(null)).toThrowError(TypeError)
  })

  test('should throws an TypeError with undefined value', () => {
    expect(() => mx.capitalize(undefined)).toThrowError(TypeError)
  })
})
