/**
 * @class
 * @classdesc live2d基础舞台数据
 * @memberof module:modules
 * @alias DBaseStage
 */
export class DBaseStage {
  /**
   * 父元素
   * @type {HTMLElement}
   * @default document.body
   */
  parent;

  /**
   * 画布的包装器元素
   * @type {HTMLElement}
   * @default div
   */
  wrapper;

  /**
   * 模型使用的画布元素
   * @type {HTMLCanvasElement}
   * @default canvas
   */
  canvas;

  /**
   * 消息提示使用的元素
   * @type {HTMLCanvasElement}
   * @default canvas
   */
  tips;

  /**
   * 菜单的父元素
   * @type {HTMLElement}
   * @default div
   */
  menus;

  /**
   * 与画布同级别的其它元素
   * @type {HTMLElement}
   * @default div
   */
  other;

  /**
   * 创建基础stage模型
   * @constructor
   * @param {?DBaseStage} [data=null] 基础舞台数据
   * @example
   * parent
   *     wrapper
   *         canvas
   *         tips
   *         menus
   *         other
   */
  constructor(data = null) {
    this.parent = data?.parent ?? document.body;
    this.wrapper = data?.wrapper ?? document.createElement('div');
    this.canvas = data?.canvas ?? document.createElement('canvas');
    this.tips = data?.tips ?? document.createElement('div');
    this.menus = data?.menus ?? document.createElement('div');
    this.other = data?.other ?? document.createElement('div');
  }
}
