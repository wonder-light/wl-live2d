import { FHelp } from '../utils/index.js';

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
export class DMessage {
  /**
   * 条件函数, 模组条件时显示消息, 不满足时不显示消息
   * @summary 条件函数
   * @type {?TBoolCallback}
   * @default FHelp.T
   * @see FHelp.T
   */
  condition;

  /**
   * 在提示框中显示的消息文本, 可以是 string 也可以是 string[]
   * @summary 消息文本
   * @type {string|string[]}
   * @default ''
   */
  text;

  /**
   * 优先级, 高优先级消息将会覆盖低优先级的消息
   * @summary 消息优先级
   * @type {?number}
   * @default 2
   */
  priority;

  /**
   * 消息的类型, 例如: hour, date, event 等等
   * @summary 消息类型
   * @type {?string}
   * @default null
   */
  type;

  /**
   * 创建消息数据实例
   * @summary 消息数据构造
   * @constructor
   * @param {DMessage | null} [data=null] 消息数据
   */
  constructor(data = null) {
    // 分配未定义的属性
    FHelp.mixinProperty(this, data);
    this.condition = data?.condition ?? FHelp.T;
    this.text = data?.text ?? '';
    this.priority = data?.priority ?? DMessage.priority;
    this.type = data?.type;
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
  };
}
