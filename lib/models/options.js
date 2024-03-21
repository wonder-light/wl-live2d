import { FHelp } from '../utils/index.js';

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
  sayHello;

  /**
   * 模型入场和离开的过渡动画时长,单位 ms
   * @summary 过渡动画时长
   * @type {?number}
   * @default 500
   */
  transitionTime;

  /**
   * 模型配置, 默认值是空数组, 请至少配置一个有效的模型配置
   *
   * 前往{@link TModels}模型选项查看详细内容
   *
   * @summary 模型配置
   * @type {?(TModels[])}
   * @default []
   * @see TModels
   */
  models;

  /**
   * 自定义提示框样式和内容, 前往 {@link DTips} 提示框选项查看详细内容
   * @summary 消息提示配置
   * @type {?DTips}
   * @default null
   * @see DTips
   */
  tips;

  /**
   * 默认你启用的菜单项
   * @summary 菜单项
   * @type {?(string[])}
   * @default ['switchTexture', 'switchModule', 'capture', 'info', 'quit']
   * @example
   * ['switchTexture', 'switchModule', 'capture', 'info', 'quit']
   */
  menus;

  /**
   * 父元素的选择器, 支持 css 选择器语法, 以及 xpath 语法. 默认父元素为 {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body document.body}
   * @summary 父元素选择器
   * @type {?string}
   * @default ''
   * @example
   * '#id'           // => document.querySelector('#id');
   * '//*[@id="id"]' // => document.evaluate('//*[@id="id"]', document).iterateNext();
   */
  selector;

  /**
   * 组件是否使用固定定位
   * > 注意, 关闭这个属性后舞台的定位属性将从 fixed 改为 relative, 使舞台回到文档流, 另外该属性不影响状态条定位属性, 状态条与舞台之间相互独立,样式互不干扰.
   * @summary 组件固定定位
   * @type {?boolean}
   * @default true
   */
  fixed;

  /**
   * 需要使用的插件集
   * @summary 插件
   * @type {?(FBasePlugin[])}
   * @default []
   */
  plugins;

  /**
   * 如果是 true, 则启用 wrapper 元素的拖拽, 否则不启用拖拽
   * @summary 启用拖拽
   * @type {?boolean}
   * @default true
   */
  drag;

  /**
   * 创建 live2d 数据实例
   * @summary Live2d 数据构造
   * @constructor
   * @param {DLive2dOptions | null} [data=null] live2d 数据
   */
  constructor(data = null) {
    FHelp.mixinProperty(this, data);
    this.sayHello = data?.sayHello ?? true;
    this.transitionTime = data?.transitionTime ?? 500;
    this.models = data?.models ?? [];
    this.tips = data?.tips;
    this.menus = data?.menus ?? ['switchTexture', 'switchModule', 'capture', 'info', 'quit'];
    this.selector = data?.selector ?? '';
    this.fixed = data?.fixed ?? true;
    this.plugins = data?.plugins ?? [];
    this.drag = data?.drag ?? true;
  }
}
