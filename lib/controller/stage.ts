import { DStage } from '../models';
import type { TFunc, TLive2DModel, TStageMenuItem } from '../types';
import { EEvent, FHelp } from '../utils';
import { UBaseController } from './base';
import type { ULive2dController } from './live2d';

/**
 * @summary 淡入模式
 * @enum
 */
enum TFadeMode {
  /** 淡入 */
  fadeIn = 'fadeIn',
  /** 淡出 */
  fadeOut = 'fadeOut',
}

/**
 * @class
 * @summary stage 控制器类
 * @classdesc 用于控制 stage 相关的的控制器, 例如控制元素淡入淡出等等
 * @extends UBaseController
 * @memberof module:controller
 * @alias UStageController
 */
export class UStageController extends UBaseController {
  /**
   * live2d 舞台数据集合, 用于存储 canvas, tips 等文档元素
   * @summary stage 数据
   * @protected
   * @type {DStage}
   */
  protected _data: DStage | null;

  /**
   * 记录 [_showAndHiddenMenus]{@link _showAndHiddenMenus} 绑定后的函数
   * @type {?TFunc<any>}
   * @private
   */
  private _menuFunc: TFunc<any> | null = null;

  /**
   * 创建 live2d stage 控制器
   * @summary stage 控制器构造
   * @constructor
   * @param {ULive2dController} live2d live2d 上下文
   * @param {string | null} [selector=null] 父元素选择器
   * @param {DStage | null} [data=null] 舞台元素数据
   * @listens EEvent#modelLoaded 模型加载完成的事件
   */
  public constructor(live2d: ULive2dController, selector: string | null = null, data: DStage | null = null) {
    super(live2d);
    data = FHelp.mergeAll(data ?? {}, { parent: this.getParentFromSelector(selector) });
    this._data = new DStage(data);
    this._menuItems = [];
    // 监听事件
    this.event.on(EEvent.modelLoaded, this._onModelLoad, this);
    this.event.off(EEvent.init, this.init, this);
    this.init();
  }

  /**
   * 在菜单元素中显示的菜单集
   * @protected
   * @summary 菜单集
   * @type {TStageMenuItem[]}
   * @default []
   */
  protected _menuItems: TStageMenuItem[];

  /**
   * getter: 菜单元素数组
   * @summary 菜单数组
   * @type {TStageMenuItem[]}
   * @readonly
   */
  public get menuItems(): TStageMenuItem[] {
    return this._menuItems;
  }

  /**
   * getter: 包装器元素
   * @summary 包装器元素
   * @return {HTMLElement}
   * @readonly
   */
  public get wrapper(): HTMLElement {
    return this._data!.wrapper;
  }

  /**
   * getter: 画布元素
   * @summary 画布元素
   * @type {HTMLCanvasElement}
   * @readonly
   */
  public get canvas(): HTMLCanvasElement {
    return this._data!.canvas;
  }

  /**
   * getter: 消息提示元素
   * @summary 提示元素
   * @type {HTMLElement}
   * @readonly
   */
  public get tips(): HTMLDivElement {
    return this._data!.tips;
  }

  /**
   * getter: 菜单元素
   * @summary 菜单元素
   * @type {HTMLElement}
   * @readonly
   */
  public get menus(): HTMLElement {
    return this._data!.menus;
  }

  /**
   * getter: 其它元素
   * @summary 其它元素
   * @type {HTMLElement}
   * @readonly
   */
  public get other(): HTMLElement {
    return this._data!.other;
  }

  /**
   * getter:  wrapper 的父元素
   * @summary 父元素
   * @type {HTMLElement}
   * @readonly
   */
  public get parent(): HTMLElement {
    return this._data!.parent;
  }

  /**
   * 初始化 stage 控制器, 并为元素设置层级结构以及类名与样式
   * @summary 初始化 stage 控制器
   * @override
   */
  public override init(): void {
    // 设置元素层级
    // 元素层级
    // |parent
    // |--|wrapper
    // |--|--|canvas
    // |--|--|tips
    // |--|--|menus
    // |--|--|other
    this.wrapper.appendChild(this.canvas);
    this.wrapper.appendChild(this.menus);
    this.wrapper.appendChild(this.tips);
    this.wrapper.appendChild(this.other);
    this.parent.appendChild(this.wrapper);
    const { fixed, transitionTime, dockedRight } = this.options;

    // 添加类
    let classes = [fixed ? 'live2d-fixed' : 'live2d-relative', dockedRight ? 'right' : ''];
    this.wrapper.classList.add(...classes, 'live2d-wrapper', 'live2d-transition-all', 'live2d-opacity-0');
    // 画布
    this.canvas.classList.add('live2d-canvas', 'live2d-transition-all', 'live2d-opacity-1');
    // 消息提示
    this.tips.classList.add('live2d-tips', 'live2d-shake', 'live2d-transition-all', 'live2d-opacity-0');
    // 菜单
    this.menus.classList.add('live2d-menus', 'live2d-transition-all', 'live2d-opacity-0');
    // 其它
    this.other.classList.add('live2d-other', 'live2d-transition-all', 'live2d-opacity-1');
    // 模型的过度时间
    this.canvas.style.setProperty('--live2d-duration', `${ transitionTime }ms`);
    // 绑定事件
    this._menuFunc = this._showAndHiddenMenus.bind(this);
    this.wrapper.addEventListener('mouseover', this._menuFunc);
    this.wrapper.addEventListener('mouseleave', this._menuFunc);
    document.addEventListener('touchstart', this._menuFunc);
  }

  /**
   * 销毁控制器, 移除菜单元素, 以及移除绑定的事件
   * @summary 销毁 stage 控制器
   * @override
   */
  public override destroy(): void {
    super.destroy();
    this.event.removeListener(EEvent.modelLoaded, this._onModelLoad, this);
    const items = this.menuItems.splice(0, this.menuItems.length);
    for (const item of items) item.element.remove();
    this.wrapper.removeEventListener('mouseover', this._menuFunc);
    this.wrapper.removeEventListener('mouseleave', this._menuFunc);
    document.removeEventListener('touchstart', this._menuFunc);
    this.wrapper.remove();
    this._menuFunc = null;
    this._data = null;
  }

  /**
   * 对指定元素应用者淡入动画
   * @summary 元素淡入
   * @param {HTMLElement | null} [element=null] 需要执行淡入的元素, 默认是包装器元素
   * @return {Promise<void>}
   * @async
   */
  public async fadeIn(element: HTMLElement | null = null): Promise<void> {
    await this._fade(element, TFadeMode.fadeIn, TFadeMode.fadeOut).catch(FHelp.F);
  }

  /**
   * 对指定元素应用者淡出动画
   * @summary 元素淡出
   * @param {HTMLElement | null} [element=null] 需要执行淡出的元素, 默认是包装器元素
   * @return {Promise<void>}
   * @async
   */
  public async fadeOut(element: HTMLElement | null = null): Promise<void> {
    await this._fade(element, TFadeMode.fadeOut, TFadeMode.fadeIn).catch(FHelp.F);
  }

  /**
   * 将菜单元素及优先级作为一个对象添加到 menuItems
   * @summary 添加菜单元素
   * @param {HTMLElement} element 文档元素
   * @param {number} [priority=2] 优先级
   * @return {UStageController} 自身引用
   */
  public addMenu(element: HTMLElement, priority: number = 2): UStageController {
    if (FHelp.is(HTMLElement, element)) {
      this.menuItems.push({ element, priority });
      // 按优先级排序 - 从大到小
      this.menuItems.sort((a, b) => b.priority - a.priority);
      // 更新节点
      this.menus.innerHTML = '';
      this.menus.append(...this.menuItems.map(item => item.element));
    }
    return this;
  }

  /**
   * 在 menuItems 中移除指定的菜单元素
   * @summary 移除菜单元素
   * @param {HTMLElement} element 文档元素
   * @return {UStageController} 自身引用
   */
  public removeMenu(element: HTMLElement | null): UStageController {
    const index = this.menuItems.findIndex(item => element === item.element);
    if (index >= 0) {
      this.menuItems.splice(index, 1);
      // 移除节点
      element.remove();
    }
    return this;
  }

  /**
   * 从选择器中获取父元素
   *
   * `css` 选择器规则优先, 其次是 `xpath` 规则, 当两个都找不到时, 则使用 body 为父元素
   * @summary 获取父元素
   * @param {string | null} [selector=null] 选择器
   * @return {HTMLElement} 获取到的节点元素
   */
  public getParentFromSelector(selector: string | null = null): HTMLElement {
    if (selector == null) return document.body;
    try {
      let parent: HTMLElement | null;
      try {
        parent = document.querySelector(selector);
      } catch (_) {
        parent = document.evaluate(selector, document).iterateNext() as HTMLElement;
      }
      return parent ?? document.body;
    } catch (_) {
      return document.body;
    }
  }

  /**
   * 获取指定元素的 transition-duration 值, 单位为 ms
   * @summary 获取过度时间
   * @param {HTMLElement} element 元素
   * @return {number} 持续时间
   */
  public getTransitionDuration(element: HTMLElement): number {
    if (!element) return 0;
    let str = getComputedStyle(element).getPropertyValue('transition-duration');
    return FHelp.defaultTo(0, parseFloat(str)) * (/ms/.test(str) ? 1 : 1000);
  }

  /**
   * 判断 wrapper 元素是在窗口的左边还是右边
   * @summary 判断 wrapper 的左右位置
   * @return {boolean} true 和 false
   */
  public isRight(): boolean {
    const wrapper = this.wrapper;
    const allWidth = Math.min(window.screen.width, window.visualViewport!.width, window.innerWidth);
    const width = (allWidth - wrapper.clientWidth) / 2;
    const left = wrapper.offsetLeft;
    return left > width;
  }

  /**
   * 模型加载完成后触发的事件, 负责设置包装器的宽高, 以及调整模型大小
   * @protected
   * @summary 模型加载完成后的回调事件
   * @param {TLive2DModel} model 模型宽高
   * @return {void}
   */
  public _onModelLoad(model: TLive2DModel): void {
    // 重设画布宽和高
    // transition 会导致 wrapper 的宽高不固定, 从而影响到 canvas 宽高的设置
    this.wrapper.classList.remove('live2d-transition-all');
    this.canvas.classList.remove('live2d-transition-all');
    this.canvas.style.width = this.wrapper.style.width = `${ model?.width ?? 260 }px`;
    this.canvas.style.height = this.wrapper.style.height = `${ model?.height ?? 260 }px`;
    // 设置背景色
    this.wrapper.style.backgroundColor = this.live2d.model.backgroundColor;
    this.isRight() ? this.wrapper.classList.add('live2d-right') : this.wrapper.classList.remove('live2d-right');
    // 当包装器元素的宽度与高度被设置后，调整一次模型的大小
    this.app.resize();
    // 添加过渡类
    this.wrapper.classList.add('live2d-transition-all');
    this.canvas.classList.add('live2d-transition-all');
    // 舞台淡入
    this.fadeIn().finally(() => {});
  }

  /**
   * 当鼠标进入舞台时显示菜单, 离开时隐藏
   *
   * 当触摸到舞台时显示菜单, 否则隐藏菜单
   * @summary 显示和隐藏菜单
   * @param {MouseEvent | TouchEvent} event 鼠标事件 | 触摸事件
   * @protected
   */
  protected _showAndHiddenMenus(event: MouseEvent | TouchEvent): void {
    let touchIn = event.type === 'touchstart' && this.wrapper.contains((event as TouchEvent).touches[0].target as Node);
    if (event.type === 'mouseover' || touchIn) {
      this.fadeIn(this.menus).catch(FHelp.F);
    } else {
      this.fadeOut(this.menus).catch(FHelp.F);
    }
  }

  /**
   * 对指定元素应用淡入或者淡出动画
   * @summary 元素淡入淡出
   * @param {HTMLElement | null} element 需要执行动画的元素, 默认是包装器元素
   * @param {'fadeIn' | 'fadeOut'} proceed 需要进行的动画名称
   * @param {'fadeIn' | 'fadeOut'} exit 需要退出的动画名称
   * @return {Promise<void>}
   * @fires EEvent#fadeStart 淡入淡出开始时间
   * @fires EEvent#fadeEnd 淡入淡出结束事件
   * @fires EEvent#fadeCancel 淡入淡出取消事件
   * @protected
   * @async
   */
  protected async _fade(element: HTMLElement | null, proceed: TFadeMode, exit: TFadeMode): Promise<void> {
    const state: Record<string, any> = {};
    const el: HTMLElement & Record<string, any> = element ??= this.wrapper;
    // 取消之前的淡入淡出
    el[exit]?.();
    el[proceed]?.();
    // 重设结束时的回调
    el[proceed] = (end = false) => {
      for (const key in state) state[key]?.();
      el[proceed] = null;
      this.event.emit(end ? EEvent.fadeEnd : EEvent.fadeCancel);
    };
    this.event.emit(EEvent.fadeStart);
    let time = this.getTransitionDuration(element);
    // 添加过度类
    !element.classList.contains('live2d-transition-all') && element.classList.add('live2d-transition-all');
    // 执行分支
    if (proceed == TFadeMode.fadeIn) {
      element.classList.remove('live2d-hidden');
      // display: none 的移除需要一定的响应时间
      await setTime(20, 'wait');
      // 更新透明度
      element.classList.remove('live2d-opacity-0');
      element.classList.add('live2d-opacity-1');
      await setTime(time - 20, 'cancel');
    } else {
      element.classList.remove('live2d-opacity-1');
      element.classList.add('live2d-opacity-0');
      await setTime(time, 'cancel');
      element.classList.add('live2d-hidden');
    }
    // 清除回调, 通知 fadeEnd
    el[proceed]?.(true);

    /**
     * 设置定时事时间
     * @param {number} time
     * @param {string} key
     * @return {Promise<void>}
     * @async
     */
    async function setTime(time: number, key: string): Promise<void> {
      await new Promise<void>((resolve, reject) => {
        const handler = setTimeout(() => {
          state[key] = null;
          resolve();
        }, time);
        // 在外部执行, 通过调用 reject() 函数, 用于退出 _fade 函数, 会抛出错误
        state[key] = () => {
          clearTimeout(handler);
          reject();
        };
      });
    }
  }
}
