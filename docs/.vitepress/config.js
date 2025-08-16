import { defineConfig } from 'vitepress';

export default defineConfig({
  // 站点级选项
  title: 'wl-live2d',
  description: 'wlLive2d 是一个运行在浏览器环境的 Live2D 看板组件，支持从 model2 与 model4 版本的 Live2D 模型，开箱即用且可定制化',
  // 主题级选项
  themeConfig: {
    // 目录
    outline: {
      level: [2, 3] // 显示 h2 到 h3 的标题
    }
  }
});
