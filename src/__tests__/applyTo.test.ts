import { applyTo } from '..'

describe('applyTo', () => {
  it('should validate applying simple function', () => {
    const increment = jest.fn((x) => x + 1)
    const result = applyTo(1, increment)
    expect(result).toEqual(2)
    const result2 = applyTo(1)(increment)
    expect(result2).toEqual(2)
  })
})
