import {DBaseLive2dOptions, DLive2dOptions} from "../models/options.js";
import {IBaseLive2d} from "../interface/live2d.js";
import {Application} from 'pixi.js';
import {UBaseModelController, UBaseStageController} from "./index.js";
import {FLogger} from "../utils/index.js";
import defaultOptions from "../config/options.json";

/**
 * @class
 * @classdesc live2d配置类
 * @implements {IBaseLive2d}
 */
export class ULive2d extends IBaseLive2d {
  /**
   * Live2d基本配置选项
   * @private
   * @type {?DLive2dOptions}
   * @default null
   */
  #options;

  /**
   * 创建live2d配置
   * @param {DBaseLive2dOptions} options live2d选项
   * @hideconstructor
   */
  constructor(options) {
    super();
    const stageController = new UBaseStageController(options.selector);
    const modelController = new UBaseModelController();
    const app = new Application({
      view: stageController.canvas,
      transparent: true,
      backgroundAlpha: 0,
      resolution: 2,
      autoStart: true,
      autoDensity: true,
      resizeTo: stageController.wrapper,
    });
    this.#options = new DLive2dOptions({
      ...options,
      stageController,
      modelController,
      app,
      plugins: [],
    });
    this.init();
  }


  /**
   * 创建 ULive2d 的一个实例
   * @param {?DBaseLive2dOptions} options live2d选项
   * @return {ULive2d} 返回 ULive2d 的一个实例
   * @static
   */
  static create(options) {
    return new ULive2d(options ?? new DBaseLive2dOptions(defaultOptions));
  }


  /**
   * @inheritdoc
   * @override
   */
  init() {
    /**
     * @type {module:modules.DLive2dOptions}
     */
    let options = this.#options;
    // say
    options.sayHello && FLogger.log('🎉🎉🎉 ✨ wl-live2d v1.0.0 - 欢迎你使用 !! ✨ 🎉🎉🎉');
    // 舞台初始化
    options.stageController.init(options);
    // 加载模型与元素
    options.modelController
      .init(options)
      .onLoad((data) => {
        options.stageController.setCanvasWidth(data)
        // 加载插件
        for (const plugin of options.plugins) {
          plugin.install({});
        }
        // 当包装器元素的宽度与高度被设置后，调整一次模型的大小
        this.#options.app.resize();
        // 舞台淡入
        options.stageController.fadeIn();
      })
      .onError((e) => {
        options.stageController.hiddenWrapper();
      });
  }
}
