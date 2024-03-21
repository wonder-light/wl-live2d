import { FHelp } from '../utils/index.js';

/**
 * @class
 * @summary 模型数据类
 * @classdesc 模型数据集合, 用于存储模型数据
 * @memberof module:modules
 * @alias DModel
 */
export class DModel {
  /**
   * 模型的 json 文件的 url 地址, 可以是相对路径, 必填项.
   * @summary url 地址
   * @type {string}
   * @default ''
   */
  path;

  /**
   * 模型音量, 用于控制播发音频时的音量大小
   * @summary 模型音量
   * @type {?number}
   * @default 0.5
   */
  volume;

  /**
   * 模型的缩放比例
   * @summary 模型缩放
   * @type {?number}
   * @default 1
   */
  scale;

  /**
   * 模型在舞台中的位置. x: 横坐标, y: 纵坐标
   * @summary 模型位置
   * @type {?TPosition}
   * @default {x: 0, y: 0}
   */
  position;

  /**
   * 舞台的背景颜色, 取有效的颜色值, rbg 或 rgba, 默认透明未设置默认为空的
   * @summary 模型背景颜色
   * @type {?string}
   * @default 'transparent'
   */
  backgroundColor;

  /**
   * 模型的宽度, 单位 px, 默认不设置, 将自适应使用模型本体的宽度
   * @summary 模型宽度
   * @type {?number}
   * @default null
   */
  width;

  /**
   * 模型的高度, 单位 px, 默认不设置, 将自适应使用模型本体的高度
   * @summary 模型高度
   * @type {?number}
   * @default null
   */
  height;

  /**
   * 创建模型数据实例
   * @summary 模型数据构造
   * @constructor
   * @param {DModel | null} [data=null] 模型数据
   */
  constructor(data = null) {
    FHelp.mixinProperty(this, data);
    this.path = data?.path ?? '';
    this.scale = data?.scale ?? 1;
    this.position = data?.position ?? { x: 0, y: 0 };
    this.backgroundColor = data?.backgroundColor ?? 'transparent';
    this.width = data?.width;
    this.height = data?.height;
  }
}
