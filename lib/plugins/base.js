import { is } from 'ramda';

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
   * @type {UOptionsController}
   */
  _options;

  /**
   * 插件安装函数
   * @abstract
   * @param {UOptionsController} options 插件选项控制器
   * @return {void}
   */
  install(options) {
    const { data } = this._options = options;
    this._enable = !is(Array, data.menus) || data.menus.some(t => t === this._name);
  };

  /**
   * 插件卸载函数
   * @abstract
   * @param {UOptionsController} options 插件选项控制器
   * @return {void}
   */
  uninstall(options) {};
}
