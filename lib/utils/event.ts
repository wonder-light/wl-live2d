/**
 * 用到过的事件枚举
 * @enum {string}
 * @summary 事件枚举
 * @memberof module:utils
 * @alias EEvent
 * @see [Enumify](https://github.com/rauschma/enumify) 一个枚举的辅助库
 */
export enum EEvent {
  /**
   * 控制器初始化事件
   * @summary 初始化
   * @readonly
   * @event EEvent#init
   * @return {void}
   */
  init = 'init',
  /**
   * 控制器销毁事件
   * @summary 销毁
   * @readonly
   * @event EEvent#destroy
   * @return {void}
   */
  destroy = 'destroy',
  /**
   * 模型开始加载事件
   * @summary 开始加载
   * @readonly
   * @event EEvent#modelStart
   * @return {void}
   */
  modelStart = 'modelStart',
  /**
   * 模型加载成功事件
   * @summary 加载成功
   * @readonly
   * @event EEvent#modelLoaded
   * @param {TLive2DModel} model live2d 模型
   * @return {void}
   */
  modelLoaded = 'modelLoaded',
  /**
   * 模型加载失败事件
   * @summary 加载失败
   * @readonly
   * @event EEvent#modelError
   * @param {Error} error 错误对象
   * @return {void}
   */
  modelError = 'modelError',
  /**
   * 淡入淡出开始事件
   * @summary 过渡开始
   * @readonly
   * @event EEvent#fadeStart
   * @param {HTMLElement} element 淡入开始的元素
   * @return {void}
   */
  fadeStart = 'fadeStart',
  /**
   * 淡入淡出结束事件
   * @summary 过渡结束
   * @readonly
   * @event EEvent#fadeEnd
   * @param {HTMLElement} element 淡入结束的元素
   * @return {void}
   */
  fadeEnd = 'fadeEnd',
  /**
   * 淡入淡出取消事件
   * @summary 过渡取消
   * @readonly
   * @event EEvent#fadeCancel
   * @param {HTMLElement} element 元素
   * @return {void}
   */
  fadeCancel = 'fadeCancel',
  /**
   * 模型运动开始事件
   * @summary 运动开始
   * @readonly
   * @event EEvent#motionStart
   * @param {string[]} group motion 分组名
   * @param {number} index motion 分组中的索引
   * @param {HTMLAudioElement | null} audio motion 对应的音频
   * @return {void}
   */
  motionStart = 'motionStart',
  /**
   * 模型运动完成事件
   * @summary 运动完成
   * @readonly
   * @event EEvent#motionFinish
   * @return {void}
   */
  motionFinish = 'motionFinish',
}

// @event <className>#[event:]<eventName>
// @fires <className>#[event:]<eventName>
// @listens <eventName>
