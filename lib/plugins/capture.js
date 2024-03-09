import { FBasePlugin } from './base.js';

/**
 * @class
 * @classdesc live2d图片捕获插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FCapturePlugin
 * @see 关于image请参阅 [Extract]{@link https://api.pixijs.io/@pixi/extract/PIXI/Extract.html}
 */
export class FCapturePlugin extends FBasePlugin {
  /**
   * @inheritDoc
   * @override
   */
  _name = 'capture';

  /**
   * @inheritDoc
   * @override
   */
  _priority = 8;

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
    this._button.title = '保存图片';
    this._button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M220.6 121.2L271.1 96 448 96v96H333.2c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24H64V128H192c9.9 0 19.7-2.3 28.6-6.8zM0 128V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H271.1c-9.9 0-19.7 2.3-28.6 6.8L192 64H160V48c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM344 304c0 48.6-39.4 88-88 88s-88-39.4-88-88s39.4-88 88-88s88 39.4 88 88z"></path></svg>
    `;
    // 添加事件监听
    const ref = this._live2d.ref['downloadImage'] = this.downloadImage.bind(this);
    this._button.addEventListener('click', ref);
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
    const ref = this._live2d.ref['downloadImage'];
    this._button.removeEventListener('click', ref);
    this._live2d.stage.removeMenu(this._button);
    // 移除引用
    this._button = null;
  }

  /**
   * 下载live2d图片
   * @return {Promise<void>}
   * @async
   */
  async downloadImage() {
    const { app } = this._live2d;
    /** @type {HTMLImageElement} */
    const img = app.renderer.plugins.extract.image(app.stage);
    // 使用 canvas 的 toDataURL
    // app.view.toDataURL();
    const url = img.getAttribute('src');
    // 通过fetch将数据转为blob, 然后在下载图片
    await fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const a = document.createElement('a');
      // 下载的文件名
      a.download = url.split('/').pop()?.slice(0, 40);
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
