jest.mock('pixi.js', () => {
  const { PIXI } = require('./const/variable.js');
  return jest.mocked(PIXI);
});
jest.mock('pixi-live2d-display', () => {
  const { ILive2DModel } = require('./const/variable.js');
  return {
    Live2DModel: jest.mocked(ILive2DModel)
  };
});
jest.mock('pixi-live2d-display/cubism2', () => {
  const { ILive2DModel } = require('./const/variable.js');
  return {
    Live2DModel: jest.mocked(ILive2DModel)
  };
});
jest.mock('pixi-live2d-display/cubism4', () => {
  const { ILive2DModel } = require('./const/variable.js');
  return {
    Live2DModel: jest.mocked(ILive2DModel)
  };
});

import wlLive2d2 from '../../lib/index.cubism2.js';
import wlLive2d4 from '../../lib/index.cubism4.js';
import wlLive2d from '../../lib/index.js';
import { PIXI } from './const/variable.js';


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
