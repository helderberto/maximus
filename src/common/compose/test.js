import { compose } from '.'

describe('compose', () => {
  it('should validate curried numbers', () => {
    const add1 = jest.fn((x) => x + 1)
    const multiply2 = jest.fn((x) => x * 2)
    const result = compose(add1, multiply2)(1)
    expect(result).toEqual(3)
    expect(add1).toBeCalled()
    expect(multiply2).toBeCalled()
  })
})
