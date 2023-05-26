module.exports = {

  env: {

    browser: true,

    es2021: true,

  },

  extends: [

    'plugin:react/recommended',

    'airbnb',

  ],

  overrides: [

  ],

  parserOptions: {

    ecmaVersion: 'latest',

    sourceType: 'module',

  },

  plugins: [

    'react',

  ],

  rules: {

    'no-fallthrough': 'off',

    'func-names': 'off',

    'consistent-return': 'off',

    'import/no-unresolved': 'off',

    'import/no-extraneous-dependencies': 'off',

    'linebreak-style': 'off',
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    radix: 'off',
    'no-use-before-define': 'off',
    'no-empty': 'off',
  },
};
