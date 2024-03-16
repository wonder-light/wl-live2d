import { FHelp } from '../utils/index.js';

/**
 * @class
 * @classdesc Live2d基本数据类
 * @memberof module:modules
 * @alias DBaseLive2dOptions
 */
export class DBaseLive2dOptions {
  /**
   * 是否在初始化阶段打印项目信息
   * @type {?boolean}
   * @default true
   */
  sayHello;

  /**
   * 模型入场和离开的过渡动画时长,单位ms
   * @type {?number}
   * @default 500
   */
  transitionTime;

  /**
   * 模型配置, 默认值是空数组, 请至少配置一个有效的模型配置
   *
   * 前往{@link TBaseModel}模型选项查看详细内容
   * @type {?TBaseModel[]}
   * @see TBaseModel
   * @default null
   */
  models;

  /**
   * 自定义提示框样式和内容, 前往{@link DBaseTips}提示框选项查看详细内容
   * @type {?DBaseTips}
   * @see DBaseTips
   * @default null
   */
  tips;

  /**
   * 默认你启用的菜单项
   * @type {?(string[])}
   * @default ['switchTexture','switchModule','capture','info','quit']
   */
  menus;

  /**
   * 父元素的选择器, 支持 css 选择器语法, 以及 xpath 语法. 默认父元素为 {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body document.body}
   *
   * @example
   * document.querySelector('#id');
   * document.evaluate('//*[@id="id"]', document).iterateNext();
   *
   * @type {?string}
   * @default ''
   */
  selector;

  /**
   * 组件是否使用固定定位
   * > [!WARNING]
   * > 注意, 关闭这个属性后舞台的定位属性将从 fixed 改为 relative, 使舞台回到文档流, 另外该属性不影响状态条定位属性, 状态条与舞台之间相互独立,样式互不干扰.
   * @type {?boolean}
   * @default true
   */
  fixed;

  /**
   * 插件
   * @type {FBasePlugin[]}
   */
  plugins;

  /**
   * 启用拖拽
   * @type {boolean}
   * @default true
   */
  drag;

  /**
   * 创建 live2d 基本数据
   * @constructor
   * @param {?DBaseLive2dOptions} [data=null] live2d 基本数据
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
