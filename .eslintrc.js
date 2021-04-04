const OFF = 'off';
const WARN = 'warn';
// const ERROR = 'error';
module.exports = {
  // Inherit from our package
  extends: [
    'eslint-config-twolfson',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended'
  ],

  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    react: {
      version: 'detect',
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
