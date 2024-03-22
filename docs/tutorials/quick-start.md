`wlLive2D` 是一个应用于 `Web` 环境的 `Live2D` 模型看板组件。

`wlLive2D` 的初衷时未来解决 `live23d` 入以及使用和学习成本较高的缺点。下载他提供了多种导入方式，以及更方便的自定义配置的API，并且无需再导入其它任何依赖。

## Live2D 是什么?

更多内容请前往：[Live2D 官方网站](https://www.live2d.com/)

## 快速开始

你可以通过 `wlLive2d` 方法加载组件至 body 中, 或者通过 `selector` 选项为其指定一个父元素

### 安装

```bash
# npm
npm install wl-live2d

# yarn
yarn add wl-live2d
```

### 更新

如需更新 wl-live2d 你只需要在安装命令后缀加上@latest即可更新至当前最新发行版

npm

```bash
# npm
npm install wl-live2d@latest

# yarn
yarn add wl-live2d@latest
```

### CDN 方式导入

通过 CDN 方式导入时，可以通过调用 `wlLive2d()` 方法加载 Live2D 模型, 该方法接收一个 options 配置选项对象，示例如下:

```html
<!doctype html>
<html lang="en">
<head>
  <title>wlLive2D</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/wl-live2d/dist/es/index.js"></script>
  <script>
    wlLive2d({
      models: [
        {
          path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json',
          scale: 0.12,
          position: [-50, 50],
          stageStyle: {
            width: 320
          }
        },
        {
          path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/galgame%20live2d/Fox%20Hime%20Zero/mori_miko/mori_miko.model3.json',
          position: [50, 100],
          stageStyle: {
            width: 300,
            height: 450
          }
        }
      ]
    });
  </script>
</body>
</html>
```

### ESM 导入

wl-Live2D 在使用 ES6 方式导入时暴露了一个 `WlLive2d` 方法, 该方法接收一个配置选项 options

```js
import { WlLive2d } from 'wl-live2d';

WlLive2d({
  models: [
    {
      path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json',
      scale: 0.12,
      position: [-50, 50],
      stageStyle: {
        width: 320
      }
    },
    {
      path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/galgame%20live2d/Fox%20Hime%20Zero/mori_miko/mori_miko.model3.json',
      position: [50, 100],
      stageStyle: {
        width: 300,
        height: 450
      }
    }
  ]
});
```

## 免责声明

本仓库所有模型文件均来源于网络, 仅供参考和学习
