import {DBaseModel} from "../models/model.js";
import {InternalModel, Live2DModel, SoundManager} from "pixi-live2d-display";
import {FLogger} from "../utils/index.js";

/**
 * 模型加载成功后的回调
 * @callback UBaseModelController~TLoad
 * @param {DBaseWH} options 模型字段
 * @return {void}
 */

/**
 * @callback UBaseModelController~TError
 * @param {Error} e 错误消息
 * @return {void}
 */

/**
 * @class
 * @classdesc DBaseModel的操作类
 * @requires module:modules.DBaseModel
 * @see [DBaseModel]{@link DBaseModel}
 * @memberof module:controller
 * @alias UBaseModelController
 */
export class UBaseModelController {
  /**
   * 基础模型数据
   * @private
   * @type {DBaseModel}
   */
  #data;

  /**
   * live2d数据选项
   * @private
   * @type {DLive2dOptions}
   */
  #options

  /**
   * 加载完成后的模型实例
   * @private
   * @type {Live2DModel<InternalModel> | any}
   */
  #model;

  /**
   * 创建基础模型控制器
   * @constructor
   *
   * @param {?DBaseModel} data 基础模型数据
   */
  constructor(data = new DBaseModel()) {
    this.#data = data;
  }

  /**
   * 获取当前模型索引
   * @return {number}
   */
  get modelIndex() {
    let current = parseInt(localStorage.getItem('wlLive2d-model-index'));
    return isNaN(current) ? (this.modelIndex = 0) : current;
  }

  /**
   * 设置模型索引
   * @param {number} index 模型索引
   */
  set modelIndex(index) {
    localStorage.setItem('wlLive2d-model-index', `${index}`);
  }

  /**
   * 获取当前正在展示的模型
   * @return {Live2DModel<InternalModel> | any}
   */
  get currentModel() {
    return this.#model;
  }

  /**
   * 获取当前控制拥有的模型数据
   * @return {DBaseModel}
   */
  get modelData() {
    return this.#data;
  }

  /**
   * 模型控制器初始化
   * @param {DLive2dOptions} options Live2d基本数据
   * @return {UBaseModelController} 返回自身引用
   */
  init(options) {
    this.#options = options;
    this.loadModel();
    return this;
  }

  /**
   * 加载模型
   * @async
   * @return {void}
   */
  loadModel() {
    const current = this.#options.models[this.modelIndex];
    const url = current?.path ?? '';
    const model = this.#model = Live2DModel.fromSync(url, {
      onError: (e) => {
        this.#model.emit('loadError', e)
      }
    });
    // 设置模型数据
    if (current) {
      model.x = current?.position?.x ?? 0;
      model.y = current?.position?.y ?? 0;
      model.scale.x = 0.15 * (current?.scale ?? 1);
      model.scale.y = 0.15 * (current?.scale ?? 1);
    }
    this.#model.once('load', () => {
      // 设置模型的宽度和高度
      current?.width && (model.width = current.width);
      current?.height && (model.height = current.height);
      this.#options.app.stage.addChild(model);
    });
  }

  /**
   * 模型加载完成后的回调事件
   * @param {UBaseModelController~TLoad} callback 加载完成后的回调
   * @return {UBaseModelController} 返回自身引用
   */
  onLoad(callback) {
    let model = this.#model;
    model.once('load', () => {
      callback?.({width: model.width, height: model.height});
    });
    return this;
  }

  /**
   * 模型加载失败后的回调事件
   * @param {UBaseModelController~TError} callback 加载失败后的回调事件
   * @return {UBaseModelController} 返回自身引用
   */
  onError(callback) {
    let model = this.#model;
    model.once('loadError', (e) => {
      FLogger.error(`live2d 模型加载失败 : ${e.message} | 请检查模型 path 是否正确`);
      callback?.(e);
    });
    return this;
  }
}
