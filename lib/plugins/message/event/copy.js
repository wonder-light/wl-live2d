import { FEventMessagePlugin } from './event.js';

/**
 * @class
 * @summary 拷贝事件消息
 * @classdesc 拷贝事件对应的消息提示插件
 * @hideconstructor
 * @extends {FEventMessagePlugin}
 * @memberof module:plugins
 * @alias FCopyMessagePlugin
 */
export class FCopyMessagePlugin extends FEventMessagePlugin {
  /**
   * @default 'copyEventMessage'
   * @override
   */
  _name = 'copyEventMessage';

  /**
   * @default 'copy'
   * @override
   */
  _event = 'copy';

  /**
   * @override
   */
  addListener() {
    this._ref['listener'] = this.notify.bind(this);
    window.addEventListener('copy', this._ref['listener']);
  }

  /**
   * @override
   */
  removeListener() {
    window.removeEventListener('copy', this._ref['listener']);
  }
}
