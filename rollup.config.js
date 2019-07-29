import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
    input: 'src/components/hy-drawer/index.ts',
    output: {
        file: `assets/hy-drawer.js`,
        format: 'es',
        sourcemap: true
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
    ],
};