import '../packages/live2dcubism2core.min.js';
import { Live2DModel } from 'pixi-live2d-display/cubism2';
import * as PIXI from 'pixi.js';
import { ULive2dController } from './controller/index.js';
import './css/index.css';

window.ILive2DModel = Live2DModel;

const wlLive2d = ULive2dController.create;
window.wlLive2d = wlLive2d;

window.PIXI = PIXI;
PIXI.utils.skipHello();

export { wlLive2d };
export default wlLive2d;
