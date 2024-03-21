import { FDragPlugin } from './base.js';

/**
 * @class
 * @summary tips 拖拽插件
 * @classdesc 拖拽 tips 元素的拖拽插件
 * @hideconstructor
 * @extends {FDragPlugin}
 * @memberof module:plugins
 * @alias FTipsDragPlugin
 */
export class FTipsDragPlugin extends FDragPlugin {
  /**
   * @default 'tipsDrag'
   * @override
   */
  _name = 'tipsDrag';

  /**
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (this._element) {
      this._element.classList.add('live2d-cursor-default');
    }
  }

  /**
   * @override
   */
  uninstall(live2d) {
    super.uninstall(live2d);
    if (this._element) {
      this._element.classList.remove('live2d-cursor-default');
    }
  }

  /**
   * @override
   */
  isEnable() {
    return this._live2d.tips.data.drag;
  }

  /**
   * @override
   */
  _start(event) {
    // 阻止事件冒泡
    event.stopPropagation();
    super._start(event);
  }

  /**
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
   * @override
   */
  getDragElement() {
    return this._live2d.stage.tips;
  }
}
