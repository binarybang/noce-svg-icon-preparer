module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base'
  ],
  rules: {
    "@typescript-eslint/no-empty-function": ["error", { "allow": ["arrowFunctions"] }],
    "@typescript-eslint/object-curly-spacing": "off"
  },
  ignorePatterns: [
    '.eslintrc.js',
    'dist',
    'node_modules',
    'scripts'
  ],
  parserOptions: {
    project: './tsconfig.prod.json'
  }
};
