import { DMessage } from '../../../models';
import { FHelp } from '../../../utils';
import { FNullMessagePlugin } from '../null';

/**
 * @class
 * @summary 事件消息
 * @classdesc 与事件相关的消息数据类
 * @memberof module:plugins
 * @alias DEventMessage
 * @mixin
 */
export class DEventMessage extends DMessage {
  /**
   * 指定的事件类型, 例如 `copy`, `console` 等等
   * @summary 事件
   * @type {?string}
   * @default null
   */
  public event: string | null = null;
}

/**
 * @class
 * @summary 事件消息
 * @classdesc 事件类型的消息提示插件
 * @hideconstructor
 * @abstract
 * @extends {FNullMessagePlugin}
 * @memberof module:plugins
 * @alias FEventMessagePlugin
 */
export class FEventMessagePlugin extends FNullMessagePlugin<DEventMessage> {
  /**
   * 插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装
   * @summary 插件名称
   * @protected
   * @type {string}
   * @default 'eventMessage'
   */
  public override readonly name: string = 'eventMessage';
  /**
   * @default 18
   * @override
   */
  public override priority: number = 18;
  /**
   * @default 'event'
   * @override
   */
  protected override _type: string = 'event';
  /**
   * 消息数据的事件对应的类型
   * @summary 事件类型
   * @type {?string}
   * @default null
   * @protected
   */
  protected _event: string | null = null;

  /**
   * 以键值对进行记录的对象引用
   * @summary 对象引用
   * @type {Record<string, any>}
   * @default {}
   * @protected
   */
  protected _ref: Record<string, any> = {};

  /**
   * @override
   */
  public override install(): void {
    super.install();
    this.addListener();
  }

  /**
   * @override
   */
  public override uninstall(): void {
    super.uninstall();
    this.removeListener();
  }

  /**
   * @override
   */
  public override isType(message: DEventMessage): boolean {
    return super.isType(message) && this._event === (message.event ?? null);
  }

  /**
   * @override
   * @this {DMessage}
   */
  condition() {
    return false;
  }

  /**
   * @override
   */
  setDefault(message: DEventMessage) {
    super.setDefault(message);
    message.condition = FHelp.F;
  }

  /**
   * 添加 event 对应的事件监听
   * @summary 添加事件
   * @abstract
   */
  addListener() {}

  /**
   * 移除 event 对应的事件监听
   * @summary 移除监事件
   * @abstract
   */
  removeListener() {}

  /**
   * 立即通知对应的事件消息
   * @summary 通知消息
   * @async
   */
  public async notify(): Promise<void> {
    // 通知对应的消息
    let messages = this._messages;
    if (messages.length <= 0) return;
    let message = messages[FHelp.random(0, messages.length, 'floor')];
    let text: string;
    if (FHelp.is(Array, message.text)) {
      text = message.text[FHelp.random(0, message.text.length, 'floor')];
    } else {
      text = message.text;
    }
    await this.live2d.tips.notify(text);
  }
}
