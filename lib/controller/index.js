/**
 * @module controller
 */

/**
 * 定义高度与宽度的属性集
 * @summary 矩形盒子
 * @typedef {object} TRect
 * @property {number} width 宽度
 * @property {number} height 高度
 * @global
 * @example
 * { width: 0, height: 0 }
 */

/**
 * 没有参数且返回值为 void 的无参回调
 * @summary 无参回调
 * @callback TCallback
 * @return {void}
 * @global
 * @example
 * () => void
 */

export * from './base.js';
export * from './model.js';
export * from './live2d.js';
export * from './stage.js';
export * from './tips.js';

