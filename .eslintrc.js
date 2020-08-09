module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  env: {
    browser: false,
    node: true,
  },
};
