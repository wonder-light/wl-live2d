/**
 * @class
 * @classdesc 基础消息数据类
 * @memberof module:modules
 * @alias DBaseMessage
 */
export class DBaseMessage {
  /**
   * 条件函数, 模组条件时显示消息, 不满足时不显示消息
   * @type {Function}
   * @default ()=>{}
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
   * 创建基础消息数据
   * @constructor
   * @param {?DBaseMessage} options 基础消息数据
   */
  constructor(options = null) {
    this.condition = options?.condition ?? function () {
    };
    this.text = options?.text ?? [];
    this.priority = options?.priority ?? 2;
  }
}

/**
 * @class
 * @classdesc 时间消息数据类
 * @extends DBaseMessage
 * @memberof module:modules
 * @alias DTimeMessage
 */
export class DTimeMessage extends DBaseMessage {
  /**
   * 指定的小时时间段,
   * 例: 2-4, 4,
   * 如果为 null 则为正常消息
   *
   * @type {?string}
   * @default null
   */
  hour;

  /**
   * 创建时间消息数据
   * @param {?DTimeMessage} options 时间消息选项
   */
  constructor(options = null) {
    super(options);
    this.hour = options?.hour;
  }
}

/**
 * @class
 * @classdesc 季节消息数据累
 * @extends DBaseMessage
 * @memberof module:modules
 * @alias DSeasonsMessage
 */
export class DSeasonsMessage extends DBaseMessage {
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
   * 创建季节消息数据
   * @constructor
   * @param {?DSeasonsMessage} options 季节消息数据
   */
  constructor(options = null) {
    super(options);
    this.date = options?.date;
  }
}

/**
 * @class
 * @classdesc 触发事件时的消息数据累
 * @extends DBaseMessage
 * @memberof module:modules
 * @alias DBaseEventMessage
 */
export class DBaseEventMessage extends DBaseMessage {
  /**
   * 需要绑定事件的选择元素
   *
   * @type {?string}
   * @default null
   */
  selector;

  /**
   * 需要绑定的事件名称
   * @type {?string}
   * @default ''
   */
  event;

  /**
   * 丙丁指定事件
   * @type {?TEventMessageBind}
   * @default null
   */
  bind;

  /**
   * 解除事件绑定
   * @type {?TEventMessageBind}
   * @default null
   */
  unbind;

  /**
   * 创建事件消息数据
   * @constructor
   * @param {?DBaseEventMessage} options 事件消息数据
   */
  constructor(options = null) {
    super(options);
    this.selector = options?.selector;
    this.event = options?.event;
    this.bind = options?.bind;
    this.unbind = options?.unbind;
  }
}


