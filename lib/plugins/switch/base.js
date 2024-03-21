import { FBasePlugin } from '../base.js';

/**
 * @class
 * @summary 基础切换插件
 * @classdesc 用于切换的基础切换插件
 * @hideconstructor
 * @abstract
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FBaseSwitchPlugin
 */
export class FBaseSwitchPlugin extends FBasePlugin {
  /**
   * 插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装
   * @summary 插件名称
   * @protected
   * @type {string}
   * @default 'switch'
   */
  _name = 'switch';

  /**
   * 用于切换的按钮元素
   * @summary 切换按钮
   * @protected
   * @type {HTMLElement}
   */
  _button;

  /**
   * 用于切换模型后显示是否还在加载中的加载元素
   * @summary 加载中
   * @protected
   * @type {HTMLElement}
   */
  _loading;

  /**
   * 在安装插件时需要调用的函数, 一般用于初始化以及事件绑定等等
   * @summary 安装插件
   * @param {ULive2dController} live2d live2d 上下文
   * @return {void}
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
   * 在卸载插件时需要调用的函数, 一般用于销毁数据以及事件解绑等等
   * @summary 卸载插件
   * @param {ULive2dController} live2d live2d 上下文
   * @return {void}
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
   * 点击切换按钮后开始切换模型
   * @summary 开始切换
   * @return {Promise<void>}
   * @async
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
   * 用于切换模型或者服装
   * @summary 切换功能
   * @abstract
   * @return {Promise<void>}
   * @async
   */
  async switch() {}
}
