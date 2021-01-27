import { isEmpty } from '../src'

describe('isEmpty', () => {
  it('should check if value is an empty string', () => {
    expect(isEmpty('')).toBeTruthy()
  })

  it('should check if value is an empty object', () => {
    expect(isEmpty({})).toBeTruthy()
  })

  it('should check if value is an empty array', () => {
    expect(isEmpty([])).toBeTruthy()
  })

  it('should check if value is undefined', () => {
    expect(isEmpty()).toBeTruthy()
  })
})
