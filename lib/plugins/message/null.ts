import type { ULive2dController } from '../../controller';
import { DMessage } from '../../models';
import { FHelp } from '../../utils';
import { FBasePlugin } from '../base';

/**
 * @class
 * @summary null 消息插件
 * @classdesc null 类型的消息提示插件
 * @hideconstructor
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FNullMessagePlugin
 */
export abstract class FNullMessagePlugin<T extends DMessage = DMessage> extends FBasePlugin {
  /**
   * 插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装
   * @summary 插件名称
   * @protected
   * @type {string}
   * @default 'nullMessage'
   */
  protected override _name: string = 'nullMessage';

  /**
   * 消息数据对应的类型
   * @summary 消息类型
   * @type {?string}
   * @protected
   * @default null
   */
  protected _type: string | null = null;

  /**
   * 与 type 对应的消息集合
   * @summary 消息集
   * @type {DMessage[]}
   * @protected
   * @default []
   */
  protected _messages: T[] = [];

  /**
   * 既是消息提示的优先级, 也是插件的优先级
   * @summary 优先级
   * @protected
   * @type {number}
   * @default 2
   */
  protected override _priority: number = 2;

  /**
   * 在安装插件时需要调用的函数, 一般用于初始化, 类型混合, 消息筛选以及事件绑定等等
   * @summary 安装插件
   * @param {ULive2dController} live2d live2d 上下文
   * @return {void}
   */
  public override install(live2d: ULive2dController): void {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    //this.mixin();
    this._messages = this._live2d.tips.messages as T[];
    this._messages = this._messages.filter(this.isType.bind(this));
    // 找到对应类型的消息, 并替换 condition 与 priority
    for (const message of this._messages) {
      message.condition = this.condition.bind(message);
      if (message.priority === DMessage.priority) {
        message.priority = this._priority;
      }
    }
  }

  /**
   * 在卸载插件时需要调用的函数, 一般用于销毁数据以及恢复消息默认值等等
   * @summary 卸载插件
   * @param {ULive2dController} _live2d live2d 上下文
   * @return {void}
   */
  public override uninstall(_live2d: ULive2dController): void {
    if (!this._enable) {
      return;
    }
    for (const message of this._messages) {
      this.setDefault(message);
    }
  }

  /**
   * 根据相关条件判断插件是否启用
   * @summary 是否启用插件
   * @return {boolean} true: 启用
   */
  public override isEnable(): boolean {
    return true;
  }

  /**
   * 判断消息类型是否与指定的类型相同
   * @summary 判断消息类型
   * @template {DMessage} T
   * @param {T} message 需需要判断的消息
   * @return {boolean} true: 相同
   */
  public isType(message: T): boolean {
    return this._type === (message.type ?? null) && message.condition === FHelp.T;
  }

  /**
   * 消息实例的判断函数, 用于判断是否显示消息
   * @summary 条件判断
   * @return {boolean} true: 可以显示该消息
   * @this DMessage
   */
  public condition(): boolean {
    return true;
  }

  /**
   * 卸载时恢复消息实例的默认值
   * @summary 恢复默认值
   * @template {DMessage} T
   * @param {T} message 消息实例
   */
  public setDefault(message: T) {
    message.condition = FHelp.T;
    if (message.priority === this._priority) {
      message.priority = DMessage.priority;
    }
  }

  /**
   * 将一个类型混合到 `DMessage` 中
   * @summary 混合类型
   */
  public mixin(): void {}
}
