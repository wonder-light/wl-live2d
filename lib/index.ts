import '../packages/live2dcubism2core.min.js';
import '../packages/live2dcubism4core.min.js';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display-advanced';
import { ULive2dController } from './controller';
import type { TLive2dCreate } from './types';
import './css/index.css';

// PIXI.settings.RENDER_OPTIONS.hello = false; 7.0.0 以上版本使用
window.PIXI = PIXI;
window.ILive2DModel = Live2DModel;

const wlLive2d: TLive2dCreate = ULive2dController.create;
window.wlLive2d = wlLive2d;

export default wlLive2d;
export { wlLive2d };
export * from './plugins';
export * from './models';
