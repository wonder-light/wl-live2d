// 变量
import { EventEmitter } from 'eventemitter3';
import defaultOptions from '../../../lib/config/options.json';

export const wlLive2d = {
  data: defaultOptions,
  event: new EventEmitter(),
  app: {
    stage: {
      children: {
        length: 0
      },
      removeChildren(start, end) {},
      addChild() {}
    },
    renderer: {
      destroy() {}
    },
    resize() {return true;}
  },
  model: {
    backgroundColor: 'transparent'
  },
  ref: {},
  stage: {}
};
export const ILive2DModel = {
  fromSync(url, options) {
    const { onError } = options;
    setTimeout(onError, 50);
    return {
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      scale: {
        set() {}
      },
      once(event, callback) {
        setTimeout(callback, 50);
      },
      destroy() {},
      on(event, callback) {
        setTimeout(callback, 50, ['test']);
      },
      motion() {return false;},
      internalModel: {
        motionManager: {
          on(event, callback) {
            setTimeout(callback, 50, 'group', 0, document.createElement('audio'));
          }
        }
      }
    };
  }
};
export const PIXI = {
  utils: {
    skipHello() {}
  },
  Application(options) {
    return val.wlLive2d.app;
  }
};
export const val = {
  wlLive2d,
  ILive2DModel,
  PIXI
};
export default val;
