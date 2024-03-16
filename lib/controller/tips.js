import { DBaseMessage, DBaseTips } from '../models/index.js';
import { FHelp } from '../utils/index.js';
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
   * 消息提示数据
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
   * 是否停止 tips 的动画, 需要等待下一轮循环才会生效
   * @type {boolean}
   * @protected
   * @default false
   */
  _stop;

  /**
   * 创建基础模型控制器
   * @constructor
   * @param {ULive2dController} live2d live2d选项数据控制器
   * @param {?DBaseTips} [data=null] 基础模型数据
   */
  constructor(live2d, data = null) {
    super(live2d);
    this._data = FHelp.mergeAll(new DBaseTips(), data ?? {});
    this._messages = this._data.message.map(t => new DBaseMessage(t));
    this._tips = this.live2d.stage.tips;
    this._stop = false;
    this._text = '';
    this._showId = null;
    this._hiddenId = setTimeout(this.startFade.bind(this), this.interval);
  }

  /**
   * 消息提示数据
   * @return {DBaseTips}
   */
  get data() {
    return this._data;
  }

  /**
   * 提示框出现的时长
   * @return {number}
   */
  get duration() {
    return this._data.duration;
  }

  /**
   * 提示框隐藏的时长
   * @return {number}
   */
  get interval() {
    return this._data.interval;
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
   * 是否停止 tips 的动画, 需要等待下一轮循环才会生效
   * @return {boolean}
   */
  get stop() {
    return this._stop;
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
    super.destroy();
    this.stopFade();
    this._messages = [];
  }

  /**
   * 提示框淡入
   *
   * `inherit = true`, 则继承原有的时间, 否则重新开始计时
   * @param {boolean} [inherit=false] 继承原有时间
   * @return {Promise<void>}
   */
  async fadeIn(inherit = false) {
    // 已经停止则返回
    if (this._stop) return;
    // 需要检测且句柄有效则返回
    if (inherit && this._showId > 0) return;
    // 清除之前的定时
    this.#clearTime();
    // 检测消息数量
    if (this._messages.length <= 0) {
      // 循环等待
      this._showId = setTimeout(() => {
        // 清除句柄
        this._showId = null;
        this.fadeIn().catch(FHelp.F);
      }, this.interval);
      return;
    }
    // 设置显示的文本
    this._tips.innerText = this._text = this.getRandomMessage();
    await this.live2d.stage.fadeIn(this._tips);
    // 淡入完成后计时
    this._showId = setTimeout(() => {
      // 清除句柄
      this._showId = null;
      // 淡出失败不负责
      this.fadeOut().catch(FHelp.F);
    }, this.duration);
  }

  /**
   * 提示框淡出
   *
   * `inherit = true`, 则继承原有的时间, 否则重新开始计时
   * @param {boolean} [inherit=fale] 继承原有时间
   * @return {Promise<void>}
   */
  async fadeOut(inherit = false) {
    // 需要检测且句柄有效则返回
    if (inherit && this._hiddenId > 0) return;
    // 清除之前的定时
    this.#clearTime();
    await this.live2d.stage.fadeOut(this._tips);
    // 淡出完成后计时
    this._hiddenId = setTimeout(() => {
      // 清除句柄
      this._hiddenId = null;
      // 淡出失败不负责
      this.fadeIn().catch(FHelp.F);
    }, this.interval);
  }

  /**
   * 开始淡入, 之后恢复淡入淡出
   */
  startFade() {
    this._stop = false;
    this.fadeIn().catch(FHelp.F);
  }

  /**
   * 立即淡出, 之后停止淡入淡出
   */
  stopFade() {
    this.fadeOut().catch(FHelp.F);
    this._stop = true;
  }

  /**
   * 通知消息
   *
   * 立即淡入提示框, 并重置提示框显示时间
   * @param {string} text 需要显示的文本
   */
  notify(text) {
    const mes = new DBaseMessage();
    mes.text = this.text = text;
    mes.priority = 99999;
    // 添加到消息队列中
    this.addMessage(mes);
    this.fadeIn().catch(FHelp.F).finally(() => this.removeMessage(mes));
  }

  /**
   * 添加消息到消息列表中
   *
   * 这并不会立即显示, 而是根据消息的优先级和概率随机抽取出消息进行显示
   * @param {DBaseMessage} message 消息
   * @return {UBaseTipsController} 自身引用
   */
  addMessage(...message) {
    this._messages.push(...message.filter(mes => FHelp.is(DBaseMessage, mes)));
    return this;
  }

  /**
   * 从消息列表中移除消息
   * @param {DBaseMessage} message 消息
   * @return {UBaseTipsController} 自身引用
   */
  removeMessage(...message) {
    for (const mes of message) {
      const index = this._messages.indexOf(mes);
      if (index >= 0) {
        this._messages.splice(index, 1);
      }
    }
    return this;
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
    // 获取数量占比的函数, 以优先级为主, 数量其次
    const getLength = (key) => {
      const length = Math.ceil(group[key].length / 5) + Math.max(key, 0);
      return { length };
    };
    // 优先级列表, 优先级小的在前面
    const priority = Object.keys(group)
                           .map(m => parseInt(m))
                           .sort()
                           .map(p => Array.from(getLength(p), () => p))
                           .flat();
    if (priority.length <= 0) {
      // 没有消息则返回 text
      return this._text;
    }
    // 从优先级列表随机选取一个值
    const key = priority[FHelp.random(priority.length, 0, 'floor')];
    // 对应的目标数组
    const targets = group[key];
    // 随机获取需要显示的消息
    const target = targets[FHelp.random(targets.length, 0, 'floor')];
    if (FHelp.is(Array, target.text)) {
      return target.text[FHelp.random(target.text.length, 0, 'floor')];
    }
    return target.text;
  }

  /**
   * 清除时间句柄
   * @private
   */
  #clearTime() {
    clearInterval(this._showId);
    clearInterval(this._hiddenId);
    this._showId = null;
    this._hiddenId = null;
  }
}
