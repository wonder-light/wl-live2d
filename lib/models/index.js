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
 *
 * DModel 指模型, 用于切换模型按钮
 *
 * DModel[] 指同一模型的不同服饰, 用于切换服装按钮
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
 *    // 使用不同的模型
 *    new DModel,
 *    new DModel,
 *    new DModel,
 *   [ // 同一个模型的不同服装
 *      new DModel,
 *      new DModel,
 *      new DModel,
 *   ],
 * ]
 */

/**
 * 用于将 response 响应处理为 message 文本
 * @summary talk 处理函数
 * @callback TTalkHandle
 * @param {Response} response 响应
 * @return {Promise<string>} 文本结果
 * @global
 */

/**
 * 用于存储 url 以及处理 talk 结果的对象
 * @summary talk 对象
 * @typedef {Object} TTalkApi
 * @property {string} url 地址
 * @property {TTalkHandle} handle 处理函数
 * @property {RequestInit | undefined} init fetch 初始化数据
 * @global
 * @example
 * // 数据
 * const api = {
 *   url: 'https://v1.hitokoto.cn/',
 *   handle: async (res) => (await res.json()).hitokoto
 * }
 *
 * // 处理
 * const response = await fetch(api.url, api.init);
 * const text = await api.handle(response);
 */

export * from './message.js';
export * from './model.js';
export * from './options.js';
export * from './stage.js';
export * from './tips.js';
