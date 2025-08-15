import { DMessage } from '../../models';
import { FHelp } from '../../utils';
import { FNullMessagePlugin } from './null';

/**
 * @class
 * @summary 季节消息
 * @classdesc 与季节相关的消息数据类
 * @memberof module:plugins
 * @alias DSeasonsMessage
 * @mixin
 */
export class DSeasonsMessage extends DMessage {
  /**
   * 指定的季节日期,
   * 例: 01/01, 02/14,
   * 如果为 null 则不显示消息
   * @summary 日期
   * @type {?string}
   * @default null
   */
  public date: string | null = null;

  /**
   * 用于指示消息是否只显示一次
   * @summary 执行一次
   * @type {?boolean}
   * @default true
   */
  public once: boolean | null = true;
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
export class FSeasonsMessagePlugin extends FNullMessagePlugin<DSeasonsMessage> {
  /**
   * @default 'seasonsMessage'
   * @override
   */
  protected override _name = 'seasonsMessage';

  /**
   * @default 'seasons'
   * @override
   */
  protected override _type = 'seasons';

  /**
   * @default 16
   * @override
   */
  protected override _priority = 16;

  /**
   * @override
   * @this {DMessage & DSeasonsMessage}
   */
  public override condition(): boolean {
    const _this = this as unknown as DSeasonsMessage;
    if (_this.once === true) {
      // 只支持一次则重新赋值为 F 函数
      this.condition = FHelp.F;
    }
    const date = new Date(_this.date + '');
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
  public override mixin(): void {
    FHelp.mixin(DMessage, DSeasonsMessage);
  }
}

