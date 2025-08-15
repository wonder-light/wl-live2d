import { DMessage } from '../../models';
import { FHelp } from '../../utils';
import { FNullMessagePlugin } from './null.js';

/**
 * @class
 * @summary 时间消息
 * @classdesc 与时间相关的消息数据类
 * @memberof module:plugins
 * @alias DHourMessage
 * @mixin
 */
export class DHourMessage extends DMessage {
  /**
   * 指定的小时时间段,
   * 例: 2-4, 4,
   * 如果为 null 则不显示消息
   * @summary 小时
   * @type {?string}
   * @default null
   */
  public hour: string | null = null;

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
 * @summary 小时消息插件
 * @classdesc 小时类型的消息提示插件
 * @hideconstructor
 * @extends {FNullMessagePlugin}
 * @memberof module:plugins
 * @alias FHourMessagePlugin
 */
export class FHourMessagePlugin extends FNullMessagePlugin<DHourMessage> {
  /**
   * @default 'hourMessage'
   * @override
   */
  public override readonly name: string = 'hourMessage';

  /**
   * @default 'hour'
   * @override
   */
  protected override _type: string = 'hour';

  /**
   * @default 8
   * @override
   */
  protected override _priority: number = 8;

  /**
   * @override
   * @this {DMessage & DHourMessage}
   */
  public override condition(): boolean {
    const _this = this as unknown as DHourMessage;
    if (_this.once === true) {
      // 只支持一次则重新赋值为 F 函数
      this.condition = FHelp.F;
    }
    const hour = _this.hour + '-';
    const now = (new Date()).getHours();
    // number | NaN
    let [start, ent] = hour.split('-', 2).map(s => parseInt(s));
    // 24 <= NaN => true
    if (FHelp.isNotValid(start)) {
      return false;
    }
    if (FHelp.isNotValid(ent)) {
      return start === now;
    }
    return start <= now && now <= ent;
  }

  /**
   * @override
   */
  public override mixin(): void {
    FHelp.mixin(DMessage, DHourMessage);
  }
}
