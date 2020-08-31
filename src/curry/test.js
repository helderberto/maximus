import curry from '.'

describe('maximus.curry', () => {
  test('should validate curried numbers', () => {
    const addTwoNumbers = (x, y) => x + y
    const curriedAddTwoNumbers = curry(addTwoNumbers)

    expect(curriedAddTwoNumbers(10, 5)).toEqual(15)
  })

  test('should test with more arguments', () => {
    const add = curry((n1, n2) => n1 + n2)

    expect(add(1, 2, 3)).toEqual(3)
  })
})
