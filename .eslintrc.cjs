module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'quote-props': 'consistent-as-needed',
    'array-bracket-spacing': 'off',
    'object-curly-spacing': ['warn', 'always'],
    'block-spacing': ['warn', 'always'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'quote-props': ['warn', 'consistent-as-needed'],
    'comma-dangle': ['error', 'only-multiline'],
    'no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'no-console': 'warn',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'react/prop-types': ['error', { skipUndeclared: true }],
  },
};
