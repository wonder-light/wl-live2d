# ULive2dController

Live2d 控制器, 用于整合 stage, model 等其他控制器, 并负责插件的安装与卸载等等

## 属性

### app

> 类型- `TApplication`
>
> 属性 - `get`

`PIXI.Application` 的实例

### data

> 类型- `DLive2dOptions`
>
> 属性 - `get`

详情请见: [`DLive2dOptions`](../options/)

### event

> 类型- `EventEmitter`
>
> 属性 - `get`

EventEmitter3 实例, 负责事件

### plugins

> 类型- `FBasePlugin[]`
>
> 属性 - `get`

获取记录的所有插件实例的数组

详情请见: [`FBasePlugin`](../plugin/)

### stage

> 类型- `UStageController`
>
> 属性 - `get`

获取 stage 控制器实例

详情请见: [`UStageController`](./stage)

### model

> 类型- `UModelController`
>
> 属性 - `get`

获取 model 控制器实例

详情请见: [`UModelController`](./model)

### tips

> 类型- `UModelController`
>
> 属性 - `get`

获取 tips 控制器实例

详情请见: [`UModelController`](./tips)

### ref

> 类型- `Record<any, any>`
>
> 属性 - `get`

以键值对进行记录的对象引用

## 方法

### installPlugin

> 类型- `(...plugins: TInstanceType<FBasePlugin>[]): void`

如果 `plugin` 不是 `FBasePlugin` 的子类则不会进行安装, 并且根据插件的优先级进行安装

参数:

|   参数名   |               类型               |        	  描述        |
|:-------:|:------------------------------:|:-------------------:|
| plugins | `TInstanceType<FBasePlugin>[]` | `FBasePlugin` 的子类实例 |

### uninstallPlugin

> 类型- `(...plugins: TInstanceType<FBasePlugin>[]): void`

从插件集中卸载指定的插件

参数:

|   参数名   |               类型               |        	  描述        |
|:-------:|:------------------------------:|:-------------------:|
| plugins | `TInstanceType<FBasePlugin>[]` | `FBasePlugin` 的子类实例 |

### destroy

> 类型- `(): void`

卸载插件, 销毁控制器, 销毁 app 实例

## 事件

### onModelStart

> 类型- `(func: TFunc, context?: any, once: boolean = false): void`

模型开始加载前的事件

参数:

|   参数名   |      类型      |  	  描述  |
|:-------:|:------------:|:-------:|
|  func   | `() => void` |  回调函数   |
| context |    `any`     | this 指向 |
|  once   |  `boolean`   | 是否只用一次  |

事件:

`EEvent#modelStart`

### onModelLoaded

> 类型- `(func: TFunc<TLive2DModel>, context?: any, once: boolean = false): void`

模型加载完成时的事件

onModelLoaded 参数:

|   参数名   |          类型           |  	  描述  |
|:-------:|:---------------------:|:-------:|
|  func   | `TFunc<TLive2DModel>` |  回调函数   |
| context |         `any`         | this 指向 |
|  once   |       `boolean`       | 是否只用一次  |

func 参数:

|  参数名  |       类型       |      	  描述       |
|:-----:|:--------------:|:----------------:|
| model | `TLive2DModel` | 加载成功后的 Live2d 模型 |

事件:

`EEvent#modelLoaded`

### onModelError

> 类型- `(func: TFunc<Error>, context?: any, once: boolean = false): void`

模型加载失败事件

onModelError 参数:

|   参数名   |       类型       |  	  描述  |
|:-------:|:--------------:|:-------:|
|  func   | `TFunc<Error>` |  回调函数   |
| context |     `any`      | this 指向 |
|  once   |   `boolean`    | 是否只用一次  |

func 参数:

|  参数名  |   类型    | 	  描述  |
|:-----:|:-------:|:------:|
| error | `Error` | 失败时的错误 |

事件:

`EEvent#modelError`

### onFadeStart

> 类型- `(func: TFunc<HTMLElement>, context?: any, once: boolean = false): void`

淡入淡出开始时的事件

onFadeStart 参数:

|   参数名   |          类型          |  	  描述  |
|:-------:|:--------------------:|:-------:|
|  func   | `TFunc<HTMLElement>` |  回调函数   |
| context |        `any`         | this 指向 |
|  once   |      `boolean`       | 是否只用一次  |

func 参数:

| 参数名 |      类型       |  	  描述  |
|:---:|:-------------:|:-------:|
| el  | `HTMLElement` | 淡入开始的元素 |

事件:

`EEvent#fadeStart`

### onFadeEnd

> 类型- `(func: TFunc<HTMLElement>, context?: any, once: boolean = false): void`

淡入淡出结束时的事件

onFadeEnd 参数:

|   参数名   |          类型          |  	  描述  |
|:-------:|:--------------------:|:-------:|
|  func   | `TFunc<HTMLElement>` |  回调函数   |
| context |        `any`         | this 指向 |
|  once   |      `boolean`       | 是否只用一次  |

func 参数:

| 参数名 |      类型       |  	  描述  |
|:---:|:-------------:|:-------:|
| el  | `HTMLElement` | 淡入结束的元素 |

事件:

`EEvent#fadeEnd`

### onFadeCancel

> 类型- `(func: TFunc<HTMLElement>, context?: any, once: boolean = false): void`

淡入淡出取消时的事件

onFadeCancel 参数:

|   参数名   |          类型          |  	  描述  |
|:-------:|:--------------------:|:-------:|
|  func   | `TFunc<HTMLElement>` |  回调函数   |
| context |        `any`         | this 指向 |
|  once   |      `boolean`       | 是否只用一次  |

func 参数:

| 参数名 |      类型       |  	  描述  |
|:---:|:-------------:|:-------:|
| el  | `HTMLElement` | 淡入失败的元素 |

事件:

`EEvent#fadeCancel`

### onMotionStart

> 类型- `(func: TAnyFunc, context?: any, once: boolean = false): void`

模型 motion 开始时的事件

onMotionStart 参数:

|   参数名   |     类型     |  	  描述  |
|:-------:|:----------:|:-------:|
|  func   | `TAnyFunc` |  回调函数   |
| context |   `any`    | this 指向 |
|  once   | `boolean`  | 是否只用一次  |

func 参数:

|  参数名  |             类型             | 	  描述 |
|:-----:|:--------------------------:|:-----:|
| group |          `string`          |  分组   |
| index |          `number`          |  索引   |
| audio | `HTMLAudioElement \| null` |  音频   |

事件:

`EEvent#motionStart`

### onMotionFinish

> 类型- `(func: TFunc, context?: any, once: boolean = false): void`

模型 motion 完成时的事件

参数:

|   参数名   |      类型      |  	  描述  |
|:-------:|:------------:|:-------:|
|  func   | `() => void` |  回调函数   |
| context |    `any`     | this 指向 |
|  once   |  `boolean`   | 是否只用一次  |

事件:

`EEvent#motionFinish`
