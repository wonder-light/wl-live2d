import { DBaseTips } from '../models/index.js';
import { UBaseController } from './base.js';

/**
 * @class
 * @classdesc DBaseTips的控制器类
 * @memberof module:controller
 * @alias UBaseTipsController
 */
export class UBaseTipsController extends UBaseController {
  /**
   * 基础消息提示
   * @protected
   * @type {DBaseTips}
   */
  _data;

  /**
   * 消息提示框
   * @protected
   * @type {HTMLElement}
   */
  _tips;

  /**
   * 创建基础模型控制器
   * @constructor
   * @param {UOptionsController} options live2d选项数据控制器
   * @param {?DBaseTips} data 基础模型数据
   */
  constructor(options, data = new DBaseTips()) {
    super(options);
    this._data = data;
  }

  /**
   * 初始化stage控制器
   * @return {UBaseTipsController} 自身引用
   */
  init() {
    this._tips = this.options.stage.tips;
    return this;
  }
}
