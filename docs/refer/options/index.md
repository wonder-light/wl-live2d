# 公共选项

## 用法:

```js
import { wlLive2d } from 'wl-live2d';

wlLive2d({
  // 在这里进行配置
});
```

## sayHello

> 类型 - `boolean`
>
> 默认值 - `true`

是否在初始化阶段打印项目信息

## transitionTime

> 类型 - `numbr`
>
> 默认值 - `500`

元素入场和离开的过渡动画时长,单位 ms

## models

> 类型 - `TModels`
> 
> 默认值 - `[]`

模型配置, 默认值是空数组, 请至少配置一个有效的模型配置

详见: [模型选项](./model)

## tips

> 类型- `DTips`
> 
> 默认值 - `[]`

自定义提示框样式和内容

详见: [提示框选项](./tip)

## menus

> 类型- `strng[]`
> 
> 默认值 - `['home', 'switchModule', 'switchTexture', 'capture', 'info', 'quit']`

默认你启用的菜单项

::: warning
或许有些简单了, 之后在改改吧
:::

## selector

> 类型 - `string`
> 
> 默认值 - ` `

父元素的选择器, 支持 css 选择器语法, 以及 xpath 语法. 默认父元素为 `document.body`

如果父元素有效, 则会将 Live2d 插入到父元素之下

## fixed

> 类型 - `boolean`
> 
> 默认值 - `true`

组件是否使用固定定位, 关闭这个属性后舞台的定位属性将从 `fixed` 改为 `relative`

## plugins

> 类型 - `FBasePlugin[]`
> 
> 默认值 - `[]`

需要使用的插件集, 可以添加自定义插件用于实现自定义的功能

## drag

> 类型 - `boolean`
> 
> 默认值 - `true`

如果是 `true`, 则启用 `wrapper` 元素的拖拽, 否则不启用拖拽

## homePath

> 类型 - `boolean`
> 
> 默认值 - `true`

FHomePlugin 所使用的 URL 地址, 点击后将会跳转到该地址

如果已 `http://` 开头, 则会跳转对应地址, 否则将会追加至 `window.location.origin` 后跳转到对应地址

## hitFrame

> 类型 - `boolean`
> 
> 默认值 - `false`

启用命中区域帧检测

## dockedRight

> 类型 - `boolean`
> 
> 默认值 - `false`

组件停靠位置, 当您希望组件靠右展示时这个属性会非常有用
