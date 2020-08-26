import capitalize from '.'

describe('maximus.capitalize', () => {
  test('should capitalize the first letter of a text', () => {
    expect(capitalize('any_test')).toBe('Any_test')
    expect(capitalize('aNy_TeSt')).toBe('Any_test')
  })

  test('should throws an TypeError with null value', () => {
    expect(() => capitalize(null)).toThrowError(TypeError)
  })

  test('should throws an TypeError with undefined value', () => {
    expect(() => capitalize(undefined)).toThrowError(TypeError)
  })
})
