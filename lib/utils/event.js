/**
 * @class
 * @summary 事件枚举
 * @classdesc 用到过的事件枚举
 * @hideconstructor
 * @memberof module:utils
 * @alias EEvent
 * @see [Enumify](https://github.com/rauschma/enumify) 一个枚举的辅助库
 */
export class EEvent {
  /**
   * 控制器初始化事件
   * @summary 初始化
   * @type {symbol}
   * @readonly
   * @default Symbol('init')
   * @static
   */
  static init = Symbol('init');
  /**
   * 控制器销毁事件
   * @summary 销毁
   * @type {symbol}
   * @readonly
   * @default Symbol('destroy')
   * @static
   */
  static destroy = Symbol('destroy');
  /**
   * 模型开始加载事件
   * @summary 开始加载
   * @type {symbol}
   * @readonly
   * @default Symbol('model-start')
   * @static
   */
  static modelStart = Symbol('model-start');
  /**
   * 模型加载成功事件
   * @summary 加载成功
   * @type {symbol}
   * @readonly
   * @default Symbol('model-load')
   * @static
   */
  static modelLoad = Symbol('model-load');
  /**
   * 模型加载失败事件
   * @summary 加载失败
   * @type {symbol}
   * @readonly
   * @default Symbol('model-error')
   * @static
   */
  static modelError = Symbol('model-error');
  /**
   * 淡入淡出开始事件
   * @summary 过渡开始
   * @type {symbol}
   * @readonly
   * @default Symbol('fade-start')
   * @static
   */
  static fadeStart = Symbol('fade-start');
  /**
   * 淡入淡出结束事件
   * @summary 过渡结束
   * @type {symbol}
   * @readonly
   * @default Symbol('fade-end')
   * @static
   */
  static fadeEnd = Symbol('fade-end');
  /**
   * 淡入淡出取消事件
   * @summary 过渡取消
   * @type {symbol}
   * @readonly
   * @default Symbol('fade-cancel')
   * @static
   */
  static fadeCancel = Symbol('fade-cancel');
  /**
   * 模型运动开始事件
   * @summary 运动开始
   * @type {symbol}
   * @readonly
   * @default Symbol('motion-start')
   * @static
   */
  static motionStart = Symbol('motion-start');
  /**
   * 模型运动完成事件
   * @summary 运动完成
   * @type {symbol}
   * @readonly
   * @default Symbol('motion-finish')
   * @static
   */
  static motionFinish = Symbol('motion-finish');
}


/**
 * 控制器初始化事件
 * @summary 初始化
 * @event EEvent#init
 * @type {TCallback}
 */
/**
 * 控制器销毁事件
 * @summary 销毁
 * @event EEvent#destroy
 * @type {TCallback}
 */
/**
 * 模型开始加载事件
 * @summary 开始加载
 * @event EEvent#modelStart
 * @type {TCallback}
 */
/**
 * 模型加载成功事件
 * @summary 加载成功
 * @event EEvent#modelLoad
 * @param {TRect} options 宽高属性集
 */
/**
 * 模型加载失败事件
 * @summary 加载失败
 * @event EEvent#modelError
 * @param {Error} error 错误对象
 */
/**
 * 淡入淡出开始事件
 * @summary 过渡开始
 * @event EEvent#fadeStart
 */
/**
 * 淡入淡出结束事件
 * @summary 过渡结束
 * @event EEvent#fadeEnd
 */
/**
 * 淡入淡出取消事件
 * @summary 过渡取消
 * @event EEvent#fadeCancel
 */
/**
 * 模型运动开始事件
 * @summary 运动开始
 * @event EEvent#motionStart
 * @param {string} group motion 分组名
 * @param {number} index motion 分组中的索引
 * @param {HTMLAudioElement | null} audio motion 对应的音频
 */
/**
 * 模型运动完成事件
 * @summary 运动完成
 * @event EEvent#motionFinish
 */
