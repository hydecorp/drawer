import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'hy-drawer',
  outputTargets: [
    { type: 'dist' },
    { type: 'docs' },
    // { type: 'www' },
  ],
  plugins: [
    sass(),
  ],
};