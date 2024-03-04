import { InternalModel, Live2DModel } from 'pixi-live2d-display';
import { clamp, defaultTo, is, isEmpty } from 'ramda';
import { DBaseModel } from '../models/index.js';
import { EEvent, FLogger } from '../utils/index.js';
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
   * @type {DBaseModel[]}
   */
  _data;

  /**
   * 当前模型的位置索引
   * @type {number}
   */
  _modelId;

  /**
   * 当前模型的贴图索引
   * @type {number}
   */
  _textureId;

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
   * @param {?DBaseModel[]} data 基础模型数据
   */
  constructor(options, data = []) {
    super(options);
    this._data = is(Array, data) ? data : [];
    // 设置索引
    this._modelId = defaultTo(0, parseInt(localStorage.getItem('model-id')));
    this._textureId = defaultTo(0, parseInt(localStorage.getItem('texture-id')));
  }

  /**
   * 获取当前模型索引
   * @return {number}
   */
  get modelId() {
    return this._modelId;
  }

  /**
   * 设置模型索引
   * @param {number} index 模型索引
   */
  set modelId(index) {
    this._modelId = clamp(0, Math.max(0, this._data.length - 1), index);
    localStorage.setItem('model-id', `${ this._modelId }`);
  }

  /**
   * 获取当前模型的贴图id
   */
  get textureId() {
    return this._textureId;
  }

  /**
   * 设置模型的贴图索引
   * @param {number} index 模型索引
   */
  set textureId(index) {
    this._textureId = clamp(0, this.#getTextureMaxIndex(), index);
    localStorage.setItem('texture-id', `${ this._textureId }`);
  }

  /**
   * 返回当前的模型数据
   * @return {DBaseModel} 模型数据
   */
  get modelData() {
    return this._data[this._modelId];
  }

  /**
   * 获取当前正在展示的live2d模型
   * @return {Live2DModel<InternalModel> | any} live2d模型
   */
  get model() {
    return this._model;
  }

  /**
   * 获取数据中的背景颜色
   * @return {string}
   */
  get backgroundColor() {
    return this.modelData.backgroundColor ?? 'transparent';
  }

  /**
   * 模型控制器初始化
   * @return {UBaseModelController} 返回自身引用
   */
  init() {
    if (this._modelId >= this._data.length) {
      this._modelId = Math.max(0, this._data.length - 1);
    }
    this.loadModel(this._modelId, this._textureId);
    return this;
  }

  /**
   * 加载模型
   * @param {number} modelId 模型索引
   * @param {number} textureId 模型贴图ID
   * @return {UBaseModelController} 自身引用
   */
  loadModel(modelId, textureId = 0) {
    const current = this._data[modelId];
    if (isEmpty(current)) {
      //TODO: 通知 "没有找到模型哦"
      return this;
    }
    // 获取URL
    const pathIndex = this.#useModelPath() ? textureId : 0;
    let url = is(String, current?.path) ? current.path : is(Array, current?.path) ? current.path[pathIndex] : '';
    if (isEmpty(url)) {
      url = 'https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%20girls%20Frontline/live2dold/old/kp31/normal/model.json';
    }
    // 移除上一个模型
    const stage = this.options.app.stage;
    this._model = null;
    stage.removeChildren(0, stage.children.length);
    /**
     * @type {Live2DModel<InternalModel>}
     */
    const model = this._model = Live2DModel.fromSync(url, {
      onError: (e) => {
        this.options.event.emit(EEvent.modelError, e);
      }
    });
    // 加载完成后更新索引
    this.modelId = modelId;
    this.textureId = textureId;
    // 设置模型数据
    if (current) {
      model.x = current?.position?.x ?? 0;
      model.y = current?.position?.y ?? 0;
      model.scale.set(0.15 * (current?.scale ?? 1));
    }
    model.once('load', () => {
      // 添加到舞台
      stage.addChild(model);
      // 设置模型的宽度和高度
      current?.width && (model.width = current.width);
      current?.height && (model.height = current.height);
      // 发出事件
      this.options.event.emit(EEvent.modelLoad, { width: model.width, height: model.height });
      // 板顶动作
      this.motion();
    });
    return this;
  }

  /**
   * 切换模型
   * @param {number} id 模型索引
   * @param {number} textureId 模型贴图ID
   * @return {UBaseModelController} 自身引用
   */
  switchModel(id, textureId = 0) {
    const { stage, event } = this.options;
    stage.fadeOut(stage.canvas, this.loadModel.bind(this, id, textureId));
    event.once(EEvent.modelLoad, () => stage.fadeIn(stage.canvas), this);
    return this;
  }

  /**
   * 切换下一个模型
   * @return {UBaseModelController} 自身引用
   */
  nextModel() {
    if (this._data.length <= 1) {
      // 没有其它模型哦
      return this;
    }
    let id = this._modelId + 1 >= this._data.length ? 0 : this._modelId + 1;
    this.switchModel(id, 0);
    return this;
  }

  /**
   * 切换模型服装
   * @param {number} id 模型纹理索引
   * @return {UBaseModelController} 自身引用
   */
  switchTexture(id) {
    if (this.#useModelPath()) {
      // 通过切换模型来切换纹理
      this.loadModel(this._modelId, id);
    }
    else {
      // 切换纹理
      const texture = this._model.textures.shift();
      this._model.textures.push(texture);
      this._model.internalModel.bindTexture(id, this._model.textures);
      this._model.update(id);
    }
    return this;
  }

  /**
   * 切换下一个贴图
   * @return {UBaseModelController} 自身引用
   */
  nextTexture() {
    const max = this.#getTextureMaxIndex();
    if (max <= 0) {
      // 没有其它贴图哦
      return this;
    }
    const id = this._textureId >= max ? 0 : this._textureId + 1;
    this.switchTexture(id);
    return this;
  }

  /**
   * 添加 motion 加载
   * @return {UBaseModelController} 自身引用
   */
  motion() {
    this._model.on('hit', /**@param {string[]} hitAreas*/async (hitAreas) => {
      FLogger.debug(...hitAreas, this._model.internalModel.hitAreas);
      // 无法自动加载 motion, 不知是什么原因
      await this._model.motion(`tap_${ hitAreas[0] }`) || await this._model.motion(hitAreas[0]);
    });
    this._model.internalModel.motionManager.on('motionStart', (group, index, audio) => {
      // 设置音量
      audio && (audio.volume = this.modelData.volume ?? 0.5);
    });
    return this;
  }

  /**
   * 模型拖拽方法
   */
  draggable() {
    const model = this._model;
    model.buttonMode = true;
    model.on('pointerdown', (e) => {
      model.dragging = true;
      model._pointerX = e.data.global.x - model.x;
      model._pointerY = e.data.global.y - model.y;
    });
    model.on('pointermove', (e) => {
      if (model.dragging) {
        model.position.x = e.data.global.x - model._pointerX;
        model.position.y = e.data.global.y - model._pointerY;
      }
    });
    model.on('pointerupoutside', () => (model.dragging = false));
    model.on('pointerup', () => (model.dragging = false));
  }

  /**
   * 判断贴图索引是否应当使用 Model.Path
   * @private
   * @return {boolean} true: 使用 model.path, false: 使用 texture[]
   */
  #useModelPath() {
    let current = this.modelData;
    return is(Array, current.path) && current.path.length > 1;
  }

  /**
   * 获取当前模型贴图的最大索引
   * @private
   * @return {number} 最大索引
   */
  #getTextureMaxIndex() {
    let max = 0;
    // 如果path中有多个则使用模型, 否则使用模型中的贴图
    if (this.#useModelPath()) {
      max = this.modelData.path.length - 1;
    }
    else {
      max = Math.max(0, this._model.textures.length - 1);
    }
    return max;
  }
}
