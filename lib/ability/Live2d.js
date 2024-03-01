import {DBaseLive2dOptions} from "../models/options.js";
import {Application} from 'pixi.js';

/**
 * @class
 * @classdesc live2d配置类
 * @implements {IBaseLive2d}
 */
export class ULive2d extends IBaseLive2d {
  /**
   * Live2d基本配置选项
   * @private
   * @type {?DBaseLive2dOptions}
   * @default null
   */
  #options;

  /**
   * PIXI app 实例
   * @private
   * @type {Application}
   */
  #app;

  /**
   * 创建live2d配置
   * @param {DBaseLive2dOptions} options live2d选项
   * @hideconstructor
   */
  constructor(options) {
    super();
    this.#options = options;
    this.#app = new Application({
      view: document.getElementById('canvas'),
    })
  }

  /**
   * @inheritdoc
   */
  static create(options) {
    return new ULive2d(options ?? new DBaseLive2dOptions());
  }

  /**
   * @inheritdoc
   */
  async loadModel() {

  }
}
