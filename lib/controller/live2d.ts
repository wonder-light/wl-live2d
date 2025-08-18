import { EventEmitter } from 'eventemitter3';
import { Application } from 'pixi.js';
import defaultOptions from '../config/options.json';
import { DLive2dOptions } from '../models';
import { FBasePlugin, plugins as pluginSet } from '../plugins';
import type { TAnyFunc, TApplication, TFunc, TInstanceType, TLive2DModel } from '../types';
import { EEvent, FHelp } from '../utils';
import { UModelController } from './model';
import { UStageController } from './stage';
import { UTipsController } from './tips';

/**
 * @class
 * @summary live2d 属性
 * @classdesc 分离出来的 ULive2dController 的属性
 * @memberof module:controller
 * @alias ULive2dProperty
 */
abstract class ULive2dProperty {
  /**
   * PIXI.Application 实例
   * @summary app 实例
   * @protected
   * @type {TApplication}
   */
  protected _app: TApplication;

  /**
   * getter:  Application 实例
   * @summary app 实例
   * @type {TApplication}
   * @readonly
   */
  public get app(): TApplication {
    return this._app;
  }

  /**
   * Live2d 数据集合, 用于存储 live2d 对应的数据
   * @protected
   * @summary Live2d数据
   * @type {DLive2dOptions}
   */
  protected _data: DLive2dOptions;

  /**
   * getter:  live2d 原始数据
   * @summary live2d 数据
   * @type {DLive2dOptions}
   * @readonly
   */
  public get data(): DLive2dOptions {
    return this._data;
  }

  /**
   * EventEmitter3 实例, 更多请查看 [EventEmitter3]{@link https://www.jsdocs.io/package/eventemitter3}
   * @protected
   * @summary event 实例
   * @type {EventEmitter}
   */
  protected _event: EventEmitter;

  /**
   * getter:  EventEmitter3 实例
   * @summary event 实例
   * @type {EventEmitter}
   * @readonly
   */
  public get event(): EventEmitter {
    return this._event;
  }

  /**
   * 负责存储所有插件实例的数组
   * @protected
   * @summary 插件集
   * @type {FBasePlugin[]}
   */
  protected _plugins: FBasePlugin[];

  /**
   * getter: 获取所有插件实例数组
   * @summary 插件集
   * @type {FBasePlugin[]}
   * @readonly
   */
  public get plugins(): FBasePlugin[] {
    return this._plugins;
  }

  /**
   * 用于控制 stage 相关的的控制器
   * @summary stage 控制器
   * @protected
   * @type {UStageController}
   */
  protected _stage: UStageController;

  /**
   * getter: 获取 stage 控制器实例
   * @summary stage 控制器
   * @type {UStageController}
   * @readonly
   */
  public get stage(): UStageController {
    return this._stage;
  }

  /**
   * 用于控制模型相关的的控制器
   * @summary model 控制器
   * @protected
   * @type {UModelController}
   */
  protected _model: UModelController;

  /**
   * getter: 获取 model 控制器实例
   * @summary model 控制器
   * @type {UModelController}
   * @readonly
   */
  public get model(): UModelController {
    return this._model;
  }

  /**
   * 用于控制 tips 相关的的控制器
   * @summary tips 控制器
   * @protected
   * @type {UTipsController}
   */
  protected _tips: UTipsController;

  /**
   * getter: 获取 tips 控制器实例
   * @summary tips 控制器
   * @type {UTipsController}
   * @readonly
   */
  public get tips(): UTipsController {
    return this._tips;
  }

  /**
   * 以键值对进行记录的对象引用
   * @summary 对象引用
   * @protected
   * @type {Record<any, any>}
   */
  protected _ref: Record<any, any>;

  /**
   * getter: 以键值对进行记录的对象引用
   * @summary 对象引用
   * @type {Record<string, any>}
   * @readonly
   */
  public get ref(): Record<any, any> {
    return this._ref;
  }
}

/**
 * @class
 * @summary live2d 事件方法
 * @classdesc 分离出来的 ULive2dController 的事件方法
 * @extends ULive2dProperty
 * @memberof module:controller
 * @alias ULive2dEvent
 */
abstract class ULive2dEvent extends ULive2dProperty {
  /**
   * 模型开始加载前的事件
   * @param {TFunc} func 加载前的回调
   * @param context this 指向
   * @param {boolean} once 是否只用一次
   * @listens EEvent#modelStart 模型开始加载事件
   */
  public onModelStart(func: TFunc, context?: any, once: boolean = false): void {
    this._onAddEvent(EEvent.modelStart, func, context, once);
  }

  /**
   * 模型加载完成时的事件
   * @param {TFunc<TLive2DModel>} func 加载结束的回调
   * @param context this 指向
   * @param {boolean} once 是否只用一次
   * @listens EEvent#modelLoaded 模型加载成功事件
   */
  public onModelLoaded(func: TFunc<TLive2DModel>, context?: any, once: boolean = false): void {
    this._onAddEvent(EEvent.modelLoaded, func, context, once);
  }

  /**
   * 模型加载失败时的事件
   * @param {TFunc<Error>} func 加载失败的回调
   * @param context this 指向
   * @param {boolean} once 是否只用一次
   * @listens EEvent#modelError 模型加载失败事件
   */
  public onModelError(func: TFunc<Error>, context?: any, once: boolean = false): void {
    this._onAddEvent(EEvent.modelError, func, context, once);
  }

  /**
   * 淡入淡出开始时的事件
   * @param {TFunc} func 淡入淡出开始的回调
   * @param context this 指向
   * @param {boolean} once 是否只用一次
   * @listens EEvent#fadeStart 淡入淡出开始事件
   */
  public onFadeStart(func: TFunc, context?: any, once: boolean = false): void {
    this._onAddEvent(EEvent.fadeStart, func, context, once);
  }

  /**
   * 淡入淡出结束时的事件
   * @param {TFunc} func 淡入淡出结束的回调
   * @param context this 指向
   * @param {boolean} once 是否只用一次
   * @listens EEvent#fadeEnd 淡入淡出结束事件
   */
  public onFadeEnd(func: TFunc, context?: any, once: boolean = false): void {
    this._onAddEvent(EEvent.fadeEnd, func, context, once);
  }

  /**
   * 淡入淡出取消时的事件
   * @param {TFunc} func 淡入淡出取消的回调
   * @param context this 指向
   * @param {boolean} once 是否只用一次
   * @listens EEvent#fadeCancel 淡入淡出取消事件
   */
  public onFadeCancel(func: TFunc, context?: any, once: boolean = false): void {
    this._onAddEvent(EEvent.fadeCancel, func, context, once);
  }

  /**
   * 模型 motion 开始时的事件
   * @param {TAnyFunc} func motion 开始的回调
   * @param context this 指向
   * @param {boolean} once 是否只用一次
   * @listens EEvent#motionStart 模型 motion 开始事件
   */
  public onMotionStart(func: TAnyFunc, context?: any, once: boolean = false): void {
    this._onAddEvent(EEvent.motionStart, func, context, once);
  }

  /**
   * 模型 motion 完成时的事件
   * @param {TFunc} func motion 完成的回调
   * @param context this 指向
   * @param {boolean} once 是否只用一次
   * @listens EEvent#motionFinish 模型 motion 完成事件
   */
  public onMotionFinish(func: TFunc, context?: any, once: boolean = false): void {
    this._onAddEvent(EEvent.motionFinish, func, context, once);
  }

  /**
   * 绑定事件
   * @param {symbol} event 事件
   * @param {TAnyFunc} func 回调
   * @param context this
   * @param {boolean} once 一次
   * @private
   */
  private _onAddEvent(event: symbol, func: TAnyFunc, context?: any, once: boolean = false): void {
    if (once) {
      this.event.once(event, func, context);
    } else {
      this.event.on(event, func, context);
    }
  }
}

/**
 * @class
 * @summary live2d 控制器
 * @classdesc 用于整合 stage, model 等其他控制器, 并否则插件的安装与卸载等等
 * @memberof module:controller
 * @alias ULive2dController
 */
export class ULive2dController extends ULive2dEvent {
  /**
   * 创建 live2d 控制器
   * @summary live2d 控制器构造
   * @param {DLive2dOptions| null} options Live2d 数据
   * @throws {Error} PIXI.Application is null
   */
  protected constructor(options: DLive2dOptions | null) {
    super();
    this._data = options = new DLive2dOptions(options);
    this._event = new EventEmitter();
    this._ref = {};
    // 控制器
    this._stage = new UStageController(this, options.selector);
    this._model = new UModelController(this, options.models);
    this._tips = new UTipsController(this, options.tips);
    this._plugins = options.plugins?.filter(p => FHelp.is(FBasePlugin, p)) ?? [];
    // 创建 app 实例
    /** @type {TApplication} */
    this._app = new Application({
      view: this._stage.canvas,
      backgroundAlpha: 0,
      backgroundColor: 0x000000,
      resolution: 2,
      autoStart: true,
      autoDensity: true,
      resizeTo: this._stage.wrapper
    }) as unknown as TApplication;
    this.init();
  }

  /**
   * 传递 options 数据, 并创建一个 live2d 实例
   * @summary 创建 live2d 实例
   * @param {DLive2dOptions | null} [options=null] live2d 选项
   * @return {ULive2dController}  live2d 实例
   * @static
   */
  public static create(options: DLive2dOptions | null = null): ULive2dController {
    return new ULive2dController(FHelp.mergeAll(defaultOptions, options));
  }

  /**
   * 如果 plugin 不是 FBasePlugin 的子类则不会进行安, 否则根据插件的优先级进行安装
   * @summary 安装插件
   * @param {...TInstanceType<FBasePlugin>[]} plugins FBasePlugin插件的子类实例集
   */
  public installPlugin(...plugins: TInstanceType<FBasePlugin>[]) {
    // 插件名称集合
    const names = this.plugins.reduce((names: Record<string, string>, current) => {
      names[current.name] = current.name;
      return names;
    }, {});
    // 筛选出有效插件，并且按照优先级从高到低排列及执行, 如果插件的名称已经存在则跳过, 该插件将由用户自己实现
    plugins = plugins.filter(p => FHelp.is(FBasePlugin, p) && !names[p.name])
                     .sort(compareFn);
    this.plugins.push(...plugins);
    // 按照优先级从高到低排列及执行
    this.plugins.sort(compareFn);
    for (const plugin of plugins) {
      FBasePlugin.setContext(plugin, this);
      plugin.install();
    }

    function compareFn(prev: FBasePlugin, next: FBasePlugin) {
      return next.priority - prev.priority;
    }
  }

  /**
   * 从插件集中卸载指定的插件
   * @summary 卸载插件
   * @template T FBasePlugin 的子类
   * @param {...TInstanceType<FBasePlugin>[]} plugins 插件实例集
   */
  public uninstallPlugin(...plugins: TInstanceType<FBasePlugin>[]) {
    for (const plugin of plugins) {
      const index = this.plugins.indexOf(plugin);
      if (index < 0) continue;
      plugin.uninstall();
      FBasePlugin.setContext(plugin, null);
      this.plugins.splice(index, 1);
    }
  }

  /**
   * 开始安装插件并进行 live2d 控制器初始化
   * @summary 初始化控制器
   * @fires EEvent#init 控制器初始化事件
   */
  public init(): void {
    // 安装插件
    let plugins = this.plugins.splice(0, this.plugins.length);
    plugins.push(...Object.values(pluginSet).map(T => new T()));
    this.installPlugin(...plugins);
    // say hello
    this._data.sayHello && FHelp.sayHello();
    // init 事件通知
    this._event.emit(EEvent.init);
  }

  /**
   * 卸载插件, 销毁控制器, 销毁 app 实例
   * @summary 销毁控制器
   * @fires EEvent#destroy 控制器销毁事件
   */
  public destroy(): void {
    const plugins = this.plugins;
    this.uninstallPlugin(...plugins);
    plugins.splice(0, plugins.length);
    this.app.renderer.destroy(true);
    this.event.emit(EEvent.destroy);
  }
}
