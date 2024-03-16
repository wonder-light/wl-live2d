import { DBaseMessage } from '../../models/index.js';
import { FHelp } from '../../utils/index.js';
import { FNullMessagePlugin } from './null.js';

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
   * @type {string}
   * @default ''
   */
  date = '';

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
 * @alias FSeasonsMessagePlugin
 */
export class FSeasonsMessagePlugin extends FNullMessagePlugin {
  /**
   * @inheritDoc
   * @override
   */
  _name = 'seasonsMessage';

  /**
   * @inheritDoc
   * @override
   */
  _type = 'seasons';

  /**
   * @inheritDoc
   * @override
   */
  _priority = 8;

  /**
   * @typedef {DBaseMessage | DSeasonsMessage} FSeasonsMessagePlugin~TSeasonsMessage
   */
  /**
   * @inheritDoc
   * @override
   * @this FSeasonsMessagePlugin~TSeasonsMessage
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
      this.date = '';
      return false;
    }
    const now = new Date();
    return day === now.getDate() && mon === (now.getMonth() + 1);
  }

  /**
   * @inheritDoc
   * @override
   */
  mixin() {
    FHelp.mixin(DBaseMessage, DSeasonsMessage);
  }
}

