import { EventEmitter } from 'eventemitter3';
import { Application } from 'pixi.js';
import { mergeAll } from 'ramda';
import defaultOptions from '../config/options.json';
import { DBaseLive2dOptions } from '../models/index.js';
import { FCapturePlugin, FDragPlugin, FInfoPlugin, FQuitPlugin, FSwitchModulePlugin, FSwitchTexturePlugin } from '../plugins/index.js';
import { EEvent, FLogger } from '../utils/index.js';
import { UBaseModelController } from './model.js';
import { UBaseStageController } from './stage.js';
import { UBaseTipsController } from './tips.js';

/**
 * @class
 * @classdesc 基础live2d选项数据控制器
 * @memberof module:controller
 * @alias UOptionsController
 * @see [DBaseLive2dOptions]{@link DBaseLive2dOptions}
 */
export class UOptionsController {
  /**
   * pixi app 实例
   * @protected
   * @type {Application}
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
   * @type {Record<string, any>} 引用
   * @private
   */
  _ref;

  /**
   * 创建基础控制器
   * @param {DBaseLive2dOptions} options Live2d数据
   * @fires EEvent#init
   * @listens EEvent#modelLoad
   * @listens EEvent#modelError
   * @throws {Error} live2d options is null
   */
  constructor(options) {
    if (!options) {
      throw Error('live2d options is null');
    }
    this._data = options;
    this._event = new EventEmitter();
    this._ref = {};
    // 控制器
    this._stage = new UBaseStageController(this, options.selector);
    this._model = new UBaseModelController(this, options.models);
    this._tips = new UBaseTipsController(this, options.tips);
    this._plugins = options.plugins?.filter(p => p && p.install) ?? [];
    // 创建 app 实例
    this._app = new Application({
      view: this._stage.canvas,
      backgroundAlpha: 0,
      backgroundColor: 0xffffff,
      resolution: 2,
      autoStart: true,
      autoDensity: true,
      resizeTo: this._stage.wrapper
    });
    // 安装插件
    this.installPlugin(new FSwitchTexturePlugin, new FSwitchModulePlugin, new FCapturePlugin, new FInfoPlugin, new FQuitPlugin, new FDragPlugin);
    // init 事件通知
    this._event.emit(EEvent.init);
    // 加载成功
    this._event.once(EEvent.modelLoad, () => {
      // say hello
      options.sayHello && FLogger.info('🎉🎉🎉 ✨ wl-live2d v1.0.0 - 欢迎你使用 !! ✨ 🎉🎉🎉');
    });
    // 加载失败
    this._event.once(EEvent.modelError, () => {
      this._stage.hiddenWrapper();
    });
  }

  /**
   * 返回 app 实例
   * @return {Application}
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
   * @param {?DBaseLive2dOptions} options live2d选项
   * @return {UOptionsController} 返回 ULive2d 的一个实例
   * @static
   */
  static create(options) {
    return new UOptionsController(mergeAll([
      new DBaseLive2dOptions(defaultOptions),
      options
    ]));
  }

  /**
   * 安装插件
   * @param {FBasePlugin} plugins
   */
  installPlugin(...plugins) {
    for (const plugin of plugins) {
      plugin && this._plugins.push(plugin);
      plugin.install?.(this);
    }
  }
}
