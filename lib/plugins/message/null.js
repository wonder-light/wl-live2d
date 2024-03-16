import { FHelp } from '../../utils/index.js';
import { FBasePlugin } from '../base.js';

/**
 * @class
 * @classdesc null类型的消息提示插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FNullMessagePlugin
 */
export class FNullMessagePlugin extends FBasePlugin {
  /**
   * @inheritDoc
   * @override
   */
  _name = 'nullMessage';

  /**
   * 消息对应的类型
   * @type {?string}
   * @protected
   * @default null
   */
  _type = null;

  /**
   * 与 type 对应的消息数组
   * @type {DBaseMessage[]}
   * @protected
   * @default []
   */
  _messages;

  /**
   * 消息提示的优先级
   * @protected
   * @type {number}
   * @default 2
   */
  _priority = 2;

  /**
   * @inheritDoc
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    this.mixin();
    this._messages = this._live2d.tips.messages.filter(this.isType.bind(this));
    // 找到对应类型的消息, 并替换 condition 与 priority
    for (const message of this._messages) {
      (message.condition === FHelp.T) && (message.condition = this.condition.bind(message));
      message.priority ??= this._priority;
    }
  }

  /**
   * @inheritDoc
   * @override
   */
  uninstall(live2d) {
    if (!this._enable) {
      return;
    }
    for (const message of this._messages) {
      this.setDefault(message);
    }
  }

  /**
   * @inheritDoc
   * @override
   */
  isEnable() {
    return true;
  }

  /**
   * 判断是否是对应类型的消息
   * @param {DBaseMessage} message
   * @return {boolean}
   */
  isType(message) {
    return this._type === (message.type ?? null);
  }

  /**
   * 是否显示消息的判断函数
   * @return {boolean}
   * @this DBaseMessage
   */
  condition() {
    return true;
  }

  /**
   * 卸载时设置默认值
   * @param {DBaseMessage} message
   */
  setDefault(message) {
    message.condition = FHelp.T;
    message.priority = 2;
  }

  /**
   * 将一个类型混合到 DBaseMessage 中
   */
  mixin() {}
}
