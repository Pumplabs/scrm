module.exports = {
  "extends": ["react-app", "eslint:recommended"],
  "rules": {
    "semi": 0,
    "no-anonymous-default-export": 0,
    // "restrictedNamedExports": [],
    "no-unused-vars": "off",
    "import/no-anonymous-default-export": ["error", {
      "allowArray": false,
      "allowArrowFunction": true,
      "allowAnonymousClass": false,
      "allowAnonymousFunction": false,
      "allowCallExpression": true, // The true value here is for backward compatibility
      "allowLiteral": false,
      "allowObject": true
    }]
  },
  plugins: ['react'],
};