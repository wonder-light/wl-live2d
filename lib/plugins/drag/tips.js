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
  getDragElement() {
    return this._live2d.stage.tips;
  }
}
