import { clamp, defaultTo, groupBy, identical, is, isEmpty, isNil, mergeAll, mergeDeepWith } from 'ramda';

/**
 * @template T
 * @template V
 * @callback FHelp~TParam
 * @param {T} param
 * @return {V}
 */

/**
 * @class
 * @classdesc 帮助类
 * @memberof module:utils
 * @alias FHelp
 * @see 关于ramda请查阅[文档](https://ramda.cn/docs/#)
 */
export class FHelp {
  /**
   * 将多个类混合到基类
   *
   * 基础类上存在的 `key` 不会被其他类覆盖
   * @static
   * @param {ObjectConstructor} base 基类
   * @param {ObjectConstructor} classes 混合类
   * @return {ObjectConstructor} 基类
   */
  static mixin(base, ...classes) {
    if (base?.prototype == null) {
      return base;
    }
    let baseIns = null;
    for (const cls of classes) {
      if (cls?.prototype == null) continue;
      //获取方法
      Object.getOwnPropertyNames(cls.prototype).forEach((key) => {
        if (!base.prototype[key]) {
          base.prototype[key] = cls.prototype[key];
          //克隆源对象键值对目标对象
          //Object.defineProperty(base, key, cls.prototype[key]);
        }
      });
      //获取属性
      const ins = new cls;
      baseIns ??= new base;
      Object.getOwnPropertyNames(ins).forEach((key) => {
        if (!baseIns[key]) {
          base.prototype[key] = ins[key];
          //克隆源对象键值对目标对象
          //Object.defineProperty(base, key, ins[key]);
        }
      });
    }
    return base;
  }

  /**
   * 将多个对象上的属性混合到基础属性里
   *
   * 基础属性上存在的 `key` 不会被其他属性覆盖
   * @param {InstanceType<Object>} base 基础属性
   * @param {InstanceType<Object>} property 其他属性
   * @return {InstanceType<Object>} 基础属性
   */
  static mixinProperty(base, ...property) {
    if (FHelp.isNotValid(base)) {
      return base;
    }
    for (const ins of property) {
      // 使用 prototype 判断
      // class.prototype != null
      // ({}).prototype == null
      if (base.prototype == null && ins && ins.prototype == null) {
        Object.getOwnPropertyNames(ins).forEach((key) => {
          if (!base[key]) {
            base[key] = ins[key];
            //克隆源对象键值对目标对象
            //Object.defineProperty(base, key, ins[key]);
          }
        });
      }
    }
    return base;
  }

  /**
   * 判断给定参数是否有效
   * @static
   * @param {any} param
   * @return {boolean} true: 无效
   * @example
   *       FHelp.isNotValid(null);                //=> true
   *       FHelp.isNotValid(undefined);           //=> true
   *       FHelp.isNotValid(NaN);                 //=> true
   *       FHelp.isNotValid([]);                  //=> true
   *       FHelp.isNotValid('');                  //=> true
   *       FHelp.isNotValid({});                  //=> true
   *       FHelp.isNotValid(Uint8Array.from('')); //=> true
   *       FHelp.isNotValid({length: 0});         //=> false
   *       FHelp.isNotValid([1, 2, 3]);           //=> false
   *       FHelp.isNotValid(0);                   //=> false
   */
  static isNotValid(param) {
    return isNil(param) || identical(param, NaN) || isEmpty(param);
  }

  /**
   * 判断给定参数是否有效
   * @static
   * @param {any} param
   * @return {boolean} true: 有效
   */
  static isValid(param) {
    return !FHelp.isNotValid(param);
  }

  /**
   * 获取随机数
   * @static
   * @param {number} [max=1] 最大值
   * @param {number} [min=0] 最小值
   * @param {'floor'|'ceil'|string} [round=none] 取整
   * @return {number} 随机值
   */
  static random(max = 1, min = 0, round = '') {
    if (min > max) max = min;
    const v = Math.random() * (max - min) + min;
    if (round === 'floor') {
      return Math.floor(v);
    }
    else if (round === 'ceil') {
      return Math.ceil(v);
    }
    return v;
  }

  /**
   * 根据对每个元素调用键返回函数的结果，将列表拆分为存储在对象中的子列表，并根据返回的值对结果进行分组
   * @static
   * @template T
   * @param {FHelp~TParam<T,string|number|Symbol>} fn 分组函数
   * @param {T[]} list
   * @return {Record<string|number|Symbol, T[]>} 一个对象，输出键值为fn，映射到传递给fn时产生该键的元素数组。
   */
  static groupBy(fn, list) {
    return groupBy(fn)(list);
  }

  /**
   * 查看一个对象(例如val)是否是所提供构造函数的实例。这个函数将检查继承链(如果有的话)。
   *
   * 如果val是用Object创建的。create (Object, val) === true
   *
   * @static
   * @param {Object} classes 一个 constructor
   * @param {*} val 值
   * @return {boolean}
   * @example
   *     FHelp.is(Object, {}); //=> true
   *     FHelp.is(Number, 1); //=> true
   *     FHelp.is(Object, 1); //=> false
   *     FHelp.is(String, 's'); //=> true
   *     FHelp.is(String, new String('')); //=> true
   *     FHelp.is(Object, new String('')); //=> true
   *     FHelp.is(Object, 's'); //=> false
   *     FHelp.is(Number, {}); //=> false
   */
  static is(classes, val) {
    return is(classes, val);
  }

  /**
   * 从对象列表中创建一个具有自己属性的新对象。如果一个键存在于多个对象中，则将使用它存在的最后一个对象中的值。
   * @param {*} params
   * @return {*}
   * @example
   *    FHelp.mergeAll({foo:1},{bar:2},{baz:3}); //=> {foo:1,bar:2,baz:3}
   *    FHelp.mergeAll({foo:1},{foo:2},{bar:2}); //=> {foo:2,bar:2}
   */
  static mergeAll(...params) {
    return mergeAll(params);
  }

  /**
   * 合并两个对象的自身属性（不包括 prototype 属性）。如果某个 key 在两个对象中都存在：
   *
   *  - 并且两个关联的值都是对象，则继续递归合并这两个值。
   *  - 否则，使用给定函数对两个值进行处理，并将返回值作为该 key 的新值。
   *
   * 如果某 key 只存在于一个对象中，该键值对将作为结果对象的键值对。
   * @param {*} params
   * @return {*}
   * @example
   *
   *      mergeDeepWith({ a: true, c: { values: [10, 20] }},
   *                    { b: true, c: { values: [15, 35] }});
   *      //=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}
   */
  static mergeDeepWith(...params) {
    let obj = {};
    for (const param of params) {
      obj = mergeDeepWith(concatValue, obj, param);
    }
    return obj;

    function concatValue(a, b) {
      if (is(Array, a) && is(Array, b)) {
        return a.concat(b);
      }
      return b;
    }
  }

  /**
   * 一个总是返回“true”的函数。任何传入的参数都将被忽略
   * @return {boolean}
   * @static
   * @example
   *      FHelp.F(); //=> true
   */
  static T() {
    return true;
  }

  /**
   * 一个总是返回“false”的函数。任何传入的参数都将被忽略
   * @return {boolean}
   * @static
   * @example
   *      FHelp.F(); //=> false
   */
  static F() {
    return false;
  }

  /**
   * 将 number 限制在某个范围内
   *
   * 也适用于其他有序类型，如字符串和日期
   *
   * @static
   * @param {Number} min clamp 的最小值 (包括 min)
   * @param {Number} max clamp 的最大值 (包括 max)
   * @param {Number} value 值
   * @return {Number} 当 `val < min` 时返回 `min`, 当 `val > max` 时返回 `max`, 否则返回 `value`
   * @example
   *      R.clamp(1, 10, -5) // => 1
   *      R.clamp(1, 10, 15) // => 10
   *      R.clamp(1, 10, 4)  // => 4
   */
  static clamp(min, max, value) {
    if (min > max) max = min;
    return clamp(min, max, value);
  }

  /**
   * 如果第二个参数不是 null、undefined 或 NaN，则返回第二个参数，否则返回第一个参数（默认值）
   *
   * @static
   * @template T
   * @template V
   * @param {T} def 默认值
   * @param {V} val `val` 当前值
   * @return {T|V} `val` 或者 `def`
   * @example
   *      defaultTo(42, null);  //=> 42
   *      defaultTo(42, undefined);  //=> 42
   *      defaultTo(42, false);  //=> false
   *      defaultTo(42, 'Ramda');  //=> 'Ramda'
   *      // parseInt('string') results in NaN
   *      defaultTo(42, parseInt('string')); //=> 42
   */
  static defaultTo(def, val) {
    return defaultTo(def, val);
  }
}
