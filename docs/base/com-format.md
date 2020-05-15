# 组件格式
从一个Object开始，按一定的格式配置引入相应的Vue组件；目前支持组件化的属性有：[项标签label](./label.md)、[描述desc](./desc.md)、[帮助help](./help.md)、[单元unit](./unit.md)、[标题title](./title.md)、[项组件component](./component.md)，当然，这些属性都有自己特殊的写法，具体的写法见`可组件化属性详解`。
## 配置格式
``` js
// attrName为某个属性的索引，如: label, title, component
`attrName`: {         // 若是一个对象，可写成一个Object
  name: "el-button", // 组件名，组件名不支持动态解析
  style: { color: "#000" }, // 内联样式，一个对象；支持动态解析
  class: "box1 box2", // 样式类；支持动态解析
  props: { // 属性: 以下全都支持动态解析
    disabled: "es: $root.status ? true : false",  // 动态解析：es语法
    type: function(options) {  // 动态解析：函数写法
      return options.rootData.status ? "primary" : "success";
    },
    size: "mini", // 固定值
  },
  text: "新建",   // 组件的文本，如<el-button>新建</el-button>；支持动态解析
  value: "",    // 组件的值，这个不支持动态解析。因为其会与v-model实行双向绑定

  actions: {    // 组件的行为，多个时可写数组
    trigger: "click",
    handler: function() {}
  },
  
  directives: {   // 指令；directives可简写为v；单值时也可直接写上指令名；多个值时也可写成数组
    name: "loading",  // 指令名
    value: 2,       // 指令的绑定值；支持动态解析；注：只有指令绑定值value支持动态解析
    expression: "1 + 1",  // 指令表达式
    arg: "foo",       // 传给指令的参数
    modifiers: {      // 一个包含修饰符的对象
      bar: true
    }
  }
}
```
- `name`: 组件名；`类型`：字符串/组件对象；`必填`
- `style`: 内联样式；`类型`：对象；`非必填`
- `class`: 样式类；`类型`：字符串/对象/数组；要符合[Vue Class](https://cn.vuejs.org/v2/guide/class-and-style.html)写法；`非必填`
- `props`: 组件属性；`类型`：对象；`非必填`
- `text`: 组件文本；`类型`：字符串、数值<badge text="1.6.0" />、布尔<badge text="1.6.0" />；`非必填`
- `value`: [组件的值](#value配置)（与v-model实行双向绑定）；`类型`：任何；`非必填`
- `actions`: [组件事件](#组件事件)；`类型`：对象/数组；`非必填`
- `directives`: 指令；`类型`：字符串/对象/数组；`非必填`；索引`directives`可简写为`v`

> 动态解析是指支持[es写法](./parse.md#es写法)或[函数写法](./parse.md#函数写法) 

::: warning 注意
`没有this指针` 当props里的的属性（如：disabled）写成一个函数时，this并不指向表单的。
为什么? 因为当执行这些函数时，表单内的组件正处于未构造或正在重复构造，不建议调用表单内的函数(如：form.getValue等)；这个与验证[rules.checks](rules.md)、数组[array.insertValue](array.md#数组默认插入值)、项组件[component.actions](component.md#组件事件)里面的函数不同，后者们的this是指向表单的
:::

## Value配置
平时写value时一般有两种写法，不同的写法代表的意义是不同的。
1. 写在`v-model`进行双向绑定，也是表单组件常见的写法
  ``` html
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <script>
    export default {
      data() {
        return {
          input: ""
        }
      }
    }
    </script>
  ``` 
  等价于`json配置型`写法，如下：
  ``` js
  `attrName`: { 
    name: "el-input",
    props: {
      placeholder: "请输入内容"
    },
    value: "" // 与name同级，说明是绑定v-model(与组件内的value进行双向绑定)，所以不支持动态解析
  }
  ```

2. 直接配置value属值
  ``` html
    <el-input :value="input" placeholder="请输入内容"></el-input>
    <script>
    export default {
      data() {
        return {
          input: ""
        }
      }
    }
    </script>
  ``` 
  等价于`json配置`型写法，如下：
  ``` js
  `attrName`: { 
    name: "el-input",
    props: {
      placeholder: "请输入内容",
      value: ""   // 当成一个普通属性，不会与组件内的value进行双向绑写，所以动态解析
    }
  }
  ```

## 组件事件
字段：actions
```js
标准写法
actions: {
  // 默认为click, 多个事件写法: ["change", "input"]或"change input"
  trigger: "change",
  // options => {value, event, pathKey, index, idxChain,target}
  handler: function(options){...}
}

简写 （直接写成一个函数），trigger默认为click
actions: function(options){...}

多个事件
actions: [标准写法或简写组成的数组]
```
函数handler返回的参数options包含的信息有：
- `value`： 当前项组件的值，表单的值可以通过this取出
- `args`<Badge text="1.6.2"/>： 事件本身所携带的信息(就是函数的局部变量`arguments`)；如`keyup.native`,可以从这里提取键值；
- `event`： 事件本身所携带的第一个信息, 也就是`args[0]`
- `target`： 当前项组件(若是`数组事件`，这个为`null`)
- `pathKey`： 需要检查的组件的路径
- `idxChain`： 需要检查的组件所要数组所组成的id 如: 1,2
- `index`：组件处于数组的子节点(非孙子)时的索引，其余的返回-1
> handler函数的this指针指向表单，这样可以方便取出其它组件(如`this.getRef("xxxx")`)，从而做联动等功能

### 当props里面的某属性是的类型是函数怎么办？

例子：`showText`是函数类型；若要表达其值是一个函数，则在其名称前加上`s:`前缀，系统将不会对此函数进行动态解析
``` js {3}
`attrName`: {
  name: "自定义组件",
  props: {  // 注意：`s:`是对props里面的属性进行有效补充，对其它的属性（如`text`）是没有作用的
    "s:showText": function(names) { // 注意空格，因为空格也可以当作key,所以不要留空格
      return names.join(",");
    },
    color: "#fff000"
  },
  text: "hello"
}
```
::: tip 为什么这样写？
因为在应用过程中，`表单组件`一般都不会用一个函数作为一个属性类型（虽理论上是可以的，但至今笔者都极少极少碰到此类型的`表单组件`），所以为了保持简洁且和其它属性保持一致的写法，当前面不加`s:`前缀，则认为是可动态解析的属性。
:::