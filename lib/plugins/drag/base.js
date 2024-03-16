import { FHelp } from '../../utils/index.js';
import { FBasePlugin } from '../base.js';

/**
 * @class
 * @classdesc 拖拽插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FDragPlugin
 */
export class FDragPlugin extends FBasePlugin {
  /**
   * @inheritDoc
   * @override
   */
  _name = 'drag';

  /**
   * 需要拖拽的元素
   * @type {HTMLElement}
   * @protected
   */
  _element;

  /**
   * 拖拽时的上一个事件
   * @type {MouseEvent|TouchEvent}
   * @protected
   */
  _event;

  /**
   * 当前窗口显示区域的宽高
   * @type {TBaseWH}
   * @protected
   */
  _screen = { width: 0, height: 0 };

  /**
   * true: 在左边时的样式, false: 在右边时的样式
   * @type {boolean}
   * @protected
   */
  _isLeft = true;

  /**
   * 引用
   * @private
   * @type {Record<string, Function>}
   */
  #ref = {};

  /**
   * @inheritDoc
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    this._element = this.getDragElement();
    this.#ref = { start: null, run: null, end: null };
    this.#ref.start = this._start.bind(this);
    this.#ref.run = this._run.bind(this);
    this.#ref.end = this._end.bind(this);
    this._element.addEventListener('mousedown', this.#ref.start, { passive: true });
    this._element.addEventListener('touchstart', this.#ref.start, { passive: true });
  }

  /**
   * @inheritDoc
   * @override
   */
  uninstall(live2d) {
    if (!this._enable) {
      return;
    }
    this._element.removeEventListener('mousedown', this.#ref.start);
    this._element.removeEventListener('touchstart', this.#ref.start);
  }

  /**
   * @inheritDoc
   * @override
   */
  isEnable() {
    return this._live2d.data.drag;
  }

  /**
   * 拖拽live2d包装器元素
   * @param {MouseEvent|TouchEvent} event 拖拽时的初始事件
   * @protected
   */
  _start(event) {
    this._event = event;
    this._screen = this.getWidthHeight();
    const e = this._element;
    e.classList.add('live2d-drag');
    // 鼠标
    e.addEventListener('mousemove', this.#ref.run, { passive: true });
    e.addEventListener('mouseup', this.#ref.end, { passive: true });
    e.addEventListener('mouseout', this.#ref.end, { passive: true });
    // 触摸
    e.addEventListener('touchmove', this.#ref.run, { passive: true });
    e.addEventListener('touchend', this.#ref.end, { passive: true });
    e.addEventListener('touchcancel', this.#ref.end, { passive: true });
  }

  /**
   * 鼠标移动式控制包装器移动
   * @param {MouseEvent|TouchEvent} event 鼠标事件 | 触摸事件
   * @protected
   */
  _run(event) {
    const rect = this._element.getBoundingClientRect();
    const next = event.targetTouches?.[0];
    const prev = this._event.targetTouches?.[0];
    // 移动量
    const movementX = next ? next.screenX - prev.screenX : event.movementX;
    const movementY = next ? next.screenY - prev.screenY : event.movementY;
    const halfWidth = this._screen.width - rect.width;
    const halfHeight = this._screen.height - rect.height;
    this._event = event;
    const { classList, style } = this._element;
    // 限制范围
    /** @type {number} */
    const left = FHelp.clamp(0, halfWidth, rect.left + movementX);
    /** @type {number} */
    const top = FHelp.clamp(0, halfHeight, rect.top + movementY);
    // 设置 live2d 控制器的左右位置
    const isLeft = left <= halfWidth * 0.5;
    if (isLeft !== this._isLeft) {
      (this._isLeft = isLeft) ? classList.remove('live2d-right') : classList.add('live2d-right');
    }
    style.top = `${ top }px`;
    style.left = `${ left }px`;
  }

  /**
   * 鼠标抬起时清除事件
   * @protected
   */
  _end() {
    const e = this._element;
    // 鼠标
    e.removeEventListener('mousemove', this.#ref.run);
    e.removeEventListener('mouseup', this.#ref.end);
    e.removeEventListener('mouseout', this.#ref.end);
    // 触摸
    e.removeEventListener('touchmove', this.#ref.run);
    e.removeEventListener('touchend', this.#ref.end);
    e.removeEventListener('touchcancel', this.#ref.end);
    // 移除 class
    e.classList.remove('live2d-drag');
  }

  /**
   * 获取拖拽的元素
   * @return {HTMLElement}
   */
  getDragElement() {
    return this._live2d.stage.wrapper;
  }

  /**
   * 获取当前可见视口的宽高
   * @return {TBaseWH} 宽高
   */
  getWidthHeight() {
    return {
      width: Math.min(window.screen.width, window.visualViewport.width, window.innerWidth),
      height: Math.min(window.screen.height, window.visualViewport.height, window.innerHeight)
    };
  }
}
