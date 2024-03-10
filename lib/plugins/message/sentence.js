import { DBaseMessage } from '../../models/index.js';
import { FHelp } from '../../utils/index.js';
import { FBasePlugin } from '../base.js';

/**
 * @class
 * @classdesc 诶人一言插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FSentenceMessagePlugin
 * @see
 *      [一言API]{@link https://developer.hitokoto.cn/sentence/demo.html}
 *
 *      [夏柔-每日一言]{@link https://api.aa1.cn/doc/yiyan.html}
 *
 *      [TenApi-随机一言]{@link https://docs.tenapi.cn/random/yiyan.html#%E9%9A%8F%E6%9C%BA%E4%B8%80%E8%A8%80}
 */
export class FSentenceMessagePlugin extends FBasePlugin {
  /**
   * @inheritDoc
   * @override
   */
  _priority = 20;

  /**
   * 每日一言
   * @type {string}
   * @protected
   */
  _type = 'sentence';

  /**
   * 每日一言使用的消息载体
   * @type {DBaseMessage}
   * @protected
   */
  _message;

  /**
   * 获取每日一言的间隔时间, 单位ms
   * @type {?number}
   * @protected
   * @default 30s
   */
  _interval = 30000;

  /**
   * 时间间隔定时器句柄
   * @protected
   * @type {?number}
   * @default null
   */
  _handler = null;

  /**
   * @inheritDoc
   * @override
   */
  install(options) {
    super.install(options);
    if (!this._enable) {
      return;
    }
    this._message = new DBaseMessage();
    this._message.condition = FHelp.F;
    this._message.priority = this._priority;
    this._message.type = this._type;
    // 经过一定时间 `interval` 才开始
    this._handler = setInterval(this.getSentence.bind(this), this._interval);
    this._live2d.tips.addMessage(this._message);
  }

  /**
   * 是否显示消息的判断函数
   * @return {boolean} true: 显示
   * @this DBaseMessage
   */
  condition() {
    this.condition = FHelp.F;
    return true;
  }

  /**
   * @inheritDoc
   * @override
   */
  uninstall(options) {
    clearInterval(this._handler);
    this._handler = null;
    this._live2d.tips.removeMessage(this._message);
    this._message = null;
  }

  /**
   * 获取每日一言
   * @async
   * @return {Promise<void>}
   */
  async getSentence() {
    try {
      this._message.text = await fetch('https://v1.hitokoto.cn/')
      .then(async response => (await response.json()).hitokoto)
      .catch(() => fetch('https://v.api.aa1.cn/api/yiyan/index.php'))
      .then(async response => (await response.text()).match(/<p>(.*)<\/p>/)[1])
      .catch(() => fetch('https://tenapi.cn/v2/yiyan'))
      .then(async response => await response.text());
      // 获取文本后才设置 condition 返回true
      this._message.condition = this.condition.bind(this._message);
    }
    catch (_) {}
  }
}