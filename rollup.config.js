import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import terser from "@rollup/plugin-terser";

// css
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import nested from "postcss-nested";
import cssnano from "cssnano";


const plugins = [
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
      cssnano(),
    ],
  }),
  babel({
    babelHelpers: 'bundled',
  }),
  terser(),
];

export default [
  {
    input: 'lib/index.js',
    output: {
      dir: 'dist/umd',
      name: 'index',
      format: 'umd'
    },
    plugins,
  }, {
    input: 'lib/index.js',
    output: {
      dir: 'dist/es',
      name: 'index',
      format: 'es'
    },
    plugins,
  }
]
