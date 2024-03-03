/**
 * @class
 * @classdesc 事件名称
 * @memberof module:utils
 * @alias EEvent
 */
export class EEvent {
  static init = Symbol('init');
  static modelLoad = Symbol('model-load');
  static modelError = Symbol('model-error');
}

/**
 * 创建模型时的初始化事件
 * @event EEvent#init
 * @param {void}
 */
/**
 * 模型加载成功后的事件
 * @event EEvent#modelLoad
 * @param {DBaseWH} options 宽高
 */
/**
 * @event EEvent#modelError
 * @param {Error} error 错误
 */
