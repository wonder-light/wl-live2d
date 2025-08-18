# FBasePlugin 插件

`live2d` 基础插件, 所有插件都需要从此类继承

## 属性

### name

> 类型- `string`
>
> 属性 - `readonly`

插件名称必须是唯一的, 如果有重复的名称, 则后面的插件将不会安装

子插件需要覆盖 `name` 字段

### priority

> 类型- `number`
>
> 属性 - `readonly`
>
> 默认值 - `0`

插件优先级, 在安装插件是会按照优先级依次执行

子插件需要覆盖 `priority` 字段

### live2d

> 类型- `ULive2dController`
>
> 属性 - `get`

插件 live2d 上下文, 用于获取对应的数据

详情请见: [`ULive2dController`](../control/)

## 方法

### install

> 类型- `(): void`

在安装插件时需要调用的函数, 一般用于初始化以及事件绑定等等

### uninstall

> 类型- `(): void`

在卸载插件时需要调用的函数, 一般用于销毁数据以及事件解绑等等

## 关系

子类继承关系如下:

- `FBasePlugin` 基类
  - `FHomePlugin` 首页
  - `FCapturePlugin` 捕获截图
  - `FInfoPlugin` 文档信息
  - `FHitFramesPlugin` 命中区域帧检测
  - `FQuitPlugin` 关闭和打开看板娘
  - `FBaseSwitchPlugin` 用于切换的基础切换插件
    - `FSwitchModulePlugin` 模型切换
    - `FSwitchTexturePlugin` 模型切换
  - `FDragPlugin` wrapper 拖拽
    - `FTipsDragPlugin` tips 拖拽
  - `FMotionMessagePlugin` motion 消息
  - `FTalkMessagePlugin` 随机一言消息
  - `FNullMessagePlugin` null 消息
    - `FHourMessagePlugin` 小时消息
    - `FSeasonsMessagePlugin` 季节消息
    - `FEventMessagePlugin` 事件消息
      - `FConsoleMessagePlugin` 控制台打开事件
      - `FCopyMessagePlugin` 拷贝事件
      - `FVisibilityMessagePlugin` wrapper 可见性事件
