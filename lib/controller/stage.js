import { DBaseStage } from '../models/index.js';
import { EEvent } from '../utils/index.js';
import { UBaseController } from './base.js';

/**
 * @class
 * @classdesc DBaseStage的控制器类
 * @extends UBaseController
 * @memberof module:controller
 * @alias UBaseStageController
 * @see [DBaseStage]{@link DBaseStage}
 */
export class UBaseStageController extends UBaseController {
  /**
   * 基础模型数据
   * @private
   * @type {DBaseStage}
   */
  #data;

  /**
   * 创建live2d基础舞台数据
   * @constructor
   * @param {UOptionsController} options live2d选项数据控制器
   * @param {string} selector 父元素选择器
   * @param {?DBaseStage} data 舞台数据
   */
  constructor(options, selector, data = null) {
    super(options);
    data = Object.assign(data ?? {}, {
      parent: this.getParentFromSelector(selector)
    });
    this.#data = new DBaseStage(data);
    this.options.event.once(EEvent.modelLoad, this._onModelLoad, this);
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
   * 获取消息提示元素
   * @return {HTMLElement}
   */
  get tips() {
    return this.#data.tips;
  }

  /**
   * 获取菜单元素
   * @return {HTMLElement}
   */
  get menus() {
    return this.#data.menus;
  }

  /**
   * 获取其它元素
   * @return {HTMLElement}
   */
  get other() {
    return this.#data.other;
  }

  /**
   * 获取父元素
   * @return {HTMLElement}
   */
  get parent() {
    return this.#data.parent;
  }

  /**
   * 初始化stage控制器
   * @overview
   * @return {UBaseStageController} 自身引用
   */
  init() {
    // 设置元素层级
    this.wrapper.appendChild(this.canvas);
    this.wrapper.appendChild(this.menus);
    this.wrapper.appendChild(this.tips);
    this.wrapper.appendChild(this.other);
    this.parent.appendChild(this.wrapper);
    // 添加类
    this.wrapper.className = `${ this.optionData.fixed ? 'live2d-fixed' : 'live2d-relative' }` +
                             ` live2d-wrapper live2d-z-5 live2d-w-min live2d-h-min live2d-left-0 live2d-bottom-0 live2d-touch-none live2d-transition-all live2d-opacity-0`;
    // 画布
    this.canvas.className = `live2d-canvas live2d-relative live2d-touch-none live2d-cursor-pointer live2d-transition-all live2d-opacity-1`;
    // 消息提示
    this.tips.className = `live2d-tips live2d-absolute live2d-z-6 live2d-left-center -live2d-top-100 live2d-transition-all live2d-opacity-0`;
    // 菜单
    this.menus.className = `live2d-menus live2d-absolute live2d-right-0 live2d-bottom-10 live2d-z-6 live2d-transition-all live2d-opacity-0`;
    // 其它
    this.other.className = `live2d-other live2d-transition-all live2d-opacity-0`;
    // 包装器
    this.wrapper.style.backgroundColor = this.options.model.backgroundColor;
    // 模型的过度时间
    if (this.optionData.transitionTime > 0) {
      this.#data.canvas.style.transitionDuration = `${ this.optionData.transitionTime }ms`;
    }
    // 提示框
    this.#data.tips.style.width = `${ this.optionData.tips?.width ?? 230 }px`;
    this.#data.tips.style.height = `${ this.optionData.tips?.height ?? 100 }px`;

    return this;
  }

  /**
   * 元素淡入
   * @param {?HTMLElement} element 需要执行淡入的元素, 默认是包装器元素
   * @return {UBaseStageController} 自身引用
   */
  fadeIn(element = null) {
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
  fadeOut(element = null) {
    element ??= this.wrapper;
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
    }
    catch (_) {
      return null;
    }
  }

  /**
   * 模型加载完成后触发的事件, 负责设置包装器的宽高, 以及调整模型大小
   * @public
   * @param {DBaseWH} style 模型样式
   * @return {void}
   */
  _onModelLoad(style) {
    // 画布宽和高
    this.#data.wrapper.style.width = `${ style.width }px`;
    this.#data.wrapper.style.height = `${ style.height }px`;
    this.#data.canvas.style.width = `${ style.width }px`;
    this.#data.canvas.style.height = `${ style.height }px`;
    // 当包装器元素的宽度与高度被设置后，调整一次模型的大小
    this.options.app.resize();
    // 舞台淡入
    this.options.stage.fadeIn();
  }
}
