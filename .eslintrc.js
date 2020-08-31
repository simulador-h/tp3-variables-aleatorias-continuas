/* eslint-disable quote-props */

const { resolve } = require('path');

module.exports = {
  root: true,

  env: {
    browser: true,
  },

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true,
  },

  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.vue'],

    // createDefaultProgram: true,

    ecmaVersion: 2020,
    sourceType: 'module',
  },

  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking', // may impact linting performance
    'plugin:vue/vue3-recommended',
  ],

  plugins: [
    'import',
    '@typescript-eslint',
    'vue',
  ],

  // add your custom rules here
  rules: {
    'no-unused-vars': 'warn',
    'no-param-reassign': 'off',
    'no-confusing-arrow': ['error', {
      allowParens: true,
    }],
    'no-plusplus': 'off',
    'object-curly-newline': 'warn',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'prefer-promise-reject-errors': 'off',

    'max-len': ['error', 125],

    // TypeScript
    'quotes': ['warn', 'single', { avoidEscape: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'vue/script-indent': ['error', 2, { 'baseIndent': 1 }],
    'vue/component-tags-order': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multiline-html-element-content-newline': 'off',
  },

  overrides: [
    {
      files: ['./*.js'],
      env: {
        node: true,
      },
      parser: 'espree',
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['*.vue'],
      rules: {
        'indent': 'off',
      },
    },
  ],
};
