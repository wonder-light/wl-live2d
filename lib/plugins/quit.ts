import type { TFunc } from '../types';
import { FHelp } from '../utils';
import { FBasePlugin } from './base.js';

/**
 * @class
 * @summary 关闭和打开看板娘
 * @classdesc 用于关闭看板娘以及打开看板娘的插件
 * @hideconstructor
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FQuitPlugin
 */
export class FQuitPlugin extends FBasePlugin {
  /**
   * @default 'quit'
   * @override
   */
  public override readonly name = 'quit';

  /**
   * @default 0
   * @override
   */
  public override priority: number = 0;

  /**
   * 用于关闭看板娘的元素
   * @summary 关闭按钮元素
   * @protected
   * @type {?HTMLElement}
   */
  protected _quit: HTMLElement | null = null;

  /**
   * 用于打开看板娘的元素
   * @summary 打开按钮元素
   * @protected
   * @type {HTMLElement}
   */
  protected _show: HTMLElement | null = null;

  /**
   * 监听事件函数
   * @type {TFunc<any>}
   * @private
   */
  private _hiddenFun?: TFunc<any> = undefined;
  /**
   * 监听事件函数
   * @type {TFunc<any>}
   * @private
   */
  private _showFun?: TFunc<any> = undefined;

  /**
   * @override
   */
  public override install(): void {
    // 是否启用
    if (!this.live2d.data.menus.includes(this.name)) return;
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
    this._hiddenFun = this.hiddenLive2d.bind(this);
    this._showFun = this.showLive2d.bind(this);
    this._quit.addEventListener('click', this._hiddenFun);
    this._show.addEventListener('click', this._showFun);
    this.live2d.stage.addMenu(this._quit, this.priority);
    document.body.appendChild(this._show);
  }

  /**
   * @override
   */
  public override uninstall(): void {
    this._quit?.removeEventListener('click', this._hiddenFun);
    this._show?.removeEventListener('click', this._showFun);
    this.live2d.stage.removeMenu(this._quit!);
    this._show?.remove();
    // 移除引用
    this._quit = null;
    this._show = null;
  }

  /**
   * 在点击关闭按钮元素时隐藏 live2d 舞台
   * @summary 隐藏 live2d
   */
  public hiddenLive2d(): void {
    // 设置提示的左右分布
    this.isRight() && !this._show!.classList.contains('live2d-right') && this._show!.classList.add('live2d-right');
    // 淡出包装器元素
    this.live2d.stage.fadeOut(null).catch(FHelp.F);
    // 淡入按钮元素
    this.live2d.stage.fadeIn(this._show!).catch(FHelp.F);
  }

  /**
   * 在点击关闭按钮元素时显示 live2d 舞台
   * @summary 显示 live2d
   */
  public showLive2d(): void {
    // 淡入包装器元素
    const { stage, model } = this.live2d;
    // wrapper 为 display:none 时, 没有宽高数据, canvas 渲染会出错
    stage.wrapper.classList.remove('live2d-hidden');
    model.resetModel().then(() => {
      stage.fadeIn(stage.wrapper).catch(FHelp.F);
      stage.fadeOut(this._show).catch(FHelp.F);
    });
  }

  /**
   * 判断看板娘的显示按钮是覆盖在右边还是左边
   * @summary 判断显示按钮的位置是在左边还是右边
   * @return {boolean} true 和 false
   */
  public isRight(): boolean {
    return this.live2d.stage.isRight();
  }
}
