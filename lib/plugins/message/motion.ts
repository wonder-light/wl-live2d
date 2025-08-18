import { EEvent, FHelp } from '../../utils';
import { FBasePlugin } from '../base';

/**
 * @class
 * @summary motion 消息
 * @classdesc 模型触发 motion 时的消息提示插件
 * @hideconstructor
 * @extends {FBasePlugin}
 * @memberof module:plugins
 * @alias FMotionMessagePlugin
 */
export class FMotionMessagePlugin extends FBasePlugin {
  /**
   * @default 'motionMessage'
   * @override
   */
  public override readonly name = 'motionMessage';

  /**
   * @default 22
   * @override
   */
  public override priority: number = 22;

  /**
   * @override
   * @listens EEvent#motionStart 模型运动开始事件
   */
  public override install(): void {
    if (!this.live2d.tips.data.motionMessage) return;
    this.live2d.event.on(EEvent.motionStart, this.motion, this);
  }

  /**
   * @override
   */
  public override uninstall(): void {
    this.live2d.event.off(EEvent.motionStart, this.motion, this);
  }

  /**
   * 当 motion 开始时显示对应的消息
   * @summary 通知 motion 消息
   * @param {string} group motion 分组名
   * @param {number} index motion 分组中的索引
   * @param {HTMLAudioElement | null} audio 音频元素
   * @async
   */
  public async motion(group: string, index: number, audio: HTMLAudioElement | null): Promise<void> {
    // 不包括 idle
    if (/idle/.test(group)) return;
    const { tips, model } = this.live2d;
    /** @type {ModelJSON} */
    const json: any = model.model.internalModel.settings.json;
    const motions = json?.motions || json?.FileReferences?.Motions;
    const text = motions?.[group]?.[index]?.text;
    if (FHelp.isNotValid(text)) return;
    // 设置持续时间
    const old = tips.duration;
    const pre = FHelp.isValid(audio) ? audio!.duration * 1000 : old;
    tips.data.duration = Math.max(pre, old);
    await tips.notify(text).finally(() => tips.data.duration = old);
  }
}
