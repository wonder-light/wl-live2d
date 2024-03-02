import * as PIXI from 'pixi.js';
import * as utils from '@pixi/utils';
import {ULive2d} from "./controller/Live2d.js";
import "./css/index.css"

window.PIXI = PIXI;

utils.skipHello();

/**
 * live2d 的全局变量
 * @global
 * @readonly
 * @instance
 * @type {ULive2d.create}
 * @see [ULive2d.create]{@link ULive2d.create}
 */
export const wlLive2d = ULive2d.create;
export default wlLive2d;
