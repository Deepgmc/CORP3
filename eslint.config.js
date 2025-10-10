import eslint from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['{client,server}/**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
          ...globals.es2021,
          ...globals.browser,
          ...globals.node,
          ...globals.jest,
      },
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-object-type': 'warn',

      'no-debugger': 'off',
      'vue/require-prop-types': 'error',
      'vue/prop-name-casing': 'error',
      'vue/no-mutating-props': 'error',
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/attributes-order': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/no-v-html': 'warn',
      'vue/html-self-closing': 'off',
      'vue/require-default-prop': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
);
