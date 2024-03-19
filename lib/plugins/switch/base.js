import { FBasePlugin } from '../base.js';

/**
 * @class
 * @classdesc 基础切换插件
 * @extends {FBasePlugin}
 * @abstract
 * @memberof module:plugins
 * @alias FBaseSwitchPlugin
 */
export class FBaseSwitchPlugin extends FBasePlugin {
  /**
   * 插件名称
   * @protected
   * @type {string}
   * @default 'switch'
   * @override
   */
  _name = 'switch';

  /**
   * 文档元素: 切换按钮
   * @protected
   * @type {HTMLElement}
   */
  _button;

  /**
   * 插件安装函数
   * @param {ULive2dController} live2d 插件选项控制器
   * @return {void}
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    this._button = document.createElement('div');
    this._button.className = 'live2d-menu-item live2d-flex-center';
    // 添加事件监听
    const ref = this._live2d.ref['switch'] = this.switch.bind(this);
    this._button.addEventListener('click', ref);
    this._live2d.stage.addMenu(this._button, this._priority);
  }

  /**
   * 插件卸载函数
   * @param {ULive2dController} live2d 插件选项控制器
   * @return {void}
   * @override
   */
  uninstall(live2d) {
    if (!this._enable) {
      return;
    }
    const ref = this._live2d.ref['switch'];
    this._button.removeEventListener('click', ref);
    this._live2d.stage.removeMenu(this._button);
    // 移除引用
    this._button = null;
  }

  /**
   * 切换功能
   * @async
   * @abstract
   * @return {Promise<void>}
   */
  async switch() {}
}
