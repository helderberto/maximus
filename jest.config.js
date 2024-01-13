module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testRegex: '/src/__tests__/.*(\\.|/)(test|spec)\\.ts?$',
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
};
