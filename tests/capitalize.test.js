import { capitalize } from '../src/string'

describe('maximus.capitalize', () => {
  test('should capitalize the first letter of a text', () => {
    expect(capitalize('any_test')).toBe('Any_test')
    expect(capitalize('aNy_TeSt')).toBe('Any_test')
  })
})
