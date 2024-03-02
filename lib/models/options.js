import {DBaseModel} from "./model.js";
import {DBaseTips} from "./tips.js";
import {IBaseTool} from "../interface/tool.js";
import {Application} from 'pixi.js';
import {IBasePlugin} from "../interface/index.js";
import {UBaseModelController, UBaseStageController} from "../controller/index.js";


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
   * 组件入场和离开的过渡动画时长,单位ms
   * @type {?number}
   * @default 500
   */
  transitionTime;

  /**
   * 模型配置, 默认值是空数组, 请至少配置一个有效的模型配置
   *
   * 前往{@link DBaseModel}模型选项查看详细内容
   * @type {?DBaseModel[]}
   * @see DBaseModel
   * @default []
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
   * 自定义菜单工具, 前往{@link IBaseTool}同居项选项查看详细内容
   * @type {?IBaseTool}
   * @see IBaseTool
   * @default null
   * @todo 将menu与tool及plugin关联起来
   */
  tools;

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
   * 创建 live2d 基本数据
   * @constructor
   * @param {?DBaseLive2dOptions} options live2d 基本数据
   */
  constructor(options = null) {
    this.sayHello = options?.sayHello ?? true;
    this.transitionTime = options?.transitionTime ?? 1000;
    this.models = options?.models ?? [];
    this.tips = options?.tips;
    this.tools = options?.tools;
    this.selector = options?.selector ?? '';
    this.fixed = options?.fixed ?? true;
  }
}

/**
 * @class
 * @classdesc Live2d数据类
 * @memberof module:modules
 * @alias DLive2dOptions
 */
export class DLive2dOptions extends DBaseLive2dOptions {
  /**
   * PIXI app 实例
   * @type {Application}
   */
  app;

  /**
   * 插件
   * @type {IBasePlugin[]}
   */
  plugins;

  /**
   * 舞台控制器
   * @type {UBaseStageController}
   */
  stageController;

  /**
   * 模型控制器
   * @type {UBaseModelController}
   */
  modelController;

  /**
   * 创建 live2d 数据
   * @constructor
   * @param {module:modules.DLive2dOptions} options live2d数据
   */
  constructor(options) {
    super(options);
    this.app = options.app;
    this.plugins = options.plugins;
    this.stageController = options.stageController;
    this.modelController = options.modelController;
  }
}
