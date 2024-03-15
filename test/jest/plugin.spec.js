import { ULive2dController } from '../../lib/controller/index.js';
import { DBaseMessage } from '../../lib/models/index.js';
import { FBasePlugin, FBaseSwitchPlugin, FCapturePlugin, FDragPlugin, FHourMessagePlugin, FInfoPlugin, FNullMessagePlugin, FQuitPlugin, FSeasonsMessagePlugin, FSentenceMessagePlugin, FSwitchModulePlugin, FSwitchTexturePlugin } from '../../lib/plugins/index.js';
import { EEvent, FHelp } from '../../lib/utils/index.js';
import { ILive2DModel, PIXI as PIXIJS } from './const/variable.js';


const PIXI = jest.mocked(PIXIJS);
global.fetch = jest.fn(async (input, init) => {
  return {
    json() {
      return Promise.reject({ hitokoto: {} });
    },
    text() {
      if (/tenapi/.test(input)) {
        return input;
      }
      return Promise.reject({});
    },
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
window.open = () => {};

describe('plugins 测试', () => {
  /** @type {ULive2dController} */
  let live2d;
  let enable = true;
  jest.spyOn(window, 'screen', 'get').mockImplementation(() => {
    return {
      width: 20,
      height: 20
    };
  });
  const testPlugin = (plugin, baseEnable) => {
    baseEnable.mockClear();
    enable = false;
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    expect(baseEnable).toBeCalledTimes(1);
    enable = true;
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    expect(baseEnable).toBeCalledTimes(2);
    jest.runAllTimers();
  };

  test('测试 base', () => {
    jest.useFakeTimers();
    window.PIXI = PIXI;
    window.ILive2DModel = ILive2DModel;
    expect(() => live2d = ULive2dController.create()).not.toThrow();
    // 停止循环
    live2d.tips.stopFade();
    // 卸载插件
    live2d.uninstallPlugin(...live2d.plugins);
    jest.runAllTimers();
    expect(FBasePlugin).toBeFunction();
    expect(FBasePlugin.prototype['install']).toBeFunction();
    expect(FBasePlugin.prototype['uninstall']).toBeFunction();
  });

  test('测试 capture', async () => {
    const captureEnableFun = jest.spyOn(FCapturePlugin.prototype, 'isEnable', null).mockImplementation(() => enable);
    // enable = false;
    captureEnableFun.mockClear();
    enable = false;
    let plugin = new FCapturePlugin;
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    expect(captureEnableFun).toBeCalledTimes(1);
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    // enable = true;
    enable = true;
    plugin = new FCapturePlugin;
    expect(FHelp.is(FBasePlugin, plugin)).toBeTrue();
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    await expect(plugin.downloadImage()).resolves.not.toThrow();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    expect(captureEnableFun).toBeCalledTimes(2);
    // 测试 base isEnable
    captureEnableFun.mockRestore();
    expect(plugin.isEnable()).toBeTrue();
    live2d.data.menus = [];
    expect(plugin.isEnable()).toBeFalse();
    live2d.data.menus = ['capture'];
    expect(plugin.isEnable()).toBeTrue();
    live2d.data.menus = null;
  });

  test('测试 FDragPlugin', () => {
    const dragEnable = jest.spyOn(FDragPlugin.prototype, 'isEnable', null).mockImplementation(() => {
      return enable;
    });
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

  test('测试 FInfoPlugin', () => {
    const baseEnable = jest.spyOn(FInfoPlugin.prototype, 'isEnable', null).mockImplementation(() => enable);
    let plugin = new FInfoPlugin;
    expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
    expect(() => plugin.openDocs()).not.toThrow();
  });

  test('测试 FQuitPlugin', async () => {
    let quitLeftValue = 20;
    jest.spyOn(live2d.stage.wrapper, 'offsetLeft', 'get').mockImplementation(() => quitLeftValue);
    const baseEnable = jest.spyOn(FQuitPlugin.prototype, 'isEnable', null).mockImplementation(() => enable);

    let plugin = new FQuitPlugin;
    expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
    // 安装
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    quitLeftValue = 20;
    expect(plugin.isRight()).toBeTrue();
    plugin._show.classList.remove('live2d-right');
    expect(() => plugin.hiddenLive2d()).not.toThrow();
    jest.runAllTimers();
    quitLeftValue = 10;
    expect(plugin.isRight()).toBeFalse();
    expect(() => plugin.showLive2d()).not.toThrow();
    live2d.event.emit(EEvent.modelLoad, { width: 300, height: 400 });
    jest.runAllTimers();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    expect(baseEnable).toBeCalledTimes(3);
  });

  test('测试 FBaseSwitchPlugin', async () => {
    const baseEnable = jest.spyOn(FBaseSwitchPlugin.prototype, 'isEnable', null).mockImplementation(() => enable);
    let plugin = new FSwitchModulePlugin;
    const swi = (plugin) => {
      expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
      expect(() => plugin.switch()).not.toThrow();
      jest.runAllTimers();
    };
    // 模型切换
    expect(() => swi(plugin)).not.toThrow();
    // 服装
    plugin = new FSwitchTexturePlugin;
    expect(() => swi(plugin)).not.toThrow();
  });

  test.each([
    { classes: FNullMessagePlugin, name: 'FNullMessagePlugin' },
    { classes: FHourMessagePlugin, name: 'FHourMessagePlugin' },
    { classes: FSeasonsMessagePlugin, name: 'FSeasonsMessagePlugin' },
    { classes: FSentenceMessagePlugin, name: 'FSentenceMessagePlugin' }
  ])('测试 $name', async ({ classes }) => {
    const baseEnable = jest.spyOn(classes.prototype, 'isEnable', null).mockImplementation(() => enable);
    let plugin = new classes;
    let messages = Array.from({ length: 10 }, () => new DBaseMessage({ type: plugin['_type'] }));
    let message = messages[0];
    live2d.tips.messages.splice(0, live2d.tips.messages.length);
    live2d.tips.messages.push(...messages);
    expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    if (classes === FNullMessagePlugin) {
      expect(message.condition()).toBeTrue();
    }
    else if (classes === FSentenceMessagePlugin) {
      let message = plugin._message;
      // 去掉定时器
      clearInterval(plugin._handler);
      expect(message.condition()).toBeFalse();
      jest.runAllTimers();
      await expect(plugin.getSentence()).resolves.pass('通过');
      expect(message.condition()).toBeTrue();
      expect(message.condition()).toBeFalse();
    }
    else {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDate();
      const mon = now.getMonth() + 1;
      messages.forEach(m => (m.once = false));
      expect(message.type).toEqual(plugin['_type']);
      messages.forEach(m => (m.hour = null) || (m.date = null));
      expect(message.condition()).toBeFalse();
      messages.forEach(m => (m.hour = `${ hour }`) && (m.date = `${ mon }/${ day }`));
      expect(message.condition()).toBeTrue();
      messages.forEach(m => (m.hour = `${ hour }-${ hour }`) && (m.date = `${ mon }/${ day }`));
      expect(message.condition()).toBeTrue();
      messages.forEach(m => (m.once = true));
      expect(message.condition()).toBeTrue();
      expect(message.condition()).toBeFalse();
    }
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
  });
});
