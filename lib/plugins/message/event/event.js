import { DMessage } from '../../../models/index.js';
import { FHelp } from '../../../utils/index.js';
import { FNullMessagePlugin } from '../null.js';

/**
 * @class
 * @summary 事件消息
 * @classdesc 与事件相关的消息数据类
 * @memberof module:plugins
 * @alias DEventMessage
 * @mixin
 */
export class DEventMessage {
  /**
   * 指定的事件类型, 例如 `copy`, `console` 等等
   * @summary 事件
   * @type {?string}
   * @default null
   */
  event = null;
}

/**
 * @class
 * @summary 事件消息
 * @classdesc 事件类型的消息提示插件
 * @hideconstructor
 * @abstract
 * @extends {FNullMessagePlugin}
 * @memberof module:plugins
 * @alias FEventMessagePlugin
 */
export class FEventMessagePlugin extends FNullMessagePlugin {
  /**
   * 插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装
   * @summary 插件名称
   * @protected
   * @type {string}
   * @default 'eventMessage'
   */
  _name = 'eventMessage';

  /**
   * @default 'event'
   * @override
   */
  _type = 'event';

  /**
   * @default 18
   * @override
   */
  _priority = 18;

  /**
   * 消息数据的事件对应的类型
   * @summary 事件类型
   * @type {?string}
   * @default null
   * @protected
   */
  _event = null;

  /**
   * 以键值对进行记录的对象引用
   * @summary 对象引用
   * @type {Record<string, any>}
   * @default {}
   * @protected
   */
  _ref = {};

  /**
   * @override
   */
  install(live2d) {
    super.install(live2d);
    this.addListener();
  }

  /**
   * @override
   */
  uninstall(live2d) {
    super.uninstall(live2d);
    this.removeListener();
  }

  /**
   * @override
   */
  isType(message) {
    return super.isType(message) && this._event === (message.event ?? null);
  }

  /**
   * @override
   * @this DMessageExtend
   */
  condition() {
    return false;
  }

  /**
   * @override
   */
  mixin() {
    FHelp.mixin(DMessage, DEventMessage);
  }

  /**
   * @override
   */
  setDefault(message) {
    super.setDefault(message);
    message.condition = FHelp.F;
  }

  /**
   * 添加 event 对应的事件监听
   * @summary 添加事件
   * @abstract
   */
  addListener() {}

  /**
   * 移除 event 对应的事件监听
   * @summary 移除监事件
   * @abstract
   */
  removeListener() {}

  /**
   * 立即通知对应的事件消息
   * @summary 通知消息
   * @async
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
