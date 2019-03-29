import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'hy-drawer',
  // minifyJs: false,
  outputTargets: [
    { type: 'dist' },
    { type: 'docs' },
  ],
};