import { ULive2dController } from '../../../lib/controller/index.js';
import { FTalkMessagePlugin } from '../../../lib/plugins/index.js';
import { FHelp } from '../../../lib/utils/index.js';
import val from './variable.js';

const ILive2DModel = jest.mocked(val.live2DModelVal);

const PIXI = jest.mocked(val.pixiVal);
// 创建 live2d 控制器
export const createLive2d = (options = null) => {
  jest.useFakeTimers();
  /** @type {ULive2dController} */
  let live2d;
  // 全局属性
  global.PIXI = PIXI;
  global.ILive2DModel = ILive2DModel;
  // 覆盖 console.log
  const log = global.console.log;
  global.console.log = jest.fn(() => null);
  expect(() => live2d = new ULive2dController(options)).not.toThrow();
  // 恢复 console.log
  global.console.log = log;
  // 设置持续时间
  live2d.stage.canvas.style.setProperty('--live2d-duration', '1ms');
  live2d.stage.wrapper.style.setProperty('--live2d-duration', '1ms');
  live2d.stage.wrapper.style.setProperty('--live2d-tips-duration', '1ms');
  // 先推进 10s 触发 startFade, 然后再调用 stopFade
  jest.advanceTimersByTime(10000);
  expect(() => live2d.tips.stopFade()).not.toThrow();
  expect(live2d.tips.stop).toBeTrue();
  for (const plugin of live2d.plugins) {
    // clearInterval
    if (FHelp.is(FTalkMessagePlugin, plugin)) {
      expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
      break;
    }
  }
  jest.runAllTimers();
  return live2d;
};
