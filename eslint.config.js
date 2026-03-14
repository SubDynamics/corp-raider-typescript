import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        window: 'readonly',
        document: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      semi: 2,
      'no-console': 1,
      'no-alert': 1,
      eqeqeq: 2,
      'no-magic-numbers': 0,
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'no-console': 0,
    },
  },
  prettier,
];
