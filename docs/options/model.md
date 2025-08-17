# 模型选项

模型选项接收一个有模型选项对象组成的数组, 您可以通过这个选项来配置模型地址来源以及缩放比例等

## 用法

<!--@include: ../parts/live2d.md{1,5}-->
// 在这里进行配置
<!--@include: ../parts/live2d.md{6,12}-->

## TModels

`TModels` 定义如下: 

```ts
/**
 * 模型数据项目可以为 DModel 或者 DModel[]
 * TModelItem 为对象时则为模型
 * TModelItem 为数组时指该模型有一系列皮肤
 */
declare type TModelItem = DModel | DModel[];

/**
 * 由模型数据项目构成的模型数据集
 */
declare type TModels = TModelItem[];
```
`DModel` 的属性如下所示

## path <Badge type="danger" text="必填" />

> 类型 - `string`

模型的 json 文件 url 地址

## volume

> 类型 - `number`
> 默认值 - `0.5`

模型音量, 用于控制播发音频时的音量大小

## scale

> 类型 - `number`
> 
> 默认值 - `1.0`

模型的缩放比例

## position

> 类型 - `{ x: number, y: number }`
> 
> 默认值 - `{ x: 0, y: 0 }`

模型在舞台中的位置. x: 横坐标, y: 纵坐标

## backgroundColor

> 类型 - `string`
> 
> 默认值 - `transparent`

舞台的背景颜色, 取有效的颜色值, rbg 或 rgba, 默认透明未设置默认为空的

## width

> 类型 - `number | null`
> 
> 默认值 - `null`

模型的宽度, 单位 px, 默认不设置, 将自适应使用模型本体的宽度

## height

> 类型 - `number | null`
> 
> 默认值 - `null`

模型的高度, 单位 px, 默认不设置, 将自适应使用模型本体的高度

## rotate <Badge type="warning" text="待加" />

> 类型 - `number`
> 
> 默认值 - `0`

模型的旋转角度, 单位:度 (0-360)

## motionPreload <Badge type="warning" text="待加" />

> 类型 - `"ALL" | "IDLE" | "NONE"`
> 
> 默认值 - `"NONE"`

动作预加载策略
