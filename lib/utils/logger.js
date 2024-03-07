/**
 * @class
 * @classdesc 日志类
 * @memberof module:utils
 * @alias FLogger
 */
export class FLogger {

  /**
   * > 格式化打印文本
   *
   * |      占位符     |           作用         |
   * |----------------|-----------------------|
   * |       %s       |       字符串           |
   * |       %d       |       整数             |
   * |       %i       |       整数             |
   * |       %f       |       浮点数           |
   * |       %o       |       对象             |
   * |       %O       |       列出对象的属性     |
   * |       %c       |       后面字符串的样式   |
   * @param {any[]} text 需要对应的数组
   * @param {'debug'|'info'|'log'|'trace'|'warn'|'error'} level 需要对应的数组
   * @return {any[]} 格式数组
   * @static
   * @private
   */
  static #format(text, level) {
    // 需要打印为字符串的类型
    let inc = ['undefined', 'boolean', 'number', 'string', 'bigint'];
    // 日志等级对应的颜色
    let color = ({
      debug: '#35e7ff', info: '#59ff8e', log: '#000000',
      trace: '#3142ff', warn: '#ffcc2c', error: '#fd2b2b'
    })[level];
    // 格式化字符串
    let out = [];
    // 对应的样式
    let style = [];
    for (let el of text) {
      if (inc.indexOf(typeof el) >= 0) {
        out.push(`%c${ el }`);
        style.push(`background: #ececec;color:${ color };border-left: 4px solid #fa3c6f;padding: 8px 30px;font-size: 1em;`);
      }
      else {
        out.push(`%o`);
        style.push(el);
      }
      // 进行换行
      out.push(`%c\n\n`);
      style.push('');
    }
    style.splice(0, 0, out.join(''));
    return style;
  }

  /**
   * 打印日志
   * @param {...any[]} arg 数组参数
   * @static
   */
  static log(...arg) {
    console.log(...FLogger.#format(arg, 'log'));
  }

  /**
   * 打印日志
   * @param {...any[]} arg 数组参数
   * @static
   */
  static trace(...arg) {
    console.trace(...FLogger.#format(arg, 'trace'));
  }

  /**
   * 打印信息
   * @param {...any[]} arg 数组参数
   * @static
   */
  static info(...arg) {
    console.info(...FLogger.#format(arg, 'info'));
  }

  /**
   * 打印调试信息
   * @param {...any[]} arg 数组参数
   * @static
   */
  static debug(...arg) {
    console.debug(...FLogger.#format(arg, 'debug'));
  }

  /**
   * 打印警告消息
   * @param {...any[]} arg 数组参数
   * @static
   */
  static warn(...arg) {
    console.warn(...FLogger.#format(arg, 'warn'));
  }

  /**
   * 打印错误消息
   * @param {...any[]} arg 数组参数
   * @static
   */
  static error(...arg) {
    console.error(...FLogger.#format(arg, 'error'));
  }
}
