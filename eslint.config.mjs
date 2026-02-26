import nextConfig from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    rules: {
      'react/display-name': 'off',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];

export default config;
