import { InternalModel, Live2DModel } from 'pixi-live2d-display';
import { DBaseModel } from '../models/index.js';
import { EEvent } from '../utils/index.js';
import { UBaseController } from './base.js';

/**
 * @class
 * @classdesc DBaseModel的控制器类
 * @extends UBaseController
 * @see [DBaseModel]{@link DBaseModel}
 * @memberof module:controller
 * @alias UBaseModelController
 */
export class UBaseModelController extends UBaseController {
  /**
   * 基础模型数据
   * @protected
   * @type {DBaseModel}
   */
  _data;

  /**
   * 加载完成后的模型实例
   * @protected
   * @type {Live2DModel<InternalModel> | any}
   */
  _model;

  /**
   * 创建基础模型控制器
   * @constructor
   * @param {UOptionsController} options live2d选项数据控制器
   * @param {?DBaseModel} data 基础模型数据
   */
  constructor(options, data = new DBaseModel()) {
    super(options);
    this._data = data;
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
    localStorage.setItem('wlLive2d-model-index', `${ index }`);
  }

  /**
   * 获取当前正在展示的模型
   * @return {Live2DModel<InternalModel> | any}
   */
  get currentModel() {
    return this._model;
  }

  /**
   * 获取数据中的背景颜色
   * @return {string}
   */
  get backgroundColor() {
    return this._data.backgroundColor ?? 'transparent';
  }

  /**
   * 模型控制器初始化
   * @return {UBaseModelController} 返回自身引用
   */
  init() {
    this.loadModel();
    return this;
  }

  /**
   * 加载模型
   * @return {void}
   */
  loadModel() {
    const current = this.optionData.models[this.modelIndex];
    const url = current?.path ?? '';
    const model = this._model = Live2DModel.fromSync(url, {
      onError: (e) => {
        this.options.event.emit(EEvent.modelError, e);
      }
    });
    // 设置模型数据
    if (current) {
      model.x = current?.position?.x ?? 0;
      model.y = current?.position?.y ?? 0;
      model.scale.x = 0.15 * (current?.scale ?? 1);
      model.scale.y = 0.15 * (current?.scale ?? 1);
    }
    this._model.once('load', () => {
      // 设置模型的宽度和高度
      current?.width && (model.width = current.width);
      current?.height && (model.height = current.height);
      this.options.app.stage.addChild(model);
      this.options.event.emit(EEvent.modelLoad, { width: model.width, height: model.height });
    });
  }
}
