import { DBaseMessage } from '../../../models/index.js';
import { FHelp } from '../../../utils/index.js';
import { FNullMessagePlugin } from '../null.js';

/**
 * @class
 * @classdesc 事件消息数据类
 * @memberof module:plugins
 * @alias DEventMessage
 * @mixin
 */
export class DEventMessage {
  /**
   * 事件类型
   * @type {?string}
   * @default null
   */
  event = null;
}

/**
 * @class
 * @classdesc 事件类型的消息提示插件
 * @abstract
 * @extends {FNullMessagePlugin}
 * @memberof module:plugins
 * @alias FEventMessagePlugin
 */
export class FEventMessagePlugin extends FNullMessagePlugin {
  /**
   * 插件名称
   * @protected
   * @type {string}
   * @default 'eventMessage'
   * @override
   */
  _name = 'eventMessage';

  /**
   * 消息对应的类型
   * @type {?string}
   * @protected
   * @default 'event'
   * @override
   */
  _type = 'event';

  /**
   * 事件对应的类型
   * @type {?string}
   * @default null
   */
  _event = null;

  /**
   * 插件的优先级
   * @protected
   * @type {number}
   * @default 18
   * @override
   */
  _priority = 18;

  /**
   * 插件安装函数
   * @param {ULive2dController} live2d 插件选项控制器
   * @return {void}
   * @override
   */
  install(live2d) {
    super.install(live2d);
    this.addListener();
  }

  /**
   * 插件卸载函数
   * @param {ULive2dController} live2d 插件选项控制器
   * @return {void}
   * @override
   */
  uninstall(live2d) {
    super.uninstall(live2d);
    this.removeListener();
  }

  /**
   * 判断是否是对应类型的消息
   * @param {DMessageExtend} message
   * @return {boolean}
   * @override
   */
  isType(message) {
    return super.isType(message) && this._event === (message.event ?? null);
  }

  /**
   * 事件消息的判断函数, 默认不触发, 只有在触发对应事件后才会进行通知
   * @return {boolean}
   * @override
   * @this DMessageExtend
   */
  condition() {
    return false;
  }

  /**
   * 将一个类型混合到 DBaseMessage 中
   * @override
   */
  mixin() {
    FHelp.mixin(DBaseMessage, DEventMessage);
  }

  /**
   * 卸载时设置默认值
   * @param {DMessageExtend} message
   * @override
   */
  setDefault(message) {
    super.setDefault(message);
    message.condition = FHelp.F;
  }

  /**
   * 添加监听事件
   * @abstract
   */
  addListener() {}

  /**
   * 移除监听事件
   * @abstract
   */
  removeListener() {}

  /**
   * 通知对应的事件消息
   */
  async notify() {
    // 通知对应的消息
    let messages = this._messages;
    if (messages.length <= 0) return;
    let message = messages[FHelp.random(0, messages.length, 'floor')];
    let text = '';
    if (FHelp.is(Array, message.text)) {
      text = message.text[FHelp.random(0, message.text.length, 'floor')];
    }
    else {
      text = message.text;
    }
    await this._live2d.tips.notify(text);
  }
}
