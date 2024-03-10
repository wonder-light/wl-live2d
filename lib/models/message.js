import { FHelp } from '../utils/index.js';

/**
 * @class
 * @classdesc 基础消息数据类
 * @memberof module:modules
 * @alias DBaseMessage
 * @mixes DHourMessage
 * @mixes DSeasonsMessage
 */
export class DBaseMessage {
  /**
   * 条件函数, 模组条件时显示消息, 不满足时不显示消息
   * @type {?TMessageCondition}
   * @default null
   */
  condition;

  /**
   * 在提示框中显示的消息文本
   * @type {string|string[]}
   * @default ''
   */
  text;

  /**
   * 优先级, 高优先级消息将会覆盖低优先级的消息
   * @type {?number}
   * @default 2
   */
  priority;

  /**
   * 消息的类型, 例如: hour, date, event 等等
   * @type {?string}
   * @default null
   */
  type;

  /**
   * 创建基础消息数据
   * @constructor
   * @param {?DBaseMessage} [data=null] 基础消息数据
   */
  constructor(data = null) {
    // 分配未定义的属性
    FHelp.mixinProperty(this, data);
    this.condition = data?.condition ?? FHelp.T;
    this.text = data?.text ?? '';
    this.priority = data?.priority ?? 2;
    this.type = data?.type;
  }
}
