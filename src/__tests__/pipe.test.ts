import { pipe } from '..';

describe('pipe', () => {
  const increment = jest.fn((x) => x + 1);
  const double = jest.fn((x) => x * 2);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate pipe result', () => {
    const result = pipe(increment, double)(1);
    expect(result).toEqual(4);
  });

  it('should validate each function is called once', () => {
    pipe(increment, double)(1);
    expect(increment).toHaveBeenCalledTimes(1);
    expect(double).toHaveBeenCalledTimes(1);
  });
});
