import { EEvent } from '../utils/index.js';

/**
 * @class
 * @classdesc 基础控制器
 * @abstract
 * @memberof module:controller
 * @alias UBaseController
 * @see [ULive2dController]{@link ULive2dController}
 */
export class UBaseController {
  /**
   * live2d数据选项控制器
   * @protected
   * @type {ULive2dController}
   */
  _options;

  /**
   * 创建基础控制器
   * @param {ULive2dController} options live2d选项数据控制器
   * @listens EEvent#init
   */
  constructor(options) {
    this._options = options;
    this._options.event.once(EEvent.init, this.init, this);
    this._options.event.once(EEvent.destroy, this.destroy, this);
  }

  /**
   * 返回数据选项控制器
   * @return {ULive2dController}
   */
  get options() {
    return this._options;
  }

  /**
   * 返回live2d数据选项
   * @return {DBaseLive2dOptions}
   */
  get optionData() {
    return this._options.data;
  }

  /**
   * 控制器初始化
   * @abstract
   */
  init() {}

  /**
   * 销毁控制器
   * @abstract
   */
  destroy() {}
}
