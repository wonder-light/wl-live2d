import { ULive2dController } from '../../lib/controller/index.js';
import { FBasePlugin, FCapturePlugin, FDragPlugin } from '../../lib/plugins/index.js';
import { FHelp } from '../../lib/utils/index.js';
import { ILive2DModel, PIXI as PIXIJS } from './const/variable.js';


const PIXI = jest.mocked(PIXIJS);
global.fetch = jest.fn(async (input, init) => {
  return {
    blob() {
      return input;
    }
  };
});
global.URL.createObjectURL = jest.fn((blob) => blob);
window.visualViewport = {
  width: 20,
  height: 20
};

describe('plugins 测试', () => {
  /** @type {ULive2dController} */
  let live2d;
  let enable = true;
  const enableFun = jest.spyOn(FBasePlugin.prototype, 'isEnable', null).mockImplementation(() => {
    return enable;
  });
  const screen = jest.spyOn(window, 'screen', 'get').mockImplementation(() => {
    return {
      width: 20,
      height: 20
    };
  });

  test('测试 base', () => {
    jest.useFakeTimers();
    window.PIXI = PIXI;
    window.ILive2DModel = ILive2DModel;
    expect(() => live2d = ULive2dController.create()).not.toThrow();
    // 停止循环
    live2d.tips._stopTips();
    // 卸载插件
    live2d.uninstallPlugin(...live2d.plugins);
    jest.runAllTimers();
    expect(FBasePlugin).toBeFunction();
    expect(FBasePlugin.prototype['install']).toBeFunction();
    expect(FBasePlugin.prototype['uninstall']).toBeFunction();
  });
  test('测试 capture', async () => {
    // enable = false;
    enableFun.mockClear();
    enable = false;
    let plugin = new FCapturePlugin;
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    expect(enableFun).toBeCalledTimes(1);
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    // enable = true;
    enable = true;
    plugin = new FCapturePlugin;
    expect(FHelp.is(FBasePlugin, plugin)).toBeTrue();
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    await expect(plugin.downloadImage()).resolves.not.toThrow();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    expect(enableFun).toBeCalledTimes(2);
    // 测试 base isEnable
    // 恢复原始（非模拟）实现
    enableFun.mockRestore();
    expect(plugin.isEnable()).toBeTrue();
    live2d.data.menus = [];
    expect(plugin.isEnable()).toBeFalse();
    live2d.data.menus = ['capture'];
    expect(plugin.isEnable()).toBeTrue();
    live2d.data.menus = null;
    // 回复模拟操作
    enableFun.mockImplementation(enableFun.getMockImplementation());
  });

  const dragEnable = jest.spyOn(FDragPlugin.prototype, 'isEnable', null).mockImplementation(() => {
    return enable;
  });
  test('测试 FDragPlugin', () => {
    let plugin = new FDragPlugin;
    enable = false;
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    expect(dragEnable).toBeCalledTimes(1);
    enable = true;
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    // 测试拖拽
    plugin._wrapper.dispatchEvent(new MouseEvent('mousedown'));
    let mouse = new MouseEvent('mousemove');
    mouse.movementX = mouse.movementY = 12;
    plugin._wrapper.dispatchEvent(mouse);
    mouse.movementX = mouse.movementY = -12;
    plugin._wrapper.dispatchEvent(mouse);
    mouse.movementX = mouse.movementY = 0;
    plugin._wrapper.dispatchEvent(mouse);
    plugin._wrapper.dispatchEvent(new MouseEvent('mouseup'));
    plugin._wrapper.dispatchEvent(new TouchEvent('touchstart', { targetTouches: [plugin._wrapper] }));
    plugin._wrapper.dispatchEvent(new TouchEvent('touchmove', { targetTouches: [plugin._wrapper] }));
    plugin._wrapper.dispatchEvent(new TouchEvent('touchend'));
    // 获取宽高
    expect(plugin['_getWidthHeight']()).toBeObject();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    expect(dragEnable).toBeCalledTimes(2);
  });
});
