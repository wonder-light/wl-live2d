import { FDragPlugin } from './base';

/**
 * @class
 * @summary tips 拖拽插件
 * @classdesc 拖拽 tips 元素的拖拽插件
 * @hideconstructor
 * @extends {FDragPlugin}
 * @memberof module:plugins
 * @alias FTipsDragPlugin
 */
export class FTipsDragPlugin extends FDragPlugin {
  /**
   * @default 'tipsDrag'
   * @override
   */
  public override readonly name = 'tipsDrag';

  /**
   * @override
   */
  public override install(): void {
    super.install();
    if (this._element) {
      this._element.classList.add('live2d-cursor-default');
    }
  }

  /**
   * @override
   */
  public override uninstall(): void {
    this._element?.classList.remove('live2d-cursor-default');
    super.uninstall();
  }

  /**
   * @override
   */
  public override getDragElement(): HTMLElement {
    return this.live2d.stage.tips;
  }

  /**
   * @override
   */
  protected override _start(event: MouseEvent & TouchEvent): void {
    // 阻止事件冒泡
    event.stopPropagation();
    super._start(event);
  }

  /**
   * @override
   */
  protected override _run(event: MouseEvent & TouchEvent): void {
    event.stopPropagation();
    const next = event.targetTouches?.[0] ?? event;
    const prev = this._event?.targetTouches?.[0] ?? this._event;
    // 移动量
    const movementX = next.screenX - prev!.screenX;
    const movementY = next.screenY - prev!.screenY;
    const top = this._element!.offsetTop + movementY;
    const left = this._element!.offsetLeft + movementX;
    this._event = event;
    const style = this._element!.style;
    style.top = `${ top }px`;
    style.left = `${ left }px`;
  }
}
