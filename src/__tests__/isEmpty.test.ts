import { isEmpty } from '..';

describe('isEmpty', () => {
  it('should return true if value is undefined', () => {
    expect(isEmpty(undefined)).toBeTruthy();
  });

  it('should return true if value is null', () => {
    expect(isEmpty(null)).toBeTruthy();
  });

  it('should return true if value is an empty string', () => {
    expect(isEmpty('')).toBeTruthy();
  });

  it('should return true if value is an empty object', () => {
    expect(isEmpty({})).toBeTruthy();
  });

  it('should return false if value is a non-empty string', () => {
    expect(isEmpty('not empty')).toBeFalsy();
  });

  it('should return false if value is a non-empty object', () => {
    expect(isEmpty({ key: 'value' })).toBeFalsy();
  });

  it('should return false if value is a number', () => {
    expect(isEmpty(42)).toBeFalsy();
  });

  it('should return false if value is a boolean', () => {
    expect(isEmpty(true)).toBeFalsy();
    expect(isEmpty(false)).toBeFalsy();
  });
});
