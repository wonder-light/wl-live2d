# wlLive2d

![](https://forthebadge.com/images/badges/built-with-love.svg)
![](https://forthebadge.com/images/badges/uses-html.svg)
![](https://forthebadge.com/images/badges/contains-cat-gifs.svg)
![](https://forthebadge.com/images/badges/powered-by-electricity.svg)

wlLive2d 是一个运行在浏览器环境的 Live2D 看板组件，支持从 model2 与 model4 版本的 Live2D 模型，开箱即用且可定制化。  
如果你想为你的个人网站增加一个看板娘，那么请看看这个！🥳

[查阅文档](https://wonder-light.github.io/wl-live2d/) 以了解更多详细的使用教程 🎉

<br/>

## ✨ 特点

支持 `CDN` 或 `ES6 Module` 导入， 默认集成 `Cubism 2 SDK` 和 `Cubism 4 SDK`

按需引入或全量导入 `Cubism SDK` 依赖

支持配置多个模型，使用控件对其切换， 支持自定义扩展控件，支持无刷新加载

<br/>

## 🌈 使用

### CDN 引入

通过 CDN 方式导入的示例如下。

相关配置选项的详细内容请查看: `配置选项`

在 `<body>` 标签中加入以下内容:

::: code-group

```html [ES格式1]
<!DOCTYPE html>
<html lang="en">
<body>
  <script src="https://fastly.jsdelivr.net/npm/wl-live2d/dist/es/index.js" type="module"></script>
  <script type="module">
    wlLive2d({
      models: [
        {
          path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json',
          scale: 0.6,
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

```html [ES格式2]
<!DOCTYPE html>
<html lang="en">
<body>
  <script type="module">
    import wlLive2d from 'https://fastly.jsdelivr.net/npm/wl-live2d/dist/es/index.js';
    
    wlLive2d({
      models: []
    });
  </script>
</body>
</html>
```

```html [umd格式]
<!DOCTYPE html>
<html lang="en">
<body>
  <script src="https://fastly.jsdelivr.net/npm/wl-live2d/dist/umd/index.js"></script>
  <script>
    wlLive2d({
      models: []
    });
  </script>
</body>
</html>
```

```html [其它]
<!DOCTYPE html>
<html lang="en">
<body>
  <script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js"></script>
  <canvas id=canvas></canvas>
  <script>
    const cubism2Model = "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json";
    const cubism4Model = "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json";
    
    (async function main() {
      const app = new PIXI.Application({
        view: document.getElementById("canvas"),
        autoStart: true,
        resizeTo: window
      });
      
      const model2 = await PIXI.live2d.Live2DModel.from(cubism2Model);
      const model4 = await PIXI.live2d.Live2DModel.from(cubism4Model);
      
      app.stage.addChild(model2);
      app.stage.addChild(model4);
      
      model2.scale.set(0.3);
      model4.scale.set(0.25);
      
      model4.x = 300;
    })();
  </script>
</body>
</html>
```

:::

如果网站启用了 PJAX，由于看板娘不必每页刷新，需要注意将该脚本放到 PJAX 刷新区域之外

### 包管理工具安装

::: code-group

```shell [npm]
npm install wl-live2d
```

```shell [yarn]
yarn add wl-live2d
```

:::

### 使用示例

```ts
import { WlLive2d } from 'wl-live2d';

WlLive2d({
  models: [
    {
      path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json',
      scale: 0.6,
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

相关配置选项的详细内容请查看: `配置选项`

<br/>

## 💕 鸣谢

本项目主要依赖于 [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display), 感谢其为 `Live2D` 社区做出的贡献

感谢 [一言](https://hitokoto.cn/) 提供的语句接口

<br/>

## 版权声明

本项目仅提供模型加载技术支持, 不提供任何 Live2D Model 的下载地址。文档中提供的所有模型地址均来源于网路，仅供参考和学习

<br/>

Live2D 官方网站:

[https://www.live2d.com/en/](https://www.live2d.com/en/)

[https://live2d.github.io](https://live2d.github.io)

emoji:

[emoji 中文网](https://www.emojiall.com/zh-hans)
