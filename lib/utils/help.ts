import { clamp, defaultTo, groupBy, identical, is, isEmpty, isNil, mergeAll, mergeDeepWith } from 'ramda';
import type { TConstructor, TGroupFun, TInstanceType } from '../types';


/**
 * @class
 * @summary 辅助类
 * @classdesc 为常用操作提供的实用函数库
 * @hideconstructor
 * @memberof module:utils
 * @alias FHelp
 * @see 关于 ramda 请查阅[文档](https://ramda.cn/docs/#)
 */
export class FHelp {
  /**
   * 将多个类混合到基类
   *
   * 基础类上存在的 `key` 不会被其他类覆盖
   * @summary 混合类型
   * @param {ObjectConstructor} base 基类
   * @param {...ObjectConstructor} classes 混合类
   * @return {TConstructor} 基类
   * @static
   */
  public static mixin(base: TConstructor, ...classes: TConstructor[]): TConstructor {
    if (base?.prototype == null) {
      return base;
    }
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
      const baseIns = new base;
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
   * @summary 混合属性
   * @param {InstanceType<Object>} base 基础属性
   * @param {...InstanceType<Object>} property 其他属性
   * @return {InstanceType<Object>} 基础属性
   * @static
   */
  public static mixinProperty(base: TInstanceType, ...property: TInstanceType[]): TInstanceType {
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
   * @summary 参数无效
   * @param {any} param
   * @return {boolean} true: 无效
   * @static
   * @example
   * FHelp.isNotValid(null);                //=> true
   * FHelp.isNotValid(undefined);           //=> true
   * FHelp.isNotValid(NaN);                 //=> true
   * FHelp.isNotValid([]);                  //=> true
   * FHelp.isNotValid('');                  //=> true
   * FHelp.isNotValid({});                  //=> true
   * FHelp.isNotValid(Uint8Array.from('')); //=> true
   * FHelp.isNotValid({length: 0});         //=> false
   * FHelp.isNotValid([1, 2, 3]);           //=> false
   * FHelp.isNotValid(0);                   //=> false
   */
  public static isNotValid(param: any): boolean {
    return isNil(param) || identical(param, NaN) || isEmpty(param);
  }

  /**
   * 判断给定参数是否有效
   * @summary 参数有效
   * @param {any} param
   * @return {boolean} true: 有效
   * @static
   * @example
   * FHelp.isValid(value) // => !FHelp.isNotValid(value)
   */
  public static isValid(param: any): boolean {
    return !FHelp.isNotValid(param);
  }

  /**
   * 获取 min 到 max 之间的随机数
   * @summary 范围随机值
   * @param {number} [min=0] 最小值
   * @param {number} [max=1] 最大值
   * @param {'floor'|'ceil'|null} [round=null] 取整
   * @return {number} 随机值
   * @static
   * @example
   * FHelp.random(0.5, 10, null)    // => [0.5, 10) 0.5<=x<10 之间的任意数
   * FHelp.random(0.5, 10, 'floor') // => [0, 9] 0-9 之间的整数
   * FHelp.random(0.5, 10, 'ceil')  // => [1, 10] 1-10 之间的整数
   */
  public static random(min: number = 0, max: number = 1, round: 'floor' | 'ceil' | null = null): number {
    if (min > max) max = min;
    const v = Math.random() * (max - min) + min;
    if (round === 'floor') {
      return Math.floor(v);
    } else if (round === 'ceil') {
      return Math.ceil(v);
    }
    return v;
  }

  /**
   * 根据对每个元素调用键返回函数的结果，将列表拆分为存储在对象中的子列表，并根据返回的值对结果进行分组
   * @summary 分组
   * @template {any} T 数组类型
   * @template {string} K key 类型
   * @param {TGroupFun<T, K>} fn 分组函数
   * @param {T[]} list 数据集
   * @return {Partial<Record<K, T[]>>} 一个对象，输出键值为fn，映射到传递给fn时产生该键的元素数组。
   * @static
   * @example
   * const byGrade = function(student) {
   *   const score = student.score;
   *   return score < 65 ? 'F' :
   *          score < 70 ? 'D' :
   *          score < 80 ? 'C' :
   *          score < 90 ? 'B' : 'A';
   * };
   * const students = [{name: 'Abby', score: 84},
   *                   {name: 'Eddy', score: 58},
   *                   // ...
   *                   {name: 'Jack', score: 69}];
   * FHelp.groupBy(byGrade, students);
   * // {
   * //   'A': [{name: 'Dianne', score: 99}],
   * //   'B': [{name: 'Abby', score: 84}]
   * //   // ...,
   * //   'F': [{name: 'Eddy', score: 58}]
   * // }
   */
  public static groupBy<T, K extends string>(fn: TGroupFun<T, K>, list: T[]): Partial<Record<K, T[]>> {
    return groupBy(fn)(list);
  }

  /**
   * 查看一个对象(例如val)是否是所提供构造函数的实例。这个函数将检查继承链(如果有的话)。
   *
   * 如果val是用Object创建的。create (Object, val) === true
   *
   * @summary 判断 val 是否是 classes 的子类实例
   * @template T class的类型
   * @param {T} classes class的类型
   * @param {any} val class的实例
   * @return {boolean}
   * @static
   * @example
   * FHelp.is(Object, {}); //=> true
   * FHelp.is(Number, 1); //=> true
   * FHelp.is(Object, 1); //=> false
   * FHelp.is(String, 's'); //=> true
   * FHelp.is(String, new String('')); //=> true
   * FHelp.is(Object, new String('')); //=> true
   * FHelp.is(Object, 's'); //=> false
   * FHelp.is(Number, {}); //=> false
   */
  public static is<T extends TConstructor>(classes: T, val: any): val is InstanceType<T> {
    return is(classes, val);
  }

  /**
   * 从对象列表中创建一个具有自己属性的新对象。如果一个键存在于多个对象中，则将使用它存在的最后一个对象中的值。
   * @summary 深度合并
   * @param {...any} params
   * @return {any}
   * @static
   * @example
   * FHelp.mergeAll({foo:1},{bar:2},{baz:3}); //=> {foo:1,bar:2,baz:3}
   * FHelp.mergeAll({foo:1},{foo:2},{bar:2}); //=> {foo:2,bar:2}
   */
  public static mergeAll(...params: any[]): any {
    return mergeAll(params);
  }

  /**
   * 合并两个对象的自身属性（不包括 prototype 属性）。如果某个 key 在两个对象中都存在：
   *
   *  - 并且两个关联的值都是对象，则继续递归合并这两个值。
   *  - 否则，使用给定函数对两个值进行处理，并将返回值作为该 key 的新值。
   *
   * 如果某 key 只存在于一个对象中，该键值对将作为结果对象的键值对。
   * @summary 深度合并
   * @param {...any} params
   * @return {any}
   * @static
   * @example
   * mergeDeepWith({ a: true, c: { values: [10, 20] }},
   *               { b: true, c: { values: [15, 35] }});
   * //=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}
   */
  public static mergeDeepWith(...params: any[]): any {
    let obj = {};
    for (const param of params) {
      obj = mergeDeepWith(concatValue, obj, param);
    }
    return obj;

    function concatValue(a: any[], b: any) {
      if (is(Array, a) && is(Array, b)) {
        return a.concat(b);
      }
      return b;
    }
  }

  /**
   * 一个总是返回 `true` 的函数。任何传入的参数都将被忽略
   * @summary True 回调
   * @return {true}
   * @static
   * @example
   * FHelp.F(); //=> true
   */
  static T(): true {
    return true;
  }

  /**
   * 一个总是返回 `false` 的函数。任何传入的参数都将被忽略
   * @summary False 回调
   * @return {false}
   * @static
   * @example
   * FHelp.F(); //=> false
   */
  public static F(): false {
    return false;
  }

  /**
   * 将 number 限制在某个范围内
   *
   * 也适用于其他有序类型，如字符串和日期
   *
   * @summary 限制范围
   * @param {number} min clamp 的最小值 (包括 min)
   * @param {number} max clamp 的最大值 (包括 max)
   * @param {number} value 值
   * @return {number} 当 `val < min` 时返回 `min`, 当 `val > max` 时返回 `max`, 否则返回 `value`
   * @static
   * @example
   * FHelp.clamp(1, 10, -5) // => 1
   * FHelp.clamp(1, 10, 15) // => 10
   * FHelp.clamp(1, 10, 4)  // => 4
   */
  public static clamp(min: number, max: number, value: number): number {
    if (min > max) max = min;
    return clamp(min, max, value);
  }

  /**
   * 如果第二个参数不是 null、undefined 或 NaN，则返回第二个参数，否则返回第一个参数（默认值）
   *
   * @summary 默认值
   * @template T 默认值类型
   * @template V 参数类型
   * @param {T} def 默认值
   * @param {V} val 当前值
   * @return {T | V} `val` 无效则是 `def`, 否则是 `val`
   * @static
   * @example
   * FHelp.defaultTo(42, null);  //=> 42
   * FHelp.defaultTo(42, undefined);  //=> 42
   * FHelp.defaultTo(42, false);  //=> false
   * FHelp.defaultTo(42, 'Ramda');  //=> 'Ramda'
   * // parseInt('string') results in NaN
   * FHelp.defaultTo(42, parseInt('string')); //=> 42
   */
  public static defaultTo<T, V>(def: T, val: V): T | V {
    return defaultTo(def, val);
  }

  /**
   * 在初始化阶段打印项目信息
   * @summary 打印信息
   * @static
   */
  public static sayHello() {
    const params = [
      '\n',
      '%c🎉🎉🎉' +
      '%c ✨ wl-live2d v1.0.4 - 欢迎你的使用 !! ✨ ' +
      '%c🎉🎉🎉',
      `%c\n\n`
    ];
    const format = [
      `background: linear-gradient(to right, #ff00cc, #ffcc00);padding: 8px 30px;font-size: 1em;`,
      `background: linear-gradient(to right, #ff4fa9, #ffa233) text, linear-gradient(to right, #ffcc00, #6fff66, #00ffcc) border-box;color: transparent;padding: 8px 30px;font-size: 1em;`,
      `background: linear-gradient(to right, #00ffcc, #ff00cc);padding: 8px 30px;font-size: 1em;`,
      ``
    ];
    console.log(params.join(''), ...format);
  }
}
