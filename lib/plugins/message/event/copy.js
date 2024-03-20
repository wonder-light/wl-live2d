import { FEventMessagePlugin } from './event.js';

/**
 * @class
 * @classdesc 拷贝事件对应的消息提示插件
 * @extends {FEventMessagePlugin}
 * @memberof module:plugins
 * @alias FCopyMessagePlugin
 */
export class FCopyMessagePlugin extends FEventMessagePlugin {
  /**
   * 插件名称
   * @protected
   * @type {string}
   * @default 'copyEventMessage'
   * @override
   */
  _name = 'copyEventMessage';

  /**
   * 事件对应的类型
   * @type {string}
   * @default 'copy'
   * @override
   */
  _event = 'copy';

  /**
   * 事件引用
   * @type {Object}
   */
  #ref = {};

  /**
   * 添加监听事件
   * @override
   */
  addListener() {
    this.#ref['listener'] = this.notify.bind(this);
    window.addEventListener('copy', this.#ref['listener']);
  }

  /**
   * 移除监听事件
   * @override
   */
  removeListener() {
    window.removeEventListener('copy', this.#ref['listener']);
  }
}
