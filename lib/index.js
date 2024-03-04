import '../package/live2d.min.js';
import '../package/live2dcubismcore.min.js';
import * as PIXI from 'pixi.js';
import { UOptionsController } from './controller/index.js';
import './css/index.css';

window.PIXI = PIXI;

PIXI.utils.skipHello();
// PIXI.settings.RENDER_OPTIONS.hello = false; 7.0.0 以上版本使用

/**
 * live2d 的全局变量
 * @global
 * @readonly
 * @instance
 * @type {UOptionsController.create}
 * @see [create]{@link UOptionsController.create}
 */
export const wlLive2d = UOptionsController.create;
export default wlLive2d;
