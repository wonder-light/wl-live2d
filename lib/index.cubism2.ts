import '../packages/live2dcubism2core.min.js';
import { Live2DModel } from 'pixi-live2d-display-advanced/cubism2';
import { ULive2dController } from './controller';
import type { TLive2dCreate } from './types';
import './css/index.css';

const wlLive2d: TLive2dCreate = ULive2dController.create;
window.wlLive2d = wlLive2d;
window.ILive2DModel = Live2DModel;

export default wlLive2d;
export { wlLive2d };
export * from './plugins';
export * from './models';
