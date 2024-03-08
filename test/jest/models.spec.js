const models = require('../../lib/models');
const { FHelp } = require('../../lib/utils/index.js');

describe('models/** - 单元测试', () => {
  // 监听 mixinProperty
  const mixinProperty = jest.spyOn(FHelp, 'mixinProperty', null);
  afterEach(() => {
    // 重置 mixinProperty 的 mock 次数
    mixinProperty.mockReset();
  });

  test.each(Object.keys(models))('model/%s', (key) => {
    // class
    const model = models[key];
    // object
    let obj = new model({ a: 1, b: 2 });
    const fn = (expected = 1, params = true) => {
      const str = params ? 'has params' : 'not has params';
      expect(model).toBeFunction();
      expect(obj).toBeObject();
      try {
        // 确认调用次数
        expect(mixinProperty).toHaveBeenCalledTimes(expected);
        if (params) {
          // 有参是确认是否包含指定的键
          expect(obj).toContainAnyEntries([['a', 1], ['b', 2]]);
        }
        expect('').pass(`${ key } has call FHelp.mixinProperty  --  ${ str } `);
      }
      catch (_) {
        expect(obj).not.toContainAnyEntries([['a', 1], ['b', 2]]);
        expect('').pass(`${ key } not call FHelp.mixinProperty  --  ${ str }`);
      }
    };
    // 无参构造
    obj = new model();
    expect(() => fn(1, true)).not.toThrow();
    expect(() => fn(2, false)).not.toThrow();
  });
});
