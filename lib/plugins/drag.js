import { FHelp } from '../utils/index.js';
import { FBasePlugin } from './base.js';

/**
 * @class
 * @classdesc 拖拽插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FDragPlugin
 */
export class FDragPlugin extends FBasePlugin {

  /**
   * 包装器元素
   * @type {HTMLElement}
   * @protected
   */
  _wrapper;

  /**
   * 拖拽时的上一个事件
   * @type {MouseEvent|TouchEvent}
   * @protected
   */
  _event;

  /**
   * 当前窗口显示区域的宽高
   * @type {DBaseWH}
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
   * @inheritDoc
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    this._wrapper = this._live2d.stage.wrapper;
    const ref = this._live2d.ref['dragLive2d'] = this.dragLive2d.bind(this);
    this._wrapper.addEventListener('mousedown', ref);
    this._wrapper.addEventListener('touchstart', ref);
  }

  /**
   * @inheritDoc
   * @override
   */
  uninstall(lived2d) {
    if (!this._enable) {
      return;
    }
    const ref = this._live2d.ref['dragLive2d'];
    this._wrapper.removeEventListener('mousedown', ref);
    this._wrapper.removeEventListener('touchstart', ref);
  }

  /**
   * 拖拽live2d包装器元素
   * @param {MouseEvent|TouchEvent} event 拖拽时的初始事件
   */
  dragLive2d(event) {
    this._event = event;
    this._screen = this._getWidthHeight();
    this._wrapper.classList.add('live2d-drag');
    this._wrapper.ontouchmove = this._wrapper.onmousemove = this._run.bind(this);
    this._wrapper.ontouchend = this._wrapper.onmouseup = this._end.bind(this);
    this._wrapper.ontouchcancel = this._wrapper.onmouseout = this._end.bind(this);
  }

  /**
   * 鼠标移动式控制包装器移动
   * @param {MouseEvent|TouchEvent} event 鼠标事件 | 触摸事件
   * @protected
   */
  _run(event) {
    const rect = this._wrapper.getBoundingClientRect();
    const next = event.targetTouches?.[0];
    const prev = this._event.targetTouches?.[0];
    // 移动量
    const movementX = next ? next.screenX - prev.screenX : event.movementX;
    const movementY = next ? next.screenY - prev.screenY : event.movementY;
    const halfWidth = this._screen.width - rect.width;
    const halfHeight = this._screen.height - rect.height;
    this._event = event;
    const { classList, style } = this._wrapper;
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
    this._wrapper.ontouchmove = this._wrapper.onmousemove = null;
    this._wrapper.ontouchend = this._wrapper.onmouseup = null;
    this._wrapper.ontouchcancel = this._wrapper.onmouseout = null;
    this._wrapper.classList.remove('live2d-drag');
  }

  /**
   * 获取当前可见视口的宽高
   * @protected
   * @return {DBaseWH} 宽高
   */
  _getWidthHeight() {
    return {
      width: Math.min(window.screen.width, window.visualViewport.width, window.innerWidth),
      height: Math.min(window.screen.height, window.visualViewport.height, window.innerHeight)
    };
  }
}
