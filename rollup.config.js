import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import nested from 'postcss-nested';
import polyfill from 'rollup-plugin-polyfill-node';
import postcss from 'rollup-plugin-postcss';

const input = [
  'lib/index.js',
  'lib/index.cubism2.js',
  'lib/index.cubism4.js'
];
const plugins = [
  polyfill(),
  resolve({
    browser: true,
    preferBuiltins: false
  }),
  commonjs(),
  json(),
  postcss({
    plugins: [
      autoprefixer(),
      nested(),
      cssnano()
    ]
  }),
  babel({
    babelHelpers: 'bundled'
  }),
  terser()
];

export default [
  {
    input,
    output: {
      dir: 'dist/es',
      format: 'es'
    },
    plugins
  },
  {
    input,
    output: {
      dir: 'dist/cjs',
      format: 'cjs'
    },
    exports: 'named',
    plugins
  }
];
