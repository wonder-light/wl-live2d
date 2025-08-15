import { Live2DModel } from 'pixi-live2d-display-advanced';
import { ULive2dController } from './controller';
import type { TLive2dCreate } from './types';

window.ILive2DModel = Live2DModel;
const wlLive2d: TLive2dCreate = ULive2dController.create;
window.wlLive2d = wlLive2d;

export default wlLive2d;
export { wlLive2d };
export * from './plugins';
export * from './models';
