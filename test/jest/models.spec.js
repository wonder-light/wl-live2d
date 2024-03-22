import * as models from '../../lib/models';
import { FHelp } from '../../lib/utils/index.js';

describe('models/** - 单元测试', () => {
  // 监听 mixinProperty
  const mixinProperty = jest.spyOn(FHelp, 'mixinProperty', null);

  beforeEach(() => {
    // 重置 mixinProperty 的 mock 次数
    mixinProperty.mockClear();
  });

  test.each(Object.keys(models))('测试 model - %s', (key) => {
    // class
    const model = models[key];
    // 是否是 stage
    const isStage = /stage/i.test(key);
    // object
    let obj = new model({ a: 1, b: 2 });
    const fn = (expected = 1, params = true) => {
      expect(model).toBeFunction();
      expect(obj).toBeObject();
      // 确认调用次数
      expect(mixinProperty).toHaveBeenCalledTimes(expected);
      if (params) {
        // 有参是确认是否包含指定的键
        expect(obj).toContainAnyEntries([
          ['a', 1],
          ['b', 2]
        ]);
      }
    };
    expect(() => fn(isStage ? 0 : 1, !isStage)).not.toThrow();
    // 无参构造
    obj = new model();
    expect(() => fn(isStage ? 0 : 2, false)).not.toThrow();
  });
});
