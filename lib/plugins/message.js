import { F, is, T } from 'ramda';
import { DBaseMessage } from '../models/index.js';
import { FHelp } from '../utils/index.js';
import { FBasePlugin } from './base.js';

/**
 * @class
 * @classdesc 时间消息数据类
 * @memberof module:plugins
 * @alias DHourMessage
 * @mixin
 */
export class DHourMessage {
  /**
   * 指定的小时时间段,
   * 例: 2-4, 4,
   * 如果为 null 则为正常消息
   *
   * @type {?string}
   * @default null
   */
  hour = null;

  /**
   * 用于指示消息是否只显示一次
   *
   * @type {?boolean}
   * @default true
   */
  once = true;
}

/**
 * @class
 * @classdesc 季节消息数据累
 * @memberof module:plugins
 * @alias DSeasonsMessage
 * @mixin
 */
export class DSeasonsMessage {
  /**
   * 指定的季节日期,
   * 例: 01/01, 02/14,
   * 如果为 null 则为正常消息
   *
   * @type {?string}
   * @default null
   */
  date;

  /**
   * 用于指示消息是否只显示一次
   *
   * @type {?boolean}
   * @default true
   */
  once = true;
}

/**
 * @class
 * @classdesc 季节消息数据累
 * @memberof module:plugins
 * @alias DSeasonsMessage
 * @mixin
 */
export class DEventMessage {
  /**
   * 事件名称, 例如: copy, console 等等
   *
   * @type {?string}
   * @default null
   */
  event;

  /**
   * 用于指示消息是否只显示一次
   *
   * @type {?boolean}
   * @default true
   */
  once = true;
}


/**
 * @class
 * @classdesc 无类型的消息提示插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FNullMessagePlugin
 */
export class FNullMessagePlugin extends FBasePlugin {
  /**
   * 获取对应类型的消息
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
   */
  _priority = 2;

  install(options) {
    super.install(options);
    if (!this._enable) {
      return;
    }
    this.mixin();
    this._messages = this._options.tips.messages.filter(m => m.type === this._type) ?? [];
    // 找到对应类型的消息, 并替换 condition 与 priority
    for (const message of this._messages) {
      (message.condition === T) && (message.condition = this.condition.bind(message));
      message.priority ??= this._priority;
    }
  }

  uninstall(options) {
    if (!this._enable) {
      return;
    }
    for (const message of this._messages) {
      this.setDefault(message);
    }
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
    message.condition = T;
    message.priority = 2;
  }

  /**
   * 将一个类型混合到 DBaseMessage 中
   */
  mixin() {}
}

/**
 * @class
 * @classdesc 小时类型的消息提示插件
 * @extends {FNullMessagePlugin}
 * @memberof module:plugins
 * @alias FHourMessagePlugin
 */
export class FHourMessagePlugin extends FNullMessagePlugin {
  /**
   * @inheritDoc
   */
  _type = 'hour';

  /**
   * @inheritDoc
   */
  _priority = 4;

  /**
   * @typedef {DBaseMessage | DHourMessage} FHourMessagePlugin~THourMessage
   */
  /**
   * @inheritDoc
   * @this FHourMessagePlugin~THourMessage
   */
  condition() {
    if (this.once === true) {
      // 只支持一次则重新赋值为 F 函数
      this.condition = F;
    }
    const hour = is(String, this.hour) ? this.hour : '';
    const h = (new Date()).getHours();
    // number | NaN
    let [start, ent] = hour.split('-').slice(0, 2).map(s => parseInt(s));
    if (FHelp.isNotValid(start)) {
      return true;
    }
    // 24 <= NaN => true
    return (FHelp.isNotValid(ent) ? start === h : start <= h) && h <= ent;
  }

  /**
   * @inheritDoc
   */
  mixin() {
    FHelp.mixinLeft(DBaseMessage, DHourMessage);
  }
}

/**
 * @class
 * @classdesc 小时类型的消息提示插件
 * @extends {FNullMessagePlugin}
 * @memberof module:plugins
 * @alias FSeasonsMessagePlugin
 */
export class FSeasonsMessagePlugin extends FNullMessagePlugin {
  /**
   * @inheritDoc
   */
  _type = 'seasons';

  /**
   * @inheritDoc
   */
  _priority = 8;

  /**
   * @typedef {DBaseMessage | DSeasonsMessage} FSeasonsMessagePlugin~TSeasonsMessage
   */
  /**
   * @inheritDoc
   * @this FSeasonsMessagePlugin~TSeasonsMessage
   */
  condition() {
    if (this.once === true) {
      // 只支持一次则重新赋值为 F 函数
      this.condition = F;
    }
    const date = new Date(this.date);
    const day = date.getDate();
    const mon = date.getMonth() + 1;
    if (FHelp.isNotValid(day) || FHelp.isNotValid(mon)) {
      this.date = null;
      return true;
    }
    const current = new Date();
    return day === current.getDate() && mon === (current.getMonth() + 1);
  }

  /**
   * @inheritDoc
   */
  mixin() {
    FHelp.mixinLeft(DBaseMessage, DSeasonsMessage);
  }
}
