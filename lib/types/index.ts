import type { Live2DModel } from 'pixi-live2d-display';
import type { Application } from 'pixi.js';
import type { ULive2dController } from '../controller';
import type { DLive2dOptions, DModel } from '../models';

/**
 * 构造函数
 */
export declare type TConstructor<T = any> = new (...args: any) => T;

/**
 * 获取构造函数类型的返回类型
 */
export declare type TInstanceType<T = any> = InstanceType<TConstructor<T>>;

/**
 * 单个参数的函数类型
 * @summary 单参函数
 * @template T 参数类型
 * @template K 返回值类型
 * @param {T} param 参数
 * @return {K} 返回值
 */
export declare type TFunc<T = void, K = void> = (param: T) => K;

/**
 * 3个参数的函数类型
 * @summary 3参函数
 * @template T 参数的类型
 * @template K 返回值类型
 * @param {T} arg 参数1
 * @return {K} 返回值
 */
export declare type TAnyFunc<T = any, K = void> = (...arg: T[]) => K;

/**
 * 分组函数, 根据参数 param 返回一个对应的关键值
 * @summary 有参回调
 * @template T 参数类型
 * @template K 返回值类型
 * @param {T} param 参数
 * @return {K} 返回值
 */
export declare type TGroupFun<T, K extends keyof any> = TFunc<T, K>;

/**
 * 没有参数且返回值为 void 的无参回调
 * @summary 无参回调
 * @return {void}
 * @example
 * () => void
 */
export declare type TCallback = () => void;

/**
 * 返回值是 bool 的回调函数
 * @summary bool 回调
 * @return {boolean}
 * @example
 * () => true;
 * () => false;
 */
export declare type TBoolCallback = () => boolean;


/**
 * pixi-live2d-display 的 Live2DModel 类型
 * @summary Live2D 模型
 * @see 更多请参考 [Live2DModel](https://guansss.github.io/pixi-live2d-display/api/classes/index.Live2DModel.html)
 */
export declare type TLive2DModel = Live2DModel;

/**
 * pixi 的 Application 类型
 * @summary Application 类型
 * @see 更多请参考 [Application](https://api.pixijs.io/@pixi/app/PIXI/Application.html)
 */
export declare type TApplication = Application;

/**
 * 传递 options 数据, 并创建 live2d 实例的的全局函数
 * @summary live2d 全局函数
 * @param {DLive2dOptions | null} [options=null] live2d 选项
 * @return {ULive2dController} 返回 ULive2d 的一个实例
 * @global
 * @instance
 * @function
 * @see [create]{@link ULive2dController.create}
 */
export declare type TLive2dCreate = (options: DLive2dOptions | null) => ULive2dController;

/**
 * 模型数据项目可以为 DModel 或者 DModel[]
 *
 * TModelItem 为对象时则为模型
 *
 * TModelItem 为数组时指该模型有一系列皮肤
 * @summary 模型项目
 * @example
 * new DModel || [new DModel]
 */
export declare type TModelItem = DModel | DModel[];

/**
 * 由模型数据项目构成的模型数据集
 * @summary 数据集
 * @example
 * [
 *    // 使用不同的模型
 *    new DModel,
 *    new DModel,
 *    new DModel,
 *   [ // 同一个模型的不同服装
 *      new DModel,
 *      new DModel,
 *      new DModel,
 *   ],
 * ]
 */
export declare type TModels = TModelItem[];

/**
 * 用于将 response 响应处理为 message 文本
 * @summary talk 处理函数
 * @param {Response} response 响应
 * @return {Promise<string>} 文本结果
 */
export declare type TTalkHandle = (response: Response) => Promise<string>;

/**
 * 定义高度与宽度的属性集
 * @summary 矩形盒子
 * @example
 * { width: 0, height: 0 }
 */
export declare interface TRect {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
}

/**
 * 包含 x, y 的位置数据
 * @summary 位置
 * @example
 * {}
 * {x: 10}
 * {x: 10, y: 10}
 */
export declare interface TPosition {
  /** x 坐标 */
  x: number | null;
  /** y 坐标 */
  y: number | null;
}

/**
 * 用于存储 url 以及处理 talk 结果的对象
 * @summary talk 对象
 * @example
 * // 数据
 * const api = {
 *   url: 'https://v1.hitokoto.cn/',
 *   handle: async (res) => (await res.json()).hitokoto
 * }
 *
 * // 处理
 * const response = await fetch(api.url, api.init);
 * const text = await api.handle(response);
 */
export declare interface TTalkApi {
  /** url 地址 */
  url: string;
  /** handle 处理函数 */
  handle: TTalkHandle;
  /** init fetch 初始化数据 */
  init?: RequestInit;
}

/**
 * 由元素及其优先级构成的菜单元素项目
 * @summary 菜单元素项目
 */
export declare interface TStageMenuItem {
  /** 菜单元素 */
  element: HTMLElement;
  /** 元素优先级 */
  priority: number;
}



export { MotionPreloadStrategy as TMotionPreload } from 'pixi-live2d-display';

// /**
//  * 没有参数且返回值为 void 的无参回调
//  * @summary 无参回调
//  * @callback TCallback
//  * @return {void}
//  * @global
//  * @example
//  * () => void
//  */
// /**
//  * 返回值是 bool 的回调函数
//  * @summary bool 回调
//  * @callback TBoolCallback
//  * @return {boolean}
//  * @global
//  * @example
//  * () => true;
//  * () => false;
//  */
// /**
//  * 包含 x, y 的位置数据
//  * @summary 位置
//  * @typedef {Object} TPosition
//  * @property {?number} x x 轴坐标
//  * @property {?number} y y 轴坐标
//  * @global
//  * @example
//  * {}
//  * {x: 10}
//  * {x: 10, y: 10}
//  */
// /**
//  * 模型数据项目可以为 DModel 或者 DModel[]
//  *
//  * DModel 指模型, 用于切换模型按钮
//  *
//  * DModel[] 指同一模型的不同服饰, 用于切换服装按钮
//  * @summary 模型项目
//  * @typedef {DModel | Array<DModel>} TModelItem
//  * @global
//  * @example
//  * new DModel || [new DModel]
//  */
// /**
//  * 由模型数据项目构成的模型数据集
//  * @summary 数据集
//  * @typedef {Array<TModelItem>} TModels
//  * @global
//  * @example
//  * [
//  *    // 使用不同的模型
//  *    new DModel,
//  *    new DModel,
//  *    new DModel,
//  *   [ // 同一个模型的不同服装
//  *      new DModel,
//  *      new DModel,
//  *      new DModel,
//  *   ],
//  * ]
//  */
// /**
//  * 用于将 response 响应处理为 message 文本
//  * @summary talk 处理函数
//  * @callback TTalkHandle
//  * @param {Response} response 响应
//  * @return {Promise<string>} 文本结果
//  * @global
//  */
// /**
//  * 用于存储 url 以及处理 talk 结果的对象
//  * @summary talk 对象
//  * @typedef {Object} TTalkApi
//  * @property {string} url 地址
//  * @property {TTalkHandle} handle 处理函数
//  * @property {RequestInit | undefined} init fetch 初始化数据
//  * @global
//  * @example
//  * // 数据
//  * const api = {
//  *   url: 'https://v1.hitokoto.cn/',
//  *   handle: async (res) => (await res.json()).hitokoto
//  * }
//  *
//  * // 处理
//  * const response = await fetch(api.url, api.init);
//  * const text = await api.handle(response);
//  */
// /**
//  * DMessage 的扩展类型, 包括但不限于 DHourMessage, DSeasonsMessage, DEventMessage
//  * @summary 消息扩展类型
//  * @typedef {DMessage | DHourMessage | DSeasonsMessage | DEventMessage} DMessageExtend
//  * @global
//  */
// /**
//  * 由元素及其优先级构成的菜单元素项目
//  * @summary 菜单元素项目
//  * @typedef {Object} UStageController~TMenuItem
//  * @property {HTMLElement} element 菜单元素
//  * @property {number} priority 元素优先级
//  */
