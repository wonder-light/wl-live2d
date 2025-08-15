declare module 'pixi-live2d-display-advanced/*' {
  import { Live2DModel } from 'pixi-live2d-display-advanced';
  export { Live2DModel };
}


declare interface Window {
  PIXI: typeof import('pixi.js');
  ILive2DModel: typeof import('pixi-live2d-display-advanced').Live2DModel;
  wlLive2d: import('./index').TLive2dCreate;
}
