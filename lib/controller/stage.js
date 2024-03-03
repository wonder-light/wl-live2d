import {DBaseStage, DLive2dOptions} from "../models/index.js";

/**
 * @class
 * @classdesc DBaseStage的控制器类
 * @requires module:modules.DBaseStage
 * @memberof module:controller
 * @alias UBaseStageController
 * @see [DBaseStage]{@link DBaseStage}
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
   * 获取包装器元素
   * @return {HTMLElement}
   */
  get wrapper() {
    return this.#data.wrapper;
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
   * @return {UBaseStageController} 自身引用
   */
  init(options) {
    this.#options = options;
    // 设置层级
    this.#data.wrapper.appendChild(this.#data.canvas);
    this.#data.wrapper.appendChild(this.#data.menus);
    this.#data.wrapper.appendChild(this.#data.tips);
    this.#data.wrapper.appendChild(this.#data.other);
    this.#data.parent.appendChild(this.#data.wrapper);
    // 添加类
    this.#data.wrapper.className = `${this.#options.fixed ? 'live2d-fixed' : 'live2d-relative'}` +
      ` live2d-wrapper live2d-z-5 live2d-w-min live2d-h-min live2d-left-0 live2d-bottom-0 live2d-touch-none live2d-transition-all live2d-opacity-0`;
    console.log(this.#data.wrapper.className);
    // 画布
    this.#data.canvas.className = `live2d-canvas live2d-relative live2d-touch-none live2d-cursor-pointer live2d-transition-all live2d-opacity-1`;
    // 消息提示
    this.#data.tips.className = `live2d-tips live2d-absolute live2d-z-6 live2d-left-center -live2d-top-100 live2d-transition-all live2d-opacity-1`;
    // 菜单
    this.#data.menus.className = `live2d-menus live2d-absolute live2d-right-0 live2d-bottom-10 live2d-z-6 live2d-transition-all live2d-opacity-1`;
    // 其它
    this.#data.other.className = `live2d-other live2d-transition-all live2d-opacity-1`;
    // 包装器
    this.#data.wrapper.style.backgroundColor = this.#options.modelController.modelData.backgroundColor ?? 'transparent';
    // 模型的过度时间
    if (this.#options.transitionTime > 0) {
      this.#data.canvas.style.transitionDuration = `${this.#options.transitionTime}ms`;
    }
    // 提示框
    this.#data.tips.style.width = `${this.#options.tips?.width ?? 230}px`;
    this.#data.tips.style.height = `${this.#options.tips?.height ?? 100}px`;

    return this;
  }

  /**
   * 设置画布的宽和高
   * @param {DBaseWH} style 模型样式
   * @return {UBaseStageController} 自身引用
   */
  setCanvasWidth(style) {
    // 画布宽和高
    this.#data.wrapper.style.width = `${style.width}px`;
    this.#data.wrapper.style.height = `${style.height}px`;
    this.#data.canvas.style.width = `${style.width}px`;
    this.#data.canvas.style.height = `${style.height}px`;
    return this;
  }

  /**
   * 元素淡入
   * @param {?HTMLElement} element 需要执行淡入的元素, 默认是包装器元素
   * @return {UBaseStageController} 自身引用
   */
  fadeIn(element = this.wrapper) {
    element ??= this.wrapper;
    // 添加过度类
    !element.classList.contains('live2d-transition-all') && element.classList.add('live2d-transition-all');
    element.classList.remove('live2d-opacity-0');
    element.classList.add('live2d-opacity-1');
    return this;
  }

  /**
   * 元素淡出
   * @param {HTMLElement} element 需要执行淡出的元素, 默认是包装器元素
   * @return {UBaseStageController} 自身引用
   */
  fadeOut(element = this.wrapper) {
    // 添加过度类
    !element.classList.contains('live2d-transition-all') && element.classList.add('live2d-transition-all');
    element.classList.remove('live2d-opacity-1');
    element.classList.add('live2d-opacity-0');
    return this;
  }

  /**
   * 隐藏包装器元素
   * @return {UBaseStageController} 自身引用
   */
  hiddenWrapper() {
    this.fadeOut(this.wrapper);
    return this;
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
