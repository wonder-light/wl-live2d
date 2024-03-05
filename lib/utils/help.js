/**
 * @class
 * @classdesc 帮助类
 * @memberof module:utils
 * @alias FHelp
 */
class FHelp {
  /**
   * 将多个类混合到基类
   * @template {new()=>{}} T
   * @param {T} base
   * @param {T} classes
   * @return {T}
   * @static
   */
  static mixin(base, ...classes) {
    for (const cls of classes) {
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
      Object.getOwnPropertyNames(ins).forEach((key) => {
        if (!base.prototype[key]) {
          base.prototype[key] = ins[key];
          //克隆源对象键值对目标对象
          //Object.defineProperty(base, key, ins[key]);
        }
      });
    }
    return base;
  }

}
