import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import nested from 'postcss-nested';
import copy from 'rollup-plugin-copy';
import polyfill from 'rollup-plugin-polyfill-node';
import postcss from 'rollup-plugin-postcss';


const config = (input) => {
  return {
    input: input,
    output: [
      {
        dir: 'dist/es',
        format: 'es',
        preserveModules: false // 保留模块结构
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        exports: 'named'
      },
      {
        dir: 'dist/umd',
        format: 'umd',
        name: 'wl-live2d',
        exports: 'named'
      }
    ],
    context: 'windows',
    moduleContext: 'windows',
    external: [
      /packages/
    ],
    plugins: [
      copy({
        targets: [
          { src: 'packages', dest: 'dist' }
        ]
      }),
      babel({
        babelHelpers: 'bundled'
      }),
      resolve({
        browser: true,
        preferBuiltins: true
      }),
      polyfill(),
      commonjs(),
      json(),
      postcss({
        plugins: [
          autoprefixer(),
          nested(),
          cssnano()
        ]
      }),
      terser()
    ]
  };
};

export default [
  config('lib/index.js'),
  config('lib/index.cubism2.js'),
  config('lib/index.cubism4.js'),
];

