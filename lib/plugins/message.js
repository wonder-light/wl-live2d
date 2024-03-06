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
      (message.condition === FHelp.T) && (message.condition = this.condition.bind(message));
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
    message.condition = FHelp.T;
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
      this.condition = FHelp.F;
    }
    const hour = FHelp.is(String, this.hour) ? this.hour : '';
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
      this.condition = FHelp.F;
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

/**
 * @class
 * @classdesc 诶人一言插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FSentenceMessagePlugin
 * @see [一言API]{@link https://developer.hitokoto.cn/sentence/demo.html}
 *
 *      [夏柔-每日一言]{@link https://api.aa1.cn/doc/yiyan.html}
 *
 *      [TenApi-随机一言]{@link https://docs.tenapi.cn/random/yiyan.html#%E9%9A%8F%E6%9C%BA%E4%B8%80%E8%A8%80}
 */
export class FSentenceMessagePlugin extends FBasePlugin {
  /**
   * @inheritDoc
   */
  _priority = 20;

  /**
   * 每日一言
   * @type {string}
   * @protected
   */
  _type = 'sentence';

  /**
   * 每日一言使用的消息载体
   * @type {DBaseMessage}
   * @protected
   */
  _message;

  /**
   * 获取每日一言的间隔时间, 单位ms
   * @type {?number}
   * @protected
   * @default 30s
   */
  _interval = 30000;

  /**
   * 时间间隔定时器句柄
   * @protected
   * @type {?number}
   * @default null
   */
  _handler;

  /**
   * @inheritDoc
   */
  install(options) {
    super.install(options);
    if (!this._enable) {
      return;
    }
    this._message = new DBaseMessage();
    this._message.condition = FHelp.F;
    this._message.priority = this._priority;
    this._message.type = this._type;
    // 经过一定时间 `interval` 才开始
    this._handler = setInterval(this.getSentence.bind(this), this._interval);
    this._options.tips.addMessage(this._message);
  }

  /**
   * 是否显示消息的判断函数
   * @return {boolean} true: 显示
   * @this DBaseMessage
   */
  condition() {
    this.condition = FHelp.F;
    return true;
  }

  uninstall(options) {
    clearInterval(this._interval);
    this._interval = null;
    this._options.tips.removeMessage(this._message);
    this._message = null;
  }

  async getSentence() {
    try {
      this._message.text = await fetch('https://v1.hitokoto.cn/')
      .then(async response => (await response.json()).hitokoto)
      .catch(() => fetch('https://v.api.aa1.cn/api/yiyan/index.php'))
      .then(async response => (await response.text()).match(/<p>(.*)<\/p>/)[1])
      .catch(() => fetch('https://tenapi.cn/v2/yiyan'))
      .then(async response => await response.text());
      // 获取文本后才设置 condition 返回true
      this._message.condition = this.condition.bind(this._message);
    }
    catch (_) {}
  }
}
