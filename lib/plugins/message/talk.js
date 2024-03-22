import { DMessage } from '../../models/index.js';
import { FHelp } from '../../utils/index.js';
import { FBasePlugin } from '../base.js';

/**
 * @class
 * @summary 随机消息
 * @classdesc 用于获取随机消息的消息提示插件
 * @hideconstructor
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FTalkMessagePlugin
 * @see
 * > [一言API]{@link https://developer.hitokoto.cn/sentence/demo.html}
 * >>
 * > [夏柔-每日一言]{@link https://api.aa1.cn/doc/yiyan.html}
 * >>
 * > [TenApi-随机一言]{@link https://docs.tenapi.cn/random/yiyan.html#%E9%9A%8F%E6%9C%BA%E4%B8%80%E8%A8%80}
 */
export class FTalkMessagePlugin extends FBasePlugin {
  /**
   * @default 'sentenceMessage'
   * @override
   */
  _name = 'sentenceMessage';

  /**
   * @default 20
   * @override
   */
  _priority = 20;

  /**
   * 消息数据对应的类型
   * @summary 消息类型
   * @type {string}
   * @default 'talk'
   * @protected
   */
  _type = 'talk';

  /**
   * 获取的随机消息所使用的消息载体
   * @summary 随机消息
   * @type {DMessageExtend}
   * @protected
   */
  _message;

  /**
   * 时间间隔定时器 id
   * @summary 定时器 id
   * @protected
   * @type {?number}
   * @default null
   */
  _handler = null;

  /**
   * 用于存储 url 以及处理 talk 结果的对象
   * @summary talk api 对象
   * @type {TTalkApi[]}
   * @default []
   * @protected
   */
  _talkApis = [];

  /**
   * @override
   */
  install(live2d) {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    this._message = new DMessage();
    this._message.condition = FHelp.F;
    this._message.priority = this._priority * 2;
    this._message.type = this._type;
    this._talkApis = [
      {
        url: 'https://v1.hitokoto.cn/',
        handle: async (res) => /** @type {string} */(await res.json()).hitokoto
      },
      {
        url: 'https://v.api.aa1.cn/api/yiyan/index.php',
        handle: async (res) => (await res.text()).match(/<p>(.*)<\/p>/)[1]
      },
      {
        url: 'https://tenapi.cn/v2/yiyan',
        handle: async res => await res.text()
      }
    ];
    // 经过一定时间 `interval` 才开始
    const { talkInterval, talkApis } = this._live2d.tips.data;
    if (talkApis.length <= 0) {
      talkApis.push(...this._talkApis);
    }
    this._handler = setInterval(this.getTalkValue.bind(this), talkInterval);
  }

  /**
   * @override
   */
  uninstall(live2d) {
    if (!this._enable) {
      return;
    }
    clearInterval(this._handler);
    this._handler = null;
    this._live2d.tips.removeMessage(this._message);
    this._message = null;
    // 删除默认的 talk api 对象
    const { talkApis } = this._live2d.tips.data;
    for (const talkApi of this._talkApis) {
      let index = talkApis.indexOf(talkApi);
      if (index >= 0) {
        talkApis.splice(index, 1);
      }
    }
  }

  /**
   * @override
   */
  isEnable() {
    return this._live2d.tips.data.talk;
  }

  /**
   * 消息实例的判断函数, 用于判断是否显示消息
   * @summary 条件判断
   * @param {UTipsController} tips tips 控制器
   * @return {boolean} true: 可以显示该消息
   * @this DMessageExtend
   */
  condition(tips) {
    this.condition = FHelp.F;
    tips.removeMessage(this);
    return true;
  }

  /**
   * 间隔一定时间后获获取随机文本, 并将该消息添加到 tips 的消息集中
   * @summary 获取随机文本
   * @return {Promise<void>}
   * @async
   */
  async getTalkValue() {
    const { talkApis } = this._live2d.tips.data;
    try {
      for (const api of talkApis) {
        try {
          const response = await fetch(api.url, api.init);
          if (!response.ok) continue;
          this._message.text = await api.handle(response);
          break;
        }
        catch (_) {}
      }
      // 获取文本后才设置 condition 返回true
      this._message.condition = this.condition.bind(this._message, this._live2d.tips);
      this._live2d.tips.addMessage(this._message);
    }
    catch (_) {}
  }
}
