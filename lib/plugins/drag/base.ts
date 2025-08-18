import type { TRect } from '../../types';
import { FHelp } from '../../utils';
import { FBasePlugin } from '../base';

/**
 * @class
 * @summary wrapper 拖拽插件
 * @classdesc 拖拽 wrapper 元素的拖拽插件
 * @hideconstructor
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FDragPlugin
 */
export class FDragPlugin extends FBasePlugin {
  /**
   * 插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装
   * @summary 插件名称
   * @protected
   * @type {string}
   * @default 'drag'
   */
  public override readonly name: string = 'drag';
  /**
   * 当前窗口显示区域的宽高
   * @summary 窗口宽高
   * @type {TRect}
   * @protected
   */
  protected _screen: TRect = { width: 0, height: 0 };
  /**
   * true: wrapper 在左边, false: wrapper 在右边
   * @summary wrapper 的左右位置
   * @type {boolean}
   * @default true
   * @protected
   */
  protected _isLeft: boolean = true;
  protected _startFun!: (event: any) => void;
  protected _runFun!: (event: any) => void;
  protected _endFun!: () => void;
  /**
   * 需要进行拖拽的元素 - stage.wrapper
   * @summary 拖拽的元素
   * @type {HTMLElement}
   * @protected
   */
  protected _element: HTMLElement | null = null;
  /**
   * 拖拽时的上一个事件数据
   * @summary 拖拽事件数据
   * @type {MouseEvent|TouchEvent}
   * @protected
   */
  protected _event: (MouseEvent & TouchEvent) | null = null;

  /**
   * 在安装插件时需要调用的函数, 一般用于初始化以及事件绑定等等
   * @summary 安装插件
   * @return {void}
   */
  public override install(): void {
    // 是否启用
    if (!this.live2d.data.drag) return;
    this._element = this.getDragElement();
    this._startFun = this._start.bind(this);
    this._runFun = this._run.bind(this);
    this._endFun = this._end.bind(this);
    this._element.addEventListener('mousedown', this._startFun, { passive: true });
    this._element.addEventListener('touchstart', this._startFun, { passive: true });
  }

  /**
   * 在卸载插件时需要调用的函数, 一般用于销毁数据以及事件解绑等等
   * @summary 卸载插件
   * @return {void}
   */
  public override uninstall(): void {
    this._element?.removeEventListener('mousedown', this._startFun);
    this._element?.removeEventListener('touchstart', this._startFun);
    this._element = null;
  }

  /**
   * 获取当前需要进行拖拽的元素
   * @summary 获取拖拽元素
   * @return {HTMLElement}
   */
  public getDragElement(): HTMLElement {
    return this.live2d.stage.wrapper;
  }

  /**
   * 获取当前窗口显示区域的宽高
   * @summary 获取窗口宽高
   * @return {TRect} 宽高
   */
  public getWidthHeight(): TRect {
    return {
      width: Math.min(window.screen.width, window.visualViewport!.width, window.innerWidth),
      height: Math.min(window.screen.height, window.visualViewport!.height, window.innerHeight)
    };
  }

  /**
   * 当鼠标移动或者触摸移动时持续更新拖拽位置
   * @summary 运行拖拽
   * @param {MouseEvent|TouchEvent} event 鼠标事件 | 触摸事件
   * @protected
   */
  protected _run(event: MouseEvent & TouchEvent): void {
    const rect = this._element!.getBoundingClientRect();
    const next = event.targetTouches?.[0] ?? event;
    const prev = this._event?.targetTouches?.[0] ?? this._event;
    // 移动量
    const movementX = next.screenX - prev!.screenX;
    const movementY = next.screenY - prev!.screenY;
    const halfWidth = this._screen.width - rect.width;
    const halfHeight = this._screen.height - rect.height;
    this._event = event;
    const { classList, style } = this._element!;
    // 限制范围
    /** @type {number} */
    const left: number = FHelp.clamp(0, halfWidth, rect.left + movementX);
    /** @type {number} */
    const bottom: number = FHelp.clamp(0, halfHeight, halfHeight - rect.top - movementY);
    // 设置 live2d 控制器的左右的位置
    const isLeft = left <= halfWidth * 0.5;
    if (isLeft !== this._isLeft) {
      (this._isLeft = isLeft) ? classList.remove('live2d-right') : classList.add('live2d-right');
    }
    style.left = `${ left }px`;
    style.bottom = `${ bottom }px`;
  }

  /**
   * 当鼠标离开或者触摸结束时清除事件
   * @summary 拖拽结束
   * @protected
   */
  protected _end(): void {
    const e = this._element!;
    // 鼠标
    e.removeEventListener('mousemove', this._runFun);
    e.removeEventListener('mouseup', this._endFun);
    e.removeEventListener('mouseout', this._endFun);
    // 触摸
    e.removeEventListener('touchmove', this._runFun);
    e.removeEventListener('touchend', this._endFun);
    e.removeEventListener('touchcancel', this._endFun);
    // 移除 class
    e.classList.remove('live2d-drag');
  }

  /**
   * 当鼠标按下或者触摸开始时开始拖拽 element 元素
   * @summary 拖拽开始
   * @param {MouseEvent|TouchEvent} event 拖拽时的初始事件
   * @protected
   */
  protected _start(event: MouseEvent & TouchEvent): void {
    this._event = event;
    this._screen = this.getWidthHeight();
    const e = this._element!;
    e.classList.add('live2d-drag');
    // 鼠标
    e.addEventListener('mousemove', this._runFun, { passive: true });
    e.addEventListener('mouseup', this._endFun, { passive: true });
    e.addEventListener('mouseout', this._endFun, { passive: true });
    // 触摸
    e.addEventListener('touchmove', this._runFun, { passive: true });
    e.addEventListener('touchend', this._endFun, { passive: true });
    e.addEventListener('touchcancel', this._endFun, { passive: true });
  }
}
