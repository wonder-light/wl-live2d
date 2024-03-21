import { DModel } from '../models/index.js';
import { EEvent, FHelp } from '../utils/index.js';
import { UBaseController } from './base.js';

/**
 * @class
 * @summary model 控制器类
 * @classdesc 用于控制模型相关的的控制器, 例如加载模型, 切换模型等等
 * @extends UBaseController
 * @memberof module:controller
 * @alias UModelController
 */
export class UModelController extends UBaseController {
  /**
   * 所有的模型数据, 用于存储对应的模型数据
   * @summary 模型数据集
   * @protected
   * @type {TModels}
   */
  _data;

  /**
   * 当前模型在模型集中的位置索引
   * @summary 模型索引
   * @protected
   * @type {number}
   */
  _modelId;

  /**
   * 当前模型贴图在模型集中的位置索引
   * @summary 贴图索引
   * @protected
   * @type {number}
   */
  _textureId;

  /**
   * 模型加载完成后的模型实例
   * @summary 模型实例
   * @protected
   * @type {?TLive2DModel}
   * @default null
   */
  _model = null;

  /**
   * 当前模型正在执行的 motion
   * @summary 模型 motion
   * @protected
   * @type {?string}
   * @default null
   */
  _currentMotion = null;

  /**
   * 创建 live2d model 控制器
   * @summary model 控制器构造
   * @constructor
   * @param {ULive2dController} live2d live2d 上下文
   * @param {TModels} [data=[]] 模型数据集
   */
  constructor(live2d, data = []) {
    super(live2d);
    const fun = (data) => FHelp.is(Array, data) ? data.map(fun) : new DModel(data);
    this._data = FHelp.is(Array, data) ? data.map(fun) : [];
    // 设置索引
    this.modelId = FHelp.defaultTo(0, parseInt(localStorage.getItem('model-id')));
    this.textureId = FHelp.defaultTo(0, parseInt(localStorage.getItem('texture-id')));
  }

  /**
   * 当前模型在模型集中的位置索引
   * @summary 模型索引
   * @type {number}
   */
  get modelId() {
    return this._modelId;
  }

  /**
   * @param {number} index 模型索引
   */
  set modelId(index) {
    this._modelId = FHelp.clamp(0, Math.max(0, this._data.length - 1), index);
    localStorage.setItem('model-id', `${ this._modelId }`);
  }

  /**
   * 当前模型贴图在模型集中的位置索引
   * @summary 贴图索引
   * @type {number}
   */
  get textureId() {
    return this._textureId;
  }

  /**
   * @param {number} index 贴图索引
   */
  set textureId(index) {
    this._textureId = FHelp.clamp(0, this.#getOutfitMaxIndex(), index);
    localStorage.setItem('texture-id', `${ this._textureId }`);
  }

  /**
   * 当前模型索引对应的模型数据项目
   * @summary 模型数据项目
   * @type {TModelItem}
   * @readonly
   */
  get modelData() {
    return this._data[this.modelId];
  }

  /**
   * 获取当前正在展示的 live2d 模型实例, 只有在模型加载完成后才不为 null
   * @summary 模型实例
   * @type {?TLive2DModel}
   * @readonly
   */
  get model() {
    return this._model;
  }

  /**
   * 当前模型正在执行的 motion, 未执行时为 null
   * @summary 模型 motion
   * @type {?string}
   * @readonly
   */
  get currentMotion() {
    return this._currentMotion;
  }

  /**
   * 当前正在展示的模型数据中定义的背景颜色, 默认为 transparent
   * @summary 模型背景色
   * @type {string}
   * @readonly
   */
  get backgroundColor() {
    let data = this.modelData;
    if (FHelp.is(Array, data)) {
      data = data[this.textureId];
    }
    return data?.backgroundColor ?? 'transparent';
  }

  /**
   * 在 model 控制器初始化时开始加载与 modelId 及 textureId 对应的模型
   * @summary 初始化 model 控制器
   * @override
   */
  init() {
    this.loadModel(this.modelId, this.textureId).catch(FHelp.F);
  }

  /**
   * 销毁模型实例, 移除模型数据, 以及移除绑定的事件
   * @summary 销毁 model 控制器
   * @override
   */
  destroy() {
    super.destroy();
    this._data = null;
    this._model?.destroy();
    this._model = null;
    this._currentMotion = null;
  }

  /**
   * 加载与 modelId 及 textureId 对应的模型
   * @summary 加载模型
   * @param {number} modelId 模型索引
   * @param {number} [textureId=0] 模型服装索引
   * @return {Promise<void>}
   * @fires EEvent#modelStart 模型开始加载事件
   * @fires EEvent#modelError 模型加载错误事件
   * @fires EEvent#modelLoad 模型加载成功事件
   * @async
   */
  async loadModel(modelId, textureId = 0) {
    let current = this._data[modelId];
    const stage = this.app.stage;
    const event = this.event;
    current = FHelp.is(Array, current) ? current[textureId] : current;
    if (FHelp.isNotValid(current)) {
      event.emit(EEvent.modelError, Error('没有找到模型哦'));
      return;
    }
    // 开始加载事件
    event.emit(EEvent.modelStart);
    // 获取URL
    let url = current.path;
    if (FHelp.isNotValid(url)) {
      url = 'https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%20girls%20Frontline/live2dold/old/kp31/normal/model.json';
    }
    // 移除上一个模型
    this._model = null;
    stage.removeChildren(0, stage.children.length);
    /** @type {TLive2DModel | any} */
    const model = await ILive2DModel.from(url, {
      onError: (e) => {
        event.emit(EEvent.modelError, e);
      }
    });
    this._model = model;

    // 加载完成后更新索引
    this.modelId = modelId;
    this.textureId = textureId;
    // 设置模型数据
    model.x = current.position?.x ?? 0;
    model.y = current.position?.y ?? 0;
    model.scale.set(0.15 * (current.scale ?? 1));
    // 添加到舞台
    stage.addChild(model);
    // 如果模型数据中有定义宽高, 则直接设置模型的宽高, 否则使用模型加载后自己的宽高
    current.width && (model.width = current.width);
    current.height && (model.height = current.height);
    // 绑定动作
    this.motion();
    // 发出事件
    event.emit(EEvent.modelLoad, { width: model.width, height: model.height });
  }

  /**
   * 切换与 modelId 及 textureId 对应的模型
   * @summary 切换模型
   * @param {number} id 模型索引
   * @param {number} [textureId=0] 模型服装索引
   * @return {Promise<void>}
   * @async
   */
  async switchModel(id, textureId = 0) {
    const stage = this.live2d.stage;
    // 此时 wrapper 不为 display:none , 可以获取宽高数据, canvas 渲染不会出错
    await stage.fadeOut(stage.canvas);
    await this.loadModel(id, textureId);
    await stage.fadeIn(stage.canvas);
  }

  /**
   * 喀什切换模型数据集中的下一个模型
   * @summary 下一个模型
   * @return {Promise<void>}
   * @async
   */
  async nextModel() {
    const max = this._data.length - 1;
    if (max <= 0) {
      // 通知: 没有其它模型哦
      await this.live2d.tips.notify('没有其它模型哦');
      return;
    }
    await this.switchModel(this.modelId >= max ? 0 : this.modelId + 1, 0);
  }

  /**
   * 开始切换模型的下一个服装
   * @summary 下一个服装
   * @return {Promise<void>}
   * @async
   */
  async nextTexture() {
    const max = this.#getOutfitMaxIndex();
    if (max <= 0) {
      // 通知: 没有其它服装哦
      await this.live2d.tips.notify('没有其它服装哦');
      return;
    }
    await this.switchModel(this.modelId, this.textureId >= max ? 0 : this.textureId + 1);
  }

  /**
   * 重新加载当前模型
   * @summary 重置模型
   * @return {Promise<void>}
   * @async
   */
  async resetModel() {
    await this.loadModel(this.modelId, this.textureId);
  }

  /**
   * 在模型加载完成后绑定模型的 `hit` 事件, 并在点击时触发对应的 motion, 同时绑定 motionStart 与 motionFinish
   * @summary 绑定 motion
   * @return {UModelController} 自身引用
   * @fires EEvent#motionStart 模型运动开始事件
   * @fires EEvent#motionFinish 模型运动完成事件
   */
  motion() {
    this.model.on('hit', /**@param {string[]} hitAreas*/async (hitAreas) => {
      // 无法自动加载 motion, 不知是什么原因
      await this.model.motion(`tap_${ hitAreas[0] }`) || await this.model.motion(hitAreas[0]);
    });
    this.model.internalModel.motionManager.on('motionStart', (group, index, audio) => {
      // 设置音量
      audio && (audio.volume = this.modelData.volume ?? 0.5);
      this._currentMotion = group;
      this.event.emit(EEvent.motionStart, group, index, audio);
    });
    this.model.internalModel.motionManager.on('motionFinish', () => {
      this._currentMotion = null;
      this.event.emit(EEvent.motionFinish);
    });
    return this;
  }

  /**
   * 判断当前模型是否有其他服装
   * @summary 是否有其他服装
   * @return {boolean} true: 有其他服装, false: 没有其他服装
   */
  hasOutfit() {
    let current = this.modelData;
    return FHelp.is(Array, current) && current.length > 1;
  }

  /**
   * 获取当前模型服装的最大索引
   * @summary 服装最大索引
   * @return {number} 最大索引
   * @private
   */
  #getOutfitMaxIndex() {
    let current = this.modelData;
    return FHelp.is(Array, current) ? Math.max(0, current.length - 1) : 0;
  }
}
