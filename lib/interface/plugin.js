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
   * @param {UOptionsController} options 插件选项控制器
   * @return {void}
   */
  install(options) {};

  /**
   * 插件卸载函数
   * @abstract
   * @param {UOptionsController} options 插件选项控制器
   * @return {void}
   */
  uninstall(options) {};
}
