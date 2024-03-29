import { EventEmitter } from 'eventemitter3';
import { EEvent, FHelp } from '../utils/index.js';

/**
 * @class
 * @summary 基础控制器
 * @classdesc 基础控制器, 用于对数据的操作等等, 该类时抽象类, 不可实例化
 * @abstract
 * @memberof module:controller
 * @alias UBaseController
 */
export class UBaseController {
  /**
   * live2d 数据选项控制器
   * @summary live2d 上下文
   * @protected
   * @type {ULive2dController}
   */
  _live2d;

  /**
   * 创建基础控制器
   * @summary 基础控制器构造
   * @param {ULive2dController} live2d live2d 上下文
   * @listens EEvent#init 控制器初始化事件
   * @listens EEvent#destroy 控制器销毁事件
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
   * getter: live2d 上下文
   * @summary live2d 上下文
   * @type {ULive2dController}
   * @readonly
   */
  get live2d() {
    return this._live2d;
  }

  /**
   * getter:  live2d 原始数据
   * @summary live2d 数据
   * @type {DLive2dOptions}
   * @readonly
   */
  get live2dData() {
    return this._live2d.data;
  }

  /**
   * getter:  Application 实例
   * @summary Application 实例
   * @type {TApplication}
   * @readonly
   */
  get app() {
    return this._live2d.app;
  }

  /**
   * getter:  EventEmitter3 实例
   * @summary event 实例
   * @type {EventEmitter}
   * @readonly
   */
  get event() {
    return this._live2d.event;
  }

  /**
   * getter: 以键值对进行记录的对象引用
   * @summary 对象引用
   * @type {Record<string, any>}
   * @readonly
   */
  get ref() {
    return this._live2d.ref;
  }

  /**
   * 在 [event]{@link ULive2dController#event} 提交 [EEvent#init]{@link EEvent#event:init} 时进行调用, 用于控制器初始化
   * @summary 控制器初始化
   * @abstract
   */
  init() {}

  /**
   * 在 [event]{@link ULive2dController#event} 提交 [EEvent#destroy]{@link EEvent#event:destroy} 时进行调用, 用于销毁控制器
   * @summary 销毁控制器
   * @abstract
   */
  destroy() {
    this.event.removeListener(EEvent.init, this.destroy, this);
    this.event.removeListener(EEvent.destroy, this.destroy, this);
  }
}
