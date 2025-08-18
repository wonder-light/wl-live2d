# UStageController

stage 控制器类, 用于控制 stage 相关的的控制器, 例如控制元素淡入淡出等等

## 属性

### menuItems

> 类型- `TStageMenuItem[]`
>
> 属性 - `get`

菜单元素数组

::: code-group

```ts [类型定义]
/**
 * 由元素及其优先级构成的菜单元素项目
 * @summary 菜单元素项目
 */
export declare interface TStageMenuItem {
  /** 菜单元素 */
  element: HTMLElement;
  /** 元素优先级 */
  priority: number;
}
```

:::

### wrapper

> 类型- `HTMLElement`
>
> 属性 - `get`

包装器元素, `canvas`, `tips`, `menus` 等等的根元素

### canvas

> 类型- `HTMLCanvasElement`
>
> 属性 - `get`

live2d 模型使用的画布元素

### tips

> 类型- `HTMLDivElement`
>
> 属性 - `get`

消息提示框元素

### menus

> 类型- `HTMLElement`
>
> 属性 - `get`

菜单元素

### other

> 类型- `HTMLElement`
>
> 属性 - `get`

其它元素

### parent

> 类型- `HTMLElement`
>
> 属性 - `get`

`wrapper` 的父元素

## 方法

### fadeIn

> 类型- `async (element: HTMLElement | null = null): Promise<void>`

对指定元素应用者淡入动画, 如果 `element` 为 `null`, 则默认使用 `wrapper` 元素

参数:

|   参数名   |      类型       |        	  描述        |
|:-------:|:-------------:|:-------------------:|
| element | `HTMLElement` | 淡入元素, 默认为 `wrapper` |

### fadeOut

> 类型- `async (element: HTMLElement | null = null): Promise<void>`

对指定元素应用者淡出动画, 如果 `element` 为 `null`, 则默认使用 `wrapper` 元素

参数:

|   参数名   |      类型       |        	  描述        |
|:-------:|:-------------:|:-------------------:|
| element | `HTMLElement` | 淡出元素, 默认为 `wrapper` |

### addMenu

> 类型- `(element: HTMLElement, priority: number = 2): this`

将菜单元素及优先级作为一个对象添加到 `menuItems`, 菜单按照 `priority` 从从大到小排序

参数:

|   参数名    |      类型       | 	  描述 |
|:--------:|:-------------:|:-----:|
| element  | `HTMLElement` | 菜单元素  |
| priority |   `number`    |  优先级  |

### removeMenu

> 类型- `(element: HTMLElement): this`

在 `menuItems` 中移除指定的菜单元素

参数:

|   参数名   |      类型       |   	  描述   |
|:-------:|:-------------:|:---------:|
| element | `HTMLElement` | 需要移除的菜单元素 |

### isRight

> 类型- `(): boolean`

判断 wrapper 元素是在窗口的左边还是右边, `true` 是右边, `false` 是左边

返回值:

`boolean`
