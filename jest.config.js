module.exports = {
  collectCoverage: true,
  testRegex: '/src/__tests__/.*(\\.|/)(test|spec)\\.js?$',
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/**/*.js'],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
};
