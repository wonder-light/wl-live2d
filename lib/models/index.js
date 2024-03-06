/**
 * @module modules
 */

/**
 * 事件消息的绑定与卸载函数的定义
 * @callback TEventMessageBind
 * @return {void}
 * @global
 */

/**
 * @callback TMessageCondition
 * @return {boolean}
 * @global
 */

/**
 * @typedef {DBaseModel | Array<DBaseModel>} TBaseModelArray
 * @global
 */

/**
 * @typedef {Array<TBaseModelArray>} TBaseModel
 * @global
 */

export * from './message.js';
export * from './model.js';
export * from './options.js';
export * from './stage.js';
export * from './tips.js';
