import { FHelp } from '../utils/index.js';

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
   * 插件优先级, 在安装插件是会按照优先级依次执行
   * @summary 优先级
   * @protected
   * @type {number}
   * @default 0
   */
  _priority = 0;

  /**
   * true: 启用插件, false: 不启用插件
   * @summary 启用插件
   * @protected
   * @type {boolean}
   * @default true
   */
  _enable = true;

  /**
   * 插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装
   * @summary 插件名称
   * @protected
   * @type {string}
   * @default ''
   */
  _name = '';

  /**
   * 插件 live2d 上下文, 用于获取对应的数据
   * @summary live2d 上下文
   * @protected
   * @type {ULive2dController}
   */
  _live2d;

  /**
   * 插件优先级, 在安装插件是会按照优先级依次执行
   * @summary 优先级
   * @type {number}
   * @readonly
   */
  get priority() {
    return this._priority;
  }

  /**
   * 插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装
   * @summary 创建名称
   * @type {string}
   * @readonly
   */
  get name() {
    return this._name;
  };

  /**
   * 在安装插件时需要调用的函数, 一般用于初始化以及事件绑定等等
   * @summary 安装插件
   * @abstract
   * @param {ULive2dController} live2d live2d 上下文
   * @return {void}
   */
  install(live2d) {
    this._live2d = live2d;
    this._enable = this.isEnable();
  };

  /**
   * 在卸载插件时需要调用的函数, 一般用于销毁数据以及事件解绑等等
   * @summary 卸载插件
   * @abstract
   * @param {ULive2dController} live2d live2d 上下文
   * @return {void}
   */
  uninstall(live2d) {};

  /**
   * 根据相关条件判断插件是否启用
   * @summary 是否启用插件
   * @return {boolean} true: 启用
   */
  isEnable() {
    const { data } = this._live2d;
    return !FHelp.is(Array, data.menus) || data.menus.some(t => t === this._name);
  }
}
