module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'linebreak-style': [
      'error',
      'unix',
    ],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true
      },
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'comma-style': [
      'error',
      'last',
    ],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'space-before-blocks': [
      'error',
      'always',
    ],
    'space-before-function-paren': [
      'error',
      'always',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'one-var': [
      'error',
      'never',
    ],
    'semi': [
      'error',
      'always',
    ],
    'multiline-ternary': [
      'error',
      'always-multiline',
    ],
    'no-useless-escape': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  }
}
