import { EventEmitter } from 'eventemitter3';
import defaultOptions from '../config/options.json';
import { DBaseLive2dOptions } from '../models/index.js';
import { FBasePlugin, plugins } from '../plugins/index.js';
import { EEvent, FHelp, FLogger } from '../utils/index.js';
import { UBaseModelController } from './model.js';
import { UBaseStageController } from './stage.js';
import { UBaseTipsController } from './tips.js';

/**
 * @class
 * @classdesc live2d数据控制器
 * @memberof module:controller
 * @alias ULive2dController
 */
export class ULive2dController {
  /**
   * pixi app 实例
   * @protected
   * @type {TApplication}
   */
  _app;

  /**
   * live2d数据选项
   * @protected
   * @type {DBaseLive2dOptions}
   */
  _data;

  /**
   * [EventEmitter3]{@link https://www.jsdocs.io/package/eventemitter3} 实例
   * @type {EventEmitter}
   */
  _event;

  /**
   * 插件数组
   * @type {FBasePlugin[]}
   */
  _plugins;

  /**
   * 舞台控制器
   * @protected
   * @type {UBaseStageController}
   */
  _stage;

  /**
   * 模型控制器
   * @protected
   * @type {UBaseModelController}
   */
  _model;

  /**
   * 消息提示控制器
   * @protected
   * @type {UBaseTipsController}
   */
  _tips;

  /**
   * 引用
   * @protected
   * @type {Record<string, any>}
   */
  _ref;

  /**
   * 创建基础控制器
   * @param {DBaseLive2dOptions} options Live2d数据
   * @throws {Error} live2d options is null
   */
  constructor(options) {
    FHelp.isNotValid(options) && (options = defaultOptions);
    this._data = options;
    this._event = new EventEmitter();
    this._ref = {};
    // 控制器
    this._stage = new UBaseStageController(this, options.selector);
    this._model = new UBaseModelController(this, options.models);
    this._tips = new UBaseTipsController(this, options.tips);
    this._plugins = options.plugins?.filter(p => p && p.install) ?? [];
    // 创建 app 实例
    if (FHelp.isNotValid(PIXI?.Application)) {
      throw Error('PIXI is not import');
    }
    this._app = new PIXI.Application({
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
   * 返回 app 实例
   * @return {TApplication}
   */
  get app() {
    return this._app;
  }

  /**
   * 返回 live2d 选项数据
   * @return {DBaseLive2dOptions}
   */
  get data() {
    return this._data;
  }

  /**
   * 返回 EventEmitter3 实例
   * @return {EventEmitter}
   */
  get event() {
    return this._event;
  }

  /**
   * 返回舞台控制器
   * @return {UBaseStageController}
   */
  get stage() {
    return this._stage;
  }

  /**
   * 返回模型控制器
   * @return {UBaseModelController}
   */
  get model() {
    return this._model;
  }

  /**
   * 返回消息提示控制器
   * @return {UBaseTipsController}
   */
  get tips() {
    return this._tips;
  }

  /**
   * 返回插件数组
   * @return {FBasePlugin[]}
   */
  get plugins() {
    return this._plugins;
  }

  /**
   * 获取引用
   * @return {Record<string, any>}
   */
  get ref() {
    return this._ref;
  }

  /**
   * 创建 ULive2d 的一个实例
   * @param {?DBaseLive2dOptions} [options=null] live2d选项
   * @return {ULive2dController} 返回 ULive2d 的一个实例
   * @static
   */
  static create(options = null) {
    return new ULive2dController(FHelp.mergeAll(
      new DBaseLive2dOptions(defaultOptions),
      options
    ));
  }

  /**
   * 安装插件
   * @template T FBasePlugin 的子类
   * @param {Extract<T, FBasePlugin>} plugins 插件列表
   */
  installPlugin(...plugins) {
    // 插件名称集合
    const names = this.plugins.reduce((names, current) => names[current.name] = current.name, {});
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
   * 卸载插件
   * @template T FBasePlugin 的子类
   * @param {Extract<T, FBasePlugin>} plugins 插件列表
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
   * live2d 控制器初始化
   * @fires EEvent#init
   */
  init() {
    // 安装插件
    this.installPlugin(...Object.values(plugins).map(T => new T));
    // this.installPlugin(new FSwitchTexturePlugin, new FSwitchModulePlugin, new FCapturePlugin, new FInfoPlugin, new FQuitPlugin, new FDragPlugin);
    // say hello
    this._data.sayHello && FLogger.info('🎉🎉🎉 ✨ wl-live2d v1.0.0 - 欢迎你的使用 !! ✨ 🎉🎉🎉');
    // init 事件通知
    this._event.emit(EEvent.init);
  }

  /**
   * 销毁控制器
   * @fires EEvent#destroy
   * @param {boolean} [removeView=false] 从DOM中移除Canvas元素
   */
  destroy(removeView = false) {
    const plugins = this.plugins;
    this.uninstallPlugin(...plugins);
    plugins.splice(0, plugins.length);
    this.event.emit(EEvent.destroy);
    this.app.renderer.destroy(removeView);
  }
}
