module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/**/*.js'],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
}
