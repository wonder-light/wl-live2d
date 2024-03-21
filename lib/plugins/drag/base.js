import { FHelp } from '../../utils/index.js';
import { FBasePlugin } from '../base.js';

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
  _name = 'drag';

  /**
   * 需要进行拖拽的元素 - stage.wrapper
   * @summary 拖拽的元素
   * @type {HTMLElement}
   * @protected
   */
  _element;

  /**
   * 拖拽时的上一个事件数据
   * @summary 拖拽事件数据
   * @type {MouseEvent|TouchEvent}
   * @protected
   */
  _event;

  /**
   * 当前窗口显示区域的宽高
   * @summary 窗口宽高
   * @type {TRect}
   * @protected
   */
  _screen = { width: 0, height: 0 };

  /**
   * true: wrapper 在左边, false: wrapper 在右边
   * @summary wrapper 的左右位置
   * @type {boolean}
   * @default true
   * @protected
   */
  _isLeft = true;

  /**
   * 以键值对进行记录的对象引用
   * @summary 对象引用
   * @type {Record<string, Function>}
   * @default {}
   * @protected
   */
  _ref = {};

  /**
   * 在安装插件时需要调用的函数, 一般用于初始化以及事件绑定等等
   * @summary 安装插件
   * @param {ULive2dController} live2d live2d 上下文
   * @return {void}
   */
  install(live2d) {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    this._element = this.getDragElement();
    this._ref = { start: null, run: null, end: null };
    this._ref.start = this._start.bind(this);
    this._ref.run = this._run.bind(this);
    this._ref.end = this._end.bind(this);
    this._element.addEventListener('mousedown', this._ref.start, { passive: true });
    this._element.addEventListener('touchstart', this._ref.start, { passive: true });
  }

  /**
   * 在卸载插件时需要调用的函数, 一般用于销毁数据以及事件解绑等等
   * @summary 卸载插件
   * @param {ULive2dController} live2d live2d 上下文
   * @return {void}
   */
  uninstall(live2d) {
    if (!this._enable) {
      return;
    }
    this._element.removeEventListener('mousedown', this._ref.start);
    this._element.removeEventListener('touchstart', this._ref.start);
  }

  /**
   * 根据相关条件判断插件是否启用
   * @summary 是否启用插件
   * @return {boolean} true: 启用
   */
  isEnable() {
    return this._live2d.data.drag;
  }

  /**
   * 当鼠标按下或者触摸开始时开始拖拽 element 元素
   * @summary 拖拽开始
   * @param {MouseEvent|TouchEvent} event 拖拽时的初始事件
   * @protected
   */
  _start(event) {
    this._event = event;
    this._screen = this.getWidthHeight();
    const e = this._element;
    e.classList.add('live2d-drag');
    // 鼠标
    e.addEventListener('mousemove', this._ref.run, { passive: true });
    e.addEventListener('mouseup', this._ref.end, { passive: true });
    e.addEventListener('mouseout', this._ref.end, { passive: true });
    // 触摸
    e.addEventListener('touchmove', this._ref.run, { passive: true });
    e.addEventListener('touchend', this._ref.end, { passive: true });
    e.addEventListener('touchcancel', this._ref.end, { passive: true });
  }

  /**
   * 当鼠标移动或者触摸移动时持续更新拖拽位置
   * @summary 运行拖拽
   * @param {MouseEvent|TouchEvent} event 鼠标事件 | 触摸事件
   * @protected
   */
  _run(event) {
    const rect = this._element.getBoundingClientRect();
    const next = event.targetTouches?.[0] ?? event;
    const prev = this._event.targetTouches?.[0] ?? this._event;
    // 移动量
    const movementX = next.screenX - prev.screenX;
    const movementY = next.screenY - prev.screenY;
    const halfWidth = this._screen.width - rect.width;
    const halfHeight = this._screen.height - rect.height;
    this._event = event;
    const { classList, style } = this._element;
    // 限制范围
    /** @type {number} */
    const left = FHelp.clamp(0, halfWidth, rect.left + movementX);
    /** @type {number} */
    const bottom = FHelp.clamp(0, halfHeight, halfHeight - rect.top - movementY);
    // 设置 live2d 控制器的左右位置
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
  _end() {
    const e = this._element;
    // 鼠标
    e.removeEventListener('mousemove', this._ref.run);
    e.removeEventListener('mouseup', this._ref.end);
    e.removeEventListener('mouseout', this._ref.end);
    // 触摸
    e.removeEventListener('touchmove', this._ref.run);
    e.removeEventListener('touchend', this._ref.end);
    e.removeEventListener('touchcancel', this._ref.end);
    // 移除 class
    e.classList.remove('live2d-drag');
  }

  /**
   * 获取当前需要进行拖拽的元素
   * @summary 获取拖拽元素
   * @return {HTMLElement}
   */
  getDragElement() {
    return this._live2d.stage.wrapper;
  }

  /**
   * 获取当前窗口显示区域的宽高
   * @summary 获取窗口宽高
   * @return {TRect} 宽高
   */
  getWidthHeight() {
    return {
      width: Math.min(window.screen.width, window.visualViewport.width, window.innerWidth),
      height: Math.min(window.screen.height, window.visualViewport.height, window.innerHeight)
    };
  }
}
