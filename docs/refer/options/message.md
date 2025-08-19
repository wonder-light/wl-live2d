# 消息选项

消息数据集合, 用于存储消息数据, 包括但不限于 `DMessage`

## DMessage

`DMessage` 属性如下所示

### condition

> 类型 - `() => boolean`
>
> 默认值 - `() => true`

条件函数, 满足条件时显示消息, 不满足时不显示消息

消息从 `condition() == true` 中的集合中选取

### text

> 类型 - `string | string[]`
>
> 默认值 - ` `

在提示框中显示的消息文本, 可以是 `string` 也可以是 `string[]`

是数组的话将会从其中随机选取

### priority

> 类型 - `number`
>
> 默认值 - `2`

优先级, 高优先级消息将会覆盖低优先级的消息

### type

> 类型 - `string | null`
>
> 默认值 - `null`

消息的类型, 例如: `hour`, `date`, `event` 等等

也可以自定义类型用于自定义插件

## Hour

小时消息

来自 `FHourMessagePlugin` 插件, 当 `type = 'hour'` 时使用

### hour

> 类型 - `string | null`
>
> 默认值 - `null`

指定的小时时间段, 例: `2-4`, `4`, 如果为 `null` 则不显示消息

### once

> 类型 - `boolean`
>
> 默认值 - `true`

用于指示消息是否只显示一次

## Seasons

季节消息

来自 `FSeasonsMessagePlugin` 插件, 当 `type = 'seasons'` 时使用

### date

> 类型 - `string | null`
>
> 默认值 - `null`

指定的季节日期, 例: `01/01`, `02/14`, 如果为 `null` 则不显示消息

### once

> 类型 - `boolean`
>
> 默认值 - `true`

用于指示消息是否只显示一次

## Event

事件消息

来自 `FEventMessagePlugin` 插件, 当 `type = 'event'` 时使用

### event

> 类型 - `string | null`
>
> 默认值 - `null`

指定的事件类型, 目前只实现了 `copy`, `console`, `visibilitychange` 事件, 其余的没有了哦

