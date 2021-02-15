module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: ['prettier', 'standard'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
