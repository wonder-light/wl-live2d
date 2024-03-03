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
   *
   * parent<br>
   * &emsp;&emsp;wrapper<br>
   * &emsp;&emsp;&emsp;&emsp;canvas<br>
   * &emsp;&emsp;&emsp;&emsp;tips<br>
   * &emsp;&emsp;&emsp;&emsp;menus<br>
   * &emsp;&emsp;&emsp;&emsp;other<br>
   * @constructor
   * @param {?DBaseStage} options 基础舞台数据
   */
  constructor(options = null) {
    this.parent = options?.parent ?? document.body;
    this.wrapper = options?.wrapper ?? document.createElement('div');
    this.canvas = options?.canvas ?? document.createElement('canvas');
    this.tips = options?.tips ?? document.createElement('div');
    this.menus = options?.menus ?? document.createElement('div');
    this.other = options?.other ?? document.createElement('div');
  }
}
