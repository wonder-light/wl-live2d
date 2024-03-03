import './api/live2dcubismcore4.js';
import './api/live2dcubismcore2.js';
import * as PIXI from 'pixi.js';
import { UOptionsController } from './controller/index.js';
import './css/index.css';

window.PIXI = PIXI;

PIXI.settings.RENDER_OPTIONS.hello = false;

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
