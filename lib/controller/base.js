import { EEvent } from '../utils/index.js';

/**
 * @class
 * @classdesc 基础控制器
 * @memberof module:controller
 * @alias UBaseController
 * @see [UOptionsController]{@link UOptionsController}
 */
export class UBaseController {
  /**
   * live2d数据选项控制器
   * @protected
   * @type {UOptionsController}
   */
  _options;

  /**
   * 创建基础控制器
   * @param {UOptionsController} options live2d选项数据控制器
   * @listens EEvent#init
   */
  constructor(options) {
    this._options = options;
    this._options.event.once(EEvent.init, this.init, this);
  }

  /**
   * 返回数据选项控制器
   * @return {UOptionsController}
   */
  get options() {
    return this._options;
  }

  /**
   * 返回live2d数据选项
   * @return {DBaseLive2dOptions}
   */
  get optionData() {
    return this._options.options;
  }

  /**
   * 控制器初始化
   * @abstract
   */
  init() {}
}