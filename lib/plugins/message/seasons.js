import { DMessage } from '../../models/index.js';
import { FHelp } from '../../utils/index.js';
import { FNullMessagePlugin } from './null.js';

/**
 * @class
 * @summary 季节消息
 * @classdesc 与季节相关的消息数据类
 * @memberof module:plugins
 * @alias DSeasonsMessage
 * @mixin
 */
export class DSeasonsMessage {
  /**
   * 指定的季节日期,
   * 例: 01/01, 02/14,
   * 如果为 null 则不显示消息
   * @summary 日期
   * @type {?string}
   * @default null
   */
  date = null;

  /**
   * 用于指示消息是否只显示一次
   * @summary 执行一次
   * @type {?boolean}
   * @default true
   */
  once = true;
}

/**
 * @class
 * @summary 季节消息插件
 * @classdesc 季节类型的消息提示插件
 * @hideconstructor
 * @extends {FNullMessagePlugin}
 * @memberof module:plugins
 * @alias FSeasonsMessagePlugin
 */
export class FSeasonsMessagePlugin extends FNullMessagePlugin {
  /**
   * @default 'seasonsMessage'
   * @override
   */
  _name = 'seasonsMessage';

  /**
   * @default 'seasons'
   * @override
   */
  _type = 'seasons';

  /**
   * @default 16
   * @override
   */
  _priority = 16;

  /**
   * @override
   * @this DMessageExtend
   */
  condition() {
    if (this.once === true) {
      // 只支持一次则重新赋值为 F 函数
      this.condition = FHelp.F;
    }
    const date = new Date(this.date + '');
    const day = date.getDate();
    const mon = date.getMonth() + 1;
    if (FHelp.isNotValid(day) || FHelp.isNotValid(mon)) {
      return false;
    }
    const now = new Date();
    return day === now.getDate() && mon === (now.getMonth() + 1);
  }

  /**
   * @override
   */
  mixin() {
    FHelp.mixin(DMessage, DSeasonsMessage);
  }
}

