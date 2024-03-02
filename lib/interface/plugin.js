/**
 * 插件安装与卸载函数的定义
 * @callback IBasePlugin~TPluginFunction
 * @param {IBasePluginOptions} options 基础插件选项
 * @return {void}
 */

/**
 * 基础插件选项
 * @interface
 * @todo 编写插件选项
 * @memberof module:interface
 * @alias IBasePluginOptions
 * @see [IBasePluginOptions]{@link IBasePluginOptions}
 */
export class IBasePluginOptions {
}

/**
 * 基础插件接口
 * @interface IBasePlugin
 * @memberof module:interface
 * @alias IBasePlugin
 * @see [IBasePlugin]{@link IBasePlugin}
 */
export class IBasePlugin {
  /**
   * 插件安装函数
   * @abstract
   * @interface
   * @type {IBasePlugin~TPluginFunction}
   */
  install;

  /**
   * 插件卸载函数
   * @abstract
   * @type {IBasePlugin~TPluginFunction}
   */
  uninstall;
}
