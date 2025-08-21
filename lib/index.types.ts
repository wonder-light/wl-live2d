import { ULive2dController } from './controller';
import type { TLive2dCreate } from './types';

const wlLive2d: TLive2dCreate = ULive2dController.create;

export default wlLive2d;
export { wlLive2d };
export * from './plugins';
export * from './models';
