import { isEmpty, isNil } from 'ramda';

/**
 * @class
 * @classdesc 帮助类
 * @memberof module:utils
 * @alias FHelp
 */
export class FHelp {
  /**
   * 将多个类混合到基类
   * @param {TConstructor} base 基类
   * @param {boolean} [overview=false] 覆盖基类属性
   * @param {TConstructor} classes 混合类
   * @return {TConstructor} 基类
   * @static
   */
  static mixin(base, overview, ...classes) {
    for (const cls of classes) {
      //获取方法
      Object.getOwnPropertyNames(cls.prototype).forEach((key) => {
        if (overview || !base.prototype[key]) {
          base.prototype[key] = cls.prototype[key];
          //克隆源对象键值对目标对象
          //Object.defineProperty(base, key, cls.prototype[key]);
        }
      });

      //获取属性
      const ins = new cls;
      Object.getOwnPropertyNames(ins).forEach((key) => {
        if (overview || !base.prototype[key]) {
          base.prototype[key] = ins[key];
          //克隆源对象键值对目标对象
          //Object.defineProperty(base, key, ins[key]);
        }
      });
    }
    return base;
  }

  /**
   * 将多个类混合到基类
   *
   * 如果某个混合类的 key 在基类中存在, 则采用基类的值
   *
   * @param {TConstructor} base 基类
   * @param {TConstructor} classes 混合类
   * @return {TConstructor} 基类
   */
  static mixinLeft(base, ...classes) {
    return FHelp.mixin(base, false, ...classes);
  }

  /**
   * 将多个类混合到基类
   *
   * 如果某个混合类的 key 在基类中存在, 则采用混合类的值
   *
   * @param {TConstructor} base 基类
   * @param {TConstructor} classes 混合类
   * @return {TConstructor} 基类
   */
  static mixinRight(base, ...classes) {
    return FHelp.mixin(base, true, ...classes);
  }

  /**
   * 判断给定参数是否有效
   * @param {any} param
   * @return {boolean} true: 无效
   */
  static isNotValid(param) {
    return isNil(param) || isNaN(param) || isEmpty(param);
  }

  /**
   * 判断给定参数是否有效
   * @param {any} param
   * @return {boolean} true: 有效
   */
  static isValid(param) {
    return !FHelp.isNotValid(param);
  }
}
