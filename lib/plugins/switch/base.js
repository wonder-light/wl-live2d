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
   * 文档元素: 模型加载中
   * @protected
   * @type {HTMLElement}
   */
  _loading;

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
    this._loading = document.createElement('div');
    this._loading.className = `live2d-fixed live2d-toggle live2d-transition-all live2d-opacity-0 live2d-hidden`;
    this._loading.innerHTML = '加载中';
    // 添加事件监听
    const ref = this._live2d.ref['startSwitch'] = this.startSwitch.bind(this);
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
    const ref = this._live2d.ref['startSwitch'];
    this._button.removeEventListener('click', ref);
    this._live2d.stage.removeMenu(this._button);
    // 移除引用
    this._button = null;
    this._loading = null;
  }

  /**
   * 开始切换功能
   * @async
   * @return {Promise<void>}
   */
  async startSwitch() {
    const stage = this._live2d.stage;
    // 设置提示的左右分布
    stage.isRight() ? this._loading.classList.add('live2d-right') : this._loading.classList.remove('live2d-right');
    stage.other.appendChild(this._loading);
    await Promise.all([
      this.switch(),
      stage.fadeIn(this._loading)
    ]);
    await stage.fadeOut(this._loading);
    stage.other.removeChild(this._loading);
  }

  /**
   * 切换功能
   * @async
   * @abstract
   * @return {Promise<void>}
   */
  async switch() {}
}
