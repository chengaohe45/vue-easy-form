# es/函数写法
`es/函数写法`也就是平常所说的`动态解析`。它是监听各类`数据源`的变化，解析出对应的属性值。
## es写法
es语法: `es:`为前缀的字符串，[数据源](./explain.md#es语法)以大括号（如：<span v-pre>`{{$root}}`</span>）包括起来，再按照一定的规则解析出来的js语句。实例见[es写法实例](https://chengaohe45.github.io/vue-easy-form-docs/demo/#/es-function)
```js
name: {
  label: "姓名",
  component: {
    name: "el-input",
    props: {
      disabled: "es: {{$root}}.isOpen",   // 数据源用两个大括号包住
      placeholder: "开关打开我就不可写"
    }
  },
  value: ""
},
level: {
  label: "es级别",
  hidden: "es: {{$hidden('name')}}",  // $hidden是一个函数
  component: {
    name: "el-input",
    props: {
      placeholder: "name隐藏我就跟着隐藏"
    }
  },
  value: ""
}
```
支持es有4个`数据源`，这4个值共同影响整个es的解析：
- `rootData`： 整个表单的[根值/rootData](./explain.md#根值). root在es语法中的写法是<span v-pre>`{{$root}}`</span>
- `global`： 从表单中传入，用于外部对表单影响, 不设置则默认为`空对象`; global在es语法中的写法是<span v-pre>`{{$global}}`</span>
- `index`：数组中孩子节点(非孙子节点))项所在的索引，其它节点(非孩子)节点此值是-1. index在es语法中的写法是<span v-pre>`{{$index}}`</span>
- `hidden`： 用于判断某一项是否隐藏的`函数`. hidden在es语法中的写法是<span v-pre>`{{$hidden(base.target)}}`</span>; 括号中是路径；此函数也是表单方法[isHidden](./form.md#表单方法)

[数组es写法](./array.md#数组es写法)

## 函数写法
属性直接写成一个函数，再传入相应的参数(数据源)进行动态解析. 实例见[函数写法实例](https://chengaohe45.github.io/vue-easy-form-docs/demo/#/es-function)
```js
name: {
  label: "姓名",
  component: {
    name: "el-input",
    props: {
      disabled: function(options) { // 直接写成一个函数
        return options.rootData.isOpen;
      },
      placeholder: "开关打开我就不可写"
    }
  },
  value: ""
},
level: {
  label: "es级别",
  hidden: function(options) { // 直接写成一个函数
    var $hidden = options.$hidden;
    return $hidden("name");
  },
  component: {
    name: "el-input",
    props: {
      placeholder: "name隐藏我就跟着隐藏"
    }
  },
  value: ""
}
```
运用函数构造Vue属性，options所携带的信息：
- `global`：form属性的global
- `rootData`：表单的原始值（隐藏的项值也会取出）
- `pathKey`：项组件的路径
- `idxChain`： 项组件所要数组所组成的id 如: 1,2
- `index`：项组件处于数组的子节点(非孙子)时的索引，其余的返回-1
- `$hidden`：函数。判断某项是否处于隐藏，这个函数会自动匹配所处于哪个表单，所以参数只需要传入一个pathKey。如: $hidden("base.name")

> `es写法`完全可以用`函数写法`代替; 它们都有自身的优势：`es写法`比较简洁，特别是三目运算符中；而`函数写法`比较灵活，运用于比较复杂的逻辑。


