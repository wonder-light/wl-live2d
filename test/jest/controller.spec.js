import * as controller from '../../lib/controller/index.js';
import { UBaseController, UBaseModelController, UBaseStageController, UBaseTipsController, ULive2dController } from '../../lib/controller/index.js';
import { DBaseMessage, DBaseModel } from '../../lib/models/index.js';
import { FSentenceMessagePlugin } from '../../lib/plugins/index.js';
import { EEvent, FHelp } from '../../lib/utils/index.js';
import val from './const/variable.js';


const ILive2DModel = jest.mocked(val.ILive2DModel);

const PIXI = jest.mocked(val.PIXI);
// 创建 live2d 控制器
const createLive2d = (options = null) => {
  /** @type {ULive2dController} */
  let live2d;
  global.PIXI = PIXI;
  global.ILive2DModel = ILive2DModel;
  expect(() => live2d = new ULive2dController(options)).not.toThrow();
  // 先推进 10s 触发 startFade, 然后再调用 stopFade
  jest.advanceTimersByTime(10000);
  expect(() => live2d.tips.stopFade()).not.toThrow();
  expect(live2d.tips.stop).toBeTrue();
  for (const plugin of live2d.plugins) {
    // clearInterval
    if (FHelp.is(FSentenceMessagePlugin, plugin)) {
      expect(() => live2d.uninstallPlugin(plugin)).not.toThrow();
      break;
    }
  }
  jest.runAllTimers();
  return live2d;
};

describe('测试控制器类型', () => {
  // 测试类型
  test.each(Object.keys(controller))('test %s is class function', (key) => {
    expect(controller[key]).toBeFunction();
  });
  test('UBaseController contains keys', () => {
    expect(UBaseController.prototype).toContainKeys([
      'live2d', 'live2dData', 'app', 'event', 'ref', 'init', 'destroy'
    ]);
  });
});

describe('ULive2dController 单元测试', () => {
  /** @type {ULive2dController} */
  let live2d = null;
  const initFun = jest.spyOn(ULive2dController.prototype, 'init', null);
  test('测试 constructor', () => {
    jest.useFakeTimers({ advanceTimers: true });
    global.PIXI = null;
    global.ILive2DModel = ILive2DModel;
    expect(() => ULive2dController.create(null)).toThrow();
    global.PIXI = { Application: null };
    expect(() => ULive2dController.create(null)).toThrow();
    global.PIXI = PIXI;
    const options = {
      plugins: [
        null,
        {},
        { install() {} }
      ]
    };
    expect(() => live2d = createLive2d(null)).not.toThrow();
    expect(initFun).toBeCalledTimes(1);
    jest.runAllTimers();
    expect(() => live2d = createLive2d(options)).not.toThrow();
    expect(initFun).toBeCalledTimes(2);
    jest.runAllTimers();
  });
  test('测试 get 方法', () => {
    expect(live2d.app).not.toBeNull();
    expect(live2d.data).not.toBeNull();
    expect(live2d.event).not.toBeNull();
    expect(live2d.stage).not.toBeNull();
    expect(live2d.model).not.toBeNull();
    expect(live2d.tips).not.toBeNull();
    expect(live2d.plugins).toBeArray();
    expect(live2d.ref).toBeObject();
  });
  test('测试 uninstallPlugin', () => {
    let length = live2d.plugins.length;
    expect(() => live2d.installPlugin({})).not.toThrow();
    expect(live2d.plugins.length).toEqual(length);
    expect(() => live2d.uninstallPlugin(live2d.plugins[0])).not.toThrow();
    expect(() => live2d.uninstallPlugin(null)).not.toThrow();
  });
  test('测试 destroy', () => {
    expect(() => live2d.destroy()).not.toThrow();
    expect(live2d.plugins.length === 0).toBeTrue();
  });
});

describe('UBaseStageController 单元测试', () => {
  const event = jest.spyOn(UBaseController.prototype, 'event', 'get');
  const initFun = jest.spyOn(UBaseStageController.prototype, 'init', null);
  const live2d = jest.spyOn(UBaseController.prototype, 'live2d', 'get');
  const live2dData = jest.spyOn(UBaseController.prototype, 'live2dData', 'get');
  const app = jest.spyOn(UBaseController.prototype, 'app', 'get');
  const ref = jest.spyOn(UBaseController.prototype, 'ref', 'get');
  const loadFun = jest.spyOn(UBaseStageController.prototype, '_onModelLoad', null);
  const destroyFun = jest.spyOn(UBaseStageController.prototype, 'destroy', null);
  /** @type {UBaseStageController} */
  let stage;
  /** @type {ULive2dController} */
  let wlLive2d = null;

  test('测试 constructor', () => {
    jest.useFakeTimers();
    expect(() => wlLive2d = createLive2d()).not.toThrow();
    expect(() => new UBaseStageController(null)).toThrow();
    event.mockClear();
    // 加入数据
    expect(() => stage = new UBaseStageController(wlLive2d)).not.toThrow();
    expect(event).toHaveBeenCalledTimes(1);
    // 替换 stage
    wlLive2d.stage.destroy();
    wlLive2d._stage = stage;
    // 检查有效性
    expect(stage).toBeObject();
  });
  test('测试 init 函数', () => {
    expect(initFun).not.toHaveBeenCalled();
    wlLive2d.event.emit(EEvent.init);
    expect(initFun).toHaveBeenCalled();
    expect(live2d).toHaveBeenCalledTimes(1);
    expect(live2dData).toHaveBeenCalledTimes(5);
    expect(ref).toHaveBeenCalledTimes(1);
    wlLive2d.data.fixed = false;
    wlLive2d.data.transitionTime = 0;
    expect(() => stage.init()).not.toThrow();
    expect((() => {
      const { parent, wrapper, canvas, tips, other } = stage;
      return FHelp.isValid(stage) && FHelp.isValid(parent) &&
             FHelp.isValid(wrapper) && FHelp.isValid(canvas) &&
             FHelp.isValid(tips) && FHelp.isValid(other) &&
             parent.contains(wrapper) && wrapper.contains(canvas) &&
             wrapper.contains(tips) && wrapper.contains(other);
    })()).toBeTrue();
    wlLive2d.data.fixed = true;
    wlLive2d.data.transitionTime = 500;
  });
  test('测试 fadeIn 和 fadeOut', async () => {
    // 淡入淡出 - 默认时间 500ms
    document.querySelector(':root').style.setProperty('--live2d-duration', '50ms');
    /**
     * @template T
     * @param {Promise<T>} pro
     * @return {Promise<T>}
     */
    const cat = (pro) => pro.then(() => {}).catch(() => {});
    let fun = (res = true) => {
      if (res) {
        return Promise.all([cat(stage.fadeOut()), cat(stage.fadeIn())]);
      }
      else {
        return Promise.all([cat(stage.fadeIn()), cat(stage.fadeOut())]);
      }
    };
    // 使用假的定时器
    //jest.useFakeTimers({ advanceTimers: true });
    jest.useRealTimers();
    await expect(cat(stage['_fade']())).resolves.pass('通过');
    await expect(cat(stage['_fade'](null))).resolves.pass('通过');
    await expect(cat(stage['_fade'](stage.menus, 'fadeOut'))).resolves.pass('通过');
    await expect(cat(stage['_fade'](stage.menus, 'fadeOut', 'fadeOut'))).resolves.pass('通过');
    await expect(cat(stage.fadeOut())).resolves.pass('通过');
    await expect(cat(stage.fadeIn())).resolves.pass('通过');
    await expect(cat(stage.fadeOut(stage.menus))).resolves.pass('通过');
    await expect(cat(stage.fadeIn(stage.menus))).resolves.pass('通过');
    await expect(cat(fun(true))).resolves.pass('通过');
    await expect(cat(fun(false))).resolves.pass('通过');
    // 使用真实的定时器
    jest.useRealTimers();
  });
  test('测试 getParentFromSelector 返回值', () => {
    expect(stage.getParentFromSelector()).toEqual(document.body);
    expect(stage.getParentFromSelector('//body')).toEqual(document.body);
    document.body.classList.add('wl-live2d-body');
    expect(stage.getParentFromSelector('.wl-live2d-body')).toEqual(document.body);
  });
  test('测试 _showAndHiddenMenus 函数', () => {
    expect(() => stage['showAndHiddenMenus'](new MouseEvent('mouseleave'))).not.toThrow();
    expect(() => stage['showAndHiddenMenus']({ type: 'touchstart', touches: [{ target: stage.menus }] })).not.toThrow();
    expect(() => stage['showAndHiddenMenus'](new MouseEvent(''))).not.toThrow();
  });
  test('测试 _getTransitionDuration', () => {
    expect(stage['getTransitionDuration'](null)).toEqual(0);
    stage.wrapper.style.transitionDuration = '';
    expect(stage['getTransitionDuration'](stage.wrapper)).toEqual(0);
    stage.wrapper.style.transitionDuration = '0.05';
    expect(stage['getTransitionDuration'](stage.wrapper)).toEqual(50);
    stage.wrapper.style.transitionDuration = '0.05s';
    expect(stage['getTransitionDuration'](stage.wrapper)).toEqual(50);
    stage.wrapper.style.transitionDuration = '50ms';
    expect(stage['getTransitionDuration'](stage.wrapper)).toEqual(50);
  });
  test('测试 addMenu 和 removeMenu 函数', () => {
    let el = document.createElement('div');
    expect(stage.addMenu(el).menuItems).toHaveLength(1);
    expect(stage.removeMenu(el).menuItems).toHaveLength(0);
    expect(stage.addMenu(el).menuItems).toHaveLength(1);
    expect(stage.addMenu(null).menuItems).toHaveLength(1);
    expect(stage.removeMenu(null).menuItems).toHaveLength(1);
  });
  test('测试 _onModelLoad 和 destroy', () => {
    wlLive2d.event.emit(EEvent.modelLoad, { width: 350, height: 400 });
    expect(app).toHaveBeenCalledTimes(1);
    expect(loadFun).toHaveBeenCalledTimes(1);
    wlLive2d.event.emit(EEvent.destroy);
    expect(ref).toHaveBeenCalledTimes(1);
    expect(destroyFun).toHaveBeenCalledTimes(1);
  });
});

describe('UBaseTipsController 单元测试', () => {
  const fadeIn = jest.spyOn(UBaseTipsController.prototype, 'fadeIn', null);
  const destroy = jest.spyOn(UBaseTipsController.prototype, 'destroy', null);

  /** @type {UBaseTipsController} */
  let tips;
  /** @type {ULive2dController} */
  let wlLive2d = null;

  test('测试 constructor', () => {
    // 使用假的定时器
    jest.useFakeTimers({ advanceTimers: true });
    expect(() => wlLive2d = createLive2d()).not.toThrow();
    expect(() => new UBaseTipsController(null)).toThrow();
    fadeIn.mockClear();
    // 加入数据
    expect(() => tips = new UBaseTipsController(wlLive2d)).not.toThrow();
    expect(fadeIn).toHaveBeenCalledTimes(0);
    // 替换 tips
    wlLive2d.tips.destroy();
    wlLive2d._tips = tips;
    // 将所有计时器按msToRun毫秒推进。所有被setTimeout()、setInterval()和 setImmediate() 排队的宏任务将在这个时间范围内执行
    jest.advanceTimersByTime(tips.interval);
    expect(fadeIn).toHaveBeenCalledTimes(1);
    expect(() => tips.stopFade()).not.toThrow();
    expect(tips['_stop']).toBeTrue();
    jest.runAllTimers();
    expect(fadeIn).toHaveBeenCalledTimes(1);
    // 检查有效性
    expect(tips).toBeObject();
  });
  test('测试 get 方法', () => {
    expect(tips.duration).toBeNumber();
    expect(tips.interval).toBeNumber();
    expect(tips.messages).toBeArray();
    expect(tips.text).toBeString();
  });
  test('测试 fadeIn 和 fadeOut', () => {
    expect(() => tips.startFade()).not.toThrow();
    expect(() => tips.fadeIn(true).catch(FHelp.F)).not.toThrow();
    expect(() => tips.fadeOut(true).catch(FHelp.F)).not.toThrow();
    expect(() => tips.fadeIn().catch(FHelp.F)).not.toThrow();
    expect(() => tips.fadeOut().catch(FHelp.F)).not.toThrow();
    tips['_showId'] = tips['_hiddenId'] = 10;
    expect(() => tips.fadeIn(true).catch(FHelp.F)).not.toThrow();
    expect(() => tips.fadeOut(true).catch(FHelp.F)).not.toThrow();
    expect(() => tips.stopFade()).not.toThrow();
    jest.runAllTimers();
    // 测试无消息时的调用
    tips.messages.splice(0, tips.messages.length);
    expect(() => tips.startFade()).not.toThrow();
    jest.advanceTimersByTime(10000);
    tips.messages.push(...wlLive2d.data.tips.message);
    jest.advanceTimersByTime(10000);
    expect(() => tips.stopFade()).not.toThrow();
    jest.runAllTimers();
  });
  test('测试 notify', () => {
    expect(() => tips.notify('123456789')).not.toThrow();
    expect(() => tips.stopFade()).not.toThrow();
    jest.runAllTimers();
    jest.useRealTimers();
  });
  test('测试 addMessage 和 removeMessage', () => {
    expect(tips.addMessage(null)).toEqual(tips);
    expect(tips.removeMessage(null)).toEqual(tips);
    let mes = new DBaseMessage();
    expect(tips.addMessage(mes)).toEqual(tips);
    expect(tips.removeMessage(mes)).toEqual(tips);
  });
  test('测试 getRandomMessage', () => {
    tips.messages.splice(0, tips.messages.length);
    expect(tips.getRandomMessage()).toBeString();
    let mes = Array.from({ length: 20 }).map(t => new DBaseMessage({ priority: -2 }));
    expect(tips.addMessage(...mes));
    expect(tips.getRandomMessage()).toBeString();
    mes.forEach(m => m.text = ['1', '2', '3']);
    expect(tips.getRandomMessage()).toBeString();
  });
  test('测试 destroy', () => {
    wlLive2d.event.emit(EEvent.destroy);
    expect(destroy).toHaveBeenCalledTimes(1);
  });
});

describe('UBaseModelController 单元测试', () => {
  /** @type {UBaseModelController} */
  let model;
  /** @type {ULive2dController} */
  let wlLive2d = null;

  test('测试 constructor', () => {
    // 使用假的定时器
    jest.useFakeTimers({ advanceTimers: true });
    expect(() => wlLive2d = createLive2d()).not.toThrow();
    expect(() => new UBaseModelController(null)).toThrow();
    expect(() => new UBaseModelController(wlLive2d, null)).not.toThrow();
    let models = [
      [
        new DBaseModel({ path: 'http', width: 100, height: 100, position: {} }),
        new DBaseModel({ path: 'http', width: null, height: null, position: null })
      ],
      [new DBaseModel()],
      new DBaseModel()
    ];
    expect(() => model = new UBaseModelController(wlLive2d, models)).not.toThrow();
    // 替换 model
    wlLive2d.model.destroy();
    wlLive2d._model = model;
    model._data[0][0].scale = null;
    model._data[0][1].scale = 1;
  });
  test('测试 init', () => {
    window.ILive2DModel = ILive2DModel;
    expect(() => model.init()).not.toThrow();
    let data = model._data;
    model._data = [];
    expect(model.backgroundColor).toBeString();
    model._data = [[]];
    expect(model.backgroundColor).toBeString();
    model._data = data;
    expect(model.backgroundColor).toBeString();
  });
  test('测试 motion', () => {
    expect(model.currentMotion).toBeNull();
    expect(() => model.motion()).not.toThrow();
    jest.runAllTimers();
  });
  test('测试 loadModel', async () => {
    let data = model._data;
    model._data = [];
    await expect(() => model.loadModel(0)).not.toThrow();
    expect([model.modelId, model.textureId]).toEqual([0, 0]);
    model._data = data;
    await expect(() => model.loadModel(0)).not.toThrow();
    expect([model.modelId, model.textureId]).toEqual([0, 0]);
    await expect(() => model.loadModel(0, 1)).not.toThrow();
    expect([model.modelId, model.textureId]).toEqual([0, 1]);
    await expect(() => model.loadModel(1, 0)).not.toThrow();
    expect([model.modelId, model.textureId]).toEqual([1, 0]);
    jest.runAllTimers();
  });
  test('测试 switchModel', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    // 缩短时间
    wlLive2d.stage.canvas.style.transitionDuration = '10ms';
    await expect(model.switchModel(0)).resolves.pass('通过');
    expect([model.modelId, model.textureId]).toEqual([0, 0]);
    await expect(model.switchModel(0, 1)).resolves.pass('通过');
    expect([model.modelId, model.textureId]).toEqual([0, 1]);
    await expect(model.switchModel(1, 0)).resolves.pass('通过');
    expect([model.modelId, model.textureId]).toEqual([1, 0]);
    jest.runAllTimers();
  });
  test('测试 nextModel', async () => {
    jest.runAllTimers();
    // 缩短时间
    wlLive2d.stage.canvas.style.transitionDuration = '10ms';
    const data = model._data;
    model._data = [];
    model._modelId = 1;
    model._textureId = 1;
    await expect(model.nextModel()).resolves.pass('通过');
    jest.runAllTimers();
    expect([model.modelId, model.textureId]).toEqual([1, 1]);
    model._data = data;
    model._modelId = 0;
    await expect(model.nextModel()).resolves.pass('通过');
    jest.runAllTimers();
    expect([model.modelId, model.textureId]).toEqual([1, 0]);
    await expect(model.nextModel()).resolves.pass('通过');
    jest.runAllTimers();
    expect([model.modelId, model.textureId]).toEqual([2, 0]);
    await expect(model.nextModel()).resolves.pass('通过');
    jest.runAllTimers();
    expect([model.modelId, model.textureId]).toEqual([0, 0]);
    jest.runAllTimers();
  });
  test('测试 nextTexture', async () => {
    // [[T , T], [T], T]
    jest.runAllTimers();
    // 缩短时间
    wlLive2d.stage.canvas.style.transitionDuration = '10ms';
    model._modelId = 1;
    model._textureId = 0;
    await expect(model.nextTexture()).resolves.pass('通过');
    jest.runAllTimers();
    expect([model.modelId, model.textureId]).toEqual([1, 0]);
    model._modelId = 0;
    model._textureId = 0;
    await expect(model.nextTexture()).resolves.pass('通过');
    jest.runAllTimers();
    expect([model.modelId, model.textureId]).toEqual([0, 1]);
    await expect(model.nextTexture()).resolves.pass('通过');
    jest.runAllTimers();
    expect([model.modelId, model.textureId]).toEqual([0, 0]);
    jest.runAllTimers();
  });
  test('测试 resetModel', async () => {
    await expect(model.resetModel()).resolves.not.toThrow();
    jest.runAllTimers();
  });
  test('测试 hasOutfit', () => {
    expect(() => model.hasOutfit()).not.toThrow();
  });
  test('测试 destroy', () => {
    expect(() => model.destroy()).not.toThrow();
  });
});
