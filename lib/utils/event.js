/**
 * @class
 * @classdesc 事件名称
 * @memberof module:utils
 * @alias EEvent
 */
export class EEvent {
  /**
   * 控制器初始化
   * @type {symbol}
   * @static
   */
  static init = Symbol('init');
  /**
   * 控制器销毁
   * @type {symbol}
   * @static
   */
  static destroy = Symbol('destroy');
  /**
   * 模型开始加载
   * @type {symbol}
   * @static
   */
  static modelStart = Symbol('model-start');
  /**
   * 模型加载成功
   * @type {symbol}
   * @static
   */
  static modelLoad = Symbol('model-load');
  /**
   * 模型加载失败
   * @type {symbol}
   * @static
   */
  static modelError = Symbol('model-error');
  /**
   * 淡入淡出开始
   * @type {symbol}
   * @static
   */
  static fadeStart = Symbol('fade-start');
  /**
   * 淡入淡出结束
   * @type {symbol}
   * @static
   */
  static fadeEnd = Symbol('fade-end');
  /**
   * 模型运动开始
   * @type {symbol}
   * @static
   */
  static motionStart = Symbol('motion-start');
  /**
   * 模型运动完成
   * @type {symbol}
   * @static
   */
  static motionFinish = Symbol('motion-finish');
}

/**
 * 控制器初始化
 * @event EEvent#init
 */
/**
 * 模型开始加载
 * @event EEvent#modelStart
 */
/**
 * 模型加载成功
 * @event EEvent#modelLoad
 * @param {DBaseWH} options 宽高
 */
/**
 * 模型加载失败
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
/**
 * 模型运动开始
 * @event EEvent#motionStart
 * @param {string} group
 * @param {number} index
 * @param {HTMLAudioElement} audio
 */
/**
 * 模型运动完成
 * @event EEvent#motionFinish
 */
