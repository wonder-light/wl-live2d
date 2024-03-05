import { FBasePlugin } from './base.js';

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
   * 文档元素: 切换按钮
   * @protected
   * @type {HTMLElement}
   */
  _button;

  /**
   * @inheritDoc
   */
  install(options) {
    super.install(options);
    if (!this._enable) {
      return;
    }
    this._button = document.createElement('div');
    this._button.className = 'live2d-menu-item live2d-flex-center';
    // 添加事件监听
    const ref = this._options.ref['switch'] = this.switch.bind(this);
    this._button.addEventListener('click', ref);
    this._options.stage.addMenu(this._button, this._priority);
  }

  /**
   * @inheritDoc
   */
  uninstall(options) {
    if (!this._enable) {
      return;
    }
    const ref = this._options.ref['switch'];
    this._button.removeEventListener('click', ref);
    this._options.stage.removeMenu(this._button);
    // 移除引用
    this._button = null;
  }

  /**
   * 切换功能
   * @abstract
   */
  switch() {}
}

/**
 * @class
 * @classdesc 切换模型的插件
 * @extends {FBaseSwitchPlugin}
 * @memberof module:plugins
 * @alias FSwitchModulePlugin
 */
export class FSwitchModulePlugin extends FBaseSwitchPlugin {
  /**
   * @inheritDoc
   */
  _priority = 8;

  /**
   * @inheritDoc
   */
  install(options) {
    super.install(options);
    if (!this._enable) {
      return;
    }
    this._button.title = '切换模型';
    this._button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 64c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zm-96 96c-35.3 0-64 28.7-64 64v48c0 17.7 14.3 32 32 32h1.8l11.1 99.5c1.8 16.2 15.5 28.5 31.8 28.5h38.7c16.3 0 30-12.3 31.8-28.5L318.2 304H320c17.7 0 32-14.3 32-32V224c0-35.3-28.7-64-64-64H224zM132.3 394.2c13-2.4 21.7-14.9 19.3-27.9s-14.9-21.7-27.9-19.3c-32.4 5.9-60.9 14.2-82 24.8c-10.5 5.3-20.3 11.7-27.8 19.6C6.4 399.5 0 410.5 0 424c0 21.4 15.5 36.1 29.1 45c14.7 9.6 34.3 17.3 56.4 23.4C130.2 504.7 190.4 512 256 512s125.8-7.3 170.4-19.6c22.1-6.1 41.8-13.8 56.4-23.4c13.7-8.9 29.1-23.6 29.1-45c0-13.5-6.4-24.5-14-32.6c-7.5-7.9-17.3-14.3-27.8-19.6c-21-10.6-49.5-18.9-82-24.8c-13-2.4-25.5 6.3-27.9 19.3s6.3 25.5 19.3 27.9c30.2 5.5 53.7 12.8 69 20.5c3.2 1.6 5.8 3.1 7.9 4.5c3.6 2.4 3.6 7.2 0 9.6c-8.8 5.7-23.1 11.8-43 17.3C374.3 457 318.5 464 256 464s-118.3-7-157.7-17.9c-19.9-5.5-34.2-11.6-43-17.3c-3.6-2.4-3.6-7.2 0-9.6c2.1-1.4 4.8-2.9 7.9-4.5c15.3-7.7 38.8-14.9 69-20.5z"></path></svg>
    `;
  }

  /**
   * @inheritDoc
   */
  switch() {
    this._options.model.nextModel();
  }
}


/**
 * @class
 * @classdesc 切换模型服装的插件
 * @extends {FBaseSwitchPlugin}
 * @memberof module:plugins
 * @alias FSwitchTexturePlugin
 */
export class FSwitchTexturePlugin extends FBaseSwitchPlugin {
  /**
   * @inheritDoc
   */
  _priority = 12;

  /**
   * @inheritDoc
   */
  install(options) {
    super.install(options);
    if (!this._enable) {
      return;
    }
    this._button.title = '切换服装';
    this._button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"></path></svg>
    `;
  }

  /**
   * @inheritDoc
   */
  switch() {
    this._options.model.nextTexture();
  }
}
