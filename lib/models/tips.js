import {DBaseMessage} from "./message.js";

/**
 * @class
 * @classdesc 基础提示数据类
 * @memberof module:modules
 * @alias DBaseTips
 */
export class DBaseTips {
  /**
   * 提示框宽度, 单位px
   * @type {?number}
   * @default 230
   */
  width;

  /**
   * 提示框高度, 单位px
   * @type {?number}
   * @default 100
   */
  height;

  /**
   * 调整提示框位于舞台中的x轴方向偏移量
   * @type {?number}
   * @default 0
   */
  offsetX;

  /**
   * 调整提示框位于舞台中的y轴方向偏移量
   * @type {?number}
   * @default 0
   */
  offsetY;

  /**
   * 提示框持续时间, 单位ms
   * @type {?number}
   * @default 3000
   */
  duration;

  /**
   * 闲置状态循环播放消息的间隔时间, 单位ms
   * @type {?number}
   * @default 5000
   */
  interval;

  /**
   * 播放的消息内容, 需要是一个字符串数组, 播放时会从中随机取出一条进行提示, 空数组则不播放, 默认为空数组
   * @type {?DBaseMessage}
   * @default []
   */
  message;

  /**
   * 创建基础提示数据
   * @constructor
   * @param {?DBaseTips} options 基础提示数据
   */
  constructor(options = null) {
    this.width = options?.width ?? 230;
    this.height = options?.height ?? 100;
    this.offsetX = options?.offsetX ?? 0;
    this.offsetY = options?.offsetY ?? 0;
    this.duration = options?.duration ?? 3000;
    this.interval = options?.interval ?? 5000;
    this.message = options?.message ?? [];
  }
}
