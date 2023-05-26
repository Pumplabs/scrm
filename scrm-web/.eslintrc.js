module.exports = {
  "extends": ["react-app", "eslint:recommended", 'prettier'],
  "rules": {
    "semi": 0,
    "no-anonymous-default-export": 0,
    // "restrictedNamedExports": [],
    "no-unused-vars": 0,
    // "no-unused-vars": ["nerver", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
    "import/no-anonymous-default-export": ["error", {
      "allowArray": false,
      "allowArrowFunction": true,
      "allowAnonymousClass": false,
      "allowAnonymousFunction": false,
      "allowCallExpression": true, // The true value here is for backward compatibility
      "allowLiteral": false,
      "allowObject": true
    }],
    // 单行props的数量
    'react/jsx-max-props-per-line': [1, {
      // [1，{ when： multiline}]
      "when": "multiline"
      // maximum: 1
    }],
    "react-hooks/rules-of-hooks": 'error',
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useMyOtherCustomHook)"
    }]
  },
  plugins: ['react', 'react-hooks'],
};