import curry from '.'

describe('maximus.curry', () => {
  test('should validate curried numbers', () => {
    const sum = (a, b, c) => a + b + c
    const curriedSum = curry(sum)
    expect(curriedSum(2)(2, 2)).toEqual(6)
  })

  test('should test with more arguments', () => {
    const add = curry((n1, n2) => n1 + n2)

    expect(add(1, 2, 3)).toEqual(3)
  })
})
