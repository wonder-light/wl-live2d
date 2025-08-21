import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import path from 'path';
import nested from 'postcss-nested';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import polyfill from 'rollup-plugin-polyfill-node';
import postcss from 'rollup-plugin-postcss';
import { fileURLToPath } from 'url';

/** 当前文件的路径 */
const currentFilePath = path.dirname(fileURLToPath(import.meta.url));

/**
 * 替换代码
 * @param options 选项
 * @return {any}
 */
function replace(options = {}) {
  const { values, include = [] } = options;
  let regs = include?.map(t => new RegExp(t)) ?? [];
  return {
    //插件名
    name: 'placeholder-replace',
    transform(code, id) {
      // 将代码转换为 UTF-8 编码
      code = code.toString('utf-8');
      // 获取文件名
      const fileName = path.relative(currentFilePath, id);
      // 是否匹配
      if (regs.length === 0 || !regs.find(reg => reg.test(fileName))) return null;
      // 遍历每个占位符
      code = Object.keys(values).reduce((modifiedCode, key) => {
        // 构建占位符的正则表达式
        const regExp = new RegExp(`${ key }`, 'g');
        return modifiedCode
          .split('\n')
          .map((line, row) => {
            return regExp.test(line) ? line.replace(regExp, values[key]) : line;
          })
          .join('\n');
      }, code);
      return code;
    },
    buildEnd() {}
  };
}

/**
 * 构建文件
 * @param {string} input 文件路径
 * @param {string} filename 文件名
 * @param {number} live2or4  < 0 为 live2, > 0 为 live4
 * @return {import('rollup').RollupOptions}
 */
const config = (input, filename, live2or4 = 0) => {
  let repla = {};
  if (live2or4 !== 0) {
    repla[`import.*live2dcubism${ live2or4 > 0 ? 2 : 4 }core.min.js.*;`] = '';
    repla['pixi-live2d-display'] = `pixi-live2d-display/cubism${ live2or4 > 0 ? 4 : 2 }`;
  }
  return {
    input: input,
    output: [
      {
        file: `dist/es/${ filename }.js`,
        format: 'esm', // ES6 格式
        preserveModules: false // 保留模块结构
      },
      {
        file: `dist/cjs/${ filename }.js`,
        format: 'cjs', // 只能在NodeJS上运行
        exports: 'named'
      },
      {
        file: `dist/umd/${ filename }.js`,
        format: 'umd', // 同时兼容 CJS 和 AMD
        name: 'wl-live2d',
        exports: 'named'
      }
    ],
    context: 'windows',
    moduleContext: 'windows',
    external: [
      /*/packages/*/ // 要么将 packages 里的一起导进去, 要么就在外部文件动态导入
    ],
    plugins: [
      copy({
        targets: [
          { src: 'packages', dest: 'dist' }
        ]
      }),
      replace({ include: ['lib[\\\\/]index.ts'], values: repla }),
      typescript({ tsconfig: 'tsconfig.json' }),
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
    plugins: [dts()],
    external: ['pixi-live2d-display/extra']
  };
};

export default [
  config('lib/index.ts', 'index'),
  config('lib/index.ts', 'cubism4', 1),
  config('lib/index.ts', 'cubism2', -1),
  declare('lib/index.types.ts')
];

