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
   * 插件名称
   * @protected
   * @type {string}
   * @default 'motionMessage'
   * @override
   */
  _name = 'motionMessage';

  /**
   * 插件优先级
   * @type {number}
   * @default 22
   * @protected
   * @override
   */
  _priority = 22;

  /**
   * 插件安装函数
   * @param {ULive2dController} live2d 插件选项控制器
   * @return {void}
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
   * 插件卸载函数
   * @param {ULive2dController} live2d 插件选项控制器
   * @return {void}
   * @override
   */
  uninstall(live2d) {
    if (!this._enable) {
      return;
    }
    this._live2d.event.off(EEvent.motionStart, this.motion, this);
  }

  /**
   * 判断插件是否启用
   * @return {boolean} true: 启用
   * @override
   */
  isEnable() {
    return true;
  }


  /**
   * motion开始时显示对应的消息
   * @param {string} group motion 分组名
   * @param {number} index 分组中的索引
   * @param {?HTMLAudioElement} audio 音频元素
   * @async
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