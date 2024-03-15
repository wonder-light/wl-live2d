// app 变量
const app = {
  stage: {
    children: {
      length: 0
    },
    removeChildren(start, end) {},
    addChild() {}
  },
  renderer: {
    plugins: {
      extract: {
        image() {
          let img = document.createElement('img');
          img.setAttribute('src', 'https://jest-extended.jestcommunity.dev/img/logo.png');
          return img;
        }
      }
    },
    destroy() {}
  },
  resize() {return true;}
};

export const ILive2DModel = {
  from(url, options) {
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
    return app;
  }
};

export const val = {
  ILive2DModel,
  PIXI
};

export default val;
