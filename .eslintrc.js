const OFF = 'off';
const WARN = 'warn';
// const ERROR = 'error';
module.exports = {
  // Inherit from our package
  extends: 'eslint-config-twolfson',

  // https://github.com/facebook/create-react-app/blob/v4.0.3/packages/eslint-config-react-app/base.js
  plugins: ['react'],

  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      jsx: true,
    },
  },

  rules: {
    'comma-dangle': OFF,
    'object-curly-spacing': OFF,
  },

  // Configure our environment
  // http://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  }
};
