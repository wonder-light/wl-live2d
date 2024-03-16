import { DBaseMessage } from '../../models/index.js';
import { FHelp } from '../../utils/index.js';
import { FNullMessagePlugin } from './null.js';

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
 * @classdesc 小时类型的消息提示插件
 * @extends {FNullMessagePlugin}
 * @memberof module:plugins
 * @alias FHourMessagePlugin
 */
export class FHourMessagePlugin extends FNullMessagePlugin {
  /**
   * @inheritDoc
   * @override
   */
  _name = 'hourMessage';

  /**
   * @inheritDoc
   * @override
   */
  _type = 'hour';

  /**
   * @inheritDoc
   * @override
   */
  _priority = 4;

  /**
   * @typedef {DBaseMessage | DHourMessage} FHourMessagePlugin~THourMessage
   */
  /**
   * @inheritDoc
   * @override
   * @this FHourMessagePlugin~THourMessage
   */
  condition() {
    if (this.once === true) {
      // 只支持一次则重新赋值为 F 函数
      this.condition = FHelp.F;
    }
    const hour = this.hour + '-';
    const h = (new Date()).getHours();
    // number | NaN
    let [start, ent] = hour.split('-', 2).map(s => parseInt(s));
    // 24 <= NaN => true
    if (FHelp.isNotValid(start)) {
      return false;
    }
    if (FHelp.isNotValid(ent)) {
      return start === h;
    }
    return start <= h && h <= ent;
  }

  /**
   * @inheritDoc
   * @override
   */
  mixin() {
    FHelp.mixin(DBaseMessage, DHourMessage);
  }
}
