import { FDragPlugin } from './base.js';

/**
 * @class
 * @classdesc 提示框的拖拽插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FTipsDragPlugin
 */
export class FTipsDragPlugin extends FDragPlugin {
  /**
   * 插件名称
   * @protected
   * @type {string}
   * @default 'tipsDrag'
   * @override
   */
  _name = 'tipsDrag';

  /**
   * 插件安装函数
   * @param {ULive2dController} live2d 插件选项控制器
   * @return {void}
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (this._element) {
      this._element.classList.add('live2d-cursor-default');
    }
  }

  /**
   * 插件卸载函数
   * @param {ULive2dController} live2d 插件选项控制器
   * @return {void}
   * @override
   */
  uninstall(live2d) {
    super.uninstall(live2d);
    if (this._element) {
      this._element.classList.remove('live2d-cursor-default');
    }
  }

  /**
   * 判断插件是否启用
   * @return {boolean} true: 启用
   * @override
   */
  isEnable() {
    return this._live2d.tips.data.drag;
  }

  /**
   * 拖拽live2d包装器元素
   * @param {MouseEvent|TouchEvent} event 拖拽时的初始事件
   * @protected
   * @override
   */
  _start(event) {
    // 阻止事件冒泡
    event.stopPropagation();
    super._start(event);
  }

  /**
   * 鼠标移动式控制包装器移动
   * @param {MouseEvent|TouchEvent} event 鼠标事件 | 触摸事件
   * @protected
   * @override
   */
  _run(event) {
    event.stopPropagation();
    const next = event.targetTouches?.[0] ?? event;
    const prev = this._event.targetTouches?.[0] ?? this._event;
    // 移动量
    const movementX = next.screenX - prev.screenX;
    const movementY = next.screenY - prev.screenY;
    const top = this._element.offsetTop + movementY;
    const left = this._element.offsetLeft + movementX;
    this._event = event;
    const style = this._element.style;
    style.top = `${ top }px`;
    style.left = `${ left }px`;
  }

  /**
   * 获取拖拽的元素
   * @return {HTMLElement}
   * @override
   */
  getDragElement() {
    return this._live2d.stage.tips;
  }
}
