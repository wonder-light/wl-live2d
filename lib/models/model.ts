import type { TPosition } from '../types';
import { FHelp } from '../utils';

/**
 * 指示如何预加载动作
 */
export enum EMotion {
  /** 预加载所有动作 */
  ALL = 'ALL',
  /** 只预加载空闲运动 */
  IDLE = 'IDLE',
  /** 没有预加载 */
  NONE = 'NONE'
}

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
   * @example
   * // 绝对路径
   * https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2/yiselin/model.json
   *
   * // 相对路径
   * // 假设你的主机URL为https://fastly.jsdelivr.net, 那么相对路径如下
   * /gh/Eikanya/Live2d-model/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2/yiselin/model.json
   */
  public path: string;

  /**
   * 模型音量, 用于控制播发音频时的音量大小
   * @summary 模型音量
   * @type {?number}
   * @default 0.5
   */
  public volume: number | null;

  /**
   * 模型的缩放比例
   * @summary 模型缩放
   * @type {?number}
   * @default 1
   */
  public scale: number | null;

  /**
   * 模型的旋转角度
   * @summary 模型旋转
   * @type {?number}
   * @default 0
   */
  public rotate: number | null;

  /**
   * 模型在舞台中的位置. x: 横坐标, y: 纵坐标
   * @summary 模型位置
   * @type {?TPosition}
   * @default {x: 0, y: 0}
   */
  public position: TPosition | null;

  /**
   * 舞台的背景颜色, 取有效的颜色值, rbg 或 rgba, 默认透明未设置默认为空的
   * @summary 模型背景颜色
   * @type {?string}
   * @default 'transparent'
   */
  public backgroundColor: string | null;

  /**
   * 模型的宽度, 单位 px, 默认不设置, 将自适应使用模型本体的宽度
   * @summary 模型宽度
   * @type {?number}
   * @default null
   */
  public width: number | null;

  /**
   * 模型的高度, 单位 px, 默认不设置, 将自适应使用模型本体的高度
   * @summary 模型高度
   * @type {?number}
   * @default null
   */
  public height: number | null;

  /**
   * 指示如何预加载动作
   * @summary motion 预加载
   * @type {?EMotion}
   * @default EMotion.NONE
   */
  public motionPreload: EMotion | null;

  /**
   * 创建模型数据实例
   * @summary 模型数据构造
   * @hideconstructor
   * @param {?DModel} [data=null] 模型数据
   */
  public constructor(data: DModel | null = null) {
    FHelp.mixinProperty(this, data);
    this.path = data?.path ?? '';
    this.volume = data?.volume ?? 0.5;
    this.scale = data?.scale ?? 1;
    this.rotate = data?.rotate ?? 0;
    this.position = data?.position ?? { x: 0, y: 0 };
    this.backgroundColor = data?.backgroundColor ?? 'transparent';
    this.width = data?.width ?? null;
    this.height = data?.height ?? null;
    this.motionPreload = data?.motionPreload ?? EMotion.NONE;
  }
}
