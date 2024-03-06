import { DBaseMessage, DBaseTips } from '../models/index.js';
import { EEvent, FHelp } from '../utils/index.js';
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
   * 所有消息提示数组
   * @protected
   * @type {DBaseMessage[]}
   */
  _messages;

  /**
   * 在提示框显示期间的定时器id
   * @protected
   * @type {?number}
   * @default null
   */
  _showId;

  /**
   * 在提示框隐藏期间的定时器id
   * @protected
   * @type {?number}
   * @default null
   */
  _hiddenId;

  /**
   * 提示框显示的文本
   * @protected
   * @type {string}
   * @default ''
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
    this._data = FHelp.mergeAll(new DBaseTips(), data);
    this._messages = this._data.message.map(t => new DBaseMessage(t));
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
   * 获取所有消息提示数组
   * @type {DBaseMessage[]}
   */
  get messages() {
    return this._messages;
  }

  /**
   * 提示框淡入
   * @param {boolean} inherit true: 继承原有的时间, false: 重新开始计时
   * @listens EEvent#fadeEnd
   */
  fadeIn(inherit = false) {
    this._hiddenId = null;
    // 设置显示的文本
    this._tips.innerText = this.getRandomMessage() ?? this._text;
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
   * 通知消息
   * @param {string} text 显示的文本
   */
  notify(text) {
    this.text = text;
    this.fadeIn();
  }

  /**
   * 添加消息
   * @param {DBaseMessage} message 消息
   * @return {UBaseTipsController} 自身引用
   */
  addMessage(message) {
    if (FHelp.is(DBaseMessage, message)) {
      this._messages.push(message);
    }
    return this;
  }

  /**
   * 移除消息
   * @param {DBaseMessage} message 消息
   * @return {UBaseTipsController} 自身引用
   */
  removeMessage(message) {
    const index = this._messages.indexOf(message);
    if (index >= 0) {
      this._messages.splice(index, 1);
    }
    return this;
  }

  /**
   * @inheritDoc
   */
  init() {}

  /**
   * @inheritDoc
   */
  destroy() {
    clearTimeout(this.showId);
    clearTimeout(this.hiddenId);
    this._data = null;
    this._tips = null;
    this._messages = null;
  }

  /**
   * 获取随机消息
   * @return {?string}
   * @protected
   */
  getRandomMessage() {
    // 通过 condition 筛选出一部分, 并以优先级精选分组
    /** @type {Record<number, DBaseMessage[]> } */
    let group = FHelp.groupBy((m) => m.priority, this._messages.filter(m => m.condition()));
    // 优先级小的在前面
    let priority = Object.keys(group).map(m => parseInt(m)).sort();
    if (priority.length <= 0) {
      // 没有消息
      return null;
    }
    // 使用优先级组合成一个个区间, max 是区间的最大值
    const max = priority.reduce((prev, current) => prev + current.priority, 0);
    // 获取随机值
    const district = Math.random() * max;
    // 确定随机值落在那个区间
    let i = 0;
    let key = -1;
    for (const k of priority) {
      i += k;
      if (district <= i) {
        key = k;
        break;
      }
    }
    // 需要显示的消息
    const target = group[key][FHelp.random(group[key].length, 0, 'floor')];
    if (FHelp.is(Array, target.text)) {
      return target.text[FHelp.random(target.text.length, 0, 'floor')];
    }
    return target.text;
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
}
