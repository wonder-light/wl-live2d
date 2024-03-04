import { IBasePlugin } from '../interface/index.js';

/**
 * @class
 * @classdesc 关闭和显示看板娘
 * @implements {IBasePlugin}
 * @memberof module:plugins
 * @alias FQuitPlugin
 */
export class FQuitPlugin extends IBasePlugin {
  /**
   * 文档元素: 关闭看板娘
   * @protected
   * @type {HTMLElement}
   */
  _quit;

  /**
   * 文档元素: 显示看板娘
   * @protected
   * @type {HTMLElement}
   */
  _show;

  /**
   * 文档元素优先级
   * @protected
   * @type {number}
   */
  _priority;

  /**
   * 插件选项控制器
   * @protected
   * @type {UOptionsController}
   */
  _options;


  install(options) {
    this._options = options;
    const { stage } = this._options;
    this._priority = 0;
    // 关闭按钮
    this._quit = document.createElement('div');
    this._quit.className = 'live2d-menu-item live2d-flex-center';
    this._quit.title = '关闭看板娘';
    this._quit.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path></svg>
    `;
    // 显示按钮
    this._show = document.createElement('div');
    this._show.className = `live2d-fixed live2d-toggle live2d-transition-all live2d-opacity-0 live2d-hidden`;
    this._show.innerHTML = '看板娘';
    // 添加事件监听
    this._quit.addEventListener('click', this.hiddenLive2d.bind(this));
    this._show.addEventListener('click', this.showLive2d.bind(this));
    stage.addMenu(this._quit, this._priority);
    document.body.appendChild(this._show);
  }

  uninstall(options) {
    this._quit.removeEventListener('click', this.hiddenLive2d);
    this._show.removeEventListener('click', this.showLive2d);
    this._options.stage.removeMenu(this._quit);
    this._show.remove();
    // 移除引用
    this._quit = null;
    this._show = null;
  }

  /**
   * 隐藏 live2d
   */
  hiddenLive2d() {
    this.isRight() && !this._show.classList.contains('live2d-right') && this._show.classList.add('live2d-right');
    // 淡出包装器元素
    this._options.stage.fadeOut(null);
    this._options.stage.fadeIn(this._show);
  }

  /**
   * 显示 live2d
   */
  showLive2d() {
    // 淡入包装器元素
    this._options.stage.fadeIn(null);
    this._options.stage.fadeOut(this._show);
  }

  /**
   * 判断看板娘的显示按钮是覆盖在右边
   * @return {boolean} true 和 false
   */
  isRight() {
    const wrapper = this._options.stage.wrapper;
    let width = Math.min(window.screen.width, window.visualViewport.width, window.innerWidth);
    width = (width - wrapper.clientWidth) / 2;
    let left = wrapper.offsetLeft;
    return left > width;
  }
}
