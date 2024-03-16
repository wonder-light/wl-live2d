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
   * @inheritDoc
   * @override
   */
  _name = 'tipsDrag';

  /**
   * @inheritDoc
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (this._element) {
      this._element.classList.add('live2d-cursor-default');
    }
  }

  /**
   * @inheritDoc
   * @override
   */
  uninstall(live2d) {
    super.uninstall(live2d);
    if (this._element) {
      this._element.classList.remove('live2d-cursor-default');
    }
  }

  /**
   * @inheritDoc
   * @override
   */
  isEnable() {
    return this._live2d.tips.data.drag;
  }

  /**
   * @inheritDoc
   * @override
   */
  _start(event) {
    // 阻止事件冒泡
    event.stopPropagation();
    super._start(event);
  }

  /**
   * @inheritDoc
   * @override
   */
  _run(event) {
    event.stopPropagation();
    const next = event.targetTouches?.[0];
    const prev = this._event.targetTouches?.[0];
    // 移动量
    const movementX = next ? next.screenX - prev.screenX : event.movementX;
    const movementY = next ? next.screenY - prev.screenY : event.movementY;
    const top = this._element.offsetTop + movementY;
    const left = this._element.offsetLeft + movementX;
    this._event = event;
    const style = this._element.style;
    style.top = `${ top }px`;
    style.left = `${ left }px`;
    return false;
  }

  /**
   * @inheritDoc
   * @override
   */
  getDragElement() {
    return this._live2d.stage.tips;
  }
}
