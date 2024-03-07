import '../package/live2d.min.js';
import { Live2DModel } from 'pixi-live2d-display/cubism4';
import * as PIXI from 'pixi.js';
import { ULive2dController } from './controller/index.js';
import './css/index.css';
import { FHelp } from './utils/index.js';

FHelp.fromSync = Live2DModel.fromSync.bind(Live2DModel);

window.PIXI = PIXI;
PIXI.utils.skipHello();

const wlLive2d = ULive2dController.create;
window.wlLive2d = wlLive2d;

export { wlLive2d };
export default wlLive2d;
