/**
 * 定义高度与宽度的属性集
 * @typedef {object} DBaseWH
 * @property {number} width 宽度
 * @property {number} height 高度
 * @memberof module:modules
 * @alias DBaseWH
 */

/**
 * @class
 * @classdesc 模型基础数据类
 * @memberof module:modules
 * @alias DBaseModel
 */
export class DBaseModel {
  /**
   * 模型的json文件url地址, 必填项.
   * @type {string}
   * @default ''
   */
  path;

  /**
   * 模型的缩放比例
   * @type {?number}
   * @default 1
   */
  scale;

  /**
   * 模型在舞台中的位置. x: 横坐标, y: 纵坐标
   * @type {?{x: number, y: number}}
   * @default {x: 0, y: 0}
   */
  position;

  /**
   * 舞台的背景颜色,取有效的颜色值, rbg 或 rgba, 默认透明未设置默认为空的
   * @type {?string}
   * @default 'transparent'
   */
  backgroundColor;

  /**
   * 舞台的宽度, 单位px, 默认不设置, 将自适应使用模型本体的宽度
   * @type {?number}
   */
  width;

  /**
   * 舞台的高度, 单位px, 默认不设置, 将自适应使用模型本体的高度
   * @type {?number}
   */
  height;

  /**
   * 创建基础模型
   * @constructor
   * @param {?DBaseModel} options 基础模型选项
   */
  constructor(options = null) {
    this.path = options?.path ?? '';
    this.scale = options?.scale ?? 1;
    this.position = options?.position ?? {x: 0, y: 0};
    this.backgroundColor = options?.backgroundColor ?? 'transparent';
    this.width = options?.width;
    this.height = options?.height;
  }
}
