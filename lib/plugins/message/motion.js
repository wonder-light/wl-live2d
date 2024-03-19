import { EEvent, FHelp } from '../../utils/index.js';
import { FBasePlugin } from '../base.js';

/**
 * @class
 * @classdesc 模型触发motion时的消息提示插件
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FMotionMessagePlugin
 */
export class FMotionMessagePlugin extends FBasePlugin {
  /**
   * @inheritDoc
   * @override
   */
  _name = 'motionMessage';

  /**
   * @inheritDoc
   * @override
   */
  _priority = 22;

  /**
   * 每日一言
   * @type {string}
   * @protected
   */
  _type = 'motion';

  /**
   * @inheritDoc
   * @override
   * @listens EEvent#motionStart
   */
  install(live2d) {
    super.install(live2d);
    if (!this._enable) {
      return;
    }
    this._live2d.event.on(EEvent.motionStart, this.motion, this);
  }

  /**
   * @inheritDoc
   * @override
   */
  uninstall(live2d) {
    if (!this._enable) {
      return;
    }
    this._live2d.event.off(EEvent.motionStart, this.motion, this);
  }

  /**
   * @inheritDoc
   * @override
   */
  isEnable() {
    return true;
  }


  /**
   * motion开始时显示对应的消息
   * @async
   * @param {string} group motion 分组名
   * @param {number} index 分组中的索引
   * @param {?HTMLAudioElement} audio 音频元素
   */
  async motion(group, index, audio) {
    // 不包括 idle
    if (/idle/.test(group)) return;
    const { tips, model } = this._live2d;
    /** @type {ModelJSON} */
    const json = model.model.internalModel.settings.json;
    const motions = json.motions || json.FileReferences.Motions;
    const text = motions[group][index].text;
    if (FHelp.isNotValid(text)) return;
    // 设置持续时间
    const old = tips.duration;
    const pre = FHelp.isValid(audio) ? audio.duration * 1000 : old;
    tips.data.duration = Math.max(pre, old);
    await tips.notify(text).finally(() => tips.data.duration = old);
  }
}
