import { FEventMessagePlugin } from './event.js';

/**
 * @class
 * @summary 控制台事件消息
 * @classdesc 控制台打开事件对应的消息提示插件
 * @hideconstructor
 * @extends {FEventMessagePlugin}
 * @memberof module:plugins
 * @alias FConsoleMessagePlugin
 * @see 更多开发工具检测请参见 [devtools-detect](https://github.com/sindresorhus/devtools-detect)
 */
export class FConsoleMessagePlugin extends FEventMessagePlugin {
  /**
   * @default 'consoleEventMessage'
   * @override
   */
  _name = 'consoleEventMessage';

  /**
   * @default 'copy'
   * @override
   */
  _event = 'console';

  /**
   * query控制台是否打开打开, true: 已打开, false: 没有打开
   * @summary 控制台打开
   * @type {boolean}
   * @default false
   * @protected
   */
  _open = false;

  /**
   * @override
   */
  addListener() {
    this._ref['listener'] = this.notify.bind(this);
    // 监听窗口大小变化
    window.addEventListener('resize', this._ref['listener']);
    // 需要先调用一次哦
    this._ref['listener']();
  }

  /**
   * @override
   */
  removeListener() {
    window.removeEventListener('resize', this._ref['listener']);
  }

  /**
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
   * @summary 控制台打开
   * @return {boolean} true: 控制台已打开
   */
  isOpen() {
    // 误差
    return window.outerWidth - window.innerWidth > 30 || window.outerHeight - window.innerHeight > 140;
  }
}
