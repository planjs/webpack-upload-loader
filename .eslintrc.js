module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    '@webpack-contrib/eslint-config-webpack',
    'prettier',
  ],
  env: {
    browser: false,
    node: true,
  },
};
