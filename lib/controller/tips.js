import { DBaseTips, DLive2dOptions } from '../models/index.js';

/**
 * @class
 * @classdesc DBaseTips的控制器类
 * @memberof module:controller
 * @alias UBaseTipsController
 */
export class UBaseTipsController {
  /**
   * 基础消息提示
   * @private
   * @type {DBaseTips}
   */
  #data;

  /**
   * live2d数据选项
   * @private
   * @type {DLive2dOptions}
   */
  #options;

  /**
   * 消息提示元素
   * @private
   * @type {HTMLElement}
   */
  #tips;

  /**
   * 创建基础模型控制器
   * @constructor
   *
   * @param {?DBaseTips} data 基础模型数据
   */
  constructor(data = new DBaseTips()) {
    this.#data = data;
  }

  /**
   * 初始化stage控制器
   * @param {DLive2dOptions} options live2d数据选项
   * @return {UBaseTipsController} 自身引用
   */
  init(options) {
    this.#options = options;
    this.#tips = options.stageController.tips;
    return this;
  }
}
