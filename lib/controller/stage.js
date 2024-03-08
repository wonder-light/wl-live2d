import { DBaseStage } from '../models/index.js';
import { EEvent, FHelp } from '../utils/index.js';
import { UBaseController } from './base.js';

/**
 * @typedef {Object} UBaseStageController~TMenuItem
 * @property {HTMLElement} element 文档元素
 * @property {number} priority 元素排序优先级
 */

/**
 * @class
 * @classdesc DBaseStage的控制器类
 * @extends UBaseController
 * @memberof module:controller
 * @alias UBaseStageController
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
   * @type {UBaseStageController~TMenuItem[]}
   */
  _menuItems;

  /**
   * 创建live2d基础舞台数据
   * @constructor
   * @param {ULive2dController} live2d live2d选项数据控制器
   * @param {?string} [selector=null] 父元素选择器
   * @param {?DBaseStage} [data=null] 舞台元素数据
   * @listens EEvent#modelLoad 模型加载完成的事件
   */
  constructor(live2d, selector = null, data = null) {
    super(live2d);
    data = FHelp.mergeAll(
      data ?? {},
      { parent: this.getParentFromSelector(selector) }
    );
    this._data = new DBaseStage(data);
    this._menuItems = [];
    this.event.on(EEvent.modelLoad, this._onModelLoad, this);
    this.event.on(EEvent.modelError, this.hiddenWrapper, this);
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
   * @override
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
    this.wrapper.className = `${ this.live2dData.fixed ? 'live2d-fixed' : 'live2d-relative' } live2d-wrapper live2d-transition-all live2d-opacity-0`;
    // 画布
    this.canvas.className = `live2d-canvas live2d-transition-all live2d-opacity-1`;
    // 消息提示
    this.tips.className = `live2d-tips live2d-shake live2d-transition-all live2d-opacity-0`;
    // 菜单
    this.menus.className = `live2d-menus live2d-transition-all live2d-opacity-0`;
    // 其它
    this.other.className = `live2d-other live2d-transition-all live2d-opacity-0`;
    // 包装器
    this.wrapper.style.backgroundColor = this.live2d.model.backgroundColor;
    // 模型的过度时间
    if (this.live2dData.transitionTime > 0) {
      this.canvas.style.transitionDuration = `${ this.live2dData.transitionTime }ms`;
    }
    // 提示框
    this.tips.style.width = `${ this.live2dData.tips?.width ?? 230 }px`;
    this.tips.style.height = `${ this.live2dData.tips?.height ?? 100 }px`;
    // 绑定事件
    this._bindEvent();
    return this;
  }

  /**
   * @inheritDoc
   * @override
   */
  destroy() {
    for (const item of this._menuItems) {
      this.removeMenu(item.element);
    }
    const ref = this.ref['_showAndHiddenMenus'];
    this.wrapper.removeEventListener('mouseover', ref);
    this.wrapper.removeEventListener('mouseleave', ref);
    document.removeEventListener('touchstart', ref);
    this.wrapper.remove();
    this._data = null;
  }

  /**
   * 元素淡入
   * @param {?HTMLElement} [element=null] 需要执行淡入的元素, 默认是包装器元素
   * @return {UBaseStageController} 自身引用
   * @fires EEvent#fadeStart
   * @fires EEvent#fadeEnd
   */
  fadeIn(element = null) {
    element ??= this.wrapper;
    this.event.emit(EEvent.fadeStart);
    this.observerElement(element, (visible) => {
      const callback = () => {
        this.event.emit(EEvent.fadeEnd);
        // 清除
        element.ontransitionend = null;
      };
      if (visible && getComputedStyle(element).getPropertyValue('opacity') === '1') {
        callback();
      }
      else {
        element.ontransitionend = callback;
      }
    });
    // 添加过度类
    !element.classList.contains('live2d-transition-all') && element.classList.add('live2d-transition-all');
    element.classList.remove('live2d-hidden');
    element.classList.remove('live2d-opacity-0');
    element.classList.add('live2d-opacity-1');
    return this;
  }

  /**
   * 元素淡出
   * @param {HTMLElement} [element=null] 需要执行淡出的元素, 默认是包装器元素
   * @return {UBaseStageController} 自身引用
   * @fires EEvent#fadeStart
   * @fires EEvent#fadeEnd
   */
  fadeOut(element = null) {
    element ??= this.wrapper;
    this.event.emit(EEvent.fadeStart);
    element.ontransitionend = () => {
      element.classList.add('live2d-hidden');
      this.event.emit(EEvent.fadeEnd);
      // 清除
      element.ontransitionend = null;
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
   *
   * `css` 选择器规则优先, 其次是 `xpath` 规则, 当两个都找不到时, 则使用 `body` 为父元素
   * @param {?string} [selector=null] 选择器
   * @return {HTMLElement} 获取到的节点元素
   */
  getParentFromSelector(selector = null) {
    try {
      return document.querySelector(selector)
             ?? document.evaluate(selector, document).iterateNext()
             ?? document.body;
    }
    catch (_) {
      return document.body;
    }
  }

  /**
   * 添加菜单元素
   * @param {HTMLElement} element 文档元素
   * @param {number} [priority=2] 优先级
   * @return {UBaseStageController} 自身引用
   */
  addMenu(element, priority = 2) {
    if (FHelp.is(HTMLElement, element)) {
      this._menuItems.push({ element, priority });
      // 按优先级排序 - 从大到小
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
   *
   * 为 `wrapper` 绑定 `mouseover, mouseleave` 事件, 为 `document` 绑定 `touchstart` 事件
   * @protected
   */
  _bindEvent() {
    const ref = this.ref['_showAndHiddenMenus'] = this._showAndHiddenMenus.bind(this);
    this.wrapper.addEventListener('mouseover', ref);
    this.wrapper.addEventListener('mouseleave', ref);
    document.addEventListener('touchstart', ref);
  }

  /**
   * 模型加载完成后触发的事件, 负责设置包装器的宽高, 以及调整模型大小
   * @protected
   * @param {TBaseWH} style 模型宽高
   * @return {void}
   */
  _onModelLoad(style) {
    // 重设画布宽和高
    // transition 会导致 wrapper 的宽高不固定, 从而影响到 canvas 宽高的设置
    this.wrapper.classList.remove('live2d-transition-all');
    this.canvas.style.width = this.wrapper.style.width = `${ style.width }px`;
    this.canvas.style.height = this.wrapper.style.height = `${ style.height }px`;
    // 当包装器元素的宽度与高度被设置后，调整一次模型的大小
    this.app.resize();
    // 舞台淡入
    this.fadeIn();
  }

  /**
   * 显示和隐藏菜单
   *
   * 当鼠标进入舞台时显示菜单, 离开时隐藏
   *
   * 当触摸到舞台时显示菜单, 否则隐藏菜单
   * @protected
   * @param {MouseEvent|TouchEvent} event 鼠标事件 | 触摸事件
   */
  _showAndHiddenMenus(event) {
    if (event.type === 'mouseover' || (event.type === 'touchstart' && this.wrapper.contains(event.touches[0].target))) {
      this.fadeIn(this.menus);
    }
    else {
      this.fadeOut(this.menus);
    }
  }


  /**
   * @callback UBaseStageController~TObserver
   * @param {boolean} visible true: 完全可见, false: 完全不可见
   * @return {void}
   */
  /**
   * 观察元素的可见性变化
   * @param {HTMLElement} element
   * @param {UBaseStageController~TObserver} callback
   */
  observerElement(element, callback) {
    const observer = new IntersectionObserver((entries, observer) => {
      let entry = entries[0];
      // 1: 完全可见, 0: 完全不可见
      if (entry.intersectionRatio === 1 || entry.intersectionRatio === 0) {
        callback(entry.intersectionRatio === 1);
        observer.disconnect();
      }
    }, { threshold: [0, 1] });
    observer.observe(element);
  }
}
