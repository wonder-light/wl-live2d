/**
 * @class
 * @summary live2d 舞台数据
 * @classdesc live2d 舞台数据集合, 用于存储 canvas, tips 等文档元素
 * @memberof module:modules
 * @alias DStage
 */
export class DStage {
  /**
   * wrapper 元素的父元素, 默认是 body
   *
   * 如果 [selector]{@link DLive2dOptions.selector} 已经指定, 则父元素是 selector 对应的元素
   * @summary 父元素
   * @type {HTMLElement}
   * @default body
   */
  public parent: HTMLElement;

  /**
   * 画布的包装器元素, 即画布的父元素
   * @summary 包装器元素
   * @type {HTMLElement}
   * @default div
   */
  public wrapper: HTMLElement;

  /**
   * 模型需要使用的画布元素
   * @summary 画布元素
   * @type {HTMLCanvasElement}
   * @default canvas
   */
  public  canvas: HTMLCanvasElement;

  /**
   * 消息提示需要使用的元素
   * @summary 消息提示元素
   * @type {HTMLDivElement}
   * @default canvas
   */
  public tips: HTMLDivElement;

  /**
   * 菜单项目的父元素
   * @summary 菜单元素
   * @type {HTMLElement}
   * @default div
   */
  public menus: HTMLElement;

  /**
   * 与画布同级别的其它元素
   * @summary 其它元素
   * @type {HTMLElement}
   * @default div
   */
  public other: HTMLElement;

  /**
   * 创建 stage 中的所有元素, 如果其中的元素没有指定, 则创建默认类型的元素
   * @summary Stage数据构造
   * @hideconstructor
   * @param {DStage | null} [data=null] 舞台数据
   */
  public constructor(data: DStage | null = null) {
    this.parent = data?.parent ?? document.body;
    this.wrapper = data?.wrapper ?? document.createElement('div');
    this.canvas = data?.canvas ?? document.createElement('canvas');
    this.tips = data?.tips ?? document.createElement('div');
    this.menus = data?.menus ?? document.createElement('div');
    this.other = data?.other ?? document.createElement('div');
  }
}
