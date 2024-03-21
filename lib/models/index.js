/**
 * @module modules
 */

/**
 * 返回值是 bool 的回调函数
 * @summary bool 回调
 * @callback TBoolCallback
 * @return {boolean}
 * @global
 * @example
 * () => true;
 * () => false;
 */

/**
 * 包含 x, y 的位置数据
 * @summary 位置
 * @typedef {Object} TPosition
 * @property {?number} x x 轴坐标
 * @property {?number} y y 轴坐标
 * @global
 * @example
 * {}
 * {x: 10}
 * {x: 10, y: 10}
 */

/**
 * 模型数据项目可以为 DModel 或者 DModel[]
 * @summary 模型项目
 * @typedef {DModel | Array<DModel>} TModelItem
 * @global
 * @example
 * new DModel || [new DModel]
 */

/**
 * 由模型数据项目构成的模型数据集
 * @summary 数据集
 * @typedef {Array<TModelItem>} TModels
 * @global
 * @example
 * [
 *   [new DModel, new DModel],
 *   new DModel,
 * ]
 */

export * from './message.js';
export * from './model.js';
export * from './options.js';
export * from './stage.js';
export * from './tips.js';
