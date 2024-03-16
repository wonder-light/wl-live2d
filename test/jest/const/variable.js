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

export const live2DModelVal = {
  async from(url, options) {
    const { onError } = options;
    const times = 10;
    setTimeout(onError, times);
    return {
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      scale: {
        set() {}
      },
      once(event, callback) {
        setTimeout(callback, times);
      },
      destroy() {},
      on(event, callback) {
        setTimeout(callback, times, ['test']);
      },
      motion() {return false;},
      internalModel: {
        motionManager: {
          on(event, callback) {
            setTimeout(callback, times, 'group', 0, document.createElement('audio'));
          }
        }
      }
    };
  }
};

export const pixiVal = {
  utils: {
    skipHello() {}
  },
  Application(options) {
    return app;
  }
};

export const val = {
  live2DModelVal,
  pixiVal
};

export default val;
