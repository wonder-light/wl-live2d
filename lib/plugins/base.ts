import type { ULive2dController } from '../controller';

/**
 * @class
 * @summary 基础插件
 * @classdesc live2d 基础插件, 所有插件都需要从此类继承
 * @abstract
 * @hideconstructor
 * @memberof module:plugins
 * @alias FBasePlugin
 */
export class FBasePlugin {
  /**
   * 插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装
   * @summary 插件名称
   * @readonly
   * @type {string}
   * @default ''
   */
  public readonly name: string = '';

  /**
   * 插件优先级, 在安装插件是会按照优先级依次执行
   * @summary 优先级
   * @protected
   * @type {number}
   * @default 0
   */
  public readonly priority: number = 0;

  /**
   * 插件 live2d 上下文, 用于获取对应的数据
   * @summary live2d 上下文
   * @protected
   * @type {ULive2dController}
   */
  private _live2d: ULive2dController | null = null;

  /**
   * 插件 live2d 上下文, 用于获取对应的数据
   * @summary live2d 上下文
   * @protected
   * @type {ULive2dController}
   */
  public get live2d(): ULive2dController {
    return this._live2d!;
  }

  /**
   * 设置插排的 live2d 上下文
   * @param {FBasePlugin} plugin 插件
   * @param {ULive2dController | null} context live2d 上下文
   */
  public static setContext(plugin: FBasePlugin, context: ULive2dController | null): void {
    plugin._live2d = context;
  }

  /**
   * 在安装插件时需要调用的函数, 一般用于初始化以及事件绑定等等
   * @summary 安装插件
   * @abstract
   * @return {void}
   */
  public install(): void {}

  /**
   * 在卸载插件时需要调用的函数, 一般用于销毁数据以及事件解绑等等
   * @summary 卸载插件
   * @abstract
   * @return {void}
   */
  public uninstall(): void {}
}
