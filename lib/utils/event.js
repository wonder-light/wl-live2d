/**
 * @class
 * @classdesc 事件名称
 * @memberof module:utils
 * @alias EEvent
 */
export class EEvent {
  static init = Symbol('init');
  static modelStart = Symbol('model-start');
  static modelLoad = Symbol('model-load');
  static modelError = Symbol('model-error');
  static fadeStart = Symbol('fade-start');
  static fadeEnd = Symbol('fade-end');
}

/**
 * 创建模型时的初始化事件
 * @event EEvent#init
 * @param {void}
 */
/**
 * 模型开始加载的事件
 * @event EEvent#modelStart
 */
/**
 * 模型加载成功后的事件
 * @event EEvent#modelLoad
 * @param {DBaseWH} options 宽高
 */
/**
 * 模型加载失败后的事件
 * @event EEvent#modelError
 * @param {Error} error 错误
 */
/**
 * 淡入淡出开始
 * @event EEvent#fadeStart
 */
/**
 * 淡入淡出结束
 * @event EEvent#fadeEnd
 */
