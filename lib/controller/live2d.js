import { EventEmitter } from 'eventemitter3';
import defaultOptions from '../config/options.json';
import { DLive2dOptions } from '../models/index.js';
import { FBasePlugin, plugins } from '../plugins/index.js';
import { EEvent, FHelp } from '../utils/index.js';
import { UModelController } from './model.js';
import { UStageController } from './stage.js';
import { UTipsController } from './tips.js';

/**
 * @class
 * @summary live2d 控制器
 * @classdesc 用于整合 stage, model 等其他控制器, 并否则插件的安装与卸载等等
 * @memberof module:controller
 * @alias ULive2dController
 */
export class ULive2dController {
  /**
   * PIXI.Application 实例
   * @summary app 实例
   * @protected
   * @type {TApplication}
   */
  _app;

  /**
   * Live2d 数据集合, 用于存储 live2d 对应的数据
   * @protected
   * @summary Live2d数据
   * @type {DLive2dOptions}
   */
  _data;

  /**
   * EventEmitter3 实例, 更多请查看 [EventEmitter3]{@link https://www.jsdocs.io/package/eventemitter3}
   * @protected
   * @summary event 实例
   * @type {EventEmitter}
   */
  _event;

  /**
   * 负责存储所有插件实例的数组
   * @protected
   * @summary 插件集
   * @type {FBasePlugin[]}
   */
  _plugins;

  /**
   * 用于控制 stage 相关的的控制器
   * @summary stage 控制器
   * @protected
   * @type {UStageController}
   */
  _stage;

  /**
   * 用于控制模型相关的的控制器
   * @summary model 控制器
   * @protected
   * @type {UModelController}
   */
  _model;

  /**
   * 用于控制 tips 相关的的控制器
   * @summary tips 控制器
   * @protected
   * @type {UTipsController}
   */
  _tips;

  /**
   * 以键值对进行记录的对象引用
   * @summary 对象引用
   * @protected
   * @type {Record<string, any>}
   */
  _ref;

  /**
   * 创建 live2d 控制器
   * @summary live2d 控制器构造
   * @param {DLive2dOptions} options Live2d 数据
   * @throws {Error} PIXI.Application is null
   */
  constructor(options) {
    this._data = options = new DLive2dOptions(FHelp.mergeAll(defaultOptions, options));
    this._event = new EventEmitter();
    this._ref = {};
    // 控制器
    this._stage = new UStageController(this, options.selector);
    this._model = new UModelController(this, options.models);
    this._tips = new UTipsController(this, options.tips);
    this._plugins = options.plugins.filter(p => p && p.install);
    // 创建 app 实例
    if (FHelp.isNotValid(PIXI?.Application)) {
      throw Error('PIXI is not import');
    }
    this._app = /** @type {TApplication} */new PIXI.Application({
      view: this._stage.canvas,
      backgroundAlpha: 0,
      backgroundColor: 0x000000,
      resolution: 2,
      autoStart: true,
      autoDensity: true,
      resizeTo: this._stage.wrapper
    });
    this.init();
  }

  /**
   * getter:  Application 实例
   * @summary app 实例
   * @type {TApplication}
   * @readonly
   */
  get app() {
    return this._app;
  }

  /**
   * getter:  live2d 原始数据
   * @summary live2d 数据
   * @type {DLive2dOptions}
   * @readonly
   */
  get data() {
    return this._data;
  }

  /**
   * getter:  EventEmitter3 实例
   * @summary event 实例
   * @type {EventEmitter}
   * @readonly
   */
  get event() {
    return this._event;
  }

  /**
   * getter: 获取 stage 控制器实例
   * @summary stage 控制器
   * @type {UStageController}
   * @readonly
   */
  get stage() {
    return this._stage;
  }

  /**
   * getter: 获取 model 控制器实例
   * @summary model 控制器
   * @type {UModelController}
   * @readonly
   */
  get model() {
    return this._model;
  }

  /**
   * getter: 获取 tips 控制器实例
   * @summary tips 控制器
   * @type {UTipsController}
   * @readonly
   */
  get tips() {
    return this._tips;
  }

  /**
   * getter: 获取所有插件实例数组
   * @summary 插件集
   * @type {FBasePlugin[]}
   * @readonly
   */
  get plugins() {
    return this._plugins;
  }

  /**
   * getter: 以键值对进行记录的对象引用
   * @summary 对象引用
   * @type {Record<string, any>}
   * @readonly
   */
  get ref() {
    return this._ref;
  }

  /**
   * 传递 options 数据, 并创建一个 live2d 实例
   * @summary 创建 live2d 实例
   * @param {DLive2dOptions | null} [options=null] live2d 选项
   * @return {ULive2dController}  live2d 实例
   * @static
   */
  static create(options = null) {
    return new ULive2dController(options);
  }

  /**
   * 如果 plugin 不是 FBasePlugin 的子类则不会进行安, 否则根据插件的优先级进行安装
   * @summary 安装插件
   * @template T FBasePlugin 的子类
   * @param {...Extract<T, FBasePlugin>} plugins 插件实例集
   */
  installPlugin(...plugins) {
    // 插件名称集合
    const names = this.plugins.reduce((names, current) => {
      names[current.name] = current.name;
      return names;
    }, {});
    // 筛选出有效插件，并且按照优先级从高到低排列及执行
    plugins = plugins.filter(plugin => FHelp.is(FBasePlugin, plugin) && !names[plugin.name])
                     .sort((prev, next) => next.priority - prev.priority);
    this.plugins.push(...plugins);
    this.plugins.sort((prev, next) => next.priority - prev.priority);
    for (const plugin of plugins) {
      plugin.install(this);
    }
  }

  /**
   * 从插件集中卸载指定的插件
   * @summary 卸载插件
   * @template T FBasePlugin 的子类
   * @param {...Extract<T, FBasePlugin>} plugins 插件实例集
   */
  uninstallPlugin(...plugins) {
    for (const plugin of plugins) {
      const index = this.plugins.indexOf(plugin);
      if (index >= 0) {
        plugin.uninstall(this);
        this.plugins.splice(index, 1);
      }
    }
  }

  /**
   * 开始安装插件并进行 live2d 控制器初始化
   * @summary 初始化控制器
   * @fires EEvent#init 控制器初始化事件
   */
  init() {
    // 安装插件
    this.installPlugin(...Object.values(plugins).map(T => new T));
    // this.installPlugin(new FSwitchTexturePlugin, new FSwitchModulePlugin, new FCapturePlugin, new FInfoPlugin, new FQuitPlugin, new FDragPlugin);
    // say hello
    this._data.sayHello && FHelp.sayHello();
    // init 事件通知
    this._event.emit(EEvent.init);
  }

  /**
   * 卸载插件, 销毁控制器, 销毁 app 实例
   * @summary 销毁控制器
   * @fires EEvent#destroy 控制器销毁事件
   * @param {boolean} [removeView=false] 从 DOM 中移除 Canvas 元素
   */
  destroy(removeView = false) {
    const plugins = this.plugins;
    this.uninstallPlugin(...plugins);
    plugins.splice(0, plugins.length);
    this.event.emit(EEvent.destroy);
    this.app.renderer.destroy(removeView);
  }
}
