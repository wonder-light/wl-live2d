# 组件加载

当您需要加载模型时, 您可以在 `wl-live2d` 中导入 `wlLive2d` 方法,
当这个方法被调用时将根据您传入的配置选项来加载组件, 该方法返回一个实例对象,
您可以从 [`ULive2dController`](../refer/control/) 这个实例对象中调用其中所有方法

## 参数:

|   参数名   |                 类型                  | 	  描述 |
|:-------:|:-----------------------------------:|:-----:|
| options | [DLive2dOptions](../refer/options/) | 配置选项  |

## 返回值类型:

返回值是一个 [`ULive2dController`](../refer/control/) 实例对象, 该实例对象中包含了对组件模块操作的所有方法和事件

## 用法:

::: code-group

<<< ../../test/es/index.html{html} [ES导入]

<<< ../../test/es/index2.html{html} [ES导入2]

<<< ../../test/umd/index.html{html} [umd导入]

<<< ../../test/zzz/index.html{html} [其它]

:::
