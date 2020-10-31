import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default [{
    input: 'src/index.ts',
    output: [{
        file: `docs/assets/hy-drawer.js`,
        format: 'es',
        sourcemap: true
    }, {
        file: `module/index.js`,
        format: 'es',
        sourcemap: true
    }],
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        terser(),
    ],
}];