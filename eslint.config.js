import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import perfectionist from 'eslint-plugin-perfectionist';
import importOrder from 'eslint-plugin-import';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
      'eslint-plugin-prettier': prettier,
      react,
      perfectionist: perfectionist,
      'typescript-eslint': tseslint,
      'import': importOrder,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'unused-imports/no-unused-imports': 'error',
      'no-console': 'error',
      'no-multiple-empty-lines': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'perfectionist/sort-objects': 'warn',
      'max-len': [
        'warn',
        {
          code: 120,
        },
      ],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['react'],
          pathGroups: [
            {
              pattern: '{react,react-dom/**}',
              group: 'external',
              position: 'before',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        },
      ],
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
    },
  }
);
