import { EventEmitter } from 'eventemitter3';
import { EEvent, FHelp } from '../utils/index.js';

/**
 * @class
 * @classdesc 基础控制器
 * @abstract
 * @memberof module:controller
 * @alias UBaseController
 */
export class UBaseController {
  /**
   * live2d数据选项控制器
   * @protected
   * @type {ULive2dController}
   */
  _live2d;

  /**
   * 创建基础控制器
   * @param {ULive2dController} live2d live2d选项数据控制器
   * @listens EEvent#init
   * @listens EEvent#destroy
   */
  constructor(live2d) {
    if (FHelp.isNotValid(live2d)) {
      throw Error('live2d is not valid');
    }
    this._live2d = live2d;
    this._live2d.event.once(EEvent.init, this.init, this);
    this._live2d.event.once(EEvent.destroy, this.destroy, this);
  }

  /**
   * 返回数据选项控制器
   * @return {ULive2dController}
   */
  get live2d() {
    return this._live2d;
  }

  /**
   * 返回live2d数据选项
   * @return {DBaseLive2dOptions}
   */
  get live2dData() {
    return this._live2d.data;
  }

  /**
   * 返回 EventEmitter3 实例
   * @return {TApplication}
   */
  get app() {
    return this._live2d.app;
  }

  /**
   * 返回 EventEmitter3 实例
   * @return {EventEmitter}
   */
  get event() {
    return this._live2d.event;
  }

  /**
   * 获取引用
   * @return {Record<string, any>}
   */
  get ref() {
    return this._live2d.ref;
  }

  /**
   * 控制器初始化
   * @abstract
   */
  init() {}

  /**
   * 销毁控制器
   * @abstract
   */
  destroy() {
    this.event.removeListener(EEvent.init, this.destroy, this);
    this.event.removeListener(EEvent.destroy, this.destroy, this);
  }
}
