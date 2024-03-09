import '../package/live2d.min.js';
import '../package/live2dcubismcore.min.js';
import { InternalModel, Live2DModel } from 'pixi-live2d-display';
import * as PIXI from 'pixi.js';
import { ULive2dController } from './controller/index.js';
import './css/index.css';

window.PIXI = PIXI;
PIXI.utils.skipHello();
// PIXI.settings.RENDER_OPTIONS.hello = false; 7.0.0 以上版本使用

window.ILive2DModel = Live2DModel;

/**
 * live2d 模型类型
 * @typedef {Live2DModel<InternalModel>} TLive2DModel
 * @global
 */

/**
 * live2d 模型类型
 * @typedef {Application} TApplication
 * @global
 */

/**
 * live2d 的全局变量
 * @global
 * @readonly
 * @instance
 * @type {ULive2dController.create}
 * @see [create]{@link ULive2dController.create}
 */
const wlLive2d = ULive2dController.create;
window.wlLive2d = wlLive2d;

export { wlLive2d };
export default wlLive2d;
