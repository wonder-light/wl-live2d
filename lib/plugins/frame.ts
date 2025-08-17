import { HitAreaFrames } from 'pixi-live2d-display/extra';
import type { ULive2dController } from '../controller';
import type { TFunc } from '../types';
import { FBasePlugin } from './base.js';

/**
 * @class
 * @summary 命中区域帧检测插件
 * @classdesc 点击后用于显示 model 的帧检测
 * @hideconstructor
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FHitFramesPlugin
 */
export class FHitFramesPlugin extends FBasePlugin {
  /**
   * @default 'hitFrames'
   * @override
   */
  public override readonly name: string = 'hitFrames';

  /**
   * @default 0
   * @override
   */
  protected override _priority: number = 8;

  /**
   * 返回首页的按钮元素
   * @type {HTMLDivElement | null}
   * @protected
   */
  protected _button: HTMLDivElement | null = null;

  /**
   * 测试帧
   * @type {HitAreaFrames}
   * @protected
   */
  protected _hitAreaFrames: HitAreaFrames = new HitAreaFrames();

  /**
   * 开启和关闭时的图标
   * @type {{close: string, open: string}}
   * @private
   */
  private _icons: { open: string; close: string } = { open: '', close: '' };

  /**
   * 监听事件函数
   * @type {TFunc<any>}
   * @private
   */
  private _func?: TFunc<any> = undefined;

  /**
   * @override
   */
  public override install(live2d: ULive2dController): void {
    super.install(live2d);
    if (!this._enable) return;
    // 关闭按钮
    this._button = document.createElement('div');
    this._button.className = 'live2d-menu-item live2d-flex-center';
    this._button.title = '开启帧检测';
    this._icons.open = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3-7.7 16.2-7.7 35.2 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z"></path><path d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z m0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>`;
    this._icons.close = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M942.3 486.4l-0.1-0.1-0.1-0.1c-36.4-76.7-80-138.7-130.7-186L760.7 351c43.7 40.2 81.5 93.7 114.1 160.9C791.5 684.2 673.4 766 512 766c-51.3 0-98.3-8.3-141.2-25.1l-54.7 54.7C374.6 823.8 439.8 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0.1-51.3zM878.3 154.2l-42.4-42.4c-3.1-3.1-8.2-3.1-11.3 0L707.8 228.5C649.4 200.2 584.2 186 512 186c-192.2 0-335.4 100.5-430.2 300.3v0.1c-7.7 16.2-7.7 35.2 0 51.5 36.4 76.7 80 138.7 130.7 186.1L111.8 824.5c-3.1 3.1-3.1 8.2 0 11.3l42.4 42.4c3.1 3.1 8.2 3.1 11.3 0l712.8-712.8c3.1-3 3.1-8.1 0-11.2zM398.9 537.4c-1.9-8.2-2.9-16.7-2.9-25.4 0-61.9 50.1-112 112-112 8.7 0 17.3 1 25.4 2.9L398.9 537.4z m184.5-184.5C560.5 342.1 535 336 508 336c-97.2 0-176 78.8-176 176 0 27 6.1 52.5 16.9 75.4L263.3 673c-43.7-40.2-81.5-93.7-114.1-160.9C232.6 339.8 350.7 258 512 258c51.3 0 98.3 8.3 141.2 25.1l-69.8 69.8z"/><path d="M508 624c-6.4 0-12.7-0.5-18.8-1.6l-51.1 51.1c21.4 9.3 45.1 14.4 69.9 14.4 97.2 0 176-78.8 176-176 0-24.8-5.1-48.5-14.4-69.9l-51.1 51.1c1 6.1 1.6 12.4 1.6 18.8C620 573.9 569.9 624 508 624z"/></svg>`;
    this._button.innerHTML = this._icons.close;
    // 添加事件监听
    this._func = this.clickTestFrame.bind(this);
    this._button.addEventListener('click', this._func);
    this.live2d.stage.addMenu(this._button, this._priority);
  }

  /**
   * @override
   */
  public override uninstall(live2d: ULive2dController): void {
    if (!this._enable) return;
    this._button?.removeEventListener('click', this._func!);
    this.live2d.stage.removeMenu(this._button!);
    // 移除引用
    this._button = null;
  }

  /**
   * @override
   */
  public override isEnable(): boolean {
    const { data } = this.live2d;
    return data.hitFrame === true;
  }

  /**
   * 点击测试帧按钮
   * @summary 显示或关闭测试帧
   */
  public clickTestFrame(): void {
    if (this._button == null) return;
    let visible = /开启/.test(this._button.title);
    this._hitAreaFrames.visible = visible;
    this._button.title = visible ? '关闭帧检测' : '开启帧检测';
    this._button.innerHTML = visible ? this._icons.open : this._icons.close;
    if (visible) {
      //this.live2d.model.model.getChildIndex(this._hitAreaFrames);
      this.live2d.model.model.addChild(this._hitAreaFrames);
    } else {
      this.live2d.model.model.removeChild(this._hitAreaFrames);
    }
  }
}
