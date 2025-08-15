import { FHelp } from '../../../utils';
import { FEventMessagePlugin } from './event';

/**
 * @class
 * @classdesc 可见性事件消息
 * @classdesc wrapper 变得可见或被隐藏时的事件对应的消息提示插件
 * @hideconstructor
 * @extends {FEventMessagePlugin}
 * @memberof module:plugins
 * @alias FVisibilityMessagePlugin
 */
export class FVisibilityMessagePlugin extends FEventMessagePlugin {
  /**
   * @default 'visibilityEventMessage'
   * @override
   */
  protected override _name: string = 'visibilityEventMessage';

  /**
   * @default 'copy'
   * @override
   */
  protected override _event: string = 'visibilitychange';

  /**
   * 判断 wrapper 是否已经显示
   * @summary wrapper 已显示
   * @type {boolean}
   * @default true
   * @protected
   */
  protected _show: boolean = true;

  /**
   * @override
   */
  public override addListener(): void {
    // 首次出现不显示通知消息
    let first = true;
    // 设置代理
    // 需要代理的方法
    const name = 'add';
    // 代理目标
    const target = this._live2d.stage.wrapper.classList;
    // 对象上的方法描述
    const desc = Object.getOwnPropertyDescriptor((target as any).__proto__, name);
    this._ref['desc'] = desc;
    const _this = this;
    // 新建描述
    const newDesc = {
      configurable: desc?.configurable,
      enumerable: desc?.enumerable,
      writable: true,
      value: function (...params: any[]) {
        // 调用原本方法
        desc?.value.bind(target)(...params);
        const show = /live2d-opacity-1/.test(target.value);
        // 第一次显示需要跳过
        if (first) {
          first = !show;
          return;
        }
        // 从隐藏 -> 显示
        if (!_this._show && show) {
          _this.notify().catch(FHelp.F);
        }
        _this._show = show;
      }
    };
    Object.defineProperty(target, name, newDesc);
  }

  /**
   * @override
   */
  public override removeListener(): void {
    const name = 'add';
    const target = this._live2d.stage.wrapper.classList;
    Object.defineProperty(target, name, this._ref['desc']);
  }
}
