import {DBaseStage, DLive2dOptions} from "../models/index.js";

/**
 * @public
 * @class
 * @classdesc DBaseStage的操作类
 * @requires module:modules.DBaseStage
 * @see [DBaseStage]{@link DBaseStage}
 * @memberof module:controller
 * @alias UBaseStageController
 */
export class UBaseStageController {
  /**
   * 基础模型数据
   * @private
   * @type {DBaseStage}
   */
  #data;

  /**
   * live2d数据选项
   * @type {DLive2dOptions}
   */
  #options

  /**
   * 创建live2d基础舞台数据
   * @constructor
   * @param {string} selector 父元素选择器
   * @param {?DBaseStage} data 舞台数据
   */
  constructor(selector, data = null) {
    data = Object.assign(data ?? {}, {
      parent: this.getParentFromSelector(selector),
    });
    this.#data = new DBaseStage(data);
  }

  /**
   * 获取画布元素
   * @return {HTMLCanvasElement}
   */
  get canvas() {
    return this.#data.canvas;
  }

  /**
   * 初始化stage控制器
   * @param {DLive2dOptions} options live2d数据选项
   * @param {DBaseWH} style 模型样式
   */
  init(options, style) {
    this.#options = options;
    // 添加类
    this.#data.wrapper.classList.add(...[
      this.#options.fixed ? 'live2d-fixed' : 'live2d-relative',
      'live2d-z-5',
      'live2d-w-min',
      'live2d-h-min',
      'live2d-left-0',
      'live2d-bottom-0',
      'live2d-transition-all',
      'live2d-touch-none',
      'live2d-wrapper', // 用户可以自定义的 css 类
    ]);
    // 画布
    this.#data.canvas.classList.add(...[
      'live2d-relative',
      'live2d-touch-none',
      'live2d-transition-all',
      'live2d-cursor-pointer',
      'live2d-canvas'
    ]);
    // 消息提示
    this.#data.tips.classList.add(...[
      'live2d-absolute',
      'live2d-z-6',
      'live2d-left-center', // 居中
      '-live2d-top-100',
    ]);
    // 菜单
    this.#data.menus.classList.add(...[
      'live2d-absolute',
      'live2d-right-0',
      'live2d-bottom-10',
      'live2d-z-6',
    ]);
    // 其它
    this.#data.other.classList.add(...[]);
    // 包砖砌
    this.#data.wrapper.style.backgroundColor = this.#options.modelController.modelData.backgroundColor ?? 'transparent';
    // 画布宽和高
    this.#data.canvas.style.width = `${style.width}px`;
    this.#data.canvas.style.height = `${style.height}px`;
    // 模型的过度时间
    if (this.#options.transitionTime) {
      this.#data.canvas.style.transitionDuration = `${this.#options.transitionTime}ms`;
    }
    // 提示框
    this.#data.tips.style.width = `${this.#options.tips?.width ?? 230}px`;
    this.#data.tips.style.height = `${this.#options.tips?.height ?? 100}px`;
  }

  /**
   * 从选择器中获取父元素
   * @param {string} selector 选择器
   * @return {null | Node} 返回获取到的节点
   */
  getParentFromSelector(selector) {
    if (selector == null || selector.length <= 0) {
      return null;
    }
    try {
      return document.querySelector(selector) ?? document.evaluate(selector, document).iterateNext();
    } catch (_) {
      return null;
    }
  }
}
