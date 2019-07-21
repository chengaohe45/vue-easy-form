# 组件化/es/函数写法

## 组件化标准写法
组件化是指某个属性根据实际要求，按一定的格式引入Vue组件；目前支持组件化的属性有：项标签label、描述desc、帮助help、单元unit、标题title、项组件component，当然，这些属性都有自己其它的写法，具体的写法见各属性详解。<br/>
`引入一个组件(从一个Object开始)`：
```js
属性名: {     // 表单配置属性名如：label, help
  name: "el-input",  // 这个是不支持es/函数写法，也就是一经固定，不支持改变
  style: {  // 一个对象；这个是不支持es/函数写法
    color: "#000"
  },
  class: "box1 box2", // 类，多个以空格隔开；这个是不支持es/函数写法
  // Vue组件需要的属性；props的key支持es/函数写法(注意：是props的key,不是props的key的key)
  props: {
    type: "textarea",   // 值固定写法
    placeholder: "es: {{$root}}.isOpen ? '提示1' : '提示2'", // 支持es写法, 具体见下面
    // options => {global, rootData, idxChain, index, pathKey, $hidden}
    disabled: function(options) {  // 支持函数写法, options所携带的信息具体见下面
      return options.rootData.isOpen;
    }
  },
  text: "文本描述"    // 有些组件不支持这个；就是default-slot；支持es/函数写法
}
```
::: warning
`没有this指针` 当props里的的属性（如：disabled）写成一个函数时，this并不指向表单的。
为什么? 因为当执行这些函数时，表单内的组件正处于未构造或正在重复构造，不建议调用表单内的函数(如：form.getValue等)；这个与验证rules.checks、数组array.insertValue、项组件component.actions里面的函数不同，后者们的this是指向表单的
:::

## es写法
es语法就一条es:为前缀的字符串，再按照一定的规则解析出来的js语句。实例见[es写法实例](https://chengaohe45.github.io/vue-easy-form-docs/demo/#/es-function)
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
支持es有4个数据源，这4个值共同影响整个es的解析：
- `rootData`： 整个表单的`根值/rootData`. root在es语法中的写法是<span v-pre>`{{$root}}`</span>
- `global`： 从表单中传入，用于外部对表单影响, 不设置则默认为`空对象`; global在es语法中的写法是<span v-pre>`{{$global}}`</span>
- `index`：数组中孩子节点(非孙子节点))项所在的索引，其它节点(非孩子)节点此值是-1. index在es语法中的写法是<span v-pre>`{{$index}}`</span>
- `hidden`： 用于判断某一项是否隐藏的`函数`. hidden在es语法中的写法是<span v-pre>`{{$hidden(base.target)}}`</span>; 括号中是路径

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


