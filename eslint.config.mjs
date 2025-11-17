import antfu from '@antfu/eslint-config';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  antfu(
    {
      stylistic: {
        semi: true,
      },
      ignores: ['app/components/ui'],
    },
    {
      rules: {
        'no-undef': 0,
        'vue/multi-word-component-names': 0,
        'node/prefer-global/process': 0,
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      },
    },
  ),
);
