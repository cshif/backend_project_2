import eslint from '@eslint/js';
import tsESLint from 'typescript-eslint';
import oxlint from 'eslint-plugin-oxlint';

export default [
  eslint.configs.recommended,
  ...tsESLint.configs.recommended,
  oxlint.configs['flat/recommended']
]
