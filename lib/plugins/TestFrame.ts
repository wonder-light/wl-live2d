import { HitAreaFrames } from 'pixi-live2d-display-advanced/extra';
import type { ULive2dController } from '../controller';
import { FBasePlugin } from './base.js';

/**
 * @class
 * @summary 测试帧插件
 * @classdesc 点击后用于显示 model 的测试帧
 * @hideconstructor
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FTestFramePlugin
 */
export class FTestFramePlugin extends FBasePlugin {
  /**
   * @default 'quit'
   * @override
   */
  public override readonly name: string = 'testFrame';

  /**
   * @default 0
   * @override
   */
  protected override _priority: number = 0;

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
   * @override
   */
  public override install(live2d: ULive2dController): void {
    super.install(live2d);
    if (!this._enable) return;
    // 关闭按钮
    this._button = document.createElement('div');
    this._button.className = 'live2d-menu-item live2d-flex-center';
    this._button.title = '开启测试帧';
    this._button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"></path></svg>
    `;
    // 添加事件监听
    const ref = this.live2d.ref['clickTestFrame'] = this.clickTestFrame.bind(this);
    this._button.addEventListener('click', ref);
    this.live2d.stage.addMenu(this._button, this._priority);
  }

  /**
   * @override
   */
  public override uninstall(live2d: ULive2dController): void {
    if (!this._enable) return;
    const ref = this.live2d.ref['clickTestFrame'];
    this._button?.removeEventListener('click', ref);
    this.live2d.stage.removeMenu(this._button!);
    // 移除引用
    this._button = null;
  }

  /**
   * 点击测试帧按钮
   * @summary 显示或关闭测试帧
   */
  public clickTestFrame(): void {
    let visible = this._button?.title == '开启测试帧';
    this._hitAreaFrames.visible = visible;
    this._button!.title = visible ? '关闭测试帧' : '开启测试帧';
    if (visible) {
      //this.live2d.model.model.getChildIndex(this._hitAreaFrames);
      this.live2d.model.model.addChild(this._hitAreaFrames);
    } else {
      this.live2d.model.model.removeChild(this._hitAreaFrames);
    }
  }
}
