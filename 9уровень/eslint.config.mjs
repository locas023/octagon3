import vue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

export default [
  { ignores: ['node_modules/**', '.nuxt/**', '.output/**', 'test-results/**', 'playwright-report/**'] },
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.{ts,vue,mjs}'],
    languageOptions: { parserOptions: { parser: ts.parser, extraFileExtensions: ['.vue'] } },
    plugins: { '@typescript-eslint': ts.plugin },
    rules: {
      // Nuxt prefixes auto-imported components with their folder (UiButton, RequestCard).
      // Pages/layouts must retain file-based route names such as index.vue.
      'vue/multi-word-component-names': 'off',
      'no-debugger': 'error', 'no-constant-condition': 'error', '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  { files: ['**/*.ts'], languageOptions: { parser: ts.parser } },
]
