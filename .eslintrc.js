/* eslint-disable quote-props */

const { resolve } = require('path');

module.exports = {
  root: true,

  env: {
    browser: true,
  },

  globals: {
    process: true,
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
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking', // may impact linting performance
    'plugin:vue/vue3-recommended',
  ],

  plugins: [
    'import',
    '@typescript-eslint',
    'vue',
  ],

  settings: {
    // 'import/core-modules': ['vue'],
    'import/external-module-folders': [resolve(__dirname, './node_modules/@quasar/app')],

    'import/resolver': {
      typescript: {
        project: [
          './tsconfig.json',
          // resolve(__dirname, './node_modules/@quasar/app/tsconfig-preset.json'),
        ],
      },
    },
  },

  rules: {
    // Possible Errors
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // Best Practices
    'no-param-reassign': ['error', {
      'props': false,
    }],

    // Stylistic Issues
    'max-len': ['error', {
      'code': 120,
      'comments': 135,
      'ignoreUrls': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true,
    }],
    'no-plusplus': 'off',
    'object-curly-newline': ['error', {
      'ObjectExpression': {
        'multiline': true,
        'consistent': true,
      },
      'ObjectPattern': {
        'multiline': true,
        'consistent': true,
      },
      'ImportDeclaration': {
        'multiline': true,
        'consistent': true,
      },
      'ExportDeclaration': {
        'multiline': true,
        'consistent': true,
      },
    }],

    // Imports
    'import/default': 'error',
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'jsx': 'never',
      'mjs': 'never',
      'ts': 'never',
      'tsx': 'never',
      '.d.ts': 'never',
    }],
    'import/namespace': 'error',
    // 'import/no-extraneous-dependencies': ['error', {
    //   'packageDir': ['.', './node_modules/@quasar/app'],
    // }],
    'import/prefer-default-export': 'off',

    // Typescript
    '@typescript-eslint/explicit-module-boundary-types': ['error', {
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true,
    }],

    // Vue
    'vue/component-tags-order': ['error', {
      'order': ['template', 'style', 'script'],
    }],
    'vue/max-attributes-per-line': ['error', {
      'singleline': 6,
      'multiline': {
        'max': 3,
        'allowFirstLine': false,
      },
    }],
    'vue/script-indent': ['error', 2, {
      'baseIndent': 1,
    }],
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
  ],
};
