import { FBaseSwitchPlugin } from './base';

/**
 * @class
 * @summary 服装切换插件
 * @classdesc 用于切换模型型服的切换插件
 * @hideconstructor
 * @extends {FBaseSwitchPlugin}
 * @memberof module:plugins
 * @alias FSwitchTexturePlugin
 */
export class FSwitchTexturePlugin extends FBaseSwitchPlugin {
  /**
   * @default 'switchTexture'
   * @override
   */
  public override readonly name = 'switchTexture';

  /**
   * @default 16
   * @override
   */
  public override priority: number = 32;

  /**
   * @override
   */
  public override install(): void {
    // 是否启用
    if (!this.live2d.data.menus.includes(this.name)) return;
    super.install();
    this._button!.title = '切换服装';
    this._button!.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"></path></svg>
    `;
  }

  /**
   * @summary 切换服装
   * @override
   */
  public override async switch(): Promise<void> {
    await this.live2d.model.nextTexture();
  }

  /**
   * @override
   */
  public override showLoading(): boolean {
    return this.live2d.model.hasOutfit();
  }
}
