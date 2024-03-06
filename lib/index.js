import '../package/live2d.min.js';
import '../package/live2dcubismcore.min.js';
import * as PIXI from 'pixi.js';
import { ULive2dController } from './controller/index.js';
import './css/index.css';

window.PIXI = PIXI;

PIXI.utils.skipHello();
// PIXI.settings.RENDER_OPTIONS.hello = false; 7.0.0 以上版本使用

/**
 * live2d 的全局变量
 * @global
 * @readonly
 * @instance
 * @type {ULive2dController.create}
 * @see [create]{@link ULive2dController.create}
 */
export const wlLive2d = ULive2dController.create;
export default wlLive2d;
