import { FHelp } from '../utils/index.js';

/**
 * @class
 * @classdesc 基础插件
 * @abstract
 * @memberof module:plugins
 * @alias FBasePlugin
 */
export class FBasePlugin {
  /**
   * 文档元素优先级
   * @protected
   * @type {number}
   */
  _priority = 0;

  /**
   * 是否启用插件
   * @protected
   * @type {boolean}
   */
  _enable = true;

  /**
   * 插件名称
   * @protected
   * @type {string}
   */
  _name = '';

  /**
   * 插件选项控制器
   * @protected
   * @type {ULive2dController}
   */
  _options;

  /**
   * 插件安装函数
   * @abstract
   * @param {ULive2dController} options 插件选项控制器
   * @return {void}
   */
  install(options) {
    this._options = options;
    this._enable = this.isEnable();
  };

  /**
   * 插件卸载函数
   * @abstract
   * @param {ULive2dController} options 插件选项控制器
   * @return {void}
   */
  uninstall(options) {};

  /**
   * 判断插件是否启用
   * @return {boolean}
   */
  isEnable() {
    const { data } = this._options;
    return !FHelp.is(Array, data.menus) || data.menus.some(t => t === this._name);
  }
}
