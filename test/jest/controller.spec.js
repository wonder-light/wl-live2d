import { UBaseController } from '../../lib/controller/index.js';

describe('controller/base - 单元测试', () => {
  test('UBaseController', () => {
    expect(UBaseController).toBeFunction();
    expect(() => new UBaseController(null)).toThrow();
  });
});
