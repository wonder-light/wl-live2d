import { is, mergeAll } from 'ramda';
import { DBaseStage } from '../models/index.js';
import { EEvent } from '../utils/index.js';
import { UBaseController } from './base.js';

/**
 * @typedef {Object} UBaseStageController~TMenusItem
 * @property {HTMLElement} element 文档元素
 * @property {number} priority 元素排序优先级
 */

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
   * @protected
   * @type {DBaseStage}
   */
  _data;

  /**
   * 菜单元素数组
   * @protected
   * @type {UBaseStageController~TMenusItem[]}
   */
  _menuItems;

  /**
   * 创建live2d基础舞台数据
   * @constructor
   * @param {UOptionsController} options live2d选项数据控制器
   * @param {string} selector 父元素选择器
   * @param {?DBaseStage} data 舞台数据
   */
  constructor(options, selector, data = null) {
    super(options);
    data = mergeAll([
      data ?? {},
      { parent: this.getParentFromSelector(selector) }
    ]);
    this._data = new DBaseStage(data);
    this._menuItems = [];
    this.options.event.on(EEvent.modelLoad, this._onModelLoad, this);
  }

  /**
   * 获取包装器元素
   * @return {HTMLElement}
   */
  get wrapper() {
    return this._data.wrapper;
  }

  /**
   * 获取画布元素
   * @return {HTMLCanvasElement}
   */
  get canvas() {
    return this._data.canvas;
  }

  /**
   * 获取消息提示元素
   * @return {HTMLElement}
   */
  get tips() {
    return this._data.tips;
  }

  /**
   * 获取菜单元素
   * @return {HTMLElement}
   */
  get menus() {
    return this._data.menus;
  }

  /**
   * 获取其它元素
   * @return {HTMLElement}
   */
  get other() {
    return this._data.other;
  }

  /**
   * 获取父元素
   * @return {HTMLElement}
   */
  get parent() {
    return this._data.parent;
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
    this.wrapper.className = `${ this.optionData.fixed ? 'live2d-fixed' : 'live2d-relative' } live2d-wrapper live2d-transition-all live2d-opacity-0`;
    // 画布
    this.canvas.className = `live2d-canvas live2d-transition-all live2d-opacity-1`;
    // 消息提示
    this.tips.className = `live2d-tips live2d-shake live2d-transition-all live2d-opacity-0`;
    // 菜单
    this.menus.className = `live2d-menus live2d-transition-all live2d-opacity-0`;
    // 其它
    this.other.className = `live2d-other live2d-transition-all live2d-opacity-0`;
    // 包装器
    this.wrapper.style.backgroundColor = this.options.model.backgroundColor;
    // 模型的过度时间
    if (this.optionData.transitionTime > 0) {
      this._data.canvas.style.transitionDuration = `${ this.optionData.transitionTime }ms`;
    }
    // 提示框
    this._data.tips.style.width = `${ this.optionData.tips?.width ?? 230 }px`;
    this._data.tips.style.height = `${ this.optionData.tips?.height ?? 100 }px`;
    // 绑定事件
    this._bindEvent();
    return this;
  }

  /**
   * 元素淡入
   * @param {?HTMLElement} element 需要执行淡入的元素, 默认是包装器元素
   * @param {?TCallback} transitionend 过度完成后的回调事件
   * @param {any} context 回调事件的this指向
   * @return {UBaseStageController} 自身引用
   */
  fadeIn(element = null, transitionend = null, context = null) {
    element ??= this.wrapper;
    element.ontransitionend = () => transitionend?.call(context);
    // 添加过度类
    !element.classList.contains('live2d-transition-all') && element.classList.add('live2d-transition-all');
    element.classList.remove('live2d-hidden');
    setTimeout(() => {
      element.classList.remove('live2d-opacity-0');
      element.classList.add('live2d-opacity-1');
    }, 10);
    return this;
  }

  /**
   * 元素淡出
   * @param {HTMLElement} element 需要执行淡出的元素, 默认是包装器元素
   * @param {?TCallback} transitionend 过度完成后的回调事件
   * @param {any} context 回调事件的this指向
   * @return {UBaseStageController} 自身引用
   */
  fadeOut(element = null, transitionend = null, context = null) {
    element ??= this.wrapper;
    element.ontransitionend = () => {
      element.classList.add('live2d-hidden');
      transitionend?.call(context);
    };
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
   * 添加菜单元素
   * @param {HTMLElement} element 文档元素
   * @param {number} priority 优先级
   * @return {UBaseStageController} 自身引用
   */
  addMenu(element, priority) {
    if (is(HTMLElement, element)) {
      const index = this._menuItems.findIndex(item => priority > item.priority);
      this._menuItems.splice(index, 0, { element, priority });
      this._menuItems.sort((a, b) => b.priority - a.priority);
      // 更新节点
      this.menus.innerHTML = '';
      this.menus.append(...this._menuItems.map(item => item.element));
    }
    return this;
  }

  /**
   * 移除菜单元素
   * @param {HTMLElement} element 文档元素
   * @return {UBaseStageController} 自身引用
   */
  removeMenu(element) {
    const index = this._menuItems.findIndex(item => element === item.element);
    if (index >= 0) {
      this._menuItems.splice(index, 1);
      // 移除节点
      element.remove();
    }
    return this;
  }

  /**
   * 绑定事件
   * @protected
   */
  _bindEvent() {
    this.wrapper.addEventListener('mouseover', this._showAndHiddenMenus.bind(this, true));
    this.wrapper.addEventListener('mouseleave', this._showAndHiddenMenus.bind(this, false));
  }

  /**
   * 模型加载完成后触发的事件, 负责设置包装器的宽高, 以及调整模型大小
   * @protected
   * @param {DBaseWH} style 模型宽高
   * @return {void}
   */
  _onModelLoad(style) {
    // 画布宽和高
    this._data.canvas.style.width = this._data.wrapper.style.width = `${ style.width }px`;
    this._data.canvas.style.height = this._data.wrapper.style.height = `${ style.height }px`;
    // 当包装器元素的宽度与高度被设置后，调整一次模型的大小
    this.options.app.resize();
    // 舞台淡入
    this.fadeIn();
  }

  /**
   * 显示和隐藏菜单
   * @protected
   * @param {boolean} show true: 显示菜单, false: 隐藏菜单
   */
  _showAndHiddenMenus(show = true) {
    if (show) {
      this.fadeIn(this.menus);
    }
    else {
      this.fadeOut(this.menus);
    }
  }
}
