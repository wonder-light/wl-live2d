# UModelController

model 控制器类, 用于控制模型相关的的控制器, 例如加载模型, 切换模型等等

## 属性

### data

> 类型- `TModels`
>
> 属性 - `get`

所有的模型数据, 用于存储对应的模型数据

详情请见: [`TModels`](../options/model)

### modelId

> 类型- `number`
>
> 属性 - `get`

当前模型在模型集 `data` 中的位置索引

### textureId

> 类型- `number`
>
> 属性 - `get`

当前模型贴图在模型集 `data[modelId]` 中的位置索引

### textureMaxIndex

> 类型- `number`
>
> 属性 - `get`

当前模型集 `data[modelId]` 的最大贴图索引

### model

> 类型- `TLive2DModel | null`
>
> 属性 - `get`

获取当前正在展示的 `live2d` 模型实例, 只有在模型加载完成后才不为 `null`

### modelData

> 类型- `TModelItem`
>
> 属性 - `get`

当前模型索引对应的模型数据项目, 即 `data[modelId]`

### currentMotion

> 类型- `string | null`
>
> 属性 - `get`

当前模型正在执行的 `motion`, 未执行时为 `null`

### backgroundColor

> 类型- `string`
>
> 属性 - `get`
>
> 默认值 - `transparent`

当前正在展示的模型数据中定义的背景颜色, 默认为 `transparent`

## 方法

### loadModel

> 类型- `async (modelId: number, textureId: number = 0): Promise<void>`

加载与 `modelId` 及 `textureId` 对应的模型, 直接切换, 没有过渡

参数:

|    参数名    |    类型    | 	  描述  |
|:---------:|:--------:|:------:|
|  modelId  | `number` |  模型索引  |
| textureId | `number` | 模型服装索引 |

### switchModel

> 类型- `async (modelId: number, textureId: number = 0): Promise<void>`

加载与 `modelId` 及 `textureId` 对应的模型, 使用 `fade` 进行过渡

参数:

|    参数名    |    类型    | 	  描述  |
|:---------:|:--------:|:------:|
|  modelId  | `number` |  模型索引  |
| textureId | `number` | 模型服装索引 |

### nextModel

> 类型- `async (): Promise<void>`

切换模型数据集中的下一个模型, 循环切换

### nextTexture

> 类型- `async (): Promise<void>`

开始切换模型的下一个服装, 循环切换

### resetModel

> 类型- `async (): Promise<void>`

重新加载当前模型

### showHitAreaFrames

> 类型- `(): void`

显示模型的可点击区域

### hiddenHitAreaFrames

> 类型- `(): void`

隐藏模型的可点击区域

## 事件

### onModelHit

> 类型- `(func: TFunc<string[]>, context?: any, once: boolean = false): void`

模型触发 hit 时的事件

参数:

|   参数名   |        类型         |  	  描述  |
|:-------:|:-----------------:|:-------:|
|  func   | `TFunc<string[]>` |  回调函数   |
| context |       `any`       | this 指向 |
|  once   |     `boolean`     | 是否只用一次  |

func 参数:

|   参数名    |     类型     | 	  描述 |
|:--------:|:----------:|:-----:|
| hitAreas | `string[]` | 点击的区域 |
