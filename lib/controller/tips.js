import { mergeAll } from 'ramda';
import { DBaseTips } from '../models/index.js';
import { EEvent } from '../utils/index.js';
import { UBaseController } from './base.js';

/**
 * @class
 * @classdesc DBaseTips的控制器类
 * @memberof module:controller
 * @alias UBaseTipsController
 */
export class UBaseTipsController extends UBaseController {
  /**
   * 基础消息提示
   * @protected
   * @type {DBaseTips}
   */
  _data;

  /**
   * 消息提示框
   * @protected
   * @type {HTMLElement}
   */
  _tips;

  /**
   * 在提示框显示期间的定时器id
   * @protected
   * @type {?number}
   */
  _showId;

  /**
   * 在提示框隐藏期间的定时器id
   * @protected
   * @type {?number}
   */
  _hiddenId;

  /**
   * 提示框显示的文本
   * @protected
   * @type {string}
   */
  _text;

  /**
   * 创建基础模型控制器
   * @constructor
   * @param {UOptionsController} options live2d选项数据控制器
   * @param {?DBaseTips} data 基础模型数据
   * @listens EEvent#modelLoad
   */
  constructor(options, data = null) {
    super(options);
    this._data = mergeAll([new DBaseTips(), data]);
    this._tips = this.options.stage.tips;
    this._showId = null;
    this._hiddenId = null;
    this._text = '措施费红色回风口的国家何况阿帆上课啊积分哈河副科级啊还是';
    this.options.event.once(EEvent.modelLoad, this._onModelLoad, this);
  }

  /**
   * 提示框出现的时长
   * @return {number}
   */
  get duration() {
    return this._data.duration ?? 3000;
  }

  /**
   * 提示框隐藏的时长
   * @return {number}
   */
  get interval() {
    return this._data.interval ?? 5000;
  }

  /**
   * 返回显示期间的定时器id
   * @protected
   * @type {?number}
   */
  get showId() {
    return this._showId;
  }

  /**
   * 返回框隐藏期间的定时器id
   * @protected
   * @type {?number}
   */
  get hiddenId() {
    return this._hiddenId;
  }

  /**
   * 设置提示框中的文本值, 在提示框开始显示之前替换
   * @param {string} text 文本值
   */
  set text(text) {
    this._text = text;
  }

  /**
   * 提示框淡入
   * @param {boolean} inherit true: 继承原有的时间, false: 重新开始计时
   * @listens EEvent#fadeEnd
   */
  fadeIn(inherit = false) {
    this._hiddenId = null;
    // 设置最小的文本
    this._tips.innerText = this._text;
    const { stage, event } = this.options;
    stage.fadeIn(this._tips);
    event.once(EEvent.fadeEnd, () => {
      // 淡入完成后计时
      if (!inherit) {
        clearTimeout(this._showId);
        this._showId = setTimeout(this.fadeOut.bind(this), this.duration);
      }
    });
  }

  /**
   * 提示框淡出
   * @param {boolean} inherit true: 继承原有的时间, false: 重新开始计时
   * @listens EEvent#fadeEnd
   */
  fadeOut(inherit) {
    this._showId = null;
    const { stage, event } = this.options;
    stage.fadeOut(this._tips);
    event.once(EEvent.fadeEnd, () => {
      // 淡出完成后计时
      if (!inherit) {
        clearTimeout(this._hiddenId);
        this._hiddenId = setTimeout(this.fadeIn.bind(this), this.interval);
      }
    });
  }

  /**
   * 模型加载完成后开始显示消息提示框
   * @protected
   */
  _onModelLoad() {
    setTimeout(() => {
      this.fadeIn();
    }, 500);
  }

  /**
   * @inheritDoc
   */
  init() {}
}
