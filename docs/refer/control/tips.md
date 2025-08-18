# UTipsController

tips 控制器类, 用于控制 tips 相关的的控制器, 例如控制提示框淡入淡出, 以及消息的显示等等

## 属性

### data

> 类型- `DTips`
>
> 属性 - `get`

消息提示数据

详情请见: [`DTips`](../options/tip)

### messages

> 类型- `DMessage[]`
>
> 属性 - `get`

所有消息提示数据集合

详情请见: [`DMessage`](../options/message)

### text

> 类型- `string`
>
> 属性 - `get`

提示框显示时期的文本值

### stop

> 类型- `boolean`
>
> 属性 - `get`

指示当前是否已经停止 tips 的淡入淡出循环, 如果需要停止的话则需要调用 `stopFade` 函数

### duration

> 类型- `number`
>
> 属性 - `get | set`

提示框显示时的持续时间, 单位 ms

### interval

> 类型- `number`
>
> 属性 - `get | set`

提示框隐藏时的持续时间, 单位 ms

## 方法

### fadeIn

> 类型- `async (inherit: boolean = false): Promise<void>`

开始淡入提示框, 淡入完成后等待一段时间执行淡出

如果 `inherit = true`, 则继承原有的时间, 否则重新开始计时

如果消息集合为空, 则会一直循环等待消息的添加, 而循环时长为隐藏时长

参数:

|   参数名   |    类型     |  	  描述   |
|:-------:|:---------:|:--------:|
| inherit | `boolean` | 是否继承原有时间 |

### fadeOut

> 类型- `async (inherit: boolean = false): Promise<void>`

开始淡出提示框, 淡出完成后等待一段时间执行淡入

如果 `inherit = true`, 则继承原有的时间, 否则重新开始计时

参数:

|   参数名   |    类型     |  	  描述   |
|:-------:|:---------:|:--------:|
| inherit | `boolean` | 是否继承原有时间 |

### startFade

> 类型- `(): void`

开始进行淡入, 并将 `stop = false`, 之后恢复淡入淡出循环

### stopFade

> 类型- `(): void`

立即进行淡出, 并将 `stop = true`, 淡出完成后停止淡入淡出

### notify

> 类型- `async (text: string): Promise<void>`

立即淡入提示框显示对应的消息, 并且重置提示框显示时长, 完成后从消息集合中移除对应的消息

参数:

| 参数名  |    类型    |  	  描述  |
|:----:|:--------:|:-------:|
| text | `string` | 需要显示的文本 |

### addMessage

> 类型- `(...messages: DMessage[]): this`

将消息集添加到消息列表中

通常这并不会立即显示, 而是等待下一轮提示框显示时根据一定概率随机抽取消息进行显示

参数:

|   参数名    |      类型      | 	  描述 |
|:--------:|:------------:|:-----:|
| messages | `DMessage[]` | 消息对象集 |

详情请见: [`DMessage`](../options/message)

### removeMessage

> 类型- `(...messages: DMessage[]): this`

从消息列表中移除对应的消息

参数:

|   参数名    |      类型      | 	  描述 |
|:--------:|:------------:|:-----:|
| messages | `DMessage[]` | 消息对象集 |

### getRandomMessage

> 类型- `(): string`

从消息列表中按照一定概率随机获取消息

返回值:

`string` - 消息文本 

