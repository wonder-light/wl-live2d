import {DBaseModel} from "../models/model.js";

/**
 * @class
 * @classdesc > {@link DBaseModel} 的操作类
 */
export class UBaseModelController {
  /**
   * 基础模型数据
   * @private
   * @requires module:../models/model
   * @type {DBaseModel}
   */
  #data;

  /**
   * 创建基础模型控制器
   * @constructor
   * @param {?DBaseModel} data 基础模型数据
   */
  constructor(data = new DBaseModel()) {
    this.#data = data;
  }

  loadModel(){

  }
}
