import { FBasePlugin } from './base.js';

/**
 * @class
 * @classdesc 查看文档信息插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FInfoPlugin
 */
export class FInfoPlugin extends FBasePlugin {
  /**
   * @inheritDoc
   * @override
   */
  _name = 'info';

  /**
   * 信息按钮元素
   * @protected
   * @type {HTMLElement}
   */
  _button;

  /**
   * @inheritDoc
   * @override
   */
  _priority = 4;

  /**
   * @inheritDoc
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    this._button = document.createElement('div');
    this._button.className = 'live2d-menu-item live2d-flex-center';
    this._button.title = '查看文档';
    this._button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"></path></svg>
    `;
    // 添加事件监听
    this._button.addEventListener('click', this.openDocs);
    this._live2d.stage.addMenu(this._button, this._priority);
  }

  /**
   * @inheritDoc
   * @override
   */
  uninstall(live2d) {
    if (!this._enable) {
      return;
    }
    this._button.removeEventListener('click', this.openDocs);
    this._live2d.stage.removeMenu(this._button);
    // 移除引用
    this._button = null;
  }

  /**
   * 打开文档
   * @see 详情请查看[wlLive2d](https://wonder-light.github.io/wl-live2d/)
   */
  openDocs() {
    window.open('https://wonder-light.github.io/wl-live2d/');
  }
}
