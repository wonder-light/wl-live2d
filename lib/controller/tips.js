import { DBaseMessage, DBaseTips } from '../models/index.js';
import { EEvent, FHelp } from '../utils/index.js';
import { UBaseController } from './base.js';

/**
 * @class
 * @classdesc DBaseTips的控制器类
 * @extends UBaseController
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
   * @param {ULive2dController} options live2d选项数据控制器
   * @param {?DBaseTips} [data=null] 基础模型数据
   * @listens EEvent#fadeEnd 模型加载完成后淡入结束的事件
   */
  constructor(options, data = null) {
    super(options);
    this._data = FHelp.mergeAll(new DBaseTips(), data ?? {});
    this._messages = this._data.message.map(t => new DBaseMessage(t));
    this._tips = this.live2d.stage.tips;
    this._showId = null;
    this._hiddenId = null;
    this._text = '欢迎光临';
    this.event.once(EEvent.fadeEnd, () => {
      setTimeout(this.fadeIn.bind(this), 500);
    }, this);
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
   * 获取所有消息提示数组
   * @type {DBaseMessage[]}
   */
  get messages() {
    return this._messages;
  }

  /**
   * 提示框中的文本值
   * @return {string} text
   */
  get text() {
    return this._text;
  }

  /**
   * 设置提示框中的文本值, 在提示框开始显示之前替换
   * @param {string} text 文本
   */
  set text(text) {
    this._text = text;
  }

  /**
   * 提示框淡入
   *
   * `inherit = true`, 则继承原有的时间, 否则重新开始计时
   * @param {boolean} [inherit=false] 继承原有时间
   * @listens EEvent#fadeEnd
   */
  fadeIn(inherit = false) {
    this._hiddenId = null;
    // 设置显示的文本
    this._tips.innerText = this.getRandomMessage();
    this.live2d.stage.fadeIn(this._tips);
    this.event.once(EEvent.fadeEnd, () => {
      // 淡入完成后计时
      if (!inherit) {
        clearTimeout(this._showId);
        this._showId = setTimeout(this.fadeOut.bind(this), this.duration);
      }
    });
  }

  /**
   * 提示框淡出
   *
   * `inherit = true`, 则继承原有的时间, 否则重新开始计时
   * @param {boolean} [inherit=fale] 继承原有时间
   * @listens EEvent#fadeEnd
   */
  fadeOut(inherit = false) {
    this._showId = null;
    this.live2d.stage.fadeOut(this._tips);
    this.event.once(EEvent.fadeEnd, () => {
      // 淡出完成后计时
      if (!inherit) {
        clearTimeout(this._hiddenId);
        this._hiddenId = setTimeout(this.fadeIn.bind(this), this.interval);
      }
    });
  }

  /**
   * 通知消息
   *
   * 立即淡入提示框, 并重置提示框显示时间
   * @param {string} text 需要显示的文本
   */
  notify(text) {
    this.text = text;
    this.fadeIn();
  }

  /**
   * 添加消息到消息列表中
   *
   * 这并不会立即显示, 而是根据消息的优先级和概率随机抽取出消息进行显示
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
   * 从消息列表中移除消息
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
   * @override
   */
  init() {}

  /**
   * @inheritDoc
   * @override
   */
  destroy() {
    clearTimeout(this.showId);
    clearTimeout(this.hiddenId);
    this._data = null;
    this._tips = null;
    this._messages = null;
  }

  /**
   * 从消息列表中随机获取消息
   * @return {string} 消息文本
   */
  getRandomMessage() {
    // 通过 condition 筛选出一部分, 并以优先级精选分组
    const list = this._messages.filter(m => m.condition == null || m.condition());
    /** @type {Record<number, DBaseMessage[]> } */
    const group = FHelp.groupBy((m) => m.priority, list);
    // 优先级列表, 优先级小的在前面
    const priority = Object.keys(group).map(m => parseInt(m)).sort();
    if (priority.length <= 0) {
      // 没有消息则返回 text
      return this._text;
    }
    // 使用优先级组合成一个个区间, max 是区间的最大值
    const max = priority.reduce((prev, current) => prev + current.priority, 0);
    // 获取随机值
    const district = FHelp.random(max);
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
    // 随机获取需要显示的消息
    const target = group[key][FHelp.random(group[key].length, 0, 'floor')];
    if (FHelp.is(Array, target.text)) {
      return target.text[FHelp.random(target.text.length, 0, 'floor')];
    }
    return target.text;
  }
}
