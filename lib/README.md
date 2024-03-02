## 命名约定

类型名的首字母需要大写, 并且中间没有下划线, 满足帕斯卡命名法. 例如: `int MyAge;`

变量, 函数, 参数等首字母需要小写, 并且中间没有下划线, 满足驼峰式命名法. 例如: `int myAge;`

类型名前面加上额外的大写字母前缀以区别于变量名。例如，FSkin是个类型名, skin则是FSkin的一个实例。

+ `interface` 的前缀是 `I`
+ `enum` 的前缀是 `E`
+ control 类的 `class` 的前缀是 `U`
+ data 类的 `class` 的前缀是 `D`
+ util 类的 `class` 的前缀是 `F`
+ `type、template` 的前缀是 `T`
+ 绝大多数其它的类，类型名前会有前缀F, 一些类型可能会使用其它字母, 其它类型以此类推

例如:

```ts
// data class
class DBaseTool {
  id: string = '';
  name: string = '';
}

// control class
class UTool {
  data: DBaseTool = new DBaseTool();

  bind() {
  }

  unbind() {
  }
}

// util class
class FBaseTool {
  static log() {
  }

  static printf() {
  }
}

// 接口类
interface IUtils {
}

// 枚举类
enum EEventName {
  click,
  hover,
}

// 类型
type TFunction = Function;

// 泛型
function getValue<T>(value: T): T {
  return value;
}

function test<TName>(value: TName): TName {
  return value;
}
```
