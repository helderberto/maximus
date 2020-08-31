module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
}
