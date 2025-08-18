# 提示框选项

配置提示框样式和消息内容

## minWidth

> 类型 - `number`
>
> 默认值 - `230`

提示框最小宽度, 单位 px

## minHeight

> 类型 - `number`
>
> 默认值 - `100`

提示框最小高度, 单位 px

## offsetX

> 类型 - `number`
>
> 默认值 - `0`

调整提示框位于舞台中的 x 轴方向偏移量

## offsetY

> 类型 - `number`
>
> 默认值 - `0`

调整提示框位于舞台中的 y 轴方向偏移量

## duration

> 类型 - `number`
>
> 默认值 - `3000`

提示框显示时的持续时间, 单位 ms

## interval

> 类型 - `number`
>
> 默认值 - `5000`

提示框隐藏时的持续时间, 单位 ms

## message

> 类型 - `DMessage[]`
>
> 默认值 - `[]`

播放的消息内容, 需要是一个字符串数组, 播放时会从中随机取出一条进行提示, 空数组则不播放, 默认为空数组

`DMessage` 详见 [`消息选项`](./message)

::: code-group

```js [示例]
[
  {
    "text": "好久不见，日子过得好快呢……"
  },
  {
    "text": "大坏蛋！你都多久没理人家了呀，嘤嘤嘤～"
  },
  {
    "type": "seasons",
    "date": "01/01",
    "text": "<span>元旦</span>了呢，新的一年又开始了，今年是{year}年～"
  },
  {
    "type": "hour",
    "hour": "6-7",
    "text": "早上好！一日之计在于晨，美好的一天就要开始了～"
  },
  {
    "type": "event",
    "event": "console",
    "text": "哈哈，你打开了控制台，是想要看看我的小秘密吗？"
  },
]
```

:::

## drag

> 类型 - `boolean`
>
> 默认值 - `true`

支持 `wrapper` 元素和 `tips` 元素的拖拽, 如果为 `false` 否则不启用拖拽

## talk

> 类型 - `boolean`
>
> 默认值 - `true`

启用随机说话

## talkInterval

> 类型 - `number`
>
> 默认值 - `30000`

随机说话的时间间隔, 单位 ms

## talkApis

> 类型 - `({ url: string, handle: (res: Response) => string })[]`
>
> 默认值 - `[]`

用于存储随机一言的 url 以及处理 talk 结果的对象

::: code-group

```ts [类型定义]
/** 用于将 response 响应处理为 message 文本 */
declare type TTalkHandle = (response: Response) => Promise<string>;

/** 用于存储 url 以及处理 talk 结果的对象 */
declare interface TTalkApi {
  /** url 地址 */
  url: string;
  /** handle 处理函数 */
  handle: TTalkHandle;
  /** init fetch 初始化数据 */
  init?: RequestInit;
}

// init 的使用 
// await fetch(url, init);
```

```ts [示例]
[
  {
    url: 'https://v1.hitokoto.cn/',
    handle: async (res) => (await res.json()).hitokoto
  },
  {
    url: 'https://v.api.aa1.cn/api/yiyan/index.php',
    handle: async (res) => (await res.text()).match(/<p>(.*)<\/p>/)[1]
  },
  {
    url: 'https://tenapi.cn/v2/yiyan',
    handle: async (res) => await res.text()
  }
]
```

:::

## motionMessage

> 类型 - `boolean`
>
> 默认值 - `true`

控制是否启用 motion 消息, true: 启用, false: 关闭
