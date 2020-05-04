module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'linebreak-style': [
      'error',
      'unix',
    ],
    'indent': [
      'error',
      2
    ],
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
      },
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
    'space-in-parens': [
      'error',
      'never',
    ],
    'space-before-function-paren': [
      'error',
      'always',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'eqeqeq': [
      'error',
      'allow-null',
    ],
    'one-var': [
      'error',
      'never',
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-return-assign': 'off',
    'no-unused-expressions': 'off',
    'no-trailing-spaces': 'error',
    'no-useless-escape': 'off',
    'no-useless-catch': 'off',
    'new-cap': 'off',
    'no-async-promise-executor': 'off',
    'no-new': 'off',
    'import/namespace': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-undef': 'off',
    'no-empty': 'off',
    'no-global-assign': 'off'
  }
}
