import type { TBoolCallback } from '../types';
import { FHelp } from '../utils';

/**
 * @class
 * @summary 消息数据类
 * @classdesc 消息数据集合, 用于存储消息数据, 包括但不限于 DMessage
 * @memberof module:modules
 * @alias DMessage
 * @mixes DHourMessage
 * @mixes DSeasonsMessage
 * @mixes DEventMessage
 */
export class DMessage implements Record<string, any> {
  /**
   * 条件函数, 满足条件时显示消息, 不满足时不显示消息
   *
   * 消息从 `condition() == true` 中的集合中选取
   * @summary 条件函数
   * @type {?TBoolCallback}
   * @default FHelp.T
   * @see FHelp.T
   */
  public condition: TBoolCallback | null;

  /**
   * 在提示框中显示的消息文本, 可以是 string 也可以是 string[]
   *
   * 是数组的话将会从其中随机选取
   * @summary 消息文本
   * @type {string|string[]}
   * @default ''
   */
  public text: string | string[];

  /**
   * 优先级, 高优先级消息将会覆盖低优先级的消息
   * @summary 消息优先级
   * @type {?number}
   * @default 2
   */
  public priority: number | null;

  /**
   * 消息的类型, 例如: hour, date, event 等等
   *
   * 也可以自定义类型用于自定义插件
   * @summary 消息类型
   * @type {?string}
   * @default null
   */
  public type: string | null;

  /**
   * 创建消息数据实例
   * @summary 消息数据构造
   * @hideconstructor
   * @param {DMessage | null} [data=null] 消息数据
   */
  public constructor(data: DMessage | null = null) {
    // 分配未定义的属性
    FHelp.mixinProperty(this, data);
    this.condition = data?.condition ?? FHelp.T;
    this.text = data?.text ?? '';
    this.priority = data?.priority ?? DMessage.priority;
    this.type = data?.type ?? null;
  }

  /**
   * getter: 消息的默认优先级
   * @summary 默认优先级
   * @type {number}
   * @default 2
   * @readonly
   */
  static get priority() {
    return 2;
  }
}
