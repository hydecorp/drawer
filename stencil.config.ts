import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'hy-drawer',
  minifyJs: false,
  outputTargets: [
    { type: 'dist' },
    { type: 'www' },
    { type: 'docs' },
    // { type: 'www' },
  ],
  plugins: [
    sass(),
  ],
};