module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    "@typescript-eslint/no-empty-function": ["error", { "allow": ["arrowFunctions"] }]
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
