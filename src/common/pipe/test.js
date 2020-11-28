import { pipe } from '.'

describe('pipe', () => {
  it('should validate pipe ', () => {
    const add1 = jest.fn((x) => x + 1)
    const multiply2 = jest.fn((x) => x * 2)
    const result = pipe(add1, multiply2)(1)
    expect(result).toEqual(4)
    expect(add1).toBeCalled()
    expect(multiply2).toBeCalled()
  })
})
