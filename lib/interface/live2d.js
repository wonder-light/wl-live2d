/**
 * @interface
 */
class IBaseLive2d {
  /**
   * 创建 ULive2d 的一个实例
   * @param {?DBaseLive2dOptions} options live2d选项
   * @return {ULive2d} 返回 ULive2d 的一个实例
   */
  static create(options);

  /**
   * 加载live2d模型
   * @async
   * @return {Promise<void>}
   */
  async loadModel() ;
}
