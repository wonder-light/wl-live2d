import '../packages/live2dcubism4core.min.js';
import '../packages/live2dcubism2core.min.js';
import { Live2DModel } from 'pixi-live2d-display';
import { Ticker, utils } from 'pixi.js';
import { ULive2dController } from './controller';
import type { TLive2dCreate } from './types';
import './css/index.css';

utils.skipHello();
Live2DModel.registerTicker(Ticker);
const wlLive2d: TLive2dCreate = ULive2dController.create;
window.wlLive2d = wlLive2d;
window.ILive2DModel = Live2DModel;

export default wlLive2d;
export { wlLive2d };
export * from './plugins';
export * from './models';
