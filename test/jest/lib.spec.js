jest.mock('pixi.js', () => {
  const val = require('./const/variable.js');
  return jest.mocked(val.pixiVal);
});
jest.mock('pixi-live2d-display', () => {
  const val = require('./const/variable.js');
  return {
    Live2DModel: jest.mocked(val.live2DModelVal)
  };
});
jest.mock('pixi-live2d-display/cubism2', () => {
  const val = require('./const/variable.js');
  return {
    Live2DModel: jest.mocked(val.live2DModelVal)
  };
});
jest.mock('pixi-live2d-display/cubism4', () => {
  const val = require('./const/variable.js');
  return {
    Live2DModel: jest.mocked(val.live2DModelVal)
  };
});

import wlLive2d2 from '../../lib/index.cubism2.js';
import wlLive2d4 from '../../lib/index.cubism4.js';
import wlLive2d from '../../lib/index.js';


describe('lib/index 测试', () => {
  /** @type {ULive2dController} */
  let live2d;
  test('测试 index.js', () => {
    expect(() => live2d = wlLive2d()).not.toThrow();
    expect(() => live2d.destroy()).not.toThrow();
  });
  test('测试 index.cubism2.js', () => {
    expect(() => live2d = wlLive2d2()).not.toThrow();
    expect(() => live2d.destroy()).not.toThrow();
  });
  test('测试 index.cubism4.js', () => {
    expect(() => live2d = wlLive2d4()).not.toThrow();
    expect(() => live2d.destroy()).not.toThrow();
  });
});
