module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ['standard', 'prettier'],
  plugins: ['prettier', 'standard'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
