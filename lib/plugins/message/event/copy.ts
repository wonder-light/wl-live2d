import { FEventMessagePlugin } from './event.js';

/**
 * @class
 * @summary 拷贝事件消息
 * @classdesc 拷贝事件对应的消息提示插件
 * @hideconstructor
 * @extends {FEventMessagePlugin}
 * @memberof module:plugins
 * @alias FCopyMessagePlugin
 */
export class FCopyMessagePlugin extends FEventMessagePlugin {
  /**
   * @default 'copyEventMessage'
   * @override
   */
  public override readonly name = 'copyEventMessage';

  /**
   * @default 'copy'
   * @override
   */
  protected override _event: string = 'copy';

  /**
   * @override
   */
  public override addListener(): void {
    this._ref['listener'] = this.notify.bind(this);
    window.addEventListener('copy', this._ref['listener']);
  }

  /**
   * @override
   */
  public override removeListener(): void {
    window.removeEventListener('copy', this._ref['listener']);
  }
}
