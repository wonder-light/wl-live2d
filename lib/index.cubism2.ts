import '../packages/live2dcubism2core.min.js';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display-advanced/cubism2';
import { ULive2dController } from './controller';
import type { TLive2dCreate } from './types';
import './css/index.css';

window.PIXI = PIXI;
window.ILive2DModel = Live2DModel;

const wlLive2d: TLive2dCreate = ULive2dController.create;
window.wlLive2d = wlLive2d;

export default wlLive2d;
export { wlLive2d };
export * from './plugins';
export * from './models';
