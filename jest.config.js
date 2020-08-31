module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/string/index.js',
    '!<rootDir>/src/index.js',
  ],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
}
