import type { DefaultTheme } from 'vitepress';
import { defineConfig } from 'vitepress';
import { version } from '../../package.json'

export default defineConfig({
  lang: 'zh-cn',
  // 站点级选项
  title: 'wlLive2d',
  description: 'wlLive2d 是一个运行在浏览器环境的 Live2D 看板组件，支持从 model2 与 model4 版本的 Live2D 模型，开箱即用且可定制化',
  head: [['link', { rel: 'icon', href: '/img/favicon.png' }]],
  lastUpdated: true,
  markdown: { lineNumbers: true },
  // 主题级选项
  themeConfig: {
    logo: '/img/favicon.png',
    search: { provider: 'local' },
    // 目录
    outline: {
      level: [2, 3] // 显示 h2 到 h3 的标题
    },
    footer: { copyright: '©️ MIT License' },
    lastUpdated: {
      text: '上次更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/wonder-light/wl-live2d' }],
    nav: [
      { text: '指南', link: '/guide', activeMatch: '/guide/(?!models)' },
      { text: '参考', link: '/refer/options/', activeMatch: '/refer/' },
      { text: '模型资源', link: '/guide/models' },
      { text: '关于', link: '/about' },
      { text: 'v' + version, link: '/CHANGELOG' }
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
            { text: '在vitepress中使用', link: '/guide/vitepress' }
          ]
        },
        {
          text: '扩展', items: [
            { text: '模型资源', link: '/guide/models' }
          ]
        }
      ],
      '/refer/': [
        {
          text: '配置选项', items: [
            { text: '公共', link: '/refer/options/' },
            { text: '模型', link: '/refer/options/model' },
            { text: '提示框', link: '/refer/options/tip' },
            { text: '消息', link: '/refer/options/message' }
          ]
        },
        {
          text: '控制器', items: [
            { text: 'live2d', link: '/refer/control/' },
            { text: '模型', link: '/refer/control/model' },
            { text: '舞台', link: '/refer/control/stage' },
            { text: '提示框', link: '/refer/control/tips' }
          ]
        },
        {
          text: '插件', items: [
            { text: 'Base', link: '/refer/plugin/' }
          ]
        }
      ]
    }
  } as DefaultTheme.Config
});
