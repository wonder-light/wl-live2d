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
  static readonly init: symbol = Symbol('init');
  /**
   * 控制器销毁事件
   * @summary 销毁
   * @type {symbol}
   * @readonly
   * @default Symbol('destroy')
   * @static
   */
  static readonly destroy: symbol = Symbol('destroy');
  /**
   * 模型开始加载事件
   * @summary 开始加载
   * @type {symbol}
   * @readonly
   * @default Symbol('model-start')
   * @static
   */
  static readonly modelStart: symbol = Symbol('model-start');
  /**
   * 模型加载成功事件
   * @summary 加载成功
   * @type {symbol}
   * @readonly
   * @default Symbol('model-load')
   * @static
   */
  static readonly modelLoad: symbol = Symbol('model-load');
  /**
   * 模型加载失败事件
   * @summary 加载失败
   * @type {symbol}
   * @readonly
   * @default Symbol('model-error')
   * @static
   */
  static readonly modelError: symbol = Symbol('model-error');
  /**
   * 淡入淡出开始事件
   * @summary 过渡开始
   * @type {symbol}
   * @readonly
   * @default Symbol('fade-start')
   * @static
   */
  static readonly fadeStart: symbol = Symbol('fade-start');
  /**
   * 淡入淡出结束事件
   * @summary 过渡结束
   * @type {symbol}
   * @readonly
   * @default Symbol('fade-end')
   * @static
   */
  static readonly fadeEnd: symbol = Symbol('fade-end');
  /**
   * 淡入淡出取消事件
   * @summary 过渡取消
   * @type {symbol}
   * @readonly
   * @default Symbol('fade-cancel')
   * @static
   */
  static readonly fadeCancel: symbol = Symbol('fade-cancel');
  /**
   * 模型运动开始事件
   * @summary 运动开始
   * @type {symbol}
   * @readonly
   * @default Symbol('motion-start')
   * @static
   */
  static readonly motionStart: symbol = Symbol('motion-start');
  /**
   * 模型运动完成事件
   * @summary 运动完成
   * @type {symbol}
   * @readonly
   * @default Symbol('motion-finish')
   * @static
   */
  static readonly motionFinish: symbol = Symbol('motion-finish');
}

/**
 * 控制器初始化事件
 * @summary 初始化
 * @event EEvent#init
 * @type {TCallback}
 * @global
 */
/**
 * 控制器销毁事件
 * @summary 销毁
 * @event EEvent#destroy
 * @type {TCallback}
 * @global
 */
/**
 * 模型开始加载事件
 * @summary 开始加载
 * @event EEvent#modelStart
 * @type {TCallback}
 * @global
 */
/**
 * 模型加载成功事件
 * @summary 加载成功
 * @event EEvent#modelLoad
 * @param {TRect} options 宽高属性集
 * @global
 */
/**
 * 模型加载失败事件
 * @summary 加载失败
 * @event EEvent#modelError
 * @param {Error} error 错误对象
 * @global
 */
/**
 * 淡入淡出开始事件
 * @summary 过渡开始
 * @event EEvent#fadeStart
 * @global
 */
/**
 * 淡入淡出结束事件
 * @summary 过渡结束
 * @event EEvent#fadeEnd
 * @global
 */
/**
 * 淡入淡出取消事件
 * @summary 过渡取消
 * @event EEvent#fadeCancel
 * @global
 */
/**
 * 模型运动开始事件
 * @summary 运动开始
 * @event EEvent#motionStart
 * @param {string} group motion 分组名
 * @param {number} index motion 分组中的索引
 * @param {HTMLAudioElement | null} audio motion 对应的音频
 * @global
 */
/**
 * 模型运动完成事件
 * @summary 运动完成
 * @event EEvent#motionFinish
 * @global
 */
