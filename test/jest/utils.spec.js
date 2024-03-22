import Mock from 'mockjs';
import { FBasePlugin } from '../../lib/plugins/index.js';
import { EEvent, FHelp } from '../../lib/utils/index.js';

const Random = Mock.Random;

describe('utils/help.js - FHelp - 单元测试', () => {
  test('测试 FHelp.mixin', () => {
    class BaseClass {
      pop = 0;
      length = 1;

      constructor() {this.length = 3;}

      test() {}
    }

    class OtherClass {
      pop = 0;
      length = 1;
      type = '';

      constructor() {}

      test() {}

      height() {}
    }

    expect(FHelp.mixin(null, OtherClass)).toEqual(null);
    expect(FHelp.mixin(BaseClass, null)).toEqual(BaseClass);
    expect(FHelp.mixin(BaseClass, OtherClass)).toEqual(BaseClass);
    expect(BaseClass).toBeFunction();
    expect(BaseClass).toBeFunction();
    expect(BaseClass.prototype).toContainKeys(['type', 'test']);
  });

  test('测试 FHelp.mixinProperty', () => {
    let obj1 = { a: 1, b: 2 };
    let obj2 = { a: 2, b: 4, c: 5, d: { t: '', g: [] } };
    expect(FHelp.mixinProperty(obj1, obj2)).toEqual({ a: 1, b: 2, c: 5, d: { t: '', g: [] } });
    expect(FHelp.mixinProperty(obj1, FHelp)).toEqual(obj1);
    expect(FHelp.mixinProperty(FHelp, obj1, FHelp, obj2)).toEqual(FHelp);
    expect(FHelp.mixinProperty(null, obj2)).toEqual(null);
  });

  test('测试 FHelp.isNotValid', () => {
    const values = [
      null, undefined, NaN, [], '', {},
      Uint8Array.from(''), { length: 0 }, [1, 2, 3], 0
    ];
    const results = [
      true, true, true, true, true, true, true, false, false, false
    ];
    expect(values.map(v => FHelp.isNotValid(v))).toEqual(results);
  });

  test('测试 FHelp.isValid', () => {
    const values = [
      null, undefined, NaN, [], '', {},
      Uint8Array.from(''), { length: 0 }, [1, 2, 3], 0
    ];
    const results = [
      false, false, false, false, false, false, false, true, true, true
    ];
    expect(values.map(v => FHelp.isValid(v))).toEqual(results);
  });

  test('测试 FHelp.random', () => {
    /*let i = 10;
    let j = 0.5;
    while (i > 0) {
      i -= 0.5;
      j -= 0.5;
      for (const str of ['none', 'floor', 'ceil']) {
        expect(FHelp.random(i, j, str)).toBeWithin(j-1, i + 1);
        expect(FHelp.random(j, i, str)).toBeWithin(j-1, i + 1);
      }
    }*/
    for (const str of ['none', 'floor', 'ceil']) {
      expect(FHelp.random()).toBeWithin(0, 1.1);
      expect(FHelp.random(10, 0, str)).toBeWithin(10, 11);
      expect(FHelp.random(0.56, 0.56, str)).toBeWithin(0, 1.1);
      expect(FHelp.random(0, 10, str)).toBeWithin(0, 11);
    }
  });

  test('测试 FHelp.groupBy', () => {
    const obj = Mock.mock({
      'array|10-30': [
        {
          'priority': Random.integer(0, 10),
          'character': Random.character('lower'),
          'text': Random.paragraph
        }
      ]
    });
    const arr = obj['array'];
    const fn = (key = 'priority') => FHelp.groupBy((t) => t[key], arr);
    for (const x of ['priority', 'character']) {
      let keys = {};
      let values = fn(x);
      arr.forEach(val => keys[val[x]] = null);
      keys = Object.keys(keys);
      expect(values).toBeObject();
      expect(values).toContainKeys(keys);
      expect(values[keys[0]]).toBeArray();
    }
  });

  test('测试 FHelp.is', () => {
    const maps = [
      [Object, {}, true],
      [Number, 1, true],
      [Object, 1, false],
      [Object, FHelp, true],
      [FBasePlugin, { install() {} }, false]
    ];
    for (const map of maps) {
      expect(FHelp.is(map[0], map[1])).toEqual(map[2]);
    }
  });

  test('测试 FHelp.mergeAll', () => {
    const a = {
      a: ['foo'],
      b: { a: 'bar' },
      c: null,
      d: [
        [1, 2, 3],
        { a: 1, b: 2 },
        null,
        '123'
      ],
      e: '000'
    };
    const b = {
      a: 'too',
      b: 'bar',
      c: 'baz',
      d: [
        [4, 5, 6],
        { c: 1, d: 2 },
        undefined,
        '123'
      ]
    };
    expect(FHelp.mergeAll(a, b)).toEqual({
      a: 'too',
      b: 'bar',
      c: 'baz',
      d: [
        [4, 5, 6],
        { c: 1, d: 2 },
        undefined,
        '123'
      ],
      e: '000'
    });
  });

  test('测试 FHelp.mergeDeepWith', () => {
    const a = {
      a: ['foo'],
      b: { a: 'bar' },
      c: null,
      d: [
        [1, 2, 3],
        { a: 1, b: 2 },
        null,
        '123'
      ],
      e: '000'
    };
    const b = {
      a: 'too',
      b: 'bar',
      c: 'baz',
      d: [
        [4, 5, 6],
        { c: 1, d: 2 },
        undefined,
        '123'
      ],
      f: '000'
    };
    expect(FHelp.mergeDeepWith(a, b)).toEqual({
      a: 'too',
      b: 'bar',
      c: 'baz',
      d: [
        [1, 2, 3],
        { a: 1, b: 2 },
        null,
        '123',
        [4, 5, 6],
        { c: 1, d: 2 },
        undefined,
        '123'
      ],
      e: '000',
      f: '000'
    });
  });

  test('测试 FHelp.T 和 FHelp.F', () => {
    expect(FHelp.T()).toBeTrue();
    expect(FHelp.F()).toBeFalse();
  });

  test('测试 FHelp.clamp', () => {
    const arr = Mock.mock({
      'array|20-30': [
        Random.integer(0, 10)
      ]
    }).array;
    const fn = () => Math.random() * 50;
    for (const val of arr) {
      let min = fn();
      let max = fn();
      let z = 0;
      if (min > max) {
        z = max;
        max = min;
        min = z;
      }
      let value = FHelp.clamp(min, max, val);
      expect(min <= value && value <= max).toBeTrue();
      value = FHelp.clamp(max, min, val);
      expect(min <= value && value <= max).toBeTrue();
    }
  });

  test('测试 FHelp.defaultTo', () => {
    const maps = [
      [10, null, 10],
      [10, undefined, 10],
      [10, false, false],
      [10, NaN, 10],
      [10, {}, {}],
      [10, Number, Number]
    ];
    for (const map of maps) {
      expect(FHelp.defaultTo(map[0], map[1])).toEqual(map[2]);
    }
  });

  test('测试 FHelp.sayHello', () => {
    const log = global.console.log;
    global.console.log = jest.fn(() => null);
    expect(() => FHelp.sayHello()).not.toThrow();
    global.console.log = log;
  });
});

describe('utils/event.js - EEvent - 单元测试', () => {
  test('测试 EEvent, EEvent[key]=symbol', () => {
    for (const key in EEvent) {
      expect(EEvent[key]).toBeSymbol();
    }
  });
});

describe('utils/index.js - FLogger - 单元测试', () => {
  test('测试 index.js 的导出', () => {
    const modules = require('../../lib/utils/index.js');
    expect(modules).toBeObject();
    for (const key in modules) {
      expect(modules[key]).toBeFunction();
    }
  });
});
