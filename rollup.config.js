import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import nested from 'postcss-nested';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import polyfill from 'rollup-plugin-polyfill-node';
import postcss from 'rollup-plugin-postcss';

/**
 * 构建文件
 * @param input
 * @return {import('rollup').RollupOptions}
 */
const config = (input) => {
  return {
    input: input,
    output: [
      {
        dir: 'dist/es',
        format: 'esm',
        preserveModules: false // 保留模块结构
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        //exports: 'named'
      },
      {
        dir: 'dist/umd',
        format: 'umd',
        name: 'wl-live2d',
        //exports: 'named'
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
      typescript({ tsconfig: 'tsconfig.build.json' }),
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

/**
 * 创建声明文件
 * @param input
 * @return {import('rollup').RollupOptions}
 */
const declare = (input) => {
  return {
    input: input,
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()]
  };
};

export default [
  config('lib/index.ts'),
  //config('lib/index.cubism2.ts'),
  //config('lib/index.cubism4.ts'),
  declare('lib/index.types.ts')
];

