module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: ['standard'],
  parserOptions: {
    sourceType: 'module',
  },
}
