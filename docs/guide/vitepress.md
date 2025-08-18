# 在 VitePress 项目中使用

在 VitePress 中我们可以使用动态导入的形式在主题配置中来使用 `wl-live2d`

## 安装

首先在 VitePress 项目中安装 `wl-live2d`

```shell
npm install wl-live2d@latest
```

## 使用

::: warning
使用时注意需要判断环境变量已确保编译打包时的环境为非服务端
:::

之后需要手动创建 `.vitepress/theme/index.js` 文件, 并以如下方式使用:

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';

export default {
  extends: DefaultTheme,
  async enhanceApp() {
    if (!import.meta.env.SSR) {
      const { wlLive2d } = await import('wl-live2d');
      wlLive2d({
        models: [
          {
            path: 'https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2/yiselin/model.json',
            scale: 0.7
          },
          {
            path: 'https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%20girls%20Frontline/live2dold/old/kp31/normal/model.json',
            scale: 0.5
          }
        ]
      });
    }
  }
};
```

如需自定义配置, 请在[配置选项](../refer/options/)中查阅详细配置内容
