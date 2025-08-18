import { DMessage, DTips } from '../models';
import { FHelp } from '../utils';
import { UBaseController } from './base';
import type { ULive2dController } from './live2d';

/**
 * @class
 * @summary live2d tips 属性
 * @classdesc 分离出来的 UTipsController 的属性
 * @extends UBaseController
 * @memberof module:controller
 * @alias UTipsProperty
 */
abstract class UTipsProperty extends UBaseController {
  /**
   * 在提示框显示期间的定时器 id
   * @summary 显示定时器 id
   * @protected
   * @type {?number}
   * @default null
   */
  protected _showId?: number;

  /**
   * 在提示框隐藏期间的定时器 id
   * @summary 隐藏定时器 id
   * @protected
   * @type {?number}
   * @default null
   */
  protected _hiddenId?: number;

  /**
   * 提示数据集合, 用于存储提示数据, 以及消息数据
   * @summary tips 数据
   * @protected
   * @type {DTips}
   */
  protected _data: DTips;

  /**
   * getter: 消息提示数据
   * @summary tips 数据
   * @type {DTips}
   * @readonly
   */
  public get data(): DTips {
    return this._data;
  }

  /**
   * 消息数据集合, 用于存储消息数据, 包括但不限于 DMessage
   * @summary 消息数据集
   * @protected
   * @type {DMessage[]}
   * @default []
   */
  protected _messages: DMessage[];

  /**
   * getter: 所有消息提示数据集合
   * @summary 消息数据集
   * @type {DMessage[]}
   * @readonly
   */
  public get messages(): DMessage[] {
    return this._messages;
  }

  /**
   * 在提示框显示时期需要显示的文本
   * @summary 消息文本
   * @protected
   * @type {string}
   * @default ''
   */
  protected _text: string;

  /**
   * getter: 提示框显示时期的文本值
   * @summary 提示框文本
   * @type {string}
   * @readonly
   */
  public get text(): string {
    return this._text;
  }

  /**
   * 是否停止 tips 的淡入淡出循环, 如果需要停止的话则需要等待淡出之后才会生效
   * @summary 停止提示框循环
   * @type {boolean}
   * @protected
   * @default false
   */
  protected _stop: boolean;

  /**
   * getter: 指示当前是否已经停止 tips 的淡入淡出循环, 如果需要停止的话则需要等待淡出之后才会生效
   * @summary 停止提示框循环
   * @type {boolean}
   * @readonly
   */
  public get stop(): boolean {
    return this._stop;
  }

  /**
   * getter: 提示框显示时的持续时间, 单位 ms
   * @summary 显示时的持续时间
   * @type {number}
   * @readonly
   */
  public get duration(): number {
    return this.data.duration!;
  }

  /**
   * setter: 设置提示框显示时的持续时间, 单位 ms
   * @summary 设置显示时的持续时间
   * @param {number} value
   */
  public set duration(value: number) {
    this.data.duration = value ?? 3000;
  }

  /**
   * getter: 提示框隐藏时的持续时间, 单位 ms
   * @summary 隐藏时的持续时间
   * @type {number}
   * @readonly
   */
  public get interval(): number {
    return this.data.interval!;
  }

  /**
   * setter: 设置提示框隐藏时的持续时间, 单位 ms
   * @summary 隐藏时的持续时间
   * @param {number} value
   */
  public set interval(value: number) {
    this.data.interval = value ?? 5000;
  }
}

/**
 * @class
 * @summary tips 控制器类
 * @classdesc 用于控制 tips 相关的的控制器, 例如控制提示框淡入淡出, 以及消息的显示等等
 * @extends UTipsProperty
 * @memberof module:controller
 * @alias UTipsController
 */
export class UTipsController extends UTipsProperty {
  /**
   * 创建 live2d tips 控制器
   * @summary tips 控制器构造
   * @constructor
   * @param {ULive2dController} live2d live2d 上下文
   * @param {DTips | null} [data=null] tips 数据
   */
  public constructor(live2d: ULive2dController, data: DTips | null = null) {
    super(live2d);
    this._data = FHelp.mergeAll(new DTips(), data ?? {});
    this._messages = this._data.message?.map((t: any) => new DMessage(t)) ?? [];
    this._stop = false;
    this._text = '';
    this._showId = undefined;
    this._hiddenId = undefined;
    // 提示框
    const tips = this.live2d.stage.tips;
    const { minWidth, minHeight, offsetX, offsetY } = this.data;
    tips.style.minWidth = `${ minWidth }px`;
    tips.style.minHeight = `${ minHeight }px`;
    tips.style.setProperty('--tips-offset-x', `${ offsetX }px`);
    tips.style.setProperty('--tips-offset-y', `${ offsetY }px`);
  }

  /**
   * 初始化 tips 控制器, 并开始提示框的淡入淡出
   * @summary 初始化tips控制器
   * @override
   */
  public override init(): void {
    this._hiddenId = setTimeout(this.startFade.bind(this), this.interval) as unknown as number;
  }

  /**
   * 移除绑定事件, 停止淡入淡出, 以及销毁消息集合
   * @summary 销毁控制器
   * @override
   */
  public override destroy(): void {
    super.destroy();
    this.stopFade();
    this._messages = [];
  }

  /**
   * 开始淡入提示框, 淡入完成后等待一段时间执行淡出
   *
   * 如果 `inherit = true`, 则继承原有的时间, 否则重新开始计时
   *
   * 如果消息集合为空, 则会一直循环等待消息的添加, 而循环时长为隐藏时长
   * @summary 提示框淡入
   * @param {boolean} [inherit=false] 继承原有时间
   * @return {Promise<void>}
   * @async
   */
  public async fadeIn(inherit: boolean = false): Promise<void> {
    // 已经停止则返回
    if (this.stop) return;
    // 需要检测且句柄有效则返回
    if (inherit && this._showId != null && this._showId > 0) return;
    // 清除之前的定时
    this._clearTime();
    // 检测消息数量
    if (this.messages.length <= 0 || (this._text = this.getRandomMessage()).trim().length <= 0) {
      // 循环等待
      this._showId = setTimeout(() => {
        // 清除句柄
        this._showId = undefined;
        this.fadeIn().catch(FHelp.F);
      }, this.interval) as unknown as number;
      return;
    }
    // 设置显示的文本
    let tips = this.live2d.stage.tips;
    tips.innerHTML = this._text;
    await this.live2d.stage.fadeIn(tips);
    // 淡入完成后计时
    this._showId = setTimeout(() => {
      // 清除句柄
      this._showId = undefined;
      // 淡出失败不负责
      this.fadeOut().catch(FHelp.F);
    }, this.duration) as unknown as number;
  }

  /**
   * 开始淡出提示框, 淡出完成后等待一段时间执行淡入
   *
   * 如果 `inherit = true`, 则继承原有的时间, 否则重新开始计时
   * @summary 提示框淡出
   * @param {boolean} [inherit=fale] 继承原有时间
   * @return {Promise<void>}
   * @async
   */
  public async fadeOut(inherit: boolean = false): Promise<void> {
    // 需要检测且句柄有效则返回
    if (inherit && this._hiddenId != null && this._hiddenId > 0) return;
    // 清除之前的定时
    this._clearTime();
    await this.live2d.stage.fadeOut(this.live2d.stage.tips);
    // 淡出完成后计时
    this._hiddenId = setTimeout(() => {
      // 清除句柄
      this._hiddenId = undefined;
      // 淡出失败不负责
      this.fadeIn().catch(FHelp.F);
    }, this.interval) as unknown as number;
  }

  /**
   * 开始进行淡入, 并将 `stop = false`, 之后恢复淡入淡出循环
   * @summary 结束淡入淡出
   */
  public startFade(): void {
    this._stop = false;
    this.fadeIn().catch(FHelp.F);
  }

  /**
   * 立即进行淡出, 并将 `stop = true`, 淡出完成后停止淡入淡出
   * @summary 结束淡入淡出
   */
  public stopFade(): void {
    this.fadeOut().catch(FHelp.F);
    this._stop = true;
  }

  /**
   * 立即淡入提示框显示对应的消息, 并且重置提示框显示时长, 完成后从消息集合中移除对应的消息
   * @summary 通知消息
   * @param {string} text 需要显示的文本
   * @async
   */
  public async notify(text: string): Promise<void> {
    const mes = new DMessage();
    mes.text = this._text = text;
    mes.priority = 99999;
    // 添加到消息队列中
    this.addMessage(mes);
    await this.fadeIn().catch(FHelp.F).finally(() => this.removeMessage(mes));
  }

  /**
   * 将消息集添加到消息列表中
   *
   * 通常这并不会立即显示, 而是等待下一轮提示框显示时根据一定概率随机抽取消息进行显示
   * @summary 添加消息
   * @param {...DMessage} messages 消息集
   * @return {UTipsController} 自身引用
   */
  public addMessage(...messages: DMessage[]): UTipsController {
    this.messages.push(...messages.filter(mes => FHelp.is(DMessage, mes)));
    return this;
  }

  /**
   * 从消息列表中移除对应的消息
   * @summary 移除消息
   * @param {...DMessage} message 消息集
   * @return {UTipsController} 自身引用
   */
  public removeMessage(...message: DMessage[]): UTipsController {
    for (const mes of message) {
      const index = this.messages.indexOf(mes);
      if (index >= 0) this.messages.splice(index, 1);
    }
    return this;
  }

  /**
   * 从消息列表中按照一定概率随机获取消息
   * @summary 随机获取消息
   * @return {string} 消息文本
   */
  public getRandomMessage(): string {
    // 通过 condition 筛选出一部分, 并以优先级精选分组
    const list = this.messages.filter(m => m.condition == null || m.condition());
    /** @type {Partial<Record<string, DMessage[]>>} */
    const group = FHelp.groupBy((m) => m.priority!.toString(), list);
    // 获取数量占比的函数, 以优先级为主, 数量其次
    const getLength = (key: number) => {
      let len = group[key.toString()]!.length;
      let length = Math.ceil(len / 5) + Math.max(key, 0);
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
      return this.text;
    }
    // 从优先级列表随机选取一个值
    const key = priority[FHelp.random(0, priority.length, 'floor')];
    // 对应的目标数组
    const targets = group[key]!;
    // 随机获取需要显示的消息
    const target = targets[FHelp.random(0, targets.length, 'floor')];
    if (FHelp.is(Array, target.text)) {
      return target.text[FHelp.random(0, target.text.length, 'floor')];
    }
    return target.text;
  }

  /**
   * 清除显示定时器 id, 以及隐藏定时器 id
   * @summary 清除时间句柄
   * @private
   */
  protected _clearTime(): void {
    clearInterval(this._showId);
    clearInterval(this._hiddenId);
    this._showId = undefined;
    this._hiddenId = undefined;
  }
}
