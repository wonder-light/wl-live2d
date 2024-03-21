import { ULive2dController } from '../../lib/controller/index.js';
import { DMessage } from '../../lib/models/index.js';
import { FBasePlugin, FBaseSwitchPlugin, FCapturePlugin, FConsoleMessagePlugin, FCopyMessagePlugin, FDragPlugin, FHourMessagePlugin, FInfoPlugin, FMotionMessagePlugin, FNullMessagePlugin, FQuitPlugin, FSeasonsMessagePlugin, FTalkMessagePlugin, FSwitchModulePlugin, FSwitchTexturePlugin, FTipsDragPlugin, FVisibilityMessagePlugin } from '../../lib/plugins/index.js';
import { EEvent, FHelp } from '../../lib/utils/index.js';
import val from './const/variable.js';


global.PIXI = jest.mocked(val.pixiVal);
global.ILive2DModel = jest.mocked(val.live2DModelVal);
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
    expect(() => live2d = ULive2dController.create()).not.toThrow();
    jest.advanceTimersByTime(10000);
    // 停止循环
    live2d.tips.stopFade();
    // 设置储持续时间
    live2d.stage.canvas.style.setProperty('--live2d-duration', '1ms');
    live2d.stage.wrapper.style.setProperty('--live2d-duration', '1ms');
    live2d.stage.wrapper.style.setProperty('--live2d-tips-duration', '1ms');
    // 卸载插件
    live2d.uninstallPlugin(...live2d.plugins);
    jest.runAllTimers();
    expect(FBasePlugin).toBeFunction();
    expect(FBasePlugin.prototype['install']).toBeFunction();
    expect(FBasePlugin.prototype['uninstall']).toBeFunction();
  });

  test('测试 capture', async () => {
    // Jest 错误 - 未实现 : navigation (except hash changes) when click event is triggered on an anchor element
    // https://www.coder.work/article/7760377
    global.URL.createObjectURL = jest.fn();
    HTMLAnchorElement.prototype.click = jest.fn();
    const captureEnableFun = jest.spyOn(FCapturePlugin.prototype, 'isEnable', null).mockImplementation(() => enable);
    jest.useFakeTimers();
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
    jest.runAllTimers();
  });

  test.each([
    { classes: FDragPlugin, name: 'FDragPlugin' },
    { classes: FTipsDragPlugin, name: 'FTipsDragPlugin' }
  ])('测试 $name', ({ classes }) => {
    const baseEnable = jest.spyOn(classes.prototype, 'isEnable', null).mockImplementation(() => enable);
    let plugin = new classes;
    expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    // 测试拖拽
    let mouse = new MouseEvent('mousedown', { screenX: 0, screenY: 0 });
    plugin._element.dispatchEvent(mouse);
    mouse = new MouseEvent('mousemove', { screenX: 12, screenY: 12 });
    plugin._element.dispatchEvent(mouse);
    mouse = new MouseEvent('mousemove', { screenX: -12, screenY: -12 });
    plugin._element.dispatchEvent(mouse);
    mouse = new MouseEvent('mousemove', { screenX: 0, screenY: 0 });
    plugin._element.dispatchEvent(mouse);
    plugin._element.dispatchEvent(new MouseEvent('mouseup'));
    plugin._element.dispatchEvent(new TouchEvent('touchstart', { targetTouches: [plugin._element] }));
    plugin._element.dispatchEvent(new TouchEvent('touchmove', { targetTouches: [plugin._element] }));
    plugin._element.dispatchEvent(new TouchEvent('touchend'));
    baseEnable.mockRestore();
    expect(plugin.isEnable()).toBeTrue();
    // 获取宽高
    expect(plugin.getWidthHeight()).toBeObject();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
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
    let quitLeftValue = 20;
    jest.spyOn(live2d.stage.wrapper, 'offsetLeft', 'get').mockImplementation(() => quitLeftValue);
    jest.useFakeTimers({ advanceTimers: true });
    jest.runAllTimers();
    const swi = async (plugin) => {
      expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
      expect(() => live2d.installPlugin(plugin)).not.toThrow();
      quitLeftValue = 20;
      await expect(plugin.startSwitch()).resolves.not.toThrow();
      quitLeftValue = 10;
      await expect(plugin.startSwitch()).resolves.not.toThrow();
      expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
      jest.runAllTimers();
    };
    let plugin = new FSwitchModulePlugin;
    // 模型切换
    await expect(swi(plugin)).resolves.not.toThrow();
    // 服装
    plugin = new FSwitchTexturePlugin;
    await expect(swi(plugin)).resolves.not.toThrow();
  });

  test.each([
    { classes: FNullMessagePlugin, name: 'FNullMessagePlugin' },
    { classes: FHourMessagePlugin, name: 'FHourMessagePlugin' },
    { classes: FSeasonsMessagePlugin, name: 'FSeasonsMessagePlugin' },
    { classes: FTalkMessagePlugin, name: 'FSentenceMessagePlugin' }
  ])('测试 $name', async ({ classes }) => {
    const baseEnable = jest.spyOn(classes.prototype, 'isEnable', null).mockImplementation(() => enable);
    let plugin = new classes;
    let messages = Array.from({ length: 10 }, (v, k) => new DMessage({ type: plugin['_type'], priority: k % 2 === 0 ? 2 : 10 }));
    let message = messages[0];
    live2d.tips.messages.splice(0, live2d.tips.messages.length);
    live2d.tips.messages.push(...messages);
    expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    if (classes === FNullMessagePlugin) {
      expect(message.condition()).toBeTrue();
    }
    else if (classes === FTalkMessagePlugin) {
      let message = plugin._message;
      // 去掉定时器
      clearInterval(plugin._handler);
      expect(message.condition()).toBeFalse();
      jest.runAllTimers();
      await expect(plugin.getTalkValue()).resolves.pass('通过');
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
    baseEnable.mockRestore();
    expect(plugin.isEnable()).toBeTrue();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
  });

  test('测试 FMotionMessagePlugin', async () => {
    const baseEnable = jest.spyOn(FMotionMessagePlugin.prototype, 'isEnable', null).mockImplementation(() => enable);
    let plugin = new FMotionMessagePlugin;
    expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    await expect(plugin.motion('idle', 0, null)).resolves.not.toThrow();
    await expect(plugin.motion('tap', 0, null)).resolves.not.toThrow();
    await expect(plugin.motion('tap', 1, null)).resolves.not.toThrow();
    await expect(plugin.motion('tap', 1, { duration: 13 })).resolves.not.toThrow();
    jest.runAllTimers();
    baseEnable.mockRestore();
    expect(plugin.isEnable()).toBeTrue();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
  });

  test('测试 FCopyMessagePlugin', () => {
    const baseEnable = jest.spyOn(FCopyMessagePlugin.prototype, 'isEnable', null).mockImplementation(() => enable);
    let plugin = new FCopyMessagePlugin;
    let messages = Array.from({ length: 1 }).map((v, k) => new DMessage({
      type: 'event',
      event: 'copy',
      text: '你都复制了些什么呀，转载要记得加上出处哦！'
    }));
    live2d.tips.addMessage(...messages);
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    window.dispatchEvent(new Event('copy'));
    jest.runAllTimers();
    messages[0].text = ['你都复制了些什么呀，转载要记得加上出处哦！'];
    window.dispatchEvent(new Event('copy'));
    jest.runAllTimers();
    let message = new DMessage({
      type: 'event'
    });
    expect(plugin.isType(message)).toBeFalse();
    message.event = 'copy';
    expect(plugin.isType(message)).toBeTrue();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
    live2d.tips.removeMessage(...messages);
  });

  test('测试 FConsoleMessagePlugin', () => {
    const baseEnable = jest.spyOn(FConsoleMessagePlugin.prototype, 'isEnable', null).mockImplementation(() => enable);
    let plugin = new FConsoleMessagePlugin;
    expect(() => testPlugin(plugin, baseEnable)).not.toThrow();
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    window.innerHeight = window.outerHeight / 2;
    window.dispatchEvent(new Event('resize'));
    jest.runAllTimers();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
  });

  test('测试 FVisibilityMessagePlugin', () => {
    let plugin = new FVisibilityMessagePlugin;
    const call = () => {
      // 淡出然后淡入
      live2d.stage.wrapper.classList.remove('live2d-opacity-1');
      live2d.stage.wrapper.classList.add('live2d-opacity-0');
      jest.runAllTimers();
      live2d.stage.wrapper.classList.remove('live2d-opacity-0');
      live2d.stage.wrapper.classList.add('live2d-opacity-1');
      jest.runAllTimers();
    };
    expect(() => live2d.installPlugin(plugin)).not.toThrow();
    // 首次
    call();
    // 隐藏再显示
    call();
    expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
  });
});
