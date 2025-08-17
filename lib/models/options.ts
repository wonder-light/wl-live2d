import type { FBasePlugin } from '../plugins';
import type { TModels } from '../types';
import { FHelp } from '../utils';
import type { DTips } from './tips';

/**
 * @class
 * @summary Live2d 数据类
 * @classdesc Live2d 数据集合, 用于存储 live2d 对应的数据
 * @memberof module:modules
 * @alias DLive2dOptions
 */
export class DLive2dOptions {
  /**
   * 是否在初始化阶段打印项目信息
   * @summary 打印项目信息
   * @type {?boolean}
   * @default true
   */
  public sayHello: boolean | null;

  /**
   * 元素入场和离开的过渡动画时长,单位 ms
   * @summary 过渡动画时长
   * @type {?number}
   * @default 500
   */
  public transitionTime: number | null;

  /**
   * 模型配置, 默认值是空数组, 请至少配置一个有效的模型配置
   *
   * path 可以使用相对于主机 URL 的相对地址, 也可以使用绝对 URL 地址
   *
   * 前往{@link DModel}模型选项查看详细内容
   *
   * @summary 模型配置
   * @type {?TModels}
   * @default []
   * @see TModels
   * @example
   * [ // 用于切换不同模型
   *   {
   *     "path": "https://.../model1.json",
   *     "scale": 0.5
   *   },
   *   {
   *     "path": "https://.../model2.json",
   *     "scale": 0.5
   *   },
   *   [ // 用于模型的服装切换
   *     {
   *       "path": "https://.../model/texture1.json",
   *       "scale": 0.5
   *     },
   *     {
   *       "path": "https://.../model/texture2.json",
   *       "scale": 0.5
   *     },
   *   ]
   * ]
   */
  public models: TModels | null;

  /**
   * 自定义提示框样式和内容, 前往 {@link DTips} 提示框选项查看详细内容
   * @summary 消息提示配置
   * @type {?DTips}
   * @default null
   * @see DTips
   * @example
   * {
   *   drag: true,
   *   duration: 3000,
   *   interval: 1000,
   *   motionMessage: true,
   *   offsetX: 0,
   *   offsetY: 0,
   *   message: [],
   * }
   */
  public tips: DTips | null;

  /**
   * 默认你启用的菜单项
   * @summary 菜单项
   * @type {?(string[])}
   * @default ['home', 'switchTexture', 'switchModule', 'capture', 'info', 'quit']
   * @example
   * [
   *   'home', 'switchTexture', 'switchModule',
   *   'capture', 'info', 'quit'
   * ]
   */
  public menus: string[] | null;

  /**
   * 父元素的选择器, 支持 css 选择器语法, 以及 xpath 语法. 默认父元素为 {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body document.body}
   *
   * 如果父元素有效, 则会将 Live2d 插入到父元素之下
   * @summary 父元素选择器
   * @type {?string}
   * @default ''
   * @example
   * '#id'           // => document.querySelector('#id');
   * '//*[@id="id"]' // => document.evaluate('//*[@id="id"]', document).iterateNext();
   */
  public selector: string | null;

  /**
   * 组件是否使用固定定位
   * > 注意, 关闭这个属性后舞台的定位属性将从 fixed 改为 relative, 使舞台回到文档流,
   * >
   * > 另外该属性不影响状态条定位属性, 状态条与舞台之间相互独立,样式互不干扰.
   * @summary 组件固定定位
   * @type {?boolean}
   * @default true
   */
  public fixed: boolean | null;

  /**
   * 需要使用的插件集,
   *
   * 可以添加自定义插件用于实现自定义的功能
   * @summary 插件
   * @type {?(FBasePlugin[])}
   * @default []
   */
  public plugins: FBasePlugin[] | null;

  /**
   * 如果是 true, 则启用 wrapper 元素的拖拽, 否则不启用拖拽
   * @summary 启用拖拽
   * @type {?boolean}
   * @default true
   */
  public drag: boolean | null;

  /**
   * {@link FHomePlugin} 所使用的 URL 地址, 点击后将会跳转到该地址
   *
   * 如果已 `http://` 开头, 则会跳转对应地址, 否则将会追加至 `window.location.origin` 后跳转到对应地址
   * @summary url 路径
   * @type {?string}
   * @default ''
   * @example
   * let url = 'https://localhost/live2d';
   * // origin   => https://localhost
   * // homePath => /live2d
   */
  public homePath: string | null;

  /**
   * 启用命中区域帧检测
   * @summary 帧检测
   * @type {?boolean}
   * @default false
   */
  public hitFrame: boolean | null;

  /**
   * 创建 live2d 数据实例
   * @summary Live2d 数据构造
   * @hideconstructor
   * @param {DLive2dOptions | null} [data=null] live2d 数据
   */
  public constructor(data: DLive2dOptions | null = null) {
    FHelp.mixinProperty(this, data);
    this.sayHello = data?.sayHello ?? true;
    this.transitionTime = data?.transitionTime ?? 500;
    this.models = data?.models ?? [];
    this.tips = data?.tips ?? null;
    this.menus = data?.menus ?? ['home', 'switchModule', 'switchTexture', 'capture', 'info', 'quit'];
    this.selector = data?.selector ?? '';
    this.fixed = data?.fixed ?? true;
    this.plugins = data?.plugins ?? [];
    this.drag = data?.drag ?? true;
    this.homePath = data?.homePath ?? '';
    this.hitFrame = data?.hitFrame ?? false;
  }
}
