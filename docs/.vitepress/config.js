import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-cn',
  // 站点级选项
  title: 'wlLive2d',
  description: 'wlLive2d 是一个运行在浏览器环境的 Live2D 看板组件，支持从 model2 与 model4 版本的 Live2D 模型，开箱即用且可定制化',
  lastUpdated: true,
  markdown: {
    lineNumbers: true
  },
  // 主题级选项
  themeConfig: {
    logo: '/img/favicon.png',
    search: {
      provider: 'local'
    },
    // 目录
    outline: {
      level: [2, 3] // 显示 h2 到 h3 的标题
    },
    footer: {
      copyright: '©️ MIT License'
    },
    nav: [
      { text: '指南', link: '/guide', activeMatch: '/guide/(?!models)' },
      { text: '选项', link: '/options', activeMatch: '/options/' },
      {
        text: '使用示例',
        items: [
          { text: 'Item A', link: '/item-1' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' }
        ]
      },
      { text: '模型资源', link: '/guide/models' },
      { text: '关于', link: '/about' },
      { text: '更新日志', link: '/CHANGELOG' }
    ],
    sidebar: {
      '/': [
        {
          text: '简介', items: [
            { text: '快速入门', link: '/guide/' },
            { text: '组件加载', link: '/guide/loading' }
          ]
        },
        {
          text: '使用示例', items: [
            { text: '公共选项', link: '/guide/example' }
          ]
        },
        {
          text: '扩展', items: [
            { text: '模型资源', link: '/guide/models' }
          ]
        }
      ],
      '/options/': [
        {
          text: '配置选项', items: [
            { text: '公共选项', link: '/options/' },
            { text: '模型选项', link: '/options/model' },
            { text: '提示框选项', link: '/options/tip' },
            { text: '插件选项', link: '/options/plugin' }
          ]
        },
        {
          text: '实例对象', items: [
            { text: '属性', link: '/options/property' },
            { text: '方法', link: '/options/method' },
            { text: '事件', link: '/options/event' }
          ]
        }
      ]
    }
  }
});
