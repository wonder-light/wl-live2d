import '../packages/live2dcubism2core.min.js';
import '../packages/live2dcubism4core.min.js';
import { Live2DModel } from 'pixi-live2d-display';
import * as PIXI from 'pixi.js';
import { ULive2dController } from './controller/index.js';
import './css/index.css';

window.PIXI = PIXI;
PIXI.utils.skipHello();
// PIXI.settings.RENDER_OPTIONS.hello = false; 7.0.0 以上版本使用

window.ILive2DModel = Live2DModel;

/**
 * pixi-live2d-display 的 Live2DModel 类型
 * @summary Live2D 模型
 * @typedef {Live2DModel} TLive2DModel
 * @global
 * @see 更多请参考 [Live2DModel](https://guansss.github.io/pixi-live2d-display/api/classes/index.Live2DModel.html)
 */

/**
 * pixi 的 Application 类型
 * @summary Application 类型
 * @typedef {Application} TApplication
 * @global
 * @see 更多请参考 [Application](https://api.pixijs.io/@pixi/app/PIXI/Application.html)
 */

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
const wlLive2d = ULive2dController.create;
window.wlLive2d = wlLive2d;

export { wlLive2d };
export default wlLive2d;
