import { FHelp } from '../utils/index.js';

/**
 * @class
 * @summary 提示数据类
 * @classdesc 提示数据集合, 用于存储提示数据, 以及消息数据
 * @memberof module:modules
 * @alias DTips
 */
export class DTips {
  /**
   * 提示框最小宽度, 单位 px
   * @summary 最小宽度
   * @type {?number}
   * @default 230
   */
  minWidth;

  /**
   * 提示框最小高度, 单位 px
   * @summary 最小高度
   * @type {?number}
   * @default 100
   */
  minHeight;

  /**
   * 调整提示框位于舞台中的 x 轴方向偏移量
   * @summary x 偏移量
   * @type {?number}
   * @default 0
   */
  offsetX;

  /**
   * 调整提示框位于舞台中的 y 轴方向偏移量
   * @summary y 偏移量
   * @type {?number}
   * @default 0
   */
  offsetY;

  /**
   * 提示框显示时的持续时间, 单位 ms
   * @summary 持续时间
   * @type {?number}
   * @default 3000
   */
  duration;

  /**
   * 提示框隐藏时的持续时间, 单位 ms
   * @summary 隐藏时间
   * @type {?number}
   * @default 5000
   */
  interval;

  /**
   * 播放的消息内容, 需要是一个字符串数组, 播放时会从中随机取出一条进行提示, 空数组则不播放, 默认为空数组
   * @summary 消息数组
   * @type {?(DMessage[])}
   * @default []
   * @example
   * [
   *   {
   *     "text": "好久不见，日子过得好快呢……"
   *   },
   *   {
   *     "text": "大坏蛋！你都多久没理人家了呀，嘤嘤嘤～"
   *   },
   *   {
   *     "type": "seasons",
   *     "date": "01/01",
   *     "text": "<span>元旦</span>了呢，新的一年又开始了，今年是{year}年～"
   *   },
   *   {
   *     "type": "hour",
   *      "hour": "6-7",
   *      "text": "早上好！一日之计在于晨，美好的一天就要开始了～"
   *   },
   *   {
   *     "type": "event",
   *     "event": "console",
   *     "text": "哈哈，你打开了控制台，是想要看看我的小秘密吗？"
   *   },
   * ]
   */
  message;

  /**
   * 如果是 true, 则启用 tips 元素的拖拽, 否则不启用拖拽
   * @summary 启用拖拽
   * @type {?boolean}
   * @default true
   */
  drag;

  /**
   * true: 启用随机说话
   * @summary 随机说话
   * @type {?boolean}
   * @default true
   */
  talk;

  /**
   * 随机说话的时间间隔, 单位 ms
   * @summary 说话间隔
   * @type {?number}
   * @default 30s
   */
  talkInterval;

  /**
   * 用于存储 url 以及处理 talk 结果的对象
   * @summary talk api 对象
   * @type {?(TTalkApi[])}
   * @default []
   * @example
   * [
   *   {
   *     url: 'https://v1.hitokoto.cn/',
   *     handle: async (res) => (await res.json()).hitokoto
   *   },
   *   {
   *     url: 'https://v.api.aa1.cn/api/yiyan/index.php',
   *     handle: async (res) => (await res.text()).match(/<p>(.*)<\/p>/)[1]
   *   },
   *   {
   *     url: 'https://tenapi.cn/v2/yiyan',
   *     handle: async res => await res.text()
   *   }
   * ]
   */
  talkApis;

  /**
   * 控制是否启用 motion 消息, true: 启用, false: 关闭
   * @summary 启用 motion 消息
   * @type {?boolean}
   * @default true
   */
  motionMessage;

  /**
   * 创建提示数据实例
   * @summary 提示数据构造
   * @hideconstructor
   * @param {DTips | null} [data=null] 提示数据
   */
  constructor(data = null) {
    FHelp.mixinProperty(this, data);
    this.minWidth = data?.minWidth ?? 230;
    this.minHeight = data?.minHeight ?? 100;
    this.offsetX = data?.offsetX ?? 0;
    this.offsetY = data?.offsetY ?? 0;
    this.duration = data?.duration ?? 3000;
    this.interval = data?.interval ?? 5000;
    this.message = data?.message ?? [];
    this.drag = data?.drag ?? true;
    this.talk = data?.talk ?? true;
    this.talkInterval = data?.talkInterval ?? 30000;
    this.talkApis = data?.talkApis ?? [];
    this.motionMessage = data?.motionMessage ?? true;
  }
}
