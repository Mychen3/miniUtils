import globals from 'globals';
import tsEslintParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import pluginReact from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import hooksPlugin from 'eslint-plugin-react-hooks';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
      sourceType: 'module',
    },
    plugins: {
      react: pluginReact,
      'react-hooks': hooksPlugin,
      'react-refresh': reactRefresh,
      '@typescript-eslint': typescriptEslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Prettier 规则（如果你选择使用 eslint-plugin-prettier）
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
        },
      ],

      // React 规则
      'react/jsx-indent': [1, 2],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      // React Hooks 规则
      ...hooksPlugin.configs.recommended.rules,

      // React Refresh 规则
      'react-refresh/only-export-components': 'warn',

      // 通用规则
      'arrow-body-style': ['error', 'as-needed'], // 推荐使用简化版箭头函数
      'prefer-arrow-callback': 'error', // 强制使用箭头函数作为回调
      'no-template-curly-in-string': 1,
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-magic-numbers': 'warn',
    },
  },
];
