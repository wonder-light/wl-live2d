import { FEventMessagePlugin } from './event.js';

/**
 * @class
 * @classdesc 控制台打开事件对应的消息提示插件
 * @extends {FEventMessagePlugin}
 * @memberof module:plugins
 * @alias FConsoleMessagePlugin
 * @see 更多开发工具检测请参见[devtools-detect](https://github.com/sindresorhus/devtools-detect)
 */
export class FConsoleMessagePlugin extends FEventMessagePlugin {
  /**
   * 插件名称
   * @protected
   * @type {string}
   * @default 'consoleEventMessage'
   * @override
   */
  _name = 'consoleEventMessage';

  /**
   * 事件对应的类型
   * @type {string}
   * @default 'copy'
   */
  _event = 'console';

  /**
   * 打开控制器
   * @type {boolean}
   * @default false
   * @protected
   */
  _open = false;

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
    // 监听窗口大小变化
    window.addEventListener('resize', this.#ref['listener']);
    // 需要先调用一次哦
    this.#ref['listener']();
  }

  /**
   * 移除监听事件
   * @override
   */
  removeListener() {
    window.removeEventListener('resize', this.#ref['listener']);
  }

  /**
   * 通知对应的事件消息
   * @override
   */
  async notify() {
    // window.outerWidth 是整个浏览器的宽度
    // window.innerWidth 是html的展示的宽度, 如果没有打开控制台, innerWidth + scrollWidth = outerWidth
    // 通知控制台已经打开
    const open = this.isOpen();
    if (!this._open && open) {
      await super.notify();
    }
    this._open = open;
  }

  /**
   * 检测控制台是否打开
   * @return {boolean}
   */
  isOpen() {
    // 误差
    return window.outerWidth - window.innerWidth > 30 || window.outerHeight - window.innerHeight > 140;
  }
}
